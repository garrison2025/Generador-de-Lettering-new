import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flame, Instagram, Type, Palette, PenTool, Hash, Shield } from 'lucide-react';

interface RelatedToolsProps {
  currentPath?: string;
}

export function RelatedTools({ currentPath }: RelatedToolsProps) {
  const tools = [
    {
      title: 'Creador de Lettering',
      desc: 'Diseña arte tipográfico personalizado, caligrafía, luces neón y letras 3D.',
      path: '/herramientas/creador-de-lettering',
      icon: <PenTool className="w-5 h-5 text-[#5A4AD2]" />,
      badge: 'Estudio de Diseño'
    },
    {
      title: 'Generador de Nombres para Free Fire',
      desc: 'Crea nicks insanos con letras bonitas, alas, coronas y espacio invisible.',
      path: '/herramientas/generador-de-nombres-para-free-fire',
      icon: <Flame className="w-5 h-5 text-amber-500" />,
      badge: 'Nombres FF'
    },
    {
      title: 'Generador de Nombres para Instagram',
      desc: 'Nombres de usuario aesthetic, convertidor de fuentes y creador de biografías.',
      path: '/herramientas/generador-de-nombres-para-instagram',
      icon: <Instagram className="w-5 h-5 text-pink-500" />,
      badge: 'Instagram'
    },
    {
      title: 'Conversor de Letras Online',
      desc: 'Convierte texto en más de 70 estilos Unicode para copiar y pegar.',
      path: '/herramientas/conversor-texto',
      icon: <Type className="w-5 h-5 text-[#4F46E5]" />,
      badge: 'Copy & Paste'
    },
    {
      title: 'Letras Bonitas Aesthetic',
      desc: 'Filtra estilos aesthetic, compara texto Unicode y guarda tus 12 favoritos.',
      path: '/herramientas/conversor-letras-bonitas',
      icon: <Sparkles className="w-5 h-5 text-indigo-500" />,
      badge: 'Aesthetic'
    },
    {
      title: 'Letras Azules para Copiar',
      desc: 'Regional Indicator Symbols y variantes Unicode para copiar y pegar en redes y juegos.',
      path: '/herramientas/letras-azules',
      icon: <Sparkles className="w-5 h-5 text-blue-500" />,
      badge: 'WhatsApp & Juegos'
    },
    {
      title: 'Letras y Símbolos para Free Fire',
      desc: 'Convierte tu texto a letras Unicode y añade símbolos, alas o coronas para copiar y pegar.',
      path: '/herramientas/letras-free-fire',
      icon: <Shield className="w-5 h-5 text-amber-600" />,
      badge: 'Símbolos FF'
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
      desc: 'Compara titulares y subtítulos en 6 pares de fuentes, ajusta tamaños y copia el CSS.',
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

  const quickLinks = [
    { label: 'Generador de Letras Góticas', path: '/generador-de-letras-goticas' },
    { label: 'Generador de Letras Cursivas', path: '/generador-de-letras-cursivas' },
    { label: 'Letras para Instagram Aesthetic', path: '/letras-para-instagram' },
    { label: 'Letras para Tatuajes Online', path: '/letras-para-tatuajes' },
    { label: 'Guía Nombres Insanos Free Fire', path: '/blog/mejores-nombres-insanos-free-fire' },
    { label: 'Bio TikTok Aesthetic Dark', path: '/blog/biografia-tiktok-aesthetic-dark' },
    { label: 'Espacio Invisible Unicode', path: '/blog/letras-invisibles-espacios-guia-redes-sociales' },
  ];

  const clusterPriority = (() => {
    if (currentPath?.includes('free-fire')) {
      return [
        '/herramientas/letras-free-fire',
        '/herramientas/generador-de-nombres-para-free-fire',
        '/herramientas/letras-azules',
        '/herramientas/conversor-texto',
        '/herramientas/letras-tiktok',
        '/herramientas/generador-de-nombres-para-instagram'
      ];
    }

    if (currentPath?.includes('tiktok')) {
      return [
        '/herramientas/letras-tiktok',
        '/herramientas/generador-de-nombres-para-instagram',
        '/herramientas/conversor-texto',
        '/herramientas/conversor-letras-bonitas',
        '/herramientas/letras-azules',
        '/herramientas/creador-de-lettering'
      ];
    }

    if (currentPath?.includes('instagram')) {
      return [
        '/herramientas/generador-de-nombres-para-instagram',
        '/herramientas/letras-tiktok',
        '/herramientas/conversor-texto',
        '/herramientas/conversor-letras-bonitas',
        '/herramientas/letras-azules',
        '/herramientas/creador-de-lettering'
      ];
    }

    if (currentPath?.includes('conversor') || currentPath?.includes('letras-azules')) {
      return [
        '/herramientas/conversor-texto',
        '/herramientas/conversor-letras-bonitas',
        '/herramientas/letras-azules',
        '/herramientas/letras-tiktok',
        '/herramientas/generador-de-nombres-para-instagram',
        '/herramientas/letras-free-fire'
      ];
    }

    if (currentPath?.includes('invisibles') || currentPath?.includes('espacio-invisible')) {
      return [
        '/herramientas/conversor-texto',
        '/herramientas/generador-de-nombres-para-free-fire',
        '/herramientas/letras-free-fire',
        '/herramientas/letras-azules',
        '/herramientas/conversor-letras-bonitas',
        '/herramientas/letras-tiktok'
      ];
    }

    if (currentPath?.includes('lettering') || currentPath?.includes('caligrafia') || currentPath?.includes('tipografia')) {
      return [
        '/herramientas/creador-de-lettering',
        '/herramientas/combinador-de-fuentes',
        '/herramientas/paletas-de-color',
        '/herramientas/plantillas-practica',
        '/herramientas/conversor-texto',
        '/herramientas/conversor-letras-bonitas'
      ];
    }

    return [
      '/herramientas/creador-de-lettering',
      '/herramientas/conversor-texto',
      '/herramientas/generador-de-nombres-para-instagram',
      '/herramientas/letras-free-fire',
      '/herramientas/letras-tiktok',
      '/herramientas/letras-azules'
    ];
  })();

  const priorityIndex = new Map(clusterPriority.map((path, index) => [path, index]));
  const filteredTools = tools
    .filter(tool => tool.path !== currentPath)
    .sort((a, b) => (priorityIndex.get(a.path) ?? 99) - (priorityIndex.get(b.path) ?? 99))
    .slice(0, 6);

  return (
    <section className="my-12 bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-[#4F46E5]" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Otras Herramientas de Tipografía y Nombres
        </h2>
      </div>
      <p className="text-gray-600 text-sm mb-6">
        Accede a las herramientas más relacionadas con esta búsqueda y continúa creando sin salir del mismo tema:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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

      {/* Internal Links Cluster for SEO Indexation */}
      <div className="pt-6 border-t border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enlaces Populares de Búsqueda:</span>
          <Link to="/herramientas" className="text-xs font-bold text-[#4F46E5] hover:underline">
            Ver todas las herramientas →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((link, lIdx) => (
            <Link
              key={lIdx}
              to={link.path}
              className="text-xs bg-gray-100 hover:bg-[#5A4AD2] text-gray-700 hover:text-white px-3 py-1.5 rounded-xl transition font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
