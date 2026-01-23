/**
 * Wave Interference Definition
 * Registers itself to window.SimulationEngines
 */
(function () {

    // Ensure registry
    window.SimulationEngines = window.SimulationEngines || {};

    window.SimulationEngines['WaveInterference'] = {
        name: 'Wave Interference',

        // Initial Parameter Values
        defaults: {
            frequency: 5,
            amplitude: 50,
            speed: 2,
            separation: 0
        },

        // UI Configuration
        config: [
            { id: 'frequency', label: 'Frequency (Hz)', min: 1, max: 20, step: 0.1 },
            { id: 'amplitude', label: 'Amplitude', min: 10, max: 100, step: 1 },
            { id: 'speed', label: 'Speed', min: 0, max: 10, step: 0.1 },
            { id: 'separation', label: 'Phase Shift', min: 0, max: 200, step: 1 }
        ],

        // Runtime State
        time: 0,
        width: 0,
        height: 0,

        init: function (container, params) {
            const canvas = container.querySelector('canvas');
            if (canvas) {
                this.width = canvas.width;
                this.height = canvas.height;
            }
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
        },

        update: function (dt, params) {
            this.time += dt * params.speed;
        },

        draw: function (ctx, params) {
            const w = this.width;
            const h = this.height;
            const cy = h / 2;

            // Clear
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, w, h);

            // Grid
            this._drawGrid(ctx, w, h);

            // Draw Wave 1 (Red)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 50, 50, 0.5)';
            ctx.lineWidth = 2;
            for (let x = 0; x < w; x++) {
                const y = Math.sin((x + this.time * 20) * params.frequency * 0.005) * params.amplitude;
                ctx.lineTo(x, cy + y - 50); // Offset up
            }
            ctx.stroke();

            // Draw Wave 2 (Blue)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(50, 50, 255, 0.5)';
            ctx.lineWidth = 2;
            for (let x = 0; x < w; x++) {
                // Determine phase/offset based on separation param
                const offset = params.separation;
                const y = Math.sin((x + this.time * 20 + offset) * params.frequency * 0.005) * params.amplitude;
                ctx.lineTo(x, cy + y + 50); // Offset down
            }
            ctx.stroke();

            // Draw Interference (Purple/White - The Sum)
            ctx.beginPath();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffffff';

            for (let x = 0; x < w; x++) {
                const offset = params.separation;
                // Wave 1 Value
                const y1 = Math.sin((x + this.time * 20) * params.frequency * 0.005) * params.amplitude;
                // Wave 2 Value
                const y2 = Math.sin((x + this.time * 20 + offset) * params.frequency * 0.005) * params.amplitude;

                // Sum
                const ySum = y1 + y2;

                ctx.lineTo(x, cy + ySum);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Labels
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px monospace';
            ctx.fillText('Wave 1', 10, cy - 60);
            ctx.fillStyle = '#aaaaff';
            ctx.fillText('Wave 2', 10, cy + 60);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px monospace';
            ctx.fillText('Interference Pattern (Sum)', 10, cy - 10);
        },

        _drawGrid: function (ctx, w, h) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;

            // Vertical lines
            for (let x = 0; x < w; x += 50) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = 0; y < h; y += 50) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // Center Line
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.stroke();
        },

        destroy: function () {
            // Cleanup
        },

        reset: function () {
            this.time = 0;
        }
    };

})();
