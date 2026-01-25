# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cyberdelics 101 is a modular, interactive educational platform that teaches consciousness-technology concepts through a custom Single Page Application (SPA) framework called the "Lesson Runner Engine." The system uses a "Cyberdeck" metaphor where users log into a persistent digital interface that dynamically loads content.

This is **not a traditional web application** - it's a specialized educational framework designed for immersive learning experiences without external dependencies like Node.js or package managers.

## Core Architecture

The system is built on three foundational components in the `core/` directory:

### 1. `core/lesson-runner.js` - The Central Engine
- Manages lesson lifecycle from manifest loading to completion
- Handles dynamic loading of Teaching Method scripts/CSS
- Orchestrates state management and navigation between modules
- Instantiates method factories and manages their cleanup

### 2. `core/lesson-ui.js` - The Cyberdeck Shell  
- Provides persistent UI shell with progress tracking
- Features collapsible sidebars for artifacts/inventory and user stats
- Includes interactive wave visualizer (frequency/amplitude controls)
- Maintains immersion during content transitions

### 3. `core/styles.css` - Global Design System
- CSS Variables for consistent theming (`--color-neon-cyan`, `--glass-panel`)
- Cyberpunk/Sci-Fi aesthetic with "Rajdhani" and "Orbitron" fonts
- Responsive layouts with sidebar management

## Teaching Methods System

Content is delivered through modular "Teaching Methods" in `methods/` directory. Each method is a self-contained mini-application:

| Method | Purpose | File Location |
|--------|---------|---------------|
| `progressive-disclosure` | Step-by-step content revelation | `methods/progressive-disclosure/` |
| `gamified-exploration` | Interactive maps and discovery | `methods/gamified-exploration/` |
| `knowledge-construction` | Drag-and-drop learning activities | `methods/knowledge-construction/` |
| `interactive-simulation` | Real-time visualizations and controls | `methods/interactive-simulation/` |
| `scenario-based` | Decision-making and branching scenarios | `methods/scenario-based/` |

### Method Architecture Pattern
All methods follow a **Factory Pattern** for isolation:
```javascript
// Each method exports a factory function
window.MethodNameFactory = function() {
    return createTeachingMethod('method-name', {
        onInit: function(container, options) { /* ... */ },
        onDestroy: function() { /* cleanup */ },
        // ... method-specific logic
    });
};
```

## Lesson Configuration System

Lessons are defined as JSON manifests (not hardcoded HTML). Example structure:
```json
{
    "lessonId": "intro-module",
    "title": "Course Introduction",
    "modules": [
        {
            "id": "welcome-step",
            "type": "progressive-disclosure",
            "content": {
                "sections": [
                    {"content": "<h1>Welcome</h1><p>...</p>"}
                ]
            }
        }
    ]
}
```

### Content Generation
The LessonRunner automatically generates HTML for common patterns:
- Progressive disclosure sections with reveal buttons
- Knowledge construction with drag-and-drop zones
- Scenario-based branching with choice buttons
- Interactive simulation containers with controls

## Development Commands

Since this is a client-side only application with no build system:

### Running Locally
- Open `framer-test-harness.html` in browser for development testing
- Use any local server (e.g., `python -m http.server 8000`) to avoid CORS issues
- Direct file opening works for basic testing

### Testing Methods
- Individual method testing: Open `methods/test-*.html` files
- Method composition testing: Use `test-composition.html`, `test-mega-composition.html`
- Nesting scenarios: `test-nesting.html`, `test-nesting-scenario.html`

## Key Design Principles

### Lesson Isolation
From `design_docs/lesson_isolation.md`:
- Methods use **true instantiation** (factories, not singletons)
- No global state pollution between lessons
- Event listeners scoped to method containers only
- CSS isolation through scoped classes and CSS variables

### Method Composition
- Methods can be nested (Progressive Disclosure containing Simulations)
- Parent methods provide container slots, LessonRunner handles injection
- Recursive composition supported for complex learning experiences

### State Management
- Each method instance has isolated state
- LessonRunner manages transitions and inter-method communication
- Cleanup required on method destruction to prevent memory leaks

## File Structure Guidelines

```
├── core/                    # Core framework files
├── methods/                 # Teaching method implementations
│   ├── method-name/
│   │   ├── method-name.js   # Main implementation
│   │   └── method-name.css  # Method-specific styles
├── lesson-drafts/          # Lesson manifest files
├── design_docs/            # Architecture documentation
└── assets/                 # Media and resources
```

## Development Workflow

1. **Adding New Methods**: Create factory in `methods/` following the existing pattern
2. **Creating Lessons**: Define JSON manifests in `lesson-drafts/`
3. **Testing**: Use test harness files for isolated testing
4. **Styling**: Use CSS variables for consistency, scope to method containers

## Content Integration

The system supports various content types:
- HTML content embedded in manifest JSON
- Media references (images, videos, 3D models)
- Interactive simulations with parameter controls
- Branching scenarios with choice outcomes

## Important Notes

- **No Package Manager**: This is vanilla JavaScript - no npm, webpack, or build tools
- **Factory Pattern Required**: All methods must export factories, not instances
- **Container Scoping**: All DOM manipulation must be scoped to method containers
- **State Cleanup**: Implement `onDestroy` hooks to prevent memory leaks
- **CSS Isolation**: Use CSS variables and scoped classes to prevent style conflicts

## Testing and Development

- Use browser developer tools for debugging
- Test method isolation by running multiple instances
- Verify cleanup by checking for memory leaks during transitions
- Test responsive behavior across different screen sizes