import { copyText } from '../utils/copyText';
import { useState, useDeferredValue, useEffect, useMemo } from 'react';
import { Copy, Check, Instagram, Sparkles, Heart, Wand2, UserCheck, Layout, ExternalLink, Bookmark, Trash2, Sliders, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const FONTS_DATA: Record<string, { label: string; category: string; mapping: string }> = {
  cursiva: {
    label: 'Cursiva Elegante',
    category: 'Cursivas',
    mapping: '𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵0123456789'
  },
  cursiva_bold: {
    label: 'Cursiva Negrita',
    category: 'Cursivas',
    mapping: '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩0123456789'
  },
  doble: {
    label: 'Doble Línea (Outline)',
    category: 'Aesthetic',
    mapping: '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'
  },
  gotica: {
    label: 'Gótica Antigua',
    category: 'Góticas',
    mapping: '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ0123456789'
  },
  small_caps: {
    label: 'Versalitas (Small Caps)',
    category: 'Aesthetic',
    mapping: 'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789'
  },
  sans_bold: {
    label: 'Sans Negrita Imprenta',
    category: 'Destacadas',
    mapping: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'
  },
  sans_italic: {
    label: 'Itálica Suave',
    category: 'Cursivas',
    mapping: '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡0123456789'
  },
  serif_bold: {
    label: 'Serif Negrita Clásica',
    category: 'Destacadas',
    mapping: '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙0123456789'
  },
  burbujas: {
    label: 'Círculos Blancos',
    category: 'Símbolos',
    mapping: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨'
  },
  burbujas_negra: {
    label: 'Círculos Negros',
    category: 'Símbolos',
    mapping: '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩⓿❶❷❸❹❺❻❼❽❾'
  },
  vaporwave: {
    label: 'Vaporwave Ancho',
    category: 'Aesthetic',
    mapping: 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９'
  },
  monospaced: {
    label: 'Código Máquina',
    category: 'Destacadas',
    mapping: '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉0123456789'
  }
};

const FONT_MAPS: Record<string, Record<string, string>> = {};
Object.keys(FONTS_DATA).forEach((key) => {
  const chars = Array.from(FONTS_DATA[key].mapping);
  const alphaChars = Array.from(ALPHABET);
  FONT_MAPS[key] = {};
  alphaChars.forEach((char, i) => {
    FONT_MAPS[key][char] = chars[i] || char;
  });
});

const INSTAGRAM_DECORATORS = [
  { name: 'Mariposas Soft', pre: '🦋 ', post: ' 🦋' },
  { name: 'Corazones Coquette', pre: '𓆩♡𓆪 ', post: ' 𓆩♡𓆪' },
  { name: 'Estrellas Mágicas', pre: '✧･ﾟ ', post: ' ･ﾟ✧' },
  { name: 'Flor de Cerezo', pre: '🌸 ', post: ' 🌸' },
  { name: 'Nube Aesthetic', pre: '☁️ ', post: ' ☁️' },
  { name: 'Líneas Elegantes', pre: '┆ ', post: ' ┆' },
  { name: 'Lunas Místicas', pre: '☽ ', post: ' ☾' },
  { name: 'Rayos Vibe', pre: '⚡ ', post: ' ⚡' },
  { name: 'Cinta Rosa', pre: '🎀 ', post: ' 🎀' },
  { name: 'Corazón Minimal', pre: '♡ ', post: ' ♡' },
  { name: 'Marco Vintage', pre: '« ', post: ' »' },
  { name: 'Brillos Cristales', pre: '✦ ', post: ' ✦' }
];

const BIO_TEMPLATES = [
  {
    category: 'Aesthetic / Moda',
    template: '✨ [Tu Nombre]\n📍 [Tu Ciudad]\n🌿 Creadora de contenido & Style\n💌 Contacto: hola@ejemplo.com\n👇 Mira mi último post:',
  },
  {
    category: 'Minimalista',
    template: '𓆩♡𓆪 [Tu Nombre]\n☁️ Viviendo un día a la vez\n📸 Fotografía | Arte | Inspiración\n✦ [Link en Bio]',
  },
  {
    category: 'Fotografía & Arte',
    template: '📸 Capturando momentos inolvidables\n🎨 Ilustración y Arte Digital\n✨ Disponible para proyectos\n👇 Mi portafolio completo:',
  },
  {
    category: 'Personal / Blog',
    template: '🌱 Amante de los viajes y el café ☕\n✨ Compartiendo mi día a día\n📩 DMs abiertos para colaboraciones\n👇 Conoce más sobre mí:',
  }
];

const USERNAME_PREFIXES = ['iam', 'the', 'real', 'soyofficial', 'by', 'hello'];
const USERNAME_SUFFIXES = ['official', 'studio', 'vibes', 'creative', 'xo', 'es', 'co'];

const QUICK_SYMBOLS = [
  '🌸', '✨', '🦋', '☁️', '♡', '✧', '✦', '𓆩♡𓆪', '🎀', '☽', '⚡', '🕊️', '┆', '───', '💫', '☘️', '🧸', '🍦', '🍒', '🧸', '🤍', '🌙'
];

const SYMBOL_CATEGORIES = [
  {
    name: 'Corazones & Cintas 𓆩♡𓆪',
    symbols: ['𓆩♡𓆪', '🎀', '♡', '🤍', '❣', '❥', '❦', 'ღ', '💖', '💗', '💌', '✿', '𓆩♥︎𓆪']
  },
  {
    name: 'Estrellas & Mística ✧',
    symbols: ['✧', '✦', '⋆', '｡˚', 'ﾟ✧', '💫', '🌌', '✨', '⚡', '🌙', '☽', '☾', '𓆩✧𓆪']
  },
  {
    name: 'Naturaleza & Coquette 🌸',
    symbols: ['🌸', '🦋', '🌷', '🌿', '🍀', '🌱', '🍒', '🕊️', '☁️', '🍦', '🧸', '🌺']
  },
  {
    name: 'Marcos & Separadores ┆',
    symbols: ['┆', '┊', '« »', '༺ ༻', '───', '⌗', '✦ ── ✦', '┊ ➶ ｡˚', '•.✦.•']
  },
  {
    name: 'Kaomojis Aesthetic (˶ᵔ ᵕ ᵔ˶)',
    symbols: ['(๑•̀ᴗ•́)و', '(˶ᵔ ᵕ ᵔ˶)', '‎(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '(๑>◡<๑)', '‎( •̀_•́ )', '૮꒰ ˶• ༝ •˶ ꒱ა']
  }
];

const SAMPLE_NAMES = ['AestheticGirl', 'Sofiamusic', 'GlowStyle', 'Inspirate', 'VibesOnly', 'StudioLettering', 'LuciaDesign'];

function convertText(text: string, fontKey: string) {
  if (!text) return 'TuNombre';
  const map = FONT_MAPS[fontKey];
  if (!map) return text;
  return Array.from(text).map(char => map[char] || char).join('');
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo poner letras bonitas en mi nombre de usuario o biografía de Instagram?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Escribe tu nombre o frase en el campo de texto de nuestra herramienta, elige el tipo de letra o combinación aesthetic que más te guste, haz clic en 'Copiar', abre Instagram, dirígete a 'Editar perfil' y pega el texto en el campo de Nombre o Biografía."
      }
    },
    {
      "@type": "Question",
      "name": "¿Por qué algunas fuentes no funcionan en el usuario (@username)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Instagram requiere que el ID único de usuario (@username) contenga solo letras estándar, números, puntos y guiones bajos por motivos de búsqueda del sistema. Sin embargo, en el campo de 'Nombre' visible y en la 'Biografía' (Bio) puedes usar todas las letras bonitas y símbolos que desees."
      }
    },
    {
      "@type": "Question",
      "name": "¿Es compatible con iPhone (iOS) y Android?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las letras y símbolos se basan en caracteres Unicode estándar y suelen mostrarse correctamente en dispositivos modernos. La apariencia exacta puede variar según la fuente disponible, el sistema operativo y la versión de Instagram."
      }
    }
  ]
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Generador de Nombres para Instagram",
  "url": "https://generadordelettering.org/herramientas/generador-de-nombres-para-instagram",
  "description": "Generador de nombres y letras bonitas para Instagram. Crea nicks, biografía y textos aesthetic con fuentes cursivas y símbolos listos para copiar y pegar.",
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
      "name": "Generador de Nombres para Instagram",
      "item": "https://generadordelettering.org/herramientas/generador-de-nombres-para-instagram"
    }
  ]
};

export default function GeneradorNombresInstagram() {
  const [inputText, setInputText] = useState('AestheticGirl');
  const deferredInput = useDeferredValue(inputText);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [activeTab, setActiveTab] = useState<'fonts' | 'bio' | 'symbols' | 'ideas'>('fonts');
  const [spacingMode, setSpacingMode] = useState<'normal' | 'dots' | 'spaced'>('normal');

  // Interactive Bio Builder States
  const [bioName, setBioName] = useState('Sofía');
  const [bioRole, setBioRole] = useState('📸 Creadora Digital & Style');
  const [bioVibe, setBioVibe] = useState('☁️ Amante del café y los viajes ☕');
  const [bioLink, setBioLink] = useState('👇 Conoce mi portafolio:');
  const [bioFont, setBioFont] = useState('cursiva');
  const [savedNames, setSavedNames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ig_saved_names');
      if (!saved) return [];

      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];

      return [...new Set(parsed.filter((value): value is string => typeof value === 'string'))].slice(0, 50);
    } catch {
      return [];
    }
  });
  const [storagePersistent, setStoragePersistent] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('ig_saved_names', JSON.stringify(savedNames));
      setStoragePersistent(true);
    } catch {
      setStoragePersistent(false);
    }
  }, [savedNames]);

  const copyToClipboard = async (text: string, id: string) => {
    if (!(await copyText(text))) {
      window.alert('No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.');
      return;
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSaveName = (text: string) => {
    setSavedNames((prev) =>
      prev.includes(text)
        ? prev.filter((item) => item !== text)
        : [...prev, text].slice(-50)
    );
  };

  const handleAddSymbol = (symbol: string) => {
    setInputText(prev => prev + symbol);
  };

  const handleRandomSample = () => {
    const random = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
    setInputText(random);
  };

  const categories = ['Todas', 'Cursivas', 'Aesthetic', 'Góticas', 'Destacadas', 'Símbolos'];

  const fontResults = useMemo(() => {
    const format = (text: string) => {
      if (spacingMode === 'dots') return Array.from(text).join(' · ');
      if (spacingMode === 'spaced') return Array.from(text).join(' ');
      return text;
    };

    return Object.keys(FONTS_DATA)
      .filter((key) => activeCategory === 'Todas' || FONTS_DATA[key].category === activeCategory)
      .map((fontKey) => ({
        fontKey,
        converted: format(convertText(deferredInput, fontKey)),
        fontInfo: FONTS_DATA[fontKey],
      }));
  }, [activeCategory, deferredInput, spacingMode]);

  const decoratedResults = useMemo(() => {
    const format = (text: string) => {
      if (spacingMode === 'dots') return Array.from(text).join(' · ');
      if (spacingMode === 'spaced') return Array.from(text).join(' ');
      return text;
    };

    return INSTAGRAM_DECORATORS.map((dec, idx) => {
      const fontChoice = idx % 2 === 0 ? 'cursiva' : 'doble';
      const spaced = format(convertText(deferredInput, fontChoice));
      return {
        ...dec,
        decId: `dec-${idx}`,
        fullDecorated: `${dec.pre}${spaced}${dec.post}`,
      };
    });
  }, [deferredInput, spacingMode]);

  const usernameIdeas = useMemo(() => {
    const normalizedBase = (deferredInput || 'nombre')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9._]/g, '')
      .replace(/\.{2,}/g, '.')
      .replace(/^\.+|\.+$/g, '') || 'nombre';

    return USERNAME_PREFIXES
      .flatMap((prefix) => USERNAME_SUFFIXES.map((suffix) => {
        const maxBaseLength = Math.max(1, 30 - prefix.length - suffix.length - 2);
        const base = normalizedBase.slice(0, maxBaseLength).replace(/\.+$/g, '') || 'nombre';
        return `${prefix}.${base}.${suffix}`;
      }))
      .slice(0, 12);
  }, [deferredInput]);

  return (
    <>
      <SEO 
        title="Generador de Nombres para Instagram - Letras Bonitas y Bio Aesthetic"
        description="Generador de nombres para Instagram gratis. Crea nicks, letras bonitas, cursivas y frases para la bio de Instagram con fuentes aesthetic y símbolos especiales."
        keywords="generador de nombres para instagram, letras bonitas instagram, fuentes para instagram, biografia aesthetic instagram, nicks instagram"
        canonical="https://generadordelettering.org/herramientas/generador-de-nombres-para-instagram"
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
                "name": "Generador de Nombres para Instagram",
                "item": "https://generadordelettering.org/herramientas/generador-de-nombres-para-instagram"
              }
            ]
          }
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-10 w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
            <li>
              <Link to="/" className="hover:text-[#4F46E5] transition-colors">Inicio</Link>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              <Link to="/herramientas" className="hover:text-[#4F46E5] transition-colors">Herramientas</Link>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              <span className="text-gray-900" aria-current="page">Nombres para Instagram</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Instagram className="w-4 h-4" />
            Especial Instagram & Bio Aesthetic
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Generador de Nombres para Instagram
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Convierte tu nombre o marca en <strong>letras bonitas, cursivas y fuentes aesthetic</strong> con símbolos. Diseñado para optimizar tu Nombre visible, Biografía e Historias de Instagram.
          </p>
        </div>

        {/* Tool Mode Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1.5 rounded-2xl flex flex-wrap justify-center gap-1 border border-gray-200">
            <button
              onClick={() => setActiveTab('fonts')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                activeTab === 'fonts' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Nombres & Fuentes
            </button>
            <button
              onClick={() => setActiveTab('bio')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                activeTab === 'bio' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layout className="w-4 h-4" />
              Creador de Bio
            </button>
            <button
              onClick={() => setActiveTab('symbols')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                activeTab === 'symbols' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Palette className="w-4 h-4" />
              Símbolos & Marcos
            </button>
            <button
              onClick={() => setActiveTab('ideas')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                activeTab === 'ideas' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Ideas de Username
            </button>
          </div>
        </div>

        {/* Mode 1: Name Generator & Fonts */}
        {activeTab === 'fonts' && (
          <>
            {/* Interactive Generator Input */}
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 border border-purple-800/50">
              <div className="flex justify-between items-center mb-3">
                <label htmlFor="insta-input" className="block text-sm font-bold text-pink-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  Escribe tu Nombre, Marca o Frase:
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-pink-200">
                    {inputText.length} / 150 caracteres
                  </span>
                  <button 
                    onClick={handleRandomSample}
                    className="flex items-center gap-1.5 text-xs font-bold text-pink-300 hover:text-white transition bg-white/10 px-3 py-1.5 rounded-lg border border-white/20"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    Ejemplo
                  </button>
                </div>
              </div>

              <div className="relative mb-6">
                <input
                  id="insta-input"
                  type="text"
                  value={inputText}
                  maxLength={150}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-900/80 border-2 border-purple-500/50 rounded-2xl focus:border-pink-400 focus:outline-none text-xl md:text-2xl font-bold text-white placeholder-gray-500 transition-colors shadow-inner"
                  placeholder="Ejemplo: AestheticGirl..."
                />
                {inputText && (
                  <button 
                    onClick={() => setInputText('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quick Symbol Bar */}
              <div>
                <p className="text-xs font-bold text-purple-300 mb-2.5 uppercase tracking-wider">Toca para agregar símbolos aesthetic:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SYMBOLS.map((sym, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddSymbol(sym)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-pink-500 hover:text-white rounded-xl border border-white/10 hover:border-pink-400 transition text-sm font-semibold"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
              {/* Spacing & Style Modifier Selector */}
              <div className="pt-4 border-t border-purple-800/40 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-pink-400" />
                  Estilo de Espaciado:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSpacingMode('normal')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      spacingMode === 'normal' ? 'bg-pink-500 text-white shadow-sm' : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setSpacingMode('dots')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      spacingMode === 'dots' ? 'bg-pink-500 text-white shadow-sm' : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    N · o · m · b · r · e
                  </button>
                  <button
                    onClick={() => setSpacingMode('spaced')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      spacingMode === 'spaced' ? 'bg-pink-500 text-white shadow-sm' : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    N o m b r e
                  </button>
                </div>
              </div>
            </div>

            {/* Saved Names Drawer if items exist */}
            {savedNames.length > 0 && (
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-3xl p-5 mb-8 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-purple-900 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-pink-600 fill-pink-600" />
                    Tus Nombres Guardados ({savedNames.length})
                  </span>
                  <button 
                    onClick={() => setSavedNames([])}
                    className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Vaciar lista
                  </button>
                </div>
                {!storagePersistent && (
                  <p role="status" className="mb-3 text-xs font-medium text-amber-700">
                    Tu navegador no permite guardar esta lista de forma persistente. Los nombres seguirán disponibles durante esta sesión, pero pueden perderse al cerrar o recargar la página.
                  </p>
                )}
                <div className="flex flex-wrap gap-2.5">
                  {savedNames.map((saved, idx) => (
                    <div 
                      key={idx}
                      className="bg-white border border-pink-200 rounded-xl px-3.5 py-1.5 flex items-center gap-2 shadow-xs"
                    >
                      <span className="text-sm font-medium text-gray-900">{saved}</span>
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(saved, `saved-${idx}`)}
                        aria-label={`Copiar nombre guardado ${saved}`}
                        className="text-xs font-bold text-purple-600 hover:text-purple-800 transition"
                      >
                        {copiedId === `saved-${idx}` ? '✓' : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button 
                        type="button"
                        onClick={() => toggleSaveName(saved)}
                        aria-label={`Eliminar nombre guardado ${saved}`}
                        className="text-xs text-gray-300 hover:text-red-500 transition ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Instagram Header Preview Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-pink-600" />
                  <span className="font-bold text-gray-900 text-sm">Vista previa de tu Perfil de Instagram</span>
                </div>
                <span className="text-xs text-gray-400">Simulación en vivo</span>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 shrink-0">
                  <div className="w-full h-full bg-white rounded-full p-0.5">
                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-xl">
                      {inputText ? inputText.charAt(0).toUpperCase() : 'A'}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base truncate">
                    {convertText(deferredInput, 'cursiva_bold')}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">@{(deferredInput || 'usuario').toLowerCase().replace(/\s+/g, '')}</p>
                  <p className="text-xs text-gray-700 mt-2 whitespace-pre-line leading-relaxed">
                    ✨ {convertText(deferredInput, 'cursiva')} <br />
                    📍 Creador Digital & Aesthetic Vibes <br />
                    ✦ generadordelettering.org
                  </p>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">Filtrar:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                    activeCategory === cat 
                      ? 'bg-purple-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mapped Font Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {fontResults.map(({ fontKey, converted, fontInfo }) => {
                const isCopied = copiedId === fontKey;
                const isSaved = savedNames.includes(converted);

                return (
                  <div 
                    key={fontKey}
                    className="bg-white border border-gray-200 hover:border-pink-400 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition group"
                  >
                    <div className="overflow-hidden flex-1">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        {fontInfo.label}
                      </span>
                      <p className="text-xl md:text-2xl font-medium text-gray-900 truncate pr-2" title={converted}>
                        {converted}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <button
                        onClick={() => toggleSaveName(converted)}
                        title={isSaved ? 'Quitar de guardados' : 'Guardar en favoritos'}
                        aria-label={isSaved ? `Quitar ${converted} de guardados` : `Guardar ${converted} en favoritos`}
                        className={`p-2.5 rounded-xl border transition ${
                          isSaved 
                            ? 'bg-pink-50 border-pink-200 text-pink-600' 
                            : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-pink-600 hover:border-pink-300'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-pink-600' : ''}`} />
                      </button>

                      <button
                        onClick={() => copyToClipboard(converted, fontKey)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                          isCopied 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700 group-hover:bg-purple-600 group-hover:text-white'
                        }`}
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {isCopied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Aesthetic Decorators */}
              {decoratedResults.map((dec) => {
                const { decId, fullDecorated } = dec;
                const isCopied = copiedId === decId;
                const isSaved = savedNames.includes(fullDecorated);

                return (
                  <div 
                    key={decId}
                    className="bg-white border border-gray-200 hover:border-purple-400 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition group"
                  >
                    <div className="overflow-hidden flex-1">
                      <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block mb-1">
                        {dec.name}
                      </span>
                      <p className="text-xl md:text-2xl font-medium text-gray-900 truncate pr-2" title={fullDecorated}>
                        {fullDecorated}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <button
                        onClick={() => toggleSaveName(fullDecorated)}
                        title={isSaved ? 'Quitar de guardados' : 'Guardar en favoritos'}
                        aria-label={isSaved ? `Quitar ${fullDecorated} de guardados` : `Guardar ${fullDecorated} en favoritos`}
                        className={`p-2.5 rounded-xl border transition ${
                          isSaved 
                            ? 'bg-pink-50 border-pink-200 text-pink-600' 
                            : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-pink-600 hover:border-pink-300'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-pink-600' : ''}`} />
                      </button>

                      <button
                        onClick={() => copyToClipboard(fullDecorated, decId)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                          isCopied 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700 group-hover:bg-purple-600 group-hover:text-white'
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

        {/* Mode 2: Interactive Bio Builder & Templates */}
        {activeTab === 'bio' && (
          <div className="space-y-8 mb-12">
            {/* Interactive Bio Builder Card */}
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-purple-800/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-purple-800/40 pb-4">
                <div>
                  <span className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    Creador Interactivo de Biografía
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-white mt-1">Diseña tu Bio Línea por Línea</h2>
                </div>
                {/* Character Counter Indicator */}
                {(() => {
                  const formattedBioName = convertText(bioName, bioFont);
                  const fullBioText = `${formattedBioName}\n${bioRole}\n${bioVibe}\n${bioLink}`;
                  const length = fullBioText.length;
                  const isOver = length > 150;
                  return (
                    <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2 rounded-2xl border border-purple-500/40">
                      <div className="text-right">
                        <span className={`text-xs font-bold ${isOver ? 'text-red-400' : 'text-pink-300'}`}>
                          Límite de Bio (150 car.): {length}/150
                        </span>
                        <div className="w-32 h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${isOver ? 'bg-red-500' : length > 130 ? 'bg-amber-400' : 'bg-pink-500'}`}
                            style={{ width: `${Math.min(100, (length / 150) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Controls */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="instagram-bio-name" className="text-xs font-bold text-pink-300 uppercase">Línea 1: Nombre (Fuente Aesthetic)</label>
                      <select
                        id="instagram-bio-font"
                        aria-label="Fuente aesthetic para la línea 1"
                        value={bioFont} 
                        onChange={(e) => setBioFont(e.target.value)}
                        className="bg-purple-950 text-xs font-bold text-pink-200 border border-purple-500/40 rounded-lg px-2.5 py-1 focus:outline-none"
                      >
                        <option value="cursiva">Cursiva Elegante</option>
                        <option value="cursiva_bold">Cursiva Negrita</option>
                        <option value="doble">Doble Línea</option>
                        <option value="small_caps">Versalitas</option>
                        <option value="gotica">Gótica Antigua</option>
                        <option value="sans_bold">Sans Imprenta</option>
                      </select>
                    </div>
                    <input
                      id="instagram-bio-name"
                      type="text"
                      value={bioName}
                      onChange={(e) => setBioName(e.target.value)}
                      maxLength={30}
                      className="w-full px-4 py-2.5 bg-slate-900/80 border border-purple-500/40 rounded-xl text-white font-medium focus:border-pink-400 focus:outline-none"
                      placeholder="Ej. Sofía"
                    />
                  </div>

                  <div>
                    <label htmlFor="instagram-bio-role" className="block text-xs font-bold text-pink-300 uppercase mb-1.5">Línea 2: Profesión o Categoría</label>
                    <input
                      id="instagram-bio-role"
                      type="text"
                      value={bioRole}
                      onChange={(e) => setBioRole(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900/80 border border-purple-500/40 rounded-xl text-white font-medium focus:border-pink-400 focus:outline-none"
                      placeholder="Ej. 📸 Creadora Digital & Style"
                    />
                  </div>

                  <div>
                    <label htmlFor="instagram-bio-vibe" className="block text-xs font-bold text-pink-300 uppercase mb-1.5">Línea 3: Frase o Estilo de Vida</label>
                    <input
                      id="instagram-bio-vibe"
                      type="text"
                      value={bioVibe}
                      onChange={(e) => setBioVibe(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900/80 border border-purple-500/40 rounded-xl text-white font-medium focus:border-pink-400 focus:outline-none"
                      placeholder="Ej. ☁️ Amante del café y los viajes ☕"
                    />
                  </div>

                  <div>
                    <label htmlFor="instagram-bio-link" className="block text-xs font-bold text-pink-300 uppercase mb-1.5">Línea 4: Enlace o Llamado a la Acción</label>
                    <input
                      id="instagram-bio-link"
                      type="text"
                      value={bioLink}
                      onChange={(e) => setBioLink(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900/80 border border-purple-500/40 rounded-xl text-white font-medium focus:border-pink-400 focus:outline-none"
                      placeholder="Ej. 👇 Conoce mi portafolio:"
                    />
                  </div>
                </div>

                {/* Live Preview Panel & Copy Button */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/80 border border-purple-500/30 rounded-2xl p-5">
                  <div>
                    <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block mb-3">
                      Vista previa de tu Bio final
                    </span>
                    <div className="bg-white text-gray-900 rounded-xl p-4 shadow-sm font-sans text-sm leading-relaxed whitespace-pre-line border border-gray-100">
                      <p className="font-bold text-gray-900">{convertText(bioName, bioFont)}</p>
                      <p className="text-gray-700">{bioRole}</p>
                      <p className="text-gray-700">{bioVibe}</p>
                      <p className="text-purple-600 font-medium">{bioLink}</p>
                    </div>
                  </div>

                  {(() => {
                    const formattedBioName = convertText(bioName, bioFont);
                    const fullBioText = `${formattedBioName}\n${bioRole}\n${bioVibe}\n${bioLink}`;
                    const isCopied = copiedId === 'custom-bio-full';
                    return (
                      <button
                        onClick={() => copyToClipboard(fullBioText, 'custom-bio-full')}
                        className={`mt-4 w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                          isCopied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md'
                        }`}
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {isCopied ? '¡Biografía Copiada!' : 'Copiar Biografía Completa'}
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Ready-made Templates section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Plantillas de Biografía Listas para Usar</h2>
              <p className="text-gray-600 text-sm mb-6">Copia y edita estos diseños aesthetic para estructurar una Bio profesional y atractiva.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BIO_TEMPLATES.map((item, idx) => {
                  const isCopied = copiedId === `bio-${idx}`;
                  return (
                    <div key={idx} className="border border-gray-200 rounded-2xl p-5 bg-gray-50 flex flex-col justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full inline-block mb-3">
                          {item.category}
                        </span>
                        <pre className="whitespace-pre-line font-sans text-sm text-gray-800 leading-relaxed">
                          {item.template}
                        </pre>
                      </div>

                      <button
                        onClick={() => copyToClipboard(item.template, `bio-${idx}`)}
                        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-xs transition ${
                          isCopied 
                            ? 'bg-green-600 text-white' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {isCopied ? '¡Plantilla Copiada!' : 'Copiar Plantilla'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mode 3: Categorized Symbols Vault */}
        {activeTab === 'symbols' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm mb-12 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Paleta de Símbolos, Emojis y Marcos Aesthetic</h2>
              <p className="text-gray-600 text-sm">Toca cualquier símbolo para copiarlo al portapapeles o usarlo en tu perfil de Instagram.</p>
            </div>

            <div className="space-y-6">
              {SYMBOL_CATEGORIES.map((cat, cIdx) => (
                <div key={cIdx} className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                  <h3 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    {cat.name}
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {cat.symbols.map((sym, sIdx) => {
                      const symId = `sym-${cIdx}-${sIdx}`;
                      const isCopied = copiedId === symId;
                      return (
                        <button
                          key={sIdx}
                          onClick={() => {
                            copyToClipboard(sym, symId);
                            handleAddSymbol(sym);
                          }}
                          className={`px-4 py-2.5 rounded-xl border text-base font-semibold transition flex items-center gap-2 ${
                            isCopied 
                              ? 'bg-green-100 border-green-300 text-green-800' 
                              : 'bg-white border-gray-200 hover:border-pink-400 hover:bg-pink-50 text-gray-800 shadow-2xs'
                          }`}
                          title="Haz clic para copiar e insertar"
                        >
                          <span>{sym}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">
                            {isCopied ? '✓' : '+'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode 3: Username Idea Generator */}
        {activeTab === 'ideas' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generador de Ideas de Nombres de Usuario (@username)</h2>
            <p className="text-gray-600 text-sm mb-6">Ideas con prefijos y sufijos en un formato compatible con Instagram. La disponibilidad real debes comprobarla en Instagram antes de elegir el usuario.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {usernameIdeas.map((username, idx) => {
                const isCopied = copiedId === `user-${idx}`;
                return (
                  <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-semibold text-gray-800 truncate">@{username}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={`https://www.instagram.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Comprobar @${username} en Instagram`}
                        title="Verificar disponibilidad en Instagram"
                        className="p-1.5 bg-gray-200 hover:bg-pink-100 hover:text-pink-600 rounded-lg text-gray-600 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => copyToClipboard(`@${username}`, `user-${idx}`)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          isCopied ? 'bg-green-100 text-green-700' : 'bg-gray-200 hover:bg-purple-600 hover:text-white text-gray-700'
                        }`}
                      >
                        {isCopied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step-by-Step Guide Section */}
        <section className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-3xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Instagram className="w-6 h-6 text-pink-600" />
            ¿Cómo cambiar la tipografía en tu perfil de Instagram?
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 font-medium leading-relaxed">
            <li>Escribe tu nombre o texto descriptivo en la caja interactiva superior.</li>
            <li>Selecciona el estilo de letra bonitas o cursivas aesthetic que más encaje con tu marca.</li>
            <li>Haz clic en el botón <strong>"Copiar"</strong>.</li>
            <li>Abre la aplicación de <strong>Instagram</strong> en tu móvil o navegador y entra a tu Perfil.</li>
            <li>Toca en <strong>"Editar perfil"</strong>.</li>
            <li>Pega el texto transformado en la casilla de <strong>Nombre</strong> o <strong>Biografía</strong> y guarda los cambios.</li>
          </ol>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight text-center mb-6">
            Preguntas Frecuentes sobre Nombres para Instagram
          </h2>

          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ¿Cómo poner letras bonitas en mi nombre de usuario de Instagram?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Escribe tu nombre en la caja de texto superior de este generador, elige el estilo de letras bonitas o aesthetic que más te guste, presiona "Copiar", abre Instagram, ve a "Editar perfil", pega el texto en la casilla de Nombre o Biografía y guarda los cambios.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ¿Por qué algunas fuentes o símbolos no se ven en el @username?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Instagram permite la gran mayoría de letras y símbolos Unicode para el campo "Nombre" visible y para la "Biografía". Sin embargo, para la casilla técnica de usuario (@username) Instagram exige caracteres alfanuméricos tradicionales. Por eso te recomendamos usar estas fuentes en tu Nombre visible y Bio.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ¿Es compatible con dispositivos Android y iPhone (iOS)?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Las letras y símbolos se basan en caracteres Unicode estándar y suelen mostrarse correctamente en dispositivos modernos. La apariencia exacta puede variar según la fuente disponible, el sistema operativo y la versión de Instagram.
              </p>
            </div>
          </div>
        </section>

        {/* Related Tools for Internal Linking SEO */}
        <RelatedTools currentPath="/herramientas/generador-de-nombres-para-instagram" />
      </div>
    </>
  );
}
