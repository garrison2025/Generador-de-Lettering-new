import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenTool, ArrowRight, Type } from 'lucide-react';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';
import { GeoAnswerBlock } from '../components/GeoAnswerBlock';
import { EDITOR_DEFAULT_STATE, useEditorStore } from '@/store/useEditorStore';
import { useVisibleFonts } from '../hooks/useVisibleFonts';
import { copyText } from '../utils/copyText';

const PAIRINGS = [
  {
    title: 'Elegante & Moderno',
    primaryFont: 'Playfair Display',
    primaryClass: 'font-serif text-4xl',
    secondaryFont: 'system-ui',
    secondaryClass: 'font-sans text-sm tracking-wide text-gray-500 uppercase',
    preview: 'Lettering Digital'
  },
  {
    title: 'Impacto & Precisión',
    primaryFont: 'Oswald',
    primaryClass: 'font-sans text-4xl uppercase tracking-tighter',
    secondaryFont: 'Lora',
    secondaryClass: 'font-serif text-sm italic text-gray-600',
    preview: 'CALIGRAFÍA'
  },
  {
    title: 'Tecnológico & Estructurado',
    primaryFont: 'Space Grotesk',
    primaryClass: 'font-sans text-4xl font-black',
    secondaryFont: 'JetBrains Mono',
    secondaryClass: 'font-mono text-xs text-gray-500',
    preview: 'Diseño Digital'
  },
  {
    title: 'Suave & Amigable',
    primaryFont: 'Outfit',
    primaryClass: 'font-sans text-4xl font-bold',
    secondaryFont: 'Outfit',
    secondaryClass: 'font-sans text-sm text-gray-600 font-light',
    preview: 'Trazos Finos'
  },
  {
    title: 'Retro & Clásico',
    primaryFont: 'Lobster',
    primaryClass: 'text-4xl',
    secondaryFont: 'system-ui',
    secondaryClass: 'font-sans text-sm text-gray-600',
    preview: 'Estilo Vintage'
  },
  {
    title: 'Monocromo & Minimalista',
    primaryFont: 'JetBrains Mono',
    primaryClass: 'font-mono text-3xl font-bold uppercase tracking-tight',
    secondaryFont: 'system-ui',
    secondaryClass: 'font-sans text-sm text-gray-500',
    preview: 'Minimalismo'
  }
];

type PairingDefinition = (typeof PAIRINGS)[number];

function cssFontStack(family: string): string {
  if (family === 'system-ui') return 'system-ui, sans-serif';
  const fallback = ['Playfair Display', 'Lora'].includes(family)
    ? 'Georgia, serif'
    : family === 'JetBrains Mono'
      ? 'monospace'
      : family === 'Lobster'
        ? 'cursive'
        : 'Arial, sans-serif';
  return `"${family}", ${fallback}`;
}

function pairingCss(pairing: PairingDefinition, titleSize: number, subtitleSize: number): string {
  return [
    '/* ' + pairing.title + ' — carga las fuentes en tu proyecto antes de usarlas. */',
    '.lettering-title {',
    '  font-family: ' + cssFontStack(pairing.primaryFont) + ';',
    '  font-size: ' + titleSize + 'px;',
    '  line-height: 1.15;',
    '}',
    '',
    '.lettering-subtitle {',
    '  font-family: ' + cssFontStack(pairing.secondaryFont) + ';',
    '  font-size: ' + subtitleSize + 'px;',
    '  line-height: 1.5;',
    '}',
  ].join('\\n');
}

function PairingCard({
  pairing,
  customText,
  secondaryText,
  fontSize,
  subtitleSize,
  onTry,
}: {
  pairing: PairingDefinition;
  customText: string;
  secondaryText: string;
  fontSize: number;
  subtitleSize: number;
  onTry: (pairing: PairingDefinition) => void;
}) {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const snippet = pairingCss(pairing, fontSize, subtitleSize);

  const handleCopyCSS = async () => {
    const copied = await copyText(snippet);
    setCopyFailed(!copied);
    setCopiedSnippet(copied ? snippet : null);
  };

  const previewRef = useVisibleFonts<HTMLDivElement>(
    [pairing.primaryFont, pairing.secondaryFont],
    '120px 0px'
  );

  return (
    <div
      ref={previewRef}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 p-8 flex flex-col gap-6 group"
    >
      <div className="flex justify-between items-center pb-4 border-b border-gray-50">
        <span className="font-bold text-[#5A4AD2] tracking-tight">{pairing.title}</span>
        <div className="text-right">
          <span className="block text-xs font-bold text-gray-900">{pairing.primaryFont}</span>
          <span className="block text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">
            {pairing.secondaryFont === 'system-ui' ? 'Sistema' : pairing.secondaryFont}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4 py-4 overflow-hidden">
        <h2
          className={`${pairing.primaryClass.replace(/text-\dxl/g, '')} leading-tight break-words w-full transition-all duration-100`}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: pairing.primaryFont,
          }}
        >
          {customText || pairing.preview}
        </h2>
        <p
          className={`${pairing.secondaryClass} line-clamp-3 break-words`}
          style={{ fontFamily: pairing.secondaryFont, fontSize: `${subtitleSize}px`, lineHeight: 1.5 }}
        >
          {secondaryText || 'Una frase breve ayuda a comparar cómo se lee una segunda tipografía.'}
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => onTry(pairing)}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-indigo-700 hover:text-[#5A4AD2] transition w-fit"
        >
          Probar {pairing.primaryFont} en el Editor
          <ArrowRight className="w-4 h-4" />
        </button>
        <details className="min-w-0 max-w-full rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
          <summary className="cursor-pointer text-sm font-bold text-indigo-800">
            Ver CSS de esta combinación
          </summary>
          <p className="mt-3 text-xs leading-relaxed text-gray-700">
            Código orientativo para una web: establece las fuentes y tamaños de ambos textos.
            Debes cargar cada fuente en tu proyecto por separado; copiar este CSS no la instala.
          </p>
          <pre className="mt-3 max-w-full overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-white p-3 font-mono text-xs leading-relaxed text-gray-800" aria-label={`CSS de ${pairing.title}`}>
            <code>{snippet}</code>
          </pre>
          <button
            type="button"
            onClick={handleCopyCSS}
            className="mt-3 min-h-11 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-800"
            aria-label={`Copiar CSS de ${pairing.title}`}
          >
            {copiedSnippet === snippet ? 'CSS copiado' : 'Copiar CSS'}
          </button>
          {copyFailed && (
            <p role="status" className="mt-2 text-xs text-gray-700">
              No se pudo copiar automáticamente. Selecciona el CSS del bloque y cópialo manualmente.
            </p>
          )}
        </details>
      </div>
    </div>
  );
}

const pairingSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Combinador de Fuentes",
  "url": "https://generadordelettering.org/herramientas/combinador-de-fuentes",
  "description": "Prueba combinaciones tipográficas, cambia el texto de ejemplo y lleva la fuente principal al editor de lettering.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

const pairingBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://generadordelettering.org/" },
    { "@type": "ListItem", "position": 2, "name": "Herramientas", "item": "https://generadordelettering.org/herramientas" },
    { "@type": "ListItem", "position": 3, "name": "Combinador de Fuentes", "item": "https://generadordelettering.org/herramientas/combinador-de-fuentes" }
  ]
};

export default function CombinadorFuentes() {
  const [customText, setCustomText] = useState('');
  const [secondaryText, setSecondaryText] = useState('Una frase breve para comprobar legibilidad.');
  const [fontSize, setFontSize] = useState(36);
  const [subtitleSize, setSubtitleSize] = useState(16);
  const updateState = useEditorStore((state) => state.updateState);
  const navigate = useNavigate();

  const tryPrimaryFont = (pairing: (typeof PAIRINGS)[number]) => {
    updateState({
      ...EDITOR_DEFAULT_STATE,
      fontFamily: pairing.primaryFont,
      fontSize,
      text: customText.trim() || pairing.preview,
    });
    navigate('/editor');
  };

  return (
    <>
      <SEO 
        title="Combinador de Fuentes y Tipografías | Diseños de Texto"
        description="Compara 6 pares de fuentes con titular y subtítulo personalizables, ajusta los tamaños, copia el CSS o abre la fuente principal en el editor."
        keywords="combinar fuentes, tipografias que combinan, diseño de texto, emparejar letras"
        canonical="https://generadordelettering.org/herramientas/combinador-de-fuentes"
        jsonSchema={[pairingSchema, pairingBreadcrumbSchema]}
      />
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
        <Link to="/" className="hover:text-[#5A4AD2] transition-colors">Inicio</Link>
        <span>/</span>
        <Link to="/herramientas" className="hover:text-[#5A4AD2] transition-colors">Herramientas</Link>
        <span>/</span>
        <span className="text-gray-900">Combinador de Fuentes</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Combinador de Fuentes</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Prueba pares de tipografías con tu propio texto y compara cómo se ve una fuente principal junto a una secundaria antes de llevar la principal al editor.
        </p>
        
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:flex-wrap items-center gap-6">
          <div className="w-full md:flex-1 relative">
            <input 
              type="text"
              aria-label="Texto de prueba para combinar fuentes"
              placeholder="Escribe tu texto de prueba..."
              value={customText}
              onChange={(e) => setCustomText(Array.from(e.target.value).slice(0, 90).join(''))}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#5A4AD2] outline-none transition font-medium"
            />
            <Type className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <div className="w-full md:w-48 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tamaño</label>
              <span className="text-[10px] text-gray-900 font-mono font-bold bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{fontSize}px</span>
            </div>
            <input
              type="range"
              aria-label="Tamaño de la vista previa"
              value={fontSize}
              onChange={(event) => setFontSize(Number(event.target.value))}
              min={16}
              max={72}
              step={1}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#5A4AD2]"
            />
          </div>
          <div className="w-full md:basis-full border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-[1fr_12rem] gap-4 items-end">
            <label className="block text-left">
              <span className="block mb-2 text-xs font-bold uppercase tracking-wide text-gray-600">Texto secundario</span>
              <input
                type="text"
                aria-label="Subtítulo para combinar fuentes"
                value={secondaryText}
                onChange={(event) => setSecondaryText(Array.from(event.currentTarget.value).slice(0, 160).join(''))}
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-[#5A4AD2] outline-none"
                placeholder="Escribe el subtítulo..."
              />
            </label>
            <div className="w-full">
              <div className="mb-2 flex justify-between items-center">
                <label htmlFor="subtitle-size" className="text-xs font-bold uppercase tracking-wide text-gray-600">Tamaño secundario</label>
                <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs font-bold text-gray-800">{subtitleSize}px</span>
              </div>
              <input
                id="subtitle-size"
                type="range"
                aria-label="Tamaño del subtítulo"
                min={12}
                max={28}
                step={1}
                value={subtitleSize}
                onChange={(event) => setSubtitleSize(Number(event.currentTarget.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#5A4AD2]"
              />
            </div>
          </div>
        </div>
      </div>

      <GeoAnswerBlock
        id="combinador-fuentes"
        answer={
          <>
            El combinador muestra <strong>pares tipográficos de ejemplo</strong> para comparar jerarquía, contraste y legibilidad.
            Puedes personalizar titular y subtítulo, comparar tamaños, copiar el CSS de cada propuesta y
            enviar la fuente principal al editor para seguir diseñando.
          </>
        }
        facts={[
          { label: 'Qué compara', value: 'Una fuente principal y una secundaria en el mismo ejemplo.' },
          { label: 'Qué puedes cambiar', value: 'Titular, subtítulo y tamaño de cada nivel.' },
          { label: 'Salida', value: 'Vista previa editable y CSS de ejemplo para los dos niveles.' },
          { label: 'Criterio', value: 'Las combinaciones son sugerencias visuales, no reglas tipográficas universales.' },
        ]}
        limitation="El CSS copiado no descarga ni instala las fuentes; debes cargarlas aparte en tu proyecto. La legibilidad depende del idioma, tamaño y contexto: compara con el texto real."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {PAIRINGS.map((pairing) => (
          <PairingCard
            key={pairing.title}
            pairing={pairing}
            customText={customText}
            secondaryText={secondaryText}
            fontSize={fontSize}
            subtitleSize={subtitleSize}
            onTry={tryPrimaryFont}
          />
        ))}
      </div>

      <section aria-labelledby="font-pairing-method" className="mt-12 rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
        <h2 id="font-pairing-method" className="text-2xl font-bold text-gray-900">Cómo elegir un par tipográfico que funcione</h2>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 text-sm text-gray-700 leading-relaxed">
          <div>
            <h3 className="font-bold text-gray-900">1. Comprueba la jerarquía</h3>
            <p className="mt-2">Escribe el mismo título y subtítulo en las seis tarjetas. Baja el tamaño del titular para ver si las dos líneas siguen distinguiéndose.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">2. Prueba el texto verdadero</h3>
            <p className="mt-2">Incluye tildes, eñes y palabras largas. Observa el espacio interior de las letras y cómo se comporta la combinación en móvil.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">3. Copia solo lo necesario</h3>
            <p className="mt-2">El CSS generado conserva la familia y los tamaños del par. Necesitarás cargar las fuentes y comprobar licencias según el uso final.</p>
          </div>
        </div>
        <p className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm leading-relaxed text-gray-700">
          <strong>Ejemplo:</strong> para una invitación, compara un encabezado con Playfair Display y un subtítulo sencillo.
          Si el título resulta demasiado decorado en pantalla pequeña, reduce el tamaño o prueba otra pareja.
          Puedes enviar el titular al editor, pero esa acción no crea un bloque de dos textos en el lienzo.
        </p>
      </section>

      <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-center sm:text-left sm:flex items-center justify-between shadow-xl">
        <div className="mb-6 sm:mb-0 max-w-xl">
          <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Combina tus propias fuentes</h2>
          <p className="text-gray-300 text-lg">
            Nuestro editor principal incluye decenas de fuentes gratuitas. Entra ahora y experimenta hasta encontrar tu pareja ideal.
          </p>
        </div>
        <Link to="/editor" className="inline-flex items-center justify-center gap-2 bg-[#FACC15] text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition shadow-lg whitespace-nowrap w-full sm:w-auto">
          <PenTool className="w-5 h-5" />
          Ir al Generador Visual
        </Link>
      </div>

      <RelatedTools currentPath="/herramientas/combinador-de-fuentes" />
    </div>
    </>
  );
}
