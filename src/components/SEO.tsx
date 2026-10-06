import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  type?: 'website' | 'article' | 'webapp';
  jsonSchema?: Record<string, any> | Record<string, any>[];
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
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
  publishedTime,
  modifiedTime,
  noindex = false
}: SEOProps) {
  const siteUrl = 'https://generadordelettering.org';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const currentUrl = canonical || `${siteUrl}${pathname}`;
  const openGraphType = type === 'article' ? 'article' : 'website';
  const imagePath = image.split(/[?#]/, 1)[0].toLowerCase();
  const imageMimeType =
    imagePath.endsWith('.png') ? 'image/png' :
    imagePath.endsWith('.webp') ? 'image/webp' :
    imagePath.endsWith('.gif') ? 'image/gif' :
    imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg') ? 'image/jpeg' :
    null;

  const schemasToRender = Array.isArray(jsonSchema) 
    ? jsonSchema 
    : jsonSchema 
      ? [jsonSchema] 
      : [];

  useEffect(() => {
    // Static route shells provide crawlable metadata before React loads.
    // Once Helmet has mounted its live metadata, remove only those static
    // shell tags so the hydrated document contains a single canonical set.
    document.head
      .querySelectorAll('[data-rh="true"]')
      .forEach((node) => node.remove());
  }, [title, description, canonical, keywords, type, image, publishedTime, modifiedTime, noindex]);

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
      <meta property="og:type" content={openGraphType} />
      <meta property="og:site_name" content="Generador de Lettering" />
      <meta property="og:locale" content="es_ES" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {imageMimeType && <meta property="og:image:type" content={imageMimeType} />}
      {openGraphType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {openGraphType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

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

