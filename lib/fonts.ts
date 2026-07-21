import { useEffect } from 'react';

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
  { group: "Pincel Dinámico", family: "Merienda", href: "Merienda:wght@400;700" }
];

export const PRESET_COLORS = [
  "#000000", "#FFFFFF", "#FF6B6B", "#FBBF24", "#34D399", "#3B82F6", "#5A4AD2", "#9333EA"
];

export const loadFont = async (fontFamily: string): Promise<void> => {
  const fontDef = FONTS.find(f => f.family === fontFamily);
  if (!fontDef) return;

  // Ensure the stylesheet for this font is appended to the document
  const linkId = `google-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontDef.href}&display=swap`;
    document.head.appendChild(link);
    
    // Wait for the stylesheet to load
    await new Promise<void>((resolve) => {
      link.onload = () => resolve();
      link.onerror = () => resolve();
      setTimeout(resolve, 800); // safety timeout
    });
  }

  try {
    await document.fonts.load(`16px "${fontFamily}"`);
    await document.fonts.ready;
  } catch(e) {
    console.error("Failed to load font", fontFamily, e)
  }
};
