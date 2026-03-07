window.CyberneticLoopData = {
    eeg: [
        {
            id: 'body',
            label: 'Body Signal\nGeneration',
            icon: 'BODY',
            color: '#44ffaa',
            angle: -Math.PI / 2, // 12 o'clock
            step: 1,
            title: 'Body Signal Generation (EEG)',
            body: `The brain consists of billions of neurons that communicate via tiny electrical impulses. This collective electrical activity forms patterns called brainwaves.`,
            example: `When you are actively problem-solving or stressed, your neurons fire rapidly, producing high-frequency Beta waves. When you close your eyes and relax, the firing synchronizes into slower, rhythmic Alpha waves.`,
            why: `Brainwaves are the most direct window into cognitive state, focus, and mental tension.`,
        },
        {
            id: 'sensor',
            label: 'Sensor\nDetection',
            icon: 'SENS',
            color: '#00d9ff',
            angle: -Math.PI / 2 + (2 * Math.PI / 5),
            step: 2,
            title: 'Sensor Detection',
            body: `Non-invasive EEG sensors placed on the scalp detect the microvolts of electrical activity passing through the skull.`,
            example: `
<table class="sim-data-table">
    <thead>
        <tr><th>Sensor Type</th><th>What it Measures</th><th>Common Examples</th></tr>
    </thead>
    <tbody>
        <tr><td><strong>Dry Electrode (Consumer)</strong></td><td>Electrical activity at the forehead (primarily focus & relaxation).</td><td>Muse Headband, Flowtime</td></tr>
        <tr><td><strong>Wet Electrode (Clinical)</strong></td><td>High-resolution electrical activity across the entire scalp.</td><td>10-20 System Caps, Emotiv EPOC+</td></tr>
        <tr><td><strong>In-Ear EEG</strong></td><td>Electrical signals from within the ear canal.</td><td>NextMind (ear sensors), various research prototypes</td></tr>
    </tbody>
</table>`,
            why: `Sensors make the invisible visible. Without them, your physiological state remains locked inside your body — subjective, inaccessible, untrainable.`,
        },
        {
            id: 'algorithm',
            label: 'Algorithm\nProcessing',
            icon: 'ALGO',
            color: '#aa88ff',
            angle: -Math.PI / 2 + (4 * Math.PI / 5),
            step: 3,
            title: 'Algorithm Processing',
            body: `Software uses Fast Fourier Transform (FFT) to break down the chaotic raw electrical signal into distinct frequency bands to determine your mental state.`,
            example: `The algorithm constantly measures the ratio of Alpha (calm focus) to high-Beta (stress/anxiety). If Alpha dominance exceeds a certain threshold, it flags the state as "Relaxed."`,
            why: `The algorithm is the intelligence layer of the loop. Its accuracy determines the quality of the feedback.`,
        },
        {
            id: 'vr',
            label: 'VR Environment\nResponse',
            icon: 'VR',
            color: '#ff88cc',
            angle: -Math.PI / 2 + (6 * Math.PI / 5),
            step: 4,
            title: 'VR Environment Response',
            body: `The virtual world acts as a mirror for your mind. Cluttered, chaotic environments reflect a busy mind, while open, serene environments reflect mental stillness.`,
            example: `In an experience like Healium, a stormy virtual sky might gradually clear up and reveal stars as your Alpha wave production increases, rewarding a quiet mind.`,
            why: `The VR response is what makes this cyberdelic rather than just biofeedback. The environment is not just a display. It is a mirror.`,
        },
        {
            id: 'adjustment',
            label: 'Learner\nAdjustment',
            icon: 'ADJ',
            color: '#ffcc44',
            angle: -Math.PI / 2 + (8 * Math.PI / 5),
            step: 5,
            title: 'Learner Adjustment',
            body: `Seeing the visual representation of your mind allows you to practice letting go of wandering thoughts and consciously shifting your attention to maintain the serene visual state.`,
            example: `Most iterations happen below conscious awareness — but you are always aware that the environment is responding to you, and that awareness alone creates engagement, motivation, and accelerated learning.`,
            why: `This is why the cybernetic loop is more than biofeedback — it is a training system for consciousness itself.`,
        }
    ],
    hrv: [
        {
            id: 'body',
            label: 'Body Signal\nGeneration',
            icon: 'BODY',
            color: '#44ffaa',
            angle: -Math.PI / 2, // 12 o'clock
            step: 1,
            title: 'Body Signal Generation (HRV)',
            body: `Your heart rate is not perfectly steady; it naturally speeds up slightly when you inhale and slows down when you exhale. This dynamic variation between beats is called Heart Rate Variability.`,
            example: `A highly variable heart rate indicates a flexible, resilient nervous system capable of responding to stress and recovering quickly. A rigid, unchanging heart rate indicates chronic stress or depletion.`,
            why: `HRV is the gold standard biomarker for physiological resilience and the balance of the autonomic nervous system.`,
        },
        {
            id: 'sensor',
            label: 'Sensor\nDetection',
            icon: 'SENS',
            color: '#00d9ff',
            angle: -Math.PI / 2 + (2 * Math.PI / 5),
            step: 2,
            title: 'Sensor Detection',
            body: `Sensors use photoplethysmography (PPG) to shine light into the skin and measure blood volume changes, or ECG to measure electrical pulses from the heart.`,
            example: `
<table class="sim-data-table">
    <thead>
        <tr><th>Sensor Type</th><th>What it Measures</th><th>Common Examples</th></tr>
    </thead>
    <tbody>
        <tr><td><strong>PPG (Optical)</strong></td><td>Blood volume changes in capillaries using light (wrist/finger/earlobe).</td><td>Apple Watch, Oura Ring, HeartMath Inner Balance</td></tr>
        <tr><td><strong>ECG (Electrical)</strong></td><td>Electrical signals triggering heart muscle contractions (chest).</td><td>Polar H10 Chest Strap, clinical monitors</td></tr>
    </tbody>
</table>`,
            why: `Sensors make the invisible visible. Without them, your physiological state remains locked inside your body — subjective, inaccessible, untrainable.`,
        },
        {
            id: 'algorithm',
            label: 'Algorithm\nProcessing',
            icon: 'ALGO',
            color: '#aa88ff',
            angle: -Math.PI / 2 + (4 * Math.PI / 5),
            step: 3,
            title: 'Algorithm Processing',
            body: `The algorithm plots the beat-to-beat intervals over time to create an HRV waveform, analyzing how smooth or jagged the pattern is.`,
            example: `The software calculates a "Coherence Score." If the waveform resembles a highly ordered sine wave (meaning your heart, breath, and emotions are synchronized), the score goes up.`,
            why: `The algorithm is the intelligence layer of the loop. Its accuracy determines the quality of the feedback.`,
        },
        {
            id: 'vr',
            label: 'VR Environment\nResponse',
            icon: 'VR',
            color: '#ff88cc',
            angle: -Math.PI / 2 + (6 * Math.PI / 5),
            step: 4,
            title: 'VR Environment Response',
            body: `The environment breathes with your heart. The visual feedback explicitly rewards the smooth, repeating pattern of cardiac coherence.`,
            example: `A glowing mandala or a virtual flower might expand and contract in perfect synchrony with your heart rhythms, blooming fully only when coherence is maintained for several seconds.`,
            why: `The VR response is what makes this cyberdelic rather than just biofeedback. The environment is not just a display. It is a mirror.`,
        },
        {
            id: 'adjustment',
            label: 'Learner\nAdjustment',
            icon: 'ADJ',
            color: '#ffcc44',
            angle: -Math.PI / 2 + (8 * Math.PI / 5),
            step: 5,
            title: 'Learner Adjustment',
            body: `Upon seeing a jagged waveform, the user can consciously shift to "heart-focused breathing" (e.g., breathing in for 5 seconds, out for 5 seconds) and invoke positive emotions to manually smooth out the curve.`,
            example: `Most iterations happen below conscious awareness — but you are always aware that the environment is responding to you, and that awareness alone creates engagement, motivation, and accelerated learning.`,
            why: `This is why the cybernetic loop is more than biofeedback — it is a training system for consciousness itself.`,
        }
    ],
    gsr: [
        {
            id: 'body',
            label: 'Body Signal\nGeneration',
            icon: 'BODY',
            color: '#44ffaa',
            angle: -Math.PI / 2, // 12 o'clock
            step: 1,
            title: 'Body Signal Generation (GSR)',
            body: `The sympathetic nervous system (your "fight or flight" response) directly controls the activity of your eccrine sweat glands. Even microscopic changes in sweat alter how well your skin conducts electricity.`,
            example: `Just thinking about a stressful email or experiencing a sudden noise causes an imperceptible release of sweat, spiking your skin's electrical conductivity within seconds.`,
            why: `GSR is an involuntary, unfiltered metric of raw emotional arousal, psychological stress, and cognitive load.`,
        },
        {
            id: 'sensor',
            label: 'Sensor\nDetection',
            icon: 'SENS',
            color: '#00d9ff',
            angle: -Math.PI / 2 + (2 * Math.PI / 5),
            step: 2,
            title: 'Sensor Detection',
            body: `Electrodes placed on areas with high sweat gland density (like the fingertips or the palm of the hand) apply a tiny, imperceptible current to measure electrical resistance.`,
            example: `
<table class="sim-data-table">
    <thead>
        <tr><th>Sensor Type</th><th>What it Measures</th><th>Common Examples</th></tr>
    </thead>
    <tbody>
        <tr><td><strong>Fingertip Electrodes</strong></td><td>Changes in electrical resistance through sweat on the fingers.</td><td>Neurosity GSR sensors, research polygraphs</td></tr>
        <tr><td><strong>Wristband Sensors</strong></td><td>Sympathetic arousal via sweat glands on the wrist.</td><td>Empatica E4, some advanced fitness trackers</td></tr>
    </tbody>
</table>`,
            why: `Sensors make the invisible visible. Without them, your physiological state remains locked inside your body — subjective, inaccessible, untrainable.`,
        },
        {
            id: 'algorithm',
            label: 'Algorithm\nProcessing',
            icon: 'ALGO',
            color: '#aa88ff',
            angle: -Math.PI / 2 + (4 * Math.PI / 5),
            step: 3,
            title: 'Algorithm Processing',
            body: `The algorithm distinguishes between your baseline arousal (Tonic level) and sudden emotional reactions (Phasic spikes).`,
            example: `The software tracks how quickly you recover from a spike. A faster return to the baseline level indicates strong emotional regulation and stress recovery.`,
            why: `The algorithm is the intelligence layer of the loop. Its accuracy determines the quality of the feedback.`,
        },
        {
            id: 'vr',
            label: 'VR Environment\nResponse',
            icon: 'VR',
            color: '#ff88cc',
            angle: -Math.PI / 2 + (6 * Math.PI / 5),
            step: 4,
            title: 'VR Environment Response',
            body: `The environment is designed to visualize tension and release. High arousal might make the world darker or more restrictive, while low arousal opens the space up.`,
            example: `In a cyberdelic forest, high skin conductance might cause the trees to wither or colors to fade. As you relax and your conductance drops, the forest visually flourishes with vibrant life.`,
            why: `The VR response is what makes this cyberdelic rather than just biofeedback. The environment is not just a display. It is a mirror.`,
        },
        {
            id: 'adjustment',
            label: 'Learner\nAdjustment',
            icon: 'ADJ',
            color: '#ffcc44',
            angle: -Math.PI / 2 + (8 * Math.PI / 5),
            step: 5,
            title: 'Learner Adjustment',
            body: `Because GSR is an involuntary autonomic response, you cannot "force" it down. Seeing the spike teaches you to indirectly lower arousal by releasing muscle tension, shifting focus, or slowing the breath.`,
            example: `Most iterations happen below conscious awareness — but you are always aware that the environment is responding to you, and that awareness alone creates engagement, motivation, and accelerated learning.`,
            why: `This is why the cybernetic loop is more than biofeedback — it is a training system for consciousness itself.`,
        }
    ],
    respiration: [
        {
            id: 'body',
            label: 'Body Signal\nGeneration',
            icon: 'BODY',
            color: '#44ffaa',
            angle: -Math.PI / 2, // 12 o'clock
            step: 1,
            title: 'Body Signal Generation (Breath)',
            body: `The physical expansion and contraction of your chest and abdomen dictate gas exchange. More importantly, the rhythm of your breath serves as the remote control for your nervous system.`,
            example: `Short, shallow chest breathing signals danger to the brain, activating the sympathetic nervous system. Slow, deep belly breathing signals safety, activating the parasympathetic "rest and digest" system.`,
            why: `Respiration is the only autonomic function that you also have complete, immediate conscious control over, making it the primary gateway to biofeedback.`,
        },
        {
            id: 'sensor',
            label: 'Sensor\nDetection',
            icon: 'SENS',
            color: '#00d9ff',
            angle: -Math.PI / 2 + (2 * Math.PI / 5),
            step: 2,
            title: 'Sensor Detection',
            body: `Sensors track physical movement to measure breathing rate, depth, and rhythm.`,
            example: `
<table class="sim-data-table">
    <thead>
        <tr><th>Sensor Type</th><th>What it Measures</th><th>Common Examples</th></tr>
    </thead>
    <tbody>
        <tr><td><strong>Strain Gauge (Chest/Belly)</strong></td><td>Physical expansion and contraction of the torso during breaths.</td><td>Flowborne VR sensor, clinical elastic belts</td></tr>
        <tr><td><strong>Thermistor (Nasal)</strong></td><td>Temperature differences between inhaled (cool) and exhaled (warm) air.</td><td>Sleep study sensors</td></tr>
        <tr><td><strong>Microphone / Acoustic</strong></td><td>The sound and rhythm of the breath.</td><td>Various smartphone sleep tracking apps</td></tr>
    </tbody>
</table>`,
            why: `Sensors make the invisible visible. Without them, your physiological state remains locked inside your body — subjective, inaccessible, untrainable.`,
        },
        {
            id: 'algorithm',
            label: 'Algorithm\nProcessing',
            icon: 'ALGO',
            color: '#aa88ff',
            angle: -Math.PI / 2 + (4 * Math.PI / 5),
            step: 3,
            title: 'Algorithm Processing',
            body: `The software calculates mechanical breathing metrics: breaths per minute, the ratio of inhalation to exhalation time, and the consistency of the rhythm.`,
            example: `The algorithm looks for an elongated exhale. If your exhale is noticeably longer than your inhale, the system identifies that you are actively engaging your relaxation response.`,
            why: `The algorithm is the intelligence layer of the loop. Its accuracy determines the quality of the feedback.`,
        },
        {
            id: 'vr',
            label: 'VR Environment\nResponse',
            icon: 'VR',
            color: '#ff88cc',
            angle: -Math.PI / 2 + (6 * Math.PI / 5),
            step: 4,
            title: 'VR Environment Response',
            body: `The virtual world breathes alongside you, providing a pacing guide to help you match optimal respiratory rates for relaxation (usually around 5.5 to 6 breaths per minute).`,
            example: `A path of light moving through a TRIPP VR landscape might slow down or speed up to guide your breath, while particles in the air drift inward on your inhale and burst outward on your exhale.`,
            why: `The VR response is what makes this cyberdelic rather than just biofeedback. The environment is not just a display. It is a mirror.`,
        },
        {
            id: 'adjustment',
            label: 'Learner\nAdjustment',
            icon: 'ADJ',
            color: '#ffcc44',
            angle: -Math.PI / 2 + (8 * Math.PI / 5),
            step: 5,
            title: 'Learner Adjustment',
            body: `By matching your physical breathing to the visual expansion and contraction of the VR environment, you effortlessly adopt therapeutic breathing patterns, deeply relaxing your mind and body without needing to consciously count seconds.`,
            example: `Most iterations happen below conscious awareness — but you are always aware that the environment is responding to you, and that awareness alone creates engagement, motivation, and accelerated learning.`,
            why: `This is why the cybernetic loop is more than biofeedback — it is a training system for consciousness itself.`,
        }
    ]
};
