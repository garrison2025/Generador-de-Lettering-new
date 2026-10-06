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

for (const htmlFile of walkHtml('dist')) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const preloadTags = [...html.matchAll(/<link\b[^>]*rel=["']modulepreload["'][^>]*>/gi)].map((m) => m[0]);

  for (const tag of preloadTags) {
    assert(
      !tag.includes('canvas-vendor-') && !tag.includes('markdown-vendor-'),
      `Heavy lazy vendor was modulepreloaded by ${htmlFile}: ${tag}`
    );
  }
}

console.log('Build output performance validation passed.');
