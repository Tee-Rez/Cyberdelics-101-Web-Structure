/**
 * Node Zoom - Interactive Simulation Engine
 * Infinite nesting zoomable nodes with Circular/Linear payouts.
 */

(function () {
    window.SimulationEngines = window.SimulationEngines || {};

    window.SimulationEngines['node-zoom'] = {
        name: 'Node Zoom',
        defaults: {
            zoomSpeed: 0.8, // Seconds
            layout: 'circular', // 'circular' or 'linear'
            radius: 35 // Percentage of viewport for circular layout
        },
        config: [
            { id: 'layout', label: 'Layout Mode', type: 'select', options: ['circular', 'linear'] },
            { id: 'zoomSpeed', label: 'Zoom Speed (s)', type: 'range', min: 0.2, max: 2.0, step: 0.1 }
        ],

        // State
        viewport: null,
        data: null,
        currentNodes: [],
        activeParent: null, // The node we just zoomed INTO
        navStack: [], // Stack of { nodes, parent }
        container: null,

        init: function (viewport, params, instance) {
            console.log('[NodeZoom] Init V2');
            this.viewport = viewport;
            this.instance = instance;
            this.navStack = [];
            this.activeParent = null;

            // Params
            this.layout = params.layout || this.defaults.layout;
            this.zoomSpeed = params.zoomSpeed || this.defaults.zoomSpeed;
            this.radius = params.radius || this.defaults.radius;

            // Inject Custom CSS if not present
            if (!document.getElementById('node-zoom-css-embed')) {
                const link = document.createElement('link');
                link.id = 'node-zoom-css-embed';
                link.rel = 'stylesheet';
                link.href = '../../methods/interactive-simulation/engines/node-zoom.css';
                document.head.appendChild(link);
            }

            // Set CSS Var for speed
            this.viewport.style.setProperty('--zoom-duration', `${this.zoomSpeed}s`);

            // Data
            this.data = params.data || { nodes: [] };
            // Normalize
            const roots = this.data.nodes || (Array.isArray(this.data) ? this.data : []);

            // Create a virtual root if multiple top-level items, or use single root
            if (roots.length > 1) {
                this.currentNodes = roots;
                this.activeParent = null; // No parent at root
            } else if (roots.length === 1) {
                // If single root, start viewing IT (optional, or view its children?)
                // Standard: View the list of roots
                this.currentNodes = roots;
            }

            this.renderStructure();
            this.renderLevel();
        },

        renderStructure: function () {
            this.viewport.innerHTML = '';
            this.viewport.className = 'sim-viewport node-zoom-viewport';

            this.container = document.createElement('div');
            this.container.className = 'nz-container';
            this.viewport.appendChild(this.container);
        },

        renderLevel: function () {
            this.container.innerHTML = '';

            // 1. Render Active Parent (if depth > 0)
            if (this.activeParent) {
                this.renderNode(this.activeParent, 'parent');
            }

            // 2. Render Children
            const count = this.currentNodes.length;
            this.currentNodes.forEach((node, index) => {
                const coords = this.calculatePosition(index, count);
                this.renderNode(node, 'child', coords);
            });
        },

        calculatePosition: function (index, count) {
            // Returns {x, y} in %
            if (this.layout === 'linear') {
                // Linear: Row(s) below top center
                // If parent exists, it's at Top Center (50, 20).
                // Children go in a row at y=60?
                const startX = 50 - ((count - 1) * 15); // Spread 30% per item?
                // Simple version: Row active
                const gap = 80 / (count + 1); // Distribute across width
                return {
                    x: (index + 1) * gap + 10, // 10% padding
                    y: 65
                };
            } else {
                // Circular: Orbit around center (50, 50)
                // If Root (no parent), they orbit center.
                // If Parent exists, Parent is center, they orbit Parent.
                const cx = 50, cy = 50;
                const angleStep = (2 * Math.PI) / count;
                const angle = (index * angleStep) - (Math.PI / 2); // Start top

                return {
                    x: cx + (this.radius * Math.cos(angle)),
                    y: cy + (this.radius * Math.sin(angle))
                };
            }
        },

        renderNode: function (node, type, coords) {
            const el = document.createElement('div');
            el.className = 'nz-node';
            el.dataset.id = node.id;

            // Type Styles
            if (type === 'parent') {
                el.classList.add('is-active-parent');
                // Parent Position
                if (this.layout === 'linear') {
                    el.style.left = '50%';
                    el.style.top = '20%';
                } else {
                    el.style.left = '50%';
                    el.style.top = '50%';
                }
            } else {
                // Child Position
                // Allow data override x/y if wanted, else calc
                el.style.left = `${coords ? coords.x : (node.x || 50)}%`;
                el.style.top = `${coords ? coords.y : (node.y || 50)}%`;
            }

            // Content
            el.innerHTML = `
                <div class="nz-node-icon">
                    ${node.icon || '●'}
                </div>
                <!-- Only children get label usually? Or parent too? -->
                <div class="nz-node-label">${node.label || node.title || 'Unknown'}</div>
                ${type === 'parent' ? '<div class="nz-back-hint">Click to Zoom Out</div>' : ''}
            `;

            // Artifact Status
            if (window.ArtifactSystem && window.ArtifactSystem.has(node.id)) {
                el.classList.add('collected');
            }

            // Events
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                if (type === 'parent') {
                    this.zoomOut();
                } else {
                    this.handleChildClick(node);
                }
            });

            this.container.appendChild(el);
        },

        handleChildClick: function (node) {
            if (node.children && node.children.length > 0) {
                this.zoomIn(node);
            } else {
                this.collectNode(node);
            }
        },

        zoomIn: function (node) {
            // Collecting a container node when entering it
            this.collectNode(node);

            // Push state
            this.navStack.push({
                nodes: this.currentNodes,
                activeParent: this.activeParent
            });

            // Set new state
            this.activeParent = node;
            this.currentNodes = node.children;

            this.renderLevel();
        },

        zoomOut: function () {
            if (this.navStack.length === 0) return;

            const prev = this.navStack.pop();
            this.currentNodes = prev.nodes;
            this.activeParent = prev.activeParent;

            this.renderLevel();
        },

        collectNode: function (node) {
            console.log('[NodeZoom] collectNode:', node.id);
            if (window.ArtifactSystem) {
                console.log('[NodeZoom] System found. Has?', window.ArtifactSystem.has(node.id));
                if (!window.ArtifactSystem.has(node.id)) {
                    console.log('[NodeZoom] Collecting...');
                    window.ArtifactSystem.collect(node);
                    // Rerender to show collected state (if visible)
                    // Note: if zooming in, this activeParent needs styling update?
                    // this.renderLevel(); // Optional: force rerender if needed immediately
                }
                this.checkCompletion();
            } else {
                console.error('[NodeZoom] No ArtifactSystem!');
            }
        },

        checkCompletion: function () {
            const count = window.ArtifactSystem.getCount();
            if (count >= 5) { // Hardcoded goal matching manifest artifacts
                const btn = document.querySelector('.interactive-simulation-container .btn-continue');
                if (btn) {
                    btn.style.display = 'block';
                    btn.classList.add('fade-in-up'); // Add animation class if exists
                }
            }
        },

        destroy: function () {
            // Cleanup
        }
    };
})();
