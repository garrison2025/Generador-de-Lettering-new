import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { Mail, Send, MessageSquare, Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ORGANIZATION_ID } from '../seo/siteEntities';

export default function Contacto() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Sugerencia / Feedback', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const subject = encodeURIComponent(`[${formData.subject}] Generador de Lettering`);
    const body = encodeURIComponent(
      `Nombre: ${formData.name}\nCorreo de respuesta: ${formData.email}\n\nMensaje:\n${formData.message}`
    );

    window.location.href = `mailto:contacto@generadordelettering.org?subject=${subject}&body=${body}`;
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contacto | Generador de Lettering",
    "description": "Formulario de contacto oficial y soporte para el equipo de Generador de Lettering.",
    "url": "https://generadordelettering.org/contacto",
    "about": {
      "@id": ORGANIZATION_ID
    }
  };

  return (
    <>
      <SEO 
        title="Contacto y Soporte | Generador de Lettering"
        description="Ponte en contacto con el equipo de Generador de Lettering. Envíanos sugerencias, consultas sobre fuentes Unicode, soporte o propuestas de colaboración."
        keywords="contacto generador de lettering, soporte generador de lettering, contacto tipografias"
        canonical="https://generadordelettering.org/contacto"
        jsonSchema={contactSchema}
      />

      <div className="bg-[#F8F9FC] min-h-screen py-12 px-4 flex-1">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
            <ol className="flex items-center space-x-2 font-medium">
              <li><Link to="/" className="hover:text-[#5A4AD2] transition-colors">Inicio</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-900" aria-current="page">Contacto</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5A4AD2]/10 text-[#5A4AD2] text-sm font-bold">
              <MessageSquare className="w-4 h-4" />
              <span>Soporte y Atención al Usuario</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
              ¿En qué podemos <span className="text-[#5A4AD2]">ayudarte</span>?
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto text-base">
              ¿Tienes problemas técnicos, ideas para nuevas tipografías o propuestas de colaboración? Puedes preparar un correo con el formulario o escribirnos directamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Contact Information Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5A4AD2] flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Correo Electrónico</h3>
                  <p className="text-xs text-gray-500 mt-1">Escríbenos directamente a:</p>
                  <a href="mailto:contacto@generadordelettering.org" className="text-sm font-semibold text-[#5A4AD2] hover:underline mt-1 block">
                    contacto@generadordelettering.org
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Cómo funciona el formulario</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Al enviarlo se abrirá tu aplicación de correo con el mensaje preparado. Nada se envía hasta que confirmes el envío desde tu correo.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#5A4AD2] to-[#4338CA] text-white p-6 rounded-2xl shadow-sm space-y-3">
                <Sparkles className="w-6 h-6 text-amber-300" />
                <h3 className="font-bold text-lg">¿Preguntas Frecuentes?</h3>
                <p className="text-xs text-purple-100 leading-relaxed">
                  Consulta nuestra sección de sobre nosotros y guía de fuentes para conocer el funcionamiento del estándar Unicode.
                </p>
                <Link to="/sobre-nosotros" className="inline-block text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition">
                  Conocer Más →
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Preparar un correo</h2>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    Este formulario no almacena ni envía el mensaje desde nuestro servidor. Al pulsar el botón se abrirá tu cliente de correo con los datos preparados.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nombre *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#5A4AD2] focus:border-transparent outline-none transition"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Correo para responderte *</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#5A4AD2] focus:border-transparent outline-none transition"
                      placeholder="tuemail@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Asunto</label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#5A4AD2] focus:border-transparent outline-none transition bg-white"
                    >
                      <option value="Sugerencia / Feedback">Sugerencia / Nuevas Fuentes</option>
                      <option value="Soporte Técnico">Soporte Técnico / Error</option>
                      <option value="Colaboración / Negocios">Colaboración o Publicidad</option>
                      <option value="Privacidad / Derechos">Consulta sobre Privacidad</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Mensaje *</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      autoComplete="off"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#5A4AD2] focus:border-transparent outline-none transition resize-y"
                      placeholder="Describe brevemente tu consulta o sugerencia..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#5A4AD2] hover:bg-[#4338CA] text-white font-bold py-3.5 px-8 rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4" /> Abrir correo con este mensaje
                  </button>
                </form>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

