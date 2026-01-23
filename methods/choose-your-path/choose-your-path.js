/**
 * Choose-Your-Path Method
 * Path selection teaching method with modular content tracks
 * 
 * Factory Pattern Refactor
 * 
 * Usage:
 *   const factory = window.ChooseYourPathFactory;
 *   const instance = factory();
 *   instance.init('.path-container');
 */

(function () {
    'use strict';

    if (typeof createTeachingMethod === 'undefined') {
        console.error('Core dependency "method-base.js" missing.');
        return;
    }

    const ChooseYourPathFactory = function () {
        return createTeachingMethod('choose-your-path', {
            // ---------- Private State ----------
            paths: [],
            currentPath: null,
            pathSections: [],
            currentSectionIndex: 0,
            completedPaths: new Set(), // Track which paths have been completed
            lessonCompleted: false, // Track if entire lesson was completed (one-time)

            // ---------- Lifecycle Hooks ----------

            onInit: function (container, options) {
                // Find path options
                this.paths = container.querySelectorAll('.path-option');
                this.pathSelection = container.querySelector('.path-selection');
                this.pathContents = container.querySelectorAll('.path-content');

                // Attach click handlers
                this._boundClickHandler = this._handleClick.bind(this);
                container.addEventListener('click', this._boundClickHandler);

                // Update path UI for completed paths
                this._updatePathUI();

                console.log('[ChooseYourPath] Initialized with', this.paths.length, 'paths');
            },

            onDestroy: function () {
                const state = this._getState();
                if (state.container) {
                    state.container.removeEventListener('click', this._boundClickHandler);
                }
            },

            onReset: function () {
                // Hide all path content
                this.pathContents.forEach(content => {
                    content.classList.remove('active');
                });

                // Reset path sections
                if (this.pathSections.length > 0) {
                    this.pathSections.forEach(section => {
                        section.classList.remove('active');
                    });
                }

                // Show path selection
                if (this.pathSelection) {
                    this.pathSelection.style.display = 'block';
                }

                // Reset state
                this.currentPath = null;
                this.pathSections = [];
                this.currentSectionIndex = 0;

                // Deselect all paths
                this.paths.forEach(p => p.classList.remove('selected'));
            },

            // ---------- State Hooks ----------

            getCustomState: function () {
                return {
                    currentPath: this.currentPath,
                    currentSectionIndex: this.currentSectionIndex,
                    completedPaths: Array.from(this.completedPaths),
                    lessonCompleted: this.lessonCompleted
                };
            },

            setCustomState: function (savedState) {
                // Restore completed paths
                if (savedState.completedPaths) {
                    this.completedPaths = new Set(savedState.completedPaths);
                    this._updatePathUI();
                }

                if (savedState.currentPath) {
                    // Restore path selection
                    const pathEl = document.querySelector(`[data-path-id="${savedState.currentPath}"]`);
                    if (pathEl) {
                        this.selectPath(savedState.currentPath);
                        // Restore section progress
                        for (let i = 0; i <= savedState.currentSectionIndex; i++) {
                            if (this.pathSections[i]) {
                                this.pathSections[i].classList.add('active');
                            }
                        }
                        this.currentSectionIndex = savedState.currentSectionIndex;
                    }
                }
            },

            // ---------- Method-Specific Functions ----------

            /**
             * Get available paths
             */
            getPaths: function () {
                return Array.from(this.paths).map(p => ({
                    id: p.dataset.pathId,
                    title: p.querySelector('.path-title')?.textContent,
                    description: p.querySelector('.path-description')?.textContent
                }));
            },

            /**
             * Select a path
             */
            selectPath: function (pathId) {
                // Check if path is already completed
                if (this.completedPaths.has(pathId)) {
                    console.log('[ChooseYourPath] Path already completed:', pathId);
                    return;
                }

                // Find path elements
                const container = this._getState().container;
                const pathOption = container.querySelector(`[data-path-id="${pathId}"]`);
                const pathContent = container.querySelector(`.path-content[data-path="${pathId}"]`);

                if (!pathOption || !pathContent) {
                    console.error('[ChooseYourPath] Path not found:', pathId);
                    return;
                }

                // Update state
                this.currentPath = pathId;

                // Visual feedback on selection
                this.paths.forEach(p => p.classList.remove('selected'));
                pathOption.classList.add('selected');

                // Hide path selection after brief delay
                setTimeout(() => {
                    if (this.pathSelection) {
                        this.pathSelection.style.display = 'none';
                    }

                    // Show path content
                    this.pathContents.forEach(c => c.classList.remove('active'));
                    pathContent.classList.add('active');

                    // Initialize sections for this path
                    this.pathSections = pathContent.querySelectorAll('.path-section');
                    this.setTotalSteps(this.pathSections.length);

                    // Show first section
                    if (this.pathSections.length > 0) {
                        this.pathSections[0].classList.add('active');
                        this.currentSectionIndex = 0;
                    }

                    this._updateProgress();

                    // Scroll to content
                    pathContent.scrollIntoView({ behavior: 'smooth', block: 'start' });

                }, 300);

                // Emit event
                this.emit('pathSelected', {
                    pathId: pathId,
                    pathTitle: pathOption.querySelector('.path-title')?.textContent
                });
            },

            /**
             * Get current path ID
             */
            getCurrentPath: function () {
                return this.currentPath;
            },

            /**
             * Get progress within current path
             */
            getPathProgress: function () {
                if (!this.pathSections.length) return 0;
                return (this.currentSectionIndex + 1) / this.pathSections.length;
            },

            /**
             * Advance to next section in path
             */
            nextSection: function () {
                const nextIndex = this.currentSectionIndex + 1;

                if (nextIndex >= this.pathSections.length) {
                    // Path complete
                    this._showCompletion();
                    return;
                }

                // Show next section
                this.pathSections[nextIndex].classList.add('active');
                this.currentSectionIndex = nextIndex;

                // Advance progress
                this.advanceStep();
                this._updateProgress();

                // Scroll to new section
                setTimeout(() => {
                    this.pathSections[nextIndex].scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);

                this.emit('sectionAdvanced', {
                    sectionIndex: this.currentSectionIndex,
                    totalSections: this.pathSections.length
                });
            },

            /**
             * Change to a different path
             */
            changePath: function () {
                // Reset current path content
                this.pathContents.forEach(c => {
                    c.classList.remove('active');

                    // Reset all sections within this path
                    const sections = c.querySelectorAll('.path-section');
                    sections.forEach(s => s.classList.remove('active'));

                    // Reset completion section
                    const completion = c.querySelector('.path-complete');
                    if (completion) {
                        completion.classList.remove('active');
                    }
                });

                // Show path selection
                if (this.pathSelection) {
                    this.pathSelection.style.display = 'block';
                    this.pathSelection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                // Reset state
                this.currentPath = null;
                this.pathSections = [];
                this.currentSectionIndex = 0;

                this.emit('pathChanged', {});
            },

            // ---------- Private Helpers ----------

            _handleClick: function (event) {
                // Handle path selection
                const pathOption = event.target.closest('.path-option');
                if (pathOption && !this.currentPath) {
                    event.preventDefault();
                    const pathId = pathOption.dataset.pathId;
                    if (pathId) {
                        this.selectPath(pathId);
                    }
                    return;
                }

                // Handle section continue
                const continueBtn = event.target.closest('.path-continue');
                if (continueBtn) {
                    event.preventDefault();
                    this.nextSection();
                    return;
                }

                // Handle change path
                const changeBtn = event.target.closest('.change-path-btn');
                if (changeBtn) {
                    event.preventDefault();
                    this.changePath();
                    return;
                }

                // Handle complete path button
                const completePathBtn = event.target.closest('.complete-path-btn');
                if (completePathBtn && !completePathBtn.disabled) {
                    event.preventDefault();
                    this.changePath(); // Return to path selection
                    return;
                }

                // Handle complete lesson button (on path selection screen)
                const completeLessonBtn = event.target.closest('.complete-lesson-btn');
                if (completeLessonBtn && !completeLessonBtn.disabled) {
                    event.preventDefault();
                    // Lesson complete - could navigate away or show final message
                    if (typeof CourseCore !== 'undefined') {
                        CourseCore.completeLesson();
                    }
                    return;
                }
            },

            _updateProgress: function () {
                const progress = this.getPathProgress() * 100;

                // Update path-specific progress bar
                // SCOPED LOOKUP
                const container = this._getState().container;
                const activeContent = container.querySelector('.path-content.active');
                if (!activeContent) return;

                const progressFill = activeContent.querySelector('.path-progress-fill');
                if (progressFill) {
                    progressFill.style.width = `${progress}%`;
                }

                const progressText = activeContent.querySelector('.path-progress-text');
                if (progressText) {
                    progressText.textContent = `${this.currentSectionIndex + 1} of ${this.pathSections.length}`;
                }
            },

            _showCompletion: function () {
                // Find completion section
                const container = this._getState().container;
                const activeContent = container.querySelector('.path-content.active');
                if (!activeContent) return;

                const completion = activeContent.querySelector('.path-complete');
                if (completion) {
                    completion.classList.add('active');
                }

                // Mark this path as completed
                if (this.currentPath) {
                    this.completedPaths.add(this.currentPath);
                    this._updatePathUI();
                }

                // Update CourseCore progress (count completed paths)
                if (typeof CourseCore !== 'undefined') {
                    // Set total steps to number of paths
                    const totalPaths = this.paths.length;
                    CourseCore.setTotalSteps(totalPaths);

                    // Advance progress to match completed paths count
                    const currentStep = CourseCore.getProgress ?
                        Math.floor(CourseCore.getProgress() * totalPaths) : 0;
                    const targetStep = this.completedPaths.size;

                    for (let i = currentStep; i < targetStep; i++) {
                        CourseCore.advanceProgress();
                    }

                    // Enable completion button (always enable after any path)
                    CourseCore.enableCompletion();
                }

                // Check if all paths are now completed (first time)
                if (this.completedPaths.size >= this.paths.length && !this.lessonCompleted) {
                    this.lessonCompleted = true;
                    this.markComplete();

                    // Show complete lesson button on path selection
                    this._showLessonCompleteButton();
                }

                this.emit('pathComplete', {
                    path: this.currentPath,
                    sections: this.pathSections.length,
                    totalCompleted: this.completedPaths.size,
                    totalPaths: this.paths.length,
                    lessonCompleted: this.lessonCompleted
                });
            },

            /**
             * Reset a completed path
             */
            resetPath: function (pathId) {
                this.completedPaths.delete(pathId);
                this._updatePathUI();

                // Update CourseCore progress
                if (typeof CourseCore !== 'undefined') {
                    const totalPaths = this.paths.length;
                    CourseCore.setTotalSteps(totalPaths);
                }

                this.emit('pathReset', { pathId });
            },

            /**
             * Update path option UI with checkmarks and reset buttons
             */
            _updatePathUI: function () {
                this.paths.forEach(pathEl => {
                    const pathId = pathEl.dataset.pathId;
                    const isCompleted = this.completedPaths.has(pathId);

                    // Add/remove completed class
                    if (isCompleted) {
                        pathEl.classList.add('completed');
                    } else {
                        pathEl.classList.remove('completed');
                    }

                    // Add checkmark if not already present
                    let checkmark = pathEl.querySelector('.path-checkmark');
                    if (isCompleted && !checkmark) {
                        checkmark = document.createElement('div');
                        checkmark.className = 'path-checkmark';
                        checkmark.innerHTML = '✓';
                        pathEl.appendChild(checkmark);
                    } else if (!isCompleted && checkmark) {
                        checkmark.remove();
                    }

                    // Add reset button if completed
                    let resetBtn = pathEl.querySelector('.path-reset-btn');
                    if (isCompleted && !resetBtn) {
                        resetBtn = document.createElement('button');
                        resetBtn.className = 'btn btn-secondary path-reset-btn';
                        resetBtn.textContent = 'Reset';
                        resetBtn.onclick = (e) => {
                            e.stopPropagation();
                            this.resetPath(pathId);
                        };
                        pathEl.appendChild(resetBtn);
                    } else if (!isCompleted && resetBtn) {
                        resetBtn.remove();
                    }
                });
            },

            /**
             * Show the complete lesson button on path selection screen
             */
            _showLessonCompleteButton: function () {
                if (!this.pathSelection) return;

                // Check if button already exists
                let completeLessonBtn = this.pathSelection.querySelector('.complete-lesson-btn');
                if (!completeLessonBtn) {
                    // Create and add the button
                    completeLessonBtn = document.createElement('button');
                    completeLessonBtn.className = 'btn btn-primary complete-lesson-btn mt-xl';
                    completeLessonBtn.textContent = 'Complete Lesson';
                    // Inline styles for simplicity in refactor
                    completeLessonBtn.style.display = 'block';
                    completeLessonBtn.style.margin = '20px auto';
                    this.pathSelection.appendChild(completeLessonBtn);
                }
            }
        });
    };

    /**
     * Factory Creation
     */
    if (window.MethodLoader) {
        window.MethodLoader.registerFactory('choose-your-path', ChooseYourPathFactory);
    } else {
        window.ChooseYourPathFactory = ChooseYourPathFactory;
    }

})();
