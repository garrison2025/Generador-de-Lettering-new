import React from 'react';

export default function Contacto() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 w-full flex-1">
      <h1 className="text-4xl font-bold mb-4">Contacto</h1>
      <p className="text-lg text-gray-600 mb-10">
        ¿Tienes problemas técnicos, ideas de nuevas tipografías, o propuestas de negocio? Rellena el formulario y nos pondremos en contacto contigo lo antes posible.
      </p>
      
      <form className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Nombre</label>
          <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition" placeholder="Tu nombre y apellido" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
          <input type="email" className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition" placeholder="tu@email.com" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Mensaje</label>
          <textarea className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg min-h-[160px] resize-y focus:ring-2 focus:ring-brand focus:border-brand outline-none transition" placeholder="¿En qué podemos ayudarte?"></textarea>
        </div>
        <button type="button" className="w-full sm:w-auto bg-brand text-white font-bold py-4 px-10 rounded-xl hover:bg-brand/90 hover:shadow-lg transition-transform hover:-translate-y-0.5 mt-2">
          Enviar Mensaje
        </button>
      </form>
    </div>
  );
}
