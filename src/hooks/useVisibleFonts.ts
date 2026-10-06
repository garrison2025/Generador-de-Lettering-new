import { useEffect, useRef } from 'react';
import { loadFonts } from '@/lib/fonts';

export function useVisibleFonts<T extends HTMLElement = HTMLDivElement>(
  fontFamilies: readonly string[],
  rootMargin = '320px 0px'
) {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    const node = targetRef.current;
    if (!node) return;

    const families = [...new Set(fontFamilies)].filter((family) => family !== 'Inter');
    if (families.length === 0) return;

    const load = () => {
      void loadFonts(families);
    };

    if (typeof IntersectionObserver === 'undefined') {
      load();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        load();
        observer.disconnect();
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fontFamilies, rootMargin]);

  return targetRef;
}
