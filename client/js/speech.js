// ========== VOICE-TO-TEXT (Web Speech API) ==========
// Wires a mic button to a text field using the browser's built-in speech
// recognition. No external service/API key involved. Silently hides the
// button in browsers that don't support it (e.g. Firefox, Safari).

function setupSpeechToText(buttonId, fieldId) {
    const btn = document.getElementById(buttonId);
    const field = document.getElementById(fieldId);
    if (!btn || !field) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        btn.style.display = 'none';
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let listening = false;
    let baseText = '';

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

    recognition.onerror = () => {
        listening = false;
        btn.classList.remove('listening');
        btn.title = 'Speak instead of typing';
    };

    recognition.onend = () => {
        listening = false;
        btn.classList.remove('listening');
        btn.title = 'Speak instead of typing';
    };

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (listening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
}
