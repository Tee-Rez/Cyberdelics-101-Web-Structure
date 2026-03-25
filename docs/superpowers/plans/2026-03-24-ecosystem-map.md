# Ecosystem Living Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a SVG-based interactive network simulation where students explore all 8 cyberdelic ecosystem components, unlock a detail panel per node, and call `host.markComplete()` after visiting all 8.

**Architecture:** Pure SVG engine registered to `window.SimulationEngines['EcosystemMap']`, following the CyberdelicConvergence pattern exactly. A sibling DOM `<div>` panel renders node detail content. No canvas, no external libraries.

**Tech Stack:** Vanilla JavaScript, SVG DOM API, CSS transitions. No build tools.

---

## Codebase Orientation

Before starting, read these files to understand the existing patterns:

- `methods/interactive-simulation/interactive-simulation.js` — base framework; understand `init(container, params, host)`, `update(dt, params)`, `showPlaybackControls`, `config`, and how `host.markComplete()` is called
- `methods/interactive-simulation/cyberdelic-convergence/cyberdelic-convergence.js` — the closest existing engine; copy SVG setup, node creation, connection drawing, particle system, and zoom interaction patterns from here
- `methods/interactive-simulation/cyberdelic-convergence/cyberdelic-data.js` — data file pattern to follow
- `Modules/universal-player.html` — where CSS links and script tags must be added (lines 27–33 for CSS, lines 99–105 for scripts)
- `Modules/Module_5_TheCyberdelicEcosystem/Lesson_1_EcosystemConceptAndTechnologyProviders/Manifests/Combined-Lesson.json` — where the manifest entry is inserted (between `module_5_1_1_pd` and `module_5_1_2_pd`)

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `methods/interactive-simulation/ecosystem-map/ecosystem-map-data.js` | All node data: positions, colors, panel content |
| Create | `methods/interactive-simulation/ecosystem-map/ecosystem-map.css` | Panel layout, glow states, visited badge, progress bar, mobile |
| Create | `methods/interactive-simulation/ecosystem-map/ecosystem-map.js` | SVG engine: init, draw, zoom, particles, completion gate |
| Create | `methods/interactive-simulation/ecosystem-map/test-ecosystem-map.html` | Standalone test harness |
| Modify | `Modules/universal-player.html` | Add CSS link + 2 script tags |
| Modify | `Modules/Module_5_TheCyberdelicEcosystem/Lesson_1_EcosystemConceptAndTechnologyProviders/Manifests/Combined-Lesson.json` | Insert manifest module entry |

---

## Task 1: Data File

**Files:**
- Create: `methods/interactive-simulation/ecosystem-map/ecosystem-map-data.js`

- [ ] **Step 1: Create the data file with all 8 nodes and connections**

```javascript
/**
 * Ecosystem Map - Static Data
 * All panel content sourced from Module 5 lesson manifests.
 */
(function () {
    window.EcosystemMapData = {

        // SVG layout constants
        svg: { width: 500, height: 460, cx: 250, cy: 230 },
        orbitRadius: 170,
        nodeRadius: 34,

        nodes: [
            {
                id: 'tech',
                label: 'TECHNOLOGY\nPROVIDERS',
                color: '#06b6d4',
                angle: 270,
                subtitle: 'Hardware · Software · Open Source',
                role: 'Build the tools the entire field runs on. Every platform, research protocol, and clinical application depends on hardware manufacturers and software developers whose strategic decisions define the field\'s capability ceiling.',
                players: ['Meta Quest (77% share)', 'Apple Vision Pro', 'Pico / ByteDance', 'TRIPP', 'Healium', 'Guided Meditation VR'],
                connections: ['knowledge', 'economic', 'regulatory'],
                challenge: 'Headsets weigh 500–650g, last 2–3 hours, and cause motion sickness in 10–30% of users. Fragmentation (Quest/Vision Pro/Pico incompatibility) multiplies developer costs and breaks research replication. TRIPP\'s consumer shutdown disrupted 85,000 subscribers and multiple university research partnerships simultaneously.',
                opportunity: 'Sub-400g headsets, 4K per-eye resolution, and $199 price points are 2–3 years out. Eye-tracking opens new biofeedback channels. AI-personalized real-time environments are emerging as a distinct capability layer.',
                ripple: 'Every hardware spec decision — battery life, tracking precision, price point — ripples to developers, researchers, practitioners, and investors. The field\'s capability ceiling is set here.'
            },
            {
                id: 'knowledge',
                label: 'KNOWLEDGE\nPRODUCERS',
                color: '#6366f1',
                angle: 315,
                subtitle: 'Research Institutions · Academics · Publications',
                role: 'Validate effectiveness and establish safety. Their peer-reviewed findings are the credibility infrastructure the entire ecosystem depends on — giving clinical practitioners, investors, and regulators the evidence base to act.',
                players: ['Stanford VHIL (100+ papers)', 'Imperial College (Carhart-Harris)', 'Univ. Barcelona (Mel Slater)', 'Johns Hopkins (MEQ)', 'Catholic Univ. Milan (Riva 2025)', 'Monash University'],
                connections: ['clinical', 'tech', 'economic', 'regulatory'],
                challenge: 'The research pipeline takes 2–5 years from hypothesis to publication. Nearly all studies measure outcomes at 1–4 weeks. Evidence base is overwhelmingly WEIRD (Western, Educated, Industrialized, Rich, Democratic).',
                opportunity: 'Riva\'s 2025 study (Dialogues in Clinical Neuroscience) demonstrated cyberdelic VR produces effects comparable to LSD and psilocybin at therapeutic doses. 5-year outcome studies would answer every serious clinician\'s key question and accelerate insurance reimbursement.',
                ripple: 'A single landmark study can shift investor sentiment, update facilitator training curricula, open regulatory pathways, and reshape developer priorities simultaneously.'
            },
            {
                id: 'clinical',
                label: 'CLINICAL\nPRACTICE',
                color: '#a855f7',
                angle: 0,
                subtitle: 'Therapists · Psychiatrists · Healthcare Systems',
                role: 'Translate research into real patient care. Their adoption signals to insurers and regulators that the technology has genuine therapeutic value.',
                players: ['RelieVRx / AppliedVR (FDA De Novo)', 'XRHealth (Medicare E1905)', 'Limbix (FDA Breakthrough)', 'Oxford VR', 'Psious'],
                connections: ['knowledge', 'facilitators', 'economic', 'regulatory'],
                challenge: 'Insurance reimbursement is narrow — only RelieVRx and XRHealth have established pathways. Clinical continuity expectations make platform closures far more disruptive than consumer churn. Overclaiming outcomes risks burning credibility with the medical establishment.',
                opportunity: 'Commercial insurers historically follow Medicare coverage within 3–7 years. Multiple FDA Breakthrough Device designations in progress for anxiety, treatment-resistant depression, and addiction. Hospital VR programs scaling from pilots.',
                ripple: 'FDA clearance for a VR therapy device immediately validates the field to insurers, attracts clinical investment, and signals to every other developer that the regulatory pathway is navigable.'
            },
            {
                id: 'facilitators',
                label: 'FACILITATORS\n& GUIDES',
                color: '#ec4899',
                angle: 45,
                subtitle: 'Wellness Practitioners · Guides · Retreat Leaders',
                role: 'The field\'s primary human point of contact. Non-clinical facilitators manage preparation, presence, and integration — and often determine whether a user becomes a long-term practitioner or a one-time curiosity.',
                players: ['Cyberdelic Nexus (certification)', 'Cyberdelic Society (global events)', 'Multiversity', 'VRAR Association'],
                connections: ['clinical', 'users', 'educators'],
                challenge: 'Legal scope is undefined — what non-licensed facilitators can offer varies by state and has no federal codification. Liability for adverse events is unresolved. No recognized credential exists yet.',
                opportunity: 'Facilitators engaging in professional association formation are writing the field\'s governance. Full-time income of $40,000–$100,000+ is achievable within 18–36 months. AI-assisted tools could expand reach beyond what any individual can serve.',
                ripple: 'As training matures and ethics standards crystallize, the facilitator pathway becomes legible to regulators and insurers — unlocking reimbursement and institutional access that currently requires a clinical license.'
            },
            {
                id: 'users',
                label: 'USERS &\nCOMMUNITIES',
                color: '#f59e0b',
                angle: 90,
                subtitle: 'Personal Practitioners · Peer Networks · Early Adopters',
                role: 'Generate real-world feedback and cultural momentum. Users are the foundation every other pathway builds on — their experiences validate platforms and produce firsthand accounts no researcher or developer claim can replicate.',
                players: ['Cyberdelic Society', 'Reddit r/cyberdelics', 'Discord peer networks', 'Cyberdelic Hackathon Berlin'],
                connections: ['facilitators', 'knowledge', 'tech'],
                challenge: 'User base skews overwhelmingly affluent, educated, and tech-comfortable. First-year cost of $700–$1,300 excludes most of the world. Only ~15 million VR headsets in active use globally.',
                opportunity: 'Users with genuine experiences are the field\'s most credible ambassadors. Community infrastructure for storytelling, peer mentorship, and public advocacy could multiply cultural reach at minimal institutional cost.',
                ripple: 'User communities surface real-world effects — both positive and adverse — that researchers haven\'t yet studied, feeding directly back into knowledge production and platform development cycles.'
            },
            {
                id: 'economic',
                label: 'ECONOMIC\nINFRA',
                color: '#f97316',
                angle: 135,
                subtitle: 'Venture Capital · Angels · Grants · Business Models',
                role: 'Determine which ideas get resources to develop. Every platform, research program, and training organization depends on some form of economic model to survive.',
                players: ['SOSV / XRC Labs', 'NIH, NSF', 'Heffter & Fetzer Institutes', 'TRIPP ($11.2M Series A)', 'Calm ($2B) · Headspace ($3B)'],
                connections: ['tech', 'knowledge', 'clinical', 'regulatory'],
                challenge: 'Consumer subscription model is unproven at scale — TRIPP\'s closure (85,000 subscribers) showed subscription-only revenue concentrates all survival risk in the most volatile model. Regulatory uncertainty propagates investor hesitancy.',
                opportunity: 'Corporate wellness is the fastest near-term market. XRHealth\'s Medicare milestone (HCPCS E1905) and RelieVRx\'s FDA authorization established the reimbursement precedent — each new milestone de-risks the category for the next platform.',
                ripple: 'A single insurance reimbursement expansion unlocks a scalable revenue model that VC investment and clinical adoption rapidly follow — breaking the investor-hesitancy loop constraining the field\'s growth.'
            },
            {
                id: 'regulatory',
                label: 'REGULATORY\n& KNOWLEDGE',
                color: '#10b981',
                angle: 180,
                subtitle: 'FDA · EU MDR · Associations · Journals · Conferences',
                role: 'Enable safe practice and information flow. Without clear regulatory frameworks, clinical tools can\'t reach patients. Without knowledge-sharing infrastructure, validated insights stay siloed.',
                players: ['FDA (Breakthrough Designation)', 'EU MDR / UKCA / Health Canada', 'IVRHA', 'PLOS ONE · Frontiers in VR', 'IEEE VR · MAPS · SAND'],
                connections: ['tech', 'knowledge', 'clinical', 'economic'],
                challenge: 'Device classification re-opens with every new capability. GDPR applies to EU citizens regardless of company location. Post-Brexit UK/EU divergence adds a parallel certification layer most small teams can\'t absorb.',
                opportunity: 'Professional associations developing voluntary standards build the demonstrated-responsibility track record that encourages clear frameworks. Each clear FDA pathway signals the next developer that the route is navigable.',
                ripple: 'A single clear regulatory classification removes uncertainty for developers and investors simultaneously — one decision unblocks multiple ecosystem components at once.'
            },
            {
                id: 'educators',
                label: 'EDUCATORS\n& TRAINERS',
                color: '#e879f9',
                angle: 225,
                subtitle: 'Training Programs · Certification Bodies · Curricula',
                role: 'Translate research and clinical evidence into practitioner-ready skills. Without educators, knowledge produced by researchers stays inaccessible to facilitators and clinicians — the field can\'t scale safely beyond its first generation.',
                players: ['Cyberdelic Nexus (40–100 hr cert)', 'Multiversity', 'VRAR Association', 'University programs (forming)'],
                connections: ['facilitators', 'clinical', 'knowledge', 'users'],
                challenge: 'Training programs vary widely (40–100 hours, no standardization). No credential recognized by insurance networks yet. First-generation practitioners risk aging out before systematic mentorship transfers their knowledge.',
                opportunity: 'Practitioner certification becoming an insurance-recognized credential simultaneously elevates quality, expands facilitator income, and makes the field legible to healthcare systems. Medical schools are beginning to add VR therapeutics to curricula.',
                ripple: 'Standardized training raises the quality floor for every facilitator and clinician — protecting users and making the field readable to regulators and insurers who need consistent standards before they act.'
            }
        ],

        // Lateral connections (bidirectional pairs)
        lateralConnections: [
            { source: 'tech',         target: 'knowledge'    },
            { source: 'knowledge',    target: 'clinical'     },
            { source: 'clinical',     target: 'facilitators' },
            { source: 'facilitators', target: 'users'        },
            { source: 'users',        target: 'economic'     },
            { source: 'economic',     target: 'regulatory'   },
            { source: 'regulatory',   target: 'educators'    },
            { source: 'educators',    target: 'facilitators' }
        ]
    };
})();
```

- [ ] **Step 2: Verify data loads in browser console**

Open `methods/interactive-simulation/ecosystem-map/test-ecosystem-map.html` (created in Task 4). In the browser console run:
```javascript
console.log(window.EcosystemMapData.nodes.length); // Expected: 8
console.log(window.EcosystemMapData.lateralConnections.length); // Expected: 8
```

- [ ] **Step 3: Commit**

```bash
git add methods/interactive-simulation/ecosystem-map/ecosystem-map-data.js
git commit -m "feat: add ecosystem-map-data.js with 8 node definitions"
```

---

## Task 2: CSS File

**Files:**
- Create: `methods/interactive-simulation/ecosystem-map/ecosystem-map.css`

- [ ] **Step 1: Create the CSS file**

```css
/* ============================================
   ECOSYSTEM MAP - Simulation Styles
   ============================================ */

/* Wrapper: SVG + panel side by side */
.ecosystem-map-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    gap: 0;
    align-items: stretch;
}

/* SVG takes up left portion */
.ecosystem-map-svg-container {
    flex: 1 1 60%;
    min-width: 0;
    position: relative;
}

.ecosystem-map-svg-container svg {
    width: 100%;
    height: 100%;
    cursor: default;
}

/* Detail panel — hidden until a node is selected */
.ecosystem-map-panel {
    flex: 0 0 40%;
    max-width: 340px;
    background: #0a1628;
    border-left: 1px solid #1e293b;
    display: flex;
    flex-direction: column;
    opacity: 0;
    transform: translateX(20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
    overflow: hidden;
}

.ecosystem-map-panel.visible {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
}

/* Panel header */
.em-panel-header {
    padding: 12px 14px;
    border-bottom: 1px solid #1e293b;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.em-panel-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}

.em-panel-title {
    font-family: 'Orbitron', monospace;
    font-size: 11px;
    font-weight: bold;
    letter-spacing: 1px;
    flex: 1;
}

.em-panel-subtitle {
    color: #475569;
    font-size: 10px;
    margin-top: 2px;
}

.em-visited-badge {
    background: rgba(52, 211, 153, 0.15);
    border: 1px solid #34d399;
    color: #34d399;
    font-size: 9px;
    padding: 2px 7px;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s;
    white-space: nowrap;
}

.em-visited-badge.show {
    opacity: 1;
}

/* Panel body */
.em-panel-body {
    flex: 1;
    padding: 12px 14px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    overflow-y: auto;
}

.em-section-label {
    color: #475569;
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
}

.em-role-text {
    color: #94a3b8;
    font-size: 11px;
    line-height: 1.6;
}

/* Player chips */
.em-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.em-chip {
    background: #1e293b;
    border: 1px solid #334155;
    color: #94a3b8;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 9px;
}

/* Challenge / Opportunity cards */
.em-challenge-card {
    background: rgba(248, 113, 113, 0.07);
    border: 1px solid rgba(248, 113, 113, 0.2);
    border-radius: 6px;
    padding: 8px;
    color: #fca5a5;
    font-size: 10px;
    line-height: 1.6;
}

.em-opportunity-card {
    background: rgba(52, 211, 153, 0.07);
    border: 1px solid rgba(52, 211, 153, 0.2);
    border-radius: 6px;
    padding: 8px;
    color: #6ee7b7;
    font-size: 10px;
    line-height: 1.6;
}

/* Ripple footer */
.em-panel-footer {
    padding: 8px 14px;
    border-top: 1px solid #1e293b;
    background: #060d1a;
    font-size: 10px;
    line-height: 1.5;
    flex-shrink: 0;
}

/* Progress bar */
.em-progress-bar-container {
    position: absolute;
    bottom: 8px;
    left: 8px;
    right: 8px;
    background: #1e293b;
    border-radius: 4px;
    height: 4px;
    overflow: hidden;
}

.em-progress-bar-fill {
    height: 100%;
    background: #06b6d4;
    border-radius: 4px;
    width: 0%;
    transition: width 0.4s ease, background 0.3s ease;
}

.em-progress-bar-fill.complete {
    background: #34d399;
}

/* Node hover cursor */
.ecosystem-node {
    cursor: pointer;
}

.ecosystem-node circle {
    transition: fill-opacity 0.2s, stroke-width 0.2s;
}

.ecosystem-node.dimmed {
    opacity: 0.15;
    pointer-events: none;
}

.ecosystem-node.active circle {
    stroke-width: 3;
    fill-opacity: 0.3;
}

/* Mobile: stack panel below SVG */
@media (max-width: 600px) {
    .ecosystem-map-wrapper {
        flex-direction: column;
    }

    .ecosystem-map-svg-container {
        flex: 0 0 55%;
    }

    .ecosystem-map-panel {
        flex: 0 0 45%;
        max-width: 100%;
        border-left: none;
        border-top: 1px solid #1e293b;
        transform: translateY(20px);
    }

    .ecosystem-map-panel.visible {
        transform: translateY(0);
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add methods/interactive-simulation/ecosystem-map/ecosystem-map.css
git commit -m "feat: add ecosystem-map.css"
```

---

## Task 3: Engine Skeleton — SVG Init & Node/Connection Drawing

**Files:**
- Create: `methods/interactive-simulation/ecosystem-map/ecosystem-map.js`

This task builds the static visual: SVG with 8 nodes, spokes, and lateral connections. No interaction yet.

- [ ] **Step 1: Create the engine file with init, SVG setup, and static drawing**

```javascript
/**
 * Ecosystem Map - Simulation Engine
 * Registers to window.SimulationEngines['EcosystemMap']
 * Follows CyberdelicConvergence pattern.
 */
(function () {
    window.SimulationEngines = window.SimulationEngines || {};

    const DATA = window.EcosystemMapData;

    window.SimulationEngines['EcosystemMap'] = {
        name: 'Ecosystem Map',
        showPlaybackControls: false,
        config: [],
        defaults: {},

        // Instance state
        svg: null,
        panel: null,
        nodePositions: [],
        particles: [],
        pulseTimer: 0,
        isZoomed: false,
        zoomedNodeId: null,
        visitedNodes: new Set(),
        continueUnlocked: false,
        host: null,

        init: function (container, params, host) {
            this.host = host;

            // Reset state (in case of re-init)
            this.isZoomed = false;
            this.zoomedNodeId = null;
            this.visitedNodes = new Set();
            this.continueUnlocked = false;
            this.particles = [];
            this.pulseTimer = 0;

            // Build wrapper
            container.innerHTML = '';
            const wrapper = document.createElement('div');
            wrapper.className = 'ecosystem-map-wrapper';
            container.appendChild(wrapper);

            // SVG container
            const svgContainer = document.createElement('div');
            svgContainer.className = 'ecosystem-map-svg-container';
            wrapper.appendChild(svgContainer);

            // SVG element
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', `0 0 ${DATA.svg.width} ${DATA.svg.height}`);
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            svg.style.background = 'radial-gradient(circle at center, rgba(6,182,212,0.06) 0%, rgba(8,13,20,0) 70%)';
            svgContainer.appendChild(svg);
            this.svg = svg;

            // Click background to zoom out
            svg.addEventListener('click', (e) => {
                if (e.target === svg) this._zoomOut();
            });

            // Detail panel
            const panel = document.createElement('div');
            panel.className = 'ecosystem-map-panel';
            panel.innerHTML = this._panelTemplate();
            wrapper.appendChild(panel);
            this.panel = panel;

            // Progress bar container (in SVG container, absolute positioned)
            const pbContainer = document.createElement('div');
            pbContainer.className = 'em-progress-bar-container';
            pbContainer.innerHTML = '<div class="em-progress-bar-fill" id="em-progress-fill"></div>';
            svgContainer.appendChild(pbContainer);

            // Calculate node positions
            this._calculatePositions();

            // Draw static elements (order matters for z-layering)
            this._drawConnections();
            this._drawCenterNode();
            this._drawNodes();
            this._initParticles();
        },

        _calculatePositions: function () {
            this.nodePositions = DATA.nodes.map(node => {
                const rad = (node.angle * Math.PI) / 180;
                return {
                    ...node,
                    x: DATA.svg.cx + DATA.orbitRadius * Math.cos(rad),
                    y: DATA.svg.cy + DATA.orbitRadius * Math.sin(rad)
                };
            });
        },

        _drawCenterNode: function () {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.id = 'em-center-node';

            // Outer glow ring
            const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            glow.setAttribute('cx', DATA.svg.cx);
            glow.setAttribute('cy', DATA.svg.cy);
            glow.setAttribute('r', 40);
            glow.setAttribute('fill', 'rgba(6,182,212,0.1)');
            glow.setAttribute('stroke', '#06b6d4');
            glow.setAttribute('stroke-width', 1.5);
            glow.style.filter = 'drop-shadow(0 0 8px rgba(6,182,212,0.5))';
            g.appendChild(glow);

            // Inner ring
            const inner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            inner.setAttribute('cx', DATA.svg.cx);
            inner.setAttribute('cy', DATA.svg.cy);
            inner.setAttribute('r', 28);
            inner.setAttribute('fill', 'rgba(6,182,212,0.06)');
            inner.setAttribute('stroke', '#06b6d4');
            inner.setAttribute('stroke-width', 0.5);
            g.appendChild(inner);

            // Pulse ring (animated in update())
            const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            pulse.id = 'em-center-pulse';
            pulse.setAttribute('cx', DATA.svg.cx);
            pulse.setAttribute('cy', DATA.svg.cy);
            pulse.setAttribute('r', 40);
            pulse.setAttribute('fill', 'none');
            pulse.setAttribute('stroke', '#06b6d4');
            pulse.setAttribute('stroke-width', 1);
            pulse.setAttribute('opacity', 0);
            g.appendChild(pulse);

            // Labels
            ['CYBERDELIC', 'ECOSYSTEM'].forEach((line, i) => {
                const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                txt.textContent = line;
                txt.setAttribute('x', DATA.svg.cx);
                txt.setAttribute('y', DATA.svg.cy + (i === 0 ? -5 : 8));
                txt.setAttribute('text-anchor', 'middle');
                txt.setAttribute('fill', '#06b6d4');
                txt.setAttribute('font-size', 7);
                txt.setAttribute('font-family', 'Orbitron, monospace');
                txt.setAttribute('font-weight', 'bold');
                txt.style.pointerEvents = 'none';
                g.appendChild(txt);
            });

            this.svg.appendChild(g);
        },

        _drawConnections: function () {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.id = 'em-connections';

            // Spoke connections (node → center)
            this.nodePositions.forEach(node => {
                this._addConnectionLine(g, node.x, node.y, DATA.svg.cx, DATA.svg.cy, node.color, `spoke-${node.id}`);
            });

            // Lateral connections — IDs encode both node IDs for visibility matching
            DATA.lateralConnections.forEach(conn => {
                const src = this.nodePositions.find(n => n.id === conn.source);
                const tgt = this.nodePositions.find(n => n.id === conn.target);
                if (!src || !tgt) return;
                // ID encodes both endpoints: "lateral-tech-knowledge"
                this._addConnectionLine(g, src.x, src.y, tgt.x, tgt.y, src.color, `lateral-${conn.source}-${conn.target}`);
            });

            this.svg.appendChild(g);
        },

        // Particle/pulse stubs — implemented fully in Task 6
        _initParticles: function () {},
        _updateParticles: function (dt) {},
        _updateCenterPulse: function (dt) {},

        _addConnectionLine: function (parent, x1, y1, x2, y2, color, id) {
            // Glow layer
            const glow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            glow.id = `em-conn-glow-${id}`;
            glow.setAttribute('x1', x1); glow.setAttribute('y1', y1);
            glow.setAttribute('x2', x2); glow.setAttribute('y2', y2);
            glow.setAttribute('stroke', color);
            glow.setAttribute('stroke-width', 4);
            glow.setAttribute('opacity', 0.08);
            glow.style.filter = 'blur(3px)';
            parent.appendChild(glow);

            // Sharp layer
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.id = `em-conn-${id}`;
            line.setAttribute('x1', x1); line.setAttribute('y1', y1);
            line.setAttribute('x2', x2); line.setAttribute('y2', y2);
            line.setAttribute('stroke', color);
            line.setAttribute('stroke-width', 0.8);
            line.setAttribute('opacity', 0.2);
            parent.appendChild(line);
        },

        _drawNodes: function () {
            this.nodePositions.forEach(node => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.classList.add('ecosystem-node');
                g.dataset.id = node.id;

                // Circle
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', node.x);
                circle.setAttribute('cy', node.y);
                circle.setAttribute('r', DATA.nodeRadius);
                circle.setAttribute('fill', node.color);
                circle.setAttribute('fill-opacity', 0.15);
                circle.setAttribute('stroke', node.color);
                circle.setAttribute('stroke-width', 2);
                circle.style.filter = `drop-shadow(0 0 6px ${node.color}40)`;
                g.appendChild(circle);

                // Label lines
                const lines = node.label.split('\n');
                lines.forEach((line, i) => {
                    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    txt.classList.add('em-node-label');
                    txt.textContent = line;
                    txt.setAttribute('x', node.x);
                    txt.setAttribute('y', node.y + (i - (lines.length - 1) / 2) * 13);
                    txt.setAttribute('text-anchor', 'middle');
                    txt.setAttribute('dominant-baseline', 'middle');
                    txt.setAttribute('fill', node.color);
                    txt.setAttribute('font-size', 7.5);
                    txt.setAttribute('font-family', 'Orbitron, monospace');
                    txt.setAttribute('font-weight', 'bold');
                    txt.style.pointerEvents = 'none';
                    g.appendChild(txt);
                });

                // Click handler
                g.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this._selectNode(node.id);
                });

                this.svg.appendChild(g);
            });
        },

        update: function (dt, params) {
            this._updateParticles(dt);
            this._updateCenterPulse(dt);
        },

        resize: function (width, height) {
            // SVG scales via viewBox/preserveAspectRatio — no action needed for basic resize
            // On mobile breakpoint, CSS handles panel stacking
        },

        destroy: function () {
            // Framework cancels the animation frame; just null refs
            this.svg = null;
            this.panel = null;
            this.particles = [];
            this.host = null;
        }
    };
})();
```

- [ ] **Step 2: Open test harness (created in Task 4), verify 8 nodes and connections render**

All 8 colored nodes should appear at their correct positions with spokes to center and lateral dashed connections. No interaction yet.

- [ ] **Step 3: Commit**

```bash
git add methods/interactive-simulation/ecosystem-map/ecosystem-map.js
git commit -m "feat: ecosystem-map engine skeleton — SVG init, nodes, connections"
```

---

## Task 4: Test Harness

**Files:**
- Create: `methods/interactive-simulation/ecosystem-map/test-ecosystem-map.html`

This harness lets you test the engine in isolation without loading a full lesson manifest.

- [ ] **Step 1: Create the test harness**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test: Ecosystem Map</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../core/styles.css">
    <link rel="stylesheet" href="../interactive-simulation.css">
    <link rel="stylesheet" href="ecosystem-map.css">
    <style>
        body { margin: 0; background: #080d14; }
        #container {
            width: 100vw;
            height: 100vh;
            display: flex;
        }
        #sim-container {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div id="container">
        <div id="sim-container"></div>
    </div>

    <script src="ecosystem-map-data.js"></script>
    <script src="ecosystem-map.js"></script>
    <script>
        const engine = window.SimulationEngines['EcosystemMap'];
        const container = document.getElementById('sim-container');

        // Mock host object — simulates what interactive-simulation.js provides
        const mockHost = {
            markComplete: function () {
                console.log('[TEST] markComplete() called — all 8 nodes visited!');
                document.body.style.borderTop = '4px solid #34d399';
            }
        };

        engine.init(container, {}, mockHost);

        // Run animation loop
        let last = 0;
        function loop(ts) {
            const dt = ts - last;
            last = ts;
            engine.update(dt, {});
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);

        // Expose for console debugging
        window.engine = engine;
    </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser, verify renders without errors**

Open `methods/interactive-simulation/ecosystem-map/test-ecosystem-map.html` directly in a browser (or via `python -m http.server 8000` from the project root). Expected: 8 colored nodes visible, no console errors.

- [ ] **Step 3: Commit**

```bash
git add methods/interactive-simulation/ecosystem-map/test-ecosystem-map.html
git commit -m "feat: add ecosystem-map test harness"
```

---

## Task 5: Click Interaction & Detail Panel

**Files:**
- Modify: `methods/interactive-simulation/ecosystem-map/ecosystem-map.js`

Add `_selectNode()`, `_zoomOut()`, `_updateConnections()`, and panel population methods.

- [ ] **Step 1: Add interaction methods to the engine object**

Add these methods to `window.SimulationEngines['EcosystemMap']` (before `update:`):

```javascript
_selectNode: function (id) {
    // Toggle off if already selected
    if (this.isZoomed && this.zoomedNodeId === id) {
        this._zoomOut();
        return;
    }

    this.isZoomed = true;
    this.zoomedNodeId = id;

    // Dim all other nodes
    this.svg.querySelectorAll('.ecosystem-node').forEach(g => {
        if (g.dataset.id === id) {
            g.classList.remove('dimmed');
            g.classList.add('active');
        } else {
            g.classList.add('dimmed');
            g.classList.remove('active');
        }
    });

    // Update connection visibility
    this._updateConnectionVisibility(id);

    // Show panel
    this._populatePanel(id);
    this.panel.classList.add('visible');

    // Track visit
    const wasNew = !this.visitedNodes.has(id);
    this.visitedNodes.add(id);
    if (wasNew) this._updateProgress();

    // Completion check
    if (this.visitedNodes.size === 8 && !this.continueUnlocked) {
        this.continueUnlocked = true;
        this.host.markComplete();
    }
},

_zoomOut: function () {
    this.isZoomed = false;
    this.zoomedNodeId = null;

    // Restore all nodes
    this.svg.querySelectorAll('.ecosystem-node').forEach(g => {
        g.classList.remove('dimmed', 'active');
    });

    // Restore all connections to base opacity
    this._updateConnectionVisibility(null);

    // Hide panel
    this.panel.classList.remove('visible');
},

_updateConnectionVisibility: function (activeNodeId) {
    const conns = this.svg.querySelector('#em-connections');
    if (!conns) return;

    conns.querySelectorAll('line').forEach(line => {
        const id = line.id;
        // e.g. "em-conn-spoke-tech", "em-conn-glow-spoke-tech",
        //      "em-conn-lateral-tech-knowledge", "em-conn-glow-lateral-tech-knowledge"
        const isGlow = id.includes('-glow-');

        if (!activeNodeId) {
            line.setAttribute('opacity', isGlow ? 0.08 : 0.2);
            return;
        }

        // Both spoke and lateral IDs contain the node ID string — this now works
        // for spokes ("spoke-tech") and laterals ("lateral-tech-knowledge" / "lateral-educators-facilitators")
        const involves = id.includes(`-${activeNodeId}`);
        if (involves) {
            line.setAttribute('opacity', isGlow ? 0.3 : 0.8);
        } else {
            line.setAttribute('opacity', 0.03);
        }
    });
},

_populatePanel: function (id) {
    const node = DATA.nodes.find(n => n.id === id);
    if (!node) return;

    const p = this.panel;
    const wasVisited = this.visitedNodes.has(id); // already added before this call

    p.querySelector('.em-panel-dot').style.background = node.color;
    p.querySelector('.em-panel-dot').style.boxShadow = `0 0 6px ${node.color}`;
    p.querySelector('.em-panel-title').style.color = node.color;
    p.querySelector('.em-panel-title').textContent = node.label.replace('\n', ' ');
    p.querySelector('.em-panel-subtitle').textContent = node.subtitle;
    p.querySelector('.em-role-text').textContent = node.role;
    p.querySelector('.em-challenge-card').textContent = node.challenge;
    p.querySelector('.em-opportunity-card').textContent = node.opportunity;
    p.querySelector('.em-panel-footer').innerHTML =
        `<span style="color:${node.color}">⚡ ${node.ripple}</span>`;

    // Players chips
    p.querySelector('.em-players-chips').innerHTML =
        node.players.map(pl => `<span class="em-chip">${pl}</span>`).join('');

    // Connections chips
    p.querySelector('.em-connections-chips').innerHTML =
        node.connections.map(cid => {
            const cn = DATA.nodes.find(n => n.id === cid);
            return cn ? `<span class="em-chip" style="border-color:${cn.color}40;color:${cn.color}">${cn.label.replace('\n', ' ')}</span>` : '';
        }).join('');

    // Visited badge
    const badge = p.querySelector('.em-visited-badge');
    badge.classList.toggle('show', wasVisited);
},

_updateProgress: function () {
    const fill = document.getElementById('em-progress-fill');
    if (!fill) return;
    const pct = (this.visitedNodes.size / 8) * 100;
    fill.style.width = pct + '%';
    if (this.visitedNodes.size === 8) fill.classList.add('complete');
},

_panelTemplate: function () {
    return `
        <div class="em-panel-header">
            <div class="em-panel-dot"></div>
            <div>
                <div class="em-panel-title"></div>
                <div class="em-panel-subtitle"></div>
            </div>
            <div class="em-visited-badge">✓ VISITED</div>
        </div>
        <div class="em-panel-body">
            <div>
                <div class="em-section-label">Role in Ecosystem</div>
                <div class="em-role-text"></div>
                <div class="em-section-label" style="margin-top:10px;">Key Players</div>
                <div class="em-chips em-players-chips"></div>
                <div class="em-section-label" style="margin-top:10px;">Connects To</div>
                <div class="em-chips em-connections-chips"></div>
            </div>
            <div>
                <div class="em-section-label">▼ Key Challenge</div>
                <div class="em-challenge-card"></div>
                <div class="em-section-label" style="margin-top:10px;">▲ Key Opportunity</div>
                <div class="em-opportunity-card"></div>
            </div>
        </div>
        <div class="em-panel-footer"></div>
    `;
},
```

- [ ] **Step 2: Test in harness — click each node**

Open `test-ecosystem-map.html`. Click each node:
- Panel should slide in with correct content
- Clicked node should glow; others should dim
- Active node's connections should brighten
- Clicking background should close panel and restore all nodes
- Clicking the same node again should close panel (toggle)

- [ ] **Step 3: Test visited badge and progress bar**

Click 4 nodes. Revisit one. Expected:
- Each first-visit node shows `✓ VISITED` badge on its second opening
- Progress bar fills to 50% (4/8)
- Bar stays at 50% when revisiting an already-visited node

- [ ] **Step 4: Test completion**

Click all 8 nodes. Expected:
- Progress bar turns green
- Browser console shows `[TEST] markComplete() called — all 8 nodes visited!`
- Green top border appears on the page (from mock host)

- [ ] **Step 5: Commit**

```bash
git add methods/interactive-simulation/ecosystem-map/ecosystem-map.js
git commit -m "feat: ecosystem-map click interaction, panel population, completion gate"
```

---

## Task 6: Particle System & Center Pulse

**Files:**
- Modify: `methods/interactive-simulation/ecosystem-map/ecosystem-map.js`

- [ ] **Step 1: Add particle init, update, and center pulse methods**

Add these methods to the engine object:

```javascript
_initParticles: function () {
    this.particles = [];
    const allConns = [
        ...this.nodePositions.map(n => ({
            x1: n.x, y1: n.y,
            x2: DATA.svg.cx, y2: DATA.svg.cy,
            color: n.color,
            nodeId: n.id
        })),
        ...DATA.lateralConnections.map(conn => {
            const src = this.nodePositions.find(n => n.id === conn.source);
            const tgt = this.nodePositions.find(n => n.id === conn.target);
            return { x1: src.x, y1: src.y, x2: tgt.x, y2: tgt.y, color: src.color, nodeId: src.id };
        })
    ];

    // Distribute ~30 particles across connections
    for (let i = 0; i < 30; i++) {
        const conn = allConns[i % allConns.length];
        this.particles.push({
            x1: conn.x1, y1: conn.y1,
            x2: conn.x2, y2: conn.y2,
            color: conn.color,
            nodeId: conn.nodeId,
            progress: Math.random(),  // stagger start positions
            speed: 0.003 + Math.random() * 0.003,
            baseSpeed: 0.003 + Math.random() * 0.003
        });
    }

    // Create SVG group for particles
    let g = this.svg.getElementById('em-particle-group');
    if (!g) {
        g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.id = 'em-particle-group';
        // Insert before center node so particles appear behind it
        const centerNode = this.svg.getElementById('em-center-node');
        this.svg.insertBefore(g, centerNode);
    }
},

_updateParticles: function (dt) {
    const g = this.svg.getElementById('em-particle-group');
    if (!g) return;
    g.innerHTML = '';

    this.particles.forEach(p => {
        // Accelerate particles on active node's connections when zoomed
        const isActive = this.isZoomed && p.nodeId === this.zoomedNodeId;
        p.speed = isActive ? p.baseSpeed * 2 : p.baseSpeed;

        p.progress += p.speed;
        if (p.progress > 1) p.progress -= 1;

        const opacity = this.isZoomed && !isActive ? 0.1 : (0.6 - p.progress * 0.4);

        const cx = p.x1 + (p.x2 - p.x1) * p.progress;
        const cy = p.y1 + (p.y2 - p.y1) * p.progress;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', 2);
        circle.setAttribute('fill', p.color);
        circle.setAttribute('opacity', opacity);
        g.appendChild(circle);
    });
},

_updateCenterPulse: function (dt) {
    this.pulseTimer += dt;
    const period = 3000; // 3 second cycle
    const progress = (this.pulseTimer % period) / period;

    const pulse = this.svg.getElementById('em-center-pulse');
    if (!pulse) return;

    const r = 40 + progress * 30;  // expand from 40 to 70
    const opacity = (1 - progress) * 0.4;
    pulse.setAttribute('r', r);
    pulse.setAttribute('opacity', opacity);
},
```

- [ ] **Step 2: Test particle animation in harness**

Open `test-ecosystem-map.html`. Expected:
- Small colored dots traverse along spoke and lateral connection lines
- Center pulse ring slowly expands and fades every 3 seconds
- When a node is clicked, its particles speed up; others fade

- [ ] **Step 3: Commit**

```bash
git add methods/interactive-simulation/ecosystem-map/ecosystem-map.js
git commit -m "feat: ecosystem-map particle system and center pulse animation"
```

---

## Task 7: Register in universal-player.html

**Files:**
- Modify: `Modules/universal-player.html`

- [ ] **Step 1: Add CSS link after existing simulation CSS links (line ~32)**

After the line:
```html
<link rel="stylesheet" href="../methods/interactive-simulation/presence-embodiment-sim/presence-embodiment-sim.css">
```

Add:
```html
<link rel="stylesheet" href="../methods/interactive-simulation/ecosystem-map/ecosystem-map.css">
```

- [ ] **Step 2: Add script tags after existing engine scripts (line ~105)**

After the line:
```html
<script src="../methods/interactive-simulation/presence-embodiment-sim/presence-embodiment-sim.js"></script>
```

Add:
```html
<script src="../methods/interactive-simulation/ecosystem-map/ecosystem-map-data.js"></script>
<script src="../methods/interactive-simulation/ecosystem-map/ecosystem-map.js"></script>
```

The data file must come before the engine file.

- [ ] **Step 3: Verify in universal-player.html that engine is found**

Open `Modules/universal-player.html` in browser with the test manifest. In console:
```javascript
console.log(window.SimulationEngines['EcosystemMap']); // Expected: object (not undefined)
```

- [ ] **Step 4: Commit**

```bash
git add Modules/universal-player.html
git commit -m "feat: register ecosystem-map engine in universal-player.html"
```

---

## Task 8: Manifest Entry

**Files:**
- Modify: `Modules/Module_5_TheCyberdelicEcosystem/Lesson_1_EcosystemConceptAndTechnologyProviders/Manifests/Combined-Lesson.json`

- [ ] **Step 1: Insert the simulation module between `module_5_1_1_pd` and `module_5_1_2_pd`**

Find the entry with `"id": "module_5_1_1_pd"` in the `modules` array. After its closing `}`, insert:

```json
{
    "id": "module_5_1_sim",
    "title": "The Cyberdelic Ecosystem: Living Map",
    "type": "interactive-simulation",
    "content": {
        "engine": "EcosystemMap",
        "title": "The Cyberdelic Ecosystem",
        "description": "Explore all eight ecosystem components. Click each node to understand its role, key players, challenge, and opportunity. Visit all eight to continue.",
        "hideContinueButton": true
    }
},
```

- [ ] **Step 2: Validate JSON is well-formed**

```bash
python -m json.tool "Modules/Module_5_TheCyberdelicEcosystem/Lesson_1_EcosystemConceptAndTechnologyProviders/Manifests/Combined-Lesson.json" > /dev/null && echo "JSON valid"
```

Expected output: `JSON valid`

- [ ] **Step 3: Test full lesson flow in universal-player.html**

Open `Modules/universal-player.html` and load the Lesson 1 manifest. Navigate through `module_5_1_1_pd` (progressive disclosure) to reach the simulation. Expected:
- Ecosystem map loads after the intro PD
- All 8 nodes visible
- Continue button is hidden until all 8 nodes visited
- After visiting all 8, the lesson advances normally

- [ ] **Step 4: Commit**

```bash
git add "Modules/Module_5_TheCyberdelicEcosystem/Lesson_1_EcosystemConceptAndTechnologyProviders/Manifests/Combined-Lesson.json"
git commit -m "feat: add ecosystem-map simulation to Module 5 Lesson 1 manifest"
```

---

## Done

All 8 tasks complete = full feature shipped:

| Task | Deliverable |
|---|---|
| 1 | `ecosystem-map-data.js` — all node content |
| 2 | `ecosystem-map.css` — layout, panel, states |
| 3 | Engine skeleton — SVG init, nodes, connections |
| 4 | Test harness for isolated development |
| 5 | Click interaction, panel, completion gate |
| 6 | Particle system, center pulse |
| 7 | Registered in `universal-player.html` |
| 8 | Manifest entry in Lesson 1 |