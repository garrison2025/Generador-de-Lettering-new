import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const SITE = 'https://generadordelettering.org';

export function parseCsv(input) {
  const text = input.replace(/^\uFEFF/, '');
  const firstLine = text.split(/\r?\n/, 1)[0] || '';
  const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (!quoted && ch === delimiter) {
      row.push(cell);
      cell = '';
    } else if (!quoted && (ch === '\n' || ch === '\r')) {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== '')) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  if (quoted) throw new Error('CSV contains an unterminated quoted field.');
  row.push(cell);
  if (row.some((value) => value.trim() !== '')) rows.push(row);
  return rows;
}

function canonicalHeader(header) {
  const normalized = header.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s_-]/g, '');
  const aliases = {
    query: ['query', 'queries', 'consulta', 'consultas', '查询'],
    page: ['page', 'pages', 'pagina', 'paginas', '网页', '页面'],
    clicks: ['clicks', 'clics', '点击次数', '点击量'],
    impressions: ['impressions', 'impresiones', '展示次数', '展示量'],
    position: ['position', 'posicion', 'averageposition', 'posicionmedia', '平均排名', '排名'],
  };
  return Object.entries(aliases).find(([, values]) => values.includes(normalized))?.[0] || null;
}

function parseMetric(input, label, line) {
  let str = String(input || '').trim().replace(/\s/g, '');
  if (/^\d{1,3}(,\d{3})+$/.test(str)) str = str.replace(/,/g, '');
  else if (/^\d{1,3}(\.\d{3})+,\d+$/.test(str)) str = str.replace(/\./g, '').replace(',', '.');
  else if (str.includes(',') && !str.includes('.')) str = str.replace(',', '.');
  const number = Number(str);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error('Invalid ' + label + ' on CSV line ' + line + ': ' + input);
  }
  return number;
}

function canonicalPath(raw, line) {
  let url;
  try {
    url = new URL(raw.trim(), SITE);
  } catch {
    throw new Error('Invalid page URL on CSV line ' + line + ': ' + raw);
  }
  if (url.origin !== SITE) {
    throw new Error('CSV includes a page outside ' + SITE + ' on line ' + line);
  }
  return url.pathname.replace(/\/+$/, '') || '/';
}

export function readRows(csv) {
  const grid = parseCsv(csv);
  if (grid.length < 2) throw new Error('No GSC Query x Page data rows found.');
  const columns = grid[0].map(canonicalHeader);
  const required = ['query', 'page', 'clicks', 'impressions', 'position'];
  for (const name of required) {
    if (!columns.includes(name)) {
      throw new Error('Missing "' + name + '" column. Export GSC search analytics using both query AND page dimensions.');
    }
  }

  return grid.slice(1).map((line, index) => {
    const data = Object.fromEntries(columns.map((key, column) => [key, line[column] || '']).filter(([key]) => key));
    const rowLine = index + 2;
    const query = String(data.query).trim().toLowerCase().replace(/\s+/g, ' ');
    if (!query) throw new Error('Blank search query on CSV line ' + rowLine);
    const clicks = parseMetric(data.clicks, 'clicks', rowLine);
    const impressions = parseMetric(data.impressions, 'impressions', rowLine);
    const position = parseMetric(data.position, 'position', rowLine);
    if (position <= 0) throw new Error('Position must be positive on CSV line ' + rowLine);
    if (clicks > impressions) throw new Error('Clicks cannot exceed impressions on CSV line ' + rowLine);
    return {
      query,
      page: canonicalPath(data.page, rowLine),
      clicks,
      impressions,
      position,
    };
  }).filter((row) => row.impressions > 0);
}

function round(n, places = 2) {
  return Number(n.toFixed(places));
}

export function analyzeRows(rows, baseline = {}) {
  const protectedPaths = new Set((baseline.winner_pages || []).map((p) => p.path));
  const observingPaths = new Set((baseline.active_experiments || []).map((p) => p.path));
  const groups = new Map();

  for (const row of rows) {
    const key = JSON.stringify([row.query, row.page]);
    let group = groups.get(key);
    if (!group) {
      group = { query: row.query, page: row.page, clicks: 0, impressions: 0, weightedPosition: 0 };
      groups.set(key, group);
    }
    group.clicks += row.clicks;
    group.impressions += row.impressions;
    group.weightedPosition += row.position * row.impressions;
  }

  const items = [...groups.values()].map((g) => ({
    query: g.query,
    page: g.page,
    clicks: round(g.clicks),
    impressions: round(g.impressions),
    ctr_percent: round(g.clicks / g.impressions * 100),
    position: round(g.weightedPosition / g.impressions),
    policy: protectedPaths.has(g.page) ? 'protect' : observingPaths.has(g.page) ? 'observe' : 'review',
  }));

  const nearTop10 = items.filter((r) => r.impressions >= 50 && r.position > 10 && r.position <= 30)
    .map((r) => ({
      ...r,
      priority_score: Math.round(r.impressions * Math.max(0.2, (31 - r.position) / 20)),
      bucket: r.position <= 20 ? '11-20' : '21-30',
    }))
    .sort((a, b) => b.priority_score - a.priority_score || b.impressions - a.impressions);

  const top10LowCtrReview = items.filter((r) =>
    r.impressions >= 100 && r.position >= 1 && r.position <= 10 && r.ctr_percent < 2
  ).sort((a, b) => b.impressions - a.impressions);

  const byQuery = new Map();
  for (const r of items) {
    const siblings = byQuery.get(r.query) || [];
    siblings.push(r);
    byQuery.set(r.query, siblings);
  }
  const potentialOverlap = [];
  for (const [query, siblings] of byQuery) {
    const total = siblings.reduce((sum, r) => sum + r.impressions, 0);
    const meaningful = siblings.filter((r) => r.impressions >= 30 && r.impressions / total >= 0.2);
    if (total < 100 || meaningful.length < 2) continue;
    potentialOverlap.push({
      query,
      total_impressions_in_export: round(total),
      pages: meaningful.map((r) => ({
        page: r.page, impressions: r.impressions,
        share_percent: round(r.impressions / total * 100),
        position: r.position, policy: r.policy,
      })).sort((a, b) => b.impressions - a.impressions),
    });
  }
  potentialOverlap.sort((a, b) => b.total_impressions_in_export - a.total_impressions_in_export);

  return {
    source: 'GSC Query x Page CSV supplied by the site owner; no fabricated SERP metrics',
    thresholds: { near_top10: 'position >10 and <=30, impressions >=50', low_ctr: 'position <=10, impressions >=100, CTR <2%', overlap: '>=2 URLs each >=20% of query impressions' },
    input: { rows: rows.length, query_page_groups: items.length },
    near_top10: nearTop10,
    top10_low_ctr_review: top10LowCtrReview,
    potential_overlap: potentialOverlap,
    caveats: [
      'Average position is an aggregate, not a fixed Google rank. Check device, country, and the comparison date before changing a page.',
      'Priority score orders research candidates; it is NOT predicted clicks, traffic uplift, KD, or keyword volume.',
      'Multiple URLs for a query are only a potential intent-overlap signal, not proof of cannibalization.',
      'Protected winners and active CTR experiments must not have titles/H1/canonicals changed without newer evidence.',
      'Do not combine overlapping GSC exports or filtered and unfiltered rows; that would double-count metrics.',
    ],
  };
}

export function runCli(argv = process.argv.slice(2)) {
  const [inputPath, flag, outputPath] = argv;
  if (!inputPath || (flag && flag !== '--output') || (flag === '--output' && !outputPath)) {
    throw new Error('Usage: npm run gsc:opportunities -- <query-page.csv> [--output report.json]');
  }
  const data = readRows(fs.readFileSync(inputPath, 'utf8'));
  const baseline = JSON.parse(fs.readFileSync('seo/gsc-baseline-2026-10-07.json', 'utf8'));
  const report = analyzeRows(data, baseline);
  if (outputPath) fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n');

  console.log('GSC Query × Page research report (not a ranking forecast)');
  console.log('Valid rows: ' + report.input.rows + ' | URL/query pairs: ' + report.input.query_page_groups);
  for (const [label, entries] of [
    ['Near Top 10 / Top 30', report.near_top10],
    ['Top 10 with CTR under 2% — manual review', report.top10_low_ctr_review],
  ]) {
    console.log('\n' + label);
    for (const r of entries.slice(0, 20)) {
      console.log('  ' + r.query + ' | ' + r.page + ' | pos ' + r.position +
        ' | imp ' + r.impressions + ' | CTR ' + r.ctr_percent + '% | ' + r.policy);
    }
  }
  console.log('\nPotential Query × Page overlaps (not proven cannibalization): ' + report.potential_overlap.length);
  for (const match of report.potential_overlap.slice(0, 10)) {
    console.log('  ' + match.query + ': ' + match.pages.map((p) => p.page + ' (' + p.share_percent + '%)').join(' vs '));
  }
  console.log('\nReview policy and caveats in the report JSON before making SEO changes.');
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    runCli();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
