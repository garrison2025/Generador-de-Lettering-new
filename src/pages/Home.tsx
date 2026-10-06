import { Link } from 'react-router-dom';
import { PenTool, Download, Type, LayoutTemplate, Palette, Globe, CheckCircle2, ChevronDown, Flame, Instagram, Sparkles, Hash } from 'lucide-react';
import React, { useState } from 'react';
import { SEO } from '../components/SEO';

const FAQ_DATA = [
  {
    q: "¿Qué es el lettering y en qué se diferencia de la caligrafía?",
    a: "El lettering es el arte de dibujar letras, mientras que la caligrafía es el arte de escribir letras. Con nuestro generador, creas lettering digital combinando tipografías con estilos y efectos únicos."
  },
  {
    q: "¿Necesito crear una cuenta para usar el generador?",
    a: "No, puedes usar el Generador de Lettering inmediatamente sin necesidad de registrarte ni proporcionar datos."
  },
  {
    q: "¿Puedo usar los diseños creados para fines comerciales?",
    a: "Puedes usar los archivos que generes para proyectos personales o comerciales, pero debes respetar las licencias, marcas y derechos de cualquier contenido externo que incorpores a tu diseño."
  },
  {
    q: "¿Cómo puedo guardar mis diseños para editarlos más tarde?",
    a: "El editor guarda localmente en tu navegador parte de la configuración para facilitar que continúes en el mismo dispositivo. Las imágenes de fondo que subes no se guardan en ese almacenamiento; exporta el resultado si necesitas conservar una copia final."
  },
  {
    q: "¿Qué navegadores son compatibles con el generador?",
    a: "Está diseñado para navegadores modernos como Chrome, Firefox, Safari y Edge. Algunas funciones de exportación o tipografías pueden variar según la versión del navegador y el dispositivo."
  },
  {
    q: "¿Puedo usar el generador en dispositivos móviles?",
    a: "Sí, la interfaz es responsive y puede usarse desde smartphones y tablets. El rendimiento depende del dispositivo, del navegador y de la complejidad del diseño."
  },
  {
    q: "¿Cómo puedo reportar un error o sugerir una nueva función?",
    a: "Puedes usar nuestro formulario en la página de Contacto para enviarnos sugerencias o reportar incidencias."
  }
];

function FaqItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden mb-3">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition"
      >
        <span className="text-[15px]">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-gray-600 text-[15px] leading-relaxed border-t border-gray-100 bg-white">
          {a}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Generador de Lettering",
    "url": "https://generadordelettering.org/",
    "description": "Herramientas gratuitas para crear lettering digital, plantillas de práctica y generadores de letras raras y bonitas para redes sociales y videojuegos.",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Generador de Lettering",
    "url": "https://generadordelettering.org/"
  };

  return (
    <>
    <SEO 
      title="Generador de Lettering Online | Letras Personalizadas"
      description="Diseña textos artísticos, caligrafía digital y letras decoradas para tus proyectos. Creador de lettering online fácil y gratis."
      keywords="generador de lettering, letras bonitas, caligrafía online, creador de tipografias"
      jsonSchema={[faqSchema, softwareSchema, websiteSchema]}
    />
    <div className="flex flex-col flex-1 w-full bg-[#F8F9FC]">
      
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight text-gray-800 !leading-[1.1]">
            Generador de <span className="text-[#5A4AD2]">Lettering</span> y <span className="text-[#FF6B6B]">Letras Personalizadas</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Diseña textos artísticos, caligrafía digital y letras decoradas para tus proyectos con nuestro generador de lettering online. Fácil de usar, gratis y sin registro.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/editor" className="min-w-[200px] bg-[#5A4AD2] text-white font-medium px-8 py-3.5 rounded-lg shadow-md hover:bg-[#4F46E5] transition-all flex items-center justify-center gap-2">
              <PenTool className="w-5 h-5" />
              Crear Lettering
            </Link>
            <Link to="/plantillas" className="min-w-[200px] bg-white text-gray-700 border border-gray-300 font-medium px-8 py-3.5 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <LayoutTemplate className="w-5 h-5" />
              Ver Plantillas
            </Link>
          </div>
        </div>
      </section>

      {/* Proven search-demand tools */}
      <section className="py-12 px-4 bg-[#F8F9FC] border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Herramientas populares de letras y nombres</h2>
              <p className="text-gray-500 mt-2">Accede directamente a nuestros generadores más utilizados para redes sociales y gaming.</p>
            </div>
            <Link to="/herramientas/conversor-texto" className="text-sm font-semibold text-[#4F46E5] hover:underline">
              Ver conversor de letras →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                to: '/herramientas/letras-free-fire',
                title: 'Letras para Free Fire',
                desc: 'Nicks con símbolos, letras góticas, alas y coronas.',
                icon: Flame
              },
              {
                to: '/herramientas/letras-tiktok',
                title: 'Letras para TikTok',
                desc: 'Fuentes aesthetic y símbolos para bio, nombre y comentarios.',
                icon: Hash
              },
              {
                to: '/herramientas/letras-azules',
                title: 'Letras Azules',
                desc: 'Letras y símbolos especiales listos para copiar y pegar.',
                icon: Sparkles
              },
              {
                to: '/herramientas/generador-de-nombres-para-instagram',
                title: 'Nombres para Instagram',
                desc: 'Ideas de nombres, letras bonitas y creador de bio aesthetic.',
                icon: Instagram
              }
            ].map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="group bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-[#4F46E5]/30 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <tool.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#4F46E5] transition">{tool.title}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{tool.desc}</p>
                <span className="inline-block mt-4 text-sm font-semibold text-[#4F46E5]">Abrir herramienta →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-[#F8F9FC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-[32px] font-bold text-gray-900 mb-4">¿Por qué elegir nuestro Generador de Lettering?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Nuestro generador de lettering ofrece una experiencia única con características diseñadas para hacer tu proceso creativo más fácil y divertido.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: PenTool, title: 'Diseño Intuitivo', desc: 'Interfaz fácil de usar diseñada para todos los niveles de experiencia, desde principiantes hasta profesionales.' },
              { icon: Type, title: 'Múltiples Estilos de Tipografía', desc: 'Más de 10 estilos caligráficos diferentes para personalizar tus textos según la ocasión.' },
              { icon: Palette, title: 'Personalización Total', desc: 'Ajusta tamaño, color, espaciado y añade efectos como sombras y contornos a tu gusto.' },
              { icon: Download, title: 'Exportación Sencilla', desc: 'Descarga tus creaciones en formato PNG o JPG para usarlas donde quieras.' },
              { icon: Globe, title: 'Totalmente Gratuito', desc: 'Sin costos ocultos ni suscripciones. Crea todos los diseños que necesites sin límites.' },
              { icon: CheckCircle2, title: 'Sin Registro', desc: 'Comienza a crear inmediatamente sin necesidad de registrarte o proporcionar datos personales.' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start text-left">
                <div className="w-12 h-12 bg-[#5A4AD2]/10 text-[#5A4AD2] rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-[17px] font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-[32px] font-bold text-gray-900 mb-4">Cómo Usar Nuestro Generador de Lettering</h2>
            <p className="text-gray-500 text-lg">Sigue estos sencillos pasos para crear diseños de lettering impresionantes en minutos.</p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-200">
            {[
              { num: 1, title: 'Elige una plantilla o comienza desde cero', desc: 'Selecciona una de nuestras plantillas prediseñadas o comienza con tu propio texto personalizado.' },
              { num: 2, title: 'Personaliza tu texto', desc: 'Modifica el estilo de letra, tamaño, color y alineación según tus preferencias.' },
              { num: 3, title: 'Añade efectos especiales', desc: 'Aplica sombras, contornos o rotación para dar un toque único a tu diseño.' },
              { num: 4, title: 'Exporta tu creación', desc: 'Descarga tu diseño en formato PNG o JPG para usarlo en tus proyectos.' },
            ].map((step) => (
              <div key={step.num} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[#5A4AD2] text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 w-[50px] h-[50px]">
                  {step.num}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 md:p-6 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ml-4 md:ml-0 md:group-odd:text-right">
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/editor" className="inline-flex bg-[#5A4AD2] text-white text-sm font-medium px-8 py-3 rounded-lg shadow-sm hover:bg-[#4F46E5] transition-colors">
              <PenTool className="w-4 h-4 mr-2" /> Comenzar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Plantillas de Lettering Prediseñadas</h2>
            <p className="text-gray-500 text-lg">Elige entre nuestra colección de plantillas para diferentes ocasiones y personalízalas a tu gusto.</p>
          </div>
          
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
             <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
               <div className="h-48 bg-[#F8F9FC] flex flex-col items-center justify-center p-4">
                  <span style={{fontFamily: 'Parisienne', fontSize: '32px', color: '#5A4AD2'}}>Juan & María</span>
               </div>
               <div className="p-5 border-t border-gray-100 bg-white">
                 <h3 className="font-bold text-sm mb-1 text-gray-900">Invitación de Boda</h3>
                 <p className="text-xs text-gray-500 mb-4">Con sombra</p>
                 <Link to="/editor" className="block text-center w-full bg-[#5A4AD2] text-white font-medium py-2 rounded text-sm hover:bg-[#4F46E5] transition">Usar Plantilla &rarr;</Link>
               </div>
             </div>

             <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
               <div className="h-48 bg-[#F8F9FC] flex flex-col items-center justify-center p-4">
                  <span style={{fontFamily: 'Dancing Script', fontSize: '36px', color: '#FF6B6B', textShadow: '2px 2px 4px rgba(0,0,0,0.1)'}}>¡Feliz Cumpleaños!</span>
               </div>
               <div className="p-5 border-t border-gray-100 bg-white">
                 <h3 className="font-bold text-sm mb-1 text-gray-900">Feliz Cumpleaños</h3>
                 <p className="text-xs text-gray-500 mb-4">Con sombra</p>
                 <Link to="/editor" className="block text-center w-full bg-[#5A4AD2] text-white font-medium py-2 rounded text-sm hover:bg-[#4F46E5] transition">Usar Plantilla &rarr;</Link>
               </div>
             </div>

             <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
               <div className="h-48 bg-[#F8F9FC] flex flex-col items-center justify-center p-4">
                  <span style={{fontFamily: 'Lobster', fontSize: '32px', color: '#34D399', WebkitTextStroke: '1px #065f46'}}>¡Feliz Navidad!</span>
               </div>
               <div className="p-5 border-t border-gray-100 bg-white">
                 <h3 className="font-bold text-sm mb-1 text-gray-900">Navidad</h3>
                 <p className="text-xs text-gray-500 mb-4">Con sombra</p>
                 <Link to="/editor" className="block text-center w-full bg-[#5A4AD2] text-white font-medium py-2 rounded text-sm hover:bg-[#4F46E5] transition">Usar Plantilla &rarr;</Link>
               </div>
             </div>
           </div>

           <div className="text-center">
             <Link to="/plantillas" className="inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
               <LayoutTemplate className="w-4 h-4"/> Ver Todas las Plantillas
             </Link>
           </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 px-4 bg-[#F8F9FC]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Aprende y Descubre</h2>
            <p className="text-gray-500 text-lg">Lee nuestros últimos artículos sobre tipografía, nombres insanos, letras bonitas y más.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <span className="text-[#FF6B6B] text-xs font-bold tracking-wider uppercase mb-2">Tutoriales</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight"><Link to="/blog/biografia-tiktok-aesthetic-dark" className="hover:text-[#5A4AD2] transition-colors">Biografía Aesthetic Dark en TikTok</Link></h3>
              <p className="text-gray-600 text-sm mb-6 flex-1">Aprende los secretos para optimizar tu perfil con la estética dark y grunge, letras cursivas y más.</p>
              <Link to="/blog/biografia-tiktok-aesthetic-dark" className="text-[#5A4AD2] font-semibold text-sm hover:underline flex items-center" aria-label="Leer artículo sobre Biografía Aesthetic Dark en TikTok">Leer artículo &rarr;</Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <span className="text-[#34D399] text-xs font-bold tracking-wider uppercase mb-2">Gaming</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight"><Link to="/blog/mejores-nombres-insanos-free-fire" className="hover:text-[#5A4AD2] transition-colors">Los mejores nombres insanos Free Fire</Link></h3>
              <p className="text-gray-600 text-sm mb-6 flex-1">Descubre cómo crear nombres que den miedo, usando símbolos, espacios invisibles y letras raras.</p>
              <Link to="/blog/mejores-nombres-insanos-free-fire" className="text-[#5A4AD2] font-semibold text-sm hover:underline flex items-center" aria-label="Leer artículo sobre Los mejores nombres insanos Free Fire">Leer artículo &rarr;</Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <span className="text-[#FBBF24] text-xs font-bold tracking-wider uppercase mb-2">Trucos</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight"><Link to="/blog/letras-invisibles-espacios-guia-redes-sociales" className="hover:text-[#5A4AD2] transition-colors">Espacios y letras invisibles (Guía)</Link></h3>
              <p className="text-gray-600 text-sm mb-6 flex-1">Todo lo que necesitas saber sobre los caracteres Unicode transparentes y los espacios en blanco.</p>
              <Link to="/blog/letras-invisibles-espacios-guia-redes-sociales" className="text-[#5A4AD2] font-semibold text-sm hover:underline flex items-center" aria-label="Leer artículo sobre Espacios y letras invisibles">Leer artículo &rarr;</Link>
            </div>
          </div>
          
          <div className="text-center">
             <Link to="/blog" className="inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
               Visitar el Blog
             </Link>
           </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Preguntas Frecuentes sobre Lettering</h2>
            <p className="text-gray-500 text-lg">Encuentra respuestas a las preguntas más comunes sobre nuestro generador de lettering y tipografía.</p>
          </div>
          <div className="max-w-2xl mx-auto">
            {FAQ_DATA.map((item, index) => (
              <FaqItem key={index} q={item.q} a={item.a} />
            ))}
          </div>
          <div className="flex flex-col items-center mt-10 space-y-4">
            <p className="text-sm text-gray-500">¿No encuentras respuesta a tu pregunta?</p>
            <Link to="/contacto" className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition bg-white shadow-sm flex items-center gap-2">
              Contacta con nosotros
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#5A4AD2] py-24 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para crear tu lettering personalizado?</h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Comienza a diseñar textos únicos, letras decoradas y tipografías creativas para tus proyectos, redes sociales o cualquier ocasión especial.
          </p>
          <Link to="/editor" className="inline-flex bg-[#FF6B6B] text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:-translate-y-1 hover:bg-[#ff5757] hover:shadow-xl transition-all items-center gap-2">
            <PenTool className="w-5 h-5"/> Ir al Editor de Lettering
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
