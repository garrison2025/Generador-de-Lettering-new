export const FONTS = [
  { group: "Caligrafía Elegante", family: "Dancing Script", href: "Dancing+Script:wght@400;700" },
  { group: "Script Moderno", family: "Pacifico", href: "Pacifico:wght@400" },
  { group: "Caligrafía Fluida", family: "Parisienne", href: "Parisienne:wght@400" },
  { group: "Escritura Inglesa", family: "Great Vibes", href: "Great+Vibes:wght@400" },
  { group: "Brush Script", family: "Courgette", href: "Courgette:wght@400" },
  { group: "Lettering Fino", family: "Caveat", href: "Caveat:wght@400;700" },
  { group: "Caligrafía Clásica", family: "Alex Brush", href: "Alex+Brush:wght@400" },
  { group: "Firma Elegante", family: "Tangerine", href: "Tangerine:wght@400;700" },
  { group: "Letras Manuales", family: "Amatic SC", href: "Amatic+SC:wght@400;700" },
  { group: "Lettering Bold", family: "Lobster", href: "Lobster:wght@400" },
  { group: "Script Dinámico", family: "Kaushan Script", href: "Kaushan+Script:wght@400" },
  { group: "Caligrafía Gruesa", family: "Cookie", href: "Cookie:wght@400" },
  { group: "Escritura Natural", family: "Shadows Into Light", href: "Shadows+Into+Light:wght@400" },
  { group: "Letra Monolineal", family: "Yellowtail", href: "Yellowtail:wght@400" },
  { group: "Pincel Expresivo", family: "Leckerli One", href: "Leckerli+One:wght@400" },
  { group: "Marcador", family: "Permanent Marker", href: "Permanent+Marker:wght@400" },
  { group: "Letra de Tiza", family: "Rock Salt", href: "Rock+Salt:wght@400" },
  { group: "Script Vintage", family: "Sacramento", href: "Sacramento:wght@400" },
  { group: "Escritura Casual", family: "Handlee", href: "Handlee:wght@400" },
  { group: "Gótica Medieval", family: "Pirata One", href: "Pirata+One:wght@400" },
  { group: "Gótica Moderna", family: "UnifrakturMaguntia", href: "UnifrakturMaguntia:wght@400" },
  { group: "Pincel Dinámico", family: "Merienda", href: "Merienda:wght@400;700" },
  { group: "Serif Editorial", family: "Playfair Display", href: "Playfair+Display:wght@400;700" },
  { group: "Sans Condensada", family: "Oswald", href: "Oswald:wght@400;700" },
  { group: "Serif Literaria", family: "Lora", href: "Lora:wght@400;700" },
  { group: "Sans Geométrica", family: "Space Grotesk", href: "Space+Grotesk:wght@400;700" },
  { group: "Sans Moderna", family: "Outfit", href: "Outfit:wght@300;400;700" },
  { group: "Monoespaciada", family: "JetBrains Mono", href: "JetBrains+Mono:wght@400;700" }
];

export const PRESET_COLORS = [
  "#000000", "#FFFFFF", "#FF6B6B", "#FBBF24", "#34D399", "#3B82F6", "#5A4AD2", "#9333EA"
];

const fontLoadPromises = new Map<string, Promise<void>>();
const queuedFontFamilies = new Set<string>();
let queuedFontFrame: number | null = null;

function ensureFontPreconnect() {
  if (document.getElementById('gdl-font-preconnect')) return;

  const preconnect = document.createElement('link');
  preconnect.id = 'gdl-font-preconnect';
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://fonts.gstatic.com';
  preconnect.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect);
}

function fontLinkId(fontFamilies: string[]) {
  return `gdl-font-batch-${fontFamilies
    .map((family) => family.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
    .join('-')}`;
}

async function waitForStylesheet(link: HTMLLinkElement, label: string) {
  await new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error(`Timed out loading stylesheet for ${label}`));
    }, 4000);

    const settle = (callback: () => void) => {
      window.clearTimeout(timeoutId);
      callback();
    };

    link.addEventListener('load', () => settle(resolve), { once: true });
    link.addEventListener(
      'error',
      () => settle(() => reject(new Error(`Failed to load stylesheet for ${label}`))),
      { once: true }
    );
  });
}

export const loadFonts = async (fontFamilies: string[]) => {
  if (typeof document === 'undefined') return;

  const uniqueFamilies = [...new Set(fontFamilies)];
  const existingPromises: Promise<void>[] = [];
  const pendingDefs = [];

  for (const family of uniqueFamilies) {
    const fontDef = FONTS.find((font) => font.family === family);
    if (!fontDef) continue;

    const existing = fontLoadPromises.get(family);
    if (existing) {
      existingPromises.push(existing);
    } else {
      pendingDefs.push(fontDef);
    }
  }

  let batchPromise: Promise<void> | null = null;

  if (pendingDefs.length > 0) {
    const families = pendingDefs.map((font) => font.family);
    const linkId = fontLinkId(families);

    batchPromise = (async () => {
      let stylesheet = document.getElementById(linkId) as HTMLLinkElement | null;

      try {
        ensureFontPreconnect();
        if (!stylesheet) {
          stylesheet = document.createElement('link');
          stylesheet.id = linkId;
          stylesheet.rel = 'stylesheet';
          stylesheet.href =
            `https://fonts.googleapis.com/css2?${pendingDefs
              .map((font) => `family=${font.href}`)
              .join('&')}&display=swap`;

          const stylesheetReady = waitForStylesheet(stylesheet, families.join(', '));
          document.head.appendChild(stylesheet);
          await stylesheetReady;
        }

        await Promise.all(
          families.map((family) => document.fonts.load(`16px "${family}"`))
        );
      } catch (error) {
        for (const family of families) {
          fontLoadPromises.delete(family);
        }
        stylesheet?.remove();
        console.error('Failed to load fonts', families, error);
      }
    })();

    for (const family of families) {
      fontLoadPromises.set(family, batchPromise);
    }
  }

  await Promise.all([
    ...existingPromises,
    ...(batchPromise ? [batchPromise] : []),
  ]);
};

export const queueFonts = (fontFamilies: string[]) => {
  if (typeof window === 'undefined') return;

  for (const family of fontFamilies) {
    queuedFontFamilies.add(family);
  }

  if (queuedFontFrame !== null) return;

  queuedFontFrame = window.requestAnimationFrame(() => {
    queuedFontFrame = null;
    const families = [...queuedFontFamilies];
    queuedFontFamilies.clear();
    void loadFonts(families);
  });
};

export const loadFont = async (fontFamily: string) => {
  await loadFonts([fontFamily]);
};
