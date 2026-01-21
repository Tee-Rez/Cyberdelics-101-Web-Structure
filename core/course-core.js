/**
 * CYBERDELICS 101 - Course Core
 * Shared functionality for all lessons and teaching methods
 * 
 * Responsibilities:
 * - Progress tracking
 * - Framer communication (scaffolded for future use)
 * - Lesson state management
 */

const CourseCore = (function () {
    'use strict';

    // ---------- Private State ----------
    let config = {
        lessonId: null,
        totalSteps: 0,
        currentStep: 0,
        isComplete: false,
        debug: true  // Set to false in production
    };

    // ---------- Framer Communication Framework ----------
    // Scaffolded for future integration - logs to console for now

    const FramerBridge = {
        /**
         * Send message to Framer parent window
         * @param {string} eventType - Event identifier
         * @param {object} data - Payload to send
         */
        postMessage: function (eventType, data) {
            const message = {
                source: 'cyberdelics-101',
                type: eventType,
                lessonId: config.lessonId,
                timestamp: Date.now(),
                ...data
            };

            // Log for debugging during development
            if (config.debug) {
                console.log('[CourseCore → Framer]', message);
            }

            // Actual postMessage - will work when embedded in Framer
            if (window.parent !== window) {
                window.parent.postMessage(message, '*');
            }
        },

        /**
         * Send progress update
         * @param {number} progress - Progress value 0-1
         */
        sendProgress: function (progress) {
            this.postMessage('cyberdelics-progress', { progress });
        },

        /**
         * Send lesson completion event
         */
        sendComplete: function () {
            this.postMessage('cyberdelics-complete', {
                completedAt: new Date().toISOString()
            });
        },

        /**
         * Send lesson started event
         */
        sendStarted: function () {
            this.postMessage('cyberdelics-started', {});
        }
    };

    // ---------- Progress Tracking ----------

    const Progress = {
        /**
         * Update progress bar UI
         */
        updateUI: function () {
            const progressPercent = config.totalSteps > 0
                ? Math.round((config.currentStep / config.totalSteps) * 100)
                : 0;

            // Update progress bar fill
            const progressFill = document.querySelector('.progress-bar-fill');
            if (progressFill) {
                progressFill.style.width = `${progressPercent}%`;
            }

            // Update progress text if exists
            const progressText = document.querySelector('.progress-text');
            if (progressText) {
                progressText.textContent = `${progressPercent}% complete`;
            }
        },

        /**
         * Set total number of steps
         * @param {number} total 
         */
        setTotal: function (total) {
            config.totalSteps = total;
            this.updateUI();
        },

        /**
         * Advance to next step
         */
        advance: function () {
            if (config.currentStep < config.totalSteps) {
                config.currentStep++;
                this.updateUI();

                // Notify Framer of progress
                const progress = config.currentStep / config.totalSteps;
                FramerBridge.sendProgress(progress);
            }
        },

        /**
         * Get current progress (0-1)
         */
        getProgress: function () {
            return config.totalSteps > 0
                ? config.currentStep / config.totalSteps
                : 0;
        },

        /**
         * Check if all steps are complete
         */
        isAllComplete: function () {
            return config.currentStep >= config.totalSteps;
        }
    };

    // ---------- Completion ----------

    const Completion = {
        /**
         * Enable the completion button
         */
        enableButton: function () {
            const completeBtn = document.querySelector('.complete-lesson-btn');
            if (completeBtn) {
                completeBtn.disabled = false;
            }
        },

        /**
         * Mark lesson as complete
         */
        markComplete: function () {
            if (config.isComplete) return;

            config.isComplete = true;
            FramerBridge.sendComplete();

            if (config.debug) {
                console.log('[CourseCore] Lesson complete:', config.lessonId);
            }
        }
    };

    // ---------- Public API ----------

    return {
        /**
         * Initialize the course core for a lesson
         * @param {string} lessonId - Unique identifier for this lesson
         * @param {object} options - Optional configuration
         */
        init: function (lessonId, options = {}) {
            config.lessonId = lessonId;
            config.debug = options.debug !== undefined ? options.debug : true;
            config.currentStep = 0;
            config.isComplete = false;

            // Notify Framer that lesson has started
            FramerBridge.sendStarted();

            // Set up completion button click handler
            const completeBtn = document.querySelector('.complete-lesson-btn');
            if (completeBtn) {
                completeBtn.addEventListener('click', () => {
                    Completion.markComplete();
                });
            }

            if (config.debug) {
                console.log('[CourseCore] Initialized:', lessonId);
            }
        },

        /**
         * Set total steps for progress tracking
         */
        setTotalSteps: function (total) {
            Progress.setTotal(total);
        },

        /**
         * Advance progress by one step
         */
        advanceProgress: function () {
            Progress.advance();
        },

        /**
         * Check if all content steps are complete
         */
        isAllContentComplete: function () {
            return Progress.isAllComplete();
        },

        /**
         * Enable the lesson completion button
         */
        enableCompletion: function () {
            Completion.enableButton();
        },

        /**
         * Get current progress (0-1)
         */
        getProgress: function () {
            return Progress.getProgress();
        },

        /**
         * Access to Framer bridge for custom messages
         */
        framer: FramerBridge,

        /**
         * Manually trigger lesson completion
         */
        completeLesson: function () {
            Completion.markComplete();
        }
    };
})();
