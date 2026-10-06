import { copyText } from '../utils/copyText';
import { useState, useDeferredValue, useEffect, useMemo } from 'react';
import { Copy, Check, Dices, Flame, Shield, Swords, Sparkles, Heart, Bookmark, Trash2, Users, Eye, Sliders, Zap, Award, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';
import { FONT_MAPS as SHARED_FONT_MAPS } from '../data/unicodeStyles';

const DECORATORS = [
  { prefix: '꧁ ༒ ', suffix: ' ༒ ꧂', name: 'Alas Divinas Insanas', category: 'Alas & Coronas ꧁꧂' },
  { prefix: '★彡 ', suffix: ' 彡★', name: 'Estrellas Competitivas', category: 'Insanos 🔥' },
  { prefix: '☠ ', suffix: ' ☠', name: 'Pirata Oscuro', category: 'Insanos 🔥' },
  { prefix: '๖ۣۜ', suffix: '๖ۣۜ', name: 'Dragón Mítico', category: 'Insanos 🔥' },
  { prefix: 'ꪶ ', suffix: ' ꫂ', name: 'Corona Floral', category: 'Alas & Coronas ꧁꧂' },
  { prefix: '【 ', suffix: ' 】', name: 'Corchete Pro', category: 'Para Clanes 亗' },
  { prefix: '『 ', suffix: ' 』', name: 'Samurai FF', category: 'Para Clanes 亗' },
  { prefix: '⚡ ', suffix: ' ⚡', name: 'Rayo Veloz', category: 'Insanos 🔥' },
  { prefix: '╰‿╯ ', suffix: ' ╰‿╯', name: 'Demonio Insano', category: 'Insanos 🔥' },
  { prefix: '亗 ', suffix: ' 亗', name: 'Rey de Clan', category: 'Para Clanes 亗' },
  { prefix: '✿ ', suffix: ' ✿', name: 'Flor Sakura', category: 'Chicas FF 🌸' },
  { prefix: '☂️ ', suffix: ' ☂️', name: 'Sombrilla MP40', category: 'Insanos 🔥' },
  { prefix: 'メ ', suffix: ' メ', name: 'Katana Asesina', category: 'Insanos 🔥' },
  { prefix: '×͜× ', suffix: '', name: 'Sonrisa AWM', category: 'Insanos 🔥' },
  { prefix: '❖ ', suffix: ' ❖', name: 'Diamante Heroico', category: 'Para Clanes 亗' },
  { prefix: 'ᴮᴼˢˢ ', suffix: '', name: 'Jefe de Clan', category: 'Para Clanes 亗' },
  { prefix: '✓ ', suffix: ' ✓', name: 'Verificado FF', category: 'Insanos 🔥' },
  { prefix: '︻╦╤─ ', suffix: ' ─╤╦︻', name: 'Arma Larga', category: 'Insanos 🔥' },
  { prefix: '꧁༺ ', suffix: ' ༻꧂', name: 'Alas de Ángel', category: 'Alas & Coronas ꧁꧂' },
  { prefix: '♕ ', suffix: ' ♕', name: 'Reina Sakura', category: 'Chicas FF 🌸' },
  { prefix: '🎀 ', suffix: ' 🎀', name: 'Coquette FF', category: 'Chicas FF 🌸' },
  { prefix: '❥ ', suffix: ' ❥', name: 'Corazón Dúo', category: 'Dúos & Parejas 💕' },
  { prefix: 'ᴳᵒᵈ ', suffix: '', name: 'Dios FF', category: 'Insanos 🔥' },
  { prefix: '⚔️ ', suffix: ' ⚔️', name: 'Guerrero Clan', category: 'Para Clanes 亗' }
];

const DUO_MATCHES = [
  { p1: '⚡ ᵀᴼˣᴵᶜᴼ', p2: '⚡ ᵀᴼˣᴵᶜᴬ', style: 'Tóxicos Match' },
  { p1: '♚ ℝ𝕖𝕪', p2: '♕ ℝ𝕖𝕚𝕟𝕒', style: 'Rey y Reina' },
  { p1: '╰‿╯ 𝔎𝔦𝔩𝔩𝔢𝔯', p2: '╰‿╯ 𝓐𝓷𝓰𝓮𝓵', style: 'Asesino y Ángel' },
  { p1: '꧁ ༒ 𝒫𝒶𝓅𝒾 ༒ ꧂', p2: '꧁ ༒ ℳ𝒶𝓂𝒾 ༒ ꧂', style: 'Papi y Mami' },
  { p1: '☠️ 𝔅𝔞𝔡ℬ𝔬𝔶', p2: '☠️ 𝔅𝔞𝔡𝔊𝔦𝔯𝔩', style: 'Bad Boy & Bad Girl' },
  { p1: '☂️ 𝒮𝓃𝒾𝓅ℯ𝓇', p2: '☂️ 𝒮𝓊𝓅𝓅ℴ𝓇𝓉', style: 'Sniper & Support' }
];

const SYMBOLS = ['꧁', '꧂', '༒', '★', '彡', '☠', '๖ۣۜ', 'ꪶ', 'ꫂ', '【', '】', '『', '』', '⚡', '╰‿╯', '亗', '✿', '❖', 'ツ', '☂', '✦', 'メ', '×͜×', 'ᴮᴼˢˢ', 'ᴳᵒᵈ', '♛', '♚', '︻╦╤─', '⚔️', 'ㅤ'];

const INVISIBLE_SPACES = [
  {
    id: 'hangul',
    char: '\u3164',
    code: 'U+3164',
    name: 'Hangul Filler',
    note: 'Opción histórica muy usada. Algunas versiones o regiones pueden rechazarla.'
  },
  {
    id: 'nbsp',
    char: '\u00A0',
    code: 'U+00A0',
    name: 'No-Break Space',
    note: 'Alternativa para separar palabras; algunas validaciones la recortan o bloquean.'
  },
  {
    id: 'braille',
    char: '\u2800',
    code: 'U+2800',
    name: 'Braille Pattern Blank',
    note: 'Alternativa visualmente vacía; en ciertos dispositivos puede mostrarse como un cuadro.'
  }
] as const;

const GAMER_BASES = ['Slayer', 'Ninja', 'Ghost', 'Demon', 'King', 'Viper', 'Titan', 'Hunter', 'Sniper', 'Pro', 'God', 'Beast', 'Insano', 'Cobra', 'Shadow', 'Sakura', 'Goku', 'Kratos'];

const FREE_FIRE_FONT_MAPS: Record<string, Record<string, string>> = {
  smallCaps: SHARED_FONT_MAPS.small_caps,
  gothic: SHARED_FONT_MAPS.gotica,
  cursiva: SHARED_FONT_MAPS.cursiva,
};

function limitCodePoints(value: string, max: number) {
  return Array.from(value).slice(0, max).join('');
}

function applyFont(text: string, fontType: string) {
  if (fontType === 'normal') return text;
  const map = FREE_FIRE_FONT_MAPS[fontType];
  if (!map) return text;
  return Array.from(text).map(char => map[char] || map[char.toLowerCase()] || char).join('');
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo generar un nick insano para Free Fire?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Escribe el nombre o palabra base en el generador, selecciona una combinación con letras góticas, cursivas o versalitas y símbolos como alas ꧁ ༒ ꧂ o coronas 亗. Presiona 'Copiar' y pégalo en tu perfil de Free Fire."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es el límite de caracteres en Free Fire?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Muchos jugadores y herramientas de la comunidad usan 12 caracteres como referencia para el nickname de Free Fire, pero Garena puede cambiar la validación y algunos símbolos Unicode pueden ocupar distinto espacio. Usa el contador como guía y confirma siempre en el campo de nombre del juego."
      }
    },
    {
      "@type": "Question",
      "name": "¿Son permitidos estos símbolos por Garena Free Fire?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Free Fire puede aceptar algunos caracteres Unicode y rechazar otros según la versión, región o reglas vigentes del juego. Si un símbolo no funciona, prueba una variante más corta o diferente y confirma siempre el resultado dentro del campo de nickname."
      }
    }
  ]
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Generador de Nombres para Free Fire",
  "url": "https://generadordelettering.org/herramientas/generador-de-nombres-para-free-fire",
  "description": "Generador avanzado de nombres para Free Fire con prefijo de clan, dúos, espacio invisible, favoritos, letras y símbolos para construir un nick completo.",
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
      "name": "Generador de Nombres para Free Fire",
      "item": "https://generadordelettering.org/herramientas/generador-de-nombres-para-free-fire"
    }
  ]
};

export default function GeneradorNombresFreeFire() {
  const [inputText, setInputText] = useState('Slayer');
  const [clanPrefix, setClanPrefix] = useState('');
  const inputCharacterCount = Array.from(inputText).length;
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [activeTab, setActiveTab] = useState<'all' | 'duos' | 'invisible'>('all');
  const deferredInput = useDeferredValue(inputText);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [savedNicks, setSavedNicks] = useState<string[]>([]);
  const [savedNicksHydrated, setSavedNicksHydrated] = useState(false);
  const [storagePersistent, setStoragePersistent] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ff_saved_nicks');
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSavedNicks(
            [...new Set(parsed.filter((value): value is string => typeof value === 'string'))].slice(0, 50)
          );
        }
      }
      setStoragePersistent(true);
    } catch {
      setStoragePersistent(false);
    } finally {
      setSavedNicksHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!savedNicksHydrated) return;

    try {
      localStorage.setItem('ff_saved_nicks', JSON.stringify(savedNicks));
      setStoragePersistent(true);
    } catch {
      setStoragePersistent(false);
    }
  }, [savedNicks, savedNicksHydrated]);

  const copyToClipboard = async (text: string, id?: string) => {
    if (!(await copyText(text))) {
      window.alert('No se pudo copiar automáticamente. Selecciona el nick y cópialo manualmente.');
      return;
    }
    const copiedKey = id || text;
    setCopiedId(copiedKey);
    setTimeout(() => setCopiedId((current) => current === copiedKey ? null : current), 2000);
  };

  const toggleSaveNick = (text: string) => {
    setSavedNicks((prev) =>
      prev.includes(text)
        ? prev.filter((item) => item !== text)
        : [...prev, text].slice(-50)
    );
  };

  const handleSymbolClick = (symbol: string) => {
    setInputText((prev) => limitCodePoints(prev + symbol, 12));
  };

  const generateRandomGamerNick = () => {
    const randomBase = GAMER_BASES[Math.floor(Math.random() * GAMER_BASES.length)];
    const num = Math.floor(Math.random() * 99);
    setInputText(limitCodePoints(`${randomBase}${num}`, 12));
  };

  const categories = ['Todas', 'Insanos 🔥', 'Alas & Coronas ꧁꧂', 'Para Clanes 亗', 'Dúos & Parejas 💕', 'Chicas FF 🌸'];

  const generatedNickOptions = useMemo(() => {
    const decorators = activeCategory === 'Todas'
      ? DECORATORS
      : DECORATORS.filter((decorator) => decorator.category === activeCategory);

    return decorators
      .flatMap((decorator) => [
        { ...decorator, font: 'normal' },
        { ...decorator, font: 'smallCaps' },
        { ...decorator, font: 'gothic' },
        { ...decorator, font: 'cursiva' }
      ])
      .map((option, index) => {
        const appliedText = applyFont(deferredInput || 'Slayer', option.font);
        const fullName = `${clanPrefix ? `${clanPrefix} ` : ''}${option.prefix}${appliedText}${option.suffix}`;
        const characterCount = Array.from(fullName).length;

        return {
          ...option,
          key: `${option.name}-${option.font}-${index}`,
          fullName,
          characterCount,
          withinGuide: characterCount <= 12,
        };
      })
      .sort((a, b) => {
        if (a.withinGuide !== b.withinGuide) return a.withinGuide ? -1 : 1;
        return a.characterCount - b.characterCount;
      });
  }, [activeCategory, clanPrefix, deferredInput]);

  return (
    <>
      <SEO 
        title="Generador de Nombres para Free Fire | Nicks, Clan y Dúos"
        description="Crea un nombre para Free Fire con prefijo de clan, dúos, espacio invisible, favoritos, letras y símbolos. Generador avanzado de nicks listo para copiar."
        keywords="generador de nombres para free fire, creador de nombres free fire, nicks para free fire, nombres de clan free fire, nombres para duos free fire, espacio invisible free fire"
        canonical="https://generadordelettering.org/herramientas/generador-de-nombres-para-free-fire"
        jsonSchema={[
          faqSchema,
          softwareSchema,
          breadcrumbSchema
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-12 w-full min-w-0">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
            <li>
              <Link to="/" className="hover:text-amber-500 transition-colors">Inicio</Link>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              <Link to="/herramientas" className="hover:text-amber-500 transition-colors">Herramientas</Link>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              <span className="text-gray-900" aria-current="page">Nombres para Free Fire</span>
            </li>
          </ol>
        </nav>

        {/* Hero Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-gray-950 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-wider mb-4 shadow-sm">
            <Flame className="w-4 h-4 fill-gray-950" />
            Creador de Nicks Insanos FF
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Generador de Nombres para Free Fire
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Personaliza tu Nickname para Free Fire con <strong>letras bonitas, góticas, cursivas, alas, coronas y espacio invisible</strong>. Diseña nicks insanos para clanes, dúos o perfil personal en un solo clic.
          </p>
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            <span>Esta versión avanzada añade prefijo de clan, dúos, favoritos y espacio invisible.</span>
            <Link to="/herramientas/letras-free-fire" className="font-bold text-amber-700 hover:underline">
              ¿Solo quieres transformar un nick? Usa Letras y Símbolos para Free Fire →
            </Link>
          </div>
        </div>

        {/* Interactive Creator Box */}
        <div className="bg-slate-950 rounded-3xl p-6 md:p-8 text-white shadow-2xl mb-8 border border-amber-500/30">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            {/* Main Base Nick Input */}
            <div className="md:col-span-8">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="ff-nick-input" className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Swords className="w-4 h-4 text-amber-400" />
                  Tu Nombre Base:
                </label>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400"
                  title="Contador orientativo; el juego decide la validación final."
                >
                  {inputCharacterCount}/12 guía
                </span>
              </div>
              <div className="relative">
                <input
                  id="ff-nick-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(limitCodePoints(e.target.value, 12))}
                  className="w-full px-5 py-3.5 bg-slate-900 border-2 border-amber-500/50 rounded-2xl focus:border-amber-400 focus:outline-none text-xl md:text-2xl font-bold text-white pr-12 transition-colors shadow-inner placeholder-gray-600"
                  placeholder="Ejemplo: Slayer..."
                />
                {inputText && (
                  <button
                    type="button"
                    aria-label="Borrar nombre base"
                    onClick={() => setInputText('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    title="Borrar texto"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Optional Clan Prefix Tag */}
            <div className="md:col-span-4">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="ff-clan-prefix" className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Tag de Clan (Opcional):
                </label>
                <button 
                  onClick={generateRandomGamerNick}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-yellow-300 transition"
                  title="Generar aleatorio"
                >
                  <Dices className="w-3.5 h-3.5" />
                  Aleatorio
                </button>
              </div>
              <input
                id="ff-clan-prefix"
                type="text"
                value={clanPrefix}
                onChange={(e) => setClanPrefix(limitCodePoints(e.target.value, 6))}
                className="w-full px-4 py-3.5 bg-slate-900 border-2 border-amber-500/30 rounded-2xl focus:border-amber-400 focus:outline-none text-lg font-bold text-amber-300 placeholder-gray-600 mb-2"
                placeholder="Ej. [100k] o 亗"
              />
              <div className="flex flex-wrap gap-1">
                {['亗', '™', '⚡', 'ᴮᴼˢˢ', 'ᵀᴼˣᴵᶜᴼ', '☠️', '✓', '[100k]'].map((tag, tIdx) => (
                  <button
                    key={tIdx}
                    onClick={() => setClanPrefix(clanPrefix === tag ? '' : tag)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition ${
                      clanPrefix === tag 
                        ? 'bg-amber-400 text-slate-950 border-amber-400' 
                        : 'bg-slate-900 text-amber-300 border-slate-800 hover:border-amber-500/50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Symbol Buttons */}
          <div>
            <p className="text-xs font-bold text-amber-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Símbolos e Íconos Pro para Insertar Rápido:
            </p>
            <div className="flex flex-wrap gap-2">
              {SYMBOLS.map((sym, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSymbolClick(sym)}
                  className="px-3 py-2 bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-gray-200 rounded-xl border border-slate-700 hover:border-amber-400 transition font-bold text-sm flex items-center justify-center shadow-xs"
                >
                  {sym === 'ㅤ' ? <span className="text-xs text-amber-300 font-mono">[Espacio]</span> : sym}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Free Fire Profile Game Card Simulation */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Flame className="w-64 h-64 text-amber-500" />
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                Simulador de Perfil Free Fire
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <span>ID: 294810395</span>
              <span className="text-amber-500">Niv. 78</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="min-w-0 flex items-center gap-4">
              {/* Rank Emblem */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-red-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col items-center justify-center">
                  <Flame className="w-7 h-7 text-amber-400 fill-amber-400 animate-pulse" />
                  <span className="text-[9px] font-black text-amber-300 tracking-tighter uppercase mt-0.5">Gran Maestro</span>
                </div>
              </div>

              <div className="min-w-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Vista Previa de tu Nick en el Juego:</span>
                <p className="text-2xl md:text-3xl font-black text-white tracking-wide drop-shadow-md break-all sm:break-words">
                  {clanPrefix ? `${clanPrefix} ` : ''}{DECORATORS[0].prefix}{applyFont(deferredInput || 'Slayer', 'gothic')}{DECORATORS[0].suffix}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-amber-200/80 font-semibold">
                  <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-amber-400" /> Clan: {clanPrefix || 'HEROICOS'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> 9,999+ Likes</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(`${clanPrefix ? `${clanPrefix} ` : ''}${DECORATORS[0].prefix}${applyFont(deferredInput || 'Slayer', 'gothic')}${DECORATORS[0].suffix}`, 'preview-hero')}
              className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg transition"
            >
              {copiedId === 'preview-hero' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedId === 'preview-hero' ? '¡Nick Copiado!' : 'Copiar Nick Insano'}
            </button>
          </div>
        </div>

        {/* Feature Mode Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1.5 rounded-2xl flex flex-wrap justify-center gap-1 border border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                activeTab === 'all' 
                  ? 'bg-slate-950 text-amber-400 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Swords className="w-4 h-4" />
              Generador de Nicks
            </button>
            <button
              onClick={() => setActiveTab('duos')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                activeTab === 'duos' 
                  ? 'bg-slate-950 text-amber-400 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4" />
              Nicks para Dúos & Pareja
            </button>
            <button
              onClick={() => setActiveTab('invisible')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                activeTab === 'invisible' 
                  ? 'bg-slate-950 text-amber-400 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4" />
              Espacio Invisible FF (ㅤ)
            </button>
          </div>
        </div>

        {/* Saved Favorites Section if exists */}
        {savedNicks.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-600 fill-amber-600" />
                Tus Nombres Favoritos Guardados ({savedNicks.length})
              </span>
              <button 
                onClick={() => setSavedNicks([])}
                className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Vaciar lista
              </button>
            </div>
            {!storagePersistent && (
              <p role="status" className="mb-3 text-xs font-medium text-amber-800">
                Tu navegador no permite guardar esta lista de forma persistente. Los nicks seguirán disponibles durante esta sesión, pero pueden perderse al cerrar o recargar la página.
              </p>
            )}
            <div className="flex flex-wrap gap-2.5">
              {savedNicks.map((saved, idx) => (
                <div 
                  key={idx}
                  className="min-w-0 max-w-full bg-white border border-amber-200 rounded-xl px-3.5 py-1.5 flex items-center gap-2 shadow-xs"
                >
                  <span className="min-w-0 max-w-[70vw] sm:max-w-none text-sm font-bold text-gray-900 break-all sm:break-words">{saved}</span>
                  <button 
                    type="button"
                    onClick={() => copyToClipboard(saved, `saved-${idx}`)}
                    aria-label={`Copiar nick favorito ${saved}`}
                    className="text-xs font-bold text-amber-600 hover:text-amber-800 transition ml-1"
                  >
                    {copiedId === `saved-${idx}` ? '✓' : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button 
                    type="button"
                    onClick={() => toggleSaveNick(saved)}
                    aria-label={`Eliminar nick favorito ${saved}`}
                    className="text-xs text-gray-300 hover:text-red-500 transition ml-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1: All Nicks Generator */}
        {activeTab === 'all' && (
          <>
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
              <Sliders className="w-4 h-4 text-amber-600 shrink-0 mr-1" />
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    activeCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {generatedNickOptions.map((option) => {
                const isCopied = copiedId === option.fullName;
                const isSaved = savedNicks.includes(option.fullName);

                return (
                  <div 
                    key={option.key} 
                    className="min-w-0 bg-white border border-gray-200 hover:border-amber-400 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow-md transition group"
                  >
                    <div className="min-w-0 overflow-hidden flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {option.name}
                        </span>
                        {!option.withinGuide ? (
                          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                            {option.characterCount} car. guía
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                            ≤12 guía
                          </span>
                        )}
                      </div>
                      <p className="text-lg md:text-xl font-bold text-gray-900 break-all sm:break-words md:truncate pr-0 md:pr-2 leading-relaxed" title={option.fullName}>
                        {option.fullName}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label={isSaved ? `Quitar ${option.fullName} de guardados` : `Guardar ${option.fullName} en favoritos`}
                        onClick={() => toggleSaveNick(option.fullName)}
                        title={isSaved ? 'Quitar de guardados' : 'Guardar en favoritos'}
                        className={`p-2.5 rounded-xl border transition ${
                          isSaved 
                            ? 'bg-amber-50 border-amber-300 text-amber-600' 
                            : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-amber-600 hover:border-amber-300'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-amber-600' : ''}`} />
                      </button>

                      <button
                        onClick={() => copyToClipboard(option.fullName)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                          isCopied 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700 group-hover:bg-amber-400 group-hover:text-slate-950'
                        }`}
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {isCopied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Tab 2: Duos & Couples Generator */}
        {activeTab === 'duos' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Users className="w-6 h-6 text-pink-500" />
              Nicks para Dúos Dinámicos y Parejas en Free Fire
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Copien ambos nombres combinados para jugar partidas clasificatorias o DE CUALQUIER MODO con estilo coordinado.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DUO_MATCHES.map((duo, idx) => {
                const isCopiedP1 = copiedId === `duo-${idx}-p1`;
                const isCopiedP2 = copiedId === `duo-${idx}-p2`;
                const p1Count = Array.from(duo.p1).length;
                const p2Count = Array.from(duo.p2).length;
                return (
                  <div key={idx} className="border border-amber-200 rounded-2xl p-5 bg-gradient-to-br from-amber-50/50 to-orange-50/50 flex flex-col justify-between gap-4">
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full self-start">
                      Estilo: {duo.style}
                    </span>

                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-xl border border-amber-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase block">Jugador 1</span>
                          <span className="text-base font-bold text-gray-900">{duo.p1}</span>
                          <span className="text-[10px] text-gray-400 block">{p1Count} car. guía</span>
                        </div>
                        <button
                          type="button"
                          aria-label={isCopiedP1 ? `Nombre de jugador 1 copiado: ${duo.p1}` : `Copiar nombre de jugador 1: ${duo.p1}`}
                          onClick={() => copyToClipboard(duo.p1, `duo-${idx}-p1`)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            isCopiedP1 ? 'bg-green-100 text-green-700' : 'bg-amber-400 text-slate-950 hover:bg-amber-500'
                          }`}
                        >
                          {isCopiedP1 ? '✓' : 'Copiar'}
                        </button>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-amber-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase block">Jugador 2</span>
                          <span className="text-base font-bold text-gray-900">{duo.p2}</span>
                          <span className="text-[10px] text-gray-400 block">{p2Count} car. guía</span>
                        </div>
                        <button
                          type="button"
                          aria-label={isCopiedP2 ? `Nombre de jugador 2 copiado: ${duo.p2}` : `Copiar nombre de jugador 2: ${duo.p2}`}
                          onClick={() => copyToClipboard(duo.p2, `duo-${idx}-p2`)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            isCopiedP2 ? 'bg-green-100 text-green-700' : 'bg-amber-400 text-slate-950 hover:bg-amber-500'
                          }`}
                        >
                          {isCopiedP2 ? '✓' : 'Copiar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Invisible Space Tool */}
        {activeTab === 'invisible' && (
          <div className="bg-slate-950 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-12 border border-amber-500/30">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2">
                <Eye className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-amber-400">
                Generador de Espacio Invisible para Free Fire
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Free Fire puede cambiar qué caracteres especiales acepta según la versión, la región o el dispositivo. Por eso ofrecemos varias alternativas Unicode: copia una, pruébala en el campo de nickname y <strong>no confirmes el cambio</strong> hasta verificar que el juego la acepta y la muestra como esperas.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {INVISIBLE_SPACES.map((space) => {
                  const copyId = `invisible-space-${space.id}`;
                  const isCopied = copiedId === copyId;

                  return (
                    <div key={space.id} className="bg-slate-900 p-4 rounded-2xl border border-amber-500/30 text-left space-y-3">
                      <div>
                        <span className="block text-xs font-black text-amber-300">{space.name}</span>
                        <code className="text-[11px] text-gray-400">{space.code}</code>
                      </div>
                      <div className="text-xl font-mono text-amber-300 py-2 text-center bg-slate-950 border border-slate-800 rounded-xl" aria-label={`Vista previa ${space.code}`}>
                        [{space.char}]
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-400 min-h-[48px]">{space.note}</p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(space.char, copyId)}
                        className={`w-full py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                          isCopied
                            ? 'bg-green-500 text-white'
                            : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950'
                        }`}
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {isCopied ? 'Copiado' : `Copiar ${space.code}`}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 text-left text-xs text-gray-300 space-y-2">
                <p className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  ¿Cómo probar un espacio invisible sin gastar el cambio de nombre?
                </p>
                <ol className="list-decimal list-inside space-y-1 text-gray-400">
                  <li>Copia una de las tres opciones superiores.</li>
                  <li>Abre Free Fire, entra en la pantalla de cambio de apodo y pégala entre las palabras del nick.</li>
                  <li>Comprueba si el campo la acepta y si la vista previa se ve correcta. Si falla, vuelve y prueba la siguiente opción antes de confirmar.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Free Fire Tips Card */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border border-amber-200 rounded-3xl p-8 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Consejos para elegir tu nombre de Free Fire
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm leading-relaxed">
            <li><strong>12 caracteres como referencia:</strong> usa el contador como guía y confirma el resultado dentro de Free Fire, porque la validación de símbolos Unicode puede variar según el cliente.</li>
            <li><strong>Insano y Miedo:</strong> Combina letras góticas o pequeñas (versalitas) con símbolos como ☠, ╰‿╯ o ︻╦╤─ para dar un aspecto intimidante en las partidas.</li>
            <li><strong>Para Clanes y Dúos:</strong> Puedes añadir las iniciales de tu clan al principio como prefijo (ej. 亗, ᴮᴼˢˢ, ⚔️).</li>
          </ul>
        </div>

        {/* FAQ Section */}
        <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight text-center mb-6">
            Preguntas Frecuentes sobre Nombres para Free Fire
          </h2>

          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ¿Cómo generar un nick insano para Free Fire?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Escribe tu palabra base en nuestro generador, elige la combinación con letras góticas o cursivas y símbolos como alas ꧁ ༒ ꧂ o coronas 亗, presiona "Copiar" y pégalo en tu tarjeta de cambio de nombre de Free Fire.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ¿Por qué no puedo pegar algunos símbolos en mi perfil?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Free Fire puede aceptar algunos caracteres Unicode y rechazar otros según la versión, la región o las reglas vigentes del juego. Si un símbolo no funciona, prueba otro diseño más corto y confirma el resultado directamente en el campo de nickname.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ¿Cómo cambio mi nombre en Free Fire?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Abre tu perfil de Free Fire y utiliza la opción de edición del apodo. El juego puede pedir una tarjeta de cambio de nombre, diamantes u otro recurso según la versión, región o promociones vigentes; revisa el coste y el método que muestra tu cuenta antes de confirmar.
              </p>
            </div>
          </div>
        </section>

        {/* Related Tools for Internal Linking SEO */}
        <RelatedTools currentPath="/herramientas/generador-de-nombres-para-free-fire" />
      </div>
    </>
  );
}
