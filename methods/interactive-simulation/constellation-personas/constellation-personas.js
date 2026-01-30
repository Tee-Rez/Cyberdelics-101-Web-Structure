/**
 * Constellation Personas Simulation Engine
 * 
 * Interactive constellation showing persona types as floating nodes.
 * Supports multi-selection with synthesized insights based on combinations.
 */

// Ensure Registry Exists
window.SimulationEngines = window.SimulationEngines || {};

// Register Engine
window.SimulationEngines['constellation-personas'] = {
    name: 'Constellation Personas',

    // Default configuration
    defaults: {
        personas: []
    },

    // Control configuration (empty for this engine)
    config: [],

    // Engine state
    personas: [],
    selected: new Set(),
    instance: null,
    viewport: null,
    infoPanel: null,
    centerCircle: null,

    init: function (viewport, params, instance) {
        console.log('[ConstellationPersonas] Init called');
        console.log('[ConstellationPersonas] Viewport:', viewport);
        console.log('[ConstellationPersonas] Params:', params);

        this.instance = instance;
        this.viewport = viewport;
        this.personas = params.personas || [];
        this.selected = new Set();

        if (!this.viewport) {
            console.error('[ConstellationPersonas] No viewport provided');
            return;
        }

        console.log('[ConstellationPersonas] Starting render with', this.personas.length, 'personas');
        this.render();
    },

    render: function () {
        this.viewport.innerHTML = '';
        this.viewport.className = 'sim-viewport constellation-viewport';

        // Create center circle
        this.centerCircle = document.createElement('div');
        this.centerCircle.className = 'constellation-center';
        this.centerCircle.innerHTML = `
            <div class="center-icon">✨</div>
            <div class="center-label">Select Personas</div>
        `;
        this.viewport.appendChild(this.centerCircle);

        // Create info panel
        this.infoPanel = document.createElement('div');
        this.infoPanel.className = 'constellation-info';
        this.infoPanel.innerHTML = `
            <div class="info-content">
                <p>Click on persona types to explore who this course is for.</p>
                <p class="info-hint">Select two to reveal their Archetype!</p>
            </div>
        `;
        this.viewport.appendChild(this.infoPanel);

        // Position personas in a constellation pattern
        // Shift center up slightly (42%) to leave room for info panel at bottom
        const centerY = 42;
        const radius = Math.min(this.viewport.clientWidth, this.viewport.clientHeight) * 0.32;
        const angleStep = (2 * Math.PI) / this.personas.length;

        this.personas.forEach((persona, index) => {
            const angle = angleStep * index - Math.PI / 2; // Start from top
            const x = 50 + (radius / this.viewport.clientWidth * 100) * Math.cos(angle);
            const y = centerY + (radius / this.viewport.clientHeight * 100) * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'persona-node';
            node.dataset.id = persona.id;
            node.style.left = `${x}%`;
            node.style.top = `${y}%`;

            node.innerHTML = `
                <div class="persona-icon">${persona.icon || '👤'}</div>
                <div class="persona-label">${persona.name}</div>
            `;

            node.addEventListener('click', () => this.togglePersona(persona.id));

            this.viewport.appendChild(node);
        });
    },

    togglePersona: function (id) {
        // Trigger Artifact Collection (silent fragment or main)
        if (window.ArtifactSystem) {
            const persona = this.personas.find(p => p.id === id);
            window.ArtifactSystem.collect({
                id: id,
                label: persona ? persona.name : id
            });
        }

        if (this.selected.has(id)) {
            this.selected.delete(id);
        } else {
            this.selected.add(id);
        }

        this.updateUI();
        this.synthesizeInsights();
        this.checkCompletion();
    },

    updateUI: function () {
        // Update node appearances
        const nodes = this.viewport.querySelectorAll('.persona-node');
        nodes.forEach(node => {
            const id = node.dataset.id;
            if (this.selected.has(id)) {
                node.classList.add('selected');
            } else {
                node.classList.remove('selected');
            }
        });

        // Update center circle
        if (this.selected.size > 0) {
            this.centerCircle.classList.add('active');
            let centerText = '';

            const selectedIds = Array.from(this.selected).sort();

            if (selectedIds.length === 2) {
                // Check if we have a specific pair name
                const key = selectedIds.join(',');
                const pairData = this.getPairData(key);
                if (pairData) {
                    centerText = pairData.name;
                } else {
                    // Fallback to names
                    const selectedPersonas = selectedIds.map(id => this.personas.find(p => p.id === id));
                    centerText = selectedPersonas.map(p => p.name.split(' ')[0]).join(' + ');
                }
            } else {
                // Standard behavior for 1 or >2 items
                const selectedPersonas = selectedIds.map(id => this.personas.find(p => p.id === id));
                // If 1 item, show full name. If >2, show truncated join
                if (selectedPersonas.length === 1) {
                    centerText = selectedPersonas[0].name;
                } else {
                    centerText = selectedPersonas.map(p => p.name.split(' ')[0]).join(' + ');
                }
            }

            this.centerCircle.querySelector('.center-label').textContent = centerText;
        } else {
            this.centerCircle.classList.remove('active');
            this.centerCircle.querySelector('.center-label').textContent = 'Select Personas';
        }
    },

    synthesizeInsights: function () {
        if (this.selected.size === 0) {
            this.infoPanel.innerHTML = `
                <div class="info-content">
                    <p>Click on persona types to explore who this course is for.</p>
                    <p class="info-hint">Select two to reveal their Archetype!</p>
                </div>
            `;
            return;
        }

        const selectedPersonas = Array.from(this.selected).map(id =>
            this.personas.find(p => p.id === id)
        ).filter(p => p);

        let content = '<div class="info-content">';

        if (selectedPersonas.length === 1) {
            // Single persona - show base description
            const persona = selectedPersonas[0];
            content += `<h3>${persona.name}</h3>`;
            content += `<p>${persona.description || 'A perfect fit for this course!'}</p>`;
        } else if (selectedPersonas.length === 2) {
            // Pair archetype
            const ids = selectedPersonas.map(p => p.id).sort();
            const key = ids.join(',');
            const pairData = this.getPairData(key);

            if (pairData) {
                content += `<h3>${pairData.name}</h3>`;
                content += `<p>${pairData.description}</p>`;
            } else {
                content += `<h3>Combined Profile</h3>`;
                content += `<p class="synthesis">${this.generateSynthesis(selectedPersonas)}</p>`;
            }
        } else {
            // Multiple personas > 2
            content += `<h3>Complex Synthesis</h3>`;
            content += `<p>You've selected: ${selectedPersonas.map(p => p.name).join(', ')}</p>`;
            content += `<p class="synthesis">${this.generateSynthesis(selectedPersonas)}</p>`;
        }

        content += '</div>';
        this.infoPanel.innerHTML = content;
    },

    getPairData: function (key) {
        const pairs = {
            // Creator (Creative Technologist) Pairs
            'creator,healer': {
                name: "Digital Shaman",
                description: "You blend ancient wisdom with modern tools. You see VR not just as media, but as technology for soul-retrieval and healing."
            },
            'creator,explorer': {
                name: "Psychonaut Designer",
                description: "You build the worlds you wish to inhabit. Your curiosity drives you to map the territory of consciousness and then recreate it for others."
            },
            'creator,researcher': {
                name: "R&D Innovator",
                description: "Science meets Art. You rigorously test your creative hypotheses, pushing the boundaries of what interfaces can do for the human mind."
            },
            'builder,creator': { // Note: Sort order matters, keys should be sorted alphabetically if using consistent sort
                name: "Visionary Architect",
                description: "You don't just dream of new realities; you build the platforms to host them. You bridge the gap between abstract art and viable product."
            },

            // Healer Pairs
            'explorer,healer': {
                name: "Integration Guide",
                description: "You explore the depths yourself to better serve others. You understand that technology is a mirror, and you help others process what they see."
            },
            'healer,researcher': {
                name: "Clinical Scientist",
                description: "Evidence-based compassion. You seek to validate intuitive healing modalities with data, bringing credibility to transformational tech."
            },
            'builder,healer': {
                name: "Wellness Founder",
                description: "You scale empathy. You identify widespread human needs and build sustainable technological solutions to address suffering."
            },

            // Explorer Pairs
            'explorer,researcher': {
                name: "Phenomenologist",
                description: "Subjective experience is your data. You explore the 'what it feels like' of consciousness with the rigor of a scientist."
            },
            'builder,explorer': {
                name: "Experience Provider",
                description: "You package the ineffable. You take raw, wild states of consciousness and curate them into accessible experiences for the market."
            },

            // Researcher Pairs
            'builder,researcher': {
                name: "Translational Scientist",
                description: "From lab to living room. You take insights from academic study and translate them into real-world applications and products."
            }
        };
        return pairs[key];
    },

    generateSynthesis: function (personas) {
        // This generates insights based on persona combinations
        const ids = personas.map(p => p.id).sort();

        // Custom synthesis logic based on combinations
        const syntheses = {
            // Define specific combinations
            'creator,explorer': 'Perfect combination! Creators and explorers both thrive in experimental spaces. You\'ll love designing your own psychedelic experiences.',
            'creator,healer': 'A powerful pairing. Creative healers can craft deeply personal therapeutic journeys that combine art and wellness.',
            'explorer,healer': 'Adventurous healers who seek both personal transformation and ways to help others. This course bridges both worlds.',
            'creator,explorer,healer': 'The complete trifecta! You\'re ready to create, explore, and heal. This course will give you tools for all three paths.',

            // Add more combinations as needed
        };

        const key = ids.join(',');

        if (syntheses[key]) {
            return syntheses[key];
        }

        // Default synthesis
        return `These personas complement each other beautifully. This course offers something unique for each perspective you've selected, creating a rich multifaceted learning experience.`;
    },

    checkCompletion: function () {
        // Check if the community_connection artifact is collected
        if (window.ArtifactSystem && window.ArtifactSystem.has('community_connection')) {
            const btn = document.querySelector('.interactive-simulation-container .btn-continue');
            if (btn) {
                btn.style.display = 'block';
                btn.classList.add('fade-in-up');
            }
        }
    },

    reset: function () {
        this.selected.clear();
        this.updateUI();
        this.synthesizeInsights();
    },

    destroy: function () {
        // Cleanup if needed
    }
};
