import { Link } from 'react-router-dom';
import {
  Flame,
  Hash,
  Sparkles,
  Instagram,
  Type,
  PenTool,
  Palette,
  LayoutTemplate,
  Shapes,
  ArrowRight,
  Gamepad2
} from 'lucide-react';
import { SEO } from '../components/SEO';

const popularTools = [
  {
    title: 'Letras para Free Fire',
    description: 'Crea nicks con símbolos, letras góticas, alas y coronas listas para copiar.',
    path: '/herramientas/letras-free-fire',
    icon: Flame
  },
  {
    title: 'Letras para TikTok',
    description: 'Fuentes aesthetic, cursivas y símbolos para bio, nombre visible y comentarios.',
    path: '/herramientas/letras-tiktok',
    icon: Hash
  },
  {
    title: 'Letras Azules',
    description: 'Genera letras y símbolos especiales para copiar y pegar en redes y juegos.',
    path: '/herramientas/letras-azules',
    icon: Sparkles
  },
  {
    title: 'Nombres para Instagram',
    description: 'Ideas de nombres, letras bonitas, símbolos y creador de bio aesthetic.',
    path: '/herramientas/generador-de-nombres-para-instagram',
    icon: Instagram
  },
  {
    title: 'Conversor de Letras',
    description: 'Más de 70 estilos Unicode: cursivas, góticas, negritas y letras raras.',
    path: '/herramientas/conversor-texto',
    icon: Type
  },
  {
    title: 'Nombres para Free Fire',
    description: 'Generador avanzado con clanes, dúos, favoritos y espacio invisible.',
    path: '/herramientas/generador-de-nombres-para-free-fire',
    icon: Gamepad2
  }
];

const creativeTools = [
  {
    title: 'Creador de Lettering',
    description: 'Diseña lettering digital con tipografías, colores, sombras y exportación HD.',
    path: '/herramientas/creador-de-lettering',
    icon: PenTool
  },
  {
    title: 'Editor de Lettering',
    description: 'Editor avanzado para crear composiciones tipográficas y descargar imágenes.',
    path: '/editor',
    icon: Shapes
  },
  {
    title: 'Letras Bonitas Aesthetic',
    description: 'Convierte texto en estilos decorativos para copiar y pegar.',
    path: '/herramientas/conversor-letras-bonitas',
    icon: Sparkles
  },
  {
    title: 'Combinador de Fuentes',
    description: 'Prueba combinaciones tipográficas para tus proyectos creativos.',
    path: '/herramientas/combinador-de-fuentes',
    icon: Type
  },
  {
    title: 'Paletas de Color',
    description: 'Explora combinaciones de color y copia sus códigos HEX.',
    path: '/herramientas/paletas-de-color',
    icon: Palette
  },
  {
    title: 'Plantillas de Práctica',
    description: 'Recursos para practicar lettering y caligrafía.',
    path: '/herramientas/plantillas-practica',
    icon: LayoutTemplate
  }
];

const styleLinks = [
  { label: 'Generador de Letras Góticas', path: '/generador-de-letras-goticas' },
  { label: 'Generador de Letras Cursivas', path: '/generador-de-letras-cursivas' },
  { label: 'Letras para Instagram', path: '/letras-para-instagram' },
  { label: 'Letras para Tatuajes', path: '/letras-para-tatuajes' }
];

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Herramientas de letras, nombres y lettering',
  itemListElement: [...popularTools, ...creativeTools].map((tool, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: tool.title,
    url: `https://generadordelettering.org${tool.path}`
  }))
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: 'https://generadordelettering.org/'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Herramientas',
      item: 'https://generadordelettering.org/herramientas'
    }
  ]
};

export default function Herramientas() {
  return (
    <>
      <SEO
        title="Herramientas de Letras y Lettering Online | Generadores Gratis"
        description="Herramientas gratuitas para crear letras, nombres, lettering, fuentes Unicode y textos para Instagram, TikTok y Free Fire."
        keywords="herramientas de letras, generador de letras, lettering online, fuentes unicode, nombres para redes sociales"
        canonical="https://generadordelettering.org/herramientas"
        jsonSchema={[itemListSchema, breadcrumbSchema]}
      />

      <main className="flex-1 bg-[#F8F9FC]">
        <section className="bg-white border-b border-gray-100 px-4 py-14">
          <div className="max-w-6xl mx-auto">
            <nav className="text-sm text-gray-500 mb-6">
              <Link to="/" className="hover:text-[#4F46E5]">Inicio</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Herramientas</span>
            </nav>

            <div className="max-w-3xl">
              <span className="inline-flex px-3 py-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-bold mb-4">
                Herramientas gratuitas
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
                Herramientas de Letras, Nombres y Lettering
              </h1>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Generadores y conversores gratuitos para crear letras bonitas, nicks de videojuegos,
                nombres para redes sociales y diseños de lettering directamente en el navegador.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="max-w-6xl mx-auto">
            <div className="mb-7">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Herramientas destacadas</h2>
              <p className="text-gray-500 mt-2">Accesos directos a los principales conversores, generadores de nombres y utilidades de letras del sitio.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popularTools.map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#4F46E5]/30 transition"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center mb-4">
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#4F46E5] transition">{tool.title}</h3>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{tool.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#4F46E5]">
                    Abrir herramienta <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-14">
          <div className="max-w-6xl mx-auto">
            <div className="mb-7">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Diseño y tipografía</h2>
              <p className="text-gray-500 mt-2">Herramientas para crear, combinar y practicar lettering y tipografía.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {creativeTools.map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#4F46E5]/30 transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-[#4F46E5] transition">{tool.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{tool.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Explorar por estilo</h2>
              <div className="flex flex-wrap gap-2">
                {styleLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-[#4F46E5] hover:text-white transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">¿Qué herramienta necesitas según el resultado?</h2>
              <p className="mt-3 text-gray-600 leading-relaxed">
                No todas las páginas generan el mismo tipo de contenido. La diferencia principal es si necesitas
                <strong> texto Unicode copiable</strong>, <strong>un nombre listo para probar</strong> o <strong>una imagen diseñada</strong>.
                Elige en función de lo que vas a pegar o publicar, no solo del estilo visual de las letras.
              </p>
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 p-5">
                  <h3 className="text-lg font-bold text-gray-900">Quiero letras para copiar</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Escribe tu frase en el <Link to="/herramientas/conversor-texto" className="font-semibold text-indigo-700 hover:underline">Conversor de Letras</Link>.
                    Compara variantes Unicode y copia una. Para un perfil con estilo decorativo,
                    prueba el <Link to="/herramientas/conversor-letras-bonitas" className="font-semibold text-indigo-700 hover:underline">conversor aesthetic</Link>.
                  </p>
                  <p className="mt-3 text-xs text-gray-600"><strong>Límite:</strong> algunas aplicaciones rechazan o muestran de otro modo los símbolos Unicode.</p>
                </div>
                <div className="rounded-2xl bg-amber-50/60 border border-amber-100 p-5">
                  <h3 className="text-lg font-bold text-gray-900">Quiero probar un nombre</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Usa el <Link to="/herramientas/generador-de-nombres-para-free-fire" className="font-semibold text-indigo-700 hover:underline">generador de nicks de Free Fire</Link> si necesitas prefijos o símbolos de clan;
                    para un perfil social, el <Link to="/herramientas/generador-de-nombres-para-instagram" className="font-semibold text-indigo-700 hover:underline">generador de Instagram</Link> incluye ideas y variantes visuales.
                  </p>
                  <p className="mt-3 text-xs text-gray-600"><strong>Límite:</strong> el nombre debe comprobarse en la aplicación antes de guardarlo.</p>
                </div>
                <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-5">
                  <h3 className="text-lg font-bold text-gray-900">Quiero un cartel o imagen</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Empieza con el <Link to="/herramientas/creador-de-lettering" className="font-semibold text-indigo-700 hover:underline">Creador de Lettering</Link> para probar un estilo,
                    luego abre el <Link to="/editor" className="font-semibold text-indigo-700 hover:underline">Editor Avanzado</Link> si necesitas controlar el lienzo, el borde o la sombra.
                  </p>
                  <p className="mt-3 text-xs text-gray-600"><strong>Salida:</strong> una imagen PNG, JPG o WEBP, no texto copiable en una biografía.</p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-gray-50 p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900">Dos comprobaciones útiles antes de publicar</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Si un nick no se puede pegar, consulta nuestra <Link to="/blog/como-comprobar-letras-unicode-copiar-pegar" className="font-semibold text-indigo-700 hover:underline">guía con laboratorio Unicode</Link>.
                  Si una imagen se ve recargada, sigue el <Link to="/blog/lettering-digital-tres-estilos-paso-a-paso" className="font-semibold text-indigo-700 hover:underline">ejercicio de tres estilos</Link> y compara contraste, espaciado y efectos antes de exportar.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
