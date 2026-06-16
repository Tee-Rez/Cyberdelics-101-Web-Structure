// Main app — preset variations on canvas + Tweaks for live mix-and-match

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "speed": 1,
    "autoPlay": true,
    "colorTheme": "prism",
    "fontTheme": "audiowide",
    "gradientPreset": "electric",
    "gradientStop1": "#00f0ff",
    "gradientStop2": "#5ce0ff",
    "gradientStop3": "#b28aff",
    "gradientStop4": "#e85cf5",
    "gradientStop5": "#00f0ff",
    "gradientStop6": "#b28aff",
    "gradientStop7": "#e85cf5",
    "gradientStopCount": 5,
    "gradientSpeed": 2,
    "cosmicIntensity": 1.2,
    "starDensity": 180,
    "starTwinkle": 2,
    "scanIntensity": 2,
    "scanLineCount": 4,
    "scanSpeed": 3,
    "ctaColor": "#37a1e6",
    "ctaFlashRate": 6
}/*EDITMODE-END*/;

function StoryFrame({ index, colorTheme, fontTheme, gradientStops, gradientSpeed, bgProps }) {
    const W = 260; const H = W * (FRAME_H / FRAME_W); const scale = W / FRAME_W;
    return (
        <div className="reel-clip" style={{
            position: 'relative', width: W, height: H, background: '#000',
            borderRadius: 12, overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(10,4,32,0.3), 0 0 0 1px rgba(178,138,255,0.18)',
        }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: FRAME_W, height: FRAME_H, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
                <VariantB index={index} local={0.85} totalT={index * 3} colorTheme={colorTheme} fontTheme={fontTheme} gradientStops={gradientStops} gradientSpeed={gradientSpeed} bgProps={bgProps} />
            </div>
        </div>
    );
}

function PresetHeader({ preset }) {
    const C = COLOR_THEMES[preset.color];
    return (
        <div style={{
            width: 260, padding: '18px 18px', background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12,
        }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {[C.primary, C.accent, C.accent2].map((c, i) => (
                    <div key={i} style={{ width: 22, height: 22, borderRadius: 6, background: c, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }} />
                ))}
                <div style={{ width: 22, height: 22, borderRadius: 6, background: C.bg, boxShadow: '0 0 0 1px rgba(0,0,0,0.12)' }} />
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: 'rgba(0,0,0,0.5)', marginBottom: 6, textTransform: 'uppercase' }}>{preset.id}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: '#1b1812', marginBottom: 6, textTransform: 'uppercase' }}>{preset.name}</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, lineHeight: 1.45, color: 'rgba(27,24,18,0.65)' }}>{preset.desc}</div>
        </div>
    );
}

// Live preview swatch of the current animated gradient
function GradientPreview({ stops, speed }) {
    const [pos, setPos] = React.useState(0);
    React.useEffect(() => {
        let raf, last = performance.now();
        const tick = (now) => {
            const dt = (now - last) / 1000; last = now;
            setPos(p => (p + dt * speed * 60) % 200);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [speed]);
    const grad = buildGradient(stops);
    return (
        <div style={{
            height: 36, borderRadius: 6, marginBottom: 10,
            background: grad, backgroundSize: '200% 100%',
            backgroundPosition: `${pos}% 50%`,
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
        }} />
    );
}

function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

    const colorOpts = Object.keys(COLOR_THEMES);
    const fontOpts = Object.keys(FONT_THEMES);

    // Build live gradient stops from individual tweak keys (so each is persisted)
    const allStopKeys = ['gradientStop1', 'gradientStop2', 'gradientStop3', 'gradientStop4', 'gradientStop5', 'gradientStop6', 'gradientStop7'];
    const stopCount = t.gradientStopCount || 7;
    const liveStops = allStopKeys.slice(0, stopCount).map(k => t[k]);

    // Apply a gradient preset (writes individual stop keys)
    const applyPreset = (key) => {
        const p = GRADIENT_PRESETS[key]; if (!p) return;
        setTweak('gradientPreset', key);
        setTweak('gradientStopCount', p.stops.length);
        p.stops.forEach((c, i) => { if (i < 7) setTweak(`gradientStop${i + 1}`, c); });
    };

    const bgProps = {
        cosmicIntensity: t.cosmicIntensity,
        starDensity: t.starDensity,
        starTwinkle: t.starTwinkle,
        scanIntensity: t.scanIntensity,
        scanLineCount: t.scanLineCount,
        scanSpeed: t.scanSpeed,
        ctaColor: t.ctaColor,
        ctaFlashRate: t.ctaFlashRate,
    };

    // Key beats to show per preset (keep canvas readable)
    const beatIdx = [0, 2, 4, 5, 6, 7, 9];

    return (
        <>
            <DesignCanvas>

                <DCSection id="live" title="Live mixer · custom theme"
                    subtitle="Use the Tweaks panel to mix any color × font combo, and edit the moving rainbow gradient. The player below reflects the active theme.">
                    <DCArtboard id="player-live" label={`Live · ${t.colorTheme} · ${t.fontTheme}`} width={360} height={720}>
                        <ReelPlayer width={360} autoPlay={t.autoPlay} speed={t.speed} colorTheme={t.colorTheme} fontTheme={t.fontTheme} gradientStops={liveStops} gradientSpeed={t.gradientSpeed} bgProps={bgProps} />
                    </DCArtboard>
                </DCSection>

                {PRESET_PAIRS.map((p) => (
                    <DCSection key={p.id} id={`preset-${p.id}`} title={p.name} subtitle={p.desc}>
                        <DCArtboard id={`hdr-${p.id}`} label="Theme" width={260} height={170}>
                            <PresetHeader preset={p} />
                        </DCArtboard>
                        <DCArtboard id={`live-${p.id}`} label="Animated" width={300} height={620}>
                            <ReelPlayer width={300} autoPlay={t.autoPlay} speed={t.speed} colorTheme={p.color} fontTheme={p.font} bgProps={bgProps} />
                        </DCArtboard>
                        {beatIdx.map((i) => (
                            <DCArtboard key={i} id={`${p.id}-${i}`}
                                label={`${String(i + 1).padStart(2, '0')} · ${REEL_FRAMES[i].beat}`}
                                width={260} height={462}>
                                <StoryFrame index={i} colorTheme={p.color} fontTheme={p.font} bgProps={bgProps} />
                            </DCArtboard>
                        ))}
                    </DCSection>
                ))}

            </DesignCanvas>

            <TweaksPanel>
                <TweakSection label="Theme — mix any combo" />
                <TweakSelect label="Color" value={t.colorTheme}
                    options={colorOpts.map(k => ({ value: k, label: COLOR_THEMES[k].label }))}
                    onChange={(v) => setTweak('colorTheme', v)} />
                <TweakSelect label="Font" value={t.fontTheme}
                    options={fontOpts.map(k => ({ value: k, label: FONT_THEMES[k].label }))}
                    onChange={(v) => setTweak('fontTheme', v)} />

                <TweakSection label="Rainbow gradient" />
                <GradientPreview stops={liveStops} speed={t.gradientSpeed} />
                <TweakSelect label="Preset" value={t.gradientPreset}
                    options={Object.keys(GRADIENT_PRESETS).map(k => ({ value: k, label: GRADIENT_PRESETS[k].label }))}
                    onChange={applyPreset} />
                <TweakSlider label="Stops" value={stopCount} min={2} max={7} step={1}
                    onChange={(v) => setTweak('gradientStopCount', v)} />
                <TweakSlider label="Flow speed" value={t.gradientSpeed} min={0} max={4} step={0.1} unit="×"
                    onChange={(v) => setTweak('gradientSpeed', v)} />
                {allStopKeys.slice(0, stopCount).map((k, i) => (
                    <TweakColor key={k} label={`Stop ${i + 1}`} value={t[k]}
                        onChange={(v) => setTweak(k, v)} />
                ))}

                <TweakSection label="Cosmic — starfield + nebula" />
                <TweakSlider label="Nebula glow" value={t.cosmicIntensity} min={0} max={2} step={0.05} unit="×"
                    onChange={(v) => setTweak('cosmicIntensity', v)} />
                <TweakSlider label="Star density" value={t.starDensity} min={0} max={160} step={1}
                    onChange={(v) => setTweak('starDensity', v)} />
                <TweakSlider label="Star twinkle" value={t.starTwinkle} min={0} max={2} step={0.05} unit="×"
                    onChange={(v) => setTweak('starTwinkle', v)} />

                <TweakSection label="Scan waves — drifting lines" />
                <TweakSlider label="Brightness" value={t.scanIntensity} min={0} max={2} step={0.05} unit="×"
                    onChange={(v) => setTweak('scanIntensity', v)} />
                <TweakSlider label="Line count" value={t.scanLineCount} min={1} max={8} step={1}
                    onChange={(v) => setTweak('scanLineCount', v)} />
                <TweakSlider label="Drift speed" value={t.scanSpeed} min={0} max={3} step={0.05} unit="×"
                    onChange={(v) => setTweak('scanSpeed', v)} />

                <TweakSection label="Playback" />
                <TweakSlider label="Speed" value={t.speed} min={0.25} max={2} step={0.25} unit="×"
                    onChange={(v) => setTweak('speed', v)} />
                <TweakToggle label="Auto-play" value={t.autoPlay}
                    onChange={(v) => setTweak('autoPlay', v)} />

                <TweakSection label="CTA Button" />
                <TweakColor label="Button Color" value={t.ctaColor} onChange={(v) => setTweak('ctaColor', v)} />
                <TweakSlider label="Flash Rate" value={t.ctaFlashRate} min={0} max={10} step={0.5} unit="hz" onChange={(v) => setTweak('ctaFlashRate', v)} />

                <TweakSection label="About" />
                <div style={{ fontSize: 11, lineHeight: 1.5, color: 'rgba(41,38,27,0.75)' }}>
                    {colorOpts.length} color palettes × {fontOpts.length} fonts (incl. cyberpunk: Orbitron, Audiowide, Rajdhani, VT323, Monoton, Syncopate, Bungee, Unica One). Edit the moving rainbow gradient with any number of stops, pick a preset, or change individual colors.
                </div>
            </TweaksPanel>
        </>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
