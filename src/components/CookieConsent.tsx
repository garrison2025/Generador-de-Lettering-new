import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie_consent');
      if (consent) return;
    } catch {
      // Storage may be unavailable in restricted browsing contexts.
    }

    setIsVisible(true);
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie_consent', 'accepted');
    } catch {
      // Continue without persistence if browser storage is unavailable.
    }
    window.dispatchEvent(new Event('cookie-consent-accepted'));
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('cookie_consent', 'declined');
    } catch {
      // Continue without persistence if browser storage is unavailable.
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="privacy-consent-title"
      aria-describedby="privacy-consent-description"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
    >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-50 text-[#4F46E5] p-2.5 rounded-xl shrink-0 mt-0.5 md:mt-0">
                <ShieldCheck className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h4 id="privacy-consent-title" className="font-bold text-gray-900 text-sm md:text-base">Valoramos tu privacidad</h4>
                <p id="privacy-consent-description" className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-2xl">
                  Utilizamos almacenamiento local para recordar tus preferencias y, si aceptas, podemos cargar servicios publicitarios de terceros como Google AdSense, Monetag y Adsterra. Si rechazas, esos scripts publicitarios no se cargarán desde nuestra implementación. Puedes leer los detalles en nuestra{' '}
                  <Link to="/politica-de-privacidad" className="text-[#4F46E5] hover:underline font-medium">
                    Política de Privacidad
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end mt-2 md:mt-0">
              <button
                type="button"
                onClick={handleDecline}
                className="text-xs md:text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition"
              >
                Rechazar
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-lg transition shadow-sm"
              >
                Aceptar todas
              </button>
            </div>
          </div>
    </div>
  );
}
