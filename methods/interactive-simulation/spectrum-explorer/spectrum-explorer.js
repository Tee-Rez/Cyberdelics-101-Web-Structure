/**
 * SPECTRUM EXPLORER ENGINE
 * Module 1.2.2 - Psychedelic <-> Cyberdelic Interface
 */

(function () {
    const SpectrumExplorer = {
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
            discoveries: [
                { id: 'left', range: [0, 5], title: 'Fully Psychedelic', text: 'Notice the Shared Territory column. Still amber. Unchanged. The method is different, but the destination is the same.' },
                { id: 'right', range: [95, 100], title: 'Fully Cyberdelic', text: 'Six attributes changed. But count the Shared Territory items. All five. Still there. The approach changed — the purpose didn\'t.' }
            ]
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
            this.updateState(this.value); // Initial Update

            // Show session complete button immediately as requested (no goal)
            setTimeout(() => this.showCompleteButton(), 1000);
        },

        render: function () {
            console.log('[SpectrumExplorer] Rendering to container', this.container);
            this.container.innerHTML = `
                <div class="spectrum-explorer">
                    <div class="se-container">
                        <!-- SLIDER -->
                        <div class="se-slider-section">
                            <div class="se-slider-labels">
                                <span class="label-psych">◀ PSYCHEDELIC</span>
                                <span class="label-cyber">CYBERDELIC ▶</span>
                            </div>
                            <div class="se-slider-track"></div>
                            <div class="se-slider-thumb"></div>
                            <input type="range" min="0" max="100" value="${this.value}" class="se-range-input">
                        </div>

                        <!-- PROMPT ROW -->
                        <div class="se-prompt-row">
                            <div class="prompt-content">Move the slider to begin.</div>
                        </div>

                        <!-- GRID -->
                        <div class="se-grid">
                            <!-- LEFT: WHAT CHANGES -->
                            <div class="col-dynamic">
                                <div class="col-header" style="color: var(--text-primary)">
                                    WHAT CHANGES
                                </div>
                                ${this.data.attributes.map(attr => `
                                    <div class="attribute-card" data-id="${attr.id}">
                                        <div class="attr-header">
                                            <span>${attr.label}</span>
                                            <span class="info-icon">ⓘ</span>
                                        </div>
                                        <div class="attr-states">
                                            <div class="state-text state-psych">${attr.psych}</div>
                                            <div class="state-text state-cyber">${attr.cyber}</div>
                                        </div>
                                        <div class="attr-tooltip" data-psych="${attr.infoPsych}" data-cyber="${attr.infoCyber}">
                                            ${attr.infoPsych} <!-- Default start -->
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            <!-- RIGHT: SHARED TERRITORY -->
                            <div class="col-static">
                                <div class="col-header" style="color: var(--gold-light)">
                                    <span style="font-size: 1.2rem">≈</span> SHARED TERRITORY
                                </div>
                                ${this.data.constants.map(c => `
                                    <div class="static-item">
                                        <div class="static-dot"></div>
                                        <div class="static-content">
                                            <span class="static-label">${c.label}</span>
                                            <span class="static-desc">${c.desc}</span>
                                        </div>
                                    </div>
                                `).join('')}
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
                container: this.container.querySelector('.se-container'),
                thumb: this.container.querySelector('.se-slider-thumb'),
                input: this.container.querySelector('.se-range-input'),
                prompt: this.container.querySelector('.prompt-content'),
                discovery: this.container.querySelector('.discovery-card'),
                cards: this.container.querySelectorAll('.attribute-card')
            };
        },

        bindEvents: function () {
            // Slider Input
            this.el.input.addEventListener('input', (e) => {
                this.updateState(parseInt(e.target.value));
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

        updateState: function (val) {
            this.value = val;

            // 1. Move Thumb
            this.el.thumb.style.left = `${val}%`;

            // 2. Update Dynamic Glows & Colors
            const pct = val / 100;
            // Psych (Purple) fades out as we go right
            const psychOp = 1 - pct;
            // Cyber (Teal) fades in as we go right
            const cyberOp = pct;

            // Container Border Color Shift
            if (val < 40) {
                this.el.container.style.borderColor = `rgba(139, 92, 246, ${1 - val / 40})`;
                this.el.container.style.boxShadow = `0 0 20px rgba(139, 92, 246, ${0.2 * (1 - val / 40)})`;
            } else if (val > 60) {
                this.el.container.style.borderColor = `rgba(20, 184, 166, ${(val - 60) / 40})`;
                this.el.container.style.boxShadow = `0 0 20px rgba(20, 184, 166, ${0.2 * (val - 60) / 40})`;
            } else {
                this.el.container.style.borderColor = 'var(--border-subtle)';
                this.el.container.style.boxShadow = 'none';
            }

            // 3. Update Attribute Cards
            this.el.cards.forEach(card => {
                const pText = card.querySelector('.state-psych');
                const cText = card.querySelector('.state-cyber');

                // Crossfade Logic
                // P: 1 at 0%, 0 at 100%
                // C: 0 at 0%, 1 at 100%

                pText.style.opacity = Math.max(0, 1 - (pct * 1.5)); // Fades faster
                cText.style.opacity = Math.max(0, (pct - 0.33) * 1.5); // Starts later

                // Slide Logic
                pText.style.transform = `translateY(${pct * -20}px)`;
                cText.style.transform = `translateY(${(1 - pct) * 20}px)`;

                // Border accent
                const borderOpacity = Math.abs(0.5 - pct) * 2; // 0 at center, 1 at ends
                if (pct < 0.5) {
                    card.style.setProperty('--border-subtle', `rgba(139, 92, 246, ${borderOpacity * 0.5})`);
                    card.style.setProperty('--card-accent', `rgba(139, 92, 246, ${borderOpacity})`);

                    // Update Tooltip Text for Psych Side
                    const tooltip = card.querySelector('.attr-tooltip');
                    const psychText = tooltip.dataset.psych;
                    if (tooltip.textContent !== psychText) tooltip.textContent = psychText;

                } else {
                    card.style.setProperty('--border-subtle', `rgba(20, 184, 166, ${borderOpacity * 0.5})`);
                    card.style.setProperty('--card-accent', `rgba(20, 184, 166, ${borderOpacity})`);

                    // Update Tooltip Text for Cyber Side
                    const tooltip = card.querySelector('.attr-tooltip');
                    const cyberText = tooltip.dataset.cyber;
                    if (tooltip.textContent !== cyberText) tooltip.textContent = cyberText;
                }
            });

            // 4. Check Discovery Moments
            this.checkDiscovery(val);

            // 5. Update Prompt
            this.updatePrompt(val);
        },

        checkDiscovery: function (val) {
            const hit = this.data.discoveries.find(d => val >= d.range[0] && val <= d.range[1]);

            if (hit && this.activeDiscovery !== hit.id) {
                this.activeDiscovery = hit.id;
                this.showDiscoveryCard(hit);

                // Track zones
                if (hit.id === 'left') this.zonesVisited.left = true;
                if (hit.id === 'center') this.zonesVisited.center = true;
                if (hit.id === 'right') this.zonesVisited.right = true;

                this.checkCompletion();
            } else if (!hit) {
                this.activeDiscovery = null;
                // Don't auto-hide, let user dismiss or new one replace
            }
        },

        showDiscoveryCard: function (data) {
            const card = this.el.discovery;
            card.querySelector('.discovery-title').textContent = data.title;
            card.querySelector('.discovery-text').textContent = data.text;

            card.classList.remove('active');
            // Force reflow
            void card.offsetWidth;
            card.classList.add('active');

            // Auto dismiss after 6s
            setTimeout(() => {
                if (this.activeDiscovery === data.id) {
                    card.classList.remove('active');
                }
            }, 6000);
        },

        updatePrompt: function (val) {
            let msg = "Move the slider to explore the spectrum.";

            if (val < 20) msg = "In the Psychedelic zone, chemistry drives the experience.";
            else if (val > 80) msg = "In the Cyberdelic zone, technology drives the experience.";
            else msg = "Notice what changes and what stays the same.";

            if (this.completed) {
                msg = '<span style="color:var(--gold-light)">EXPLORATION COMPLETE.</span><br>You have mapped the territory.';
            }

            this.el.prompt.innerHTML = msg;
        },

        checkCompletion: function () {
            if (this.completed) return;

            const allZones = this.zonesVisited.left && this.zonesVisited.center && this.zonesVisited.right;
            const enoughTooltips = this.tooltipsOpened.size >= 3;

            if (allZones && enoughTooltips) {
                this.completed = true;
                this.updatePrompt(this.value);
                // No artifact unlock per user request
            }
        },

        showCompleteButton: function () {
            // Find Main Wrapper (Grandparent of container usually in LessonRunner)
            const parent = this.container.closest('.interactive-simulation-container');
            if (!parent) return;

            if (parent.querySelector('.se-complete-btn')) return;

            const btn = document.createElement('button');
            btn.className = 'btn-continue se-complete-btn'; // Use standard class + layout override
            btn.textContent = 'SESSION COMPLETE';

            parent.appendChild(btn);

            // Animate in
            requestAnimationFrame(() => {
                btn.classList.add('visible');
            });

            btn.onclick = () => {
                btn.classList.remove('visible');
                setTimeout(() => {
                    btn.remove();
                    // Call host completion
                    if (this.host && this.host.markComplete) {
                        this.host.markComplete();
                    } else if (this.host && this.host.advanceStep) {
                        this.host.advanceStep();
                    } else {
                        console.warn('[SpectrumExplorer] Host completion method not found');
                    }
                }, 300);
            };
        },

        destroy: function () {
            // Cleanup events if needed
        }
    };

    // Export to Window (for Factory to find)
    window.SimulationEngines = window.SimulationEngines || {};
    window.SimulationEngines['spectrum-explorer'] = SpectrumExplorer;

})();
