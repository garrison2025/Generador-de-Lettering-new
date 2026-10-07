import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Editor from './Editor';
import { EDITOR_DEFAULT_STATE, useEditorStore, type EditorState } from '@/store/useEditorStore';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';
import { GeoAnswerBlock } from '../components/GeoAnswerBlock';
import { Sparkles, HelpCircle, CheckCircle, PenTool } from 'lucide-react';
import { useVisibleFonts } from '../hooks/useVisibleFonts';

interface FaqItem {
  question: string;
  answer: string;
}

interface SeoStarterDesign {
  label: string;
  goal: string;
  explain: string;
  test: string;
  state: Partial<EditorState>;
}

interface SeoRouteConfig {
  title: string;
  description: string;
  keywords: string;
  defaultState: Partial<EditorState>;
  starterDesigns: SeoStarterDesign[];
  breadcrumbName: string;
  h1Title: string;
  introText: string;
  directAnswer: string;
  output: string;
  limitation: string;
  alternative: string;
  features: string[];
  steps: string[];
  faqs: FaqItem[];
}

const SEO_LANDING_BASE_STATE: EditorState = EDITOR_DEFAULT_STATE;

// These are genuine interactive examples, not placeholder article cards.
// Their font loads are triggered only when each card nears the viewport.
function StarterDesignCard({ design, onApply }: { design: SeoStarterDesign; onApply: (design: SeoStarterDesign) => void }) {
  const fontFamily = design.state.fontFamily || 'system-ui';
  const fontRef = useVisibleFonts<HTMLDivElement>([fontFamily], '100px 0px');
  return (
    <article ref={fontRef} className="flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div
        className="flex items-center justify-center min-h-36 p-5 text-center overflow-hidden"
        style={{ backgroundColor: design.state.backgroundColor || '#FFFFFF' }}
        aria-label={`Vista previa de ejemplo: ${design.label}`}
      >
        <span
          className="block max-w-full break-words whitespace-pre-line leading-tight"
          style={{
            fontFamily,
            color: design.state.textColor || '#111827',
            fontSize: 'clamp(1.3rem, 2.8vw, 2.25rem)',
            textShadow: design.state.shadowBlur
              ? `0px 2px ${design.state.shadowBlur / 2}px ${design.state.shadowColor || '#000000'}`
              : undefined,
          }}
        >{design.state.text}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-gray-900">{design.label}</h3>
        <p className="mt-2 text-sm font-semibold text-indigo-800">{design.goal}</p>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{design.explain}</p>
        <p className="mt-3 text-xs text-gray-600 leading-relaxed">
          <strong className="text-gray-800">Qué comprobar:</strong> {design.test}
        </p>
        <button
          type="button"
          onClick={() => onApply(design)}
          className="mt-5 min-h-11 w-full rounded-xl bg-[#5A4AD2] text-white text-sm font-bold hover:bg-[#4F46E5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5A4AD2]"
        >
          Probar este ejemplo en el editor
        </button>
      </div>
    </article>
  );
}

const SEO_CONFIG: Record<string, SeoRouteConfig> = {
  '/generador-de-letras-goticas': {
    title: 'Generador de Letras Góticas Online | Caligrafía Antigua Gratis',
    description: 'Crea letras góticas elegantes online y exporta tus diseños como imagen. Generador de tipografía gótica gratis para nombres, títulos y referencias visuales.',
    keywords: 'generador de letras goticas, letras goticas online, tipografia gotica, fuentes goticas gratis, letras medievales',
    breadcrumbName: 'Letras Góticas',
    defaultState: { fontFamily: 'Pirata One', text: 'Estilo Gótico', textColor: '#000000', backgroundColor: '#F3F4F6' },
    starterDesigns: [
          {
                "label": "Título medieval de alto contraste",
                "goal": "Portada o cabecera de una historia de fantasía.",
                "explain": "El negro sobre fondo marfil mantiene la forma de los caracteres visible sin recurrir a una sombra gruesa.",
                "test": "Comprueba la abertura interior de la G y la legibilidad de las letras al reducir el tamaño.",
                "state": {
                      "text": "REINO\nANTIGUO",
                      "fontFamily": "Pirata One",
                      "fontSize": 84,
                      "textColor": "#111827",
                      "backgroundColor": "#F9F3E5",
                      "strokeWidth": 0,
                      "shadowBlur": 0,
                      "letterSpacing": 2
                }
          },
          {
                "label": "Blackletter nocturno",
                "goal": "Cartel de un evento con estética oscura.",
                "explain": "Usa una familia Fraktur con color claro sobre un fondo muy oscuro. El contorno fino debe acompañar, no tapar, los detalles.",
                "test": "Si las letras parecen fusionarse, retira el contorno antes de añadir más efectos.",
                "state": {
                      "text": "NOCTURNO",
                      "fontFamily": "UnifrakturMaguntia",
                      "fontSize": 76,
                      "textColor": "#F5E6C8",
                      "backgroundColor": "#191726",
                      "strokeWidth": 1,
                      "strokeColor": "#A78BFA",
                      "shadowBlur": 0
                }
          },
          {
                "label": "Iniciales góticas para una marca ficticia",
                "goal": "Ensayar un monograma visual, no crear un logotipo registrado.",
                "explain": "Reducir el texto a dos iniciales permite observar la silueta antes de experimentar con nombres largos.",
                "test": "Compara el resultado con letras básicas y verifica que se puedan distinguir ambas iniciales.",
                "state": {
                      "text": "AR",
                      "fontFamily": "Pirata One",
                      "fontSize": 130,
                      "textColor": "#3F2A19",
                      "backgroundColor": "#FFF7ED",
                      "strokeWidth": 0,
                      "shadowBlur": 0,
                      "letterSpacing": 12
                }
          }
    ],
    h1Title: 'Generador de Letras Góticas y Fuentes Medievales Online',
    introText: 'La categoría Blackletter agrupa estilos de letra de apariencia gótica; Fraktur es una de sus familias históricas. Este generador permite crear una composición visual con tipografías de ese estilo, sombras, contornos, colores y exportación de imagen desde el navegador.',
    directAnswer: 'Este generador crea una imagen con estética gótica o Blackletter a partir de tu texto. No convierte la frase en un alfabeto Unicode gótico para copiar y pegar.',
    output: 'PNG, JPG o WEBP con la composición visual.',
    limitation: 'El resultado es una referencia gráfica y depende de la tipografía elegida; no es un archivo de fuente ni un diseño vectorial.',
    alternative: 'Para texto Unicode copiable utiliza el Conversor de Letras del sitio.',
    features: [
      'Fuentes de estilo gótico y Blackletter disponibles en el editor.',
      'Sombras, contornos, colores personalizados y fondos configurables.',
      'Exportación en PNG, JPG o WEBP; PNG puede conservar un fondo transparente.',
      'Útil para crear referencias visuales de nombres, títulos, portadas y bocetos.'
    ],
    steps: [
      'Escribe tu texto o nombre en la caja del editor superior.',
      'Selecciona la tipografía gótica de tu preferencia (ej. Pirata One, Unifraktur).',
      'Personaliza el color de relleno, el grosor del borde y la sombra 3D.',
      'Usa el menú de exportación para guardar el diseño en PNG, JPG o WEBP, en resolución normal o ampliada.'
    ],
    faqs: [
      {
        question: '¿Puedo usar estas letras góticas para bocetos de tatuajes?',
        answer: 'Puedes usar el resultado como referencia visual para un boceto. Para un tatuaje definitivo, conviene que el profesional adapte el diseño al tamaño, la piel y la técnica. Si incorporas contenido externo, respeta sus licencias y derechos.'
      },
      {
        question: '¿Cuál es la diferencia entre letra gótica y manuscrita?',
        answer: 'La letra gótica se distingue por sus trazos quebrados, gruesos y verticales con remates puntiagudos, mientras que la cursiva o manuscrita es fluida y redondeada.'
      },
      {
        question: '¿Tengo que pagar o registrarme para descargar?',
        answer: 'Actualmente puedes usar las funciones disponibles del editor sin registrarte ni pagar una suscripción.'
      }
    ]
  },
  '/generador-de-letras-cursivas': {
    title: 'Generador de Letras Cursivas Online | Caligrafía Manuscrita',
    description: 'Diseña textos en letras cursivas elegantes y manuscritas. Creador de letras cursivas gratis para invitaciones, logos y redes sociales.',
    keywords: 'generador de letras cursivas, letras cursivas online, fuentes manuscritas, tipografia cursiva elegante, letras de carta',
    breadcrumbName: 'Letras Cursivas',
    defaultState: { fontFamily: 'Dancing Script', text: 'Hermosa Cursiva', textColor: '#5A4AD2' },
    starterDesigns: [
          {
                "label": "Invitación manuscrita",
                "goal": "Encabezado de invitación o mensaje de agradecimiento.",
                "explain": "El trazo fino y el fondo claro centran la atención en la forma sin una sombra que compita con la letra.",
                "test": "Prueba un tamaño más pequeño y observa si las ligaduras se mantienen diferenciadas.",
                "state": {
                      "text": "Con cariño",
                      "fontFamily": "Great Vibes",
                      "fontSize": 92,
                      "textColor": "#55394A",
                      "backgroundColor": "#FFF8F3",
                      "strokeWidth": 0,
                      "shadowBlur": 0
                }
          },
          {
                "label": "Frase casual con pincel",
                "goal": "Tarjeta digital o portada informal.",
                "explain": "Una letra de ritmo más suelto favorece frases breves frente a cuerpos de texto completos.",
                "test": "Ajusta los saltos de línea y comprueba que la primera palabra no toque los bordes.",
                "state": {
                      "text": "Hoy es\nun buen día",
                      "fontFamily": "Dancing Script",
                      "fontSize": 69,
                      "textColor": "#175E58",
                      "backgroundColor": "#E9F8F4",
                      "strokeWidth": 0,
                      "shadowBlur": 0
                }
          },
          {
                "label": "Firma tipográfica conceptual",
                "goal": "Ensayar una firma para un proyecto personal.",
                "explain": "Un solo nombre con buen espacio negativo es más fácil de evaluar que un nombre y subtítulo en la misma línea.",
                "test": "Sustituye el nombre de ejemplo y comprueba que la primera y la última letra siguen leyéndose.",
                "state": {
                      "text": "Valentina",
                      "fontFamily": "Tangerine",
                      "fontSize": 128,
                      "textColor": "#20243A",
                      "backgroundColor": "#F5F6FA",
                      "strokeWidth": 0,
                      "shadowBlur": 0
                }
          }
    ],
    h1Title: 'Generador de Letras Cursivas y Caligrafía Elegante',
    introText: 'Las tipografías cursivas y manuscritas pueden dar un aspecto caligráfico a invitaciones, títulos, logotipos de prueba y publicaciones visuales. Aquí puedes comparar varios estilos Script, ajustar la composición y exportarla como imagen.',
    directAnswer: 'Este generador crea una composición visual con tipografías cursivas y manuscritas. El texto se renderiza como diseño de imagen, no como una fuente instalada ni como caracteres Unicode copiados.',
    output: 'PNG, JPG o WEBP con la composición cursiva.',
    limitation: 'La legibilidad cambia según la fuente, el tamaño y la longitud del texto; revisa el diseño en su tamaño de uso real.',
    alternative: 'Para letras cursivas copiables en chats o bios utiliza el Conversor de Letras Unicode.',
    features: [
      'Selección de tipografías Script y Brush Calligraphy disponibles en el editor.',
      'Efectos de trazo continuo, degradados pasteles y sombras suaves.',
      'Exportación de la composición como imagen en PNG, JPG o WEBP.',
      'Fondos transparentes o de color y relaciones de lienzo configurables.'
    ],
    steps: [
      'Ingresa la frase o carta que deseas estilizar.',
      'Explora las tipografías cursivas disponibles (Dancing Script, Pacifico, Great Vibes).',
      'Ajusta la inclinación, el interlineado y la paleta de colores.',
      'Descarga tu diseño como PNG, JPG o WEBP; usa PNG si necesitas conservar transparencia.'
    ],
    faqs: [
      {
        question: '¿Qué tipo de letra cursiva es mejor para invitaciones?',
        answer: 'Dancing Script y Great Vibes pueden servir como puntos de partida visuales, pero la elección depende del tamaño, la longitud del texto y el nivel de legibilidad que necesite la invitación.'
      },
      {
        question: '¿Puedo copiar y pegar estas letras cursivas en WhatsApp?',
        answer: 'Esta página crea una imagen, no letras copiables. Si necesitas caracteres cursivos para pegar en WhatsApp o Instagram, abre nuestro Conversor de Letras Unicode.'
      }
    ]
  },
  '/letras-para-instagram': {
    title: 'Letras para Instagram | Generador de Frases y Bios Aesthetic',
    description: 'Personaliza tu perfil de Instagram con letras bonitas, tipografías aesthetic, cursivas y efectos de diseño visual en HD.',
    keywords: 'letras para instagram, letras bonitas instagram, fuentes instagram aesthetic, bio instagram bonita, creador frases instagram',
    breadcrumbName: 'Letras para Instagram',
    defaultState: { fontFamily: 'Pacifico', text: 'Post de\nInstagram', textColor: '#FF6B6B' },
    starterDesigns: [
          {
                "label": "Cita minimalista para un post",
                "goal": "Imagen tipográfica para una publicación visual.",
                "explain": "La frase corta y el contraste alto funcionan como punto de partida para una tarjeta digital.",
                "test": "Revisa en un teléfono que el texto siga centrado y con márgenes visibles.",
                "state": {
                      "text": "Un día\na la vez",
                      "fontFamily": "Playfair Display",
                      "fontSize": 70,
                      "textColor": "#344054",
                      "backgroundColor": "#F5F1E9",
                      "strokeWidth": 0,
                      "shadowBlur": 0
                }
          },
          {
                "label": "Story de estilo neón",
                "goal": "Tarjeta de texto para una historia o vídeo vertical.",
                "explain": "Sobre un fondo oscuro, una sombra de color aporta energía sin exigir añadir muchos símbolos.",
                "test": "Comprueba que el texto no desaparezca bajo controles o recortes de la app de destino.",
                "state": {
                      "text": "MI MOMENTO",
                      "fontFamily": "Space Grotesk",
                      "fontSize": 66,
                      "textColor": "#AAFFEC",
                      "backgroundColor": "#120F29",
                      "shadowColor": "#A855F7",
                      "shadowBlur": 17,
                      "strokeWidth": 0
                }
          },
          {
                "label": "Tarjeta de celebración",
                "goal": "Mensaje gráfico para felicitar a alguien.",
                "explain": "Una caligrafía expresiva y una paleta cálida diferencian el titular del fondo.",
                "test": "Al exportar, revisa que los signos de apertura/cierre no queden recortados.",
                "state": {
                      "text": "¡Felicidades!",
                      "fontFamily": "Pacifico",
                      "fontSize": 74,
                      "textColor": "#AE4533",
                      "backgroundColor": "#FFF1E6",
                      "strokeWidth": 0,
                      "shadowBlur": 0
                }
          }
    ],
    h1Title: 'Generador de Letras y Fuentes Aesthetic para Instagram',
    introText: 'Crea composiciones visuales con texto, colores, sombras y tipografías para publicaciones o historias. Esta página usa el editor de imagen; para una biografía o nombre copiable necesitas una variante Unicode.',
    directAnswer: 'Esta página genera imágenes tipográficas para contenido visual de Instagram. No cambia la fuente de Instagram ni convierte por sí sola una bio en texto copiable.',
    output: 'Imagen PNG, JPG o WEBP para una composición visual.',
    limitation: 'Instagram puede redimensionar, recortar o recomprimir imágenes; revisa el resultado en la vista previa de publicación antes de compartirlo.',
    alternative: 'Para una bio o nombre copiable utiliza el Conversor de Letras Bonitas o el Generador de Nombres para Instagram.',
    features: [
      'Lienzos configurables para composiciones cuadradas, verticales u horizontales.',
      'Combina fuentes modernas con símbolos decorativos, colores y sombras.',
      'Frases de ejemplo para empezar rápidamente una composición aesthetic.',
      'Interfaz responsive para móviles, tablets y escritorio; el resultado puede variar según navegador y dispositivo.'
    ],
    steps: [
      'Escribe un título o una frase para tu publicación o historia visual; para una bio Unicode utiliza el conversor de letras.',
      'Aplica estilos de letra aesthetic (Neón, Retro, Minimalista).',
      'Personaliza el fondo o mantenlo transparente.',
      'Descarga la composición como imagen; para texto copiable en la bio utiliza el conversor Unicode del sitio.'
    ],
    faqs: [
      {
        question: '¿Cómo cambiar la letra de la biografía de Instagram?',
        answer: 'Para una biografía de Instagram necesitas texto Unicode copiable, no una imagen. Usa nuestro Conversor de Letras Bonitas para copiar el texto y pégalo después en "Editar perfil". Este editor visual está pensado para crear imágenes para posts e historias.'
      },
      {
        question: '¿Por qué algunas fuentes de Instagram se ven como cuadros con X?',
        answer: 'Puede ocurrir cuando una aplicación, sistema operativo o fuente no incluye determinados caracteres Unicode. Prueba una variante más simple y comprueba el resultado en el dispositivo donde se publicará.'
      }
    ]
  },
  '/letras-para-tatuajes': {
    title: 'Generador de Letras para Tatuajes Online | Tipografías Tattoo',
    description: 'Diseña tu boceto de tatuaje con fuentes góticas, caligráficas, finas y chicanas. Creador de letras para tatuajes gratis en alta calidad.',
    keywords: 'letras para tatuajes, generador letras tatuajes, fuentes tattoo, tipografias para tatuar, bocetos de letras tatuajes',
    breadcrumbName: 'Letras para Tatuajes',
    defaultState: { fontFamily: 'Amatic SC', text: 'Tattoo Art', textColor: '#000000', strokeWidth: 1 },
    starterDesigns: [
          {
                "label": "Nombre con trazos finos",
                "goal": "Referencia visual para hablar de tipografía con un profesional.",
                "explain": "El fondo claro y un color oscuro permiten comparar contraformas y espaciado sin un efecto decorativo.",
                "test": "Consulta al tatuador cómo adaptar detalles pequeños al tamaño y ubicación definitivos.",
                "state": {
                      "text": "Elena",
                      "fontFamily": "Sacramento",
                      "fontSize": 110,
                      "textColor": "#202020",
                      "backgroundColor": "#FFFFFF",
                      "strokeWidth": 0,
                      "shadowBlur": 0
                }
          },
          {
                "label": "Iniciales de estilo gótico",
                "goal": "Explorar una referencia de monograma.",
                "explain": "Dos letras en Blackletter hacen más visible qué partes son finas y cuáles necesitan simplificación.",
                "test": "Evita convertir esta vista previa directamente en stencil: la revisión técnica corresponde al profesional.",
                "state": {
                      "text": "L M",
                      "fontFamily": "UnifrakturMaguntia",
                      "fontSize": 128,
                      "textColor": "#111111",
                      "backgroundColor": "#FFFDF8",
                      "strokeWidth": 0,
                      "shadowBlur": 0
                }
          },
          {
                "label": "Palabra de estilo manual",
                "goal": "Comparar una opción menos ornamental para una palabra significativa.",
                "explain": "El texto grande ayuda a detectar irregularidades antes de reducir la escala.",
                "test": "Revisa todas las letras a la escala de uso y pide al tatuador ajustar la composición.",
                "state": {
                      "text": "Siempre",
                      "fontFamily": "Caveat",
                      "fontSize": 104,
                      "textColor": "#1F2937",
                      "backgroundColor": "#F7F7F7",
                      "strokeWidth": 0,
                      "shadowBlur": 0
                }
          }
    ],
    h1Title: 'Generador de Bocetos de Letras para Tatuajes (Tattoo Lettering)',
    introText: 'Este generador permite previsualizar nombres, fechas y frases con distintas tipografías y grosores antes de llevar una referencia visual a un profesional. La herramienta sirve para explorar composición y estilo, no para producir un stencil final listo para tatuar.',
    directAnswer: 'El generador crea una referencia visual de lettering para tatuajes. Permite comparar tipografías, escala, contorno y composición antes de comentar la idea con un tatuador.',
    output: 'Imagen PNG, JPG o WEBP que puedes usar como referencia visual.',
    limitation: 'No genera un stencil profesional ni evalúa cómo funcionará el diseño sobre una zona concreta de piel; esa adaptación corresponde al tatuador.',
    alternative: 'Usa la imagen como punto de partida y pide al profesional que ajuste tamaño, espaciado, grosor y técnica.',
    features: [
      'Previsualización con fondo claro para revisar forma, escala y composición.',
      'Líneas de contorno ajustables para explorar trazos más finos o más gruesos.',
      'Estilos visuales como gótico, script, cursiva y opciones de trazo fino.',
      'Exportación de imágenes ampliadas para compartir una referencia visual con tu tatuador.'
    ],
    steps: [
      'Escribe el nombre, fecha o frase de tu próximo tatuaje.',
      'Prueba distintas tipografías script, manuales o góticas y elige una referencia visual según la legibilidad del nombre o la frase.',
      'Prueba distintas opciones de grosor y espacio, sin asumir que el resultado tiene la escala o precisión de un stencil profesional.',
      'Exporta el diseño como referencia y consulta con tu tatuador antes de preparar el stencil definitivo.'
    ],
    faqs: [
      {
        question: '¿Puedo llevar esta plantilla impresa a mi tatuador?',
        answer: 'Puedes llevar la imagen como referencia de tipografía y composición. El stencil definitivo debe prepararlo o revisarlo el tatuador según tamaño, ubicación, técnica y legibilidad.'
      },
      {
        question: '¿El resultado es un stencil listo para tatuar?',
        answer: 'No. La imagen es una referencia visual. El stencil definitivo debe prepararlo o revisarlo el tatuador según tamaño, ubicación, técnica, grosor y legibilidad.'
      }
    ]
  }
};

export default function SeoPage() {
  const location = useLocation();
  const updateState = useEditorStore((state) => state.updateState);
  const config = SEO_CONFIG[location.pathname];

  useEffect(() => {
    if (config) {
      updateState({
        ...SEO_LANDING_BASE_STATE,
        ...config.defaultState,
      });
    }
  }, [config, updateState]);

  const currentConfig = config || {
    title: 'Generador de Lettering Online | Estudio Tipográfico',
    description: 'Crea composiciones de lettering y caligrafía digital con diseños únicos.',
    keywords: 'generador de lettering, letras bonitas',
    breadcrumbName: 'Lettering',
    defaultState: {},
    starterDesigns: [],
    h1Title: 'Estudio de Lettering y Caligrafía Digital',
    introText: 'Diseña una composición tipográfica personalizada directamente en el navegador.',
    directAnswer: 'Esta página crea una composición visual de lettering a partir de texto y controles de estilo.',
    output: 'Imagen exportable desde el editor.',
    limitation: 'El resultado es gráfico y no sustituye un archivo de fuente o un editor vectorial.',
    alternative: 'Para texto Unicode copiable utiliza los conversores del sitio.',
    features: ['Edición tipográfica', 'Sombras y contornos', 'Exportación de imagen'],
    steps: ['Escribe tu texto', 'Elige tu fuente', 'Descarga'],
    faqs: [
      {
        question: '¿Es gratuito?',
        answer: 'Actualmente las funciones disponibles se pueden usar sin registro ni suscripción.'
      }
    ]
  };

  const applyStarterDesign = (design: SeoStarterDesign) => {
    updateState({
      ...SEO_LANDING_BASE_STATE,
      ...currentConfig.defaultState,
      ...design.state,
    });
    document.getElementById('seo-embedded-editor')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
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
        "name": currentConfig.breadcrumbName,
        "item": `https://generadordelettering.org${location.pathname}`
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": currentConfig.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <SEO 
        title={currentConfig.title}
        description={currentConfig.description}
        keywords={currentConfig.keywords}
        canonical={`https://generadordelettering.org${location.pathname}`}
        jsonSchema={[breadcrumbSchema, faqSchema]}
      />
      
      {/* Keep the real canvas visible: sample designs populate the same editor, not a mock form. */}
      <div id="seo-embedded-editor" className="scroll-mt-24">
        <Editor embedded />
      </div>

      {/* Rich Educational Content below Editor (Passes Google AdSense Quality & E-E-A-T Review) */}
      <div className="bg-[#F8F9FC] py-12 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Main Content Section */}
          <section className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5A4AD2]/10 text-[#5A4AD2] text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Guía Tipográfica & Tutorial</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {currentConfig.h1Title}
            </h1>

            <GeoAnswerBlock
              id={`seo-answer-${currentConfig.breadcrumbName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              answer={currentConfig.directAnswer}
              facts={[
                { label: 'Resultado', value: currentConfig.output },
                { label: 'Qué puedes ajustar', value: 'Texto, tipografía, tamaño, color, contorno, sombra y fondo.' },
                { label: 'Tipo de herramienta', value: 'Editor visual de imagen ejecutado en el navegador.' },
                { label: 'Alternativa', value: currentConfig.alternative },
              ]}
              limitation={currentConfig.limitation}
            />

            <p className="text-gray-700 text-base leading-relaxed">
              {currentConfig.introText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {currentConfig.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-start gap-3 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <CheckCircle className="w-5 h-5 text-[#5A4AD2] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-800 leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {currentConfig.starterDesigns.length > 0 && (
            <section className="bg-white rounded-3xl p-5 md:p-8 border border-gray-100 shadow-sm space-y-5" aria-labelledby="seo-examples-title">
              <div>
                <h2 id="seo-examples-title" className="text-2xl font-bold text-gray-900">
                  Tres ejemplos específicos para probar
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Cada propuesta modifica de verdad el texto, la tipografía y los colores del editor superior.
                  Los ajustes son orientativos: cambia una propiedad, compara el resultado y conserva la versión que se lea mejor.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentConfig.starterDesigns.map((design) => (
                  <StarterDesignCard key={design.label} design={design} onApply={applyStarterDesign} />
                ))}
              </div>
            </section>
          )}

          {/* Step-by-Step Instructions */}
          <section className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-[#5A4AD2]" />
              ¿Cómo usar este generador en {currentConfig.steps.length} pasos sencillos?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentConfig.steps.map((step, sIdx) => (
                <div key={sIdx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-xl bg-[#5A4AD2] text-white font-black text-sm flex items-center justify-center shrink-0">
                    {sIdx + 1}
                  </span>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Frequently Asked Questions (FAQ) Section */}
          <section className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-6 h-6 text-[#5A4AD2]" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Preguntas Frecuentes (FAQ)
              </h2>
            </div>

            <div className="space-y-4">
              {currentConfig.faqs.map((faq, qIdx) => (
                <div key={qIdx} className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200">
                  <h3 className="font-bold text-gray-900 text-base mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tools Internal Linking */}
          <RelatedTools currentPath={location.pathname} />

        </div>
      </div>
    </>
  );
}
