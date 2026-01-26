/**
 * CYBERDELICS 101 - Lesson Runner
 * 
 * The central engine for orchestrating manifest-based lessons.
 * Responsible for:
 * 1. Loading Lesson Manifests (JSON)
 * 2. Instantiating Method Factories
 * 3. Managing Transitions between Modules
 * 4. Handling Global Lesson State
 */

(function () {
    'use strict';

    // Registry of available method factories (populated by MethodLoader or manually)
    const MethodRegistry = {
        'progressive-disclosure': window.ProgressiveDisclosureFactory,
        'interactive-simulation': window.InteractiveSimulationFactory,
        'scenario-based': window.ScenarioBasedFactory,
        'gamified-exploration': window.GamifiedExplorationFactory,
        'knowledge-construction': window.KnowledgeConstructionFactory,
        'choose-your-path': window.ChooseYourPathFactory
    };

    class LessonRunner {
        constructor() {
            this.currentLesson = null;
            this.activeModule = null; // The Method Instance
            this.activeModuleIndex = -1;
            this.container = null;
        }

        /**
         * Initialize the Runner on a DOM Container
         * @param {HTMLElement|string} container 
         */
        init(container) {
            this.container = typeof container === 'string'
                ? document.querySelector(container)
                : container;

            if (!this.container) {
                console.error('[LessonRunner] Container not found');
            }
        }

        /**
         * Load a Lesson Manifest
         */
        loadLesson(manifest) {
            this.currentLesson = manifest;
            this.activeModuleIndex = -1;

            console.log(`[LessonRunner] Loading Lesson: ${manifest.title}`);

            // Apply Global Theme
            this._applyTheme(manifest.theme);

            // Initialize UI (Cyberdeck Hull)
            if (window.LessonUI) {
                console.log('[LessonRunner] Found LessonUI, initializing...');
                window.LessonUI.init(this.container);
                window.LessonUI.update(manifest.title, 0);

                // Register Artifacts if present
                if (manifest.artifacts && window.LessonUI.registerArtifacts) {
                    window.LessonUI.registerArtifacts(manifest.artifacts);
                }
            } else {
                console.warn('[LessonRunner] LessonUI NOT found, using fallback.');
                // Fallback if UI not loaded
                this.container.innerHTML = '';
            }

            // Start First Module
            this.nextModule();
        }

        /**
         * Advance to the next module in the manifest
         */
        nextModule() {
            if (!this.currentLesson) return;

            // Cleanup previous
            if (this.activeModule && this.activeModule.destroy) {
                this.activeModule.destroy();
            }

            this.activeModuleIndex++;

            if (this.activeModuleIndex >= this.currentLesson.modules.length) {
                this._finishLesson();
                return;
            }

            const moduleConfig = this.currentLesson.modules[this.activeModuleIndex];
            this._runModule(moduleConfig);
        }

        /**
         * Instantiate and Run a specific Module
         */
        _runModule(moduleConfig) {
            const type = moduleConfig.type;
            const factory = MethodRegistry[type] || window[this._toPascalCase(type) + 'Factory'];

            if (!factory) {
                console.error(`[LessonRunner] Unknown Method Type: ${type}`);
                this.container.innerHTML = `<div class="error">Error: Unknown Module ${type}</div>`;
                return;
            }

            // 1. Determine Target Container
            let targetContainer = this.container;
            if (window.LessonUI) {
                targetContainer = window.LessonUI.getContentContainer();
                // Update Progress on UI
                const progress = (this.activeModuleIndex) / (this.currentLesson.modules.length);
                window.LessonUI.update(null, progress);
            }

            // 1b. Create Container for this module
            targetContainer.innerHTML = ''; // Clear previous module content
            const moduleContainer = document.createElement('div');
            moduleContainer.className = `module-container module-${type}`;
            moduleContainer.id = moduleConfig.id;
            targetContainer.appendChild(moduleContainer);

            // 2. Inject Content (HTML) if provided in config
            // Many methods like Progressive Disclosure need their HTML structure first
            // 2. Inject Content (HTML)
            // If explicit HTML string is provided, use it.
            // If structured 'content' object is provided, try to generate HTML from it.
            if (moduleConfig.contentHTML) {
                moduleContainer.innerHTML = moduleConfig.contentHTML;
            } else if (moduleConfig.content && type === 'progressive-disclosure') {
                // Auto-generate HTML for Progressive Disclosure
                let html = '<div class="step-counter"></div>';
                if (moduleConfig.content.sections) {
                    moduleConfig.content.sections.forEach((sec, idx) => {
                        const isFirst = idx === 0 ? 'active' : '';
                        html += `
                            <div class="reveal-section ${isFirst}" id="${sec.id}">
                                ${this._generateMediaHTML(sec.media)}
                                <div class="section-content">${sec.content}</div>
                                ${idx < moduleConfig.content.sections.length - 1 ? '<button class="reveal-trigger">Next</button>' : ''}
                            </div>
                        `;
                    });
                }
                // Add default completion section if not present
                html += `
                    <div class="reveal-section lesson-complete">
                        <h2>Section Complete</h2>
                        <button class="reveal-trigger" onclick="/* handled by instance */">Continue</button>
                    </div>
                `;
                moduleContainer.innerHTML = html;
            } else if (moduleConfig.content && type === 'knowledge-construction') {
                // Auto-generate HTML for Knowledge Construction
                const c = moduleConfig.content;
                moduleContainer.innerHTML = `
                    <div class="knowledge-construction-container">
                        <h3>${moduleConfig.title}</h3>
                        <p>${c.instruction || ''}</p>
                        <div class="construction-zone">${c.template || ''}</div>
                        <div class="source-bank"></div>
                    </div>
                `;
                // Dictionary items are passed in config, not HTML, usually.
                // But the Factory.init takes options. We need to pass 'content' as options to init.
            } else if (moduleConfig.content && type === 'scenario-based') {
                // Auto-generate scenes from content.scenes
                const c = moduleConfig.content;
                let scenesHTML = '';
                if (c.scenes && Array.isArray(c.scenes)) {
                    c.scenes.forEach((scene, idx) => {
                        const isFirst = idx === 0 ? 'active' : '';
                        let choicesHTML = '';
                        if (scene.choices && scene.choices.length > 0) {
                            choicesHTML = '<div class="scenario-choices">';
                            scene.choices.forEach(choice => {
                                choicesHTML += `<button class="choice-option" data-choice-id="${choice.id}" data-next-scene="${choice.outcome}">${choice.label}</button>`;
                            });
                            choicesHTML += '</div>';
                            choicesHTML += '<button class="scene-continue" style="margin-top: 1rem;">Continue</button>';
                        } else {
                            // Terminal scene (no choices) - just show continue
                            choicesHTML = '<button class="scene-continue" style="margin-top: 1rem;">Continue</button>';
                        }

                        scenesHTML += `
                            <div class="scenario-scene ${isFirst}" id="scene-${scene.id}">
                                ${this._generateMediaHTML(scene.media)}
                                <div class="scenario-narrative">${scene.narrative || ''}</div>
                                ${choicesHTML}
                            </div>
                        `;
                    });
                }
                moduleContainer.innerHTML = `<div class="scenario-container">${scenesHTML}</div>`;
            } else if (moduleConfig.content && type === 'gamified-exploration') {
                // The Game factory usually builds its own UI.
                moduleContainer.innerHTML = `<div class="gamified-exploration-container"></div>`;
            } else if (moduleConfig.content && type === 'interactive-simulation') {
                // Sim factory needs viewport and controls
                moduleContainer.innerHTML = `
                    <div class="interactive-simulation-container">
                        <h3>${moduleConfig.title || ''}</h3>
                        <div class="sim-viewport"></div>
                        <div class="sim-controls"></div>
                        <button class="btn-continue" style="margin-top: 1rem;">Continue</button>
                    </div>
                `;
            }

            // 3. Instantiate
            const instance = factory();

            // Merge config and content for options (some factories look for items in options)
            const options = { ...moduleConfig.config, ...moduleConfig.content };

            // Special case for Knowledge Construction items which might be in content.items
            if (type === 'knowledge-construction' && moduleConfig.content && moduleConfig.content.items) {
                options.items = moduleConfig.content.items;
            }

            instance.init(moduleContainer, options);

            // 4. Attach Listeners for Completion
            // Most methods emit 'complete' or we can listen for specific events
            instance.on('complete', () => {
                console.log(`[LessonRunner] Module ${moduleConfig.id} Complete`);
                // Auto-advance or wait for user?
                // For now, let's wait a moment and advance
                setTimeout(() => this.nextModule(), 1250);
            });

            // 4b. Special handling for methods that don't auto-complete
            if (type === 'interactive-simulation') {
                const continueBtn = moduleContainer.querySelector('.btn-continue');
                if (continueBtn) {
                    continueBtn.addEventListener('click', () => {
                        instance.markComplete();
                    });
                }
            }

            // Store active
            this.activeModule = instance;
        }

        _finishLesson() {
            this.container.innerHTML = `
                <div class="lesson-complete-screen">
                    <h1>Lesson Complete</h1>
                    <p>You have finished: ${this.currentLesson.title}</p>
                    <button onclick="location.reload()">Restart</button>
                </div>
            `;
            console.log('[LessonRunner] Lesson Complete');
        }

        _applyTheme(theme) {
            if (!theme) return;
            const root = this.container;
            if (theme.primaryColor) root.style.setProperty('--primary-color', theme.primaryColor);
            if (theme.fontBody) root.style.setProperty('--font-body', theme.fontBody);
        }

        _generateMediaHTML(media) {
            if (!media) return '';

            const positionClass = media.position ? `media-${media.position}` : 'media-inline';
            const style = media.style ? `style="${media.style}"` : '';

            let content = '';
            if (media.type === 'image') {
                content = `<img src="${media.src}" alt="${media.alt || ''}" class="sim-media-image">`;
            } else if (media.type === 'video') {
                const autoplay = media.autoplay !== false ? 'autoplay loop muted playsinline' : 'controls';
                content = `<video src="${media.src}" ${autoplay} class="sim-media-video"></video>`;
            } else if (media.type === 'threejs') {
                content = `<div class="threejs-canvas" data-engine="${media.engine}"></div>`;
            }

            return `<div class="media-container ${positionClass}" ${style}>${content}</div>`;
        }

        // Helper: progressive-disclosure -> ProgressiveDisclosure
        _toPascalCase(str) {
            return str.replace(/(^|-)./g, x => x.slice(-1).toUpperCase());
        }
    }

    // Export Singleton Runner (The Engine itself is a singleton service)
    window.LessonRunner = new LessonRunner();

})();
