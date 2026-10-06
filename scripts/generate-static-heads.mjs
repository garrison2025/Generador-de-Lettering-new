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
  if (!title || !description) {
    throw new Error(`Could not extract static SEO metadata from ${sourceFile}`);
  }
  return { title, description };
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
  if (!title || !description) {
    throw new Error(`Could not extract SEO landing metadata for ${route}`);
  }
  return { title, description };
}

function extractBlogPosts() {
  const source = read('src/data/blogPosts.ts');
  const posts = [];
  const regex = /slug:\s*'([^']+)',\s*\n\s*title:\s*'([^']+)',\s*\n\s*excerpt:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(source))) {
    posts.push({
      route: `/blog/${match[1]}`,
      title: `${match[2]} | Generador de Lettering Blog`,
      description: match[3]
    });
  }
  return posts;
}

function routeOutputFile(route) {
  if (route === '/') return 'dist/index.html';
  return path.join('dist', route.replace(/^\//, ''), 'index.html');
}

function makeHead(baseHtml, route, title, description) {
  const canonical = `${SITE}${route === '/' ? '/' : route}`;
  let html = baseHtml;

  html = html.replace(
    /<title(?:\s+data-rh="true")?>[\s\S]*?<\/title>/i,
    `<title data-rh="true">${escapeHtml(title)}</title>`
  );

  html = html.replace(
    /<meta\s+name="description"[^>]*>/i,
    `<meta data-rh="true" name="description" content="${escapeHtml(description)}" />`
  );

  html = html
    .replace(/\s*<link\s+data-rh="true"\s+rel="canonical"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+property="og:title"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+property="og:description"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+property="og:url"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+name="twitter:title"[^>]*>/gi, '')
    .replace(/\s*<meta\s+data-rh="true"\s+name="twitter:description"[^>]*>/gi, '');

  const routeTags = [
    `    <link data-rh="true" rel="canonical" href="${canonical}" />`,
    `    <meta data-rh="true" property="og:title" content="${escapeHtml(title)}" />`,
    `    <meta data-rh="true" property="og:description" content="${escapeHtml(description)}" />`,
    `    <meta data-rh="true" property="og:url" content="${canonical}" />`,
    `    <meta data-rh="true" name="twitter:title" content="${escapeHtml(title)}" />`,
    `    <meta data-rh="true" name="twitter:description" content="${escapeHtml(description)}" />`
  ].join('\n');

  html = html.replace('</head>', `${routeTags}\n  </head>`);
  return html;
}

const baseHtml = read('dist/index.html');
const pages = [];

for (const [route, sourceFile] of staticPages) {
  pages.push({ route, ...extractStaticSeo(sourceFile) });
}

for (const route of seoLandingRoutes) {
  pages.push({ route, ...extractSeoLanding(route) });
}

pages.push(...extractBlogPosts());

const seen = new Set();
for (const page of pages) {
  if (seen.has(page.route)) throw new Error(`Duplicate static head route: ${page.route}`);
  seen.add(page.route);

  const output = routeOutputFile(page.route);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, makeHead(baseHtml, page.route, page.title, page.description));
}

console.log(`Generated static SEO head shells for ${pages.length} routes.`);
