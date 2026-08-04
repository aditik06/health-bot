import { useEffect, useState } from 'react';

// Overlays the dark hero transparently with light text, then swaps to a
// frosted light bar with dark text once the hero has scrolled past - the
// same trick Apple's product-page nav uses.
export default function Nav({ loginHref, registerHref }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const threshold = () => Math.max(window.innerHeight - 96, 240);
        const onScroll = () => setScrolled(window.scrollY > threshold());
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
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
