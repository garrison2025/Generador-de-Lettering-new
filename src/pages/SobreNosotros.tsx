import React from 'react';
import { SEO } from '../components/SEO';
import { Sparkles, ShieldCheck, Heart, Cpu, Users, Award, BookOpen, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SobreNosotros() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Generador de Lettering (LetrasPro)",
    "url": "https://generadordelettering.org",
    "logo": "https://generadordelettering.org/icon.svg",
    "description": "Plataforma educativa y de herramientas tipográficas gratuitas especializadas en conversor de letras bonitas, diseño de lettering y recursos caligráficos.",
    "foundingDate": "2023",
    "knowsAbout": ["Typography", "Calligraphy", "Digital Lettering", "Unicode Formatting", "Graphic Design"],
    "sameAs": []
  };

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Sobre Nosotros | Generador de Lettering",
    "description": "Conoce al equipo detrás de Generador de Lettering, nuestros valores, misión, estándares editoriales y compromiso con las herramientas gratuitas.",
    "url": "https://generadordelettering.org/sobre-nosotros"
  };

  return (
    <>
      <SEO 
        title="Sobre Nosotros | Generador de Lettering y Herramientas Tipográficas"
        description="Conoce la misión, el equipo y la filosofía detrás de Generador de Lettering. Herramientas tipográficas gratuitas, privacidad del usuario y pasión por la caligrafía digital."
        keywords="sobre nosotros generador de lettering, equipo letraspro, historia generador letras, tipografia digital"
        jsonSchema={[organizationSchema, aboutPageSchema]}
      />

      <div className="bg-[#F8F9FC] min-h-screen py-12 px-4 flex-1">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
            <ol className="flex items-center space-x-2 font-medium">
              <li><Link to="/" className="hover:text-[#5A4AD2] transition-colors">Inicio</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-900" aria-current="page">Sobre Nosotros</li>
            </ol>
          </nav>

          {/* Header Banner */}
          <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5A4AD2]/10 text-[#5A4AD2] text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Nuestra Historia y Filosofía</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Pasión por las <span className="text-[#5A4AD2]">Letras</span>, la <span className="text-[#FF6B6B]">Tipografía</span> y el Diseño Accesible
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              En <strong>Generador de Lettering</strong> (LetrasPro), democratizamos el diseño de tipografías, el lettering digital y la personalización de textos. Creemos que la creatividad visual y la expresión personal en internet deben ser accesibles para todos, de forma gratuita y respetando al 100% la privacidad del usuario.
            </p>
          </section>

          {/* Core Values Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#5A4AD2]/10 text-[#5A4AD2] rounded-xl flex items-center justify-center mb-5">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Gratuito y Libre</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Todas nuestras herramientas, conversores Unicode, creadores de nicks y plantillas descargables son y serán siempre totalmente gratis. Sin suscripciones ni cobros ocultos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#34D399]/10 text-[#059669] rounded-xl flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Privacidad Garantizada</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Procesamos tus textos directamente en tu propio navegador (Client-Side rendering). Nunca guardamos, rastreamos ni enviamos tus frases o diseños a servidores externos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-xl flex items-center justify-center mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Rendimiento Ultra Rápido</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Optimizamos el código al milisegundo para que las conversiones tipográficas, la descarga de gráficos SVG y la navegación funcionen de manera instantánea.
              </p>
            </div>
          </section>

          {/* Mission & Vision Detailed Text */}
          <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Award className="w-6 h-6 text-[#5A4AD2]" />
                Nuestra Misión: Facilitar el Arte Tipográfico Digital
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                El lettering tradicional requiere años de práctica con rotuladores de punta pincel, papel de gramaje especial y un control milimétrico de la presión. Con el auge de las plataformas digitales (Instagram, TikTok, Free Fire, WhatsApp y Discord), surgió una nueva necesidad: expresarse visualmente a través del texto digital.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Desarrollamos esta suite integral de herramientas para tender un puente entre la caligrafía clásica y la web moderna, permitiendo a cualquier persona transformar un texto aburrido en una obra artística en segundos, o descargar guías impresas para aprender trazado a mano.
              </p>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Users className="w-6 h-6 text-[#5A4AD2]" />
                Nuestro Equipo Editorial y Creadores
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Detrás de Generador de Lettering existe un equipo multidisciplinario con pasión por las letras, el código abierto y la enseñanza visual:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex gap-4 items-start">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#5A4AD2] to-[#FF6B6B] flex items-center justify-center text-white font-black text-lg shrink-0">
                    SV
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Sofía Valenzuela</h3>
                    <span className="text-xs font-bold text-[#5A4AD2] block mb-2">Directora Editorial & Diseñadora Tipográfica</span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Especialista en caligrafía tradicional y branding con más de 7 años de experiencia. Encargada de supervisar el contenido educativo y las plantillas descargables.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex gap-4 items-start">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shrink-0">
                    MR
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Mateo Rivas</h3>
                    <span className="text-xs font-bold text-indigo-600 block mb-2">Desarrollador Web & Especialista Unicode</span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Ingeniero de software centrado en renderizado de canvas, optimización de velocidad de carga y cumplimiento del estándar Unicode internacional.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#5A4AD2]" />
                Compromiso Editorial y Calidad Técnica
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                En nuestro blog y guías educativas, un equipo apasionado de diseñadores gráficos y entusiastas de la tipografía redacta tutoriales originales. Investigamos activamente los estándares oficiales del consorcio **Unicode**, la accesibilidad web (WCAG) y las políticas de desarrollo para ofrecer información fidedigna y veraz.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 font-medium">
                <li>Verificamos la compatibilidad de fuentes en dispositivos iOS, Android, Windows y macOS.</li>
                <li>Explicamos cómo evitar errores comunes de accesibilidad con lectores de pantalla (Screen Readers).</li>
                <li>Actualizamos constantemente los símbolos y variantes para los videojuegos más populares como Free Fire y Roblox.</li>
              </ul>
            </div>

            <hr className="border-gray-100" />

            <div className="bg-purple-50/60 p-6 rounded-2xl border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">¿Tienes preguntas o quieres colaborar con nosotros?</h3>
                <p className="text-sm text-gray-600">Estamos abiertos a sugerencias, reporte de errores y alianzas creativas.</p>
              </div>
              <Link to="/contacto" className="inline-flex items-center gap-2 bg-[#5A4AD2] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#4F46E5] transition shadow-sm whitespace-nowrap">
                <Mail className="w-4 h-4" /> Contactar al Equipo
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}

