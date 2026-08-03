import { FEATURES } from '../content.js';

export default function Features() {
    return (
        <section className="section" id="features">
            <div className="section-inner">
                <header className="section-head">
                    <h2>Built for the whole picture</h2>
                    <p>
                        Not just a period tracker bolted onto a calendar - the parts of your
                        health that affect each other, kept together.
                    </p>
                </header>

                <div className="feature-grid">
                    {FEATURES.map(f => (
                        <article className="feature-card" key={f.title}>
                            <span className="feature-icon" aria-hidden="true">{f.icon}</span>
                            <h3>{f.title}</h3>
                            <p>{f.body}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
