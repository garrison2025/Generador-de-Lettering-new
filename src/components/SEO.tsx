import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  type?: 'website' | 'article' | 'webapp';
  jsonSchema?: Record<string, any> | Record<string, any>[];
  image?: string;
  noindex?: boolean;
}

export function SEO({ 
  title, 
  description, 
  canonical, 
  keywords, 
  type = 'website', 
  jsonSchema, 
  image = 'https://generadordelettering.org/og-image.jpg',
  noindex = false
}: SEOProps) {
  const currentUrl = canonical || (
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://generadordelettering.org'
  );

  const schemasToRender = Array.isArray(jsonSchema) 
    ? jsonSchema 
    : jsonSchema 
      ? [jsonSchema] 
      : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta
        name="robots"
        content={noindex
          ? 'noindex, follow'
          : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Generador de Lettering" />
      <meta property="og:locale" content="es_ES" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {schemasToRender.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

