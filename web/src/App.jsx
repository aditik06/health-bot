import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Faq from './components/Faq.jsx';
import Footer from './components/Footer.jsx';

// The auth screen is still the existing vanilla page; '#register' tells it to
// open on the sign-up tab rather than login.
const LOGIN_HREF = '/login';
const REGISTER_HREF = '/login#register';

export default function App() {
    return (
        <>
            <Nav loginHref={LOGIN_HREF} registerHref={REGISTER_HREF} />
            <main>
                <Hero loginHref={LOGIN_HREF} registerHref={REGISTER_HREF} />
                <Features />
                <HowItWorks registerHref={REGISTER_HREF} />
                <Faq />
            </main>
            <Footer loginHref={LOGIN_HREF} registerHref={REGISTER_HREF} />
        </>
    );
}
