---
description: Workflow for creating a valid Cyberdelics 101 lesson manifest JSON file.
---

# Create Lesson Manifest

Follow this workflow to create a standard lesson manifest file.

## 1. Prerequisites
1.  **Read the Guide**: You **MUST** read `Modules/MANIFEST_CREATION_GUIDE.md` before generating any JSON.
    *   *CRITICAL*: Do NOT include `manifestVersion`, `lessonId`, or `subtitle` in the root object.
    **CRITICAL REQUIREMENT:** Before drafting any manifest content, you MUST read the `CyberdelicStyleGuide.txt` file located in the root directory. All written content (narratives, panels, questions, feedback) MUST adhere to the voice, tone, and formatting rules defined in that style guide.

## 2. Content Preparation
1.  **Review Source Material**: Read the lesson content or brief.
2.  **Determine Structure**:
    *   Identify the teaching methods (Progressive Disclosure, Quiz, etc.).
    *   Draft the `modules` array structure.

## 3. JSON Generation
**CRITICAL RULE: ONE AT A TIME**
If you have been asked to create MULTIPLE mini-lessons or an entire module, **DO NOT** generate all the manifests at once or in a single pass. Create the first manifest, ask the user for review/approval, and only proceed to generate the next manifest after it is approved.

1.  **Create File**: Create `Mini-Lesson_X.X.json` in the appropriate `Manifests` folder.
2.  **Generate JSON**: Write the JSON content strictly following the schema from the Guide.
    *   Root keys: `title`, `description`, `theme` (opt), `modules`.
    *   Module keys: `id`, `title`, `type`, `content`.
    *   *Note*: Progressive Disclosure uses `triggerLabel`, NOT `triggerText`.
    *   *Note*: Scenario-based uses `scenes`, NOT `questions`.

## 4. Verification
1.  **Lint Check**: Ensure valid JSON syntax.
2.  **Schema Check**: Verify no extra keys are present.