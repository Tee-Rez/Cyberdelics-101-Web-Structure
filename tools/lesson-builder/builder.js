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
    // Clear list but keep connection layer
    canvasContainer.innerHTML = '<svg id="connections-layer"></svg>';

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
        } else if (mod.type === 'scenario-based') {
            renderScenarioEditor(mod, editorContainer);
        } else {
            editorContainer.innerHTML = `<p style="color:#666; font-style:italic;">Editor for ${mod.type} not yet implemented.</p>`;
        }

        // Render Artifacts
        renderArtifactsList(mod, card.querySelector(`#artifacts-${mod.id}`));
    });

    // Re-append drop hint
    canvasContainer.appendChild(dropHint);

    // Update connections after DOM update
    setTimeout(updateConnections, 50);
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


// --- SCENARIO BASED EDITOR ---
function renderScenarioEditor(module, container) {
    container.innerHTML = `
        <h4>SCENES (Branching Logic)</h4>
        <ul class="scenes-list" style="list-style:none; padding:0; display:flex; flex-direction:column; gap:15px;"></ul>
        <button class="btn-small btn-add-scene" style="margin-top:10px;">+ ADD SCENE</button>
    `;

    const list = container.querySelector('.scenes-list');
    const addBtn = container.querySelector('.btn-add-scene');

    // Ensure scenes array exists
    if (!module.content.scenes) module.content.scenes = [];

    // Get all current IDs for dropdowns
    const availableIds = module.content.scenes.map(s => s.id);

    // Render Scenes
    module.content.scenes.forEach((scene, sIndex) => {
        const li = document.createElement('li');
        li.setAttribute('data-scene-id', scene.id); // HOOK FOR CONNECTOR
        li.style.cssText = "background: #111; border: 1px solid #333; padding: 15px; border-radius: 4px; position: relative;";
        li.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <div class="form-group" style="flex:1; margin-right:10px;">
                    <label>Scene ID (Unique)</label>
                    <input type="text" value="${scene.id}" class="inp-id" style="font-weight:bold; color:#00d9ff;">
                </div>
                <button class="delete-btn btn-del-scene">❌ Scene</button>
            </div>

            <div class="form-group">
                <label>Narrative (HTML)</label>
                <textarea class="inp-narrative" style="height:80px;">${scene.narrative || ''}</textarea>
            </div>

            <div class="form-group">
                <label>Media Asset</label>
                <div style="display:flex; gap:5px;">
                    <select class="inp-media-type" style="background:#000; border:1px solid #333; color:#fff; width: 100px;">
                        <option value="image" ${scene.media && scene.media.type === 'image' ? 'selected' : ''}>Image</option>
                        <option value="video" ${scene.media && scene.media.type === 'video' ? 'selected' : ''}>Video</option>
                        <option value="youtube" ${scene.media && scene.media.type === 'youtube' ? 'selected' : ''}>YouTube</option>
                    </select>
                    <input type="text" placeholder="Media URL..." value="${scene.media ? scene.media.src : ''}" class="inp-media-src" style="flex:1;">
                </div>
            </div>

            <!-- CHOICES -->
            <div style="margin-top:15px; background:#000; padding:10px; border:1px solid #222;">
                <label style="color:#666; font-size:10px; text-transform:uppercase;">Decisions / Choices</label>
                <ul class="choices-list" style="list-style:none; padding:0; margin-top:5px; display:flex; flex-direction:column; gap:5px;"></ul>
                <button class="btn-small btn-add-choice" style="margin-top:5px; font-size:10px;">+ Add Choice</button>
            </div>
        `;

        // BIND SCENE EVENTS
        // When ID changes, we must re-render the whole canvas to update dropdowns elsewhere
        li.querySelector('.inp-id').onchange = (e) => {
            const newId = e.target.value.trim();

            if (!newId) {
                alert(`⚠️ Error: Scene ID cannot be empty.`);
                e.target.value = scene.id; // Revert
                return;
            }

            // Check for duplicate (exclude self)
            const exists = module.content.scenes.some(s => s.id === newId && s !== scene);
            if (exists) {
                alert(`⚠️ Error: Scene ID "${newId}" already exists. Please choose a unique ID.`);
                e.target.value = scene.id; // Revert
                return;
            }

            scene.id = newId;
            renderCanvas();
        };
        li.querySelector('.inp-narrative').onchange = (e) => scene.narrative = e.target.value;
        li.querySelector('.btn-del-scene').onclick = () => {
            if (confirm("Delete this scene?")) {
                module.content.scenes.splice(sIndex, 1);
                renderCanvas();
            }
        };

        // Media Logic
        const mediaType = li.querySelector('.inp-media-type');
        const mediaSrc = li.querySelector('.inp-media-src');
        const updateMedia = () => {
            if (mediaSrc.value.trim() === '') {
                delete scene.media;
            } else {
                scene.media = { type: mediaType.value, src: mediaSrc.value };
            }
        };
        mediaType.onchange = updateMedia;
        mediaSrc.onchange = updateMedia;

        // RENDER CHOICES
        const choicesList = li.querySelector('.choices-list');
        const addChoiceBtn = li.querySelector('.btn-add-choice');

        if (!scene.choices) scene.choices = [];

        const renderChoices = () => {
            choicesList.innerHTML = '';
            scene.choices.forEach((choice, cIndex) => {
                // Generate Options for Dropdown
                let optionsHtml = '<option value="">-- End Scene --</option>';
                availableIds.forEach(id => {
                    // Don't link to self (optional, but good practice)
                    if (id !== scene.id) {
                        const selected = choice.outcome === id ? 'selected' : '';
                        optionsHtml += `<option value="${id}" ${selected}>${id}</option>`;
                    }
                });

                const cItem = document.createElement('li');
                cItem.setAttribute('data-choice-idx', cIndex + 1);
                cItem.setAttribute('data-choice-id', choice.id); // Identity for highlighting

                // Styling based on state
                const isHighlighted = (choice.id === highlightedChoiceId);
                const bgStyle = isHighlighted ? 'background:rgba(255, 0, 85, 0.2); border-left: 2px solid #ff0055;' : '';
                const badgeColor = isHighlighted ? '#ff0055' : '#00d9ff';

                cItem.style.cssText = `display:flex; gap:5px; align-items:center; margin-bottom: 5px; padding: 4px; border-radius: 4px; transition: background 0.2s; ${bgStyle}`;

                cItem.innerHTML = `
                    <span class="choice-badge" style="background:${badgeColor}; cursor:pointer; color:#000; font-size:10px; font-weight:bold; width:16px; height:16px; display:flex; align-items:center; justify-content:center; border-radius:50%; margin-right:5px;">${cIndex + 1}</span>
                    <input type="text" value="${choice.label}" placeholder="Label (e.g. 'Turn Left')" class="inp-c-label" style="flex:1; font-size:11px;">
                    <span style="color:#444;">⮕</span>
                    <select class="inp-c-outcome" style="width:120px; font-size:11px; color:#00d9ff; background:#111; border:1px solid #333;">
                        ${optionsHtml}
                    </select>
                    <button class="delete-btn btn-del-choice" style="padding:2px;">❌</button>
                `;

                // Badge Click Handler
                cItem.querySelector('.choice-badge').onclick = () => {
                    const wasSelected = (highlightedChoiceId === choice.id);
                    highlightedChoiceId = wasSelected ? null : choice.id;

                    // Global Visual Update (avoid re-render to prevent scroll jumps)
                    document.querySelectorAll('li[data-choice-id]').forEach(el => {
                        const uid = el.getAttribute('data-choice-id');
                        const isSel = (uid === highlightedChoiceId);
                        const badge = el.querySelector('.choice-badge');

                        if (isSel) {
                            el.style.background = 'rgba(255, 0, 85, 0.2)';
                            el.style.borderLeft = '2px solid #ff0055';
                            if (badge) badge.style.background = '#ff0055';
                        } else {
                            el.style.background = '';
                            el.style.borderLeft = '';
                            if (badge) badge.style.background = '#00d9ff';
                        }
                    });

                    updateConnections();
                };

                cItem.querySelector('.inp-c-label').onchange = (e) => choice.label = e.target.value;
                cItem.querySelector('.inp-c-outcome').onchange = (e) => {
                    choice.outcome = e.target.value;
                    renderChoices(); // Updates logic
                    updateConnections(); // Updates lines
                };
                cItem.querySelector('.btn-del-choice').onclick = () => {
                    scene.choices.splice(cIndex, 1);
                    renderChoices();
                };
                choicesList.appendChild(cItem);
            });
            setTimeout(updateConnections, 50); // Draw lines after render
        };
        renderChoices();

        addChoiceBtn.onclick = () => {
            scene.choices.push({ id: `c_${Date.now()}`, label: "", outcome: "" });
            renderChoices();
        };

        list.appendChild(li);
    });

    addBtn.onclick = () => {
        let count = module.content.scenes.length + 1;
        let nextId = `scene-${count}`;

        // Ensure unique auto-id
        while (module.content.scenes.some(s => s.id === nextId)) {
            count++;
            nextId = `scene-${count}`;
        }

        module.content.scenes.push({ id: nextId, narrative: "<p>What happens next?</p>", choices: [] });
        renderCanvas();
    };

    setTimeout(updateConnections, 100); // Initial Draw
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

    // 2a. VALIDATION
    const errors = [];
    manifest.modules.forEach(mod => {
        if (mod.type === 'scenario-based' && mod.content.scenes) {
            const sceneIds = mod.content.scenes.map(s => s.id);
            mod.content.scenes.forEach(scene => {
                if (scene.choices) {
                    scene.choices.forEach(choice => {
                        if (choice.outcome && !sceneIds.includes(choice.outcome)) {
                            errors.push(`Module "${mod.title}": Choice "${choice.label}" points to MISSING scene: "${choice.outcome}"`);
                        }
                    });
                }
            });
        }
    });

    if (errors.length > 0) {
        alert("⚠️ VALIDATION ERRORS:\n\n" + errors.join("\n") + "\n\nPlease fix these broken links before exporting.");
        return;
    }

    // 3. Size Check
    const jsonStr = JSON.stringify(manifest, null, 2);
    const sizeBytes = new Blob([jsonStr]).size;
    const sizeKB = (sizeBytes / 1024).toFixed(1);

    if (sizeBytes > 500 * 1024) { // 500KB Threshold
        alert(
            `⚠️ FILE TOO LARGE FOR EXPORT (${sizeKB} KB)\n\n` +
            `This file is too big to paste directly into Framer.\n` +
            `The "☁ SAVE TO GITHUB" button has been ENABLED.\n` +
            `Please use that instead.`
        );

        // ENABLE CLOUD SAVE
        btnCloudSave.disabled = false;
        btnCloudSave.style.opacity = '1';
        btnCloudSave.style.cursor = 'pointer';
        btnCloudSave.title = "Ready to Upload";

        // Highlight it
        btnCloudSave.style.border = "2px solid #fff";
        setTimeout(() => btnCloudSave.style.border = "none", 1000);

        return; // STOP DOWNLOAD
    }

    // 4. Download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "manifest.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

// Initial Render
renderCanvas();

// --- GITHUB CLOUD SAVE LOGIC ---

// ---------------------------------------------------------
// HARDCODED CONFIGURATION (EDIT THIS ONCE)
// ---------------------------------------------------------
const GH_CONFIG = {
    user: "Tee-Rez",
    repo: "Cyberdelics-101-Web-Structure",
    branch: "main",
    folder: "manifests", // Directory in repo
    token: "PASTE_YOUR_TOKEN_HERE" // <--- PASTE YOUR GITHUB TOKEN HERE
};
// ---------------------------------------------------------

// Hide settings button since we are hardcoding
document.getElementById('btn-gh-settings').style.display = 'none';

// DISABLE CLOUD SAVE BY DEFAULT
const btnCloudSave = document.getElementById('btn-cloud-save');
btnCloudSave.disabled = true;
btnCloudSave.style.opacity = '0.5';
btnCloudSave.style.cursor = 'not-allowed';
btnCloudSave.title = "Only available for large files (>500KB)";

// --- CORE SAVE FUNCTION ---
document.getElementById('btn-cloud-save').onclick = async () => {
    // 1. Check Config
    if (!GH_CONFIG.token) {
        alert('Please open "builder.js" and paste your GitHub Token into the GH_CONFIG object at line ~295.');
        return;
    }

    // 2. Prepare Data
    // Update Meta first
    STATE.meta.title = document.getElementById('lesson-title').value;
    STATE.meta.description = document.getElementById('lesson-desc').value;
    STATE.meta.theme = {
        primaryColor: document.getElementById('lesson-color').value,
        fontBody: "Rajdhani, sans-serif"
    };
    const manifest = {
        title: STATE.meta.title,
        description: STATE.meta.description,
        theme: STATE.meta.theme,
        modules: STATE.modules,
        artifacts: []
    };

    // 3. Generate Filename (Slugify Title)
    // e.g. "Intro Lesson" -> "intro-lesson"
    const slug = STATE.meta.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const filename = `${slug}.json`;
    const path = `${GH_CONFIG.folder}/${filename}`;

    // 4. Encode Content
    const content = JSON.stringify(manifest, null, 2);
    const contentEncoded = btoa(unescape(encodeURIComponent(content))); // Robust Base64

    // 5. GitHub API Request (PUT)
    const url = `https://api.github.com/repos/${GH_CONFIG.user}/${GH_CONFIG.repo}/contents/${path}`;

    const btn = document.getElementById('btn-cloud-save');
    const originalText = btn.textContent;
    btn.textContent = "UPLOADING...";
    btn.disabled = true;

    try {
        // First, check if file exists (to get SHA for update)
        let sha = null;
        try {
            const check = await fetch(url, {
                headers: {
                    'Authorization': `token ${GH_CONFIG.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (check.ok) {
                const checkJson = await check.json();
                sha = checkJson.sha;
            }
        } catch (e) { console.log('File likely does not exist yet'); }

        // PUT Request
        const body = {
            message: `feat: update lesson ${filename} via builder`,
            content: contentEncoded,
            branch: GH_CONFIG.branch
        };
        if (sha) body.sha = sha;

        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GH_CONFIG.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error(await res.text());

        // SHOW SIMPLE SUCCESS MESSAGE
        const msg = `✅ SAVED!\n\nUse this ID in Framer:\n${slug}`;
        alert(msg);
        console.log(msg);

    } catch (err) {
        console.error(err);
        alert('UPLOAD FAILED: ' + err.message);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
};


// --- VISUAL CONNECTORS LOGIC ---
let highlightedChoiceId = null;

function updateConnections() {
    const connectorsLayer = document.getElementById('connections-layer');
    if (!connectorsLayer) return;

    // Clear existing
    connectorsLayer.innerHTML = '';

    // Get container offset for relative calculation
    const container = document.getElementById('canvas-container');
    const cRect = container.getBoundingClientRect();

    // Find all Choice Outcome Selects that have a value
    const outcomes = document.querySelectorAll('.inp-c-outcome');

    outcomes.forEach(select => {
        const targetId = select.value;
        if (!targetId) return;

        // Find Target Scene Card
        // We look for the <li> with data-scene-id matches
        const targetCard = document.querySelector(`li[data-scene-id="${targetId}"]`);

        if (targetCard) {
            // Calculate Coords
            const startEl = select.closest('li'); // The Choice Row
            const sRect = startEl.getBoundingClientRect();
            const tRect = targetCard.getBoundingClientRect();

            // Check if this choice is highlighted
            const choiceId = startEl.getAttribute('data-choice-id');
            const isHighlighted = (choiceId === highlightedChoiceId);

            // Colors
            const colorDefault = "#00d9ff";
            const colorActive = "#ff0055"; // Pink/Red for active
            const currentColor = isHighlighted ? colorActive : colorDefault;

            // Start: Left Center of Choice Row
            // End: Top Left of Scene Card

            // Adjust to be relative to SVG container (canvas-container)
            // padding-left of container is 40px in styles, let's start line at left margin of choice

            const startX = (sRect.left - cRect.left) - 10;
            const startY = (sRect.top - cRect.top) + (sRect.height / 2);

            const endX = (tRect.left - cRect.left) - 5;
            const endY = (tRect.top - cRect.top) + 20;

            // --- ARC CURVATURE SETTINGS ---
            // "The further it is from the next scene the larger the arch"
            const distY = Math.abs(endY - startY);

            // ADJUST THIS VALUE TO CHANGE ARC INTENSITY
            const arcFactor = 0.4;
            const arcOffset = 60 + (distY * arcFactor);

            // Bezier Curve Control Points
            const cp1X = startX - arcOffset;
            const cp1Y = startY;
            const cp2X = endX - arcOffset;
            const cp2Y = endY;

            // PATH
            const d = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

            // COLOR (Based on index)
            // We can cycle colors or just use primary cyan

            // SVG Elements
            // 1. Path
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", d);
            path.setAttribute("class", "connector-path");

            // Styles
            path.style.stroke = currentColor;
            path.style.strokeWidth = isHighlighted ? "4px" : "2px"; // Thicker if active
            path.style.zIndex = isHighlighted ? "100" : "0";

            connectorsLayer.appendChild(path);

            // 2. Badge (Number)
            const idx = startEl.getAttribute('data-choice-idx') || "?";

            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.innerHTML = `
                <circle cx="${startX}" cy="${startY}" r="8" class="connector-bg" style="stroke:${currentColor}" />
                <text x="${startX}" y="${startY + 1}" class="connector-badge" style="fill:${currentColor}">${idx}</text>
            `;
            connectorsLayer.appendChild(group);
        }
    });
}

// Update connections on resize/scroll
window.addEventListener('resize', updateConnections);
// Since simple scrolling doesn't change relative positions of elements inside the container,
// we only need to update if layout shifts.
// But if canvas-area scrolls, we are fine because SVG moves with container.
