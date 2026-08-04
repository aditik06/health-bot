// Page copy kept separate from layout so wording can be edited without
// touching component code.

export const HERO = {
    eyebrow: 'Bloom',
    headline: 'Understand your body.',
    sub: 'One place for your cycle, your pregnancy, and everything in between - with a companion that’s there whenever you need to talk.'
};

// One full-bleed "story" per major capability - alternating image side, like a
// product page walking through what the thing actually does.
export const STORIES = [
    {
        id: 'cycle',
        eyebrow: 'Cycle tracking',
        headline: 'Know what’s coming, before it does.',
        body: 'Log a period and your predictions adjust to your real history - not a textbook 28-day guess. See your period, fertile window, and ovulation at a glance, and watch the picture get sharper every cycle.',
        visual: 'calendar',
        align: 'left'
    },
    {
        id: 'pregnancy',
        eyebrow: 'Pregnancy',
        headline: 'Every week, explained.',
        body: 'Due date, baby size, what’s developing right now, your weight over time, and the milestones ahead - all in one view that updates as you go, right through to the kick counter and contraction timer.',
        visual: 'pregnancy',
        align: 'right'
    },
    {
        id: 'companion',
        eyebrow: 'AI companion',
        headline: 'Someone to ask. Someone to talk to.',
        body: 'Wondering if what you’re feeling is normal? Ask. Just want to talk about your day? That works too. Your companion floats on every page, so it’s never more than a tap away.',
        visual: 'chat',
        align: 'left'
    },
    {
        id: 'everyday',
        eyebrow: 'Medications & diary',
        headline: 'Everything, remembered.',
        body: 'Medications, doses taken, symptoms, moods, appointments - the things you’d otherwise have to hold in your head, or dig up from three different apps. Look back a week and the pattern is right there.',
        visual: 'diary',
        align: 'right'
    }
];

export const PRIVACY = {
    eyebrow: 'Privacy',
    headline: 'Your data. Only yours.',
    body: 'What you log stays in your account, behind your password. It’s never sold. You can export everything or delete your account entirely, any time, from Settings.'
};

export const CTA = {
    headline: 'Start understanding your body.',
    sub: 'Free. Private. Takes about a minute to set up.'
};

const REPO_URL = 'https://github.com/aditik06/health-bot';
export const LINKS = { repo: REPO_URL };
