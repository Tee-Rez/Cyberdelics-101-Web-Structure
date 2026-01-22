/* ============================================
   DATA STRUCTURE
   ============================================ */

const DATA = {
    // Domain nodes with their positions and colors
    domains: [
        {
            id: 'psychedelic',
            name: 'Psychedelic\nResearch',
            color: '#9D4EDD',
            angle: 0
        },
        {
            id: 'vr-tech',
            name: 'VR/AR\nTechnology',
            color: '#00D9FF',
            angle: 60
        },
        {
            id: 'neuroscience',
            name: 'Neuroscience',
            color: '#FF6B9D',
            angle: 120
        },
        {
            id: 'contemplative',
            name: 'Contemplative\nPractices',
            color: '#FFD700',
            angle: 180
        },
        {
            id: 'gaming',
            name: 'Gaming',
            color: '#39FF14',
            angle: 240
        },
        {
            id: 'digital-art',
            name: 'Digital Art',
            color: '#FF006E',
            angle: 300
        }
    ],

    // Connections with strength progression over years
    connections: [
        {
            source: 'psychedelic',
            target: 'neuroscience',
            yearAppears: 2016,
            strengthByYear: {
                2016: 0.2,
                2017: 0.3,
                2018: 0.5,
                2019: 0.6,
                2020: 0.7,
                2021: 0.8,
                2022: 0.85,
                2023: 0.9,
                2024: 0.95,
                2025: 1.0
            }
        },
        {
            source: 'vr-tech',
            target: 'gaming',
            yearAppears: 2016,
            strengthByYear: {
                2016: 0.3,
                2017: 0.4,
                2018: 0.5,
                2019: 0.6,
                2020: 0.65,
                2021: 0.7,
                2022: 0.7,
                2023: 0.7,
                2024: 0.7,
                2025: 0.7
            }
        },
        {
            source: 'vr-tech',
            target: 'contemplative',
            yearAppears: 2017,
            strengthByYear: {
                2017: 0.2,
                2018: 0.4,
                2019: 0.6,
                2020: 0.7,
                2021: 0.8,
                2022: 0.85,
                2023: 0.9,
                2024: 0.95,
                2025: 1.0
            }
        },
        {
            source: 'neuroscience',
            target: 'contemplative',
            yearAppears: 2018,
            strengthByYear: {
                2018: 0.3,
                2019: 0.4,
                2020: 0.5,
                2021: 0.6,
                2022: 0.65,
                2023: 0.7,
                2024: 0.75,
                2025: 0.8
            }
        },
        {
            source: 'psychedelic',
            target: 'vr-tech',
            yearAppears: 2019,
            strengthByYear: {
                2019: 0.3,
                2020: 0.5,
                2021: 0.7,
                2022: 0.8,
                2023: 0.9,
                2024: 0.95,
                2025: 1.0
            }
        },
        {
            source: 'vr-tech',
            target: 'neuroscience',
            yearAppears: 2019,
            strengthByYear: {
                2019: 0.2,
                2020: 0.4,
                2021: 0.6,
                2022: 0.7,
                2023: 0.75,
                2024: 0.8,
                2025: 0.85
            }
        },
        {
            source: 'digital-art',
            target: 'vr-tech',
            yearAppears: 2018,
            strengthByYear: {
                2018: 0.2,
                2019: 0.3,
                2020: 0.4,
                2021: 0.5,
                2022: 0.55,
                2023: 0.6,
                2024: 0.6,
                2025: 0.6
            }
        },
        {
            source: 'contemplative',
            target: 'psychedelic',
            yearAppears: 2020,
            strengthByYear: {
                2020: 0.3,
                2021: 0.5,
                2022: 0.7,
                2023: 0.75,
                2024: 0.8,
                2025: 0.85
            }
        },
        {
            source: 'gaming',
            target: 'neuroscience',
            yearAppears: 2020,
            strengthByYear: {
                2020: 0.2,
                2021: 0.3,
                2022: 0.4,
                2023: 0.45,
                2024: 0.5,
                2025: 0.5
            }
        },
        {
            source: 'digital-art',
            target: 'contemplative',
            yearAppears: 2021,
            strengthByYear: {
                2021: 0.2,
                2022: 0.4,
                2023: 0.5,
                2024: 0.6,
                2025: 0.7
            }
        },
        {
            source: 'gaming',
            target: 'contemplative',
            yearAppears: 2022,
            strengthByYear: {
                2022: 0.2,
                2023: 0.3,
                2024: 0.5,
                2025: 0.6
            }
        },
        {
            source: 'digital-art',
            target: 'psychedelic',
            yearAppears: 2021,
            strengthByYear: {
                2021: 0.3,
                2022: 0.4,
                2023: 0.5,
                2024: 0.6,
                2025: 0.7
            }
        }
    ],
    domainDetails: {
        'psychedelic': {
            contributions: [
                'Set and setting protocols',
                'Integration practices',
                'Therapeutic frameworks',
                'Mystical experience research',
                'Safety protocols for altered states'
            ],
            keyPeople: [
                { name: 'Dr. Timothy Leary', role: 'Pioneer of psychedelic research' },
                { name: 'Dr. Robin Carhart-Harris', role: 'Imperial College London' },
                { name: 'Dr. Roland Griffiths', role: 'Johns Hopkins University' },
                { name: 'Stanislav Grof', role: 'Holotropic breathwork founder' }
            ],
            technologies: [
                'Clinical assessment tools',
                'Therapeutic protocols (MAPS)',
                'Integration methodologies',
                'Safety screening procedures',
                'Consciousness measurement scales'
            ],
            examples: [
                { name: 'MAPS MDMA Therapy', description: 'PTSD treatment protocol' },
                { name: 'Psilocybin Cancer Anxiety Studies', description: 'End-of-life care' },
                { name: 'Ayahuasca Integration Circles', description: 'Community support' }
            ],
            contentByYear: {
                2015: {
                    contributions: [
                        'Clinical trial resurgence',
                        'MAPS Phase 2 studies',
                        'Set and setting revival',
                        'Academic legitimacy growing'
                    ],
                    keyPeople: [
                        { name: 'Dr. Rick Doblin', role: 'MAPS founder, clinical trials' },
                        { name: 'Dr. Roland Griffiths', role: 'Johns Hopkins psilocybin pioneer' }
                    ],
                    technologies: [
                        'Standardized dosing protocols',
                        'Clinical assessment tools',
                        'Therapy session structure'
                    ],
                    examples: [
                        { name: 'MAPS MDMA Phase 2', description: 'PTSD treatment trials', url: 'https://maps.org/mdma/ptsd/' },
                        { name: 'Johns Hopkins Studies', description: 'Psilocybin mystical experience', url: 'https://hopkinspsychedelic.org/' }
                    ]
                },
                2018: {
                    contributions: [
                        'FDA Breakthrough Therapy status',
                        'Psilocybin depression trials',
                        'Decriminalization movements begin',
                        'Integration therapy protocols'
                    ],
                    keyPeople: [
                        { name: 'Dr. Roland Griffiths', role: 'Johns Hopkins depression studies' },
                        { name: 'Dr. Robin Carhart-Harris', role: 'Imperial College brain imaging' },
                        { name: 'Dr. Rick Doblin', role: 'MAPS Phase 3 preparation' },
                        { name: 'Melissa Warner', role: 'Helped build the Psychedelic Research in Science and Medicine(PRISM) in Australia ' }
                    ],
                    technologies: [
                        'fMRI during psychedelic states',
                        'Integration therapy frameworks',
                        'Safety screening enhanced',
                        'Therapist training programs'
                    ],
                    examples: [
                        { name: 'Psilocybin Cancer Anxiety', description: 'End-of-life care breakthrough', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5367557/' },
                        { name: 'Imperial College Trials', description: 'Treatment-resistant depression', url: 'https://www.imperial.ac.uk/psychedelic-research-centre/' },
                        {
                            name: 'PRISM Therapeutic VR Program',
                            description: 'VR for psychedelic therapy prep',
                            url: 'https://www.prism.org.au/acid-test-how-psychedelic-virtual-reality-can-help-end-societys-mass-bad-trip/'
                        }
                    ]
                },
                2021: {
                    contributions: [
                        'MAPS Phase 3 MDMA completion',
                        'Oregon Measure 109 passes',
                        'Ketamine clinics proliferate',
                        'Psychedelic therapy training boom',
                        'Context engineering frameworks'
                    ],
                    keyPeople: [
                        { name: 'Dr. Rick Doblin', role: 'MAPS Phase 3 success' },
                        { name: 'Dr. Robin Carhart-Harris', role: 'UCSF research center' },
                        { name: 'Dr. Nolan Williams', role: 'Stanford psychedelics division' },
                        { name: 'Carl H. Smith', role: 'Cognitive Scientist' }
                    ],
                    technologies: [
                        'Therapist certification programs',
                        'Integration app platforms',
                        'Ketamine protocols refined',
                        'Group therapy models'
                    ],
                    examples: [
                        { name: 'Field Trip Health', description: 'Ketamine therapy clinics', url: 'https://www.fieldtriphealth.com/' },
                        { name: 'CIIS Training', description: 'Therapist certification program', url: 'https://www.ciis.edu/research-centers/center-for-psychedelic-therapies-and-research' },
                        { name: 'Numinus Wellness', description: 'Integrated psychedelic therapy', url: 'https://numinus.com/' },
                        {
                            name: 'Cyberdelics Context Engineering',
                            description: 'Smith & Warner framework',
                            url: 'https://www.scienceopen.com/hosted-document?doi=10.14236/ewic/EVA2022.48'
                        }

                    ]
                },
                2024: {
                    contributions: [
                        'FDA MDMA approval pathway',
                        'State legalization expansion',
                        'Insurance coverage discussions',
                        'At-home ketamine therapy',
                        'Psychedelic-assisted group work'
                    ],
                    keyPeople: [
                        { name: 'Dr. Rick Doblin', role: 'MAPS commercialization' },
                        { name: 'Dr. Rachel Yehuda', role: 'PTSD research integration' },
                        { name: 'Stanislav Grof', role: 'Holotropic breathwork elder' }
                    ],
                    technologies: [
                        'At-home ketamine programs',
                        'Virtual integration therapy',
                        'Measurement scales refined',
                        'Safety monitoring systems'
                    ],
                    examples: [
                        { name: 'Mindbloom', description: 'At-home ketamine therapy', url: 'https://www.mindbloom.com/' },
                        { name: 'MAPS Public Benefit Corp', description: 'MDMA therapy rollout', url: 'https://lykospbc.com/' },
                        { name: 'Beckley Retreats', description: 'Legal psilocybin experiences', url: 'https://www.beckleyretreats.com/' }
                    ]
                }
            }
        },

        'vr-tech': {
            contributions: [
                'Immersive displays (HMDs)',
                'Spatial audio systems',
                'Motion tracking technology',
                'Hand and body tracking',
                'Haptic feedback systems'
            ],
            keyPeople: [
                { name: 'Jaron Lanier', role: 'VR pioneer, coined "Virtual Reality"' },
                { name: 'Palmer Luckey', role: 'Oculus founder' },
                { name: 'Tom Furness', role: 'Virtual Reality pioneer (1960s)' },
                { name: 'Mark Zuckerberg', role: 'Meta/Oculus expansion' }
            ],
            technologies: [
                'Head-mounted displays',
                'Inside-out tracking',
                'Low-latency rendering (<20ms)',
                '6DOF motion tracking',
                'Foveated rendering'
            ],
            examples: [
                { name: 'TRIPP', description: 'Meditation and mindfulness VR' },
                { name: 'Guided Meditation VR', description: 'Contemplative environments' },
                { name: 'Nature Treks', description: 'Restorative nature experiences' }
            ],
            contentByYear: {
                2015: {
                    contributions: [
                        'Basic HMD displays',
                        'External sensor tracking',
                        'Early motion controllers',
                        'Development kits available'
                    ],
                    keyPeople: [
                        { name: 'Palmer Luckey', role: 'Oculus Rift development' },
                        { name: 'Jaron Lanier', role: 'VR advocacy and vision' },
                        { name: 'Brendan Iribe', role: 'Oculus CEO' }
                    ],
                    technologies: [
                        'Oculus DK2 (development kit)',
                        'External camera tracking',
                        'Basic stereoscopic rendering',
                        'Positional tracking (3DOF)'
                    ],
                    examples: [
                        { name: 'Google Cardboard', description: 'Mobile VR accessibility', url: 'https://arvr.google.com/cardboard/' },
                        { name: 'Oculus DK2 Demos', description: 'Early VR experiences', url: 'https://www.meta.com/quest/' },
                        { name: 'VR meditation experiments', description: 'Early wellness tests', url: 'https://www.tripp.com/blog/the-science-behind-tripp' }
                    ]
                },
                2016: {
                    contributions: [
                        'Consumer VR headsets launch',
                        'Room-scale tracking',
                        'Motion controller standards',
                        'VR content ecosystem begins'
                    ],
                    keyPeople: [
                        { name: 'Palmer Luckey', role: 'Oculus Rift CV1 launch' },
                        { name: 'Gabe Newell', role: 'HTC Vive partnership' },
                        { name: 'Brendan Iribe', role: 'Oculus ecosystem growth' }
                    ],
                    technologies: [
                        'Oculus Rift CV1',
                        'HTC Vive with Lighthouse',
                        'Touch controllers',
                        'Room-scale VR (6DOF)',
                        'SteamVR platform'
                    ],
                    examples: [
                        { name: 'The Lab', description: 'Valve VR showcase', url: 'https://store.steampowered.com/app/450390/The_Lab/' },
                        { name: 'Job Simulator', description: 'Popular launch title', url: 'https://jobsimulatorgame.com/' },
                        { name: 'Guided Meditation VR', description: 'Early wellness VR', url: 'https://guidedmeditationvr.com/' }
                    ]
                },
                2019: {
                    contributions: [
                        'Inside-out tracking adoption',
                        'Standalone VR headsets',
                        'Hand tracking development',
                        'Social VR platforms',
                        'Wireless VR solutions'
                    ],
                    keyPeople: [
                        { name: 'Mark Zuckerberg', role: 'Facebook VR investment' },
                        { name: 'John Carmack', role: 'Oculus CTO, Quest focus' },
                        { name: 'Hugo Barra', role: 'Oculus VP of VR' }
                    ],
                    technologies: [
                        'Oculus Quest (standalone)',
                        'Inside-out tracking',
                        'Hand tracking (experimental)',
                        '6DOF wireless VR',
                        'XR2 mobile processors'
                    ],
                    examples: [
                        { name: 'Beat Saber', description: 'VR rhythm phenomenon', url: 'https://beatsaber.com/' },
                        { name: 'VRChat', description: 'Social VR platform', url: 'https://hello.vrchat.com/' },
                        { name: 'Guided Meditation VR', description: 'Wellness apps grow', url: 'https://guidedmeditationvr.com/' },
                        { name: 'Nature Treks VR', description: 'Relaxation environments', url: 'https://store.steampowered.com/app/587580/Nature_Treks_VR/' }
                    ]
                },
                2022: {
                    contributions: [
                        'High-resolution displays',
                        'Eye tracking integration',
                        'Mixed reality passthrough',
                        'Haptic feedback vests',
                        'Wireless streaming refined'
                    ],
                    keyPeople: [
                        { name: 'Mark Zuckerberg', role: 'Meta rebranding, metaverse' },
                        { name: 'John Carmack', role: 'Quest optimization' },
                        { name: 'Andrew Bosworth', role: 'Meta Reality Labs lead' }
                    ],
                    technologies: [
                        'Meta Quest 2 (mass adoption)',
                        'Eye tracking sensors',
                        'Color passthrough AR',
                        'Pancake lens optics',
                        'Cloud rendering streaming'
                    ],
                    examples: [
                        { name: 'TRIPP', description: 'Therapeutic VR standard', url: 'https://www.tripp.com/' },
                        { name: 'Supernatural', description: 'VR fitness with meditation', url: 'https://www.getsupernatural.com/' },
                        { name: 'Immersed', description: 'VR workplace', url: 'https://immersed.com/' }
                    ]
                }
            }
        },

        'neuroscience': {
            contributions: [
                'Brain imaging (fMRI, EEG)',
                'Neural correlates of consciousness',
                'Neuroplasticity research',
                'Default Mode Network studies',
                'Brain-computer interfaces'
            ],
            keyPeople: [
                { name: 'Dr. Andrew Huberman', role: 'Stanford neuroscientist' },
                { name: 'Dr. Matthew Walker', role: 'Sleep and consciousness research' },
                { name: 'Dr. Anil Seth', role: 'Consciousness science, Sussex' },
                { name: 'Dr. Karl Friston', role: 'Predictive processing theory' }
            ],
            technologies: [
                'fMRI brain scanning',
                'EEG neurofeedback',
                'Real-time brain imaging',
                'Neural synchrony measurement',
                'Connectivity analysis'
            ],
            examples: [
                { name: 'Neurofeedback Training', description: 'Self-regulation of brain states' },
                { name: 'Brain Imaging Studies', description: 'Mapping presence in VR' },
                { name: 'BCI Meditation Apps', description: 'Brain-controlled interfaces' }
            ],
            contentByYear: {
                2015: {
                    contributions: [
                        'fMRI meditation studies',
                        'Default Mode Network mapping',
                        'Neuroplasticity evidence',
                        'Early EEG headbands'
                    ],
                    keyPeople: [
                        { name: 'Dr. Richard Davidson', role: 'Meditation neuroscience pioneer' },
                        { name: 'Dr. Judson Brewer', role: 'Mindfulness brain studies' }
                    ],
                    technologies: [
                        'fMRI meditation scans',
                        'Consumer EEG devices (Muse)',
                        'Basic neurofeedback protocols',
                        'Brain network analysis'
                    ],
                    examples: [
                        { name: 'Muse Headband', description: 'Consumer meditation EEG', url: 'https://choosemuse.com/' },
                        { name: 'fMRI Meditation Studies', description: 'Academic research', url: 'https://pubmed.ncbi.nlm.nih.gov/' }
                    ]
                },
                2018: {
                    contributions: [
                        'Real-time fMRI neurofeedback',
                        'Psychedelic brain imaging',
                        'DMN dissolution studies',
                        'Consciousness theories advance',
                        'Consumer neurofeedback grows'
                    ],
                    keyPeople: [
                        { name: 'Dr. Robin Carhart-Harris', role: 'Psychedelic brain imaging' },
                        { name: 'Dr. Anil Seth', role: 'Consciousness theories' },
                        { name: 'Dr. Andrew Huberman', role: 'Vision and states research' }
                    ],
                    technologies: [
                        'Real-time fMRI feedback',
                        'High-density EEG arrays',
                        'Connectivity analysis tools',
                        'Mobile EEG devices',
                        'Neurofeedback apps'
                    ],
                    examples: [
                        { name: 'Imperial College Studies', description: 'Psilocybin brain imaging', url: 'https://www.imperial.ac.uk/psychedelic-research-centre/' },
                        { name: 'Muse 2', description: 'Advanced meditation EEG', url: 'https://choosemuse.com/products/muse-2' },
                        { name: 'BrainCo Focus', description: 'Attention training device', url: 'https://www.brainco.tech/' }
                    ]
                },
                2021: {
                    contributions: [
                        'AI-enhanced brain analysis',
                        'VR brain state monitoring',
                        'Portable fMRI development',
                        'Consciousness measurement scales',
                        'Psychedelic neuroscience boom'
                    ],
                    keyPeople: [
                        { name: 'Dr. Andrew Huberman', role: 'Huberman Lab podcast influence' },
                        { name: 'Dr. Karl Friston', role: 'Predictive processing models' },
                        { name: 'Dr. Matthew Walker', role: 'Sleep and consciousness' }
                    ],
                    technologies: [
                        'AI brain state classification',
                        'Real-time EEG + VR',
                        'Portable neuroimaging',
                        'Machine learning analysis',
                        'Brain connectivity maps'
                    ],
                    examples: [
                        { name: 'Kernel Flow', description: 'Portable brain imaging', url: 'https://www.kernel.com/' },
                        { name: 'TRIPP + EEG', description: 'VR with neurofeedback', url: 'https://www.neuroregulation.org/article/view/23484' },
                        { name: 'Neurosity Crown', description: 'BCI meditation device', url: 'https://neurosity.co/' },
                    ]
                },
                2024: {
                    contributions: [
                        'Consumer BCIs mainstream',
                        'VR neurofeedback standard',
                        'Consciousness AI models',
                        'Psychedelic brain maps',
                        'Real-time state optimization'
                    ],
                    keyPeople: [
                        { name: 'Dr. Andrew Huberman', role: 'Science communication leader' },
                        { name: 'Dr. Anil Seth', role: 'Consciousness framework influence' },
                        { name: 'Dr. Nolan Williams', role: 'Stanford brain stimulation' }
                    ],
                    technologies: [
                        'Consumer BCI headsets',
                        'VR + real-time neurofeedback',
                        'AI consciousness models',
                        'Ultrasound brain stimulation',
                        'Closed-loop brain systems'
                    ],
                    examples: [
                        { name: 'Neurable Headphones', description: 'BCI in everyday devices', url: 'https://neurable.com/' },
                        { name: 'TRIPP Neurofeedback', description: 'Standard VR wellness', url: 'https://www.neuroregulation.org/article/view/23484' },
                        { name: 'Omnifit Brain', description: 'AI-guided brain training', url: 'https://www.tripp.com/' }
                    ]
                }
            }
        },

        'contemplative': {
            contributions: [
                'Meditation techniques',
                'Mindfulness practices',
                'Breathwork methods',
                'Body awareness protocols',
                'Intention-setting frameworks'
            ],
            keyPeople: [
                { name: 'Jon Kabat-Zinn', role: 'MBSR founder' },
                { name: 'Jack Kornfield', role: 'Insight Meditation teacher' },
                { name: 'Tara Brach', role: 'Mindfulness teacher and author' },
                { name: 'Wim Hof', role: 'Breathwork pioneer' }
            ],
            technologies: [
                'Guided meditation protocols',
                'Breathwork techniques',
                'Body scan methods',
                'Mindfulness-Based Stress Reduction',
                'Loving-kindness meditation'
            ],
            examples: [
                { name: 'Headspace VR', description: 'Meditation in virtual spaces' },
                { name: 'Calm VR Experiences', description: 'Relaxation environments' },
                { name: 'Waking Up VR', description: 'Sam Harris meditation app' }
            ],
            contentByYear: {
                2015: {
                    contributions: [
                        'Mindfulness apps proliferate',
                        'MBSR in healthcare',
                        'Corporate meditation programs',
                        'Secular Buddhism growth'
                    ],
                    keyPeople: [
                        { name: 'Jon Kabat-Zinn', role: 'MBSR mainstream acceptance' },
                        { name: 'Sam Harris', role: 'Secular meditation advocacy' },
                        { name: 'Tara Brach', role: 'Western Buddhism teacher' }
                    ],
                    technologies: [
                        'Headspace app launch',
                        'Calm app growth',
                        'MBSR protocols standardized',
                        'Guided meditation audio'
                    ],
                    examples: [
                        { name: 'Headspace', description: 'Meditation app mainstream', url: 'https://www.headspace.com/' },
                        { name: 'Calm', description: 'Sleep and meditation', url: 'https://www.calm.com/' },
                        { name: '10% Happier', description: 'Skeptic-friendly meditation', url: 'https://www.tenpercent.com/' }
                    ]
                },
                2017: {
                    contributions: [
                        'Breathwork renaissance begins',
                        'VR meditation experiments',
                        'Mindfulness in education',
                        'Corporate wellness integration',
                        'Meditation research grows'
                    ],
                    keyPeople: [
                        { name: 'Wim Hof', role: 'Breathwork method popularization' },
                        { name: 'Sam Harris', role: 'Waking Up app launch' },
                        { name: 'Jack Kornfield', role: 'Online dharma teachings' }
                    ],
                    technologies: [
                        'Wim Hof Method protocols',
                        'Early VR meditation apps',
                        'Biometric meditation tracking',
                        'Group meditation platforms'
                    ],
                    examples: [
                        { name: 'Waking Up', description: 'Sam Harris meditation app', url: 'https://www.wakingup.com/' },
                        { name: 'Insight Timer', description: 'Free meditation community', url: 'https://insighttimer.com/' },
                        { name: 'Guided Meditation VR', description: 'VR contemplative spaces', url: 'https://cubicworlds.net/gmedvr/' }
                    ]
                },
                2020: {
                    contributions: [
                        'Pandemic meditation boom',
                        'Breathwork as anxiety relief',
                        'VR meditation mainstream',
                        'Somatic practices integration',
                        'Trauma-informed mindfulness'
                    ],
                    keyPeople: [
                        { name: 'Wim Hof', role: 'Breathwork during pandemic' },
                        { name: 'Tara Brach', role: 'Online meditation surge' },
                        { name: 'Jon Kabat-Zinn', role: 'MBSR for pandemic stress' }
                    ],
                    technologies: [
                        'VR meditation platforms',
                        'Breathwork app integrations',
                        'Live-streamed meditation',
                        'Somatic tracking tools',
                        'Trauma-sensitive protocols'
                    ],
                    examples: [
                        { name: 'Calm VR', description: 'VR relaxation environments', url: 'https://www.calm.com/' },
                        { name: 'TRIPP', description: 'Psychedelic meditation VR', url: 'https://www.tripp.com/' },
                        { name: 'Othership', description: 'Breathwork community app', url: 'https://www.othership.us/' }
                    ]
                },
                2023: {
                    contributions: [
                        'AI-guided meditation',
                        'VR retreat experiences',
                        'Breathwork + biometrics',
                        'Psychedelic integration practices',
                        'Embodiment practices mainstream'
                    ],
                    keyPeople: [
                        { name: 'Sam Harris', role: 'AI meditation experiments' },
                        { name: 'Jack Kornfield', role: 'Psychedelic integration teacher' },
                        { name: 'Gabor Maté', role: 'Compassionate inquiry + psychedelics' }
                    ],
                    technologies: [
                        'AI personalized meditation',
                        'VR group meditation spaces',
                        'Real-time HRV feedback',
                        'Integration app platforms',
                        'Embodied meditation tracking'
                    ],
                    examples: [
                        { name: 'Headspace VR', description: 'Full VR meditation platform', url: 'https://www.headspace.com/' },
                        { name: 'TRIPP + Neurofeedback', description: 'Brain-guided meditation', url: 'https://www.tripp.com/' },
                        { name: 'Othership Breathwork', description: 'Community breathwork app', url: 'https://www.othership.us/' }
                    ]
                }
            }
        },

        'gaming': {
            contributions: [
                'Engagement design patterns',
                'Flow state mechanics',
                'Real-time feedback systems',
                'Progressive difficulty scaling',
                'Immersive storytelling'
            ],
            keyPeople: [
                { name: 'Jenova Chen', role: 'Journey, Flower creator' },
                { name: 'Jane McGonigal', role: 'Games for wellbeing' },
                { name: 'Mihaly Csikszentmihalyi', role: 'Flow state researcher' },
                { name: 'Gabe Newell', role: 'Valve, VR gaming pioneer' }
            ],
            technologies: [
                'Real-time 3D engines',
                'Physics simulation',
                'Adaptive difficulty systems',
                'Achievement/reward systems',
                'Multiplayer synchronization'
            ],
            examples: [
                { name: 'Journey', description: 'Meditative exploration game' },
                { name: 'Flow', description: 'Relaxation through gameplay' },
                { name: 'Beat Saber', description: 'VR rhythm and flow' }
            ],
            contentByYear: {
                2015: {
                    contributions: [
                        'Indie games as art',
                        'Emotional storytelling',
                        'Minimalist game design',
                        'Flow state in gaming'
                    ],
                    keyPeople: [
                        { name: 'Jenova Chen', role: 'Journey success, thatgamecompany' },
                        { name: 'Jonathan Blow', role: 'The Witness creator' },
                        { name: 'Jane McGonigal', role: 'Games for positive impact' }
                    ],
                    technologies: [
                        'Unity engine accessibility',
                        'Procedural generation',
                        'Minimalist aesthetics',
                        'Emotional design patterns'
                    ],
                    examples: [
                        { name: 'Journey', description: 'Wordless emotional connection', url: 'https://thatgamecompany.com/journey/' },
                        { name: 'Monument Valley', description: 'Meditative puzzle game', url: 'https://www.monumentvalleygame.com/' },
                        { name: 'Flower', description: 'Relaxation through motion', url: 'https://thatgamecompany.com/flower/' }
                    ]
                },
                2017: {
                    contributions: [
                        'VR gaming emergence',
                        'Rhythm games renaissance',
                        'Wellness games category',
                        'Social VR experiences',
                        'Accessibility features grow'
                    ],
                    keyPeople: [
                        { name: 'Gabe Newell', role: 'VR gaming platform (Steam)' },
                        { name: 'Jenova Chen', role: 'Sky: Children of Light development' },
                        { name: 'Jane McGonigal', role: 'SuperBetter app' }
                    ],
                    technologies: [
                        'VR game engines',
                        'Haptic feedback controllers',
                        'Rhythm matching algorithms',
                        'Social presence systems',
                        'Accessibility options'
                    ],
                    examples: [
                        { name: 'Beat Saber', description: 'VR rhythm breakthrough', url: 'https://beatsaber.com/' },
                        { name: 'VRChat', description: 'Social VR platform', url: 'https://hello.vrchat.com/' },
                        { name: 'Superhot VR', description: 'Time-bending meditation', url: 'https://superhotvr.com/' }
                    ]
                },
                2020: {
                    contributions: [
                        'Pandemic gaming boom',
                        'VR fitness games',
                        'Meditation game genre',
                        'Flow state optimization',
                        'Wellness game design'
                    ],
                    keyPeople: [
                        { name: 'Jenova Chen', role: 'Sky: Children of Light live' },
                        { name: 'Jane McGonigal', role: 'Games for pandemic wellbeing' },
                        { name: 'Lucas Pope', role: 'Contemplative game design' }
                    ],
                    technologies: [
                        'VR fitness tracking',
                        'Adaptive difficulty AI',
                        'Biometric integration',
                        'Procedural relaxation',
                        'Social connection systems'
                    ],
                    examples: [
                        { name: 'Beat Saber', description: 'VR fitness phenomenon', url: 'https://beatsaber.com/' },
                        { name: 'Supernatural', description: 'VR fitness + meditation', url: 'https://www.getsupernatural.com/' },
                        { name: 'Sky: Children of Light', description: 'Social contemplative game', url: 'https://thatgamecompany.com/sky/' }
                    ]
                },
                2023: {
                    contributions: [
                        'AI-generated experiences',
                        'Therapeutic game design',
                        'Flow state biofeedback',
                        'VR meditation games',
                        'Wellness gaming mainstream'
                    ],
                    keyPeople: [
                        { name: 'Jenova Chen', role: 'Ongoing Sky expansions' },
                        { name: 'Jane McGonigal', role: 'Games + mental health research' },
                        { name: 'Sam Barlow', role: 'Narrative innovation' }
                    ],
                    technologies: [
                        'AI procedural generation',
                        'Real-time biofeedback',
                        'VR + neurofeedback',
                        'Therapeutic game mechanics',
                        'Adaptive wellness systems'
                    ],
                    examples: [
                        { name: 'Beat Saber', description: 'Evolved meditation tool', url: 'https://beatsaber.com/' },
                        { name: 'TRIPP', description: 'Gamified meditation', url: 'https://www.tripp.com/' },
                        { name: 'Unpacking', description: 'Meditative narrative game', url: 'https://www.unpackinggame.com/' }
                    ]
                }
            }
        },

        'digital-art': {
            contributions: [
                'Immersive visual experiences',
                'Interactive installations',
                'Procedural generation',
                'Synesthetic design',
                'Sacred geometry visualization'
            ],
            keyPeople: [
                { name: 'Android Jones', role: 'Visionary digital artist' },
                { name: 'Beeple', role: 'Digital art pioneer' },
                { name: 'Refik Anadol', role: 'AI + data art' },
                { name: 'TeamLab', role: 'Immersive art collective' }
            ],
            technologies: [
                'Real-time rendering',
                'Procedural art generation',
                'Interactive shader systems',
                'Projection mapping',
                'Generative AI art'
            ],
            examples: [
                { name: 'Microdose VR', description: 'Psychedelic art experiences' },
                { name: 'The Under Presents', description: 'Immersive VR theater' },
                { name: 'Tilt Brush Galleries', description: 'VR painting exhibitions' }
            ],
            contentByYear: {
                2015: {
                    contributions: [
                        'Festival projection mapping',
                        'VJ culture evolution',
                        'Fractal art generation',
                        'Digital installations',
                        'Psychedelic visual art'
                    ],
                    keyPeople: [
                        { name: 'Android Jones', role: 'Festival visionary art' },
                        { name: 'Android Jones', role: 'Samskara VR development' },
                        { name: 'TeamLab', role: 'Interactive art installations' }
                    ],
                    technologies: [
                        'Projection mapping software',
                        'Real-time VJ systems',
                        'Fractal generation tools',
                        'Interactive installations',
                        'LED art technology'
                    ],
                    examples: [
                        { name: 'Android Jones Projections', description: 'Festival visionary art', url: 'https://androidjones.com/' },
                        { name: 'TeamLab Borderless', description: 'Interactive museum', url: 'https://www.teamlab.art/e/tokyo/' },
                        { name: 'Electric Forest Visuals', description: 'Immersive festivals', url: 'https://electricforestfestival.com/' }
                    ]
                },
                2016: {
                    contributions: [
                        'VR painting tools launch',
                        'Tilt Brush release',
                        'VR art galleries emerge',
                        '360° video art',
                        'Immersive storytelling'
                    ],
                    keyPeople: [
                        { name: 'Google Artists', role: 'Tilt Brush creators' },
                        { name: 'Android Jones', role: 'VR art pioneer (Samskara)' },
                        { name: 'Beeple', role: 'Daily digital art practice' }
                    ],
                    technologies: [
                        'Google Tilt Brush',
                        'VR sculpting tools',
                        '360° video cameras',
                        'Spatial audio for art',
                        'VR gallery platforms'
                    ],
                    examples: [
                        { name: 'Tilt Brush', description: 'VR painting revolution', url: 'https://store.steampowered.com/app/327140/Tilt_Brush' },
                        { name: 'Samskara VR', description: 'Android Jones psychedelic art', url: 'https://androidjones.com/pages/samskara' },
                        { name: 'The Night Cafe VR', description: 'Van Gogh immersion', url: 'https://store.steampowered.com/app/482390/The_Night_Cafe_A_VR_Tribute_to_Vincent_Van_Gogh/' }
                    ]
                },
                2019: {
                    contributions: [
                        'VR art exhibitions',
                        'Projection mapping advances',
                        'Immersive theater',
                        'Interactive art experiences',
                        'Psychedelic art VR apps'
                    ],
                    keyPeople: [
                        { name: 'Android Jones', role: 'Microdose VR development' },
                        { name: 'Beeple', role: 'NFT art precursor work' },
                        { name: 'Refik Anadol', role: 'Data-driven installations' },
                        { name: 'TeamLab', role: 'Planets exhibition' }
                    ],
                    technologies: [
                        'VR art creation tools',
                        'Real-time ray tracing',
                        'Interactive projection',
                        'Spatial computing art',
                        'Multi-user VR galleries'
                    ],
                    examples: [
                        { name: 'Microdose VR', description: 'Psychedelic art therapy', url: 'https://microdosevr.com/' },
                        { name: 'The Under Presents', description: 'VR theater experience', url: 'https://www.tenderclaws.com/theunderpresents' },
                        { name: 'Tilt Brush Galleries', description: 'Virtual exhibitions', url: 'https://store.steampowered.com/app/327140/Tilt_Brush' }
                    ]
                },
                2022: {
                    contributions: [
                        'AI art generation boom',
                        'NFT art market',
                        'Generative art mainstream',
                        'VR art therapy',
                        'Immersive wellness art'
                    ],
                    keyPeople: [
                        { name: 'Beeple', role: 'NFT art phenomenon ($69M sale)' },
                        { name: 'Refik Anadol', role: 'AI + MoMA installation' },
                        { name: 'Android Jones', role: 'Ongoing VR art development' },
                        { name: 'TeamLab', role: 'Global immersive exhibitions' }
                    ],
                    technologies: [
                        'DALL-E, Midjourney, Stable Diffusion',
                        'Generative AI art tools',
                        'NFT platforms',
                        'VR art therapy protocols',
                        'Real-time AI rendering'
                    ],
                    examples: [
                        { name: 'Microdose VR', description: 'Therapeutic art standard', url: 'https://microdosevr.com/' },
                        { name: 'TRIPP Visual Art', description: 'Wellness-focused visuals', url: 'https://www.tripp.com/' },
                        { name: 'AI Art Exhibitions', description: 'Generative art galleries', url: 'https://www.teamlab.art/' }
                    ]
                }
            }
        }
    }
}
/* ============================================
   CONFIGURATION
   ============================================ */

const CONFIG = {
    svg: {
        width: 1000,
        height: 800,
        centerX: 500,
        centerY: 400
    },
    nodes: {
        domainRadius: 60,
        centerRadiusMin: 20,    // Minimum size at 2015
        centerRadiusMax: 80,     // Maximum size at 2025
        orbitRadius: 300
    },
    connections: {
        minWidth: 1,
        maxWidth: 8
    },
    timeline: {
        startYear: 2015,
        endYear: 2025
    }

};

/* ============================================
   STATE MANAGEMENT
   ============================================ */

let currentYear = 2015;

let selectedNode = null;  // Currently selected domain node
let hoveredNode = null;   // Currently hovered domain node
// ADD THESE NEW VARIABLES:
let isZoomed = false;           // Track zoom state
let zoomedNode = null;          // Which node is zoomed
let originalViewBox = '0 0 1000 800';  // Default viewBox
let isAnimating = false;        // Prevent clicks during animation

/* ============================================
   INITIALIZATION
   ============================================ */

const svg = document.getElementById('network-viz');
const slider = document.getElementById('timeline-slider');
const yearDisplay = document.getElementById('current-year');

// Calculate domain positions in a circle
function calculateDomainPositions() {
    return DATA.domains.map(domain => {
        const angleRad = (domain.angle * Math.PI) / 180;
        const x = CONFIG.svg.centerX + CONFIG.nodes.orbitRadius * Math.cos(angleRad);
        const y = CONFIG.svg.centerY + CONFIG.nodes.orbitRadius * Math.sin(angleRad);
        return { ...domain, x, y };
    });
}

const domainPositions = calculateDomainPositions();

/* ============================================
   HELPER FUNCTIONS
   ============================================ */

// Get connection strength for a given year
function getConnectionStrength(connection, year) {
    if (year < connection.yearAppears) {
        return 0;
    }

    // Return exact strength for this year, or interpolate
    if (connection.strengthByYear[year] !== undefined) {
        return connection.strengthByYear[year];
    }

    // Find nearest years and interpolate
    const years = Object.keys(connection.strengthByYear).map(Number).sort((a, b) => a - b);
    const lowerYear = years.filter(y => y <= year).pop();
    const upperYear = years.filter(y => y >= year)[0];

    if (!lowerYear) return 0;
    if (!upperYear || lowerYear === upperYear) return connection.strengthByYear[lowerYear];

    // Linear interpolation
    const lowerStrength = connection.strengthByYear[lowerYear];
    const upperStrength = connection.strengthByYear[upperYear];
    const ratio = (year - lowerYear) / (upperYear - lowerYear);

    return lowerStrength + (upperStrength - lowerStrength) * ratio;
}

// Calculate center node size based on year
function calculateCenterNodeSize(year) {
    const progress = (year - CONFIG.timeline.startYear) /
        (CONFIG.timeline.endYear - CONFIG.timeline.startYear);

    // Use easing curve for more dramatic growth
    // Starts slow, accelerates, then slows at end (ease-in-out)
    const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const size = CONFIG.nodes.centerRadiusMin +
        (CONFIG.nodes.centerRadiusMax - CONFIG.nodes.centerRadiusMin) * eased;

    return size;
}

// Calculate center node opacity
function calculateCenterNodeOpacity(year) {
    const progress = (year - CONFIG.timeline.startYear) /
        (CONFIG.timeline.endYear - CONFIG.timeline.startYear);
    return 0.15 + (progress * 0.75); // 0.15 to 0.9
}

/* ============================================
   RENDERING
   ============================================ */

// Create connection lines
function createConnections() {
    const connectionsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    connectionsGroup.id = 'connections-group';
    svg.appendChild(connectionsGroup);

    DATA.connections.forEach((conn, index) => {
        const source = domainPositions.find(d => d.id === conn.source);
        const target = domainPositions.find(d => d.id === conn.target);

        if (source && target) {
            // Create glow line (background)
            const glowLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            glowLine.setAttribute('class', 'connection-glow');
            glowLine.setAttribute('id', `conn-glow-${index}`);
            glowLine.setAttribute('x1', source.x);
            glowLine.setAttribute('y1', source.y);
            glowLine.setAttribute('x2', target.x);
            glowLine.setAttribute('y2', target.y);
            glowLine.setAttribute('stroke', '#00D9FF');
            glowLine.setAttribute('stroke-width', '6');
            glowLine.setAttribute('stroke-linecap', 'round');
            glowLine.setAttribute('opacity', '0');
            glowLine.style.filter = 'blur(4px)';
            glowLine.dataset.connectionIndex = index;

            // Create main line (foreground)
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('class', 'connection-line');
            line.setAttribute('id', `conn-${index}`);
            line.setAttribute('x1', source.x);
            line.setAttribute('y1', source.y);
            line.setAttribute('x2', target.x);
            line.setAttribute('y2', target.y);
            line.setAttribute('stroke', '#00D9FF');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-linecap', 'round');
            line.setAttribute('opacity', '0');
            line.dataset.connectionIndex = index;

            connectionsGroup.appendChild(glowLine);
            connectionsGroup.appendChild(line);
        }
    });
}

// Create center node
function createCenterNode() {
    const centerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    centerGroup.id = 'center-node';
    centerGroup.setAttribute('class', 'center-node');

    // Outer glow circle
    const glowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    glowCircle.setAttribute('id', 'center-glow');
    glowCircle.setAttribute('cx', CONFIG.svg.centerX);
    glowCircle.setAttribute('cy', CONFIG.svg.centerY);
    glowCircle.setAttribute('r', CONFIG.nodes.centerRadiusMin + 10);
    glowCircle.setAttribute('fill', '#ffffff');
    glowCircle.setAttribute('opacity', '0.1');
    glowCircle.style.filter = 'blur(10px)';

    // Main circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('id', 'center-circle');
    circle.setAttribute('cx', CONFIG.svg.centerX);
    circle.setAttribute('cy', CONFIG.svg.centerY);
    circle.setAttribute('r', CONFIG.nodes.centerRadiusMin);
    circle.setAttribute('fill', 'rgba(255, 255, 255, 0.15)');
    circle.setAttribute('stroke', '#ffffff');
    circle.setAttribute('stroke-width', '2');

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('id', 'center-label');
    label.setAttribute('x', CONFIG.svg.centerX);
    label.setAttribute('y', CONFIG.svg.centerY);
    label.setAttribute('class', 'node-label');
    label.setAttribute('style', 'font-size: 10px; fill: #ffffff; opacity: 0.3;');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dy', '0.35em');
    label.textContent = 'CYBERDELICS';

    centerGroup.appendChild(glowCircle);
    centerGroup.appendChild(circle);
    centerGroup.appendChild(label);
    svg.appendChild(centerGroup);
}

// Create domain nodes
function createDomainNodes() {
    domainPositions.forEach(domain => {
        const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodeGroup.setAttribute('class', 'domain-node');
        nodeGroup.setAttribute('id', `node-${domain.id}`);
        nodeGroup.dataset.domain = domain.id;

        // Selection ring (rotating dashed circle) - FIRST so it's behind
        const selectionRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        selectionRing.setAttribute('class', 'selection-ring');
        selectionRing.setAttribute('cx', domain.x);
        selectionRing.setAttribute('cy', domain.y);
        selectionRing.setAttribute('r', CONFIG.nodes.domainRadius + 15);
        selectionRing.setAttribute('stroke', domain.color);
        selectionRing.style.color = domain.color;
        selectionRing.style.transformOrigin = `${domain.x}px ${domain.y}px`;

        // Main circle (background)
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'node-circle');
        circle.setAttribute('cx', domain.x);
        circle.setAttribute('cy', domain.y);
        circle.setAttribute('r', CONFIG.nodes.domainRadius);
        circle.setAttribute('fill', domain.color);
        circle.setAttribute('fill-opacity', '0.3');
        circle.setAttribute('stroke', domain.color);
        circle.setAttribute('stroke-width', '3');
        circle.style.color = domain.color;

        // Label group (handle multi-line text)
        const lines = domain.name.split('\n');
        const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        labelGroup.setAttribute('class', 'label-group');

        lines.forEach((line, i) => {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('class', 'node-label');
            text.setAttribute('x', domain.x);
            text.setAttribute('y', domain.y + (i - (lines.length - 1) / 2) * 18);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', domain.color);
            text.style.color = domain.color;
            text.textContent = line;
            labelGroup.appendChild(text);
        });

        // Tooltip (click to explore)
        const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tooltip.setAttribute('class', 'node-tooltip');
        tooltip.setAttribute('x', domain.x);
        tooltip.setAttribute('y', domain.y + CONFIG.nodes.domainRadius + 30);
        tooltip.setAttribute('text-anchor', 'middle');
        tooltip.textContent = 'Click to explore';

        // Build node structure (order matters for layering)
        nodeGroup.appendChild(selectionRing);  // Behind everything
        nodeGroup.appendChild(circle);          // Middle layer
        nodeGroup.appendChild(labelGroup);      // On top
        nodeGroup.appendChild(tooltip);         // Tooltip on top

        // Add event listeners
        nodeGroup.addEventListener('click', (e) => handleNodeClick(e, domain));
        nodeGroup.addEventListener('mouseenter', (e) => handleNodeHover(e, domain));
        nodeGroup.addEventListener('mouseleave', (e) => handleNodeUnhover(e, domain));

        svg.appendChild(nodeGroup);
    });
}

// Initialize visualization
function init() {
    createConnections();
    createCenterNode();
    createDomainNodes();
    updateVisualization(currentYear);
}

/* ============================================
   UPDATE LOGIC
   ============================================ */

function updateVisualization(year) {
    currentYear = year;

    // Update year display
    yearDisplay.textContent = year;

    // Update connections based on year
    DATA.connections.forEach((conn, index) => {
        const strength = getConnectionStrength(conn, year);
        const line = document.getElementById(`conn-${index}`);
        const glowLine = document.getElementById(`conn-glow-${index}`);

        if (line && glowLine) {
            // Calculate width based on strength
            const width = CONFIG.connections.minWidth +
                (CONFIG.connections.maxWidth - CONFIG.connections.minWidth) * strength;
            const glowWidth = width + 4;

            // Update line properties
            line.setAttribute('stroke-width', width);
            line.setAttribute('opacity', strength * 0.8);

            glowLine.setAttribute('stroke-width', glowWidth);
            glowLine.setAttribute('opacity', strength * 0.3);
        }
    });

    // Update center node
    const centerCircle = document.getElementById('center-circle');
    const centerGlow = document.getElementById('center-glow');
    const centerLabel = document.getElementById('center-label');

    const centerSize = calculateCenterNodeSize(year);
    const centerOpacity = calculateCenterNodeOpacity(year);

    centerCircle.setAttribute('r', centerSize);
    centerCircle.setAttribute('fill-opacity', centerOpacity);

    centerGlow.setAttribute('r', centerSize + 15);
    centerGlow.setAttribute('opacity', centerOpacity * 0.5);

    // Label grows and becomes more visible
    const labelSize = 10 + ((year - 2015) / 10) * 10; // 10px to 20px
    const labelOpacity = 0.3 + ((year - 2015) / 10) * 0.7; // 0.3 to 1.0
    centerLabel.style.fontSize = `${labelSize}px`;
    centerLabel.style.opacity = labelOpacity;
}

/* ============================================
   EVENT HANDLERS
   ============================================ */

slider.addEventListener('input', (e) => {
    const year = parseInt(e.target.value);
    updateVisualization(year);
});

/* ============================================
   PARTICLE SYSTEM
   ============================================ */

const PARTICLE_CONFIG = {
    maxParticles: 150,        // Total particles in system
    particleRadius: 2.5,       // Size of each particle
    speed: 0.0008,              // Movement speed (0.008 = ~8 seconds to traverse)
    spawnInterval: 150,        // Milliseconds between particle spawns
    fadeDistance: 0.15         // Distance from start/end where particles fade
};

let particles = [];
let lastSpawnTime = 0;
let animationFrameId = null;

class Particle {
    constructor(connectionIndex) {
        this.connectionIndex = connectionIndex;
        this.progress = 0; // 0 to 1 along the line
        this.life = 1.0;   // 1.0 = alive, 0.0 = dead
        this.id = Math.random();

        const connection = DATA.connections[connectionIndex];
        this.source = domainPositions.find(d => d.id === connection.source);
        this.target = { x: CONFIG.svg.centerX, y: CONFIG.svg.centerY }; // Always toward center
    }

    update(deltaTime) {
        // Move along the line
        this.progress += PARTICLE_CONFIG.speed * deltaTime;

        // Fade in at start, fade out at end
        if (this.progress < PARTICLE_CONFIG.fadeDistance) {
            this.life = this.progress / PARTICLE_CONFIG.fadeDistance;
        } else if (this.progress > 1 - PARTICLE_CONFIG.fadeDistance) {
            this.life = (1 - this.progress) / PARTICLE_CONFIG.fadeDistance;
        } else {
            this.life = 1.0;
        }

        // Die when reached end
        if (this.progress >= 1.0) {
            this.life = 0;
        }
    }

    getPosition() {
        // Linear interpolation between source and target
        const x = this.source.x + (this.target.x - this.source.x) * this.progress;
        const y = this.source.y + (this.target.y - this.source.y) * this.progress;
        return { x, y };
    }

    isDead() {
        return this.life <= 0;
    }
}

function getActiveConnections() {
    // Return connections that are visible at current year
    return DATA.connections
        .map((conn, index) => ({ conn, index }))
        .filter(({ conn }) => getConnectionStrength(conn, currentYear) > 0.1);
}

function spawnParticle() {
    const activeConnections = getActiveConnections();
    if (activeConnections.length === 0) return;

    // Choose random active connection, weighted by strength
    const weights = activeConnections.map(({ conn }) =>
        getConnectionStrength(conn, currentYear)
    );
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    let selectedIndex = 0;
    for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            selectedIndex = activeConnections[i].index;
            break;
        }
    }

    particles.push(new Particle(selectedIndex));
}

function updateParticles(currentTime) {
    const deltaTime = 16.67; // Assume ~60fps

    // Spawn new particles periodically
    if (currentTime - lastSpawnTime > PARTICLE_CONFIG.spawnInterval) {
        // Spawn multiple particles based on network activity
        const activeConnections = getActiveConnections();
        const spawnCount = Math.min(3, Math.ceil(activeConnections.length / 4));

        for (let i = 0; i < spawnCount; i++) {
            if (particles.length < PARTICLE_CONFIG.maxParticles) {
                spawnParticle();
            }
        }

        lastSpawnTime = currentTime;
    }

    // Update existing particles
    particles.forEach(particle => particle.update(deltaTime));

    // Remove dead particles
    particles = particles.filter(particle => !particle.isDead());
}

function renderParticles() {
    // Remove old particle elements
    const oldParticles = svg.querySelectorAll('.particle');
    oldParticles.forEach(p => p.remove());

    // Create particle group if doesn't exist
    let particleGroup = document.getElementById('particle-group');
    if (!particleGroup) {
        particleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        particleGroup.id = 'particle-group';
        // Insert before center node so particles appear behind it
        const centerNode = document.getElementById('center-node');
        svg.insertBefore(particleGroup, centerNode);
    }

    // Render each particle
    particles.forEach(particle => {
        const pos = particle.getPosition();
        const connection = DATA.connections[particle.connectionIndex];
        const strength = getConnectionStrength(connection, currentYear);

        if (strength < 0.1) return; // Don't render on invisible connections

        // Create particle circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'particle');
        circle.setAttribute('cx', pos.x);
        circle.setAttribute('cy', pos.y);
        circle.setAttribute('r', PARTICLE_CONFIG.particleRadius);
        circle.setAttribute('fill', '#00D9FF');
        circle.setAttribute('opacity', particle.life * 0.8);
        circle.style.filter = 'blur(1px)';
        circle.style.pointerEvents = 'none';

        particleGroup.appendChild(circle);
    });
}

function animateParticles(currentTime) {
    updateParticles(currentTime);
    renderParticles();

    // Continue animation loop
    animationFrameId = requestAnimationFrame(animateParticles);
}

function startParticleAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    lastSpawnTime = performance.now();
    animationFrameId = requestAnimationFrame(animateParticles);
}

function stopParticleAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // Clear particles
    particles = [];
    const particleGroup = document.getElementById('particle-group');
    if (particleGroup) {
        particleGroup.innerHTML = '';
    }
}

/* ============================================
   ENHANCED UPDATE LOGIC
   ============================================ */

function updateVisualizationWithParticles(year) {
    // CRITICAL: Update global year state
    currentYear = year;

    // Update visualization
    updateVisualization(year);

    // If we have connections, ensure particles are animating
    const activeConnections = getActiveConnections();
    if (activeConnections.length > 0 && !animationFrameId) {
        startParticleAnimation();
    } else if (activeConnections.length === 0 && animationFrameId) {
        stopParticleAnimation();
    }
}
/* ============================================
   ENHANCED EVENT HANDLERS
   ============================================ */

/* ============================================
   TIMELINE SLIDER HANDLER - FIXED
   ============================================ */

// Remove old handler if exists
if (slider._handler) {
    slider.removeEventListener('input', slider._handler);
}

// Create new handler
slider._handler = (e) => {
    const year = parseInt(e.target.value);

    console.log(`📅 Timeline slider moved to year: ${year}`);

    // Update the visualization (connections, particles, year display)
    updateVisualizationWithParticles(year);

    // Trigger timeline scrub hint (first time only, when not zoomed)
    if (!isZoomed) {
        checkTimelineScrubHint();
    }

    // If currently zoomed, refresh content for new year
    if (isZoomed && zoomedNode) {
        console.log(`🔄 Refreshing content for ${zoomedNode} at year ${year}`);

        // Remove old content
        const oldContent = document.getElementById('content-rings');
        if (oldContent) {
            oldContent.remove();
        }

        // Create new content for this year
        createContentRings(zoomedNode);

        // Trigger hint for timeline while zoomed (first time only)
        checkTimelineWhileZoomedHint();
    }
};

// Attach handler to slider
slider.addEventListener('input', slider._handler);

/* ============================================
   ZOOM SYSTEM
   ============================================ */

const ZOOM_CONFIG = {
    duration: 800,
    zoomScale: 2,          // INCREASED: Zoom in much closer
    padding: 100// REDUCED: Less padding = bigger node
};

/* ============================================
   VISIBLE AREA CALCULATION
   ============================================ */

// Get the visible SVG area bounds based on current viewBox
function getVisibleBounds() {
    const svg = document.getElementById('network-viz');
    const viewBox = svg.getAttribute('viewBox').split(' ').map(Number);

    return {
        x: viewBox[0],           // Left edge
        y: viewBox[1],           // Top edge
        width: viewBox[2],       // Visible width
        height: viewBox[3],      // Visible height
        centerX: viewBox[0] + viewBox[2] / 2,
        centerY: viewBox[1] + viewBox[3] / 2,
        right: viewBox[0] + viewBox[2],
        bottom: viewBox[1] + viewBox[3]
    };
}

// Calculate viewBox for zoomed state
function calculateZoomedViewBox(domain) {
    const nodeRadius = CONFIG.nodes.domainRadius;
    const selectionRingRadius = nodeRadius + 15;

    // Calculate size to show node + ring + padding
    const viewSize = (selectionRingRadius + ZOOM_CONFIG.padding) * 2;

    // Center on the node
    const viewX = domain.x - viewSize / 2;
    const viewY = domain.y - viewSize / 2;

    return `${viewX} ${viewY} ${viewSize} ${viewSize}`;
}

// Animate viewBox transition
function animateViewBox(targetViewBox, duration, onComplete) {
    const svg = document.getElementById('network-viz');
    const startViewBox = svg.getAttribute('viewBox').split(' ').map(Number);
    const endViewBox = targetViewBox.split(' ').map(Number);

    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-in-out)
        const eased = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // Interpolate viewBox values
        const currentViewBox = startViewBox.map((start, i) => {
            return start + (endViewBox[i] - start) * eased;
        });

        svg.setAttribute('viewBox', currentViewBox.join(' '));

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            if (onComplete) onComplete();
        }
    }

    requestAnimationFrame(animate);
}

// Zoom into a node
function zoomToNode(domainId) {
    if (isAnimating || isZoomed) return;

    const domain = domainPositions.find(d => d.id === domainId);
    if (!domain) return;

    isAnimating = true;
    isZoomed = true;
    zoomedNode = domainId;

    console.log(`🔍 Zooming into: ${domain.name.replace('\n', ' ')}`);

    // Show loading indicator
    showLoading();

    // Fade out other elements
    fadeOtherElements(domainId, true);

    // Calculate target viewBox
    const targetViewBox = calculateZoomedViewBox(domain);

    // Animate zoom
    animateViewBox(targetViewBox, ZOOM_CONFIG.duration, () => {
        isAnimating = false;
        console.log('✅ Zoom complete');

        // Show back button and instructions
        showZoomUI();

        // CREATE CONTENT RINGS
        createContentRings(domainId);

        // Hide loading indicator
        hideLoading();
    });
    animateViewBox(targetViewBox, ZOOM_CONFIG.duration, () => {
        isAnimating = false;
        console.log('✅ Zoom complete');

        // Show back button and instructions
        showZoomUI();

        // CREATE CONTENT RINGS
        createContentRings(domainId);

        // Hide loading indicator
        hideLoading();

        // Trigger first zoom hint
        checkFirstZoomHint();
    });
}

// Zoom back out to full network view
function zoomOut() {
    if (isAnimating || !isZoomed) return;

    isAnimating = true;

    console.log('🔍 Zooming out to network view');

    // HIDE CONTENT RINGS - ADD THIS LINE
    hideContentRings();

    // Fade elements back in
    fadeOtherElements(null, false);

    // Hide zoom UI
    hideZoomUI();

    // Animate back to original viewBox
    animateViewBox(originalViewBox, ZOOM_CONFIG.duration, () => {
        isAnimating = false;
        isZoomed = false;
        zoomedNode = null;
        console.log('✅ Zoom out complete');
    });
}

// Fade other elements during zoom
function fadeOtherElements(selectedDomainId, fade) {
    // Fade other nodes
    document.querySelectorAll('.domain-node').forEach(node => {
        if (node.dataset.domain !== selectedDomainId) {
            if (fade) {
                node.classList.add('fade-during-zoom', 'hidden');
            } else {
                node.classList.remove('hidden');
                // Remove fade-during-zoom class after transition
                setTimeout(() => node.classList.remove('fade-during-zoom'), 800);
            }
        }
    });

    // Fade connections
    const connectionsGroup = document.getElementById('connections-group');
    if (connectionsGroup) {
        if (fade) {
            connectionsGroup.classList.add('zoomed');
        } else {
            connectionsGroup.classList.remove('zoomed');
        }
    }

    // Fade particles
    const particleGroup = document.getElementById('particle-group');
    if (particleGroup) {
        if (fade) {
            particleGroup.classList.add('zoomed');
        } else {
            particleGroup.classList.remove('zoomed');
        }
    }

    // Fade center node
    const centerNode = document.getElementById('center-node');
    if (centerNode) {
        if (fade) {
            centerNode.classList.add('zoomed');
        } else {
            centerNode.classList.remove('zoomed');
        }
    }

    // Dim timeline
    const timeline = document.getElementById('timeline-container');
    if (timeline) {
        if (fade) {
            timeline.classList.add('zoomed');
        } else {
            timeline.classList.remove('zoomed');
        }
    }
}

// Show back button and instructions
function showZoomUI() {
    const backButton = document.getElementById('back-button');
    const instructions = document.getElementById('zoom-instructions');
    const escHint = document.getElementById('esc-hint'); // NEW

    if (backButton) {
        backButton.classList.add('visible');
    }

    if (instructions) {
        instructions.classList.add('visible');
    }

    // NEW: Show ESC hint if it exists
    if (escHint) {
        escHint.classList.add('visible');
    }
}

// Hide back button and instructions
function hideZoomUI() {
    const backButton = document.getElementById('back-button');
    const instructions = document.getElementById('zoom-instructions');
    const escHint = document.getElementById('esc-hint'); // NEW

    if (backButton) {
        backButton.classList.remove('visible');
    }

    if (instructions) {
        instructions.classList.remove('visible');
    }

    // NEW: Hide ESC hint if it exists
    if (escHint) {
        escHint.classList.remove('visible');
    }
}
/* ============================================
   INTERACTION HANDLERS
   ============================================ */

function handleNodeClick(event, domain) {
    event.stopPropagation();

    // Don't allow clicks during animation
    if (isAnimating) return;

    console.log(`🎯 Node clicked: ${domain.name.replace('\n', ' ')}`);
    console.log(`   Domain ID: ${domain.id}`);
    console.log(`   Current state: ${isZoomed ? 'zoomed into ' + zoomedNode : 'network view'}`);
    console.log(`   Previously selected: ${selectedNode || 'none'}`);

    // CASE 1: If already zoomed into this exact node, zoom out
    if (isZoomed && zoomedNode === domain.id) {
        console.log('   → Action: Zoom out (clicked same zoomed node)');
        zoomOut();
        deselectNode();
        return;
    }

    // CASE 2: If zoomed into a DIFFERENT node, zoom out then zoom into new one
    if (isZoomed && zoomedNode !== domain.id) {
        console.log('   → Action: Switch to different node (zoom out then zoom in)');
        zoomOut();
        setTimeout(() => {
            selectNode(domain.id);
            zoomToNode(domain.id);
        }, ZOOM_CONFIG.duration + 100);
        return;
    }

    // CASE 3: In network view - if clicking already selected node, zoom in
    if (!isZoomed && selectedNode === domain.id) {
        console.log('   → Action: Zoom into already selected node');
        zoomToNode(domain.id);
        return;
    }

    // CASE 4: In network view - if clicking different node, switch selection then zoom
    if (!isZoomed && selectedNode && selectedNode !== domain.id) {
        console.log('   → Action: Switch selection and zoom into new node');
        selectNode(domain.id);  // This will deselect old and select new
        zoomToNode(domain.id);
        return;
    }

    // CASE 5: In network view - first selection, select and zoom
    if (!isZoomed && !selectedNode) {
        console.log('   → Action: First selection - select and zoom');
        selectNode(domain.id);
        zoomToNode(domain.id);
        return;
    }
}

function handleNodeHover(event, domain) {
    if (hoveredNode === domain.id) return;

    hoveredNode = domain.id;
    console.log(`👆 Hovering: ${domain.name.replace('\n', ' ')}`);
}

function handleNodeUnhover(event, domain) {
    if (hoveredNode === domain.id) {
        hoveredNode = null;
    }
}

function selectNode(domainId) {
    // Deselect previous node
    if (selectedNode) {
        const prevNode = document.getElementById(`node-${selectedNode}`);
        if (prevNode) {
            prevNode.classList.remove('selected');
        }
    }

    // Select new node
    selectedNode = domainId;
    const nodeElement = document.getElementById(`node-${domainId}`);

    if (nodeElement) {
        nodeElement.classList.add('selected');

        // Dim other nodes
        document.querySelectorAll('.domain-node').forEach(node => {
            if (node.dataset.domain !== domainId) {
                node.classList.add('dimmed');
            }
        });

        console.log(`✅ Selected: ${domainId}`);
    }
}

function deselectNode() {
    if (!selectedNode) return;

    console.log(`❌ Deselected: ${selectedNode}`);

    const nodeElement = document.getElementById(`node-${selectedNode}`);
    if (nodeElement) {
        nodeElement.classList.remove('selected');
    }

    // Un-dim all nodes
    document.querySelectorAll('.domain-node').forEach(node => {
        node.classList.remove('dimmed');
    });

    selectedNode = null;
}

// Click anywhere else to deselect/zoom out
svg.addEventListener('click', (e) => {
    // Only handle if clicking SVG background (not a node)
    if (e.target === svg || e.target.tagName === 'svg') {
        if (isZoomed) {
            zoomOut();
            deselectNode();
        } else {
            deselectNode();
        }
    }
});

// ESC key to deselect
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selectedNode) {
        deselectNode();
    }
});
/* ============================================
   ZOOM UI EVENT LISTENERS
   ============================================ */

// Back button click
const backButton = document.getElementById('back-button');
if (backButton) {
    backButton.addEventListener('click', () => {
        zoomOut();
        deselectNode();
    });
}

// ESC key to zoom out
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isZoomed) {
            zoomOut();
            deselectNode();
        } else if (selectedNode) {
            deselectNode();
        }
    }
});
/* ============================================
   TEXT WRAPPING UTILITY
   ============================================ */

function wrapText(text, maxWidth, fontSize) {
    // Split text into words
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    // Create temporary text element to measure width
    const tempText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tempText.setAttribute('font-size', fontSize);
    tempText.style.visibility = 'hidden';
    svg.appendChild(tempText);

    words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        tempText.textContent = testLine;
        const width = tempText.getComputedTextLength();

        if (width > maxWidth && currentLine) {
            // Line is too long, start new line
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });

    // Add remaining text
    if (currentLine) {
        lines.push(currentLine);
    }

    // Clean up
    svg.removeChild(tempText);

    return lines;
}
/* ============================================
   YEAR-BASED CONTENT SELECTION
   ============================================ */

function getContentForYear(domainId, year) {
    const details = DATA.domainDetails[domainId];
    if (!details) return null;

    // If no year-based content, return default
    if (!details.contentByYear) {
        return {
            contributions: details.contributions,
            keyPeople: details.keyPeople,
            technologies: details.technologies,
            examples: details.examples
        };
    }

    // Find the closest year that's <= current year
    const availableYears = Object.keys(details.contentByYear)
        .map(Number)
        .sort((a, b) => a - b);

    // Find the most recent year that's not in the future
    let selectedYear = null;
    for (let i = availableYears.length - 1; i >= 0; i--) {
        if (availableYears[i] <= year) {
            selectedYear = availableYears[i];
            break;
        }
    }

    // If year is before first entry, use default (latest) content
    if (selectedYear === null) {
        console.log(`📅 Year ${year} is before first entry, using default content`);
        return {
            contributions: details.contributions,
            keyPeople: details.keyPeople,
            technologies: details.technologies,
            examples: details.examples
        };
    }

    console.log(`📅 Using content from year ${selectedYear} for current year ${year}`);

    // Return content from selected year
    return details.contentByYear[selectedYear];
}
function createContentRings(domainId) {
    try {
        const domain = domainPositions.find(d => d.id === domainId);
        if (!domain) {
            console.error('❌ Domain not found:', domainId);
            return;
        }

        // Get year-appropriate content
        const details = getContentForYear(domainId, currentYear);
        if (!details) {
            console.error('❌ No content details for:', domainId);
            return;
        }

        console.log(`🎨 Creating content for ${domainId} at year ${currentYear}`);

        // Remove any existing content rings
        const existingRings = document.getElementById('content-rings');
        if (existingRings) existingRings.remove();

        // Get visible screen bounds
        const bounds = getVisibleBounds();

        // Create content rings group
        const ringsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        ringsGroup.setAttribute('id', 'content-rings');
        ringsGroup.setAttribute('class', 'content-rings');

        const centerX = domain.x;
        const centerY = domain.y;

        // Calculate positions relative to node, not screen edges
        const ringRadius = CONFIG.nodes.domainRadius + 15; // Selection ring radius

        // DIFFERENT box dimensions for horizontal (top/bottom) vs vertical (left/right)
        const horizontalBoxWidth = bounds.width * 0.50;  // Wider for top/bottom
        const horizontalBoxHeight = bounds.height * 0.22; // Shorter for top/bottom

        const verticalBoxWidth = bounds.width * 0.30;   // Same as before for left/right
        const verticalBoxHeight = bounds.height * 0.65;  // Same as before for left/right

        console.log('📦 Box dimensions:');
        console.log('   Horizontal (top/bottom):', { width: horizontalBoxWidth, height: horizontalBoxHeight });
        console.log('   Vertical (left/right):', { width: verticalBoxWidth, height: verticalBoxHeight });

        // Ring 1: Contributions (Top) - HORIZONTAL, CLOSER
        const topDistance = ringRadius + 15; // Closer to ring
        const ring1X = centerX - (horizontalBoxWidth / 2);
        const ring1Y = centerY - topDistance - horizontalBoxHeight;
        const ring1 = createContributionsBox(ring1X, ring1Y, horizontalBoxWidth, horizontalBoxHeight, details.contributions, domain.color);
        ring1.setAttribute('class', 'content-section ring-1');
        ringsGroup.appendChild(ring1);

        // Ring 2: Key People (Right) - VERTICAL, SAME
        const sideDistance = ringRadius + 25;
        const ring2X = centerX + sideDistance;
        const ring2Y = centerY - (verticalBoxHeight / 2);
        const ring2 = createKeyPeopleBox(ring2X, ring2Y, verticalBoxWidth, verticalBoxHeight, details.keyPeople, domain.color);
        ring2.setAttribute('class', 'content-section ring-2');
        ringsGroup.appendChild(ring2);

        // Ring 3: Technologies (Bottom) - HORIZONTAL, CLOSER
        const ring3X = centerX - (horizontalBoxWidth / 2);
        const ring3Y = centerY + topDistance; // Use same distance as top
        const ring3 = createTechnologiesBox(ring3X, ring3Y, horizontalBoxWidth, horizontalBoxHeight, details.technologies, domain.color);
        ring3.setAttribute('class', 'content-section ring-3');
        ringsGroup.appendChild(ring3);

        // Ring 4: Examples (Left) - VERTICAL, SAME
        const ring4X = centerX - sideDistance - verticalBoxWidth;
        const ring4Y = centerY - (verticalBoxHeight / 2);
        const ring4 = createExamplesBox(ring4X, ring4Y, verticalBoxWidth, verticalBoxHeight, details.examples, domain.color);
        ring4.setAttribute('class', 'content-section ring-4');
        ringsGroup.appendChild(ring4);

        // Add to SVG
        svg.appendChild(ringsGroup);

        // Trigger fade-in after brief delay
        setTimeout(() => {
            ringsGroup.classList.add('visible');
            ringsGroup.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('visible');
            });
        }, 100);
    } catch (error) {
        console.error('❌ Error creating content rings:', error);
        hideLoading();

        // Show error message to user
        showErrorMessage('Unable to load content. Please try again.');
    }
}

function showErrorMessage(message) {
    // Create temporary error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 0, 0, 0.9);
    color: white;
    padding: 20px 40px;
    border-radius: 8px;
    font-family: 'Space Mono', monospace;
    z-index: 1000;
  `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function createContributionsBox(x, y, width, height, contributions, color) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Background box
    const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    box.setAttribute('x', x);
    box.setAttribute('y', y);
    box.setAttribute('width', width);
    box.setAttribute('height', height);
    box.setAttribute('rx', 6);
    box.setAttribute('fill', 'rgba(10, 10, 15, 0.85)');
    box.setAttribute('stroke', color);
    box.setAttribute('stroke-width', 2);
    group.appendChild(box);

    // Header
    const headerFontSize = 7; // ← ADJUST HEADER SIZE HERE
    const header = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    header.setAttribute('x', x + width / 2);
    header.setAttribute('y', y + 14);
    header.setAttribute('text-anchor', 'middle');
    header.setAttribute('font-size', headerFontSize);
    header.setAttribute('font-weight', 'bold');
    header.setAttribute('fill', color);
    header.textContent = 'CONTRIBUTIONS';
    group.appendChild(header);

    // Divider line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x + 8);
    line.setAttribute('y1', y + 20);
    line.setAttribute('x2', x + width - 8);
    line.setAttribute('y2', y + 20);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', 1);
    line.setAttribute('opacity', 0.3);
    group.appendChild(line);

    // Items with word wrap
    const fontSize = 6; // ← ADJUST BODY TEXT SIZE HERE
    const lineHeight = 7; // ← ADJUST LINE SPACING HERE
    const maxTextWidth = width - 20; // Leave padding on right
    let currentY = y + 30;
    const maxY = y + height - 5; // Bottom boundary

    contributions.forEach((item) => {
        // Check if we have space
        if (currentY >= maxY) return;

        // Wrap the text
        const wrappedLines = wrapText(`• ${item}`, maxTextWidth, fontSize);

        wrappedLines.forEach((line, lineIndex) => {
            // Check if this line fits
            if (currentY >= maxY) return;

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x + 10);
            text.setAttribute('y', currentY);
            text.setAttribute('font-size', fontSize);
            text.setAttribute('fill', '#ffffff');
            text.textContent = line;
            group.appendChild(text);

            currentY += lineHeight;
        });

        // Add small gap between items
        currentY += 2;
    });

    return group;
}

function createKeyPeopleBox(x, y, width, height, people, color) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Background box
    const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    box.setAttribute('x', x);
    box.setAttribute('y', y);
    box.setAttribute('width', width);
    box.setAttribute('height', height);
    box.setAttribute('rx', 6);
    box.setAttribute('fill', 'rgba(10, 10, 15, 0.85)');
    box.setAttribute('stroke', color);
    box.setAttribute('stroke-width', 2);
    group.appendChild(box);

    // Header
    const headerFontSize = 7; // ← ADJUST HEADER SIZE HERE
    const header = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    header.setAttribute('x', x + width / 2);
    header.setAttribute('y', y + 14);
    header.setAttribute('text-anchor', 'middle');
    header.setAttribute('font-size', headerFontSize);
    header.setAttribute('font-weight', 'bold');
    header.setAttribute('fill', color);
    header.textContent = 'KEY PEOPLE';
    group.appendChild(header);

    // Divider line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x + 8);
    line.setAttribute('y1', y + 20);
    line.setAttribute('x2', x + width - 8);
    line.setAttribute('y2', y + 20);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', 1);
    line.setAttribute('opacity', 0.3);
    group.appendChild(line);

    // People items with word wrap
    const nameFontSize = 6.5; // ← ADJUST NAME SIZE HERE
    const roleFontSize = 6; // ← ADJUST ROLE SIZE HERE
    const maxTextWidth = width - 10;
    let currentY = y + 30;
    const maxY = y + height - 5;

    people.forEach((person) => {
        // Check if we have space for at least name
        if (currentY >= maxY) return;

        // Name
        const name = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        name.setAttribute('x', x + 10);
        name.setAttribute('y', currentY);
        name.setAttribute('font-size', nameFontSize);
        name.setAttribute('font-weight', 'bold');
        name.setAttribute('fill', color);
        name.textContent = person.name;
        group.appendChild(name);

        currentY += 10;

        // Role with word wrap
        if (currentY < maxY) {
            const wrappedRole = wrapText(person.role, maxTextWidth, roleFontSize);

            wrappedRole.forEach((line) => {
                if (currentY >= maxY) return;

                const role = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                role.setAttribute('x', x + 10);
                role.setAttribute('y', currentY);
                role.setAttribute('font-size', roleFontSize);
                role.setAttribute('fill', '#aaaaaa');
                role.textContent = line;
                group.appendChild(role);

                currentY += 8;
            });
        }

        // Gap between people
        currentY += 4;
    });

    return group;
}
function createTechnologiesBox(x, y, width, height, technologies, color) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Background box
    const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    box.setAttribute('x', x);
    box.setAttribute('y', y);
    box.setAttribute('width', width);
    box.setAttribute('height', height);
    box.setAttribute('rx', 6);
    box.setAttribute('fill', 'rgba(10, 10, 15, 0.85)');
    box.setAttribute('stroke', color);
    box.setAttribute('stroke-width', 2);
    group.appendChild(box);

    // Header
    const headerFontSize = 7; // ← ADJUST HEADER SIZE HERE
    const header = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    header.setAttribute('x', x + width / 2);
    header.setAttribute('y', y + 14);
    header.setAttribute('text-anchor', 'middle');
    header.setAttribute('font-size', headerFontSize);
    header.setAttribute('font-weight', 'bold');
    header.setAttribute('fill', color);
    header.textContent = 'TECHNOLOGIES';
    group.appendChild(header);

    // Divider line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x + 8);
    line.setAttribute('y1', y + 20);
    line.setAttribute('x2', x + width - 8);
    line.setAttribute('y2', y + 20);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', 1);
    line.setAttribute('opacity', 0.3);
    group.appendChild(line);

    // Items with word wrap
    const fontSize = 6; // ← ADJUST BODY TEXT SIZE HERE
    const lineHeight = 7; // ← ADJUST LINE SPACING HERE
    const maxTextWidth = width - 25;
    let currentY = y + 30;
    const maxY = y + height - 5;

    technologies.forEach((item) => {
        if (currentY >= maxY) return;

        const wrappedLines = wrapText(`• ${item}`, maxTextWidth, fontSize);

        wrappedLines.forEach((line) => {
            if (currentY >= maxY) return;

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x + 10);
            text.setAttribute('y', currentY);
            text.setAttribute('font-size', fontSize);
            text.setAttribute('fill', '#ffffff');
            text.textContent = line;
            group.appendChild(text);

            currentY += lineHeight;
        });

        currentY += 2;
    });

    return group;
}
function createExamplesBox(x, y, width, height, examples, color) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Background box
    const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    box.setAttribute('x', x);
    box.setAttribute('y', y);
    box.setAttribute('width', width);
    box.setAttribute('height', height);
    box.setAttribute('rx', 6);
    box.setAttribute('fill', 'rgba(10, 10, 15, 0.85)');
    box.setAttribute('stroke', color);
    box.setAttribute('stroke-width', 2);
    group.appendChild(box);

    // Header
    const headerFontSize = 7; // ← ADJUST HEADER SIZE HERE
    const header = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    header.setAttribute('x', x + width / 2);
    header.setAttribute('y', y + 14);
    header.setAttribute('text-anchor', 'middle');
    header.setAttribute('font-size', headerFontSize);
    header.setAttribute('font-weight', 'bold');
    header.setAttribute('fill', color);
    header.textContent = 'EXAMPLES';
    group.appendChild(header);

    // Divider line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x + 8);
    line.setAttribute('y1', y + 20);
    line.setAttribute('x2', x + width - 8);
    line.setAttribute('y2', y + 20);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', 1);
    line.setAttribute('opacity', 0.3);
    group.appendChild(line);

    // Example items with word wrap
    const nameFontSize = 6.5; // ← ADJUST NAME SIZE HERE
    const descFontSize = 6; // ← ADJUST DESCRIPTION SIZE HERE
    const nameLineHeight = 10; // ← ADJUST NAME LINE SPACING HERE
    const descLineHeight = 8; // ← ADJUST DESCRIPTION LINE SPACING HERE
    const maxTextWidth = width - 10; // Text area width (with padding)
    const cardPaddingTop = 8; // ← ADJUST PADDING INSIDE CARD (top)
    const cardPaddingBottom = 6; // ← ADJUST PADDING INSIDE CARD (bottom)
    const gapBetweenCards = 8; // ← ADJUST SPACE BETWEEN CARDS HERE

    let currentY = y + 30; // Start position for first card
    const maxY = y + height - 10; // Bottom boundary

    examples.forEach((example) => {
        // Check if we have minimum space for a card
        if (currentY >= maxY) return;

        // Wrap text to get actual line counts
        const wrappedName = wrapText(example.name, maxTextWidth, nameFontSize);
        const wrappedDesc = wrapText(example.description, maxTextWidth, descFontSize);

        // Calculate actual card height based on wrapped text
        const nameHeight = wrappedName.length * nameLineHeight;
        const descHeight = wrappedDesc.length * descLineHeight;
        const cardHeight = cardPaddingTop + nameHeight + descHeight + cardPaddingBottom;

        // Check if entire card fits
        if (currentY + cardHeight > maxY) return;

        // Now draw the card background with correct height
        const cardX = x + 8;
        const cardY = currentY;

        const exampleBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        exampleBg.setAttribute('x', cardX);
        exampleBg.setAttribute('y', cardY);
        exampleBg.setAttribute('width', width - 16);
        exampleBg.setAttribute('height', cardHeight);
        exampleBg.setAttribute('rx', 3); // ← ADJUST CARD CORNER ROUNDNESS HERE
        exampleBg.setAttribute('fill', color);
        exampleBg.setAttribute('fill-opacity', 0.1); // ← ADJUST CARD BACKGROUND OPACITY HERE
        exampleBg.setAttribute('stroke', color);
        exampleBg.setAttribute('stroke-width', 1); // ← ADJUST CARD BORDER THICKNESS HERE
        exampleBg.setAttribute('class', 'example-card');
        exampleBg.style.cursor = 'pointer';
        group.appendChild(exampleBg);

        // Add click handler if URL exists
        if (example.url) {
            // Create invisible clickable overlay
            const clickOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            clickOverlay.setAttribute('x', cardX);
            clickOverlay.setAttribute('y', cardY);
            clickOverlay.setAttribute('width', width - 16);
            clickOverlay.setAttribute('height', cardHeight);
            clickOverlay.setAttribute('fill', 'transparent');
            clickOverlay.setAttribute('cursor', 'pointer');
            clickOverlay.style.pointerEvents = 'all';

            // Hover effects
            clickOverlay.addEventListener('mouseenter', () => {
                exampleBg.setAttribute('fill-opacity', 0.3);
                exampleBg.setAttribute('stroke-width', 2);
            });

            clickOverlay.addEventListener('mouseleave', () => {
                exampleBg.setAttribute('fill-opacity', 0.1);
                exampleBg.setAttribute('stroke-width', 1);
            });

            // Click handler
            clickOverlay.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(example.url, '_blank', 'noopener,noreferrer');
                console.log(`🔗 Opening: ${example.name} -> ${example.url}`);
            });

            group.appendChild(clickOverlay);

            // Optional: Add link icon
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            icon.setAttribute('x', x + width - 20);
            icon.setAttribute('y', currentY + 10);
            icon.setAttribute('font-size', 8);
            icon.setAttribute('fill', color);
            icon.setAttribute('opacity', 0.6);
            icon.textContent = '🔗';
            icon.style.pointerEvents = 'none';
            group.appendChild(icon);
        }


        // Position for text inside card
        let textY = currentY + cardPaddingTop;

        // Render name lines (wrapped)
        wrappedName.forEach((line) => {
            const name = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            name.setAttribute('x', x + 12); // Left padding inside card
            name.setAttribute('y', textY);
            name.setAttribute('font-size', nameFontSize);
            name.setAttribute('font-weight', 'bold');
            name.setAttribute('fill', color);
            name.textContent = line;
            group.appendChild(name);
            textY += nameLineHeight;
        });

        // Render description lines (wrapped)
        wrappedDesc.forEach((line) => {
            const desc = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            desc.setAttribute('x', x + 12); // Left padding inside card
            desc.setAttribute('y', textY);
            desc.setAttribute('font-size', descFontSize);
            desc.setAttribute('fill', '#aaaaaa');
            desc.textContent = line;
            group.appendChild(desc);
            textY += descLineHeight;
        });

        // Move to next card position
        currentY += cardHeight + gapBetweenCards;
    });

    return group;
}

function hideContentRings() {
    const ringsGroup = document.getElementById('content-rings');
    if (ringsGroup) {
        ringsGroup.classList.remove('visible');
        ringsGroup.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('visible');
        });

        // Remove after fade out
        setTimeout(() => {
            if (ringsGroup.parentNode) {
                ringsGroup.remove();
            }
        }, 500);
    }
}

/* ============================================
   START
   ============================================ */

/* ============================================
   KEYBOARD SHORTCUTS
   ============================================ */

document.addEventListener('keydown', (e) => {
    // ESC - Already handled above for deselect/zoom out

    // LEFT/RIGHT ARROWS - Navigate timeline when zoomed
    if (isZoomed) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const newYear = Math.max(CONFIG.timeline.startYear, currentYear - 1);
            slider.value = newYear;
            slider.dispatchEvent(new Event('input'));
            console.log('⬅️ Timeline: Year', newYear);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            const newYear = Math.min(CONFIG.timeline.endYear, currentYear + 1);
            slider.value = newYear;
            slider.dispatchEvent(new Event('input'));
            console.log('➡️ Timeline: Year', newYear);
        }
    }

    // SPACEBAR - Zoom in/out
    if (e.key === ' ' && selectedNode && !isAnimating) {
        e.preventDefault();
        if (isZoomed) {
            zoomOut();
            deselectNode();
            console.log('␣ Spacebar: Zoomed out');
        } else {
            zoomToNode(selectedNode);
            console.log('␣ Spacebar: Zoomed in');
        }
    }

    // H - Show help
    if (e.key === 'h' || e.key === 'H' || e.key === '?') {
        toggleHelp();
    }

    // Numbers 1-6 - Quick select domains (when not zoomed)
    if (!isZoomed && !isAnimating) {
        const domainIndex = parseInt(e.key) - 1;
        if (domainIndex >= 0 && domainIndex < domainPositions.length) {
            const domain = domainPositions[domainIndex];
            selectNode(domain.id);
            zoomToNode(domain.id);
            console.log(`🔢 Key ${e.key}: Selected ${domain.name}`);
        }
    }
});

/* ============================================
   HELP OVERLAY
   ============================================ */

function toggleHelp() {
    const helpOverlay = document.getElementById('help-overlay');
    if (helpOverlay) {
        helpOverlay.classList.toggle('visible');
    }
}

// Show help on first load (optional)
window.addEventListener('load', () => {
    initTutorial();
    const hasSeenHelp = localStorage.getItem('cyberdelics-help-seen');
    if (!hasSeenHelp) {
        setTimeout(() => {
            toggleHelp();
            localStorage.setItem('cyberdelics-help-seen', 'true');
        }, 1000);
    }
});

/* ============================================
   LOADING STATES
   ============================================ */

function showLoading() {
    const loading = document.getElementById('loading-indicator');
    if (loading) {
        loading.classList.add('visible');
    }
}

function hideLoading() {
    const loading = document.getElementById('loading-indicator');
    if (loading) {
        loading.classList.remove('visible');
    }
}

/* ============================================
   PHASE 11: TUTORIAL SYSTEM
   ============================================ */

const tutorialState = {
    active: false,
    currentStep: 0,
    totalSteps: 3,
    completed: false,
    hintsShown: {
        timelineScrub: false,
        firstZoom: false,
        timelineWhileZoomed: false
    }
};

const tutorialSteps = [
    {
        id: 'welcome',
        title: 'Welcome to Cyberdelics',
        text: 'This visualization shows how 6 fields converged to create the cyberdelic discipline. Click Next to learn the basics.',
        target: null,
        position: 'center',
        spotlightShape: null,
        waitForAction: false
    },
    {
        id: 'domains',
        title: 'Explore the Domains',
        text: 'Click on any colored circle to zoom in and see detailed information about that field\'s contributions.',
        target: '.domain-node',
        position: 'center',
        spotlightShape: 'circle',
        waitForAction: false,
        highlightMultiple: true
    },
    {
        id: 'timeline',
        title: 'Travel Through Time',
        text: 'Use the timeline at the top to see how connections formed over the years. Try scrubbing it now!',
        target: '#timeline-container',
        position: 'bottom',
        spotlightShape: 'rect',
        waitForAction: false
    }
];

function initTutorial() {
    console.log('🎓 initTutorial called');

    // Check if tutorial has been completed
    const hasCompleted = localStorage.getItem('cyberdelics-tutorial-completed');

    // CRITICAL: Attach event listeners RIGHT NOW
    const nextBtn = document.getElementById('tutorial-next');
    const skipBtn = document.getElementById('tutorial-skip');

    console.log('🔘 Tutorial buttons:', { nextBtn: !!nextBtn, skipBtn: !!skipBtn });

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            console.log('✅ Next button clicked!');
            nextTutorialStep();
        });
        console.log('✅ Next button listener attached');
    } else {
        console.error('❌ Next button not found!');
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            console.log('✅ Skip button clicked!');
            skipTutorial();
        });
        console.log('✅ Skip button listener attached');
    } else {
        console.error('❌ Skip button not found!');
    }

    if (!hasCompleted) {
        // Wait 1 second after page load, then start
        setTimeout(() => {
            startTutorial();
        }, 1000);
    }

    // Load hint state
    const hintsData = localStorage.getItem('cyberdelics-hints-shown');
    if (hintsData) {
        try {
            tutorialState.hintsShown = JSON.parse(hintsData);
        } catch (e) {
            console.error('Error loading hints state:', e);
        }
    }
}

function startTutorial() {
    tutorialState.active = true;
    tutorialState.currentStep = 0;

    const overlay = document.getElementById('tutorial-overlay');
    overlay.classList.add('active');

    showTutorialStep(0);

    console.log('📚 Tutorial started');
}

function showTutorialStep(stepIndex) {
    const step = tutorialSteps[stepIndex];
    if (!step) return;

    tutorialState.currentStep = stepIndex;

    const tooltip = document.getElementById('tutorial-tooltip');
    const spotlight = document.getElementById('tutorial-spotlight');
    const progress = document.getElementById('tutorial-progress');
    const title = document.getElementById('tutorial-title');
    const text = document.getElementById('tutorial-text');
    const nextBtn = document.getElementById('tutorial-next');

    // Update progress
    progress.textContent = `STEP ${stepIndex + 1} OF ${tutorialState.totalSteps}`;

    // Update content
    title.textContent = step.title;
    text.textContent = step.text;

    // Update button text
    if (stepIndex === tutorialSteps.length - 1) {
        nextBtn.textContent = 'Start Exploring';
    } else {
        nextBtn.textContent = 'Next';
    }

    // Position spotlight and tooltip
    if (step.target) {
        const targetElements = document.querySelectorAll(step.target);

        if (targetElements.length > 0) {
            let bounds;

            if (step.highlightMultiple && targetElements.length > 1) {
                // Calculate bounding box around all elements
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

                targetElements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    minX = Math.min(minX, rect.left);
                    minY = Math.min(minY, rect.top);
                    maxX = Math.max(maxX, rect.right);
                    maxY = Math.max(maxY, rect.bottom);
                });

                bounds = {
                    left: minX,
                    top: minY,
                    width: maxX - minX,
                    height: maxY - minY,
                    right: maxX,
                    bottom: maxY
                };
            } else {
                bounds = targetElements[0].getBoundingClientRect();
            }

            // Position spotlight
            const padding = 20;
            spotlight.style.left = `${bounds.left - padding}px`;
            spotlight.style.top = `${bounds.top - padding}px`;
            spotlight.style.width = `${bounds.width + padding * 2}px`;
            spotlight.style.height = `${bounds.height + padding * 2}px`;

            if (step.spotlightShape === 'rect') {
                spotlight.classList.add('rect');
            } else {
                spotlight.classList.remove('rect');
            }

            spotlight.style.opacity = '1';

            // Position tooltip
            positionTooltip(tooltip, bounds, step.position);
        }
    } else {
        // Center position, no spotlight
        spotlight.style.opacity = '0';
        tooltip.style.left = '50%';
        tooltip.style.top = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
    }

    console.log(`📚 Tutorial step ${stepIndex + 1}: ${step.title}`);
}

function positionTooltip(tooltip, targetBounds, position) {
    const tooltipWidth = 400;
    const tooltipHeight = 200; // approximate
    const gap = 30;

    let left, top, transform;

    switch (position) {
        case 'bottom':
            left = targetBounds.left + targetBounds.width / 2;
            top = targetBounds.bottom + gap;
            transform = 'translateX(-50%)';
            break;

        case 'top':
            left = targetBounds.left + targetBounds.width / 2;
            top = targetBounds.top - gap;
            transform = 'translate(-50%, -100%)';
            break;

        case 'right':
            left = targetBounds.right + gap;
            top = targetBounds.top + targetBounds.height / 2;
            transform = 'translateY(-50%)';
            break;

        case 'left':
            left = targetBounds.left - gap;
            top = targetBounds.top + targetBounds.height / 2;
            transform = 'translate(-100%, -50%)';
            break;

        case 'center':
        default:
            left = window.innerWidth / 2;
            top = window.innerHeight / 2;
            transform = 'translate(-50%, -50%)';
            break;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.transform = transform;
}

function nextTutorialStep() {
    if (tutorialState.currentStep < tutorialSteps.length - 1) {
        showTutorialStep(tutorialState.currentStep + 1);
    } else {
        completeTutorial();
    }
}

function skipTutorial() {
    // Show confirmation
    if (confirm('Skip the tutorial? You can access help anytime by pressing H.')) {
        completeTutorial();
    }
}

function completeTutorial() {
    const overlay = document.getElementById('tutorial-overlay');
    overlay.classList.remove('active');

    tutorialState.active = false;
    tutorialState.completed = true;

    localStorage.setItem('cyberdelics-tutorial-completed', 'true');

    console.log('✅ Tutorial completed');
}

// Event listeners for tutorial
document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('tutorial-next');
    const skipBtn = document.getElementById('tutorial-skip');

    if (nextBtn) {
        nextBtn.addEventListener('click', nextTutorialStep);
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', skipTutorial);
    }
});

/* ============================================
   CONTEXTUAL HINTS SYSTEM
   ============================================ */

function showHint(hintId, text, duration = 5000) {
    // Check if this hint has been shown before
    if (tutorialState.hintsShown[hintId]) {
        return;
    }

    const hint = document.getElementById('contextual-hint');
    const hintText = document.getElementById('hint-text');

    if (!hint || !hintText) return;

    hintText.textContent = text;
    hint.classList.add('visible');

    // Mark as shown
    tutorialState.hintsShown[hintId] = true;
    localStorage.setItem('cyberdelics-hints-shown', JSON.stringify(tutorialState.hintsShown));

    // Auto-hide after duration
    if (duration > 0) {
        setTimeout(() => {
            hideHint();
        }, duration);
    }

    console.log(`💡 Hint shown: ${hintId}`);
}

function hideHint() {
    const hint = document.getElementById('contextual-hint');
    if (hint) {
        hint.classList.remove('visible');
    }
}

// Hint close button
document.addEventListener('DOMContentLoaded', () => {
    const hintClose = document.getElementById('hint-close');
    if (hintClose) {
        hintClose.addEventListener('click', hideHint);
    }
});

/* ============================================
   TRIGGER CONTEXTUAL HINTS
   ============================================ */

// Hint 1: First timeline scrub
let hasScrubbedTimeline = false;
function checkTimelineScrubHint() {
    if (!hasScrubbedTimeline && !tutorialState.active) {
        hasScrubbedTimeline = true;
        showHint('timelineScrub', 'Great! Watch how connections appear over time. Try clicking a domain node to explore deeper.', 6000);
    }
}

// Hint 2: First zoom
function checkFirstZoomHint() {
    if (!tutorialState.active && !isZoomed) {
        showHint('firstZoom', 'Perfect! Now try scrubbing the timeline to see how this domain evolved over the years.', 6000);
    }
}

// Hint 3: Timeline while zoomed
let hasScrubbedWhileZoomed = false;
function checkTimelineWhileZoomedHint() {
    if (!hasScrubbedWhileZoomed && isZoomed && !tutorialState.active) {
        hasScrubbedWhileZoomed = true;
        showHint('timelineWhileZoomed', 'Notice how the content changes! Press ESC to explore other domains, or H for keyboard shortcuts.', 7000);
    }
}

/* ============================================
   RESET TUTORIAL
   ============================================ */

function resetTutorial() {
    if (confirm('Reset tutorial and hints?\n\nThis will restart the tutorial on next page load.')) {
        console.log('🔄 Resetting tutorial...');

        // Clear tutorial completion
        localStorage.removeItem('cyberdelics-tutorial-completed');

        // Clear hints state
        localStorage.removeItem('cyberdelics-hints-shown');

        // Clear help seen state
        localStorage.removeItem('cyberdelics-help-seen');

        console.log('✅ Tutorial reset complete');

        // Ask if they want to reload now
        if (confirm('Tutorial reset! Reload page now to see tutorial?')) {
            location.reload();
        }
    }
}

// Attach to reset button
document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset-tutorial-button');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetTutorial);
    }
});

init();
updateVisualizationWithParticles(currentYear);