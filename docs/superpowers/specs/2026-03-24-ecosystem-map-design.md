# Ecosystem Living Map — Interactive Simulation Design Spec

**Date:** 2026-03-24
**Module:** Module 5 — The Cyberdelic Ecosystem
**Lesson:** Lesson 1 — Ecosystem Concept and Technology Providers
**Type:** Interactive Simulation (new engine)

---

## Overview

A SVG-based interactive network visualization where students explore all eight components of the cyberdelic ecosystem. Each component is represented as a node in an orbital network. Clicking a node zooms it to center and reveals a detail panel showing the component's role, key players, connections, challenge, and opportunity — all sourced directly from Module 5 lesson content. Students must visit all eight nodes to unlock the Continue button.

**Pedagogical goal:** Reinforce the systems-thinking framework introduced in Lesson 1's progressive disclosure. Students transition from reading about the eight components to actively exploring their interdependencies and current field status.

**Placement:** After `module_5_1_1_pd` (Thinking in Ecosystems), before `module_5_1_2_pd` (Hardware Manufacturers deep dive).

---

## File Structure

```
methods/interactive-simulation/
  ecosystem-map/
    ecosystem-map.js          ← SVG engine, registers to window.SimulationEngines
    ecosystem-map-data.js     ← 8 node definitions, connections, panel content
    ecosystem-map.css         ← panel styles, node glow states, zoom animations
```

---

## Architecture

### Engine Registration

```javascript
window.SimulationEngines['EcosystemMap'] = { ... }
window.EcosystemMapData = { ... }
```

Follows the identical pattern as `CyberdelicConvergence`. The base `interactive-simulation.js` framework handles dynamic script loading, animation loop, and container management.

### Engine Lifecycle

| Hook | Responsibility |
|---|---|
| `init(container, params, host)` | Clear container, create SVG, inject detail panel div, draw nodes/connections, start particles. Store `host` reference for completion signaling. |
| `update(dt, params)` | Advance particle positions, update glow pulses |
| `resize(width, height)` | Update SVG viewBox scaling, reposition panel (stack below SVG on mobile) |
| `destroy()` | Cancel animation frame, remove event listeners |

The `host` parameter is the `InteractiveSimulationFactory` instance. Store it on the engine object (`this.host = host`) for use in the completion gate.

### Key State

```javascript
isZoomed: false,
zoomedNode: null,
visitedNodes: new Set(),    // completion tracking
continueUnlocked: false,
particles: [],
host: null,                 // stored from init(container, params, host)
```

### No Slider Controls

This engine has no timeline or parameter sliders. Interaction is entirely click-driven.

Set these two properties on the engine object at the top level (same pattern as `CyberdelicConvergence`):

```javascript
window.SimulationEngines['EcosystemMap'] = {
    showPlaybackControls: false,
    config: [],              // no sliders — omitting this causes Play/Pause/Reset buttons to render
    defaults: {},
    // ... rest of engine
}
```

`showPlaybackControls: false` suppresses the Play/Pause/Reset button row. `config: []` ensures no slider controls are generated. Both must be explicitly set.

---

## Manifest Entry

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
}
```

**Important:** `"hideContinueButton": true` suppresses the framework's default Continue button. The engine self-manages the gate and calls `this.host.markComplete()` when `visitedNodes.size === 8`. Without this flag, `lesson-runner.js` renders Continue immediately — before all nodes are visited — defeating the gate entirely.

**Important:** The string `"EcosystemMap"` in `"engine"` must exactly match the key used in `window.SimulationEngines['EcosystemMap']`. A one-character mismatch causes silent failure (the engine polling loop never resolves).

Insert between `module_5_1_1_pd` and `module_5_1_2_pd` in `Modules/Module_5_TheCyberdelicEcosystem/Lesson_1_EcosystemConceptAndTechnologyProviders/Manifests/Combined-Lesson.json`.

---

## SVG Layout

- **ViewBox:** `0 0 500 460`
- **Center node:** (250, 230) — labeled "CYBERDELIC ECOSYSTEM"
- **Orbit radius:** 170px
- **Node radius:** 34px
- **8 nodes at exact 45° intervals** (starting top, clockwise):

| # | Component | Angle | Position | Color |
|---|---|---|---|---|
| ① | Technology Providers | 270° | (250, 60) | `#06b6d4` cyan |
| ② | Knowledge Producers | 315° | (370, 110) | `#6366f1` indigo |
| ③ | Clinical Practice | 0° | (420, 230) | `#a855f7` purple |
| ④ | Facilitators & Guides | 45° | (370, 350) | `#ec4899` pink |
| ⑤ | Users & Communities | 90° | (250, 400) | `#f59e0b` amber |
| ⑥ | Economic Infrastructure | 135° | (130, 350) | `#f97316` orange |
| ⑦ | Regulatory & Knowledge Sharing | 180° | (80, 230) | `#10b981` emerald |
| ⑧ | Educators & Trainers | 225° | (130, 110) | `#e879f9` fuchsia |

---

## Connections

**Spoke connections** (all nodes → center): 8 lines, each colored to the source node, base opacity 0.2.

**Lateral connections** (key interdependencies from lesson content):

| From | To | Rationale |
|---|---|---|
| ① Tech | ② Knowledge | Hardware capabilities define what researchers can study |
| ② Knowledge | ③ Clinical | Research findings drive clinical adoption |
| ③ Clinical | ④ Facilitators | Clinical protocols inform facilitation practice |
| ④ Facilitators | ⑤ Users | Facilitators are primary user contact point |
| ⑤ Users | ⑥ Economic | User base size drives subscription and investment viability |
| ⑥ Economic | ⑦ Regulatory | Funding and reimbursement interact with regulatory frameworks |
| ⑦ Regulatory | ⑧ Educators | Standards frameworks shape what training programs teach |
| ⑧ Educators | ④ Facilitators | Training programs produce the facilitator workforce |

All connection lines: glow layer (blurred) + sharp layer, same pattern as CyberdelicConvergence.

**On node zoom:** selected node's connections brighten to full opacity; all others dim to 10%.
**On zoom-out:** all connections return to base opacity.

---

## Particle System

- **Count:** 30–40 particles total across all connection paths
- **Rendering:** SVG `<circle>` elements (no canvas), updated via `cx/cy` in `update()` loop
- **Movement:** Each particle travels along its assigned line, wrapping back to origin on completion
- **Speed:** Randomized 0.03–0.06 units/frame at rest
- **Color:** Matches source node color
- **On node zoom:** particles on selected node's connections → 2× speed, full opacity; all other particles → fade out
- **On zoom-out:** all particles return to base state

**Center pulse:** A slow radial pulse ring emits from the center node on a 3-second interval (`<circle>` with expanding radius and fading opacity). Conveys "living system" quality without distraction.

---

## Detail Panel

Injected as a `<div>` alongside the SVG. On mobile (width < 600px), stacks below the SVG.

### Layout

```
┌─────────────────────────────────────────────┐
│ ● NODE TITLE              [✓ VISITED]        │  ← header
│   subtitle / category                        │
├──────────────────┬──────────────────────────┤
│ ROLE IN          │ ▼ KEY CHALLENGE           │
│ ECOSYSTEM        │ [red-tinted card]         │
│                  │                           │
│ KEY PLAYERS      │ ▲ KEY OPPORTUNITY         │
│ [chip tags]      │ [green-tinted card]       │
│                  │                           │
│ CONNECTS TO      │                           │
│ [chip tags]      │                           │
├──────────────────┴──────────────────────────┤
│ ⚡ Ripple fact (node-colored text)           │  ← footer
└─────────────────────────────────────────────┘
```

### Panel Content Per Node

**① Technology Providers** (`#06b6d4`)
- *Role:* Build the tools the entire field runs on. Every platform, research protocol, and clinical application depends on hardware manufacturers and software developers whose strategic decisions define the field's capability ceiling.
- *Key Players:* Meta Quest (77% market share), Apple Vision Pro, Pico/ByteDance, TRIPP, Healium, Guided Meditation VR, Supernatural, SoundSelf
- *Connects to:* ② Knowledge, ⑥ Economic, ⑦ Regulatory
- *Challenge:* Headsets weigh 500–650g, last 2–3 hours, and cause motion sickness in 10–30% of users. Fragmentation (Quest/Vision Pro/Pico incompatibility) multiplies developer costs and breaks research replication. Platform closures cascade: TRIPP's consumer shutdown disrupted 85,000 subscribers and multiple university research partnerships simultaneously.
- *Opportunity:* Sub-400g headsets, 4K per-eye resolution, and $199 price points are 2–3 years out. Eye-tracking opens new biofeedback channels. AI-personalized real-time environments are emerging as a distinct capability layer.
- *Ripple:* Every hardware spec decision — battery life, tracking precision, price point — ripples to developers, researchers, practitioners, and investors. The field's capability ceiling is set here.

**② Knowledge Producers** (`#6366f1`)
- *Role:* Validate effectiveness and establish safety. Their peer-reviewed findings are the credibility infrastructure the entire ecosystem depends on — giving clinical practitioners, investors, and regulators the evidence base to act.
- *Key Players:* Stanford VHIL (100+ papers), Imperial College London (Carhart-Harris), Univ. Barcelona EVENT Lab (Mel Slater), Johns Hopkins (MEQ), Catholic Univ. Milan (Riva 2025), Monash University
- *Connects to:* ③ Clinical, ① Tech, ⑥ Economic, ⑦ Regulatory
- *Challenge:* The research pipeline takes 2–5 years from hypothesis to publication. Nearly all studies measure outcomes at 1–4 weeks. Evidence base is overwhelmingly WEIRD (Western, Educated, Industrialized, Rich, Democratic).
- *Opportunity:* Riva's 2025 study (Dialogues in Clinical Neuroscience) demonstrated cyberdelic VR produces effects comparable to LSD and psilocybin at therapeutic doses. 5-year outcome studies would answer every serious clinician's key question and accelerate insurance reimbursement.
- *Ripple:* A single landmark study can shift investor sentiment, update facilitator training curricula, open regulatory pathways, and reshape developer priorities simultaneously.

**③ Clinical Practice** (`#a855f7`)
- *Role:* Translate research into real patient care. Psychologists, OTs, psychiatrists, and palliative care providers are already using VR for anxiety, PTSD, chronic pain, and end-of-life work. Their adoption signals to insurers and regulators that the technology has genuine therapeutic value.
- *Key Players:* RelieVRx/AppliedVR (FDA De Novo), XRHealth (Medicare HCPCS E1905), Limbix (FDA Breakthrough: adolescent depression), Oxford VR, Psious
- *Connects to:* ② Knowledge, ④ Facilitators, ⑥ Economic, ⑦ Regulatory
- *Challenge:* Insurance reimbursement is narrow — only RelieVRx and XRHealth have established pathways. Clinical continuity expectations make platform closures far more disruptive than consumer churn. Overclaiming outcomes risks burning credibility with the medical establishment.
- *Opportunity:* Commercial insurers historically follow Medicare coverage within 3–7 years. Multiple FDA Breakthrough Device designations in progress for anxiety, treatment-resistant depression, and addiction. Hospital VR programs scaling from pilots.
- *Ripple:* FDA clearance for a VR therapy device immediately validates the field to insurers, attracts clinical investment, and signals to every other developer that the regulatory pathway is navigable.

**④ Facilitators & Guides** (`#ec4899`)
- *Role:* The field's primary human point of contact. Non-clinical facilitators manage preparation, presence, and integration — and often determine whether a user becomes a long-term practitioner or a one-time curiosity.
- *Key Players:* Cyberdelic Nexus (certification pathway), Cyberdelic Society (global events), Multiversity, VRAR Association, individual practitioners
- *Connects to:* ③ Clinical, ⑤ Users, ⑧ Educators
- *Challenge:* Legal scope is undefined — what non-licensed facilitators can offer varies by state and has no federal codification. Liability for adverse events is unresolved. No recognized credential exists yet.
- *Opportunity:* Facilitators now engaging in professional association formation are literally writing the field's governance. Full-time income of $40,000–$100,000+ is achievable within 18–36 months. AI-assisted facilitation tools could expand reach beyond what any individual can serve alone.
- *Ripple:* As training matures and ethics standards crystallize, the facilitator pathway becomes legible to regulators and insurers — unlocking reimbursement and institutional access that currently requires a clinical license.

**⑤ Users & Communities** (`#f59e0b`)
- *Role:* Generate real-world feedback and cultural momentum. Users are the foundation every other pathway builds on — their experiences validate platforms and produce the firsthand accounts that no researcher or developer claim can replicate in credibility.
- *Key Players:* Cyberdelic Society (Europe, N. America, Australia), Reddit r/cyberdelics, Discord peer networks, Cyberdelic Hackathon Berlin, facilitator circles (4–8 person peer groups)
- *Connects to:* ④ Facilitators, ② Knowledge, ① Tech
- *Challenge:* User base skews overwhelmingly affluent, educated, and tech-comfortable. First-year cost of $700–$1,300 excludes most of the world. Only ~15 million VR headsets in active use globally. Geographic concentration in coastal US and European hubs limits research generalizability.
- *Opportunity:* Users with genuine experiences are the field's most credible ambassadors. Community infrastructure for storytelling, peer mentorship, and public advocacy could multiply cultural reach at minimal institutional cost.
- *Ripple:* User communities surface real-world effects — both positive and adverse — that researchers haven't yet studied, feeding directly back into knowledge production and platform development cycles.

**⑥ Economic Infrastructure** (`#f97316`)
- *Role:* Determine which ideas get resources to develop. Every platform, research program, and training organization depends on some form of economic model to survive.
- *Key Players:* SOSV/XRC Labs (VR accelerator), NIH, NSF, Heffter & Fetzer Institutes, TRIPP ($11.2M Series A, 2022), Calm ($2B) · Headspace ($3B) as precedent
- *Connects to:* ① Tech, ② Knowledge, ③ Clinical, ⑦ Regulatory
- *Challenge:* Consumer subscription model is unproven at scale — TRIPP's closure (85,000 subscribers) showed subscription-only revenue concentrates all survival risk in the most volatile model when hardware adoption lags. Regulatory uncertainty propagates investor hesitancy to next-generation platforms.
- *Opportunity:* Corporate wellness is the fastest near-term market. XRHealth's Medicare milestone (HCPCS E1905) and RelieVRx's FDA authorization established the reimbursement precedent — each new milestone de-risks the category for the next platform.
- *Ripple:* A single insurance reimbursement expansion unlocks a scalable revenue model that VC investment and clinical adoption rapidly follow — breaking the investor-hesitancy loop constraining the field's growth.

**⑦ Regulatory & Knowledge Sharing** (`#10b981`)
- *Role:* Enable safe practice and information flow. Without clear regulatory frameworks, clinical tools can't reach patients. Without knowledge-sharing infrastructure, validated insights stay siloed.
- *Key Players:* FDA (Class I/II/III, Breakthrough Designation), EU MDR/UKCA/Health Canada, IVRHA, PLOS ONE, Frontiers in VR, PRESENCE, IEEE VR, MAPS, SAND, SIGGRAPH, ISO (VR safety standards)
- *Connects to:* ① Tech, ② Knowledge, ③ Clinical, ⑥ Economic
- *Challenge:* Device classification re-opens with every new capability. GDPR applies to EU citizens regardless of company location, creating data localization costs most small teams can't absorb. Post-Brexit UK/EU divergence adds a parallel certification layer.
- *Opportunity:* Professional associations developing voluntary standards build the demonstrated-responsibility track record that encourages regulators toward clear frameworks. Each clear FDA pathway signals the next developer that the route is navigable.
- *Ripple:* A single clear regulatory classification removes uncertainty for developers and investors simultaneously — one decision unblocks multiple ecosystem components at once.

**⑧ Educators & Trainers** (`#e879f9`)
- *Role:* Translate research and clinical evidence into practitioner-ready skills. Without educators, the knowledge produced by researchers stays inaccessible to facilitators and clinicians — and the field can't scale safely beyond its first generation.
- *Key Players:* Cyberdelic Nexus (40–100 hr certification), Multiversity, VRAR Association, university programs (forming), online platforms
- *Connects to:* ④ Facilitators, ③ Clinical, ② Knowledge, ⑤ Users
- *Challenge:* Training programs vary widely (40–100 hours, no standardization). No credential is recognized by insurance networks yet. First-generation practitioners risk aging out before systematic mentorship transfers their knowledge. Publication lag means curricula can lag 2–4 years behind best current evidence.
- *Opportunity:* Practitioner certification becoming an insurance-recognized credential simultaneously elevates quality, expands facilitator income, and makes the field legible to healthcare systems. Medical schools are beginning to add VR therapeutics to curricula.
- *Ripple:* Standardized training raises the quality floor for every facilitator and clinician — protecting users and making the field readable to regulators and insurers who need consistent standards before they act.

---

## Completion Gate

- **Trigger:** `visitedNodes.size === 8`
- **Mechanism:** Engine calls `this.host.markComplete()` — the same pattern used by TesseractExplorer and SpectrumExplorer. This triggers the `instance.on('complete', ...)` listener in `lesson-runner.js` which advances the lesson.
- **Zoom-out:** Clicking the SVG background (`e.target === this.svg`) zooms out — same pattern as CyberdelicConvergence. This must be set up in `init()` via `this.svg.addEventListener('click', ...)`.
- **Visual feedback:** Progress indicator turns green, displays "✓ All 8 visited — Continue unlocked"

```javascript
// In _onNodeVisited() after adding to visitedNodes:
if (this.visitedNodes.size === 8 && !this.continueUnlocked) {
    this.continueUnlocked = true;
    this.host.markComplete();
}
```

---

## Mobile Behavior

- Below 600px width: detail panel stacks below SVG
- SVG text scales up (same responsive pattern as CyberdelicConvergence `resize()`)
- Node radius may reduce to 28px to maintain spacing on small viewports

---

## Script Registration in universal-player.html

Both new files and the CSS must be added to `universal-player.html` — the framework's `checkEngine()` polling loop only resolves if the engine script has already executed. Add these entries in the same order as other engines:

```html
<!-- Ecosystem Map -->
<link rel="stylesheet" href="../methods/interactive-simulation/ecosystem-map/ecosystem-map.css">
<script src="../methods/interactive-simulation/ecosystem-map/ecosystem-map-data.js"></script>
<script src="../methods/interactive-simulation/ecosystem-map/ecosystem-map.js"></script>
```

The data file must load before the engine file (engine depends on `window.EcosystemMapData` being present at registration time).

---

## Node Data Schema

`ecosystem-map-data.js` exports `window.EcosystemMapData`. Each node in the `nodes` array follows this structure:

```javascript
window.EcosystemMapData = {
    nodes: [
        {
            id: 'tech',                          // unique string key
            label: 'TECHNOLOGY\nPROVIDERS',      // SVG text (use \n for line break)
            color: '#06b6d4',                    // hex color for stroke, fill-opacity, particles
            angle: 270,                          // degrees, clockwise from top
            role: 'Build the tools...',          // plain text, 1-2 sentences
            players: [                           // array of plain strings
                'Meta Quest (77% market share)',
                'Apple Vision Pro',
                // ...
            ],
            connections: ['knowledge', 'economic', 'regulatory'],  // ids of connected nodes
            challenge: 'Headsets weigh 500–650g...', // plain text
            opportunity: 'Sub-400g headsets...',     // plain text
            ripple: 'Every hardware spec decision...' // plain text, prefixed with ⚡ in render
        },
        // ... 7 more nodes
    ],
    lateralConnections: [
        { source: 'tech', target: 'knowledge' },
        // ... 7 more pairs (see Connections section)
    ]
};
```

`players`, `challenge`, `opportunity`, and `ripple` are plain strings — no HTML. The panel renderer applies styling.

---

## What This Simulation Is NOT

- It is not a quiz or assessment tool
- It does not have slider parameters or a timeline
- It does not use canvas — SVG only
- It does not introduce new data not grounded in Module 5 lesson content