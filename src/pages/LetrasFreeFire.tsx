import { useState, useEffect, useDeferredValue } from 'react';
import { Copy, Check, ChevronLeft, Dices } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const DECORATORS = [
  { prefix: '꧁ ༒ ', suffix: ' ༒ ꧂', name: 'Alas Divinas' },
  { prefix: '★彡 ', suffix: ' 彡★', name: 'Estrellas' },
  { prefix: '☠ ', suffix: ' ☠', name: 'Pirata' },
  { prefix: '๖ۣۜ', suffix: '๖ۣۜ', name: 'Dragón' },
  { prefix: 'ꪶ ', suffix: ' ꫂ', name: 'Floral' },
  { prefix: '【 ', suffix: ' 】', name: 'Corchete Pro' },
  { prefix: '『 ', suffix: ' 』', name: 'Samurai' },
  { prefix: '⚡ ', suffix: ' ⚡', name: 'Rayo' },
  { prefix: '╰‿╯ ', suffix: ' ╰‿╯', name: 'Demonio' },
  { prefix: '亗 ', suffix: ' 亗', name: 'Corona' },
  { prefix: '✿ ', suffix: ' ✿', name: 'Flor Sakura' },
  { prefix: '☂️ ', suffix: ' ☂️', name: 'Paraguas' },
  { prefix: 'メ ', suffix: ' メ', name: 'Katana' },
  { prefix: '×͜× ', suffix: '', name: 'Sonrisa Asesina' },
  { prefix: '❖ ', suffix: ' ❖', name: 'Diamante' },
  { prefix: 'ᴮᴼˢˢ ', suffix: '', name: 'Jefe' },
  { prefix: '✓ ', suffix: ' ✓', name: 'Verificado' }
];

const SYMBOLS = ['꧁', '꧂', '༒', '★', '彡', '☠', '๖ۣۜ', 'ꪶ', 'ꫂ', '【', '】', '『', '』', '⚡', '╰‿╯', '亗', '✿', '❀', '❖', 'ツ', 'ッ', 'シ', '☂', '☁', '☃', '☄', '✦', '✧', '✩', '✪', '✫', 'メ', '×͜×', '۞', 'ॐ', '༂', '༃', '™', '®', '©', 'ᴮᴼˢˢ', 'ᴳᵒᵈ', '♛', '♚'];

const BASES = ['Slayer', 'Ninja', 'Ghost', 'Demon', 'King', 'Queen', 'Shadow', 'Viper', 'Titan', 'Hunter', 'Sniper', 'Pro', 'God', 'Legend', 'Beast'];

const FONT_MAPS: Record<string, Record<string, string>> = {
  smallCaps: {
    'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
  },
  gothic: {
    'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥', 'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷',
    'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ'
  }
};

function applyFont(text: string, fontType: string) {
  if (fontType === 'normal') return text;
  const map = FONT_MAPS[fontType];
  if (!map) return text;
  return text.split('').map(char => map[char] || map[char.toLowerCase()] || char).join('');
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo crear un nombre que de miedo en Free Fire?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Para tener un nombre insano o que de miedo en Free Fire, recomendamos usar el estilo 'Letras Góticas' de nuestro conversor y combinarlo con adornos en los costados como cruces, armas (︻╦╤─) o caras japonesas. Ejemplos de nicks populares que usan esta estructura son aquellos que incluyen palabras oscuras como 'Dark', 'Ghost' o 'Muerte', envueltos en alas ꧁ ༒ ꧂."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo copiar letras y símbolos raros para FF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Es muy simple. Escribe la base de tu nombre en nuestro Creador de Letras para Free Fire, haz clic en tu diseño favorito para copiarlo automáticamente, abre el juego, ve a tu Perfil y presiona el lápiz de editar nombre, luego mantén presionado y selecciona 'Pegar'. Todos nuestros símbolos son aceptados por Garena."
      }
    },
    {
      "@type": "Question",
      "name": "¿Por qué algunos nombres de Free Fire no se aceptan o no caben?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En Free Fire, el límite máximo para un apodo/nombre (nick) es de 12 caracteres. Sin embargo, algunos símbolos especiales o adornos muy extensos ocupan más espacio interno que una letra de texto normal. Si el juego te indica un error, te sugerimos utilizar un estilo abreviado y reducir la longitud."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuáles son las letras para armas Free Fire?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Añadimos figuras como ︻╦╤─, ⌐╦╦═─ o pequeñas escopetas ASCII. Estas figuras, junto con las letras versalitas, dotan de gran estilo a clanes de e-sports o dúos competitivos. Descubre y combina estas opciones para ser el MVP."
      }
    }
  ]
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Nombres para Free Fire y Generador de Letras Insanas",
  "url": "https://generadordelettering.org/herramientas/letras-free-fire",
  "description": "Crea nombres insanos de Free Fire que den miedo con alas, símbolos y letras exclusivas para copiar y pegar en tu perfil y clanes.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function LetrasFreeFire() {
  const [inputText, setInputText] = useState('ProPlayer');
  const deferredInput = useDeferredValue(inputText);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    setTimeout(() => {
      setVisibleCount(DECORATORS.length * 3);
    }, 100);
  }, []);

  useEffect(() => {
    // Removed document.title
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSymbolClick = (symbol: string) => {
    setInputText(prev => (prev + symbol).slice(0, 12));
  };

  const generateRandomBase = () => {
    const randomBase = BASES[Math.floor(Math.random() * BASES.length)];
    const randomNumber = Math.floor(Math.random() * 999);
    setInputText(`${randomBase}${randomNumber}`.slice(0, 12));
  };

  return (
    <>
      <SEO 
        title="Generador de Nombres | Letras para Free Fire con Símbolos"
        description="Generador de nombres pro para Free Fire. Crea nicks épicos con alas, coronas, cruces y letras raras para destacar en el juego."
        keywords="letras para free fire, nombres para free fire, generador nombres free fire, simbolos free fire letras"
        canonical="https://generadordelettering.org/herramientas/letras-free-fire"
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
                "item": "https://generadordelettering.org/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Letras para Free Fire",
                "item": "https://generadordelettering.org/herramientas/letras-free-fire"
              }
            ]
          }
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 py-12 w-full">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
          <li>
            <Link to="/" className="hover:text-[#FACC15] transition-colors">Inicio</Link>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-gray-500">/</span>
            <span className="text-gray-900" aria-current="page">Letras para Free Fire</span>
          </li>
        </ol>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Generador de Letras para Free Fire</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Crea nombres épicos. Encuentra las mejores <strong>letras pro</strong> y <strong>símbolos para Free Fire</strong>, PUBG, Call of Duty o cualquier otro juego.
        </p>
      </div>

      <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-6 md:p-8 mb-8 text-white">
        <div className="flex justify-between items-center mb-3">
          <label htmlFor="nickname" className="block text-sm font-bold text-gray-300 uppercase tracking-wider">Tu Nickname Base:</label>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded hidden sm:block">{inputText.length} caracteres</span>
            <button 
              onClick={generateRandomBase}
              className="flex items-center gap-1.5 text-xs font-bold text-[#FACC15] hover:text-yellow-300 transition"
              title="Generar nombre aleatorio"
              aria-label="Generar nombre aleatorio"
            >
              <Dices className="w-4 h-4" />
              <span className="hidden sm:inline">Aleatorio</span>
            </button>
          </div>
        </div>
        <div className="relative mb-6">
          <input
            id="nickname"
            type="text"
            value={inputText}
            maxLength={12}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-0 focus:border-[#FACC15] outline-none text-xl md:text-2xl font-bold text-white pr-16 transition-colors placeholder:text-gray-600"
            placeholder="Ejemplo: Slayer..."
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className={`text-xs font-bold ${inputText.length >= 12 ? 'text-red-400' : 'text-gray-500'}`}>
              {inputText.length}/12
            </span>
            {inputText && (
              <button 
                onClick={() => setInputText('')}
                className="text-gray-500 hover:text-white transition"
                title="Borrar texto"
                aria-label="Borrar texto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>

        <div className="pb-2">
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Símbolos Rápidos (Clic para añadir):</p>
          <div className="flex flex-wrap gap-2">
            {SYMBOLS.map((sym, idx) => (
              <button
                key={idx}
                onClick={() => handleSymbolClick(sym)}
                className="w-10 h-10 bg-gray-800 hover:bg-[#FACC15] hover:text-gray-900 text-gray-300 rounded border border-gray-700 hover:border-[#FACC15] transition-colors font-bold text-lg flex items-center justify-center"
                aria-label={`Añadir símbolo ${sym}`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="bg-[#FACC15] w-2 h-6 inline-block rounded-sm"></span>
        Nombres Generados Generador de Lettering
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DECORATORS.flatMap(dec => [
          { ...dec, font: 'normal' },
          { ...dec, font: 'smallCaps' },
          { ...dec, font: 'gothic' }
        ]).slice(0, visibleCount).map((dec, idx) => {
          const appliedText = applyFont(deferredInput || 'Hero', dec.font);
          const fullName = `${dec.prefix}${appliedText}${dec.suffix}`;
          const isCopied = copiedId === fullName;
          
          return (
            <div key={idx} className="bg-white border text-center md:text-left border-gray-200 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-4 hover:border-[#FACC15] transition-colors hover:shadow-md group">
              <div className="flex-1 overflow-hidden w-full order-2 sm:order-1 flex items-center justify-center sm:justify-start min-h-[50px] relative">
                <p className="text-xl md:text-2xl text-gray-900 truncate px-2 font-medium pr-12" title={fullName}>
                  {fullName}
                </p>
                <span className={`absolute right-2 text-xs font-bold ${fullName.length > 12 ? 'text-red-500' : 'text-gray-500'}`}>
                  {fullName.length}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(fullName)}
                aria-label={`Copiar nombre ${fullName}`}
                className={`order-1 sm:order-2 shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 w-full sm:w-auto rounded-lg font-bold transition-all ${
                  isCopied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700 opacity-0 sm:opacity-100 group-hover:opacity-100 hover:bg-[#FACC15] hover:text-gray-900'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="sm:hidden">Copiar</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 p-8 bg-black text-white rounded-2xl border border-gray-800 text-center relative overflow-hidden">
         <h3 className="text-xl font-bold mb-4 text-[#FACC15] relative z-10">Consejo para Letras Pro</h3>
         <p className="text-gray-300 max-w-2xl mx-auto relative z-10">
           Algunos juegos tienen límite de caracteres. Al usar símbolos complejos y letras especiales (como LetrasPro, letras bonitas, etc), asegúrate de que el nombre final no exceda el límite permitido por el juego (usualmente 12 caracteres en Free Fire). Las alertas en rojo te avisarán.
         </p>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FACC15]/5 rounded-full blur-3xl z-0 pointer-events-none"></div>
      </div>

      {/* Cross link to Blog */}
      <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 text-center max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-2">🔥 ¿Buscas inspiración secreta?</h3>
        <p className="text-gray-700 text-sm mb-4">Descubre nuestro Top 10 con los mejores nombres insanos probados en torneos para causar terror a tus oponentes.</p>
        <Link to="/blog/mejores-nombres-insanos-free-fire" className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors text-sm">
          Leer la Guía de Nombres Insanos &rarr;
        </Link>
      </div>

      <section className="mt-16 text-left space-y-8 bg-yellow-50/50 p-8 rounded-3xl border border-yellow-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Preguntas Frecuentes sobre Nombres para Free Fire</h2>
          <p className="text-gray-600 mt-3">Resuelve tus dudas sobre cómo crear el mejor nick, letras insanas y clanes.</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Cómo crear un nombre que de miedo en Free Fire?</h3>
            <p className="text-gray-600 leading-relaxed">
              Para tener un nombre <strong>insano o que de miedo</strong> en Free Fire, recomendamos usar el estilo "Letras Góticas" de nuestro conversor y combinarlo con adornos en los costados como cruces, armas (︻╦╤─) o caras japonesas. Ejemplos de nicks populares que usan esta estructura son aquellos que incluyen palabras oscuras como "Dark", "Ghost" o "Muerte", envueltos en alas ꧁ ༒ ꧂.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Cómo copiar letras y símbolos raros para FF?</h3>
            <p className="text-gray-600 leading-relaxed">
              Es muy simple. Escribe la base de tu nombre en nuestro <strong>Creador de Letras para Free Fire</strong>, haz clic en tu diseño favorito para copiarlo automáticamente, abre el juego, ve a tu Perfil y presiona el lápiz de editar nombre, luego mantén presionado y selecciona "Pegar". Todos nuestros símbolos son aceptados por Garena.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Por qué algunos nombres de Free Fire no se aceptan o no caben?</h3>
            <p className="text-gray-600 leading-relaxed">
              En Free Fire, el límite máximo para un apodo/nombre (nick) es de 12 caracteres. Sin embargo, algunos símbolos especiales o adornos muy extensos ocupan más espacio interno que una letra de texto normal. Si el juego te indica un error, te sugerimos utilizar un estilo abreviado y reducir la longitud.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Cuáles son las letras para armas Free Fire?</h3>
            <p className="text-gray-600 leading-relaxed">
              Añadimos figuras como <strong>︻╦╤─</strong>, <strong>⌐╦╦═─</strong> o pequeñas escopetas ASCII. Estas figuras, junto con las letras versalitas, dotan de gran estilo a clanes de e-sports o dúos competitivos. Descubre y combina estas opciones para ser el MVP.
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
