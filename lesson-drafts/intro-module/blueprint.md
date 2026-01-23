# Lesson Blueprint: Intro Module

We are mapping the 10 conceptual steps to our 5 available Teaching Methods.

## Method Mapping Strategy

| Step | User Concept | Mapped Technical Method | Configuration Strategy |
| :--- | :--- | :--- | :--- |
| **1** | **Welcome** | `ProgressiveDisclosure` | Use "Splitting" text reveals. Background: Canvas animation (custom script allowed in method?). We will use standard PD with robust CSS animations. |
| **2** | **Course Map** | `GamifiedExploration` | A "Map" style game. The "Nodes" are modules. Collecting/Visiting them reveals info. |
| **3** | **Definitions** | `KnowledgeConstruction` | **Perfect Match**. Drag items (VR, Biofeedback) into the "Equation" slots. |
| **4** | **Who For?** | `InteractiveSimulation` | **Constellation Personas**. Floating persona nodes around a central circle. Click to select/deselect. Shows synthesized insights based on selected combinations. |
| **5** | **Features** | `ProgressiveDisclosure` | A simple "Tour". Click 'Next' to highlight different UI elements (mocked via images). |
| **6** | **Why Now?** | `InteractiveSimulation` | A "Time Slider". Input: Year (Slider). Output: Text/Visuals describing the state of tech/society. |
| **7** | **Setup** | `KnowledgeConstruction` | "Assemble your Space". Drag Headphones, Notebook into a "Ready Zone". |
| **8** | **Balance** | `InteractiveSimulation` | A "Balance Scale" sim. User adjusts a slider to balance "Rigor" and "Mystery". Aim for 50/50. |
| **9** | **Expectations** | `ScenarioBased` | "Myth Busting". Present a statement (e.g. "This certifies me as a therapist"). User chooses "True/False". |
| **10** | **Launch** | `ProgressiveDisclosure` | Final inspiring text + Big Button to "Exit Lesson". |

## Manifest Structure Draft

```json
{
  "lessonId": "intro-module",
  "title": "Cyberdelics 101: Orientation",
  "modules": [
    { "id": "1-welcome", "type": "progressive-disclosure" },
    { "id": "2-map", "type": "gamified-exploration", "config": { "mode": "map", "nodes": [...] } },
    { "id": "3-def", "type": "knowledge-construction", "config": { "mode": "equation" } },
    { "id": "4-persona", "type": "interactive-simulation", "config": { "engine": "constellation-personas" } },
    { "id": "5-features", "type": "progressive-disclosure" },
    { "id": "6-timeline", "type": "interactive-simulation", "config": { "engine": "time-slider" } },
    { "id": "7-setup", "type": "knowledge-construction" },
    { "id": "8-balance", "type": "interactive-simulation", "config": { "engine": "balance-scale" } },
    { "id": "9-mythbuster", "type": "scenario-based" },
    { "id": "10-launch", "type": "progressive-disclosure" }
  ]
}
```

## Technical Needs
1.  **New Sim Engine**: `time-slider` (Simple input->output mapping).
2.  **New Sim Engine**: `balance-scale` (Visual physics or simple math).
3.  **New Sim Engine**: `constellation-personas` (Floating nodes with multi-selection and synthesized insights).
4.  **Gamified Map**: Need to ensure `GamifiedExploration` supports a static background with clickable nodes (it should, via "hidden items" or just standard sprites).

## Teach-Before-Test Validation
*   **Step 3 (Def)**: We teach the parts before asking them to build? -> *Yes, the drag source bank acts as the teacher.*
*   **Step 9 (Myths)**: We verify assumptions. This is good "Pre-training".

## User Review Required
*   Is "Choose Your Path" acceptable for "Who is this for?" knowing it limits them to viewing ONE persona at a time? (Alternatively, we could use a non-linear Map for this too).
*   *Decision*: Use `ChooseYourPath` but allow "Loop back" or just selecting one major one is fine for a 1-min section.
