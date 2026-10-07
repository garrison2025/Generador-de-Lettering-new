import { copyText } from '../utils/copyText';
import { useState, useDeferredValue, useMemo, useEffect } from 'react';
import { Copy, Check, Sparkles, PenTool, ChevronLeft, Star, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';
import { GeoAnswerBlock } from '../components/GeoAnswerBlock';
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

const FAVORITES_STORAGE_KEY = 'lettering_aesthetic_favorite_styles_v1';
const FAVORITES_LIMIT = 12;
type StyleGroup = 'all' | 'letters' | 'effects' | 'decorations' | 'saved';

function groupForStyle(id: string): Exclude<StyleGroup, 'all' | 'saved'> {
  if (FONT_MAPS[id]) return 'letters';
  if (DECORATORS[id]?.modifier || DECORATORS[id]?.reverse) return 'effects';
  return 'decorations';
}

function normalizedStyleName(name: string) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}



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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo funciona el cambiador de letras bonitas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El conversor aplica 72 estilos y transformaciones al texto mediante caracteres Unicode, signos combinantes, adornos y separadores. Escribes una vez, comparas los resultados y copias la variante que prefieras."
      }
    },
    {
      "@type": "Question",
      "name": "¿En qué aplicaciones puedo pegar estas letras decoradas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Muchas aplicaciones aceptan estos caracteres porque son texto Unicode, pero la compatibilidad no es idéntica en todas las plataformas, campos o dispositivos. Algunos símbolos pueden rechazarse o mostrarse como cuadros si la aplicación o la fuente disponible no incluye ese carácter."
      }
    },
    {
      "@type": "Question",
      "name": "¿Puedo usar el conversor de letras para tatuajes o diseños?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Puedes usar el texto generado como referencia visual. Para una composición en imagen con control de tipografía, color, borde y sombra, utiliza el Editor de Lettering. Para un tatuaje definitivo, el resultado debe tratarse solo como referencia y revisarse con el profesional que realizará el diseño."
      }
    },
    {
      "@type": "Question",
      "name": "¿Es gratis usar este generador de fuentes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No necesitas instalar una fuente ni crear una cuenta. Las funciones disponibles actualmente se pueden usar gratis desde el navegador y ofrecen 72 estilos o transformaciones para comparar."
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
  const [copied, setCopied] = useState<{ id: string; text: string; input: string } | null>(null);
  const [category, setCategory] = useState<StyleGroup>('all');
  const [styleSearch, setStyleSearch] = useState('');
  const [uniqueOnly, setUniqueOnly] = useState(false);
  const [savedStyleIds, setSavedStyleIds] = useState<string[]>([]);
  const [favoritesHydrated, setFavoritesHydrated] = useState(false);
  const [persistentFavorites, setPersistentFavorites] = useState(true);
  const [favoriteMessage, setFavoriteMessage] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState('cursiva');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const safeIds = parsed.filter((value): value is string =>
            typeof value === 'string' && STYLES.some((style) => style.id === value)
          );
          setSavedStyleIds([...new Set(safeIds)].slice(0, FAVORITES_LIMIT));
        }
      }
    } catch {
      setPersistentFavorites(false);
    } finally {
      setFavoritesHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!favoritesHydrated) return;
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(savedStyleIds));
      setPersistentFavorites(true);
    } catch {
      setPersistentFavorites(false);
    }
  }, [savedStyleIds, favoritesHydrated]);

  const toggleFavorite = (id: string) => {
    if (savedStyleIds.includes(id)) {
      setSavedStyleIds((previous) => previous.filter((saved) => saved !== id));
      setFavoriteMessage('El estilo se ha quitado de tu selección.');
    } else if (savedStyleIds.length >= FAVORITES_LIMIT) {
      setFavoriteMessage('Puedes guardar hasta 12 estilos. Quita uno para añadir otro.');
    } else {
      setSavedStyleIds((previous) => [...previous, id]);
      setFavoriteMessage('Estilo añadido a tu selección para comparar.');
    }
  };

  const convertedStyles = useMemo(
    () => STYLES.map((style) => ({
      ...style,
      converted: convertText(deferredInput, style.id),
    })),
    [deferredInput]
  );

  const visibleStyles = useMemo(() => {
    const search = normalizedStyleName(styleSearch.trim());
    const matches = convertedStyles.filter((style) =>
      (category === 'all' ||
        (category === 'saved'
          ? savedStyleIds.includes(style.id)
          : groupForStyle(style.id) === category)) &&
      (!search || normalizedStyleName(style.name).includes(search))
    );
    if (!uniqueOnly) return matches;
    const seen = new Set<string>();
    return matches.filter((style) => {
      if (seen.has(style.converted)) return false;
      seen.add(style.converted);
      return true;
    });
  }, [convertedStyles, category, savedStyleIds, styleSearch, uniqueOnly]);

  const chosenStyle = convertedStyles.find((style) => style.id === selectedStyleId) || convertedStyles[0];
  const isCompareCopied = copied?.id === `compare-${selectedStyleId}` && copied.text === chosenStyle?.converted && copied.input === inputText;
  const countOriginalPoints = Array.from(deferredInput).length;
  const countOutputPoints = Array.from(chosenStyle?.converted || '').length;

  const copyToClipboard = async (text: string, id: string) => {
    const result = { id, text, input: inputText };
    if (!(await copyText(text))) {
      window.alert('No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.');
      return;
    }
    setCopied(result);
    setTimeout(() => setCopied((current) => current === result ? null : current), 2000);
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
          Generador y convertidor de textos orientado a <strong>bios, nombres y perfiles aesthetic</strong>. Filtra 72 estilos, compara cuánto cambia tu texto Unicode y guarda una selección de favoritos para tu próxima bio.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600">
          <span className="rounded-full bg-purple-50 px-3 py-1.5 text-[#5A4AD2]">
            Enfoque aesthetic y social
          </span>
          <Link
            to="/herramientas/conversor-texto"
            className="font-semibold text-[#5A4AD2] hover:underline"
          >
            ¿Quieres comparar 70+ estilos Unicode en una lista general? Abrir Conversor de Letras Online →
          </Link>
        </div>
      </div>

      <GeoAnswerBlock
        id="conversor-letras-bonitas"
        answer={
          <>
            Este conversor ofrece <strong>72 estilos y transformaciones decorativas</strong> para convertir una frase en
            texto Unicode copiable. No instala una tipografía: sustituye, combina o rodea caracteres para producir
            variantes que puedes copiar como texto.
          </>
        }
        facts={[
          { label: 'Estilos configurados', value: '72 variantes entre alfabetos estilizados, signos combinantes, separadores y adornos.' },
          { label: 'Entrada', value: 'Hasta 500 caracteres por conversión.' },
          { label: 'Salida', value: 'Texto copiable; no genera una imagen ni un archivo TTF/OTF.' },
          { label: 'Selección', value: 'Filtros por estilo, comparación de resultados y hasta 12 favoritos locales.' },
          { label: 'Procesamiento', value: 'La transformación se calcula directamente en el navegador.' },
        ]}
        limitation="Una plataforma puede aceptar, rechazar o mostrar de forma distinta ciertos caracteres. Comprueba siempre el resultado en el campo y dispositivo donde vayas a publicarlo."
        source={{
          label: 'Unicode Standard',
          href: 'https://www.unicode.org/standard/standard.html',
        }}
      />

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12">
        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <label htmlFor="text-input" className="block text-sm font-bold text-gray-800 uppercase tracking-wider">Tu Frase o Nombre:</label>
          <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">{inputCharacterCount}/500 caracteres</span>
        </div>
        <div className="p-6 md:p-8">
          <div className="relative">
            <textarea
              id="text-input"
              value={inputText}
              onChange={(e) => setInputText(Array.from(e.target.value).slice(0, 500).join(''))}
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

      <section aria-labelledby="aesthetic-collection-title" className="mb-8 rounded-3xl border border-indigo-100 bg-white p-5 sm:p-7 shadow-sm">
        <h2 id="aesthetic-collection-title" className="text-xl sm:text-2xl font-black text-gray-900">
          Tu colección aesthetic: filtra, compara y guarda estilos
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Este modo está pensado para elegir uno o dos estilos para un perfil o biografía, no solo recorrer una
          lista. Selecciona una categoría, busca por nombre y guarda hasta 12 favoritos en este navegador.
          Los favoritos guardan el <strong>tipo de estilo</strong>, no tu texto personal.
        </p>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
          {([
            ['all', 'Todos'],
            ['letters', 'Letras'],
            ['effects', 'Efectos'],
            ['decorations', 'Adornos'],
            ['saved', `Guardados (${savedStyleIds.length})`],
          ] as const).map(([group, label]) => (
            <button
              key={group}
              type="button"
              aria-pressed={category === group}
              onClick={() => setCategory(group)}
              className={`min-h-11 rounded-xl px-4 py-2 text-sm font-bold border transition ${
                category === group
                  ? 'bg-[#5A4AD2] text-white border-[#5A4AD2]'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-100 hover:bg-indigo-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative mt-5">
          <label htmlFor="aesthetic-style-search" className="mb-2 block text-sm font-bold text-gray-800">
            Buscar un estilo
          </label>
          <Search className="absolute bottom-3 left-3 h-5 w-5 text-gray-500 pointer-events-none" aria-hidden="true" />
          <input
            id="aesthetic-style-search"
            type="search"
            value={styleSearch}
            onChange={(event) => setStyleSearch(event.currentTarget.value.slice(0, 60))}
            placeholder="Prueba cursiva, gótica, tachado, corazones..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none focus:border-[#5A4AD2]"
          />
        </div>
        <label className="mt-4 flex min-h-11 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700">
          <input
            type="checkbox"
            checked={uniqueOnly}
            onChange={(event) => setUniqueOnly(event.currentTarget.checked)}
            aria-label="Ocultar variantes repetidas"
            className="h-5 w-5 accent-[#5A4AD2]"
          />
          Ocultar variantes repetidas en esta selección
        </label>
        <p className="mt-3 text-sm text-gray-600" role="status">
          Se muestran {visibleStyles.length} de {STYLES.length} estilos configurados.
          {!persistentFavorites ? ' Tu navegador no permite guardar la selección de forma permanente.' : ''}
        </p>
        {favoriteMessage && <p role="status" className="mt-2 text-xs text-indigo-800">{favoriteMessage}</p>}
      </section>

      <section aria-labelledby="aesthetic-compare-title" className="mb-8 rounded-3xl border border-gray-200 bg-indigo-50/40 p-5 sm:p-7">
        <h2 id="aesthetic-compare-title" className="text-xl font-black text-gray-900">
          Compara el texto normal con un estilo antes de pegarlo
        </h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Las variantes son caracteres Unicode, no archivos de fuentes. Un adorno puede aumentar la longitud
          del texto o producir símbolos que una plataforma no acepte. Esta prueba calcula puntos de código
          y unidades UTF-16; <strong>no comprueba los límites internos de una red social</strong>.
        </p>
        <label htmlFor="aesthetic-compare-style" className="mt-5 mb-2 block text-sm font-bold text-gray-800">
          Estilo para comparar
        </label>
        <select
          id="aesthetic-compare-style"
          value={selectedStyleId}
          onChange={(event) => setSelectedStyleId(event.currentTarget.value)}
          className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900"
        >
          {convertedStyles.map((style) => <option key={style.id} value={style.id}>{style.name}</option>)}
        </select>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="min-w-0 rounded-xl bg-white border border-gray-200 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Tu texto original</h3>
            <p className="mt-2 min-h-12 break-all text-lg text-gray-900">{deferredInput || '—'}</p>
            <p className="mt-3 text-xs text-gray-600">Puntos de código: {countOriginalPoints} · UTF-16: {deferredInput.length}</p>
          </div>
          <div className="min-w-0 rounded-xl bg-white border border-indigo-200 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">{chosenStyle?.name}</h3>
            <p className="mt-2 min-h-12 break-all text-lg text-gray-900">{deferredInput ? chosenStyle?.converted || '—' : '—'}</p>
            <p className="mt-3 text-xs text-gray-600">Puntos de código: {deferredInput ? countOutputPoints : 0} · UTF-16: {deferredInput ? chosenStyle?.converted.length || 0 : 0}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => copyToClipboard(chosenStyle?.converted || '', `compare-${selectedStyleId}`)}
            disabled={!inputText || inputText !== deferredInput}
            className="min-h-11 rounded-xl bg-[#5A4AD2] px-5 py-3 text-sm font-bold text-white hover:bg-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCompareCopied ? 'Texto comparado copiado' : 'Copiar el estilo comparado'}
          </button>
          <Link to="/blog/como-comprobar-letras-unicode-copiar-pegar" className="text-sm font-semibold text-indigo-800 hover:underline">
            Cómo comprobar compatibilidad antes de guardar →
          </Link>
        </div>
      </section>

      {visibleStyles.length === 0 && (
        <p className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700" role="status">
          No hay estilos en esta selección. Cambia el filtro o borra el texto de búsqueda.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleStyles.map((style) => {
          const converted = style.converted;
          const isCopied = copied?.id === style.id && copied.text === converted && copied.input === inputText;
          
          return (
            <div 
              key={style.id} 
              className={`bg-white border text-left rounded-xl p-5 flex flex-col justify-between gap-4 transition-all duration-200 group ${
                isCopied ? 'border-green-400 shadow-sm ring-1 ring-green-400' : 'border-gray-200 hover:border-[#5A4AD2] hover:shadow-md'
              }`}
            >
              <div className="flex-1 w-full overflow-hidden">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{style.name}</span>
                  <button
                    type="button"
                    aria-label={savedStyleIds.includes(style.id) ? `Quitar estilo ${style.name} de guardados` : `Guardar estilo ${style.name}`}
                    aria-pressed={savedStyleIds.includes(style.id)}
                    onClick={() => toggleFavorite(style.id)}
                    className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl border ${
                      savedStyleIds.includes(style.id)
                        ? 'border-amber-200 bg-amber-50 text-amber-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-amber-300'
                    }`}
                  >
                    <Star className="h-5 w-5" fill={savedStyleIds.includes(style.id) ? 'currentColor' : 'none'} aria-hidden="true" />
                  </button>
                </div>
                <p className="text-2xl text-gray-900 break-words w-full max-h-32 overflow-y-auto pr-2 custom-scrollbar" title={converted}>
                  {converted || '—'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedStyleId(style.id);
                  document.getElementById('aesthetic-compare-title')?.scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                    block: 'start',
                  });
                }}
                className="min-h-11 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
                aria-label={`Comparar estilo ${style.name}`}
              >
                Comparar este estilo
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(converted, style.id)}
                disabled={!inputText || inputText !== deferredInput}
                aria-label={`Copiar estilo ${style.name}`}
                className={`w-full shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
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
            El <strong>Conversor de Letras Bonitas</strong> aplica 72 estilos y transformaciones: alfabetos matemáticos estilizados, caracteres encerrados, signos combinantes, separadores y adornos. A diferencia de instalar archivos TTF u OTF, el resultado sigue siendo texto formado por caracteres Unicode. Eso permite copiarlo y pegarlo en muchos campos de texto, aunque cada aplicación puede imponer sus propias restricciones o carecer de una fuente que muestre algún carácter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#5A4AD2]/10 text-[#5A4AD2] flex items-center justify-center text-sm font-bold">1</span>
              ¿Qué es Unicode y cómo funcionan estas letras?
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Unicode define puntos de código para caracteres de numerosos sistemas de escritura, símbolos y bloques especializados. Algunas transformaciones de esta herramienta usan, por ejemplo, caracteres del bloque Mathematical Alphanumeric Symbols; otras añaden marcas combinantes o adornos. El resultado no cambia la fuente instalada del dispositivo: cambia los caracteres del texto. La visualización concreta depende de la aplicación y de las fuentes disponibles.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#5A4AD2]/10 text-[#5A4AD2] flex items-center justify-center text-sm font-bold">2</span>
              Clasificación de Estilos Disponibles
            </h3>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside">
              <li><strong>Cursivas y estilos matemáticos:</strong> Variantes para nombres, títulos breves y perfiles.</li>
              <li><strong>Góticas y Fraktur:</strong> Opciones visuales para estética dark o nicks; conviene comprobar legibilidad.</li>
              <li><strong>Circulares y cuadradas:</strong> Caracteres encerrados que pueden servir para etiquetas o elementos breves.</li>
              <li><strong>Zalgo, tachados y combinantes:</strong> Efectos decorativos que pueden reducir la legibilidad y la compatibilidad.</li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-6 text-gray-800 space-y-2">
          <h3 className="font-bold text-amber-900 text-lg flex items-center gap-2">
            💡 Recomendaciones de Accesibilidad y Lectores de Pantalla
          </h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            Los lectores de pantalla pueden anunciar algunos caracteres estilizados o combinantes de forma diferente al texto latino básico, y el comportamiento depende del lector, idioma, sistema y carácter concreto. 
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
              El conversor aplica <strong>72 estilos y transformaciones</strong> al texto mediante caracteres Unicode, signos combinantes, adornos y separadores. Escribe una vez, compara los resultados y copia la variante que prefieras.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿En qué aplicaciones puedo pegar estas letras decoradas?</h3>
            <p className="text-gray-600 leading-relaxed">
              Muchas aplicaciones aceptan estos caracteres porque siguen siendo texto Unicode, pero la compatibilidad no es idéntica en todos los campos, plataformas o dispositivos. Algunos símbolos pueden rechazarse o mostrarse como cuadros si la aplicación o la fuente disponible no incluye ese carácter.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Puedo usar el conversor de letras para tatuajes o diseños?</h3>
            <p className="text-gray-600 leading-relaxed">
              Puedes usar el texto como referencia visual. Si necesitas una composición en imagen con control de tipografía, color, borde y sombra, utiliza el <Link to="/editor" className="font-semibold text-[#5A4AD2] hover:underline">Editor de Lettering</Link>. Para un tatuaje definitivo, trata la salida solo como referencia y revísala con el profesional que realizará el diseño.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Es gratis usar este generador de fuentes?</h3>
            <p className="text-gray-600 leading-relaxed">
              No necesitas instalar una fuente ni crear una cuenta. Las funciones disponibles actualmente se pueden usar gratis desde el navegador y permiten probar <strong>72 estilos o transformaciones</strong>.
            </p>
          </div>
        </div>
      </section>

      <RelatedTools currentPath="/herramientas/conversor-letras-bonitas" />
    </div>
    </>
  );
}
