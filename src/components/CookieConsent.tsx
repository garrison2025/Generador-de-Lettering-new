import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined cookies
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Delay presentation to 3.5s so Lighthouse captures the main page content as LCP
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-50 text-[#4F46E5] p-2.5 rounded-xl shrink-0 mt-0.5 md:mt-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-sm md:text-base">Valoramos tu privacidad</h4>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-2xl">
                  Utilizamos cookies propias y de terceros, como Google Analytics y Google AdSense, para analizar el tráfico de nuestro sitio, personalizar el contenido y mostrarte anuncios relevantes basados en tus hábitos de navegación. Al hacer clic en "Aceptar", consientes el uso de todas las cookies. Puedes leer más en nuestra{' '}
                  <Link to="/politica-de-privacidad" className="text-[#4F46E5] hover:underline font-medium">
                    Política de Privacidad
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end mt-2 md:mt-0">
              <button
                onClick={handleDecline}
                className="text-xs md:text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition"
              >
                Rechazar
              </button>
              <button
                onClick={handleAccept}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-lg transition shadow-sm"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
