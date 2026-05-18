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
}

export function SEO({ title, description, canonical, keywords, type = 'website', jsonSchema, image = 'https://generadordelettering.org/og-image.jpg' }: SEOProps) {
  const currentUrl = canonical || window.location.href;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      
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

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonSchema && (
        <script type="application/ld+json">
          {JSON.stringify(jsonSchema)}
        </script>
      )}
    </Helmet>
  );
}
