/**
 * Progressive Disclosure Method
 * Click-to-reveal teaching method implementation
 * 
 * Factory Pattern Refactor
 * 
 * Usage:
 *   const factory = window.ProgressiveDisclosureFactory;
 *   const instance = factory();
 *   instance.init('.lesson-container');
 */

(function () {
    'use strict';

    if (typeof createTeachingMethod === 'undefined') {
        console.error('Core dependency "method-base.js" missing.');
        return;
    }

    const ProgressiveDisclosureFactory = function () {
        return createTeachingMethod('progressive-disclosure', {

            // ---------- Private State (method-specific) ----------
            sections: [],
            completionSection: null,

            // ---------- Lifecycle Hooks ----------

            onInit: function (container, options) {
                console.log('[ProgressiveDisclosure] onInit called with options:', options);

                // 0. Auto-render if content is provided but HTML is missing
                if (options.sections && container.querySelectorAll('.reveal-section').length === 0) {
                    this._render(container, options);
                }

                // Find all reveal sections (excluding completion)
                this.sections = container.querySelectorAll('.reveal-section:not(.lesson-complete)');
                this.completionSection = container.querySelector('.lesson-complete');

                // Set total steps for progress tracking
                this.setTotalSteps(this.sections.length);

                // ... rest of init ...
                if (typeof CourseCore !== 'undefined') {
                    CourseCore.setTotalSteps(this.sections.length);
                }

                // First section visible by default
                if (this.sections.length > 0) {
                    this.sections[0].classList.add('active');
                }

                this._updateStepCounter();

                container.addEventListener('click', this._handleClick.bind(this));

                // Auto-show completion for single-section modules
                if (this.sections.length === 1) {
                    const firstSection = this.sections[0];
                    const hasTrigger = firstSection.querySelector('.reveal-trigger');
                    if (!hasTrigger) {
                        this.advanceStep();
                        this._showCompletion();
                    }
                }

                if (options.restore) {
                    this.onReset();
                }

                console.log('[ProgressiveDisclosure] Initialized with', this.sections.length, 'sections');
            },

            onDestroy: function () {
                const state = this._getState();
                if (state.container) {
                    state.container.removeEventListener('click', this._handleClick);
                }
            },

            onReset: function () {
                // Remove active/revealed classes from all sections
                this.sections.forEach(section => {
                    section.classList.remove('active', 'revealed');
                });

                // Reset completion section
                if (this.completionSection) {
                    this.completionSection.classList.remove('active', 'celebrating');
                }

                // Show first section
                if (this.sections.length > 0) {
                    this.sections[0].classList.add('active');
                }

                this._updateStepCounter();
            },

            // ---------- State Hooks ----------

            getCustomState: function () {
                return {
                    revealedCount: this.getCurrentStep()
                };
            },

            setCustomState: function (savedState) {
                // Restore revealed sections up to saved point
                for (let i = 0; i < savedState.revealedCount; i++) {
                    if (this.sections[i]) {
                        this.sections[i].classList.add('active', 'revealed');
                    }
                }
                this._updateStepCounter();
            },

            // ---------- Method-Specific Functions ----------

            /**
             * Reveal the next hidden section
             */
            revealNext: function () {
                const nextIndex = this.getCurrentStep() + 1;

                if (nextIndex >= this.sections.length) {
                    this._showCompletion();
                    return;
                }

                const section = this.sections[nextIndex];

                // Add active class to trigger CSS animation
                section.classList.add('active');

                // Mark previous as fully revealed
                if (nextIndex > 0) {
                    this.sections[nextIndex - 1].classList.add('revealed');
                }

                // Advance progress
                this.advanceStep();

                // Update UI
                this._updateStepCounter();

                // Emit event for composition
                this.emit('revealed', {
                    sectionIndex: nextIndex,
                    section: section
                });

                // Scroll to section
                // Wait for CSS transition (400ms) to complete before scrolling
                // This ensures we calculate based on the final expanded size
                setTimeout(() => {
                    const container = section.closest('.cyberdeck-main') || section.parentElement;
                    if (container) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }, 450);

                // Check if all sections are now revealed (after advanceStep was called)
                // If we are on the last step (or beyond), show completion
                if (this.getCurrentStep() >= this.sections.length - 1) {
                    console.log('[ProgressiveDisclosure] Last section reached, showing completion');
                    this._showCompletion();
                }
            },

            revealAll: function () {
                while (this.getCurrentStep() < this.sections.length) {
                    this.revealNext();
                }
            },

            isAllRevealed: function () {
                return this.getCurrentStep() >= this.sections.length;
            },

            /**
             * Reveal all sections (for restoration or debug)
             */
            revealAll: function () {
                this.sections.forEach(sec => {
                    sec.classList.add('active');
                    sec.classList.remove('hidden');
                });

                // Also show completion section if exists
                const completeSec = this._getState().container.querySelector('.lesson-complete');
                if (completeSec) completeSec.classList.add('active');

                this.currentStep = this.sections.length;
                this.updateProgress();
            },

            // ---------- Private Helpers ----------


            _handleClick: function (event) {
                const trigger = event.target.closest('.reveal-trigger');
                if (!trigger) return;

                event.preventDefault();

                // Find which section this trigger belongs to
                const section = trigger.closest('.reveal-section');
                const sectionIndex = Array.from(this.sections).indexOf(section);

                // Only reveal if clicking the current section's trigger
                if (sectionIndex === this.getCurrentStep()) {
                    this.revealNext();
                }
            },

            _updateStepCounter: function () {
                const container = this._getState().container;
                const counter = container.querySelector('.step-counter');
                if (counter) {
                    const current = Math.min(this.getCurrentStep() + 1, this.sections.length);
                    counter.innerHTML = `Step <span class="current">${current}</span> of ${this.sections.length}`;
                }
            },

            _render: function (container, options) {
                let html = `<h1 class="module-title">${options.title || ''}</h1>`;
                html += '<div class="step-counter"></div>';

                if (options.sections) {
                    options.sections.forEach((sec, idx) => {
                        const isFirst = idx === 0 ? 'active' : '';
                        const layout = sec.mediaLayout || 'full';
                        const layoutClass = `pd-layout-${layout}`;

                        let mediaHTML = this._generateMediaHTML(sec.media);
                        if (mediaHTML) {
                            mediaHTML = mediaHTML.replace('media-container', 'pd-media-container');
                        }

                        let contentHTML = '';
                        if (layout === 'full') {
                            contentHTML = `
                                ${sec.title ? `<h2 class="section-title">${sec.title}</h2>` : ''}
                                ${mediaHTML}
                                <div class="pd-text-content section-content">${sec.content}</div>
                            `;
                        } else {
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
                                ${idx < options.sections.length - 1 ? `<button class="reveal-trigger">${sec.triggerLabel || 'Next'}</button>` : ''}
                            </div>
                        `;
                    });
                }

                html += `
                    <div class="reveal-section lesson-complete">
                        <h2>Section Complete</h2>
                        <button class="btn-primary btn-continue">CONTINUE ▶</button>
                    </div>
                `;
                container.innerHTML = html;
            },

            _generateMediaHTML: function (media) {
                if (!media) return '';
                const positionClass = media.position ? `media-${media.position}` : 'media-inline';
                const style = media.style ? `style="${media.style}"` : '';
                let content = '';
                if (media.type === 'image') {
                    content = `<img src="${media.src}" alt="${media.alt || ''}" class="sim-media-image">`;
                } else if (media.type === 'video') {
                    const autoplay = media.autoplay !== false ? 'autoplay loop muted playsinline' : 'controls';
                    content = `<video src="${media.src}" ${autoplay} class="sim-media-video"></video>`;
                }
                return `<div class="media-container ${positionClass}" ${style}>${content}</div>`;
            },

            _showCompletion: function () {
                // ... logic ...
                if (this.completionSection) {
                    this.completionSection.classList.add('active');
                    setTimeout(() => {
                        this.completionSection.classList.add('celebrating');
                    }, 400);

                    let btn = this.completionSection.querySelector('.btn-continue');
                    if (!btn) {
                        btn = document.createElement('button');
                        btn.className = 'btn-primary btn-continue';
                        btn.innerText = 'CONTINUE ▶';
                        this.completionSection.appendChild(btn);
                    }

                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);
                    newBtn.style.display = 'inline-block';

                    newBtn.addEventListener('click', (e) => {
                        if (e.target.disabled) return;
                        e.target.disabled = true;
                        e.target.textContent = 'Processing...';
                        this.markComplete();
                        this.emit('allRevealed', {});
                    });
                }
            }
        });
    };

    // Export Factory
    if (window.MethodLoader) {
        window.MethodLoader.registerFactory('progressive-disclosure', ProgressiveDisclosureFactory);
    }
    // ALWAYS export to window for direct access by LessonRunner (legacy path)
    window.ProgressiveDisclosureFactory = ProgressiveDisclosureFactory;

})();
