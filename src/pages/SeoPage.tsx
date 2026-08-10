import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Editor from './Editor';
import { useEditorStore } from '@/store/useEditorStore';
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

const SEO_CONFIG: Record<string, SeoRouteConfig> = {
  '/generador-de-letras-goticas': {
    title: 'Generador de Letras Góticas Online | Caligrafía Antigua Gratis',
    description: 'Crea e imprime letras góticas elegantes en alta resolución. Generador de tipografía gótica gratis para tatuajes, nombres y títulos medievales.',
    keywords: 'generador de letras goticas, letras goticas online, tipografia gotica, fuentes goticas gratis, letras medievales',
    breadcrumbName: 'Letras Góticas',
    defaultState: { fontFamily: 'Pirata One', text: 'Estilo Gótico', textColor: '#000000', backgroundColor: '#F3F4F6' },
    h1Title: 'Generador de Letras Góticas y Fuentes Medievales Online',
    introText: 'La tipografía gótica (también conocida como Blackletter o Fraktur) surgió en Europa en el siglo XII y se caracteriza por sus trazos oscuros, ángulos marcados y estética majestuosa. Nuestro generador te permite diseñar frases y nombres góticos con efectos visuales modernos, sombras 3D y descarga gratuita en HD.',
    features: [
      'Fuentes de alta definición inspiradas en manuscritos medievales.',
      'Sombra 3D configurable, colores personalizados y textura de pergamino.',
      'Exportación instantánea en formato PNG o SVG transparente.',
      '100% compatible con bocetos de tatuajes, logos y portadas.'
    ],
    steps: [
      'Escribe tu texto o nombre en la caja del editor superior.',
      'Selecciona la tipografía gótica de tu preferencia (ej. Pirata One, Unifraktur).',
      'Personaliza el color de relleno, el grosor del borde y la sombra 3D.',
      'Haz clic en "Descargar Imagen" para guardarla en alta calidad sin marca de agua.'
    ],
    faqs: [
      {
        question: '¿Puedo usar estas letras góticas para bocetos de tatuajes?',
        answer: '¡Sí! Todas las fuentes e imágenes vectoriales generadas en nuestra plataforma son libres de uso para bocetos de tatuajes, impresiones y proyectos personales o comerciales.'
      },
      {
        question: '¿Cuál es la diferencia entre letra gótica y manuscrita?',
        answer: 'La letra gótica se distingue por sus trazos quebrados, gruesos y verticales con remates puntiagudos, mientras que la cursiva o manuscrita es fluida y redondeada.'
      },
      {
        question: '¿Tengo que pagar o registrarme para descargar?',
        answer: 'No. Nuestro estudio de diseño y generador tipográfico es completamente gratis y no requiere registro ni correo electrónico.'
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
      'Generación de imágenes vectoriales para estampar o imprimir.',
      'Opción de copiar formato tipográfico para redes sociales.'
    ],
    steps: [
      'Ingresa la frase o carta que deseas estilizar.',
      'Explora las tipografías cursivas disponibles (Dancing Script, Pacifico, Great Vibes).',
      'Ajusta la inclinación, el interlineado y la paleta de colores.',
      'Descarga tu diseño en PNG transparente o compártelo directo.'
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
      'Combina fuentes modernas con stickers tipográficos y sombras brillantes.',
      'Generador de frases motivacionales e historias aesthetic.',
      'Compatibilidad total con dispositivos iOS y Android.'
    ],
    steps: [
      'Escribe el texto de tu publicación o biografía.',
      'Aplica estilos de letra aesthetic (Neón, Retro, Minimalista).',
      'Personaliza el fondo o mantenlo transparente.',
      'Descarga o copia la composición para pegarla en tu perfil.'
    ],
    faqs: [
      {
        question: '¿Cómo cambiar la letra de la biografía de Instagram?',
        answer: 'Escribe tu texto en nuestro generador, selecciona la fuente que te guste, haz clic en copiar o descargar y pégalo en "Editar Perfil" en la app de Instagram.'
      },
      {
        question: '¿Por qué algunas fuentes de Instagram se ven como cuadros con X?',
        answer: 'Ocurre cuando el sistema operativo del teléfono móvil es muy antiguo y no soporta el estándar Unicode más reciente. Nuestras fuentes recomendadas son 100% compatibles.'
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
      'Exportación en resolución ultra alta para plantillas (stencils).'
    ],
    steps: [
      'Escribe el nombre, fecha o frase de tu próximo tatuaje.',
      'Prueba diferentes fuentes estilo Tattoo Script o Chicano Lettering.',
      'Ajusta el grosor de línea para que tu tatuador tenga una guía clara.',
      'Descarga e imprime tu plantilla de tatuaje gratis.'
    ],
    faqs: [
      {
        question: '¿Puedo llevar esta plantilla impresa a mi tatuador?',
        answer: '¡Totalmente! La exportación en alta resolución te permite imprimir el diseño exacto para que el tatuador haga el stencil sobre tu piel.'
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
      store.updateState(config.defaultState);
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
    features: ['Diseño vectorial', 'Sombras 3D', 'Descarga HD gratuita'],
    steps: ['Escribe tu texto', 'Elige tu fuente', 'Descarga'],
    faqs: [
      {
        question: '¿Es gratuito?',
        answer: 'Sí, 100% gratuito sin registro.'
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
      <Editor />

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
