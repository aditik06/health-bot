import { LINKS } from '../content.js';

export default function Footer({ loginHref }) {
    return (
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
                    <a href="#cycle">Features</a>
                    <a href="#privacy">Privacy</a>
                    <a href={loginHref}>Log in</a>
                    <a href={LINKS.repo} target="_blank" rel="noopener noreferrer">GitHub</a>
                </nav>
            </div>

            <p className="footer-disclaimer">
                Bloom is a tracking and information tool, not a medical device, and does not
                provide medical advice. For anything urgent, contact your doctor or your local
                emergency service.
            </p>
        </footer>
    );
}
