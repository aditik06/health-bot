// ========== AI COMPANION CHAT ==========

async function setupChat() {
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');

    setupSpeechToText('chatInputMicBtn', 'chatInput');

    // Auto-grow the textarea as the user types
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 140) + 'px';
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.requestSubmit();
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = input.value.trim();
        if (!message) return;

        input.value = '';
        input.style.height = 'auto';
        appendChatMessage('user', message);
        setChatTyping(true);

        try {
            const result = await api.post('/chat', { message });
            appendChatMessage('assistant', result.assistantMessage.content);
        } catch (err) {
            appendChatMessage('assistant', err.message || "Sorry, I couldn't reach the assistant just now. Please try again.");
        } finally {
            setChatTyping(false);
        }
    });

    await loadChatHistory();
}

async function loadChatHistory() {
    try {
        const messages = await api.get('/chat');
        state.chatMessages = messages;
        renderChatMessages();
    } catch (err) {
        // Non-fatal - chat tab just starts empty
        state.chatMessages = [];
    }
}

function renderChatMessages() {
    const container = document.getElementById('chatMessages');

    if (state.chatMessages.length === 0) {
        container.innerHTML = '<div class="chat-empty-state"><p class="info-text">Say hello to get started. 🌸</p></div>';
        return;
    }

    container.innerHTML = state.chatMessages.map(m => chatBubbleHtml(m.role, m.content)).join('');
    container.scrollTop = container.scrollHeight;
}

function chatBubbleHtml(role, content) {
    const safe = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    return `<div class="chat-bubble chat-bubble-${role}">${safe}</div>`;
}

function appendChatMessage(role, content) {
    const container = document.getElementById('chatMessages');
    const emptyState = container.querySelector('.chat-empty-state');
    if (emptyState) emptyState.remove();

    state.chatMessages.push({ role, content });
    container.insertAdjacentHTML('beforeend', chatBubbleHtml(role, content));
    container.scrollTop = container.scrollHeight;
}

function setChatTyping(isTyping) {
    document.getElementById('chatTypingIndicator').style.display = isTyping ? 'flex' : 'none';
    if (isTyping) {
        const container = document.getElementById('chatMessages');
        container.scrollTop = container.scrollHeight;
    }
}

async function clearChat() {
    if (!confirm('Clear this whole conversation? This cannot be undone.')) return;
    try {
        await api.delete('/chat');
        state.chatMessages = [];
        renderChatMessages();
    } catch (err) {
        showNotification(err.message || 'Could not clear the conversation');
    }
}
