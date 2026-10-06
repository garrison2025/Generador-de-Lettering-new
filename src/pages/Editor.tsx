import { lazy, Suspense, useEffect, useState } from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ControlPanel } from '../components/Editor/ControlPanel';
import { useEditorStore } from '@/store/useEditorStore';
import { useEditorShortcuts } from '../hooks/useEditorShortcuts';
import { SEO } from '../components/SEO';

const CanvasArea = lazy(() =>
  import('../components/Editor/CanvasArea').then((module) => ({
    default: module.CanvasArea,
  }))
);

function CanvasLoadingFallback() {
  return (
    <div
      className="h-full w-full flex items-center justify-center bg-[#F8F9FC] text-sm text-gray-500"
      role="status"
      aria-live="polite"
    >
      Cargando vista previa…
    </div>
  );
}

export default function Editor({ embedded = false }: { embedded?: boolean }) {
  const canUndo = useEditorStore((state) => state.past.length > 0);
  const canRedo = useEditorStore((state) => state.future.length > 0);
  const [canvasReady, setCanvasReady] = useState(false);
  useEditorShortcuts();

  useEffect(() => {
    setCanvasReady(true);
  }, []);

  return (
    <>
      {!embedded && (
        <SEO 
          title="Editor de Lettering Avanzado | Lienzo, Colores y Efectos"
          description="Editor avanzado de lettering en lienzo: ajusta tipografía, tamaño, color, contorno, sombras y fondo con control manual. Exporta en PNG, JPG o WEBP."
          keywords="editor de lettering, editor de letras online, lienzo de lettering, efectos de texto, sombras y contornos"
        />
      )}
    <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
      {!embedded && (
        <>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
            <Link to="/" className="flex items-center gap-1 hover:text-[#5A4AD2] transition"><Home className="w-4 h-4" /> Inicio</Link>
            <span className="text-gray-500">&gt;</span>
            <span className="text-[#5A4AD2]">Editor de Lettering</span>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Editor de Lettering Avanzado</h1>
            <p className="text-gray-500 max-w-3xl text-sm md:text-base">
              Controla manualmente tipografías, colores, tamaños, contornos, sombras y fondo sobre el lienzo. Este editor está pensado para ajustar cada detalle del diseño.
            </p>
            <Link to="/herramientas/creador-de-lettering" className="inline-flex mt-3 text-sm font-semibold text-[#5A4AD2] hover:underline">
              ¿Prefieres empezar con estilos y plantillas? Abrir el Creador de Lettering →
            </Link>
          </div>
        </>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* On mobile, canvas is at top and sticky, on desktop canvas takes remaining space */}
        <div className="flex-1 flex flex-col gap-6 w-full order-1 lg:order-2">
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col sticky lg:relative top-16 lg:top-0 z-20">
             <div className="p-3 lg:p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl z-10">
               <h2 className="font-bold text-lg text-gray-900 hidden sm:block">Vista Previa</h2>
               
               <details className="relative">
                 <summary className="list-none cursor-pointer flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-sm font-medium hover:bg-gray-50 transition text-gray-700">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   <span className="hidden sm:inline">Exportar</span>
                 </summary>
                 <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl z-50">
                   {[
                     { label: 'PNG (Normal)', format: 'png', pixelRatio: 1 },
                     { label: 'PNG (Alta Resolución)', format: 'png', pixelRatio: 3 },
                     { label: 'JPG (Normal)', format: 'jpeg', pixelRatio: 1 },
                     { label: 'JPG (Alta Resolución)', format: 'jpeg', pixelRatio: 3 },
                     { label: 'WEBP (Optimizada)', format: 'webp', pixelRatio: 1 },
                     { label: 'WEBP (Alta Resolución)', format: 'webp', pixelRatio: 3 }
                   ].map((option) => (
                     <button
                       key={`${option.format}-${option.pixelRatio}`}
                       type="button"
                       onClick={(event) => {
                         window.dispatchEvent(new CustomEvent('export-canvas', {
                           detail: { format: option.format, pixelRatio: option.pixelRatio }
                         }));
                         const details = event.currentTarget.closest('details');
                         if (details) details.open = false;
                       }}
                       className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
                     >
                       Exportar como {option.label}
                     </button>
                   ))}
                 </div>
               </details>
             </div>
             <div className="h-[250px] md:h-[400px] w-full relative bg-[#F8F9FC]">
               {canvasReady ? (
                 <Suspense fallback={<CanvasLoadingFallback />}>
                   <CanvasArea />
                 </Suspense>
               ) : (
                 <CanvasLoadingFallback />
               )}
             </div>
              <div className="p-3 lg:p-4 border-t border-gray-100 flex flex-wrap gap-2 lg:gap-4 bg-white rounded-b-xl">
                <button 
                  className="flex-1 min-w-[30%] lg:min-w-[120px] py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 transition"
                  onClick={() => useEditorStore.getState().undo()}
                  disabled={!canUndo}
                  aria-label="Deshacer"
                >
                  <span className="flex items-center justify-center gap-1 lg:gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                    <span className="hidden sm:inline">Deshacer</span>
                  </span>
                </button>
                <button 
                  className="flex-1 min-w-[30%] lg:min-w-[120px] py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 transition"
                  onClick={() => useEditorStore.getState().redo()}
                  disabled={!canRedo}
                  aria-label="Rehacer"
                >
                  <span className="flex items-center justify-center gap-1 lg:gap-2">
                    <span className="hidden sm:inline">Rehacer</span>
                    <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/></svg>
                    <svg className="w-4 h-4 sm:hidden block" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{transform: "scaleX(-1)"}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                  </span>
                </button>
                <button 
                  className="flex-1 min-w-[30%] lg:min-w-[120px] py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 transition"
                  onClick={() => useEditorStore.getState().resetState()}
                >
                  Reiniciar
                </button>
                <button 
                  className="flex-1 min-w-[30%] lg:min-w-[120px] py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 transition"
                  onClick={() => useEditorStore.getState().randomizeState()}
                >
                  Aleatorio
                </button>
             </div>
           </div>

           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 mb-2 hidden lg:block">
             <h3 className="font-bold text-lg text-gray-900 mb-4">Plantillas Populares</h3>
             <ul className="space-y-3">
               <li><Link to="/plantillas" className="text-[#5A4AD2] hover:underline font-medium text-sm">Cumpleaños Feliz</Link></li>
               <li><Link to="/plantillas" className="text-[#5A4AD2] hover:underline font-medium text-sm">Bodas y Romance</Link></li>
               <li><Link to="/plantillas" className="text-[#5A4AD2] hover:underline font-medium text-sm">Neón y Fiesta</Link></li>
               <li><Link to="/plantillas" className="text-[#5A4AD2] hover:underline font-medium text-sm">Gótico Moderno</Link></li>
               <li><Link to="/plantillas" className="text-[#5A4AD2] hover:underline font-medium text-sm">Vintage Retro</Link></li>
               <li className="pt-2"><Link to="/plantillas" className="text-[#5A4AD2] hover:underline font-bold text-sm">Ver todas las plantillas...</Link></li>
             </ul>
           </div>

           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 mb-8 hidden lg:block">
             <h3 className="font-bold text-lg text-gray-900 mb-4">Consejos Rápidos</h3>
             <ul className="space-y-2 text-sm text-gray-600 list-disc pl-4">
               <li>Usa fuentes legibles para mensajes importantes.</li>
               <li>Contrasta bien el color del texto con el fondo.</li>
               <li>Experimenta con sombras y contornos para dar profundidad.</li>
             </ul>
           </div>
        </div>

        <div className="w-full lg:w-[350px] shrink-0 border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col order-2 lg:order-1">
           <ControlPanel />
        </div>
      </div>
    </div>
    </>
  );
}
