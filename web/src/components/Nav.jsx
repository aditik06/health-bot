import { useEffect, useState } from 'react';

// Overlays the dark hero transparently with light text at the very top,
// then swaps to a frosted light bar with dark text almost as soon as
// scrolling starts. The switch used to wait for the full hero height to
// scroll past, but the hero's own content is vertically centered rather
// than pinned to its bottom edge - so the tail of the hero (the CTA
// buttons) would scroll up into the nav's band while the nav was still
// transparent, showing hero content bleeding through behind the nav text.
// A near-immediate switch closes that window entirely.
const SCROLL_THRESHOLD = 24;

export default function Nav({ loginHref, registerHref }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`nav ${scrolled ? 'nav-scrolled' : 'nav-on-dark'}`}>
            <div className="nav-inner">
                <a className="nav-brand" href="#top">
                    <span className="nav-brand-mark">🌸</span>
                    <span>Bloom</span>
                </a>

                <div className="nav-actions">
                    <a className="nav-login" href={loginHref}>Log in</a>
                    <a className="btn btn-primary nav-cta" href={registerHref}>Get started</a>
                </div>
            </div>
        </header>
    );
}
