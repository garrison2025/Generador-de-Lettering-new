import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Editor from './Editor';
import { useEditorStore, type EditorState } from '@/store/useEditorStore';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';
import { Sparkles, HelpCircle, BookOpen, CheckCircle, PenTool } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface SeoRouteConfig {
  title: string;
  description: string;
  keywords: string;
  defaultState: Record<string, any>;
  breadcrumbName: string;
  h1Title: string;
  introText: string;
  features: string[];
  steps: string[];
  faqs: FaqItem[];
}

const SEO_LANDING_BASE_STATE: Partial<EditorState> = {
  fontSize: 80,
  letterSpacing: 0,
  lineHeight: 1.2,
  textAlign: 'center',
  textOpacity: 1,
  isGradient: false,
  gradientStartColor: '#FF6B6B',
  gradientEndColor: '#5A4AD2',
  backgroundColor: 'transparent',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 0,
  shadowColor: '#000000',
  strokeWidth: 0,
  strokeColor: '#000000',
  rotation: 0,
  backgroundImage: null,
  canvasRatio: 'free',
  overlayColor: '#000000',
  overlayOpacity: 0,
};

const SEO_CONFIG: Record<string, SeoRouteConfig> = {
  '/generador-de-letras-goticas': {
    title: 'Generador de Letras Góticas Online | Caligrafía Antigua Gratis',
    description: 'Crea letras góticas elegantes online y exporta tus diseños como imagen. Generador de tipografía gótica gratis para nombres, títulos y referencias visuales.',
    keywords: 'generador de letras goticas, letras goticas online, tipografia gotica, fuentes goticas gratis, letras medievales',
    breadcrumbName: 'Letras Góticas',
    defaultState: { fontFamily: 'Pirata One', text: 'Estilo Gótico', textColor: '#000000', backgroundColor: '#F3F4F6' },
    h1Title: 'Generador de Letras Góticas y Fuentes Medievales Online',
    introText: 'La tipografía gótica (también conocida como Blackletter o Fraktur) se asocia con trazos oscuros, ángulos marcados y una estética medieval. Nuestro generador permite diseñar frases y nombres góticos con sombras, contornos, colores y exportación de imagen desde el navegador.',
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
    h1Title: 'Generador de Letras Cursivas y Caligrafía Elegante',
    introText: 'Las letras cursivas y las fuentes manuscritas aportan una distinción estética inigualable a invitaciones de boda, logos de marcas de lujo, frases inspiradoras y publicaciones en redes sociales. Transforma tus palabras con la fluidez del trazo con pluma o pincel.',
    features: [
      'Colección de tipografías Script y Brush Calligraphy de alta fidelidad.',
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
        answer: 'Tipografías como Dancing Script y Great Vibes son ideales por sus ligaduras elegantes, gran legibilidad y trazo caligráfico equilibrado.'
      },
      {
        question: '¿Puedo copiar y pegar estas letras cursivas en WhatsApp?',
        answer: 'Sí. Además de descargar el diseño en formato imagen, puedes usar nuestro conversor de texto Unicode para copiar caracteres cursivos en WhatsApp e Instagram.'
      }
    ]
  },
  '/letras-para-instagram': {
    title: 'Letras para Instagram | Generador de Frases y Bios Aesthetic',
    description: 'Personaliza tu perfil de Instagram con letras bonitas, tipografías aesthetic, cursivas y efectos de diseño visual en HD.',
    keywords: 'letras para instagram, letras bonitas instagram, fuentes instagram aesthetic, bio instagram bonita, creador frases instagram',
    breadcrumbName: 'Letras para Instagram',
    defaultState: { fontFamily: 'Pacifico', text: 'Post de\nInstagram', textColor: '#FF6B6B' },
    h1Title: 'Generador de Letras y Fuentes Aesthetic para Instagram',
    introText: 'Destaca en el feed e historias de Instagram con textos con estilo, fuentes aesthetic, tipografías llamativas y diseños gráficos personalizados. Convierte tu biografía y tus publicaciones en imanes de seguidores.',
    features: [
      'Formatos optimizados para historias, posts cuadrados (1:1) y reels.',
      'Combina fuentes modernas con símbolos decorativos, colores y sombras.',
      'Frases de ejemplo para empezar rápidamente una composición aesthetic.',
      'Interfaz responsive para móviles, tablets y escritorio; el resultado puede variar según navegador y dispositivo.'
    ],
    steps: [
      'Escribe el texto de tu publicación o biografía.',
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
    h1Title: 'Generador de Bocetos de Letras para Tatuajes (Tattoo Lettering)',
    introText: 'Crear un tatuaje con letras requiere una precisión absoluta en el trazo, la escala y la tipografía. Nuestro generador te permite previsualizar nombres, fechas con números romanos y frases en estilos chicano, gótico, fino y caligráfico antes de acudir con tu tatuador.',
    features: [
      'Previsualización de tatuajes con fondo blanco limpio para calcar o imprimir.',
      'Líneas de contorno ajustables (Stroke) ideales para agujas finas.',
      'Estilos populares: Gótico Chicano, Fine Line, Script Tradicional y Cursiva.',
      'Exportación de imágenes ampliadas para compartir una referencia visual con tu tatuador.'
    ],
    steps: [
      'Escribe el nombre, fecha o frase de tu próximo tatuaje.',
      'Prueba diferentes fuentes estilo Tattoo Script o Chicano Lettering.',
      'Ajusta el grosor de línea para que tu tatuador tenga una guía clara.',
      'Exporta el diseño como referencia y consulta con tu tatuador antes de preparar el stencil definitivo.'
    ],
    faqs: [
      {
        question: '¿Puedo llevar esta plantilla impresa a mi tatuador?',
        answer: 'Puedes llevar la imagen como referencia de tipografía y composición. El stencil definitivo debe prepararlo o revisarlo el tatuador según tamaño, ubicación, técnica y legibilidad.'
      },
      {
        question: '¿Qué tipo de letra para tatuaje dura más tiempo legible?',
        answer: 'Las fuentes con buen espacio entre letras (kerning) y líneas no demasiado apretadas mantienen la legibilidad a lo largo de los años a medida que la tinta se asienta.'
      }
    ]
  }
};

export default function SeoPage() {
  const location = useLocation();
  const store = useEditorStore();
  const config = SEO_CONFIG[location.pathname];

  useEffect(() => {
    if (config) {
      store.updateState({
        ...SEO_LANDING_BASE_STATE,
        ...config.defaultState,
      });
    }
  }, [location.pathname]);

  const currentConfig = config || {
    title: 'Generador de Lettering Online | Estudio Tipográfico',
    description: 'Crea composiciones de lettering y caligrafía digital con diseños únicos.',
    keywords: 'generador de lettering, letras bonitas',
    breadcrumbName: 'Lettering',
    defaultState: {},
    h1Title: 'Estudio de Lettering y Caligrafía Digital',
    introText: 'Diseña arte tipográfico personalizado con herramientas profesionales en línea.',
    features: ['Edición tipográfica', 'Sombras y contornos', 'Exportación de imagen'],
    steps: ['Escribe tu texto', 'Elige tu fuente', 'Descarga'],
    faqs: [
      {
        question: '¿Es gratuito?',
        answer: 'Actualmente las funciones disponibles se pueden usar sin registro ni suscripción.'
      }
    ]
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
      
      {/* Editor Component */}
      <Editor embedded />

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

          {/* Step-by-Step Instructions */}
          <section className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-[#5A4AD2]" />
              ¿Cómo usar este generador en 4 pasos sencillos?
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
