/**
 * Gamified Exploration Method
 * Acts as the controller for specific game modules (e.g., Timeline Zoom).
 *
 * Factory Pattern Refactor
 * 
 * Usage:
 *   const factory = window.GamifiedExplorationFactory;
 *   const instance = factory();
 *   instance.init('.game-container', { module: TimelineZoom });
 */

(function () {
    'use strict';

    if (typeof createTeachingMethod === 'undefined') {
        console.error('Core dependency "method-base.js" missing.');
        return;
    }

    const GamifiedExplorationFactory = function () {
        return createTeachingMethod('gamified-exploration', {
            // ========== LIFECYCLE ==========

            onInit: function (container, options = {}) {
                // Private state
                this._state = {
                    debug: options.debug || false,
                    totalItems: 0,
                    gameModule: options.module || null, // The specific game logic (e.g. TimelineZoom)
                    collectedIds: new Set(),
                    isComplete: false,
                    hudEl: null
                };

                // 1. Validate Module
                // If module is string (from JSON), lookup in registry
                if (!this._state.gameModule && options.gameType && window.GameModules) {
                    this._state.gameModule = window.GameModules[options.gameType];
                }

                if (!this._state.gameModule) {
                    console.error("[GamifiedExploration] No game module provided!");
                    // Try to provide a fallback or visual error
                    container.innerHTML = `<div class="error">Error: Game Module '${options.gameType}' not found.</div>`;
                    return;
                }

                // 2. Setup Data
                // Support multiple data formats: options.data (legacy), options.config (manifest), or options itself
                const gameData = options.data || options.config || options;
                this._state.totalItems = this._countItems(gameData);
                // Store full item data for retrieval later
                this._state.itemsMap = new Map();
                if (gameData.items && Array.isArray(gameData.items)) {
                    gameData.items.forEach(item => this._state.itemsMap.set(item.id, item));
                }

                if (this._state.debug) {
                    console.log(`[GE] Init. Module: ${this._state.gameModule.name}. Items: ${this._state.totalItems}`);
                }

                // 3. Render Shared UI (HUD)
                // Note: We render into the container, not body, for composition safety
                this._renderHUD(container);

                // 4. Init Module
                // We pass 'this' as the engine/context so module can call collectItem
                this._state.gameModule.init(this, gameData, container);

                // 5. Connect to CourseCore if needed
                if (typeof CourseCore !== 'undefined') {
                    CourseCore.setTotalSteps(this._state.totalItems);
                }

                // DEFENSIVE: Ensure hasCollected is bound
                // (Note: With Factory pattern, methods are on the proto/mixin, but `hasCollected` was a custom addition)
                // We should add hasCollected to the object definition below instead of binding here, but keeping logic consistent.
                if (typeof this.hasCollected !== 'function') {
                    this.hasCollected = (itemId) => this._state.collectedIds.has(itemId);
                }
            },

            onDestroy: function () {
                // Cleanup module
                if (this._state.gameModule && this._state.gameModule.destroy) {
                    this._state.gameModule.destroy();
                }
                // Cleanup DOM is handled by container removal usually, but we should be clean
                if (this._state.hudEl) {
                    this._state.hudEl.remove();
                }
            },

            onReset: function () {
                this._state.collectedIds.clear();
                this._state.isComplete = false;

                // Reset HUD
                this._updateHUD();

                // Reset Module
                if (this._state.gameModule && this._state.gameModule.reset) {
                    this._state.gameModule.reset();
                }
            },

            // ========== CORE LOGIC ==========

            collectItem: function (itemId) {
                if (this._state.collectedIds.has(itemId)) return;

                this._state.collectedIds.add(itemId);

                // UI visual
                this._updateHUD();

                // Sync to Global UI (Sidebar)
                if (window.LessonUI && this._state.itemsMap.has(itemId)) {
                    window.LessonUI.addArtifact(itemId, this._state.itemsMap.get(itemId));
                }

                // Progress Logic
                this.advanceStep(); // Updates base method progress

                // Notify Module
                if (this._state.gameModule.onItemCollected) {
                    this._state.gameModule.onItemCollected(itemId);
                }

                // Check Complete
                if (this._state.collectedIds.size >= this._state.totalItems) {
                    this._completeGame();
                }
            },

            hasCollected: function (itemId) {
                return this._state.collectedIds.has(itemId);
            },

            _countItems: function (data) {
                if (this._state.gameModule.countItems) {
                    return this._state.gameModule.countItems(data);
                }
                return (data.items || []).length;
            },

            _completeGame: function () {
                if (this._state.isComplete) return;
                this._state.isComplete = true;

                // Show internal completion modal
                this._showCompletionModal();

                // Notify Module
                if (this._state.gameModule.onComplete) {
                    this._state.gameModule.onComplete();
                }

                // Mark base method complete
                this.markComplete();
            },

            // ========== UI ==========

            _renderHUD: function (container) {
                const hud = document.createElement('div');
                hud.className = 'ge-hud';
                // Ensure absolute positioning makes sense if container is relative
                // The CSS might need 'position: absolute' and container 'position: relative'

                hud.innerHTML = `
                    <div class="ge-hud-label">ARCHIVE</div>
                    <div class="ge-hud-slots"></div>
                    <div class="ge-hud-progress">
                        <span class="ge-count">0</span>/<span class="ge-total">${this._state.totalItems}</span>
                    </div>
                `;

                container.appendChild(hud);
                this._state.hudEl = hud;
                this._updateHUD();
            },

            _updateHUD: function () {
                if (!this._state.hudEl) return;

                const slotsContainer = this._state.hudEl.querySelector('.ge-hud-slots');
                const countEl = this._state.hudEl.querySelector('.ge-count');

                countEl.textContent = this._state.collectedIds.size;

                // Render slots
                slotsContainer.innerHTML = '';
                for (let i = 0; i < this._state.totalItems; i++) {
                    const slot = document.createElement('div');
                    const isFilled = i < this._state.collectedIds.size;
                    slot.className = `ge-hud-slot ${isFilled ? 'filled' : ''}`;
                    if (isFilled) slot.innerHTML = '✓';
                    slotsContainer.appendChild(slot);
                }
            },

            _showCompletionModal: function () {
                // Append to container, so it covers just the method area
                const container = this._getState().container;

                const modal = document.createElement('div');
                modal.className = 'ge-modal-overlay active';
                modal.innerHTML = `
                    <div class="ge-modal">
                        <div style="font-size: 3rem;">🎉</div>
                        <h2>Mission Accomplished</h2>
                        <p>You have recovered all missing artifacts.</p>
                    </div>
                `;

                // Fade out after 3s or strictly manual?
                // For composition, we might want to emit 'complete' and let the lesson controller handle navigation
                // instead of a button "Complete Lesson".
                // Let's add a small delay then emit.

                container.appendChild(modal);
            }
        });
    };

    /**
     * Factory Creation
     */
    if (window.MethodLoader) {
        window.MethodLoader.registerFactory('gamified-exploration', GamifiedExplorationFactory);
    } else {
        window.GamifiedExplorationFactory = GamifiedExplorationFactory;
    }

})();
