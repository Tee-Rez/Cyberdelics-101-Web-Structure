# Cyberdelics 101 Manifest Creation Guide

This guide defines the STRICT schema for creating lesson manifest files (`Mini-Lesson_X.X.json`).
**DO NOT DEVIATE FROM THIS STRUCTURE.**

**CRITICAL REQUIREMENT:** Before drafting any manifest content, you MUST read the `CyberdelicStyleGuide.txt` file located in the root directory. All written content (narratives, panels, questions, feedback) MUST adhere to the voice, tone, and formatting rules defined in that style guide.

## 1. Top-Level Structure

The manifest MUST be a JSON object with **ONLY** the following top-level keys.
**DO NOT** include `manifestVersion`, `lessonId`, `subtitle`, or `author`.

```json
{
    "title": "Lesson Title Here",
    "description": "Brief description of the lesson content.",
    "theme": {
        "primaryColor": "#5900ff",
        "fontBody": "Rajdhani, sans-serif"
    },
    "modules": [
        // Array of module objects (see below)
    ]
}
```

## 2. Module Objects

Each object in the `modules` array represents a teaching method.

### Common Properties for ALL Modules
*   `id` (String): Unique identifier (e.g., `sim_1.1`, `quiz_1.1`).
*   `title` (String): Title displayed in the UI.
*   `type` (String): One of the supported method types:
    *   `progressive-disclosure`
    *   `interactive-simulation`
    *   `scenario-based`
    *   `knowledge-construction`
*   `content` (Object): Method-specific data.

### Method-Specific Schemas

#### A. Progressive Disclosure
Used for segmented storytelling.
**Key Rules:**
*   Use `triggerLabel` for the button text (NOT `triggerText`).
*   Images must be objects: `{ "type": "image", "src": "..." }`.
*   Layout options: `left`, `right`, `full`.

```json
{
    "id": "intro_pd",
    "title": "Introduction",
    "type": "progressive-disclosure",
    "content": {
        "sections": [
            {
                "title": "Section Title",
                "content": "<p>HTML content here.</p>",
                "media": {
                    "type": "image",
                    "src": "../path/to/image.jpg",
                    "alt": "Description"
                },
                "mediaLayout": "left",
                "triggerLabel": "Next Section"
            }
        ]
    }
}
```

#### B. Scenario-Based (Quiz)
Used for multiple-choice questions and branching scenarios.
**Key Rules:**
*   Use `scenes` array.
*   Each scene has `choices`.
*   `outcome` denotes the ID of the next scene. To terminate a scenario and advance to the next module, use the keyword `"complete"`. Do NOT use `"end"` or `"quiz_complete"`.

```json
{
    "id": "quiz_1",
    "title": "Knowledge Check",
    "type": "scenario-based",
    "content": {
        "scenes": [
            {
                "id": "q1",
                "narrative": "<h3>Question Text</h3>",
                "choices": [
                    {
                        "id": "opt_a",
                        "label": "Option A Interaction",
                        "outcome": "q1_feedback_a"
                    },
                    {
                        "id": "opt_b",
                        "label": "Option B (Correct)",
                        "outcome": "q2"
                    }
                ]
            },
            {
                "id": "q1_feedback_a",
                "narrative": "<p>Feedback text.</p>",
                "choices": [
                    {
                        "id": "retry",
                        "label": "Try Again",
                        "outcome": "q1"
                    }
                ]
            }
        ]
    }
}
```

#### C. Interactive Simulation
Used for interactive engines.

```json
{
    "id": "sim_1",
    "title": "Simulation Title",
    "type": "interactive-simulation",
    "content": {
        "engine": "StartTheReactor",
        "params": {
            "param1": "value"
        },
        "hideContinueButton": true
    }
}
```

#### `option-selector` (Quiz)
Used for creating multiple-choice quizzes, assessments, or reflection prompts. Supports single-select and multi-select modes, and sequential questions within a single module.

```json
{
    "id": "quiz_1.1",
    "title": "Etymology Quiz",
    "type": "option-selector",
    "config": {
        "mode": "single", // "single" or "multi"
        "style": "text",   // "text" or "card"
        "questions": [
            {
                "question": "<h3>Question 1</h3><p>What is X?</p>",
                "options": [
                    { "id": "a", "label": "Option A", "correct": true },
                    { "id": "b", "label": "Option B", "correct": false }
                ],
                "synthesis": {
                    "a": "Correct feedback!",
                    "b": "Incorrect feedback."
                }
            },
            {
                "question": "<h3>Question 2</h3><p>What is Y?</p>",
                "options": [
                    { "id": "c", "label": "Option C", "correct": false },
                    { "id": "d", "label": "Option D", "correct": true }
                ],
                "synthesis": {
                    "d": "Great job!"
                }
            }
        ]
    }
}
```

#### Legacy Support (Single Question)
The component also supports the legacy single-question format for backward compatibility:
```json
{
    "question": "Make a selection:",
    "options": [...],
    "synthesis": {...}
}
```

#### E. Knowledge Construction (Drag-and-Drop)
Used for matching exercises and category sorting activities. This relies strictly on the `content` block and the `"templateType": "categories"` format.

**Key Rules:**
*   Module should use `"type": "knowledge-construction"`.
*   All data goes inside the `content` object (NOT `config`).
*   Set `"templateType": "categories"` to use the standard built-in layout.
*   Define a `categories` array containing objects with `id`, `label`, and (optionally) `color`.
*   Define an `items` array with objects containing `id`, `text`, and `correctCategory` mapping to a category ID.
*   (Optional) Define a `distractors` array with objects containing `id` and `text`. Distractors do not belong to any category.

```json
{
  "id": "concept_match",
  "title": "Module Title Here",
  "type": "knowledge-construction",
  "content": {
    "title": "In-Exercise Title",
    "instruction": "Drag the items into the correct categories.",
    "templateType": "categories",
    "categories": [
      { "id": "cat_1", "label": "Hardware", "color": "#ff6b6b" },
      { "id": "cat_2", "label": "Software", "color": "#339af0" }
    ],
    "items": [
      { "id": "item_1", "text": "VR Headset", "correctCategory": "cat_1" },
      { "id": "item_2", "text": "Game Engine", "correctCategory": "cat_2" }
    ],
    "distractors": [
      { "id": "distractor_1", "text": "Screwdriver" }
    ]
  }
}
```

## 4. Important Rules
1.  **NO Extra Top-Level Fields**: Do not add metadata fields that are not defined in the Lesson Runner.
2.  **Relative Paths**: Image paths should be relative to the manifest location or standard assets path (`../../assets/...`).
3.  **JSON Syntax**: Ensure valid JSON (no trailing commas, double quotes for keys/strings).
4.  **Sequential Generation**: If tasked with creating multiple mini-lesson manifests, **DO NOT generate them all at once**. Create them **one at a time**, presenting each manifest for review before moving on to the next.
