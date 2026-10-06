import React from 'react';
import { SEO } from '../components/SEO';
import { Sparkles, ShieldCheck, Heart, Cpu, BookOpen, Mail, Wrench, SearchCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SobreNosotros() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Generador de Lettering",
    "url": "https://generadordelettering.org",
    "logo": "https://generadordelettering.org/pwa-512x512.png",
    "description": "Plataforma de herramientas gratuitas para lettering digital, conversión de texto Unicode y personalización de nombres para redes sociales y videojuegos.",
    "knowsAbout": ["Typography", "Calligraphy", "Digital Lettering", "Unicode", "Web Design"],
    "sameAs": []
  };

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Sobre Nosotros | Generador de Lettering",
    "description": "Conoce cómo mantenemos Generador de Lettering, cómo revisamos las herramientas y contenidos y qué principios seguimos sobre privacidad y calidad.",
    "url": "https://generadordelettering.org/sobre-nosotros"
  };

  return (
    <>
      <SEO 
        title="Sobre Nosotros | Generador de Lettering"
        description="Conoce cómo mantenemos Generador de Lettering, revisamos nuestras herramientas tipográficas y contenidos, y protegemos la privacidad del usuario."
        keywords="sobre generador de lettering, herramientas tipográficas, lettering digital, unicode"
        canonical="https://generadordelettering.org/sobre-nosotros"
        jsonSchema={[organizationSchema, aboutPageSchema]}
      />

      <div className="bg-[#F8F9FC] min-h-screen py-12 px-4 flex-1">
        <div className="max-w-4xl mx-auto space-y-12">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
            <ol className="flex items-center space-x-2 font-medium">
              <li><Link to="/" className="hover:text-[#5A4AD2] transition-colors">Inicio</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-900" aria-current="page">Sobre Nosotros</li>
            </ol>
          </nav>

          <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5A4AD2]/10 text-[#5A4AD2] text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Sobre el proyecto</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Herramientas para crear y personalizar <span className="text-[#5A4AD2]">letras</span> en la web
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              <strong>Generador de Lettering</strong> reúne herramientas de lettering digital, conversores Unicode,
              generadores de nombres y recursos de tipografía en español. El objetivo es ofrecer utilidades prácticas,
              fáciles de usar y accesibles directamente desde el navegador.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#5A4AD2]/10 text-[#5A4AD2] rounded-xl flex items-center justify-center mb-5">
                <Heart className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Acceso gratuito</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Las herramientas disponibles actualmente en el sitio pueden utilizarse sin crear una cuenta ni pagar una suscripción.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#34D399]/10 text-[#059669] rounded-xl flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Procesamiento local del texto</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Las conversiones de texto y buena parte de la edición se ejecutan en el navegador. Los servicios de terceros,
                como publicidad o analítica, pueden cargarse cuando corresponde y de acuerdo con las preferencias de consentimiento.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-xl flex items-center justify-center mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Calidad técnica</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Revisamos el comportamiento de los generadores, la salida Unicode, los enlaces internos y la compilación del sitio
                para reducir errores antes de publicar cambios.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Wrench className="w-6 h-6 text-[#5A4AD2]" />
                Cómo mantenemos las herramientas
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                El sitio combina herramientas de diseño visual con conversores de caracteres Unicode. Cuando modificamos un
                generador, comprobamos que los mapas de caracteres mantengan la longitud correcta, que los resultados se puedan
                copiar y que las páginas continúen compilando correctamente.
              </p>
              <p className="text-gray-600 leading-relaxed">
                También revisamos rutas, sitemap, enlaces canónicos y páginas relacionadas para evitar duplicados o enlaces rotos.
                Algunas plataformas externas pueden cambiar sus reglas de nombres, biografías o símbolos; cuando detectamos un cambio,
                procuramos reflejarlo en las herramientas y guías correspondientes.
              </p>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <SearchCheck className="w-6 h-6 text-[#5A4AD2]" />
                Cómo revisamos el contenido
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Las guías del sitio están pensadas para explicar el uso de las herramientas y conceptos relacionados con
                lettering, tipografía y Unicode. Evitamos atribuir experiencia profesional, certificaciones o pruebas que no
                podamos demostrar.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Comprobamos que los ejemplos correspondan con el funcionamiento real de la herramienta.</li>
                <li>Distinguimos entre caracteres Unicode y archivos de fuentes como TTF u OTF.</li>
                <li>Cuando una compatibilidad depende de una plataforma externa, evitamos presentarla como garantía absoluta.</li>
                <li>Corregimos páginas, enlaces y datos cuando encontramos errores o información desactualizada.</li>
              </ul>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#5A4AD2]" />
                Privacidad y servicios de terceros
              </h2>
              <p className="text-gray-600 leading-relaxed">
                El texto que introduces en los conversores se transforma en el navegador y no necesita enviarse a un servidor
                para generar las variantes Unicode. El sitio puede utilizar servicios de terceros para publicidad, medición u
                otros componentes web cuando estén habilitados. Puedes consultar los detalles y opciones disponibles en nuestra{' '}
                <Link to="/politica-de-privacidad" className="text-[#5A4AD2] font-semibold hover:underline">
                  Política de Privacidad
                </Link>.
              </p>
            </div>

            <hr className="border-gray-100" />

            <div className="bg-purple-50/60 p-6 rounded-2xl border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">¿Encontraste un error o quieres proponer una mejora?</h3>
                <p className="text-sm text-gray-600">
                  Puedes enviarnos el enlace de la página y una descripción del problema para revisarlo.
                </p>
              </div>
              <Link to="/contacto" className="inline-flex items-center gap-2 bg-[#5A4AD2] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#4F46E5] transition shadow-sm whitespace-nowrap">
                <Mail className="w-4 h-4" /> Contactar
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
