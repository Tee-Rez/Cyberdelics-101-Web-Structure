const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

        await page.goto("http://localhost:8000/Modules/test-player.html");
        await new Promise(r => setTimeout(r, 4000));

        const html = await page.$eval('.sim-controls', el => el.outerHTML).catch(e => "Error getting .sim-controls: " + e.message);
        console.log("\n--- Controls HTML ---");
        console.log(html);

        const rect = await page.$eval('.sim-controls', el => {
            const r = el.getBoundingClientRect();
            const cs = window.getComputedStyle(el);
            return {
                x: r.x, y: r.y, w: r.width, h: r.height,
                display: cs.display, visibility: cs.visibility, opacity: cs.opacity
            };
        }).catch(e => e.message);
        console.log("\n--- Controls Computed ---");
        console.log(rect);

        await browser.close();
    } catch (e) {
        console.error("Script error:", e);
    }
})();
