import { copyText } from '../utils/copyText';
import React, { useState, useEffect, useDeferredValue, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  Heart, 
  ChevronLeft, 
  Sparkles, 
  Smartphone, 
  MessageSquare, 
  User, 
  HelpCircle, 
  Hash, 
  Zap, 
  BookOpen, 
  CheckCircle2, 
  Flame, 
  Sliders,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const STYLES = [
  { id: 'aesthetic', name: 'Aesthetic Double Struck', convert: (t: string) => convertFont(t, '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ'), cat: 'aesthetic' },
  { id: 'cursiva', name: 'Cursiva Elegante', convert: (t: string) => convertFont(t, '𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵'), cat: 'cursivas' },
  { id: 'cursiva-negrita', name: 'Cursiva Negrita', convert: (t: string) => convertFont(t, '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩'), cat: 'cursivas' },
  { id: 'sans-bold', name: 'Sans Negrita', convert: (t: string) => convertFont(t, '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭'), cat: 'negritas' },
  { id: 'mono', name: 'Espaciado Monospace', convert: (t: string) => convertFont(t, '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉'), cat: 'aesthetic' },
  { id: 'gotica', name: 'Gótica Dark', convert: (t: string) => convertFont(t, '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ'), cat: 'goticas' },
  { id: 'gotica-bold', name: 'Gótica Negrita Dark', convert: (t: string) => convertFont(t, '𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅'), cat: 'goticas' },
  { id: 'circulos', name: 'Círculos Blancos', convert: (t: string) => convertFont(t, 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ'), cat: 'efectos' },
  { id: 'circulos-negros', name: 'Círculos Negros', convert: (t: string) => convertFont(t, '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩'), cat: 'efectos' },
  { id: 'cuadrados', name: 'Cuadrados Estilo Pixel', convert: (t: string) => convertFont(t, '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉'), cat: 'efectos' },
  { id: 'small-caps', name: 'Mayúsculas Pequeñas (Small Caps)', convert: (t: string) => convertFont(t, 'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'), cat: 'aesthetic' },
  { id: 'burbujas', name: 'Burbujas Suaves', convert: (t: string) => convertFont(t, 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ'), cat: 'aesthetic' },
];

const DECORATORS = [
  { prefix: '˚ ༘♡ ⋆｡˚ ', suffix: ' ❀', name: 'Flores Soft Aesthetic', category: 'simbolos' },
  { prefix: '𓍢ִ໋🌷͙֒ ', suffix: ' 𓆸', name: 'Tulipán & Naturaleza', category: 'simbolos' },
  { prefix: '✦ ', suffix: ' ✦', name: 'Estrellas Mágicas', category: 'simbolos' },
  { prefix: '┊ ', suffix: ' ┊', name: 'Líneas Minimalistas', category: 'simbolos' },
  { prefix: '⟡ ', suffix: ' ⟡', name: 'Diamantes TikTok', category: 'simbolos' },
  { prefix: '⚡️ ', suffix: ' ⚡️', name: 'Energía & Trend', category: 'simbolos' },
  { prefix: '♡ ', suffix: ' ♡', name: 'Corazones Coquette', category: 'simbolos' },
  { prefix: '【﻿ ', suffix: ' 】', name: 'Marcos Retro Gamer', category: 'efectos' },
  { prefix: '꧁ ', suffix: ' ꧂', name: 'Alas TikToker VIP', category: 'efectos' },
];

const AESTHETIC_SYMBOLS = [
  '𓍢ִ໋🌷͙֒', '˚ ༘♡ ⋆｡˚', '✦', '✧', '⟡', '⚡️', '♡', '❀', '✿', '★', '☆', '𓆏', '𓆸', '┊', '𓍯', '𓏲', '𓌈', '🕊️', '👑'
];

const BIO_TEMPLATES = [
  { label: 'Aesthetic Girl', text: '˚ ༘♡ ⋆｡˚ 𝒞𝓇𝑒𝒶𝒹𝑜𝓇𝒶 𝒹𝑒 𝒸𝑜𝓃𝓉𝑒𝓃𝒾𝒹𝑜 🌸 | 𝒱𝒾𝒷𝑒𝓈 & 𝒮𝓉𝓎𝓁𝑒' },
  { label: 'Gamer / Trend', text: '⚡️ 𝘛𝘪𝘬𝘛𝘰𝘬 𝘊𝘳𝘦𝘢𝘵𝘰𝘳 🎮 ┊ 𝘓𝘪𝘷𝘦𝘴 𝘛𝘰𝘥𝘰𝘴 𝘭𝘰𝘴 𝘥í𝘢𝘴' },
  { label: 'Coquette Soft', text: '𓍢ִ໋🌷͙֒ 𝒩𝑜𝓉𝒶𝓈 𝒹𝑒 𝒶𝓂𝑜𝓇 𝓎 𝓂𝑜𝒹𝒶 🎀 ♡ Sígueme para más' },
  { label: 'Minimal / Bio', text: '✦ ᴅ ᴇ s ɪ ɢ ɴ ᴇ ʀ ┊ ᴄ ᴏ ɴ ᴛ ᴇ ɴ ᴛ  ᴄ ʀ ᴇ ᴀ ᴛ ᴏ ʀ ⚡️' },
];

function convertFont(text: string, targetMap: string) {
  const mappedChars = Array.from(targetMap);
  return Array.from(text).map((char) => {
    const index = ALPHABET.indexOf(char);
    return index !== -1 ? (mappedChars[index] || char) : char;
  }).join('');
}

export default function LetrasTikTok() {
  const [inputText, setInputText] = useState('Aesthetic TikTok');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tiktok_fav_fonts');
      if (!saved) return [];

      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];

      return [...new Set(parsed.filter((value): value is string => typeof value === 'string'))].slice(0, 50);
    } catch {
      return [];
    }
  });
  const [storagePersistent, setStoragePersistent] = useState(true);
  const [previewMode, setPreviewMode] = useState<'bio' | 'comment'>('bio');

  const deferredInput = useDeferredValue(inputText);
  const inputCharacterCount = Array.from(inputText).length;

  useEffect(() => {
    try {
      localStorage.setItem('tiktok_fav_fonts', JSON.stringify(favorites));
      setStoragePersistent(true);
    } catch {
      setStoragePersistent(false);
    }
  }, [favorites]);

  const handleCopy = async (text: string, id: string) => {
    if (!(await copyText(text))) {
      window.alert('No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.');
      return;
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (text: string) => {
    setFavorites((current) =>
      current.includes(text)
        ? current.filter((item) => item !== text)
        : [...current, text].slice(-50)
    );
  };

  const addSymbolToInput = (symbol: string) => {
    setInputText(prev => prev + ' ' + symbol);
  };

  const allCombinations = useMemo(() => {
    const sourceText = deferredInput || 'Aesthetic TikTok';

    const generatedList = STYLES.map((style) => ({
      id: style.id,
      name: style.name,
      text: style.convert(sourceText),
      category: style.cat,
    }));

    const decoratorBase = STYLES[0].convert(sourceText);
    const generatedDecorators = DECORATORS.map((dec, idx) => ({
      id: `dec-${idx}`,
      name: dec.name,
      text: `${dec.prefix}${decoratorBase}${dec.suffix}`,
      category: dec.category,
    }));

    return [...generatedList, ...generatedDecorators];
  }, [deferredInput]);

  const filteredItems = useMemo(
    () => selectedCategory === 'todas'
      ? allCombinations
      : allCombinations.filter((item) => item.category === selectedCategory),
    [allCombinations, selectedCategory]
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "▲ ¿Cómo poner letras bonitas y aesthetic en la Bio de TikTok?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simplemente escribe tu texto en la casilla superior de nuestro generador, elige el estilo de letra o tipografía que más te guste, haz clic en 'Copiar' y pégalo directamente en la edición de tu perfil de TikTok (Bio/Descripción)."
        }
      },
      {
        "@type": "Question",
        "name": "▲ ¿Las fuentes creadas son compatibles con iPhone y Android en TikTok?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Las letras y símbolos se basan en caracteres Unicode estándar y suelen funcionar en TikTok para iOS, Android y web. La apariencia exacta puede variar según el dispositivo, la fuente disponible o futuras actualizaciones de la plataforma."
        }
      },
      {
        "@type": "Question",
        "name": "▲ ¿Puedo usar estas letras en los comentarios y nombres de usuario de TikTok?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Puedes usar estas tipografías en el nombre visible, la biografía, las descripciones y los comentarios. El @username puede tener reglas más estrictas y no aceptar todos los caracteres Unicode."
        }
      },
      {
        "@type": "Question",
        "name": "▲ ¿Cuál es el límite de caracteres para la Biografía de TikTok?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "80 caracteres sigue siendo una referencia segura para redactar una bio de TikTok, pero algunos usuarios pueden ver límites diferentes según su cuenta, región o versión de la app. Usa el contador de este conversor como guía y confirma el límite real en Editar perfil antes de guardar."
        }
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Conversor de Letras Bonitas para TikTok Aesthetic",
    "url": "https://generadordelettering.org/herramientas/letras-tiktok",
    "description": "Generador gratuito de letras bonitas, tipografías aesthetic, cursivas y símbolos para la bio y comentarios de TikTok.",
    "applicationCategory": "UtilityApplication",
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
        "name": "Letras para TikTok Aesthetic",
        "item": "https://generadordelettering.org/herramientas/letras-tiktok"
      }
    ]
  };

  return (
    <>
      <SEO 
        title="Conversor de Letras Bonitas para TikTok Aesthetic (Copiar y Pegar)"
        description="Generador de fuentes y letras bonitas para la bio, comentarios y subtítulos de TikTok. Tipografías aesthetic, cursivas, negritas y símbolos para destacar en TikTok."
        canonical="https://generadordelettering.org/herramientas/letras-tiktok"
        keywords="letras para tiktok, letras bonitas para tiktok, conversor de letras tiktok, fuentes aesthetic tiktok, letras para la bio de tiktok, tipografias tiktok copiar y pegar"
        jsonSchema={[faqSchema, softwareSchema, breadcrumbSchema]}
      />

      {/* Hero Breadcrumb Header */}
      <div className="bg-gradient-to-b from-black via-gray-900 to-gray-900 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb Links */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" /> Inicio
            </Link>
            <span>/</span>
            <Link to="/herramientas" className="text-gray-300 hover:text-white transition">Herramientas</Link>
            <span>/</span>
            <span className="text-pink-400 font-medium">Letras para TikTok</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border border-pink-500/30 text-pink-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                TikTok Aesthetic Font Generator 2026
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Conversor de <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400">Letras Bonitas para TikTok</span>
              </h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Transforma tu texto en tipografías únicas, letras cursivas, góticas y símbolos aesthetic para destacar en tu <strong>Bio, nombre visible y comentarios de TikTok</strong>. ¡Copia y pega en un clic!
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="hidden lg:flex flex-col gap-2 p-4 rounded-2xl bg-gray-800/80 border border-gray-700/80 backdrop-blur text-xs">
              <div className="flex items-center gap-2 text-pink-400 font-bold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Unicode compatible con TikTok
              </div>
              <div className="text-gray-400">+50 Estilos Cursivos & Aesthetic</div>
              <div className="text-gray-400">Bio: 80 caracteres como base segura</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Main Interactive Input Container */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xl space-y-6">
          
          {/* Input Label + Character Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label htmlFor="tiktok-input" className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-pink-500" />
              Escribe tu biografía o nombre para TikTok:
            </label>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                inputCharacterCount > 80 
                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {inputCharacterCount}/500 caracteres · 80 base segura
              </span>
            </div>
          </div>

          {/* Text Area Input */}
          <div className="relative">
            <input
              id="tiktok-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(Array.from(e.target.value).slice(0, 500).join(''))}
              placeholder="Ej: Aesthetic Girl / Sígueme para más..."
              className="w-full px-5 py-4 text-lg md:text-xl font-medium rounded-2xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition shadow-inner text-gray-900 pr-12"
            />
            {inputText && (
              <button
                onClick={() => setInputText('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-sm bg-gray-100 rounded-full w-7 h-7 flex items-center justify-center transition"
                title="Borrar texto"
              >
                ✕
              </button>
            )}
          </div>

          {inputCharacterCount > 80 && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              Has superado la base segura de 80 caracteres. Algunas cuentas pueden admitir más, pero comprueba el límite que muestra TikTok en Editar perfil antes de guardar.
            </div>
          )}

          {/* Aesthetic Symbols Quick Toolbar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                Añadir Símbolos Aesthetic Populares:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AESTHETIC_SYMBOLS.map((sym, i) => (
                <button
                  key={i}
                  onClick={() => addSymbolToInput(sym)}
                  className="px-2.5 py-1 text-sm bg-gray-50 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300 border border-gray-200 rounded-xl transition font-medium"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Bio Templates */}
          <div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">
              Plantillas de Biografía para TikTok (Haz clic para usar):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {BIO_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(tmpl.text)}
                  className="p-2.5 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-white hover:border-pink-400 hover:shadow-sm text-left transition group"
                >
                  <div className="text-[11px] font-bold text-pink-600 mb-0.5">{tmpl.label}</div>
                  <div className="text-xs text-gray-700 truncate font-medium">{tmpl.text}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Live TikTok Mobile Mockup Preview Box */}
          <div className="mt-6 p-4 md:p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 text-white">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse" />
                <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">
                  Vista Previa en Vivo de TikTok
                </span>
              </div>
              <div className="flex items-center bg-gray-800 p-1 rounded-xl text-xs font-medium">
                <button
                  onClick={() => setPreviewMode('bio')}
                  className={`px-3 py-1 rounded-lg transition ${previewMode === 'bio' ? 'bg-pink-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  Bio Perfil
                </button>
                <button
                  onClick={() => setPreviewMode('comment')}
                  className={`px-3 py-1 rounded-lg transition ${previewMode === 'comment' ? 'bg-cyan-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  Comentario
                </button>
              </div>
            </div>

            {previewMode === 'bio' ? (
              <div className="max-w-sm mx-auto bg-gray-900/90 rounded-2xl p-4 border border-gray-800 shadow-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-400 p-0.5">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-300" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-1">
                      @usuario_tiktok
                      <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 text-black text-[9px] font-black flex items-center justify-center">✓</span>
                    </div>
                    <div className="text-xs text-gray-400">12.5K Seguidores</div>
                  </div>
                </div>
                {/* Live Bio Text */}
                <div className="bg-black/60 p-3 rounded-xl border border-gray-800 text-sm text-gray-100 font-normal leading-snug break-words">
                  {inputText || 'Tu biografía de TikTok aparecerá aquí con tus letras bonitas.'}
                </div>
              </div>
            ) : (
              <div className="max-w-sm mx-auto bg-gray-900/90 rounded-2xl p-4 border border-gray-800 shadow-2xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold">
                    TK
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-300">
                      @aesthetic_fan <span className="text-[10px] text-gray-500">· hace 2m</span>
                    </div>
                    <div className="text-sm text-white mt-1 break-words">
                      {inputText || '¡Increíble video! ✨'}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span>Responder</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-500" /> 142</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filter Categories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase mr-1">Filtrar:</span>
            {[
              { id: 'todas', label: 'Todas las Fuentes' },
              { id: 'aesthetic', label: 'Aesthetic' },
              { id: 'cursivas', label: 'Cursivas' },
              { id: 'negritas', label: 'Negritas' },
              { id: 'goticas', label: 'Góticas Dark' },
              { id: 'simbolos', label: 'Con Símbolos' },
              { id: 'efectos', label: 'Efectos Especiales' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Generated Font Cards Grid */}
          <div className="space-y-3 pt-2">
            {filteredItems.map((item) => {
              const isCopied = copiedId === item.id;
              const isFav = favorites.includes(item.text);

              return (
                <div
                  key={item.id}
                  className="group bg-gray-50/80 hover:bg-white p-4 rounded-2xl border border-gray-200/80 hover:border-pink-300 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider bg-gray-200/70 px-2 py-0.5 rounded-md">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-base sm:text-lg text-gray-900 font-medium break-words leading-relaxed select-all">
                      {item.text}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => toggleFavorite(item.text)}
                      className={`p-2.5 rounded-xl border transition ${
                        isFav 
                          ? 'bg-pink-50 border-pink-300 text-pink-600' 
                          : 'bg-white border-gray-200 text-gray-400 hover:text-pink-500'
                      }`}
                      title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleCopy(item.text, item.id)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-xs ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-black text-white hover:bg-pink-600 active:scale-95'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" /> ¡Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copiar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Saved Favorites Section */}
          {favorites.length > 0 && (
            <div className="mt-8 p-6 bg-pink-50/60 rounded-2xl border border-pink-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-pink-900 text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-600 fill-current" />
                  Mis Letras Favoritas Guardadas ({favorites.length})
                </h3>
                <button
                  onClick={() => setFavorites([])}
                  className="text-xs text-pink-700 hover:underline font-semibold"
                >
                  Borrar todas
                </button>
              </div>
              {!storagePersistent && (
                <p role="status" className="text-xs font-medium text-amber-700">
                  Tu navegador no permite guardar favoritos de forma persistente. Seguirán disponibles durante esta sesión, pero pueden perderse al cerrar o recargar la página.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {favorites.map((fav, i) => (
                  <div key={i} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-pink-100 text-xs font-medium">
                    <span className="truncate mr-2 text-gray-900">{fav}</span>
                    <button
                      onClick={() => handleCopy(fav, `fav-${i}`)}
                      className="px-2 py-1 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 text-[11px]"
                    >
                      {copiedId === `fav-${i}` ? '✓' : 'Copiar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Detailed SEO Content Section */}
        <div className="mt-12 bg-white rounded-3xl p-6 md:p-10 border border-gray-200 shadow-sm space-y-8 text-gray-700 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-500" />
              ¿Cómo usar el Conversor de Letras Bonitas para TikTok?
            </h2>
            <p>
              El <strong>Generador de Fuentes para TikTok</strong> te permite personalizar el texto de tu biografía, nombre visible y comentarios con estilos tipográficos únicos (cursivas, fuentes góticas, letras encuadradas, letras pequeñas y símbolos aesthetic).
            </p>
            <ol className="list-decimal list-inside space-y-2 font-medium text-gray-800 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <li>Escribe el texto deseado en el cuadro de entrada de la herramienta arriba.</li>
              <li>Explora la lista de tipografías generadas e inserta símbolos aesthetic si lo deseas.</li>
              <li>Haz clic en el botón <strong>"Copiar"</strong> al lado del diseño que más te guste.</li>
              <li>Abre la app de <strong>TikTok</strong>, dirígete a tu perfil, selecciona <strong>Editar Perfil</strong> y pega el texto en tu <strong>Biografía</strong> o <strong>Nombre</strong>.</li>
            </ol>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-pink-500" />
              Estilos de Letras Aesthetic más virales en TikTok
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">✦ Letras Cursivas e Itálicas</h3>
                <p className="text-xs text-gray-600">
                  Ideales para un estilo elegante, femenino o suave (soft aesthetic). Perfectas para frases motivacionales y cuentas de moda.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">✦ Tipografías Góticas (Dark)</h3>
                <p className="text-xs text-gray-600">
                  Muy utilizadas por creadores de contenido de videojuegos, anime, cultura alternativa y estética grunge o alt.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">✦ Small Caps (Mayúsculas Pequeñas)</h3>
                <p className="text-xs text-gray-600">
                  Un estilo minimalista y moderno que mantiene una excelente legibilidad en pantallas móviles pequeñas.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">✦ Círculos y Símbolos Encajados</h3>
                <p className="text-xs text-gray-600">
                  Resaltan palabras clave o enlaces en tu biografía para guiar la atención de tus seguidores hacia un link específico.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: FAQ Accordion / Grid */}
          <section className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-500" />
              Preguntas Frecuentes sobre Letras para TikTok (FAQ)
            </h2>

            <div className="space-y-3">
              {faqSchema.mainEntity.map((faq, i) => (
                <div key={i} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50">
                  <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">
                    {faq.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    {faq.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Cross-linking to Other Tools */}
        <RelatedTools currentPath="/herramientas/letras-tiktok" />
      </div>
    </>
  );
}
