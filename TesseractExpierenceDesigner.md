# CYBERDELIC DESIGN DIMENSION EXPLORER
## Tesseract Experience Builder : Complete Design & Build Specification
### For AI Codebase Implementation

**Document Purpose:** This document describes the complete visual design, interaction behavior, component architecture, and build logic for the Cyberdelic Design Dimension Explorer simulation. It is written for an AI-assisted codebase to implement. No code is provided here : only precise descriptions of what to build, how it should behave, and why each decision was made.

**Platform Context:** React component embedded in Framer via GitHub. Purple/teal color palette. STAR Arts aesthetic : sacred geometry, mystical but technically precise, transparent layering, depth and dimensionality.

---

## SECTION 1 : THE CORE VISUAL CONCEPT

### The Tesseract as the Central Metaphor

The central visual element of this simulation is a tesseract : a four-dimensional hypercube projected into three-dimensional space and rendered on a two-dimensional screen. A standard tesseract projection shows an outer cube containing an inner cube, with all eight corners of the outer cube connected by edges to the corresponding eight corners of the inner cube. This creates twelve additional diagonal edges, giving the tesseract its characteristic look of a cube within a cube connected by converging lines.

In this implementation, the tesseract is adapted slightly. The outer cube has six faces. Each face is assigned to one of the six design dimensions : Reality, Sensory, Presence, States, Traits, Meaning. The inner cube is the seventh element : the core. It represents the coherence of the complete design. It only fully illuminates when all six dimensions have been filled in.

The tesseract should be rendered in genuine 3D space using a perspective projection, not a flat isometric representation. The back faces should appear smaller than the front faces. When the cube rotates to bring a face forward, the perspective should shift convincingly : the face moves toward the viewer, grows slightly, and the other faces recede. The inner cube remains fixed at the center regardless of rotation, always the same apparent size, always seen through the translucent outer faces.

### Why a Tesseract Works for This Content

The six design dimensions are not independent : they're interconnected faces of a single design object. The tesseract makes this tangible. When you look at any one face head-on, you can still see the other faces receding behind it. You can never see just one face in isolation : the others are always present, just further back. This is exactly the right metaphor for cyberdelic design : working on one dimension always happens in the context of all the others.

The inner cube represents the emergence of coherence : something that only becomes visible and luminous when all the outer faces are addressed. It's not there until all six are done, and then it becomes the most vivid thing in the whole structure.

---

## SECTION 2 : 3D RENDERING APPROACH

### Coordinate System

The tesseract lives in a 3D coordinate space with the center at the origin (0, 0, 0). The outer cube has a side length of 300 units. The inner cube has a side length of 120 units. Both cubes share the same center point.

The perspective camera is positioned at approximately (0, 0, 800) looking toward the origin. Field of view should be set to give a natural but slightly dramatic perspective : approximately 50 to 60 degrees. This makes the depth difference between front and back faces clearly visible without becoming so exaggerated that the geometry looks distorted.

### Rendering Technology

Three.js (r128, available via CDN) is the appropriate library for this implementation. It handles the 3D geometry, perspective camera, lighting, transparency, and smooth rotation animations natively.

The outer cube is built as six individual plane geometries (one per face) rather than as a BoxGeometry, because each face needs to be independently colored, selectable, and able to carry its own label and icon. Each plane is a flat rectangle positioned and rotated to form the six faces of a cube.

The inner cube is a single BoxGeometry with MeshStandardMaterial. Its material has a base emissive value set low when incomplete, ramping up to full luminance when all six outer faces are selected.

The connecting edges between the outer cube corners and inner cube corners are drawn as LineSegments or as thin TubeGeometry paths. Using TubeGeometry with a very small radius gives slightly better visual weight than LineSegments and catches the lighting more naturally.

### Face Assignment : Which Dimension Faces Which Direction

The six faces of the outer cube are assigned as follows:

- Front face (Z+) : Meaning. This is the face closest to the viewer in the default starting orientation. Meaning is the most important dimension and the one that stays most present visually.
- Back face (Z-) : Reality. The world the experience inhabits. Furthest from the viewer because it's the container that everything else sits within.
- Top face (Y+) : Presence. What the experience cultivates upward : the quality of awareness being developed.
- Bottom face (Y-) : Traits. What endures downward into the person's life after the experience ends.
- Right face (X+) : States. The transient consciousness shifts during the experience.
- Left face (X-) : Sensory. The perceptual channels through which the experience is received.

This assignment has spatial logic. The vertical axis (top/bottom) maps to the Presence/Traits pair : what's cultivated (up) versus what's built (down). The horizontal axis (left/right) maps to the Sensory/States pair : input channels (left, receiving) versus catalyzed states (right, generating). The depth axis (front/back) maps to Meaning/Reality : the soul of the design (front, facing you) versus the world context (back, the ground everything rests on).

### Materials and Transparency

Every outer face uses MeshStandardMaterial with the following material properties:

- Transparent set to true
- Opacity between 0.25 and 0.45 depending on state (see Section 4 for state-based opacity changes)
- A base color assigned to each dimension (see Section 3 for color assignments)
- Side set to DoubleSide so faces are visible from both inside and outside the cube
- Roughness set to 0.1 and metalness set to 0.3 for a slightly luminous, semi-crystalline look

The transparency is critical to the visual effect. When looking at the front face, you should be able to faintly see the inner cube through it, and even faintly see the back face through both the inner cube and the front face. The overlapping transparencies blend the dimension colors together in the regions where faces overlap in the 2D projection. This creates the sense that the dimensions are interpenetrating rather than separate.

The connecting edges between outer and inner cube corners use LineBasicMaterial with an opacity of 0.4 and a color that is a mix of white and the relevant face color.

The inner cube uses MeshStandardMaterial with emissive color set to a warm white-gold. When incomplete, emissiveIntensity is set to 0.05 : barely glowing, just present. When all six dimensions are complete, emissiveIntensity animates up to 1.0 over 800 milliseconds, and a soft point light inside the inner cube also activates, casting light outward through the translucent outer faces.

---

## SECTION 3 : COLOR SYSTEM

### Dimension Color Assignments

Each dimension has a primary color. These colors appear in the face material, in the dimension tab UI, in the option cards on the right panel, and in the generated experience summary.

- Reality : Deep cobalt blue (hex approximately #1A3A6B). The grounding world color. Cool, spatial, expansive.
- Sensory : Amber gold (#C4830A). Warm, perceptual, embodied. References the warmth of the senses.
- Presence : Teal (#0A7E6E). The awareness color. Neither warm nor cold. Clear.
- States : Electric violet (#6B2FA0). Transient, luminous, transformative.
- Traits : Jade green (#1A6B3A). Enduring, grown, stable.
- Meaning : Deep magenta (#8B0A4E). The soul color. Richest and most saturated. Meant to feel like the center of something.

The inner cube's illuminated state uses warm gold-white (#FFE4A0) with strong emissive intensity so it reads as genuinely lit from within.

### Color Blending in the Projection

When the tesseract is viewed from an angle, multiple faces overlap in the 2D projection. Because materials are transparent, the colors blend additively in those overlap regions. The visual result should be interference patterns that suggest the dimensions are in relationship : where Presence (teal) and States (violet) overlap, a blue-purple appears. Where Sensory (amber) and Meaning (magenta) overlap, a warm rose appears. These blends are not engineered explicitly : they emerge naturally from the transparent material overlaps and the additive blending of Three.js's default transparency compositing.

This emergent blending is part of the design intention. Every experience fingerprint will have slightly different color regions depending on which faces are most forward or most active.

---

## SECTION 4 : INTERACTION STATES AND VISUAL FEEDBACK

### Four States Per Face

Each face of the outer cube exists in one of four states at any time:

**Unvisited :** The learner has not yet interacted with this dimension. Opacity is 0.2. Color is desaturated to about 40% of its full value. No glow. The face label is visible but dim.

**Active :** The learner has clicked this dimension and its workspace is currently open on the right panel. Opacity rises to 0.55. Color goes to full saturation. A faint rim light or edge highlight appears on the face edges using an additional EdgesGeometry with slightly higher opacity material. The face appears to push slightly toward the viewer : achieved by translating the face 8 units forward along its normal vector with a smooth animation over 200 milliseconds.

**Completed :** The learner has made all required selections for this dimension and moved on. Opacity settles at 0.4. Color remains fully saturated. The face holds its slight forward position. A subtle slow pulse animation runs : the opacity oscillates between 0.38 and 0.44 over a 3 second cycle, giving it a breathing quality.

**Connected :** When all six dimensions are complete and the inner cube illuminates, all six faces enter the Connected state. Opacity rises to 0.5. The pulse animations synchronize so all six faces breathe together. The inner cube's light source now casts through them, making the color variation across each face more visible as the illumination from within interacts with each face's color.

### Rotation Behavior When a Face is Selected

When a learner clicks a dimension tab in the left sidebar, the tesseract rotates to bring that dimension's face to the front position (Z+). This rotation is the primary navigation mechanic of the simulation.

The rotation uses the shortest arc path from the current orientation to the target orientation. If the Reality face (Z-) is being brought forward from the default position where Meaning (Z+) faces front, the cube rotates 180 degrees around the Y axis. If Presence (Y+) is selected from the same starting position, the cube rotates 90 degrees around the X axis (tilting the top face toward the viewer).

The rotation animation runs over 600 milliseconds using an ease-in-out cubic easing curve. The cube should feel like it has mass : it accelerates smoothly and decelerates smoothly. It should not snap or bounce.

During rotation, the workspace panel on the right fades out (150ms fade), then fades back in with the new dimension's content once the rotation is 80% complete (another 150ms fade in). The content change is timed to feel like the cube is delivering the new content as it arrives.

When the selected face reaches the front position, it has a brief settling animation : it overshoots very slightly (by about 2 units) and then settles back to position over 100 milliseconds. This gives the rotation a sense of physical weight landing.

### Clicking the Cube Directly

Learners can also click directly on a face of the cube to select that dimension, in addition to using the sidebar tabs. Raycasting against the face planes detects which face was clicked. The face highlights on hover (slight opacity increase, cursor changes to pointer). On click, the selection behavior is identical to clicking the sidebar tab : rotation to front position, workspace content loads.

This direct interaction with the 3D object is important. It makes the tesseract feel like a real object being handled, not just a decoration next to a form.

---

## SECTION 5 : THE THREE-PANEL LAYOUT

### Left Panel : Dimension Navigation

Width : 200px on desktop, collapses to icon-only (48px) on tablet, full-screen overlay on mobile.

Contains six dimension tabs stacked vertically with equal spacing. Each tab has:

- A small icon specific to the dimension (described in Section 6)
- The dimension name in the course's display font
- A state indicator : empty circle (unvisited), half-filled circle (active), full circle (completed)
- The dimension's assigned color applied to the state indicator and the tab's left border

Tabs are not reorderable. The order top to bottom is : Reality, Sensory, Presence, States, Traits, Meaning. This order follows a natural design sequence from outer world to inner purpose, though learners can click any tab in any order.

At the bottom of the left panel, a progress indicator shows how many of six dimensions are complete : "3 of 6 dimensions designed." When all six are complete, this changes to "Design complete" with a small glow effect.

### Center Panel : The Tesseract

The tesseract canvas occupies the center of the screen. On desktop this is approximately 500 to 600px wide. The Three.js canvas fills this area.

The tesseract is centered vertically and horizontally in the canvas. It should not feel cramped : the outer cube's corners should have at least 60px clearance from the canvas edges in default rotation.

A very subtle ambient animation runs constantly regardless of user interaction : the tesseract rotates very slowly on the Y axis (approximately 4 degrees per second) when no dimension is actively selected. When a dimension is selected, this ambient rotation pauses and the cube holds its orientation until another selection is made or until the learner explicitly dismisses the active state. The ambient rotation resumes 3 seconds after the last interaction.

The background behind the tesseract canvas is deep dark purple (#0D0118) with a very faint radial gradient lightening slightly at the center where the tesseract sits. A subtle noise texture overlay (5% opacity) gives it depth rather than looking like a flat color.

Small particle effects (very small dots, roughly 40 particles) float slowly in the background space behind the tesseract. They drift slowly, have varying opacity (0.1 to 0.3), and serve to reinforce the sense of 3D space without being distracting.

### Right Panel : Dimension Workspace

Width : 320px on desktop. Full-screen overlay on mobile.

This panel changes content based on which dimension is active. Its structure is consistent across all dimensions:

At the top : The dimension name in the display font, the dimension icon, and a one-sentence description of what this dimension addresses. The dimension's color is used as a subtle tinted background on this header area.

Below the header : The core question this dimension answers, set in slightly larger type.

Below the question : The option cards. These are the selectable choices for this dimension. Each card contains a short title, a one-sentence description, and a small icon. Cards are 100% width of the panel with about 8px vertical spacing between them. Hover state : slight background tint in the dimension's color at 10% opacity, border changes to dimension color. Selected state : background tint at 20%, border solid in dimension color, a small checkmark or glow indicator in the top-right corner.

For multi-select dimensions (Sensory and Reality), multiple cards can be selected simultaneously. For single-select dimensions (Presence, States, Traits), selecting a new card deselects the previous one.

For the Meaning dimension specifically, the workspace unfolds in three sequential steps. This is described in detail in Section 7.

At the bottom of the workspace panel : A "Confirm Dimension" button that becomes active when at least one required selection has been made. Pressing it marks the dimension complete, updates the tesseract face to Completed state, and if another dimension hasn't been visited yet, suggests the next one with a soft prompt.

---

## SECTION 6 : DIMENSION ICONS

Each dimension should have a simple, recognizable icon. Described here for a designer or icon library to produce:

- Reality : Concentric squares or nested frames, suggesting layers of reality contained within each other. References the idea of environmental substrates.
- Sensory : Five small symbols arranged in a loose circle : an eye, an ear, a hand, a nose, a droplet (taste). Suggests the five sense channels.
- Presence : A simple lotus or radial bloom shape. Suggests cultivation, unfolding, a quality growing outward.
- States : A fluid wave or sine curve. Suggests transience, flow, something moving through.
- Traits : A crystal or geometric gem shape. Suggests endurance, facets, something that has crystallized.
- Meaning : A small lantern or light source. Suggests the animating center, the thing that makes everything else visible.

---

## SECTION 7 : THE MEANING DIMENSION WORKSPACE IN DETAIL

### Three-Step Unfold

The Meaning workspace is the only one that has internal sequence. When the Meaning face is brought to the front and the workspace opens, it shows only the first layer.

**Step 1 : The World**

Header text : "What world does this experience inhabit?"

Below this : a short paragraph (3 sentences) explaining that the World is the larger context or mythos the experience lives within. This is the universe the person enters when the experience begins.

Option cards (single-select, seven options):

Each card has a poetic name and a one-sentence evocative description. The seven worlds are:

- Inner Space : The mind as cosmos. The experience explores the interior landscape of consciousness itself.
- The Body as Landscape : The physical body is the terrain. The experience descends into somatic depth.
- The Sacred Grove : Connection to the living world. The experience cultivates belonging in nature and ecological wholeness.
- The Threshold : The liminal edge. The experience holds the space between known and unknown, self and mystery.
- The Mirror : Clarity through reflection. The experience brings the person into honest encounter with themselves.
- The Web : The interconnected whole. The experience dissolves isolation and cultivates sense of belonging to something larger.
- The Forge : Transformation through difficulty. The experience holds initiation, challenge, and the becoming that comes through it.

When a World card is selected, the Meaning face of the tesseract shows a faint shift : the color warms or cools slightly based on the world chosen (Inner Space produces cooler blues in the face, Body as Landscape produces warmer ambers, etc.). A "Continue to Story" button appears below the cards.

**Step 2 : The Story**

Header text : "What arc does the person move through?"

Below this : 2 sentences explaining that every cyberdelic experience has a narrative shape. Even without a literal plot, there is a movement from one state to another.

The interface shows a sentence construction tool:

"In this experience, the person moves from [FROM] toward [TOWARD]."

Two dropdown selectors side by side. Each has 8 options.

FROM options : fragmentation, fear, isolation, numbness, confusion, contraction, surface, separation

TOWARD options : wholeness, trust, connection, aliveness, clarity, expansion, depth, belonging

Both dropdowns are required before continuing. When both are selected, the story sentence appears fully assembled below the dropdowns, displayed clearly : "In this experience, the person moves from isolation toward belonging." This assembled sentence is held in state and used in the generated summary.

A "Continue to Magic" button appears when both dropdowns have selections.

**Step 3 : The Magic**

Header text : "What principle makes the transformation possible?"

Below this : 2 sentences explaining that every transformation needs an activating principle. The magic is the specific mechanism through which this experience works its change.

Option cards (single-select, eight options):

- Breath as Portal : The breath is the primary entry point. Every state shift moves through the breath.
- Resonance and Sound : The acoustic environment carries the transformation. Sound enters the body and reorganizes it.
- Witnessing : Being fully seen by another (or by oneself) is the catalyst. Contact creates change.
- Surrender : Releasing control is the mechanism. The transformation happens in the moment of letting go.
- The Meeting : Contact between self and other, or self and the world. Genuine encounter is the activating force.
- Dissolution : Edges soften and boundaries release. The transformation comes through what falls away.
- The Descent : Going deeper rather than higher. The experience works by going into rather than rising above.
- Emergence : What arises from stillness. The experience creates the conditions and waits for what wants to come.

When a Magic card is selected, all three Meaning layers are now complete. The Meaning face of the tesseract fully activates (jumps to Completed state), and if this is the sixth dimension completed, the inner cube illumination sequence triggers.

### The Meaning Face Visual During Completion

As the three Meaning layers are completed in sequence, the Meaning face (front face, closest to viewer) shows a progressive visual build. After World is selected : the face shows a faint pattern or texture specific to the chosen world (a subtle starfield for Inner Space, organic flowing lines for Body as Landscape, etc.) rendered at 15% opacity over the base magenta color. After Story is selected : a directional arrow or arc appears, also very subtle, suggesting movement. After Magic is selected : the full face illuminates and the texture, story arc, and magic symbol all become slightly more visible as a composed layer : a micro-composition on the face of the cube representing the complete Meaning dimension.

These face textures are pre-designed SVG patterns, not procedurally generated. Seven World textures, one per World option, are the main asset set needed for this feature.

---

## SECTION 8 : THE COMPLETION SEQUENCE

When the sixth and final dimension is completed, a specific sequence of events unfolds:

**Beat 1 (0ms) :** The final dimension's face transitions to Completed state (opacity increase, breathing pulse begins).

**Beat 2 (300ms) :** All six face pulse animations synchronize. They were previously on independent timings : now they align to a shared 3 second cycle.

**Beat 3 (600ms) :** The inner cube's emissiveIntensity begins its ramp from 0.05 to 1.0. This animation runs over 800 milliseconds with an ease-out curve : it rises quickly at first and then settles.

**Beat 4 (700ms) :** A point light inside the inner cube activates, starting at intensity 0 and rising to intensity 1.2 over 600ms. This light has a warm gold-white color. Its effect through the translucent outer faces creates colored glows on each face as the light interacts with each face's material color.

**Beat 5 (1200ms) :** The ambient background particles shift behavior slightly : they begin drifting more slowly and their opacity increases to a range of 0.2 to 0.5. The background radial gradient becomes slightly more prominent.

**Beat 6 (1500ms) :** The right panel transitions. The current dimension workspace fades out over 200ms. A new panel slides in from the right : the Experience Summary panel. This is the culminating moment of the simulation.

**Beat 7 (1500ms, simultaneous) :** The tesseract transitions to a slow rotation displaying all faces sequentially : it rotates 360 degrees around the Y axis over 8 seconds, pauses, then rotates 90 degrees on the X axis and rotates again, then returns to a balanced three-quarter view showing three faces simultaneously. After this orientation showcase it settles into a very slow ambient rotation that shows all six faces over time.

---

## SECTION 9 : THE EXPERIENCE SUMMARY PANEL

This panel replaces the dimension workspace after completion. It contains four sections:

### Section 1 : The Experience Name

A generated name assembled from the learner's choices. The name uses a template:

"[Presence Type] [Story TOWARD word] through [Magic name] in [World name]"

Example : "Embodied Belonging through Surrender in The Web"
Example : "Cognitive Clarity through Emergence in Inner Space"
Example : "Somatic Depth through The Descent in The Body as Landscape"

The name is displayed large, in the display font, with the Meaning color (magenta) as its text color. It is the most visually prominent element of the summary.

### Section 2 : The Experience Description

Three short paragraphs, each 2 to 3 sentences, describing what this experience would feel like to participate in. Written in second person, present tense.

Paragraph 1 addresses the Reality and Sensory choices : what world you enter and what channels are active.
Paragraph 2 addresses the Presence and States choices : what quality of awareness is being cultivated and what transient shifts are being catalyzed.
Paragraph 3 addresses the Traits and Meaning choices : what the experience is building over time and the story it tells.

These paragraphs are assembled from a template system where each choice has a corresponding phrase or sentence fragment, and the fragments are concatenated into natural prose. The templates need to be written carefully so every combination produces grammatically natural and evocative text, not mechanical-sounding output.

The description text uses the course's body font, regular weight, approximately 15px size, comfortable line height.

### Section 3 : The Coherence Note

A single sentence that either affirms design coherence or names a productive tension. This is generated by a set of rules that checks specific dimension combination pairs. Examples of tension rules:

- If Reality includes Virtual AND Presence is Embodied : "A Virtual reality substrate with Embodied Presence is an interesting design challenge : you will need deliberate somatic anchors to bridge the digital world and the body."
- If States includes Cognitive AND Traits includes Somatic : "Designing for Cognitive States while targeting Somatic Traits suggests the experience works through insight that lands in the body : integration practices will be important."
- If no tension rules are triggered : "The dimension choices show strong internal coherence. The world, senses, and intention all point in the same direction."

The coherence note is displayed in a slightly different typographic treatment : smaller, a lighter weight, with the note prefixed by a small diamond icon.

### Section 4 : Actions

Three action elements at the bottom of the summary:

- "Save Your Design" : Downloads the experience fingerprint as a PNG image (the tesseract in its current illuminated state) plus the summary text as a simple formatted card.
- "Build Another" : Resets all dimension selections, returns the tesseract to the unvisited state (all faces dim), closes the summary panel, and opens the workspace back to the Reality dimension. A very brief reset animation runs : the inner cube dims, the faces desaturate, and the tesseract returns to the default Meaning-facing orientation over 500ms.
- "Compare to Real Experiences" : This opens an optional extension panel (if built) showing 2 to 3 pre-mapped real cyberdelic experiences with their own dimension profiles displayed. This feature is a stretch goal for the second build phase.

---

## SECTION 10 : RESPONSIVE BEHAVIOR

### Desktop (1024px and above)
Full three-panel layout. Left sidebar (200px), center tesseract canvas (flexible, 500 to 700px), right workspace panel (320px). All three panels visible simultaneously.

### Tablet (768px to 1023px)
Left sidebar collapses to icon-only width (48px). Tapping an icon expands the sidebar temporarily over the canvas. Center canvas reduces. Right panel maintains 280px minimum width.

### Mobile (below 768px)
The three-panel layout stacks vertically. The tesseract canvas occupies the top 40% of the screen, always visible. Below it, a bottom sheet slides up when a dimension is selected, covering the lower 60% of the screen with the workspace content. A persistent dimension navigation appears as a horizontal scrollable row of icon tabs above the bottom sheet.

The tesseract on mobile responds to device tilt if device orientation API is available : gentle tilting of the device produces corresponding rotation of the tesseract, reinforcing the sense that it exists in real 3D space. This feature requires a permission request and should degrade gracefully to touch-drag rotation if permission is denied.

---

## SECTION 11 : ANIMATION LIBRARY AND TIMING REFERENCE

All animations in the simulation follow three timing categories:

**Instant response (under 100ms) :** Hover states on cards and tabs. Cursor changes. These should feel like the interface is alive and reactive.

**Navigation transitions (150ms to 300ms) :** Panel content fades, tab state changes, card selection states. These confirm the learner's action without slowing them down.

**Meaningful moments (400ms to 800ms) :** Tesseract rotation (600ms), face state transitions (400ms), workspace panel slide transitions (300ms). These are paced to feel like something real is happening.

**Ceremonial moments (600ms to 2000ms+) :** The completion sequence, the inner cube illumination, the orientation showcase rotation. These are the emotional peaks of the simulation and should be given full time to land.

All easing curves should use ease-in-out cubic for symmetrical transitions and ease-out cubic for arrivals (things landing, illuminating, appearing). Avoid linear easing anywhere : it always feels mechanical. Avoid bounce easing : it conflicts with the grounded, precise aesthetic of the course.

---

## SECTION 12 : TYPOGRAPHY

The simulation uses two typefaces, consistent with the broader Cyberdelics 101 course:

**Display font** (for dimension names, experience name in summary, major labels) : A geometric or humanist typeface with some character. Something that reads as both precise and slightly mystical. Suitable options include Cormorant Garamond (elegant, slightly ceremonial), Josefin Sans (geometric, clean, with Art Deco echoes), or a similar display-weight typeface. The exact choice should be confirmed with the STAR Arts brand guidelines.

**Body font** (for descriptions, option card text, coherence notes, panel copy) : A clean, readable sans-serif with good legibility at small sizes. Should feel warm rather than clinical. Suitable options include DM Sans, Outfit, or Nunito.

All type on the simulation sits on dark backgrounds. Ensure sufficient contrast ratios (minimum 4.5:1 for body text, 3:1 for large display text).

---

## SECTION 13 : AUDIO (OPTIONAL ENHANCEMENT)

If audio is implemented, the simulation supports a minimal ambient sound layer:

A low drone or soft pad plays at very low volume (defaulting to off, with a clearly visible sound toggle button) when the simulation is open. The drone shifts slightly in pitch and texture as different dimensions are selected, giving an auditory sense that the "experience" is being tuned.

On the completion sequence (Beat 3, when the inner cube begins to illuminate), a soft ascending tone or brief harmonic swell plays. This should be short (under 3 seconds) and feel like acknowledgment rather than celebration.

No sound plays on hover states, card clicks, or rotation events : these should remain silent to avoid being annoying during repeated interaction.

---

## SECTION 14 : ACCESSIBILITY

- All interactive elements (face clicks, tab buttons, option cards, dropdowns) are keyboard navigable. Tab order follows the logical sequence : sidebar tabs, then workspace cards, then confirm button.
- Screen reader labels describe each dimension name, the current state (unvisited, active, complete), and each option card's title and description.
- The tesseract's 3D rotation is purely decorative from an information perspective : all functional content is duplicated in the sidebar tabs and workspace panel. Users who cannot interact with the 3D canvas can complete the entire simulation using only the left sidebar and right workspace.
- Reduce motion preference : if the system prefers reduced motion, the tesseract rotation animations are shortened to 100ms or replaced with immediate cuts, the completion sequence is condensed, and the ambient rotation and particle effects are disabled.
- Color is never the only indicator of state : each state (unvisited, active, complete) also has a distinct icon treatment and text label.

---

## SECTION 15 : PLACEHOLDER BUILD STRATEGY

The simulation is built in two phases:

**Phase 1 (Placeholder) :** A functional 2D version that teaches the same content without the 3D tesseract. The six dimensions are presented as a vertical list of cards on the left. Clicking a dimension opens its workspace on the right. Completed dimensions show a filled circle indicator. A simple visual summary is generated on completion. This version can go live while Phase 2 is being developed and still delivers the full educational content.

**Phase 2 (Full Build) :** The complete 3D tesseract implementation as described in this document. The Phase 1 version is replaced by the Phase 2 version when ready. All content (dimension options, workspace copy, summary templates) is shared between phases : only the visual presentation layer changes.

The advantage of this approach is that the content and logic can be validated with real learners in Phase 1, and any content revisions are made before the more complex Phase 2 rendering is built.

---

## APPENDIX A : CONTENT REFERENCE SUMMARY

### Reality Dimension Options (multi-select)
Physical, Virtual, Augmented, Mixed, Generative, Biological, Cognitive

### Sensory Dimension Options (multi-select)
Visual, Auditory, Tactile, Olfactory, Gustatory

### Presence Dimension Options (single-select)
Mental, Emotional, Social, Embodied, Environmental, Active

### States Dimension Options (single-select, up to 2)
Cognitive, Emotional, Somatic, Relational

### Traits Dimension Options (single-select, up to 2)
Cognitive, Emotional, Somatic, Relational

### Meaning Dimension (three-step)

World (single-select) : Inner Space, The Body as Landscape, The Sacred Grove, The Threshold, The Mirror, The Web, The Forge

Story (two dropdowns) :
FROM : fragmentation, fear, isolation, numbness, confusion, contraction, surface, separation
TOWARD : wholeness, trust, connection, aliveness, clarity, expansion, depth, belonging

Magic (single-select) : Breath as Portal, Resonance and Sound, Witnessing, Surrender, The Meeting, Dissolution, The Descent, Emergence

---

## APPENDIX B : FACE-TO-DIMENSION ROTATION REFERENCE

Starting from default orientation (Meaning face at Z+, Reality face at Z-):

- To reach Reality (Z-) from default : rotate 180 degrees around Y axis
- To reach Presence (Y+) from default : rotate -90 degrees around X axis
- To reach Traits (Y-) from default : rotate 90 degrees around X axis
- To reach States (X+) from default : rotate -90 degrees around Y axis
- To reach Sensory (X-) from default : rotate 90 degrees around Y axis
- To reach Meaning (Z+) : return to default orientation (0 degrees)

When computing rotation from any arbitrary orientation to a target face, use quaternion interpolation (SLERP) to find the shortest rotation path. Three.js's Quaternion.slerp method handles this correctly.