const REPO_URL = 'https://github.com/aditik06/health-bot';

export default function Footer({ loginHref, registerHref }) {
    return (
        <>
            <section className="cta-band">
                <div className="section-inner">
                    <h2>Start understanding your cycle</h2>
                    <p>Free, private, and yours to delete whenever you want.</p>
                    <a className="btn btn-light btn-lg" href={registerHref}>Get started</a>
                </div>
            </section>

            <footer className="footer">
                <div className="section-inner footer-inner">
                    <div className="footer-brand">
                        <span className="nav-brand-mark">🌸</span>
                        <div>
                            <strong>Bloom</strong>
                            <p>Your personal women's health companion.</p>
                        </div>
                    </div>

                    <nav className="footer-links" aria-label="Footer">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How it works</a>
                        <a href="#faq">FAQ</a>
                        <a href={loginHref}>Log in</a>
                        <a href={REPO_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
                    </nav>
                </div>

                <p className="footer-disclaimer">
                    Bloom is a tracking and information tool, not a medical device, and does not
                    provide medical advice. For anything urgent, contact your doctor or your local
                    emergency service.
                </p>
            </footer>
        </>
    );
}
