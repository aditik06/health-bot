import React from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import Storyboard from './Storyboard.jsx';
import './storyboard.css';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MotionConfig reducedMotion="user">
            <Storyboard />
        </MotionConfig>
    </React.StrictMode>
);
