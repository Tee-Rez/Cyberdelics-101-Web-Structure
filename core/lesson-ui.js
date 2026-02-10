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
            sidebarRight: null,
            sidebarBottom: null
        };
        console.log('[LessonUI] Constructed');
        this._foundArtifacts = new Set();
    }

    /**
     * Initialize the Cyberdeck UI structure
     * @param {HTMLElement} container - The root element to convert into a cyberdeck
     */
    init(container) {
        console.log('[LessonUI] Initializing with container:', container);
        this.container = container;
        this.renderShell();

        // Responsive Check: Auto-collapse sidebars on small screens
        if (window.innerWidth < 1000) {
            if (this.elements.sidebarLeft) this.elements.sidebarLeft.classList.add('collapsed');
            if (this.elements.sidebarRight) this.elements.sidebarRight.classList.add('collapsed');

            // Adjust toggle button text
            if (this.elements.sidebarLeft) {
                const btn = this.elements.sidebarLeft.querySelector('.cd-toggle-btn');
                if (btn) btn.textContent = '►';
            }
            if (this.elements.sidebarRight) {
                const btn = this.elements.sidebarRight.querySelector('.cd-toggle-btn');
                if (btn) btn.textContent = '◄';
            }
        }
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

        // 1. Top Section (Logo + Header)
        const topSection = document.createElement('div');
        topSection.className = 'cyberdeck-top-section';

        // Logo Container (Left)
        const logoContainer = document.createElement('div');
        logoContainer.className = 'cd-top-logo-container';
        logoContainer.innerHTML = `<img src="../assets/Gifs/rotating-string.gif" alt="Cyberdelic Asset" />`;
        topSection.appendChild(logoContainer);

        // Header Bar (Right)
        const topBar = document.createElement('div');
        topBar.className = 'cyberdeck-header';
        topBar.innerHTML = `
                <div class="cd-header-left">
                    <button class="cd-back-btn" style="display:none;" title="Go Back">◀ <span class="cd-back-text">BACK</span></button>
                </div>
                <div class="cd-header-center">
                    <div class="cd-lesson-title">Loading...</div>
                    <div class="cd-progress-track">
                        <div class="cd-progress-fill"></div>
                    </div>
                </div>
                <div class="cd-header-right">
                    <span class="cd-fs-label">FULL SCREEN</span>
                    <button class="cd-fullscreen-btn" title="Toggle Full Screen">⛶</button>
                </div>
            `;
        topSection.appendChild(topBar);

        // Store reference
        this.elements.backBtn = topBar.querySelector('.cd-back-btn');
        this.shell.appendChild(topSection);

        // Bind Full Screen Toggle
        const fsBtn = topBar.querySelector('.cd-fullscreen-btn');
        fsBtn.addEventListener('click', () => this.toggleFullScreen());
        this.elements.fsBtn = fsBtn;

        // 2. Main Body (Sidebars + Content)
        const body = document.createElement('div');
        body.className = 'cyberdeck-body';
        // ... (body creation remains same, handled by existing code if I slice carefully) ... 

        /* 
           NOTE: I cannot slice mid-function easily with replace_file_content if I don't include the whole block. 
           I will assume the Body content generation follows immediately after.
           Wait, I need to match the END of the replace block to valid code.
           The original code had `this.shell.appendChild(topBar);` ... `const body = ...`
        */

        // ... (Let's continue Body setup in next lines) ...

        // Left Sidebar (Inventory)
        const sideLeft = document.createElement('div');
        sideLeft.className = 'cyberdeck-sidebar cd-sidebar-left collapsed';
        sideLeft.innerHTML = `
                <div class="cd-sidebar-header">
                    <span class="cd-sidebar-title">ARTIFACTS</span>
                    <button class="cd-toggle-btn">◄</button>
                </div>
                <div class="cd-artifact-counter">0/5</div>
                <div class="cd-collapsed-icons"></div>
                <div class="cd-sidebar-content">
                    <div class="cd-empty-state">No artifacts detected.</div>
                </div>
            `;
        sideLeft.querySelector('.cd-toggle-btn').addEventListener('click', () => {
            sideLeft.classList.toggle('collapsed');
            const btn = sideLeft.querySelector('.cd-toggle-btn');
            btn.textContent = sideLeft.classList.contains('collapsed') ? '►' : '◄';
        });
        body.appendChild(sideLeft);

        // Main Content Area (The "View Port")
        const main = document.createElement('div');
        main.className = 'cyberdeck-main';
        main.id = 'cyberdeck-content-port';

        // Inner Container for Teaching Modules (This is what gets cleared by LessonRunner)
        const moduleRoot = document.createElement('div');
        moduleRoot.id = 'module-root';
        moduleRoot.style.cssText = 'width: 100%; height: 100%; position: relative;';
        main.appendChild(moduleRoot);
        this.elements.moduleRoot = moduleRoot;

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
                    <div id="cd-audio-player-container"></div>
                </div>
            `;
        sideRight.querySelector('.cd-toggle-btn').addEventListener('click', () => {
            sideRight.classList.toggle('collapsed');
            const btn = sideRight.querySelector('.cd-toggle-btn');
            btn.textContent = sideRight.classList.contains('collapsed') ? '◄' : '►';
        });

        // Mini Play Button
        const miniPlayBtn = sideRight.querySelector('.cd-mini-play-btn');
        miniPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.audioPlayer) this.audioPlayer.toggle();
        });
        this.elements.miniPlayBtn = miniPlayBtn;

        body.appendChild(sideRight);

        // 3. Bottom Bar (Restored)
        const bottomBar = document.createElement('div');
        bottomBar.className = 'cyberdeck-footer';
        bottomBar.innerHTML = `
            <div class="cd-wave-container">
                <!-- Left Side: Controls -->
                 <div class="cd-slider-container" style="order: -1;">
                    <button id="wave-selector" class="wave-selector-btn" title="Color Mode"></button>
                    <div class="cd-slider-group">
                        <input type="range" id="wave-freq" class="wave-slider" min="1" max="50" value="10" title="Frequency">
                        <input type="range" id="wave-amp" class="wave-slider" min="1" max="100" value="50" title="Amplitude">
                        <input type="range" id="wave-speed" class="wave-slider" min="1" max="20" value="5" title="Speed">
                    </div>
                </div>
                
                <div class="cd-visualizer-wrapper">
                     <canvas id="wave-canvas"></canvas>
                </div>
            </div>
        `;
        this.shell.appendChild(bottomBar);

        // 3. Bottom Sidebar (Video Overlay)
        const sideBottom = document.createElement('div');
        sideBottom.className = 'cyberdeck-sidebar cd-sidebar-bottom collapsed no-transition'; // Start with no-transition
        sideBottom.innerHTML = `
                <div class="cd-sidebar-header">
                    <span class="cd-sidebar-title">SOPHIA TEASER</span>
                    <button class="cd-toggle-btn">▲</button>
                </div>
                <!-- Content injected lazily to prevent layout shift -->
            `;

        // Toggle Logic
        sideBottom.querySelector('.cd-toggle-btn').addEventListener('click', () => {
            this.toggleBottomPanel();
        });

        this.elements.sidebarBottom = sideBottom;
        body.appendChild(sideBottom); // Move to body to avoid scrolling with main content

        // Force Reflow
        void sideBottom.offsetHeight;
        setTimeout(() => sideBottom.classList.remove('no-transition'), 500);

        // Assemble
        this.shell.appendChild(body);
        this.shell.appendChild(bottomBar);
        this.container.appendChild(this.shell);

        // Store references
        this.elements.topBar = topBar;
        this.elements.lessonTitle = topBar.querySelector('.cd-lesson-title');
        this.elements.progressBar = topBar.querySelector('.cd-progress-track');
        this.elements.progressFill = topBar.querySelector('.cd-progress-fill');
        this.elements.mainArea = main;
        this.elements.sidebarLeft = sideLeft;
        this.elements.sidebarRight = sideRight;

        // Visualizer & Audio setup
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
     * Programmatically toggle the bottom panel (Video)
     * @param {boolean} [forceOpen] - If true, force open. If false, force close. If undefined, toggle.
     */
    toggleBottomPanel(forceOpen) {
        const sideBottom = this.elements.sidebarBottom;
        if (!sideBottom) return;

        // Lazy Inject Content if needed
        if (!sideBottom.querySelector('.cd-sidebar-content')) {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'cd-sidebar-content';
            contentDiv.innerHTML = `
                 <div class="video-container">
                     <video controls style="width: 100%; border-radius: 4px;">
                         <source src="../../assets/Video/sophia-teaser.mp4" type="video/mp4">
                         Your browser does not support the video tag.
                     </video>
                 </div>`;
            sideBottom.appendChild(contentDiv);
        }

        const isCurrentlyCollapsed = sideBottom.classList.contains('collapsed');
        const shouldOpen = forceOpen !== undefined ? forceOpen : isCurrentlyCollapsed;

        if (shouldOpen) {
            sideBottom.classList.remove('collapsed');
            const btn = sideBottom.querySelector('.cd-toggle-btn');
            if (btn) btn.textContent = '▼';

            const video = sideBottom.querySelector('video');
            if (video) {
                video.currentTime = 0;
                video.play().catch(err => console.log('Auto-play prevent:', err));
            }
        } else {
            sideBottom.classList.add('collapsed');
            const btn = sideBottom.querySelector('.cd-toggle-btn');
            if (btn) btn.textContent = '▲';

            const video = sideBottom.querySelector('video');
            if (video) {
                video.pause();
            }
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
     * Configure the Back Button
     * @param {Function} [onClick] - Callback when clicked. If null, hides button.
     */
    setBackAction(onClick) {
        if (!this.elements.backBtn) return;

        if (typeof onClick === 'function') {
            this.elements.backBtn.style.display = 'block';
            this.elements.backBtn.onclick = onClick;
        } else {
            this.elements.backBtn.style.display = 'none';
            this.elements.backBtn.onclick = null;
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
        // Reset found artifacts on registration (effectively a level reset)
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
        const registeredData = this._registeredArtifacts?.find(a => a.id === id);

        // VALIDATION: If this ID is not in our manifest/registered list, it's not a collectable artifact.
        if (!registeredData) {
            console.log(`[LessonUI] Ignored non-artifact ID: ${id}`);
            return;
        }

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
    }

    /**
     * Unlock a specific artifact in the sidebar
     * @param {string} id - Artifact ID
     */
    unlockArtifact(id) {
        if (!this.elements.sidebarLeft) return;

        // Find the specific item row
        const item = this.elements.sidebarLeft.querySelector(`.cd-artifact-item[data-artifact-id="${id}"]`);
        if (item) {
            item.classList.remove('cd-artifact-locked');
            // Add a highlight animation?
            item.style.borderColor = 'var(--color-accent)';

            // Add icon to collapsed strip
            const collapsedIcons = this.elements.sidebarLeft.querySelector('.cd-collapsed-icons');
            if (collapsedIcons && !collapsedIcons.querySelector(`[data-artifact-id="${id}"]`)) {
                // Find registered data for icon
                const data = this._registeredArtifacts?.find(a => a.id === id);
                const iconHtml = data ? (data.icon || '📦') : '📦';
                const titleText = data ? (data.label || 'Artifact') : 'Artifact';

                const miniIcon = document.createElement('div');
                miniIcon.className = 'cd-collapsed-icon';
                miniIcon.dataset.artifactId = id;
                miniIcon.innerHTML = iconHtml;
                miniIcon.title = titleText;
                collapsedIcons.appendChild(miniIcon);
            }

            // Also update the internal counter if not already handled
            // (Our ArtifactSystem calls this, so let's rely on that flow)
        } else {
            console.warn(`[LessonUI] Artifact ID "${id}" not found in sidebar.`);
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
     * Toggle Full Screen Mode
     * Useful for Framer embeds to break out of scrollbars
     */
    toggleFullScreen() {
        // Use the shell element instead of documentElement for iframe compatibility
        const targetElement = this.shell || document.documentElement;

        if (!document.fullscreenElement) {
            targetElement.requestFullscreen().catch(err => {
                console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
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
        return this.elements.moduleRoot || this.elements.mainArea;
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
        if (!this.canvas.parentElement) return;
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
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
