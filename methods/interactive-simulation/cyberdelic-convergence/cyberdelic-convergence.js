/**
 * Cyberdelic Convergence - Simulation Engine
 * Registers itself to window.SimulationEngines
 * 
 * Adapted from standalone version to fit InteractiveSimulation framework.
 */
(function () {

    // Ensure registry
    window.SimulationEngines = window.SimulationEngines || {};

    /* ============================================
       DATA STRUCTURE (Preserved)
       ============================================ */
    // Use external data
    const DATA = window.CyberdelicData;


    // Base Config (Defaults)
    const BASE_CONFIG = {
        svg: { width: 1000, height: 800, centerX: 500, centerY: 400 },
        nodes: { domainRadius: 60, centerRadiusMin: 20, centerRadiusMax: 80, orbitRadius: 300 },
        connections: { minWidth: 1, maxWidth: 8 },
        timeline: { startYear: 2015, endYear: 2025 },
        styles: {
            labelSize: 10,
            centerLabelSize: 10,
            contentHeaderSize: 7,
            contentTextSize: 5.5
        }
    };

    /**
     * ENGINE DEFINITION
     */
    window.SimulationEngines['CyberdelicConvergence'] = {
        name: 'Cyberdelic Convergence',
        showPlaybackControls: false,

        defaults: {
            year: 2015
        },

        config: [
            { id: 'year', label: 'Timeline Year', min: 2015, max: 2025, step: 1 }
        ],

        // Instance State
        svg: null,
        domainPositions: [],
        particles: [],
        lastSpawnTime: 0,
        isZoomed: false,
        zoomedNode: null,
        selectedNode: null,
        simConfig: null, // Instance copy of BASE_CONFIG

        init: function (container, params) {
            if (!window.CyberdelicData) {
                console.error('CyberdelicData not loaded!');
                return;
            }

            // 0. Clone Config
            this.simConfig = JSON.parse(JSON.stringify(BASE_CONFIG));

            // 1. Create SVG Container if not exists
            let svg = container.querySelector('svg.convergence-viz');
            if (!svg) {
                // Clear container (it might have canvas from previous sim)
                container.innerHTML = '';
                svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('class', 'convergence-viz');
                svg.setAttribute('viewBox', `0 0 ${this.simConfig.svg.width} ${this.simConfig.svg.height}`);
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                svg.style.width = '100%';
                svg.style.height = '100%';
                svg.style.background = 'radial-gradient(circle at center, rgba(157, 78, 221, 0.1) 0%, rgba(10, 10, 15, 0.5) 100%)';
                container.appendChild(svg);
            }
            this.svg = svg;

            // 2. Setup Interactions (Click background to deselect)
            this.svg.addEventListener('click', (e) => {
                if (e.target === this.svg) {
                    this.zoomOut();
                }
            });

            // 3. Init Visualization
            this._calculatePositions();
            this._createConnections();
            this._createCenterNode();
            this._createDomainNodes();

            // 4. Initial Update
            this.update(0, params);

            console.log('[CyberdelicConvergence] Initialized');

            // 5. Init Tutorial
            this.initTutorial();
            this.initHelp();
            this._setupKeyboard();
        },

        resize: function (width, height) {
            // Responsive Logic
            const isMobile = width < 600;

            if (isMobile) {
                // Mobile Adjustments (Scale up text relative to SVG viewbox)
                this.simConfig.styles.labelSize = 24;
                this.simConfig.styles.centerLabelSize = 20;
                this.simConfig.styles.contentHeaderSize = 14;
                this.simConfig.styles.contentTextSize = 12;
            } else {
                // Desktop Reset
                this.simConfig.styles.labelSize = 10;
                this.simConfig.styles.centerLabelSize = 10;
                this.simConfig.styles.contentHeaderSize = 7;
                this.simConfig.styles.contentTextSize = 5.5;
            }

            // Re-render text elements that depend on these sizes
            // For simplicity, we can re-create the static nodes or update them selectors
            this.svg.querySelectorAll('.node-label').forEach(txt => {
                // Assuming standard label
                txt.setAttribute('font-size', this.simConfig.styles.labelSize); // SVG specific prop
                // Also might need to adjust spacing
            });

            // Re-create Center Node to update label
            const centerGroup = this.svg.getElementById('center-node');
            if (centerGroup) centerGroup.remove();
            this._createCenterNode();

            // Refine: Update content rings if zoomed
            if (this.isZoomed && this.zoomedNode) {
                this._createContentTags(this.zoomedNode);
            }
        },

        update: function (dt, params) {
            const year = Math.round(params.year);
            const yearChanged = this.lastYear !== year;

            this.lastYear = year; // Track for content updates
            // Visual Update for Year
            this._updateVisualization(year);

            // Particle System
            this._updateParticles(dt, year);
            this._renderParticles(year);

            // Update Zoomed Content if year changed
            if (this.isZoomed && yearChanged) {
                this._createContentTags(this.zoomedNode);
            }
        },

        draw: function (ctx, params) {
            // No Canvas Drawing needed, we use SVG DOM
        },

        // ========== IMPLEMENTATION ==========

        _calculatePositions: function () {
            this.domainPositions = DATA.domains.map(domain => {
                const angleRad = (domain.angle * Math.PI) / 180;
                return {
                    ...domain,
                    x: this.simConfig.svg.centerX + this.simConfig.nodes.orbitRadius * Math.cos(angleRad),
                    y: this.simConfig.svg.centerY + this.simConfig.nodes.orbitRadius * Math.sin(angleRad)
                };
            });
        },

        _getConnectionStrength: function (connection, year) {
            if (year < connection.yearAppears) return 0;
            if (connection.strengthByYear[year] !== undefined) return connection.strengthByYear[year];

            // Interpolate
            const years = Object.keys(connection.strengthByYear).map(Number).sort((a, b) => a - b);
            const lower = years.filter(y => y <= year).pop() || years[0];
            const upper = years.find(y => y >= year) || years[years.length - 1];
            if (lower === upper) return connection.strengthByYear[lower];

            const ratio = (year - lower) / (upper - lower);
            return connection.strengthByYear[lower] + (connection.strengthByYear[upper] - connection.strengthByYear[lower]) * ratio;
        },

        _createConnections: function () {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.id = 'connections-group';

            DATA.connections.forEach((conn, i) => {
                const src = this.domainPositions.find(d => d.id === conn.source);
                const tgt = this.domainPositions.find(d => d.id === conn.target);
                if (!src || !tgt) return;

                // Glow
                const glow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                glow.classList.add('connection-glow');
                glow.id = `conn-glow-${i}`;
                glow.setAttribute('x1', src.x); glow.setAttribute('y1', src.y);
                glow.setAttribute('x2', tgt.x); glow.setAttribute('y2', tgt.y);
                glow.setAttribute('stroke', '#00D9FF');
                glow.style.filter = 'blur(4px)';
                g.appendChild(glow);

                // Line
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.classList.add('connection-line');
                line.id = `conn-${i}`;
                line.setAttribute('x1', src.x); line.setAttribute('y1', src.y);
                line.setAttribute('x2', tgt.x); line.setAttribute('y2', tgt.y);
                line.setAttribute('stroke', '#00D9FF');
                g.appendChild(line);
            });

            this.svg.appendChild(g);
        },

        _createCenterNode: function () {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.id = 'center-node';

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.id = 'center-circle';
            circle.setAttribute('cx', this.simConfig.svg.centerX);
            circle.setAttribute('cy', this.simConfig.svg.centerY);
            circle.setAttribute('fill', 'rgba(255,255,255,0.15)');
            circle.setAttribute('stroke', 'white');
            g.appendChild(circle);

            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.textContent = 'CYBERDELICS';
            label.setAttribute('x', this.simConfig.svg.centerX);
            label.setAttribute('y', this.simConfig.svg.centerY);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('dy', '0.35em');
            label.setAttribute('fill', 'white');
            label.setAttribute('font-size', this.simConfig.styles.centerLabelSize); // Dynamic Size
            label.style.pointerEvents = 'none';
            g.appendChild(label);

            this.svg.appendChild(g);
        },

        _createDomainNodes: function () {
            this.domainPositions.forEach(d => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.classList.add('domain-node');
                g.dataset.id = d.id;

                // Circle
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.classList.add('node-circle');
                circle.setAttribute('cx', d.x);
                circle.setAttribute('cy', d.y);
                circle.setAttribute('r', this.simConfig.nodes.domainRadius);
                circle.setAttribute('fill', d.color);
                circle.setAttribute('fill-opacity', 0.3);
                circle.setAttribute('stroke', d.color);
                circle.setAttribute('stroke-width', 3);
                g.appendChild(circle);

                // Label
                const lines = d.name.split('\n');
                lines.forEach((line, i) => {
                    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    txt.classList.add('node-label');
                    txt.setAttribute('x', d.x);
                    txt.setAttribute('y', d.y + (i - (lines.length - 1) / 2) * (this.simConfig.styles.labelSize * 1.8)); // Spacing relative to font
                    txt.setAttribute('text-anchor', 'middle');
                    txt.setAttribute('fill', d.color);
                    txt.setAttribute('font-size', this.simConfig.styles.labelSize); // Dynamic Size
                    txt.textContent = line;
                    g.appendChild(txt);
                });

                // Interaction
                g.onclick = (e) => {
                    e.stopPropagation();
                    this.zoomToNode(d.id);
                };

                this.svg.appendChild(g);
            });
        },

        _updateVisualization: function (year) {
            // Update Connections
            DATA.connections.forEach((conn, i) => {
                const strength = this._getConnectionStrength(conn, year);
                const line = this.svg.getElementById(`conn-${i}`);
                const glow = this.svg.getElementById(`conn-glow-${i}`);
                if (line && glow) {
                    const width = this.simConfig.connections.minWidth + (this.simConfig.connections.maxWidth - this.simConfig.connections.minWidth) * strength;
                    line.setAttribute('stroke-width', width);
                    line.setAttribute('opacity', strength * 0.8);
                    glow.setAttribute('stroke-width', width + 4);
                    glow.setAttribute('opacity', strength * 0.3);
                }
            });

            // Update Center
            const progress = (year - this.simConfig.timeline.startYear) / (this.simConfig.timeline.endYear - this.simConfig.timeline.startYear);
            const size = this.simConfig.nodes.centerRadiusMin + (this.simConfig.nodes.centerRadiusMax - this.simConfig.nodes.centerRadiusMin) * progress;
            const circle = this.svg.getElementById('center-circle');
            if (circle) circle.setAttribute('r', size);
        },

        // ========== PARTICLES ==========

        _updateParticles: function (dt, year) {
            // Spawn logic
            if (performance.now() - this.lastSpawnTime > 150) {
                this.lastSpawnTime = performance.now();
                this._spawnParticle(year);
            }

            // Move logic
            this.particles.forEach(p => {
                p.progress += 0.005; // speed
                if (p.progress >= 1) p.dead = true;
            });

            this.particles = this.particles.filter(p => !p.dead);
        },

        _spawnParticle: function (year) {
            const activeRefs = DATA.connections
                .map((c, i) => ({ c, i, s: this._getConnectionStrength(c, year) }))
                .filter(x => x.s > 0.1);

            if (activeRefs.length === 0) return;

            const pick = activeRefs[Math.floor(Math.random() * activeRefs.length)];
            const src = this.domainPositions.find(d => d.id === pick.c.source);

            this.particles.push({
                x: src.x,
                y: src.y,
                tx: this.simConfig.svg.centerX,
                ty: this.simConfig.svg.centerY,
                progress: 0,
                color: '#00D9FF'
            });
        },

        _renderParticles: function (year) {
            let g = this.svg.getElementById('particle-group');
            if (!g) {
                g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.id = 'particle-group';
                this.svg.insertBefore(g, this.svg.getElementById('center-node')); // Behind center
            }

            // Clear old (inefficient but safe for SVG refactor)
            g.innerHTML = '';

            this.particles.forEach(p => {
                const cx = p.x + (p.tx - p.x) * p.progress;
                const cy = p.y + (p.ty - p.y) * p.progress;

                const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                c.setAttribute('cx', cx);
                c.setAttribute('cy', cy);
                c.setAttribute('r', 2.5);
                c.setAttribute('fill', p.color);
                c.setAttribute('opacity', 1 - p.progress); // Fade out
                g.appendChild(c);
            });
        },

        // ========== ZOOM ==========

        zoomToNode: function (id) {
            if (this.isZoomed && this.zoomedNode === id) {
                this.zoomOut();
                return;
            }

            const domain = this.domainPositions.find(d => d.id === id);
            if (!domain) return;

            this.isZoomed = true;
            this.zoomedNode = id;

            // Calculate ViewBox
            const size = 330; // Tighter zoom (was 300)
            const vb = `${domain.x - size / 2} ${domain.y - size / 2} ${size} ${size}`;

            this.svg.style.transition = 'viewBox 0.8s ease';
            this.svg.setAttribute('viewBox', vb);

            // Fade others
            this.svg.querySelectorAll('.domain-node').forEach(n => {
                n.style.opacity = (n.dataset.id === id) ? 1 : 0.1;
                n.style.pointerEvents = (n.dataset.id === id) ? 'auto' : 'none';
            });

            // Show content rings
            this._createContentTags(id);
        },

        // ========== RICH CONTENT UTILS ==========

        _getContentForYear: function (domainId, year) {
            if (!DATA || !DATA.domainDetails) return null;
            const details = DATA.domainDetails[domainId];
            if (!details) return null;

            if (!details.contentByYear) return details; // Fallback to flat if no year data

            const availYears = Object.keys(details.contentByYear).map(Number).sort((a, b) => a - b);
            let selectedYear = null;
            // Find most recent year <= current
            for (let i = availYears.length - 1; i >= 0; i--) {
                if (availYears[i] <= year) {
                    selectedYear = availYears[i];
                    break;
                }
            }
            if (selectedYear !== null) return details.contentByYear[selectedYear];
            return details; // Fallback
        },

        _wrapText: function (text, maxWidth, fontSize) {
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';

            // Temp text for measuring
            const temp = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            temp.setAttribute('font-size', fontSize);
            temp.style.visibility = 'hidden';
            this.svg.appendChild(temp);

            words.forEach(word => {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                temp.textContent = testLine;
                if (temp.getComputedTextLength() > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            });
            if (currentLine) lines.push(currentLine);
            temp.remove();
            return lines;
        },

        _getVisibleBounds: function () {
            // Because we might be zoomed, getting the viewBox is best
            const vb = this.svg.getAttribute('viewBox').split(' ').map(Number);
            return { x: vb[0], y: vb[1], width: vb[2], height: vb[3] };
        },

        _createContentTags: function (id) {
            // Clear existing rings first
            const existing = this.svg.querySelector('#content-rings');
            if (existing) existing.remove();

            const data = this._getContentForYear(id, this.lastYear || 2015);
            if (!data) return;

            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.id = 'content-rings';
            g.classList.add('content-rings', 'visible');

            const domain = this.domainPositions.find(d => d.id === id);
            // We use fixed bounds relative to the viewbox size we know we set (220)
            const bounds = { width: 220, height: 220 };

            // Dimensions tailored for the zoomed view (Size 330 viewbox)
            // Increased widths to accommodate text better
            const horizontalBoxWidth = bounds.width * 0.70; // Wider (was 0.55)
            const horizontalBoxHeight = bounds.height * 0.35;
            const verticalBoxWidth = bounds.width * 0.35; // Wider (was 0.35)
            const verticalBoxHeight = bounds.height * 0.70;

            // Distances from center
            const radius = this.simConfig.nodes.domainRadius + 5;
            const topDist = radius + 20; // Pushed out slightly
            const sideDist = radius + 15;

            // 1. Contributions (Top)
            if (data.contributions) {
                const x = domain.x - (horizontalBoxWidth / 2);
                const y = domain.y - topDist - horizontalBoxHeight;
                g.appendChild(this._createBox(x, y, horizontalBoxWidth, horizontalBoxHeight, data.contributions, domain.color, 'CONTRIBUTIONS', 'list'));
            }

            // 2. People (Right)
            if (data.keyPeople) {
                const items = data.keyPeople;
                const x = domain.x + sideDist;
                const y = domain.y - (verticalBoxHeight / 2);
                g.appendChild(this._createBox(x, y, verticalBoxWidth, verticalBoxHeight, items, domain.color, 'KEY PEOPLE', 'people'));
            }

            // 3. Tech (Bottom)
            if (data.technologies) {
                const items = data.technologies;
                const x = domain.x - (horizontalBoxWidth / 2);
                const y = domain.y + topDist;
                g.appendChild(this._createBox(x, y, horizontalBoxWidth, horizontalBoxHeight, items, domain.color, 'TECHNOLOGIES', 'list'));
            }

            // 4. Examples (Left)
            if (data.examples) {
                const x = domain.x - sideDist - verticalBoxWidth;
                const y = domain.y - (verticalBoxHeight / 2);
                g.appendChild(this._createBox(x, y, verticalBoxWidth, verticalBoxHeight, data.examples, domain.color, 'EXAMPLES', 'cards'));
            }

            this.svg.appendChild(g);
        },

        _createBox: function (x, y, w, h, items, color, title, type) {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.classList.add('content-section');

            // BG
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x); rect.setAttribute('y', y);
            rect.setAttribute('width', w); rect.setAttribute('height', h);
            rect.setAttribute('rx', 6);
            rect.setAttribute('fill', 'rgba(10,10,15,0.90)'); // Slightly more opaque
            rect.setAttribute('stroke', color);
            rect.setAttribute('stroke-width', 2);
            g.appendChild(rect);

            // Title
            const header = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            header.textContent = title;
            header.setAttribute('x', x + w / 2);
            header.setAttribute('y', y + 14);
            header.setAttribute('text-anchor', 'middle');
            header.setAttribute('fill', color);
            header.setAttribute('font-weight', 'bold');
            header.setAttribute('font-size', this.simConfig.styles.contentHeaderSize); // Dynamic
            g.appendChild(header);

            // Divider
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x + 8); line.setAttribute('y1', y + 20);
            line.setAttribute('x2', x + w - 8); line.setAttribute('y2', y + 20);
            line.setAttribute('stroke', color);
            line.setAttribute('opacity', 0.3);
            g.appendChild(line);

            // Content
            let curY = y + 30;
            const maxY = y + h - 5;
            const fontSize = this.simConfig.styles.contentTextSize; // Dynamic
            const padding = 10;
            const textWidth = w - (padding * 2);

            if (type === 'list') {
                items.forEach(item => {
                    if (curY >= maxY) return;
                    const lines = this._wrapText('• ' + item, textWidth, fontSize);
                    lines.forEach(l => {
                        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        t.textContent = l;
                        t.setAttribute('x', x + padding); t.setAttribute('y', curY);
                        t.setAttribute('fill', 'white');
                        t.setAttribute('font-size', fontSize);
                        g.appendChild(t);
                        curY += 7;
                    });
                    curY += 2;
                });
            } else if (type === 'people') {
                items.forEach(p => {
                    if (curY >= maxY) return;

                    const nameStr = typeof p === 'string' ? p : p.name;
                    const nameLines = this._wrapText(nameStr, textWidth, fontSize + 0.5);

                    nameLines.forEach(l => {
                        const tn = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        tn.textContent = l;
                        tn.setAttribute('x', x + padding); tn.setAttribute('y', curY);
                        tn.setAttribute('fill', color); tn.setAttribute('font-weight', 'bold');
                        tn.setAttribute('font-size', fontSize + 0.5);
                        g.appendChild(tn);
                        curY += 8;
                    });

                    if (typeof p !== 'string' && p.role) {
                        const roleLines = this._wrapText(p.role, textWidth, fontSize);
                        roleLines.forEach(l => {
                            const tr = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                            tr.textContent = l;
                            tr.setAttribute('x', x + padding); tr.setAttribute('y', curY);
                            tr.setAttribute('fill', '#aaa');
                            tr.setAttribute('font-size', fontSize);
                            g.appendChild(tr);
                            curY += 7;
                        });
                        curY += 3; // Extra spacing after role
                    } else {
                        curY += 2;
                    }
                });
            } else if (type === 'cards') {
                items.forEach(ex => {
                    if (curY >= maxY) return;

                    // Calculate height needed
                    const nameLines = this._wrapText(ex.name, textWidth - 4, fontSize + 0.5);
                    const descLines = this._wrapText(ex.type || ex.description, textWidth - 4, fontSize - 0.5);

                    const lineHeight = 7;
                    const cardPadding = 8;
                    const contentHeight = (nameLines.length * lineHeight) + (descLines.length * lineHeight) + 6; // +6 gap
                    const cardHeight = contentHeight + cardPadding;

                    if (curY + cardHeight >= maxY) return;

                    // Card BG
                    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    bg.setAttribute('x', x + 8); bg.setAttribute('y', curY);
                    bg.setAttribute('width', w - 16); bg.setAttribute('height', cardHeight);
                    bg.setAttribute('rx', 3);
                    bg.setAttribute('fill', color); bg.setAttribute('fill-opacity', 0.1);
                    bg.setAttribute('stroke', color); bg.setAttribute('stroke-width', 0.5);
                    bg.style.cursor = 'pointer';

                    bg.onclick = (e) => {
                        e.stopPropagation();
                        console.log('Clicked example:', ex.name);
                        if (ex.url) window.open(ex.url, '_blank');
                    };
                    g.appendChild(bg);

                    let textY = curY + 10;

                    // Name
                    nameLines.forEach(l => {
                        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        t.textContent = l;
                        t.setAttribute('x', x + 12); t.setAttribute('y', textY);
                        t.setAttribute('font-size', fontSize + 0.5);
                        t.setAttribute('fill', color);
                        t.setAttribute('font-weight', 'bold');
                        t.style.pointerEvents = 'none';
                        g.appendChild(t);
                        textY += lineHeight;
                    });

                    textY += 2; // Small gap

                    // Description
                    descLines.forEach(l => {
                        const t2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        t2.textContent = l;
                        t2.setAttribute('x', x + 12); t2.setAttribute('y', textY);
                        t2.setAttribute('font-size', fontSize - 0.5);
                        t2.setAttribute('fill', '#ccc');
                        t2.style.pointerEvents = 'none';
                        g.appendChild(t2);
                        textY += lineHeight;
                    });

                    curY += cardHeight + 5; // Spacing between cards
                });
            }

            return g;
        },

        zoomOut: function () {
            this.isZoomed = false;
            this.zoomedNode = null;

            this.svg.setAttribute('viewBox', `0 0 ${this.simConfig.svg.width} ${this.simConfig.svg.height}`);

            // Reset opacity
            this.svg.querySelectorAll('.domain-node').forEach(n => {
                n.style.opacity = 1;
                n.style.pointerEvents = 'auto';
            });

            // Remove rings
            const rings = this.svg.getElementById('content-rings');
            if (rings) rings.remove();
        },

        reset: function () {
            this.zoomOut();
            this.particles = [];
        },

        // ========== INTERACTION & HELP ==========

        helpOverlay: null,

        _setupKeyboard: function () {
            // Listen on window for global shortcuts when this engine is active
            // Ideally should check if canvas/container has focus or mouseover
            window.addEventListener('keydown', this._handleKey.bind(this));
        },

        _handleKey: function (e) {
            // Check if we mean to interact with inputs
            if (e.target.tagName === 'INPUT') return;

            switch (e.key) {
                case 'ArrowLeft':
                    this._scrubYear(-1);
                    break;
                case 'ArrowRight':
                    this._scrubYear(1);
                    break;
                case 'Escape':
                    if (this.helpOverlay && this.helpOverlay.classList.contains('active')) {
                        this.toggleHelp(false);
                    } else {
                        this.zoomOut();
                    }
                    break;
                case ' ': // Space
                    e.preventDefault();
                    this.zoomOut(); // Or toggle play/pause if we had it
                    break;
                case 'h':
                case 'H':
                case '?':
                    this.toggleHelp();
                    break;
            }
        },

        _scrubYear: function (direction) {
            let newYear = (this.lastYear || this.simConfig.timeline.startYear) + direction;
            if (newYear < this.simConfig.timeline.startYear) newYear = this.simConfig.timeline.startYear;
            if (newYear > this.simConfig.timeline.endYear) newYear = this.simConfig.timeline.endYear;

            // We need to update the Host Parameters too, otherwise it will fight back
            // Assuming Host exposes a way or we just update our internal state and let Host sync?
            // The method 'config' binds UI to params. If we change params, we should update UI.
            // But here we don't have direct access to Host controls easily without a reference.
            // HACK: Dispatch an input event on the slider if we can find it?

            // Better: Just update visually for now, and rely on Loop to pick it up? 
            // Loop calls 'update(dt, params)'. If we change params locally, they get overwritten by Host UI.
            // So we need to Find the Slider.

            const slider = document.querySelector('input[type="range"]'); // Risky if multiple
            if (slider) {
                slider.value = newYear;
                slider.dispatchEvent(new Event('input'));
            }
        },

        initHelp: function () {
            // 1. Create Modal
            const modal = document.createElement('div');
            modal.className = 'help-modal';
            modal.innerHTML = `
                <h2>Controls</h2>
                <div class="help-keyable"><span>Timeline Scrub</span> <span><span class="key-badge">←</span> <span class="key-badge">→</span></span></div>
                <div class="help-keyable"><span>Zoom Out</span> <span><span class="key-badge">Space</span> / <span class="key-badge">Esc</span></span></div>
                <div class="help-keyable"><span>Select Node</span> <span><span class="key-badge">Click</span></span></div>
                <div class="help-keyable"><span>Toggle Help</span> <span><span class="key-badge">H</span></span></div>
                <button class="help-close">Close</button>
            `;

            // 2. Create Hint Button
            const hintBtn = document.createElement('button');
            hintBtn.className = 'help-hint-btn';
            hintBtn.innerHTML = 'Keys: <span class="key-badge">H</span>';
            hintBtn.title = 'Press H for Controls';
            hintBtn.onclick = () => this.toggleHelp();

            if (this.svg && this.svg.parentNode) {
                this.svg.parentNode.appendChild(modal);
                this.svg.parentNode.appendChild(hintBtn);

                // Ensure relative positioning on parent for absolute children
                if (getComputedStyle(this.svg.parentNode).position === 'static') {
                    this.svg.parentNode.style.position = 'relative';
                }
            }
            this.helpOverlay = modal;
            this.helpHintBtn = hintBtn;

            modal.querySelector('.help-close').onclick = () => this.toggleHelp(false);
        },

        toggleHelp: function (forceState) {
            if (!this.helpOverlay) this.initHelp();

            if (forceState !== undefined) {
                if (forceState) this.helpOverlay.classList.add('active');
                else this.helpOverlay.classList.remove('active');
            } else {
                this.helpOverlay.classList.toggle('active');
            }
        },

        destroy: function () {
            // Framework handles cleanup, removing SVG
            if (this.tutorialOverlay) this.tutorialOverlay.remove();
            if (this.helpOverlay) this.helpOverlay.remove();
            window.removeEventListener('keydown', this._handleKey); // Remove listener!
        },

        // ========== TUTORIAL ==========

        tutorialOverlay: null,

        initTutorial: function () {
            if (this.tutorialOverlay) return;

            // Check if TutorialOverlay is available
            if (typeof TutorialOverlay === 'undefined') {
                console.warn('[CyberdelicConvergence] TutorialOverlay not found.');
                return;
            }

            // Find container (parent of SVG)
            const container = this.svg && this.svg.parentNode ? this.svg.parentNode : document.body;

            this.tutorialOverlay = new TutorialOverlay(container);

            // Auto-start after delay
            setTimeout(() => this.startTutorial(), 1000);
        },

        startTutorial: function () {
            if (!DATA.tutorialSteps || !this.tutorialOverlay) return;

            // Map data steps to TutorialOverlay format if needed
            // Currently they share structure { title, text, target, position }
            // But we need to handle specific targets that are selectors vs elements

            const steps = DATA.tutorialSteps.map(step => {
                let target = step.target;

                // If target is a selector for an element inside SVG, we need to find it
                if (typeof target === 'string' && target !== '#timeline-container') {
                    // Try to find in SVG first
                    const el = this.svg.querySelector(target);
                    if (el) target = el;
                }

                return {
                    ...step,
                    target: target,
                    spotlightSize: step.id === 'domains' ? 600 : undefined
                };
            });

            this.tutorialOverlay.start(steps);
        },
    };

})();