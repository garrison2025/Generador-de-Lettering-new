import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { BLOG_POSTS } from '../data/blogPosts';

export default function Blog() {
  return (
    <>
      <SEO 
        title="Blog de Lettering y Tipografía | Guías, Tutoriales y Novedades"
        description="Lee nuestras guías sobre cómo aprender lettering digital, elegir fuentes para tatuajes y personalizar textos aesthetic en redes sociales."
        keywords="blog de lettering, tutoriales de tipografía, guias lettering online, diseño de letras"
      />
    <div className="max-w-5xl mx-auto py-16 px-4 w-full flex-1">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Aprende y Descubre</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">Tutoriales, ideas y recursos para dominar el arte de las letras, la tipografía y el diseño digital.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post, idx) => (
          <article key={post.slug} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
            <span className={`text-xs font-bold tracking-wider uppercase mb-3 ${idx % 3 === 0 ? 'text-[#FF6B6B]' : idx % 3 === 1 ? 'text-[#34D399]' : 'text-[#FBBF24]'}`}>
              {idx % 3 === 0 ? 'Tutoriales' : idx % 3 === 1 ? 'Gaming' : 'Trucos'}
            </span>
            <h2 className="text-2xl font-bold mb-4 leading-tight text-gray-900 hover:text-[#5A4AD2] transition-colors">
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="text-sm text-gray-500 font-medium mb-4">{new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-gray-600 mb-8 flex-1 leading-relaxed">{post.excerpt}</p>
            <Link to={`/blog/${post.slug}`} aria-label={`Leer artículo completo sobre ${post.title}`} className="text-[#5A4AD2] font-bold text-sm hover:underline flex items-center group">
              Leer artículo completo 
              <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all">&rarr;</span>
            </Link>
          </article>
        ))}
      </div>
    </div>
    </>
  );
}
