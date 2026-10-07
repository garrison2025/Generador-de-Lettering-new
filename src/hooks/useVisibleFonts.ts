import { useEffect, useRef } from 'react';
import { queueFonts } from '@/lib/fonts';

export function useVisibleFonts<T extends HTMLElement = HTMLDivElement>(
  fontFamilies: readonly string[],
  rootMargin = '320px 0px'
) {
  const targetRef = useRef<T>(null);
  const familyKey = [...new Set(fontFamilies)]
    .filter((family) => family !== 'system-ui')
    .join('\u0000');

  useEffect(() => {
    const node = targetRef.current;
    if (!node || !familyKey) return;

    const families = familyKey.split('\u0000');

    const load = () => {
      queueFonts(families);
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
  }, [familyKey, rootMargin]);

  return targetRef;
}
