/**
 * Ecosystem Map - Simulation Engine
 * Registers to window.SimulationEngines['EcosystemMap']
 * Follows CyberdelicConvergence pattern.
 *
 * Completion gate: student must visit all 8 nodes before host.markComplete() fires.
 */
(function () {
    window.SimulationEngines = window.SimulationEngines || {};

    const DATA = window.EcosystemMapData;

    window.SimulationEngines['EcosystemMap'] = {
        name: 'Ecosystem Map',
        showPlaybackControls: false,
        config: [],
        defaults: {},

        // ─── Instance State ───────────────────────────────────────────────
        svg: null,
        panel: null,
        nodePositions: [],
        particles: [],
        pulseTimer: 0,
        isZoomed: false,
        zoomedNodeId: null,
        visitedNodes: null,
        continueUnlocked: false,
        host: null,

        // ─── Lifecycle ────────────────────────────────────────────────────
        init: function (container, params, host) {
            this.host = host;

            // Reset state for re-init safety
            this.isZoomed = false;
            this.zoomedNodeId = null;
            this.visitedNodes = new Set();
            this.continueUnlocked = false;
            this.particles = [];
            this.pulseTimer = 0;

            // Build DOM skeleton
            container.innerHTML = '';
            const wrapper = document.createElement('div');
            wrapper.className = 'ecosystem-map-wrapper';
            container.appendChild(wrapper);

            // Left: SVG container
            const svgContainer = document.createElement('div');
            svgContainer.className = 'ecosystem-map-svg-container';
            wrapper.appendChild(svgContainer);

            // SVG element
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', `0 0 ${DATA.svg.width} ${DATA.svg.height}`);
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            svg.style.background = 'radial-gradient(circle at center, rgba(6,182,212,0.06) 0%, rgba(8,13,20,0) 70%)';
            svgContainer.appendChild(svg);
            this.svg = svg;

            // Click SVG background to deselect
            svg.addEventListener('click', (e) => {
                if (e.target === svg || e.target.tagName === 'svg') this._zoomOut();
            });

            // Right: detail panel
            const panel = document.createElement('div');
            panel.className = 'ecosystem-map-panel';
            panel.innerHTML = this._panelTemplate();
            wrapper.appendChild(panel);
            this.panel = panel;

            // Progress bar (inside SVG container, absolute positioned)
            const pbWrap = document.createElement('div');
            pbWrap.style.cssText = 'position:absolute;bottom:0;left:0;right:0;padding:8px;';
            pbWrap.innerHTML = `
                <div style="color:#334155;font-size:9px;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;" id="em-progress-label">
                    EXPLORE ALL 8 COMPONENTS TO CONTINUE
                </div>
                <div class="em-progress-bar-container" style="position:relative;bottom:auto;left:auto;right:auto;">
                    <div class="em-progress-bar-fill" id="em-progress-fill"></div>
                </div>
            `;
            svgContainer.appendChild(pbWrap);

            // Hint text
            const hint = document.createElement('div');
            hint.className = 'em-hint';
            hint.textContent = 'CLICK ANY NODE TO EXPLORE';
            svgContainer.appendChild(hint);
            this._hintEl = hint;

            // Build positions then draw (z-order: connections → center → nodes)
            this._calculatePositions();
            this._drawConnections();
            this._drawCenterNode();
            this._drawNodes();
            this._initParticles();
        },

        update: function (dt, params) {
            this._updateParticles(dt);
            this._updateCenterPulse(dt);
        },

        resize: function (width, height) {
            // viewBox + preserveAspectRatio handles scaling automatically
        },

        destroy: function () {
            this.svg = null;
            this.panel = null;
            this.particles = [];
            this.host = null;
            this.visitedNodes = null;
        },

        // ─── Layout ───────────────────────────────────────────────────────
        _calculatePositions: function () {
            this.nodePositions = DATA.nodes.map(node => {
                const rad = (node.angle * Math.PI) / 180;
                return {
                    ...node,
                    x: DATA.svg.cx + DATA.orbitRadius * Math.cos(rad),
                    y: DATA.svg.cy + DATA.orbitRadius * Math.sin(rad)
                };
            });
        },

        // ─── Drawing ──────────────────────────────────────────────────────
        _drawCenterNode: function () {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.id = 'em-center-node';

            // Glow halo
            const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            halo.setAttribute('cx', DATA.svg.cx);
            halo.setAttribute('cy', DATA.svg.cy);
            halo.setAttribute('r', 44);
            halo.setAttribute('fill', 'rgba(6,182,212,0.06)');
            halo.setAttribute('stroke', 'none');
            g.appendChild(halo);

            // Outer ring
            const outer = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            outer.setAttribute('cx', DATA.svg.cx);
            outer.setAttribute('cy', DATA.svg.cy);
            outer.setAttribute('r', 38);
            outer.setAttribute('fill', 'rgba(6,182,212,0.1)');
            outer.setAttribute('stroke', '#06b6d4');
            outer.setAttribute('stroke-width', 1.5);
            outer.style.filter = 'drop-shadow(0 0 8px rgba(6,182,212,0.5))';
            g.appendChild(outer);

            // Inner ring
            const inner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            inner.setAttribute('cx', DATA.svg.cx);
            inner.setAttribute('cy', DATA.svg.cy);
            inner.setAttribute('r', 26);
            inner.setAttribute('fill', 'rgba(6,182,212,0.06)');
            inner.setAttribute('stroke', '#06b6d4');
            inner.setAttribute('stroke-width', 0.5);
            g.appendChild(inner);

            // Animated pulse ring
            const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            pulse.id = 'em-center-pulse';
            pulse.setAttribute('cx', DATA.svg.cx);
            pulse.setAttribute('cy', DATA.svg.cy);
            pulse.setAttribute('r', 38);
            pulse.setAttribute('fill', 'none');
            pulse.setAttribute('stroke', '#06b6d4');
            pulse.setAttribute('stroke-width', 1);
            pulse.setAttribute('opacity', 0);
            g.appendChild(pulse);

            // Labels
            ['CYBERDELIC', 'ECOSYSTEM'].forEach((line, i) => {
                const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                txt.textContent = line;
                txt.setAttribute('x', DATA.svg.cx);
                txt.setAttribute('y', DATA.svg.cy + (i === 0 ? -5 : 8));
                txt.setAttribute('text-anchor', 'middle');
                txt.setAttribute('fill', '#06b6d4');
                txt.setAttribute('font-size', 7);
                txt.setAttribute('font-family', 'Orbitron, monospace');
                txt.setAttribute('font-weight', 'bold');
                txt.style.pointerEvents = 'none';
                g.appendChild(txt);
            });

            this.svg.appendChild(g);
        },

        _drawConnections: function () {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.id = 'em-connections';

            // Spokes (node → center)
            this.nodePositions.forEach(node => {
                this._addConnectionLine(g, node.x, node.y, DATA.svg.cx, DATA.svg.cy, node.color, `spoke-${node.id}`);
            });

            // Lateral ring connections — ID encodes both endpoints for visibility filtering
            DATA.lateralConnections.forEach(conn => {
                const src = this.nodePositions.find(n => n.id === conn.source);
                const tgt = this.nodePositions.find(n => n.id === conn.target);
                if (!src || !tgt) return;
                this._addConnectionLine(g, src.x, src.y, tgt.x, tgt.y, src.color, `lateral-${conn.source}-${conn.target}`);
            });

            this.svg.appendChild(g);
        },

        _addConnectionLine: function (parent, x1, y1, x2, y2, color, id) {
            // Blurred glow layer
            const glow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            glow.id = `em-conn-glow-${id}`;
            glow.setAttribute('x1', x1); glow.setAttribute('y1', y1);
            glow.setAttribute('x2', x2); glow.setAttribute('y2', y2);
            glow.setAttribute('stroke', color);
            glow.setAttribute('stroke-width', 4);
            glow.setAttribute('opacity', 0.08);
            glow.style.filter = 'blur(3px)';
            parent.appendChild(glow);

            // Sharp line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.id = `em-conn-${id}`;
            line.setAttribute('x1', x1); line.setAttribute('y1', y1);
            line.setAttribute('x2', x2); line.setAttribute('y2', y2);
            line.setAttribute('stroke', color);
            line.setAttribute('stroke-width', 0.8);
            line.setAttribute('opacity', 0.2);
            parent.appendChild(line);
        },

        _drawNodes: function () {
            this.nodePositions.forEach(node => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.classList.add('ecosystem-node');
                g.dataset.id = node.id;

                // Node circle
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', node.x);
                circle.setAttribute('cy', node.y);
                circle.setAttribute('r', DATA.nodeRadius);
                circle.setAttribute('fill', node.color);
                circle.setAttribute('fill-opacity', 0.15);
                circle.setAttribute('stroke', node.color);
                circle.setAttribute('stroke-width', 2);
                circle.style.filter = `drop-shadow(0 0 6px ${node.color}40)`;
                g.appendChild(circle);

                // Label (split on \n)
                const lines = node.label.split('\n');
                lines.forEach((line, i) => {
                    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    txt.classList.add('em-node-label');
                    txt.textContent = line;
                    txt.setAttribute('x', node.x);
                    txt.setAttribute('y', node.y + (i - (lines.length - 1) / 2) * 13);
                    txt.setAttribute('text-anchor', 'middle');
                    txt.setAttribute('dominant-baseline', 'middle');
                    txt.setAttribute('fill', node.color);
                    txt.setAttribute('font-size', 7.5);
                    txt.setAttribute('font-family', 'Orbitron, monospace');
                    txt.setAttribute('font-weight', 'bold');
                    txt.style.pointerEvents = 'none';
                    g.appendChild(txt);
                });

                // Visited checkmark (hidden by default)
                const check = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                check.id = `em-check-${node.id}`;
                check.textContent = '✓';
                check.setAttribute('x', node.x + DATA.nodeRadius - 8);
                check.setAttribute('y', node.y - DATA.nodeRadius + 10);
                check.setAttribute('text-anchor', 'middle');
                check.setAttribute('fill', '#34d399');
                check.setAttribute('font-size', 10);
                check.setAttribute('opacity', 0);
                check.style.pointerEvents = 'none';
                g.appendChild(check);

                // Click handler
                g.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this._selectNode(node.id);
                });

                this.svg.appendChild(g);
            });
        },

        // ─── Interaction ──────────────────────────────────────────────────
        _selectNode: function (id) {
            // Toggle off if already active
            if (this.isZoomed && this.zoomedNodeId === id) {
                this._zoomOut();
                return;
            }

            this.isZoomed = true;
            this.zoomedNodeId = id;

            // Hide hint
            if (this._hintEl) this._hintEl.style.opacity = '0';

            // Dim all other nodes, highlight active
            this.svg.querySelectorAll('.ecosystem-node').forEach(g => {
                if (g.dataset.id === id) {
                    g.classList.remove('dimmed');
                    g.classList.add('active');
                } else {
                    g.classList.add('dimmed');
                    g.classList.remove('active');
                }
            });

            this._updateConnectionVisibility(id);
            this._populatePanel(id);
            this.panel.classList.add('visible');

            // Mark visited
            const isNew = !this.visitedNodes.has(id);
            this.visitedNodes.add(id);

            if (isNew) {
                // Show checkmark on node
                const check = this.svg.getElementById(`em-check-${id}`);
                if (check) check.setAttribute('opacity', 1);
                this._updateProgress();
            }

            // Show VISITED badge on re-open (exists in set already)
            const badge = this.panel.querySelector('.em-visited-badge');
            if (badge) badge.classList.toggle('show', !isNew);

            // Completion gate
            if (this.visitedNodes.size === 8 && !this.continueUnlocked) {
                this.continueUnlocked = true;
                setTimeout(() => {
                    if (this.host && typeof this.host.markComplete === 'function') {
                        this.host.markComplete();
                    }
                }, 600);
            }
        },

        _zoomOut: function () {
            this.isZoomed = false;
            this.zoomedNodeId = null;

            this.svg.querySelectorAll('.ecosystem-node').forEach(g => {
                g.classList.remove('dimmed', 'active');
            });

            this._updateConnectionVisibility(null);
            this.panel.classList.remove('visible');
        },

        _updateConnectionVisibility: function (activeNodeId) {
            const connGroup = this.svg.getElementById('em-connections');
            if (!connGroup) return;

            connGroup.querySelectorAll('line').forEach(line => {
                const id = line.id;
                const isGlow = id.includes('glow');

                if (!activeNodeId) {
                    // Restore base opacities
                    line.setAttribute('opacity', isGlow ? 0.08 : 0.2);
                    return;
                }

                // Does this connection involve the active node?
                const involves = id.includes(`-${activeNodeId}`);
                if (involves) {
                    line.setAttribute('opacity', isGlow ? 0.35 : 0.85);
                } else {
                    line.setAttribute('opacity', 0.02);
                }
            });
        },

        // ─── Panel ────────────────────────────────────────────────────────
        _panelTemplate: function () {
            return `
                <div class="em-panel-header">
                    <div class="em-panel-dot"></div>
                    <div style="flex:1;min-width:0;">
                        <div class="em-panel-title"></div>
                        <div class="em-panel-subtitle"></div>
                    </div>
                    <div class="em-visited-badge">✓ VISITED</div>
                </div>
                <div class="em-panel-body">
                    <div>
                        <div class="em-section-label">Role in Ecosystem</div>
                        <div class="em-role-text"></div>
                        <div class="em-section-label" style="margin-top:10px;">Key Players</div>
                        <div class="em-chips em-players-chips"></div>
                        <div class="em-section-label" style="margin-top:10px;">Connects To</div>
                        <div class="em-chips em-connections-chips"></div>
                    </div>
                    <div>
                        <div class="em-section-label">▼ Key Challenge</div>
                        <div class="em-challenge-card"></div>
                        <div class="em-section-label" style="margin-top:10px;">▲ Key Opportunity</div>
                        <div class="em-opportunity-card"></div>
                    </div>
                </div>
                <div class="em-panel-footer"></div>
            `;
        },

        _populatePanel: function (id) {
            const node = DATA.nodes.find(n => n.id === id);
            if (!node || !this.panel) return;

            const p = this.panel;

            // Header
            const dot = p.querySelector('.em-panel-dot');
            dot.style.background = node.color;
            dot.style.boxShadow = `0 0 6px ${node.color}`;
            const titleEl = p.querySelector('.em-panel-title');
            titleEl.textContent = node.label.replace('\n', ' ');
            titleEl.style.color = node.color;
            p.querySelector('.em-panel-subtitle').textContent = node.subtitle;

            // Body
            p.querySelector('.em-role-text').textContent = node.role;
            p.querySelector('.em-challenge-card').textContent = node.challenge;
            p.querySelector('.em-opportunity-card').textContent = node.opportunity;

            // Players chips
            p.querySelector('.em-players-chips').innerHTML =
                node.players.map(pl => `<span class="em-chip">${pl}</span>`).join('');

            // Connection chips (colored)
            p.querySelector('.em-connections-chips').innerHTML =
                node.connections.map(cid => {
                    const cn = DATA.nodes.find(n => n.id === cid);
                    if (!cn) return '';
                    return `<span class="em-chip" style="border-color:${cn.color}50;color:${cn.color}">${cn.label.replace('\n', ' ')}</span>`;
                }).join('');

            // Footer ripple
            p.querySelector('.em-panel-footer').innerHTML =
                `<span style="color:${node.color};opacity:0.9;">⚡</span> <span style="color:#64748b;">${node.ripple}</span>`;
        },

        _updateProgress: function () {
            const fill = document.getElementById('em-progress-fill');
            const label = document.getElementById('em-progress-label');
            if (!fill) return;

            const count = this.visitedNodes.size;
            const pct = (count / 8) * 100;
            fill.style.width = pct + '%';

            if (count === 8) {
                fill.classList.add('complete');
                if (label) label.textContent = 'ALL 8 COMPONENTS EXPLORED — UNLOCKED';
                if (label) label.style.color = '#34d399';
            } else {
                if (label) label.textContent = `${count} OF 8 EXPLORED — VISIT ALL TO CONTINUE`;
            }
        },

        // ─── Particles ────────────────────────────────────────────────────
        _initParticles: function () {
            this.particles = [];

            const allConns = [
                ...this.nodePositions.map(n => ({
                    x1: n.x, y1: n.y,
                    x2: DATA.svg.cx, y2: DATA.svg.cy,
                    color: n.color,
                    nodeId: n.id
                })),
                ...DATA.lateralConnections.map(conn => {
                    const src = this.nodePositions.find(n => n.id === conn.source);
                    const tgt = this.nodePositions.find(n => n.id === conn.target);
                    return {
                        x1: src.x, y1: src.y,
                        x2: tgt.x, y2: tgt.y,
                        color: src.color,
                        nodeId: src.id
                    };
                })
            ];

            // ~2 particles per connection, staggered
            allConns.forEach((conn, ci) => {
                for (let j = 0; j < 2; j++) {
                    const baseSpeed = 0.0025 + Math.random() * 0.0025;
                    this.particles.push({
                        x1: conn.x1, y1: conn.y1,
                        x2: conn.x2, y2: conn.y2,
                        color: conn.color,
                        nodeId: conn.nodeId,
                        progress: (ci / allConns.length + j * 0.5) % 1,
                        speed: baseSpeed,
                        baseSpeed: baseSpeed
                    });
                }
            });

            // Create SVG group behind center node
            let g = this.svg.getElementById('em-particle-group');
            if (!g) {
                g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.id = 'em-particle-group';
                const centerNode = this.svg.getElementById('em-center-node');
                if (centerNode) {
                    this.svg.insertBefore(g, centerNode);
                } else {
                    this.svg.appendChild(g);
                }
            }
        },

        _updateParticles: function (dt) {
            const g = this.svg ? this.svg.getElementById('em-particle-group') : null;
            if (!g) return;

            // Clear previous frame's particles
            while (g.firstChild) g.removeChild(g.firstChild);

            this.particles.forEach(p => {
                const isActive = this.isZoomed && p.nodeId === this.zoomedNodeId;
                p.speed = isActive ? p.baseSpeed * 2.5 : p.baseSpeed;
                p.progress += p.speed;
                if (p.progress > 1) p.progress -= 1;

                const dimmed = this.isZoomed && !isActive;
                const opacity = dimmed ? 0.06 : Math.max(0, 0.7 - p.progress * 0.5);

                const cx = p.x1 + (p.x2 - p.x1) * p.progress;
                const cy = p.y1 + (p.y2 - p.y1) * p.progress;

                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', cx);
                circle.setAttribute('cy', cy);
                circle.setAttribute('r', isActive ? 2.5 : 1.8);
                circle.setAttribute('fill', p.color);
                circle.setAttribute('opacity', opacity);
                g.appendChild(circle);
            });
        },

        // ─── Center Pulse ─────────────────────────────────────────────────
        _updateCenterPulse: function (dt) {
            this.pulseTimer = (this.pulseTimer || 0) + dt;
            const period = 3000;
            const progress = (this.pulseTimer % period) / period;

            const pulse = this.svg ? this.svg.getElementById('em-center-pulse') : null;
            if (!pulse) return;

            const r = 38 + progress * 32;
            const opacity = (1 - progress) * 0.35;
            pulse.setAttribute('r', r);
            pulse.setAttribute('opacity', opacity);
        }
    };
})();
