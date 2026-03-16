/**
 * External Links Method
 * Dynamically fetches, parses, and renders Markdown external links
 * 
 * Factory Pattern Template
 */

(function () {
    'use strict';

    if (typeof createTeachingMethod === 'undefined') {
        console.error('Core dependency "method-base.js" missing.');
        return;
    }

    const ExternalLinksFactory = function () {
        return createTeachingMethod('external-links', {

            // ---------- Private State ----------
            parsedData: null,
            markdownPath: null,

            // ---------- Lifecycle Hooks ----------

            onInit: function (container, options) {
                console.log('[ExternalLinks] onInit called with options:', options);
                
                // Determine the correct path to the markdown file
                if (options.markdownPath) {
                    this.markdownPath = options.markdownPath;
                } else if (options.modulePath) {
                    this.markdownPath = `Modules/${options.modulePath}/External-Links.md`;
                }
                
                if (!this.markdownPath) {
                    container.innerHTML = '<div class="el-error">Error: No markdown path provided in module configuration.</div>';
                    return;
                }

                container.innerHTML = '<div class="el-loading">Accessing Nexus Archives...</div>';
                
                this.fetchAndRender(container);
            },

            fetchAndRender: async function(container) {
                try {
                    // Try to get base path exactly like other modules
                    let basePath = '';
                    const urlPath = new URL(window.location.href).pathname;
                    if (urlPath.includes('/Modules/')) {
                        // We are deep inside a module map
                        const depth = (urlPath.match(/\//g) || []).length - (urlPath.indexOf('/Modules/') > -1 ? urlPath.indexOf('/Modules/') : 0);
                        basePath = '../'.repeat(depth > 1 ? depth - 1 : 0);
                    }
                    
                    // Build clean path relative to project root
                    // The viewer is accessed via /Modules/external-links-viewer.html
                    // So to get to /Modules/Module_... we just go up one level
                    
                    const isRoot = window.location.pathname.endsWith('CyberneticLoop.html') || window.location.pathname.endsWith('/');
                    
                    // If we are in the viewer we go up one level, otherwise use the path
                    const finalFetchPath = window.location.pathname.includes('/Modules/') 
                        ? `../${this.markdownPath}` 
                        : this.markdownPath;
                    
                    console.log(`[ExternalLinks] Fetching markdown from: ${finalFetchPath}`);

                    const response = await fetch(finalFetchPath);
                    if (!response.ok) {
                        // Fallback attempt to root
                        const fallbackResponse = await fetch('/' + this.markdownPath);
                        if (!fallbackResponse.ok) {
                            throw new Error(`Failed to load ${this.markdownPath}: ${response.statusText}`);
                        }
                        const fallbackText = await fallbackResponse.text();
                        this.parsedData = this.parseMarkdown(fallbackText);
                    } else {
                        const text = await response.text();
                        this.parsedData = this.parseMarkdown(text);
                    }
                    
                    this.renderUI(container);
                    
                } catch (error) {
                    console.error('[ExternalLinks] fetch error:', error);
                    container.innerHTML = `<div class="el-error">Error loading links: ${error.message}</div>`;
                }
            },

            parseMarkdown: function(markdown) {
                const data = {
                    title: "External Links & Further Reading",
                    description: "",
                    categories: []
                };

                const lines = markdown.split('\n');
                let currentCategory = null;

                const titleMatch = /^#\s+(.+)$/;
                const subtitleMatch = /^##\s+(.+)$/;
                const categoryMatch = /^###\s+(.+)$/;
                // Match links formatted exactly as: - [Link Name](http://link) - Description
                // Or missing the hyphen: - [Link Name](http://link) Description
                const linkMatch = /^-\s+\[(.*?)\]\((.*?)\)(?:\s+[-:]?\s*(.*))?$/;
                
                let readingHeaderDescription = true;

                for (let line of lines) {
                    line = line.trim();
                    if (!line) continue;

                    const tMatch = line.match(titleMatch);
                    if (tMatch) {
                        data.title = tMatch[1];
                        continue;
                    }

                    const cMatch = line.match(categoryMatch) || line.match(subtitleMatch);
                    if (cMatch) {
                        readingHeaderDescription = false;
                        currentCategory = {
                            title: cMatch[1],
                            links: []
                        };
                        data.categories.push(currentCategory);
                        continue;
                    }

                    const lMatch = line.match(linkMatch);
                    if (lMatch && currentCategory) {
                        currentCategory.links.push({
                            title: lMatch[1],
                            url: lMatch[2],
                            description: lMatch[3] || ""
                        });
                        continue;
                    }

                    if (readingHeaderDescription && !line.startsWith('#') && !line.startsWith('-')) {
                        if (data.description) data.description += ' ';
                        data.description += line;
                    }
                }

                return data;
            },

            renderUI: function(container) {
                if (!this.parsedData) return;

                const { title, description, categories } = this.parsedData;
                
                let html = `
                    <div class="el-header">
                        <h1>${title}</h1>
                        ${description ? `<p>${description}</p>` : ''}
                    </div>
                `;

                categories.forEach((cat, index) => {
                    if (cat.links.length === 0) return;
                    
                    const delayStr = `style="animation-delay: ${0.2 + (index * 0.1)}s"`;
                    
                    html += `
                        <div class="el-category" ${delayStr}>
                            <h2>${cat.title}</h2>
                            <div class="el-links-grid">
                    `;

                    cat.links.forEach((link) => {
                        html += `
                            <div class="el-card">
                                <div class="el-card-content">
                                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="el-card-title">${link.title}</a>
                                    <div class="el-card-desc">${link.description}</div>
                                </div>
                            </div>
                        `;
                    });

                    html += `
                            </div>
                        </div>
                    `;
                });

                container.innerHTML = html;

                // External links do not track progress or "complete" the lesson.
                // They just display information statically.
            },

            onDestroy: function () { }
        });
    };

    if (window.MethodLoader) {
        window.MethodLoader.registerFactory('external-links', ExternalLinksFactory);
    }
    window.ExternalLinksFactory = ExternalLinksFactory;

})();
