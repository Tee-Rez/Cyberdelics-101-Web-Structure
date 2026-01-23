/**
 * CYBERDELICS 101 - Interactive Simulation Method
 * Host Framework for Pluggable Simulations
 * 
 * Factory Pattern Refactor
 * 
 * Usage:
 *   const factory = window.InteractiveSimulationFactory;
 *   const instance = factory();
 *   instance.init('.sim-container', { engine: 'wave-sim' });
 */

(function () {
    'use strict';

    if (typeof createTeachingMethod === 'undefined') {
        console.error('Core dependency "method-base.js" missing.');
        return;
    }

    const InteractiveSimulationFactory = function () {
        return createTeachingMethod('interactive-simulation', {
            // ========== LIFECYCLE ==========

            onInit: function (container, options = {}) {
                // State
                this._state = {
                    engine: null,      // The loaded simulation logic
                    params: {},        // Current parameter values
                    options: options,  // Store options for later use
                    isRunning: true,
                    rafId: null,
                    lastTime: 0,
                    // Use options first, then data attribute
                    enginePath: options.engine || (container ? container.dataset.engine : null)
                };

                // Elements
                this._elements = {
                    container: container,
                    canvas: container.querySelector('.sim-canvas'),
                    viewport: container.querySelector('.sim-viewport'),
                    controls: container.querySelector('.sim-controls'),
                    playBtn: container.querySelector('.btn-play'),
                    resetBtn: container.querySelector('.btn-reset')
                };

                // 1. Setup Canvas (Optional)
                if (this._elements.canvas) {
                    this._resizeCanvas();
                    window.addEventListener('resize', () => this._resizeCanvas());
                } else if (!this._elements.viewport) {
                    // We need at least a viewport
                    console.error('[InteractiveSimulation] No .sim-viewport found in', container);
                    return;
                }

                // 2. Load Engine
                if (this._state.enginePath) {
                    this._loadEngine(this._state.enginePath);
                } else {
                    console.warn('[InteractiveSimulation] No engine specified via options or data-engine');
                }

                // 3. Setup Controls
                this._setupControls();
            },

            onDestroy: function () {
                this._stopLoop();
                if (this._state.engine && this._state.engine.destroy) {
                    this._state.engine.destroy();
                }
            },

            onReset: function () {
                this._stopLoop();

                // Reset params to defaults
                if (this._state.engine && this._state.engine.defaults) {
                    this._state.params = { ...this._state.engine.defaults };
                    this._updateControlUI();
                }

                if (this._state.engine && this._state.engine.reset) {
                    this._state.engine.reset();
                }

                // Restart loop
                this._state.isRunning = true;
                this._startLoop();
            },

            // ========== ENGINE MANAGEMENT ==========

            _loadEngine: function (path) {
                // Dynamic import would be ideal, but for basic script loading in this environment:
                // We assume the script is loaded via <script> tag OR we fetch it.
                // For now, let's assume the Global Namespace pattern used elsewhere.
                // expected: window.SimulationEngines['wave-interference']

                const engineName = path; // e.g. 'WaveInterference'

                const checkEngine = () => {
                    if (window.SimulationEngines && window.SimulationEngines[engineName]) {
                        this._initEngine(window.SimulationEngines[engineName]);
                    } else {
                        // Retry briefly in case of race condition
                        // Note: If running multiple factories, ensure this timeout is cleared on destroy?
                        // For simplicity, we just run it a few times.
                        setTimeout(checkEngine, 100);
                    }
                };

                checkEngine();
            },

            _initEngine: function (EngineClass) {
                // Instantiate - Creates a copy of the engine definition for this instance
                this._state.engine = Object.create(EngineClass);

                // Get Defaults and merge with custom params from options
                this._state.params = {
                    ...EngineClass.defaults,
                    ...(this._state.options.params || {})
                };

                // Build UI for Params
                this._buildControls(EngineClass.config);

                // Init Engine
                // Init Engine - Pass the generic viewport container
                if (this._state.engine.init) {
                    this._state.engine.init(this._elements.viewport, this._state.params, this);
                }

                // Start Loop
                this._startLoop();
                console.log(`[InteractiveSimulation] Loaded engine: ${EngineClass.name}`);
            },

            // ========== UI BUILDER ==========

            _buildControls: function (config) {
                const controlsContainer = this._elements.controls;
                // Clear existing except buttons
                const buttons = controlsContainer.querySelector('.playback-controls');
                controlsContainer.innerHTML = '';

                // Generate sliders/inputs
                if (config) {
                    config.forEach(param => {
                        const group = document.createElement('div');
                        group.className = 'control-group';

                        const label = document.createElement('div');
                        label.className = 'control-label';
                        label.innerHTML = `<span>${param.label}</span><span id="val-${param.id}">${this._state.params[param.id]}</span>`;

                        const input = document.createElement('input');
                        input.type = 'range';
                        input.min = param.min;
                        input.max = param.max;
                        input.step = param.step;
                        input.value = this._state.params[param.id];
                        input.dataset.id = param.id;

                        input.addEventListener('input', (e) => {
                            const val = parseFloat(e.target.value);
                            this._state.params[param.id] = val;
                            // Update label - scoped to this control group ideally, but here using global ID assumption (risky)
                            // Refactor: use local lookup
                            const lbl = group.querySelector(`#val-${param.id}`);
                            if (lbl) lbl.textContent = val;

                            // Notify engine of update
                            if (this._state.engine.onParamChange) {
                                this._state.engine.onParamChange(param.id, val);
                            }
                        });

                        group.appendChild(label);
                        group.appendChild(input);
                        controlsContainer.appendChild(group);
                    });
                }

                // Re-append buttons
                if (buttons) controlsContainer.appendChild(buttons);
                else this._createDefaultButtons(controlsContainer);
            },

            _createDefaultButtons: function (container) {
                // Check if engine explicitly disables default controls
                if (this._state.engine.showPlaybackControls === false) return;

                const div = document.createElement('div');
                div.className = 'playback-controls';

                const btnPlay = document.createElement('button');
                btnPlay.className = 'sim-btn primary btn-play';
                btnPlay.textContent = 'Pause';
                btnPlay.onclick = () => this._togglePlay();

                const btnReset = document.createElement('button');
                btnReset.className = 'sim-btn btn-reset';
                btnReset.textContent = 'Reset';
                btnReset.onclick = () => this.reset();

                div.appendChild(btnPlay);
                div.appendChild(btnReset);
                container.appendChild(div);

                this._elements.playBtn = btnPlay;
            },

            _updateControlUI: function () {
                // Update inputs to match params (for reset)
                const inputs = this._elements.controls.querySelectorAll('input');
                inputs.forEach(input => {
                    const id = input.dataset.id;
                    if (this._state.params[id] !== undefined) {
                        input.value = this._state.params[id];
                        // Scoped label find
                        // This is tricky if IDs are not unique. 
                        // Ideally we traverse up.
                    }
                });
            },

            // ========== LOOP ==========

            _startLoop: function () {
                if (!this._state.rafId) {
                    this._state.lastTime = performance.now();
                    this._loop = this._loop.bind(this);
                    this._state.rafId = requestAnimationFrame(this._loop);
                }
            },

            _stopLoop: function () {
                if (this._state.rafId) {
                    cancelAnimationFrame(this._state.rafId);
                    this._state.rafId = null;
                }
            },

            _loop: function (timestamp) {
                if (!this._state.isRunning) return;

                const dt = (timestamp - this._state.lastTime) / 1000;
                this._state.lastTime = timestamp;

                if (this._state.engine) {
                    // Update
                    if (this._state.engine.update) {
                        this._state.engine.update(dt, this._state.params);
                    }

                    // Draw
                    if (this._state.engine.draw && this._elements.canvas) {
                        this._state.engine.draw(this._elements.canvas.getContext('2d'), this._state.params);
                    }
                }

                this._state.rafId = requestAnimationFrame(this._loop);
            },

            _togglePlay: function () {
                this._state.isRunning = !this._state.isRunning;
                if (this._elements.playBtn) {
                    this._elements.playBtn.textContent = this._state.isRunning ? 'Pause' : 'Play';
                    this._elements.playBtn.classList.toggle('primary', !this._state.isRunning);
                }

                if (this._state.isRunning) {
                    this._state.lastTime = performance.now();
                    this._startLoop();
                } else {
                    this._stopLoop();
                }
            },

            _setupControls: function () {
                // Handled in _buildControls mostly
            },

            _resizeCanvas: function () {
                const canvas = this._elements.canvas;
                if (!canvas) return;

                const rect = canvas.parentElement.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;

                // Notify engine
                if (this._state.engine && this._state.engine.resize) {
                    this._state.engine.resize(canvas.width, canvas.height);
                }
            }
        });
    };

    // Register
    if (typeof window.MethodLoader !== 'undefined') {
        window.MethodLoader.registerFactory('interactive-simulation', InteractiveSimulationFactory);
    } else {
        window.InteractiveSimulationFactory = InteractiveSimulationFactory;
    }

    // Ensure Registry for Engines exists
    window.SimulationEngines = window.SimulationEngines || {};

})();
