import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PenTool, Menu, X } from 'lucide-react';

const CookieConsent = lazy(() => import('./CookieConsent'));


export default function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isEditor = location.pathname === '/editor';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8F9FC]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-[#4F46E5] focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:font-semibold"
      >
        Saltar al contenido
      </a>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex flex-col text-gray-900 hover:opacity-80 transition group pt-1">
            <div className="flex items-center gap-2">
              <div className="bg-[#4F46E5] text-white p-1 rounded shadow-sm">
                <PenTool className="w-4 h-4" />
              </div>
              <span className="font-bold text-[1.1rem] tracking-tight leading-none">Generador de Lettering</span>
            </div>
            <span className="text-[10px] text-gray-500 ml-8 leading-none mt-1 group-hover:text-gray-700 transition">Arte tipográfico personalizado</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            <Link to="/" className={`text-sm font-semibold hover:text-[#4F46E5] transition ${location.pathname === '/' ? 'text-[#4F46E5]' : 'text-gray-600'}`}>Inicio</Link>
            <Link to="/editor" className={`text-sm font-semibold hover:text-[#4F46E5] transition ${location.pathname === '/editor' ? 'text-[#4F46E5]' : 'text-gray-600'}`}>Editor</Link>
            <Link to="/plantillas" className={`text-sm font-semibold hover:text-[#4F46E5] transition ${location.pathname === '/plantillas' ? 'text-[#4F46E5]' : 'text-gray-600'}`}>Plantillas</Link>
            <Link to="/blog" className={`text-sm font-semibold hover:text-[#4F46E5] transition ${location.pathname.startsWith('/blog') ? 'text-[#4F46E5]' : 'text-gray-600'}`}>Blog</Link>
            
            <div className="relative group">
              <button type="button" aria-haspopup="true" className={`flex items-center gap-1 text-sm font-semibold hover:text-[#4F46E5] transition ${location.pathname.startsWith('/herramientas') ? 'text-[#4F46E5]' : 'text-gray-600'}`}>
                Herramientas
                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 py-2 z-50">
                <Link to="/herramientas" className="block px-4 py-2 text-sm font-bold text-[#4F46E5] hover:bg-[#4F46E5]/10 transition">Todas las herramientas</Link>
                <div className="mx-3 my-1 border-t border-gray-100"></div>
                <Link to="/herramientas/letras-free-fire" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition font-semibold">Letras para Free Fire</Link>
                <Link to="/herramientas/letras-tiktok" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition font-semibold">Letras para TikTok</Link>
                <Link to="/herramientas/letras-azules" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition font-semibold">Letras Azules</Link>
                <Link to="/herramientas/generador-de-nombres-para-instagram" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition font-semibold">Nombres para Instagram</Link>
                <Link to="/herramientas/conversor-texto" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition font-semibold">Conversor de Letras</Link>
                <Link to="/herramientas/generador-de-nombres-para-free-fire" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition">Nombres para Free Fire</Link>
                <div className="mx-3 my-1 border-t border-gray-100"></div>
                <Link to="/herramientas/creador-de-lettering" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition">Creador de Lettering</Link>
                <Link to="/herramientas/conversor-letras-bonitas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition">Letras Bonitas Aesthetic</Link>
                <Link to="/herramientas/paletas-de-color" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition">Paletas de Color</Link>
                <Link to="/herramientas/combinador-de-fuentes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition">Combinador de Fuentes</Link>
                <Link to="/herramientas/plantillas-practica" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition">Plantillas de Práctica</Link>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/editor" className="hidden md:inline-flex bg-[#4F46E5] text-white text-sm font-semibold px-6 py-2.5 rounded hover:bg-[#4338CA] transition shadow-sm">
              Comenzar Ahora
            </Link>
            
            <button
              type="button"
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2 rounded"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-main-navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav
            id="mobile-main-navigation"
            aria-label="Navegación principal móvil"
            className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-3 rounded-md text-base font-medium ${location.pathname === '/' ? 'text-[#4F46E5] bg-indigo-50' : 'text-gray-900 hover:bg-gray-50'}`}>Inicio</Link>
              <Link to="/editor" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-3 rounded-md text-base font-medium ${location.pathname === '/editor' ? 'text-[#4F46E5] bg-indigo-50' : 'text-gray-900 hover:bg-gray-50'}`}>Editor</Link>
              <Link to="/plantillas" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-3 rounded-md text-base font-medium ${location.pathname === '/plantillas' ? 'text-[#4F46E5] bg-indigo-50' : 'text-gray-900 hover:bg-gray-50'}`}>Plantillas</Link>
              <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-3 rounded-md text-base font-medium ${location.pathname.startsWith('/blog') ? 'text-[#4F46E5] bg-indigo-50' : 'text-gray-900 hover:bg-gray-50'}`}>Blog</Link>
              <div className="px-3 pt-4 pb-2 border-t border-gray-100 mt-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Herramientas Populares</span>
                  <Link to="/herramientas" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold text-[#4F46E5] hover:underline">Ver todas</Link>
                </div>
              </div>
              <Link to="/herramientas/creador-de-lettering" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-bold text-[#5A4AD2] hover:bg-gray-50">Creador de Lettering</Link>
              <Link to="/herramientas/conversor-letras-bonitas" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Conv. Letras Bonitas</Link>
              <Link to="/herramientas/generador-de-nombres-para-instagram" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Nombres para Instagram</Link>
              <Link to="/herramientas/letras-free-fire" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50">Letras para Free Fire</Link>
              <Link to="/herramientas/letras-tiktok" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50">Letras para TikTok</Link>
              <Link to="/herramientas/letras-azules" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50">Letras Azules</Link>
              <Link to="/herramientas/conversor-texto" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50">Conversor de Letras</Link>
              <Link to="/herramientas/generador-de-nombres-para-free-fire" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Nombres para Free Fire</Link>
              <div className="mt-4 pt-4 px-3 w-full border-t border-gray-50">
                <Link to="/editor" onClick={() => setMobileMenuOpen(false)} className="flex w-full items-center justify-center bg-[#4F46E5] text-white text-base font-semibold px-6 py-3 rounded hover:bg-[#4338CA] transition shadow-sm">
                  Comenzar Ahora
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>
      
      <main id="main-content" className={`flex-1 flex flex-col relative w-full h-full`} tabIndex={-1}>
        <Outlet />
      </main>

      {!isEditor && (
        <footer className="bg-white border-t border-gray-200 mt-auto pt-12 pb-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 border-b border-gray-100 pb-12">
              <div className="md:col-span-1">
                <Link to="/" className="flex items-center gap-2 mb-4 text-gray-900 hover:opacity-80 transition">
                  <div className="bg-[#4F46E5] text-white p-1 rounded shadow-sm">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg tracking-tight leading-none">Generador de Lettering</span>
                </Link>
                <p className="text-gray-500 text-sm mb-6">
                  Tu plataforma definitiva para arte tipográfico, conversor de letras, y recursos de diseño web y gaming.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4 whitespace-nowrap">Herramientas</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link to="/herramientas" className="hover:text-[#4F46E5] font-bold">Todas las Herramientas</Link></li>
                  <li><Link to="/herramientas/creador-de-lettering" className="hover:text-[#4F46E5] font-bold text-[#5A4AD2]">Creador de Lettering</Link></li>
                  <li><Link to="/herramientas/generador-de-nombres-para-instagram" className="hover:text-[#4F46E5] font-medium">Nombres para Instagram</Link></li>
                  <li><Link to="/herramientas/generador-de-nombres-para-free-fire" className="hover:text-[#4F46E5] font-medium">Nombres para Free Fire</Link></li>
                  <li><Link to="/herramientas/conversor-letras-bonitas" className="hover:text-[#4F46E5]">Letras Bonitas</Link></li>
                  <li><Link to="/generador-de-letras-goticas" className="hover:text-[#4F46E5]">Letras Góticas</Link></li>
                  <li><Link to="/generador-de-letras-cursivas" className="hover:text-[#4F46E5]">Letras Cursivas</Link></li>
                  <li><Link to="/letras-para-instagram" className="hover:text-[#4F46E5]">Letras para Instagram</Link></li>
                  <li><Link to="/letras-para-tatuajes" className="hover:text-[#4F46E5]">Letras para Tatuajes</Link></li>
                  <li><Link to="/herramientas/letras-azules" className="hover:text-[#4F46E5]">Letras Azules</Link></li>
                  <li><Link to="/editor" className="hover:text-[#4F46E5]">Editor Avanzado</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4 whitespace-nowrap">Recursos y Guías</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li>
                    <a 
                      href="https://conversordeletrasbonitas.net/" 
                      target="_blank" 
                      rel="noopener" 
                      className="hover:text-[#4F46E5] font-medium text-gray-700 transition"
                    >
                      Conversor de Letras Bonitas
                    </a>
                  </li>
                  <li><Link to="/blog/biografia-tiktok-aesthetic-dark" className="hover:text-[#4F46E5]">Bio Aesthetic TikTok</Link></li>
                  <li><Link to="/blog/mejores-nombres-insanos-free-fire" className="hover:text-[#4F46E5]">Nombres Insanos</Link></li>
                  <li><Link to="/blog/letras-invisibles-espacios-guia-redes-sociales" className="hover:text-[#4F46E5]">Letras Invisibles</Link></li>
                  <li><Link to="/blog" className="hover:text-[#4F46E5]">Todos los artículos</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4 whitespace-nowrap">Empresa y Legal</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><Link to="/sobre-nosotros" className="hover:text-[#4F46E5]">Sobre Nosotros</Link></li>
                  <li><Link to="/contacto" className="hover:text-[#4F46E5]">Contacto</Link></li>
                  <li><Link to="/politica-de-privacidad" className="hover:text-[#4F46E5]">Privacidad</Link></li>
                  <li><Link to="/terminos-y-condiciones" className="hover:text-[#4F46E5]">Términos</Link></li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          localStorage.removeItem('cookie_consent');
                        } catch {
                          // Reload still removes any in-memory ad scripts from this page.
                        }
                        window.location.reload();
                      }}
                      className="hover:text-[#4F46E5] text-left"
                    >
                      Preferencias de cookies
                    </button>
                  </li>
                  <li><a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-[#4F46E5] text-xs text-gray-400">LLMs.txt (AI Spec)</a></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
              <div className="text-center md:text-left">
                © {new Date().getFullYear()} Generador de Lettering. Todos los derechos reservados.
              </div>
              <div className="flex items-center space-x-4">
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:underline">Mapa del Sitio (XML)</a>
                <span>•</span>
                <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:underline">Robots.txt</a>
              </div>
            </div>
          </div>
        </footer>
      )}
      <Suspense fallback={null}>
        <CookieConsent />
      </Suspense>
    </div>
  );
}
