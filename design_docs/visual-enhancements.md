# Visual Enhancements & Media Integration Strategy

## Overview
To elevate the aesthetic quality of the course, we will implement a standardized **Media Injection System** into the `LessonRunner`. This allows any method (Progressive Disclosure, Scenario, Simulation) to easily display:
-   **Images**: Static assets (diagrams, art).
-   **GIFs/Video**: Looping ambient backgrounds or instructional clips.
-   **Three.js**: Custom 3D animations rendered into a specific canvas layer.

## Architecture

### 1. Unified Media Schema
All content objects (Sections, Scenes, Steps) in the Manifest will support an optional `media` property:

```json
"media": {
    "type": "image" | "video" | "threejs",
    "src": "assets/images/concept-art.jpg", // for image/video
    "details": { ... }, // specific config (e.g., loop, autoplay) 
    "engine": "galaxy-spin", // for threejs
    "position": "background" | "inline" | "overlay"
}
```

### 2. Media Renderer Helper
We will create a helper function `renderMedia(mediaConfig)` in `LessonRunner` (or a helper file) that generates the appropriate HTML or initializes the JS content.

#### HTML Template Generation
```javascript
function generateMediaHTML(media) {
    if (!media) return '';
    
    if (media.type === 'image') {
        return `<div class="media-container ${media.position}"><img src="${media.src}" alt=""></div>`;
    }
    if (media.type === 'video') {
        return `<div class="media-container ${media.position}"><video src="${media.src}" autoplay loop muted></video></div>`;
    }
    if (media.type === 'threejs') {
        return `<div class="media-container ${media.position} threejs-canvas" data-engine="${media.engine}"></div>`;
    }
}
```

### 3. Integration Points in LessonRunner

#### Progressive Disclosure
Inject media into the section loop:
```javascript
// ... inside section loop
html += `
    <div class="reveal-section ...">
        ${generateMediaHTML(sec.media)} 
        <div class="section-content">${sec.content}</div>
    </div>
`;
```

#### Scenario Based
Inject media into the scene loop:
```javascript
// ... inside scene loop
html += `
    <div class="scenario-scene ...">
        ${generateMediaHTML(scene.media)}
        <div class="scenario-narrative">${scene.narrative}</div>
    </div>
`;
```

#### Interactive Simulation
Simulations essentially *are* media, but if we want a "Background Ambience" (e.g., floating particles behind the controls):
```javascript
// ... inside sim container gen
moduleContainer.innerHTML = `
    <div class="interactive-simulation-container">
        ${generateMediaHTML(moduleConfig.media)} <!-- Background layer -->
        <div class="sim-viewport">...</div>
    </div>
`;
```

### 4. Special Handling for Three.js
Since Three.js requires JS initialization (not just HTML), `LessonRunner._runModule` needs a post-render step:
1.  Find all `.threejs-canvas` elements in the new container.
2.  Instantiate the requested `engine` (similar to how we do `SimulationEngines`).
3.  Store these instances to `destroy()` them later when the module unmounts.

## "How to Add" Workflow for User
1.  **Assets**: Drop image/video into `assets/`.
2.  **Manifest**: Add `"media": { "type": "image", "src": "..." }` to your JSON.
3.  **Code (Three.js)**: If adding a custom 3D animation, create a script file in `visuals/engines/` and register it. Then reference it in Manifest by name.

## Recommendation
This approach keeps the "Base Class" clean. The logic lives in the **Runner** (the Composer), which is responsible for the visual assembly of the page. The Methods remain focused on interaction logic.
