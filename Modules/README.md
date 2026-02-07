# Modules

This directory contains the course modules for Cyberdelics 101.

## Structure

```
Modules/
├── Module_1_DefiningCyberdelics/
│   └── Lesson_1_CoreDefinitions&Components/
│       └── Manifests/
│           ├── Mini-Lesson_1.1.json
│           ├── Mini-Lesson_1.2.json
│           └── ...
```

## Manifest File Naming Convention

Each mini-lesson manifest follows the pattern:
`Mini-Lesson_[ModuleNumber].[LessonNumber].json`

Example: `Mini-Lesson_1.1.json` for the first mini-lesson in Module 1, Lesson 1

## Loading Manifests

All manifest files are designed to be loaded by `universal-player.html` using the Framer-based architecture.

## Content Notes

- **Images**: AI image prompts are included as notes within methods requiring visual content
- **Interactive Methods**: Undesigned interactive methods include simple placeholders with descriptive text

## Module Types

The following teaching method types are available for mini-lessons:

- `progressive-disclosure`: Click-to-reveal sections with optional images
- `scenario-based`: Branching narrative with choices and outcomes
- `interactive-simulation`: Custom interactive experiences (placeholders for future development)
- `knowledge-construction`: Drag-and-drop building exercises

**Note on Quizzes:** Quizzes are implemented using `type: "scenario-based"` where each question becomes a scene with choices that branch to feedback scenes or the next question. There is no separate "quiz" type.
