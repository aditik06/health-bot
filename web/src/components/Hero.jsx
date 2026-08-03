export default function Hero({ loginHref, registerHref }) {
    return (
        <section className="hero" id="top">
            <div className="hero-inner">
                <div className="hero-copy">
                    <p className="hero-eyebrow">Your body, better understood</p>
                    <h1>
                        Everything about your health,
                        <span className="hero-accent"> in one place</span>
                    </h1>
                    <p className="hero-sub">
                        Track your cycle, pregnancy, medications, and mood - and get predictions
                        that learn from your history instead of assuming everyone is the same.
                        With a companion that's there whenever you want to talk.
                    </p>

                    <div className="hero-actions">
                        <a className="btn btn-primary btn-lg" href={registerHref}>
                            Get started - it's free
                        </a>
                        <a className="btn btn-ghost btn-lg" href={loginHref}>
                            I already have an account
                        </a>
                    </div>

                    <p className="hero-note">
                        No card required · Your data stays in your account · Delete it any time
                    </p>
                </div>

                <div className="hero-visual" aria-hidden="true">
                    <div className="mock-card mock-card-main">
                        <div className="mock-header">
                            <span className="mock-avatar">🌸</span>
                            <div>
                                <strong>Good morning, Aditi</strong>
                                <small>Cycle day 14 · Ovulation</small>
                            </div>
                        </div>

                        <div className="mock-stats">
                            <div className="mock-stat">
                                <span className="mock-stat-label">Next period</span>
                                <span className="mock-stat-value">Aug 21</span>
                            </div>
                            <div className="mock-stat">
                                <span className="mock-stat-label">Cycle</span>
                                <span className="mock-stat-value">28 days</span>
                            </div>
                        </div>

                        <div className="mock-calendar">
                            {Array.from({ length: 28 }, (_, i) => {
                                const day = i + 1;
                                let tone = '';
                                if (day <= 5) tone = 'period';
                                else if (day >= 13 && day <= 15) tone = 'ovulation';
                                else if (day >= 10 && day <= 17) tone = 'fertile';
                                return <span key={day} className={`mock-day ${tone}`} />;
                            })}
                        </div>

                        <div className="mock-legend">
                            <span><i className="dot period" /> Period</span>
                            <span><i className="dot fertile" /> Fertile</span>
                            <span><i className="dot ovulation" /> Ovulation</span>
                        </div>
                    </div>

                    <div className="mock-card mock-card-chat">
                        <div className="mock-bubble assistant">
                            You're in your fertile window - that tired, restless feeling is
                            really common around now. 💛
                        </div>
                        <div className="mock-bubble user">is that why I feel so off today?</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
