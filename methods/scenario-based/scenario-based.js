/**
 * Scenario-Based Method
 * Branching narrative teaching method implementation
 * 
 * Factory Pattern Refactor
 * 
 * Usage:
 *   const factory = window.ScenarioBasedFactory;
 *   const instance = factory();
 *   instance.init('.scenario-container');
 */

(function () {
    'use strict';

    console.log('[ScenarioBased] Script loading...');
    console.log('[ScenarioBased] createTeachingMethod exists:', typeof createTeachingMethod !== 'undefined');

    if (typeof createTeachingMethod === 'undefined') {
        console.error('Core dependency "method-base.js" missing.');
        return;
    }

    const ScenarioBasedFactory = function () {
        return createTeachingMethod('scenario-based', {

            // ---------- Private State ----------
            scenes: [],
            currentSceneIndex: 0,
            choiceHistory: [],

            // ---------- Lifecycle Hooks ----------

            onInit: function (container, options) {
                console.log('[ScenarioBased] onInit called with options:', options);

                // Store scene data from manifest (it's at options.scenes, not options.content.scenes)
                this.sceneData = options.scenes || [];
                this.currentSceneId = this.sceneData.length > 0 ? this.sceneData[0].id : null;
                this.choiceHistory = [];

                console.log('[ScenarioBased] Loaded', this.sceneData.length, 'scenes');
                console.log('[ScenarioBased] First scene ID:', this.currentSceneId);

                // Set total steps
                this.setTotalSteps(this.sceneData.length);

                // Render first scene
                if (this.currentSceneId) {
                    this._renderScene(this.currentSceneId);
                }

                // Attach click handler
                this._boundClickHandler = this._handleClick.bind(this);
                container.addEventListener('click', this._boundClickHandler);

                // CHECK FOR RESTORE FLAG
                if (options.restore) {
                    console.log('[ScenarioBased] Restoring state: Resetting to start.');
                    this.onReset();
                }
            },

            onDestroy: function () {
                const state = this._getState();
                if (state.container) {
                    state.container.removeEventListener('click', this._boundClickHandler);
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
                // SCOPED: look within container only
                const container = this._getState().container;
                let nextScene = null;
                if (lastChoice) {
                    nextScene = container.querySelector(
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

            _renderScene: function (sceneId) {
                console.log('[ScenarioBased] Rendering scene:', sceneId);

                const scene = this.sceneData.find(s => s.id === sceneId);
                if (!scene) {
                    console.error('[ScenarioBased] Scene not found:', sceneId);
                    return;
                }

                const container = this._getState().container;

                // Build scene HTML
                let html = `<div class="scenario-scene active" data-scene-id="${scene.id}">`;
                html += `<div class="scenario-narrative">${scene.narrative || ''}</div>`;

                // Add choices if they exist
                if (scene.choices && scene.choices.length > 0) {
                    html += `<div class="scenario-choices">`;
                    scene.choices.forEach(choice => {
                        console.log('[ScenarioBased] Rendering choice:', choice);
                        const nextSceneAttr = choice.outcome ? `data-next-scene="${choice.outcome}"` : '';
                        html += `
                            <div class="choice-option" data-choice-id="${choice.id}" ${nextSceneAttr}>
                                <div class="choice-text"><strong>${choice.label}</strong></div>
                            </div>
                        `;
                    });
                    html += `</div>`;
                }

                html += `</div>`;

                // Replace container content
                container.innerHTML = html;

                this.currentSceneId = sceneId;

                // If this is the final scene (no choices), add a continue button
                if (!scene.choices || scene.choices.length === 0) {
                    console.log('[ScenarioBased] Final scene reached, adding continue button');
                    const sceneEl = container.querySelector('.scenario-scene');
                    const continueBtn = document.createElement('button');
                    continueBtn.className = 'scene-continue visible';
                    continueBtn.textContent = 'Continue';
                    continueBtn.addEventListener('click', (e) => {
                        e.target.disabled = true;
                        e.target.textContent = 'Loading...';
                        this.markComplete();
                    });
                    sceneEl.appendChild(continueBtn);
                }
            },

            _handleClick: function (event) {
                // Handle choice clicks
                const choiceEl = event.target.closest('.choice-option');
                if (choiceEl && !choiceEl.classList.contains('disabled')) {
                    event.preventDefault();

                    const nextSceneId = choiceEl.dataset.nextScene;
                    console.log('[ScenarioBased] Choice clicked, next scene:', nextSceneId);

                    // Disable all choices
                    const allChoices = choiceEl.closest('.scenario-scene').querySelectorAll('.choice-option');
                    allChoices.forEach(c => c.classList.add('disabled'));
                    choiceEl.classList.add('selected');

                    if (nextSceneId) {
                        // Check for completion keyword
                        if (nextSceneId === 'flow_next_module' || nextSceneId === 'complete') {
                            console.log('[ScenarioBased] Completion keyword encountered:', nextSceneId);
                            this._showSummary(); // Or just markComplete
                            return;
                        }

                        // Navigate to the next scene
                        setTimeout(() => {
                            this._renderScene(nextSceneId);
                        }, 300);
                    }
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
                const container = this._getState().container;
                // Look for summary section
                const summary = container.querySelector('.scenario-summary');
                if (summary) {
                    summary.classList.add('active');

                    // Populate with choice history
                    const choicesList = summary.querySelector('.summary-choices');
                    if (choicesList) {
                        choicesList.innerHTML = this.choiceHistory.map(choice => `
                            < div class="summary-choice" >
                                <span class="icon">✓</span>
                                <span>${choice.choiceText}</span>
                            </div >
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
    };

    // Export Factory
    console.log('[ScenarioBased] Registering factory...');
    console.log('[ScenarioBased] window.MethodLoader exists:', !!window.MethodLoader);

    // Always set window property for LessonRunner's MethodRegistry
    window.ScenarioBasedFactory = ScenarioBasedFactory;
    console.log('[ScenarioBased] Set window.ScenarioBasedFactory');

    // Also register with MethodLoader if available
    if (window.MethodLoader) {
        window.MethodLoader.registerFactory('scenario-based', ScenarioBasedFactory);
        console.log('[ScenarioBased] Registered with MethodLoader');
    }

})();
