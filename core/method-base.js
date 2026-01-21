/**
 * CYBERDELICS 101 - Teaching Method Base
 * Shared interface that all teaching methods must implement
 * 
 * This provides a consistent API for:
 * - Progress tracking
 * - State management (save/restore)
 * - Event-based method communication
 * - Composition (nesting methods)
 */

/**
 * Creates a new teaching method with the standard interface
 * @param {string} methodName - Unique identifier for this method
 * @param {object} implementation - Method-specific functions
 * @returns {object} Complete method with base + custom functions
 */
function createTeachingMethod(methodName, implementation) {
    'use strict';

    // ---------- Private State ----------
    const state = {
        name: methodName,
        container: null,
        isInitialized: false,
        currentStep: 0,
        totalSteps: 0,
        isComplete: false,
        parent: null,
        children: [],
        eventListeners: {}
    };

    // ---------- Event System ----------
    const events = {
        emit: function (eventName, data) {
            const listeners = state.eventListeners[eventName] || [];
            listeners.forEach(callback => callback(data));

            // Also emit to parent if nested
            if (state.parent && state.parent.emit) {
                state.parent.emit(`${methodName}:${eventName}`, data);
            }
        },

        on: function (eventName, callback) {
            if (!state.eventListeners[eventName]) {
                state.eventListeners[eventName] = [];
            }
            state.eventListeners[eventName].push(callback);
        },

        off: function (eventName, callback) {
            if (!state.eventListeners[eventName]) return;
            state.eventListeners[eventName] = state.eventListeners[eventName]
                .filter(cb => cb !== callback);
        }
    };

    // ---------- Base Interface ----------
    const base = {
        // ========== LIFECYCLE ==========

        /**
         * Initialize method on a container element
         * @param {string} containerSelector - CSS selector or element
         * @param {object} options - Configuration options
         */
        init: function (containerSelector, options = {}) {
            // Find container
            state.container = typeof containerSelector === 'string'
                ? document.querySelector(containerSelector)
                : containerSelector;

            if (!state.container) {
                console.error(`[${methodName}] Container not found:`, containerSelector);
                return false;
            }

            state.isInitialized = true;

            // Call implementation's init if provided
            if (implementation.onInit) {
                implementation.onInit.call(this, state.container, options);
            }

            events.emit('init', { container: state.container });
            return true;
        },

        /**
         * Clean up event listeners and reset state
         */
        destroy: function () {
            if (implementation.onDestroy) {
                implementation.onDestroy.call(this);
            }

            // Destroy children first
            state.children.forEach(child => child.destroy());

            state.eventListeners = {};
            state.isInitialized = false;
            events.emit('destroy', {});
        },

        /**
         * Reset to initial state
         */
        reset: function () {
            state.currentStep = 0;
            state.isComplete = false;

            if (implementation.onReset) {
                implementation.onReset.call(this);
            }

            events.emit('reset', {});
        },

        // ========== PROGRESS ==========

        getProgress: function () {
            return state.totalSteps > 0
                ? state.currentStep / state.totalSteps
                : 0;
        },

        getTotalSteps: function () {
            return state.totalSteps;
        },

        getCurrentStep: function () {
            return state.currentStep;
        },

        setTotalSteps: function (total) {
            state.totalSteps = total;
        },

        advanceStep: function () {
            if (state.currentStep < state.totalSteps) {
                state.currentStep++;
                events.emit('stepComplete', {
                    step: state.currentStep,
                    total: state.totalSteps,
                    progress: this.getProgress()
                });

                // Notify CourseCore if available
                if (typeof CourseCore !== 'undefined') {
                    CourseCore.advanceProgress();
                }
            }
        },

        onStepComplete: function (callback) {
            events.on('stepComplete', callback);
        },

        // ========== STATE ==========

        getState: function () {
            const baseState = {
                name: state.name,
                currentStep: state.currentStep,
                totalSteps: state.totalSteps,
                isComplete: state.isComplete
            };

            // Merge with implementation state
            if (implementation.getCustomState) {
                return { ...baseState, ...implementation.getCustomState.call(this) };
            }
            return baseState;
        },

        setState: function (savedState) {
            state.currentStep = savedState.currentStep || 0;
            state.totalSteps = savedState.totalSteps || state.totalSteps;
            state.isComplete = savedState.isComplete || false;

            if (implementation.setCustomState) {
                implementation.setCustomState.call(this, savedState);
            }

            events.emit('stateRestored', savedState);
        },

        isComplete: function () {
            return state.isComplete;
        },

        markComplete: function () {
            state.isComplete = true;
            events.emit('complete', { method: state.name });
        },

        // ========== COMPOSITION ==========

        setParent: function (parentMethod) {
            state.parent = parentMethod;
        },

        addChild: function (childMethod, containerEl) {
            childMethod.setParent(this);
            state.children.push(childMethod);
            return childMethod;
        },

        getChildren: function () {
            return state.children;
        },

        // ========== EVENTS ==========
        emit: events.emit,
        on: events.on,
        off: events.off,

        // ========== INTERNAL ACCESS ==========
        _getState: function () { return state; },
        _getName: function () { return methodName; }
    };

    // Merge base with implementation
    return { ...base, ...implementation };
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createTeachingMethod };
}
