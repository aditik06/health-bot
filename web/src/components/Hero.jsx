import { HERO } from '../content.js';

export default function Hero({ loginHref, registerHref }) {
    return (
        <section className="hero" id="top">
            <div className="hero-glow" aria-hidden="true" />
            <div className="hero-copy">
                <p className="hero-eyebrow">{HERO.eyebrow}</p>
                <h1>{HERO.headline}</h1>
                <p className="hero-sub">{HERO.sub}</p>

                <div className="hero-actions">
                    <a className="btn btn-primary btn-lg" href={registerHref}>
                        Get started - it's free
                    </a>
                    <a className="btn btn-ghost-dark btn-lg" href={loginHref}>
                        I already have an account
                    </a>
                </div>
            </div>

            <a className="hero-scroll-cue" href="#cycle" aria-label="Scroll to learn more">
                <span />
            </a>
        </section>
    );
}
