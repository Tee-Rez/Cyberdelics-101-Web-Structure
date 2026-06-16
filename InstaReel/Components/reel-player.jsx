// Reel player — themed via colorTheme/fontTheme props

function ReelPlayer({ width = 360, autoPlay = true, speed = 1, showChrome = true, colorTheme = 'prism', fontTheme = 'mono', gradientStops, gradientSpeed = 1, bgProps = {} }) {
    const [playing, setPlaying] = React.useState(autoPlay);
    const [t, setT] = React.useState(0);
    const rafRef = React.useRef(0);
    const lastRef = React.useRef(0);

    // Expose a global hook for Puppeteer to trigger perfect sync
    React.useEffect(() => {
        window.START_REEL_PLAYBACK = () => setPlaying(true);
    }, []);

    React.useEffect(() => {
        if (!playing) return;
        let firstFrame = true;
        const step = (now) => {
            if (firstFrame) {
                lastRef.current = now;
                firstFrame = false;
                rafRef.current = requestAnimationFrame(step);
                return;
            }
            const dt = (now - lastRef.current) / 1000;
            const clampedDt = Math.min(dt, 0.1); // Prevent huge jumps if browser lags
            lastRef.current = now;
            setT((prev) => prev + clampedDt * speed);
            rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [playing, speed]);

    const { index, local } = frameAt(t);
    const height = width * (FRAME_H / FRAME_W);
    const scale = width / FRAME_W;

    return (
        <div style={{ width, display: 'inline-flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
                position: 'relative', width, height, background: '#000',
                borderRadius: 18, overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(178,138,255,0.18)',
            }} onClick={() => setPlaying((p) => !p)}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: FRAME_W, height: FRAME_H,
                    transform: `scale(${scale})`, transformOrigin: '0 0'
                }}>
                    <VariantB index={index} local={local} totalT={t} colorTheme={colorTheme} fontTheme={fontTheme} gradientStops={gradientStops} gradientSpeed={gradientSpeed} bgProps={bgProps} />
                </div>
                {showChrome && !playing && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)', pointerEvents: 'none' }}>
                        <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                            <div style={{ width: 0, height: 0, marginLeft: 4, borderLeft: '18px solid #000', borderTop: '12px solid transparent', borderBottom: '12px solid transparent' }} />
                        </div>
                    </div>
                )}
                {/* Per-frame progress bars removed per design request */}
            </div>
            {showChrome && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(40,30,20,0.7)' }}>
                    <button onClick={() => setPlaying(p => !p)} style={{ width: 28, height: 28, borderRadius: 14, border: '1px solid rgba(0,0,0,0.15)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                        {playing ? (
                            <span style={{ display: 'flex', gap: 2 }}><span style={{ width: 3, height: 10, background: '#000' }} /><span style={{ width: 3, height: 10, background: '#000' }} /></span>
                        ) : (
                            <span style={{ width: 0, height: 0, marginLeft: 2, borderLeft: '7px solid #000', borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }} />
                        )}
                    </button>
                    <input type="range" min={0} max={REEL_TOTAL} step={0.05} value={t}
                        onChange={(e) => { setT(parseFloat(e.target.value)); setPlaying(false); }} style={{ flex: 1 }} />
                    <span>{t.toFixed(1)}s / {REEL_TOTAL.toFixed(0)}s</span>
                </div>
            )}
        </div>
    );
}

Object.assign(window, { ReelPlayer });
