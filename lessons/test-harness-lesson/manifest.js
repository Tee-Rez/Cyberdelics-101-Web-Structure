/**
 * CYBERDELICS 101: FRAMER TEST HARNESS MANIFEST
 * A simplified version of Intro Manifest for quick testing.
 */

window.CourseManifest = {
    "title": "Cyberdelics 101: Test Module",
    "description": "Shortened sequence for verify Save/Load states.",
    "theme": { "primaryColor": "#ff0088", "fontBody": "Rajdhani, sans-serif" },
    "modules": [
        // MODULE 1: Intro (Progressive Disclosure)
        {
            "id": "test.1",
            "title": "Part 1: The Beginning",
            "type": "progressive-disclosure",
            "content": {
                "sections": [
                    { "title": "Section A", "content": "<p>This is Step 1. Collect the item below.</p>", "triggerLabel": "Next" },
                    { "title": "Section B", "content": "<p>This is Step 2.</p>", "triggerLabel": "Finish Part 1" }
                ]
            },
            "artifacts": [
                { "id": "test_artifact_1", "label": "Test Item Alpha", "icon": "🅰️", "trigger": "step_complete" }
            ]
        },

        // MODULE 2: Middle (Simulation)
        {
            "id": "test.2",
            "title": "Part 2: The Simulation",
            "type": "interactive-simulation",
            "config": {
                "engine": "node-zoom",
                "data": {
                    "nodes": [
                        {
                            "id": "root", "label": "Test Root", "children": [
                                { "id": "node_a", "label": "Node A" },
                                { "id": "node_b", "label": "Node B" }
                            ]
                        }
                    ]
                }
            },
            "artifacts": [
                { "id": "test_artifact_2", "label": "Test Item Beta", "icon": "🅱️", "trigger": "step_complete" }
            ]
        },

        // MODULE 3: End (Scenario)
        {
            "id": "test.3",
            "title": "Part 3: The Conclusion",
            "type": "scenario-based",
            "content": {
                "scenes": [
                    {
                        "id": "start",
                        "narrative": "<p>You have reached the end. Did the save system work?</p>",
                        "choices": [
                            { "label": "Yes, it works!", "outcome": "success" },
                            { "label": "No, it failed.", "outcome": "fail" }
                        ]
                    },
                    { "id": "success", "narrative": "<h3>Great Success!</h3>" },
                    { "id": "fail", "narrative": "<h3>Oh no. Debug time.</h3>" }
                ]
            }
        }
    ]
};
