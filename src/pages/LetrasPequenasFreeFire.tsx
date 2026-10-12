import { useState } from 'react';
import { SEO } from '../components/SEO';
import { FreeFireTool, CopyButton, CharacterCount, fieldClass } from '../components/FreeFireTool';
import { smallText } from '../data/freeFireTools';

export default function LetrasPequenasFreeFire() {
  const [nick, setNick] = useState('Luna');
  const [tag, setTag] = useState('pro');
  const [style, setStyle] = useState<'mini_sup' | 'small_caps'>('mini_sup');
  const tiny = smallText(tag, style);
  const layouts = [
    ['Sufijo', `${nick}${tiny}`], ['Prefijo', `${tiny}${nick}`],
    ['Separado', `${nick}・${tiny}`], ['Entre signos', `『${nick}』${tiny}`],
    ['Todo pequeño', smallText(nick, style)],
  ];
  const unsupported = [...new Set(Array.from(tag + nick).filter(char => /[áéíóúüñÁÉÍÓÚÜÑ]/.test(char)))];
  return <>
    <SEO title="Letras Pequeñas para Free Fire | Superíndice y Small Caps" description="Mezcla tu nick con letras pequeñas para Free Fire. Convierte etiquetas a superíndice o Small Caps, compara cinco posiciones y copia el resultado." canonical="https://generadordelettering.org/herramientas/letras-pequenas-para-free-fire" />
    <FreeFireTool title="Letras Pequeñas para Free Fire" intro="Conserva tu apodo y convierte solo la etiqueta a letras pequeñas. Compara prefijos, sufijos y separadores antes de copiar.">
      <section className="rounded-2xl bg-gray-50 border border-gray-200 p-4 md:p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label htmlFor="small-nick" className="block font-bold mb-2">Apodo principal</label><input id="small-nick" value={nick} onChange={e => setNick(e.target.value)} maxLength={100} className={fieldClass} /></div>
          <div><label htmlFor="small-tag" className="block font-bold mb-2">Texto pequeño</label><input id="small-tag" value={tag} onChange={e => setTag(e.target.value)} maxLength={100} className={fieldClass} /></div>
        </div>
        <label htmlFor="small-style" className="block font-bold mt-4 mb-2">Tipo de letra pequeña</label>
        <select id="small-style" className={fieldClass} value={style} onChange={e => setStyle(e.target.value as typeof style)}><option value="mini_sup">Superíndice (ᵖʳᵒ)</option><option value="small_caps">Small Caps (ᴘʀᴏ)</option></select>
        <p className="text-sm text-gray-600 mt-3">Los caracteres sin equivalente pequeño se conservan. Small Caps usa letras Unicode parecidas a mayúsculas pequeñas; no reduce el tamaño real de la fuente.</p>
        {unsupported.length > 0 && <p role="status" className="mt-2 text-amber-800">Se conservan sin convertir: {unsupported.join(', ')}.</p>}
        <div className="mt-4 grid gap-3">{layouts.map(([label, text]) => <article key={label} className="bg-white border border-gray-200 p-4 rounded-xl">
          <h2 className="font-bold text-sm text-gray-600">{label}</h2><output className="block text-2xl break-all my-2">{text}</output>
          <CopyButton text={nick.trim() || tag.trim() ? text : ''} label={`Copiar ${label.toLowerCase()}`} /><CharacterCount text={text} />
        </article>)}</div>
      </section>
      <section className="space-y-3 mt-8 text-gray-700">
        <h2 className="text-2xl font-bold text-gray-900">Un apodo con etiqueta pequeña</h2>
        <p>Con Luna como apodo y pro como etiqueta, el sufijo en superíndice produce Lunaᵖʳᵒ. El prefijo ofrece ᵖʳᵒLuna. Cambia a Small Caps para comparar Lunaᴘʀᴏ sin transformar el texto principal.</p>
        <h3 className="font-bold">¿Qué pasa con los acentos y la ñ?</h3>
        <p>Unicode no dispone de equivalentes completos para todas las letras españolas en estos estilos. Conservamos las letras sin sustituto para no alterar tu nombre: José sigue manteniendo su é. No se trata de una imagen ni de una fuente que haya que instalar.</p>
        <h3 className="font-bold">¿Por qué no se ve igual en todos los teléfonos?</h3>
        <p>Cada dispositivo elige una fuente disponible para representar el carácter. Revisa primero una etiqueta corta dentro de Free Fire y elimina las letras que aparezcan como cuadros.</p>
      </section>
    </FreeFireTool>
  </>;
}
