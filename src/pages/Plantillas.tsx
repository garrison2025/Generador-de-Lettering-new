import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEditorStore } from '@/store/useEditorStore';
import { loadFont } from '@/lib/fonts';
import { SEO } from '../components/SEO';

const TEMPLATES = [
  {
    id: 1,
    title: "Cumpleaños Feliz",
    state: { text: "¡Feliz\nCumpleaños!", fontFamily: "Dancing Script", textColor: "#FF6B6B", shadowBlur: 10, shadowColor: "#000000", shadowOffsetX: 2, shadowOffsetY: 2 }
  },
  {
    id: 2,
    title: "Bodas y Romance",
    state: { text: "Nuestra\nBoda", fontFamily: "Great Vibes", textColor: "#5A4AD2", shadowBlur: 0, strokeWidth: 1, strokeColor: "#5A4AD2" }
  },
  {
    id: 3,
    title: "Neón y Fiesta",
    state: { text: "Party\nAll Night", fontFamily: "Permanent Marker", textColor: "#34D399", shadowBlur: 20, shadowColor: "#34D399", backgroundColor: "#000000" }
  },
  {
    id: 4,
    title: "Gótico Moderno",
    state: { text: "Dark\nMagic", fontFamily: "UnifrakturMaguntia", textColor: "#000000", shadowBlur: 0, strokeWidth: 2, strokeColor: "#9333EA", backgroundColor: "#F3F4F6", letterSpacing: 2 }
  },
  {
    id: 5,
    title: "Vintage Retro",
    state: { text: "Good\nVibes", fontFamily: "Yellowtail", textColor: "#FBBF24", shadowBlur: 0, shadowOffsetX: 4, shadowOffsetY: 4, shadowColor: "#000000", backgroundColor: "#3B82F6", rotation: -10 }
  },
  {
    id: 6,
    title: "Elegante Firma",
    state: { text: "J. Doe\nPhotography", fontFamily: "Tangerine", textColor: "#9333EA", fontSize: 100, shadowBlur: 2, shadowOffsetX: 1, shadowOffsetY: 1, shadowColor: "#000000" }
  }
];

export default function Plantillas() {
  const store = useEditorStore();
  const navigate = useNavigate();

  useEffect(() => {
    TEMPLATES.forEach(t => loadFont(t.state.fontFamily));
  }, []);

  const handleUseTemplate = (state: any) => {
    store.updateState(state);
    navigate('/editor');
  };

  return (
    <>
      <SEO 
        title="Plantillas de Lettering Digital | Letras Personalizadas"
        description="Plantillas gratuitas de lettering y caligrafía digital para editar online. Úsalas para invitaciones de cumpleaños, bodas, y frases para tatuajes."
        keywords="plantillas de lettering, plantillas de caligrafia, diseños de letras gratis"
      />
    <div className="py-16 px-4 max-w-7xl mx-auto w-full flex-1">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Plantillas de Lettering</h1>
        <p className="text-gray-600">Comienza tu diseño rápidamente seleccionando una de las plantillas preconfiguradas.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {TEMPLATES.map(tpl => (
           <div key={tpl.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center flex flex-col items-center">
             <div className="w-full h-48 bg-gray-50 rounded-2xl mb-6 flex items-center justify-center border" style={{ backgroundColor: tpl.state.backgroundColor || 'transparent' }}>
               <h3 className="text-3xl text-center leading-tight" style={{ 
                 fontFamily: tpl.state.fontFamily, 
                 color: tpl.state.textColor,
                 textShadow: tpl.state.shadowBlur ? `${tpl.state.shadowOffsetX}px ${tpl.state.shadowOffsetY}px ${tpl.state.shadowBlur}px ${tpl.state.shadowColor}` : 'none',
                 WebkitTextStroke: tpl.state.strokeWidth ? `${tpl.state.strokeWidth}px ${tpl.state.strokeColor}` : 'none'
               }}>
                 {tpl.state.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
               </h3>
             </div>
             <h2 className="text-xl font-bold mb-4">{tpl.title}</h2>
             <button onClick={() => handleUseTemplate(tpl.state)} className="w-full bg-[#5A4AD2] text-white font-medium py-3 rounded-xl hover:bg-[#4F46E5] transition">
               Usar Plantilla
             </button>
           </div>
        ))}
      </div>
    </div>
    </>
  );
}
