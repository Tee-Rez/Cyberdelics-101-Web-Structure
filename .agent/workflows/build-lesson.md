---
description: Interactive workflow for building a new Cyberdelics 101 lesson using the Lesson Runner architecture.
---

# Lesson Builder Assistant Workflow

Follow this interactive process to build a robust, pedagogically sound lesson.

## Preparation
1.  **Read Rules**: Read `design_docs/lesson-pedagogy.md` to understand the "Teach-Before-Assessment" rule and method mappings.
2.  **Verify Runner**: Ensure `core/lesson-runner.js` and factories are available (view `core/lesson-runner.js` if unsure).

## Phase 1: Intake & Discovery
**Prompt the user for the following:**
*   **Topic/Title**: What is the name of this lesson?
*   **Raw Content**: Paste the text, notes, or rough outline of the material to be taught.
*   **Learning Goal**: Complete the sentence: "By the end of this lesson, the user will be able to..."
*   **Vibe**: What is the desired emotional tone? (e.g., Clinical, Trippy, Urgent, Historical).

**Action**:
*   Create a directory `lesson-drafts/[lesson-slug]`.
*   Create a file `lesson-drafts/[lesson-slug]/brief.md` storing these answers.

## Phase 2: Structural Blueprinting
**Analyze the Raw Content:**
*   Break it down into 3-5 distinct "Beats" or "Concepts".
*   Map each beat to a **Teaching Method** using the matrix in `lesson-pedagogy.md`.
*   **CRITICAL CHECK**: identifying an "Assessment" beat? Ensure the *previous* beat taught the necessary concept.

**Propose the Blueprint to the User:**
*   Present a list of steps in this format:
    *   **Step 1**: [Method Name] - [Brief Description of activity] (Goal: [Learning Goal])
    *   **Step 2**: ...
*   *Ask for approval before proceeding.*

## Phase 3: Manifest Generation
**Once the Blueprint is approved:**
1.  Create `lesson-drafts/[lesson-slug]/manifest.json`.
2.  Construct the JSON object adhering to the schema used in `test-manifest-runner.html`.
3.  Define specific configuration for each module (e.g., Simulation `config` params, Knowledge Construction `items` and `slots`).

## Phase 4: Content Fabrication
**Flesh out the Manifest:**
*   For `progressive-disclosure`: Write the actual narrative text chunks.
*   For `gamified-exploration`: Define the items to collect and their descriptions.
*   For `interactive-simulation`: If a NEW engine is needed, propose a plan to write it in `methods/interactive-simulation/engines/`. If using an existing one, configure it.
*   For `scenario-based`: Write the scenes, choices, and outcomes.

**Action**:
*   Update `lesson-drafts/[lesson-slug]/manifest.json` with the full content.

## Phase 5: Verification
1.  Create a test file `lesson-drafts/[lesson-slug]/test-[lesson-slug].html`.
2.   boilerplate it (copy from `test-manifest-runner.html`) to load the specific manifest you just built.
3.  **Run the verification**: Open the test file in the browser (if possible) or ask the user to.

## Phase 6: Finalization
1.  Ask user if they want to move the validated lesson to the main `lessons/` directory.
2.  If yes, copy files to `lessons/[lesson-slug]/`.
3.  Update the main course index or manifest list (if applicable).
