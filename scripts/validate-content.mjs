import fs from 'node:fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function escapeRegExp(value) {
  const specialCharacters = new Set([
    '\\', '.', '*', '+', '?', '^', '$', '{', '}', '(', ')', '|', '[', ']'
  ]);

  return Array.from(
    value,
    (char) => specialCharacters.has(char) ? '\\' + char : char
  ).join('');
}

function validateUnicodeMaps() {
  const sharedSource = read('src/data/unicodeStyles.ts');
  const fontsStart = sharedSource.indexOf('export const FONTS_DATA');
  const fontsEnd = sharedSource.indexOf('export const FONT_MAPS', fontsStart);
  assert(fontsStart >= 0 && fontsEnd > fontsStart, 'Could not locate shared FONTS_DATA');

  const failures = [];
  const seenMappings = new Map();
  const sharedFonts = sharedSource.slice(fontsStart, fontsEnd);
  const sharedRegex = /^\s*([a-zA-Z0-9_]+):\s*'([^'\n]*)'/gm;
  let sharedMatch;

  while ((sharedMatch = sharedRegex.exec(sharedFonts))) {
    const [, key, value] = sharedMatch;
    if (value.length <= 20) continue;

    const length = Array.from(value).length;
    if (length !== 52) {
      failures.push(`${key}=${length}`);
    }

    const previousKey = seenMappings.get(value);
    if (previousKey) {
      failures.push(`duplicate:${previousKey}=${key}`);
    } else {
      seenMappings.set(value, key);
    }
  }

  const instagram = read('src/pages/GeneradorNombresInstagram.tsx');
  let mappingIndex = 0;
  for (const match of instagram.matchAll(/mapping:\s*'([^'\n]*)'/gm)) {
    const length = Array.from(match[1]).length;
    if (length !== 62) failures.push(`instagram#${mappingIndex}=${length}`);
    mappingIndex += 1;
  }

  const tiktok = read('src/pages/LetrasTikTok.tsx');
  let tiktokCount = 0;
  for (const match of tiktok.matchAll(/id:\s*'([^']+)'[\s\S]*?convert:\s*\(t:\s*string\)\s*=>\s*convertFont\(t,\s*'([^'\n]*)'\)/g)) {
    const [, styleId, mapping] = match;
    const length = Array.from(mapping).length;
    if (length !== 52) failures.push(`tiktok:${styleId}=${length}`);
    tiktokCount += 1;
  }

  assert(mappingIndex > 0, 'No Instagram Unicode mappings found');
  assert(tiktokCount > 0, 'No TikTok inline convertFont mappings found');
  assert(
    failures.length === 0,
    `Unicode mapping validation failed: ${failures.join(', ')}`
  );
}

function validateUnicodeStyleReferences() {
  const sharedSource = read('src/data/unicodeStyles.ts');
  const fontsStart = sharedSource.indexOf('export const FONTS_DATA');
  const fontsEnd = sharedSource.indexOf('export const FONT_MAPS', fontsStart);
  const decoratorsStart = sharedSource.indexOf('export const DECORATORS');
  const decoratorsEnd = sharedSource.length;

  assert(fontsStart >= 0 && fontsEnd > fontsStart, 'Could not locate shared FONTS_DATA');
  assert(decoratorsStart >= 0, 'Could not locate shared DECORATORS');

  const fontKeys = new Set(
    [...sharedSource.slice(fontsStart, fontsEnd).matchAll(/^\s*([A-Za-z0-9_]+):\s*'/gm)]
      .map((match) => match[1])
  );
  const decoratorKeys = new Set(
    [...sharedSource.slice(decoratorsStart, decoratorsEnd).matchAll(/^\s*([A-Za-z0-9_]+):\s*\{/gm)]
      .map((match) => match[1])
  );

  const files = [
    { path: 'src/pages/ConversorTexto.tsx', extras: [] },
    { path: 'src/pages/ConversorLetrasBonitas.tsx', extras: [] },
    { path: 'src/pages/LetrasAzules.tsx', extras: ['blue'] }
  ];

  for (const config of files) {
    const source = read(config.path);
    const stylesStart = source.indexOf('const STYLES');
    const stylesEnd = source.indexOf('export default', stylesStart);
    assert(stylesStart >= 0 && stylesEnd > stylesStart, `Could not locate STYLES in ${config.path}`);

    const styleIds = [
      ...source.slice(stylesStart, stylesEnd).matchAll(/\{\s*id:\s*'([^']+)'/g)
    ].map((match) => match[1]);

    const validIds = new Set([...fontKeys, ...decoratorKeys, ...config.extras]);
    const missing = styleIds.filter((id) => !validIds.has(id));

    assert(
      missing.length === 0,
      `Unicode STYLES reference missing mappings in ${config.path}: ${missing.join(', ')}`
    );
  }
}

function validateUnicodeSafeTransforms() {
  const files = [
    'src/pages/ConversorTexto.tsx',
    'src/pages/ConversorLetrasBonitas.tsx',
    'src/pages/LetrasAzules.tsx',
    'src/pages/LetrasTikTok.tsx'
  ];

  const unsafeReversePattern = /\.split\(['"]{2}\)\.reverse\(\)\.join\(['"]{2}\)/;

  for (const path of files) {
    const source = read(path);
    assert(
      !unsafeReversePattern.test(source),
      `Unicode-unsafe split('').reverse() transform found in ${path}; use Array.from(...).reverse() instead.`
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

function validateBlogLastmod() {
  const blog = read('src/data/blogPosts.ts');
  const sitemap = read('public/sitemap.xml');

  const posts = [
    ...blog.matchAll(
      /slug:\s*'([^']+)'[\s\S]*?date:\s*'([^']+)'(?:,\s*\n\s*updated:\s*'([^']+)')?/g
    )
  ].map((match) => ({
    slug: match[1],
    lastmod: match[3] || match[2]
  }));

  for (const post of posts) {
    const route = `https://generadordelettering.org/blog/${post.slug}`;
    const entryPattern = new RegExp(
      `<loc>${escapeRegExp(route)}<\\/loc>\\s*<lastmod>([^<]+)<\\/lastmod>`
    );
    const sitemapLastmod = sitemap.match(entryPattern)?.[1];

    assert(
      sitemapLastmod === post.lastmod,
      `Blog lastmod mismatch for ${post.slug}: expected ${post.lastmod}, found ${sitemapLastmod || 'missing'}`
    );
  }
}

function validateInternalLinks() {
  const app = read('src/App.tsx');
  const blog = read('src/data/blogPosts.ts');

  const routePaths = [...app.matchAll(/<Route\s+path="([^"]+)"/g)]
    .map((match) => match[1]);

  const validRoutes = new Set(['/','/404']);
  for (const route of routePaths) {
    if (route === '*' || route.includes(':')) continue;
    validRoutes.add('/' + route.replace(/^\/+/, ''));
  }

  for (const match of blog.matchAll(/slug:\s*['"`]([^'"`]+)['"`]/g)) {
    validRoutes.add(`/blog/${match[1]}`);
  }

  const legacyRoutes = new Set([
    '/creador-de-lettering',
    '/generador-de-nombres-para-instagram',
    '/generador-de-nombres-para-free-fire'
  ]);

  const sourceFiles = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = `${dir}/${entry.name}`;
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(?:ts|tsx)$/.test(entry.name)) {
        sourceFiles.push(fullPath);
      }
    }
  };
  walk('src');

  const violations = [];
  const inspectTarget = (file, rawTarget) => {
    if (!rawTarget || rawTarget.startsWith('//')) return;

    const target = rawTarget.split(/[?#]/, 1)[0] || '/';
    const normalized = target === '/' ? '/' : target.replace(/\/+$/, '');

    if (legacyRoutes.has(normalized)) {
      violations.push(`${file}: internal link uses legacy redirect route ${normalized}`);
      return;
    }

    if (validRoutes.has(normalized)) return;

    const publicPath = `public/${normalized.replace(/^\/+/, '')}`;
    if (fs.existsSync(publicPath)) return;

    violations.push(`${file}: internal link target does not exist: ${normalized}`);
  };

  for (const file of sourceFiles) {
    const source = read(file);

    for (const match of source.matchAll(/\b(?:to|href)=["'](\/[^"'<>]*)["']/g)) {
      inspectTarget(file, match[1]);
    }

    for (const match of source.matchAll(/\]\((\/[^)\s]+)\)/g)) {
      inspectTarget(file, match[1]);
    }
  }

  assert(
    violations.length === 0,
    `Internal link validation failed:\n- ${violations.join('\n- ')}`
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

function validateMonetizationConfig() {
  const html = read('index.html');
  const ads = read('public/ads.txt');

  const adsPublisher = ads.match(/^google\.com,\s*(pub-\d+),\s*DIRECT,\s*f08c47fec0942fa0\s*$/m)?.[1];
  const scriptPublisher = html.match(/adsbygoogle\.js\?client=ca-(pub-\d+)/)?.[1];

  assert(adsPublisher, 'Could not find a valid Google DIRECT publisher entry in public/ads.txt');
  assert(scriptPublisher, 'Could not find the AdSense publisher ID in index.html');
  assert(
    adsPublisher === scriptPublisher,
    `AdSense publisher mismatch: ads.txt=${adsPublisher}, script=${scriptPublisher}`
  );

  assert(
    html.includes("localStorage.getItem('cookie_consent') === 'accepted'"),
    'Monetization loader is missing the explicit accepted-consent gate'
  );
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

function validateBulkUnicodeInputCaps() {
  const files = [
    'src/pages/ConversorTexto.tsx',
    'src/pages/ConversorLetrasBonitas.tsx',
    'src/pages/LetrasAzules.tsx',
    'src/pages/LetrasTikTok.tsx'
  ];

  for (const path of files) {
    const source = read(path);
    assert(
      source.includes("Array.from(e.target.value).slice(0, 500).join('')"),
      `Bulk Unicode input is missing the 500-code-point cap in ${path}`
    );
  }
}

function validateClipboardUsage() {
  const helperPath = 'src/utils/copyText.ts';
  assert(fs.existsSync(helperPath), `Shared clipboard helper is missing: ${helperPath}`);

  const pageFiles = fs.readdirSync('src/pages')
    .filter((name) => name.endsWith('.tsx'))
    .map((name) => `src/pages/${name}`);

  for (const path of pageFiles) {
    const source = read(path);
    assert(
      !source.includes('navigator.clipboard.writeText'),
      `Direct clipboard write found in ${path}; use the shared copyText helper so failures are handled.`
    );
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

function validateEditorHistoryMemorySafety() {
  const source = read('store/useEditorStore.ts');

  assert(
    source.includes("type EditorHistoryState = Omit<EditorState, 'backgroundImage'>;"),
    'Editor history must exclude backgroundImage payloads'
  );
  assert(
    !/past:\s*EditorState\[\]/.test(source) && !/future:\s*EditorState\[\]/.test(source),
    'Editor history arrays must not store full EditorState objects'
  );
  assert(
    !/past:\s*\[[^\]]*extractState\(state\)/s.test(source),
    'Undo history must not snapshot backgroundImage through extractState(state)'
  );
  assert(
    !/future:\s*\[[^\]]*extractState\(state\)/s.test(source),
    'Redo history must not snapshot backgroundImage through extractState(state)'
  );
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
  const staleBrandTerms = [
    'GeneradorAesthetic.com',
    'LetrasPro',
    'Sofía Valenzuela',
    'Mateo Rivas'
  ];

  const violations = [];

  for (const path of files) {
    const source = read(path);
    for (const url of legacyAbsoluteUrls) {
      if (source.includes(url)) {
        violations.push(`Legacy absolute canonical URL found in ${path}: ${url}`);
      }
    }
    for (const term of staleBrandTerms) {
      if (source.includes(term)) {
        violations.push(`Stale brand or identity found in ${path}: ${term}`);
      }
    }
  }

  assert(
    violations.length === 0,
    `Legacy URL/brand validation failed:\n- ${violations.join('\n- ')}`
  );
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
validateUnicodeStyleReferences();
validateUnicodeSafeTransforms();
validateRoutesAndSitemap();
validateBlogLastmod();
validateInternalLinks();
validateLlmsLinks();
validateMonetizationConfig();
validatePublicAssets();
validateBulkUnicodeInputCaps();
validateClipboardUsage();
validateRemovedUiImports();
validateEditorHistoryMemorySafety();
validateEditorStoreUsage();
validateLegacyCanonicalUrls();
validateTrustAndBreadcrumbs();

console.log('Content validation passed.');
