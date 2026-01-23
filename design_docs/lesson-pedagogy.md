# Lesson Builder Pedagogy & Rules

This document defines the strict pedagogical rules and method mappings for the **Lesson Builder Assistant**. The Agent MUST follow these guidelines when constructing new lessons for Cyberdelics 101.

## 1. Core Philosophy: The Cyberdelic Loop
Every lesson should follow a variation of this loop:
1.  **Prime (Hook)**: Grab attention, set context (Visuals, Progressive Disclosure).
2.  **Immerse (Explore)**: User interacts with the concept (Simulations, Gamified Exploration).
3.  **Construct (Synthesize)**: User builds understanding (Knowledge Construction).
4.  **Test (Apply)**: User applies knowledge in context (Scenario-Based, Choose-Your-Path).

## 2. The "Teach-Before-Assess" Rule
**CRITICAL**: Never ask a user to perform a task or make a decision without first ensuring they have been exposed to the necessary information.
*   **Illegal Pattern**: Starting a lesson with a "Knowledge Construction" drag-and-drop on concepts never mentioned.
*   **Legal Pattern**: Use "Progressive Disclosure" to introduce terms -> Use "Knowledge Construction" to reinforce them.
*   **Legal Pattern**: Use "Interactive Simulation" to show cause-and-effect -> Use "Scenario Based" to test that understanding.
*   **Legal Pattern**: Use "Gamified Exploration" (Timeline) to find artifacts entails -> Use "Knowledge Construction" to sequence them.

## 3. Content-to-Method Mapping Matrix
When analyzing source material, map the *type* of information to the *best* available method:

| Content Type | Recommended Method | Why? |
| :--- | :--- | :--- |
| **Historical Events, Chronology** | `GamifiedExploration` (Timeline) | Spatial visualization of time allows for better retention of sequence. |
| **Complex Systems, Cause-and-Effect** | `InteractiveSimulation` | Allows users to "poke" the system and build an intuitive mental model. |
| **Definitions, Relationships, Syntax** | `KnowledgeConstruction` | Drag-and-drop forces the user to actively build the mental structure. |
| **Ethical Dilemmas, Application** | `ScenarioBased` | Places the user in a situation where they must apply abstract concepts. |
| **Narrative, Theory, Introduction** | `ProgressiveDisclosure` | Prevents cognitive overload by revealing text in chunks. |
| **Branching Topics, adventures** | `ChooseYourPath` | Gives user agency over their learning journey. |

## 4. Lesson Building Workflow (The "Assistant" Logic)
When the user invokes the Lesson Builder, follow these phase:

### Phase 1: Intake & Discovery
*   **Goal**: Establish the "Raw Material".
*   **Actions**:
    1.  Create a folder `lesson-drafts/<lesson-name>`.
    2.  Ask the user for the raw content (text, PDFs, notes).
    3.  Ask for the "Vibe" (Core Emotion: Unsettling, wondrous, clinical?).
    4.  Ask for the "Learning Objective" (One sentence: "User will be able to...").

### Phase 2: Deconstruction & Mapping
*   **Goal**: Create the Blueprint.
*   **Actions**:
    1.  Break raw content into 3-5 distinct "Key Concepts".
    2.  For EACH concept, propose a **Method Pair** (Introduction Method + Assessment Method).
    3.  *Example*:
        *   *Concept*: "Feedback Loops"
        *   *Intro*: Simulation (User adjusts gain to see feedback).
        *   *Assess*: Scenario (User must Identify a feedback loop in a malfunctioning deck).

### Phase 3: Manifest Generation
*   **Goal**: The Technical Skeleton.
*   **Actions**:
    1.  Draft `manifest.json`.
    2.  Define the exact configuration for each module (e.g., simulation parameters, specific drag-and-drop terms).

### Phase 4: Content Fabrication
*   **Goal**: The Flesh.
*   **Actions**:
    1.  Write the specific text/narrative for each step.
    2.  Check tone consistency with the "Vibe".

### Phase 5: Assembly & Verification
*   **Goal**: The Product.
*   **Actions**:
    1.  Update the global `LessonManifest`.
    2.  Create/Update the index HTML file or test runner.
    3.  Verify: Does every assessment have a preceding teacher?
