/**
 * Example Data for Venn Diagram Combiner Engine
 * These examples demonstrate the expected data structure for both visualization modes
 */

window.VennDiagramExamples = {
    /**
     * EXAMPLE 1: Cyberdelics Etymology (Combined Mode)
     * Demonstrates how two concepts merge into one unified concept
     */
    cyberdelicsCombined: {
        mode: 'combined',
        leftCircle: {
            label: 'CYBER',
            color: '#00D9FF',
            etymology: {
                title: 'CYBER',
                greek: 'κυβερνητικός',
                greekTransliteration: '(kybernētikós)',
                meanings: [
                    'Greek: "of or for steering, governance"',
                    'Modern: "relating to computers, IT"'
                ],
                concept: 'Control • Navigation'
            }
        },
        rightCircle: {
            label: 'PSYCHEDELIC',
            color: '#9D4EDD',
            etymology: {
                title: 'PSYCHEDELIC',
                greek: 'ψυχή + δῆλος',
                greekTransliteration: '(psychē + dēlos)',
                meanings: [
                    'Greek: "soul/mind" + "manifest/visible"',
                    'Translation: "mind-manifesting"'
                ],
                concept: 'Consciousness'
            }
        },
        merged: {
            label: 'CYBERDELICS',
            color: '#FFD700',
            greek: 'cyber + psychedelic = cyberdelics',
            meaning: 'The art and science of using technology to guide consciousness into expanded states of awareness',
            synthesis: [
                'Navigation (cyber) of Consciousness (psychedelic)',
                'Technological tools for inner exploration',
                'Precision guidance for transformative experiences'
            ]
        },
        visualization: {
            circleRadius: 70,
            maxDistance: 0.45,
            particleCount: 20,
            particleDistance: 20,
            labelFadeThreshold: 0.8
        }
    },

    /**
     * EXAMPLE 2: Mind-Body Connection (Vesica Piscis Mode)
     * Demonstrates sacred geometry overlap visualization
     */
    mindBodyVesica: {
        mode: 'vesica-piscis',
        leftCircle: {
            label: 'MIND',
            color: '#00D9FF',
            etymology: {
                title: 'MIND',
                greek: 'μήνις',
                greekTransliteration: '(mēnis)',
                meanings: [
                    'Greek: "wrath, passion, spirit"',
                    'Old English: "memory, thought"'
                ],
                concept: 'Consciousness • Thought'
            }
        },
        rightCircle: {
            label: 'BODY',
            color: '#FF006E',
            etymology: {
                title: 'BODY',
                greek: 'σῶμα',
                greekTransliteration: '(sōma)',
                meanings: [
                    'Greek: "body, living thing"',
                    'Sanskrit: "bodhi" (awakening)'
                ],
                concept: 'Physical • Material'
            }
        },
        merged: {
            label: 'EMBODIMENT',
            color: '#9D4EDD',
            description: 'The intersection where consciousness meets physical form',
            synthesis: [
                'Mind shapes body through neuroplasticity',
                'Body influences mind through sensation',
                'Unified experience of being'
            ]
        },
        visualization: {
            circleRadius: 70,
            maxDistance: 0.4,
            particleCount: 15,
            particleDistance: 25,
            labelFadeThreshold: 0.75
        }
    },

    /**
     * EXAMPLE 3: Art-Science (Combined Mode)
     * Another combined mode example with different aesthetic
     */
    artScience: {
        mode: 'combined',
        leftCircle: {
            label: 'ART',
            color: '#FF00FF',
            etymology: {
                title: 'ART',
                greek: 'τέχνη',
                greekTransliteration: '(technē)',
                meanings: [
                    'Greek: "craft, skill"',
                    'Latin: "ars" (skill, method)'
                ],
                concept: 'Creation • Expression'
            }
        },
        rightCircle: {
            label: 'SCIENCE',
            color: '#00FFFF',
            etymology: {
                title: 'SCIENCE',
                greek: 'ἐπιστήμη',
                greekTransliteration: '(epistēmē)',
                meanings: [
                    'Greek: "knowledge, understanding"',
                    'Latin: "scientia" (knowledge)'
                ],
                concept: 'Discovery • Understanding'
            }
        },
        merged: {
            label: 'CREATIVE INQUIRY',
            color: '#FFD700',
            meaning: 'The fusion of creative expression and systematic understanding',
            synthesis: [
                'Art provides intuition and vision',
                'Science provides rigor and method',
                'Together: innovation and insight'
            ]
        },
        visualization: {
            circleRadius: 65,
            maxDistance: 0.5,
            particleCount: 25,
            particleDistance: 18,
            labelFadeThreshold: 0.85
        }
    }
};
