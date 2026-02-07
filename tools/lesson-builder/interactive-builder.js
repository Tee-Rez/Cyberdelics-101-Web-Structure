/**
 * Interactive Simulation Builder (Node-Zoom Engine)
 * 
 * Manages the full-screen visual editor for creating recursive node structures.
 * Data Format matches: methods/interactive-simulation/engines/node-zoom.js
 */

const InteractiveBuilder = {
    // State
    activeModule: null,
    currentNodeList: [], // Pointer to the 'children' array we are currently editing
    navStack: [], // For breadcrumbs logic
    scale: 1,
    panX: 0,
    panY: 0,
    selectedNodeId: null,

    // Config
    containerId: 'sim-builder-canvas',

    init: function () {
        console.log("InteractiveBuilder Initialized");
        this.setupCanvasInteractions();
    },

    open: function (module) {
        console.log("Opening Simulation Editor for:", module.title);
        this.activeModule = module;

        // Ensure data structure exists
        if (!this.activeModule.content.data) {
            this.activeModule.content.data = { nodes: [] };
        }

        // Reset View
        this.currentNodeList = this.activeModule.content.data.nodes;
        this.navStack = [];
        this.scale = 1;
        this.panX = 0;
        this.panY = 0;
        this.selectedNodeId = null;

        // Show Modal
        document.getElementById('sim-builder-modal').style.display = 'flex';

        this.render();
        this.updateUIState();
    },

    close: function () {
        document.getElementById('sim-builder-modal').style.display = 'none';
        this.activeModule = null; // Clear reference
    },

    updateUIState: function () {
        // Breadcrumbs
        const bc = document.getElementById('sim-breadcrumbs');
        let html = '<span onclick="InteractiveBuilder.goHome()" style="cursor:pointer">Home</span>';
        this.navStack.forEach((step, i) => {
            html += ` > <span>${step.parent.label || 'Node'}</span>`;
        });
        bc.innerHTML = html;

        // Back Button Visibility
        const backBtn = document.getElementById('sim-back-btn');
        if (this.navStack.length > 0) {
            backBtn.style.display = 'block';
        } else {
            backBtn.style.display = 'none';
        }
    },

    render: function () {
        const canvas = document.getElementById('sim-builder-content');
        canvas.innerHTML = '';

        // Apply Transform
        canvas.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;

        // Render Nodes
        this.currentNodeList.forEach(item => {
            if (item.type === 'container') {
                this.renderContainer(item, canvas);
            } else {
                this.renderNode(item, canvas);
            }
        });
    },

    renderNode: function (node, canvas) {
        const el = document.createElement('div');
        el.className = 'sim-node';
        if (node.id === this.selectedNodeId) el.classList.add('selected');

        // Positioning
        el.style.left = node.x + '%';
        el.style.top = node.y + '%';

        el.innerHTML = `
            <div class="sim-node-icon">${node.icon || '●'}</div>
            <div class="sim-node-label">${node.label || 'Node'}</div>
            ${node.children && node.children.length > 0 ? '<span class="zoom-indicator">⊕</span>' : ''}
        `;

        // Interaction
        el.onmousedown = (e) => this.handleDragStart(e, node, el, false);
        el.onclick = (e) => {
            e.stopPropagation();
            this.selectNode(node);
        };
        el.ondblclick = (e) => {
            e.stopPropagation();
            if (node.zoomable) this.zoomInto(node);
        };

        canvas.appendChild(el);
    },

    renderContainer: function (container, canvas) {
        const el = document.createElement('div');
        el.className = 'sim-container-box';
        if (container.id === this.selectedNodeId) el.style.borderColor = '#00d9ff';

        // Size & Pos
        el.style.left = container.x + '%';
        el.style.top = container.y + '%';
        el.style.width = (container.width || 20) + '%';
        el.style.height = (container.height || 20) + '%';

        el.innerHTML = `
            <div class="sim-container-header">
                <span style="font-size:10px; color:#aaa; flex:1;">${container.label || 'Media Container'}</span>
                <button class="delete-btn" style="font-size:8px;">❌</button>
            </div>
            <div class="sim-container-content">
                ${container.media ? this.renderMediaContent(container.media) : '<span>+ Link Media</span>'}
            </div>
            <div class="sim-resize-handle"></div>
        `;

        // Events
        const header = el.querySelector('.sim-container-header');
        const content = el.querySelector('.sim-container-content');
        const resizeHandle = el.querySelector('.sim-resize-handle');
        const delBtn = el.querySelector('.delete-btn');

        // Drag Move
        header.onmousedown = (e) => this.handleDragStart(e, container, el, false);

        // Content Click
        content.onclick = (e) => {
            e.stopPropagation();
            this.selectNode(container); // Select first

            // Allow setting media
            const url = prompt("Enter Image or Video URL:");
            if (url) {
                container.media = { src: url, type: url.endsWith('.mp4') ? 'video' : 'image' };
                this.render();
            }
        };

        // Resize
        resizeHandle.onmousedown = (e) => this.handleDragStart(e, container, el, true);

        // Delete
        delBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm('Delete Container?')) {
                const idx = this.currentNodeList.indexOf(container);
                if (idx > -1) this.currentNodeList.splice(idx, 1);
                this.render();
            }
        };

        el.onclick = (e) => { e.stopPropagation(); this.selectNode(container); };

        canvas.appendChild(el);
    },

    renderMediaContent: function (media) {
        if (media.type === 'video') return `<video src="${media.src}" style="width:100%; height:100%; object-fit:contain;" controls></video>`;
        return `<img src="${media.src}" style="width:100%; height:100%; object-fit:contain;">`;
    },

    selectNode: function (node) {
        this.selectedNodeId = node.id;
        this.render(); // Update selection visuals

        if (node.type !== 'container') {
            this.populateInspector(node);
        } else {
            document.getElementById('sim-inspector-panel').innerHTML = `
                <h3>Container Inspector</h3>
                <p>Drag corners to resize.</p>
                <div class="form-group">
                    <label>Label</label>
                    <input type="text" id="insp-c-label" value="${node.label || ''}">
                </div>
            `;
            const inp = document.getElementById('insp-c-label');
            if (inp) inp.oninput = (e) => { node.label = e.target.value; this.render(); };
        }
    },

    populateInspector: function (node) {
        const pan = document.getElementById('sim-inspector-panel');
        pan.innerHTML = `
            <h3>Node Inspector</h3>
            <div class="form-group">
                <label>Label</label>
                <input type="text" id="insp-label" value="${node.label || ''}">
            </div>
            <div class="form-group">
                <label>Icon</label>
                <input type="text" id="insp-icon" value="${node.icon || ''}" style="width:50px;">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="insp-zoom" ${node.zoomable ? 'checked' : ''}>
                    Enable Zoom (Nesting)
                </label>
            </div>
            <button class="delete-btn" id="insp-delete">Delete Node</button>
        `;

        // Bind Events
        document.getElementById('insp-label').oninput = (e) => { node.label = e.target.value; this.render(); };
        document.getElementById('insp-icon').oninput = (e) => { node.icon = e.target.value; this.render(); };
        document.getElementById('insp-zoom').onchange = (e) => {
            node.zoomable = e.target.checked;
            if (node.zoomable && !node.children) node.children = [];
            this.render();
        };
        document.getElementById('insp-delete').onclick = () => {
            const idx = this.currentNodeList.indexOf(node);
            if (idx > -1) this.currentNodeList.splice(idx, 1);
            this.selectedNodeId = null;
            document.getElementById('sim-inspector-panel').innerHTML = '<p style="color:#666;">Select a node...</p>';
            this.render();
        };
    },

    zoomInto: function (node) {
        if (!node.children) node.children = [];
        this.navStack.push({ list: this.currentNodeList, parent: node });
        this.currentNodeList = node.children;
        this.updateUIState();
        this.render();
    },

    zoomOut: function () {
        if (this.navStack.length === 0) return;
        const prev = this.navStack.pop();
        this.currentNodeList = prev.list;
        this.updateUIState();
        this.render();
    },

    goHome: function () {
        if (this.navStack.length === 0) return;
        // Reset to root
        this.currentNodeList = this.activeModule.content.data.nodes;
        this.navStack = [];
        this.updateUIState();
        this.render();
    },

    spawnNode: function () {
        const node = {
            id: 'n_' + Date.now(),
            type: 'node',
            x: 50 - ((this.panX / this.scale) / 10), // Rough center
            y: 50 - ((this.panY / this.scale) / 10),
            label: 'New Node',
            icon: '⚪',
            zoomable: false
        };
        this.currentNodeList.push(node);
        this.render();
        this.selectNode(node);
    },

    spawnContainer: function () {
        const container = {
            id: 'c_' + Date.now(),
            type: 'container',
            x: 40 - ((this.panX / this.scale) / 10),
            y: 40 - ((this.panY / this.scale) / 10),
            width: 20,
            height: 20,
            label: 'Media Box',
            media: null
        };
        this.currentNodeList.push(container);
        this.render();
        this.selectNode(container);
    },

    setupCanvasInteractions: function () {
        const container = document.getElementById('sim-builder-view');
        let isDragging = false;
        let startX, startY;

        // Container Panning (Right Click or Middle Click, or Click on Background)
        container.onmousedown = (e) => {
            if (e.target !== container && e.target.id !== 'sim-builder-content') return;
            isDragging = true;
            startX = e.clientX - this.panX;
            startY = e.clientY - this.panY;
        };

        window.onmousemove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            this.panX = e.clientX - startX;
            this.panY = e.clientY - startY;
            this.render();
        };

        window.onmouseup = () => {
            isDragging = false;
        };

        // Zoom Wheel
        container.onwheel = (e) => {
            e.preventDefault();
            const delta = e.deltaY * -0.001;
            this.scale = Math.min(Math.max(.125, this.scale + delta), 4);
            this.render();
        };
    },

    // Unified Drag Handler for Nodes and Containers (and Resizing)
    handleDragStart: function (e, item, el, isResize) {
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const initX = item.x;
        const initY = item.y;
        const initW = item.width || 0;
        const initH = item.height || 0;

        const container = document.getElementById('sim-builder-content');
        const w = container.offsetWidth;
        const h = container.offsetHeight;

        const onMove = (mv) => {
            const dx = (mv.clientX - startX) / this.scale; // adjust for zoom
            const dy = (mv.clientY - startY) / this.scale;

            // Convert delta px to delta %
            const dPctX = (dx / w) * 100;
            const dPctY = (dy / h) * 100;

            if (isResize) {
                item.width = Math.max(5, initW + dPctX);
                item.height = Math.max(5, initH + dPctY);
                el.style.width = item.width + '%';
                el.style.height = item.height + '%';
            } else {
                item.x = initX + dPctX;
                item.y = initY + dPctY;
                el.style.left = item.x + '%';
                el.style.top = item.y + '%';
            }
        };

        const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }
};
