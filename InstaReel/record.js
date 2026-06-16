const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const path = require('path');

(async () => {
    console.log('🎬 Launching rendering engine...');
    const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--allow-file-access-from-files',
            '--disable-web-security',
            '--autoplay-policy=no-user-gesture-required'
        ]
    });

    const page = await browser.newPage();
    
    // Pipe page console logs to our terminal so we can see any React/Babel errors
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));

    // Set the exact dimensions of the reel
    await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

    // Load the isolated render page
    const filePath = `file:///${path.join(__dirname, 'render.html').replace(/\\/g, '/')}`;
    console.log(`🌐 Loading staging area: ${filePath}`);
    
    // Wait until network is idle so all fonts and videos are loaded
    await page.goto(filePath, { waitUntil: 'networkidle0' });

    // Give React an extra second to mount and settle
    await new Promise(r => setTimeout(r, 1000));

    // Setup recorder with high quality settings
    const recorder = new PuppeteerScreenRecorder(page, {
        fps: 60,
        videoFrame: { width: 1080, height: 1920 },
        videoCrf: 18, // 18 is visually lossless
        videoCodec: 'libx264',
        recordDurationLimit: 50 // safety limit
    });

    const outputPath = path.join(__dirname, 'final_reel.mp4');
    console.log('🎥 Recording started! Please wait about ~49 seconds...');
    await recorder.start(outputPath);

    // Trigger playback EXACTLY when recording begins for perfect sync
    await page.evaluate(() => {
        if (window.START_REEL_PLAYBACK) window.START_REEL_PLAYBACK();
    });

    // The reel total time is roughly 47.6 seconds. Wait for 49 to let the final card hang.
    await new Promise(r => setTimeout(r, 49000));

    console.log('✅ Recording finished, saving MP4...');
    await recorder.stop();
    await browser.close();

    console.log(`🎉 Done! Video successfully saved to: ${outputPath}`);
})();
