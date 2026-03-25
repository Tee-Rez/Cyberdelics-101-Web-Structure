/**
 * Ecosystem Map - Static Data
 * All panel content sourced from Module 5 lesson manifests.
 */
(function () {
    window.EcosystemMapData = {

        // SVG layout constants
        svg: { width: 500, height: 460, cx: 250, cy: 230 },
        orbitRadius: 170,
        nodeRadius: 34,

        nodes: [
            {
                id: 'tech',
                label: 'TECHNOLOGY\nPROVIDERS',
                color: '#06b6d4',
                angle: 270,
                subtitle: 'Hardware · Software · Open Source',
                role: 'Build the tools the entire field runs on. Every platform, research protocol, and clinical application depends on hardware manufacturers and software developers whose strategic decisions define the field\'s capability ceiling.',
                players: ['Meta Quest (77% share)', 'Apple Vision Pro', 'Pico / ByteDance', 'TRIPP', 'Healium', 'Guided Meditation VR'],
                connections: ['knowledge', 'economic', 'regulatory'],
                challenge: 'Headsets weigh 500–650g, last 2–3 hours, and cause motion sickness in 10–30% of users. Fragmentation (Quest/Vision Pro/Pico incompatibility) multiplies developer costs and breaks research replication. TRIPP\'s consumer shutdown disrupted 85,000 subscribers and multiple university research partnerships simultaneously.',
                opportunity: 'Sub-400g headsets, 4K per-eye resolution, and $199 price points are 2–3 years out. Eye-tracking opens new biofeedback channels. AI-personalized real-time environments are emerging as a distinct capability layer.',
                ripple: 'Every hardware spec decision — battery life, tracking precision, price point — ripples to developers, researchers, practitioners, and investors. The field\'s capability ceiling is set here.'
            },
            {
                id: 'knowledge',
                label: 'KNOWLEDGE\nPRODUCERS',
                color: '#6366f1',
                angle: 315,
                subtitle: 'Research Institutions · Academics · Publications',
                role: 'Validate effectiveness and establish safety. Their peer-reviewed findings are the credibility infrastructure the entire ecosystem depends on — giving clinical practitioners, investors, and regulators the evidence base to act.',
                players: ['Stanford VHIL (100+ papers)', 'Imperial College (Carhart-Harris)', 'Univ. Barcelona (Mel Slater)', 'Johns Hopkins (MEQ)', 'Catholic Univ. Milan (Riva 2025)', 'Monash University'],
                connections: ['clinical', 'tech', 'economic', 'regulatory'],
                challenge: 'The research pipeline takes 2–5 years from hypothesis to publication. Nearly all studies measure outcomes at 1–4 weeks. Evidence base is overwhelmingly WEIRD (Western, Educated, Industrialized, Rich, Democratic).',
                opportunity: 'Riva\'s 2025 study (Dialogues in Clinical Neuroscience) demonstrated cyberdelic VR produces effects comparable to LSD and psilocybin at therapeutic doses. 5-year outcome studies would answer every serious clinician\'s key question and accelerate insurance reimbursement.',
                ripple: 'A single landmark study can shift investor sentiment, update facilitator training curricula, open regulatory pathways, and reshape developer priorities simultaneously.'
            },
            {
                id: 'clinical',
                label: 'CLINICAL\nPRACTICE',
                color: '#a855f7',
                angle: 0,
                subtitle: 'Therapists · Psychiatrists · Healthcare Systems',
                role: 'Translate research into real patient care. Their adoption signals to insurers and regulators that the technology has genuine therapeutic value.',
                players: ['RelieVRx / AppliedVR (FDA De Novo)', 'XRHealth (Medicare E1905)', 'Limbix (FDA Breakthrough)', 'Oxford VR', 'Psious'],
                connections: ['knowledge', 'facilitators', 'economic', 'regulatory'],
                challenge: 'Insurance reimbursement is narrow — only RelieVRx and XRHealth have established pathways. Clinical continuity expectations make platform closures far more disruptive than consumer churn. Overclaiming outcomes risks burning credibility with the medical establishment.',
                opportunity: 'Commercial insurers historically follow Medicare coverage within 3–7 years. Multiple FDA Breakthrough Device designations in progress for anxiety, treatment-resistant depression, and addiction. Hospital VR programs scaling from pilots.',
                ripple: 'FDA clearance for a VR therapy device immediately validates the field to insurers, attracts clinical investment, and signals to every other developer that the regulatory pathway is navigable.'
            },
            {
                id: 'facilitators',
                label: 'FACILITATORS\n& GUIDES',
                color: '#ec4899',
                angle: 45,
                subtitle: 'Wellness Practitioners · Guides · Retreat Leaders',
                role: 'The field\'s primary human point of contact. Non-clinical facilitators manage preparation, presence, and integration — and often determine whether a user becomes a long-term practitioner or a one-time curiosity.',
                players: ['Cyberdelic Nexus (certification)', 'Cyberdelic Society (global events)', 'Multiversity', 'VRAR Association'],
                connections: ['clinical', 'users', 'educators'],
                challenge: 'Legal scope is undefined — what non-licensed facilitators can offer varies by state and has no federal codification. Liability for adverse events is unresolved. No recognized credential exists yet.',
                opportunity: 'Facilitators engaging in professional association formation are writing the field\'s governance. Full-time income of $40,000–$100,000+ is achievable within 18–36 months. AI-assisted tools could expand reach beyond what any individual can serve.',
                ripple: 'As training matures and ethics standards crystallize, the facilitator pathway becomes legible to regulators and insurers — unlocking reimbursement and institutional access that currently requires a clinical license.'
            },
            {
                id: 'users',
                label: 'USERS &\nCOMMUNITIES',
                color: '#f59e0b',
                angle: 90,
                subtitle: 'Personal Practitioners · Peer Networks · Early Adopters',
                role: 'Generate real-world feedback and cultural momentum. Users are the foundation every other pathway builds on — their experiences validate platforms and produce firsthand accounts no researcher or developer claim can replicate.',
                players: ['Cyberdelic Society', 'Reddit r/cyberdelics', 'Discord peer networks', 'Cyberdelic Hackathon Berlin'],
                connections: ['facilitators', 'knowledge', 'tech'],
                challenge: 'User base skews overwhelmingly affluent, educated, and tech-comfortable. First-year cost of $700–$1,300 excludes most of the world. Only ~15 million VR headsets in active use globally.',
                opportunity: 'Users with genuine experiences are the field\'s most credible ambassadors. Community infrastructure for storytelling, peer mentorship, and public advocacy could multiply cultural reach at minimal institutional cost.',
                ripple: 'User communities surface real-world effects — both positive and adverse — that researchers haven\'t yet studied, feeding directly back into knowledge production and platform development cycles.'
            },
            {
                id: 'economic',
                label: 'ECONOMIC\nINFRA',
                color: '#f97316',
                angle: 135,
                subtitle: 'Venture Capital · Angels · Grants · Business Models',
                role: 'Determine which ideas get resources to develop. Every platform, research program, and training organization depends on some form of economic model to survive.',
                players: ['SOSV / XRC Labs', 'NIH, NSF', 'Heffter & Fetzer Institutes', 'TRIPP ($11.2M Series A)', 'Calm ($2B) · Headspace ($3B)'],
                connections: ['tech', 'knowledge', 'clinical', 'regulatory'],
                challenge: 'Consumer subscription model is unproven at scale — TRIPP\'s closure (85,000 subscribers) showed subscription-only revenue concentrates all survival risk in the most volatile model. Regulatory uncertainty propagates investor hesitancy.',
                opportunity: 'Corporate wellness is the fastest near-term market. XRHealth\'s Medicare milestone (HCPCS E1905) and RelieVRx\'s FDA authorization established the reimbursement precedent — each new milestone de-risks the category for the next platform.',
                ripple: 'A single insurance reimbursement expansion unlocks a scalable revenue model that VC investment and clinical adoption rapidly follow — breaking the investor-hesitancy loop constraining the field\'s growth.'
            },
            {
                id: 'regulatory',
                label: 'REGULATORY\n& KNOWLEDGE',
                color: '#10b981',
                angle: 180,
                subtitle: 'FDA · EU MDR · Associations · Journals · Conferences',
                role: 'Enable safe practice and information flow. Without clear regulatory frameworks, clinical tools can\'t reach patients. Without knowledge-sharing infrastructure, validated insights stay siloed.',
                players: ['FDA (Breakthrough Designation)', 'EU MDR / UKCA / Health Canada', 'IVRHA', 'PLOS ONE · Frontiers in VR', 'IEEE VR · MAPS · SAND'],
                connections: ['tech', 'knowledge', 'clinical', 'economic'],
                challenge: 'Device classification re-opens with every new capability. GDPR applies to EU citizens regardless of company location. Post-Brexit UK/EU divergence adds a parallel certification layer most small teams can\'t absorb.',
                opportunity: 'Professional associations developing voluntary standards build the demonstrated-responsibility track record that encourages clear frameworks. Each clear FDA pathway signals the next developer that the route is navigable.',
                ripple: 'A single clear regulatory classification removes uncertainty for developers and investors simultaneously — one decision unblocks multiple ecosystem components at once.'
            },
            {
                id: 'educators',
                label: 'EDUCATORS\n& TRAINERS',
                color: '#e879f9',
                angle: 225,
                subtitle: 'Training Programs · Certification Bodies · Curricula',
                role: 'Translate research and clinical evidence into practitioner-ready skills. Without educators, knowledge produced by researchers stays inaccessible to facilitators and clinicians — the field can\'t scale safely beyond its first generation.',
                players: ['Cyberdelic Nexus (40–100 hr cert)', 'Multiversity', 'VRAR Association', 'University programs (forming)'],
                connections: ['facilitators', 'clinical', 'knowledge', 'users'],
                challenge: 'Training programs vary widely (40–100 hours, no standardization). No credential recognized by insurance networks yet. First-generation practitioners risk aging out before systematic mentorship transfers their knowledge.',
                opportunity: 'Practitioner certification becoming an insurance-recognized credential simultaneously elevates quality, expands facilitator income, and makes the field legible to healthcare systems. Medical schools are beginning to add VR therapeutics to curricula.',
                ripple: 'Standardized training raises the quality floor for every facilitator and clinician — protecting users and making the field readable to regulators and insurers who need consistent standards before they act.'
            }
        ],

        // Lateral connections (bidirectional pairs — ring around the ecosystem)
        lateralConnections: [
            { source: 'tech',         target: 'knowledge'    },
            { source: 'knowledge',    target: 'clinical'     },
            { source: 'clinical',     target: 'facilitators' },
            { source: 'facilitators', target: 'users'        },
            { source: 'users',        target: 'economic'     },
            { source: 'economic',     target: 'regulatory'   },
            { source: 'regulatory',   target: 'educators'    },
            { source: 'educators',    target: 'facilitators' }
        ]
    };
})();
