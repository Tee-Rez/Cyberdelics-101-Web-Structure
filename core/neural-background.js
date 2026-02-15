/**
 * CYBERDELICS 101 - Neural Rhizome Background
 * 
 * An interactive HTML5 Canvas background featuring interconnected nodes
 * that drift and react to mouse interaction.
 */

class NeuralBackground {
    constructor(container = 'lesson-root', options = {}) {
        // Handle ID, Selector, or Element
        if (typeof container === 'string') {
            this.container = document.getElementById(container) || document.querySelector(container);
        } else {
            this.container = container;
        }

        if (!this.container) {
            console.error(`NeuralBackground: Container '${container}' not found.`);
            return; // Fail gracefully
        }

        this.options = {
            nodeCount: options.nodeCount || 80,
            connectionDistance: options.connectionDistance || 150,
            mouseRadius: options.mouseRadius || 200,
            nodeColor: options.nodeColor || 'rgba(123, 92, 255, 0.7)', // Cyberdelic Purple
            lineColor: options.lineColor || 'rgba(123, 92, 255, 0.2)',
            particleSpeed: options.particleSpeed || 0.5,
            ...options
        };

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'neural-canvas';
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.resizeTimeout = null;

        this.init();
    }

    init() {
        // Setup Canvas
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0'; // Behind content
        this.canvas.style.pointerEvents = 'none'; // Let clicks pass through

        // Insert as first child to ensure it's behind everything
        this.container.insertBefore(this.canvas, this.container.firstChild);

        // Event Listeners
        window.addEventListener('resize', () => this.handleResize());
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Initial Size & Populate
        this.resize();
        this.createParticles();

        // Start Loop
        this.animate();
    }

    handleResize() {
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.resize();
            this.createParticles(); // Re-create to fill new area
        }, 100);
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    createParticles() {
        this.particles = [];
        const area = this.canvas.width * this.canvas.height;
        // Density-based count: 1 particle per 15000px^2 (approx)
        const count = Math.floor(area / 15000);
        const particlesToCreate = Math.max(40, Math.min(count, 150)); // Clamp between 40 and 150

        for (let i = 0; i < particlesToCreate; i++) {
            const size = Math.random() * 2 + 1;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            // Velocity
            const vx = (Math.random() - 0.5) * this.options.particleSpeed;
            const vy = (Math.random() - 0.5) * this.options.particleSpeed;

            this.particles.push({ x, y, vx, vy, size, baseX: x, baseY: y });
        }
    }

    drawLines(p1) {
        for (let p2 of this.particles) {
            if (p1 === p2) continue;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.options.connectionDistance) {
                const opacity = 1 - (distance / this.options.connectionDistance);
                this.ctx.strokeStyle = this.options.lineColor.replace('0.2)', `${opacity * 0.3})`); // Dynamic opacity
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
            }
        }
    }

    connectMouse(p) {
        if (this.mouse.x === null) return;

        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.options.mouseRadius) {
            // Draw connection to mouse
            const opacity = 1 - (distance / this.options.mouseRadius);
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`; // Brighter white for mouse
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.stroke();

            // Push particle slightly
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (this.options.mouseRadius - distance) / this.options.mouseRadius;
            const directionX = forceDirectionX * force * this.options.particleSpeed * 2;
            const directionY = forceDirectionY * force * this.options.particleSpeed * 2;

            // Subtle repulsion
            p.x -= directionX;
            p.y -= directionY;
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let p of this.particles) {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Draw Node
            this.ctx.fillStyle = this.options.nodeColor;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Connect
            this.drawLines(p);
            this.connectMouse(p);
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Auto-initialize if running in standalone mode or just expose class
window.NeuralBackground = NeuralBackground;
