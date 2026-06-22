import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

// --- HARDCODED CONFIG ---
const GITHUB_USER = "Tee-Rez"
const GITHUB_REPO = "Cyberdelics-101-Web-Structure"
const PLAYER_URL =
    "https://tee-rez.github.io/Cyberdelics-101-Web-Structure/Modules/universal-player.html"

// Map short IDs to their actual GitHub folder paths
const LESSON_MAP: Record<string, string> = {
    "MiniLesson 1 1.2 Scenario": "Modules/Module_1_DefiningCyberdelics/Lesson_1_CoreDefinitions&Components/Manifests/MiniLesson_1_1.2_Scenario.json",
    "MiniLesson 1 1.5 Overview": "Modules/Module_1_DefiningCyberdelics/Lesson_1_CoreDefinitions&Components/Manifests/MiniLesson_1_1.5_Overview.json",
    "MiniLesson 1 2.1 Scenario": "Modules/Module_1_DefiningCyberdelics/Lesson_2_PsychedelicsVsCyberdelics/Manifests/MiniLesson_1_2.1_Scenario.json",
    "MiniLesson 1 2.3 Overview": "Modules/Module_1_DefiningCyberdelics/Lesson_2_PsychedelicsVsCyberdelics/Manifests/MiniLesson_1_2.3_Overview.json",
    "MiniLesson 1 3.1 Scenario": "Modules/Module_1_DefiningCyberdelics/Lesson_3_VRvsCyberdelics/Manifests/MiniLesson_1_3.1_Scenario.json",
    "MiniLesson 1 3.3 Simulation": "Modules/Module_1_DefiningCyberdelics/Lesson_3_VRvsCyberdelics/Manifests/MiniLesson_1_3.3_Simulation.json",
    "MiniLesson 1 3.4 Overview": "Modules/Module_1_DefiningCyberdelics/Lesson_3_VRvsCyberdelics/Manifests/MiniLesson_1_3.4_Overview.json",
    "MiniLesson 1 4.1 Scenario": "Modules/Module_1_DefiningCyberdelics/Lesson_4_MeditationVsCyberdelics/Manifests/MiniLesson_1_4.1_Scenario.json",
    "MiniLesson 1 4.3 Overview": "Modules/Module_1_DefiningCyberdelics/Lesson_4_MeditationVsCyberdelics/Manifests/MiniLesson_1_4.3_Overview.json",
    "MiniLesson 2 1.1 Scenario": "Modules/Module_2_Historical_Foundations/Lesson_1_TheVisionaries/Manifests/MiniLesson_2_1.1_Scenario.json",
    "MiniLesson 2 1.3 Overview": "Modules/Module_2_Historical_Foundations/Lesson_1_TheVisionaries/Manifests/MiniLesson_2_1.3_Overview.json",
    "MiniLesson 2 2.1 Scenario": "Modules/Module_2_Historical_Foundations/Lesson_2_TheGapYears/Manifests/MiniLesson_2_2.1_Scenario.json",
    "MiniLesson 2 2.2 Overview": "Modules/Module_2_Historical_Foundations/Lesson_2_TheGapYears/Manifests/MiniLesson_2_2.2_Overview.json",
    "MiniLesson 2 3.1 Scenario": "Modules/Module_2_Historical_Foundations/Lesson_3_TheRenaissance/Manifests/MiniLesson_2_3.1_Scenario.json",
    "MiniLesson 2 3.2 Overview": "Modules/Module_2_Historical_Foundations/Lesson_3_TheRenaissance/Manifests/MiniLesson_2_3.2_Overview.json",
    "MiniLesson 2 4.4 Overview": "Modules/Module_2_Historical_Foundations/Lesson_4_ConvergenceAndValidation/Manifests/MiniLesson_2_4.4_Overview.json",
    "MiniLesson 2 4.4 Simulation": "Modules/Module_2_Historical_Foundations/Lesson_4_ConvergenceAndValidation/Manifests/MiniLesson_2_4.4_Simulation.json",
    "MiniLesson 3 1.2 Scenario": "Modules/Module_3_ScientificUnderstanding/Lesson_1_TheoriesOfConsciousness/Manifests/MiniLesson_3_1.2_Scenario.json",
    "MiniLesson 3 1.3 Overview": "Modules/Module_3_ScientificUnderstanding/Lesson_1_TheoriesOfConsciousness/Manifests/MiniLesson_3_1.3_Overview.json",
    "MiniLesson 3 2.3 Simulation": "Modules/Module_3_ScientificUnderstanding/Lesson_2_ScienceOfPresence/Manifests/MiniLesson_3_2.3_Simulation.json",
    "MiniLesson 3 2.4 Overview": "Modules/Module_3_ScientificUnderstanding/Lesson_2_ScienceOfPresence/Manifests/MiniLesson_3_2.4_Overview.json",
    "MiniLesson 3 3.3 Scenario": "Modules/Module_3_ScientificUnderstanding/Lesson_3_MechanismsOfAction/Manifests/MiniLesson_3_3.3_Scenario.json",
    "MiniLesson 3 3.4 Overview": "Modules/Module_3_ScientificUnderstanding/Lesson_3_MechanismsOfAction/Manifests/MiniLesson_3_3.4_Overview.json",
    "MiniLesson 3 4.4 Overview": "Modules/Module_3_ScientificUnderstanding/Lesson_4_ResearchEvidence/Manifests/MiniLesson_3_4.4_Overview.json",
    "MiniLesson 3 5.4 Overview": "Modules/Module_3_ScientificUnderstanding/Lesson_5_IntegrationAndApplication/Manifests/MiniLesson_3_5.4_Overview.json",
    "MiniLesson 4 1.3 Scenario": "Modules/Module_4_TheLandscape/Lesson_1_PurposeBuiltPlatforms/Manifests/MiniLesson_4_1.3_Scenario.json",
    "MiniLesson 4 1.4 Overview": "Modules/Module_4_TheLandscape/Lesson_1_PurposeBuiltPlatforms/Manifests/MiniLesson_4_1.4_Overview.json",
    "MiniLesson 4 2.5 Simulation": "Modules/Module_4_TheLandscape/Lesson_2_ClinicalApplicationsAndBiofeedback/Manifests/MiniLesson_4_2.5_Simulation.json",
    "MiniLesson 4 2.6 Overview": "Modules/Module_4_TheLandscape/Lesson_2_ClinicalApplicationsAndBiofeedback/Manifests/MiniLesson_4_2.6_Overview.json",
    "MiniLesson 4 3.4 Scenario": "Modules/Module_4_TheLandscape/Lesson_3_SocialVRAndTheCreatorEcosystem/Manifests/MiniLesson_4_3.4_Scenario.json",
    "MiniLesson 4 3.5 Overview": "Modules/Module_4_TheLandscape/Lesson_3_SocialVRAndTheCreatorEcosystem/Manifests/MiniLesson_4_3.5_Overview.json",
    "MiniLesson_4_4.5_Overview": "Modules/Module_4_TheLandscape/Lesson_4_SpecializedApplicationsAndHardware/Manifests/MiniLesson_4_4.5_Overview.json",
    "MiniLesson 4 5.1 Scenario": "Modules/Module_4_TheLandscape/Lesson_5_PlatformSelectionFrameworkAndModuleSummary/Manifests/MiniLesson_4_5.1_Scenario.json",
    "MiniLesson 4 5.3 Overview": "Modules/Module_4_TheLandscape/Lesson_5_PlatformSelectionFrameworkAndModuleSummary/Manifests/MiniLesson_4_5.3_Overview.json",
    "MiniLesson 5 1.2 Simulation": "Modules/Module_5_TheCyberdelicEcosystem/Lesson_1_EcosystemConceptAndTechnologyProviders/Manifests/MiniLesson_5_1.2_Simulation.json",
    "MiniLesson 5 1.4 Scenario": "Modules/Module_5_TheCyberdelicEcosystem/Lesson_1_EcosystemConceptAndTechnologyProviders/Manifests/MiniLesson_5_1.4_Scenario.json",
    "MiniLesson 5 1.6 Overview": "Modules/Module_5_TheCyberdelicEcosystem/Lesson_1_EcosystemConceptAndTechnologyProviders/Manifests/MiniLesson_5_1.6_Overview.json",
    "MiniLesson 5 2.3 Scenario": "Modules/Module_5_TheCyberdelicEcosystem/Lesson_2_KnowledgeProducersAndHumanInfrastructure/Manifests/MiniLesson_5_2.3_Scenario.json",
    "MiniLesson 5 2.5 Overview": "Modules/Module_5_TheCyberdelicEcosystem/Lesson_2_KnowledgeProducersAndHumanInfrastructure/Manifests/MiniLesson_5_2.5_Overview.json",
    "MiniLesson 5 3.4 Overview": "Modules/Module_5_TheCyberdelicEcosystem/Lesson_3_EconomicInfrastructureAndRegulatoryLandscape/Manifests/MiniLesson_5_3.4_Overview.json",
    "MiniLesson 5 4.2 Scenario": "Modules/Module_5_TheCyberdelicEcosystem/Lesson_4_EcosystemChallengesAndOpportunities/Manifests/MiniLesson_5_4.2_Scenario.json",
    "MiniLesson 5 4.4 Overview": "Modules/Module_5_TheCyberdelicEcosystem/Lesson_4_EcosystemChallengesAndOpportunities/Manifests/MiniLesson_5_4.4_Overview.json",
    "MiniLesson 5 5.1 Scenario": "Modules/Module_5_TheCyberdelicEcosystem/Lesson_5_YourRoleInTheEcosystem/Manifests/MiniLesson_5_5.1_Scenario.json",
    "MiniLesson 5 5.2 Overview": "Modules/Module_5_TheCyberdelicEcosystem/Lesson_5_YourRoleInTheEcosystem/Manifests/MiniLesson_5_5.2_Overview.json"
}
// ------------------------

interface Props {
    sourceType: "GitHub" | "Paste"
    lessonId: string
    jsonContent: string
    width: number
    height: number
    showDescription: boolean
    descriptionText: string
    descriptionStyle: "minimal" | "standard" | "featured"
}

export default function CyberdelicsMiniLesson(props: Props) {
    const [iframeSrc, setIframeSrc] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const iframeRef = React.useRef<HTMLIFrameElement>(null)

    // Set Player URL
    React.useEffect(() => {
        setIframeSrc(PLAYER_URL)
    }, [])

    // LISTENER: Fetch & Inject Manifest
    React.useEffect(() => {
        const handleMessage = async (event: MessageEvent) => {
            if (event.data && event.data.type === "PLAYER_READY") {
                console.log("[Framer] Player Ready. Mode:", props.sourceType)
                let manifestData = null

                // MODE 1: PASTE JSON directly
                if (props.sourceType === "Paste") {
                    try {
                        manifestData = JSON.parse(props.jsonContent)
                    } catch (e) {
                        console.error("Invalid JSON Paste", e)
                    }
                }
                // MODE 2: FETCH FROM GITHUB (Default)
                else {
                    const cleanId = props.lessonId.trim()
                    const mappedPath = LESSON_MAP[cleanId]

                    if (mappedPath) {
                        const manifestUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${mappedPath}`
                        try {
                            console.log("Fetching:", manifestUrl)
                            const response = await fetch(manifestUrl)
                            if (!response.ok)
                                throw new Error(
                                    `Manifest not found at: ${manifestUrl}`
                                )
                            manifestData = await response.json()
                        } catch (e) {
                            console.error("Failed to load mini-lesson:", e)
                        }
                    } else {
                        console.error(
                            `Lesson ID '${cleanId}' not found in LESSON_MAP. Please ensure you are using IDs like 'MiniLesson 1 1.2 Scenario'.`
                        )
                    }
                }

                // INJECT IF DATA EXISTS
                if (
                    manifestData &&
                    iframeRef.current &&
                    iframeRef.current.contentWindow
                ) {
                    iframeRef.current.contentWindow.postMessage(
                        {
                            type: "LOAD_MANIFEST",
                            manifest: manifestData,
                        },
                        "*"
                    )
                }
            }
        }

        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [props.lessonId, props.jsonContent, props.sourceType])

    // --- RESPONSIVE LOGIC ---
    const getDeviceConfig = (width: number) => {
        if (width >= 1400) {
            return {
                type: "desktop",
                descPadding: "24px",
                descFontSize: "16px",
                containerPadding: "0px",
                minIframeHeight: "1200px", // Ensures title always visible
            }
        } else if (width >= 690) {
            return {
                type: "tablet",
                descPadding: "20px",
                descFontSize: "15px",
                containerPadding: "0px",
                minIframeHeight: "500px",
            }
        } else {
            return {
                type: "phone",
                descPadding: "16px",
                descFontSize: "14px",
                containerPadding: "0px",
                minIframeHeight: "400px",
            }
        }
    }

    const device = getDeviceConfig(props.width)

    // DESCRIPTION STYLES
    const getDescriptionStyles = () => {
        const baseStyles = {
            width: "100%",
            padding: device.descPadding,
            marginBottom: device.type === "phone" ? "12px" : "16px",
            borderRadius: "8px",
            fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: device.descFontSize,
            lineHeight: "1.6",
            boxSizing: "border-box" as const,
            flexShrink: 0,
        }

        switch (props.descriptionStyle) {
            case "minimal":
                return {
                    ...baseStyles,
                    background: "transparent",
                    padding: `${device.type === "phone" ? "12px" : "16px"} 0`,
                    color: "#e0e0e0",
                    borderLeft: "3px solid #00d9ff",
                    paddingLeft: "16px",
                }
            case "featured":
                return {
                    ...baseStyles,
                    background:
                        "linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)",
                    border: "1px solid rgba(0, 217, 255, 0.3)",
                    color: "#ffffff",
                    boxShadow: "0 4px 20px rgba(0, 217, 255, 0.15)",
                }
            default: // "standard"
                return {
                    ...baseStyles,
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#e0e0e0",
                }
        }
    }

    return (
        <div
            style={{
                width: props.width || "100%",
                height: props.height || "100%",
                display: "flex",
                flexDirection: "column",
                background: "#000",
                position: "relative",
                padding: device.containerPadding,
                boxSizing: "border-box",
            }}
        >
            {/* DESCRIPTION SECTION */}
            {props.showDescription && props.descriptionText && (
                <div style={getDescriptionStyles()}>
                    {props.descriptionText}
                </div>
            )}

            {/* LESSON PLAYER */}
            <div
                style={{
                    flex: 1,
                    width: "100%",
                    height: "100%", // ADD THIS LINE: Forces it to stretch entirely
                    minHeight: props.showDescription
                        ? device.minIframeHeight
                        : "100%", // UPDATE THIS LINE
                    background: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {isLoading && (
                    <div
                        style={{
                            color: "#00d9ff",
                            fontFamily: "monospace",
                            position: "absolute",
                            zIndex: 10,
                        }}
                    >
                        Loading...
                    </div>
                )}
                <iframe
                    ref={iframeRef}
                    src={iframeSrc}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        display: "block",
                    }}
                    onLoad={() => setIsLoading(false)}
                    allowFullScreen
                    allow="fullscreen"
                />
            </div>
        </div>
    )
}

addPropertyControls(CyberdelicsMiniLesson, {
    sourceType: {
        type: ControlType.SegmentedEnum,
        title: "Source",
        options: ["GitHub", "Paste"],
        defaultValue: "GitHub",
    },
    lessonId: {
        type: ControlType.String,
        title: "Mini-Lesson ID",
        placeholder: "e.g. MiniLesson 1 1.2 Scenario",
        hidden: (props) => props.sourceType === "Paste",
        description: "ID derived from LESSON_MAP (e.g. 'MiniLesson 1 1.2 Scenario')",
    },
    jsonContent: {
        type: ControlType.String,
        title: "JSON Paste",
        displayTextArea: true,
        hidden: (props) => props.sourceType === "GitHub",
        defaultValue: "{}",
    },
    showDescription: {
        type: ControlType.Boolean,
        title: "Show Description",
        defaultValue: true,
    },
    descriptionText: {
        type: ControlType.String,
        title: "Description",
        displayTextArea: true,
        placeholder:
            "Explain what this mini-lesson teaches and why it matters...",
        defaultValue: "This mini-lesson will guide you through...",
        hidden: (props) => !props.showDescription,
    },
    descriptionStyle: {
        type: ControlType.SegmentedEnum,
        title: "Style",
        options: ["minimal", "standard", "featured"],
        defaultValue: "standard",
        hidden: (props) => !props.showDescription,
    },
})

CyberdelicsMiniLesson.defaultProps = {
    width: "100%",
    height: "100%",
    showDescription: true,
    descriptionText: "This mini-lesson will guide you through key concepts...",
    descriptionStyle: "standard",
}
