import { useState, useEffect, RefObject } from 'react';

interface InViewOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

export function useInView(
  ref: RefObject<HTMLElement | null> ,
  options: InViewOptions = {}
): boolean {
  const [isInView, setIsInView] = useState(false);
  const { threshold = 0.1, triggerOnce = true, rootMargin = '0px' } = options;

  useEffect(() => {
    if (!ref) return;
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce && observer && element) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, threshold, triggerOnce, rootMargin]);

  return isInView;
} 