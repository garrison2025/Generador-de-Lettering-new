import { copyText } from '../utils/copyText';
import { useState, useDeferredValue, useMemo } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';
import { FONT_MAPS, DECORATORS } from '../data/unicodeStyles';

const STYLES = [
  // Mapped Fonts
  { id: 'cursiva', name: 'Cursiva Mágica' },
  { id: 'cursiva_bold', name: 'Cursiva Intensa' },
  { id: 'gotica', name: 'Gótica Clásica' },
  { id: 'gotica_bold', name: 'Gótica Intensa' },
  { id: 'doble', name: 'Doble Trazo (Outline)' },
  { id: 'sans', name: 'Sans Normal' },
  { id: 'sans_bold', name: 'Sans Negrita' },
  { id: 'sans_italic', name: 'Sans Cursiva' },
  { id: 'sans_bold_italic', name: 'Sans Cursiva Negrita' },
  { id: 'serif_italic', name: 'Serif Cursiva' },
  { id: 'serif_bold', name: 'Serif Negrita' },
  { id: 'serif_bold_italic', name: 'Serif Negrita Cursiva' },
  { id: 'burbujas', name: 'Burbujas Claras' },
  { id: 'burbujas_negra', name: 'Burbujas Oscuras' },
  { id: 'cuadrados', name: 'Cuadrados Claros' },
  { id: 'cuadrados_negros', name: 'Cuadrados Oscuros' },
  { id: 'parentesis', name: 'Letras en Paréntesis' },
  { id: 'monospace', name: 'Monospace Espaciado' },
  { id: 'vaporwave', name: 'V A P O R W A V E' },
  { id: 'mini_sup', name: 'Mini Letras Arriba' },
  { id: 'mini_sub', name: 'Mini Letras Abajo' },
  { id: 'small_caps', name: 'Versalitas (Minúsculas Mayúsculas)' },
  { id: 'al_reves', name: 'Invertido (Boca Abajo)' },
  { id: 'espejo', name: 'Espejo' },
  { id: 'invertido_mayusculas', name: 'Espejo Loco' },
  { id: 'ruso', name: 'Falso Ruso (Cyrillic)' },
  { id: 'griego', name: 'Falso Griego' },
  { id: 'arabe', name: 'Falso Árabe' },
  { id: 'hebreo', name: 'Falso Hebreo' },
  { id: 'asiatico', name: 'Letras Asiáticas' },
  { id: 'runas', name: 'Letras Rúnicas' },
  { id: 'hacker', name: 'Leetspeak (Hacker)' },
  
  // Modifiers 
  { id: 'tachado', name: 'Tachado Simple' },
  { id: 'cruz_tachado', name: 'Tachado con Cruces' },
  { id: 'slash_corto', name: 'Tachado Corto (Slash)' },
  { id: 'tilde_tachado', name: 'Tachado Ondulado' },
  { id: 'subrayado', name: 'Subrayado Simple' },
  { id: 'subrayado_doble', name: 'Subrayado Doble' },
  { id: 'raya_arriba', name: 'Raya Superior' },
  { id: 'flecha_abajo', name: 'Flechas Debajo' },
  { id: 'puntos_abajo', name: 'Puntos Inferiores' },
  { id: 'triangulitos', name: 'Triángulos Inferiores' },
  { id: 'gaviotas', name: 'Gaviotas Inferiores' },
  
  // Zalgo Styles
  { id: 'zalgo_mini', name: 'Zalgo Suave' },
  { id: 'zalgo_inferno', name: 'Zalgo Extremo' },

  // Wrappers
  { id: 'cruz_wrapper', name: 'Adorno Floral ꧁ ꧂' },
  { id: 'flechas_wrapper', name: 'Adorno Flechas « »' },
  { id: 'corazones_wrapper', name: 'Adorno Corazones ♥' },
  { id: 'fuego_wrapper', name: 'Adorno Fuego 🔥' },
  { id: 'brackets', name: 'Cajas Brackets 【】' },
  
  // Joins & Decorators
  { id: 'espacios', name: 'E S P A C I O S' },
  { id: 'ondas', name: 'Onditas (﹏)' },
  { id: 'puntos', name: 'Punteado (•)' },
  { id: 'asteriscos', name: 'Asteriscos (*)' },
  { id: 'slash', name: 'Slassh ( / )' },
  { id: 'estrellas', name: 'Estrellitas (✨)' },
  { id: 'corazones', name: 'Corazones (💙)' },
  { id: 'corazon_roto', name: 'Corazón Roto (💔)' },
  { id: 'diamantes', name: 'Diamantes Blancos (♢)' },
  { id: 'diamantes_negros', name: 'Diamantes Negros (♦)' },
  { id: 'flores', name: 'Florcitas (❀)' },
  { id: 'cruces', name: 'Cruces (✝)' },
  { id: 'musica', name: 'Música (♫)' },
  { id: 'flechas', name: 'Flechas (↬)' },
  { id: 'rayos', name: 'Rayos Vintage (ϟ)' },
  { id: 'dioses', name: 'Dioses (⚡)' },
  { id: 'luna', name: 'Lunitas (☾)' },
  { id: 'fuego', name: 'A Fuego (🔥)' },
  { id: 'mariposas', name: 'Mariposas (🦋)' },
  { id: 'nieves', name: 'Nevado (❄)' },
  { id: 'coronitas', name: 'Coronitas VIP (👑)' },
  { id: 'armas', name: 'Pistolas (︻╦╤─)' },
];

function convertText(text: string, styleId: string) {
  if (!text) return '';
  
  let result = text;

  // Appply mapped fonts
  if (FONT_MAPS[styleId]) {
    const map = FONT_MAPS[styleId];
    result = Array.from(result).map(char => {
      if (styleId === 'al_reves' || styleId === 'espejo' || styleId === 'invertido_mayusculas') {
        const mapped = map[char] || map[char.toLowerCase()] || char;
        return mapped;
      }
      return map[char] || char;
    }).join('');
    
    // Si es al revés o espejo, el texto completo también se invierte
    if (styleId === 'al_reves' || styleId === 'espejo' || styleId === 'invertido_mayusculas') {
      result = Array.from(result).reverse().join('');
    }
  }

  // Apply decorators (modifiers & joins)
  if (DECORATORS[styleId]) {
    const dec = DECORATORS[styleId];
    
    if (dec.modifier) {
      result = Array.from(result).map((char) => /\s/u.test(char) ? char : char + dec.modifier).join('');
    }
    
    if (dec.join) {
      result = Array.from(result).join(dec.join);
    }
    
    if (dec.pre || dec.post) {
      result = `${dec.pre || ''}${result}${dec.post || ''}`;
    }
    
    if (dec.reverse) {
      result = Array.from(result).reverse().join('');
    }
  }

  return result;
}

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Conversor de Letras Online",
  "url": "https://generadordelettering.org/herramientas/conversor-texto",
  "description": "Conversor de letras y texto Unicode con más de 50 estilos para copiar y pegar en redes sociales.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://generadordelettering.org/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Herramientas",
      "item": "https://generadordelettering.org/herramientas"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Conversor de Letras",
      "item": "https://generadordelettering.org/herramientas/conversor-texto"
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿En qué se diferencian estas letras raras y copy paste de otras?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nuestro conversor de texto reúne más de 50 estilos y transformaciones Unicode en una sola herramienta. Te permite cambiar el tipo de letra normal a negrita, cursivas, góticas, tachadas, al revés y letras especiales de burbujas en un solo clic. Reunimos los estilos en una sola lista para que puedas comparar muchas opciones sin cambiar de herramienta."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo copiar letras al revés, tachadas o subrayadas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dentro de la herramienta, escribe tu frase y fíjate en las últimas opciones de la lista. Verás estilos creativos como 'Al revés', 'Tachado (Strikethrough)' y 'Subrayado'. Solo da un toque encima de la tarjeta que te guste, ¡y listo! Se habrá copiado para publicarlo inmediatamente en Facebook, WhatsApp, Discord o Twitter."
      }
    },
    {
      "@type": "Question",
      "name": "¿Es malo usar tipos de letra diferentes en perfiles y biografías?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En absoluto. Personalizar tu biografía de Instagram o nombre de usuario de TikTok usando letras 'copy and paste' es una manera excelente de destacar y mostrar personalidad. Solo asegúrate de que siga siendo legible. Te recomendamos usar las letras cursivas elegantes (script) o letras pequeñas si quieres un estilo 'clean' u ordenado."
      }
    },
    {
      "@type": "Question",
      "name": "¿Necesito descargar fuentes (TTF u OTF)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No necesitas instalar archivos TTF u OTF para generar o copiar estos estilos: se basan en caracteres Unicode. Muchos dispositivos modernos pueden mostrarlos directamente, aunque algunos símbolos pueden verse distintos o aparecer como cuadros si la aplicación, el sistema o la fuente disponible no incluye ese carácter."
      }
    }
  ]
};

export default function ConversorTexto() {
  const [inputText, setInputText] = useState('Lettering Mágico');
  const deferredInput = useDeferredValue(inputText);
  const inputCharacterCount = Array.from(inputText).length;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const convertedStyles = useMemo(
    () => STYLES.map((style) => ({
      ...style,
      converted: convertText(deferredInput || 'Escribe algo', style.id),
    })),
    [deferredInput]
  );

  const copyToClipboard = async (text: string, id: string) => {
    if (!(await copyText(text))) {
      window.alert('No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.');
      return;
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId((current) => current === id ? null : current), 2000);
  };

  return (
    <>
      <SEO 
        title="Conversor de Letras Online | +50 Fuentes para Copiar y Pegar"
        description="Cambia tu texto a más de 50 estilos Unicode: cursivas, góticas, negritas y letras raras listas para copiar y pegar. Gratis y sin registro."
        keywords="conversor de letras, cambiar tipo de letra, conversor texto online, letras raras copy paste"
        canonical="https://generadordelettering.org/herramientas/conversor-texto"
        jsonSchema={[faqSchema, softwareSchema, breadcrumbSchema]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
        <Link to="/" className="hover:text-[#5A4AD2] transition-colors">Inicio</Link>
        <span>/</span>
        <Link to="/herramientas" className="hover:text-[#5A4AD2] transition-colors">Herramientas</Link>
        <span>/</span>
        <span className="text-gray-900" aria-current="page">Conversor de Letras</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Conversor de Letras Online</h1>
        <p className="text-lg text-gray-600">
          Cambia el tipo de letra de tu texto con más de 50 estilos Unicode: cursivas, góticas, negritas, letras raras y otras variantes listas para copiar y pegar.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600">
          <span className="rounded-full bg-gray-100 px-3 py-1.5">
            Ideal para comparar rápidamente muchas variantes Unicode
          </span>
          <Link
            to="/herramientas/conversor-letras-bonitas"
            className="font-semibold text-[#5A4AD2] hover:underline"
          >
            ¿Buscas estilos aesthetic y decoraciones para redes? Ver Letras Bonitas →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 mb-8">
        <div className="flex justify-between items-end mb-3">
          <label htmlFor="text-input" className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Escribe tu texto aquí:</label>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{inputCharacterCount}/500 caracteres · {inputText.split(/\s+/).filter(w => w.length > 0).length} palabras</span>
        </div>
        <div className="relative">
          <textarea
            id="text-input"
            value={inputText}
            onChange={(e) => setInputText(Array.from(e.target.value).slice(0, 500).join(''))}
            className="w-full h-32 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#5A4AD2] outline-none resize-none text-xl font-medium pr-12 transition-all shadow-inner placeholder:text-gray-500"
            placeholder="Escribe algo increíble..."
          />
          {inputText && (
            <button 
              onClick={() => setInputText('')}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition"
              title="Borrar texto"
              aria-label="Borrar texto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {convertedStyles.map((style) => {
          const converted = style.converted;

          return (
            <div key={style.id} className="bg-white border text-center md:text-left border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 hover:border-[#5A4AD2]/50 transition-colors">
              <div className="w-full md:w-48 shrink-0">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{style.name}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xl md:text-2xl text-gray-900 truncate px-4 py-2 border-b md:border-b-0 border-gray-100 w-full" title={converted}>
                  {converted}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(converted, style.id)}
                aria-label={`Copiar estilo ${style.name}`}
                className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3 w-full md:w-auto rounded-xl font-bold transition-all shadow-sm hover:-translate-y-0.5 ${
                  copiedId === style.id 
                    ? 'bg-green-100 text-green-700 ring-2 ring-green-400 border-transparent' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-[#5A4AD2] hover:text-white hover:border-[#5A4AD2]'
                }`}
              >
                {copiedId === style.id ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copiar texto
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 text-center p-8 bg-gradient-to-br from-[#5A4AD2]/10 to-[#FF6B6B]/10 rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">¿Buscas crear imágenes o carteles?</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Este conversor solo funciona para texto en redes sociales. Si quieres diseñar imágenes de alta calidad con diferentes tipografías, colores, sombras y fondos, usa nuestro Editor Principal.
        </p>
        <Link to="/editor" className="inline-flex items-center gap-2 bg-[#5A4AD2] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#4F46E5] transition shadow-sm">
          Ir al Editor Principal
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <section className="mt-16 text-left space-y-8 bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Preguntas Frecuentes del Conversor de Letras</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿En qué se diferencian estas letras raras y copy paste de otras?</h3>
            <p className="text-gray-600 leading-relaxed">
              Nuestro conversor de texto reúne más de 50 estilos y transformaciones Unicode en una sola herramienta. Te permite <strong>cambiar el tipo de letra normal a negrita, cursivas, góticas, tachadas, al revés y letras especiales de burbujas</strong> en un solo clic. Reunimos más de 50 estilos en una sola lista para que puedas comparar muchas opciones sin cambiar de herramienta.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Cómo copiar letras al revés, tachadas o subrayadas?</h3>
            <p className="text-gray-600 leading-relaxed">
              Dentro de la herramienta, escribe tu frase y fíjate en las últimas opciones de la lista. Verás estilos creativos como "Al revés", "Tachado (Strikethrough)" y "Subrayado". Solo da un toque encima de la tarjeta que te guste, ¡y listo! Se habrá copiado para publicarlo inmediatamente en Facebook, WhatsApp, Discord o Twitter.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Es malo usar tipos de letra diferentes en perfiles y biografías?</h3>
            <p className="text-gray-600 leading-relaxed">
              En absoluto. Personalizar tu biografía de Instagram o nombre de usuario de TikTok usando letras "copy and paste" es una manera excelente de destacar y mostrar personalidad. Solo asegúrate de que siga siendo legible. Te recomendamos usar las <strong>letras cursivas elegantes (script)</strong> o <strong>letras pequeñas</strong> si quieres un estilo "clean" u ordenado.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Necesito descargar fuentes (TTF u OTF)?</h3>
            <p className="text-gray-600 leading-relaxed">
              No necesitas instalar archivos TTF u OTF para generar o copiar estos estilos: se basan en caracteres Unicode. Muchos dispositivos modernos pueden mostrarlos directamente, aunque algunos símbolos pueden verse distintos o aparecer como cuadros si la aplicación, el sistema o la fuente disponible no incluye ese carácter.
            </p>
          </div>
        </div>
      </section>

      <RelatedTools currentPath="/herramientas/conversor-texto" />
    </div>
    </>
  );
}
