// Theme presets for the Cyberdelics 101 reel
// Two axes: COLOR (palette) × FONT (type stack)

const COLOR_THEMES = {
    prism: {
        label: 'Prism — cosmic violet',
        bg: '#070414', bgDeep: '#0a0620', ink: '#f0e6ff',
        dim: 'rgba(240,230,255,0.55)',
        primary: '#b28aff', accent: '#e85cf5', accent2: '#5ce0ff',
        rainbow: 'linear-gradient(90deg, #ff4d6d 0%, #ffb84d 18%, #fff04d 34%, #6dff8e 52%, #5ce0ff 70%, #b28aff 86%, #e85cf5 100%)',
        border: 'rgba(178,138,255,0.32)',
        ctaBg: '#0a0420',
    },
    void: {
        label: 'Void — pure black + lime',
        bg: '#000000', bgDeep: '#050505', ink: '#f4f2ea',
        dim: 'rgba(244,242,234,0.55)',
        primary: '#c6ff4c', accent: '#e8c24a', accent2: '#a8e85a',
        rainbow: 'linear-gradient(90deg, #c6ff4c 0%, #a8e85a 50%, #e8c24a 100%)',
        border: 'rgba(198,255,76,0.28)',
        ctaBg: '#000000',
    },
    ember: {
        label: 'Ember — black + amber/orange',
        bg: '#0b0805', bgDeep: '#100904', ink: '#fef0d9',
        dim: 'rgba(254,240,217,0.55)',
        primary: '#ffae3a', accent: '#ff5e3a', accent2: '#ffd76e',
        rainbow: 'linear-gradient(90deg, #ff5e3a 0%, #ffae3a 50%, #ffd76e 100%)',
        border: 'rgba(255,174,58,0.32)',
        ctaBg: '#100904',
    },
    ice: {
        label: 'Ice — deep navy + cyan',
        bg: '#020714', bgDeep: '#03102a', ink: '#e6f4ff',
        dim: 'rgba(230,244,255,0.55)',
        primary: '#5ce0ff', accent: '#92f3ff', accent2: '#8ab8ff',
        rainbow: 'linear-gradient(90deg, #5ce0ff 0%, #8ab8ff 50%, #c5d8ff 100%)',
        border: 'rgba(92,224,255,0.32)',
        ctaBg: '#020714',
    },
    bone: {
        label: 'Bone — cream + ink (inverse)',
        bg: '#efe9dc', bgDeep: '#e3dac6', ink: '#1a1410',
        dim: 'rgba(26,20,16,0.55)',
        primary: '#3a2a8c', accent: '#c2185b', accent2: '#1f6e4f',
        rainbow: 'linear-gradient(90deg, #c2185b 0%, #3a2a8c 50%, #1f6e4f 100%)',
        border: 'rgba(26,20,16,0.25)',
        ctaBg: '#1a1410',
    },
    acid: {
        label: 'Acid — magenta + cyan',
        bg: '#0a0214', bgDeep: '#1a0426', ink: '#ffe6fa',
        dim: 'rgba(255,230,250,0.55)',
        primary: '#ff2d9c', accent: '#00f0ff', accent2: '#ffd44d',
        rainbow: 'linear-gradient(90deg, #ff2d9c 0%, #ffd44d 33%, #00f0ff 66%, #ff2d9c 100%)',
        border: 'rgba(255,45,156,0.34)',
        ctaBg: '#1a0426',
    },
};

const FONT_THEMES = {
    mono: {
        label: 'Mono — JetBrains terminal',
        body: "'JetBrains Mono', monospace",
        display: "'JetBrains Mono', monospace",
        displayWeight: 700, bodyWeight: 500, upper: true,
        tracking: '-0.02em', trackingHud: '0.22em',
    },
    grotesk: {
        label: 'Grotesk — Space Grotesk',
        body: "'JetBrains Mono', monospace",
        display: "'Space Grotesk', sans-serif",
        displayWeight: 700, bodyWeight: 500, upper: false,
        tracking: '-0.04em', trackingHud: '0.22em',
    },
    serif: {
        label: 'Serif — Fraunces editorial',
        body: "'JetBrains Mono', monospace",
        display: "'Fraunces', serif",
        displayWeight: 500, bodyWeight: 500, upper: false,
        tracking: '-0.03em', trackingHud: '0.24em',
    },
    italic: {
        label: 'Italic — Instrument Serif',
        body: "'JetBrains Mono', monospace",
        display: "'Instrument Serif', serif",
        displayWeight: 400, bodyWeight: 500, upper: false,
        tracking: '-0.025em', trackingHud: '0.24em', italic: true,
    },
    display: {
        label: 'Display — Anton condensed',
        body: "'JetBrains Mono', monospace",
        display: "'Anton', sans-serif",
        displayWeight: 400, bodyWeight: 500, upper: true,
        tracking: '-0.01em', trackingHud: '0.22em',
    },
    // ── Cyberpunk display fonts ──
    orbitron: {
        label: 'Orbitron — sci-fi techno',
        body: "'Share Tech Mono', monospace",
        display: "'Orbitron', sans-serif",
        displayWeight: 800, bodyWeight: 400, upper: true,
        tracking: '0.02em', trackingHud: '0.28em',
    },
    audiowide: {
        label: 'Audiowide — neon arcade',
        body: "'Share Tech Mono', monospace",
        display: "'Audiowide', sans-serif",
        displayWeight: 400, bodyWeight: 400, upper: true,
        tracking: '0.01em', trackingHud: '0.24em',
    },
    rajdhani: {
        label: 'Rajdhani — HUD military',
        body: "'Share Tech Mono', monospace",
        display: "'Rajdhani', sans-serif",
        displayWeight: 700, bodyWeight: 400, upper: true,
        tracking: '0.04em', trackingHud: '0.3em',
    },
    vt323: {
        label: 'VT323 — CRT terminal',
        body: "'VT323', monospace",
        display: "'VT323', monospace",
        displayWeight: 400, bodyWeight: 400, upper: true,
        tracking: '0em', trackingHud: '0.18em',
    },
    monoton: {
        label: 'Monoton — neon tube',
        body: "'Share Tech Mono', monospace",
        display: "'Monoton', sans-serif",
        displayWeight: 400, bodyWeight: 400, upper: true,
        tracking: '0.04em', trackingHud: '0.24em',
    },
    syncopate: {
        label: 'Syncopate — wide cyber',
        body: "'Share Tech Mono', monospace",
        display: "'Syncopate', sans-serif",
        displayWeight: 700, bodyWeight: 400, upper: true,
        tracking: '0.02em', trackingHud: '0.28em',
    },
    bungee: {
        label: 'Bungee — block signage',
        body: "'Share Tech Mono', monospace",
        display: "'Bungee', sans-serif",
        displayWeight: 400, bodyWeight: 400, upper: true,
        tracking: '0em', trackingHud: '0.22em',
    },
    unica: {
        label: 'Unica One — laser thin',
        body: "'Share Tech Mono', monospace",
        display: "'Unica One', sans-serif",
        displayWeight: 400, bodyWeight: 400, upper: true,
        tracking: '0.06em', trackingHud: '0.3em',
    },
};

// Default rainbow gradient stops — used when user hasn't customized
const DEFAULT_GRADIENT = {
    stops: ['#ff4d6d', '#ffb84d', '#fff04d', '#6dff8e', '#5ce0ff', '#b28aff', '#e85cf5'],
    speed: 1, // multiplier on the moving rainbow animation
};

// Build a CSS gradient string from a stops array
function buildGradient(stops) {
    if (!stops || stops.length < 2) stops = DEFAULT_GRADIENT.stops;
    const step = 100 / (stops.length - 1);
    const parts = stops.map((c, i) => `${c} ${(i * step).toFixed(1)}%`);
    return `linear-gradient(90deg, ${parts.join(', ')})`;
}

// Curated gradient presets the user can pick as a starting point
const GRADIENT_PRESETS = {
    prism: { label: 'Prism rainbow', stops: ['#ff4d6d', '#ffb84d', '#fff04d', '#6dff8e', '#5ce0ff', '#b28aff', '#e85cf5'] },
    neon: { label: 'Neon cyberpunk', stops: ['#ff00aa', '#00f0ff', '#fff04d', '#ff00aa'] },
    vapor: { label: 'Vaporwave', stops: ['#ff71ce', '#b967ff', '#01cdfe', '#05ffa1'] },
    sunset: { label: 'Sunset', stops: ['#ff5e3a', '#ffae3a', '#ffd76e', '#ff5e3a'] },
    matrix: { label: 'Matrix', stops: ['#00ff66', '#0aff8a', '#5cffa8', '#00ff66'] },
    bloodmoon: { label: 'Blood moon', stops: ['#ff0040', '#ff6e3a', '#ffae3a', '#ff0040'] },
    electric: { label: 'Electric', stops: ['#00f0ff', '#5ce0ff', '#b28aff', '#e85cf5', '#00f0ff'] },
    acid: { label: 'Acid trip', stops: ['#ff2d9c', '#ffd44d', '#00f0ff', '#ff2d9c'] },
};

// 6 curated PAIRS for the canvas (you can also mix freely via Tweaks)
const PRESET_PAIRS = [
    { id: 'prism-mono', color: 'prism', font: 'mono', name: 'Prism · Mono', desc: 'Cosmic violet + glitch terminal — the brand-faithful default' },
    { id: 'prism-grotesk', color: 'prism', font: 'grotesk', name: 'Prism · Grotesk', desc: 'Same palette, kinetic display grotesk for impact' },
    { id: 'prism-serif', color: 'prism', font: 'serif', name: 'Prism · Serif', desc: 'Editorial Fraunces — meditative, gallery-tone' },
    { id: 'void-display', color: 'void', font: 'display', name: 'Void · Display', desc: 'Pure black + lime, brutalist Anton' },
    { id: 'ember-italic', color: 'ember', font: 'italic', name: 'Ember · Italic', desc: 'Warm amber + Instrument Serif italic — ritual' },
    { id: 'acid-grotesk', color: 'acid', font: 'grotesk', name: 'Acid · Grotesk', desc: 'Magenta/cyan/gold — high-energy rave aesthetic' },
];

Object.assign(window, { COLOR_THEMES, FONT_THEMES, PRESET_PAIRS, DEFAULT_GRADIENT, GRADIENT_PRESETS, buildGradient });
