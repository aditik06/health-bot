import { useReveal } from '../useReveal.js';
import { CTA } from '../content.js';

// The "buy" moment - one clear decision, nothing else competing for
// attention on the section.
export default function FinalCta({ loginHref, registerHref }) {
    const [ref, visible] = useReveal();

    return (
        <section id="start" ref={ref} className={`final-cta ${visible ? 'reveal-visible' : 'reveal'}`}>
            <h2>{CTA.headline}</h2>
            <p className="final-cta-sub">{CTA.sub}</p>
            <div className="hero-actions final-cta-actions">
                <a className="btn btn-primary btn-lg" href={registerHref}>Sign up free</a>
                <a className="btn btn-ghost btn-lg" href={loginHref}>Log in</a>
            </div>
        </section>
    );
}
