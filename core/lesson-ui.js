/**
 * CYBERDELICS 101 - Lesson UI (Cyberdeck)
 * 
 * Manages the persistent outer shell of the learning experience.
 * Features:
 * - Top Bar: Title, Progress
 * - Left Sidebar: Inventory/Artifacts
 * - Right Sidebar: Stats/Archetype
 * - Main Content Area: Where Teaching Methods render
 */

// Removed 'use strict' wrapper to ensure global access in simple file protocols
// (function () {
// 'use strict';


class LessonUI {
    constructor() {
        this.container = null; // The root #lesson-root
        this.shell = null;     // The .cyberdeck-shell wrapper
        this.elements = {
            topBar: null,
            lessonTitle: null,
            progressBar: null,
            progressFill: null,
            mainArea: null,
            sidebarLeft: null,
            sidebarRight: null
        };
        console.log('[LessonUI] Constructed');
    }

    /**
     * Initialize the Cyberdeck UI structure
     * @param {HTMLElement} container - The root element to convert into a cyberdeck
     */
    init(container) {
        console.log('[LessonUI] Initializing with container:', container);
        this.container = container;
        this.renderShell();
    }

    /**
     * Build the HTML structure
     */
    renderShell() {
        // Clear existing container content (e.g. previous loading text)
        this.container.innerHTML = '';

        // Create Shell Wrapper
        this.shell = document.createElement('div');
        this.shell.className = 'cyberdeck-shell';

        // 1. Top Bar
        const topBar = document.createElement('div');
        topBar.className = 'cyberdeck-header';
        topBar.innerHTML = `
                <div class="cd-header-left">
                    <span class="cd-brand">CYBER.NEXUS</span>
                </div>
                <div class="cd-header-center">
                    <div class="cd-lesson-title">Loading...</div>
                    <div class="cd-progress-track">
                        <div class="cd-progress-fill"></div>
                    </div>
                </div>
                <div class="cd-header-right">
                    <span class="cd-status">ONLINE</span>
                </div>
            `;
        this.shell.appendChild(topBar);

        // 2. Main Body (Sidebars + Content)
        const body = document.createElement('div');
        body.className = 'cyberdeck-body';

        // Left Sidebar (Inventory)
        const sideLeft = document.createElement('div');
        sideLeft.className = 'cyberdeck-sidebar cd-sidebar-left collapsed';
        sideLeft.innerHTML = `
                <div class="cd-sidebar-header">
                    <span class="cd-sidebar-title">ARTIFACTS</span>
                    <button class="cd-toggle-btn">◄</button>
                </div>
                <div class="cd-sidebar-content">
                    <!-- Inventory Grid goes here -->
                    <div class="cd-empty-state">No artifacts detected.</div>
                </div>
            `;
        // Toggle Logic
        sideLeft.querySelector('.cd-toggle-btn').addEventListener('click', () => {
            sideLeft.classList.toggle('collapsed');
            const btn = sideLeft.querySelector('.cd-toggle-btn');
            btn.textContent = sideLeft.classList.contains('collapsed') ? '►' : '◄';
        });
        body.appendChild(sideLeft);

        // Main Content Area (Where methods live)
        const main = document.createElement('div');
        main.className = 'cyberdeck-main';
        main.id = 'cyberdeck-content-port'; // Target for LessonRunner
        body.appendChild(main);

        // Right Sidebar (Stats/Archetype)
        const sideRight = document.createElement('div');
        sideRight.className = 'cyberdeck-sidebar cd-sidebar-right collapsed';
        sideRight.innerHTML = `
                <div class="cd-sidebar-header">
                    <button class="cd-toggle-btn">►</button>
                    <span class="cd-sidebar-title">IDENTITY</span>
                </div>
                <div class="cd-sidebar-content">
                    <!-- Stats go here -->
                    <div class="cd-profile-summary">
                        <div class="cd-archetype-label">UNKNOWN</div>
                        <div class="cd-stat-row">
                            <span>SYNC</span>
                            <span>0%</span>
                        </div>
                    </div>
                </div>
            `;
        // Toggle Logic
        sideRight.querySelector('.cd-toggle-btn').addEventListener('click', () => {
            sideRight.classList.toggle('collapsed');
            const btn = sideRight.querySelector('.cd-toggle-btn');
            btn.textContent = sideRight.classList.contains('collapsed') ? '◄' : '►';
        });
        body.appendChild(sideRight);

        // 3. Bottom Bar (Wave Visualizer)
        const bottomBar = document.createElement('div');
        bottomBar.className = 'cyberdeck-footer';
        bottomBar.innerHTML = `
                <div class="cd-wave-container">
                    <div class="cd-slider-container">
                        <button id="wave-selector" class="wave-selector-btn" title="Toggle Wave Control"></button>
                        <div class="cd-slider-group">
                            <input type="range" class="wave-slider" id="wave-freq" min="1" max="25" value="10" title="Frequency">
                            <input type="range" class="wave-slider" id="wave-amp" min="10" max="100" value="50" title="Amplitude">
                            <input type="range" class="wave-slider" id="wave-speed" min="1" max="25" value="5" title="Speed">
                        </div>
                    </div>
                    <canvas id="wave-canvas"></canvas>
                </div>
            `;
        this.shell.appendChild(bottomBar);

        // Assemble
        this.shell.appendChild(body);
        this.shell.appendChild(bottomBar); // Move bottom bar after body
        this.container.appendChild(this.shell);

        // Store references
        this.elements.topBar = topBar;
        this.elements.lessonTitle = topBar.querySelector('.cd-lesson-title');
        this.elements.progressBar = topBar.querySelector('.cd-progress-track');
        this.elements.progressFill = topBar.querySelector('.cd-progress-fill');
        this.elements.mainArea = main;
        this.elements.sidebarLeft = sideLeft;
        this.elements.sidebarRight = sideRight;

        // Initialize Visualizer
        this.visualizer = new SineWaveVisualizer(
            bottomBar.querySelector('#wave-canvas'),
            bottomBar.querySelector('#wave-freq'),
            bottomBar.querySelector('#wave-amp'),
            bottomBar.querySelector('#wave-speed'),
            bottomBar.querySelector('#wave-selector')
        );
    }

    /**
     * Update the UI state
     * @param {string} title - Current Lesson/Module Title
     * @param {number} progress - 0.0 to 1.0
     */
    update(title, progress) {
        if (title) this.elements.lessonTitle.textContent = title;
        if (typeof progress === 'number') {
            const pct = Math.min(100, Math.max(0, progress * 100));
            this.elements.progressFill.style.width = `${pct}%`;
        }
    }

    /**
     * Get the container where Method Modules should be rendered
     * @returns {HTMLElement}
     */
    getContentContainer() {
        return this.elements.mainArea;
    }
}

/* ---------- Wave Visualizer Sub-System ---------- */
class SineWaveVisualizer {
    constructor(canvas, freqSlider, ampSlider, speedSlider, selectorBtn) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.freqSlider = freqSlider;
        this.ampSlider = ampSlider;
        this.speedSlider = speedSlider;
        this.selectorBtn = selectorBtn;

        // State
        this.time = 0;
        this.activeWave = 'sine'; // 'sine' or 'cosine'

        // Independent Parameters for each wave
        this.waves = {
            sine: { freq: 10, amp: 50, speed: 0.05, color: '#00D9FF' },
            cosine: { freq: 15, amp: 40, speed: 0.05, color: '#FF00D9' }
        };

        // Bind Events
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.setupControls();

        // Start Loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    setupControls() {
        // Slider Inputs update ACTIVE wave
        this.freqSlider.addEventListener('input', (e) => {
            this.waves[this.activeWave].freq = parseInt(e.target.value);
        });
        this.ampSlider.addEventListener('input', (e) => {
            this.waves[this.activeWave].amp = parseInt(e.target.value);
        });
        this.speedSlider.addEventListener('input', (e) => {
            this.waves[this.activeWave].speed = parseInt(e.target.value) * 0.01;
        });

        // Selector Toggle
        this.selectorBtn.addEventListener('click', () => {
            this.activeWave = this.activeWave === 'sine' ? 'cosine' : 'sine';
            this.updateControlsUI();
        });

        // Initial UI sync
        this.updateControlsUI();
    }

    updateControlsUI() {
        const current = this.waves[this.activeWave];

        // Update Sliders to match current wave values
        this.freqSlider.value = current.freq;
        this.ampSlider.value = current.amp;
        this.speedSlider.value = current.speed * 100;

        // Update Button Appearance
        // this.selectorBtn.textContent = this.activeWave.toUpperCase(); // Text might be too big for side bar
        this.selectorBtn.style.backgroundColor = current.color;
        this.selectorBtn.style.boxShadow = `0 0 10px ${current.color}`;
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.offsetWidth - 180;
        this.canvas.height = this.canvas.parentElement.offsetHeight;
    }

    animate() {
        // Distinct Phase Integration for smoother speed changes
        this.waves.sine.phase = (this.waves.sine.phase || 0) + this.waves.sine.speed;
        this.waves.cosine.phase = (this.waves.cosine.phase || 0) + this.waves.cosine.speed;

        // Clear
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.5)'; // Trail effect
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const centerY = this.canvas.height / 2;
        const maxAmp = (this.canvas.height / 2) - 10;
        const sensitivity = 0.5;
        const freqMod = 0.01;

        // Draw Sine
        this.drawWave(
            this.waves.sine.freq * freqMod,
            ((this.waves.sine.amp / 100) * maxAmp) * sensitivity,
            this.waves.sine.phase,
            this.waves.sine.color,
            centerY
        );

        // Draw Cosine (Offset PI/2)
        this.drawWave(
            this.waves.cosine.freq * freqMod,
            ((this.waves.cosine.amp / 100) * maxAmp) * sensitivity,
            this.waves.cosine.phase + (Math.PI / 2),
            this.waves.cosine.color,
            centerY
        );

        requestAnimationFrame(this.animate);
    }

    drawWave(frequency, amplitude, phase, color, centerY) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.lineWidth = 2;


        for (let x = 0; x < this.canvas.width; x++) {
            // y = A * sin(B * (x + C)) + D
            // B is frequency, A is amplitude
            // Adding time creates movement
            const y = centerY + Math.sin(x * frequency + phase) * amplitude;

            if (x === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }

        this.ctx.stroke();
    }
}

// Export Singleton directly to window
window.LessonUI = new LessonUI();

// })(); // End IIFE
