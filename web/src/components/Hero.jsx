import { motion } from 'motion/react';
import { TextEffect } from '../motion-primitives/text-effect.jsx';
import { HERO } from '../content.js';

export default function Hero({ loginHref, registerHref }) {
    return (
        <section className="hero" id="top">
            <div className="bloom-orb orb-1" aria-hidden="true" />
            <div className="bloom-orb orb-2" aria-hidden="true" />
            <div className="bloom-orb orb-3" aria-hidden="true" />
            <div className="hero-grain" aria-hidden="true" />

            <div className="hero-copy">
                {/* rotate is baked into the animate props (not left to the CSS
                    class) because Motion's own inline transform would
                    otherwise overwrite the CSS transform: rotate(...) outright
                    rather than compose with it. */}
                <motion.span
                    className="hero-tag"
                    initial={{ opacity: 0, y: -8, rotate: -2.5 }}
                    animate={{ opacity: 1, y: 0, rotate: -2.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="hero-tag-dot" />
                    {HERO.eyebrow}
                </motion.span>

                <h1>
                    <TextEffect as="span" per="word" preset="fade-in-blur" delay={0.15} speedReveal={1.6}>
                        {HERO.headlineLead}
                    </TextEffect>{' '}
                    <TextEffect
                        as="span"
                        per="word"
                        preset="fade-in-blur"
                        delay={0.45}
                        speedReveal={1.6}
                        className="hero-accent-word"
                    >
                        {HERO.headlineAccent}
                    </TextEffect>
                </h1>

                <motion.p
                    className="hero-sub"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.75 }}
                >
                    {HERO.sub}
                </motion.p>

                <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.95 }}
                >
                    <a className="btn btn-primary btn-lg" href={registerHref}>
                        Get started - it's free
                    </a>
                    <a className="btn btn-ghost-dark btn-lg" href={loginHref}>
                        I already have an account
                    </a>
                </motion.div>
            </div>

            <a className="hero-scroll-cue" href="#cycle" aria-label="Scroll to learn more">
                <span />
            </a>
        </section>
    );
}
