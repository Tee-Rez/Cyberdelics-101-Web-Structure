// Shared reel data + helpers + logo component (Cyberdelic Academy brand)

const REEL_FRAMES = [
    {
        id: 'hook', beat: 'HOOK', dur: 3.4, kind: 'hook',
        lines: ["You don't need", "a substance", "to have a", "psychedelic", "experience."]
    },
    {
        id: 'turn', beat: 'TURN', dur: 3.0, kind: 'turn',
        lines: ["And there's", "a whole field", "rising around that idea."]
    },
    {
        id: 'name', beat: 'NAME', dur: 3.6, kind: 'name',
        word: 'CYBERDELICS', sub: 'cybernetics + psychedelics · tech that catalyzes inner transformation'
    },
    {
        id: 'stack', beat: 'STACK', dur: 3.6, kind: 'stack',
        items: ['VR', 'AR', 'BIOFEEDBACK', 'INTERACTIVE MEDIA'], caption: 'INPUT.STACK'
    },
    {
        id: 'purpose', beat: 'PURPOSE', dur: 4.8, kind: 'purpose',
        items: ['altered states', 'embodied traits', 'integrated insight'],
        caption: 'STATES ARE CHEAP · TRAITS ARE EARNED'
    },
    {
        id: 'course', beat: 'COURSE', dur: 4.4, kind: 'course',
        title: "Cyberdelics 101", sub: '~4 HRS · SELF-PACED · 5 MODULES'
    },
    {
        id: 'modules', beat: 'MODULES', dur: 5.0, kind: 'modules',
        items: [
            { n: '01', t: 'Definitions' },
            { n: '02', t: 'Historical foundations' },
            { n: '03', t: 'Science of consciousness' },
            { n: '04', t: 'Current applications' },
            { n: '05', t: 'The ecosystem · where you fit' },
        ]
    },
    {
        id: 'methods', beat: 'METHODS', dur: 12.0, kind: 'methods',
        caption: 'HOW.YOU.LEARN /',
        items: [
            { n: '01', t: 'Unlock it', sub: 'progressive disclosure', video: 'assets/progressive disclousure.mp4' },
            { n: '02', t: 'Live it', sub: 'scenario-based learning', video: 'assets/Scenario.mp4' },
            { n: '03', t: 'Question it', sub: 'quizzes · branching logic', video: 'assets/quiz.mp4' },
            { n: '04', t: 'Play with it', sub: 'interactive simulations', video: 'assets/interactive Sim.mp4' },
        ]
    },
    {
        id: 'audience', beat: 'FOR', dur: 4.2, kind: 'audience',
        items: ['seekers', 'creators', 'technologists', 'researchers', 'psychonauts', 'cultural architects', 'myth-makers'],
        caption: 'BUILT.FOR /'
    },
    {
        id: 'cta', beat: 'CTA', dur: 3.6, kind: 'cta',
        primary: 'Cyberdelics 101', secondary: '[ LINK IN BIO ↓ ]',
        triad: ['Recalibrate your mind.', 'Reclaim your attention.', 'Rewrite your reality.'],
        tagline: 'From altered states to altered traits.',
        footer: 'cyberdelic.nexus/cyberdelic-academy'
    },
];

const REEL_TOTAL = REEL_FRAMES.reduce((a, f) => a + f.dur, 0);

function frameAt(t) {
    let acc = 0;
    for (let i = 0; i < REEL_FRAMES.length; i++) {
        const f = REEL_FRAMES[i];
        if (t < acc + f.dur) return { index: i, local: (t - acc) / f.dur };
        acc += f.dur;
    }
    const lastF = REEL_FRAMES[REEL_FRAMES.length - 1];
    return { index: REEL_FRAMES.length - 1, local: (t - (REEL_TOTAL - lastF.dur)) / lastF.dur };
}

// Cyberdelic Academy lockup — logo + wordmark "CYBERDELIC ACADEMY" beneath.
// Uses brand iridescent green→gold ring (matches uploaded logo).
function NexusLogo({ size = 220, showWordmark = true, glow = true }) {
    const wm = size * 0.95;
    return (
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.16 }}>
            <img
                src="assets/CA Logo NL.png"
                width={size} height={size}
                alt="Cyberdelic Academy"
                style={{
                    display: 'block', width: size, height: size,
                    filter: glow ? `drop-shadow(0 0 ${size * 0.18}px rgba(178,138,255,0.55))` : 'none',
                }}
            />
            {showWordmark && (
                <div style={{
                    width: wm, textAlign: 'center',
                    fontFamily: 'JetBrains Mono, monospace', fontWeight: 500,
                    fontSize: size * 0.105, letterSpacing: '0.32em',
                    color: 'transparent',
                    background: 'linear-gradient(180deg, #f4eefb 0%, #b1a3c8 100%)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>CYBERDELIC · ACADEMY</div>
            )}
        </div>
    );
}

const FRAME_W = 1080;
const FRAME_H = 1920;

const ease = {
    out: (x) => 1 - Math.pow(1 - x, 3),
    in: (x) => x * x * x,
    inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
};
function entryT(local, entryFrac = 0.35) {
    return ease.out(Math.max(0, Math.min(1, local / entryFrac)));
}
function exitT(local, exitFrac = 0.18) {
    const start = 1 - exitFrac;
    if (local < start) return 0;
    return ease.in((local - start) / exitFrac);
}

Object.assign(window, {
    REEL_FRAMES, REEL_TOTAL, frameAt, NexusLogo,
    FRAME_W, FRAME_H, ease, entryT, exitT,
});
