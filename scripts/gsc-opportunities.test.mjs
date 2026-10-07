import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, readRows, analyzeRows } from './gsc-opportunities.mjs';

const baseline = {
  winner_pages: [{ path: '/herramientas/letras-free-fire' }],
  active_experiments: [{ path: '/herramientas/conversor-texto' }],
};

test('CSV reader supports quoted commas, quoted newlines and a BOM', () => {
  const rows = parseCsv('\uFEFFQuery,Page,Clicks\n"nombres, especiales","/herramientas/letras-free-fire",1\n"bio\nTikTok","/herramientas/letras-tiktok",2\n');
  assert.deepEqual(rows, [
    ['Query', 'Page', 'Clicks'],
    ['nombres, especiales', '/herramientas/letras-free-fire', '1'],
    ['bio\nTikTok', '/herramientas/letras-tiktok', '2'],
  ]);
});

test('Spanish header variants, semicolon separators, comma decimals and normalization', () => {
  const rows = readRows('Consulta;Página;Clics;Impresiones;Posición\n" letras bonitas ";https://generadordelettering.org/herramientas/conversor-texto;4;100;11,5\n');
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0], {
    query: 'letras bonitas',
    page: '/herramientas/conversor-texto',
    clicks: 4,
    impressions: 100,
    position: 11.5,
  });
});

test('rejects non-site URLs, inaccurate click metrics and incomplete dimensions', () => {
  assert.throws(() => readRows('Query,Page,Clicks,Impressions,Position\na,https://other.example/page,1,20,5\n'), /outside/);
  assert.throws(() => readRows('Query,Page,Clicks,Impressions,Position\na,/,21,20,5\n'), /exceed impressions/);
  assert.throws(() => readRows('Query,Clicks,Impressions,Position\na,1,100,5\n'), /Missing "page" column/);
});

test('groups query × page rows with weighted position and preserves GSC protections', () => {
  const input = [
    'Query,Page,Clicks,Impressions,Position',
    'letras unicode,/herramientas/conversor-texto,10,120,15.5',
    'letras unicode,/herramientas/conversor-texto,5,80,12.5',
    'nombres insanos,/herramientas/letras-free-fire,5,60,16',
    'nombres insanos,/herramientas/generador-de-nombres-para-free-fire,2,55,18',
    'texto corto,/herramientas/creador-de-lettering,1,1000,4',
  ].join('\n');

  const report = analyzeRows(readRows(input), baseline);
  assert.equal(report.input.rows, 5);
  assert.equal(report.input.query_page_groups, 4);

  const combined = report.near_top10.find((r) => r.query === 'letras unicode');
  assert.equal(combined.clicks, 15);
  assert.equal(combined.impressions, 200);
  assert.equal(combined.position, 14.3);
  assert.equal(combined.ctr_percent, 7.5);
  assert.equal(combined.policy, 'observe');

  const protectedCandidate = report.near_top10.find((r) => r.page === '/herramientas/letras-free-fire');
  assert.equal(protectedCandidate.policy, 'protect');

  assert.equal(report.top10_low_ctr_review.length, 1);
  assert.equal(report.top10_low_ctr_review[0].query, 'texto corto');

  assert.equal(report.potential_overlap.length, 1);
  assert.equal(report.potential_overlap[0].query, 'nombres insanos');
  assert.equal(report.potential_overlap[0].pages.length, 2);
});
