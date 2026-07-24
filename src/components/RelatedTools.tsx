import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flame, Instagram, Type, Palette, PenTool, Hash, Shield } from 'lucide-react';

interface RelatedToolsProps {
  currentPath?: string;
}

export function RelatedTools({ currentPath }: RelatedToolsProps) {
  const tools = [
    {
      title: 'Generador de Nombres para Free Fire',
      desc: 'Crea nicks insanos con letras bonitas, alas, coronas y espacio invisible.',
      path: '/herramientas/generador-de-nombres-para-free-fire',
      icon: <Flame className="w-5 h-5 text-amber-500" />,
      badge: 'Popular Gaming'
    },
    {
      title: 'Generador de Nombres para Instagram',
      desc: 'Nombres de usuario aesthetic, convertidor de fuentes y creador de biografías.',
      path: '/herramientas/generador-de-nombres-para-instagram',
      icon: <Instagram className="w-5 h-5 text-pink-500" />,
      badge: 'Instagram'
    },
    {
      title: 'Conversor de Letras Bonitas',
      desc: 'Transforma tu texto con fuentes cursivas, góticas y símbolos para copiar y pegar.',
      path: '/herramientas/conversor-letras-bonitas',
      icon: <Type className="w-5 h-5 text-indigo-500" />,
      badge: 'Aesthetic'
    },
    {
      title: 'Letras Azules para Copiar',
      desc: 'Generador de letras con formato azul especial para WhatsApp y juegos.',
      path: '/herramientas/letras-azules',
      icon: <Sparkles className="w-5 h-5 text-blue-500" />,
      badge: 'WhatsApp & Juegos'
    },
    {
      title: 'Letras para Free Fire (Nick Insano)',
      desc: 'Letras y fuentes compatibles para Free Fire y clanes competitivos.',
      path: '/herramientas/letras-free-fire',
      icon: <Shield className="w-5 h-5 text-amber-600" />,
      badge: 'FF Nicks'
    },
    {
      title: 'Letras para TikTok Aesthetic',
      desc: 'Tipografías únicas y símbolos para destacar en la bio y subtítulos de TikTok.',
      path: '/herramientas/letras-tiktok',
      icon: <Hash className="w-5 h-5 text-[#00f2fe]" />,
      badge: 'TikTok'
    },
    {
      title: 'Combinador de Fuentes',
      desc: 'Prueba y combina fuentes tipográficas para tus proyectos creativos.',
      path: '/herramientas/combinador-de-fuentes',
      icon: <PenTool className="w-5 h-5 text-purple-500" />,
      badge: 'Diseño'
    },
    {
      title: 'Paletas de Color Aesthetic',
      desc: 'Explora y copia paletas de color con códigos HEX para tus diseños.',
      path: '/herramientas/paletas-de-color',
      icon: <Palette className="w-5 h-5 text-emerald-500" />,
      badge: 'Colores'
    }
  ];

  const filteredTools = tools.filter(tool => tool.path !== currentPath);

  return (
    <section className="my-12 bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-[#4F46E5]" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Otras Herramientas de Tipografía y Nombres
        </h2>
      </div>
      <p className="text-gray-600 text-sm mb-6">
        Descubre nuestros generadores de texto, conversores de fuentes y creadores de apodos más populares:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool, idx) => (
          <Link
            key={idx}
            to={tool.path}
            className="group p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#4F46E5]/40 hover:shadow-md transition flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="p-2 rounded-xl bg-white border border-gray-200/80 shadow-2xs group-hover:scale-105 transition">
                  {tool.icon}
                </div>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-200/70 px-2 py-0.5 rounded-full">
                  {tool.badge}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#4F46E5] transition">
                {tool.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {tool.desc}
              </p>
            </div>
            <span className="text-xs font-bold text-[#4F46E5] group-hover:underline flex items-center gap-1 mt-1">
              Usar herramienta &rarr;
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
