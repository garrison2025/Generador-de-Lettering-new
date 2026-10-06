import { useEffect } from 'react';

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

const LIVE_HEAD_SELECTOR = '[data-seo-live="true"]';

function appendMeta(attribute: 'name' | 'property', key: string, content: string) {
  const meta = document.createElement('meta');
  meta.setAttribute(attribute, key);
  meta.content = content;
  meta.dataset.seoLive = 'true';
  document.head.appendChild(meta);
}

function appendCanonical(href: string) {
  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = href;
  link.dataset.seoLive = 'true';
  document.head.appendChild(link);
}

function appendSchema(schema: Record<string, any>) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.seoLive = 'true';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
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
  const absoluteImage = image.startsWith('http')
    ? image
    : `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`;
  const openGraphType = type === 'article' ? 'article' : 'website';
  const imagePath = absoluteImage.split(/[?#]/, 1)[0].toLowerCase();
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
  const schemaJson = JSON.stringify(schemasToRender);

  useEffect(() => {
    // Remove crawlable static-shell metadata and metadata from the previous SPA route.
    document.head.querySelectorAll('[data-rh="true"]').forEach((node) => node.remove());
    document.head.querySelectorAll(LIVE_HEAD_SELECTOR).forEach((node) => node.remove());

    document.title = title;

    appendMeta('name', 'description', description);
    if (keywords) appendMeta('name', 'keywords', keywords);
    appendMeta(
      'name',
      'robots',
      noindex
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    appendCanonical(currentUrl);

    appendMeta('property', 'og:type', openGraphType);
    appendMeta('property', 'og:site_name', 'Generador de Lettering');
    appendMeta('property', 'og:locale', 'es_ES');
    appendMeta('property', 'og:url', currentUrl);
    appendMeta('property', 'og:title', title);
    appendMeta('property', 'og:description', description);
    appendMeta('property', 'og:image', absoluteImage);
    appendMeta('property', 'og:image:width', '1200');
    appendMeta('property', 'og:image:height', '630');
    if (imageMimeType) appendMeta('property', 'og:image:type', imageMimeType);

    if (openGraphType === 'article' && publishedTime) {
      appendMeta('property', 'article:published_time', publishedTime);
    }
    if (openGraphType === 'article' && modifiedTime) {
      appendMeta('property', 'article:modified_time', modifiedTime);
    }

    appendMeta('name', 'twitter:card', 'summary_large_image');
    appendMeta('name', 'twitter:url', currentUrl);
    appendMeta('name', 'twitter:title', title);
    appendMeta('name', 'twitter:description', description);
    appendMeta('name', 'twitter:image', absoluteImage);

    for (const schema of schemasToRender) {
      appendSchema(schema);
    }
  }, [
    title,
    description,
    currentUrl,
    keywords,
    openGraphType,
    absoluteImage,
    imageMimeType,
    publishedTime,
    modifiedTime,
    noindex,
    schemaJson
  ]);

  return null;
}
