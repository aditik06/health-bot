import { useState } from 'react';
import { FAQS } from '../content.js';

export default function Faq() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="section" id="faq">
            <div className="section-inner section-narrow">
                <header className="section-head">
                    <h2>Questions people ask</h2>
                </header>

                <div className="faq-list">
                    {FAQS.map((item, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <div className={`faq-item ${isOpen ? 'open' : ''}`} key={item.q}>
                                <button
                                    className="faq-question"
                                    aria-expanded={isOpen}
                                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                                >
                                    <span>{item.q}</span>
                                    <span className="faq-chevron" aria-hidden="true">⌄</span>
                                </button>
                                {isOpen && <p className="faq-answer">{item.a}</p>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
