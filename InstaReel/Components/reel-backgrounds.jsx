// Reel background — cosmic starfield + nebula + scan-wave bands, layered together.
// Each layer has independent intensity, so user can dial them via Tweaks.

function ReelBg({
    local, C,
    cosmicIntensity = 1,    // overall cosmic layer (nebula glow)
    starDensity = 80,       // number of stars (0-160)
    starTwinkle = 1,        // twinkle amount 0-2
    scanIntensity = 1,      // overall scan-wave brightness (0-2)
    scanLineCount = 4,      // number of scan lines (1-8)
    scanSpeed = 1,          // line drift speed (0-3)
}) {
    const isLight = C.bg === '#efe9dc';

    // Stars — regenerate when density changes
    const stars = React.useMemo(() => {
        const arr = [];
        const n = Math.max(0, Math.floor(starDensity));
        for (let i = 0; i < n; i++) {
            arr.push({
                x: Math.random() * 100, y: Math.random() * 100,
                s: Math.random() * 1.6 + 0.4,
                o: Math.random() * 0.7 + 0.2,
                tw: Math.random() * 4 + 2,
            });
        }
        return arr;
    }, [starDensity]);

    // Scan-wave lines — regenerate when count changes
    const scanLines = React.useMemo(() => {
        const arr = [];
        const n = Math.max(1, Math.floor(scanLineCount));
        for (let i = 0; i < n; i++) {
            arr.push({
                baseY: (i + 0.5) / n,
                dir: i % 2 ? 1 : -1,
                colorIdx: i % 4,
            });
        }
        return arr;
    }, [scanLineCount]);

    const scanColors = [C.primary, C.accent2, C.primary, C.accent];

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>

            {/* ── COSMIC: nebula gradient field ── */}
            <div style={{
                position: 'absolute', inset: 0,
                background: isLight
                    ? `linear-gradient(180deg, ${C.bg} 0%, ${C.bgDeep} 100%)`
                    : `radial-gradient(70% 55% at 50% ${30 + Math.sin(local * 1.4) * 6}%, ${C.primary}${alphaHex(0.33 * cosmicIntensity)}, transparent 60%),
             radial-gradient(60% 50% at ${30 + local * 15}% 80%, ${C.accent}${alphaHex(0.20 * cosmicIntensity)}, transparent 65%),
             radial-gradient(80% 60% at 100% 100%, ${C.accent2}${alphaHex(0.15 * cosmicIntensity)}, transparent 70%),
             linear-gradient(180deg, ${C.bg} 0%, ${C.bgDeep} 100%)`,
            }} />

            {/* ── COSMIC: starfield ── */}
            {!isLight && stars.map((s, i) => (
                <div key={i} style={{
                    position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
                    width: s.s, height: s.s, borderRadius: '50%', background: '#fff',
                    opacity: s.o * (0.6 + 0.4 * Math.sin(local * s.tw * starTwinkle + i)) * cosmicIntensity,
                    boxShadow: `0 0 ${s.s * 3}px rgba(255,255,255,0.6)`,
                }} />
            ))}

            {/* ── SCAN WAVES: thin horizontal bands traveling vertically ── */}
            {scanLines.map((ln, i) => {
                const yPos = ((ln.baseY + local * 0.12 * scanSpeed * ln.dir) % 1 + 1) % 1 * 100;
                const color = scanColors[ln.colorIdx];
                return (
                    <div key={i} style={{
                        position: 'absolute', left: 0, right: 0,
                        top: `${yPos}%`, height: 1,
                        background: `linear-gradient(90deg, transparent 0%, ${color}cc 50%, transparent 100%)`,
                        boxShadow: `0 0 ${24 * scanIntensity}px ${color}99`,
                        opacity: 0.5 * scanIntensity,
                        mixBlendMode: isLight ? 'multiply' : 'screen',
                    }} />
                );
            })}

            {/* ── shared CRT scanline overlay ── */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `repeating-linear-gradient(0deg, ${isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'} 0 1px, transparent 1px 4px)`,
                mixBlendMode: 'overlay',
            }} />

            {/* ── frame border + corner brackets ── */}
            <div style={{ position: 'absolute', inset: 30, border: `1px solid ${C.border}` }} />
            {[{ top: 22, left: 22 }, { top: 22, right: 22 }, { bottom: 22, left: 22 }, { bottom: 22, right: 22 }].map((p, i) => (
                <div key={i} style={{
                    position: 'absolute', ...p, width: 18, height: 18,
                    borderTop: p.top !== undefined ? `1.5px solid ${C.primary}` : 'none',
                    borderBottom: p.bottom !== undefined ? `1.5px solid ${C.primary}` : 'none',
                    borderLeft: p.left !== undefined ? `1.5px solid ${C.primary}` : 'none',
                    borderRight: p.right !== undefined ? `1.5px solid ${C.primary}` : 'none',
                }} />
            ))}
        </div>
    );
}

// Helper: convert 0-1 alpha to 2-digit hex for use in hex color strings (#rrggbbAA)
function alphaHex(a) {
    const v = Math.max(0, Math.min(255, Math.round(a * 255)));
    return v.toString(16).padStart(2, '0');
}

Object.assign(window, { ReelBg, alphaHex });
