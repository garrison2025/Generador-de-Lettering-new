import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, ArrowRight, Check, ChevronLeft } from 'lucide-react';
import { SEO } from '../components/SEO';
import { GeoAnswerBlock } from '../components/GeoAnswerBlock';

const SHEETS = [
  {
    title: 'Trazos Básicos',
    description: 'Practica líneas rectas, diagonales, curvas y ritmos repetitivos sobre guías de altura y línea base.',
    level: 'Principiante',
    format: 'A4 SVG',
    color: 'bg-green-100 text-green-700'
  },
  {
    title: 'Alfabeto Minúsculas',
    description: 'Repasa grupos de letras minúsculas de la a a la z y continúa cada secuencia sobre las líneas guía.',
    level: 'Principiante',
    format: 'A4 SVG',
    color: 'bg-green-100 text-green-700'
  },
  {
    title: 'Alfabeto Mayúsculas',
    description: 'Practica grupos de letras mayúsculas de la A a la Z con referencias grises y espacio para repetirlas.',
    level: 'Intermedio',
    format: 'A4 SVG',
    color: 'bg-orange-100 text-orange-700'
  },
  {
    title: 'Florituras y Conexiones',
    description: 'Practica bucles, enlaces, símbolos decorativos y palabras cortas para mejorar continuidad y ritmo.',
    level: 'Avanzado',
    format: 'A4 SVG',
    color: 'bg-red-100 text-red-700'
  }
];

const PRACTICE_CONTENT: Record<string, { subtitle: string; samples: string[] }> = {
  'Trazos Básicos': {
    subtitle: 'Repite los trazos manteniendo ritmo, altura y separación constantes.',
    samples: ['||||||||', '////////', 'uuuuuuuu', 'mmmmmmmm', 'oooooooo', 'llllllll']
  },
  'Alfabeto Minúsculas': {
    subtitle: 'Traza las letras grises y continúa la secuencia sobre las guías.',
    samples: ['a  b  c  d  e', 'f  g  h  i  j', 'k  l  m  n  o', 'p  q  r  s  t', 'u  v  w  x  y', 'z  a  m  o  r']
  },
  'Alfabeto Mayúsculas': {
    subtitle: 'Practica proporción y consistencia antes de añadir florituras.',
    samples: ['A  B  C  D  E', 'F  G  H  I  J', 'K  L  M  N  O', 'P  Q  R  S  T', 'U  V  W  X  Y', 'Z  A  M  O  R']
  },
  'Florituras y Conexiones': {
    subtitle: 'Practica bucles y enlaces suaves; deja espacio para repetir cada motivo.',
    samples: ['l  l  l  l  l', 'o  o  o  o  o', 's  s  s  s  s', '∞   ∞   ∞   ∞', '❦    ❧    ❦    ❧', 'love   dream   create']
  }
};

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function generateSVG(title: string) {
  const content = PRACTICE_CONTENT[title] || PRACTICE_CONTENT['Trazos Básicos'];
  const rows = content.samples.map((sample, index) => {
    const y = 250 + index * 125;
    return `
      <g>
        <line x1="55" y1="${y - 38}" x2="745" y2="${y - 38}" stroke="#e5e7eb" stroke-width="1" />
        <line x1="55" y1="${y}" x2="745" y2="${y}" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="5 5" />
        <line x1="55" y1="${y + 38}" x2="745" y2="${y + 38}" stroke="#94a3b8" stroke-width="1.5" />
        <text x="70" y="${y + 24}" font-family="cursive" font-size="42" fill="#9ca3af">${escapeXml(sample)}</text>
      </g>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1131" width="210mm" height="297mm">
    <rect width="800" height="1131" fill="#ffffff" />
    <text x="400" y="78" font-family="sans-serif" font-size="28" font-weight="700" fill="#111827" text-anchor="middle">Plantilla de Práctica: ${escapeXml(title)}</text>
    <text x="400" y="118" font-family="sans-serif" font-size="15" fill="#64748b" text-anchor="middle">${escapeXml(content.subtitle)}</text>
    <line x1="55" y1="155" x2="745" y2="155" stroke="#e2e8f0" stroke-width="2" />
    ${rows}
    <text x="400" y="1085" font-family="sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">Generador de Lettering · generadordelettering.org</text>
  </svg>`;
}

const practiceSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Plantillas de Práctica de Lettering",
  "url": "https://generadordelettering.org/herramientas/plantillas-practica",
  "description": "Genera y descarga hojas A4 en SVG para practicar trazos, alfabetos y conexiones de lettering.",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

const practiceBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://generadordelettering.org/" },
    { "@type": "ListItem", "position": 2, "name": "Herramientas", "item": "https://generadordelettering.org/herramientas" },
    { "@type": "ListItem", "position": 3, "name": "Plantillas de Práctica", "item": "https://generadordelettering.org/herramientas/plantillas-practica" }
  ]
};

function svgPreviewDataUrl(title: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(generateSVG(title))}`;
}

function slugifyTitle(title: string) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function PlantillasPractica() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (title: string) => {
    setDownloading(title);
    
    const svgData = generateSVG(title);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantilla-${slugifyTitle(title)}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Give Safari and other browsers time to consume the Blob URL before release.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    setTimeout(() => {
      setDownloading(null);
    }, 1500);
  };

  return (
    <>
      <SEO 
        title="Plantillas de Práctica de Lettering | Descargar SVG Gratis"
        description="Descarga guías y plantillas de práctica imprimibles para lettering y caligrafía. Trazos básicos, minúsculas y mayúsculas gratis."
        keywords="plantillas de practica lettering, descargar plantillas caligrafia, guias lettering gratis, hojas de practica lettering"
        canonical="https://generadordelettering.org/herramientas/plantillas-practica"
        jsonSchema={[practiceSchema, practiceBreadcrumbSchema]}
      />
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
        <Link to="/" className="hover:text-[#5A4AD2] transition-colors">Inicio</Link>
        <span>/</span>
        <Link to="/herramientas" className="hover:text-[#5A4AD2] transition-colors">Herramientas</Link>
        <span>/</span>
        <span className="text-gray-900">Plantillas de Práctica</span>
      </nav>

      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-[#5A4AD2]/10 text-[#5A4AD2] text-sm font-bold rounded-full mb-4">Recursos Gratuitos</span>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Plantillas de Práctica</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Descarga hojas de práctica A4 en SVG listas para imprimir o abrir en un navegador. Practica trazos, alfabetos y conexiones con guías diferenciadas.
        </p>
      </div>

      <GeoAnswerBlock
        id="plantillas-practica"
        answer={
          <>
            Esta herramienta genera <strong>cuatro hojas de práctica A4 en formato SVG</strong>: trazos básicos,
            minúsculas, mayúsculas y florituras/conexiones. El archivo se crea en el navegador y puede abrirse,
            escalarse o imprimirse sin convertirlo primero a una imagen rasterizada.
          </>
        }
        facts={[
          { label: 'Formato', value: 'SVG con tamaño A4 (210 × 297 mm).' },
          { label: 'Hojas disponibles', value: '4 plantillas generadas por la propia página.' },
          { label: 'Contenido', value: 'Guías, muestras grises y espacio para repetir trazos o letras.' },
          { label: 'Descarga', value: 'Archivo SVG generado localmente al pulsar Descargar.' },
        ]}
        limitation="La plantilla es una guía de práctica, no un curso de caligrafía ni una evaluación de técnica. La escala física final depende de las opciones de impresión del navegador o impresora."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SHEETS.map((sheet) => (
          <div key={sheet.title} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group">
            <div className="h-48 relative overflow-hidden bg-gray-100">
              <img
                src={svgPreviewDataUrl(sheet.title)}
                alt={`Vista previa de la plantilla ${sheet.title}`}
                width="400"
                height="566"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain bg-white group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm">
                {sheet.format}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="mb-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${sheet.color}`}>
                  {sheet.level}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{sheet.title}</h3>
              <p className="text-sm text-gray-600 mb-6 flex-1">{sheet.description}</p>
              
              <button
                type="button"
                onClick={() => handleDownload(sheet.title)}
                className={`flex items-center justify-center gap-2 w-full py-2.5 border rounded-lg text-sm font-bold transition-all shadow-sm ${
                  downloading === sheet.title 
                    ? 'bg-green-100 border-green-200 text-green-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-[#5A4AD2] hover:text-white hover:border-[#5A4AD2]'
                }`}
              >
                {downloading === sheet.title ? (
                  <>
                    <Check className="w-4 h-4" />
                    ¡Descargado!
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Descargar Guía SVG
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      <section aria-labelledby="practice-print-title" className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 sm:p-8">
        <h2 id="practice-print-title" className="text-2xl font-bold text-gray-900">Cómo usar la hoja que descargas</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-gray-600 leading-relaxed">
          <li>Abre el SVG en tu navegador y elige Imprimir. Selecciona papel A4, orientación vertical y revisa la vista previa antes de imprimir.</li>
          <li>Prueba escala 100 %. Si la impresora recorta las guías, usa ajustar al área imprimible: cambiará el tamaño físico, pero conservará las proporciones.</li>
          <li>Sigue una fila de muestra y repite la misma forma en una hoja aparte. Compara altura, inclinación y separación; cambia una sola de esas propiedades en la siguiente fila.</li>
        </ol>
        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
          Los alfabetos de muestra usan la fuente cursiva disponible en tu dispositivo, por lo que su dibujo puede variar.
          Son referencias para practicar formas y espaciado; no son un alfabeto de pincel con instrucciones de presión o dirección del trazo.
        </p>
        <Link to="/blog/plan-practica-lettering-siete-dias" className="mt-4 inline-block font-semibold text-[#5A4AD2] hover:underline">
          Seguir el plan de siete sesiones con objetivos y revisión →
        </Link>
      </section>

      <div className="mt-16 bg-[#F8F9FC] border border-gray-200 rounded-2xl p-8 lg:p-12">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-16 h-16 bg-white shrink-0 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
            <FileText className="w-8 h-8 text-[#5A4AD2]" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pasa de lo digital a lo manual</h2>
            <p className="text-gray-600">
              Si prefieres trabajar online, puedes usar nuestro <strong className="text-gray-900">Generador de Lettering</strong> para crear una composición visual y exportarla como imagen en resolución normal o ampliada.
            </p>
          </div>
          <div>
            <Link to="/editor" className="inline-flex items-center gap-2 bg-white text-[#5A4AD2] border border-gray-200 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition shadow-sm whitespace-nowrap">
              Ir al Editor Digital
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
