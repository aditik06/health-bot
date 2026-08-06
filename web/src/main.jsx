import React from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* reducedMotion="user" makes every Motion animation on the page defer
            to the OS-level prefers-reduced-motion setting automatically,
            same guarantee the old CSS-only reveal gave explicitly. */}
        <MotionConfig reducedMotion="user">
            <App />
        </MotionConfig>
    </React.StrictMode>
);
