/**
 * CYBERDELICS 101 - Lesson Runner
 * 
 * The central engine for orchestrating manifest-based lessons.
 */

(function () {
    'use strict';

    const MethodRegistry = {
        get 'progressive-disclosure'() { return window.ProgressiveDisclosureFactory; },
        get 'interactive-simulation'() { return window.InteractiveSimulationFactory; },
        get 'scenario-based'() { return window.ScenarioBasedFactory; },
        get 'knowledge-construction'() { return window.KnowledgeConstructionFactory; },
        get 'option-selector'() { return window.OptionSelectorFactory; }
    };

    class LessonRunner {
        constructor() {
            this.currentLesson = null;
            this.activeModule = null;
            this.activeModuleIndex = -1;
            this.container = null;
            this.isTransitioning = false;
        }

        init(container) {
            this.container = typeof container === 'string'
                ? document.querySelector(container)
                : container;

            if (!this.container) {
                console.error('[LessonRunner] Container not found');
            }
        }

        loadLesson(manifest) {
            this.currentLesson = manifest;
            this.activeModuleIndex = -1;

            console.log(`[LessonRunner] Loading Lesson: ${manifest.title}`);
            this._applyTheme(manifest.theme);

            this._showOpeningScreen(manifest.title, () => {
                if (window.LessonUI) {
                    window.LessonUI.init(this.container);
                    window.LessonUI.update(manifest.title, 0);
                    if (manifest.artifacts && window.LessonUI.registerArtifacts) {
                        window.LessonUI.registerArtifacts(manifest.artifacts);
                    }
                }

                const event = new CustomEvent('lesson-ready', { detail: { runner: this } });
                window.dispatchEvent(event);

                setTimeout(() => {
                    if (this.activeModuleIndex === -1) {
                        this.nextModule();
                    }
                }, 100);
            });
        }

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
                screen.classList.add('fade-out');
                setTimeout(() => {
                    screen.remove();
                    onStart();
                }, 800);
            });
        }

        nextModule() {
            if (this.isTransitioning || !this.currentLesson) return;
            this.isTransitioning = true;
            setTimeout(() => { this.isTransitioning = false; }, 1000);

            if (this.activeModule && this.activeModule.destroy) {
                this.activeModule.destroy();
            }

            this.activeModuleIndex++;

            if (this.activeModuleIndex >= this.currentLesson.modules.length) {
                this._finishLesson();
                return;
            }

            const moduleConfig = this.currentLesson.modules[this.activeModuleIndex];
            console.log(`[LessonRunner] Loading module ${this.activeModuleIndex}:`, moduleConfig.id);
            this._runModule(moduleConfig);
        }

        prevModule() {
            if (this.isTransitioning || this.activeModuleIndex <= 0) return;
            this.isTransitioning = true;
            setTimeout(() => { this.isTransitioning = false; }, 1000);

            if (this.activeModule && this.activeModule.destroy) {
                this.activeModule.destroy();
            }

            this.activeModuleIndex--;
            this._runModule(this.currentLesson.modules[this.activeModuleIndex], { restore: true });
        }

        jumpTo(index) {
            if (!this.currentLesson || index < 0 || index >= this.currentLesson.modules.length) return;
            if (this.activeModule && this.activeModule.destroy) {
                this.activeModule.destroy();
            }
            this.activeModuleIndex = index;
            this._runModule(this.currentLesson.modules[this.activeModuleIndex]);
        }

        _runModule(moduleConfig, runtimeOptions = {}) {
            const type = moduleConfig.type;

            if (window.LessonUI && window.LessonUI.setBackAction) {
                window.LessonUI.setBackAction(this.activeModuleIndex > 0 ? () => this.prevModule() : null);
            }

            const factory = MethodRegistry[type] || window[this._toPascalCase(type) + 'Factory'];
            if (!factory) {
                console.error(`[LessonRunner] Unknown Method Type: ${type}`);
                return;
            }

            if (window.ArtifactSystem) window.ArtifactSystem.unmount();

            let targetContainer = this.container;
            if (window.LessonUI) {
                targetContainer = window.LessonUI.getContentContainer();
                const progress = (this.activeModuleIndex) / (this.currentLesson.modules.length);
                window.LessonUI.update(null, progress);
            }

            targetContainer.innerHTML = '';
            const moduleContainer = document.createElement('div');
            moduleContainer.className = `module-container module-${type}`;
            moduleContainer.id = moduleConfig.id;
            targetContainer.appendChild(moduleContainer);

            // Special HTML injection for Interactive Simulation (needs viewport/controls)
            if (type === 'interactive-simulation') {
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
            } else if (moduleConfig.contentHTML) {
                // Legacy / Direct HTML support
                moduleContainer.innerHTML = moduleConfig.contentHTML;
            }

            const instance = factory();

            // Pass the ENTIRE moduleConfig + runtimeOptions for maximum robustness
            const options = { ...moduleConfig, ...runtimeOptions };

            instance.init(moduleContainer, options);
            this.activeModule = instance;

            instance.on('complete', () => {
                console.log(`[LessonRunner] Module ${moduleConfig.id} Complete`);
                if (moduleConfig.artifacts && window.ArtifactSystem) {
                    moduleConfig.artifacts.forEach(art => {
                        if (art.trigger === 'step_complete') window.ArtifactSystem.collect(art);
                    });
                }
                setTimeout(() => this.nextModule(), 1250);
            });

            if (type === 'interactive-simulation') {
                const btn = moduleContainer.querySelector('.btn-continue');
                if (btn) btn.addEventListener('click', () => instance.markComplete());
            }

            if (moduleConfig.onEnter && window.LessonUI && moduleConfig.onEnter.action === 'openBottomSidebar') {
                setTimeout(() => window.LessonUI.toggleBottomPanel(true), 500);
            }

            const artifacts = (moduleConfig.artifacts || []).concat(moduleConfig.config?.artifacts || []);
            if (window.ArtifactSystem && artifacts.length > 0) {
                window.ArtifactSystem.mount(moduleContainer, artifacts);
            }
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
            if (window.LessonUI) window.LessonUI.setBackAction(null);
        }

        _applyTheme(theme) {
            if (!theme || !this.container) return;
            const root = this.container;
            if (theme.primaryColor) root.style.setProperty('--primary-color', theme.primaryColor);
            if (theme.fontBody) root.style.setProperty('--font-body', theme.fontBody);
        }

        _toPascalCase(str) {
            return str.replace(/(^|-)./g, x => x.slice(-1).toUpperCase());
        }
    }

    window.LessonRunner = new LessonRunner();
})();