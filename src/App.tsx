/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';

// Lazy loading pages for better performance (LCP/TTI optimization)
const Home = lazy(() => import('./pages/Home'));
const Editor = lazy(() => import('./pages/Editor'));
const Plantillas = lazy(() => import('./pages/Plantillas'));
const SeoPage = lazy(() => import('./pages/SeoPage'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const SobreNosotros = lazy(() => import('./pages/SobreNosotros'));
const Contacto = lazy(() => import('./pages/Contacto'));
const Privacidad = lazy(() => import('./pages/Privacidad'));
const Terminos = lazy(() => import('./pages/Terminos'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Herramientas adicionales
const PaletasColor = lazy(() => import('./pages/PaletasColor'));
const CombinadorFuentes = lazy(() => import('./pages/CombinadorFuentes'));
const PlantillasPractica = lazy(() => import('./pages/PlantillasPractica'));
const ConversorTexto = lazy(() => import('./pages/ConversorTexto'));
const LetrasAzules = lazy(() => import('./pages/LetrasAzules'));
const LetrasFreeFire = lazy(() => import('./pages/LetrasFreeFire'));
const LetrasTikTok = lazy(() => import('./pages/LetrasTikTok'));
const ConversorLetrasBonitas = lazy(() => import('./pages/ConversorLetrasBonitas'));
const GeneradorNombresInstagram = lazy(() => import('./pages/GeneradorNombresInstagram'));
const GeneradorNombresFreeFire = lazy(() => import('./pages/GeneradorNombresFreeFire'));
const CreadorLettering = lazy(() => import('./pages/CreadorLettering'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh] w-full">
    <div className="w-8 h-8 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="editor" element={<Editor />} />
            <Route path="plantillas" element={<Plantillas />} />
            
            <Route path="herramientas/paletas-de-color" element={<PaletasColor />} />
            <Route path="herramientas/combinador-de-fuentes" element={<CombinadorFuentes />} />
            <Route path="herramientas/plantillas-practica" element={<PlantillasPractica />} />
            <Route path="herramientas/conversor-texto" element={<ConversorTexto />} />
            <Route path="herramientas/letras-azules" element={<LetrasAzules />} />
            <Route path="herramientas/letras-free-fire" element={<LetrasFreeFire />} />
            <Route path="herramientas/letras-tiktok" element={<LetrasTikTok />} />
            <Route path="herramientas/conversor-letras-bonitas" element={<ConversorLetrasBonitas />} />
            <Route path="herramientas/generador-de-nombres-para-instagram" element={<GeneradorNombresInstagram />} />
            <Route path="herramientas/generador-de-nombres-para-free-fire" element={<GeneradorNombresFreeFire />} />
            <Route path="herramientas/creador-de-lettering" element={<CreadorLettering />} />
            <Route path="creador-de-lettering" element={<CreadorLettering />} />
            <Route path="generador-de-nombres-para-instagram" element={<GeneradorNombresInstagram />} />
            <Route path="generador-de-nombres-para-free-fire" element={<GeneradorNombresFreeFire />} />

            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="sobre-nosotros" element={<SobreNosotros />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="politica-de-privacidad" element={<Privacidad />} />
            <Route path="terminos-y-condiciones" element={<Terminos />} />
            
            {/* SEO Landing Pages */}
            <Route path="generador-de-letras-goticas" element={<SeoPage />} />
            <Route path="generador-de-letras-cursivas" element={<SeoPage />} />
            <Route path="letras-para-instagram" element={<SeoPage />} />
            <Route path="letras-para-tatuajes" element={<SeoPage />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
