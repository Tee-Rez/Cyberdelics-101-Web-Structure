/**
 * CYBERDELICS 101 - Tutorial Overlay Component
 * Generic, reusable tutorial system with spotlight highlighting.
 * 
 * Usage:
 *   const tutorial = new TutorialOverlay(containerElement);
 *   tutorial.start([
 *     { title: 'Welcome', text: 'Hello world', target: null },
 *     { title: 'Feature X', text: 'Click here', target: '#my-btn', position: 'bottom' }
 *   ]);
 */

class TutorialOverlay {
    constructor(container) {
        this.container = container || document.body;
        this.overlay = null;
        this.currentStepIndex = 0;
        this.steps = [];
        this.isActive = false;

        this._init();
    }

    _init() {
        // Create Overlay Elements
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        this.overlay.innerHTML = `
            <div class="tutorial-spotlight"></div>
            <div class="tutorial-card">
                <h3 id="tut-title">Title</h3>
                <p id="tut-text">Text</p>
                <div class="tutorial-controls">
                    <button class="btn-tutorial" id="tut-skip">Skip</button>
                    <button class="btn-tutorial primary" id="tut-next">Next</button>
                </div>
            </div>
        `;

        // Ensure container is relative so absolute positioning works
        const style = window.getComputedStyle(this.container);
        if (style.position === 'static') {
            this.container.style.position = 'relative';
        }

        this.container.appendChild(this.overlay);

        // Bind Events
        this.overlay.querySelector('#tut-next').onclick = () => this.nextStep();
        this.overlay.querySelector('#tut-skip').onclick = () => this.end();
    }

    start(steps) {
        if (!steps || steps.length === 0) return;
        this.steps = steps;
        this.currentStepIndex = 0;
        this.isActive = true;
        this.overlay.classList.add('active');
        this.showStep(0);
    }

    nextStep() {
        if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++;
            this.showStep(this.currentStepIndex);
        } else {
            this.end();
        }
    }

    showStep(index) {
        const step = this.steps[index];
        if (!step) {
            this.end();
            return;
        }

        // Update Text
        this.overlay.querySelector('#tut-title').textContent = step.title;
        this.overlay.querySelector('#tut-text').innerHTML = step.text;

        // Update Buttons Visibility & Text
        const nextBtn = this.overlay.querySelector('#tut-next');
        const skipBtn = this.overlay.querySelector('#tut-skip');

        // Handle Skip Button
        if (step.showSkip === false) {
            skipBtn.style.display = 'none';
        } else {
            skipBtn.style.display = 'inline-block';
        }

        // Handle Next Button
        if (step.showNext === false) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'inline-block';
            nextBtn.textContent = (index === this.steps.length - 1) ? 'Finish' : 'Next';
        }

        // Position Spotlight & Card
        this._updatePosition(step);
    }

    _updatePosition(step) {
        const spotlight = this.overlay.querySelector('.tutorial-spotlight');
        const card = this.overlay.querySelector('.tutorial-card');
        const containerRect = this.overlay.getBoundingClientRect(); // Use overlay rect as reference frame

        if (step.target) {
            let targetEl;
            if (typeof step.target === 'string') {
                targetEl = document.querySelector(step.target);
            } else if (step.target instanceof HTMLElement) {
                targetEl = step.target;
            } else if (step.target instanceof SVGElement) {
                targetEl = step.target;
            }

            if (targetEl) {
                const rect = targetEl.getBoundingClientRect();

                // Calculate center relative to overlay/container
                // Note: getBoundingClientRect is relative to viewport, so we subtract container's viewport offset
                const cx = rect.left + rect.width / 2 - containerRect.left;
                const cy = rect.top + rect.height / 2 - containerRect.top;

                // Spotlight Size
                // Use explicit size if provided, otherwise fit target with padding
                let size = step.spotlightSize || (Math.max(rect.width, rect.height) + 40);

                spotlight.style.width = size + 'px';
                spotlight.style.height = size + 'px';
                spotlight.style.left = (cx - size / 2) + 'px';
                spotlight.style.top = (cy - size / 2) + 'px';
                spotlight.style.opacity = 1;
                spotlight.style.borderRadius = step.shape === 'rect' ? '4px' : '50%';

                // Card Position
                this._positionCard(card, cx, cy, size, step.position, containerRect);
            } else {
                console.warn('[TutorialOverlay] Target not found:', step.target);
                this._centerLayout(spotlight, card, containerRect);
            }
        } else {
            // No target (e.g. Intro/Welcome)
            this._centerLayout(spotlight, card, containerRect);
        }
    }

    _centerLayout(spotlight, card, containerRect) {
        spotlight.style.opacity = 0;

        // Center card
        card.style.top = (containerRect.height / 2 - card.offsetHeight / 2) + 'px';
        card.style.left = (containerRect.width / 2 - card.offsetWidth / 2) + 'px';
    }

    _positionCard(card, cx, cy, size, position, containerRect) {
        // Simple positioning logic
        // Reset
        card.style.top = '';
        card.style.right = '';
        card.style.bottom = '';
        card.style.left = '';

        const margin = 20;

        switch (position) {
            case 'bottom':
                card.style.top = (cy + size / 2 + margin) + 'px';
                card.style.left = (cx - 150) + 'px'; // Center-ish (width=300)
                break;
            case 'top':
                card.style.bottom = (containerRect.height - (cy - size / 2) + margin) + 'px';
                card.style.left = (cx - 150) + 'px';
                break;
            case 'right':
                card.style.top = (cy - 100) + 'px';
                card.style.left = (cx + size / 2 + margin) + 'px';
                break;
            case 'left':
                card.style.top = (cy - 100) + 'px';
                card.style.right = (containerRect.width - (cx - size / 2) + margin) + 'px';
                break;
            case 'center':
                card.style.top = (containerRect.height / 2 - 100) + 'px';
                card.style.left = (containerRect.width / 2 - 150) + 'px';
                break;
            default: // Auto/Bottom default
                card.style.top = (cy + size / 2 + margin) + 'px';
                card.style.left = (cx - 150) + 'px';
                break;
        }
    }

    end() {
        this.isActive = false;
        this.overlay.classList.remove('active');
        // Optional: Trigger callback
        if (this.onComplete) this.onComplete();
    }

    destroy() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }
}

// Export for module systems or global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TutorialOverlay;
} else {
    window.TutorialOverlay = TutorialOverlay;
}
