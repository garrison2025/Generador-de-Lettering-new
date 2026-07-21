import React from 'react';

export default function Privacidad() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 w-full flex-1">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Política de Privacidad</h1>
      <div className="text-base text-gray-700 space-y-6 leading-relaxed">
        <p className="text-sm bg-gray-100 inline-block px-3 py-1 rounded-full font-medium text-gray-600">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p>
          En <strong>Generador de Lettering</strong> (disponible en generadordelettering.org), accesible desde nuestra web, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene tipos de información que se recopila y registra, y cómo la utilizamos.
        </p>
        <p>
          Si tiene preguntas adicionales o requiere más información sobre nuestra Política de Privacidad, no dude en ponerse en contacto con nosotros a través de nuestro formulario de contacto.
        </p>
        
        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">1. Procesamiento de Datos del Usuario (Uso Offline / Cliente)</h2>
        <p>
          Nuestra aplicación interactiva de diseño de tipografías funciona enteramente dentro de su navegador web (Client-side). 
          <strong> No guardamos, transmitimos, procesamos ni almacenamos ningún texto introducido, imágenes construidas, colores o configuraciones tipográficas</strong> en nuestros servidores. Todo lo que escribe, edita y genera permanece privado y exclusivo dentro de su sesión local en su dispositivo de manera 100% confidencial.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">2. Archivos de Registro (Log Files)</h2>
        <p>
          Generador de Lettering sigue un procedimiento estándar de uso de archivos de registro. Estos archivos registran a los visitantes cuando visitan sitios web. Todas las empresas de alojamiento web lo hacen y forma parte del análisis de los servicios de alojamiento. 
          La información recopilada por los archivos de registro incluye direcciones de protocolo de Internet (IP), tipo de navegador, proveedor de servicios de Internet (ISP), marca de fecha y hora, páginas de referencia/salida y, posiblemente, el número de clics. Estos datos no están vinculados a ninguna información que sea personalmente identificable. El propósito de la información es analizar tendencias, administrar el sitio, rastrear el movimiento de los usuarios en el sitio web y recopilar información demográfica.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">3. Cookies y balizas web (Cookies and Web Beacons)</h2>
        <p>
          Como cualquier otro sitio web, Generador de Lettering utiliza "cookies". Estas cookies se utilizan para almacenar información, incluidas las preferencias de los visitantes y las páginas del sitio web a las que el visitante accedió o visitó. La información se utiliza para optimizar la experiencia de los usuarios al personalizar el contenido de nuestra página web en función del tipo de navegador de los visitantes y/u otra información.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">4. Galleta de Google DoubleClick DART (Google DoubleClick DART Cookie)</h2>
        <p>
          Google es uno de los proveedores de terceros en nuestro sitio. También utiliza cookies, conocidas como cookies de DART, para publicar anuncios a los visitantes de nuestro sitio en función de su visita a generadordelettering.org y otros sitios en el Internet. 
          Sin embargo, los visitantes pueden optar por rechazar el uso de cookies de DART visitando la Política de privacidad de la red de anuncios y contenido de Google en la siguiente dirección: 
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold ml-1">
            https://policies.google.com/technologies/ads
          </a>.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">5. Nuestros Socios Publicitarios (Google AdSense)</h2>
        <p>
          Algunos de los anunciantes en nuestro sitio pueden usar cookies y balizas web. Nuestro socio publicitario principal es:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4 text-gray-700">
          <li>
            <strong>Google AdSense:</strong> Puede consultar las políticas de privacidad de Google para sus servicios publicitarios en: 
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline ml-1">
              https://policies.google.com/technologies/ads
            </a>.
          </li>
        </ul>
        <p className="mt-4">
          Estos servidores de anuncios o redes de anuncios de terceros utilizan tecnología en sus respectivos anuncios y enlaces que aparecen en Generador de Lettering, que se envían directamente al navegador de los usuarios. Reciben automáticamente su dirección IP cuando esto ocurre. Estas tecnologías se utilizan para medir la efectividad de sus campañas publicitarias y/o para personalizar el contenido publicitario que ve en los sitios web que visita.
        </p>
        <p className="text-sm text-gray-500 italic">
          Tenga en cuenta que Generador de Lettering no tiene acceso ni control sobre estas cookies que son utilizadas por anunciantes de terceros.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">6. Políticas de Privacidad de Terceros</h2>
        <p>
          La Política de Privacidad de Generador de Lettering no se aplica a otros anunciantes o sitios web. Por lo tanto, le aconsejamos que consulte las respectivas Políticas de Privacidad de estos servidores de anuncios de terceros para obtener información más detallada. Puede incluir sus prácticas e instrucciones sobre cómo optar por no participar en ciertas opciones.
        </p>
        <p>
          Puede optar por desactivar las cookies a través de las opciones de su navegador individual. Para obtener información más detallada sobre la gestión de cookies con navegadores web específicos, se puede encontrar en los respectivos sitios web de los navegadores.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">7. Derechos de Privacidad de GDPR / CCPA (No vender mi información)</h2>
        <p>
          Bajo las regulaciones del GDPR (Reglamento General de Protección de Datos de la UE) y la CCPA (Ley de Privacidad del Consumidor de California), entre otros derechos, los usuarios tienen derecho a:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4 text-gray-700">
          <li><strong>Derecho de acceso:</strong> Solicitar que se le revelen las categorías y datos específicos que recopilamos sobre usted.</li>
          <li><strong>Derecho de rectificación/supresión:</strong> Solicitar que se eliminen o corrijan los datos personales que hayamos recopilado.</li>
          <li><strong>Derecho a oponerse:</strong> Solicitar que no vendamos ni compartamos sus datos personales con terceros proveedores de anuncios.</li>
        </ul>
        <p className="mt-4">
          Si realiza una solicitud, tenemos un mes para responderle. Si desea ejercer alguno de estos derechos, póngase en contacto con nosotros.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">8. Consentimiento</h2>
        <p>
          Al utilizar nuestro sitio web, usted acepta nuestra Política de privacidad y acepta sus Términos y condiciones. También puede dar o retirar su consentimiento para el uso de cookies no esenciales de terceros haciendo clic en el banner flotante de privacidad de nuestro portal.
        </p>
      </div>
    </div>
  );
}
