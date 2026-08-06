import { motion } from 'motion/react';
import { TextEffect } from '../motion-primitives/text-effect.jsx';
import { HERO } from '../content.js';

export default function Hero({ loginHref, registerHref }) {
    return (
        <section className="hero" id="top">
            <div className="hero-glow" aria-hidden="true" />
            <div className="hero-copy">
                <motion.p
                    className="hero-eyebrow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {HERO.eyebrow}
                </motion.p>
                <TextEffect as="h1" per="word" preset="fade-in-blur" delay={0.15} speedReveal={1.4}>
                    {HERO.headline}
                </TextEffect>
                <motion.p
                    className="hero-sub"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    {HERO.sub}
                </motion.p>

                <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
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
