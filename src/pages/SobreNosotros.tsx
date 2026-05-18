import React from 'react';

export default function SobreNosotros() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 w-full flex-1">
      <h1 className="text-4xl font-bold mb-8">Sobre Nosotros</h1>
      <div className="text-lg text-gray-700 space-y-6">
        <p>
          Generador de Lettering nació con la misión de democratizar el arte del diseño tipográfico. Creemos que todos deberían tener acceso a herramientas de diseño de alta calidad sin necesidad de software costoso o conocimientos técnicos avanzados.
        </p>
        <p>
          Nuestra plataforma es totalmente gratuita, rápida y respetuosa con la privacidad de los usuarios. No almacenamos tus textos ni diseños en nuestros servidores; todo se renderiza directamente en tu navegador (Client-side) para garantizar tu privacidad y una experiencia ultra rápida.
        </p>
        <p className="font-medium text-gray-900 border-l-4 border-brand pl-4 bg-gray-50 py-3">
          Si tienes sugerencias o quieres colaborar, no dudes en contactarnos. ¡Sigue creando diseños increíbles!
        </p>
      </div>
    </div>
  );
}
