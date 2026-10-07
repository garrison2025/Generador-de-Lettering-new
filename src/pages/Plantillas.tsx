import { Link, useNavigate } from 'react-router-dom';
import { EDITOR_DEFAULT_STATE, useEditorStore, type EditorState } from '@/store/useEditorStore';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';
import { useVisibleFonts } from '../hooks/useVisibleFonts';

const TEMPLATES: { id: number; title: string; useCase: string; adjustment: string; state: Partial<EditorState> }[] = [
  {
    id: 1,
    title: "Cumpleaños Feliz",
    useCase: "Mensaje breve para una tarjeta digital o felicitación.",
    adjustment: "Si el texto pierde legibilidad sobre una foto, prueba un fondo liso antes de subir el desenfoque de la sombra.",
    state: { text: "¡Feliz\nCumpleaños!", fontFamily: "Dancing Script", textColor: "#FF6B6B", shadowBlur: 10, shadowColor: "#000000", shadowOffsetX: 2, shadowOffsetY: 2 }
  },
  {
    id: 2,
    title: "Bodas y Romance",
    useCase: "Prueba visual para invitaciones o encabezados elegantes.",
    adjustment: "Usa una frase corta; si las ligaduras se superponen, baja el tamaño o cambia de fuente para mejorar la lectura.",
    state: { text: "Nuestra\nBoda", fontFamily: "Great Vibes", textColor: "#5A4AD2", shadowBlur: 0, strokeWidth: 1, strokeColor: "#5A4AD2" }
  },
  {
    id: 3,
    title: "Neón y Fiesta",
    useCase: "Título para una invitación a un evento o una publicación oscura.",
    adjustment: "Ajusta sombra y contraste en tamaño pequeño: un resplandor muy ancho puede dificultar distinguir las letras.",
    state: { text: "Party\nAll Night", fontFamily: "Permanent Marker", textColor: "#34D399", shadowBlur: 20, shadowColor: "#34D399", backgroundColor: "#000000" }
  },
  {
    id: 4,
    title: "Gótico Moderno",
    useCase: "Composición de estética Blackletter para palabras cortas.",
    adjustment: "Contrasta el relleno con el contorno y evita bloques de texto largos; las contraformas deben seguir siendo visibles.",
    state: { text: "Dark\nMagic", fontFamily: "UnifrakturMaguntia", textColor: "#000000", shadowBlur: 0, strokeWidth: 2, strokeColor: "#9333EA", backgroundColor: "#F3F4F6", letterSpacing: 2 }
  },
  {
    id: 5,
    title: "Vintage Retro",
    useCase: "Título expresivo para un cartel o portada informal.",
    adjustment: "La rotación y los colores fuertes llaman la atención, pero revisa los márgenes para que ninguna letra quede cortada.",
    state: { text: "Good\nVibes", fontFamily: "Yellowtail", textColor: "#FBBF24", shadowBlur: 0, shadowOffsetX: 4, shadowOffsetY: 4, shadowColor: "#000000", backgroundColor: "#3B82F6", rotation: -10 }
  },
  {
    id: 6,
    title: "Elegante Firma",
    useCase: "Referencia tipográfica para firma de proyecto o portfolio.",
    adjustment: "Sustituye el nombre de demostración y verifica que las iniciales y el subtítulo se lean por separado.",
    state: { text: "J. Doe\nPhotography", fontFamily: "Tangerine", textColor: "#9333EA", fontSize: 100, shadowBlur: 2, shadowOffsetX: 1, shadowOffsetY: 1, shadowColor: "#000000" }
  }
];

type TemplateDefinition = (typeof TEMPLATES)[number];

function TemplateCard({
  tpl,
  onUse,
}: {
  tpl: TemplateDefinition;
  onUse: (state: Partial<EditorState>) => void;
}) {
  const fontRef = useVisibleFonts<HTMLDivElement>(
    tpl.state.fontFamily ? [tpl.state.fontFamily] : [],
    '120px 0px'
  );

  return (
    <div
      ref={fontRef}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center flex flex-col items-center"
    >
      <div
        className="w-full h-48 bg-gray-50 rounded-2xl mb-6 flex items-center justify-center border"
        style={{ backgroundColor: tpl.state.backgroundColor || 'transparent' }}
      >
        <h3
          className="text-3xl text-center leading-tight"
          style={{
            fontFamily: tpl.state.fontFamily,
            color: tpl.state.textColor,
            textShadow: tpl.state.shadowBlur
              ? `${tpl.state.shadowOffsetX}px ${tpl.state.shadowOffsetY}px ${tpl.state.shadowBlur}px ${tpl.state.shadowColor}`
              : 'none',
            WebkitTextStroke: tpl.state.strokeWidth
              ? `${tpl.state.strokeWidth}px ${tpl.state.strokeColor}`
              : 'none',
            transform: tpl.state.rotation ? `rotate(${tpl.state.rotation}deg)` : undefined,
            letterSpacing: tpl.state.letterSpacing != null ? `${tpl.state.letterSpacing}px` : undefined,
          }}
        >
          {(tpl.state.text || '').split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </h3>
      </div>
      <h2 className="text-xl font-bold mb-2">{tpl.title}</h2>
      <p className="text-sm leading-relaxed text-gray-600 mb-2">{tpl.useCase}</p>
      <p className="text-xs leading-relaxed text-gray-500 mb-5"><strong className="text-gray-700">Qué ajustar:</strong> {tpl.adjustment}</p>
      <button
        type="button"
        onClick={() => onUse(tpl.state)}
        className="w-full bg-[#5A4AD2] text-white font-medium py-3 rounded-xl hover:bg-[#4F46E5] transition"
      >
        Usar Plantilla
      </button>
    </div>
  );
}

const templatesSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Plantillas de Lettering Digital",
  "url": "https://generadordelettering.org/plantillas",
  "description": "Colección de plantillas de lettering preconfiguradas para abrir y personalizar en el editor online."
};

const templatesBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://generadordelettering.org/" },
    { "@type": "ListItem", "position": 2, "name": "Plantillas", "item": "https://generadordelettering.org/plantillas" }
  ]
};

export default function Plantillas() {
  const updateState = useEditorStore((state) => state.updateState);
  const navigate = useNavigate();

  const handleUseTemplate = (state: Partial<EditorState>) => {
    updateState({
      ...EDITOR_DEFAULT_STATE,
      ...state,
    });
    navigate('/editor');
  };

  return (
    <>
      <SEO 
        title="Plantillas de Lettering Digital | Letras Personalizadas"
        description="Plantillas gratuitas de lettering digital para editar online. Empieza con estilos de cumpleaños, bodas, neón, gótico, vintage y firma elegante."
        keywords="plantillas de lettering, plantillas de caligrafia, diseños de letras gratis"
        canonical="https://generadordelettering.org/plantillas"
        jsonSchema={[templatesSchema, templatesBreadcrumbSchema]}
      />
    <div className="py-16 px-4 max-w-7xl mx-auto w-full flex-1">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
        <Link to="/" className="hover:text-[#5A4AD2] transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-gray-900">Plantillas</span>
      </nav>

      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Plantillas de Lettering</h1>
        <p className="text-gray-600">Comienza tu diseño rápidamente seleccionando una de las plantillas preconfiguradas.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {TEMPLATES.map((tpl) => (
          <TemplateCard key={tpl.id} tpl={tpl} onUse={handleUseTemplate} />
        ))}
      </div>

      <section className="mt-14 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8" aria-labelledby="plantillas-usar">
        <h2 id="plantillas-usar" className="text-2xl font-bold text-gray-900">Cómo utilizar estas seis plantillas</h2>
        <p className="mt-3 text-gray-600 leading-relaxed">
          Cada tarjeta guarda un conjunto distinto de tipografía, texto, color y efectos. Al elegir <strong>Usar Plantilla</strong>,
          se abrirá el editor con esos valores preconfigurados; no se descarga una imagen hasta que elijas exportar.
        </p>
        <ol className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          <li className="rounded-xl bg-indigo-50/70 border border-indigo-100 p-5">
            <h3 className="font-bold text-gray-900">1. Elige según el mensaje</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">Para una palabra corta puedes probar una cursiva; para títulos oscuros, un efecto neón o gótico. La legibilidad importa más que el número de adornos.</p>
          </li>
          <li className="rounded-xl bg-indigo-50/70 border border-indigo-100 p-5">
            <h3 className="font-bold text-gray-900">2. Personaliza el texto</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">Sustituye el ejemplo, ajusta tamaño, color, sombra y espaciado. Compara la vista previa grande con su tamaño real en móvil.</p>
          </li>
          <li className="rounded-xl bg-indigo-50/70 border border-indigo-100 p-5">
            <h3 className="font-bold text-gray-900">3. Revisa y exporta</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">Comprueba bordes y contraste antes de exportar PNG, JPG o WEBP. La resolución ampliada no equivale a preparar un archivo para imprenta.</p>
          </li>
        </ol>
        <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900">¿Por qué no se ve igual en todos los dispositivos?</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">La carga de tipografías, el navegador y el tamaño del lienzo influyen en la vista previa. Estas tarjetas son puntos de partida, no diseños finales únicos. Si una fuente no funciona para tu texto, elige una alternativa en el editor.</p>
          <p className="mt-3 text-sm text-gray-600">
            También puedes seguir nuestro <Link to="/blog/lettering-digital-tres-estilos-paso-a-paso" className="font-semibold text-indigo-700 hover:underline">ejercicio de tres composiciones</Link> para comparar estilos antes de tomar una decisión.
          </p>
        </div>
      </section>

      <RelatedTools currentPath="/plantillas" />
    </div>
    </>
  );
}
