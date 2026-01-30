/**
 * CYBERDELICS 101 - State Manager
 * Centralized service for capturing, persisting, and restoring user session state.
 * 
 * Responsibilities:
 * - Aggregates state from all subsystems (Runner, Artifacts, Methods)
 * - Serializes state to JSON for storage
 * - Restores functionality from a saved state object
 * - Interfaces with LocalStorage (dev) and Framer (prod)
 */

(function () {
    'use strict';

    window.StateManager = {
        _config: {
            autosaveInterval: 5000, // ms
            storageKey: 'cd101_save_state',
            mode: 'auto' // 'auto', 'local', 'remote'
        },
        _lastSave: null,
        _timer: null,

        /**
         * Initialize the State Manager
         */
        init: function (config = {}) {
            Object.assign(this._config, config);
            console.log('[StateManager] Initialized');

            // Listen for important events to trigger auto-saves
            if (window.CourseCore && window.CourseCore.framer) {
                // Hook into existing event streams if possible, 
                // or just rely on manual triggers from CourseCore
            }

            this._recover();
        },

        /**
         * Capture a complete snapshot of the current session
         * @returns {object} JSON-serializable state object
         */
        snapshot: function () {
            const state = {
                timestamp: Date.now(),
                schemaVersion: '1.0',

                // 1. Course Progress (High Level)
                course: {
                    lessonId: window.CourseCore ? window.CourseCore.getLessonId() : null,
                    progress: window.CourseCore ? window.CourseCore.getProgress() : 0,
                    isComplete: window.CourseCore ? window.CourseCore.isAllContentComplete() : false
                },

                // 2. Navigation State (Where are we?)
                navigation: {
                    activeModuleIndex: window.LessonRunner ? window.LessonRunner.activeModuleIndex : 0,
                    // If we want to be more robust, we might save ID instead of Index
                    activeModuleId: window.LessonRunner && window.LessonRunner.activeModule
                        ? (window.LessonRunner.activeModule._getState().name) // activeModule name often == id in methods
                        : null
                },

                // 3. Inventory (What have we collected?)
                inventory: {
                    collectedIds: window.ArtifactSystem ? Array.from(window.ArtifactSystem.getCollectedIds()) : []
                },

                // 4. Detailed Method State (What happened inside the modules?)
                // We map module IDs to their specific internal state
                modules: this._captureModuleStates()
            };

            return state;
        },

        /**
         * Restore the session from a state object
         * @param {object} state 
         */
        restore: function (state) {
            if (!state) return;
            console.log('[StateManager] Restoring session...', state);

            // 1. Restore Inventory (Do this first so UI updates)
            if (state.inventory && window.ArtifactSystem) {
                window.ArtifactSystem.setCollectedIds(state.inventory.collectedIds);
            }

            // 2. Restore Course Level Flags
            // (CourseCore logic might need updates to accept external state setting)

            // 3. Navigate to Correct Module
            if (state.navigation && window.LessonRunner) {
                // If LessonRunner supports "jumpTo"
                if (window.LessonRunner.jumpTo) {
                    window.LessonRunner.jumpTo(state.navigation.activeModuleIndex);
                } else {
                    console.warn('[StateManager] LessonRunner missing jumpTo() functionality');
                }
            }

            // 4. Restore Module Specifics
            // This usually happens AFTER navigation, once the module is loaded.
            // We might need to store this in a holding area until the module inits.
            this._pendingModuleStates = state.modules || {};
        },

        /**
         * Save current state to storage mechanism
         */
        save: function () {
            const data = this.snapshot();
            const payload = JSON.stringify(data);

            // 1. Local Storage (Backup)
            try {
                localStorage.setItem(this._config.storageKey, payload);
            } catch (e) {
                console.warn('[StateManager] LocalStorage save failed', e);
            }

            // 2. Send to Framer / Parent
            if (window.CourseCore && window.CourseCore.framer) {
                window.CourseCore.framer.postMessage('save_state', { state: data });
            }

            this._lastSave = Date.now();
            console.log('[StateManager] State saved');
        },

        /**
         * Attempt to recover state from storage on boot
         */
        _recover: function () {
            const urlParams = new URLSearchParams(window.location.search);

            // 1. PRIORITY: Check for injected state from Framer (via URL)
            const injectedState = urlParams.get('restoreData');
            if (injectedState) {
                console.log('[StateManager] Found injected state in URL');
                try {
                    const data = JSON.parse(decodeURIComponent(injectedState));
                    // Queue restoration for when lesson is ready
                    window.addEventListener('lesson-ready', () => {
                        this.restore(data);
                    }, { once: true });
                    return; // Stop here, do not load from local storage
                } catch (e) {
                    console.error('[StateManager] Failed to parse injected state', e);
                }
            }

            // 2. FALLBACK: Check for local resume flag
            if (urlParams.get('resume')) {
                const saved = localStorage.getItem(this._config.storageKey);
                if (saved) {
                    try {
                        const data = JSON.parse(saved);
                        window.addEventListener('lesson-ready', () => {
                            this.restore(data);
                        }, { once: true });
                    } catch (e) {
                        console.error('[StateManager] Corrupt save file');
                    }
                }
            }
        },

        /**
         * Helper to grab state from all active/past modules
         * Note: This is tricky because inactive modules might have been destroyed.
         *Ideally, CourseCore should maintain a "Journal" of past module states.
         */
        _captureModuleStates: function () {
            // Placeholder: currently we can only easily capture the ACTIVE module.
            // A persistent history system would be needed for full restoration.
            const states = {};
            if (window.LessonRunner && window.LessonRunner.activeModule) {
                const m = window.LessonRunner.activeModule;
                // Verify it has getState ability
                if (m.getState) {
                    states[m._getName()] = m.getState();
                }
            }
            return states;
        },

        /**
         * Called by a module when it initializes to check if there is pending state for it
         */
        getPendingState: function (moduleId) {
            if (this._pendingModuleStates && this._pendingModuleStates[moduleId]) {
                return this._pendingModuleStates[moduleId];
            }
            return null;
        }
    };

})();
