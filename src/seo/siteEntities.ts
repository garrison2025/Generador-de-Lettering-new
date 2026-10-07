export const SITE_URL = 'https://generadordelettering.org';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const SITE_IDENTITY_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      "name": "Generador de Lettering",
      "url": `${SITE_URL}/`,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/pwa-512x512.png`
      },
      "email": "mailto:contacto@generadordelettering.org"
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      "name": "Generador de Lettering",
      "url": `${SITE_URL}/`,
      "inLanguage": "es",
      "publisher": {
        "@id": ORGANIZATION_ID
      }
    }
  ]
} as const;

export function enrichRouteSchema(schema: Record<string, any>) {
  if (schema?.["@type"] !== "WebApplication") return schema;

  return {
    ...schema,
    provider: schema.provider ?? { "@id": ORGANIZATION_ID },
    isPartOf: schema.isPartOf ?? { "@id": WEBSITE_ID }
  };
}
