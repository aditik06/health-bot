import { useReveal } from '../useReveal.js';
import { MOCKS } from './MockVisuals.jsx';

// One full-bleed capability, alternating text/visual sides down the page -
// the "here's what it actually does" walkthrough between the hero and the
// final sign-up moment.
export default function StorySection({ id, eyebrow, headline, body, visual, align }) {
    const [ref, visible] = useReveal();
    const Visual = MOCKS[visual];
    const imageFirst = align === 'right'; // visual on the left when text sits on the right

    return (
        <section
            id={id}
            ref={ref}
            className={`story ${imageFirst ? 'story-reverse' : ''} ${visible ? 'reveal-visible' : 'reveal'}`}
        >
            <div className="story-copy">
                <p className="story-eyebrow">{eyebrow}</p>
                <h2>{headline}</h2>
                <p className="story-body">{body}</p>
            </div>
            <div className="story-visual" aria-hidden="true">
                {Visual ? <Visual /> : null}
            </div>
        </section>
    );
}
