import { STEPS } from '../content.js';

export default function HowItWorks({ registerHref }) {
    return (
        <section className="section section-alt" id="how-it-works">
            <div className="section-inner">
                <header className="section-head">
                    <h2>Up and running in a minute</h2>
                    <p>No lengthy setup. Start logging and it gets more useful from there.</p>
                </header>

                <ol className="steps">
                    {STEPS.map(s => (
                        <li className="step" key={s.number}>
                            <span className="step-number" aria-hidden="true">{s.number}</span>
                            <div>
                                <h3>{s.title}</h3>
                                <p>{s.body}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="section-cta">
                    <a className="btn btn-primary btn-lg" href={registerHref}>Create your account</a>
                </div>
            </div>
        </section>
    );
}
