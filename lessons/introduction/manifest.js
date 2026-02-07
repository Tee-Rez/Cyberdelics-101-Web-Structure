/**
 * CYBERDELICS 101: INTRO MODULE MANIFEST
 * Bundled as JS to avoid local file CORS restrictions.
 * CORRECTED SCHEMA: steps->modules, method->type, config adjustments.
 */

window.CourseManifest = {
    "title": "Cyberdelics 101: Introduction",
    "description": "Orient learners to the enhanced interactive learning system while introducing course scope.",
    "theme": {
        "primaryColor": "#00d9ff",
        "fontBody": "Rajdhani, sans-serif"
    },
    "modules": [
        {
            "id": "intro.1",
            "title": "Welcome & Course Opening",
            "type": "progressive-disclosure",
            "content": {
                "sections": [
                    {
                        "title": "Left Layout Test",
                        "media": {
                            "type": "image",
                            "src": "https://placehold.co/600x400/00d9ff/000000?text=Left+Layout",
                            "caption": "Image on Left"
                        },
                        "mediaLayout": "left",
                        "content": "<p>This content should appear on the <strong>RIGHT</strong>. The image takes up 30% of the card width on the left side.</p><p>We are testing the flex-row behavior inside the card content area.</p>",
                        "triggerLabel": "Next Test"
                    },
                    {
                        "title": "Right Layout Test",
                        "media": {
                            "type": "image",
                            "src": "https://placehold.co/600x400/ff0055/ffffff?text=Right+Layout",
                            "caption": "Image on Right"
                        },
                        "mediaLayout": "right",
                        "content": "<p>This content should appear on the <strong>LEFT</strong>. The image takes up 30% of the card width on the right side.</p><p>We are testing the flex-row-reverse behavior.</p>",
                        "triggerLabel": "Next Test"
                    },
                    {
                        "title": "Single Image No Content Test",
                        "media": {
                            "type": "image",
                            "src": "https://placehold.co/800x400/9900ff/ffffff?text=Full+Width+Image",
                            "caption": "Full Width (No Content)"
                        },
                        // No content provided, should default to 'full' layout
                        "triggerLabel": "Finish Tests"
                    }
                ]
            },
            "artifacts": [
                {
                    "id": "welcome_pioneer",
                    "label": "Welcome Pioneer",
                    "description": "You've taken your first step into the cyberdelic frontier.",
                    "icon": "✨",
                    "trigger": "step_complete"
                }
            ]
        },
        {
            "id": "intro.2",
            "title": "Course Structure Overview",
            "type": "interactive-simulation",
            "config": {
                "engine": "node-zoom",
                "layout": "circular",
                "zoomSpeed": 0.8,
                "data": {
                    "nodes": [
                        {
                            "id": "root",
                            "label": "Cyberdelics 101",
                            "icon": "🌌",
                            "children": [
                                {
                                    "id": "module_intro",
                                    "label": "Introduction",
                                    "icon": "🚩",
                                    "x": 50, "y": 20,
                                    "children": [
                                        { "id": "intro_1", "label": "Welcome", "icon": "✨" },
                                        { "id": "intro_2", "label": "Structure", "icon": "🗺️" },
                                        { "id": "intro_3", "label": "Personas", "icon": "👥" },
                                        { "id": "intro_4", "label": "Methods", "icon": "🛠️" },
                                        { "id": "intro_5", "label": "Begin", "icon": "🚀" }
                                    ]
                                },
                                {
                                    "id": "module_1",
                                    "label": "Module 1: Defining Cyberdelics",
                                    "icon": "1️⃣",
                                    "x": 80, "y": 35,
                                    "children": [
                                        { "id": "m1_1", "label": "Definition", "icon": "📖" },
                                        { "id": "m1_2", "label": "Pillars", "icon": "🏛️" },
                                        { "id": "m1_3", "label": "Spectrum", "icon": "🌈" },
                                        { "id": "m1_4", "label": "Tech", "icon": "💻" },
                                        { "id": "m1_5", "label": "Synthesis", "icon": "🔄" }
                                    ]
                                },
                                {
                                    "id": "module_2",
                                    "label": "Module 2: Historical Foundations",
                                    "icon": "📜",
                                    "x": 80, "y": 65,
                                    "children": [
                                        { "id": "m2_1", "label": "Rituals", "icon": "🔥" },
                                        { "id": "m2_2", "label": "Alchemy", "icon": "⚗️" },
                                        { "id": "m2_3", "label": "Counterculture", "icon": "☮️" },
                                        { "id": "m2_4", "label": "Early VR", "icon": "🕶️" },
                                        { "id": "m2_5", "label": "Evolution", "icon": "🧬" }
                                    ]
                                },
                                {
                                    "id": "module_3",
                                    "label": "Module 3: Scientific Understanding",
                                    "icon": "🧠",
                                    "x": 50, "y": 80,
                                    "children": [
                                        { "id": "m3_1", "label": "Neuroscience", "icon": "🧠" },
                                        { "id": "m3_2", "label": "Immersion", "icon": "🌊" },
                                        { "id": "m3_3", "label": "States", "icon": "🌀" },
                                        { "id": "m3_4", "label": "Plasticity", "icon": "🧩" },
                                        { "id": "m3_5", "label": "Research", "icon": "📊" }
                                    ]
                                },
                                {
                                    "id": "module_4",
                                    "label": "Module 4: Current Applications",
                                    "icon": "🛠️",
                                    "x": 20, "y": 65,
                                    "children": [
                                        { "id": "m4_1", "label": "VR/AR", "icon": "👓" },
                                        { "id": "m4_2", "label": "Biofeedback", "icon": "💓" },
                                        { "id": "m4_3", "label": "Entrainment", "icon": "〰️" },
                                        { "id": "m4_4", "label": "Therapy", "icon": "⚕️" },
                                        { "id": "m4_5", "label": "Art", "icon": "🎨" }
                                    ]
                                },
                                {
                                    "id": "module_5",
                                    "label": "Module 5: Cyberdelic Ecosystem",
                                    "icon": "🌐",
                                    "x": 20, "y": 35,
                                    "children": [
                                        { "id": "m5_1", "label": "Community", "icon": "🤝" },
                                        { "id": "m5_2", "label": "Festivals", "icon": "🎪" },
                                        { "id": "m5_3", "label": "Ethics", "icon": "⚖️" },
                                        { "id": "m5_4", "label": "Future", "icon": "🔮" },
                                        { "id": "m5_5", "label": "Integration", "icon": "🌱" }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
            "artifacts": [
                {
                    "id": "course_navigator",
                    "label": "Course Navigator",
                    "description": "You understand the path ahead. Each module builds systematically toward mastery.",
                    "icon": "🧭",
                    "fragments": ["module_intro", "module_1", "module_2", "module_3", "module_4", "module_5"],
                    "trigger": "step_complete"
                }
            ]
        },
        {
            "id": "intro.3",
            "title": "Who This Course Is For",
            "type": "interactive-simulation",
            "config": {
                "engine": "constellation-personas",
                "hideContinueButton": true,
                "params": {
                    "personas": [
                        {
                            "id": "creator",
                            "name": "Creative Technologist",
                            "icon": "🎨",
                            "description": "You design experiences and want to push the boundaries of what's possible."
                        },
                        {
                            "id": "healer",
                            "name": "Mindful Practitioner",
                            "icon": "🧘",
                            "description": "You guide others through meditation, therapy, or coaching."
                        },
                        {
                            "id": "explorer",
                            "name": "Consciousness Explorer",
                            "icon": "🔮",
                            "description": "You're personally curious about altered states and self-discovery."
                        },
                        {
                            "id": "researcher",
                            "name": "Academic Researcher",
                            "icon": "🔬",
                            "description": "You study consciousness, neuroscience, or human-computer interaction."
                        },
                        {
                            "id": "builder",
                            "name": "Entrepreneur",
                            "icon": "🚀",
                            "description": "You're building products in wellness, VR, or mental health tech."
                        }
                    ]
                },
            },
            "artifacts": [
                {
                    "id": "community_connection",
                    "label": "Community Connection",
                    "description": "You recognize yourself among fellow pioneers.",
                    "icon": "🤝",
                    "fragments": ["creator", "healer", "explorer", "researcher", "builder"],
                    "trigger": "step_complete"
                }
            ]
        },
        {
            "id": "intro.4",
            "title": "Learning Approach & Success Tips",
            "type": "scenario-based",
            "content": {
                "scenes": [
                    {
                        "id": "intro",
                        "narrative": "<h3>Meet Alex</h3><p>Abstract advice is forgettable. Stories and situations are memorable.</p><p>You're about to meet Alex, a learner taking this course. They face common challenges. How would YOU advise them?</p>",
                        "choices": [
                            {
                                "id": "begin",
                                "label": "Begin Alex's Journey",
                                "outcome": "scenario1"
                            }
                        ]
                    },
                    {
                        "id": "scenario1",
                        "narrative": "<h3>Scenario: Alex's First Day</h3><p>Alex is excited to start Cyberdelics 101 but feels overwhelmed by how much content there is. They're tempted to speed through videos at 2x speed to get done faster and \"check the box.\"</p><p><strong>What would you tell Alex?</strong></p>",
                        "choices": [
                            {
                                "id": "s1_a",
                                "label": "Speed through if you want—retention doesn't really matter, just complete it.",
                                "outcome": "s1_feedback_a"
                            },
                            {
                                "id": "s1_b",
                                "label": "This course is designed for deep engagement, not speed. Take your time, interact with everything, and let insights emerge.",
                                "outcome": "s1_feedback_b"
                            },
                            {
                                "id": "s1_c",
                                "label": "Try to finish as fast as possible so you can move on to the next course.",
                                "outcome": "s1_feedback_c"
                            }
                        ]
                    },
                    {
                        "id": "s1_feedback_b",
                        "narrative": "<h3>✓ Excellent Advice</h3><p>You chose the path of depth over speed.</p><p>Here's what happened: Alex slowed down, engaged fully with interactive simulations, collected all artifacts mindfully, and took notes. Three months later, Alex easily recalled core concepts and successfully applied them in real contexts.</p><p><strong>PRINCIPLE:</strong> This course prioritizes RETENTION over COMPLETION SPEED. Take the time needed to truly understand. The interactive methods work only if you engage with them.</p>",
                        "choices": [
                            {
                                "id": "next1",
                                "label": "Continue to Next Scenario →",
                                "outcome": "scenario2"
                            }
                        ]
                    },
                    {
                        "id": "s1_feedback_a",
                        "narrative": "<h3>Consider This...</h3><p>While completing the course quickly might feel efficient, research shows that rushing through educational content leads to only 10-20% retention.</p><p><strong>PRINCIPLE:</strong> This course prioritizes RETENTION over COMPLETION SPEED. Deep engagement with interactive elements is what makes the difference.</p>",
                        "choices": [
                            {
                                "id": "retry1",
                                "label": "Reconsider Your Advice",
                                "outcome": "scenario1"
                            }
                        ]
                    },
                    {
                        "id": "s1_feedback_c",
                        "narrative": "<h3>Consider This...</h3><p>The goal isn't to collect certificates—it's to gain genuine understanding you can apply. Speed-running defeats the purpose of interactive learning.</p><p><strong>PRINCIPLE:</strong> This course prioritizes RETENTION over COMPLETION SPEED. Take the time needed to truly understand.</p>",
                        "choices": [
                            {
                                "id": "retry1b",
                                "label": "Reconsider Your Advice",
                                "outcome": "scenario1"
                            }
                        ]
                    },
                    {
                        "id": "scenario2",
                        "narrative": "<h3>Scenario: Alex Encounters a Knowledge Check</h3><p>Alex just finished Lesson 1.2 and a knowledge check appears. Alex doesn't remember all the answers and feels frustrated. They're tempted to look up answers quickly or skip the check entirely.</p><p><strong>What would you tell Alex?</strong></p>",
                        "choices": [
                            {
                                "id": "s2_a",
                                "label": "These checks aren't important—skip them and keep moving forward.",
                                "outcome": "s2_feedback_a"
                            },
                            {
                                "id": "s2_b",
                                "label": "Knowledge checks reveal what you truly understood vs. what felt familiar. Review the lesson, then try again honestly.",
                                "outcome": "s2_feedback_b"
                            },
                            {
                                "id": "s2_c",
                                "label": "Look up all the answers quickly so you can get perfect scores and move on.",
                                "outcome": "s2_feedback_c"
                            }
                        ]
                    },
                    {
                        "id": "s2_feedback_b",
                        "narrative": "<h3>✓ Wise Counsel</h3><p>You encouraged Alex to embrace productive struggle.</p><p>Here's what happened: Alex went back to Lesson 1.2, re-engaged with the interactive sections they'd clicked through quickly, and discovered gaps in understanding. The second attempt at the knowledge check revealed true comprehension, and Alex felt genuinely confident moving forward.</p><p><strong>PRINCIPLE:</strong> Knowledge checks are LEARNING TOOLS, not high-stakes tests. They reveal what needs review. Honest engagement with them strengthens understanding.</p>",
                        "choices": [
                            {
                                "id": "next2",
                                "label": "Continue to Next Scenario →",
                                "outcome": "scenario3"
                            }
                        ]
                    },
                    {
                        "id": "s2_feedback_a",
                        "narrative": "<h3>Consider This...</h3><p>Knowledge checks are designed to reveal gaps in understanding—they're learning tools, not obstacles. Skipping them means missing valuable feedback about what you've actually mastered.</p>",
                        "choices": [
                            {
                                "id": "retry2",
                                "label": "Reconsider Your Advice",
                                "outcome": "scenario2"
                            }
                        ]
                    },
                    {
                        "id": "s2_feedback_c",
                        "narrative": "<h3>Consider This...</h3><p>Looking up answers defeats the purpose of knowledge checks. The goal is to discover what you genuinely understand, not to achieve perfect scores through shortcuts.</p>",
                        "choices": [
                            {
                                "id": "retry2b",
                                "label": "Reconsider Your Advice",
                                "outcome": "scenario2"
                            }
                        ]
                    },
                    {
                        "id": "scenario3",
                        "narrative": "<h3>Scenario: Alex and the Binaural Beats</h3><p>Alex unlocked their first binaural beat after collecting all artifacts in Module 1. They're curious but skeptical—can audio frequencies really affect consciousness and learning?</p><p><strong>What would you tell Alex?</strong></p>",
                        "choices": [
                            {
                                "id": "s3_a",
                                "label": "It's just a gimmick for motivation. Frequencies don't do anything real.",
                                "outcome": "s3_feedback_a"
                            },
                            {
                                "id": "s3_b",
                                "label": "Try it with curiosity and no expectations. Binaural beats are researched tools for brainwave entrainment. Notice subtle changes.",
                                "outcome": "s3_feedback_b"
                            },
                            {
                                "id": "s3_c",
                                "label": "They'll radically transform your consciousness immediately and profoundly.",
                                "outcome": "s3_feedback_c"
                            }
                        ]
                    },
                    {
                        "id": "s3_feedback_b",
                        "narrative": "<h3>✓ Balanced Perspective</h3><p>You encouraged open-minded exploration without hype.</p><p>Here's what happened: Alex listened to the 10 Hz Alpha frequency while reviewing Module 1 notes. They noticed feeling more focused and less distracted—subtle but real. Over time, Alex integrated binaural beats into their study routine as functional tools, not magic.</p><p><strong>PRINCIPLE:</strong> Binaural beats are EVIDENCE-BASED tools with subtle effects. Approach them with curiosity, notice changes, and integrate what works for you.</p>",
                        "choices": [
                            {
                                "id": "summary",
                                "label": "View Success Tips Summary →",
                                "outcome": "success_summary"
                            }
                        ]
                    },
                    {
                        "id": "s3_feedback_a",
                        "narrative": "<h3>Consider This...</h3><p>Binaural beats have been studied in neuroscience research for decades. While effects are subtle, they're measurable and can support focus, relaxation, and learning states.</p>",
                        "choices": [
                            {
                                "id": "retry3",
                                "label": "Reconsider Your Advice",
                                "outcome": "scenario3"
                            }
                        ]
                    },
                    {
                        "id": "s3_feedback_c",
                        "narrative": "<h3>Consider This...</h3><p>While binaural beats are evidence-based tools, overpromising their effects sets unrealistic expectations. The benefits are real but subtle—not magical transformations.</p>",
                        "choices": [
                            {
                                "id": "retry3b",
                                "label": "Reconsider Your Advice",
                                "outcome": "scenario3"
                            }
                        ]
                    },
                    {
                        "id": "success_summary",
                        "narrative": "<h3>Your Learning Success Framework</h3><p>Based on Alex's journey, here are the keys to success:</p><ul><li><strong>PACE YOURSELF</strong> - Deep engagement beats speed</li><li><strong>EMBRACE PRODUCTIVE STRUGGLE</strong> - Knowledge checks reveal true understanding</li><li><strong>ENGAGE HONESTLY WITH TOOLS</strong> - Approach with curiosity, notice subtle effects</li><li><strong>TAKE NOTES</strong> - Writing enhances retention significantly</li><li><strong>ALLOW REFLECTION TIME</strong> - Let concepts settle after each module</li><li><strong>TRUST THE PROCESS</strong> - This course is designed with cognitive science</li><li><strong>COLLECT ARTIFACTS MINDFULLY</strong> - Each represents genuine mastery</li></ul>"
                    }
                ]
            },
            "artifacts": [
                {
                    "id": "method_explorer",
                    "label": "Method Explorer",
                    "description": "Through Alex's journey, you've learned how to navigate this course for maximum retention and transformation.",
                    "icon": "🛠️",
                    "trigger": "step_complete"
                }
            ]
        },
        {
            "id": "intro.5",
            "title": "Why Now? The Current Moment",
            "type": "progressive-disclosure",
            "content": {
                "sections": [
                    {
                        "id": "convergence",
                        "title": "Multiple Domains Converging",
                        "content": "<p>You're learning about cyberdelics at a pivotal moment.</p><p>The field is emerging NOW because multiple separate domains have finally converged.</p>",
                        "triggerLabel": "See The Convergence"
                    },
                    {
                        "id": "tech_catalyst",
                        "title": "Technological Catalyst",
                        "content": "<p><strong>VR technology</strong> has finally become affordable, powerful, and accessible enough for consumer adoption.</p>",
                        "triggerLabel": "Next Factor"
                    },
                    {
                        "id": "science_validation",
                        "title": "Scientific Validation",
                        "content": "<p><strong>Neuroscience</strong> has advanced dramatically, while <strong>Consciousness Research</strong> has moved from the fringe to gaining serious academic legitimacy.</p>",
                        "triggerLabel": "Next Factor"
                    },
                    {
                        "id": "cultural_opening",
                        "title": "Cultural Opening",
                        "content": "<p>The <strong>Psychedelic Renaissance</strong> has created a cultural opening, normalizing the exploration of altered states of consciousness.</p>",
                        "triggerLabel": "The Result"
                    },
                    {
                        "id": "window_opportunity",
                        "title": "The Window of Opportunity",
                        "content": "<p>Ten years ago, this convergence wasn't possible.<br>Ten years from now, it will be established doctrine.</p><p><strong>But right now...</strong></p>",
                        "triggerLabel": "Your Position"
                    },
                    {
                        "id": "perfect_positioning",
                        "title": "You Are Perfectly Positioned",
                        "content": "<p>You're positioned at the perfect moment—early enough to genuinely shape an emerging field, with enough foundation to build on solid ground.</p><p>The future is built by people willing to learn deeply and contribute meaningfully.</p><p><strong>That's you.</strong></p>",
                        "triggerLabel": "Continue"
                    }
                ]
            }
        },
        {
            "id": "intro.6",
            "title": "What This Course Is Not",
            "type": "progressive-disclosure",
            "content": {
                "sections": [
                    {
                        "id": "not_medical",
                        "title": "✗ NOT MEDICAL TREATMENT",
                        "content": "<p>This is education, not therapy. For mental health challenges, work with qualified professionals.</p>"
                    },
                    {
                        "id": "not_technical",
                        "title": "✗ NOT TECHNICAL VR DEVELOPMENT TRAINING",
                        "content": "<p>We teach about the field, not Unity programming or 3D modeling.</p>"
                    },
                    {
                        "id": "not_certification",
                        "title": "✗ NOT FULL FACILITATOR CERTIFICATION",
                        "content": "<p>This 4-5 hour course provides foundational knowledge. Professional facilitation requires our comprehensive 80-hour certification.</p>"
                    },
                    {
                        "id": "not_replacement",
                        "title": "✗ NOT ADVOCACY FOR ABANDONING TRADITIONAL PRACTICES",
                        "content": "<p>Cyberdelics complement rather than replace meditation, therapy, or spiritual practices.</p>"
                    },
                    {
                        "id": "not_hype",
                        "title": "✗ NOT HYPE WITHOUT SUBSTANCE",
                        "content": "<p>We're honest about limitations, challenges, and unknowns.</p>"
                    },
                    {
                        "id": "what_it_is",
                        "title": "✓ WHAT THIS IS:",
                        "content": "<p>Comprehensive, evidence-based, balanced introduction to an emerging field.</p>"
                    }
                ]
            }
        },
        {
            "id": "intro.7",
            "title": "Knowledge Check & Binaural Unlock",
            "type": "scenario-based",
            "content": {
                "scenes": [
                    {
                        "id": "intro_quiz",
                        "narrative": "<h3>Knowledge Check</h3><p>Before unlocking your binaural beat reward, let's check your understanding of key concepts from the Introduction.</p><p>This isn't a high-stakes test—it's a learning tool that reveals what you've grasped and what might need review.</p><p><strong>5 questions covering the Introduction module.</strong></p>",
                        "choices": [
                            {
                                "id": "begin_quiz",
                                "label": "Begin Knowledge Check",
                                "outcome": "q1"
                            }
                        ]
                    },
                    {
                        "id": "q1",
                        "narrative": "<h3>Question 1 of 5</h3><p><strong>What is the primary purpose of the artifact collection system in this course?</strong></p>",
                        "choices": [
                            {
                                "id": "q1_a",
                                "label": "A) To gamify learning and provide superficial rewards",
                                "outcome": "q1_wrong"
                            },
                            {
                                "id": "q1_b",
                                "label": "B) To represent tangible mastery of key concepts and track progress",
                                "outcome": "q2"
                            },
                            {
                                "id": "q1_c",
                                "label": "C) To make the course longer and more complicated",
                                "outcome": "q1_wrong"
                            },
                            {
                                "id": "q1_d",
                                "label": "D) To compete with other learners on leaderboards",
                                "outcome": "q1_wrong"
                            }
                        ]
                    },
                    {
                        "id": "q1_wrong",
                        "narrative": "<p>Not quite. The artifact system represents genuine mastery of concepts, not superficial gamification.</p>",
                        "choices": [
                            {
                                "id": "q1_retry",
                                "label": "Try Again",
                                "outcome": "q1"
                            }
                        ]
                    },
                    {
                        "id": "q2",
                        "narrative": "<h3>Question 2 of 5</h3><p>✓ Correct!</p><p><strong>How does Cyberdelics 101 differ from traditional online courses in terms of learning outcomes?</strong></p>",
                        "choices": [
                            {
                                "id": "q2_a",
                                "label": "A) It's shorter and easier to complete",
                                "outcome": "q2_wrong"
                            },
                            {
                                "id": "q2_b",
                                "label": "B) It focuses only on entertainment value",
                                "outcome": "q2_wrong"
                            },
                            {
                                "id": "q2_c",
                                "label": "C) It uses interactive methods leading to 70-90% retention vs. 10-20%",
                                "outcome": "q3"
                            },
                            {
                                "id": "q2_d",
                                "label": "D) It requires VR equipment to complete",
                                "outcome": "q2_wrong"
                            }
                        ]
                    },
                    {
                        "id": "q2_wrong",
                        "narrative": "<p>Not quite. The key difference is the interactive approach leading to much higher retention rates.</p>",
                        "choices": [
                            {
                                "id": "q2_retry",
                                "label": "Try Again",
                                "outcome": "q2"
                            }
                        ]
                    },
                    {
                        "id": "q3",
                        "narrative": "<h3>Question 3 of 5</h3><p>✓ Correct!</p><p><strong>What is the Schumann Resonance frequency you're about to unlock?</strong></p>",
                        "choices": [
                            {
                                "id": "q3_a",
                                "label": "A) 10 Hz - Alpha Bridge",
                                "outcome": "q3_wrong"
                            },
                            {
                                "id": "q3_b",
                                "label": "B) 7.83 Hz - Earth's natural frequency",
                                "outcome": "q4"
                            },
                            {
                                "id": "q3_c",
                                "label": "C) 40 Hz - Gamma synthesis",
                                "outcome": "q3_wrong"
                            },
                            {
                                "id": "q3_d",
                                "label": "D) 528 Hz - Love frequency",
                                "outcome": "q3_wrong"
                            }
                        ]
                    },
                    {
                        "id": "q3_wrong",
                        "narrative": "<p>Not quite. The Schumann Resonance is 7.83 Hz—Earth's natural electromagnetic frequency.</p>",
                        "choices": [
                            {
                                "id": "q3_retry",
                                "label": "Try Again",
                                "outcome": "q3"
                            }
                        ]
                    },
                    {
                        "id": "q4",
                        "narrative": "<h3>Question 4 of 5</h3><p>✓ Correct!</p><p><strong>According to the course, what's the optimal approach to knowledge checks when you don't know all the answers?</strong></p>",
                        "choices": [
                            {
                                "id": "q4_a",
                                "label": "A) Skip them and keep moving forward",
                                "outcome": "q4_wrong"
                            },
                            {
                                "id": "q4_b",
                                "label": "B) Look up answers quickly to get perfect scores",
                                "outcome": "q4_wrong"
                            },
                            {
                                "id": "q4_c",
                                "label": "C) Review the lesson, embrace struggle, then try again honestly",
                                "outcome": "q5"
                            },
                            {
                                "id": "q4_d",
                                "label": "D) Knowledge checks aren't important in this course",
                                "outcome": "q4_wrong"
                            }
                        ]
                    },
                    {
                        "id": "q4_wrong",
                        "narrative": "<p>Not quite. Knowledge checks are learning tools—embrace the struggle and review honestly.</p>",
                        "choices": [
                            {
                                "id": "q4_retry",
                                "label": "Try Again",
                                "outcome": "q4"
                            }
                        ]
                    },
                    {
                        "id": "q5",
                        "narrative": "<h3>Question 5 of 5</h3><p>✓ Correct!</p><p><strong>Which statement best describes who this course is designed for?</strong></p>",
                        "choices": [
                            {
                                "id": "q5_a",
                                "label": "A) Only VR developers and programmers",
                                "outcome": "q5_wrong"
                            },
                            {
                                "id": "q5_b",
                                "label": "B) Only healthcare professionals and therapists",
                                "outcome": "q5_wrong"
                            },
                            {
                                "id": "q5_c",
                                "label": "C) Only people with prior meditation or psychedelic experience",
                                "outcome": "q5_wrong"
                            },
                            {
                                "id": "q5_d",
                                "label": "D) A diverse community including all of the above and more",
                                "outcome": "quiz_complete"
                            }
                        ]
                    },
                    {
                        "id": "q5_wrong",
                        "narrative": "<p>Not quite. This course welcomes a diverse community of learners from many backgrounds.</p>",
                        "choices": [
                            {
                                "id": "q5_retry",
                                "label": "Try Again",
                                "outcome": "q5"
                            }
                        ]
                    },
                    {
                        "id": "quiz_complete",
                        "narrative": "<h3>🎊 Knowledge Check Complete! 🎊</h3><p>✓ Excellent work!</p><p>You've demonstrated solid understanding of the Introduction concepts. You're ready to unlock your first consciousness-enhancing tool.</p><h3>Schumann Resonance - 7.83 Hz</h3><p><strong>\"Earth's Natural Frequency\"</strong></p><p>This frequency is known as the Schumann Resonance—Earth's electromagnetic \"heartbeat.\" Many report feeling grounded, present, and mentally clear when entrained to this frequency.</p><p><strong>Suggested Use:</strong></p><ul><li>Play while reviewing Introduction notes</li><li>Use before starting Module 1 for centered focus</li><li>Listen anytime you want grounding</li></ul><p>Your Right Sidebar now contains a fully functional binaural beat player. The beat will remain available throughout the entire course and beyond.</p>"
                    }
                ]
            },
            "artifacts": [
                {
                    "id": "journey_initiator",
                    "label": "Journey Initiator",
                    "description": "You've set your intention and demonstrated understanding. Your consciousness exploration begins with clarity and commitment.",
                    "icon": "🚀",
                    "trigger": "step_complete"
                }
            ]
        }
    ],
    "artifacts": [
        { "id": "welcome_pioneer", "label": "Welcome Pioneer", "icon": "✨", "description": "First step into the frontier." },
        { "id": "course_navigator", "label": "Course Navigator", "icon": "🧭", "description": "Full course structure explored.", "fragments": ["module_intro", "module_1", "module_2", "module_3", "module_4", "module_5"] },
        { "id": "community_connection", "label": "Community Connection", "icon": "🤝", "description": "Connected to the community.", "fragments": ["creator", "healer", "explorer", "researcher", "builder"] },
        { "id": "method_explorer", "label": "Method Explorer", "icon": "🛠️", "description": "Mastered learning methods." },
        { "id": "journey_initiator", "label": "Journey Initiator", "icon": "🚀", "description": "Ready to launch." }
    ]
};
