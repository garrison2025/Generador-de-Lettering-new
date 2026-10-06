import { StrictMode, Suspense } from 'react';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { Route, Routes, StaticRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Plantillas from './pages/Plantillas';
import Herramientas from './pages/Herramientas';
import PaletasColor from './pages/PaletasColor';
import CombinadorFuentes from './pages/CombinadorFuentes';
import PlantillasPractica from './pages/PlantillasPractica';
import ConversorTexto from './pages/ConversorTexto';
import LetrasAzules from './pages/LetrasAzules';
import LetrasFreeFire from './pages/LetrasFreeFire';
import LetrasTikTok from './pages/LetrasTikTok';
import ConversorLetrasBonitas from './pages/ConversorLetrasBonitas';
import GeneradorNombresInstagram from './pages/GeneradorNombresInstagram';
import GeneradorNombresFreeFire from './pages/GeneradorNombresFreeFire';
import CreadorLettering from './pages/CreadorLettering';

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <div className="w-8 h-8 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function PrerenderRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="editor" element={<Editor />} />
          <Route path="plantillas" element={<Plantillas />} />
          <Route path="herramientas" element={<Herramientas />} />
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
        </Route>
      </Routes>
    </Suspense>
  );
}

export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    output.setEncoding('utf8');

    let html = '';
    let renderError: unknown = null;
    let settled = false;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const finish = (error?: unknown) => {
      if (settled) return;
      settled = true;
      if (timeout) clearTimeout(timeout);

      if (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
        return;
      }

      if (renderError) {
        reject(renderError instanceof Error ? renderError : new Error(String(renderError)));
        return;
      }

      resolve(html);
    };

    output.on('data', (chunk: string) => {
      html += chunk;
    });
    output.on('end', () => finish());
    output.on('error', (error) => finish(error));

    const { pipe, abort } = renderToPipeableStream(
      <StrictMode>
        <StaticRouter location={url}>
          <PrerenderRoutes />
        </StaticRouter>
      </StrictMode>,
      {
        onAllReady() {
          pipe(output);
        },
        onShellError(error) {
          finish(error);
        },
        onError(error) {
          renderError ??= error;
        },
      }
    );

    timeout = setTimeout(() => {
      abort();
      finish(new Error(`SSR prerender timed out for ${url}`));
    }, 15000);
  });
}
