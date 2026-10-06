import { copyText } from '../utils/copyText';
import { Link } from 'react-router-dom';
import { PenTool, Palette, Copy, Check, ChevronLeft, Droplet } from 'lucide-react';
import { useState } from 'react';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';

const PALETTES = [
  { name: 'Ocaso Cálido', colors: ['#FF6B6B', '#FF8E53', '#FFAF3B', '#FFD166', '#FFF0A8'] },
  { name: 'Océano Profundo', colors: ['#5A4AD2', '#457B9D', '#1D3557', '#A8DADC', '#F1FAEE'] },
  { name: 'Bosque Místico', colors: ['#2A9D8F', '#264653', '#E9C46A', '#F4A261', '#E76F51'] },
  { name: 'Galaxia Púrpura', colors: ['#3A0CA3', '#4361EE', '#7209B7', '#F72585', '#4CC9F0'] },
  { name: 'Neutrales Elegantes', colors: ['#2B2D42', '#8D99AE', '#EDF2F4', '#EF233C', '#D90429'] },
  { name: 'Primavera Pastel', colors: ['#FFB5A7', '#FCD5CE', '#F8EDEB', '#F9E2E2', '#E8E8E4'] },
  { name: 'Neón Cyberpunk', colors: ['#FF003C', '#F9F871', '#00F0FF', '#7000FF', '#1D0054'] },
  { name: 'Tierra Terracota', colors: ['#D4A373', '#FAEDCD', '#FEFAE0', '#E9EDC9', '#CCD5AE'] },
  { name: 'Vintage 70s', colors: ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'] },
  { name: 'Aurora Boreal', colors: ['#00F2FE', '#4FACFE', '#0072FF', '#00C6FF', '#005BEA'] },
  { name: 'Atardecer', colors: ['#F6D365', '#FDA085', '#FF8C7F', '#FF6B9E', '#FF3E96'] }
];

export default function PaletasColor() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copiedPalette, setCopiedPalette] = useState<string | null>(null);

  const copyToClipboard = async (text: string, type: 'color' | 'palette') => {
    const copied = await copyText(text);
    if (!copied) {
      window.alert('No se pudo copiar al portapapeles. Selecciona el texto manualmente o inténtalo de nuevo.');
      return;
    }

    if (type === 'color') {
      setCopiedColor(text);
      setTimeout(() => setCopiedColor(null), 2000);
    } else {
      setCopiedPalette(text);
      setTimeout(() => setCopiedPalette(null), 2000);
    }
  };

  const copyGradient = (colors: string[]) => {
    const gradient = `linear-gradient(135deg, ${colors.join(', ')})`;
    copyToClipboard(gradient, 'palette');
  };

  return (
    <>
      <SEO 
        title="Paletas de Color para Lettering | Generador de Letras"
        description="Explora paletas de colores aesthetic para tus proyectos de lettering y diseño. Copia códigos HEX y gradientes CSS al instante."
        keywords="paletas de color, colores para lettering, colores aesthetic, paletas vintage, gradientes"
      />
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <Link to="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#5A4AD2] mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Volver a inicio
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Paletas de Color para Lettering</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Descubre combinaciones de colores perfectas. Haz clic en cualquier color para copiar su código HEX o copia el gradiente CSS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PALETTES.map((palette) => {
          const gradientStyle = { background: `linear-gradient(90deg, ${palette.colors.join(', ')})` };
          
          return (
            <div key={palette.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="flex h-24">
                {palette.colors.map((color) => (
                  <div 
                    key={color} 
                    className="flex-1 cursor-pointer group relative"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color, 'color')}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 backdrop-blur-[2px]">
                      {copiedColor === color ? (
                        <Check className="w-5 h-5 text-white mb-1" />
                      ) : (
                        <Copy className="w-5 h-5 text-white mb-1" />
                      )}
                      <span className="text-[10px] text-white font-mono font-bold tracking-wider">{color}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                aria-label={`Copiar gradiente CSS de ${palette.name}`}
                className="h-6 w-full opacity-90 cursor-pointer group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5A4AD2] focus-visible:ring-offset-2"
                style={gradientStyle}
                onClick={() => copyGradient(palette.colors)}
              >
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition bg-black/40 backdrop-blur-[1px]">
                  <span className="text-xs text-white font-bold tracking-wide">Copiar Gradiente CSS</span>
                </span>
              </button>
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{palette.name}</h3>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button 
                      type="button"
                      aria-label={`Copiar colores de la paleta ${palette.name}`}
                      onClick={() => copyToClipboard(JSON.stringify(palette.colors), 'palette')}
                      className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 p-2 rounded-lg transition"
                      title="Copiar arreglo de colores"
                    >
                      {copiedPalette === JSON.stringify(palette.colors) ? <Check className="w-4 h-4 text-green-600" /> : <Droplet className="w-4 h-4" />}
                    </button>
                    <Link
                      to="/editor"
                      aria-label={`Abrir el editor con la paleta ${palette.name}`}
                      className="text-[#5A4AD2] hover:bg-[#5A4AD2]/10 p-2 rounded-lg transition"
                      title="Llevar al Editor"
                    >
                      <Palette className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {palette.colors.map((color) => (
                    <span key={color+'-hex'} className="text-[10px] bg-gray-50 text-gray-500 font-mono px-1.5 py-0.5 rounded border border-gray-100 uppercase">
                      {color.replace('#', '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-16 bg-gradient-to-br from-[#5A4AD2]/10 to-indigo-50 rounded-3xl p-8 md:p-12 text-center border border-[#5A4AD2]/20 shadow-inner">
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">¿Listo para usar estos colores?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Lleva estas paletas a nuestro editor y crea piezas de lettering o fondos con gradientes espectaculares al instante.
        </p>
        <Link to="/editor" className="inline-flex items-center justify-center gap-2 bg-[#5A4AD2] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#4F46E5] transition shadow-md hover:shadow-lg w-full sm:w-auto">
          <PenTool className="w-5 h-5" />
          Abrir en el Editor de Letras
        </Link>
      </div>

      <RelatedTools currentPath="/herramientas/paletas-de-color" />
    </div>
    </>
  );
}
