/**
 * Timeline Zoom Module
 * Enhanced with Visual Ruler, Directional Zoom, and Detail Panel.
 */

// Ensure Registry Exists
window.GameModules = window.GameModules || {};

// Register Module
window.GameModules['timeline-zoom'] = {
    name: 'Timeline Zoom',
    engine: null,
    data: null,
    activeEra: null,
    activeItem: null,

    init: function (engine, data, container) {
        this.engine = engine;
        this.container = container || document.body;

        // Normalize Data: If flat items provided, wrap in a default 'era'
        if (!data.eras && data.items) {
            this.data = {
                eras: [{
                    id: 'main-map',
                    label: 'Explore',
                    items: data.items
                }]
            };
        } else {
            this.data = data;
        }

        this.render();
        this.setupListeners();
    },

    countItems: function (data) {
        // Handle normalized or raw data if passed directly
        const eras = data.eras || (data.items ? [{ items: data.items }] : []);
        let count = 0;
        eras.forEach(era => {
            if (era.items) count += era.items.length;
        });
        return count;
    },

    render: function () {
        const root = this.container || document.getElementById('game-root');
        if (!root) return;

        root.className = 'tz-container view-macro';

        // 1. Render Macro View
        const macroLine = document.createElement('div');
        macroLine.className = 'tz-macro-line';

        this.data.eras.forEach((era, index) => {
            const node = document.createElement('div');
            node.className = 'tz-era-node';
            node.dataset.id = era.id;
            node.dataset.index = index; // For position calc
            node.innerHTML = `
                <div class="tz-era-marker"></div>
                <div class="tz-era-label">${era.label}</div>
                <div class="tz-era-count">0/${era.items.length}</div>
            `;
            macroLine.appendChild(node);
        });

        root.appendChild(macroLine);

        // 2. Render Micro Container (Shared for transitions)
        const microContainer = document.createElement('div');
        microContainer.className = 'tz-micro-container';

        this.data.eras.forEach(era => {
            const detailView = document.createElement('div');
            detailView.className = 'tz-era-detail';
            detailView.id = `detail-${era.id}`;

            // Generate Ticks & Items
            const timelineHTML = this.generateTimelineContent(era);

            detailView.innerHTML = `
                <div class="tz-detail-header">
                    <button class="tz-back-btn">← Back to Timeline</button>
                    <h2>${era.label}</h2>
                </div>
                <div class="tz-detail-timeline">
                    <div class="tz-detail-line"></div>
                    ${timelineHTML}
                </div>
            `;

            microContainer.appendChild(detailView);
        });

        // 3. Render Shared Info Panel
        const infoPanel = document.createElement('div');
        infoPanel.className = 'tz-shared-info-panel';
        infoPanel.innerHTML = `
            <h3 class="tz-info-title">Artifact Title</h3>
            <div class="tz-info-year">1999</div>
            <p class="tz-info-desc">Description goes here...</p>
            <button class="btn btn-primary tz-collect-btn">Collect Artifact</button>
        `;
        microContainer.appendChild(infoPanel); // Attach to micro container so it scales with it? No, attach to container for stability.
        // Actually, attaching to microContainer means it zooms with it. Attaching to root means it stays static.
        // Let's attach to microContainer but handle scale if needed.

        root.appendChild(microContainer);
    },

    generateTimelineContent: function (era) {
        let html = '';

        // Mode 1: Timeline (Years) - only if era has year data
        if (era.yearStart !== undefined && era.yearEnd !== undefined) {
            const span = era.yearEnd - era.yearStart;

            // Generate Ticks
            for (let y = era.yearStart; y <= era.yearEnd; y++) {
                const offset = y - era.yearStart;
                const percent = (offset / span) * 90 + 5; // 5% padding

                const isDecade = y % 10 === 0;
                const isMid = y % 5 === 0;
                const isMajor = isDecade || isMid;

                let label = '';
                if (isDecade) label = `<div class="tz-tick-label">${y}</div>`;
                else if (isMid && span < 20) label = `<div class="tz-tick-label">${y}</div>`; // Show 5s if short era by count? Or just always 10s.

                html += `
                <div class="tz-tick ${isMajor ? 'major' : ''}" style="left: ${percent}%">
                    ${isDecade ? `<div class="tz-tick-label">${y}</div>` : ''}
                </div>
            `;
            }

            // Generate Items
            era.items.forEach(item => {
                const offset = item.year - era.yearStart;
                const percent = (offset / span) * 90 + 5;

                html += `
                <div class="tz-artifact-point" style="left: ${percent}%" data-id="${item.id}" data-year="${item.year}">
                    <div class="tz-artifact-icon">${item.icon || '❓'}</div>
                </div>
            `;
            });
        } else {
            // Mode 2: Spatial Map (X/Y coordinates)
            if (era.items) {
                era.items.forEach(item => {
                    const x = item.x || 50;
                    const y = item.y || 50;
                    const isCollected = this.engine && this.engine.hasCollected(item.id);
                    const stateClass = isCollected ? 'collected' : '';

                    html += `
                        <div class="tz-artifact-point ${stateClass}" 
                             style="left: ${x}%; top: ${y}%; position: absolute;"
                             data-id="${item.id}">
                            <div class="tz-artifact-icon">${item.icon || '●'}</div>
                            <div class="tz-point-label" style="position:absolute; top:110%; left:50%; transform:translateX(-50%); white-space:nowrap; font-size: 0.75em; color: #aaa;">${item.label || ''}</div>
                        </div>
                    `;
                });
            }
        }

        return html;
    },

    setupListeners: function () {
        // Node Click (Zoom In)
        this.container.querySelectorAll('.tz-era-node').forEach(node => {
            node.addEventListener('click', (e) => {
                this.zoomIn(node.dataset.id, e.currentTarget);
            });
        });

        // Back Click (Zoom Out)
        this.container.querySelectorAll('.tz-back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.zoomOut();
            });
        });

        // Artifact Click (Inspect)
        this.container.querySelectorAll('.tz-artifact-point').forEach(point => {
            point.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent bubbling if needed
                const id = point.dataset.id;
                this.inspectItem(id, point);
            });
        });

        // Collect Button Click
        const collectBtn = this.container.querySelector('.tz-collect-btn');
        if (collectBtn) {
            collectBtn.addEventListener('click', () => {
                console.log('[TimelineZoom] Collect clicked. ActiveItem:', this.activeItem);

                if (this.activeItem) {
                    if (this.engine) {
                        this.engine.collectItem(this.activeItem.id);
                        this.updateInfoPanelState(true);
                    } else {
                        console.error('[TimelineZoom] No Engine instance found!', this);
                    }
                }
            });
        }

        // Hide panel when clicking background
        const microContainer = this.container.querySelector('.tz-micro-container');
        if (microContainer) {
            microContainer.addEventListener('click', (e) => {
                if (!e.target.closest('.tz-artifact-point') && !e.target.closest('.tz-shared-info-panel')) {
                    this.hideInfoPanel();
                }
            });
        }
    },

    zoomIn: function (eraId, nodeElement) {
        this.activeEra = eraId;
        const root = this.container;
        const container = root.querySelector('.tz-micro-container');

        // Determine Transform Origin based on node position relative to screen width
        const rect = nodeElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const screenWidth = window.innerWidth;

        let originX = '50%';
        if (centerX < screenWidth * 0.4) originX = '20%';
        else if (centerX > screenWidth * 0.6) originX = '80%';

        container.style.transformOrigin = `${originX} center`;

        // Switch View
        root.classList.remove('view-macro');
        root.classList.add('view-micro');

        // Activate Detail ID
        this.container.querySelectorAll('.tz-era-detail').forEach(el => el.classList.remove('active'));
        const detailEl = this.container.querySelector(`#detail-${eraId}`);
        if (detailEl) detailEl.classList.add('active');
    },

    zoomOut: function () {
        this.activeEra = null;
        this.hideInfoPanel();

        const root = this.container;
        root.classList.add('view-macro');
        root.classList.remove('view-micro');
    },

    inspectItem: function (itemId, pointElement) {
        // Find Item Data
        let itemData = null;
        this.data.eras.forEach(era => {
            const found = era.items.find(i => i.id === itemId);
            if (found) itemData = found;
        });

        if (!itemData) return;
        this.activeItem = itemData;

        // Highlight Point
        document.querySelectorAll('.tz-artifact-point').forEach(el => el.classList.remove('active'));
        pointElement.classList.add('active');

        // Populate Panel
        const panel = document.querySelector('.tz-shared-info-panel');
        panel.querySelector('.tz-info-title').textContent = itemData.title;
        panel.querySelector('.tz-info-year').textContent = itemData.year;
        panel.querySelector('.tz-info-desc').textContent = itemData.description;

        // Check if collected
        // FIX: Use hasCollected helper instead of direct state access
        const isCollected = this.engine.hasCollected(itemId);
        this.updateInfoPanelState(isCollected);

        panel.classList.add('visible');
    },

    updateInfoPanelState: function (isCollected) {
        const btn = document.querySelector('.tz-collect-btn');
        if (isCollected) {
            btn.textContent = "Collected ✓";
            btn.disabled = true;
            btn.classList.add('btn-success'); // Assuming exists in core styles or I should add style
            btn.style.background = '#064e3b';
            btn.style.borderColor = '#4ade80';
        } else {
            btn.textContent = "Collect Artifact";
            btn.disabled = false;
            btn.style.background = '';
            btn.style.borderColor = '';
        }
    },

    hideInfoPanel: function () {
        document.querySelector('.tz-shared-info-panel').classList.remove('visible');
        document.querySelectorAll('.tz-artifact-point').forEach(el => el.classList.remove('active'));
    },

    onItemCollected: function (itemId) {
        // Visual update on point
        const point = document.querySelector(`.tz-artifact-point[data-id="${itemId}"]`);
        if (point) {
            point.classList.add('collected');
        }

        // Update Macro Counter
        this.data.eras.forEach(era => {
            if (era.items.find(i => i.id === itemId)) {
                this.updateEraCount(era.id);
            }
        });
    },

    updateEraCount: function (eraId) {
        const era = this.data.eras.find(e => e.id === eraId);
        // FIX: Use hasCollected helper
        const collectedCount = era.items.filter(i => this.engine.hasCollected(i.id)).length;

        const node = document.querySelector(`.tz-era-node[data-id="${eraId}"] .tz-era-count`);
        if (node) {
            node.textContent = `${collectedCount}/${era.items.length}`;
            if (collectedCount === era.items.length) {
                node.parentElement.classList.add('completed');
            }
        }
    }
};
