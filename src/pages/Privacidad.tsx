import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export default function Privacidad() {
  return (
    <>
      <SEO
        title="Política de Privacidad | Generador de Lettering"
        description="Consulta cómo Generador de Lettering procesa texto en el navegador, utiliza almacenamiento local y carga servicios publicitarios de terceros según tu consentimiento."
        canonical="https://generadordelettering.org/politica-de-privacidad"
      />

      <div className="max-w-4xl mx-auto py-16 px-4 w-full flex-1">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#5A4AD2]">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Política de Privacidad</span>
        </nav>

        <h1 className="text-4xl font-bold mb-8 text-gray-900">Política de Privacidad</h1>

        <div className="text-base text-gray-700 space-y-6 leading-relaxed">
          <p className="text-sm bg-gray-100 inline-block px-3 py-1 rounded-full font-medium text-gray-600">
            Última actualización: 7 de octubre de 2026
          </p>

          <p>
            Esta política explica, de forma práctica, cómo funciona la privacidad en <strong>Generador de Lettering</strong>
            (generadordelettering.org). La versión actual del sitio no requiere crear una cuenta para utilizar sus herramientas.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">
            1. Texto, diseños y procesamiento en el navegador
          </h2>
          <p>
            Los conversores de texto y las funciones principales del editor procesan la información introducida directamente
            en el navegador. El sitio no necesita enviar el contenido de tus frases a un servidor propio para generar las
            variantes Unicode o renderizar el diseño.
          </p>
          <p>
            Algunas funciones guardan preferencias en el almacenamiento local del navegador, por ejemplo ajustes del editor,
            favoritos de ciertas herramientas y tu elección sobre cookies. Puedes eliminar esos datos desde las opciones de
            almacenamiento del navegador.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">
            2. Alojamiento y registros técnicos
          </h2>
          <p>
            El proveedor de alojamiento y la infraestructura de entrega pueden procesar datos técnicos necesarios para servir
            el sitio, protegerlo frente a abusos y diagnosticar errores. Estos datos pueden incluir dirección IP, agente de
            usuario, fecha y hora de la solicitud y URL solicitada, de acuerdo con las políticas del proveedor correspondiente.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">
            3. Cookies, almacenamiento local y consentimiento
          </h2>
          <p>
            Guardamos en el navegador la preferencia <code>cookie_consent</code> para recordar si aceptaste o rechazaste las
            tecnologías publicitarias no esenciales. En la implementación actual, los scripts publicitarios configurados por
            el sitio se cargan únicamente después de una aceptación explícita.
          </p>
          <p>
            Rechazar el consentimiento no impide necesariamente todas las solicitudes a servicios externos: por ejemplo,
            determinados recursos visuales como fuentes web pueden descargarse desde proveedores externos para mostrar la
            interfaz correctamente.
          </p>
          <p>
            Puedes cambiar tu elección en cualquier momento mediante <strong>“Preferencias de cookies”</strong> en el pie de
            página. Esa opción elimina la preferencia guardada y recarga el sitio para que puedas aceptar o rechazar de nuevo;
            la recarga también evita que continúen activos en esa página scripts publicitarios cargados con una aceptación anterior.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">
            4. Publicidad de terceros
          </h2>
          <p>
            La integración publicitaria configurada actualmente es <strong>Google AdSense</strong>. La página
            incluye una etiqueta estática de verificación de AdSense, pero el script de anuncios solo se solicita
            después de que aceptes expresamente las tecnologías publicitarias. Google puede tratar datos técnicos
            de acuerdo con sus propias políticas. No cargamos redes de anuncios emergentes ni barras sociales
            de terceros.
          </p>
          <p>
            Puedes consultar información sobre las tecnologías publicitarias de Google en{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5A4AD2] hover:underline font-semibold"
            >
              las políticas de publicidad de Google
            </a>.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">
            5. Fuentes y recursos externos
          </h2>
          <p>
            El sitio utiliza recursos externos, incluyendo Google Fonts. Al solicitar un recurso a un proveedor externo,
            dicho proveedor puede recibir información técnica habitual de una conexión web, como la dirección IP y el agente
            de usuario. El tratamiento de esos datos se rige por la política del proveedor.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">
            6. Derechos y solicitudes de privacidad
          </h2>
          <p>
            Dependiendo de tu jurisdicción, puedes tener derechos relacionados con el acceso, corrección, eliminación,
            oposición o limitación del tratamiento de datos personales. Si quieres realizar una solicitud o consultar cómo
            se aplica esta política a tu caso, puedes escribirnos desde la página de{' '}
            <Link to="/contacto" className="text-[#5A4AD2] hover:underline font-semibold">Contacto</Link>.
            Las solicitudes se atenderán de acuerdo con la legislación aplicable.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">
            7. Cambios en esta política
          </h2>
          <p>
            Si cambia de forma relevante el funcionamiento del sitio o los proveedores utilizados, esta política puede
            actualizarse. La fecha indicada al comienzo de la página refleja la última revisión publicada.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">
            8. Contacto
          </h2>
          <p>
            Para consultas relacionadas con privacidad, utiliza nuestra página de{' '}
            <Link to="/contacto" className="text-[#5A4AD2] hover:underline font-semibold">Contacto</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
