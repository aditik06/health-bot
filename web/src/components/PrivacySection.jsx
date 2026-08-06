import { InView } from '../motion-primitives/in-view.jsx';
import { PRIVACY } from '../content.js';

const REVEAL_VARIANTS = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0 }
};

// A full-bleed, text-only statement section - the same beat Apple uses for
// its privacy interstitials between feature walkthroughs.
export default function PrivacySection() {
    return (
        <InView
            once
            variants={REVEAL_VARIANTS}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewOptions={{ amount: 0.2, margin: '0px 0px -10% 0px' }}
        >
            <section id="privacy" className="privacy-band">
                <p className="story-eyebrow story-eyebrow-light">{PRIVACY.eyebrow}</p>
                <h2>{PRIVACY.headline}</h2>
                <p className="privacy-body">{PRIVACY.body}</p>
            </section>
        </InView>
    );
}
