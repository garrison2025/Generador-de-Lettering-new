import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { CopyButton, fieldClass, buttonClass } from '../components/FreeFireTool';
import { generateBios, type BioStyle } from '../data/aestheticBios';

export default function AestheticBioMaker() {
  useEffect(() => {
    document.documentElement.lang = 'en';
    return () => { document.documentElement.lang = 'es'; };
  }, []);
  const [name, setName] = useState('Luna');
  const [role, setRole] = useState('designer');
  const [interests, setInterests] = useState('coffee, art');
  const [style, setStyle] = useState<BioStyle>('Minimal');
  const [bios, setBios] = useState(() => generateBios('Luna', 'designer', 'coffee, art', 'Minimal'));
  const [selected, setSelected] = useState(0);
  const [activeLine, setActiveLine] = useState(0);
  const [platform, setPlatform] = useState('Instagram');
  const lines = bios[selected] || [];
  const full = lines.join('\n');
  function updateLine(index: number, value: string) {
    setBios(current => current.map((bio, bioIndex) => bioIndex === selected ? bio.map((line, lineIndex) => lineIndex === index ? value : line) : bio));
  }
  function generate() {
    setBios(generateBios(name, role, interests, style));
    setSelected(0);
    setActiveLine(0);
  }
  return <>
    <SEO title="Aesthetic Bio Maker | Generate & Edit Complete Profile Bios" description="Generate three different aesthetic bios from your name, role and interests. Choose Coquette, Dark, Minimal or Kawaii, edit every line and copy your bio." canonical="https://generadordelettering.org/aesthetic-bio-maker" />
    <div lang="en" className="max-w-5xl mx-auto px-4 py-6 md:py-10 w-full">
      <nav aria-label="Related main tool" className="text-sm text-indigo-700 mb-4"><Link to="/herramientas/generador-de-nombres-para-instagram">Instagram names & fonts (Español)</Link></nav>
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Aesthetic Bio Maker</h1>
      <p className="text-gray-600 mb-5">Turn a few details into three complete bio ideas. Choose a mood, generate different wording, and make each line your own.</p>
      <section aria-label="Bio generator" className="border border-gray-200 bg-gray-50 rounded-2xl p-4 md:p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label htmlFor="bio-name" className="block font-bold mb-2">Name</label><input id="bio-name" className={fieldClass} maxLength={40} value={name} onChange={e => setName(e.target.value)} /></div>
          <div><label htmlFor="bio-role" className="block font-bold mb-2">Role or occupation</label><input id="bio-role" className={fieldClass} maxLength={60} value={role} onChange={e => setRole(e.target.value)} /></div>
          <div><label htmlFor="bio-interests" className="block font-bold mb-2">Interests, separated by commas</label><input id="bio-interests" className={fieldClass} maxLength={100} value={interests} onChange={e => setInterests(e.target.value)} /></div>
          <div><label htmlFor="bio-style" className="block font-bold mb-2">Style</label><select id="bio-style" className={fieldClass} value={style} onChange={e => setStyle(e.target.value as BioStyle)}>{['Coquette', 'Dark', 'Minimal', 'Kawaii'].map(item => <option key={item}>{item}</option>)}</select></div>
        </div>
        <button type="button" className={`${buttonClass} mt-4`} onClick={generate}>Generate 3 bios</button>
        <p className="text-sm text-gray-600 mt-2">Generating replaces the current drafts. Your details stay in this browser tab; no account or AI service is needed.</p>
      </section>
      {bios.length === 0 ? <p role="status" className="my-6">Enter a name, role or interest to generate a bio.</p> : <section aria-label="Generated bios" className="grid md:grid-cols-2 gap-5 mt-5">
        <div className="border rounded-2xl p-4 min-w-0">
          <h2 className="font-bold text-xl mb-3">Choose and edit your draft</h2>
          <div className="flex flex-wrap gap-2 mb-4">{bios.map((_, index) => <button type="button" key={index} aria-pressed={selected === index} className={`border rounded-lg px-3 py-2 ${selected === index ? 'bg-indigo-100 border-indigo-600' : 'border-gray-300'}`} onClick={() => { setSelected(index); setActiveLine(0); }}>Bio {index + 1}</button>)}</div>
          {lines.map((line, index) => <div className="mb-3" key={index}><label htmlFor={`bio-line-${index}`} className="block text-sm mb-1">Line {index + 1}</label><input id={`bio-line-${index}`} className={fieldClass} value={line} maxLength={250} onFocus={() => setActiveLine(index)} onChange={e => updateLine(index, e.target.value)} /></div>)}
          <p className="text-sm mb-2">Add to line {activeLine + 1}:</p><div className="flex flex-wrap gap-2 mb-4">{['♡', '୨୧', '✦', '☾', '🎀', '🌸', '✨'].map(symbol => <button type="button" className="border rounded-lg px-3 py-2" key={symbol} aria-label={`Add ${symbol}`} onClick={() => updateLine(activeLine, (lines[activeLine] + symbol).slice(0, 250))}>{symbol}</button>)}</div>
          <CopyButton text={full} label="Copy bio" language="en" />
          <p className="mt-3 text-sm text-gray-600">{Array.from(full).length} Unicode code points · {full.length} UTF-16 units, including line breaks. Shorten your draft if your app rejects it.</p>
        </div>
        <div className="border rounded-2xl p-4 min-w-0">
          <label htmlFor="bio-platform" className="block font-bold mb-2">Profile preview</label><select id="bio-platform" value={platform} onChange={e => setPlatform(e.target.value)} className={fieldClass}><option>Instagram</option><option>TikTok</option></select>
          <div className={`rounded-2xl p-5 mt-4 border ${platform === 'TikTok' ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'}`}>
            <p className="text-xs uppercase tracking-wide mb-5">{platform} · simulated profile</p>
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xl mb-3" aria-hidden="true">{Array.from(name.trim())[0] || '♡'}</div>
            <p className="font-bold break-all mb-3">{name || 'Your profile'}</p><p className="whitespace-pre-wrap break-words" data-testid="bio-preview">{full}</p>
          </div>
          <p className="text-sm text-gray-600 mt-3">A layout guide, not an exact app screenshot. Fonts, wrapping and character limits can differ on your device. Check the pasted result in your profile editor.</p>
        </div>
      </section>}
      <section className="space-y-3 my-8 text-gray-700">
        <h2 className="text-2xl font-bold text-gray-900">From details to a complete bio</h2>
        <p>For Luna, a designer who likes coffee and art, Minimal starts with “Luna / designer / coffee · art / Less noise. More meaning.” Bio 2 introduces Luna in sentences; Bio 3 highlights life off the clock. These are different messages, not three fonts applied to the same text.</p>
        <h3 className="font-bold">Pick a mood that fits your content</h3><p>Coquette adds soft, romantic wording. Dark uses night and mystery themes. Minimal keeps short, direct lines. Kawaii adds playful greetings and encouragement. Use your own details in any language; the connecting template phrases are in English.</p>
        <h3 className="font-bold">Can I edit every line?</h3><p>Yes. Select one of the three drafts and edit each line before copying. Focus a line to choose where the emoji buttons append their character. Switching drafts keeps your edits until you generate again or close the page.</p>
        <h3 className="font-bold">Does it use AI or save my information?</h3><p>No. A local template engine combines the details you enter. Generation works in the browser and does not send those details to a server or database. Review the wording yourself before sharing it.</p>
      </section>
      <nav aria-label="More profile tools" className="flex flex-wrap gap-4 font-semibold text-indigo-700"><Link to="/herramientas/generador-de-nombres-para-instagram">Instagram names & fonts</Link><Link to="/herramientas/letras-tiktok">TikTok fonts</Link></nav>
    </div>
  </>;
}
