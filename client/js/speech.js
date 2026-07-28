// ========== VOICE-TO-TEXT (Web Speech API) ==========
// Wires a mic button to a text field using the browser's built-in speech
// recognition. No external service/API key involved.

// Chrome/Edge only expose speech recognition in a secure context. localhost
// counts as secure, but reaching the dev server over a LAN IP does not, and the
// API is simply absent there rather than failing loudly.
function speechSupport() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        return {
            ok: false,
            reason: window.isSecureContext === false
                ? 'Voice input needs a secure connection. Open the app via localhost or https rather than an IP address.'
                : "This browser doesn't support voice input. Chrome or Edge do."
        };
    }
    return { ok: true, SpeechRecognition };
}

// Human-readable explanations for the error codes the API reports. Without
// these, a denied mic permission looks identical to the button doing nothing.
const SPEECH_ERRORS = {
    'not-allowed': 'Microphone access is blocked. Allow it via the icon in your browser address bar, then try again.',
    'service-not-allowed': 'Microphone access is blocked. Allow it via the icon in your browser address bar, then try again.',
    'audio-capture': 'No microphone found. Check that one is connected and enabled.',
    'network': 'Voice input needs an internet connection and could not reach the speech service.',
    'aborted': null,   // user-initiated stop; nothing to report
    'no-speech': null  // just silence; stopping quietly is the right behaviour
};

function setupSpeechToText(buttonId, fieldId) {
    const btn = document.getElementById(buttonId);
    const field = document.getElementById(fieldId);
    if (!btn || !field) return;

    const support = speechSupport();
    if (!support.ok) {
        // Keep the button visible but inert, so the failure is explainable on
        // click instead of the control silently vanishing.
        btn.classList.add('mic-btn-unavailable');
        btn.title = support.reason;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification(support.reason);
        });
        return;
    }

    const recognition = new support.SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || 'en-US';

    let listening = false;
    let baseText = '';

    function idle() {
        listening = false;
        btn.classList.remove('listening');
        btn.title = 'Speak instead of typing';
    }

    recognition.onstart = () => {
        listening = true;
        btn.classList.add('listening');
        btn.title = 'Listening... click to stop';
        trackEvent('use_voice_input');
        baseText = field.value && !field.value.endsWith(' ') ? field.value + ' ' : field.value;
    };

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        field.value = baseText + transcript;
        field.dispatchEvent(new Event('input', { bubbles: true }));
    };

    recognition.onerror = (event) => {
        idle();
        const message = SPEECH_ERRORS[event.error];
        // Unrecognised codes still deserve a message rather than silence.
        if (message === undefined) {
            showNotification(`Voice input stopped unexpectedly (${event.error}).`);
        } else if (message) {
            showNotification(message);
        }
    };

    recognition.onend = idle;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (listening) {
            recognition.stop();
            return;
        }
        try {
            recognition.start();
        } catch (err) {
            // start() throws InvalidStateError if the previous session hasn't
            // fully torn down yet; recover instead of leaving the button dead.
            idle();
            showNotification('Voice input is still stopping - give it a second and try again.');
        }
    });
}
