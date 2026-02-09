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
                // Find all reveal sections (excluding completion)
                this.sections = container.querySelectorAll('.reveal-section:not(.lesson-complete)');
                this.completionSection = container.querySelector('.lesson-complete');

                // Set total steps for progress tracking
                this.setTotalSteps(this.sections.length);

                // Set up CourseCore if available (for legacy support)
                if (typeof CourseCore !== 'undefined') {
                    CourseCore.setTotalSteps(this.sections.length);
                }

                // First section visible by default
                if (this.sections.length > 0) {
                    this.sections[0].classList.add('active');
                }

                // Update step counter UI
                this._updateStepCounter();

                // Attach click handler
                this._handleClick = this._handleClick.bind(this);
                container.addEventListener('click', this._handleClick);

                // Auto-show completion for single-section modules (e.g., placeholders)
                // If there's only one section and it has no trigger button, show completion immediately
                if (this.sections.length === 1) {
                    const firstSection = this.sections[0];
                    const hasTrigger = firstSection.querySelector('.reveal-trigger');
                    if (!hasTrigger) {
                        console.log('[ProgressiveDisclosure] Single section without trigger - auto-showing completion');
                        // Advance step to mark it complete
                        this.advanceStep();
                        // Show completion section
                        this._showCompletion();
                    }
                }

                // CHECK FOR RESTORE FLAG
                if (options.restore) {
                    console.log('[ProgressiveDisclosure] Restoring state: Resetting to start (First section only).');
                    // Ensure we are reset
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
                // Determine scope: only look inside our container
                const container = this._getState().container;
                const counter = container.querySelector('.step-counter');
                if (counter) {
                    const current = Math.min(this.getCurrentStep() + 1, this.sections.length);
                    counter.innerHTML = `Step <span class="current">${current}</span> of ${this.sections.length}`;
                }
            },

            _showCompletion: function () {
                if (this.completionSection) {
                    this.completionSection.classList.add('active');

                    // Animation logic
                    setTimeout(() => {
                        this.completionSection.classList.add('celebrating');
                    }, 400);

                    // REQUIRE USER INPUT: Wait for "Continue" button click
                    // Check if button exists in content, otherwise inject it
                    let btn = this.completionSection.querySelector('.btn-continue');

                    if (!btn) {
                        btn = document.createElement('button');
                        btn.className = 'btn-primary btn-continue';
                        btn.innerText = 'CONTINUE ▶';
                        // Insert at end of completion section
                        this.completionSection.appendChild(btn);
                    }

                    // Remove any old listeners (if re-running) to prevent duplicates
                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);

                    // Force visibility (overriding generic display:none rules if present)
                    newBtn.style.display = 'inline-block';

                    newBtn.addEventListener('click', (e) => {
                        // Prevent multi-click
                        if (e.target.disabled) return;
                        e.target.disabled = true;
                        e.target.textContent = 'Processing...';

                        console.log('[ProgressiveDisclosure] User clicked Continue - Signaling Complete');

                        // Signal completion (LessonRunner listens for this event)
                        // By default LessonRunner waits 1250ms then advances.
                        // If we want faster advance, we should change LessonRunner config, 
                        // but removing the manual call prevents double-jump.
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
