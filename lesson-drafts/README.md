# Lesson Drafts Workspace

This directory is the "sandbox" for the **Lesson Builder Assistant**.

## How to use
1.  **Start a new draft**: Run the `/build-lesson` workflow or ask the Agent to "Start a new lesson draft".
2.  **Process**:
    *   The Agent will create a folder here (e.g., `lesson-drafts/intro-to-cybernetics/`).
    *   It will store the `brief.md` (your input).
    *   It will generate a `manifest.json` (the lesson structure).
    *   It will create a temporary test file to verify the lesson.
3.  **Finalize**: Once verified, the Agent will move the folder to the main `lessons/` directory.

## Directory Structure
*   `[lesson-slug]/`
    *   `brief.md`: The raw content and goals.
    *   `manifest.json`: The technical definition of the lesson.
    *   `assets/`: Any images or specific media.
    *   `test-runner.html`: A self-contained test file for this specific draft.
