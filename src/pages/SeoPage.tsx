import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from './Editor';
import { useEditorStore } from '@/store/useEditorStore';

const SEO_CONFIG: Record<string, any> = {
  '/generador-de-letras-goticas': {
    title: 'Generador de Letras Góticas | Generador de Lettering',
    defaultState: { fontFamily: 'Pirata One', text: 'Estilo Gótico', textColor: '#000000', backgroundColor: '#F3F4F6' }
  },
  '/generador-de-letras-cursivas': {
    title: 'Generador de Letras Cursivas | Generador de Lettering',
    defaultState: { fontFamily: 'Dancing Script', text: 'Hermosa Cursiva', textColor: '#5A4AD2' }
  },
  '/letras-para-instagram': {
    title: 'Letras para Instagram | Generador de Lettering',
    defaultState: { fontFamily: 'Pacifico', text: 'Post de\nInstagram', textColor: '#FF6B6B' }
  },
  '/letras-para-tatuajes': {
    title: 'Letras para Tatuajes | Generador de Lettering',
    defaultState: { fontFamily: 'Amatic SC', text: 'Tattoo Art', textColor: '#000000', strokeWidth: 1 }
  }
};

export default function SeoPage() {
  const location = useLocation();
  const store = useEditorStore();

  useEffect(() => {
    const config = SEO_CONFIG[location.pathname];
    if (config) {
      document.title = config.title;
      // Also apply some basic default state changes if we wanted, 
      // but to not overwrite user's work, we typically only do this on initial load.
      // For this simple version, we can just apply state to show something relevant immediately.
      store.updateState(config.defaultState);
    } else {
      document.title = 'Generador de Lettering';
    }
  }, [location.pathname]);

  return <Editor />;
}
