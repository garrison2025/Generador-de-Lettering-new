import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { BLOG_POSTS } from '../data/blogPosts';
import { ORGANIZATION_ID, WEBSITE_ID } from '../seo/siteEntities';

const blogCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://generadordelettering.org/blog#collection",
  "name": "Blog de Lettering y Tipografía",
  "url": "https://generadordelettering.org/blog",
  "isPartOf": { "@id": WEBSITE_ID },
  "publisher": { "@id": ORGANIZATION_ID },
  "description": "Guías y recursos sobre lettering, tipografía, Unicode, redes sociales y nombres para videojuegos.",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": BLOG_POSTS.map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": post.title,
      "url": `https://generadordelettering.org/blog/${post.slug}`
    }))
  }
};

const BLOG_DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

function formatBlogDate(date: string) {
  return BLOG_DATE_FORMATTER.format(new Date(`${date}T00:00:00Z`));
}

const blogBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://generadordelettering.org/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://generadordelettering.org/blog" }
  ]
};

export default function Blog() {
  return (
    <>
      <SEO 
        title="Guías de Lettering, Tipografía y Letras | Blog"
        description="Guías prácticas sobre lettering, tipografía, letras Unicode, nombres para juegos y textos aesthetic para redes sociales. Tutoriales claros y herramientas relacionadas."
        keywords="blog de lettering, tutoriales de tipografía, guias lettering online, diseño de letras"
        canonical="https://generadordelettering.org/blog"
        jsonSchema={[blogCollectionSchema, blogBreadcrumbSchema]}
      />
    <div className="max-w-5xl mx-auto py-16 px-4 w-full flex-1">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
        <Link to="/" className="hover:text-[#5A4AD2] transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-gray-900">Blog</span>
      </nav>

      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Guías de Lettering, Tipografía y Letras</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">Tutoriales prácticos sobre lettering digital, Unicode, nombres para juegos y textos para redes sociales, con acceso directo a las herramientas relacionadas.</p>
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
            <p className="text-sm text-gray-500 font-medium mb-4">
              {post.updated && post.updated !== post.date
                ? <>Actualizado {formatBlogDate(post.updated)}</>
                : <>Publicado {formatBlogDate(post.date)}</>}
            </p>
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
