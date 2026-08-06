import { InView } from '../motion-primitives/in-view.jsx';
import { MOCKS } from './MockVisuals.jsx';

const REVEAL_VARIANTS = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0 }
};

// One full-bleed capability, alternating text/visual sides down the page -
// the "here's what it actually does" walkthrough between the hero and the
// final sign-up moment.
export default function StorySection({ id, eyebrow, headline, body, visual, align }) {
    const Visual = MOCKS[visual];
    const imageFirst = align === 'right'; // visual on the left when text sits on the right

    return (
        <InView
            once
            variants={REVEAL_VARIANTS}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewOptions={{ amount: 0.2, margin: '0px 0px -10% 0px' }}
        >
            <section id={id} className={`story ${imageFirst ? 'story-reverse' : ''}`}>
                <div className="story-copy">
                    <p className="story-eyebrow">{eyebrow}</p>
                    <h2>{headline}</h2>
                    <p className="story-body">{body}</p>
                </div>
                <div className="story-visual" aria-hidden="true">
                    {Visual ? <Visual /> : null}
                </div>
            </section>
        </InView>
    );
}
