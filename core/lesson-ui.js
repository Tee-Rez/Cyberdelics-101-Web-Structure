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
                    <div class="cd-header-image">
                       <img src="../../assets/Gifs/rotating-string.gif" alt="Cyberdelic Asset" />
                    </div>
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
                    <span class="cd-artifact-counter">0/5</span>
                    <button class="cd-toggle-btn">◄</button>
                </div>
                <div class="cd-collapsed-icons"></div>
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

        // Right Sidebar (Audio Player)
        const sideRight = document.createElement('div');
        sideRight.className = 'cyberdeck-sidebar cd-sidebar-right collapsed';
        sideRight.innerHTML = `
                <div class="cd-sidebar-header">
                    <button class="cd-toggle-btn">►</button>
                    <span class="cd-sidebar-title">AMBIENT</span>
                </div>
                <div class="cd-mini-controls">
                    <button class="cd-mini-play-btn" title="Play/Pause">▶</button>
                </div>
                <div class="cd-sidebar-content">
                    <!-- Audio Player will be injected here -->
                    <div id="cd-audio-player-container"></div>
                </div>
            `;
        // Toggle Logic
        sideRight.querySelector('.cd-toggle-btn').addEventListener('click', () => {
            sideRight.classList.toggle('collapsed');
            const btn = sideRight.querySelector('.cd-toggle-btn');
            btn.textContent = sideRight.classList.contains('collapsed') ? '◄' : '►';
        });

        // Mini Play Button - connect to audio player
        const miniPlayBtn = sideRight.querySelector('.cd-mini-play-btn');
        miniPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't toggle sidebar
            if (this.audioPlayer) {
                this.audioPlayer.toggle();
            }
        });
        this.elements.miniPlayBtn = miniPlayBtn;

        body.appendChild(sideRight);

        // 3. Bottom Bar (Wave Visualizer + Asset)
        const bottomBar = document.createElement('div');
        bottomBar.className = 'cyberdeck-footer';
        bottomBar.innerHTML = `
                <div class="cd-wave-container">
                    <div class="cd-visualizer-wrapper">
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
                    
                    <div class="cd-footer-image">
                        <img src="../../assets/Gifs/rotating-string.gif" alt="Cyberdelic Asset" />
                    </div>
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

        // Initialize Audio Player (if AudioPlayer class is available)
        const audioContainer = sideRight.querySelector('#cd-audio-player-container');
        if (audioContainer && typeof AudioPlayer !== 'undefined') {
            this.audioPlayer = new AudioPlayer(audioContainer, {
                basePath: '../../assets/audio/binaural/',
                autoLoad: true,
                loop: true
            });

            // Sync mini button with audio state
            this.audioPlayer.onPlayStateChange = (playing) => {
                if (this.elements.miniPlayBtn) {
                    this.elements.miniPlayBtn.innerHTML = playing ? '❚❚' : '▶';
                    this.elements.miniPlayBtn.classList.toggle('playing', playing);
                }
            };
        }
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
     * Pre-register all expected artifacts (shown as locked/greyed out)
     * @param {Array} artifacts - Array of { id, icon, label, description }
     */
    registerArtifacts(artifacts) {
        if (!this.elements.sidebarLeft) return;

        const contentArea = this.elements.sidebarLeft.querySelector('.cd-sidebar-content');
        if (!contentArea) return;

        // Clear empty state
        const emptyState = contentArea.querySelector('.cd-empty-state');
        if (emptyState) emptyState.remove();

        // Store expected artifacts
        this._registeredArtifacts = artifacts;
        this._foundArtifacts = new Set();

        // Render all as locked
        artifacts.forEach(data => {
            const item = document.createElement('div');
            item.className = 'cd-artifact-item cd-artifact-locked';
            item.dataset.artifactId = data.id;
            item.innerHTML = `
                <div class="cd-artifact-icon">${data.icon || '❓'}</div>
                <div class="cd-artifact-details">
                    <div class="cd-artifact-title">${data.label || '???'}</div>
                    <div class="cd-artifact-desc">Not yet discovered</div>
                </div>
            `;
            contentArea.appendChild(item);
        });

        // Update counter
        this._updateArtifactCounter();
    }

    /**
     * Unlock/find an artifact (changes from greyed to revealed)
     * @param {string} id - Unique ID of the artifact
     * @param {object} data - Optional override { icon, label, description }
     */
    addArtifact(id, data = {}) {
        if (!this.elements.sidebarLeft) return;

        const contentArea = this.elements.sidebarLeft.querySelector('.cd-sidebar-content');
        if (!contentArea) return;

        // Check if already found
        if (this._foundArtifacts && this._foundArtifacts.has(id)) return;

        // Find registered artifact data
        const registeredData = this._registeredArtifacts?.find(a => a.id === id) || data;
        const finalData = { ...registeredData, ...data };

        // Try to find existing locked artifact element
        const existingItem = contentArea.querySelector(`[data-artifact-id="${id}"]`);

        if (existingItem) {
            // Unlock existing item
            existingItem.classList.remove('cd-artifact-locked');
            existingItem.innerHTML = `
                <div class="cd-artifact-icon">${finalData.icon || '📦'}</div>
                <div class="cd-artifact-details">
                    <div class="cd-artifact-title">${finalData.label || 'Unknown Artifact'}</div>
                    <div class="cd-artifact-desc">${finalData.description || ''}</div>
                </div>
            `;
        } else {
            // Remove empty state if present
            const emptyState = contentArea.querySelector('.cd-empty-state');
            if (emptyState) emptyState.remove();

            // Create new artifact element
            const item = document.createElement('div');
            item.className = 'cd-artifact-item';
            item.dataset.artifactId = id;
            item.innerHTML = `
                <div class="cd-artifact-icon">${finalData.icon || '📦'}</div>
                <div class="cd-artifact-details">
                    <div class="cd-artifact-title">${finalData.label || 'Unknown Artifact'}</div>
                    <div class="cd-artifact-desc">${finalData.description || ''}</div>
                </div>
            `;
            contentArea.appendChild(item);
        }

        // Add to found set
        if (this._foundArtifacts) {
            this._foundArtifacts.add(id);
        }

        // Add icon to collapsed strip (only for found artifacts)
        const collapsedIcons = this.elements.sidebarLeft.querySelector('.cd-collapsed-icons');
        if (collapsedIcons && !collapsedIcons.querySelector(`[data-artifact-id="${id}"]`)) {
            const miniIcon = document.createElement('div');
            miniIcon.className = 'cd-collapsed-icon';
            miniIcon.dataset.artifactId = id;
            miniIcon.innerHTML = finalData.icon || '📦';
            miniIcon.title = finalData.label || 'Artifact';
            collapsedIcons.appendChild(miniIcon);
        }

        // Update Counter
        this._artifactCount = (this._artifactCount || 0) + 1;
        this._updateArtifactCounter();

        // Check for audio unlock
        const totalExpected = this._registeredArtifacts?.length || 5;
        if (this._artifactCount >= totalExpected && !this._audioUnlocked) {
            this.unlockAudio();
        }
    }

    /**
     * Update the artifact counter display
     */
    _updateArtifactCounter() {
        const counter = this.elements.sidebarLeft?.querySelector('.cd-artifact-counter');
        if (counter) {
            counter.textContent = `${this._artifactCount || 0}/5`;
        }
    }

    /**
     * Unlock the audio player and show notification
     */
    unlockAudio() {
        if (this._audioUnlocked) return;
        this._audioUnlocked = true;

        // Unlock the AudioPlayer
        if (this.audioPlayer && typeof this.audioPlayer.unlock === 'function') {
            this.audioPlayer.unlock();
        }

        // Show toast notification
        this.showToast('🔓 New Audio Track Unlocked!');

        console.log('[LessonUI] Audio unlocked!');
    }

    /**
     * Display a toast notification
     * @param {string} message
     */
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'cd-toast';
        toast.textContent = message;
        this.shell.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => toast.classList.add('show'));

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
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
