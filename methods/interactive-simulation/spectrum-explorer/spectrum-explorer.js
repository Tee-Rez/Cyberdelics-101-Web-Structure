/**
 * SPECTRUM EXPLORER ENGINE
 * Module 1.2.2 - Psychedelic <-> Cyberdelic Interface
 */

(function () {
    const SpectrumExplorer = {
        name: 'Spectrum Explorer',
        showPlaybackControls: false,
        defaults: {
            startValue: 50
        },

        /* Spec Data */
        data: {
            attributes: [
                { id: 'method', label: 'Method', psych: 'Chemical substance ingestion', cyber: 'Digital technology immersion', infoPsych: 'Relies on introducing molecules (tryptamines, phenethylamines) to bind with serotonin receptors.', infoCyber: 'Relies on audiovisual stimulation and biofeedback to entrain brainwaves and alter perception.' },
                { id: 'legality', label: 'Legality', psych: 'Restricted in most jurisdictions', cyber: 'Legal worldwide, no restrictions', infoPsych: 'Most classical psychedelics are Schedule I controlled substances, creating legal risk.', infoCyber: 'Cyberdelic hardware and software are legal consumer products with no restrictions.' },
                { id: 'safety', label: 'Physical Safety', psych: 'Metabolic processing required', cyber: 'No chemical metabolism involved', infoPsych: 'Requires liver processing; potential contraindications with MAOIs or heart conditions.', infoCyber: 'Purely sensory; no toxicity or metabolic load. Safe for those who cannot take substances.' },
                { id: 'duration', label: 'Duration Control', psych: 'Fixed once ingested', cyber: 'Adjustable in real-time', infoPsych: 'Once active, the trip lasts 4-12 hours depending on the substance. No off switch.', infoCyber: 'Experience can be paused or stopped instantly by removing the headset.' },
                { id: 'repeatability', label: 'Repeatability', psych: 'Tolerance reduces effects', cyber: 'Consistent and repeatable', infoPsych: 'Brain builds immediate tolerance; requires days/weeks between sessions for full effect.', infoCyber: 'No physiological tolerance buildup. Same stimulus produces consistent results daily.' },
                { id: 'accessibility', label: 'Accessibility', psych: 'Medical screening required', cyber: 'Broadly accessible', infoPsych: 'Contraindicated for certain mental health conditions and physical ailments.', infoCyber: 'Accessible to a wider demographic, though photosensitivity precautions apply.' }
            ],
            constants: [
                { label: 'Intention', desc: 'Consciousness exploration and transformation' },
                { label: 'Potential Outcomes', desc: 'Mystical experiences, therapeutic breakthroughs' },
                { label: 'Integration Need', desc: 'Processing and meaning-making afterward' },
                { label: 'Value of Guidance', desc: 'Skilled facilitation enhances outcomes' },
                { label: 'Set and Setting', desc: 'Context matters profoundly' }
            ],
        },

        init: function (container, params, host) {
            console.log('[SpectrumExplorer] Init called', container, params);
            this.container = container;
            this.params = params;
            this.host = host;
            this.value = params.startValue || 50;
            this.zonesVisited = { left: false, center: true, right: false }; // Center true by default
            this.tooltipsOpened = new Set();
            this.activeDiscovery = null;

            this.render();
            this.bindEvents();
            this.currentLens = 'none'; // Track current lens

            // Hide continue button until simulation is complete
            setTimeout(() => {
                const parent = this.container.closest('.interactive-simulation-container');
                if (parent) {
                    const btn = parent.querySelector('.btn-continue');
                    if (btn) btn.style.display = 'none';
                }
            }, 50);
        },

        render: function () {
            console.log('[SpectrumExplorer] Rendering to container', this.container);
            this.container.innerHTML = `
                <div class="spectrum-explorer lens-mode-none">
                    <div class="se-container">
                        
                        <!-- LENS TOGGLES -->
                        <div class="lens-controls">
                            <button class="lens-btn lens-psych-btn" data-lens="psych">
                                <span class="lens-icon">✺</span>
                                <span class="lens-label">PSYCHEDELIC LENS</span>
                            </button>
                            <button class="lens-btn lens-cyber-btn" data-lens="cyber">
                                <span class="lens-icon">⎔</span>
                                <span class="lens-label">CYBERDELIC LENS</span>
                            </button>
                        </div>

                        <!-- PROMPT ROW -->
                        <div class="se-prompt-row">
                            <div class="prompt-content">Activate a lens to explore the spectrum.</div>
                        </div>

                        <!-- MAIN LENS DISPLAY -->
                        <div class="se-grid">
                            
                            <!-- LEFT/DYNAMIC: WHAT CHANGES -->
                            <div class="col-dynamic">
                                <div class="col-header" style="color: var(--text-primary)">
                                    WHAT CHANGES
                                </div>
                                <div class="cards-wrapper">
                                    ${this.data.attributes.map(attr => `
                                        <div class="attribute-card" data-id="${attr.id}">
                                            <div class="attr-header">
                                                <span>${attr.label}</span>
                                                <span class="info-icon">ⓘ</span>
                                            </div>
                                            <div class="attr-states">
                                                <div class="state-text state-neutral">Select a lens to view differences</div>
                                                <div class="state-text state-psych">${attr.psych}</div>
                                                <div class="state-text state-cyber">${attr.cyber}</div>
                                            </div>
                                            <div class="attr-tooltip" data-psych="${attr.infoPsych}" data-cyber="${attr.infoCyber}">
                                                Activate a lens for details.
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- RIGHT/STATIC: THE CORE (SHARED TERRITORY) -->
                            <div class="col-static core-territory">
                                <div class="core-glow"></div>
                                <div class="col-header core-header" style="color: var(--gold-light)">
                                    <span style="font-size: 1.5rem">❂</span> THE CORE: SHARED TERRITORY
                                </div>
                                <div class="core-constants">
                                    ${this.data.constants.map(c => `
                                        <div class="static-item">
                                            <div class="static-dot"></div>
                                            <div class="static-content">
                                                <span class="static-label">${c.label}</span>
                                                <span class="static-desc">${c.desc}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                <!-- DISCOVERY CARD OVERLAY -->
                                <div class="discovery-card">
                                    <div class="discovery-header">
                                        <span style="font-size: 1.5rem">✦</span>
                                        <span class="discovery-title">TITLE</span>
                                    </div>
                                    <div class="discovery-text">Content goes here...</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            `;

            // Cache Elements
            this.el = {
                wrapper: this.container.querySelector('.spectrum-explorer'),
                container: this.container.querySelector('.se-container'),
                lensBtns: this.container.querySelectorAll('.lens-btn'),
                prompt: this.container.querySelector('.prompt-content'),
                discovery: this.container.querySelector('.discovery-card'),
                cards: this.container.querySelectorAll('.attribute-card')
            };
        },

        bindEvents: function () {
            // Lens Toggle Buttons
            this.el.lensBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const lens = btn.dataset.lens;
                    this.updateState(lens);
                });
            });

            // Discovery Dismiss
            this.el.discovery.addEventListener('click', () => {
                this.el.discovery.classList.remove('active');
            });

            // Tooltips
            this.el.cards.forEach(card => {
                const icon = card.querySelector('.info-icon');
                icon.addEventListener('click', (e) => {
                    e.stopPropagation();

                    // Only open tooltips if a lens is active
                    if (this.currentLens === 'none') {
                        // Shake the cards wrapper to indicate they need to pick a lens
                        const wrapper = this.container.querySelector('.cards-wrapper');
                        wrapper.classList.remove('shake');
                        void wrapper.offsetWidth;
                        wrapper.classList.add('shake');
                        return;
                    }

                    // Toggle current
                    card.classList.toggle('tooltip-open');

                    if (card.classList.contains('tooltip-open')) {
                        this.tooltipsOpened.add(card.dataset.id);
                        this.checkCompletion();
                    }

                    // Close others (optional, but cleaner)
                    this.el.cards.forEach(c => {
                        if (c !== card) c.classList.remove('tooltip-open');
                    });
                });
            });
        },

        updateState: function (lensMode) {
            // Early return if same mode
            if (this.currentLens === lensMode) return;

            this.currentLens = lensMode;

            // 1. Update Container Classes for Global CSS 
            this.el.wrapper.classList.remove('lens-mode-none', 'lens-mode-psych', 'lens-mode-cyber');
            this.el.wrapper.classList.add(`lens-mode-${lensMode}`);

            // 2. Update Button Active States
            this.el.lensBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lens === lensMode);
            });

            // 3. Update Attribute Cards content & tooltips based on exact lens
            this.el.cards.forEach(card => {
                const tooltip = card.querySelector('.attr-tooltip');

                // Clear any open tooltips when changing lens
                card.classList.remove('tooltip-open');

                if (lensMode === 'psych') {
                    const psychText = tooltip.dataset.psych;
                    if (tooltip.textContent !== psychText) tooltip.textContent = psychText;
                } else if (lensMode === 'cyber') {
                    const cyberText = tooltip.dataset.cyber;
                    if (tooltip.textContent !== cyberText) tooltip.textContent = cyberText;
                } else {
                    tooltip.textContent = "Activate a lens for details.";
                }
            });

            // 4. Update Border Colors explicitly via JS (though CSS classes handle most of this now)
            if (lensMode === 'psych') {
                this.el.container.style.borderColor = 'rgba(139, 92, 246, 0.8)';
                this.el.container.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.15)';
            } else if (lensMode === 'cyber') {
                this.el.container.style.borderColor = 'rgba(20, 184, 166, 0.8)';
                this.el.container.style.boxShadow = '0 0 30px rgba(20, 184, 166, 0.15)';
            } else {
                this.el.container.style.borderColor = 'var(--border-subtle)';
                this.el.container.style.boxShadow = 'none';
            }

            // 5. Track visits for completion
            if (lensMode === 'psych') this.zonesVisited.left = true;
            if (lensMode === 'cyber') this.zonesVisited.right = true;

            // 6. Update Prompt
            this.updatePrompt(lensMode);
            this.checkCompletion();
        },

        updatePrompt: function (lensMode) {
            let msg = "Activate a lens to explore the spectrum.";

            if (lensMode === 'psych') msg = "In the Psychedelic zone, chemistry drives the experience.";
            else if (lensMode === 'cyber') msg = "In the Cyberdelic zone, technology drives the experience.";

            if (this.completed) {
                msg = '<span style="color:var(--gold-light)">EXPLORATION COMPLETE.</span><br>You have mapped the territory.';
            }

            this.el.prompt.innerHTML = msg;
        },

        checkCompletion: function () {
            if (this.completed) return;

            const allZones = this.zonesVisited.left && this.zonesVisited.right;
            const enoughTooltips = this.tooltipsOpened.size >= 3;

            if (allZones && enoughTooltips) {
                this.completed = true;
                this.updatePrompt(this.currentLens);
                // Reveal host continue button now that exploration is done
                this.showCompleteButton();
            }
        },

        showCompleteButton: function () {
            // Find Main Wrapper (Grandparent of container usually in LessonRunner)
            const parent = this.container.closest('.interactive-simulation-container');
            if (!parent) return;

            // Instead of creating our own complete button, reveal the host's continue button
            const continueBtn = parent.querySelector('.btn-continue');
            if (continueBtn) {
                // If it was explicitly hidden via inline style due to hideContinueButton
                if (continueBtn.style.display === 'none') {
                    continueBtn.style.display = 'block';
                }
                
                // Animate it in via classes if they exist, or just ensure it's visible
                requestAnimationFrame(() => {
                    continueBtn.classList.add('visible');
                    // Add a pulse or highlight to draw attention
                    continueBtn.style.boxShadow = '0 0 15px var(--gold-glow)';
                });
            } else {
                console.warn('[SpectrumExplorer] Host continue button not found');
            }
        },

        destroy: function () {
            // Cleanup events if needed
        }
    };

    // Export to Window (for Factory to find)
    window.SimulationEngines = window.SimulationEngines || {};
    window.SimulationEngines['spectrum-explorer'] = SpectrumExplorer;

})();
