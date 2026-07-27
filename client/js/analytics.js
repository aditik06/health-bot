// ========== USAGE ANALYTICS ==========
// First-party only: events are sent to our own API, never to a third party.
// Only the event name is recorded - no free text, no health values, no IP or
// user-agent. Fire-and-forget so a failure never blocks or breaks the UI.

function trackEvent(event) {
    if (!getToken()) return;
    api.post('/analytics', { event }).catch(() => {});
}
