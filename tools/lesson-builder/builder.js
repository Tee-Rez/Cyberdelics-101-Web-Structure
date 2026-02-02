/**
 * CYBERDELIC LESSON BUILDER (Project Architect)
 * Core Logic for Visual Manifest Generation
 */

const STATE = {
    modules: [], // Array of module objects
    meta: {
        title: "New Lesson",
        description: "",
        color: "#00d9ff"
    }
};

// --- DOM ELEMENTS ---
const toolboxItems = document.querySelectorAll('.tool-item');
const canvasContainer = document.getElementById('canvas-container');
const dropHint = document.getElementById('drop-hint');
const exportBtn = document.getElementById('btn-export');

// --- DRAG & DROP LOGIC ---
toolboxItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', item.dataset.type);
        e.dataTransfer.effectAllowed = 'copy';
        dropHint.classList.add('drag-over'); // Highlight drop zone
    });
    item.addEventListener('dragend', () => {
        dropHint.classList.remove('drag-over');
    });
});

dropHint.addEventListener('dragover', (e) => {
    e.preventDefault(); // Allow drop
    dropHint.classList.add('drag-over');
});

dropHint.addEventListener('dragleave', () => {
    dropHint.classList.remove('drag-over');
});

dropHint.addEventListener('drop', (e) => {
    e.preventDefault();
    dropHint.classList.remove('drag-over');
    const type = e.dataTransfer.getData('type');
    if (type) {
        createNewModule(type);
    }
});

// --- MODULE MANAGEMENT ---
function createNewModule(type) {
    const id = `module_${Date.now().toString(36)}`;
    const newModule = {
        id: id,
        title: "New Module",
        type: type,
        content: {}, // Schema depends on type
        artifacts: []
    };

    // Initialize Schema based on type
    if (type === 'progressive-disclosure') {
        newModule.content.sections = [
            { title: "First Section", content: "<p>Start writing...</p>", triggerLabel: "Next" }
        ];
    } else if (type === 'scenario-based') {
        newModule.content.scenes = [
            { id: "start", narrative: "<p>Scene descriptions...</p>", choices: [] }
        ];
    }

    STATE.modules.push(newModule);
    renderCanvas();
}

function removeModule(index) {
    if (confirm("Delete this module?")) {
        STATE.modules.splice(index, 1);
        renderCanvas();
    }
}

function updateModule(index, key, value) {
    STATE.modules[index][key] = value;
}

// --- RENDERING ENGINE ---
function renderCanvas() {
    // Clear list but keep drop hint at bottom
    canvasContainer.innerHTML = '';

    STATE.modules.forEach((mod, index) => {
        const card = document.createElement('div');
        card.className = 'module-card';
        card.innerHTML = `
            <div class="module-header">
                <span class="module-title-display">${mod.title}</span>
                <div>
                    <span class="module-type-badge">${mod.type}</span>
                    <button class="delete-btn" onclick="removeModule(${index})">❌</button>
                </div>
            </div>
            <div class="module-body">
                <div class="form-row">
                    <div class="form-group">
                        <label>ID (Slug)</label>
                        <input type="text" value="${mod.id}" onchange="updateModule(${index}, 'id', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" value="${mod.title}" oninput="this.closest('.module-card').querySelector('.module-title-display').textContent = this.value; updateModule(${index}, 'title', this.value)">
                    </div>
                </div>
                
                <!-- DYNAMIC TYPE EDITOR -->
                <div class="type-editor" id="editor-${mod.id}"></div>

                <!-- ARTIFACTS EDITOR -->
                <div class="artifacts-section" style="margin-top: 20px; border-top: 1px solid #333; padding-top: 15px;">
                    <h5 style="margin: 0 0 10px 0; color: #888;">ARTIFACTS</h5>
                    <ul class="artifacts-list" id="artifacts-${mod.id}" style="list-style:none; padding:0; display:flex; flex-direction:column; gap:5px;"></ul>
                    <button class="btn-small" onclick="addArtifact(${index})">+ ADD ARTIFACT</button>
                </div>
            </div>
        `;
        canvasContainer.appendChild(card);

        // Render Specific Editor
        const editorContainer = card.querySelector(`#editor-${mod.id}`);
        if (mod.type === 'progressive-disclosure') {
            renderProgressiveEditor(mod, editorContainer);
        } else {
            editorContainer.innerHTML = `<p style="color:#666; font-style:italic;">Editor for ${mod.type} not yet implemented.</p>`;
        }

        // Render Artifacts
        renderArtifactsList(mod, card.querySelector(`#artifacts-${mod.id}`));
    });

    // Re-append drop hint
    canvasContainer.appendChild(dropHint);
}

// --- ARTIFACTS LOGIC ---
function addArtifact(moduleIndex) {
    STATE.modules[moduleIndex].artifacts.push({
        id: `art_${Date.now().toString(36)}`,
        label: "New Artifact",
        icon: "🏆",
        trigger: "step_complete"
    });
    renderCanvas();
}

function renderArtifactsList(module, listContainer) {
    module.artifacts.forEach((art, aIndex) => {
        const li = document.createElement('li');
        li.style.cssText = "display: flex; gap: 10px; background: #0a0a0a; padding: 5px; border-radius: 4px; border: 1px solid #222;";
        li.innerHTML = `
            <input type="text" value="${art.id}" placeholder="ID" style="width: 80px; background:#000; border:1px solid #333; color:#aaa; font-size:11px;">
            <input type="text" value="${art.label}" placeholder="Label" style="flex:1; background:#000; border:1px solid #333; color:#fff; font-size:11px;">
            <input type="text" value="${art.icon}" placeholder="Icon" style="width: 30px; text-align:center; background:#000; border:1px solid #333; color:#fff;">
            <button class="delete-btn" style="font-size:10px;">❌</button>
        `;

        // Bind Events
        const inputs = li.querySelectorAll('input');
        inputs[0].onchange = (e) => art.id = e.target.value;
        inputs[1].onchange = (e) => art.label = e.target.value;
        inputs[2].onchange = (e) => art.icon = e.target.value;
        li.querySelector('.delete-btn').onclick = () => {
            module.artifacts.splice(aIndex, 1);
            renderCanvas();
        };

        listContainer.appendChild(li);
    });
}


// --- PROGRESSIVE DISCLOSURE EDITOR ---
function renderProgressiveEditor(module, container) {
    container.innerHTML = `
        <h4>SECTIONS</h4>
        <ul class="sections-list"></ul>
        <button class="btn-small btn-add">+ ADD SECTION</button>
    `;

    const list = container.querySelector('.sections-list');
    const addBtn = container.querySelector('.btn-add');

    // Render list
    module.content.sections.forEach((section, sIndex) => {
        const li = document.createElement('li');
        li.className = 'section-item';
        li.innerHTML = `
            <div class="form-group">
                <label>Section Title</label>
                <input type="text" value="${section.title || ''}" class="inp-title">
            </div>
            <div class="form-group">
                <label>HTML Content</label>
                <textarea class="inp-content">${section.content || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Trigger Button Label</label>
                <input type="text" value="${section.triggerLabel || 'Next'}" class="inp-trigger">
            </div>
            <div class="form-group">
                <label>Media Asset</label>
                <div style="display:flex; gap:5px;">
                    <select class="inp-media-type" style="background:#000; border:1px solid #333; color:#fff; width: 100px;">
                        <option value="image" ${section.media && section.media.type === 'image' ? 'selected' : ''}>Image</option>
                        <option value="video" ${section.media && section.media.type === 'video' ? 'selected' : ''}>Video (MP4)</option>
                        <option value="youtube" ${section.media && section.media.type === 'youtube' ? 'selected' : ''}>YouTube</option>
                    </select>
                    <input type="text" placeholder="URL (e.g. https://...)" value="${section.media ? section.media.src : ''}" class="inp-media-src" style="flex:1;">
                </div>
            </div>
            <button class="delete-btn" style="margin-top:5px;">Remove Section</button>
        `;

        // BIND EVENTS (Directly updating reference object)
        li.querySelector('.inp-title').onchange = (e) => section.title = e.target.value;
        li.querySelector('.inp-content').onchange = (e) => section.content = e.target.value;
        li.querySelector('.inp-trigger').onchange = (e) => section.triggerLabel = e.target.value;

        // Media Logic
        const mediaType = li.querySelector('.inp-media-type');
        const mediaSrc = li.querySelector('.inp-media-src');

        const updateMedia = () => {
            if (mediaSrc.value.trim() === '') {
                delete section.media;
            } else {
                section.media = {
                    type: mediaType.value,
                    src: mediaSrc.value
                };
            }
        };

        mediaType.onchange = updateMedia;
        mediaSrc.onchange = updateMedia;

        li.querySelector('.delete-btn').onclick = () => {
            module.content.sections.splice(sIndex, 1);
            renderCanvas(); // Re-render whole canvas to update indices
        };

        list.appendChild(li);
    });

    addBtn.onclick = () => {
        module.content.sections.push({ title: "New Section", content: "<p>Content</p>", triggerLabel: "Next" });
        renderCanvas();
    };
}


// --- JSON EXPORT ---
exportBtn.addEventListener('click', () => {
    // 1. Gather Meta
    STATE.meta.title = document.getElementById('lesson-title').value;
    STATE.meta.description = document.getElementById('lesson-desc').value;
    STATE.meta.theme = {
        primaryColor: document.getElementById('lesson-color').value,
        fontBody: "Rajdhani, sans-serif"
    };

    // 2. Construct Final Object
    const manifest = {
        title: STATE.meta.title,
        description: STATE.meta.description,
        theme: STATE.meta.theme,
        modules: STATE.modules,
        artifacts: [] // TODO: Add global artifacts editor
    };

    // 3. Download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(manifest, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "manifest.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

// Initial Render
renderCanvas();
