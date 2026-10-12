import { useState } from 'react';
import { SEO } from '../components/SEO';
import { FreeFireTool, CopyButton, CharacterCount, fieldClass, buttonClass } from '../components/FreeFireTool';
import { SYMBOL_GROUPS } from '../data/freeFireTools';

const DECORATIONS = [['Corona', '♛', '♛'], ['Alas', '꧁', '꧂'], ['Corazón', '♡', '♡'], ['Estrellas', '★', '★'], ['Insano', '乂', 'メ'], ['Marco', '『', '』']];

export default function SimbolosFreeFire() {
  const [name, setName] = useState('Luna');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [selected, setSelected] = useState('');
  const [decoration, setDecoration] = useState(0);
  const [multiple, setMultiple] = useState(false);
  const normalized = query.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const groups = SYMBOL_GROUPS.filter(group => category === 'Todos' || group.name === category).map(group => ({ ...group, symbols: group.symbols.filter(symbol =>
    `${group.name} ${group.heading} ${group.terms} ${symbol}`.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalized)) }));
  const result = name ? `${DECORATIONS[decoration][1]}${name}${selected}${DECORATIONS[decoration][2]}` : selected;
  return <>
    <SEO title="Símbolos para Free Fire para Copiar y Pegar | Coronas y Alas" description="Busca símbolos para Free Fire por categoría: coronas, corazones, alas y signos insanos. Copia uno o varios y combina tu nick en tiempo real." canonical="https://generadordelettering.org/herramientas/simbolos-para-free-fire" />
    <FreeFireTool title="Símbolos para Free Fire para Copiar y Pegar" intro="Encuentra un signo concreto, reúne varios símbolos y prueba cómo quedan alrededor de tu nombre sin cambiar sus letras.">
      <section aria-label="Combinador de símbolos" className="rounded-2xl bg-gray-50 border border-gray-200 p-4 md:p-6 mb-6">
        <label htmlFor="symbol-nick" className="block font-bold mb-2">Tu apodo</label>
        <input id="symbol-nick" value={name} onChange={e => setName(e.target.value)} maxLength={100} className={fieldClass} />
        <div className="flex flex-wrap gap-2 my-3">{DECORATIONS.map(([label], index) => <button type="button" key={label} aria-pressed={decoration === index} onClick={() => setDecoration(index)} className={`rounded-lg border px-3 py-2 ${decoration === index ? 'bg-indigo-100 border-indigo-600' : 'bg-white border-gray-300'}`}>{label}</button>)}</div>
        <output className="block text-2xl break-all mb-2" aria-label="Vista previa del nick">{result || 'Escribe un apodo o selecciona símbolos'}</output>
        <CopyButton text={result} label="Copiar nick" /><CharacterCount text={result} />
      </section>
      <section aria-label="Biblioteca de símbolos">
        <h2 className="text-2xl font-bold mb-3">Buscar signos para Free Fire</h2>
        <label htmlFor="symbol-search" className="block mb-2">Buscar por categoría o símbolo</label>
        <input id="symbol-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="corazón, corona, ★…" className={fieldClass} />
        <label htmlFor="symbol-category" className="block mt-3 mb-2">Categoría</label>
        <select id="symbol-category" value={category} onChange={e => setCategory(e.target.value)} className={fieldClass}>{['Todos', ...SYMBOL_GROUPS.map(g => g.name)].map(item => <option key={item}>{item}</option>)}</select>
        <label className="flex gap-2 items-center my-4"><input type="checkbox" checked={multiple} onChange={e => setMultiple(e.target.checked)} />Reunir varios símbolos (en orden de selección)</label>
        {multiple && <div className="border rounded-xl p-4 mb-4">
          <label htmlFor="symbol-selection" className="block mb-2">Tu combinación editable</label>
          <input id="symbol-selection" className={fieldClass} value={selected} maxLength={200} onChange={e => setSelected(e.target.value)} />
          <div className="flex flex-wrap gap-2 mt-3"><CopyButton text={selected} label="Copiar símbolos" /><button type="button" className={buttonClass} onClick={() => setSelected('')}>Vaciar selección</button></div>
        </div>}
        {!groups.some(group => group.symbols.length) && <p role="status" className="my-4">No hay coincidencias. Prueba «corazón» o cambia la categoría.</p>}
        {groups.filter(group => group.symbols.length).map(group => <div key={group.name} className="my-5">
          <h3 className="font-bold text-lg mb-3">{group.heading}</h3>
          <div className="flex flex-wrap gap-3">{group.symbols.map(symbol => multiple ? <button type="button" className="rounded-xl border border-gray-300 bg-white min-w-12 p-3 text-xl" key={symbol} aria-label={`Añadir ${symbol}`} onClick={() => setSelected(value => Array.from(value + symbol).slice(0, 100).join(''))}>{symbol}</button> : <div key={symbol} className="border rounded-xl p-3"><span className="block text-2xl text-center mb-2">{symbol}</span><CopyButton text={symbol} label={`Copiar ${symbol}`} /></div>)}</div>
        </div>)}
      </section>
      <section className="space-y-3 my-8 text-gray-700">
        <h2 className="text-2xl font-bold text-gray-900">Cómo combinar coronas, corazones y símbolos insanos</h2>
        <p>Para un apodo corto, escribe Luna y elige Corona: obtendrás ♛Luna♛. Si buscas un corazón para Free Fire, filtra Corazones y copia ♡. Activa la selección múltiple para reunir signos sin tener que pegarlos uno por uno.</p>
        <p>Las alas se construyen con pares como ꧁ y ꧂. Los símbolos insanos incluyen figuras como 乂 y メ. Son caracteres decorativos: no conceden ventajas, verificaciones ni objetos dentro del juego.</p>
        <h3 className="font-bold">¿Por qué el contador no coincide con el juego?</h3>
        <p>Un dibujo puede incluir varios caracteres Unicode. El contador muestra puntos de código y unidades UTF-16 como referencia; el cliente de Free Fire decide qué admite. Reduce los adornos si el nombre se rechaza.</p>
      </section>
    </FreeFireTool>
  </>;
}
