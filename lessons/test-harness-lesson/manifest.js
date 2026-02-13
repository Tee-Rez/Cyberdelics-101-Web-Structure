/**
 * CYBERDELICS 101: FRAMER TEST HARNESS MANIFEST
 * A simplified version of Intro Manifest for quick testing.
 */

window.CourseManifest = {
    "title": "Different Paths",
    "description": "Explores the distinctions between psychedelics and cyberdelics through an interactive spectrum.",
    "theme": {
        "primaryColor": "#5900ff",
        "fontBody": "Rajdhani, sans-serif"
    },
    "modules": [
        {
            "id": "spectrum_sim_2.2",
            "title": "Psychedelic ↔ Cyberdelic Spectrum Explorer",
            "type": "interactive-simulation",
            "content": {
                "engine": "spectrum-explorer",
                "startValue": 50
            }
        },
        {
            "id": "spectrum_quiz_2.2",
            "title": "Spectrum Quiz",
            "type": "scenario-based",
            "content": {
                "scenes": [
                    {
                        "id": "q1",
                        "narrative": "<h3>Question 1</h3><p><strong>Which aspect primarily DIFFERS between psychedelics and cyberdelics?</strong></p>",
                        "choices": [
                            {
                                "id": "q1_a",
                                "label": "The intention",
                                "outcome": "q1_wrong_a"
                            },
                            {
                                "id": "q1_b",
                                "label": "The method used",
                                "outcome": "q2"
                            },
                            {
                                "id": "q1_c",
                                "label": "Potential for mystical experiences",
                                "outcome": "q1_wrong_c"
                            },
                            {
                                "id": "q1_d",
                                "label": "Need for integration",
                                "outcome": "q1_wrong_d"
                            }
                        ]
                    },
                    {
                        "id": "q1_wrong_a",
                        "narrative": "<p>Incorrect. Intention is what they share. Method differs.</p>",
                        "choices": [
                            {
                                "id": "retry",
                                "label": "Try Again",
                                "outcome": "q1"
                            }
                        ]
                    },
                    {
                        "id": "q1_wrong_c",
                        "narrative": "<p>Incorrect. Both can produce mystical experiences. Method differs.</p>",
                        "choices": [
                            {
                                "id": "retry",
                                "label": "Try Again",
                                "outcome": "q1"
                            }
                        ]
                    },
                    {
                        "id": "q1_wrong_d",
                        "narrative": "<p>Incorrect. Both require integration. Method differs.</p>",
                        "choices": [
                            {
                                "id": "retry",
                                "label": "Try Again",
                                "outcome": "q1"
                            }
                        ]
                    },
                    {
                        "id": "q2",
                        "narrative": "<h3>Question 2</h3><p>Correct! <strong>Why might someone choose cyberdelics over psychedelics?</strong></p>",
                        "choices": [
                            {
                                "id": "q2_a",
                                "label": "They are always more powerful",
                                "outcome": "q2_wrong_a"
                            },
                            {
                                "id": "q2_b",
                                "label": "Medical/legal reasons or preference for tech",
                                "outcome": "quiz_complete"
                            },
                            {
                                "id": "q2_c",
                                "label": "Tech is more spiritual",
                                "outcome": "q2_wrong_c"
                            },
                            {
                                "id": "q2_d",
                                "label": "To avoid all risks",
                                "outcome": "q2_wrong_d"
                            }
                        ]
                    },
                    {
                        "id": "quiz_complete",
                        "narrative": "<h3>Quiz Complete!</h3><p>You understand the practical distinctions between these paths.</p>",
                        "choices": []
                    },
                    {
                        "id": "q2_wrong_a",
                        "narrative": "<p>Incorrect. Choice depends on context, not objective power.</p>",
                        "choices": [
                            {
                                "id": "retry",
                                "label": "Try Again",
                                "outcome": "q2"
                            }
                        ]
                    },
                    {
                        "id": "q2_wrong_c",
                        "narrative": "<p>Incorrect. Spirituality comes from intention, not medium.</p>",
                        "choices": [
                            {
                                "id": "retry",
                                "label": "Try Again",
                                "outcome": "q2"
                            }
                        ]
                    },
                    {
                        "id": "q2_wrong_d",
                        "narrative": "<p>Incorrect. Cyberdelics have different risks, not zero risk.</p>",
                        "choices": [
                            {
                                "id": "retry",
                                "label": "Try Again",
                                "outcome": "q2"
                            }
                        ]
                    }
                ]
            }
        }
    ]
};
