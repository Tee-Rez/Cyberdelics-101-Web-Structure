/**
 * Cyberdelic Design Dimension Explorer - Data definitions
 * Separating content from simulation logic for the Tesseract Explorer
 */

window.TesseractExplorerData = {
    // ---------------------------------------------------------
    // DIMENSIONS
    // ---------------------------------------------------------
    dimensions: [
        {
            id: 'reality',
            name: 'Reality',
            icon: '⧉', // Nested squares
            color: '#1A3A6B', // Deep cobalt blue
            description: 'The world the experience inhabits.',
            question: 'Where does this experience take place?',
            type: 'multi',
            faceIndex: 5, // Back face (Z-)
            options: [
                { id: 'physical', title: 'Physical', description: 'Real world, body-based practices.' },
                { id: 'virtual', title: 'Virtual', description: 'Fully digital environments (VR).' },
                { id: 'augmented', title: 'Augmented', description: 'Digital layers over physical reality (AR).' },
                { id: 'mixed', title: 'Mixed', description: 'Interaction between physical and digital.' },
                { id: 'generative', title: 'Generative', description: 'Dynamically created landscapes (AI/Procedural).' },
                { id: 'biological', title: 'Biological', description: 'The body itself as environment (Breath/Interoception).' },
                { id: 'cognitive', title: 'Cognitive', description: 'Inner mindscape of thought and imagination.' }
            ]
        },
        {
            id: 'sensory',
            name: 'Sensory',
            icon: '◈', // Proxy for 5 small symbols
            color: '#C4830A', // Amber gold
            description: 'The perceptual channels through which the experience is received.',
            question: 'Which senses are being engaged, and how?',
            type: 'multi',
            faceIndex: 1, // Left face (X-)
            options: [
                { id: 'visual', title: 'Visual', description: 'Environments, patterns, light, geometry.' },
                { id: 'auditory', title: 'Auditory', description: 'Soundscapes, music, resonance.' },
                { id: 'tactile', title: 'Tactile', description: 'Haptic feedback, temperature, embodied movement.' },
                { id: 'olfactory', title: 'Olfactory', description: 'Scent (an underused consciousness anchor).' },
                { id: 'gustatory', title: 'Gustatory', description: 'Taste (rare but acknowledged).' }
            ]
        },
        {
            id: 'presence',
            name: 'Presence',
            icon: '❀', // Lotus shape
            color: '#0A7E6E', // Teal
            description: 'What the experience cultivates upward.',
            question: 'What type of presence is this experience trying to cultivate?',
            type: 'single',
            faceIndex: 2, // Top face (Y+)
            options: [
                { id: 'mental', title: 'Mental Presence', description: 'Clarity of thought, focused attention.' },
                { id: 'emotional', title: 'Emotional Presence', description: 'Openness to feeling, emotional availability.' },
                { id: 'social', title: 'Social Presence', description: 'Connection to others, relational attunement.' },
                { id: 'embodied', title: 'Embodied Presence', description: 'Groundedness in the physical body.' },
                { id: 'environmental', title: 'Environmental Presence', description: 'Connection to place, awe at the world.' },
                { id: 'active', title: 'Active Presence', description: 'Engaged participation, creative agency.' }
            ]
        },
        {
            id: 'states',
            name: 'States',
            icon: '〰', // Fluid wave
            color: '#6B2FA0', // Electric violet
            description: 'The transient consciousness shifts during the experience.',
            question: 'What transient states of consciousness are facilitated?',
            type: 'multi-limit',
            limit: 2,
            faceIndex: 0, // Right face (X+)
            options: [
                { id: 'cognitive', title: 'Cognitive States', description: 'Expanded perception, flow, ego softening.' },
                { id: 'emotional', title: 'Emotional States', description: 'Openness, joy, awe, emotional release.' },
                { id: 'somatic', title: 'Somatic States', description: 'Relaxation, energy movement, interoception.' },
                { id: 'relational', title: 'Relational States', description: 'Unity experience, dissolution of separation.' }
            ]
        },
        {
            id: 'traits',
            name: 'Traits',
            icon: '⬡', // Crystal/geometric
            color: '#1A6B3A', // Jade green
            description: 'What endures downward into the person\'s life.',
            question: 'What lasting changes should this experience support?',
            type: 'multi-limit',
            limit: 2,
            faceIndex: 3, // Bottom face (Y-)
            options: [
                { id: 'cognitive', title: 'Cognitive Traits', description: 'Cognitive flexibility, reduced rumination.' },
                { id: 'emotional', title: 'Emotional Traits', description: 'Emotional regulation, sustained compassion.' },
                { id: 'somatic', title: 'Somatic Traits', description: 'Embodiment in daily life, connection to sensation.' },
                { id: 'relational', title: 'Relational Traits', description: 'Increased empathy, reduced isolation.' }
            ]
        },
        {
            id: 'meaning',
            name: 'Meaning',
            icon: '☼', // Lantern/light
            color: '#8B0A4E', // Deep magenta
            description: 'The soul of the design.',
            question: 'What world, story, and magic are created?',
            type: 'meaning-special', // Custom UI handled in engine
            faceIndex: 4, // Front face (Z+)
            options: [] // Special nested structure used below
        }
    ],

    // ---------------------------------------------------------
    // MEANING DIMENSION DETAILS (The 3-Step Unfold)
    // ---------------------------------------------------------
    meaningData: {
        world: {
            question: 'What world does this experience inhabit?',
            description: 'The World is the larger context or mythos the experience lives within. This is the universe the person enters when the experience begins.',
            options: [
                { id: 'inner', title: 'Inner Space', description: 'The mind as cosmos. Exploring the interior landscape of consciousness.' },
                { id: 'body', title: 'The Body as Landscape', description: 'The physical body is the terrain, descending into somatic depth.' },
                { id: 'sacred', title: 'The Sacred Grove', description: 'Connection to the living world, ecological wholeness.' },
                { id: 'threshold', title: 'The Threshold', description: 'The liminal edge between known and unknown, self and mystery.' },
                { id: 'mirror', title: 'The Mirror', description: 'Clarity through reflection, bringing honest encounter with oneself.' },
                { id: 'web', title: 'The Web', description: 'The interconnected whole, dissolving isolation.' },
                { id: 'forge', title: 'The Forge', description: 'Transformation through difficulty, challenge, and initiation.' }
            ]
        },
        story: {
            question: 'What arc does the person move through?',
            description: 'Every cyberdelic experience has a narrative shape. Even without a literal plot, there is a movement from one state to another.',
            fromOptions: ['fragmentation', 'fear', 'isolation', 'numbness', 'confusion', 'contraction', 'surface', 'separation'],
            towardOptions: ['wholeness', 'trust', 'connection', 'aliveness', 'clarity', 'expansion', 'depth', 'belonging']
        },
        magic: {
            question: 'What principle makes the transformation possible?',
            description: 'Every transformation needs an activating principle. The magic is the specific mechanism through which this experience works its change.',
            options: [
                { id: 'breath', title: 'Breath as Portal', description: 'Every state shift moves through the breath.' },
                { id: 'resonance', title: 'Resonance and Sound', description: 'The acoustic environment carries the transformation.' },
                { id: 'witnessing', title: 'Witnessing', description: 'Being fully seen by another (or by oneself) is the catalyst.' },
                { id: 'surrender', title: 'Surrender', description: 'Releasing control is the mechanism.' },
                { id: 'meeting', title: 'The Meeting', description: 'Contact between self and other, or self and the world.' },
                { id: 'dissolution', title: 'Dissolution', description: 'Edges soften and boundaries release.' },
                { id: 'descent', title: 'The Descent', description: 'The experience works by going into rather than rising above.' },
                { id: 'emergence', title: 'Emergence', description: 'What arises from stillness as conditions are created.' }
            ]
        }
    },

    // ---------------------------------------------------------
    // SUMMARY GENERATION TEMPLATES
    // ---------------------------------------------------------
    summaryTemplates: {
        // Generates the 3 paragraphs. The engine replaces [keys] with values derived from choices.
        paragraphs: [
            // Para 1: Reality + Sensory
            "You enter a [reality_modes] space, engaging primarily through [sensory_modes]. Here, the environment itself becomes the substrate for transformation.",

            // Para 2: Presence + States
            "Designed to cultivate [presence_mode] presence, the experience intentionally facilitates [states_modes] states. As you navigate the session, your awareness shifts to match the architecture of the space.",

            // Para 3: Traits + Meaning
            "The journey moves you from [story_from] toward [story_toward], activated by the principle of [magic_mode] within [world_mode]. Ultimately, this design aims to build lasting [traits_modes] traits that endure long after the experience ends."
        ],

        coherenceRules: [
            {
                check: (choices) => choices.reality.includes('virtual') && choices.presence.includes('embodied'),
                note: "A Virtual reality substrate with Embodied Presence is an interesting design challenge : you will need deliberate somatic anchors to bridge the digital world and the body."
            },
            {
                check: (choices) => choices.states.includes('cognitive') && choices.traits.includes('somatic'),
                note: "Designing for Cognitive States while targeting Somatic Traits suggests the experience works through insight that lands in the body : integration practices will be important."
            },
            {
                check: (choices) => choices.reality.includes('biological') && choices.sensory.length === 1 && choices.sensory.includes('visual'),
                note: "A Biological reality with only Visual sensory input may feel disonnected : consider adding tactile or auditory elements to deepen the biological grounding."
            },
            {
                // Fallback rule
                check: () => true,
                note: "The dimension choices show strong internal coherence. The world, senses, and intention all point in the same direction."
            }
        ]
    },

    // ---------------------------------------------------------
    // HELPER METHODS
    // ---------------------------------------------------------
    methods: {
        generateName: function (choices) {
            // "Embodied Belonging through Surrender in The Web"
            // "[Presence Type] [Story TOWARD word] through [Magic name] in [World name]"
            try {
                let presenceTitle = 'Transformational';
                if (choices.presence && choices.presence.length > 0) {
                    const presenceData = window.TesseractExplorerData.dimensions.find(d => d.id === 'presence').options.find(o => o.id === choices.presence[0]);
                    if (presenceData) {
                        presenceTitle = presenceData.title.split(' ')[0];
                    }
                }
                const toward = choices.meaning.story.toward.charAt(0).toUpperCase() + choices.meaning.story.toward.slice(1);
                const magicData = window.TesseractExplorerData.meaningData.magic.options.find(o => o.id === choices.meaning.magic);
                const magic = magicData ? magicData.title : 'Magic';
                const worldData = window.TesseractExplorerData.meaningData.world.options.find(o => o.id === choices.meaning.world);
                const world = worldData ? worldData.title : 'The World';

                return `${presenceTitle} ${toward} through ${magic} in ${world}`;
            } catch (e) {
                return "The Cyberdelic Experience";
            }
        },

        generateDescription: function (choices) {
            const temps = window.TesseractExplorerData.summaryTemplates;

            // Helper to format lists (e.g., "A, B, and C")
            const formatList = (arr) => {
                if (!arr || arr.length === 0) return "unspecified";
                if (arr.length === 1) return arr[0].toLowerCase();
                if (arr.length === 2) return `${arr[0].toLowerCase()} and ${arr[1].toLowerCase()}`;
                return `${arr.slice(0, -1).map(s => s.toLowerCase()).join(', ')}, and ${arr[arr.length - 1].toLowerCase()}`;
            };

            const realityStr = formatList(choices.reality.map(id => window.TesseractExplorerData.dimensions.find(d => d.id === 'reality').options.find(o => o.id === id).title));
            const sensoryStr = formatList(choices.sensory.map(id => window.TesseractExplorerData.dimensions.find(d => d.id === 'sensory').options.find(o => o.id === id).title));
            const presenceStr = choices.presence[0] ? window.TesseractExplorerData.dimensions.find(d => d.id === 'presence').options.find(o => o.id === choices.presence[0]).title.toLowerCase().replace(' presence', '') : 'presence';
            const statesStr = formatList(choices.states.map(id => window.TesseractExplorerData.dimensions.find(d => d.id === 'states').options.find(o => o.id === id).title.toLowerCase().replace(' states', '')));
            const traitsStr = formatList(choices.traits.map(id => window.TesseractExplorerData.dimensions.find(d => d.id === 'traits').options.find(o => o.id === id).title.toLowerCase().replace(' traits', '')));

            const paras = [
                temps.paragraphs[0]
                    .replace('[reality_modes]', realityStr)
                    .replace('[sensory_modes]', sensoryStr),
                temps.paragraphs[1]
                    .replace('[presence_mode]', presenceStr)
                    .replace('[states_modes]', statesStr),
                temps.paragraphs[2]
                    .replace('[story_from]', choices.meaning.story?.from || 'fragmentation')
                    .replace('[story_toward]', choices.meaning.story?.toward || 'wholeness')
                    .replace('[magic_mode]', choices.meaning.magic ? window.TesseractExplorerData.meaningData.magic.options.find(o => o.id === choices.meaning.magic).title.toLowerCase() : 'magic')
                    .replace('[world_mode]', choices.meaning.world ? window.TesseractExplorerData.meaningData.world.options.find(o => o.id === choices.meaning.world).title : 'the world')
                    .replace('[traits_modes]', traitsStr)
            ];

            let note = temps.coherenceRules[temps.coherenceRules.length - 1].note;
            for (let i = 0; i < temps.coherenceRules.length - 1; i++) {
                if (temps.coherenceRules[i].check(choices)) {
                    note = temps.coherenceRules[i].note;
                    break;
                }
            }

            return { paragraphs: paras, coherenceNote: note };
        }
    }
};
