import { useReveal } from '../useReveal.js';
import { PRIVACY } from '../content.js';

// A full-bleed, text-only statement section - the same beat Apple uses for
// its privacy interstitials between feature walkthroughs.
export default function PrivacySection() {
    const [ref, visible] = useReveal();

    return (
        <section id="privacy" ref={ref} className={`privacy-band ${visible ? 'reveal-visible' : 'reveal'}`}>
            <p className="story-eyebrow story-eyebrow-light">{PRIVACY.eyebrow}</p>
            <h2>{PRIVACY.headline}</h2>
            <p className="privacy-body">{PRIVACY.body}</p>
        </section>
    );
}
