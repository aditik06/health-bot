// Hand-built CSS/SVG mockups standing in for real product screenshots. Kept
// as isolated, non-interactive "frames" so each one can be dropped into a
// story section at a consistent size.

function FrameTag({ children }) {
    return (
        <span className="mock-frame-tag">
            <span className="mock-frame-tag-dot" />
            {children}
        </span>
    );
}

export function MockCalendar() {
    const days = Array.from({ length: 35 }, (_, i) => i - 2); // leading blanks
    const period = [3, 4, 5, 6, 7];
    const fertile = [12, 13, 14, 15, 16, 17];
    const ovulation = [14, 15];
    const today = 9;

    return (
        <div className="mock-frame mock-calendar">
            <div className="mock-frame-header"><FrameTag>August</FrameTag></div>
            <div className="mock-calendar-grid">
                {days.map((d, i) => {
                    if (d < 1 || d > 31) return <span key={i} className="mock-cal-cell mock-cal-blank" />;
                    let cls = 'mock-cal-cell';
                    if (period.includes(d)) cls += ' mock-cal-period';
                    else if (ovulation.includes(d)) cls += ' mock-cal-ovulation';
                    else if (fertile.includes(d)) cls += ' mock-cal-fertile';
                    if (d === today) cls += ' mock-cal-today';
                    return <span key={i} className={cls}>{d}</span>;
                })}
            </div>
            <div className="mock-legend">
                <span><i className="mock-swatch mock-swatch-period" />Period</span>
                <span><i className="mock-swatch mock-swatch-fertile" />Fertile</span>
                <span><i className="mock-swatch mock-swatch-ovulation" />Ovulation</span>
            </div>
        </div>
    );
}

export function MockPregnancy() {
    return (
        <div className="mock-frame mock-pregnancy">
            <div className="mock-frame-header"><FrameTag>Week 24</FrameTag></div>
            <div className="mock-pregnancy-body">
                <div className="mock-ring" style={{ '--pct': '62%' }}>
                    <span className="mock-ring-week">Week 24</span>
                </div>
                <div className="mock-pregnancy-facts">
                    <div className="mock-fact">
                        <span className="mock-fact-label">Baby is the size of</span>
                        <span className="mock-fact-value">🌽 an ear of corn</span>
                    </div>
                    <div className="mock-fact">
                        <span className="mock-fact-label">Due date</span>
                        <span className="mock-fact-value">Dec 14, 2026</span>
                    </div>
                    <div className="mock-progress-bar">
                        <span className="mock-progress-fill" style={{ width: '62%' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function MockChat() {
    return (
        <div className="mock-frame mock-chat">
            <div className="mock-frame-header"><FrameTag>Companion</FrameTag></div>
            <div className="mock-chat-body">
                <div className="mock-bubble mock-bubble-user">Is it normal to feel this tired at 24 weeks?</div>
                <div className="mock-bubble mock-bubble-ai">Completely - your body's working hard. Rest when you can, and mention it at your next check-up if it feels extreme.</div>
                <div className="mock-bubble mock-bubble-user">Thank you 💛</div>
            </div>
        </div>
    );
}

export function MockDiary() {
    const rows = [
        { label: 'Mood', value: 'Calm', icon: '🙂' },
        { label: 'Medication', value: 'Prenatal vitamin — taken', icon: '💊' },
        { label: 'Symptom', value: 'Mild backache', icon: '📝' }
    ];
    return (
        <div className="mock-frame mock-diary">
            <div className="mock-frame-header"><FrameTag>Today</FrameTag></div>
            <div className="mock-diary-body">
                {rows.map((r) => (
                    <div className="mock-diary-row" key={r.label}>
                        <span className="mock-diary-icon">{r.icon}</span>
                        <span className="mock-diary-label">{r.label}</span>
                        <span className="mock-diary-value">{r.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const MOCKS = {
    calendar: MockCalendar,
    pregnancy: MockPregnancy,
    chat: MockChat,
    diary: MockDiary
};
