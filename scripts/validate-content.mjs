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

  assert(mappingIndex > 0, 'No Instagram Unicode mappings found');
  assert(
    failures.length === 0,
    `Unicode mapping validation failed: ${failures.join(', ')}`
  );
}

function validateFreeFireFontMaps() {
  const configs = [
    {
      path: 'src/pages/LetrasFreeFire.tsx',
      references: [
        'smallCaps: SHARED_FONT_MAPS.small_caps',
        'gothic: SHARED_FONT_MAPS.gotica'
      ]
    },
    {
      path: 'src/pages/GeneradorNombresFreeFire.tsx',
      references: [
        'smallCaps: SHARED_FONT_MAPS.small_caps',
        'gothic: SHARED_FONT_MAPS.gotica',
        'cursiva: SHARED_FONT_MAPS.cursiva'
      ]
    }
  ];

  for (const config of configs) {
    const source = read(config.path);

    assert(
      source.includes("import { FONT_MAPS as SHARED_FONT_MAPS } from '../data/unicodeStyles';"),
      `Free Fire tool must import the shared Unicode font map: ${config.path}`
    );

    assert(
      !source.includes('const FONT_MAPS:'),
      `Duplicated local FONT_MAPS found in ${config.path}`
    );

    for (const reference of config.references) {
      assert(
        source.includes(reference),
        `Missing shared Free Fire font-map reference in ${config.path}: ${reference}`
      );
    }
  }
}

function validateTikTokFontMaps() {
  const sharedSource = read('src/data/unicodeStyles.ts');
  const fontsStart = sharedSource.indexOf('export const FONTS_DATA');
  const fontsEnd = sharedSource.indexOf('export const FONT_MAPS', fontsStart);
  assert(fontsStart >= 0 && fontsEnd > fontsStart, 'Could not locate shared FONTS_DATA');

  const sharedKeys = new Set(
    [...sharedSource.slice(fontsStart, fontsEnd).matchAll(/^\s*([A-Za-z0-9_]+):\s*'/gm)]
      .map((match) => match[1])
  );

  const source = read('src/pages/LetrasTikTok.tsx');

  assert(
    source.includes("import { FONT_MAPS as SHARED_FONT_MAPS } from '../data/unicodeStyles';"),
    'TikTok tool must import the shared Unicode font map'
  );
  assert(
    !source.includes('const ALPHABET') &&
    !/convert:\s*\(t:\s*string\)\s*=>\s*convertFont\(t,\s*'/.test(source),
    'TikTok tool must not contain duplicated inline Unicode maps'
  );

  const styleBlockStart = source.indexOf('const STYLES');
  const styleBlockEnd = source.indexOf('const DECORATORS', styleBlockStart);
  assert(styleBlockStart >= 0 && styleBlockEnd > styleBlockStart, 'Could not locate TikTok STYLES');

  const fontMapIds = [
    ...source.slice(styleBlockStart, styleBlockEnd).matchAll(/fontMapId:\s*'([^']+)'/g)
  ].map((match) => match[1]);

  assert(fontMapIds.length > 0, 'No TikTok shared fontMapId references found');

  const missing = fontMapIds.filter((id) => !sharedKeys.has(id));
  assert(
    missing.length === 0,
    `TikTok fontMapId references missing shared mappings: ${missing.join(', ')}`
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
    'src/pages/LetrasTikTok.tsx',
    'src/pages/LetrasFreeFire.tsx',
    'src/pages/GeneradorNombresFreeFire.tsx'
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

function validateInternalRouteLinks() {
  const app = read('src/App.tsx');
  const blog = read('src/data/blogPosts.ts');

  const routePaths = [...app.matchAll(/<Route\s+path="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((route) => route !== '*' && route !== 'blog/:slug')
    .map((route) => '/' + route.replace(/^\/+/, ''));

  routePaths.push('/');

  const blogPaths = [...blog.matchAll(/slug:\s*['"`]([^'"`]+)['"`]/g)]
    .map((match) => `/blog/${match[1]}`);

  const validPaths = new Set([...routePaths, ...blogPaths, '/404']);
  const legacyPaths = new Set([
    '/creador-de-lettering',
    '/generador-de-nombres-para-instagram',
    '/generador-de-nombres-para-free-fire'
  ]);

  const sourceFiles = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = `${dir}/${entry.name}`;

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(?:tsx|ts)$/.test(entry.name)) {
        sourceFiles.push(fullPath);
      }
    }
  }

  walk('src');

  const failures = [];

  for (const path of sourceFiles) {
    const source = read(path);
    const literalTargets = [
      ...source.matchAll(/<(?:Link|Navigate)\b[^>]*\bto="([^"]+)"/g)
    ].map((match) => match[1]);

    for (const target of literalTargets) {
      if (!target.startsWith('/')) continue;

      const normalized = target.split(/[?#]/, 1)[0] || '/';

      if (legacyPaths.has(normalized)) {
        failures.push(`${path}: legacy internal route ${target}`);
        continue;
      }

      if (!validPaths.has(normalized)) {
        failures.push(`${path}: unresolved internal route ${target}`);
      }
    }
  }

  const markdownTargets = [...blog.matchAll(/\]\((\/[^)\s]+)\)/g)]
    .map((match) => match[1]);

  for (const target of markdownTargets) {
    const normalized = target.split(/[?#]/, 1)[0] || '/';

    if (legacyPaths.has(normalized)) {
      failures.push(`src/data/blogPosts.ts: legacy Markdown route ${target}`);
      continue;
    }

    if (!validPaths.has(normalized)) {
      failures.push(`src/data/blogPosts.ts: unresolved Markdown route ${target}`);
    }
  }

  assert(
    failures.length === 0,
    `Internal route link validation failed:\n- ${failures.join('\n- ')}`
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

function validateCriticalBaseFontLoading() {
  const html = read('index.html');
  const css = read('src/index.css');

  assert(
    !html.includes('fonts.googleapis.com') && !html.includes('fonts.gstatic.com'),
    'Initial HTML must not connect to or block on third-party font services'
  );
  assert(
    !/Inter/i.test(css),
    'Critical UI CSS must use the native system font stack instead of an external Inter dependency'
  );
}

function validateDeferredPreviewFontLoading() {
  const home = read('src/pages/Home.tsx');
  const templates = read('src/pages/Plantillas.tsx');
  const pairings = read('src/pages/CombinadorFuentes.tsx');
  const hook = read('src/hooks/useVisibleFonts.ts');

  assert(
    hook.includes('IntersectionObserver') && hook.includes('queueFonts(families)'),
    'Visibility-triggered font loader must use IntersectionObserver and the shared queued loader'
  );

  for (const [path, source] of [
    ['src/pages/Home.tsx', home],
    ['src/pages/Plantillas.tsx', templates],
    ['src/pages/CombinadorFuentes.tsx', pairings]
  ]) {
    assert(
      source.includes('useVisibleFonts'),
      `Preview-heavy page must defer non-critical web fonts until visible: ${path}`
    );
  }

  assert(
    !home.includes("void loadFont(font)") &&
    !templates.includes('void loadFonts(') &&
    !pairings.includes('void loadFont(family)'),
    'Preview pages must not eagerly fetch decorative font batches during initial mount'
  );
  assert(
    templates.includes('function TemplateCard') &&
    templates.includes("'120px 0px'") &&
    pairings.includes('function PairingCard') &&
    pairings.includes("'120px 0px'"),
    'Template and pairing pages must lazy-load fonts per visible card rather than per full grid'
  );
}

function validateEditorFontPipeline() {
  const fonts = read('lib/fonts.ts');
  const canvas = read('src/components/Editor/CanvasArea.tsx');
  const controls = read('src/components/Editor/ControlPanel.tsx');

  assert(
    fonts.includes('export const queueFonts') &&
    !fonts.includes('await document.fonts.ready'),
    'Font pipeline must batch preview requests and wait only for the requested families'
  );
  assert(
    controls.includes('queueFonts([font.family])') &&
    !controls.includes('onPointerEnter={() => void loadFont'),
    'Editor font previews must use queued requests instead of one stylesheet request per option'
  );
  assert(
    controls.includes('window.requestAnimationFrame') &&
    controls.includes('scheduleValueChange') &&
    controls.includes('flushPendingValue'),
    'Editor sliders must coalesce preview updates to the animation-frame budget'
  );
  assert(
    !canvas.includes('fontLoaded') &&
    canvas.includes('{dimensions.width > 0 && (') &&
    canvas.includes('stageRef.current?.batchDraw()'),
    'Canvas must stay mounted while a new web font resolves and redraw in place'
  );
  assert(
    canvas.includes('Math.round(entry.contentRect.width)') &&
    canvas.includes('Math.round(entry.contentRect.height)'),
    'Canvas resize observer must ignore subpixel jitter'
  );
}

function validateConfiguredFonts() {
  const fontsSource = read('lib/fonts.ts');
  const registered = new Set(
    [...fontsSource.matchAll(/family:\s*['"]([^'"]+)['"]/g)]
      .map((match) => match[1])
  );

  const builtInOrGlobal = new Set([
    'system-ui',
    'Arial',
    'Helvetica',
    'sans-serif',
    'serif',
    'monospace'
  ]);

  const files = [
    'src/pages/CombinadorFuentes.tsx',
    'src/pages/Plantillas.tsx',
    'src/pages/SeoPage.tsx',
    'src/pages/CreadorLettering.tsx',
    'store/useEditorStore.ts'
  ];

  const violations = [];

  for (const path of files) {
    const source = read(path);

    const families = [
      ...source.matchAll(/(?:fontFamily|primaryFont|secondaryFont):\s*['"]([^'"]+)['"]/g)
    ].map((match) => match[1]);

    for (const family of families) {
      if (!registered.has(family) && !builtInOrGlobal.has(family)) {
        violations.push(`${path}: ${family}`);
      }
    }
  }

  assert(
    violations.length === 0,
    `Configured fonts missing from font registry:\n- ${violations.join('\n- ')}`
  );
}

function validatePaletteUniqueness() {
  const source = read('src/pages/PaletasColor.tsx');
  const entries = [
    ...source.matchAll(/\{ name: '([^']+)', colors: \[([^\]]+)\] \}/g)
  ].map((match) => ({
    name: match[1],
    colors: match[2]
      .split(',')
      .map((value) => value.trim().replace(/'/g, '').toUpperCase())
  }));

  const seen = new Map();

  for (const entry of entries) {
    const key = [...entry.colors].sort().join('|');
    const previous = seen.get(key);
    assert(
      !previous,
      `Duplicate palette color set found: "${previous}" and "${entry.name}"`
    );
    seen.set(key, entry.name);
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

function validateConversorSearchClaims() {
  const source = read('src/pages/ConversorTexto.tsx');
  const styleBlock = source.match(/const STYLES = \[([\s\S]*?)\n\];/);
  assert(styleBlock, 'Could not locate ConversorTexto STYLES array');

  const styleCount = [...styleBlock[1].matchAll(/\{\s*id:\s*'[^']+'/g)].length;
  assert(
    styleCount >= 70,
    `ConversorTexto claims 70+ styles but only ${styleCount} style entries are configured`
  );
  assert(
    source.includes('title="Conversor de Letras | 70+ Estilos para Copiar y Pegar"'),
    'High-impression ConversorTexto page must keep the GSC CTR-focused title'
  );
  assert(
    source.includes('Gratis y sin registro') &&
    source.includes('Conversión en tu navegador'),
    'ConversorTexto must keep the trust/value signals next to the primary search intent'
  );
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

  const tiktok = read('src/pages/LetrasTikTok.tsx');
  assert(
    /addSymbolToInput[\s\S]{0,220}slice\(0, 500\)/.test(tiktok),
    'TikTok symbol shortcuts must respect the 500-code-point input cap'
  );

  for (const stale of ['80 caracteres', 'base segura', 'TikTok Aesthetic Font Generator 2026', '**']) {
    assert(
      !tiktok.includes(stale),
      `Stale TikTok guidance or markdown marker found: ${stale}`
    );
  }
}

function validateInstagramInputCap() {
  const source = read('src/pages/GeneradorNombresInstagram.tsx');

  assert(
    source.includes('const INSTAGRAM_INPUT_LIMIT = 150;'),
    'Instagram generator must declare the 150-code-point input limit'
  );
  assert(
    source.includes('const inputCharacterCount = Array.from(inputText).length;'),
    'Instagram character counter must use Unicode code points'
  );
  assert(
    source.includes('setInputText((previous) => limitCodePoints(previous + symbol));'),
    'Instagram symbol shortcuts must respect the shared input cap'
  );
  assert(
    source.includes('onChange={(e) => setInputText(limitCodePoints(e.target.value))}'),
    'Instagram manual input must respect the shared input cap'
  );
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

function validateEditorPrerenderSafety() {
  const store = read('store/useEditorStore.ts');
  const main = read('src/main.tsx');
  const editor = read('src/pages/Editor.tsx');
  const creator = read('src/pages/CreadorLettering.tsx');

  assert(
    store.includes('skipHydration: true'),
    'Editor persistence must skip automatic hydration so server HTML matches the first client render'
  );
  assert(
    main.includes('useEditorStore.persist.rehydrate()'),
    'Editor persistence must explicitly rehydrate after React attaches'
  );
  assert(
    main.includes('EditorPersistenceHydrator'),
    'The editor persistence hydrator must remain mounted at the app root'
  );

  for (const [path, source] of [
    ['src/pages/Editor.tsx', editor],
    ['src/pages/CreadorLettering.tsx', creator]
  ]) {
    assert(
      source.includes('const [canvasReady, setCanvasReady] = useState(false);'),
      `Canvas must start in a server-safe fallback state in ${path}`
    );
    assert(
      source.includes('setCanvasReady(true);'),
      `Canvas must activate after mount in ${path}`
    );
    assert(
      source.includes('canvasReady ? ('),
      `Canvas render must be gated until after hydration in ${path}`
    );
  }
}

function validatePrerenderStorageSafety() {
  const pages = [
    {
      path: 'src/pages/LetrasTikTok.tsx',
      state: 'favorites',
      hydratedState: 'favoritesHydrated',
      storageKey: 'tiktok_fav_fonts'
    },
    {
      path: 'src/pages/GeneradorNombresInstagram.tsx',
      state: 'savedNames',
      hydratedState: 'savedNamesHydrated',
      storageKey: 'ig_saved_names'
    },
    {
      path: 'src/pages/GeneradorNombresFreeFire.tsx',
      state: 'savedNicks',
      hydratedState: 'savedNicksHydrated',
      storageKey: 'ff_saved_nicks'
    }
  ];

  for (const page of pages) {
    const source = read(page.path);
    assert(
      source.includes(`const [${page.state}, set${page.state[0].toUpperCase() + page.state.slice(1)}] = useState<string[]>([]);`),
      `Prerendered persisted state must start empty in ${page.path}`
    );
    assert(
      source.includes(`const [${page.hydratedState}, set${page.hydratedState[0].toUpperCase() + page.hydratedState.slice(1)}] = useState(false);`),
      `Prerendered persisted state must have an explicit hydration gate in ${page.path}`
    );
    assert(
      source.includes(`localStorage.getItem('${page.storageKey}')`),
      `Missing persisted-state restore for ${page.storageKey} in ${page.path}`
    );
    assert(
      source.includes(`if (!${page.hydratedState}) return;`),
      `Persisted-state writes must wait until hydration completes in ${page.path}`
    );
    assert(
      !new RegExp(`useState<string\\[\\]>\\(\\(\\) =>[\\s\\S]{0,400}localStorage\\.getItem\\('${page.storageKey}'\\)`).test(source),
      `localStorage must not run inside the initial useState render for ${page.path}`
    );
  }
}

function validateSearchIntentOwnership() {
  const home = read('src/pages/Home.tsx');
  const editor = read('src/pages/Editor.tsx');
  const creator = read('src/pages/CreadorLettering.tsx');
  const conversor = read('src/pages/ConversorTexto.tsx');
  const ffLetters = read('src/pages/LetrasFreeFire.tsx');
  const ffGenerator = read('src/pages/GeneradorNombresFreeFire.tsx');
  const relatedTools = read('src/components/RelatedTools.tsx');
  const layout = read('src/components/Layout.tsx');

  assert(
    home.includes('title="Generador de Lettering Online | Letras Personalizadas"'),
    'Home must remain the primary Generador de Lettering landing page'
  );
  assert(
    editor.includes('title="Editor de Lettering Avanzado | Lienzo, Colores y Efectos"'),
    'Editor must own the advanced-editor intent'
  );
  assert(
    creator.includes('title="Creador de Lettering con Plantillas | Diseños Online Gratis"'),
    'Creador de Lettering must own the presets/templates intent'
  );
  assert(
    conversor.includes('title="Conversor de Letras | 70+ Estilos para Copiar y Pegar"'),
    'Conversor must own the broad Unicode conversion intent'
  );
  assert(
    ffLetters.includes('title="Letras para Free Fire con Símbolos | Copiar y Pegar"'),
    'Free Fire letters page must own letters/symbols intent'
  );
  assert(
    ffGenerator.includes('title="Generador de Nombres para Free Fire | Nicks, Clan y Dúos"'),
    'Advanced Free Fire page must own name-generator intent'
  );

  assert(
    home.includes('to="/herramientas/creador-de-lettering"') && home.includes('to="/editor"'),
    'Home must link separately to creator and advanced editor'
  );
  assert(
    (home.match(/to="\/editor"/g) || []).length === 1 &&
    home.includes('Abrir Editor de Lettering Avanzado'),
    'Home must reserve /editor for the explicit advanced-editor path, not generic create/template CTAs'
  );
  assert(
    (home.match(/to="\/herramientas\/creador-de-lettering"/g) || []).length >= 5,
    'Home generic create/template CTAs must reinforce the Creador de Lettering landing page'
  );
  assert(
    editor.includes('to="/herramientas/creador-de-lettering"') &&
    creator.includes('to="/editor"'),
    'Editor and creator must cross-link with distinct intent anchors'
  );
  assert(
    ffLetters.includes('to="/herramientas/generador-de-nombres-para-free-fire"') &&
    ffGenerator.includes('to="/herramientas/letras-free-fire"'),
    'Free Fire letters and advanced generator pages must cross-link'
  );
  assert(
    relatedTools.includes("title: 'Letras y Símbolos para Free Fire'") &&
    !relatedTools.includes("title: 'Letras para Free Fire (Nick Insano)'"),
    'RelatedTools must keep the Free Fire letters/symbols anchor distinct from name-generation intent'
  );
  for (const target of [
    '/herramientas/conversor-texto',
    '/herramientas/letras-free-fire',
    '/herramientas/letras-tiktok',
    '/herramientas/generador-de-nombres-para-instagram'
  ]) {
    assert(
      layout.includes(`to="${target}"`),
      `Sitewide layout must expose proven search-demand route: ${target}`
    );
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
validateFreeFireFontMaps();
validateTikTokFontMaps();
validateUnicodeStyleReferences();
validateUnicodeSafeTransforms();
validateRoutesAndSitemap();
validateInternalRouteLinks();
validateBlogLastmod();
validateInternalLinks();
validateLlmsLinks();
validateMonetizationConfig();
validateCriticalBaseFontLoading();
validateDeferredPreviewFontLoading();
validateEditorFontPipeline();
validatePublicAssets();
validateConversorSearchClaims();
validateBulkUnicodeInputCaps();
validateInstagramInputCap();
validateClipboardUsage();
validateRemovedUiImports();
validateEditorHistoryMemorySafety();
validateEditorStoreUsage();
validateLegacyCanonicalUrls();
validateEditorPrerenderSafety();
validatePrerenderStorageSafety();
validateSearchIntentOwnership();
validateTrustAndBreadcrumbs();

console.log('Content validation passed.');
