import { useRef, useState } from 'react';
import { SEO } from '../components/SEO';
import { FreeFireTool, CopyButton, CharacterCount, fieldClass } from '../components/FreeFireTool';
import { DESCRIPTION_TEMPLATES, descriptionParts } from '../data/freeFireTools';

export default function DescripcionFreeFire() {
  const [text, setText] = useState(DESCRIPTION_TEMPLATES[0].text);
  const [style, setStyle] = useState('Todos');
  const [color, setColor] = useState('#FFD700');
  const [budget, setBudget] = useState(100);
  const editor = useRef<HTMLTextAreaElement>(null);
  const visible = descriptionParts(text);
  const visibleText = visible.map(part => part.text).join('');
  function insert(value: string) {
    const start = editor.current?.selectionStart ?? text.length;
    const end = editor.current?.selectionEnd ?? start;
    const next = text.slice(0, start) + value + text.slice(end);
    if (next.length > 2000) return;
    setText(next);
    requestAnimationFrame(() => {
      editor.current?.focus();
      editor.current?.setSelectionRange(start + value.length, start + value.length);
    });
  }
  return <>
    <SEO title="Descripciones para Free Fire para Copiar y Pegar | Editor" description="Personaliza descripciones para Free Fire: plantillas de firmas, códigos de color, símbolos y contador. Edita tu perfil y copia el texto completo." canonical="https://generadordelettering.org/herramientas/descripcion-free-fire" />
    <FreeFireTool title="Descripciones para Free Fire para Copiar y Pegar" intro="Elige una firma, cambia su mensaje y añade códigos de color. El editor copia el texto original con sus códigos y saltos de línea.">
      <section className="bg-gray-50 border rounded-2xl p-4 md:p-6">
        <label htmlFor="description-editor" className="block font-bold mb-2">Tu descripción</label>
        <textarea ref={editor} id="description-editor" rows={3} value={text} onChange={e => setText(e.target.value)} maxLength={2000} className={fieldClass} />
        <div className="flex flex-wrap items-center gap-3 my-3"><label htmlFor="description-color">Color</label><input type="color" id="description-color" value={color} onChange={e => setColor(e.target.value)} /><button type="button" className="rounded-xl border px-3 py-2 bg-white" onClick={() => insert(`[${color.slice(1).toUpperCase()}]`)}>Insertar código de color</button></div>
        <div className="flex flex-wrap gap-2 mb-3" aria-label="Insertar símbolos">{['★', '♡', '♛', 'ツ', '☾', '✦'].map(symbol => <button key={symbol} type="button" aria-label={`Insertar ${symbol}`} className="border rounded-lg px-4 py-2 bg-white" onClick={() => insert(symbol)}>{symbol}</button>)}</div>
        <CopyButton text={text} label="Copiar descripción" />
        <CharacterCount text={text} />
        <p className="text-sm text-gray-600 my-2">Texto visible en esta simulación: {Array.from(visibleText).length} puntos de código. Los códigos también pueden contar para el límite del juego.</p>
        <label htmlFor="description-budget" className="text-sm">Límite que indica tu versión del juego</label>
        <input id="description-budget" type="number" min={1} max={2000} value={budget} onChange={e => setBudget(Math.max(1, Math.min(2000, Number(e.target.value) || 1)))} className={`${fieldClass} mt-2 max-w-40 block`} />
        <p role="status" className={`mt-2 text-sm ${Array.from(text).length > budget ? 'text-red-700' : 'text-gray-600'}`}>{Array.from(text).length > budget ? 'Supera tu límite de referencia; acorta el texto.' : 'Dentro de tu límite de referencia; verifica al pegar.'} El valor inicial 100 es editable y no representa un límite oficial.</p>
        <h2 className="font-bold mt-4 mb-2">Vista previa orientativa de colores</h2>
        <div aria-label="Vista previa de descripción" className="bg-gray-900 rounded-xl p-4 whitespace-pre-wrap break-all min-h-20">{visible.map((part, index) => <span key={index} style={{ color: part.color }}>{part.text}</span>)}</div>
        <p className="text-sm text-gray-600 mt-2">Solo se simulan códigos [RRGGBB] de seis dígitos. Garena puede desactivar colores o interpretarlos de forma distinta en cada versión; este resultado no es una reproducción exacta del perfil.</p>
      </section>
      <section className="mt-6"><h2 className="text-2xl font-bold mb-3">Plantillas de firmas por estilo</h2>
        <label htmlFor="description-style" className="block mb-2">Estilo</label><select id="description-style" value={style} onChange={e => setStyle(e.target.value)} className={fieldClass}>{['Todos', ...new Set(DESCRIPTION_TEMPLATES.map(item => item.style))].map(item => <option key={item}>{item}</option>)}</select>
        <div className="grid md:grid-cols-2 gap-3 mt-4">{DESCRIPTION_TEMPLATES.filter(item => style === 'Todos' || item.style === style).map(item => <article key={item.text} className="border rounded-xl p-4"><h3 className="font-bold">{item.style}</h3><p className="my-3 break-words">{descriptionParts(item.text).map(part => part.text).join('')}</p><div className="flex flex-wrap gap-2"><button type="button" className="rounded-xl border px-4 py-3" onClick={() => setText(item.text)}>Usar plantilla</button><CopyButton text={item.text} /></div></article>)}</div>
      </section>
      <section className="space-y-3 mt-8 text-gray-700"><h2 className="text-2xl font-bold text-gray-900">Cómo preparar tu descripción</h2>
        <p>Elige Minimal para empezar con «Menos ruido. Más estrategia.». Coloca el cursor antes de una palabra e inserta un código de color: [FFD700] sugiere dorado y [FFFFFF] blanco. El color se aplica al texto que sigue hasta el próximo código.</p>
        <p>El botón de copiar conserva los corchetes. Si el juego los muestra literalmente, quítalos y utiliza la firma sin color. Los códigos mal escritos se mantienen visibles para que puedas corregirlos; nunca ejecutamos el contenido como HTML.</p>
        <h3 className="font-bold">¿La firma cambia el nombre del jugador?</h3><p>No. Esta herramienta prepara una descripción para el perfil. Para decorar tu apodo, utiliza las herramientas de símbolos o letras pequeñas enlazadas debajo.</p>
      </section>
    </FreeFireTool>
  </>;
}
