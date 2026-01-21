/**
 * Progressive Disclosure Method
 * Click-to-reveal teaching method implementation
 * 
 * Now uses createTeachingMethod for consistent interface.
 * 
 * Usage:
 *   // Via MethodLoader (recommended):
 *   MethodLoader.register('progressive-disclosure', ProgressiveDisclosure);
 *   MethodLoader.initAll(document.body);
 * 
 *   // Direct initialization:
 *   ProgressiveDisclosure.init('.lesson-container');
 */

const ProgressiveDisclosure = createTeachingMethod('progressive-disclosure', {

    // ---------- Private State (method-specific) ----------
    sections: [],
    completionSection: null,

    // ---------- Lifecycle Hooks ----------

    onInit: function (container, options) {
        const state = this._getState();

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
        const currentStep = this.getCurrentStep();

        if (currentStep >= this.sections.length) {
            this._showCompletion();
            return;
        }

        const section = this.sections[currentStep];

        // Add active class to trigger CSS animation
        section.classList.add('active');

        // Mark previous as fully revealed
        if (currentStep > 0) {
            this.sections[currentStep - 1].classList.add('revealed');
        }

        // Advance progress (base method handles CourseCore notification)
        this.advanceStep();

        // Update UI
        this._updateStepCounter();

        // Emit event for composition
        this.emit('revealed', {
            sectionIndex: currentStep,
            section: section
        });

        // Scroll to section
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        // Check if all revealed
        if (this.getCurrentStep() >= this.sections.length) {
            this._showCompletion();
        }
    },

    /**
     * Reveal all sections at once (for debugging)
     */
    revealAll: function () {
        while (this.getCurrentStep() < this.sections.length) {
            this.revealNext();
        }
    },

    /**
     * Check if all sections are revealed
     */
    isAllRevealed: function () {
        return this.getCurrentStep() >= this.sections.length;
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
        if (sectionIndex === this.getCurrentStep() - 1 ||
            (sectionIndex === 0 && this.getCurrentStep() === 0)) {
            this.revealNext();
        }
    },

    _updateStepCounter: function () {
        const counter = document.querySelector('.step-counter');
        if (counter) {
            const current = Math.min(this.getCurrentStep() + 1, this.sections.length);
            counter.innerHTML = `Step <span class="current">${current}</span> of ${this.sections.length}`;
        }
    },

    _showCompletion: function () {
        if (this.completionSection) {
            this.completionSection.classList.add('active');

            // Enable completion button
            if (typeof CourseCore !== 'undefined') {
                CourseCore.enableCompletion();
            }

            // Celebration animation
            setTimeout(() => {
                this.completionSection.classList.add('celebrating');
            }, 400);

            // Mark method complete
            this.markComplete();

            this.emit('allRevealed', {});
        }
    }
});

// Legacy support: wrap init for DOMContentLoaded handling
const _originalInit = ProgressiveDisclosure.init;
ProgressiveDisclosure.init = function (containerSelector, options) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            _originalInit.call(ProgressiveDisclosure, containerSelector, options);
        });
    } else {
        _originalInit.call(ProgressiveDisclosure, containerSelector, options);
    }
};
