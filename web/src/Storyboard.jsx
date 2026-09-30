import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

// ---------------------------------------------------------------------
// PROTOTYPE ONLY. Proves out the scroll-driven "fly through the body"
// mechanic with placeholder hand-coded SVG art, not final illustration.
// Not linked from anywhere, not part of the production build - reached
// only via `npm run dev` -> /prototype.html.
// ---------------------------------------------------------------------

// A "spirit guide" figure built from Bloom's own palette (gradient fills,
// no attempt at a naturalistic skin tone) rather than a literal portrait -
// sidesteps needing real illustration to test whether the scroll mechanic
// itself is fun, and reads as a deliberate style rather than a rough draft.
function Character({ style }) {
    return (
        <motion.svg
            viewBox="0 0 220 300"
            width="220"
            height="300"
            style={style}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffd9c2" />
                    <stop offset="100%" stopColor="#ff9fc3" />
                </linearGradient>
                <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ff4fa0" />
                    <stop offset="100%" stopColor="#c9b6f2" />
                </linearGradient>
                <linearGradient id="gownGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff4fa0" />
                    <stop offset="100%" stopColor="#ffb37a" />
                </linearGradient>
            </defs>

            {/* trailing wisp instead of legs - reads as motion/flight rather
                than a static standing figure */}
            <path
                d="M100 190 C 70 230, 60 260, 30 290 C 80 275, 110 250, 118 215 Z"
                fill="url(#gownGrad)"
                opacity="0.55"
            />
            <path
                d="M120 190 C 150 225, 165 255, 195 280 C 145 270, 115 245, 104 212 Z"
                fill="url(#gownGrad)"
                opacity="0.4"
            />

            {/* flowing hair behind */}
            <path
                d="M60 70 C 20 90, 10 150, 35 195 C 45 160, 50 130, 70 100 Z"
                fill="url(#hairGrad)"
                opacity="0.85"
            />
            <path
                d="M160 70 C 200 95, 205 150, 182 190 C 172 155, 168 125, 150 100 Z"
                fill="url(#hairGrad)"
                opacity="0.85"
            />

            {/* body / gown */}
            <path
                d="M78 120 C 78 100, 142 100, 142 120 L 150 210 C 120 225, 100 225, 70 210 Z"
                fill="url(#gownGrad)"
            />

            {/* arms, reaching back as if in flight */}
            <path d="M80 130 C 45 140, 25 120, 15 95" stroke="url(#hairGrad)" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.9" />
            <path d="M140 130 C 175 140, 195 118, 203 92" stroke="url(#hairGrad)" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.9" />

            {/* head */}
            <circle cx="110" cy="75" r="40" fill="url(#skinGrad)" />
            <path d="M72 70 C 68 40, 150 40, 148 70 C 148 55, 72 55, 72 70 Z" fill="url(#hairGrad)" />
            <circle cx="96" cy="78" r="3.5" fill="#3a1030" />
            <circle cx="124" cy="78" r="3.5" fill="#3a1030" />
            <path d="M98 94 Q110 102 122 94" stroke="#3a1030" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* a couple of trailing petals for the "bloom" motif */}
            <circle cx="20" cy="220" r="5" fill="#ff4fa0" opacity="0.7" />
            <circle cx="200" cy="230" r="4" fill="#c9b6f2" opacity="0.7" />
            <circle cx="15" cy="260" r="3" fill="#ffb37a" opacity="0.6" />
        </motion.svg>
    );
}

// A soft, deliberately non-clinical rendering of the reproductive system -
// tasteful linework and brand gradients rather than a textbook diagram.
function AnatomyIllustration({ style }) {
    return (
        <motion.svg
            viewBox="0 0 400 420"
            width="400"
            height="420"
            style={style}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="uterusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff9fc3" />
                    <stop offset="100%" stopColor="#c9b6f2" />
                </linearGradient>
                <linearGradient id="ovaryGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffb37a" />
                    <stop offset="100%" stopColor="#ff4fa0" />
                </linearGradient>
            </defs>

            {/* soft body outline, just enough to read as "inside a torso" */}
            <path
                d="M70 20 C 30 120, 20 260, 60 400 L 340 400 C 380 260, 370 120, 330 20"
                fill="none"
                stroke="rgba(244,238,247,0.18)"
                strokeWidth="2"
            />

            {/* fallopian tubes */}
            <path d="M140 150 C 90 130, 60 150, 55 190" stroke="url(#ovaryGrad)" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M260 150 C 310 130, 340 150, 345 190" stroke="url(#ovaryGrad)" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85" />

            {/* ovaries */}
            <ellipse cx="50" cy="200" rx="20" ry="16" fill="url(#ovaryGrad)" />
            <ellipse cx="350" cy="200" rx="20" ry="16" fill="url(#ovaryGrad)" />

            {/* uterus */}
            <path
                d="M200 130 C 140 130, 130 190, 150 230 C 165 270, 235 270, 250 230 C 270 190, 260 130, 200 130 Z"
                fill="url(#uterusGrad)"
            />
            <path d="M200 260 L 200 320" stroke="url(#uterusGrad)" strokeWidth="14" strokeLinecap="round" />
        </motion.svg>
    );
}

const BEATS = [
    {
        eyebrow: 'Bloom',
        headline: 'Know your body.',
        body: "Every cycle tells a story. Let's go find yours."
    },
    {
        eyebrow: 'Cycle tracking',
        headline: 'This is where it begins.',
        body: 'Your ovaries release an egg roughly once a month - the whole cycle starts here.'
    },
    {
        eyebrow: 'Cycle tracking',
        headline: 'Your cycle, mapped.',
        body: 'Log a period and Bloom learns your real rhythm - not a textbook 28-day guess.'
    }
];

export default function Storyboard() {
    const trackRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });

    // Character path: drifts in from the left, rises and grows as she
    // "flies" toward the viewer, then settles beside the anatomy diagram.
    // Y never rises above 42% so she stays clear of the text band (top
    // ~10%-32%, see .storyboard-beat) regardless of her X position.
    const charX = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], ['-10%', '50%', '32%', '30%']);
    const charY = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], ['78%', '65%', '68%', '68%']);
    const charScale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.55, 0.85, 0.55, 0.5]);
    const charRotate = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [-6, 8, -3, 0]);

    // The anatomy illustration fades and scales in as she "arrives inside",
    // anchored low enough to clear the text band too.
    const bodyOpacity = useTransform(scrollYProgress, [0.42, 0.6], [0, 1]);
    const bodyScale = useTransform(scrollYProgress, [0.42, 1], [0.5, 0.8]);

    // Background glow intensifies through the zoom-in beat.
    const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.6, 1.3]);
    const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 0.9, 0.7]);

    const beat1 = useTransform(scrollYProgress, [0, 0.12, 0.28], [1, 1, 0]);
    const beat2 = useTransform(scrollYProgress, [0.28, 0.4, 0.55, 0.65], [0, 1, 1, 0]);
    const beat3 = useTransform(scrollYProgress, [0.68, 0.8], [0, 1]);

    return (
        <div className="storyboard-track" ref={trackRef}>
            <div className="storyboard-stage">
                <motion.div className="storyboard-glow" style={{ scale: glowScale, opacity: glowOpacity }} />

                <AnatomyIllustration style={{ position: 'absolute', left: '50%', top: '68%', x: '-50%', y: '-50%', opacity: bodyOpacity, scale: bodyScale }} />

                <Character style={{ position: 'absolute', left: charX, top: charY, x: '-50%', y: '-50%', scale: charScale, rotate: charRotate }} />

                <motion.div className="storyboard-beat" style={{ opacity: beat1 }}>
                    <p className="storyboard-eyebrow">{BEATS[0].eyebrow}</p>
                    <h1>{BEATS[0].headline}</h1>
                    <p className="storyboard-body">{BEATS[0].body}</p>
                </motion.div>

                <motion.div className="storyboard-beat storyboard-beat-right" style={{ opacity: beat2 }}>
                    <p className="storyboard-eyebrow">{BEATS[1].eyebrow}</p>
                    <h2>{BEATS[1].headline}</h2>
                    <p className="storyboard-body">{BEATS[1].body}</p>
                </motion.div>

                <motion.div className="storyboard-beat storyboard-beat-right" style={{ opacity: beat3 }}>
                    <p className="storyboard-eyebrow">{BEATS[2].eyebrow}</p>
                    <h2>{BEATS[2].headline}</h2>
                    <p className="storyboard-body">{BEATS[2].body}</p>
                </motion.div>

                <div className="storyboard-hint">Scroll to fly in</div>
            </div>
        </div>
    );
}
