/**
 * SPECTRUM EXPLORER ENGINE
 * Prism / Particle Accelerator Redesign
 */

(function () {
    const SpectrumExplorer = {
        name: 'Spectrum Prism',
        showPlaybackControls: false,

        data: {
            attributes: [
                { id: 'method', label: 'Method', x: 150, y: 70, psych: 'Chemical substance', cyber: 'Digital immersion', infoPsych: 'Relies on introducing molecules to bind with serotonin receptors.', infoCyber: 'Relies on audiovisual stimulation to entrain brainwaves.' },
                { id: 'legality', label: 'Legality', x: 260, y: 40, psych: 'Heavily restricted', cyber: 'Fully open', infoPsych: 'Most classical psychedelics are Schedule I controlled substances.', infoCyber: 'Cyberdelic hardware and software are legal consumer products.' },
                { id: 'safety', label: 'Safety', x: 370, y: 20, psych: 'Metabolic processing', cyber: 'Non-metabolic', infoPsych: 'Requires liver processing; potential contraindications with heart conditions.', infoCyber: 'Purely sensory; no toxicity or metabolic load.' },
                { id: 'duration', label: 'Duration', x: 480, y: 20, psych: 'Fixed trajectory', cyber: 'Real-time control', infoPsych: 'Once active, the trip lasts 4-12 hours. No off switch.', infoCyber: 'Experience can be paused or stopped instantly by removing the headset.' },
                { id: 'repeat', label: 'Repeatability', x: 590, y: 40, psych: 'Tolerance builds', cyber: 'Consistent', infoPsych: 'Brain builds immediate tolerance; requires waiting weeks.', infoCyber: 'No physiological tolerance buildup. Consistent results daily.' },
                { id: 'access', label: 'Accessibility', x: 700, y: 70, psych: 'Screening required', cyber: 'Broadly accessible', infoPsych: 'Contraindicated for certain mental health conditions.', infoCyber: 'Accessible to a wider demographic, minus photosensitivity.' }
            ],
            constants: [
                "Intention: Consciousness exploration",
                "Outcomes: Mystical experiences",
                "Need: Integration and processing",
                "Set & Setting: Profound impact"
            ]
        },

        init: function (container, params, host) {
            this.container = container;
            this.host = host;
            
            this.state = {
                psychBeam: false,
                cyberBeam: false,
                activeNode: null,
                beamParticles: []
            };

            this.tooltipsOpened = new Set();
            this.completed = false;

            this.svgProps = { width: 850, height: 400, px: 425, py: 220 }; // Prism center
            this.lastTime = performance.now();

            this.render();
            this.bindEvents();
            this.initEngine();

            setTimeout(() => {
                const parent = this.container.closest('.interactive-simulation-container');
                if (parent) {
                    const btn = parent.querySelector('.btn-continue');
                    if (btn) btn.style.display = 'none';
                }
            }, 50);
        },

        render: function () {
            this.container.innerHTML = `
                <div class="spectrum-explorer">
                    
                    <div class="se-viewport">
                        <svg class="se-svg-canvas" viewBox="0 0 ${this.svgProps.width} ${this.svgProps.height}">
                            <defs>
                                <radialGradient id="bg-grad" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stop-color="#020408" />
                                    <stop offset="100%" stop-color="#000000" />
                                </radialGradient>
                                <filter id="glow-p">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                                </filter>
                                <filter id="glow-c">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                                </filter>
                                <filter id="glow-g">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                                </filter>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#bg-grad)" />

                            <!-- Background Grid -->
                            <g opacity="0.1">
                                <line x1="425" y1="0" x2="425" y2="400" stroke="#475569" />
                                <line x1="0" y1="220" x2="850" y2="220" stroke="#475569" />
                                <circle cx="425" cy="220" r="150" fill="none" stroke="#475569" />
                            </g>

                            <!-- Lasers -->
                            <g id="laser-layer"></g>
                            <g id="particle-layer"></g>

                            <!-- Nodes -->
                            <g id="nodes-layer">
                                ${this.data.attributes.map(attr => `
                                    <g class="attr-node" data-id="${attr.id}" transform="translate(${attr.x}, ${attr.y})">
                                        <circle class="attr-bg" r="25" fill="#111" stroke="#333" stroke-width="2" />
                                        <circle class="attr-core" r="4" fill="#666" />
                                        <text y="42" text-anchor="middle" fill="#888" font-size="12px" font-family="monospace">${attr.label}</text>
                                    </g>
                                `).join('')}
                            </g>

                            <!-- The Prism -->
                            <g id="central-prism" transform="translate(${this.svgProps.px}, ${this.svgProps.py})">
                                <polygon points="0,-40 35,0 0,40 -35,0" fill="rgba(255,255,255,0.05)" stroke="#666" stroke-width="2" />
                                <circle r="8" fill="#fff" opacity="0.2" />
                                <text class="prism-text" y="65" text-anchor="middle" fill="#666" font-size="14px" letter-spacing="3" font-family="sans-serif">MIND</text>
                            </g>

                            <!-- Cannons -->
                            <g class="cannon-group" id="cannon-psych" transform="translate(100, 350)">
                                <rect class="cannon-bg" x="-40" y="-20" width="80" height="40" rx="5" fill="#1a0b2e" stroke="#8B5CF6" stroke-width="2" />
                                <text y="5" text-anchor="middle" fill="#A78BFA" font-size="12px" font-family="monospace" pointer-events="none">BOTANICAL</text>
                                <text y="40" text-anchor="middle" fill="#8B5CF6" font-size="10px" pointer-events="none">EMITTER</text>
                            </g>

                            <g class="cannon-group" id="cannon-cyber" transform="translate(750, 350)">
                                <rect class="cannon-bg" x="-40" y="-20" width="80" height="40" rx="5" fill="#041f24" stroke="#14B8A6" stroke-width="2" />
                                <text y="5" text-anchor="middle" fill="#5EEAD4" font-size="12px" font-family="monospace" pointer-events="none">DIGITAL</text>
                                <text y="40" text-anchor="middle" fill="#14B8A6" font-size="10px" pointer-events="none">EMITTER</text>
                            </g>
                        </svg>
                    </div>

                    <!-- Information HUD -->
                    <div class="se-hud">
                        <div class="hud-target-panel">
                            <div class="hud-title">AWAITING TARGET</div>
                            <div class="hud-subtitle">Select an attribute node above.</div>
                            
                            <div class="hud-comparisons">
                                <div class="hud-side psych-side">
                                    <div class="side-title">PSYCHEDELIC BEAM</div>
                                    <div class="side-content">Fire emitter to scan.</div>
                                </div>
                                <div class="hud-side cyber-side">
                                    <div class="side-title">CYBERDELIC BEAM</div>
                                    <div class="side-content">Fire emitter to scan.</div>
                                </div>
                            </div>
                        </div>

                        <div class="hud-core-panel">
                            <div class="core-title">SHARED SPECTRUM</div>
                            <ul class="core-list">
                                ${this.data.constants.map(c => `<li>${c}</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                </div>
            `;

            this.el = {
                svg: this.container.querySelector('.se-svg-canvas'),
                laserLayer: this.container.querySelector('#laser-layer'),
                particlesLayer: this.container.querySelector('#particle-layer'),
                nodes: Array.from(this.container.querySelectorAll('.attr-node')),
                prism: this.container.querySelector('#central-prism polygon'),
                btnPsych: this.container.querySelector('#cannon-psych'),
                btnCyber: this.container.querySelector('#cannon-cyber'),
                hudTitle: this.container.querySelector('.hud-title'),
                hudSubtitle: this.container.querySelector('.hud-subtitle'),
                hudPsych: this.container.querySelector('.psych-side .side-content'),
                hudCyber: this.container.querySelector('.cyber-side .side-content'),
                corePanel: this.container.querySelector('.hud-core-panel')
            };

        },

        bindEvents: function () {
            // Cannon Toggles
            this.el.btnPsych.addEventListener('click', () => {
                this.state.psychBeam = !this.state.psychBeam;
                this.el.btnPsych.classList.toggle('active', this.state.psychBeam);
                this.updateLasers();
            });

            this.el.btnCyber.addEventListener('click', () => {
                this.state.cyberBeam = !this.state.cyberBeam;
                this.el.btnCyber.classList.toggle('active', this.state.cyberBeam);
                this.updateLasers();
            });

            // Node Selection
            this.el.nodes.forEach(nodeGrp => {
                nodeGrp.addEventListener('click', () => {
                    const id = nodeGrp.dataset.id;
                    
                    // visual deselect all
                    this.el.nodes.forEach(n => n.querySelector('.attr-bg').setAttribute('stroke', '#333'));
                    
                    // highlight active
                    nodeGrp.querySelector('.attr-bg').setAttribute('stroke', '#fff');

                    this.state.activeNode = this.data.attributes.find(a => a.id === id);
                    this.tooltipsOpened.add(id);

                    this.updateHUD();
                    this.updateLasers();
                });
            });
        },

        updateHUD: function() {
            if (!this.state.activeNode) return;

            const n = this.state.activeNode;
            this.el.hudTitle.textContent = n.label.toUpperCase();
            this.el.hudSubtitle.textContent = "Analyzing parameter structural differences...";

            // Update panels based on active beams
            if (this.state.psychBeam) {
                this.el.hudPsych.innerHTML = `<strong>${n.psych}</strong><br><span style="font-size:0.85em; opacity:0.8">${n.infoPsych}</span>`;
                this.el.hudPsych.parentElement.classList.add('active');
            } else {
                this.el.hudPsych.innerHTML = `Fire emitter to scan.`;
                this.el.hudPsych.parentElement.classList.remove('active');
            }

            if (this.state.cyberBeam) {
                this.el.hudCyber.innerHTML = `<strong>${n.cyber}</strong><br><span style="font-size:0.85em; opacity:0.8">${n.infoCyber}</span>`;
                this.el.hudCyber.parentElement.classList.add('active');
            } else {
                this.el.hudCyber.innerHTML = `Fire emitter to scan.`;
                this.el.hudCyber.parentElement.classList.remove('active');
            }

            // Central Core lights up when BOTH fire
            if (this.state.psychBeam && this.state.cyberBeam) {
                this.el.corePanel.classList.add('illuminated');
                this.el.prism.setAttribute('fill', 'rgba(245, 158, 11, 0.4)');
                this.el.prism.setAttribute('stroke', '#F59E0B');
                this.el.prism.setAttribute('filter', 'url(#glow-g)');
            } else {
                this.el.corePanel.classList.remove('illuminated');
                this.el.prism.setAttribute('fill', 'rgba(255,255,255,0.05)');
                this.el.prism.setAttribute('stroke', '#666');
                this.el.prism.removeAttribute('filter');
            }

            this.checkCompletion();
        },

        updateLasers: function() {
            this.updateHUD();
            this.el.laserLayer.innerHTML = '';
            
            const pX = this.svgProps.px;
            const pY = this.svgProps.py;

            // Draw Psych Beam
            if (this.state.psychBeam) {
                // Glow 
                const l1B = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                l1B.setAttribute('x1', '100'); l1B.setAttribute('y1', '330');
                l1B.setAttribute('x2', pX); l1B.setAttribute('y2', pY);
                l1B.setAttribute('stroke', '#8B5CF6'); l1B.setAttribute('stroke-width', '8');
                l1B.setAttribute('opacity', '0.4');
                this.el.laserLayer.appendChild(l1B);

                const l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                l1.setAttribute('x1', '100'); l1.setAttribute('y1', '330');
                l1.setAttribute('x2', pX); l1.setAttribute('y2', pY);
                l1.setAttribute('stroke', '#E9D5FF'); l1.setAttribute('stroke-width', '2');
                this.el.laserLayer.appendChild(l1);

                if (this.state.activeNode) {
                    const l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    l2.setAttribute('x1', pX); l2.setAttribute('y1', pY);
                    l2.setAttribute('x2', this.state.activeNode.x); l2.setAttribute('y2', this.state.activeNode.y);
                    l2.setAttribute('stroke', '#A78BFA'); l2.setAttribute('stroke-width', '3');
                    l2.classList.add('beam-scatter-p');
                    this.el.laserLayer.appendChild(l2);
                }
            }

            // Draw Cyber Beam
            if (this.state.cyberBeam) {
                // Glow 
                const l1B = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                l1B.setAttribute('x1', '750'); l1B.setAttribute('y1', '330');
                l1B.setAttribute('x2', pX); l1B.setAttribute('y2', pY);
                l1B.setAttribute('stroke', '#0D9488'); l1B.setAttribute('stroke-width', '8');
                l1B.setAttribute('opacity', '0.4');
                this.el.laserLayer.appendChild(l1B);

                const l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                l1.setAttribute('x1', '750'); l1.setAttribute('y1', '330');
                l1.setAttribute('x2', pX); l1.setAttribute('y2', pY);
                l1.setAttribute('stroke', '#CCFBF1'); l1.setAttribute('stroke-width', '2');
                this.el.laserLayer.appendChild(l1);

                if (this.state.activeNode) {
                    const l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    l2.setAttribute('x1', pX); l2.setAttribute('y1', pY);
                    l2.setAttribute('x2', this.state.activeNode.x); l2.setAttribute('y2', this.state.activeNode.y);
                    l2.setAttribute('stroke', '#5EEAD4'); l2.setAttribute('stroke-width', '3');
                    l2.classList.add('beam-scatter-c');
                    this.el.laserLayer.appendChild(l2);
                }
            }
        },

        initEngine: function () {
            this.isRunning = true;
            this.loop = this.loop.bind(this);
            requestAnimationFrame(this.loop);
        },

        loop: function (time) {
            if (!this.isRunning) return;
            // Particles logic can be minimal for now, handled purely by CSS on beams inside CSS file.
            requestAnimationFrame(this.loop);
        },

        checkCompletion: function () {
            if (this.completed) return;
            const allTooltips = this.tooltipsOpened.size >= 4;
            const sawBoth = this.state.psychBeam && this.state.cyberBeam;

            if (allTooltips && sawBoth) {
                this.completed = true;
                
                const parent = this.container.closest('.interactive-simulation-container');
                if (parent) {
                    const continueBtn = parent.querySelector('.btn-continue');
                    if (continueBtn) {
                        continueBtn.style.display = 'block';
                        continueBtn.style.boxShadow = '0 0 15px #F59E0B';
                    }
                }
            }
        },

        destroy: function () {
            this.isRunning = false;
        }
    };

    window.SimulationEngines = window.SimulationEngines || {};
    window.SimulationEngines['spectrum-explorer'] = SpectrumExplorer;

})();
