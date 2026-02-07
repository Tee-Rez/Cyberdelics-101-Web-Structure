/**
 * CYBERDELICS 101 - Method Loader
 * Auto-discovers and initializes teaching methods on the page
 * 
 * Usage:
 *   MethodLoader.register('progressive-disclosure', ProgressiveDisclosure);
 *   MethodLoader.initAll(document.body);
 */

const MethodLoader = (function () {
    'use strict';

    // ---------- Private State ----------
    const registry = {};      // methodName -> methodClass
    const instances = [];     // Active method instances
    const containerMap = new WeakMap();  // container element -> method instance

    // ---------- Registration ----------

    function register(methodName, methodClass) {
        registry[methodName] = methodClass;
        console.log(`[MethodLoader] Registered: ${methodName}`);
    }

    function registerFactory(methodName, factoryFn) {
        try {
            const MethodClass = factoryFn();
            register(methodName, MethodClass);
        } catch (e) {
            console.error(`[MethodLoader] Failed to register factory for ${methodName}:`, e);
        }
    }

    function unregister(methodName) {
        delete registry[methodName];
    }

    // ---------- Initialization ----------

    function initAll(rootContainer) {
        const root = rootContainer || document.body;
        const containers = root.querySelectorAll('[data-method]');

        containers.forEach(container => {
            initContainer(container);
        });

        console.log(`[MethodLoader] Initialized ${instances.length} method(s)`);
        return instances;
    }

    function initContainer(container) {
        const methodName = container.getAttribute('data-method');

        if (!methodName) {
            console.warn('[MethodLoader] Container missing data-method attribute');
            return null;
        }

        const MethodClass = registry[methodName];

        if (!MethodClass) {
            console.warn(`[MethodLoader] Method not registered: ${methodName}`);
            return null;
        }

        // Check if already initialized
        if (containerMap.has(container)) {
            return containerMap.get(container);
        }

        // Get options from data attributes
        const options = parseDataOptions(container);

        // Create and initialize method
        const instance = Object.create(MethodClass);
        instance.init(container, options);

        // Track instance
        instances.push(instance);
        containerMap.set(container, instance);

        // Register with CourseCore if available
        if (typeof CourseCore !== 'undefined' && CourseCore.registerMethod) {
            CourseCore.registerMethod(instance);
        }

        return instance;
    }

    function parseDataOptions(container) {
        const options = {};

        // Parse data-option-* attributes
        Array.from(container.attributes).forEach(attr => {
            if (attr.name.startsWith('data-option-')) {
                const key = attr.name.replace('data-option-', '')
                    .replace(/-([a-z])/g, g => g[1].toUpperCase()); // kebab to camel

                // Try to parse JSON, otherwise use string
                try {
                    options[key] = JSON.parse(attr.value);
                } catch {
                    options[key] = attr.value;
                }
            }
        });

        return options;
    }

    // ---------- Instance Access ----------

    function getMethod(container) {
        return containerMap.get(container);
    }

    function getAllInstances() {
        return [...instances];
    }

    function getByName(methodName) {
        return instances.filter(inst => inst._getName && inst._getName() === methodName);
    }

    // ---------- Cleanup ----------

    function destroyAll() {
        instances.forEach(instance => {
            if (instance.destroy) {
                instance.destroy();
            }
        });
        instances.length = 0;
        console.log('[MethodLoader] All methods destroyed');
    }

    function destroyMethod(container) {
        const instance = containerMap.get(container);
        if (instance) {
            instance.destroy();
            containerMap.delete(container);
            const idx = instances.indexOf(instance);
            if (idx > -1) instances.splice(idx, 1);
        }
    }

    // ---------- Nested Method Support ----------

    function initNested(parentContainer, childSelector) {
        const parentMethod = containerMap.get(parentContainer);
        const childContainers = parentContainer.querySelectorAll(childSelector || '[data-method]');

        childContainers.forEach(childContainer => {
            // Skip if same as parent
            if (childContainer === parentContainer) return;

            const childMethod = initContainer(childContainer);
            if (childMethod && parentMethod && parentMethod.addChild) {
                parentMethod.addChild(childMethod, childContainer);
            }
        });
    }

    // ---------- Public API ----------

    // Expose globally
    window.MethodLoader = {
        register,
        registerFactory,
        unregister,
        initAll,
        initContainer,
        initNested,
        getMethod,
        getAllInstances,
        getByName,
        destroyAll,
        destroyMethod,

        // Debug access
        _getRegistry: function () { return registry; }
    };

    return window.MethodLoader;
})();