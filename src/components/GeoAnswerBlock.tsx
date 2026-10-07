import type { ReactNode } from 'react';

interface GeoAnswerFact {
  label: string;
  value: ReactNode;
}

interface GeoAnswerSource {
  label: string;
  href: string;
}

interface GeoAnswerBlockProps {
  id: string;
  answer: ReactNode;
  facts?: GeoAnswerFact[];
  limitation?: ReactNode;
  source?: GeoAnswerSource;
}

export function GeoAnswerBlock({
  id,
  answer,
  facts = [],
  limitation,
  source,
}: GeoAnswerBlockProps) {
  const headingId = `${id}-answer-title`;

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 md:p-6 text-left"
    >
      <h2 id={headingId} className="text-base md:text-lg font-black text-gray-900">
        Respuesta rápida
      </h2>
      <p className="mt-2 text-sm md:text-base leading-relaxed text-gray-700">
        {answer}
      </p>

      {facts.length > 0 && (
        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-xl border border-white/80 bg-white/80 p-3">
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-500">{fact.label}</dt>
              <dd className="mt-1 text-sm font-medium leading-relaxed text-gray-800">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {limitation && (
        <p className="mt-4 text-xs md:text-sm leading-relaxed text-gray-600">
          <strong className="text-gray-800">Límite:</strong> {limitation}
        </p>
      )}

      {source && (
        <p className="mt-3 text-xs text-gray-500">
          Fuente técnica:{' '}
          <a
            href={source.href}
            className="font-semibold text-[#4F46E5] hover:underline"
          >
            {source.label}
          </a>
        </p>
      )}
    </section>
  );
}
