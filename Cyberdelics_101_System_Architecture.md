# Cyberdelics 101: System Architecture & Build Guide

## 1. Project Overview
**Cyberdelics 101** is a modular, interactive educational platform built to teach complex consciousness-technology concepts. Unlike traditional LMS (Learning Management Systems) that serve static text/video, this project functions as a **Single Page Application (SPA) Framework** called the **"Lesson Runner Engine"**.

It uses a **"Cyberdeck" metaphor**: The user is not just "visiting a website"; they are logging into a persistent digital interface (The UI Shell) where content is loaded dynamically (The Runner).

---

## 2. Core Architecture (The Engine)
The system is built on a custom lightweight framework located in the `core/` directory.

### A. The Brain: `lesson-runner.js`
This is the central controller (the "Agent" of the system).
*   **Responsibility**: It manages the entire lifecycle of a lesson.
*   **Functions**:
    *   **Manifest Parsing**: Reads a JSON file to know what to load.
    *   **Dynamic Loading**: Injects specific Teaching Method scripts/CSS on demand.
    *   **State Management**: Tracks variables like `intro_complete` or `user_persona` across different steps.
    *   **Navigation**: Handles "Next/Back" logic and step transitions.

### B. The Body: `lesson-ui.js`
This is the visual shell that persists while content changes.
*   **Responsibility**: Maintains immersion and provides persistent tools.
*   **Components**:
    *   **Top Bar**: Displays Progress visualization and Lesson Title.
    *   **Left Sidebar ("Artifacts")**: A collapsible drawer for inventory/resources gathered during lessons.
    *   **Right Sidebar ("Identity")**: Tracks user stats, personas, and "Sync" levels.
    *   **Bottom Bar ("Wave Visualizer")**: An interactive aesthetic component (Sine/Cosine waves) controlled by vertical sliders (Frequency, Amplitude, Speed). This acts as a "tuner" for the user's focus.

### C. The Skin: `styles.css`
The global design system.
*   **Variables**: Uses CSS Variables (`--color-neon-cyan`, `--glass-panel`) for consistent theming.
*   **Typography**: "Rajdhani" and "Orbitron" fonts for the Cyberpunk/Sci-Fi aesthetic.
*   **Layout**: Flexbox/Grid-based layouts that adapt to the sidebars opening/closing.

---

## 3. The Plugin System (Teaching Methods)
Content is not hard-coded; it is composed of modular **Teaching Methods** located in `methods/`. Each method is a standalone mini-app.

| Method | Purpose | Tech Implementation |
| :--- | :--- | :--- |
| **Progressive Disclosure** | Text/media that reveals step-by-step to prevent overwhelm. | `progressive-disclosure.js`: Handles timing and DOM element revealing. |
| **Gamified Exploration** | Non-linear discovery (maps, point-and-click). | `gamified-exploration.js`: Manages canvas/SVG clickable nodes and unlocking logic. |
| **Knowledge Construction** | Active learning (drag-and-drop, builders). | `knowledge-construction.js`: Drag & Drop API, slot validation logic. |
| **Interactive Simulation** | Complex systems (sliders, graphs, balances). | `interactive-simulation.js`: Real-time canvas rendering driven by user inputs (e.g., Timelines, Balance Scales). |
| **Scenario Based** | Decision making (roleplay, branching paths). | `scenario-based.js`: Branching logic tree evaluator. |

**Architecture Note**: These methods are designed with **Encapsulation Rules** (see `design_docs/lesson_isolation.md`). They do not pollute the global scope; they render into a specific Container provided by the Runner.

---

## 4. The Content Pipeline (How to Build)
Creating a lesson follows a specific flow:

### Step 1: The Blueprint (`blueprint.md`)
*   **What**: Human-readable plan.
*   **Role**: Defines the pedagogical goal, the sequence of steps, and the method-to-content mapping.
*   **Example**: "Step 3 is 'Defining Cyberdelics', using 'Knowledge Construction' method."

### Step 2: The Manifest (`manifest.json`)
*   **What**: Machine-readable config.
*   **Role**: The actual instructions the `LessonRunner` reads.
*   **Structure**:
    ```json
    {
      "title": "Intro Module",
      "steps": [
        {
          "id": "intro.1",
          "method": "interactive-simulation",
          "config": { ...specific parameters... }
        }
      ]
    }
    ```

### Step 3: The Assets
*   **What**: Images, Audio, Texts.
*   **Role**: Referenced by the Manifest Config.

---

## 5. Design Documentation
The project is guided by strict pedagogical and technical rules located in `design_docs/`.

*   **`lesson-pedagogy.md`**: Defines **why** we teach this way (Constructivism vs. Instructionism).
*   **`lesson_isolation.md`**: Defines **how** code must be written to avoid conflicts (CSS scoping, cleanups).
*   **`visual-enhancements.md`**: Defines the "Cyberdelic" look (Glows, Glitch effects, Color theory).

---

## 6. The "AI Agent" Role
In this ecosystem, there are two "Agents":

1.  **The System Agent (`LessonRunner`)**:
    *   This is the code running in the browser. It "decides" what step comes next based on user input. It "listens" to events (like a completed drag-and-drop) and unlocks the next stage. Use this to create "Adaptive Learning" (e.g., "User failed the quiz? Route to a review step").

2.  **The Dev Agent (Me/Antigravity)**:
    *   I act as the Architect and Builder. I read your generic requests ("Make a timeline lesson") and convert them into the specific Code (JS/JSON) required by the Architecture described above.

## Summary: How it Works Together
1.  **User** opens `index.html` (or `test-runner.html`).
2.  **Browser** loads `core/styles.css` and `core/lesson-runner.js`.
3.  **Runner** initializes `LessonUI`, rendering the Cyberdeck Shell.
4.  **Runner** fetches `manifest.json`.
5.  **Runner** sees "Step 1 is Progressive Disclosure".
6.  **Runner** dynamically loads `methods/progressive-disclosure/progressive-disclosure.js`.
7.  **Method** renders content into the Main Content Area.
8.  **User** interacts -> **Method** signals "Complete".
9.  **Runner** loads Step 2... and so on.
