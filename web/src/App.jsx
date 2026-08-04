import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import StorySection from './components/StorySection.jsx';
import PrivacySection from './components/PrivacySection.jsx';
import FinalCta from './components/FinalCta.jsx';
import Footer from './components/Footer.jsx';
import { STORIES } from './content.js';

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
                {STORIES.map((story) => (
                    <StorySection key={story.id} {...story} />
                ))}
                <PrivacySection />
                <FinalCta loginHref={LOGIN_HREF} registerHref={REGISTER_HREF} />
            </main>
            <Footer loginHref={LOGIN_HREF} />
        </>
    );
}
