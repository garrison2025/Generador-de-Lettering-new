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

function validateRemovedUiImports() {
  const sourceFiles = [
    ...fs.readdirSync('src/pages').filter((name) => name.endsWith('.tsx')).map((name) => `src/pages/${name}`),
    ...fs.readdirSync('src/components').filter((name) => name.endsWith('.tsx')).map((name) => `src/components/${name}`),
    ...fs.readdirSync('src/components/Editor').filter((name) => name.endsWith('.tsx')).map((name) => `src/components/Editor/${name}`)
  ];

  for (const path of sourceFiles) {
    const source = read(path);
    assert(
      !source.includes('@/components/ui/'),
      `Removed UI wrapper import found in ${path}`
    );
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

function validateLegacyCanonicalUrls() {
  const roots = ['src', 'public'];
  const extensions = /\.(?:ts|tsx|js|mjs|html|xml|txt)$/;
  const files = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) {
        walk(path);
      } else if (extensions.test(entry.name)) {
        files.push(path);
      }
    }
  }

  for (const root of roots) walk(root);
  files.push('index.html', 'vite.config.ts');

  const legacyAbsoluteUrls = [
    'https://generadordelettering.org/creador-de-lettering',
    'https://generadordelettering.org/generador-de-nombres-para-instagram',
    'https://generadordelettering.org/generador-de-nombres-para-free-fire'
  ];

  for (const path of files) {
    const source = read(path);
    for (const url of legacyAbsoluteUrls) {
      assert(!source.includes(url), `Legacy absolute canonical URL found in ${path}: ${url}`);
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

    const schemaBreadcrumbs = [
      ...source.matchAll(/"name":\s*"Herramientas"[\s\S]{0,160}?"item":\s*"([^"]+)"/g)
    ];
    for (const match of schemaBreadcrumbs) {
      assert(
        match[1] === 'https://generadordelettering.org/herramientas',
        `Tools schema breadcrumb has the wrong parent in ${path}: ${match[1]}`
      );
    }

    const visibleBreadcrumbs = [
      ...source.matchAll(/<Link\s+to="([^"]+)"[^>]*>Herramientas<\/Link>/g)
    ];
    for (const match of visibleBreadcrumbs) {
      assert(
        match[1] === '/herramientas',
        `Visible tools breadcrumb has the wrong parent in ${path}: ${match[1]}`
      );
    }
  }
}

validateUnicodeMaps();
validateRoutesAndSitemap();
validateLlmsLinks();
validatePublicAssets();
validateRemovedUiImports();
validateEditorStoreUsage();
validateLegacyCanonicalUrls();
validateTrustAndBreadcrumbs();

console.log('Content validation passed.');
