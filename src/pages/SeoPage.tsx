import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from './Editor';
import { useEditorStore } from '@/store/useEditorStore';
import { SEO } from '../components/SEO';

interface SeoRouteConfig {
  title: string;
  description: string;
  keywords: string;
  defaultState: Record<string, any>;
  breadcrumbName: string;
}

const SEO_CONFIG: Record<string, SeoRouteConfig> = {
  '/generador-de-letras-goticas': {
    title: 'Generador de Letras Góticas Online | Caligrafía Antigua Gratis',
    description: 'Crea e imprime letras góticas elegantes en alta resolución. Generador de tipografía gótica gratis para tatuajes, nombres y títulos medievales.',
    keywords: 'generador de letras goticas, letras goticas online, tipografia gotica, fuentes goticas gratis, letras medievales',
    breadcrumbName: 'Letras Góticas',
    defaultState: { fontFamily: 'Pirata One', text: 'Estilo Gótico', textColor: '#000000', backgroundColor: '#F3F4F6' }
  },
  '/generador-de-letras-cursivas': {
    title: 'Generador de Letras Cursivas Online | Caligrafía Manuscrita',
    description: 'Diseña textos en letras cursivas elegantes y manuscritas. Creador de letras cursivas gratis para invitaciones, logos y redes sociales.',
    keywords: 'generador de letras cursivas, letras cursivas online, fuentes manuscritas, tipografia cursiva elegante, letras de carta',
    breadcrumbName: 'Letras Cursivas',
    defaultState: { fontFamily: 'Dancing Script', text: 'Hermosa Cursiva', textColor: '#5A4AD2' }
  },
  '/letras-para-instagram': {
    title: 'Letras para Instagram | Generador de Frases y Bios Aesthetic',
    description: 'Personaliza tu perfil de Instagram con letras bonitas, tipografías aesthetic, cursivas y efectos de diseño visual en HD.',
    keywords: 'letras para instagram, letras bonitas instagram, fuentes instagram aesthetic, bio instagram bonita, creador frases instagram',
    breadcrumbName: 'Letras para Instagram',
    defaultState: { fontFamily: 'Pacifico', text: 'Post de\nInstagram', textColor: '#FF6B6B' }
  },
  '/letras-para-tatuajes': {
    title: 'Generador de Letras para Tatuajes Online | Tipografías Tattoo',
    description: 'Diseña tu boceto de tatuaje con fuentes góticas, caligráficas, finas y chicanas. Creador de letras para tatuajes gratis en alta calidad.',
    keywords: 'letras para tatuajes, generador letras tatuajes, fuentes tattoo, tipografias para tatuar, bocetos de letras tatuajes',
    breadcrumbName: 'Letras para Tatuajes',
    defaultState: { fontFamily: 'Amatic SC', text: 'Tattoo Art', textColor: '#000000', strokeWidth: 1 }
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
    defaultState: {}
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

  return (
    <>
      <SEO 
        title={currentConfig.title}
        description={currentConfig.description}
        keywords={currentConfig.keywords}
        canonical={`https://generadordelettering.org${location.pathname}`}
        jsonSchema={[breadcrumbSchema]}
      />
      <Editor />
    </>
  );
}
