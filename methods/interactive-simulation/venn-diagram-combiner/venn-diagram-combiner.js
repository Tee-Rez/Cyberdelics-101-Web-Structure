/**
 * Venn Diagram Combiner Engine
 * 
 * A reusable interactive simulation for exploring concept merging.
 * Supports 'combined' and 'vesica-piscis' modes.
 */

(function () {
    'use strict';

    // Ensure registry
    window.SimulationEngines = window.SimulationEngines || {};

    const VennDiagramCombiner = {
        name: 'Venn Diagram Combiner',
        showPlaybackControls: false,

        defaults: {
            mode: 'combined', // 'combined' | 'vesica-piscis'
            circleRadius: 210,
            maxDistance: 0.45, // % of width
            particleCount: 20,
            particleDistance: 60, // Scaled with radius (was 20 for r=70, now 60 for r=210)
            labelFadeThreshold: 0.8,
            mergeProgress: 0
        },

        config: [
            { id: 'mergeProgress', label: 'Merge Progress', min: 0, max: 100, step: 1 }
        ],

        // Instance State moved to init() to avoid prototype pollution
        /* _state: { ... }, */

        // Constants
        _CONST: {
            COLORS: {
                left: '#00D9FF',
                right: '#9D4EDD',
                merged: '#FFD700'
            }
        },

        /* =========================================
           LIFECYCLE METHODS
           ========================================= */

        init: function (container, params, host) {
            this.container = container;
            this.params = { ...this.defaults, ...params };
            this.host = host;

            // Initialize State
            this._state = {
                width: 0,
                height: 0,
                centerX: 0,
                centerY: 0,
                leftPos: { x: 0, y: 0 },
                rightPos: { x: 0, y: 0 },
                isDragging: false,
                particles: [],
                subWords: [], // Floating words
                circles: {
                    left: { locked: true, unlocked: false },
                    right: { locked: true, unlocked: false }
                },
                lastTime: 0,
                promptShown: false, // Don't show until both unlocked
                completed: false,
                dragSnapped: false,
                lastProgress: -1 // Track last progress to avoid redundant updates
            };

            // 1. Setup Container & SVG
            this._setupDOM();

            // 2. Load Data from Params
            this.data = this.params.data || {};
            if (!this.data.leftCircle || !this.data.rightCircle) {
                console.warn('[VennDiagram] Missing data structure. Using defaults.');
                this._useFallbackData();
            }

            // 3. Setup D3 Elements
            this._setupVisualization();

            // 4. Setup Interactions
            this._setupInteractions();

            // 5. Initial Layout & Observer
            this.resize(container.clientWidth, container.clientHeight);

            this.resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    this.resize(entry.contentRect.width, entry.contentRect.height);
                }
            });
            this.resizeObserver.observe(this.container);

            console.log('[VennDiagram] Initialized V2 in mode:', this.params.mode);
        },

        update: function (dt, params) {
            // CRITICAL FIX: The host animation loop passes mergeProgress: 0 every frame.
            // If user has dragged, _dragProgress is set and takes priority.
            if (this._state._dragProgress != null) {
                params = Object.assign({}, params, { mergeProgress: this._state._dragProgress });
            }

            // Merge incoming params with existing to preserve defaults
            this.params = { ...this.params, ...params };
            const progress = (this.params.mergeProgress || 0) / 100;

            // Only update visuals if progress changed
            if (progress !== this._state.lastProgress) {
                this._state.lastProgress = progress;
                this._updatePositions(progress);
                this._updateVisuals(progress);
            }

            // Particles & Floating Words (always update for animation)
            this._updateParticles(dt);
            this._updateSubWords(dt, progress);
        },

        draw: function (ctx, params) { },

        resize: function (width, height) {
            // Fallback for 0 dims
            if (!width || width === 0) width = this.container.clientWidth || 800;
            if (!height || height === 0) height = this.container.clientHeight || 600;

            this._state.width = width;
            this._state.height = height;
            this._state.centerX = width / 2;
            this._state.centerY = height / 2;

            this._state.isMobile = width < 600;

            if (this._state.isMobile) {
                this.params.circleRadius = Math.min(140, width * 0.35); // Mobile: ~35%
                this.params.maxDistance = 0.6;
            } else {
                this.params.circleRadius = Math.min(300, height * 0.35); // Desktop: ~35% (down from 45%)
                this.params.maxDistance = 0.55;
            }

            if (this.svg) {
                this.svg.attr('viewBox', `0 0 ${width} ${height}`);
            }

            // Don't update positions during active drag - it interferes
            if (this._state.isDragging) return;

            // Recalculate visuals
            const progress = (this.params.mergeProgress || 0) / 100;
            this._updatePositions(progress);
            this._updateVisuals(progress);
        },

        // ... (reset, destroy, setupDOM, etc.)

        _updateVisuals: function (progress) {
            // ... (keep existing moves)
            const left = this._state.leftPos;
            const right = this._state.rightPos;
            const r = this.params.circleRadius;

            // 1. Move Circles & Locks
            this.leftGroup.attr('transform', `translate(${left.x}, ${left.y})`);
            this.rightGroup.attr('transform', `translate(${right.x}, ${right.y})`);

            // 2. Labels Position
            this.leftLabel.attr('x', left.x).attr('y', left.y);
            this.rightLabel.attr('x', right.x).attr('y', right.y);

            // 3. Merged Label
            if (progress > 0.95) {
                this.mergedLabel
                    .attr('opacity', (progress - 0.95) * 20)
                    .attr('x', this._state.centerX)
                    .attr('y', this._state.centerY + 50)
                    .text(this.data.merged.definition || this.data.merged.label);
            } else {
                this.mergedLabel.attr('opacity', 0);
            }

            // 4. Vesica Shape
            this._updateVesicaShape(left, right, r, progress);

            // 5. Drag Prompt
            if (this.promptGroup) {
                this.promptGroup.attr('transform', `translate(${left.x + r + 40}, ${left.y - 40})`);
            }

            // 6. Complete Button
            if (progress >= 0.99 && !this._state.completed) {
                this._state.completed = true;
                this._showCompleteButton();
            }
        },

        _updateVesicaShape: function (p1, p2, r, progress) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            // Only draw if overlapping
            if (d < 2 * r) {
                const angle = Math.acos(d / (2 * r));
                const path = d3.path();
                path.arc(p1.x, p1.y, r, -angle, angle);
                path.arc(p2.x, p2.y, r, Math.PI - angle, Math.PI + angle);
                path.closePath();

                this.vesicaPath
                    .attr('d', path.toString())
                    // "vesica pieces should be created once they combine"
                    // User implies it should appear STRONGLY at the end.
                    // Let's keep it transparent during move, then solid/bright at end.
                    .attr('opacity', progress > 0.95 ? 1 : progress * 0.3)
                    .attr('fill', progress > 0.95 ? 'url(#grad-merged)' : 'none') // Only fill at end?
                    .attr('stroke', progress > 0.95 ? '#FFD700' : 'rgba(255, 215, 0, 0.5)')
                    .attr('stroke-width', progress > 0.95 ? 3 : 1);

                // If fully merged, maybe pulse?
                if (progress > 0.99) {
                    this.vesicaPath.classed('venn-pulsing', true);
                } else {
                    this.vesicaPath.classed('venn-pulsing', false);
                }
            } else {
                this.vesicaPath.attr('opacity', 0);
            }
        },

        reset: function () {
            // Reset flags
            this._state.completed = false;
            this._state.dragSnapped = false;
            this._state.isDragging = false;

            // Restore Prompt if missing
            if (this.promptGroup) this.promptGroup.remove(); // Remove old ref just in case
            this._createDragPrompt();
            this._state.promptShown = true;

            // Hide info panel
            this._showInfoPanel(false);

            // Re-initialze particles? 
            // Update will handle it.
        },

        destroy: function () {
            if (this.infoPanel) this.infoPanel.remove();
            // SVG is inside container, handled by host clearing container
        },

        /* =========================================
           SETUP METHODS
           ========================================= */

        _setupDOM: function () {
            // Clear container
            this.container.innerHTML = '';
            // Allow button to hang outside
            this.container.style.overflow = 'visible';

            // Create SVG
            this.svg = d3.select(this.container)
                .append('svg')
                .attr('class', 'venn-combiner-viz')
                .attr('width', '100%')
                .attr('height', '100%');

            // Add Filters (Glow)
            const defs = this.svg.append('defs');
            const filter = defs.append('filter')
                .attr('id', 'venn-glow')
                .attr('x', '-50%').attr('y', '-50%')
                .attr('width', '200%').attr('height', '200%');

            filter.append('feGaussianBlur')
                .attr('stdDeviation', '6')
                .attr('result', 'coloredBlur');

            const feMerge = filter.append('feMerge');
            feMerge.append('feMergeNode').attr('in', 'coloredBlur');
            feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

            // Add Gradients
            this._createGradient(defs, 'grad-left', this.params.data?.leftCircle?.color || this._CONST.COLORS.left);
            this._createGradient(defs, 'grad-right', this.params.data?.rightCircle?.color || this._CONST.COLORS.right);
            this._createGradient(defs, 'grad-merged', this.params.data?.merged?.color || this._CONST.COLORS.merged);

            // Create Layers
            this.layers = {
                geometry: this.svg.append('g').attr('class', 'layer-geometry'),
                particles: this.svg.append('g').attr('class', 'layer-particles'),
                circles: this.svg.append('g').attr('class', 'layer-circles'),
                labels: this.svg.append('g').attr('class', 'layer-labels'),
                ui: this.svg.append('g').attr('class', 'layer-ui')
            };

            // Info Panel (HTML Overlay) - Removed in V2
            // this.infoPanel = document.createElement('div');
            // this.infoPanel.className = 'venn-info-panel';
            // this.container.appendChild(this.infoPanel);
        },

        _createGradient: function (defs, id, color) {
            const grad = defs.append('radialGradient').attr('id', id);
            grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.8);
            grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0.3);
        },

        _setupVisualization: function () {
            const data = this.data;
            const radius = this.params.circleRadius;

            // --- Geometries (Vesica Piscis mainly) ---
            this.vesicaPath = this.layers.geometry.append('path')
                .attr('class', 'sacred-geometry-path')
                .attr('fill', 'url(#grad-merged)')
                .attr('opacity', 0);

            // --- Circles ---
            // Left Group
            this.leftGroup = this.layers.circles.append('g')
                .attr('class', 'venn-group left locked') // Start locked
                .attr('cursor', 'pointer'); // Clickable to unlock

            this.leftCircle = this.leftGroup.append('circle')
                .attr('class', 'venn-circle venn-pulsing')
                .attr('r', radius)
                .attr('fill', 'transparent') // Transparent for clicks
                .attr('stroke', data.leftCircle.color || '#00FFFF') // Fallback color
                .attr('stroke-width', 4) // Thicker stroke
                .attr('stroke-dasharray', '5,5');

            // Lock Icon (Simple Lock Path or Text)
            this.leftLock = this.leftGroup.append('text')
                .attr('class', 'venn-lock-icon')
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .text('🔒');

            // Right Group
            this.rightGroup = this.layers.circles.append('g')
                .attr('class', 'venn-group right locked')
                .attr('cursor', 'pointer');

            this.rightCircle = this.rightGroup.append('circle')
                .attr('class', 'venn-circle venn-pulsing')
                .attr('r', radius)
                .attr('fill', 'transparent')
                .attr('stroke', data.rightCircle.color || '#FF00FF')
                .attr('stroke-width', 4)
                .attr('stroke-dasharray', '5,5');

            this.rightLock = this.rightGroup.append('text')
                .attr('class', 'venn-lock-icon')
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .text('🔒');


            // --- Labels (Main Titles) ---
            // Initially visible even when locked? Or only after unlock?
            // "Before they can see the content... they have to unlock"
            // Maybe show Label but no content? Or just "???"
            // Lets show Label but dim, or just the lock.
            // User said: "Each circle will have the main word and then sub words... When unlocked the sub words will drift"
            // So Main Word might be visible or hidden. Let's make it visible but maybe opacity 0.5?

            this.leftLabel = this.layers.labels.append('text')
                .attr('class', 'venn-label main')
                .attr('fill', data.leftCircle.color)
                .attr('dy', '0.35em') // Center for now logic
                .attr('opacity', 0) // Hidden until unlock 
                .text(data.leftCircle.label);

            this.rightLabel = this.layers.labels.append('text')
                .attr('class', 'venn-label main')
                .attr('fill', data.rightCircle.color)
                .attr('dy', '0.35em')
                .attr('opacity', 0)
                .text(data.rightCircle.label);

            this.mergedLabel = this.layers.labels.append('text')
                .attr('class', 'venn-label merged')
                .attr('fill', data.merged.color)
                .attr('dy', '0.35em')
                .text(data.merged.label);

            // --- Sub-Words Container ---
            // Moved to 'circles' layer as per user request to be "with the layer-circles"
            // This ensures they are z-indexed with the circles (maybe behind labels/UI)
            this.subWordsContainer = this.layers.circles.append('g').attr('class', 'sub-words-container');

            // --- Drag Prompt (Created but hidden initially) ---
            this._createDragPrompt();
        },

        _unlockCircle: function (side) {
            if (this._state.circles[side].unlocked) return; // Already unlocked

            this._state.circles[side].locked = false;
            this._state.circles[side].unlocked = true;

            // Visual updates
            const group = side === 'left' ? this.leftGroup : this.rightGroup;
            const lock = side === 'left' ? this.leftLock : this.rightLock;

            // Remove Lock
            lock.transition().duration(500).attr('opacity', 0).remove();
            group.classed('locked', false);

            // Fade in Label
            const label = side === 'left' ? this.leftLabel : this.rightLabel;
            label.transition().duration(800).attr('opacity', 1);

            // Init Sub-words
            this._spawnSubWords(side);

            // Check if both unlocked -> Enable interactions
            if (this._state.circles.left.unlocked && this._state.circles.right.unlocked) {
                this._enableDragging();
            }
        },

        _spawnSubWords: function (side) {
            const data = side === 'left' ? this.data.leftCircle : this.data.rightCircle;
            if (!data.subWords) return;

            // Get current center to avoid 0,0 initialization
            const center = side === 'left' ? this._state.leftPos : this._state.rightPos;

            data.subWords.forEach((word, i) => {
                this._state.subWords.push({
                    text: word,
                    side: side,
                    x: center.x + (Math.random() - 0.5) * 40, // Start near center with slight spread
                    y: center.y + (Math.random() - 0.5) * 40,
                    // Velocity-based drift (brownian motion style)
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    phase: Math.random() * Math.PI * 2
                });
            });
        },

        _createDragPrompt: function () {
            // Create prompt near left circle, pointing right
            // Position HIGHER above the left circle
            const r = this.params.circleRadius;
            const startX = this._state.leftPos.x + 175;
            const startY = this._state.leftPos.y - r + 250; // Increased clearance

            const group = this.layers.ui.append('g')
                .attr('class', 'venn-drag-prompt')
                .attr('opacity', 1)
                .attr('transform', `translate(${startX}, ${startY})`);

            // Arrow (pointing right)
            group.append('path')
                .attr('d', 'M -10 0 L 10 0 M 0 -7 L 10 0 L 0 7') // Line + Head
                .attr('class', 'venn-drag-arrow')
                .attr('stroke', 'white')
                .attr('stroke-width', 2)
                .attr('fill', 'none');

            // Text
            group.append('text')
                .attr('class', 'venn-drag-text')
                .attr('y', -25) // Slightly higher text
                .text('DRAG TO COMBINE');

            this.promptGroup = group;
        },

        _setupInteractions: function () {
            // Click to Unlock
            this.leftGroup.on('click', () => this._unlockCircle('left'));
            this.rightGroup.on('click', () => this._unlockCircle('right'));

            // Dragging - Defined but only enabled when both unlocked
            // IMPORTANT: Use subject() to prevent D3 from automatically applying transforms
            this.dragBehavior = d3.drag()
                .subject(function () {
                    // Return current element position to prevent D3 auto-transform
                    const transform = d3.select(this).attr('transform');
                    return { x: 0, y: 0 }; // We handle positioning ourselves
                })
                .on('start', (event) => {
                    if (!this._state.circles.left.unlocked || !this._state.circles.right.unlocked) return;
                    this._state.isDragging = true;
                    this._state.dragSnapped = false;
                    // Store initial mouse position for accurate delta tracking
                    this._state.dragStartX = event.sourceEvent.clientX;
                    this._state.dragStartY = event.sourceEvent.clientY;
                })
                .on('drag', (event) => {
                    if (!this._state.circles.left.unlocked || !this._state.circles.right.unlocked) return;
                    if (this._state.isDragging) {
                        this._handleDrag(event);
                    }
                })
                .on('end', () => {
                    this._state.isDragging = false;
                    this._state.dragSnapped = false;
                });

            // Interaction to hide prompt
            this.dragBehavior.on('start.prompt', () => {
                if (this._state.promptShown && this.promptGroup) {
                    this.promptGroup.transition().duration(500).attr('opacity', 0).remove();
                    this._state.promptShown = false;
                }
            });
        },

        _enableDragging: function () {
            // Enable drag on groups
            this.leftGroup.call(this.dragBehavior);
            this.rightGroup.call(this.dragBehavior);

            // Show prompt
            if (this.promptGroup) {
                this.promptGroup.transition().delay(500).duration(500).attr('opacity', 1);
                this._state.promptShown = true;
            }
        },

        /* =========================================
           LOGIC METHODS
           ========================================= */

        _handleDrag: function (event) {
            // SNAP LOGIC: If we already snapped in this session, ignore
            if (this._state.dragSnapped) {
                return;
            }

            // D3 v7: event.x is cumulative delta, not position
            // Get actual mouse position from sourceEvent and convert to SVG coords
            const svgNode = this.svg.node();
            const pt = svgNode.createSVGPoint();
            pt.x = event.sourceEvent.clientX;
            pt.y = event.sourceEvent.clientY;
            const svgP = pt.matrixTransform(svgNode.getScreenCTM().inverse());

            // Determine drag relative to center
            const dist = Math.abs(svgP.x - this._state.centerX);
            const maxDistPixels = this._state.width * (this.params.maxDistance / 2); // Half-distance from center per circle

            // Normalize to 0-1 (0 = wide apart, 1 = center)
            let progress = 1 - (dist / maxDistPixels);
            progress = Math.max(0, Math.min(1, progress));



            // SNAP LOGIC: If we hit 100%, stop dragging
            if (progress >= 0.99) {
                progress = 1;
                this._state.dragSnapped = true;
                this._state.isDragging = false;

            }

            // Update param AND track drag progress separately
            this.params.mergeProgress = progress * 100;
            this._state._dragProgress = progress * 100;

            // Sync with slider
            const slider = this.container.closest('.interactive-simulation-container')?.querySelector('input[data-id="mergeProgress"]')
                || document.getElementById('progress');
            if (slider) {
                slider.value = progress * 100;
            }

            this.update(0, this.params);
        },

        _updatePositions: function (progress) {
            const width = this._state.width;
            const centerY = this._state.centerY;
            const maxSeparation = width * this.params.maxDistance; // Total distance between centers at 0%

            const currentSeparation = maxSeparation * (1 - progress);

            this._state.leftPos = { x: this._state.centerX - (currentSeparation / 2), y: centerY };
            this._state.rightPos = { x: this._state.centerX + (currentSeparation / 2), y: centerY };



            // In Vesica Piscis mode, we might stop separation before they fully merge?
            // Actually, Vesica Piscis IS a partial merge. 
            // But if slider goes to 100, they might overlap completely or stop at perfect vesica?
            // "Vesica Piscis" usually means centers are on each other's circumference.
            // That happens when distance == radius.
            // If radius = 70, distance should be 70.
            if (this.params.mode === 'vesica-piscis') {
                // If progress is 100%, match centers to radius distance
                const r = this.params.circleRadius;
                const minSeparation = r; // Perfect vesica piscis overlap distance
                const actualSeparation = currentSeparation * (currentSeparation > minSeparation ? 1 : 1);
                // Actually, let's map 0-100 to MaxSep -> MinSep (Vesica)
                const targetSep = minSeparation + (maxSeparation - minSeparation) * (1 - progress);

                this._state.leftPos.x = this._state.centerX - (targetSep / 2);
                this._state.rightPos.x = this._state.centerX + (targetSep / 2);

            }
        },

        _showCompleteButton: function () {
            // ... (Same as before, simplified for this snippet context? No, just keeping it consistent)
            const parent = this.container.parentNode;
            if (parent && parent.querySelector('.venn-complete-btn')) return;

            const btn = document.createElement('button');
            btn.className = 'venn-complete-btn';
            btn.textContent = 'SECTION COMPLETE';
            if (parent) parent.appendChild(btn);

            requestAnimationFrame(() => btn.classList.add('visible'));
            btn.onclick = () => this.host && this.host.markComplete ? this.host.markComplete() : null;
        },

        _updateVisuals: function (progress) {
            const left = this._state.leftPos;
            const right = this._state.rightPos;
            const r = this.params.circleRadius;

            // 1. Move Circles & Locks
            this.leftGroup.attr('transform', `translate(${left.x}, ${left.y})`);
            this.rightGroup.attr('transform', `translate(${right.x}, ${right.y})`);

            // Update Radius (Important for resize!)
            this.leftCircle.attr('r', r);
            this.rightCircle.attr('r', r);

            // 2. Labels Position
            // Label stays in center of circle? Or above?
            this.leftLabel.attr('x', left.x).attr('y', left.y);
            this.rightLabel.attr('x', right.x).attr('y', right.y);

            // Hide source labels when merging
            if (progress > 0.8) {
                const fade = 1 - (progress - 0.8) * 5; // 0.8->1.0 maps to 1->0
                this.leftLabel.attr('opacity', Math.max(0, fade));
                this.rightLabel.attr('opacity', Math.max(0, fade));
            } else {
                // If unlocked, show. If locked, hide? 
                // We rely on previous unlock logic setting opacity to 1.
                // We should only touch opacity if it was already 1. 
                // Ideally state-based, but for now reset to 1 if fully unlocked.
                if (this._state.circles.left.unlocked) this.leftLabel.attr('opacity', 1);
                if (this._state.circles.right.unlocked) this.rightLabel.attr('opacity', 1);
            }

            // 3. Merged Label (The Definition)
            // Shows only at the end
            if (progress > 0.95) {
                // Main Term - smaller to fit better
                const mergedOpacity = Math.min(1, (progress - 0.95) * 20);
                this.mergedLabel
                    .attr('opacity', mergedOpacity)
                    .attr('x', this._state.centerX)
                    .attr('y', this._state.centerY - 55)
                    .attr('font-size', '24px') // Reduced from 36px
                    .text(this.data.merged.label);

                // Definition - fit within vesica shape
                if (!this.definitionLabel) {
                    this.definitionLabel = this.layers.labels.append('text')
                        .attr('class', 'venn-definition')
                        .attr('text-anchor', 'middle')
                        .attr('fill', '#ffffff')
                        .attr('font-size', '13px') // Smaller for better fit
                        .attr('x', this._state.centerX)
                        .attr('y', this._state.centerY - 40)
                        .attr('dy', '0em')
                        .text(this.data.merged.definition);

                    // Wrap to narrower width to fit vesica shape (lens is narrower than full circle)
                    // At 100% merge, circles overlap significantly - use ~30% of width
                    this.definitionLabel.call(this._wrapText.bind(this), this._state.width * 0.2);
                }

                // Just update opacity, don't re-wrap every frame
                this.definitionLabel.attr('opacity', Math.min(1, (progress - 0.95) * 20));

            } else {
                this.mergedLabel.attr('opacity', 0);
                if (this.definitionLabel) this.definitionLabel.attr('opacity', 0);
            }

            // 4. Vesica Shape
            this._updateVesicaShape(left, right, r, progress);

            // 5. Drag Prompt
            if (this.promptGroup) {
                this.promptGroup.attr('transform', `translate(${left.x + r + 40}, ${left.y - 40})`);
            }

            // 6. Complete Button
            if (progress >= 0.99 && !this._state.completed) {
                this._state.completed = true;
                this._showCompleteButton();
            }
        },

        _updateVesicaShape: function (p1, p2, r, progress) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            // Only draw if overlapping
            if (d < 2 * r) {
                // Calculate intersection path (lens)
                // Using simple arc approximation for D3
                const angle = Math.acos(d / (2 * r));
                const path = d3.path();
                path.arc(p1.x, p1.y, r, -angle, angle);
                path.arc(p2.x, p2.y, r, Math.PI - angle, Math.PI + angle);
                path.closePath();

                this.vesicaPath
                    .attr('d', path.toString())
                    .attr('opacity', progress > 0.9 ? 1 : progress * 0.5);

                // If fully merged, show specific content?
                // Visuals handled in updateVisuals
            } else {
                this.vesicaPath.attr('opacity', 0);
            }
        },

        /* =========================================
           PARTICLE SYSTEM
           ========================================= */

        _updateParticles: function (dt) {
            // Re-spawn particles if needed
            const targetCount = this.params.particleCount;
            const currentCount = this._state.particles.length;

            if (currentCount < targetCount * 2) {
                this._spawnParticles();
            }

            const left = this._state.leftPos;
            const right = this._state.rightPos;
            const r = this.params.circleRadius + this.params.particleDistance;

            // Update Logic
            this._state.particles.forEach(p => {
                p.angle += p.speed * dt * 60; // frame norm

                const center = p.target === 'left' ? left : right;
                p.x = center.x + Math.cos(p.angle) * r;
                p.y = center.y + Math.sin(p.angle) * r;
            });

            // Render
            const particles = this.layers.particles.selectAll('.venn-particle')
                .data(this._state.particles);

            particles.enter()
                .append('circle')
                .attr('class', 'venn-particle')
                .attr('r', 2)
                .merge(particles)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('fill', d => d.color)
                .attr('opacity', 0.6);

            particles.exit().remove();
        },

        _spawnParticles: function () {
            const count = this.params.particleCount;
            // Always replenish to target * 2 (as used in update check)
            const targetTotal = count * 2;

            while (this._state.particles.length < targetTotal) {
                // Add pair
                this._state.particles.push({
                    target: 'left',
                    angle: Math.random() * Math.PI * 2,
                    speed: 0.01 + Math.random() * 0.01,
                    x: 0, y: 0,
                    color: this.data.leftCircle.color
                });
                this._state.particles.push({
                    target: 'right',
                    angle: Math.random() * Math.PI * 2,
                    speed: -0.01 - Math.random() * 0.01,
                    x: 0, y: 0,
                    color: this.data.rightCircle.color
                });
            }
        },

        _updateSubWords: function (dt, progress) {
            const r = this.params.circleRadius;
            const left = this._state.leftPos;
            const right = this._state.rightPos;
            const centerX = this._state.centerX;
            const centerY = this._state.centerY;

            const t = Date.now() / 1000;

            const subWordsSelection = this.subWordsContainer.selectAll('.venn-subword')
                .data(this._state.subWords);

            // Proper D3 enter-update pattern: merge BEFORE position updates
            subWordsSelection.enter()
                .append('text')
                .attr('class', 'venn-subword')
                .attr('fill', d => d.side === 'left' ? this.data.leftCircle.color : this.data.rightCircle.color)
                .attr('text-anchor', 'middle')
                .attr('opacity', 0)
                .text(d => d.text)
                .merge(subWordsSelection) // Merge here, BEFORE .each()
                .each((d, i, nodes) => {
                    // Brownian motion / random drift logic
                    const center = d.side === 'left' ? left : right;
                    const maxRadius = r * 0.75; // Keep within 75% of circle radius

                    // Apply random velocity changes (brownian motion)
                    d.vx += (Math.random() - 0.5) * 0.5;
                    d.vy += (Math.random() - 0.5) * 0.5;

                    // Damping to prevent excessive speed
                    const maxSpeed = 3;
                    const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
                    if (speed > maxSpeed) {
                        d.vx = (d.vx / speed) * maxSpeed;
                        d.vy = (d.vy / speed) * maxSpeed;
                    }

                    // Update position
                    d.x += d.vx;
                    d.y += d.vy;

                    // Bounce off circle boundaries
                    const dx = d.x - center.x;
                    const dy = d.y - center.y;
                    const distFromCenter = Math.sqrt(dx * dx + dy * dy);

                    if (distFromCenter > maxRadius) {
                        // Normalize and push back inside
                        const angle = Math.atan2(dy, dx);
                        d.x = center.x + Math.cos(angle) * maxRadius;
                        d.y = center.y + Math.sin(angle) * maxRadius;
                        // Reverse velocity (bounce)
                        d.vx *= -0.8;
                        d.vy *= -0.8;
                    }

                    // As progress increases, add attraction toward center
                    if (progress > 0) {
                        const pullStrength = progress * 0.3;
                        d.vx += (centerX - d.x) * pullStrength * 0.01;
                        d.vy += (centerY - d.y) * pullStrength * 0.01;
                    }

                    let finalX = d.x;
                    let finalY = d.y;

                    // At high progress, implode to center
                    if (progress >= 0.95) {
                        const implosionFactor = (progress - 0.95) * 20; // 0 to 1
                        finalX = d.x + (centerX - d.x) * implosionFactor;
                        finalY = d.y + (centerY - d.y) * implosionFactor;
                    }

                    d3.select(nodes[i])
                        .attr('x', finalX)
                        .attr('y', finalY)
                        .attr('opacity', progress > 0.95 ? 0 : 0.8); // Fade out at end
                });

            subWordsSelection.exit().remove();
        },

        _useFallbackData: function () {
            this.data = {
                leftCircle: { label: 'LEFT', color: '#00FFFF' },
                rightCircle: { label: 'RIGHT', color: '#FF00FF' },
                merged: { label: 'MERGED', color: '#FFFFFF' }
            };
        },

        _showFinalButton: function () {
            // ... (existing code)
            const parent = this.container.parentNode;
            const btn = document.createElement('button');
            btn.className = 'venn-complete-btn';
            btn.textContent = 'SECTION COMPLETE';
            if (parent) parent.appendChild(btn);
            requestAnimationFrame(() => btn.classList.add('visible'));
            btn.onclick = () => this.host && this.host.markComplete ? this.host.markComplete() : null;
        },

        _wrapText: function (text, width) {
            text.each(function () {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.2, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy") || 0),
                    tspan = text.text(null).append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }
    };

    window.SimulationEngines['VennDiagramCombiner'] = VennDiagramCombiner;

})();
