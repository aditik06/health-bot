import { useEffect, useRef, useState } from 'react';

// Reveals an element the first time it scrolls into view. Apple-style pages
// lean on this heavily - each section animates in once, then stays put, so it
// never re-triggers and never fights the user scrolling back up.
export function useReveal({ threshold = 0.2, once = true } = {}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        // Respect a reduced-motion preference by showing everything immediately
        // rather than animating it in.
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced || typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (once) observer.unobserve(node);
                } else if (!once) {
                    setVisible(false);
                }
            },
            { threshold, rootMargin: '0px 0px -10% 0px' }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold, once]);

    return [ref, visible];
}
