import { InView } from '../motion-primitives/in-view.jsx';
import { CTA } from '../content.js';

const REVEAL_VARIANTS = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0 }
};

// The "buy" moment - one clear decision, nothing else competing for
// attention on the section.
export default function FinalCta({ loginHref, registerHref }) {
    return (
        <InView
            once
            variants={REVEAL_VARIANTS}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewOptions={{ amount: 0.2, margin: '0px 0px -10% 0px' }}
        >
            <section id="start" className="final-cta">
                <h2>{CTA.headline}</h2>
                <p className="final-cta-sub">{CTA.sub}</p>
                <div className="hero-actions final-cta-actions">
                    <a className="btn btn-primary btn-lg" href={registerHref}>Sign up free</a>
                    <a className="btn btn-ghost btn-lg" href={loginHref}>Log in</a>
                </div>
            </section>
        </InView>
    );
}
