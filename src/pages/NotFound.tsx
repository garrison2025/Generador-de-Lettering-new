import { Link } from 'react-router-dom';
import { Type, ArrowRight, Home } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO 
        title="Página no encontrada (404) | LetrasPro"
        description="Lo sentimos, no pudimos encontrar la página que buscas. Descubre nuestro conversor de letras bonitas y otras herramientas para tus redes sociales."
      />
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center py-20">
        <div className="w-24 h-24 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-8">
          <Type className="w-12 h-12" />
        </div>
        <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tight">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">¡Ups! Página no encontrada</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Parece que la URL que introdujiste o el enlace del que vienes ya no existe.<br />
          Pero no te preocupes, aprovecha para descubrir nuestras herramientas gratuitas más populares:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
          <Link 
            to="/herramientas/conversor-letras-bonitas"
            className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl hover:border-pink-500 hover:shadow-xl transition-all group"
          >
            <div className="text-left">
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-pink-600 transition-colors">Conversor de Letras Bonitas</h3>
              <p className="text-sm text-gray-500 mt-2">Nuestra herramienta estrella para Instagram, WhatsApp y TikTok. ¡Más de 50 estilos gratis!</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-pink-500 ml-4 shrink-0" />
          </Link>
          <Link 
            to="/herramientas/letras-free-fire"
            className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl hover:border-yellow-500 hover:shadow-xl transition-all group"
          >
            <div className="text-left">
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-yellow-600 transition-colors">Nombres para Free Fire</h3>
              <p className="text-sm text-gray-500 mt-2">Crea nicks insanos y épicos con símbolos, espacios invisibles, coronas y alas.</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-yellow-500 ml-4 shrink-0" />
          </Link>
        </div>

        <Link 
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
        >
          <Home className="w-5 h-5 mr-2" />
          Volver a la página principal
        </Link>
      </div>
    </>
  );
}
