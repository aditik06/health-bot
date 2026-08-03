import { useEffect, useState } from 'react';

export default function Nav({ loginHref, registerHref }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Solid background once the hero scrolls behind the bar, so nav text stays
    // legible against page content.
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const links = [
        { href: '#features', label: 'Features' },
        { href: '#how-it-works', label: 'How it works' },
        { href: '#faq', label: 'FAQ' }
    ];

    return (
        <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
            <div className="nav-inner">
                <a className="nav-brand" href="#top">
                    <span className="nav-brand-mark">🌸</span>
                    <span>Bloom</span>
                </a>

                <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main">
                    {links.map(l => (
                        <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
                            {l.label}
                        </a>
                    ))}
                    <a className="nav-login" href={loginHref}>Log in</a>
                    <a className="btn btn-primary nav-cta" href={registerHref}>Get started</a>
                </nav>

                <button
                    className="nav-toggle"
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(o => !o)}
                >
                    {menuOpen ? '×' : '☰'}
                </button>
            </div>
        </header>
    );
}
