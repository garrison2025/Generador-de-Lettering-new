import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { copyText } from '../utils/copyText';

export const fieldClass = 'w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 focus:outline-2 focus:outline-indigo-600';
export const buttonClass = 'rounded-xl bg-[#4F46E5] px-4 py-3 font-bold text-white disabled:opacity-50 hover:bg-indigo-700';

export function CopyButton({ text, label = 'Copiar', language = 'es' }: { text: string; label?: string; language?: 'es' | 'en' }) {
  const [status, setStatus] = useState({ text: '', message: '' });
  return <span className="inline-flex flex-wrap items-center gap-2">
    <button type="button" className={buttonClass} disabled={!text.trim()} onClick={async () => {
      const copied = await copyText(text);
      setStatus({ text, message: copied ? (language === 'en' ? 'Copied' : 'Copiado') : (language === 'en' ? 'Copy failed. Select the text and copy it manually.' : 'No se pudo copiar. Selecciona el texto y cópialo manualmente.') });
    }}>{label}</button>
    <span role="status" className="text-sm text-indigo-700">{status.text === text ? status.message : ''}</span>
  </span>;
}

export function CharacterCount({ text }: { text: string }) {
  return <p className="text-sm text-gray-600 mt-2">{Array.from(text).length} puntos de código Unicode · {text.length} unidades UTF-16. El juego puede contarlos de otra forma.</p>;
}

export function FreeFireTool({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 w-full">
    <nav aria-label="Ruta de navegación" className="text-sm mb-4 text-indigo-700"><Link to="/herramientas/letras-free-fire">Letras para Free Fire</Link> / Herramienta</nav>
    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{title}</h1>
    <p className="text-gray-600 mb-5">{intro}</p>
    {children}
    <aside className="rounded-xl bg-amber-50 border border-amber-200 p-4 my-6 text-sm text-gray-800">
      <strong>Comprueba el resultado dentro del juego.</strong> Algunos símbolos aparecen como cuadros o se rechazan según el dispositivo, la región y la versión. La vista previa es orientativa; no garantiza aceptación ni un límite universal. Prueba una variante corta antes de confirmar cambios.
    </aside>
    <nav aria-label="Más herramientas de Free Fire" className="flex flex-wrap gap-4 text-indigo-700 font-semibold my-6">
      <Link to="/herramientas/letras-free-fire">Letras para Free Fire</Link>
      <Link to="/herramientas/simbolos-para-free-fire">Símbolos</Link>
      <Link to="/herramientas/letras-pequenas-para-free-fire">Letras pequeñas</Link>
      <Link to="/herramientas/descripcion-free-fire">Descripciones</Link>
    </nav>
  </div>;
}
