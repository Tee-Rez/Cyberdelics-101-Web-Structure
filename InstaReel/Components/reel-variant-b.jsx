// Variant — Cyberdelics 101 reel, themed by COLOR_THEMES × FONT_THEMES

const TX = (s, font) => font.upper ? s.toUpperCase() : s;

// CosmicBg + frame chrome moved to reel-backgrounds.jsx (multiple variants).

function Hud({ beat, n, totalT, C, F }) {
    return (
        <>
            <div style={{
                position: 'absolute', top: 56, left: 60, right: 60,
                display: 'flex', justifyContent: 'flex-end',
                fontFamily: F.body, fontSize: 22, letterSpacing: F.trackingHud, color: C.dim
            }}>
                <span>CYBERDELIC // ACADEMY</span>
            </div>
        </>
    );
}

const dispShadow = (C) => `2px 0 ${C.accent}, -2px 0 ${C.accent2}, 0 0 32px ${C.primary}66`;

function FHook({ frame, local, C, F }) {
    const text = frame.lines.join(' ');
    const shown = Math.floor(text.length * Math.min(1, local / 0.55));
    const cursor = Math.floor(local * 4) % 2 === 0;
    return (
        <div style={{ position: 'absolute', inset: '0 70px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: F.body, fontSize: 26, letterSpacing: '0.22em', color: C.accent, marginBottom: 44, textShadow: `0 0 14px ${C.accent}` }}>&gt; TRANSMISSION.START</div>
            <div style={{
                fontFamily: F.display, fontWeight: F.displayWeight,
                fontStyle: F.italic ? 'italic' : 'normal',
                fontSize: F.display.includes('Fraunces') || F.display.includes('Instrument') ? 110 : 90,
                lineHeight: 1.06, letterSpacing: F.tracking, color: C.ink,
                textTransform: F.upper ? 'uppercase' : 'none',
                textShadow: dispShadow(C),
            }}>{TX(text.slice(0, shown), F)}<span style={{ color: C.primary, opacity: cursor ? 1 : 0 }}>█</span></div>
        </div>
    );
}

function FTurn({ frame, local, C, F }) {
    return (
        <div style={{ position: 'absolute', inset: '0 70px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30 }}>
            {frame.lines.map((l, i) => {
                const t = Math.max(0, Math.min(1, (local - i * 0.14) / 0.4));
                const isLast = i === frame.lines.length - 1;
                return (
                    <div key={i} style={{
                        fontFamily: F.display, fontWeight: F.displayWeight,
                        fontStyle: F.italic ? 'italic' : 'normal',
                        fontSize: 96, lineHeight: 1.04, letterSpacing: F.tracking,
                        textTransform: F.upper ? 'uppercase' : 'none',
                        color: isLast ? 'transparent' : C.ink,
                        background: isLast ? C.rainbow : 'none',
                        WebkitBackgroundClip: isLast ? 'text' : 'initial',
                        backgroundClip: isLast ? 'text' : 'initial',
                        clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`,
                        textShadow: isLast ? 'none' : dispShadow(C),
                    }}>&gt; {TX(l, F)}</div>
                );
            })}
        </div>
    );
}

function FName({ frame, local, localGrad = local, C, F }) {
    const eT = entryT(local, 0.3);
    return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ fontFamily: F.body, fontSize: 26, letterSpacing: '0.32em', color: C.dim, marginBottom: 32 }}>[ DEFINE ]</div>
            <div style={{
                fontFamily: F.display, fontWeight: F.displayWeight,
                fontStyle: F.italic ? 'italic' : 'normal',
                fontSize: 118, letterSpacing: F.tracking, textAlign: 'center',
                maxWidth: '92%', wordBreak: 'break-word',
                color: 'transparent', background: C.rainbow, backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                backgroundPosition: `${localGrad * 200}% 50%`,
                transform: `scale(${0.9 + eT * 0.1})`,
                filter: `drop-shadow(2px 0 0 ${C.accent}99) drop-shadow(-2px 0 0 ${C.accent2}99) drop-shadow(0 0 40px ${C.primary}66)`,
            }}>{F.upper ? frame.word : frame.word.charAt(0) + frame.word.slice(1).toLowerCase()}</div>
            <div style={{ marginTop: 24, fontFamily: F.body, fontSize: 28, letterSpacing: '0.22em', color: C.primary, opacity: eT, textShadow: `0 0 14px ${C.primary}` }}>[ noun · plural ]</div>
            <div style={{ marginTop: 50, maxWidth: 880, textAlign: 'center', fontFamily: F.body, fontSize: 30, lineHeight: 1.45, color: C.ink, opacity: eT }}>
                cybernetics <span style={{ color: C.accent2 }}>+</span> psychedelics
            </div>
            <div style={{ marginTop: 14, maxWidth: 860, textAlign: 'center', fontFamily: F.body, fontSize: 24, lineHeight: 1.5, color: C.dim, opacity: eT }}>
                tech that catalyzes inner transformation.
            </div>
        </div>
    );
}

function FStack({ frame, local, C, F }) {
    return (
        <div style={{ position: 'absolute', inset: '0 70px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: F.body, fontSize: 26, letterSpacing: '0.22em', color: C.primary, marginBottom: 40, textShadow: `0 0 12px ${C.primary}` }}>{frame.caption} /</div>
            {frame.items.map((it, i) => {
                const t = Math.max(0, Math.min(1, (local - i * 0.14 - 0.08) / 0.4));
                const accent = [C.primary, C.accent, C.accent2, C.primary][i];
                return (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'baseline', gap: 30, padding: '12px 0',
                        borderBottom: `1px dashed ${C.border}`,
                        opacity: t, transform: `translateX(${(1 - t) * -30}px)`,
                    }}>
                        <span style={{ fontFamily: F.body, fontSize: 28, color: accent, minWidth: 76, textShadow: `0 0 10px ${accent}` }}>[{String(i + 1).padStart(2, '0')}]</span>
                        <span style={{
                            fontFamily: F.display, fontWeight: F.displayWeight,
                            fontStyle: F.italic ? 'italic' : 'normal',
                            fontSize: 102, lineHeight: 1, letterSpacing: F.tracking,
                            color: C.ink, textShadow: dispShadow(C),
                            textTransform: F.upper ? 'uppercase' : 'none',
                        }}>{TX(it, F)}</span>
                    </div>
                );
            })}
        </div>
    );
}

function FPurpose({ frame, local, localGrad = local, C, F }) {
    const eT = entryT(local, 0.3);
    return (
        <div style={{ position: 'absolute', inset: '0 70px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: F.body, fontSize: 26, letterSpacing: '0.22em', color: C.primary, marginBottom: 36, opacity: eT }}>// DESIGNED.TO.FACILITATE</div>
            {frame.items.map((it, i) => {
                const t = Math.max(0, Math.min(1, (local - i * 0.2 - 0.1) / 0.45));
                return (
                    <div key={i} style={{
                        fontFamily: F.display, fontWeight: F.displayWeight,
                        fontStyle: F.italic ? 'italic' : 'normal',
                        fontSize: 84, lineHeight: 1.14, letterSpacing: F.tracking,
                        color: 'transparent', background: C.rainbow, backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text', backgroundClip: 'text',
                        backgroundPosition: `${(localGrad + i * 0.2) * 100}% 50%`,
                        clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`,
                        textTransform: F.upper ? 'uppercase' : 'none',
                    }}>// {TX(it, F)}</div>
                );
            })}
            <div style={{
                marginTop: 56, padding: '22px 30px', border: `1.5px solid ${C.accent}`,
                fontFamily: F.body, fontSize: 28, letterSpacing: '0.12em', color: C.accent,
                alignSelf: 'flex-start', opacity: eT, textShadow: `0 0 12px ${C.accent}`,
                background: `${C.accent}10`,
            }}>{frame.caption}</div>
        </div>
    );
}

function FCourse({ frame, local, C, F }) {
    const eT = entryT(local, 0.3);
    return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 70px' }}>
            <div style={{ transform: `scale(${0.85 + eT * 0.15})`, opacity: eT, marginBottom: 24 }}>
                <NexusLogo size={300} showWordmark={false} glow={true} />
            </div>
            <div style={{
                fontFamily: F.display, fontWeight: F.displayWeight,
                fontStyle: F.italic ? 'italic' : 'normal',
                fontSize: 44, letterSpacing: '0.18em', color: C.ink,
                textAlign: 'center', opacity: eT, marginBottom: 70,
                textShadow: `0 0 18px ${C.primary}88`,
                textTransform: 'uppercase',
            }}>Cyberdelic Academy</div>
            <div style={{ fontFamily: F.body, fontSize: 24, letterSpacing: '0.4em', color: C.primary, marginBottom: 28, textShadow: `0 0 12px ${C.primary}` }}>[ COURSE.001 ]</div>
            <div style={{
                fontFamily: F.display, fontWeight: F.displayWeight,
                fontStyle: F.italic ? 'italic' : 'normal',
                fontSize: 124, lineHeight: 1, letterSpacing: F.tracking,
                color: C.ink, textAlign: 'center',
                textShadow: dispShadow(C),
                clipPath: `inset(0 ${(1 - eT) * 100}% 0 0)`,
                textTransform: F.upper ? 'uppercase' : 'none',
            }}>{TX(frame.title, F)}</div>
            <div style={{ marginTop: 32, fontFamily: F.body, fontSize: 28, letterSpacing: '0.18em', color: C.dim, textAlign: 'center', opacity: eT }}>{frame.sub}</div>
        </div>
    );
}

// Cache blob URLs across re-renders so we don't refetch.
const __videoBlobCache = (window.__videoBlobCache ||= new Map());

function useVideoBlobUrl(src) {
    const [url, setUrl] = React.useState(() => __videoBlobCache.get(src) || null);
    React.useEffect(() => {
        if (!src) { setUrl(null); return; }
        if (__videoBlobCache.has(src)) { setUrl(__videoBlobCache.get(src)); return; }
        let cancelled = false;
        fetch(src)
            .then(r => r.blob())
            .then(blob => {
                if (cancelled) return;
                const u = URL.createObjectURL(blob);
                __videoBlobCache.set(src, u);
                setUrl(u);
            })
            .catch(() => { });
        return () => { cancelled = true; };
    }, [src]);
    return url;
}

function MethodVideoFrame({ m, localSlot, eT, local, C, F }) {
    const videoUrl = m.video;

    return (
        <div style={{
            marginTop: 28,
            width: '100%',
            aspectRatio: '21 / 10',
            border: `2px solid ${C.primary}`,
            borderRadius: 14,
            background: `linear-gradient(180deg, ${C.bg}cc, ${C.bgDeep}cc)`,
            position: 'relative', overflow: 'hidden',
            boxShadow: `0 0 32px ${C.primary}55, inset 0 0 50px ${C.primary}1a`,
            opacity: eT,
        }}>
            {videoUrl && (
                <video
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.85,
                        zIndex: 1,
                        // Force hardware acceleration and high-quality scaling algorithms
                        imageRendering: 'high-quality',
                        transform: 'translateZ(0)',
                        WebkitTransform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                />
            )}
            {/* Subtle gradient overlay to ensure text/brackets pop */}
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, transparent 40%, ${C.bgDeep}cc 150%)`, zIndex: 2 }} />


        </div>
    );
}

function FMethods({ frame, local, C, F }) {
    // 4 methods, each surfaces for ~3s. With dur=12s, each method occupies 0.25 of local.
    const SLOT = 1 / 4;
    // Active method index based on local time
    const activeIdx = Math.min(3, Math.floor(local / SLOT));
    return (
        <div style={{ position: 'absolute', inset: '0 70px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: F.body, fontSize: 26, letterSpacing: '0.25em', color: C.primary, marginBottom: 32, textShadow: `0 0 12px ${C.primary}` }}>{frame.caption}</div>
            {/* Active method label + number */}
            {frame.items.map((m, i) => {
                if (i !== activeIdx) return null;
                const localSlot = (local - i * SLOT) / SLOT; // 0..1 within this method
                const eT = Math.max(0, Math.min(1, localSlot / 0.18));
                const xT = Math.max(0, Math.min(1, (1 - localSlot) / 0.12));
                return (
                    <div key={i}>
                        <div style={{
                            display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'baseline',
                            gap: 28, padding: '14px 0 0',
                            opacity: eT,
                            transform: `translateX(${(1 - eT) * 30}px) translateX(${xT === 0 ? 0 : 0}px)`,
                        }}>
                            <span style={{ fontFamily: F.body, fontSize: 44, fontWeight: 700, color: C.accent, textShadow: `0 0 10px ${C.accent}` }}>{m.n}</span>
                            <div>
                                <div style={{
                                    fontFamily: F.display, fontWeight: F.displayWeight,
                                    fontStyle: F.italic ? 'italic' : 'normal',
                                    fontSize: 86, lineHeight: 1, letterSpacing: F.tracking,
                                    color: 'transparent', background: C.rainbow, backgroundSize: '200% 100%',
                                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                                    backgroundPosition: `${(local + i * 0.5) * 200}% 50%`,
                                    textTransform: F.upper ? 'uppercase' : 'none',
                                }}>{TX(m.t, F)}</div>
                                <div style={{ marginTop: 10, fontFamily: F.body, fontSize: 24, letterSpacing: '0.22em', color: C.dim, textTransform: 'uppercase' }}>{m.sub}</div>
                            </div>
                        </div>
                        {/* Recording window — sized for ~21:10 landscape browser captures */}
                        <MethodVideoFrame m={m} localSlot={localSlot} eT={eT} local={local} C={C} F={F} />

                    </div>
                );
            })}
            {/* Step ticks removed per design request */}
        </div>
    );
}

function FModules({ frame, local, C, F }) {
    return (
        <div style={{ position: 'absolute', inset: '0 70px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: F.body, fontSize: 26, letterSpacing: '0.25em', color: C.primary, marginBottom: 32, textShadow: `0 0 12px ${C.primary}` }}>MODULES /</div>
            {frame.items.map((m, i) => {
                const t = Math.max(0, Math.min(1, (local - i * 0.13 - 0.08) / 0.4));
                return (
                    <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '120px 1fr auto', alignItems: 'baseline',
                        gap: 28, padding: '20px 0',
                        borderTop: `1px solid ${C.border}`,
                        opacity: t, transform: `translateX(${(1 - t) * 20}px)`,
                    }}>
                        <span style={{ fontFamily: F.body, fontSize: 44, fontWeight: 700, color: C.accent, textShadow: `0 0 10px ${C.accent}` }}>{m.n}</span>
                        <span style={{
                            fontFamily: F.display, fontWeight: F.displayWeight,
                            fontStyle: F.italic ? 'italic' : 'normal',
                            fontSize: 46, color: C.ink, letterSpacing: F.tracking,
                            textTransform: F.upper ? 'uppercase' : 'none',
                        }}>{TX(m.t, F)}</span>
                        <span style={{ fontFamily: F.body, fontSize: 24, color: C.primary, letterSpacing: '0.18em' }}>→</span>
                    </div>
                );
            })}
            <div style={{
                marginTop: 18, borderTop: `1px solid ${C.border}`, paddingTop: 22,
                fontFamily: F.body, fontSize: 26, color: C.accent2, letterSpacing: '0.18em', textShadow: `0 0 12px ${C.accent2}`
            }}>= FOUNDATION.INSTALLED</div>
        </div>
    );
}

function FAudience({ frame, local, C, F }) {
    const eT = entryT(local, 0.3);
    return (
        <div style={{ position: 'absolute', inset: '0 70px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: F.body, fontSize: 26, letterSpacing: '0.25em', color: C.primary, marginBottom: 36, textShadow: `0 0 12px ${C.primary}` }}>{frame.caption}</div>
            {frame.items.map((it, i) => {
                const t = Math.max(0, Math.min(1, (local - i * 0.09 - 0.08) / 0.35));
                const accent = [C.primary, C.accent, C.accent2, C.primary, C.accent, C.accent2, C.primary][i % 7];
                return (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'baseline', gap: 22, padding: '8px 0',
                        borderBottom: `1px solid ${C.border}`,
                        opacity: t, transform: `translateX(${(1 - t) * 20}px)`,
                    }}>
                        <span style={{ fontFamily: F.body, fontSize: 30, color: accent, textShadow: `0 0 10px ${accent}` }}>{'>'}</span>
                        <span style={{
                            fontFamily: F.display, fontWeight: F.displayWeight,
                            fontStyle: F.italic ? 'italic' : 'normal',
                            fontSize: 46, lineHeight: 1.05, color: C.ink, letterSpacing: F.tracking,
                            textTransform: F.upper ? 'uppercase' : 'none',
                        }}>{TX(it, F)}</span>
                    </div>
                );
            })}
            <div style={{
                marginTop: 28, padding: '18px 24px', background: C.rainbow,
                color: C.ctaBg, fontFamily: F.body, fontSize: 22, letterSpacing: '0.18em',
                alignSelf: 'flex-start', fontWeight: 700, opacity: eT, textTransform: 'uppercase'
            }}>NO PRIOR EXPERIENCE REQUIRED</div>
        </div>
    );
}

function FCta({ frame, local, localGrad = local, C, F, bgProps }) {
    const eT = entryT(local, 0.25);
    const flashRate = bgProps?.ctaFlashRate !== undefined ? bgProps.ctaFlashRate : 2.5;
    const ctaColor = bgProps?.ctaColor || C.primary;
    const blink = Math.floor(local * flashRate) % 2 === 0;
    const tagT = Math.max(0, Math.min(1, (local - 0.2) / 0.3));
    // Split tagline into two stacked lines: "From Altered States" / "To Altered Traits"
    const tagParts = (() => {
        if (!frame.tagline) return null;
        const cleaned = frame.tagline.replace(/\.$/, '');
        const idx = cleaned.toLowerCase().indexOf(' to ');
        if (idx === -1) return [cleaned];
        return [cleaned.slice(0, idx), cleaned.slice(idx + 1)]; // "To Altered Traits"
    })();
    return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '50px 60px 50px' }}>
            <div style={{ transform: `scale(${0.85 + eT * 0.15})`, opacity: eT, marginBottom: 44 }}>
                <NexusLogo size={300} showWordmark={false} glow={true} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 30 }}>
                {frame.triad.map((line, i) => {
                    const t = Math.max(0, Math.min(1, (local - i * 0.1 - 0.1) / 0.35));
                    // Highlight the LAST word (the period stays attached) with the moving gradient.
                    const m = line.match(/^(.*\s)(\S+?)([.!?]?)$/);
                    const lead = m ? m[1] : '';
                    const keyword = m ? m[2] : line;
                    const punct = m ? m[3] : '';
                    const baseStyle = {
                        fontFamily: F.display, fontWeight: F.displayWeight,
                        fontStyle: F.italic ? 'italic' : 'normal',
                        fontSize: 44, lineHeight: 1.1, letterSpacing: F.tracking,
                        textAlign: 'center',
                        textTransform: F.upper ? 'uppercase' : 'none',
                        clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`,
                    };
                    return (
                        <div key={i} style={baseStyle}>
                            <span style={{ color: C.ink, textShadow: dispShadow(C) }}>{TX(lead, F)}</span>
                            <span style={{
                                color: 'transparent', background: C.rainbow, backgroundSize: '300% 100%',
                                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                                backgroundPosition: `${(localGrad + i * 0.3) * 150}% 50%`,
                                filter: `drop-shadow(0 0 14px ${C.primary}66)`,
                            }}>{TX(keyword, F)}</span>
                            <span style={{ color: C.ink, textShadow: dispShadow(C) }}>{punct}</span>
                        </div>
                    );
                })}
            </div>
            {/* Tagline restored without '// the promise' */}
            {tagParts && (
                <div style={{
                    marginTop: 50,
                    marginBottom: 50,
                    opacity: tagT,
                    transform: `translateY(${(1 - tagT) * 14}px)`,
                    textAlign: 'center',
                    maxWidth: 960,
                }}>
                    <div style={{
                        display: 'flex', flexDirection: 'column', gap: 6,
                        fontFamily: F.display, fontWeight: F.displayWeight,
                        fontStyle: 'normal',
                        fontSize: 52, lineHeight: 1.1, letterSpacing: F.tracking,
                        color: 'transparent',
                        backgroundImage: C.rainbow,
                        WebkitBackgroundClip: 'text', backgroundClip: 'text',
                        backgroundSize: '300% 100%',
                        backgroundPosition: `${localGrad * 200}% 50%`,
                        textTransform: F.upper ? 'uppercase' : 'none',
                        filter: `drop-shadow(0 0 18px ${C.primary}88)`,
                        textShadow: `0 0 30px ${C.primary}33`,
                    }}>
                        {tagParts.map((line, i) => (
                            <div key={i}>{TX(line, F)}</div>
                        ))}
                    </div>
                </div>
            )}
            <div style={{
                padding: '24px 46px',
                background: blink ? ctaColor : 'transparent',
                border: `2px solid ${ctaColor}`,
                fontFamily: F.body, fontSize: 36, fontWeight: 700, letterSpacing: '0.18em',
                color: blink ? C.ctaBg : ctaColor,
                boxShadow: `0 0 ${blink ? 40 : 24}px ${ctaColor}99`,
            }}>{frame.secondary}</div>
            <div style={{ position: 'absolute', bottom: 70, left: 0, right: 0, textAlign: 'center', fontFamily: F.body, fontSize: 22, letterSpacing: '0.32em', color: C.dim }}>{frame.footer}</div>
        </div>
    );
}

function VariantB({ index, local, totalT = 0, colorTheme = 'prism', fontTheme = 'mono', gradientStops, gradientSpeed = 1, bgProps = {} }) {
    const C0 = COLOR_THEMES[colorTheme] || COLOR_THEMES.prism;
    const F = FONT_THEMES[fontTheme] || FONT_THEMES.mono;
    // override rainbow gradient if custom stops provided
    const C = gradientStops && gradientStops.length >= 2
        ? Object.assign({}, C0, { rainbow: buildGradient(gradientStops) })
        : C0;
    // pass animation speed via local-time multiplier on rainbow flow
    const localGrad = local * gradientSpeed;
    const frame = REEL_FRAMES[index];
    const Comp = { hook: FHook, turn: FTurn, name: FName, stack: FStack, purpose: FPurpose, course: FCourse, modules: FModules, methods: FMethods, audience: FAudience, cta: FCta }[frame.kind];
    return (
        <div style={{ position: 'absolute', inset: 0, background: C.bg, color: C.ink, overflow: 'hidden' }}>
            <ReelBg local={local} C={C} {...bgProps} />
            <Hud beat={frame.beat} n={index} totalT={totalT} C={C} F={F} />
            <Comp frame={frame} local={local} localGrad={localGrad} C={C} F={F} bgProps={bgProps} />
        </div>
    );
}

Object.assign(window, { VariantB });
