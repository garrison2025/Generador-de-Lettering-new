import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export default function Terminos() {
  return (
    <>
      <SEO
        title="Términos y Condiciones | Generador de Lettering"
        description="Consulta las condiciones de uso de las herramientas de Generador de Lettering, sus limitaciones, licencias de terceros y disponibilidad del servicio."
        canonical="https://generadordelettering.org/terminos-y-condiciones"
      />

      <div className="max-w-3xl mx-auto py-16 px-4 w-full flex-1">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#5A4AD2]">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Términos y Condiciones</span>
        </nav>

        <h1 className="text-4xl font-bold mb-8 text-gray-900">Términos y Condiciones</h1>

        <div className="text-base text-gray-700 space-y-6 leading-relaxed">
          <p className="text-sm bg-gray-100 inline-block px-3 py-1 rounded-full font-medium text-gray-600">
            Última actualización: 6 de octubre de 2026
          </p>

          <p>
            Al utilizar Generador de Lettering aceptas estas condiciones de uso. Si no estás de acuerdo con ellas,
            puedes dejar de utilizar el sitio.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">Uso de las herramientas</h2>
          <p>
            Las herramientas disponibles actualmente pueden utilizarse sin registro y sin una suscripción de pago.
            Eres responsable del texto, imágenes, nombres y demás contenido que introduzcas o generes con ellas, así como
            de comprobar que su uso cumple las reglas de la plataforma o servicio donde vayas a publicarlo.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">Fuentes y recursos de terceros</h2>
          <p>
            El sitio puede utilizar tipografías, bibliotecas de software, iconos y otros recursos sujetos a licencias de
            terceros. El uso de un resultado generado no modifica las condiciones de licencia que puedan corresponder a esos
            recursos ni concede derechos sobre marcas, nombres o contenidos pertenecientes a terceros.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">Compatibilidad</h2>
          <p>
            Los caracteres Unicode, símbolos y nombres generados pueden mostrarse de forma diferente según el sistema operativo,
            la fuente instalada o la aplicación de destino. Plataformas externas como redes sociales o videojuegos pueden
            cambiar sus reglas y rechazar determinados caracteres sin previo aviso.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">Disponibilidad del servicio</h2>
          <p>
            Procuramos mantener el sitio operativo, pero no garantizamos disponibilidad ininterrumpida. Podemos corregir,
            modificar, sustituir o retirar funciones cuando sea necesario por motivos técnicos, de seguridad o de mantenimiento.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">Privacidad</h2>
          <p>
            El tratamiento de datos y el uso de tecnologías de terceros se describen en nuestra{' '}
            <Link to="/politica-de-privacidad" className="text-[#5A4AD2] hover:underline font-semibold">
              Política de Privacidad
            </Link>.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">Contacto</h2>
          <p>
            Si tienes una pregunta sobre estas condiciones, utiliza la página de{' '}
            <Link to="/contacto" className="text-[#5A4AD2] hover:underline font-semibold">Contacto</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
