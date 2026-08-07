import { useEffect } from 'react';
import { Home, Sparkles, Download, RotateCcw, Shuffle, Wand2, Type, Layers, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CanvasArea } from '../components/Editor/CanvasArea';
import { ControlPanel } from '../components/Editor/ControlPanel';
import { useEditorStore } from '@/store/useEditorStore';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';

export default function CreadorLettering() {
  const updateState = useEditorStore((state) => state.updateState);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          useEditorStore.getState().undo();
        } else if (e.key === 'y' || (e.shiftKey && e.key === 'z') || e.key === 'Z') {
          e.preventDefault();
          useEditorStore.getState().redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const presets = [
    {
      name: '🌟 Neón Ciberpunk',
      badge: 'Neón',
      style: {
        fontFamily: 'Pacifico',
        fontSize: 75,
        textColor: '#00F0FF',
        shadowColor: '#FF007F',
        shadowBlur: 25,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        strokeWidth: 2,
        strokeColor: '#FFFFFF',
        backgroundColor: '#0F172A',
        isGradient: false,
      }
    },
    {
      name: '✨ Caligrafía Dorada',
      badge: 'Lujo',
      style: {
        fontFamily: 'Great Vibes',
        fontSize: 85,
        textColor: '#FBBF24',
        shadowColor: '#78350F',
        shadowBlur: 8,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        strokeWidth: 1,
        strokeColor: '#FEF3C7',
        backgroundColor: '#1E1B4B',
        isGradient: true,
        gradientStartColor: '#FDE047',
        gradientEndColor: '#D97706',
      }
    },
    {
      name: '🎨 Pincel Acuarela',
      badge: 'Script',
      style: {
        fontFamily: 'Dancing Script',
        fontSize: 80,
        textColor: '#EC4899',
        shadowColor: '#831843',
        shadowBlur: 12,
        shadowOffsetX: 2,
        shadowOffsetY: 4,
        strokeWidth: 0,
        strokeColor: '#000000',
        backgroundColor: '#FFF1F2',
        isGradient: false,
      }
    },
    {
      name: '🖤 Gótico Intenso',
      badge: 'Gótico',
      style: {
        fontFamily: 'Pirata One',
        fontSize: 80,
        textColor: '#111827',
        shadowColor: '#DC2626',
        shadowBlur: 15,
        shadowOffsetX: 4,
        shadowOffsetY: 4,
        strokeWidth: 2,
        strokeColor: '#EF4444',
        backgroundColor: '#F9FAFB',
        isGradient: false,
      }
    },
    {
      name: '🍩 Retro 3D 80s',
      badge: '3D Pop',
      style: {
        fontFamily: 'Permanent Marker',
        fontSize: 70,
        textColor: '#F43F5E',
        shadowColor: '#1E40AF',
        shadowBlur: 0,
        shadowOffsetX: 8,
        shadowOffsetY: 8,
        strokeWidth: 3,
        strokeColor: '#FEF08A',
        backgroundColor: '#F0F9FF',
        isGradient: false,
      }
    },
    {
      name: '🌸 Cute Pastel',
      badge: 'Aesthetic',
      style: {
        fontFamily: 'Caveat',
        fontSize: 90,
        textColor: '#A855F7',
        shadowColor: '#F472B6',
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        strokeWidth: 2,
        strokeColor: '#FFFFFF',
        backgroundColor: '#FAF5FF',
        isGradient: false,
      }
    },
    {
      name: '⚡ Metalic Outline',
      badge: 'Moderno',
      style: {
        fontFamily: 'Lobster',
        fontSize: 75,
        textColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowBlur: 6,
        shadowOffsetX: 4,
        shadowOffsetY: 4,
        strokeWidth: 4,
        strokeColor: '#4F46E5',
        backgroundColor: '#EEF2FF',
        isGradient: false,
      }
    },
    {
      name: '🌿 Elegante Script',
      badge: 'Boda & Eventos',
      style: {
        fontFamily: 'Parisienne',
        fontSize: 85,
        textColor: '#047857',
        shadowColor: '#064E3B',
        shadowBlur: 6,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        strokeWidth: 0,
        strokeColor: '#000000',
        backgroundColor: '#ECFDF5',
        isGradient: false,
      }
    }
  ];

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Creador de Lettering Online",
    "url": "https://generadordelettering.org/creador-de-lettering",
    "description": "Herramienta online para crear diseños de lettering digital, fuentes manuscritas, efectos neón, 3D y caligrafía. Gratis y sin registro.",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué es el Creador de Lettering Online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Es una aplicación web gratuita que permite diseñar frases tipográficas personalizadas combinando fuentes caligráficas, sombras 3D, contornos, efectos neón y degradados de color sin necesidad de programas de diseño complejos."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cómo exportar las imágenes creadas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Puedes exportar tu composición en formatos PNG, JPG o WEBP en resolución estándar o Alta Definición (HD) lista para imprimir o compartir en redes sociales."
        }
      },
      {
        "@type": "Question",
        "name": "¿Es necesario registrarse para usar el Creador de Lettering?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, todas las herramientas de LetrasPro son 100% gratuitas y de acceso inmediato sin necesidad de crear cuenta ni instalar aplicaciones."
        }
      }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Cómo crear lettering digital gratis online",
    "description": "Paso a paso para personalizar textos con fuentes caligráficas, sombras 3D y descargar imágenes en alta resolución.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Escribe tu frase",
        "text": "Introduce tu texto o selecciona una de las frases populares sugeridas."
      },
      {
        "@type": "HowToStep",
        "name": "Selecciona la tipografía y color",
        "text": "Elige entre fuentes brush script, góticas o elegantes y aplica colores sólidos o degradados."
      },
      {
        "@type": "HowToStep",
        "name": "Añade efectos 3D y sombra",
        "text": "Ajusta el desenfoque de sombra, desplazamiento de perspectiva y contorno de texto."
      },
      {
        "@type": "HowToStep",
        "name": "Exporta tu imagen en HD",
        "text": "Descarga tu diseño en PNG transparente o JPG en calidad estándar o HD."
      }
    ]
  };

  return (
    <>
      <SEO 
        title="Creador de Lettering Online Gratis | Diseñador de Letras y Tipografía"
        description="Creador de lettering digital gratis en español. Escribe tu frase, aplica estilos neón, caligrafía, 3D y acuarela. Descarga imágenes en PNG HD para Instagram, TikTok o cuadernos."
        keywords="creador de lettering, diseñador de letras, letras bonitas creador, creador de tipografía online, hacer lettering digital gratis"
        jsonSchema={[webAppSchema, faqSchema, howToSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <ol className="flex items-center space-x-2 font-medium">
            <li>
              <Link to="/" className="flex items-center gap-1 hover:text-[#5A4AD2] transition">
                <Home className="w-4 h-4" /> Inicio
              </Link>
            </li>
            <li><span>/</span></li>
            <li>
              <Link to="/editor" className="hover:text-[#5A4AD2] transition">Herramientas</Link>
            </li>
            <li><span>/</span></li>
            <li className="text-[#5A4AD2] font-semibold" aria-current="page">Creador de Lettering</li>
          </ol>
        </nav>

        {/* Title Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-[#5A4AD2] to-purple-800 text-white p-8 md:p-10 rounded-3xl shadow-md space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Estudio de Diseño Tipográfico
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Creador de <span className="text-amber-300">Lettering</span> Digital Online
          </h1>
          <p className="text-purple-100 max-w-3xl text-sm md:text-base leading-relaxed">
            Convierte cualquier texto o frase en un diseño tipográfico profesional. Elige un estilo predefinido o personaliza cada detalle: fuentes caligráficas, degradados, sombras 3D, contornos brillantes y luces de neón.
          </p>
        </div>

        {/* Quick Presets Bar */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-[#5A4AD2]" />
              Estilos Rápidos Predefinidos (1-Clic)
            </h2>
            <span className="text-xs text-gray-500 hidden sm:inline">Selecciona un estilo para aplicarlo al lienzo</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => updateState(p.style)}
                className="p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#5A4AD2] hover:shadow-md transition text-left flex flex-col justify-between h-20 group"
              >
                <span className="text-[10px] font-bold text-[#5A4AD2] bg-purple-50 px-1.5 py-0.5 rounded w-fit">
                  {p.badge}
                </span>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#5A4AD2] truncate">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Inspiration Phrases Category Section */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Inspiración de Frases para Lettering
              </h2>
              <p className="text-xs text-gray-500">Haz clic en cualquier frase para verla renderizada al instante en el lienzo de diseño.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100/80 space-y-2">
              <span className="text-xs font-bold text-[#5A4AD2] uppercase tracking-wider block">🌟 Motivación</span>
              <div className="flex flex-col gap-1.5">
                {[
                  'Hazlo con Pasión 🔥',
                  'Crea tu Futuro 🚀',
                  'Dream Big & Work Hard 💫',
                  'Sonríe Siempre 😊'
                ].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => {
                      updateState({ text: phrase });
                      document.getElementById('lettering-canvas-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left text-xs bg-white hover:bg-[#5A4AD2] text-gray-700 hover:text-white px-3 py-2 rounded-xl border border-purple-100 transition font-medium truncate shadow-2xs"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100/80 space-y-2">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">💖 Amor & Amistad</span>
              <div className="flex flex-col gap-1.5">
                {[
                  'Juntos es Mejor ❤️',
                  'Love Yourself First 🌸',
                  'Eres Mi Lugar Favorito 🏡',
                  'Forever & Always ♾️'
                ].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => {
                      updateState({ text: phrase });
                      document.getElementById('lettering-canvas-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left text-xs bg-white hover:bg-pink-600 text-gray-700 hover:text-white px-3 py-2 rounded-xl border border-pink-100 transition font-medium truncate shadow-2xs"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/80 space-y-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">🎉 Celebraciones</span>
              <div className="flex flex-col gap-1.5">
                {[
                  '¡Feliz Cumpleaños! 🎂',
                  'Felicidades Graduado 🎓',
                  'Welcome Home 🌺',
                  'Party Time 🎈'
                ].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => {
                      updateState({ text: phrase });
                      document.getElementById('lettering-canvas-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left text-xs bg-white hover:bg-amber-600 text-gray-700 hover:text-white px-3 py-2 rounded-xl border border-amber-100 transition font-medium truncate shadow-2xs"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/80 space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">🌿 Aesthetic & Paz</span>
              <div className="flex flex-col gap-1.5">
                {[
                  'Stay Mindful ☕',
                  'Good Vibes Only 🌿',
                  'Paz Interior 🧘‍♀️',
                  'Keep Growing 🌻'
                ].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => {
                      updateState({ text: phrase });
                      document.getElementById('lettering-canvas-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left text-xs bg-white hover:bg-emerald-600 text-gray-700 hover:text-white px-3 py-2 rounded-xl border border-emerald-100 transition font-medium truncate shadow-2xs"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Interactive Studio (Canvas + Control Panel) */}
        <div id="lettering-canvas-section" className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Canvas Side */}
          <div className="flex-1 flex flex-col gap-6 w-full order-1 lg:order-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col sticky lg:relative top-0 z-20">
              <div className="p-3 lg:p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl z-10">
                <div className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-[#5A4AD2]" />
                  <h2 className="font-bold text-base md:text-lg text-gray-900">Lienzo de Diseño</h2>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 bg-[#5A4AD2] text-white rounded-xl text-sm font-bold hover:bg-[#4338CA] transition shadow-sm">
                    <Download className="w-4 h-4" />
                    <span>Exportar Lettering</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('export-canvas', { detail: { format: 'png', pixelRatio: 1 } }))}>
                      Exportar como PNG (Normal)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('export-canvas', { detail: { format: 'png', pixelRatio: 3 } }))}>
                      Exportar como PNG (Alta Res - HD)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('export-canvas', { detail: { format: 'jpeg', pixelRatio: 1 } }))}>
                      Exportar como JPG (Normal)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('export-canvas', { detail: { format: 'jpeg', pixelRatio: 3 } }))}>
                      Exportar como JPG (Alta Res - HD)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('export-canvas', { detail: { format: 'webp', pixelRatio: 1 } }))}>
                      Exportar como WEBP (Web)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('export-canvas', { detail: { format: 'webp', pixelRatio: 3 } }))}>
                      Exportar como WEBP (Alta Res)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="h-[280px] md:h-[420px] w-full relative bg-[#F8F9FC]">
                <CanvasArea />
              </div>

              <div className="p-3 lg:p-4 border-t border-gray-100 flex flex-wrap gap-2 lg:gap-4 bg-white rounded-b-2xl">
                <button 
                  className="flex-1 min-w-[30%] lg:min-w-[110px] py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 transition"
                  onClick={() => useEditorStore.getState().undo()}
                  disabled={useEditorStore((state: any) => state.historyIndex === 0)}
                >
                  <span className="flex items-center justify-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Deshacer</span>
                  </span>
                </button>
                <button 
                  className="flex-1 min-w-[30%] lg:min-w-[110px] py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 transition"
                  onClick={() => useEditorStore.getState().redo()}
                  disabled={useEditorStore((state: any) => !state.history || state.historyIndex >= state.history.length - 1)}
                >
                  <span className="flex items-center justify-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 transform scale-x-[-1]" />
                    <span>Rehacer</span>
                  </span>
                </button>
                <button 
                  className="flex-1 min-w-[30%] lg:min-w-[110px] py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 text-gray-700 transition"
                  onClick={() => useEditorStore.getState().resetState()}
                >
                  Reiniciar
                </button>
                <button 
                  className="flex-1 min-w-[30%] lg:min-w-[110px] py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 text-gray-700 transition"
                  onClick={() => useEditorStore.getState().randomizeState()}
                >
                  <span className="flex items-center justify-center gap-1">
                    <Shuffle className="w-3.5 h-3.5 text-[#5A4AD2]" />
                    <span>Aleatorio</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Controls Side */}
          <div className="w-full lg:w-[360px] shrink-0 border border-gray-200/80 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col order-2 lg:order-1">
            <ControlPanel />
          </div>
        </div>

        {/* Step by Step Guide Section */}
        <section className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200/80 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#5A4AD2] text-xs font-bold">
              <Layers className="w-3.5 h-3.5" /> Tutorial Paso a Paso
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              ¿Cómo Usar el Creador de Lettering?
            </h2>
            <p className="text-gray-600 text-sm">
              Sigue estos 4 sencillos pasos para obtener un acabado artístico profesional en minutos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#5A4AD2] text-white font-black flex items-center justify-center text-lg">
                1
              </div>
              <h3 className="font-bold text-gray-900 text-base">Escribe tu Frase</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ingresa tu frase motivacional, nombre de marca, palabra o título en el cuadro de texto del panel lateral.
              </p>
            </div>

            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#5A4AD2] text-white font-black flex items-center justify-center text-lg">
                2
              </div>
              <h3 className="font-bold text-gray-900 text-base">Elige Tipografía</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Navega entre fuentes de caligrafía de pincel (Brush Script), letras góticas, retro, elegantes o dibuja contornos.
              </p>
            </div>

            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#5A4AD2] text-white font-black flex items-center justify-center text-lg">
                3
              </div>
              <h3 className="font-bold text-gray-900 text-base">Añade Efectos 3D</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ajusta el grosor del trazo, sombras con relieve 3D, degradados cromáticos y colores de fondo personalizados.
              </p>
            </div>

            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#5A4AD2] text-white font-black flex items-center justify-center text-lg">
                4
              </div>
              <h3 className="font-bold text-gray-900 text-base">Descarga en HD</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Haz clic en "Exportar Lettering" para descargar una imagen PNG o JPG transparente lista para usar en redes o imprimir.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Educational Article */}
        <article className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200/80 shadow-sm space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">
              ¿Qué es el Lettering Digital y cuáles son sus ventajas?
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              A diferencia de la caligrafía tradicional (escribir letras de un solo trazo continuo) o la tipografía (caracteres mecanografiados estándar), el <strong>lettering</strong> es el arte de <em>dibujar letras</em>. Cada letra es tratada como una ilustración independiente con personalidad propia, incluyendo sombras, degradados, texturas y contornos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Estilos Más Usados en Lettering
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                <li><strong>Brush Lettering:</strong> Simula trazos realizados con pincel flexible, con líneas finas al subir y gruesas al bajar.</li>
                <li><strong>Chalk Lettering:</strong> Estilo de tiza sobre pizarra, ideal para menús de cafeterías y eventos.</li>
                <li><strong>Gótico & Fraktur:</strong> Fuentes históricas con ángulos marcados y apariencia majestuosa.</li>
                <li><strong>3D & Neón:</strong> Composiciones modernas con sombras paralelas, resplandor neón y profundidad.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Usos Populares de tus Creaciones
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                <li>Publicaciones y portadas destacadas para Instagram y TikTok.</li>
                <li>Tarjetas de felicitación, bodas, cumpleaños y eventos.</li>
                <li>Títulos decorativos para apuntes digitales en GoodNotes o Notability.</li>
                <li>Estampados para camisetas, tazas, stickers y papelería.</li>
              </ul>
            </div>
          </div>
        </article>

        {/* FAQs Section */}
        <section className="bg-purple-50/50 p-8 md:p-10 rounded-3xl border border-purple-100 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#5A4AD2]" />
            <h2 className="text-2xl font-bold text-gray-900">Preguntas Frecuentes sobre el Creador de Lettering</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-purple-100">
              <h3 className="font-bold text-gray-900 text-base mb-2">¿El Creador de Lettering es totalmente gratuito?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sí, todas las funciones de edición, fuentes tipográficas, estilos 3D y descargas en alta definición son 100% gratuitas y sin marcas de agua.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-purple-100">
              <h3 className="font-bold text-gray-900 text-base mb-2">¿Puedo descargar mi diseño con fondo transparente?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sí. Para obtener un fondo transparente, selecciona "Sin Fondo / Transparente" en el selector de color de fondo del panel de control y exporta en formato PNG.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-purple-100">
              <h3 className="font-bold text-gray-900 text-base mb-2">¿Funciona en teléfonos móviles y tablets?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Totalmente. El creador está adaptado de forma responsive para funcionar con fluidez en dispositivos Android, iOS (iPhone/iPad) y computadoras de escritorio.
              </p>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <RelatedTools currentPath="/herramientas/creador-de-lettering" />
      </div>
    </>
  );
}
