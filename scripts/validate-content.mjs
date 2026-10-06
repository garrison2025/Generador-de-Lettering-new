import fs from 'node:fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateUnicodeMaps() {
  const configs = [
    {
      path: 'src/pages/ConversorTexto.tsx',
      expected: 52,
      mode: 'object'
    },
    {
      path: 'src/pages/LetrasAzules.tsx',
      expected: 52,
      mode: 'object'
    },
    {
      path: 'src/pages/ConversorLetrasBonitas.tsx',
      expected: 52,
      mode: 'object'
    },
    {
      path: 'src/pages/GeneradorNombresInstagram.tsx',
      expected: 62,
      mode: 'mapping'
    }
  ];

  for (const config of configs) {
    const source = read(config.path);
    const failures = [];

    if (config.mode === 'object') {
      const start = source.indexOf('const FONTS_DATA');
      const end = source.indexOf('const FONT_MAPS', start);
      assert(start >= 0 && end > start, `Could not locate FONTS_DATA in ${config.path}`);
      const section = source.slice(start, end);
      const regex = /^\s*([a-zA-Z0-9_]+):\s*'([^'\n]*)'/gm;
      let match;

      while ((match = regex.exec(section))) {
        const [, key, value] = match;
        if (value.length <= 20) continue;
        const length = Array.from(value).length;
        if (length !== config.expected) {
          failures.push(`${key}=${length}`);
        }
      }
    } else {
      const regex = /mapping:\s*'([^'\n]*)'/gm;
      let match;
      let index = 0;

      while ((match = regex.exec(source))) {
        const length = Array.from(match[1]).length;
        if (length !== config.expected) {
          failures.push(`mapping#${index}=${length}`);
        }
        index += 1;
      }
    }

    assert(
      failures.length === 0,
      `Unicode mapping length mismatch in ${config.path}: ${failures.join(', ')}`
    );
  }
}

function validateRoutesAndSitemap() {
  const app = read('src/App.tsx');
  const sitemap = read('public/sitemap.xml');
  const blog = read('src/data/blogPosts.ts');

  const routePaths = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((match) => match[1]);
  const sitemapPaths = [...sitemap.matchAll(/<loc>https:\/\/generadordelettering\.org([^<]*)<\/loc>/g)]
    .map((match) => match[1] || '/');

  const ignoredRoutes = new Set([
    '*',
    'blog/:slug',
    'creador-de-lettering',
    'generador-de-nombres-para-instagram',
    'generador-de-nombres-para-free-fire'
  ]);

  const staticRoutes = new Set(
    routePaths
      .filter((path) => !ignoredRoutes.has(path))
      .map((path) => '/' + path.replace(/^\/+/, ''))
  );
  staticRoutes.add('/');

  const sitemapSet = new Set(sitemapPaths);
  assert(sitemapSet.size === sitemapPaths.length, 'Duplicate URLs found in sitemap.xml');

  const missingStatic = [...staticRoutes].filter((path) => !sitemapSet.has(path));
  assert(
    missingStatic.length === 0,
    `Static routes missing from sitemap.xml: ${missingStatic.join(', ')}`
  );

  const extraNonBlog = sitemapPaths.filter(
    (path) => !staticRoutes.has(path) && !path.startsWith('/blog/')
  );
  assert(
    extraNonBlog.length === 0,
    `Non-route URLs found in sitemap.xml: ${extraNonBlog.join(', ')}`
  );

  const blogPaths = [...blog.matchAll(/slug:\s*['"`]([^'"`]+)['"`]/g)]
    .map((match) => `/blog/${match[1]}`);
  const missingBlog = blogPaths.filter((path) => !sitemapSet.has(path));
  assert(
    missingBlog.length === 0,
    `Blog posts missing from sitemap.xml: ${missingBlog.join(', ')}`
  );
}

function validateLlmsLinks() {
  const sitemap = read('public/sitemap.xml');
  const sitemapRoutes = new Set(
    [...sitemap.matchAll(/<loc>https:\/\/generadordelettering\.org([^<]*)<\/loc>/g)]
      .map((match) => match[1] || '/')
  );

  const legacyRoutes = new Set([
    '/creador-de-lettering',
    '/generador-de-nombres-para-instagram',
    '/generador-de-nombres-para-free-fire'
  ]);

  for (const path of ['public/llms.txt', 'public/llms-full.txt']) {
    const source = read(path);
    const routes = [...source.matchAll(/https:\/\/generadordelettering\.org([^\s)\]]*)/g)]
      .map((match) => match[1] || '/');

    for (const route of routes) {
      assert(!legacyRoutes.has(route), `Legacy canonical route found in ${path}: ${route}`);
      assert(sitemapRoutes.has(route), `LLM document URL is not in sitemap (${path}): ${route}`);
    }
  }
}

function validatePublicAssets() {
  const required = [
    'public/favicon-32x32.png',
    'public/icon.svg',
    'public/apple-touch-icon.png',
    'public/og-image.jpg',
    'public/og-image.webp',
    'public/llms.txt',
    'public/llms-full.txt',
    'public/pwa-192x192.png',
    'public/pwa-512x512.png',
    'public/robots.txt',
    'public/sitemap.xml',
    'public/_headers',
    'public/_redirects'
  ];

  for (const path of required) {
    assert(fs.existsSync(path), `Required public asset is missing: ${path}`);
  }
}

function validateEditorStoreUsage() {
  const files = [
    'src/pages/Editor.tsx',
    'src/pages/CreadorLettering.tsx',
    'src/components/Editor/ControlPanel.tsx',
    'src/components/Editor/CanvasArea.tsx'
  ];

  const stalePatterns = ['historyIndex', 'state.history', 'src/store/useEditorStore'];
  for (const path of files) {
    const source = read(path);
    for (const pattern of stalePatterns) {
      assert(!source.includes(pattern), `Stale editor store API "${pattern}" found in ${path}`);
    }
  }
}

function validateTrustAndBreadcrumbs() {
  const files = [
    'src/pages/Home.tsx',
    'src/pages/BlogPost.tsx',
    'src/pages/SobreNosotros.tsx',
    'src/components/Layout.tsx',
    'vite.config.ts'
  ];

  const banned = ['LetrasPro', 'Sofía Valenzuela', 'Mateo Rivas'];
  for (const path of files) {
    const source = read(path);
    for (const term of banned) {
      assert(!source.includes(term), `Unverified or legacy identity "${term}" found in ${path}`);
    }
  }

  const toolPages = [
    'src/pages/LetrasFreeFire.tsx',
    'src/pages/LetrasTikTok.tsx',
    'src/pages/LetrasAzules.tsx',
    'src/pages/GeneradorNombresInstagram.tsx',
    'src/pages/GeneradorNombresFreeFire.tsx',
    'src/pages/CreadorLettering.tsx',
    'src/pages/ConversorTexto.tsx',
    'src/pages/ConversorLetrasBonitas.tsx'
  ];

  for (const path of toolPages) {
    const source = read(path);
    const badBreadcrumb = /"name":\s*"Herramientas"[\s\S]{0,120}"item":\s*"https:\/\/generadordelettering\.org\/"/;
    assert(!badBreadcrumb.test(source), `Tools breadcrumb points to homepage in ${path}`);
  }
}

validateUnicodeMaps();
validateRoutesAndSitemap();
validateLlmsLinks();
validatePublicAssets();
validateEditorStoreUsage();
validateTrustAndBreadcrumbs();

console.log('Content validation passed.');
