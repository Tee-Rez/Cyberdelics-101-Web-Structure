/**
 * Option Selector Method
 * Selection-based teaching method for single or multi-choice questions.
 * 
 * Features:
 * - Single-choice (radio): One answer only
 * - Multi-choice (checkbox): Multiple answers, with optional synthesis
 * 
 * Factory Pattern (matches other methods)
 */

(function () {
    'use strict';

    if (typeof createTeachingMethod === 'undefined') {
        console.error('Core dependency "method-base.js" missing.');
        return;
    }

    const OptionSelectorFactory = function () {
        return createTeachingMethod('option-selector', {

            // ========== PRIVATE STATE ==========
            _config: null,
            _selectedIds: new Set(),
            _isComplete: false,

            // ========== LIFECYCLE ==========

            onInit: function (container, options = {}) {
                this._config = {
                    mode: options.mode || 'single', // 'single' or 'multi'
                    style: options.style || 'card', // 'card' (icons) or 'quiz' (text-only list)
                    question: options.question || 'Make a selection:',
                    options: options.options || [],
                    // Synthesis map for multi-choice (optional)
                    // Format: { "id1+id2": "Combined response text" }
                    synthesis: options.synthesis || {},
                    // Fallback text when no synthesis match
                    fallbackSynthesis: options.fallbackSynthesis || 'You have made your selections.',
                    confirmButtonText: options.confirmButtonText || 'Confirm'
                };

                this._selectedIds.clear();
                this._isComplete = false;

                // Set total steps (1 question = 1 step)
                this.setTotalSteps(1);

                // Render UI
                this._render(container);

                console.log('[OptionSelector] Initialized:', this._config.mode, 'mode with', this._config.options.length, 'options');
            },

            onDestroy: function () {
                // Cleanup handled by container removal
            },

            onReset: function () {
                this._selectedIds.clear();
                this._isComplete = false;
                const container = this._getState().container;
                if (container) {
                    this._render(container);
                }
            },

            // ========== STATE ==========

            getCustomState: function () {
                return {
                    selectedIds: Array.from(this._selectedIds),
                    isComplete: this._isComplete
                };
            },

            setCustomState: function (savedState) {
                if (savedState.selectedIds) {
                    this._selectedIds = new Set(savedState.selectedIds);
                }
                this._isComplete = savedState.isComplete || false;
            },

            // ========== RENDERING ==========

            _render: function (container) {
                container.innerHTML = '';

                // Wrapper
                const wrapper = document.createElement('div');
                wrapper.className = 'os-container';

                // Question
                const questionEl = document.createElement('div');
                questionEl.className = 'os-question';
                questionEl.innerHTML = this._config.question;
                wrapper.appendChild(questionEl);

                // Options Container - Grid for cards, List for quiz
                const optionsContainer = document.createElement('div');
                optionsContainer.className = this._config.style === 'quiz'
                    ? 'os-options-list'
                    : 'os-options-grid';

                this._config.options.forEach(opt => {
                    const optionEl = document.createElement('div');
                    optionEl.className = this._config.style === 'quiz'
                        ? 'os-option os-option-quiz'
                        : 'os-option';
                    optionEl.dataset.id = opt.id;

                    // Icon (only for card style)
                    if (this._config.style !== 'quiz' && opt.icon) {
                        const iconEl = document.createElement('div');
                        iconEl.className = 'os-option-icon';
                        iconEl.textContent = opt.icon;
                        optionEl.appendChild(iconEl);
                    }

                    // Label
                    const labelEl = document.createElement('div');
                    labelEl.className = 'os-option-label';
                    labelEl.textContent = opt.label;
                    optionEl.appendChild(labelEl);

                    // Click Handler
                    optionEl.addEventListener('click', () => this._handleOptionClick(opt.id, optionEl));

                    optionsContainer.appendChild(optionEl);
                });

                wrapper.appendChild(optionsContainer);

                // Response Area (hidden initially)
                const responseArea = document.createElement('div');
                responseArea.className = 'os-response-area';
                responseArea.style.display = 'none';
                wrapper.appendChild(responseArea);

                // Confirm Button (for BOTH modes now)
                const confirmBtn = document.createElement('button');
                confirmBtn.className = 'btn btn-primary os-confirm-btn';
                confirmBtn.textContent = this._config.confirmButtonText;
                confirmBtn.disabled = true;
                confirmBtn.addEventListener('click', () => this._handleConfirm());
                wrapper.appendChild(confirmBtn);

                container.appendChild(wrapper);
            },

            // ========== INTERACTION ==========

            _handleOptionClick: function (id, element) {
                if (this._isComplete) return;

                const container = this._getState().container;

                if (this._config.mode === 'single') {
                    // Clear previous selection
                    this._selectedIds.clear();
                    container.querySelectorAll('.os-option.selected').forEach(el => el.classList.remove('selected'));

                    // Select this one
                    this._selectedIds.add(id);
                    element.classList.add('selected');

                    // Show live response ONLY in card mode (quiz waits for Confirm)
                    if (this._config.style !== 'quiz') {
                        this._showResponse(id);
                    }

                } else {
                    // Toggle selection
                    if (this._selectedIds.has(id)) {
                        this._selectedIds.delete(id);
                        element.classList.remove('selected');
                    } else {
                        this._selectedIds.add(id);
                        element.classList.add('selected');
                    }

                    // Update live response preview ONLY in card mode
                    if (this._config.style !== 'quiz') {
                        this._showSynthesizedResponse(false);
                    }
                }

                // Enable/disable confirm button (both modes)
                const confirmBtn = container.querySelector('.os-confirm-btn');
                if (confirmBtn) {
                    confirmBtn.disabled = this._selectedIds.size === 0;
                }
            },

            _handleConfirm: function () {
                if (this._selectedIds.size === 0 || this._isComplete) return;

                // For quiz mode, show response on confirm (not before)
                // For card mode multi-select, replace live preview with synthesis
                if (this._config.style === 'quiz') {
                    if (this._config.mode === 'single') {
                        const selectedId = Array.from(this._selectedIds)[0];
                        this._showResponse(selectedId);
                    } else {
                        this._showSynthesizedResponse(true);
                    }
                } else if (this._config.mode === 'multi') {
                    // Card mode multi: replace individual responses with synthesis
                    this._showSynthesizedResponse(true);
                }

                // Hide confirm button
                const container = this._getState().container;
                const confirmBtn = container.querySelector('.os-confirm-btn');
                if (confirmBtn) confirmBtn.style.display = 'none';

                // Finalize
                this._complete();
            },

            _showResponse: function (singleId) {
                const container = this._getState().container;
                const responseArea = container.querySelector('.os-response-area');
                const option = this._config.options.find(o => o.id === singleId);

                if (option && option.response) {
                    responseArea.innerHTML = option.response;
                    responseArea.style.display = 'block';
                    responseArea.classList.add('active');
                }
            },

            _showSynthesizedResponse: function (hideConfirm = true) {
                const container = this._getState().container;
                const responseArea = container.querySelector('.os-response-area');

                // If nothing selected, hide response area
                if (this._selectedIds.size === 0) {
                    responseArea.style.display = 'none';
                    responseArea.classList.remove('active');
                    return;
                }

                // Build synthesis key (sorted IDs joined by +)
                const sortedIds = Array.from(this._selectedIds).sort();
                const key = sortedIds.join('+');

                let responseText = this._config.synthesis[key];

                // Fallback: If no exact synthesis match, concatenate individual responses
                if (!responseText) {
                    const parts = sortedIds.map(id => {
                        const opt = this._config.options.find(o => o.id === id);
                        return opt && opt.response ? opt.response : '';
                    }).filter(Boolean);

                    responseText = parts.length > 0
                        ? parts.join('<hr class="os-divider">')
                        : this._config.fallbackSynthesis;
                }

                responseArea.innerHTML = responseText;
                responseArea.style.display = 'block';
                responseArea.classList.add('active');

                // Optionally hide confirm button (only on final confirm)
                if (hideConfirm) {
                    const confirmBtn = container.querySelector('.os-confirm-btn');
                    if (confirmBtn) confirmBtn.style.display = 'none';
                }
            },

            _complete: function () {
                this._isComplete = true;
                this.advanceStep();
                this.markComplete();

                // Emit event with selection data
                this.emit('selectionMade', {
                    mode: this._config.mode,
                    selectedIds: Array.from(this._selectedIds)
                });
            }
        });
    };

    // ========== EXPORT ==========
    if (window.MethodLoader) {
        window.MethodLoader.registerFactory('option-selector', OptionSelectorFactory);
    } else {
        window.OptionSelectorFactory = OptionSelectorFactory;
    }

})();
