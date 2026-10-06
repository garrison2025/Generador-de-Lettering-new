import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, ArrowRight, Check, ChevronLeft } from 'lucide-react';
import { SEO } from '../components/SEO';

const SHEETS = [
  {
    title: 'Trazos Básicos',
    description: 'Aprende a controlar la presión: trazos finos hacia arriba y gruesos hacia abajo. Ideal para principiantes con rotulador de punta pincel.',
    level: 'Principiante',
    format: 'A4 SVG',
    img: 'https://images.unsplash.com/photo-1586077595304-eb5dc146bd2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75&fm=webp',
    color: 'bg-green-100 text-green-700'
  },
  {
    title: 'Alfabeto Minúsculas',
    description: 'Práctica de las letras minúsculas en cursiva (brush lettering). Contiene guías paso a paso para formar cada letra.',
    level: 'Principiante',
    format: 'A4 SVG',
    img: 'https://images.unsplash.com/photo-1549488344-c68936dd0ea0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75&fm=webp',
    color: 'bg-green-100 text-green-700'
  },
  {
    title: 'Alfabeto Mayúsculas',
    description: 'Hojas avanzadas con florituras y variaciones para el alfabeto en mayúsculas. Perfecto para titulares y nombres.',
    level: 'Intermedio',
    format: 'A4 SVG',
    img: 'https://images.unsplash.com/photo-1550592704-6c76defa99ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75&fm=webp',
    color: 'bg-orange-100 text-orange-700'
  },
  {
    title: 'Florituras y Conexiones',
    description: 'Aprende a conectar letras de forma elegante y a añadir florituras, remates y adornos para un lettering profesional.',
    level: 'Avanzado',
    format: 'A4 SVG',
    img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75&fm=webp',
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

export default function PlantillasPractica() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (title: string) => {
    setDownloading(title);
    
    const svgData = generateSVG(title);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantilla-${title.toLowerCase().replace(/\\s+/g, '-')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
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
      />
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <Link to="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#5A4AD2] mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Volver a inicio
      </Link>

      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-[#5A4AD2]/10 text-[#5A4AD2] text-sm font-bold rounded-full mb-4">Recursos Gratuitos</span>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Plantillas de Práctica</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Descarga hojas de práctica A4 en SVG listas para imprimir o abrir en un navegador. Practica trazos, alfabetos y conexiones con guías diferenciadas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SHEETS.map((sheet) => (
          <div key={sheet.title} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group">
            <div className="h-48 relative overflow-hidden bg-gray-100">
              <img 
                src={sheet.img} 
                alt={sheet.title} 
                width="400" 
                height="192" 
                loading="lazy" 
                decoding="async" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
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
      
      <div className="mt-16 bg-[#F8F9FC] border border-gray-200 rounded-2xl p-8 lg:p-12">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-16 h-16 bg-white shrink-0 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
            <FileText className="w-8 h-8 text-[#5A4AD2]" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pasa de lo digital a lo manual</h2>
            <p className="text-gray-600">
              Si prefieres trabajar online y no gastar papel, recuerda que tienes a tu disposición nuestro <strong className="text-gray-900">Generador de Lettering online</strong>, donde puedes exportar tus creaciones directamente como imágenes de alta resolución.
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
