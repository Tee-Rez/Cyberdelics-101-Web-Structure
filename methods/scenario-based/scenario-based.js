/**
 * Scenario-Based Method
 * Branching narrative teaching method implementation
 * 
 * Usage:
 *   // Via MethodLoader:
 *   MethodLoader.register('scenario-based', ScenarioBased);
 *   MethodLoader.initAll(document.body);
 * 
 *   // Direct:
 *   ScenarioBased.init('.scenario-container');
 */

const ScenarioBased = createTeachingMethod('scenario-based', {

    // ---------- Private State ----------
    scenes: [],
    currentSceneIndex: 0,
    choiceHistory: [],

    // ---------- Lifecycle Hooks ----------

    onInit: function (container, options) {
        // Find all scenes
        this.scenes = container.querySelectorAll('.scenario-scene');
        this.currentSceneIndex = 0;
        this.choiceHistory = [];

        // Set total steps (one per scene)
        this.setTotalSteps(this.scenes.length);

        // Show first scene
        if (this.scenes.length > 0) {
            this.scenes[0].classList.add('active');
        }

        // Attach click handler
        this._boundClickHandler = this._handleClick.bind(this);
        container.addEventListener('click', this._boundClickHandler);

        console.log('[ScenarioBased] Initialized with', this.scenes.length, 'scenes');
    },

    onDestroy: function () {
        const state = this._getState();
        if (state.container) {
            state.container.removeEventListener('click', this._handleClick);
        }
    },

    onReset: function () {
        // Hide all scenes except first
        this.scenes.forEach((scene, i) => {
            scene.classList.remove('active');

            // Reset choices in scene
            const choices = scene.querySelectorAll('.choice-option');
            choices.forEach(choice => {
                choice.classList.remove('selected', 'disabled');
            });

            // Hide outcomes
            const outcome = scene.querySelector('.scenario-outcome');
            if (outcome) outcome.classList.remove('visible');

            // Hide continue buttons
            const continueBtn = scene.querySelector('.scene-continue');
            if (continueBtn) continueBtn.classList.remove('visible');
        });

        // Show first scene
        if (this.scenes.length > 0) {
            this.scenes[0].classList.add('active');
        }

        this.currentSceneIndex = 0;
        this.choiceHistory = [];
    },

    // ---------- State Hooks ----------

    getCustomState: function () {
        return {
            currentSceneIndex: this.currentSceneIndex,
            choiceHistory: this.choiceHistory
        };
    },

    setCustomState: function (savedState) {
        this.choiceHistory = savedState.choiceHistory || [];
        // Restore to saved scene
        for (let i = 0; i <= savedState.currentSceneIndex; i++) {
            if (this.scenes[i]) {
                this.scenes[i].classList.add('active');
            }
        }
        this.currentSceneIndex = savedState.currentSceneIndex || 0;
    },

    // ---------- Method-Specific Functions ----------

    /**
     * Present a choice to the user (called automatically from HTML)
     */
    presentChoice: function (sceneEl) {
        // Choices are already in the HTML, just make them interactive
        const choices = sceneEl.querySelectorAll('.choice-option');
        choices.forEach(choice => {
            choice.classList.remove('disabled');
        });
    },

    /**
     * Handle user selecting an option
     */
    selectOption: function (choiceEl) {
        const scene = choiceEl.closest('.scenario-scene');
        const sceneId = scene.dataset.sceneId || `scene-${this.currentSceneIndex}`;
        const choiceId = choiceEl.dataset.choiceId;
        const choiceText = choiceEl.querySelector('.choice-text strong')?.textContent || choiceId;

        // Record choice
        this.choiceHistory.push({
            sceneId: sceneId,
            choiceId: choiceId,
            choiceText: choiceText,
            timestamp: Date.now()
        });

        // Visual feedback
        const allChoices = scene.querySelectorAll('.choice-option');
        allChoices.forEach(c => {
            c.classList.add('disabled');
            if (c === choiceEl) {
                c.classList.add('selected');
            }
        });

        // Show outcome if exists
        const outcomeId = choiceEl.dataset.outcome;
        if (outcomeId) {
            const outcome = scene.querySelector(`[data-outcome-id="${outcomeId}"]`);
            if (outcome) {
                outcome.classList.add('visible');
            }
        } else {
            // Show generic outcome
            const outcome = scene.querySelector('.scenario-outcome');
            if (outcome) {
                outcome.classList.add('visible');
            }
        }

        // Show continue button
        const continueBtn = scene.querySelector('.scene-continue');
        if (continueBtn) {
            setTimeout(() => {
                continueBtn.classList.add('visible');
            }, 500);
        }

        // Emit event
        this.emit('choiceMade', {
            sceneId: sceneId,
            choiceId: choiceId,
            choiceText: choiceText,
            history: this.choiceHistory
        });
    },

    /**
     * Get current branch/path based on choices
     */
    getBranch: function () {
        return this.choiceHistory.map(c => c.choiceId).join('-');
    },

    /**
     * Get all choices made so far
     */
    getChoiceHistory: function () {
        return [...this.choiceHistory];
    },

    /**
     * Advance to next scene
     */
    nextScene: function () {
        const nextIndex = this.currentSceneIndex + 1;

        if (nextIndex >= this.scenes.length) {
            // All scenes complete
            this._showSummary();
            return;
        }

        // Check for branching - next scene may depend on choice
        const currentScene = this.scenes[this.currentSceneIndex];
        const lastChoice = this.choiceHistory[this.choiceHistory.length - 1];

        // Look for branch-specific next scene
        let nextScene = null;
        if (lastChoice) {
            nextScene = document.querySelector(
                `.scenario-scene[data-branch="${lastChoice.choiceId}"]`
            );
        }

        // Default to next sequential scene
        if (!nextScene) {
            nextScene = this.scenes[nextIndex];
        }

        // Activate next scene
        nextScene.classList.add('active');
        this.currentSceneIndex = Array.from(this.scenes).indexOf(nextScene);

        // Advance progress
        this.advanceStep();

        // Scroll to new scene
        setTimeout(() => {
            nextScene.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        this.emit('sceneChanged', {
            sceneIndex: this.currentSceneIndex,
            scene: nextScene
        });
    },

    // ---------- Private Helpers ----------

    _handleClick: function (event) {
        // Handle choice clicks
        const choiceEl = event.target.closest('.choice-option');
        if (choiceEl && !choiceEl.classList.contains('disabled')) {
            event.preventDefault();
            this.selectOption(choiceEl);
            return;
        }

        // Handle continue clicks
        const continueEl = event.target.closest('.scene-continue');
        if (continueEl) {
            event.preventDefault();
            this.nextScene();
            return;
        }
    },

    _showSummary: function () {
        // Look for summary section
        const summary = document.querySelector('.scenario-summary');
        if (summary) {
            summary.classList.add('active');

            // Populate with choice history
            const choicesList = summary.querySelector('.summary-choices');
            if (choicesList) {
                choicesList.innerHTML = this.choiceHistory.map(choice => `
                    <div class="summary-choice">
                        <span class="icon">✓</span>
                        <span>${choice.choiceText}</span>
                    </div>
                `).join('');
            }
        }

        // Mark complete
        this.markComplete();

        // Enable lesson completion if CourseCore available
        if (typeof CourseCore !== 'undefined') {
            CourseCore.enableCompletion();
        }

        this.emit('scenarioComplete', {
            choiceHistory: this.choiceHistory,
            branch: this.getBranch()
        });
    }
});

// Legacy init wrapper
const _originalScenarioInit = ScenarioBased.init;
ScenarioBased.init = function (containerSelector, options) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            _originalScenarioInit.call(ScenarioBased, containerSelector, options);
        });
    } else {
        _originalScenarioInit.call(ScenarioBased, containerSelector, options);
    }
};
