import { copyText } from '../utils/copyText';
import { useState, useDeferredValue, useMemo } from 'react';
import { Copy, Check, Sparkles, PenTool, ChevronLeft } from 'lucide-react';
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
  if (!text) return 'Letras Bonitas';

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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo funciona el cambiador de letras bonitas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nuestro generador convierte tu texto normal a cientos de caracteres Unicode especiales. Simplemente necesitas ingresar tu frase en la caja de texto. Al instante te daremos muchísimas versiones diferentes como 'letras cursivas', 'letras raras', 'tachadas' y 'aesthetic'. Luego solo tienes que elegir la que te guste, copiarla y pegarla (copy/paste) en tus redes sociales."
      }
    },
    {
      "@type": "Question",
      "name": "¿En qué aplicaciones puedo pegar estas letras decoradas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las letras que generas aquí se pueden usar prácticamente en todas las redes sociales, incluyendo Biografías de Instagram, TikTok, Facebook (estados o perfil), Estados de WhatsApp, YouTube, X (Twitter), Discord, Twitch, Free Fire y Roblox. Los sistemas operativos (Android, iOS y Windows) soportan el estándar Unicode."
      }
    },
    {
      "@type": "Question",
      "name": "¿Puedo usar el conversor de letras para tatuajes o diseños?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "¡Por supuesto! Muchos usuarios usan las previsualizaciones góticas o cursivas caligráficas como referencia para sus bocetos de diseño o tatuajes. Si lo que buscas es una imagen final detallada, te sugerimos que además de copiar este texto, uses nuestra Herramienta de Lettering y Editor para personalizar sombras, bordes y el estilo visual completo."
      }
    },
    {
      "@type": "Question",
      "name": "¿Es gratis usar este generador de fuentes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No necesitas descargar, instalar aplicaciones ni registrarte. Las funciones disponibles actualmente se pueden utilizar gratis desde el navegador y permiten probar múltiples estilos aesthetic."
      }
    }
  ]
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Conversor y Generador de Letras Bonitas",
  "url": "https://generadordelettering.org/herramientas/conversor-letras-bonitas",
  "description": "Conversor de texto online gratuito para crear tipografías raras, góticas y cursivas para Instagram, TikTok y Whatsapp.",
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
      "name": "Conversor de Letras Bonitas",
      "item": "https://generadordelettering.org/herramientas/conversor-letras-bonitas"
    }
  ]
};

export default function ConversorLetrasBonitas() {
  const [inputText, setInputText] = useState('Letras hermosas');
  const deferredInput = useDeferredValue(inputText);
  const inputCharacterCount = Array.from(inputText).length;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const convertedStyles = useMemo(
    () => STYLES.map((style) => ({
      ...style,
      converted: convertText(deferredInput, style.id),
    })),
    [deferredInput]
  );

  const copyToClipboard = async (text: string, id: string) => {
    if (!(await copyText(text))) {
      window.alert('No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.');
      return;
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <SEO 
        title="Conversor de Letras Bonitas | Generador Aesthetic"
        description="Generador y convertidor de textos. Personaliza tus redes sociales con las letras más bonitas y elegantes para copiar y pegar donde quieras."
        keywords="letras bonitas, conversor de letras, generar letras, letras copy paste"
        canonical="https://generadordelettering.org/herramientas/conversor-letras-bonitas"
        jsonSchema={[
          faqSchema, 
          softwareSchema,
          {
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
                "name": "Conversor Letras Bonitas",
                "item": "https://generadordelettering.org/herramientas/conversor-letras-bonitas"
              }
            ]
          }
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 py-12 w-full">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
          <li>
            <Link to="/" className="hover:text-[#5A4AD2] transition-colors">Inicio</Link>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-gray-500">/</span>
            <Link to="/herramientas" className="hover:text-[#5A4AD2] transition-colors">Herramientas</Link>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-gray-500">/</span>
            <span className="text-gray-900" aria-current="page">Letras Bonitas</span>
          </li>
        </ol>
      </nav>

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-[#5A4AD2]" />
          <span className="text-[#5A4AD2] font-semibold tracking-wide uppercase text-sm">Herramienta Gratuita</span>
          <Sparkles className="w-6 h-6 text-[#5A4AD2]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">Conversor de Letras Bonitas</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Generador y convertidor de textos. Personaliza tus redes sociales con las <strong>letras más bonitas</strong> y elegantes para copiar y pegar donde quieras.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12">
        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <label htmlFor="text-input" className="block text-sm font-bold text-gray-800 uppercase tracking-wider">Tu Frase o Nombre:</label>
          <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">{inputCharacterCount} caracteres</span>
        </div>
        <div className="p-6 md:p-8">
          <div className="relative">
            <textarea
              id="text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-32 p-5 bg-white border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#5A4AD2] outline-none resize-none text-xl md:text-2xl font-medium pr-12 shadow-inner transition-colors placeholder:text-gray-500"
              placeholder="Escribe aquí para transformar tu letra..."
            />
            {inputText && (
              <button 
                onClick={() => setInputText('')}
                className="absolute top-4 right-4 text-gray-500 hover:text-[#5A4AD2] bg-gray-50 hover:bg-[#5A4AD2]/10 rounded-full p-2 transition-colors"
                title="Borrar todo"
                aria-label="Borrar texto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {convertedStyles.map((style) => {
          const converted = style.converted;
          const isCopied = copiedId === style.id;
          
          return (
            <div 
              key={style.id} 
              className={`bg-white border text-left rounded-xl p-5 flex flex-col justify-between gap-4 transition-all duration-200 group ${
                isCopied ? 'border-green-400 shadow-sm ring-1 ring-green-400' : 'border-gray-200 hover:border-[#5A4AD2] hover:shadow-md'
              }`}
            >
              <div className="flex-1 w-full overflow-hidden">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{style.name}</span>
                <p className="text-2xl text-gray-900 break-words w-full max-h-32 overflow-y-auto pr-2 custom-scrollbar" title={converted}>
                  {converted}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(converted, style.id)}
                aria-label={`Copiar estilo ${style.name}`}
                className={`w-full shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all ${
                  isCopied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-[#5A4AD2] hover:text-white hover:border-[#5A4AD2]'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-5 h-5" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="mt-16 bg-[#F8F9FC] border border-gray-200 rounded-2xl p-8 lg:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
          <div className="w-20 h-20 bg-white shrink-0 rounded-full flex items-center justify-center shadow-md border border-gray-100">
            <PenTool className="w-10 h-10 text-[#5A4AD2]" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">¿Prefieres diseñar un póster o imagen con letras bonitas?</h2>
            <p className="text-gray-600">
              Transforma estas letras en <strong>imágenes de alta calidad</strong>. Elige colores, gradientes, sombras y más usando nuestra herramienta de diseño tipográfico. Descarga gratis tu creación.
            </p>
          </div>
          <div>
            <Link to="/editor" className="inline-flex items-center justify-center gap-2 bg-[#5A4AD2] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#4F46E5] transition shadow-md hover:shadow-lg whitespace-nowrap w-full md:w-auto">
              Ir al Generador Visual
            </Link>
          </div>
        </div>
      </div>

      {/* Educational Article & Best Practices Section */}
      <article className="mt-16 bg-white rounded-3xl p-8 md:p-12 border border-gray-200/80 shadow-sm space-y-8 text-left">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">
            Guía Completa sobre el Conversor de Letras Bonitas y Fuentes Unicode
          </h2>
          <p className="text-gray-600 leading-relaxed">
            El <strong>Conversor de Letras Bonitas</strong> de Generador de Lettering es una herramienta diseñada para transformar texto estándar en más de 50 variantes tipográficas estéticas, letras cursivas, fuentes góticas, caracteres encerrados en círculos y decoraciones alfanuméricas. A diferencia de instalar archivos de fuentes TTF o OTF en tu dispositivo, los resultados generados aquí funcionan mediante caracteres del estándar internacional <strong>Unicode</strong>, lo que permite copiarlos y pegarlos directamente en perfiles de Instagram, biografías de TikTok, estados de WhatsApp, comentarios de YouTube y nicknames de juegos como Free Fire o Roblox.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#5A4AD2]/10 text-[#5A4AD2] flex items-center justify-center text-sm font-bold">1</span>
              ¿Qué es Unicode y cómo funcionan estas letras?
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              El consorcio Unicode asigna un código numérico único a miles de símbolos, alfabetos históricos y variantes tipográficas matemáticas (Mathematical Alphanumeric Symbols). Cuando escribes una letra normal como "A", nuestro conversor la mapea a su equivalente en alfabetos góticos (𝕬), cursivos (𝒜), en negrita (𝗔) o burbuja (Ⓐ). Por eso el sistema operativo no lo reconoce como una "fuente de sistema cambiada", sino como símbolos especiales válidos globalmente.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#5A4AD2]/10 text-[#5A4AD2] flex items-center justify-center text-sm font-bold">2</span>
              Clasificación de Estilos Disponibles
            </h3>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside">
              <li><strong>Letras Cursivas y Manuscritas:</strong> Ideales para frases poéticas, nombres de marca elegantes e invitaciones.</li>
              <li><strong>Letras Góticas y Fraktur:</strong> Perfectas para estética dark, metal, nicknames agresivos y tatuajes.</li>
              <li><strong>Circulares y Cuadradas (Burbujas):</strong> Geniales para destacar números, listas y llamadas a la acción.</li>
              <li><strong>Efectos Zalgo y Tachados:</strong> Utilizados en memes, estética glitch y formatos underground.</li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-6 text-gray-800 space-y-2">
          <h3 className="font-bold text-amber-900 text-lg flex items-center gap-2">
            💡 Recomendaciones de Accesibilidad y Lectores de Pantalla
          </h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            Las herramientas de asistencia visual y los lectores de pantalla (como TalkBack en Android o VoiceOver en iOS) interpretan las letras matemáticas especiales según su código Unicode (por ejemplo, leyendo "Alfabeto matemático cursivo A" en lugar de simplemente "A"). 
          </p>
          <p className="text-sm text-amber-800 leading-relaxed font-medium">
            <strong>Consejo Pro:</strong> Utiliza las letras bonitas decoradas para destacar tu nombre de usuario, palabras clave o títulos breves. Mantén el cuerpo principal de textos o párrafos largos en texto estándar para facilitar la lectura y reducir problemas de compatibilidad.
          </p>
        </div>
      </article>

      <section className="mt-12 text-left space-y-8 bg-purple-50/50 p-8 rounded-3xl border border-purple-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Preguntas Frecuentes sobre Letras Bonitas</h2>
          <p className="text-gray-600 mt-3">Aprende a transformar letras de texto normal en tipografías aesthetic, de manera fácil.</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Cómo funciona el cambiador de letras bonitas?</h3>
            <p className="text-gray-600 leading-relaxed">
              Nuestro generador convierte tu texto normal a cientos de caracteres Unicode especiales. Simplemente necesitas ingresar tu frase en la caja de texto. Al instante te daremos muchísimas versiones diferentes como "letras cursivas", "letras raras", "tachadas" y "aesthetic". Luego solo tienes que elegir la que te guste, copiarla y pegarla (copy/paste) en tus redes sociales.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿En qué aplicaciones puedo pegar estas letras decoradas?</h3>
            <p className="text-gray-600 leading-relaxed">
              Las letras que generas aquí se pueden usar prácticamente en todas las redes sociales, incluyendo <strong>Biografías de Instagram, TikTok, Facebook (estados o perfil), Estados de WhatsApp, YouTube, X (Twitter), Discord, Twitch, Free Fire y Roblox</strong>. Los sistemas operativos (Android, iOS y Windows) soportan el estándar Unicode.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Puedo usar el conversor de letras para tatuajes o diseños?</h3>
            <p className="text-gray-600 leading-relaxed">
              ¡Por supuesto! Muchos usuarios usan las previsualizaciones góticas o cursivas caligráficas como referencia para sus bocetos de diseño o tatuajes. Si lo que buscas es una imagen final detallada, te sugerimos que además de copiar este texto, uses nuestra <strong>Herramienta de Lettering y Editor</strong> para personalizar sombras, bordes y el estilo visual completo.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Es gratis usar este generador de fuentes?</h3>
            <p className="text-gray-600 leading-relaxed">
              No necesitas descargar, instalar aplicaciones ni registrarte. Las funciones disponibles actualmente se pueden utilizar gratis desde el navegador y permiten probar <strong>más de 50 estilos <em>aesthetic</em></strong>.
            </p>
          </div>
        </div>
      </section>

      <RelatedTools currentPath="/herramientas/conversor-letras-bonitas" />
    </div>
    </>
  );
}
