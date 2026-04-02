/**
 * Ecosystem Map - Static Data
 * All panel content sourced from Module 5 lesson manifests.
 * Focuses on Role, Key Players, Challenges, Opportunities, and Ripple effect.
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
                subtitle: 'Hardware · Software · Platforms',
                role: 'Build the tools the entire field runs on. Every platform, research protocol, and clinical application depends on hardware manufacturers and software developers whose strategic decisions define the field\'s capability ceiling.',
                connections: ['knowledge', 'economic', 'regulatory', 'clinical'],
                
                keyPlayers: [
                    { name: 'Meta Quest', detail: 'Primary headset market share, sets consumer entry pricing and tracking standards' },
                    { name: 'Apple Vision Pro', detail: 'Legitimacy signal for the category, premium positioning, enterprise-first strategy' },
                    { name: 'TRIPP', detail: '$11.2M Series A funding, demonstrated consumer subscription scale for wellness VR' },
                    { name: 'OpenBCI', detail: 'Open-source EEG hardware, democratized brainwave tracking from $10K down to hundreds' }
                ],
                challenge: 'Headsets remain heavy with limited battery life, and fragmentation across manufacturers multiplies developer costs. Designing for minimizing motion sickness limits environmental locomotion.',
                opportunity: 'Next-generation lighter headsets, higher resolution, and integrated eye-tracking are opening new channels for biofeedback loops and AI-personalized real-time environments.',
                ripple: 'Every hardware capability leap triggers new research and clinical application.'
            },
            {
                id: 'knowledge',
                label: 'KNOWLEDGE\nPRODUCERS',
                color: '#6366f1',
                angle: 315,
                subtitle: 'Universities · Research Institutes',
                role: 'Validate effectiveness, explain mechanisms, establish safety, and develop protocols. Their findings are the credibility infrastructure the entire ecosystem depends on.',
                connections: ['clinical', 'tech', 'economic', 'regulatory'],

                keyPlayers: [
                    { name: 'Stanford VHIL', detail: 'Jeremy Bailenson, Proteus Effect, virtual embodiment presence research' },
                    { name: 'Imperial College London', detail: 'Robin Carhart-Harris, altered states mapping, entropy theory of consciousness' },
                    { name: 'Univ. Barcelona EVENT Lab', detail: 'Mel Slater, body ownership illusions and profound viewpoint shifts' },
                    { name: 'Catholic Univ. Milan', detail: 'Riva 2025 study comparing cyberdelic VR to therapeutic doses of psychedelics' }
                ],
                challenge: 'The research pipeline takes 2–5 years from hypothesis to publication — published literature is always behind current practice. Nearly all studies measure outcomes at only 1–4 weeks.',
                opportunity: 'Landmark studies are beginning to demonstrate cyberdelic effects comparable to classic psychedelics at therapeutic doses, providing massive validation for the field.',
                ripple: 'A single landmark publication provides the evidence base needed for clinical rollout.'
            },
            {
                id: 'clinical',
                label: 'CLINICAL\nPRACTICE',
                color: '#a855f7',
                angle: 0,
                subtitle: 'Therapists · Healthcare Systems',
                role: 'Translate theoretical research into actual patient care. Clinical practitioners are the connective tissue between evidence and outcomes, proving therapeutic value to the establishment.',
                connections: ['knowledge', 'facilitators', 'economic', 'regulatory'],

                keyPlayers: [
                    { name: 'RelieVRx / AppliedVR', detail: 'FDA Breakthrough Device authorization for chronic pain' },
                    { name: 'XRHealth', detail: 'Established the first federal reimbursement code for VR therapy' },
                    { name: 'Limbix', detail: 'Targeting adolescent depression with clinical immersion protocols' },
                    { name: 'Oxford VR', detail: 'VR-based psychological therapies focusing on social anxiety' }
                ],
                challenge: 'Translating controlled lab studies to chaotic clinical realities is hard. Insurance reimbursement remains narrow, and training gaps mean most clinicians aren\'t ready to prescribe VR.',
                opportunity: 'Hospital VR programs are scaling from small pilots to standard-of-care programs. Provider training integration and new federal reimbursement codes are accelerating adoption.',
                ripple: 'Establishing a clinical pathway makes the field legible to massive healthcare capital.'
            },
            {
                id: 'facilitators',
                label: 'FACILITATORS\n& GUIDES',
                color: '#ec4899',
                angle: 45,
                subtitle: 'Guides · Wellness Centers',
                role: 'The field\'s primary human point of contact. They manage preparation, presence, and integration of non-ordinary states, serving as guides rather than prescriptive therapists.',
                connections: ['clinical', 'users', 'educators'],

                keyPlayers: [
                    { name: 'Cyberdelic Nexus', detail: 'Pioneering rigorous facilitator standards and competency tracking' },
                    { name: 'Cyberdelic Society', detail: 'Global events and peer-networking for practitioners' },
                    { name: 'Multiversity', detail: 'Cross-disciplinary programs exploring consciousness tech integration' }
                ],
                challenge: 'Legal scope of practice is undefined by state frameworks. Balancing guidance without crossing into unlicensed therapeutic claims represents a major operational risk.',
                opportunity: 'Early facilitators are actively writing the field\'s governance, establishing ethics standards, and defining a completely new viable profession.',
                ripple: 'Standardizing guidance reduces adverse user experiences and protects the ecosystem\'s reputation.'
            },
            {
                id: 'users',
                label: 'USERS &\nCOMMUNITIES',
                color: '#f59e0b',
                angle: 90,
                subtitle: 'Practitioners · Early Adopters',
                role: 'Generate real-world feedback and cultural momentum. Users validate platforms through firsthand accounts that no researcher or developer claim can replicate.',
                connections: ['facilitators', 'knowledge', 'tech'],

                keyPlayers: [
                    { name: 'Reddit r/cyberdelics', detail: 'Online discussion and unvarnished experience sharing' },
                    { name: 'Discord Peer Networks', detail: 'Real-time discussion clustering around specific immersive platforms' },
                    { name: 'Cyberdelic Hackathon', detail: 'Grassroots builders meeting in spaces like c-base Berlin' }
                ],
                challenge: 'Hardware costs exclude much of the world, keeping the active user base relatively small and skewing affluent/tech-comfortable.',
                opportunity: 'Users with genuine transformative experiences become the field\'s most credible ambassadors, driving organic adoption faster than any marketing campaign.',
                ripple: 'User feedback loops iterate software design and highlight phenomena for researchers.'
            },
            {
                id: 'economic',
                label: 'ECONOMIC\nINFRA',
                color: '#f97316',
                angle: 135,
                subtitle: 'Venture Capital · Grants',
                role: 'Determine which ideas get the resources needed to survive. Every platform, research program, and training organization depends on funding and viable business models.',
                connections: ['tech', 'knowledge', 'clinical', 'regulatory'],

                keyPlayers: [
                    { name: 'SOSV / XRC Labs', detail: 'Accelerators bringing early-stage capital to immersive wellness' },
                    { name: 'NIH & NSF', detail: 'Government research grants funding fundamental mechanism studies' },
                    { name: 'Private Foundations', detail: 'Heffter/Fetzer funding consciousness research without equity pressure' }
                ],
                challenge: 'Regulatory ambiguity breeds investor hesitancy. Startups struggle balancing the tension between delivering clinical value and meeting aggressive venture return timelines.',
                opportunity: 'Corporate wellness and B2B clinical licensing are proving to be robust revenue models, breaking away from the fragility of consumer-only subscription models.',
                ripple: 'Deploying capital acts as an accelerant, rapidly scaling validated concepts across the ecosystem.'
            },
            {
                id: 'regulatory',
                label: 'REGULATORY\n& STANDARDS',
                color: '#10b981',
                angle: 180,
                subtitle: 'FDA · MDR · Associations',
                role: 'Enable safe practice and institutional adoption. Regulatory clearances separate wellness novelties from prescribable healthcare interventions.',
                connections: ['tech', 'knowledge', 'clinical', 'economic'],

                keyPlayers: [
                    { name: 'FDA', detail: 'Gates medical claims via Breakthrough Device and De Novo pathways' },
                    { name: 'EU MDR / Health Canada', detail: 'Strict international device classifications and data compliance' },
                    { name: 'IVRHA', detail: 'International VR Healthcare Association establishing voluntary industry standards' }
                ],
                challenge: 'Developers face the "Wellness Exemption Paradox" — staying in the wellness category limits claims, but pursuing FDA clearance costs heavily in time and capital. Classifications drift as tech evolves.',
                opportunity: 'Each successful regulatory clearance (like RelieVRx) carves a navigable path, showing the rest of the industry exactly what evidence is required to reach the market.',
                ripple: 'Regulatory clearance removes market friction, unlocking enterprise and healthcare adoption.'
            },
            {
                id: 'educators',
                label: 'EDUCATORS\n& TRAINERS',
                color: '#e879f9',
                angle: 225,
                subtitle: 'Certification · Curricula',
                role: 'Translate esoteric research and clinical theory into practitioner-ready skills. They elevate the baseline quality of interactions between the technology and the user.',
                connections: ['facilitators', 'clinical', 'knowledge', 'users'],

                keyPlayers: [
                    { name: 'Cyberdelic Nexus', detail: 'Comprehensive curriculum mapping core competencies for facilitators' },
                    { name: 'University Medical Schools', detail: 'Slowly beginning to integrate VR therapeutics into standard physician training' }
                ],
                challenge: 'Training currently lacks central accreditation. First-generation practitioners are scattered, making knowledge transfer and standardizing quality floors difficult.',
                opportunity: 'Developing recognized certifications could directly translate to insurance billing eligibility, radically changing the economics for practitioners holding those credentials.',
                ripple: 'Standardization turns unpredictable experimentation into reproducible methodology.'
            }
        ],

        // ─── Connection Descriptions ──────────────────────────────────────
        connectionDescriptions: {
            'tech→knowledge': 'Hardware capabilities enable novel research paradigms.',
            'knowledge→clinical': 'Published outcomes justify clinical integration.',
            'clinical→regulatory': 'Patient data informs regulatory safety clearances.',
            'economic→tech': 'Capital enables hardware iterations and software polish.',
            'regulatory→economic': 'Clearance de-risks the sector for massive investment.',
            'facilitators→users': 'Human guides manage the ultimate end-user experience.',
            'users→tech': 'Usage telemetry feedback shapes future software updates.',
            'educators→facilitators': 'Curricula transforms enthusiasts into capable safe guides.'
            // Re-uses defaults if a specific path isn't mapped
        },

        // ─── EXPERT RIPPLE CHAINS ─────────────────────────────────────────
        // Trace paths across nodes based on module content
        rippleChains: [
            {
                id: 'tech-ripple',
                title: 'Hardware Breakthrough',
                startNode: 'tech',
                description: 'Eye-tracking becomes standard in consumer VR.',
                steps: [
                    { from: 'tech', to: 'knowledge', label: 'Researchers use eye-tracking for precise autonomic nervous system monitoring.' },
                    { from: 'knowledge', to: 'clinical', label: 'Clinics adopt closed-loop biofeedback exposure therapies.' },
                    { from: 'clinical', to: 'regulatory', label: 'FDA clears closed-loop software as a medical device.' },
                    { from: 'regulatory', to: 'economic', label: 'Insurers issue reimbursement codes, triggering VC influx.' }
                ]
            },
            {
                id: 'knowledge-ripple',
                title: 'Landmark Publication',
                startNode: 'knowledge',
                description: 'Study shows VR efficacy equal to high-dose psilocybin (e.g., Isness-D/Riva 2025).',
                steps: [
                    { from: 'knowledge', to: 'clinical', label: 'Psychiatrists integrate VR as an alternative to chemical psychedelics.' },
                    { from: 'clinical', to: 'educators', label: 'Institutions demand standardized best-practice protocols.' },
                    { from: 'educators', to: 'facilitators', label: 'Guides are trained on the newly established protocols.' },
                    { from: 'facilitators', to: 'users', label: 'Thousands experience profound safety-backed sessions.' }
                ]
            },
            {
                id: 'clinical-ripple',
                title: 'Clinical Escalation',
                startNode: 'clinical',
                description: 'A major hospital network standardizes VR for pain management.',
                steps: [
                    { from: 'clinical', to: 'economic', label: 'Hospital contracts secure recurring B2B software revenue.' },
                    { from: 'economic', to: 'tech', label: 'SaaS revenue funds next-gen software feature polish.' },
                    { from: 'tech', to: 'knowledge', label: 'Polished tools allow researchers to run larger cohort studies.' },
                    { from: 'knowledge', to: 'regulatory', label: 'Larger datasets satisfy stringent European MDR requirements.' }
                ]
            },
            {
                id: 'facilitator-ripple',
                title: 'Field Governance',
                startNode: 'facilitators',
                description: 'Facilitators establish a universal code of ethics.',
                steps: [
                    { from: 'facilitators', to: 'educators', label: 'Ethics code gets embedded into core certification curricula.' },
                    { from: 'educators', to: 'clinical', label: 'Credentialed guides gain access to refer clinical overflow.' },
                    { from: 'clinical', to: 'regulatory', label: 'Standardized practice aids regulators in defining legal scopes.' },
                    { from: 'regulatory', to: 'economic', label: 'Legal clarity brings institutional investors off the sidelines.' }
                ]
            },
            {
                id: 'user-ripple',
                title: 'Viral Adoption',
                startNode: 'users',
                description: 'A community-built VR consciousness world goes viral.',
                steps: [
                    { from: 'users', to: 'tech', label: 'Massive concurrent usage forces server-side and platform scaling.' },
                    { from: 'tech', to: 'economic', label: 'Platform growth catches the eye of mainstream consumer investors.' },
                    { from: 'economic', to: 'knowledge', label: 'Philanthropic funding spins up studies on community mental health.' },
                    { from: 'knowledge', to: 'facilitators', label: 'Researchers outline safe navigation practices for crowded virtual spaces.' }
                ]
            },
            {
                id: 'economic-ripple',
                title: 'Reimbursement Milestone',
                startNode: 'economic',
                description: 'Medicare establishes a new VR CPT billing code.',
                steps: [
                    { from: 'economic', to: 'clinical', label: 'Therapists can now bill for sessions, driving mass clinic adoption.' },
                    { from: 'clinical', to: 'tech', label: 'High demand causes a hardware shortage and forces specialized clinical headsets.' },
                    { from: 'tech', to: 'knowledge', label: 'Widespread hardware access leads to explosive real-world data gathering.' },
                    { from: 'knowledge', to: 'educators', label: 'Data informs highly specific prescriptive training methodologies.' }
                ]
            },
            {
                id: 'regulatory-ripple',
                title: 'Legal Classification',
                startNode: 'regulatory',
                description: 'FDA updates software-as-a-medical-device (SaMD) guidance for VR.',
                steps: [
                    { from: 'regulatory', to: 'tech', label: 'Developers pivot roadmaps to ensure exact compliance.' },
                    { from: 'tech', to: 'clinical', label: 'Compliant platforms are rapidly onboarded by risk-averse hospitals.' },
                    { from: 'clinical', to: 'economic', label: 'Hospital usage guarantees predictable long-term subscription MRR.' },
                    { from: 'economic', to: 'knowledge', label: 'Secure companies fund massive longitudinal efficacy trials.' }
                ]
            },
            {
                id: 'educator-ripple',
                title: 'Curriculum Standardization',
                startNode: 'educators',
                description: 'First university-level Master’s in Cyberdelic Design launches.',
                steps: [
                    { from: 'educators', to: 'facilitators', label: 'Graduates enter the field with high-level academic grounding.' },
                    { from: 'facilitators', to: 'users', label: 'User outcomes improve dramatically lacking trial-and-error guidance.' },
                    { from: 'users', to: 'knowledge', label: 'Improved outcomes provide researchers with profound success cases.' },
                    { from: 'knowledge', to: 'regulatory', label: 'Consistent safety reports loosen restrictive observation requirements.' }
                ]
            },
            // --- Secondary Constraint / Ecosystem Loops ---
            {
                id: 'tech-constraint-ripple',
                title: 'Platform Fragmentation',
                startNode: 'tech',
                description: 'Lack of hardware interoperability splits the ecosystem.',
                steps: [
                    { from: 'tech', to: 'users', label: 'Incompatible headsets fragment the user base into platform silos.' },
                    { from: 'users', to: 'knowledge', label: 'Telemetry and research data become isolated by hardware boundaries.' },
                    { from: 'knowledge', to: 'clinical', label: 'Clinicians cannot generalize findings across their mixed-hardware patient populations.' },
                    { from: 'clinical', to: 'tech', label: 'High integration costs heavily constrain the B2B hospital sales cycle.' }
                ]
            },
            {
                id: 'knowledge-constraint-ripple',
                title: 'WEIRD Sample Bias',
                startNode: 'knowledge',
                description: 'Initial massive studies omit non-Western demographics.',
                steps: [
                    { from: 'knowledge', to: 'clinical', label: 'Clinicians question protocol generalizability for diverse patients.' },
                    { from: 'clinical', to: 'regulatory', label: 'Lack of representative clinical data stalls broad FDA authorizations.' },
                    { from: 'regulatory', to: 'economic', label: 'Regulatory hesitation keeps institutional capital sidelined.' },
                    { from: 'economic', to: 'knowledge', label: 'Underfunded labs delay cross-cultural verification studies.' }
                ]
            },
            {
                id: 'clinical-constraint-ripple',
                title: 'Medical Skepticism',
                startNode: 'clinical',
                description: 'Traditional psychiatric institutions dismiss VR as mere "gaming".',
                steps: [
                    { from: 'clinical', to: 'regulatory', label: 'Skeptical hospitals demand impossible levels of regulatory cover before pilot adoption.' },
                    { from: 'regulatory', to: 'economic', label: 'The lengthy FDA clearance path causes early-stage clinical startups to run out of runway.' },
                    { from: 'economic', to: 'tech', label: 'Without funding, developers pivot away from clinical applications.' },
                    { from: 'tech', to: 'clinical', label: 'The lack of polished clinical tools reinforces the establishment’s belief that VR is trivial.' }
                ]
            },
            {
                id: 'facilitator-constraint-ripple',
                title: 'Consciousness Skepticism',
                startNode: 'facilitators',
                description: 'Traditional meditation guides view tech as an unauthentic obstacle.',
                steps: [
                    { from: 'facilitators', to: 'users', label: 'Legacy contemplative teachers warn seekers away from technologically mediated altered states.' },
                    { from: 'users', to: 'knowledge', label: 'With low adoption for depth-work, researchers lack the N-count to validate profound states.' },
                    { from: 'knowledge', to: 'clinical', label: 'Without published validation of depth, clinical practice ignores the potential.' },
                    { from: 'clinical', to: 'facilitators', label: 'Therapists refuse to refer clients to guides, keeping the practice marginalized.' }
                ]
            },
            {
                id: 'user-opportunity-ripple',
                title: 'Corporate Wellness Loop',
                startNode: 'users',
                description: 'A major enterprise deploys VR stress-reduction to its workforce.',
                steps: [
                    { from: 'users', to: 'tech', label: 'Employee usage data proves measurable HRV and stress reduction at scale.' },
                    { from: 'tech', to: 'economic', label: 'Hardware manufacturers secure massive enterprise fleet sales, drawing VC attention.' },
                    { from: 'economic', to: 'regulatory', label: 'Rapid commercial scale forces regulators to clearly define non-medical wellness boundaries.' },
                    { from: 'regulatory', to: 'clinical', label: 'Clear boundaries finally give clinics the confidence to prescribe the proven adjunct tools.' }
                ]
            },
            {
                id: 'economic-constraint-ripple',
                title: 'Affordability Barrier',
                startNode: 'economic',
                description: 'High entry costs restrict cyberdelics to affluent early adopters.',
                steps: [
                    { from: 'economic', to: 'tech', label: 'Averaging high acquisition costs, hardware developers prioritize premium enterprise configurations.' },
                    { from: 'tech', to: 'users', label: 'Consumer presence shifts almost entirely to a wealthy, homogenous demographic.' },
                    { from: 'users', to: 'knowledge', label: 'Telemetry feedback loops over-index on this narrow slice of humanity.' },
                    { from: 'knowledge', to: 'economic', label: 'Narrowly applicable efficacy claims threaten the push for broad insurance reimbursement.' }
                ]
            },
            {
                id: 'regulatory-constraint-ripple',
                title: 'Liability Uncertainty',
                startNode: 'regulatory',
                description: 'Unclear legal boundaries regarding immersive psychological distress.',
                steps: [
                    { from: 'regulatory', to: 'clinical', label: 'Due to ambiguous liability limits, hospital boards summarily ban immersive modalities.' },
                    { from: 'clinical', to: 'economic', label: 'B2B enterprise startups lose their entire sales pipeline and investment dries up.' },
                    { from: 'economic', to: 'tech', label: 'Desperate to survive, platforms strip away all advanced psychological triggers.' },
                    { from: 'tech', to: 'clinical', label: 'Watered-down, purely superficial applications fail to generate meaningful patient outcomes.' }
                ]
            },
            {
                id: 'educator-opportunity-ripple',
                title: 'Intergenerational Transfer',
                startNode: 'educators',
                description: 'Pioneering cyberdelic creators formalize a mentorship framework.',
                steps: [
                    { from: 'educators', to: 'facilitators', label: 'Elders transfer massive amounts of undocumented, experiential safety knowledge to new guides.' },
                    { from: 'facilitators', to: 'clinical', label: 'Mentored guides deliver exceptionally consistent outcomes under trial observation.' },
                    { from: 'clinical', to: 'knowledge', label: 'Consistency in the clinic yields undeniable 5-year longitudinal outcome data sets.' },
                    { from: 'knowledge', to: 'educators', label: 'Robust statistical data loops back to forge definitive, evidence-based curricula for the next generation.' }
                ]
            }
        ]
    };
})();
