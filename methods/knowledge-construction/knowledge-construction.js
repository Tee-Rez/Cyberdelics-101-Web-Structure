/**
 * CYBERDELICS 101 - Knowledge Construction Method
 * "Learning by Making" - Drag and Drop Concept Builder
 * 
 * Dependencies:
 * - core/method-base.js (Factory)
 * - core/styles.css (Shared tokens)
 * - ./knowledge-construction.css (Method styles)
 */

(function () {
    'use strict';

    // Check dependencies
    if (typeof createTeachingMethod === 'undefined') {
        console.error('Core dependency "method-base.js" missing.');
        return;
    }

    /**
     * Knowledge Construction Implementation
     */
    const KnowledgeConstruction = {
        // ========== LIFECYCLE ==========

        onInit: function (container, options = {}) {
            // Private state for this instance
            this._state = {
                items: options.items || [], // [{id, text}, ...]
                slots: [], // DOM elements
                placedCount: 0,
                distractors: options.distractors || [] // Optional extra incorrect items
            };

            // 1. Setup DOM References
            this._elements = {
                container: container,
                zone: container.querySelector('.construction-zone'),
                bank: container.querySelector('.source-bank'),
                feedback: container.querySelector('.kc-feedback')
            };

            if (!this._elements.zone || !this._elements.bank) {
                console.error('KnowledgeConstruction: Missing .construction-zone or .source-bank in HTML');
                return;
            }

            // 2. Discover Slots
            this._state.slots = Array.from(this._elements.zone.querySelectorAll('.kc-slot'));
            this.setTotalSteps(this._state.slots.length); // 1 step per correct placement

            // 3. Prepare Items (Valid + Distractors)
            // If items not provided in options, try to infer from slots
            if (this._state.items.length === 0) {
                this._state.slots.forEach(slot => {
                    const id = slot.dataset.correct;
                    // Try to get text from data-text, or fallback to the id (capitalized)
                    const text = slot.dataset.text || id;
                    if (id) {
                        this._state.items.push({ id, text });
                    }
                });
            }

            // Add distractors if any
            if (this._state.distractors.length > 0) {
                this._state.items = [...this._state.items, ...this._state.distractors];
            }

            // Shuffle items
            this._shuffleItems(this._state.items);

            // 4. Render
            this._renderBank();
            this._setupDragAndDrop();

            // 5. Create Feedback Element if missing
            if (!this._elements.feedback) {
                const fb = document.createElement('div');
                fb.className = 'kc-feedback';
                this._elements.container.appendChild(fb);
                this._elements.feedback = fb;
            }
        },

        onReset: function () {
            // Return all items to bank
            this._state.slots.forEach(slot => {
                slot.innerHTML = '';
                slot.classList.remove('correct', 'incorrect');
                slot.removeAttribute('data-filled');
            });

            this._state.placedCount = 0;
            this._renderBank(); // Re-render all items

            if (this._elements.feedback) {
                this._elements.feedback.className = 'kc-feedback';
                this._elements.feedback.textContent = '';
            }
        },

        // ========== LOGIC ==========

        _shuffleItems: function (array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },

        _renderBank: function () {
            this._elements.bank.innerHTML = '<div class="source-bank-label">Available Concepts</div>';

            this._state.items.forEach(item => {
                // Check if this item is already placed (state restoration)
                const isPlaced = this._state.slots.some(slot => slot.dataset.filled === item.id);
                if (isPlaced) return;

                const el = document.createElement('div');
                el.className = 'kc-item';
                el.draggable = true;
                el.textContent = item.text;
                el.dataset.id = item.id;

                // Event Listeners for Item
                el.addEventListener('dragstart', (e) => this._handleDragStart(e));
                el.addEventListener('dragend', (e) => this._handleDragEnd(e));

                this._elements.bank.appendChild(el);
            });
        },

        _setupDragAndDrop: function () {
            this._state.slots.forEach(slot => {
                slot.addEventListener('dragover', (e) => this._handleDragOver(e));
                slot.addEventListener('dragleave', (e) => this._handleDragLeave(e));
                slot.addEventListener('drop', (e) => this._handleDrop(e));
            });

            // Allow dropping back to bank (reset)
            this._elements.bank.addEventListener('dragover', (e) => {
                e.preventDefault();
                this._elements.bank.classList.add('drag-active');
            });
            this._elements.bank.addEventListener('dragleave', (e) => {
                this._elements.bank.classList.remove('drag-active');
            });
            this._elements.bank.addEventListener('drop', (e) => {
                e.preventDefault();
                // We're not handling specific drop logic for bank yet, 
                // but this prevents it from bouncing if we want to support "undo" later
            });
        },

        // ========== EVENTS HANDLERS ==========

        _handleDragStart: function (e) {
            e.dataTransfer.setData('text/plain', e.target.dataset.id);
            // Store reference to the dragged element
            this._draggedEl = e.target;
            e.target.classList.add('dragging');

            // Add global class to emphasize drop zones
            this._elements.zone.classList.add('drag-active');
        },

        _handleDragEnd: function (e) {
            if (this._draggedEl) {
                this._draggedEl.classList.remove('dragging');
                this._draggedEl = null;
            }
            this._elements.zone.classList.remove('drag-active');

            // Clean up any hover states
            this._state.slots.forEach(s => s.classList.remove('drag-over'));
        },

        _handleDragOver: function (e) {
            e.preventDefault(); // Necessary to allow dropping
            const slot = e.target.closest('.kc-slot');
            if (slot && !slot.classList.contains('correct')) {
                slot.classList.add('drag-over');
            }
        },

        _handleDragLeave: function (e) {
            const slot = e.target.closest('.kc-slot');
            if (slot) {
                slot.classList.remove('drag-over');
            }
        },

        _handleDrop: function (e) {
            e.preventDefault();
            const slot = e.target.closest('.kc-slot');

            // Clean up UI
            if (slot) slot.classList.remove('drag-over');

            if (!slot || slot.classList.contains('correct')) return;

            const droppedId = e.dataTransfer.getData('text/plain');
            const targetId = slot.dataset.correct;

            this._validateMove(slot, droppedId, targetId);
        },

        _validateMove: function (slot, droppedId, targetId) {
            if (droppedId === targetId) {
                // Correct Match
                this._handleCorrect(slot, droppedId);
            } else {
                // Incorrect
                this._handleIncorrect(slot);
            }
        },

        _handleCorrect: function (slot, itemId) {
            // Find the original item element
            // Note: If using multiple items with same text, we need better lookup
            // But for now assuming ID is on the element

            // 1. Update Slot
            slot.classList.add('correct');
            slot.textContent = this._getItemText(itemId);
            slot.dataset.filled = itemId;

            // 2. Remove from Bank
            // Since we're moving it, we can just remove the original element from bank if it exists there
            const originalItem = this._elements.bank.querySelector(`.kc-item[data-id="${itemId}"]`);
            if (originalItem) {
                originalItem.remove();
            }

            // 3. Update Progress
            this.advanceStep();
            this._state.placedCount++;

            // 4. Feedback
            this._showFeedback("Correct!", "success");

            // 5. Completion Check
            if (this._state.placedCount >= this._state.slots.length) {
                this._showFeedback("Construction Complete!", "success");
                this.markComplete();
            }
        },

        _handleIncorrect: function (slot) {
            slot.classList.add('incorrect');
            this._showFeedback("Not quite right. Try again.", "error");

            setTimeout(() => {
                slot.classList.remove('incorrect');
            }, 500);
        },

        _getItemText: function (id) {
            const item = this._state.items.find(i => i.id === id);
            return item ? item.text : id;
        },

        _showFeedback: function (msg, type) {
            const fb = this._elements.feedback;
            fb.textContent = msg;
            fb.className = `kc-feedback show ${type}`;

            // Auto hide after 2s
            setTimeout(() => {
                fb.classList.remove('show');
            }, 2000);
        },

        // ========== STATE MANAGEMENT ==========

        getCustomState: function () {
            // Map slot index to filled item ID
            const filledSlots = {};
            this._state.slots.forEach((slot, index) => {
                if (slot.dataset.filled) {
                    filledSlots[index] = slot.dataset.filled;
                }
            });

            return {
                filledSlots: filledSlots
            };
        },

        setCustomState: function (savedState) {
            if (!savedState || !savedState.filledSlots) return;

            // Restore slots
            Object.keys(savedState.filledSlots).forEach(index => {
                const itemId = savedState.filledSlots[index];
                const slot = this._state.slots[index];

                if (slot) {
                    // Manually trigger correct placement logic without animation/feedback if preferred
                    // Or just set DOM directly
                    slot.classList.add('correct');
                    slot.textContent = this._getItemText(itemId);
                    slot.dataset.filled = itemId;
                    this._state.placedCount++;
                }
            });

            // Re-render bank to remove placed items
            this._renderBank();
        }
    };

    /**
     * Create the Method Instance/Prototype
     * Merges base functionality with our custom implementation
     */
    const KnowledgeConstructionMethod = createTeachingMethod('knowledge-construction', KnowledgeConstruction);

    /**
     * Auto-registry
     */
    if (window.MethodLoader) {
        window.MethodLoader.register('knowledge-construction', KnowledgeConstructionMethod);
    } else {
        // Fallback if loader not present
        window.KnowledgeConstructionMethod = KnowledgeConstructionMethod;
    }

})();
