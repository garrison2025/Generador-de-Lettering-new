import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const assetsDir = 'dist/assets';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function listAssets() {
  assert(fs.existsSync(assetsDir), 'dist/assets is missing; run the production build first.');
  return fs.readdirSync(assetsDir);
}

function findOne(files, prefix, extension = '.js') {
  const matches = files.filter((name) => name.startsWith(prefix) && name.endsWith(extension));
  assert(matches.length === 1, `Expected exactly one ${prefix}*${extension} asset, found: ${matches.join(', ') || 'none'}`);
  return path.join(assetsDir, matches[0]);
}

function gzipKb(file) {
  return gzipSync(fs.readFileSync(file)).length / 1024;
}

function assertGzipLimit(file, limitKb, label) {
  const size = gzipKb(file);
  assert(size <= limitKb, `${label} gzip size regressed: ${size.toFixed(2)} KB > ${limitKb} KB`);
  console.log(`${label}: ${size.toFixed(2)} KB gzip`);
}

function walkHtml(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkHtml(full));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const files = listAssets();

const mainEntry = findOne(files, 'index-', '.js');
const cssEntry = findOne(files, 'index-', '.css');
const shortcuts = findOne(files, 'useEditorShortcuts-');
const blogPost = findOne(files, 'BlogPost-');
const canvasVendor = findOne(files, 'canvas-vendor-');
const markdownVendor = findOne(files, 'markdown-vendor-');
const stateVendor = findOne(files, 'state-vendor-');

assertGzipLimit(mainEntry, 10, 'Main JS entry');
assertGzipLimit(shortcuts, 8, 'Editor shortcuts chunk');
assertGzipLimit(blogPost, 8, 'BlogPost route chunk');
assertGzipLimit(cssEntry, 18, 'Main CSS');
assertGzipLimit(canvasVendor, 120, 'Canvas vendor');
assertGzipLimit(markdownVendor, 60, 'Markdown vendor');
assertGzipLimit(stateVendor, 3, 'State vendor');

const htmlFiles = walkHtml('dist');

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const preloadTags = [...html.matchAll(/<link\b[^>]*rel=["']modulepreload["'][^>]*>/gi)].map((m) => m[0]);

  for (const tag of preloadTags) {
    assert(
      !tag.includes('canvas-vendor-') && !tag.includes('markdown-vendor-'),
      `Heavy lazy vendor was modulepreloaded by ${htmlFile}: ${tag}`
    );
  }
}

const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
const sitemapUrls = new Set(
  [...sitemap.matchAll(/<loc>(https:\/\/generadordelettering\.org[^<]*)<\/loc>/g)]
    .map((match) => match[1])
);

const prerenderedUrls = sitemapUrls;

const schemaRequiredUrls = new Set([
  'https://generadordelettering.org/',
  'https://generadordelettering.org/editor',
  'https://generadordelettering.org/herramientas/creador-de-lettering',
  'https://generadordelettering.org/herramientas/conversor-texto',
  'https://generadordelettering.org/herramientas/letras-azules',
  'https://generadordelettering.org/herramientas/letras-free-fire',
  'https://generadordelettering.org/herramientas/letras-tiktok',
  'https://generadordelettering.org/herramientas/conversor-letras-bonitas',
  'https://generadordelettering.org/herramientas/generador-de-nombres-para-instagram',
  'https://generadordelettering.org/herramientas/generador-de-nombres-para-free-fire',
  'https://generadordelettering.org/blog'
]);

const generatedCanonicals = new Map();
const titleOwners = new Map();
const descriptionOwners = new Map();

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, 'utf8');

  const baseName = path.basename(htmlFile);

  if (baseName === '404.html') {
    assert(
      /<meta\b[^>]*name=["']robots["'][^>]*content=["']noindex,\s*follow["'][^>]*>/i.test(html),
      '404.html must keep noindex, follow'
    );
    assert(
      !/<div\s+id=["']root["']>\s*<\/div>/i.test(html) &&
      /<div\s+id=["']root["']>[\s\S]*?<h1\b/i.test(html),
      '404.html must contain prerendered body content'
    );
    continue;
  }

  if (/^google[a-z0-9]+\.html$/i.test(baseName)) {
    continue;
  }

  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1]?.trim();
  const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1]?.trim();
  const robots = html.match(/<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1]?.trim();
  const twitterUrl = html.match(/<meta\b[^>]*name=["']twitter:url["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1]?.trim();

  assert(title, `Missing title in ${htmlFile}`);
  assert(description, `Missing meta description in ${htmlFile}`);
  assert(canonical, `Missing canonical in ${htmlFile}`);
  assert(sitemapUrls.has(canonical), `Canonical is not present in sitemap (${htmlFile}): ${canonical}`);
  assert(
    robots === 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    `Indexable route is missing the expected static robots directive (${htmlFile}): ${robots || 'missing'}`
  );
  assert(twitterUrl === canonical, `twitter:url must match canonical in ${htmlFile}`);

  const siteSchemaMatches = [
    ...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*data-seo-site-schema=["']true["'][^>]*>([\s\S]*?)<\/script>/gi)
  ];
  assert(siteSchemaMatches.length === 1, `Expected exactly one site identity JSON-LD graph in ${htmlFile}`);
  let siteSchema;
  try {
    siteSchema = JSON.parse(siteSchemaMatches[0][1]);
  } catch (error) {
    throw new Error(`Invalid site identity JSON-LD in ${htmlFile}: ${error.message}`);
  }
  const siteGraph = Array.isArray(siteSchema?.['@graph']) ? siteSchema['@graph'] : [];
  const organization = siteGraph.find((item) => item?.['@id'] === 'https://generadordelettering.org/#organization');
  const website = siteGraph.find((item) => item?.['@id'] === 'https://generadordelettering.org/#website');
  assert(
    organization?.['@type'] === 'Organization' && organization?.name === 'Generador de Lettering',
    `Stable Organization entity missing from ${htmlFile}`
  );
  assert(
    website?.['@type'] === 'WebSite' &&
    website?.publisher?.['@id'] === 'https://generadordelettering.org/#organization',
    `Stable WebSite -> Organization relationship missing from ${htmlFile}`
  );

  const schemaMatches = [
    ...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*data-seo-schema=["']true["'][^>]*>([\s\S]*?)<\/script>/gi)
  ];
  for (const schemaMatch of schemaMatches) {
    try {
      const parsed = JSON.parse(schemaMatch[1]);
      if (parsed?.['@type'] === 'WebApplication') {
        assert(
          parsed?.provider?.['@id'] === 'https://generadordelettering.org/#organization',
          `WebApplication provider must reference the stable Organization entity in ${htmlFile}`
        );
        assert(
          parsed?.isPartOf?.['@id'] === 'https://generadordelettering.org/#website',
          `WebApplication isPartOf must reference the stable WebSite entity in ${htmlFile}`
        );
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid prerendered JSON-LD in ${htmlFile}: ${error.message}`);
      }
      throw error;
    }
  }
  if (schemaRequiredUrls.has(canonical)) {
    assert(schemaMatches.length > 0, `Expected prerendered JSON-LD for ${canonical}`);
  }

  if (prerenderedUrls.has(canonical)) {
    assert(
      !/<div\s+id=["']root["']>\s*<\/div>/i.test(html),
      `Prerendered sitemap route still has an empty root: ${canonical}`
    );
    assert(
      /<div\s+id=["']root["']>[\s\S]*?<h1\b/i.test(html),
      `Prerendered sitemap route is missing server-rendered H1 content: ${canonical}`
    );
  }

  if (generatedCanonicals.has(canonical)) {
    throw new Error(`Duplicate canonical in build output: ${canonical} in ${generatedCanonicals.get(canonical)} and ${htmlFile}`);
  }
  generatedCanonicals.set(canonical, htmlFile);

  if (titleOwners.has(title)) {
    throw new Error(`Duplicate page title: "${title}" in ${titleOwners.get(title)} and ${htmlFile}`);
  }
  titleOwners.set(title, htmlFile);

  if (descriptionOwners.has(description)) {
    throw new Error(`Duplicate meta description in ${descriptionOwners.get(description)} and ${htmlFile}: "${description}"`);
  }
  descriptionOwners.set(description, htmlFile);
}

assert(
  generatedCanonicals.size === sitemapUrls.size,
  `Static HTML/canonical coverage mismatch: generated ${generatedCanonicals.size}, sitemap ${sitemapUrls.size}`
);

for (const sitemapUrl of sitemapUrls) {
  assert(generatedCanonicals.has(sitemapUrl), `Sitemap URL is missing a generated HTML head: ${sitemapUrl}`);
}

console.log('Build output performance and SEO metadata validation passed.');
