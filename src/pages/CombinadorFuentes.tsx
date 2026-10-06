import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenTool, ArrowRight, Type } from 'lucide-react';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';
import { loadFont } from '@/lib/fonts';
import { EDITOR_DEFAULT_STATE, useEditorStore } from '@/store/useEditorStore';

const PAIRINGS = [
  {
    title: 'Elegante & Moderno',
    primaryFont: 'Playfair Display',
    primaryClass: 'font-serif text-4xl',
    secondaryFont: 'Inter',
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
    secondaryFont: 'Inter',
    secondaryClass: 'font-sans text-sm text-gray-600',
    preview: 'Estilo Vintage'
  },
  {
    title: 'Monocromo & Minimalista',
    primaryFont: 'JetBrains Mono',
    primaryClass: 'font-mono text-3xl font-bold uppercase tracking-tight',
    secondaryFont: 'Inter',
    secondaryClass: 'font-sans text-sm text-gray-500',
    preview: 'Minimalismo'
  }
];

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
  const [fontSize, setFontSize] = useState(36);
  const updateState = useEditorStore((state) => state.updateState);
  const navigate = useNavigate();

  useEffect(() => {
    const families = new Set(PAIRINGS.flatMap((pairing) => [pairing.primaryFont, pairing.secondaryFont]));
    families.forEach((family) => {
      if (family !== 'Inter') void loadFont(family);
    });
  }, []);

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
        description="Explora combinaciones de fuentes perfectas para tus diseños. Inspiración tipográfica para caligrafía, lettering y maquetación web."
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
          Encuentra la pareja perfecta de tipografías para tus proyectos. Descubre combinaciones diseñadas para aportar jerarquía y armonía visual.
        </p>
        
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:flex-1 relative">
            <input 
              type="text"
              aria-label="Texto de prueba para combinar fuentes"
              placeholder="Escribe tu texto de prueba..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {PAIRINGS.map((pairing) => (
          <div key={pairing.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 p-8 flex flex-col gap-6 group">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <span className="font-bold text-[#5A4AD2] tracking-tight">{pairing.title}</span>
              <div className="text-right">
                <span className="block text-xs font-bold text-gray-900">{pairing.primaryFont}</span>
                <span className="block text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">{pairing.secondaryFont}</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-4 py-4 overflow-hidden">
              <h2 className={`${pairing.primaryClass.replace(/text-\dxl/g, '')} leading-tight truncate w-full transition-all duration-100`} style={{
                fontSize: `${fontSize}px`,
                fontFamily: pairing.primaryFont
              }}>
                {customText || pairing.preview}
              </h2>
              <p className={`${pairing.secondaryClass} text-sm line-clamp-2`} style={{
                fontFamily: pairing.secondaryFont
              }}>
                El arte de dibujar letras requiere paciencia, práctica y sobre todo, una excelente selección tipográfica para destacar el mensaje.
              </p>
            </div>

            <button
              type="button"
              onClick={() => tryPrimaryFont(pairing)}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#5A4AD2] transition w-fit group-hover:translate-x-1"
            >
              Probar {pairing.primaryFont} en el Editor
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
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
