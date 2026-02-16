/**
 * Scenario-Based Method
 * Branching narrative teaching method implementation
 */

(function () {
    'use strict';

    if (typeof createTeachingMethod === 'undefined') {
        console.error('Core dependency "method-base.js" missing.');
        return;
    }

    const ScenarioBasedFactory = function () {
        return createTeachingMethod('scenario-based', {

            // ---------- Private State ----------
            sceneData: [],
            currentSceneId: null,
            choiceHistory: [],
            moduleTitle: '',

            // ---------- Lifecycle Hooks ----------

            onInit: function (container, options) {
                console.log('[ScenarioBased] onInit for container:', container ? container.id : 'missing');
                console.log('[ScenarioBased] options keys:', Object.keys(options || {}));

                // 0. Robust scene data loading
                this.sceneData = options.scenes || (options.content && options.content.scenes) || [];
                this.moduleTitle = options.title || (options.content && options.content.title) || '';

                // Fallback for array-only options
                if (this.sceneData.length === 0 && Array.isArray(options)) {
                    this.sceneData = options;
                }

                console.log('[ScenarioBased] sceneData count:', this.sceneData.length);
                this.currentSceneId = this.sceneData.length > 0 ? this.sceneData[0].id : null;
                console.log('[ScenarioBased] currentSceneId:', this.currentSceneId);

                this.choiceHistory = [];
                this.setTotalSteps(this.sceneData.length);

                if (this.currentSceneId) {
                    this._renderScene(this.currentSceneId);
                } else {
                    console.warn('[ScenarioBased] NO SCENES LOADED');
                    container.innerHTML = `
                        <div class="error" style="color:#ff5555; background:rgba(0,0,0,0.5); padding:2rem; border:1px solid #ff5555; border-radius:8px;">
                            <h3>Scenario Error</h3>
                            <p>No scenes found in the manifest for this module.</p>
                            <p style="font-size:0.8rem; opacity:0.7;">Module ID: ${options.id || 'unknown'}</p>
                        </div>
                    `;
                }

                // Attach click handler
                this._boundClickHandler = this._handleClick.bind(this);
                container.addEventListener('click', this._boundClickHandler);

                if (options.restore) {
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
                this.choiceHistory = [];
                if (this.sceneData.length > 0) {
                    this._renderScene(this.sceneData[0].id);
                }
            },

            // ---------- State Tracking ----------

            getCustomState: function () {
                return {
                    currentSceneId: this.currentSceneId,
                    choiceHistory: this.choiceHistory
                };
            },

            setCustomState: function (savedState) {
                this.choiceHistory = savedState.choiceHistory || [];
                this.currentSceneId = savedState.currentSceneId || (this.sceneData.length > 0 ? this.sceneData[0].id : null);
                if (this.currentSceneId) {
                    this._renderScene(this.currentSceneId);
                }
            },

            // ---------- Rendering ----------

            _renderScene: function (sceneId) {
                console.log('[ScenarioBased] Rendering scene:', sceneId);

                const scene = this.sceneData.find(s => s.id === sceneId);
                if (!scene) {
                    console.error('[ScenarioBased] Scene not found:', sceneId);
                    return;
                }

                const container = this._getState().container;

                // Build HTML
                let html = `<div class="scenario-scene active" data-scene-id="${scene.id}">`;

                if (this.moduleTitle) {
                    html += `<h1 class="module-title">${this.moduleTitle}</h1>`;
                }

                html += `<div class="scene-content">`;

                // Media
                if (scene.media) {
                    html += this._generateMediaHTML(scene.media);
                }

                // Narrative
                html += `<div class="scenario-narrative">${scene.narrative || ''}</div>`;

                // Choices
                if (scene.choices && scene.choices.length > 0) {
                    html += `<div class="scenario-choices">`;
                    scene.choices.forEach(choice => {
                        const nextSceneAttr = choice.outcome ? `data-next-scene="${choice.outcome}"` : '';
                        html += `
                            <div class="choice-option" data-choice-id="${choice.id}" ${nextSceneAttr}>
                                <div class="choice-text"><strong>${choice.label}</strong></div>
                            </div>
                        `;
                    });
                    html += `</div>`;
                }

                html += `</div>`; // scene-content
                html += `</div>`; // scenario-scene

                container.innerHTML = html;
                this.currentSceneId = sceneId;

                // Terminal Scene Continue Button
                if (!scene.choices || scene.choices.length === 0) {
                    const contentEl = container.querySelector('.scene-content');
                    const continueBtn = document.createElement('button');
                    continueBtn.className = 'scene-continue visible';
                    continueBtn.textContent = 'Continue';
                    continueBtn.style.marginTop = '2rem';
                    continueBtn.addEventListener('click', (e) => {
                        e.target.disabled = true;
                        e.target.textContent = 'Loading...';
                        this.markComplete();
                    });
                    contentEl.appendChild(continueBtn);
                }
            },

            _generateMediaHTML: function (media) {
                if (!media) return '';
                const pos = media.position ? `media-${media.position}` : 'media-inline';
                let content = '';
                if (media.type === 'image') {
                    content = `<img src="${media.src}" alt="${media.alt || ''}" class="sim-media-image">`;
                } else if (media.type === 'video') {
                    const attrs = media.autoplay !== false ? 'autoplay loop muted playsinline' : 'controls';
                    content = `<video src="${media.src}" ${attrs} class="sim-media-video"></video>`;
                } else if (media.type === 'youtube') {
                    let src = media.src;
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                    const match = src.match(regExp);
                    if (match && match[2].length === 11) {
                        src = `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&controls=0&loop=1`;
                    }
                    content = `<iframe class="sim-media-video" src="${src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                } else if (media.type === 'threejs') {
                    content = `<div class="threejs-canvas" data-engine="${media.engine}"></div>`;
                }
                return `<div class="media-container ${pos}">${content}</div>`;
            },

            // ---------- Interaction ----------

            _handleClick: function (event) {
                const choiceEl = event.target.closest('.choice-option');
                if (choiceEl && !choiceEl.classList.contains('disabled')) {
                    event.preventDefault();

                    const nextSceneId = choiceEl.dataset.nextScene;
                    console.log('[ScenarioBased] Choice selected, next:', nextSceneId);

                    // Visual feedback
                    const allChoices = choiceEl.closest('.scenario-scene').querySelectorAll('.choice-option');
                    allChoices.forEach(c => c.classList.add('disabled'));
                    choiceEl.classList.add('selected');

                    if (nextSceneId) {
                        // Support transition keywords
                        if (nextSceneId === 'flow_next_module' || nextSceneId === 'complete') {
                            console.log('[ScenarioBased] Completing module via keyword');
                            this.markComplete();
                            return;
                        }

                        // Navigate to next scene
                        setTimeout(() => {
                            this._renderScene(nextSceneId);
                            this.advanceStep();
                        }, 400);
                    }
                }
            }
        });
    };

    // Export
    window.ScenarioBasedFactory = ScenarioBasedFactory;
    if (window.MethodLoader) {
        window.MethodLoader.registerFactory('scenario-based', ScenarioBasedFactory);
    }
})();
