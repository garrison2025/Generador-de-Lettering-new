import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, Calendar } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';
import { SEO } from '../components/SEO';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <SEO 
        title={`${post.title} | LetrasPro Blog`}
        description={post.excerpt}
        keywords={post.keywords}
        type="article"
        image={post.image}
        jsonSchema={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://letraspro.com/blog/${post.slug}`
            },
            "headline": post.title,
            "description": post.excerpt,
            "image": post.image ? [post.image] : [],
            "datePublished": post.date,
            "dateModified": post.date,
            "author": {
              "@type": "Organization",
              "name": "LetrasPro",
              "url": "https://letraspro.com/"
            },
            "publisher": {
              "@type": "Organization",
              "name": "LetrasPro",
              "logo": {
                "@type": "ImageObject",
                "url": "https://letraspro.com/og-image.jpg"
              }
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://letraspro.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://letraspro.com/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://letraspro.com/blog/${post.slug}`
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
            <div className="flex items-center justify-center text-sm text-gray-500 font-medium">
              <Calendar className="w-4 h-4 mr-2" />
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </div>
          </header>

          <div className="prose prose-lg prose-indigo max-w-none text-gray-700 leading-relaxed 
            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:font-black prose-h1:mb-8
            prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:font-extrabold prose-h2:tracking-tight
            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
            prose-p:mb-6 prose-p:leading-8 prose-p:text-[1.1rem]
            prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-indigo-800
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6 prose-li:mb-2
            prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-6
            prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-800 prose-blockquote:italic prose-blockquote:my-8
            prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-900 prose-pre:text-gray-50 prose-pre:rounded-xl">
            <Markdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </Markdown>
          </div>
        </article>

        <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Te gustó el artículo? Empieza a crear ahora mismo:</h3>
          <p className="text-gray-600 mb-8 font-medium">Usa nuestras herramientas gratuitas para hacer tus letras únicas</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/herramientas/conversor-letras-bonitas"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#4F46E5] text-white font-bold rounded-xl hover:bg-[#4338CA] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Conversor de Letras Bonitas
            </Link>
            <Link 
              to="/herramientas/letras-free-fire"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Generador para Free Fire
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
