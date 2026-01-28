/**
 * CYBERDELICS 101 - Artifact Collection System
 * A global service that overlays collectable items onto any active lesson method.
 */

(function () {
    'use strict';

    window.ArtifactSystem = {
        _state: {
            activeArtifacts: [], // Currently visible artifacts
            collectedIds: new Set(), // Persisted via session
            container: null, // The overlay container
            hostContainer: null // The active method container
        },

        init: function () {
            // Load collected state - DISABLED for testing/development (Reset on reload)
            // const saved = sessionStorage.getItem('cd101_artifacts');
            // if (saved) {
            //     this._state.collectedIds = new Set(JSON.parse(saved));
            // }
            this._state.collectedIds = new Set(); // Ensure fresh start
            this._updateInventoryUI();
        },

        has: function (id) {
            return this._state.collectedIds.has(id);
        },

        getCount: function () {
            return this._state.collectedIds.size;
        },

        /**
         * Mounts the artifact overlay on top of the active method.
         * @param {HTMLElement} hostContainer - The container of the active teaching method.
         * @param {Array} artifactConfigs - Metadata from Lesson Manifest.
         */
        mount: function (hostContainer, artifactConfigs) {
            this._state.hostContainer = hostContainer;
            this._state.activeArtifacts = [];

            // Create Overlay Layer
            const overlay = document.createElement('div');
            overlay.className = 'artifact-overlay';
            overlay.style.cssText = `
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                pointer-events: none; z-index: 1000;
            `;
            hostContainer.appendChild(overlay);
            this._state.container = overlay;

            // Spawn Artifacts
            if (artifactConfigs && Array.isArray(artifactConfigs)) {
                artifactConfigs.forEach(config => {
                    if (!this._state.collectedIds.has(config.id)) {
                        this._spawnArtifact(config);
                    }
                });
            }
        },

        unmount: function () {
            if (this._state.container) {
                this._state.container.remove();
            }
            this._state.container = null;
            this._state.activeArtifacts = [];
        },

        _spawnArtifact: function (config) {
            // Create DOM Element
            const el = document.createElement('div');
            el.className = 'cd-artifact-node';
            el.dataset.id = config.id;

            // Visual Styles for a "Shiny Shard"
            el.innerHTML = `
                <div class="artifact-glow"></div>
                <div class="artifact-core">?</div>
            `;
            el.style.cssText = `
                position: absolute; width: 40px; height: 40px;
                left: ${config.position.x}%; top: ${config.position.y}%;
                transform: translate(-50%, -50%);
                cursor: pointer; pointer-events: auto;
                transition: transform 0.3s ease;
            `;

            // Interaction
            el.addEventListener('mouseenter', () => el.style.transform = 'translate(-50%, -50%) scale(1.2)');
            el.addEventListener('mouseleave', () => el.style.transform = 'translate(-50%, -50%) scale(1.0)');
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Don't trigger method clicks
                this.collect(config);
                el.style.transform = 'translate(-50%, -50%) scale(0)';
                setTimeout(() => el.remove(), 300);
            });

            this._state.container.appendChild(el);
            this._state.activeArtifacts.push(el);
        },

        collect: function (config) {
            console.log('[ArtifactSystem] collect called for:', config.id);

            // VALIDATION: Check against LessonUI registered artifacts
            // If LessonUI has a registry, we must match it.
            if (window.LessonUI && window.LessonUI._registeredArtifacts) {
                const isValid = window.LessonUI._registeredArtifacts.some(a => a.id === config.id);
                if (!isValid) {
                    console.log(`[ArtifactSystem] Ignore '${config.id}' - Not in manifest artifacts.`);
                    return;
                }
            }

            if (this._state.collectedIds.has(config.id)) {
                console.log('[ArtifactSystem] Already collected:', config.id);
                return;
            }

            console.log(`[ArtifactSystem] Collecting new artifact: ${config.id}`);
            this._state.collectedIds.add(config.id);
            this._saveState();

            // 1. Show Notification
            this._showNotification(`Artifact Acquired: ${config.name || 'Unknown Data'}`);

            // 2. Update Inventory UI (Counter & Sidebar)
            this._updateInventoryUI();

            // Sync with LessonUI to unlock visual element
            if (window.LessonUI && window.LessonUI.unlockArtifact) {
                window.LessonUI.unlockArtifact(config.id);
            }

            // 3. Trigger Unlock (if any)
            if (config.type === 'audio_unlock' && window.AudioPlayer) {
                // Just notify logic, AudioPlayer needs integration
                window.AudioPlayer.unlockTrack && window.AudioPlayer.unlockTrack(config.payload);
            }
        },

        _saveState: function () {
            // DISABLED for testing
            // const data = JSON.stringify([...this._state.collectedIds]);
            // console.log('[ArtifactSystem] Saving state to storage:', data);
            // sessionStorage.setItem('cd101_artifacts', data);
        },

        _showNotification: function (text) {
            const toast = document.createElement('div');
            toast.className = 'cd-toast';
            toast.textContent = text;
            toast.style.cssText = `
                position: fixed; top: 100px; right: 20px;
                background: var(--color-accent, #00d9ff); color: #000;
                padding: 12px 24px; border-radius: 8px;
                font-family: monospace; font-weight: bold;
                box-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
                opacity: 0; transform: translateX(20px);
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                z-index: 2000;
            `;
            document.body.appendChild(toast);

            // Animate In
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(0)';
            });

            // Remove
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(20px)';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },

        _updateInventoryUI: function () {
            // Find Sidebar Counter
            const counter = document.querySelector('.cd-artifact-counter');
            if (counter) {
                counter.textContent = `${this._state.collectedIds.size}/5`; // Max hardcoded for now
            }

            // If empty state text exists, toggle it
            const emptyState = document.querySelector('.cd-empty-state');
            if (emptyState && this._state.collectedIds.size > 0) {
                emptyState.style.display = 'none';
                // TODO: Render collected list in sidebar
            }
        }
    };

    // Auto-init if DOM ready, or wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.ArtifactSystem.init());
    } else {
        window.ArtifactSystem.init();
    }

})();
