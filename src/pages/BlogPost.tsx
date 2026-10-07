import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, Calendar, List, ExternalLink, BookOpenCheck } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';
import UnicodeInspector from '../components/UnicodeInspector';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';
import { ORGANIZATION_ID, WEBSITE_ID } from '../seo/siteEntities';

const POST_DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

function formatPostDate(date: string) {
  return POST_DATE_FORMATTER.format(new Date(`${date}T00:00:00Z`));
}

function slugifyHeading(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function extractTableOfContents(content: string) {
  return content
    .split('\n')
    .map((line) => line.match(/^(##|###)\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => {
      const label = match[2].replace(/[*_`]/g, '').trim();
      return { level: match[1].length, label, id: slugifyHeading(label) };
    });
}

const BLOG_CTA: Record<string, [string, string][]> = {
  'mejores-nombres-insanos-free-fire': [
    ['Generador de Nombres Free Fire', '/herramientas/generador-de-nombres-para-free-fire'],
    ['Letras para Free Fire', '/herramientas/letras-free-fire'],
  ],
  'biografia-tiktok-aesthetic-dark': [
    ['Letras para TikTok', '/herramientas/letras-tiktok'],
    ['Conversor de Letras Bonitas', '/herramientas/conversor-letras-bonitas'],
  ],
  'letras-invisibles-espacios-guia-redes-sociales': [
    ['Conversor de Letras Online', '/herramientas/conversor-texto'],
    ['Generador de Nombres Free Fire', '/herramientas/generador-de-nombres-para-free-fire'],
  ],
  'diferencias-lettering-caligrafia-tipografia': [
    ['Creador de Lettering', '/herramientas/creador-de-lettering'],
    ['Plantillas de Práctica', '/herramientas/plantillas-practica'],
  ],
  'fuentes-aesthetic-para-copiar-y-pegar-instagram': [
    ['Conversor de Letras Bonitas', '/herramientas/conversor-letras-bonitas'],
    ['Generador de Nombres para Instagram', '/herramientas/generador-de-nombres-para-instagram'],
  ],
  'como-comprobar-letras-unicode-copiar-pegar': [
    ['Conversor de Letras', '/herramientas/conversor-texto'],
    ['Conversor de Letras Bonitas', '/herramientas/conversor-letras-bonitas'],
  ],
  'lettering-digital-tres-estilos-paso-a-paso': [
    ['Creador de Lettering', '/herramientas/creador-de-lettering'],
    ['Combinador de Fuentes', '/herramientas/combinador-de-fuentes'],
  ],
  'plan-practica-lettering-siete-dias': [
    ['Descargar hojas de práctica', '/herramientas/plantillas-practica'],
    ['Editor de Lettering', '/editor'],
  ],
};
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  const tableOfContents = extractTableOfContents(post.content);
  const ctaLinks = BLOG_CTA[post.slug] || [
    ['Conversor de Letras Bonitas', '/herramientas/conversor-letras-bonitas'],
    ['Creador de Lettering', '/herramientas/creador-de-lettering'],
  ];

  return (
    <>
      <SEO 
        title={post.seoTitle || post.title}
        description={post.excerpt}
        keywords={post.keywords}
        canonical={`https://generadordelettering.org/blog/${post.slug}`}
        type="article"
        image={post.image}
        publishedTime={post.date}
        modifiedTime={post.updated || post.date}
        jsonSchema={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://generadordelettering.org/blog/${post.slug}`
            },
            "headline": post.title,
            "description": post.excerpt,
            "image": post.image ? [post.image] : [],
            "isPartOf": {
              "@id": WEBSITE_ID
            },
            "datePublished": post.date,
            "dateModified": post.updated || post.date,
            "author": {
              "@id": ORGANIZATION_ID
            },
            "publisher": {
              "@id": ORGANIZATION_ID
            },
            ...(post.sources?.length
              ? { "citation": post.sources.map((source) => source.url) }
              : {})
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://generadordelettering.org/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://generadordelettering.org/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://generadordelettering.org/blog/${post.slug}`
              }
            ]
          }
        ]}
      />
      
      <div className="max-w-3xl mx-auto px-4 py-12 w-full flex-1">
        <Link to="/blog" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-pink-600 mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Volver al Blog
        </Link>
        
        <article className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <header className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-gray-500 font-medium">
              <span className="inline-flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Publicado <time className="ml-1" dateTime={post.date}>{formatPostDate(post.date)}</time>
              </span>
              {post.updated && post.updated !== post.date && (
                <span>
                  · Actualizado <time dateTime={post.updated}>{formatPostDate(post.updated)}</time>
                </span>
              )}
            </div>
          </header>

          {tableOfContents.length >= 2 && (
            <nav
              aria-label="Tabla de contenidos del artículo"
              className="mb-10 rounded-2xl border border-gray-200 bg-gray-50/80 p-5 md:p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <List className="w-5 h-5 text-[#5A4AD2]" />
                <h2 className="font-bold text-gray-900 text-base">En este artículo</h2>
              </div>
              <ol className="space-y-2">
                {tableOfContents.map((item, index) => (
                  <li key={item.id + '-' + index} className={item.level === 3 ? 'ml-4' : ''}>
                    <a
                      href={'#' + item.id}
                      className="text-sm text-gray-600 hover:text-[#5A4AD2] hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="max-w-none text-gray-700 leading-relaxed
            [&_h1]:text-4xl [&_h1]:font-black [&_h1]:text-gray-900 [&_h1]:tracking-tight [&_h1]:mb-8
            [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:text-gray-900 [&_h2]:tracking-tight [&_h2]:mt-14 [&_h2]:mb-6
            [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:tracking-tight [&_h3]:mt-10 [&_h3]:mb-4
            [&_p]:mb-6 [&_p]:leading-8 [&_p]:text-[1.1rem]
            [&_a]:text-indigo-600 [&_a]:no-underline hover:[&_a]:underline hover:[&_a]:text-indigo-800
            [&_strong]:text-gray-900 [&_strong]:font-bold
            [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6
            [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6
            [&_li]:mb-2 [&_li]:leading-7
            [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:bg-indigo-50 [&_blockquote]:py-3 [&_blockquote]:px-6 [&_blockquote]:rounded-r-lg [&_blockquote]:text-gray-800 [&_blockquote]:italic [&_blockquote]:my-8
            [&_code]:text-indigo-600 [&_code]:bg-indigo-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md
            [&_pre]:bg-gray-900 [&_pre]:text-gray-50 [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:my-8
            [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0
            [&_table]:w-full [&_table]:border-collapse [&_table]:my-8
            [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:p-3 [&_th]:text-left [&_th]:font-bold [&_th]:text-gray-900
            [&_td]:border [&_td]:border-gray-200 [&_td]:p-3
            [&_img]:rounded-xl [&_img]:my-8">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children, ...props }) => {
                  const label = React.Children.toArray(children).join('');
                  return <h2 id={slugifyHeading(label)} {...props}>{children}</h2>;
                },
                h3: ({ children, ...props }) => {
                  const label = React.Children.toArray(children).join('');
                  return <h3 id={slugifyHeading(label)} {...props}>{children}</h3>;
                },
                table: ({ children, ...props }) => (
                  <div className="max-w-full overflow-x-auto overscroll-x-contain my-8 rounded-xl border border-gray-200">
                    <table className="min-w-[42rem] !my-0" {...props}>{children}</table>
                  </div>
                ),
              }}
            >
              {post.content}
            </Markdown>
          </div>

          {post.slug === 'como-comprobar-letras-unicode-copiar-pegar' && <UnicodeInspector />}

          {post.sources && post.sources.length > 0 && (
            <section
              aria-labelledby="blog-sources-title"
              className="mt-12 pt-8 border-t border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpenCheck className="w-5 h-5 text-[#5A4AD2]" />
                <h2 id="blog-sources-title" className="text-lg font-black text-gray-900">
                  Fuentes y referencias
                </h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Las fuentes siguientes respaldan los datos técnicos o de plataforma citados en este artículo. Las
                recomendaciones estéticas y los ejemplos siguen siendo criterios editoriales del sitio.
              </p>
              <ul className="space-y-3">
                {post.sources.map((source) => (
                  <li key={source.url} className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-[#4F46E5] hover:underline"
                    >
                      {source.label}
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                    {source.note && (
                      <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{source.note}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Editorial attribution */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-purple-50/50 p-6 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#5A4AD2] to-[#FF6B6B] flex items-center justify-center text-white font-black text-xl shrink-0 shadow-sm">
              GL
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A4AD2] bg-purple-100 px-2 py-0.5 rounded-full">Equipo Editorial</span>
              </div>
              <h4 className="font-bold text-gray-900 text-base">Generador de Lettering</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Contenido práctico sobre lettering, tipografía Unicode y personalización de texto, revisado junto con las herramientas disponibles en este sitio.
              </p>
              <Link to="/sobre-nosotros" className="inline-block mt-2 text-xs font-semibold text-[#5A4AD2] hover:underline">
                Cómo trabajamos y revisamos el contenido
              </Link>
            </div>
          </div>
        </article>

        <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Prueba estas herramientas relacionadas</h3>
          <p className="text-gray-600 mb-8 font-medium">Continúa con una herramienta directamente relacionada con el tema del artículo.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctaLinks.map(([label, path], index) => (
              <Link
                key={path}
                to={path}
                className={'inline-flex items-center justify-center px-8 py-4 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ' + (
                  index === 0 ? 'bg-[#4F46E5] hover:bg-[#4338CA]' : 'bg-gray-900 hover:bg-gray-800'
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <RelatedTools currentPath={`/blog/${post.slug}`} />
      </div>
    </>
  );
}
