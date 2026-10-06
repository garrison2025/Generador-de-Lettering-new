import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://generadordelettering.org';

const staticPages = [
  ['/', 'src/pages/Home.tsx'],
  ['/editor', 'src/pages/Editor.tsx'],
  ['/plantillas', 'src/pages/Plantillas.tsx'],
  ['/herramientas', 'src/pages/Herramientas.tsx'],
  ['/herramientas/paletas-de-color', 'src/pages/PaletasColor.tsx'],
  ['/herramientas/combinador-de-fuentes', 'src/pages/CombinadorFuentes.tsx'],
  ['/herramientas/plantillas-practica', 'src/pages/PlantillasPractica.tsx'],
  ['/herramientas/conversor-texto', 'src/pages/ConversorTexto.tsx'],
  ['/herramientas/letras-azules', 'src/pages/LetrasAzules.tsx'],
  ['/herramientas/letras-free-fire', 'src/pages/LetrasFreeFire.tsx'],
  ['/herramientas/letras-tiktok', 'src/pages/LetrasTikTok.tsx'],
  ['/herramientas/conversor-letras-bonitas', 'src/pages/ConversorLetrasBonitas.tsx'],
  ['/herramientas/generador-de-nombres-para-instagram', 'src/pages/GeneradorNombresInstagram.tsx'],
  ['/herramientas/generador-de-nombres-para-free-fire', 'src/pages/GeneradorNombresFreeFire.tsx'],
  ['/herramientas/creador-de-lettering', 'src/pages/CreadorLettering.tsx'],
  ['/blog', 'src/pages/Blog.tsx'],
  ['/sobre-nosotros', 'src/pages/SobreNosotros.tsx'],
  ['/contacto', 'src/pages/Contacto.tsx'],
  ['/politica-de-privacidad', 'src/pages/Privacidad.tsx'],
  ['/terminos-y-condiciones', 'src/pages/Terminos.tsx']
];

const seoLandingRoutes = [
  '/generador-de-letras-goticas',
  '/generador-de-letras-cursivas',
  '/letras-para-instagram',
  '/letras-para-tatuajes'
];

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function extractQuotedProp(source, prop) {
  const match = source.match(new RegExp(`\\b${prop}="([^"]+)"`));
  return match?.[1] || null;
}

function extractStaticSeo(sourceFile) {
  const source = read(sourceFile);
  const title = extractQuotedProp(source, 'title');
  const description = extractQuotedProp(source, 'description');
  const keywords = extractQuotedProp(source, 'keywords');
  if (!title || !description) {
    throw new Error(`Could not extract static SEO metadata from ${sourceFile}`);
  }
  return { title, description, keywords };
}

function extractSeoLanding(route) {
  const source = read('src/pages/SeoPage.tsx');
  const start = source.indexOf(`'${route}':`);
  if (start < 0) throw new Error(`SEO landing config not found for ${route}`);

  const nextRoute = source.indexOf("\n  '/", start + route.length + 4);
  const end = nextRoute >= 0 ? nextRoute : source.indexOf('\n};', start);
  const block = source.slice(start, end);

  const title = block.match(/title:\s*'([^']+)'/)?.[1];
  const description = block.match(/description:\s*'([^']+)'/)?.[1];
  const keywords = block.match(/keywords:\s*'([^']+)'/)?.[1] || null;
  if (!title || !description) {
    throw new Error(`Could not extract SEO landing metadata for ${route}`);
  }
  return { title, description, keywords };
}

function extractBlogPosts() {
  const source = read('src/data/blogPosts.ts');
  const posts = [];
  const regex = /slug:\s*'([^']+)',\s*title:\s*'([^']+)',\s*(?:seoTitle:\s*'([^']+)',\s*)?excerpt:\s*'([^']+)',[\s\S]*?date:\s*'([^']+)'(?:,[\s\S]*?updated:\s*'([^']+)')?,[\s\S]*?keywords:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(source))) {
    posts.push({
      route: `/blog/${match[1]}`,
      title: match[3] || match[2],
      description: match[4],
      publishedTime: match[5],
      modifiedTime: match[6] || match[5],
      keywords: match[7]
    });
  }
  return posts;
}

function routeOutputFile(route) {
  if (route === '/') return 'dist/index.html';

  // Cloudflare Pages canonicalizes nested /route/index.html files to /route/.
  // Emit flat .html route files instead so Pages serves the extensionless,
  // no-trailing-slash URL used by our canonical tags, sitemap and internal links.
  return path.join('dist', `${route.replace(/^\//, '')}.html`);
}

function makeHead(baseHtml, route, title, description, keywords, publishedTime, modifiedTime) {
  const canonical = `${SITE}${route === '/' ? '/' : route}`;
  let html = baseHtml;

  html = html.replace(
    /<title(?:\s+data-rh="true")?>[\s\S]*?<\/title>/i,
    `<title data-rh="true">${escapeHtml(title)}</title>`
  );

  html = html.replace(
    /<meta\b[^>]*\bname="description"[^>]*>/i,
    `<meta data-rh="true" name="description" content="${escapeHtml(description)}" />`
  );

  html = html.replace(/\s*<meta\b[^>]*\bname="keywords"[^>]*>/gi, '');
  if (keywords) {
    html = html.replace(
      '</head>',
      `    <meta data-rh="true" name="keywords" content="${escapeHtml(keywords)}" />\n  </head>`
    );
  }

  html = html
    .replace(/\s*<link\s+data-rh="true"\s+rel="canonical"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+property="og:title"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+property="og:description"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+property="og:url"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+property="og:type"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+property="article:published_time"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+property="article:modified_time"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+name="twitter:title"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+name="twitter:description"[^>]*>/gi, '');

  const routeTags = [
    `    <link data-rh="true" rel="canonical" href="${canonical}" />`,
    `    <meta data-rh="true" property="og:title" content="${escapeHtml(title)}" />`,
    `    <meta data-rh="true" property="og:description" content="${escapeHtml(description)}" />`,
    `    <meta data-rh="true" property="og:url" content="${canonical}" />`,
    `    <meta data-rh="true" property="og:type" content="${publishedTime ? 'article' : 'website'}" />`,
    ...(publishedTime
      ? [`    <meta data-rh="true" property="article:published_time" content="${escapeHtml(publishedTime)}" />`]
      : []),
    ...(modifiedTime
      ? [`    <meta data-rh="true" property="article:modified_time" content="${escapeHtml(modifiedTime)}" />`]
      : []),
    `    <meta data-rh="true" name="twitter:title" content="${escapeHtml(title)}" />`,
    `    <meta data-rh="true" name="twitter:description" content="${escapeHtml(description)}" />`
  ].join('\n');

  html = html.replace('</head>', `${routeTags}\n  </head>`);
  return html;
}

function make404Html(baseHtml) {
  let html = baseHtml;

  html = html.replace(
    /<title(?:\s+data-rh="true")?>[\s\S]*?<\/title>/i,
    '<title data-rh="true">Página no encontrada (404) | Generador de Lettering</title>'
  );

  html = html.replace(
    /<meta\b[^>]*\bname="description"[^>]*>/i,
    '<meta data-rh="true" name="description" content="La página solicitada no existe. Explora nuestras herramientas de lettering, letras bonitas y nombres para redes sociales." />'
  );

  html = html
    .replace(/\s*<link\s+data-rh="true"\s+rel="canonical"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+name="robots"[^>]*>/gi, '');

  const robots = '    <meta data-rh="true" name="robots" content="noindex, follow" />';
  html = html.replace('</head>', `${robots}\n  </head>`);

  const robotsCount = (html.match(/<meta\b[^>]*\bname="robots"[^>]*>/gi) || []).length;
  if (robotsCount !== 1 || !html.includes('content="noindex, follow"')) {
    throw new Error('Generated 404.html is missing the expected noindex robots tag');
  }

  return html;
}

const baseHtml = read('dist/index.html');

if (fs.existsSync('dist/sw.js')) {
  const serviceWorker = read('dist/sw.js');
  if (serviceWorker.includes('index.html')) {
    throw new Error('PWA service worker must not precache or navigate-fallback to index.html');
  }

  for (const heavyBundle of ['canvas-vendor', 'markdown-vendor']) {
    if (serviceWorker.includes(heavyBundle)) {
      throw new Error(`PWA service worker must not precache heavy route bundle: ${heavyBundle}`);
    }
  }
}

for (const heavyPreload of ['canvas-vendor', 'markdown-vendor']) {
  if (baseHtml.includes(heavyPreload)) {
    throw new Error(`Heavy route vendor leaked into initial HTML preload: ${heavyPreload}`);
  }
}

const pages = [];

for (const [route, sourceFile] of staticPages) {
  pages.push({ route, ...extractStaticSeo(sourceFile) });
}

for (const route of seoLandingRoutes) {
  pages.push({ route, ...extractSeoLanding(route) });
}

pages.push(...extractBlogPosts());

const titleOwners = new Map();
const duplicateTitles = [];

for (const page of pages) {
  const normalizedTitle = page.title.trim().toLocaleLowerCase('es');
  const existingRoute = titleOwners.get(normalizedTitle);

  if (existingRoute) {
    duplicateTitles.push(`"${page.title}" -> ${existingRoute}, ${page.route}`);
  } else {
    titleOwners.set(normalizedTitle, page.route);
  }
}

if (duplicateTitles.length > 0) {
  throw new Error(`Duplicate SEO titles found:\n- ${duplicateTitles.join('\n- ')}`);
}

const sitemap = read('public/sitemap.xml');
const sitemapRoutes = [...sitemap.matchAll(/<loc>https:\/\/generadordelettering\.org([^<]*)<\/loc>/g)]
  .map((match) => match[1] || '/');
const pageRoutes = pages.map((page) => page.route);

const missingHeadShells = sitemapRoutes.filter((route) => !pageRoutes.includes(route));
const extraHeadShells = pageRoutes.filter((route) => !sitemapRoutes.includes(route));

if (missingHeadShells.length > 0) {
  throw new Error(`Sitemap routes missing static head shells: ${missingHeadShells.join(', ')}`);
}
if (extraHeadShells.length > 0) {
  throw new Error(`Static head shells not present in sitemap: ${extraHeadShells.join(', ')}`);
}

const seen = new Set();
for (const page of pages) {
  if (seen.has(page.route)) throw new Error(`Duplicate static head route: ${page.route}`);
  seen.add(page.route);

  const output = routeOutputFile(page.route);
  fs.mkdirSync(path.dirname(output), { recursive: true });

  const html = makeHead(baseHtml, page.route, page.title, page.description, page.keywords, page.publishedTime, page.modifiedTime);
  const canonical = `${SITE}${page.route === '/' ? '/' : page.route}`;
  const expectedTitle = `<title data-rh="true">${escapeHtml(page.title)}</title>`;
  const expectedDescription = `<meta data-rh="true" name="description" content="${escapeHtml(page.description)}" />`;
  const expectedKeywords = page.keywords
    ? `<meta data-rh="true" name="keywords" content="${escapeHtml(page.keywords)}" />`
    : null;
  const expectedCanonical = `<link data-rh="true" rel="canonical" href="${canonical}" />`;
  const expectedPublishedTime = page.publishedTime
    ? `<meta data-rh="true" property="article:published_time" content="${escapeHtml(page.publishedTime)}" />`
    : null;
  const expectedModifiedTime = page.modifiedTime
    ? `<meta data-rh="true" property="article:modified_time" content="${escapeHtml(page.modifiedTime)}" />`
    : null;

  if (!html.includes(expectedTitle)) {
    throw new Error(`Generated head is missing the expected title for ${page.route}`);
  }
  if (!html.includes(expectedDescription)) {
    throw new Error(`Generated head is missing the expected description for ${page.route}`);
  }
  if (expectedKeywords && !html.includes(expectedKeywords)) {
    throw new Error(`Generated head is missing the expected keywords for ${page.route}`);
  }
  if (!expectedKeywords && /<meta\b[^>]*\bname="keywords"[^>]*>/i.test(html)) {
    throw new Error(`Generated head should not contain fallback keywords for ${page.route}`);
  }
  if (!html.includes(expectedCanonical)) {
    throw new Error(`Generated head is missing the expected canonical for ${page.route}`);
  }
  if (expectedPublishedTime && !html.includes(expectedPublishedTime)) {
    throw new Error(`Generated head is missing article:published_time for ${page.route}`);
  }
  if (expectedModifiedTime && !html.includes(expectedModifiedTime)) {
    throw new Error(`Generated head is missing article:modified_time for ${page.route}`);
  }
  if (!expectedPublishedTime && /property="article:published_time"/i.test(html)) {
    throw new Error(`Non-article route contains article:published_time: ${page.route}`);
  }
  if (!expectedModifiedTime && /property="article:modified_time"/i.test(html)) {
    throw new Error(`Non-article route contains article:modified_time: ${page.route}`);
  }

  const descriptionCount = (html.match(/<meta\b[^>]*\bname="description"[^>]*>/gi) || []).length;
  const canonicalCount = (html.match(/<link\b[^>]*\brel="canonical"[^>]*>/gi) || []).length;
  if (descriptionCount !== 1) {
    throw new Error(`Expected exactly one meta description for ${page.route}, found ${descriptionCount}`);
  }
  if (canonicalCount !== 1) {
    throw new Error(`Expected exactly one canonical for ${page.route}, found ${canonicalCount}`);
  }

  fs.writeFileSync(output, html);
}

const notFoundHtml = make404Html(baseHtml);
fs.writeFileSync('dist/404.html', notFoundHtml);

if (!fs.existsSync('dist/404.html')) {
  throw new Error('Failed to generate top-level dist/404.html');
}

console.log(`Generated and verified static SEO head shells for ${pages.length} routes plus 404.html.`);
