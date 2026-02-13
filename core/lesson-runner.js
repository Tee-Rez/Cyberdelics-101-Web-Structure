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
    // Using getters to avoid timing issues with script loading
    const MethodRegistry = {
        get 'progressive-disclosure'() { return window.ProgressiveDisclosureFactory; },
        get 'interactive-simulation'() { return window.InteractiveSimulationFactory; },
        get 'scenario-based'() { return window.ScenarioBasedFactory; },
        get 'knowledge-construction'() { return window.KnowledgeConstructionFactory; },
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

            // Render Opening Screen before starting modules
            this._showOpeningScreen(manifest.title, () => {
                // Initialize UI (Cyberdeck Hull) AFTER Opening Screen
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

                // SIGNAL READY TO START
                // This gives StateManager a chance to intercept and call jumpTo() if restoring
                const event = new CustomEvent('lesson-ready', { detail: { runner: this } });
                window.dispatchEvent(event);

                // If StateManager didn't trigger a jump within the event loop, default to start
                setTimeout(() => {
                    if (this.activeModuleIndex === -1) {
                        console.log('[LessonRunner] No restore detected, starting fresh.');
                        this.nextModule();
                    }
                }, 100);
            });
        }

        /**
         * Render the Full Screen Prompt / Opening Title
         */
        _showOpeningScreen(title, onStart) {
            this.container.innerHTML = '';
            const screen = document.createElement('div');
            screen.className = 'opening-screen';
            screen.innerHTML = `
                <div class="opening-content">
                    <h1>${title || 'Cyberdelics 101'}</h1>
                    <p class="opening-subtitle">This class works best within full screen mode.</p>
                    <div class="opening-action">
                        <button class="opening-fs-btn" title="Enter Full Screen">⛶</button>
                        <div class="opening-pulse"></div>
                    </div>
                    <p class="opening-hint">Click the icon to begin</p>
                </div>
            `;
            this.container.appendChild(screen);

            const btn = screen.querySelector('.opening-fs-btn');
            btn.addEventListener('click', () => {
                // Just start the lesson without forcing fullscreen
                // User can toggle it manually via the header button

                // Fade out
                screen.classList.add('fade-out');
                setTimeout(() => {
                    screen.remove();
                    onStart();
                }, 800); // Wait for transition
            });
        }

        /**
         * Advance to the next module in the manifest
         */
        nextModule() {
            if (this.isTransitioning) {
                console.log('[LessonRunner] nextModule ignored (transitioning)');
                return;
            }
            this.isTransitioning = true;

            // Release lock after a short delay
            setTimeout(() => {
                this.isTransitioning = false;
            }, 1000);

            console.log('[LessonRunner] nextModule called. Current Index:', this.activeModuleIndex);
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
            console.log(`[LessonRunner] Loading module ${this.activeModuleIndex}:`, moduleConfig.id, moduleConfig.title);
            this._runModule(moduleConfig);
        }

        /**
         * Go back to the previous module
         */
        prevModule() {
            if (this.isTransitioning) return;
            if (this.activeModuleIndex <= 0) return;

            this.isTransitioning = true;
            setTimeout(() => { this.isTransitioning = false; }, 1000);

            console.log('[LessonRunner] prevModule called. Current Index:', this.activeModuleIndex);

            // Cleanup
            if (this.activeModule && this.activeModule.destroy) {
                this.activeModule.destroy();
            }

            this.activeModuleIndex--;
            const moduleConfig = this.currentLesson.modules[this.activeModuleIndex];

            // RUN WITH RESTORE FLAG
            this._runModule(moduleConfig, { restore: true });
        }

        /**
         * Jump to a specific module index (Used for state restoration)
         * @param {number} index 
         */
        jumpTo(index) {
            if (!this.currentLesson || index < 0 || index >= this.currentLesson.modules.length) {
                console.warn(`[LessonRunner] Cannot jump to index ${index}`);
                return;
            }

            console.log(`[LessonRunner] Jumping to module index: ${index}`);

            // Cleanup previous
            if (this.activeModule && this.activeModule.destroy) {
                this.activeModule.destroy();
            }

            this.activeModuleIndex = index;
            const moduleConfig = this.currentLesson.modules[this.activeModuleIndex];
            this._runModule(moduleConfig);
        }

        /**
         * Instantiate and Run a specific Module
         */
        /**
         * Instantiate and Run a specific Module
         * @param {Object} moduleConfig 
         * @param {Object} [runtimeOptions] - Extra options like { restore: true }
         */
        _runModule(moduleConfig, runtimeOptions = {}) {
            const type = moduleConfig.type;

            // UPDATE UI BACK BUTTON VISIBILITY
            if (window.LessonUI && window.LessonUI.setBackAction) {
                if (this.activeModuleIndex > 0) {
                    window.LessonUI.setBackAction(() => this.prevModule());
                } else {
                    window.LessonUI.setBackAction(null); // Hide on first module
                }
            }

            const factory = MethodRegistry[type] || window[this._toPascalCase(type) + 'Factory'];

            if (!factory) {
                console.error(`[LessonRunner] Unknown Method Type: ${type}`);
                this.container.innerHTML = `<div class="error">Error: Unknown Module ${type}</div>`;
                return;
            }

            // 0. Cleanup Previous
            if (window.ArtifactSystem) {
                window.ArtifactSystem.unmount();
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
                let html = `<h1 class="module-title">${moduleConfig.title || ''}</h1>`;
                html += '<div class="step-counter"></div>';
                if (moduleConfig.content.sections) {
                    moduleConfig.content.sections.forEach((sec, idx) => {
                        const isFirst = idx === 0 ? 'active' : '';

                        // Parse layout: 'left' | 'right' | 'full' (default)
                        const layout = sec.mediaLayout || 'full';
                        const layoutClass = `pd-layout-${layout}`;

                        // Generate Media HTML (if any)
                        // Note: _generateMediaHTML returns a div with class 'media-container'
                        // We might need to wrap it in 'pd-media-container' for specific styling or reuse existing
                        let mediaHTML = this._generateMediaHTML(sec.media);

                        // Adjust class for PD specific styling if needed, or rely on existing
                        // The CSS expects .pd-media-container. Let's start with a replace or wrap.
                        if (mediaHTML) {
                            mediaHTML = mediaHTML.replace('media-container', 'pd-media-container');
                        }

                        let contentHTML = '';

                        // Structure based on Layout
                        if (layout === 'full') {
                            // Stacked: Title -> Media -> Content
                            contentHTML = `
                                ${sec.title ? `<h2 class="section-title">${sec.title}</h2>` : ''}
                                ${mediaHTML}
                                <div class="pd-text-content section-content">${sec.content}</div>
                            `;
                        } else {
                            // Split: Title -> Flex Wrapper (Media + Content)
                            // Note: CSS uses flex-direction:row-reverse for 'right' layout
                            contentHTML = `
                                ${sec.title ? `<h2 class="section-title">${sec.title}</h2>` : ''}
                                <div class="pd-flex-wrapper">
                                    ${mediaHTML}
                                    <div class="pd-text-content section-content">${sec.content}</div>
                                </div>
                            `;
                        }

                        html += `
                            <div class="reveal-section ${isFirst} ${layoutClass}" id="${sec.id || 'sec-' + idx}">
                                ${contentHTML}
                                ${idx < moduleConfig.content.sections.length - 1 ? `<button class="reveal-trigger">${sec.triggerLabel || 'Next'}</button>` : ''}
                            </div>
                        `;
                    });
                }
                // Add default completion section if not present
                html += `
                    <div class="reveal-section lesson-complete">
                        <h2>Section Complete</h2>
                        <button class="btn-primary btn-continue">CONTINUE ▶</button>
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
            } else if (moduleConfig.content && type === 'scenario-based') {
                // Auto-generate scenes from content.scenes
                const c = moduleConfig.content;
                let scenesHTML = `<h1 class="module-title">${moduleConfig.title || ''}</h1>`;
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
            } else if (type === 'interactive-simulation') {
                // Sim factory needs viewport and controls
                const showContinue = !moduleConfig.hideContinueButton;
                moduleContainer.innerHTML = `
                    <div class="interactive-simulation-container" style="display: flex; flex-direction: column; height: 100%;">
                        <div class="sim-header" style="flex: 0 0 auto; padding-bottom: 0.5rem;">
                            <h3>${moduleConfig.title || ''}</h3>
                        </div>
                        <div class="sim-viewport" style="flex: 1; border: 1px solid #333; position: relative; overflow: hidden;"></div>
                        <div class="sim-controls" style="flex: 0 0 auto;"></div>
                        <button class="btn-continue" style="margin-top: 1rem; ${showContinue ? '' : 'display:none;'}">Continue</button>
                    </div>
                `;
            }

            // 3. Instantiate
            const instance = factory();

            // Merge config and content for options (some factories look for items in options)
            // Also merge runtimeOptions (like restore: true)
            const options = { ...moduleConfig.config, ...moduleConfig.content, ...runtimeOptions };

            // Special case for Knowledge Construction items which might be in content.items
            if (type === 'knowledge-construction' && moduleConfig.content && moduleConfig.content.items) {
                options.items = moduleConfig.content.items;
            }

            instance.init(moduleContainer, options);

            // 3b. Handle onEnter Actions
            if (moduleConfig.onEnter && window.LessonUI) {
                if (moduleConfig.onEnter.action === 'openBottomSidebar') {
                    // Slight delay to ensure UI is ready
                    setTimeout(() => window.LessonUI.toggleBottomPanel(true), 500);
                }
            }

            // 4. Mount Artifacts (if any)
            // Combine module-level artifacts with any specific to the config
            let combinedArtifacts = [];
            if (moduleConfig.artifacts) {
                combinedArtifacts = combinedArtifacts.concat(moduleConfig.artifacts);
            }
            // Some method configs might have nested artifacts (e.g. simulation nodes acting as artifacts)
            if (moduleConfig.config && moduleConfig.config.artifacts) {
                combinedArtifacts = combinedArtifacts.concat(moduleConfig.config.artifacts);
            }

            if (window.ArtifactSystem && combinedArtifacts.length > 0) {
                window.ArtifactSystem.mount(moduleContainer, combinedArtifacts);
            }

            // 5. Attach Listeners for Completion
            // Most methods emit 'complete' or we can listen for specific events
            instance.on('complete', () => {
                console.log(`[LessonRunner] Module ${moduleConfig.id} Complete`);

                // Check for artifacts to collect on completion
                if (moduleConfig.artifacts) {
                    moduleConfig.artifacts.forEach(art => {
                        if (art.trigger === 'step_complete' && window.ArtifactSystem) {
                            window.ArtifactSystem.collect(art);
                        }
                    });
                }

                // Auto-advance or wait for user?
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
            const container = window.LessonUI ? window.LessonUI.getContentContainer() : this.container;

            container.innerHTML = `
                <div class="lesson-complete-screen" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center;">
                    <h1 style="font-size:3rem; margin-bottom:1rem; color:var(--color-accent);">LESSON COMPLETE</h1>
                    <p style="font-size:1.2rem; margin-bottom:2rem; max-width:600px;">
                        You have finished: <br>
                        <strong style="color:white;">${this.currentLesson.title}</strong>
                    </p>
                    <div style="display:flex; justify-content:center;">
                        <button class="btn-primary" onclick="if(document.fullscreenElement) document.exitFullscreen(); location.reload();">RETURN ⮌</button>
                    </div>
                </div>
            `;

            // Ensure Back button is hidden or disabled in UI header
            if (window.LessonUI && window.LessonUI.setBackAction) {
                window.LessonUI.setBackAction(null);
            }

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
            } else if (media.type === 'youtube') {
                // Convert watch URL to embed if necessary, though Builder should ideally handle this.
                // Simple regex to extract ID if user pastes full link
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