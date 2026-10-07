import { useMemo, useState } from 'react';

const SAMPLES = [
  { label: 'Texto básico', text: 'HOLA' },
  { label: 'Negrita Unicode', text: '𝗛𝗢𝗟𝗔' },
  { label: 'Letras rodeadas', text: 'ⒽⓄⓁⒶ' },
  { label: 'Marcas combinantes', text: 'H̲O̲L̲A̲' },
  { label: 'Relleno U+3164', text: 'A\u3164B' },
];

export default function UnicodeInspector() {
  const [input, setInput] = useState('𝗛𝗢𝗟𝗔');
  const points = useMemo(() => Array.from(input), [input]);

  const chooseText = (value: string) => setInput(value);

  return (
    <section aria-labelledby="unicode-inspector-title" className="my-10 rounded-3xl border border-indigo-200 bg-indigo-50/50 p-5 md:p-7">
      <h2 id="unicode-inspector-title" className="text-2xl font-black text-gray-900">
        Laboratorio Unicode: compara los caracteres reales
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        Este experimento funciona en tu navegador. Prueba ejemplos, modifica el texto y observa cuántos
        puntos de código y unidades UTF-16 forman cada cadena. No envía tu entrada a un servidor.
      </p>
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Ejemplos Unicode">
        {SAMPLES.map((sample) => (
          <button
            key={sample.label}
            type="button"
            onClick={() => chooseText(sample.text)}
            className="min-h-11 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-indigo-800 hover:border-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {sample.label}
          </button>
        ))}
      </div>

      <label htmlFor="unicode-inspector-input" className="mt-6 mb-2 block text-sm font-bold text-gray-900">
        Texto que quieres examinar
      </label>
      <textarea
        id="unicode-inspector-input"
        className="w-full min-h-24 rounded-xl border border-gray-300 bg-white p-4 text-xl text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
        value={input}
        onChange={(e) => setInput(Array.from(e.currentTarget.value).slice(0, 80).join(''))}
        spellCheck={false}
        aria-describedby="unicode-inspector-help"
      />
      <p id="unicode-inspector-help" className="mt-1 text-xs text-gray-600">
        Límite local de la demo: 80 puntos de código; no representa ningún límite de TikTok, Instagram o juegos.
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-indigo-100 bg-white p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-600">Puntos de código</dt>
          <dd className="mt-1 text-3xl font-black text-gray-900">{points.length}</dd>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-white p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-600">Unidades UTF-16</dt>
          <dd className="mt-1 text-3xl font-black text-gray-900">{input.length}</dd>
        </div>
      </dl>

      <h3 className="mt-7 text-base font-bold text-gray-900">Código de cada carácter (en orden)</h3>
      <p className="mt-1 text-xs text-gray-600">
        Los códigos U+ no son medidas de visibilidad ni certifican compatibilidad con una plataforma.
      </p>
      {points.length ? (
        <ol className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {points.map((character, index) => (
            <li key={index} className="min-w-0 rounded-lg border border-gray-200 bg-white p-3 text-center">
              <span className="block break-all text-lg font-semibold text-gray-900">
                {character.trim() ? character : '␣'}
              </span>
              <span className="mt-1 block font-mono text-xs text-indigo-800">
                U+{character.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm text-gray-600">Escribe o elige un ejemplo para ver sus códigos.</p>
      )}
      <p className="mt-5 text-xs leading-relaxed text-gray-700">
        Una letra acentuada puede usar un punto de código precompuesto o una letra más una marca.
        Un símbolo suplementario puede ocupar dos unidades UTF-16. La cantidad de símbolos visibles
        o de caracteres aceptados por una red social puede ser diferente de ambos recuentos.
      </p>
    </section>
  );
}
