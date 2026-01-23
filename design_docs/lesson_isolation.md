# design_docs/lesson_isolation.md

# Lesson Isolation & Configuration Strategy

## Problem Statement
We need to create multiple lessons (e.g., "Intro", "Deep Dive", "Advanced") that utilize the *same* underlying teaching methods (Simulations, Scenarios, etc.) but with *different* content, parameters, and behaviors. We must ensure that modifying one lesson or method configuration does not regress or affect others ("Action at a distance"). State must be strictly encapsulated.

## 1. Analysis of Current Architecture

### The Factory Pattern
Our `method-base.js` uses a Factory Pattern (`createTeachingMethod`).
- **Pros**: Every time we call `window.SomeMethodFactory.init()`, it *should* operate on a specific container.
- **Cons**: Currently, our methods (like `ScenarioBased`) are instantiated *once* globally as `window.ScenarioBased` via the script tag, and reused.
    - *Risk*: If Lesson A sets `ScenarioBased.state.currentStep = 5`, and we navigate to Lesson B without a hard reload, `ScenarioBased` might still be at step 5.
    - *Fix*: We need **True Instantiation**. The `window` object should export the *Class/Factory*, not the *Instance*.
    - *Current State*: `interactive-simulation.js` exports `const InteractiveSimulation = createTeachingMethod...`. This is a **Singleton Instance**.

### Global DOM Listeners
Some methods attach listeners to `document` or `window`.
- *Risk*: `scenario-based.js` attaches click listeners. If we have multiple scenarios on one page (e.g., a "Review" board), clicks might trigger both.
- *Fix*: All event listeners must be scoped to `this.state.container`.

## 2. Proposed Solution: The "Lesson Manifest" Architecture

Instead of hardcoding HTML and JS, we will define lessons as **Data Structures (Manifests)**. A "Lesson Runner" will read the manifest and instantiate the required methods with total isolation.

### A. The Schema (Lesson Manifest)
Each lesson is defined by a JSON-compatible object:

```javascript
const Lesson_101_Intro = {
    id: "lesson-101-intro",
    title: "Introduction to Cyberdelics",
    theme: {
        primaryColor: "#00D9FF", // Runtime variable injection
        fontBody: "Inter"
    },
    modules: [
        {
            id: "module_1",
            type: "progressive-disclosure",
            config: {
                // Specific content for this instance
                sections: [
                    { content: "<h2>Welcome</h2>..." },
                    { content: "<h2>The Bridge</h2>..." }
                ]
            }
        },
        {
            id: "module_2",
            type: "interactive-simulation",
            config: {
                engine: "cyberdelic-convergence",
                // Instance-specific parameters overlay
                initialParams: { intensity: 20, speed: 0.5 }
            }
        }
    ]
}
```

### B. True Instantiation (The Code Change)

Currently:
```javascript
// method file
const MyMethodInstance = createTeachingMethod(...);
window.MyMethod = MyMethodInstance; // SINGLETON
```

Proposed:
```javascript
// method file
const MyMethodFactory = () => createTeachingMethod(...); // Returns NEW instance
window.MyMethodFactory = MyMethodFactory;
```

When the Lesson Runner starts Module 1:
```javascript
const instance = window.ProgressiveDisclosureFactory();
instance.init(container, config);
```

### C. CSS Isolation (The "Scope" Class)

To prevent CSS collisions (e.g., Lesson A wants blue buttons, Lesson B wants red), the Lesson Runner will wrap the lesson in a scoped ID:
`<div id="lesson-root-unique-id" class="lesson-theme-red">...</div>`

Methods will use CSS Variables:
```css
.method-button {
    background: var(--lesson-primary-color, #00D9FF);
}
```
Lesson A injects `--lesson-primary-color: blue;`.
Lesson B injects `--lesson-primary-color: red;`.

### D. Recursive Composition (Nesting)
To support the "Matryoshka" style nesting (verified in `test-nesting.html`), the Manifest schema handles recursion. A module can define `slots` or `children` that contain *other full module definitions*.

**Example: Simulation inside Progressive Disclosure**
```javascript
{
    id: "step_1_disclosure",
    type: "progressive-disclosure",
    config: {
        steps: [
            {
                id: "intro_card",
                content: "<h3>Welcome</h3>..."
            },
            {
                id: "sim_card",
                content: "<h3>Now try this:</h3><div id='slot_1'></div>",
                // The runner sees this 'nested' property and instantiates the Module into 'slot_1'
                nestedModules: [
                    {
                        targetContainer: "#slot_1",
                        type: "interactive-simulation",
                        config: { engine: "wave-sim" }
                    }
                ]
            }
        ]
    }
}
```
The **Lesson Runner** will:
1. init `ProgressiveDisclosure`
2. specific logic in the runner observes when "sim_card" is revealed (or creates it immediately)
3. inits `InteractiveSimulation` into the `#slot_1` container.

This decouples the *parent* (Progressive Disclosure) from knowing about the *child* (Sim). It just provides a `div`. The Runner handles the glue.

## 3. Implementation Steps

1.  **Refactor Methods to Factories**: Change `const X = create...` to `window.XFactory = function() { return create... }`.
2.  **Create `LessonRunner.js`**: A central engine that:
    - Accepts a Manifest.
    - Clears the DOM.
    - Instantiates specific method instances.
    - Manages state passing between them (The "Bus").
3.  **Migrate Content**: Move hardcoded HTML text into Manifest files (or load them from partials).

## 4. Summary of Benefits
1.  **Reusability**: One Sim codebase, infinite configurations.
2.  **Safety**: Lesson A cannot touch Lesson B's state because they use different memory objects.
3.  **Scalability**: We can easily create a visual "Lesson Editor" later that just generates these JSON manifests.
