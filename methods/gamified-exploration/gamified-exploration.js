/**
 * Gamified Exploration Engine
 * Acts as the controller for specific game modules (e.g., Timeline Zoom).
 * Handles:
 * - Global State (Inventory, Progress)
 * - HUD Rendering (Inventory Bar)
 * - CourseCore Integration (Completion)
 * - Shared UI (Completion Modals)
 */

window.GamifiedExploration = {
    // Configuration
    config: {
        debug: false,
        totalItems: 0,
        gameModule: null
    },

    // State
    state: {
        collectedIds: new Set(),
        isComplete: false
    },

    /**
     * Initialize the Engine and the specific Module
     * @param {Object} options - { module: Object, data: Object, debug: Boolean }
     */
    init: function (options = {}) {
        this.config.debug = options.debug || false;

        if (!options.module) {
            console.error("GamifiedExploration: No game module provided!");
            return;
        }

        this.config.gameModule = options.module;

        // Data usually comes from the module or options
        const gameData = options.data || {};

        // Calculate Total Items based on Data
        // The module must define 'items' or we calculate from data
        this.config.totalItems = this.countItems(gameData);

        if (this.config.debug) {
            console.log(`[GE Engine] Initialized. Module: ${this.config.gameModule.name}. Items: ${this.config.totalItems}`);
        }

        // Initialize the Module
        this.config.gameModule.init(this, gameData);

        // Render HUD
        this.renderHUD();

        // CourseCore Integration
        if (typeof CourseCore !== 'undefined') {
            CourseCore.log('GamifiedExploration Engine Ready');
        }
    },

    /**
     * Count items in the provided data.
     * Assumes a specific structure or delegates to module?
     * Let's assume the data has a flat list or nested 'items' arrays.
     * For Timeline: eras -> items.
     */
    countItems: function (data) {
        if (this.config.gameModule.countItems) {
            return this.config.gameModule.countItems(data);
        }
        // Fallback: expect strict 'items' array at root
        return (data.items || []).length;
    },

    /**
     * Called by Module when an item is collected
     */
    collectItem: function (itemId) {
        if (this.state.collectedIds.has(itemId)) return;

        this.state.collectedIds.add(itemId);

        if (this.config.debug) {
            console.log(`[GE Engine] Collected: ${itemId}`);
        }

        // Update HUD
        this.updateHUD();

        // Check Completion
        this.checkProgress();

        // Notify Module (for visual updates)
        if (this.config.gameModule.onItemCollected) {
            this.config.gameModule.onItemCollected(itemId);
        }
    },

    /**
     * Check progress and update CourseCore
     */
    checkProgress: function () {
        const count = this.state.collectedIds.size;
        const total = this.config.totalItems;
        const progress = count / total;

        // Send to CourseCore
        if (typeof CourseCore !== 'undefined') {
            CourseCore.updateProgress(progress);
        }

        if (count >= total && !this.state.isComplete) {
            this.completeGame();
        }
    },

    /**
     * Game Completed
     */
    completeGame: function () {
        this.state.isComplete = true;
        this.showCompletionModal();

        // Notify Module
        if (this.config.gameModule.onComplete) {
            this.config.gameModule.onComplete();
        }
    },

    /**
     * Finalize (called by user action in modal)
     */
    finishLesson: function () {
        if (typeof CourseCore !== 'undefined') {
            CourseCore.completeLesson();
        }
    },

    // --- HUD & UI ---

    renderHUD: function () {
        const hud = document.createElement('div');
        hud.className = 'ge-hud';
        hud.innerHTML = `
            <div class="ge-hud-label">ARCHIVE</div>
            <div class="ge-hud-slots" id="ge-slides"></div>
            <div class="ge-hud-progress">
                <span id="ge-count">0</span>/<span id="ge-total">${this.config.totalItems}</span>
            </div>
        `;
        document.body.appendChild(hud);

        // Create initial slots
        this.updateHUD();
    },

    updateHUD: function () {
        const slotsContainer = document.getElementById('ge-slides');
        const countEl = document.getElementById('ge-count');

        if (!slotsContainer) return; // Not ready

        countEl.textContent = this.state.collectedIds.size;

        // Re-render slots (simple approach)
        slotsContainer.innerHTML = '';
        for (let i = 0; i < this.config.totalItems; i++) {
            const slot = document.createElement('div');
            // Logic: if i < collectedCount, it's filled
            const isFilled = i < this.state.collectedIds.size;
            slot.className = `ge-hud-slot ${isFilled ? 'filled' : ''}`;
            if (isFilled) slot.innerHTML = '✓';
            slotsContainer.appendChild(slot);
        }
    },

    showCompletionModal: function () {
        const modal = document.createElement('div');
        modal.className = 'ge-modal-overlay active';
        modal.innerHTML = `
            <div class="ge-modal">
                <div style="font-size: 3rem;">🎉</div>
                <h2>Mission Accomplished</h2>
                <p>You have recovered all missing artifacts.</p>
                <button class="btn btn-primary" onclick="GamifiedExploration.finishLesson()">Complete Lesson</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
};
