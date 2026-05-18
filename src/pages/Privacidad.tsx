import React from 'react';

export default function Privacidad() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 w-full flex-1">
      <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
      <div className="text-lg text-gray-700 space-y-6">
        <p className="text-sm bg-gray-100 inline-block px-3 py-1 rounded-full font-medium">Última actualización: {new Date().toLocaleDateString()}</p>
        <p>En Generador de Lettering (generadordelettering.org), la privacidad de nuestros visitantes es de extrema importancia para nosotros. Este documento describe los tipos de información que recibimos y recopilamos y cómo la utilizamos.</p>
        
        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">1. Procesamiento de Datos del Usuario</h2>
        <p>Nuestra aplicación funciona enteramente en tu navegador (Client-side). <strong>No guardamos, transmitimos ni almacenamos los textos, imágenes construidas o configuraciones tipográficas</strong> en nuestros servidores. Todo lo que escribes y generas es privado y exclusivo de tu sesión local.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">2. Cookies y Análisis de Tráfico</h2>
        <p>Utilizamos Google Analytics (GA4) para entender cómo los visitantes interactúan con nuestra página, qué herramientas usan más (por ejemplo, clics en el botón de "Exportar"), para así mejorar la aplicación. Estas herramientas pueden usar cookies para rastrear tu comportamiento de forma anónima.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">3. Publicidad (AdSense)</h2>
        <p>Nuestro sitio puede mostrar anuncios de Google AdSense. Google y sus socios utilizan cookies para mostrar anuncios basados en las visitas previas del usuario a nuestro sitio web u otros sitios web.</p>
      </div>
    </div>
  );
}
