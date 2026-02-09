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
            circleRadius: 70,
            maxDistance: 0.45, // % of width
            particleCount: 20,
            particleDistance: 20,
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
            this.host = host; // Reference to host for callbacks

            // Initialize State (Fresh per instance)
            this._state = {
                width: 0,
                height: 0,
                centerX: 0,
                centerY: 0,
                leftPos: { x: 0, y: 0 },
                rightPos: { x: 0, y: 0 },
                isDragging: false,
                particles: [],
                lastTime: 0,
                promptShown: true,
                completed: false,
                infoPanelShown: false,
                dragSnapped: false
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

            // 5. Initial Layout
            this.resize(container.clientWidth, container.clientHeight);

            console.log('[VennDiagram] Initialized in mode:', this.params.mode);
        },

        update: function (dt, params) {
            // Update params reference
            this.params = params;

            // Convert slider 0-100 to 0.0-1.0
            const progress = (params.mergeProgress || 0) / 100;

            // Visualization Update
            this._updatePositions(progress);
            this._updateVisuals(progress);

            // Particles
            this._updateParticles(dt);
        },

        draw: function (ctx, params) {
            // No-op (SVG based)
        },

        resize: function (width, height) {
            this._state.width = width;
            this._state.height = height;
            this._state.centerX = width / 2;
            this._state.centerY = height / 2; // Center vertically

            // Update SVG ViewBox
            if (this.svg) {
                this.svg.attr('viewBox', `0 0 ${width} ${height}`);
            }

            // Recalculate visuals immediately
            const progress = (this.params.mergeProgress || 0) / 100;
            this._updatePositions(progress);
            this._updateVisuals(progress);
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

            // Info Panel (HTML Overlay)
            this.infoPanel = document.createElement('div');
            this.infoPanel.className = 'venn-info-panel';
            this.container.appendChild(this.infoPanel);
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
            this.leftGroup = this.layers.circles.append('g').attr('class', 'venn-group left');
            this.leftCircle = this.leftGroup.append('circle')
                .attr('class', 'venn-circle glow venn-pulsing')
                .attr('r', radius)
                .attr('fill', 'url(#grad-left)');

            // Right Group
            this.rightGroup = this.layers.circles.append('g').attr('class', 'venn-group right');
            this.rightCircle = this.rightGroup.append('circle')
                .attr('class', 'venn-circle glow venn-pulsing')
                .attr('r', radius)
                .attr('fill', 'url(#grad-right)');

            // --- Labels ---
            this.leftLabel = this.layers.labels.append('text')
                .attr('class', 'venn-label main')
                .attr('fill', data.leftCircle.color)
                .attr('dy', '3.55em')
                .text(data.leftCircle.label);

            this.rightLabel = this.layers.labels.append('text')
                .attr('class', 'venn-label main')
                .attr('fill', data.rightCircle.color)
                .attr('dy', '3.55em')
                .text(data.rightCircle.label);

            this.mergedLabel = this.layers.labels.append('text')
                .attr('class', 'venn-label merged')
                .attr('fill', data.merged.color)
                .attr('dy', '0.35em')
                .text(data.merged.label);

            // --- Etymology Boxes ---
            this._createEtymologyBox(this.layers.ui, 'left', data.leftCircle);
            this._createEtymologyBox(this.layers.ui, 'right', data.rightCircle);

            // --- Drag Prompt ---
            this._createDragPrompt();
        },

        _createEtymologyBox: function (layer, side, data) {
            if (!data.etymology) return;

            const group = layer.append('g')
                .attr('class', `etymology-floating etymology-${side}`)
                .attr('opacity', 1); // Initially visible

            const width = 220;
            const height = 180;

            // Background
            group.append('rect')
                .attr('class', 'etymology-bg')
                .attr('width', width).attr('height', height)
                .attr('stroke', data.color);

            // Title
            group.append('text')
                .attr('class', 'etymology-title')
                .attr('x', 15).attr('y', 30)
                .attr('fill', data.color)
                .text(data.etymology.title);

            // Lines
            let y = 55;
            const lineHeight = 16;

            // Greek
            if (data.etymology.greek) {
                group.append('text').attr('class', 'etymology-text italic')
                    .attr('x', 15).attr('y', y).text(data.etymology.greek);
                y += lineHeight;
            }
            if (data.etymology.greekTransliteration) {
                group.append('text').attr('class', 'etymology-text')
                    .attr('x', 15).attr('y', y).text(data.etymology.greekTransliteration);
                y += lineHeight * 1.5;
            }

            // Meanings
            if (data.etymology.meanings) {
                data.etymology.meanings.forEach(line => {
                    // Simple wrap (naive)
                    if (line.length > 25) {
                        const words = line.split(' ');
                        let l = '';
                        words.forEach(w => {
                            if ((l + w).length > 25) {
                                group.append('text').attr('class', 'etymology-text').attr('x', 10).attr('y', y).text(l);
                                y += lineHeight;
                                l = w + ' ';
                            } else {
                                l += w + ' ';
                            }
                        });
                        if (l) {
                            group.append('text').attr('class', 'etymology-text').attr('x', 10).attr('y', y).text(l);
                            y += lineHeight;
                        }
                    } else {
                        group.append('text').attr('class', 'etymology-text').attr('x', 10).attr('y', y).text(line);
                        y += lineHeight;
                    }
                });
                y += 5;
            }

            // Concept
            if (data.etymology.concept) {
                group.append('text').attr('class', 'etymology-text bold')
                    .attr('x', 15).attr('y', y + 5)
                    .attr('fill', data.color) // Match circle color
                    .text('→ ' + data.etymology.concept);
            }

            // Store ref for updates
            this[`${side}EtymologyGroup`] = group;
            this[`${side}EtymologySize`] = { w: width, h: height };
            this[`${side}EtymologyGroup`] = group;
            this[`${side}EtymologySize`] = { w: width, h: height };
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
            const drag = d3.drag()
                .on('start', (event) => {
                    this._state.isDragging = true;
                    this._state.dragSnapped = false; // Reset snap state
                })
                .on('drag', (event) => this._handleDrag(event))
                .on('end', () => {
                    this._state.isDragging = false;
                    this._state.dragSnapped = false;
                });

            // Interaction to hide prompt
            // We'll also attach a clear-prompt listener to start
            drag.on('start.prompt', () => {
                if (this._state.promptShown && this.promptGroup) {
                    this.promptGroup.transition().duration(500).attr('opacity', 0).remove();
                    this._state.promptShown = false;
                }
            });

            this.leftGroup.call(drag);
            this.rightGroup.call(drag);
        },

        /* =========================================
           LOGIC METHODS
           ========================================= */

        _handleDrag: function (event) {
            // SNAP LOGIC: If we already snapped in this session, ignore
            if (this._state.dragSnapped) return;

            // Determine drag relative to center
            const dist = Math.abs(event.x - this._state.centerX);
            const maxDistPixels = this._state.width * (this.params.maxDistance / 2); // Half-distance from center per circle

            // Normalize to 0-1 (0 = wide apart, 1 = center)
            // Initial Pos = maxDistPixels away
            // Center = 0 away

            let progress = 1 - (dist / maxDistPixels);
            progress = Math.max(0, Math.min(1, progress));

            // SNAP LOGIC: If we hit 100%, stop dragging
            if (progress >= 0.99) {
                progress = 1;
                this._state.dragSnapped = true;
                this._state.isDragging = false;
            }

            // Update param via host
            // Ideally we call a host method to update the param, 
            // but for smooth drag we visually update immediately then sync
            this.params.mergeProgress = progress * 100;

            // Sync with Host (Slider)
            // Hacky: Dispatch input on slider if found
            const slider = this.container.closest('.interactive-simulation-container')?.querySelector('input[data-id="mergeProgress"]');
            if (slider) {
                slider.value = progress * 100;
                // slider.dispatchEvent(new Event('input')); // This loop-backs, careful
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

        _updateVisuals: function (progress) {
            const left = this._state.leftPos;
            const right = this._state.rightPos;
            const r = this.params.circleRadius;

            // 1. Move Circles
            this.leftGroup.attr('transform', `translate(${left.x}, ${left.y})`);
            this.rightGroup.attr('transform', `translate(${right.x}, ${right.y})`);

            // 2. Move Etymology Boxes
            if (this.leftEtymologyGroup) {
                const boxW = this.leftEtymologySize.w;
                // Moved further left and adjusted Y
                this.leftEtymologyGroup.attr('transform', `translate(${left.x - r - boxW - 30}, ${left.y - 90})`);
            }
            if (this.rightEtymologyGroup) {
                this.rightEtymologyGroup.attr('transform', `translate(${right.x + r + 30}, ${right.y - 90})`);
            }

            // 2b. Move Drag Prompt (if exists)
            if (this.promptGroup) {
                // Keep relative offset from left circle
                this.promptGroup.attr('transform', `translate(${left.x + 175}, ${left.y - r + 250})`);
            }

            // 3. Labels & Opacity logic
            const threshold = this.params.defaults ? this.params.defaults.labelFadeThreshold : 0.8;

            // Fade out individual labels
            let labelOpacity = 1;
            if (progress > threshold) {
                labelOpacity = 1 - ((progress - threshold) / (1 - threshold));
            }
            // Vesica Piscis mode keeps labels visible?
            if (this.params.mode === 'vesica-piscis' && progress > 0.9) {
                labelOpacity = 0.8; // Keep visible but slightly dim? Or fully visible
                // Actually user said: "The middle will have the new word, still showing the content of the other circles toward its side."
            }

            this.leftLabel.attr('opacity', labelOpacity);
            this.rightLabel.attr('opacity', labelOpacity);
            this.leftEtymologyGroup.attr('opacity', labelOpacity);
            this.rightEtymologyGroup.attr('opacity', labelOpacity);

            // FIX: Update Main Labels Position (Above circles)
            this.leftLabel
                .attr('x', left.x)
                .attr('y', left.y - r - 10)
                .attr('opacity', labelOpacity);

            this.rightLabel
                .attr('x', right.x)
                .attr('y', right.y - r - 10)
                .attr('opacity', labelOpacity);

            // 4. Merged Label
            let mergedOpacity = 0;
            if (progress > threshold) {
                mergedOpacity = (progress - threshold) / (1 - threshold);
            }

            this.mergedLabel
                .attr('x', this._state.centerX)
                .attr('y', this._state.centerY + r + 40) // Below circles
                .attr('opacity', this.params.mode === 'combined' ? mergedOpacity : 0);

            // 5. Info Panel / Synthesis
            if (progress > 0.95) {
                this._showInfoPanel(true);
            } else {
                this._showInfoPanel(false);
            }

            // 6. Section Complete Button
            if (progress >= 0.99 && !this._state.completed) {
                this._state.completed = true;
                this._showFinalButton();
            }

            // 6. Special Geometry (Vesica Piscis / Merged Shape)
            if (this.params.mode === 'vesica-piscis') {
                this._updateVesicaShape(left, right, r, progress);
            } else {
                // Combined Mode: Maybe Pulse?
                if (progress > 0.98) {
                    this.leftCircle.classed('merged', true);
                    this.rightCircle.classed('merged', true);
                } else {
                    this.leftCircle.classed('merged', false);
                    this.rightCircle.classed('merged', false);
                }
            }
        },

        _updateVesicaShape: function (p1, p2, r, progress) {
            // Draw the intersection lens
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            if (d < 2 * r) {
                // They overlap
                const path = d3.path();
                // Simple circle intersection math
                const a = (r * r - r * r + d * d) / (2 * d);
                const h = Math.sqrt(r * r - a * a);
                const x2 = p1.x + a * (p2.x - p1.x) / d;
                const y2 = p1.y + a * (p2.y - p1.y) / d;

                // Intersection points
                const x3_1 = x2 + h * (p2.y - p1.y) / d;
                const y3_1 = y2 - h * (p2.x - p1.x) / d;
                const x3_2 = x2 - h * (p2.y - p1.y) / d;
                const y3_2 = y2 + h * (p2.x - p1.x) / d;

                // Draw arc logic... actually D3 has no built-in shape for this easily
                // Simplified: Circle clip path?
                // Or: Calculate arc start/end angles
                // Angle to intersection
                const angle = Math.acos(d / (2 * r));

                // We'll trust the user's provided math from etymology visualizer (modified)
                // createVesicaPiscis(x1, y1, x2, y2, r)

                const angleRad = Math.atan2(dy, dx);

                path.moveTo(x3_1, y3_1);
                // Arc from p1 radius
                path.arc(p1.x, p1.y, r, -angle, angle);
                // Arc from p2 radius
                path.arc(p2.x, p2.y, r, Math.PI - angle, Math.PI + angle);
                path.closePath();

                this.vesicaPath
                    .attr('d', path.toString())
                    .attr('opacity', progress * 0.8);

                // Show Vesica Label (Center)
                if (progress > 0.8) {
                    this.mergedLabel
                        .attr('opacity', (progress - 0.8) * 5)
                        .attr('y', this._state.centerY + r + 40) // Below circles!
                        .style('font-size', '24px') // Larger
                        .text(this.data.merged.label);
                }
            } else {
                this.vesicaPath.attr('opacity', 0);
            }
        },

        _showInfoPanel: function (show) {
            if (show) {
                // Optimization: Only update if not already shown
                if (this._state.infoPanelShown) return;
                this._state.infoPanelShown = true;

                this.infoPanel.classList.add('visible');
                // Content population
                const d = this.data.merged;
                let html = `<div class="info-title" style="color:${d.color}">${d.label}</div>`;
                if (d.greek) html += `<div class="info-greek">${d.greek}</div>`;
                if (d.meaning) html += `<div class="info-meaning">${d.meaning}</div>`;

                if (d.synthesis && Array.isArray(d.synthesis)) {
                    html += `<div class="info-list">`;
                    d.synthesis.forEach(item => {
                        html += `<div class="info-list-item">• ${item}</div>`;
                    });
                    html += `</div>`;
                } else if (d.description) {
                    html += `<div class="info-meaning">${d.description}</div>`;
                }

                this.infoPanel.innerHTML = html;
                this.infoPanel.style.borderColor = d.color;
            } else {
                // Optimization: Only update if shown
                if (!this._state.infoPanelShown) return;
                this._state.infoPanelShown = false;

                this.infoPanel.classList.remove('visible');
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
            const newParticles = [];

            // Clear if too many (naive init)
            if (this._state.particles.length === 0) {
                for (let i = 0; i < count; i++) {
                    newParticles.push({
                        target: 'left',
                        angle: (Math.PI * 2 * i) / count,
                        speed: 0.01 + Math.random() * 0.01,
                        x: 0, y: 0,
                        color: this.data.leftCircle.color
                    });
                    newParticles.push({
                        target: 'right',
                        angle: (Math.PI * 2 * i) / count,
                        speed: -0.01 - Math.random() * 0.01, // Counter rotate
                        x: 0, y: 0,
                        color: this.data.rightCircle.color
                    });
                }
                this._state.particles = newParticles;
            }
        },

        _showCompleteButton: function () {
            const parent = this.container.parentNode;
            if (parent && parent.querySelector('.venn-complete-btn')) return;
            if (!parent && this.container.querySelector('.venn-complete-btn')) return;

            const btn = document.createElement('button');
            btn.className = 'venn-complete-btn';
            btn.textContent = 'SECTION COMPLETE';

            // Add to container
            if (parent) parent.appendChild(btn);
            else this.container.appendChild(btn);

            // Animate in
            requestAnimationFrame(() => {
                btn.classList.add('visible');
            });

            // Click Handler
            btn.onclick = () => {
                console.log('[VennDiagram] Section Complete clicked');
                if (this.host && this.host.markComplete) {
                    this.host.markComplete();
                } else {
                    // Fallback if host doesn't support markComplete
                    // Maybe advance step?
                    if (this.host && this.host.advanceStep) {
                        this.host.advanceStep();
                    }
                }
            };
        },

        _useFallbackData: function () {
            this.data = {
                leftCircle: { label: 'LEFT', color: '#00FFFF' },
                rightCircle: { label: 'RIGHT', color: '#FF00FF' },
                merged: { label: 'MERGED', color: '#FFFFFF' }
            };
        },

        _showFinalButton: function () {
            // Find Grandparent (Main Wrapper)
            const parent = this.container.parentNode;
            const grandparent = parent ? parent.parentNode : null;
            const target = grandparent || parent || this.container;

            if (target.querySelector('.venn-complete-btn')) return;

            const btn = document.createElement('button');
            btn.className = 'btn-continue venn-complete-btn'; // Use standard class + layout override
            btn.textContent = 'SECTION COMPLETE'; // Keep descriptive text, or use CONTINUE? User implied "button-continue" is the class.
            // "we should use that instead of ven diagram button"
            // I'll keep Section Complete text for now as it describes the action.

            target.appendChild(btn);

            requestAnimationFrame(() => {
                btn.classList.add('visible');
            });

            btn.onclick = () => {
                btn.classList.remove('visible');
                setTimeout(() => btn.remove(), 300);

                if (this.host && this.host.markComplete) {
                    this.host.markComplete();
                } else {
                    if (this.host && this.host.advanceStep) {
                        this.host.advanceStep();
                    }
                }
            };
        }
    };

    window.SimulationEngines['VennDiagramCombiner'] = VennDiagramCombiner;

})();
