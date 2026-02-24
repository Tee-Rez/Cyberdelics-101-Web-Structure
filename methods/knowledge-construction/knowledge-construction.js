/**
 * CYBERDELICS 101 - Knowledge Construction Method
 * "Learning by Making" - Drag and Drop Concept Builder
 *
 * Supports two modes:
 *  1. "categories" templateType  - Predefined layout built from manifest data
 *  2. Legacy raw HTML template   - Backward compat with old manifests (4.2.2 etc.)
 */

(function () {
    'use strict';

    if (typeof createTeachingMethod === 'undefined') {
        console.error('Core dependency "method-base.js" missing.');
        return;
    }

    const KnowledgeConstructionFactory = function () {
        return createTeachingMethod('knowledge-construction', {

            // ========== LIFECYCLE ==========

            onInit: function (container, options = {}) {
                // Robust data loading — handle options.content.* and options.*
                const content = options.content || {};
                const items = content.items || options.items || [];
                const distractors = content.distractors || options.distractors || [];
                const instruction = content.instruction || options.instruction || '';
                const template = content.template || options.template || '';
                const title = content.title || options.title || '';
                const templateType = content.templateType || options.templateType || '';
                const categories = content.categories || options.categories || [];

                // Store original correct items separately (needed to build category slots)
                this._state = {
                    items: [...items],   // will merge distractors below
                    correctItems: items,
                    slots: [],
                    placedCount: 0,
                    distractors: distractors,
                    categories: categories,
                    templateType: templateType
                };

                this._selectedItem = null;

                // 0. Build layout
                if (templateType === 'categories' && categories.length > 0) {
                    this._buildCategoriesLayout(container, { title, instruction, categories, items });
                } else if (template && container.querySelectorAll('.construction-zone').length === 0) {
                    this._render(container, { title, instruction, template });
                }

                // 1. Setup DOM references
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

                // 2. Discover slots
                this._state.slots = Array.from(this._elements.zone.querySelectorAll('.kc-slot'));
                this.setTotalSteps(this._state.slots.length);

                // 3. Merge distractors into items pool for the source bank
                if (distractors.length > 0) {
                    this._state.items = [...this._state.items, ...distractors];
                }

                this._shuffleItems(this._state.items);

                // 4. Render bank + wire up drag-and-drop
                this._renderBank();
                this._setupDragAndDrop();

                // 5. Ensure feedback element exists
                if (!this._elements.feedback) {
                    const fb = document.createElement('div');
                    fb.className = 'kc-feedback';
                    this._elements.container.appendChild(fb);
                    this._elements.feedback = fb;
                }
            },

            onReset: function () {
                this._state.slots.forEach(slot => {
                    slot.innerHTML = '';
                    slot.classList.remove('correct', 'incorrect');
                    slot.removeAttribute('data-filled');
                });
                this._state.placedCount = 0;
                this._renderBank();
                if (this._elements.feedback) {
                    this._elements.feedback.className = 'kc-feedback';
                    this._elements.feedback.textContent = '';
                }
            },

            // ========== LAYOUT BUILDERS ==========

            /**
             * Categories Template Mode
             * Builds a two-column layout: categories (left) + source bank (right)
             * Max 4 categories for clean grid layout.
             */
            _buildCategoriesLayout: function (container, { title, instruction, categories, items }) {
                // Map correct items to their categories
                const categoryItems = {};
                categories.forEach(cat => { categoryItems[cat.id] = []; });
                items.forEach(item => {
                    if (item.correctCategory && categoryItems[item.correctCategory] !== undefined) {
                        categoryItems[item.correctCategory].push(item.id);
                    }
                });

                // Cap at 4 categories
                const capped = categories.slice(0, 4);

                const categoriesHTML = capped.map(cat => {
                    const slotsHTML = (categoryItems[cat.id] || []).map(itemId =>
                        `<div class="kc-slot" data-correct="${itemId}"></div>`
                    ).join('');
                    return `
                        <div class="kc-category" data-category-id="${cat.id}" data-category-label="${cat.label}" style="--cat-color:${cat.color || '#7b5cff'}">
                            <div class="kc-category-label">${cat.label}</div>
                            <div class="kc-category-slots">${slotsHTML}</div>
                        </div>`;
                }).join('');

                container.innerHTML = `
                    <div class="knowledge-construction-container kc-categories-mode">
                        <div class="kc-header">
                            <h2 class="kc-title">${title}</h2>
                            <p class="kc-instruction">${instruction}</p>
                        </div>
                        <div class="construction-zone">
                            <div class="kc-workspace">
                                <div class="kc-categories-panel">${categoriesHTML}</div>
                                <div class="source-bank"></div>
                            </div>
                        </div>
                        <div class="kc-feedback"></div>
                    </div>`;
            },

            /**
             * Legacy Raw-HTML Template Mode (backward compat — used by 4.2.2 etc.)
             */
            _render: function (container, { title, instruction, template }) {
                container.innerHTML = `
                    <div class="knowledge-construction-container">
                        <div class="kc-header">
                            <h2 class="kc-title">${title || 'Knowledge Construction'}</h2>
                            <p class="kc-instruction">${instruction || ''}</p>
                        </div>
                        <div class="construction-zone">${template || ''}</div>
                        <div class="source-bank"></div>
                        <div class="kc-feedback"></div>
                    </div>`;
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
                    const isPlaced = this._state.slots.some(slot => slot.dataset.filled === item.id);
                    if (isPlaced) return;

                    const el = document.createElement('div');
                    el.className = 'kc-item';
                    el.draggable = true;
                    el.textContent = item.text;
                    el.dataset.id = item.id;
                    el.addEventListener('dragstart', (e) => this._handleDragStart(e));
                    el.addEventListener('dragend', (e) => this._handleDragEnd(e));
                    el.addEventListener('click', (e) => this._handleItemClick(e));
                    this._elements.bank.appendChild(el);
                });
            },

            _setupDragAndDrop: function () {
                this._state.slots.forEach(slot => {
                    slot.addEventListener('dragover', (e) => this._handleDragOver(e));
                    slot.addEventListener('dragleave', (e) => this._handleDragLeave(e));
                    slot.addEventListener('drop', (e) => this._handleDrop(e));
                    slot.addEventListener('click', (e) => this._handleSlotClick(e));
                });

                this._elements.bank.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    this._elements.bank.classList.add('drag-active');
                });
                this._elements.bank.addEventListener('dragleave', () => {
                    this._elements.bank.classList.remove('drag-active');
                });
                this._elements.bank.addEventListener('drop', (e) => {
                    e.preventDefault();
                });
            },

            // ========== CLICK / TAP INTERACTION ==========

            _handleItemClick: function (e) {
                e.stopPropagation();
                const item = e.currentTarget;

                // Clicking the already-selected item deselects it
                if (this._selectedItem === item) {
                    item.classList.remove('selected');
                    this._selectedItem = null;
                    this._elements.zone.classList.remove('has-selection');
                    return;
                }

                // Deselect previous
                if (this._selectedItem) {
                    this._selectedItem.classList.remove('selected');
                }

                // Select new item
                item.classList.add('selected');
                this._selectedItem = item;
                this._elements.zone.classList.add('has-selection');
            },

            _handleSlotClick: function (e) {
                const slot = e.currentTarget;
                if (!this._selectedItem || slot.classList.contains('correct')) return;

                const droppedId = this._selectedItem.dataset.id;

                // Clear selection before validating
                this._selectedItem.classList.remove('selected');
                this._selectedItem = null;
                this._elements.zone.classList.remove('has-selection');

                this._validateMove(slot, droppedId, slot.dataset.correct);
            },

            // ========== DRAG INTERACTION ==========

            _handleDragStart: function (e) {
                e.dataTransfer.setData('text/plain', e.target.dataset.id);
                this._draggedEl = e.target;
                e.target.classList.add('dragging');
                this._elements.zone.classList.add('drag-active');
            },

            _handleDragEnd: function (e) {
                if (this._draggedEl) {
                    this._draggedEl.classList.remove('dragging');
                    this._draggedEl = null;
                }
                this._elements.zone.classList.remove('drag-active');
                this._state.slots.forEach(s => s.classList.remove('drag-over'));
            },

            _handleDragOver: function (e) {
                e.preventDefault();
                const slot = e.target.closest('.kc-slot');
                if (slot && !slot.classList.contains('correct')) {
                    slot.classList.add('drag-over');
                }
            },

            _handleDragLeave: function (e) {
                const slot = e.target.closest('.kc-slot');
                if (slot) slot.classList.remove('drag-over');
            },

            _handleDrop: function (e) {
                e.preventDefault();
                const slot = e.target.closest('.kc-slot');
                if (slot) slot.classList.remove('drag-over');
                if (!slot || slot.classList.contains('correct')) return;

                const droppedId = e.dataTransfer.getData('text/plain');
                const targetId = slot.dataset.correct;
                this._validateMove(slot, droppedId, targetId);
            },

            _validateMove: function (slot, droppedId, targetId) {
                if (this._state.templateType === 'categories') {
                    // Categories mode: correct = dropped into a slot inside the right category
                    const item = this._state.correctItems.find(i => i.id === droppedId);
                    const correctCategory = item ? item.correctCategory : null;
                    const slotCategoryEl = slot.closest('.kc-category');
                    const slotCategoryId = slotCategoryEl ? slotCategoryEl.dataset.categoryId : null;

                    if (correctCategory && slotCategoryId && correctCategory === slotCategoryId) {
                        this._handleCorrect(slot, droppedId);
                    } else {
                        this._handleIncorrect(slot, droppedId);
                    }
                } else {
                    // Legacy template mode: exact slot match required
                    if (droppedId === targetId) {
                        this._handleCorrect(slot, droppedId);
                    } else {
                        this._handleIncorrect(slot, droppedId);
                    }
                }
            },

            _handleCorrect: function (slot, itemId) {
                slot.classList.add('correct');
                slot.textContent = this._getItemText(itemId);
                slot.dataset.filled = itemId;

                const originalItem = this._elements.bank.querySelector(`.kc-item[data-id="${itemId}"]`);
                if (originalItem) originalItem.remove();

                this.advanceStep();
                this._state.placedCount++;
                this._showFeedback('✓ Correct!', 'success');

                if (this._state.placedCount >= this._state.slots.length) {
                    setTimeout(() => {
                        this._showFeedback('✓ All placements complete!', 'success');
                        this.markComplete();
                    }, 600);
                }
            },

            /**
             * Wrong placement — shows which category the item actually belongs to.
             * Animates the slot with a shake + red flash, shows feedback toast.
             */
            _handleIncorrect: function (slot, droppedId) {
                // Look up correct category label (categories mode only)
                let correctLabel = null;
                if (droppedId) {
                    const correctSlot = this._elements.zone.querySelector(`.kc-slot[data-correct="${droppedId}"]`);
                    if (correctSlot) {
                        const catEl = correctSlot.closest('.kc-category');
                        if (catEl) correctLabel = catEl.dataset.categoryLabel;
                    }
                }

                const msg = correctLabel
                    ? `✗ Belongs in: ${correctLabel}`
                    : '✗ Try another category.';

                // Shake + flash the slot
                slot.classList.add('incorrect');
                setTimeout(() => slot.classList.remove('incorrect'), 700);

                this._showFeedback(msg, 'error');
            },

            _getItemText: function (id) {
                const item = this._state.items.find(i => i.id === id);
                return item ? item.text : id;
            },

            _showFeedback: function (msg, type) {
                const fb = this._elements.feedback;
                if (!fb) return;
                fb.textContent = msg;
                fb.className = `kc-feedback show ${type}`;
                clearTimeout(this._feedbackTimer);
                this._feedbackTimer = setTimeout(() => fb.classList.remove('show'), 3000);
            },

            // ========== STATE MANAGEMENT ==========

            getCustomState: function () {
                const filledSlots = {};
                this._state.slots.forEach((slot, index) => {
                    if (slot.dataset.filled) filledSlots[index] = slot.dataset.filled;
                });
                return { filledSlots };
            },

            setCustomState: function (savedState) {
                if (!savedState || !savedState.filledSlots) return;
                Object.keys(savedState.filledSlots).forEach(index => {
                    const itemId = savedState.filledSlots[index];
                    const slot = this._state.slots[index];
                    if (slot) {
                        slot.classList.add('correct');
                        slot.textContent = this._getItemText(itemId);
                        slot.dataset.filled = itemId;
                        this._state.placedCount++;
                    }
                });
                this._renderBank();
            }
        });
    };

    if (window.MethodLoader) {
        window.MethodLoader.registerFactory('knowledge-construction', KnowledgeConstructionFactory);
    }
    window.KnowledgeConstructionFactory = KnowledgeConstructionFactory;

})();
