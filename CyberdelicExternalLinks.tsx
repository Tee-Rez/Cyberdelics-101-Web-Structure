import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

// --- HARDCODED CONFIG ---
const VIEWER_URL =
    "https://tee-rez.github.io/Cyberdelics-101-Web-Structure/Modules/external-links-viewer.html"
// --- DIRECTORY MAPPING ---
type LessonMap = { [key: string]: string };
type ModuleMap = { folder: string, lessons: LessonMap };

const FOLDER_MAP: { [key: string]: ModuleMap } = {
    "1": {
        folder: "Module_1_DefiningCyberdelics",
        lessons: {
            "1": "Lesson_1_CoreDefinitions&Components",
            "2": "Lesson_2_PsychedelicsVsCyberdelics",
            "3": "Lesson_3_VRvsCyberdelics",
            "4": "Lesson_4_MeditationVsCyberdelics"
        }
    },
    "2": {
        folder: "Module_2_Historical_Foundations",
        lessons: {
            "1": "Lesson_1_TheVisionaries",
            "2": "Lesson_2_TheGapYears",
            "3": "Lesson_3_TheRenaissance",
            "4": "Lesson_4_ConvergenceAndValidation"
        }
    },
    "3": {
        folder: "Module_3_ScientificUnderstanding",
        lessons: {
            "1": "Lesson_1_TheoriesOfConsciousness",
            "2": "Lesson_2_ScienceOfPresence",
            "3": "Lesson_3_MechanismsOfAction",
            "4": "Lesson_4_ResearchEvidence",
            "5": "Lesson_5_IntegrationAndApplication"
        }
    },
    "4": {
        folder: "Module_4_TheLandscape",
        lessons: {
            "1": "Lesson_1_PurposeBuiltPlatforms",
            "2": "Lesson_2_ClinicalApplicationsAndBiofeedback",
            "3": "Lesson_3_SocialVRAndTheCreatorEcosystem",
            "4": "Lesson_4_SpecializedApplicationsAndHardware",
            "5": "Lesson_5_PlatformSelectionFrameworkAndModuleSummary"
        }
    },
    "5": {
        folder: "Module_5_TheCyberdelicEcosystem",
        lessons: {
            "1": "Lesson_1_EcosystemConceptAndTechnologyProviders",
            "2": "Lesson_2_KnowledgeProducersAndHumanInfrastructure",
            "3": "Lesson_3_EconomicInfrastructureAndRegulatoryLandscape",
            "4": "Lesson_4_EcosystemChallengesAndOpportunities",
            "5": "Lesson_5_YourRoleInTheEcosystem"
        }
    }
};
// -------------------------

interface Props {
    moduleFolder: string
    lessonFolder: string
    customPathToggle: boolean
    customMarkdownPath: string
    width: number
    height: number
    showDescription: boolean
}

export default function CyberdelicExternalLinks(props: Props) {
    const [iframeSrc, setIframeSrc] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const iframeRef = React.useRef<HTMLIFrameElement>(null)

    // Set Viewer URL based on props
    React.useEffect(() => {
        let path = ""

        if (props.customPathToggle && props.customMarkdownPath) {
            path = props.customMarkdownPath.trim()
        } else {
            // Construct standard path based on module and lesson lookup map
            const modNum = props.moduleFolder.trim()
            const lesNum = props.lessonFolder.trim()
            
            const moduleData = FOLDER_MAP[modNum]
            if (moduleData && moduleData.lessons[lesNum]) {
                const moduleF = moduleData.folder
                const lessonF = moduleData.lessons[lesNum]
                path = `Modules/${moduleF}/${lessonF}/External-Links.md`
            } else {
                path = `Modules/${modNum}/${lesNum}/External-Links.md` // Fallback
            }
        }

        const finalUrl = `${VIEWER_URL}?source=${encodeURIComponent(path)}`
        console.log("[External Links] Loading URL:", finalUrl)
        setIframeSrc(finalUrl)
    }, [props.moduleFolder, props.lessonFolder, props.customPathToggle, props.customMarkdownPath])

    // --- RESPONSIVE LOGIC (matching Lesson Player) ---
    const getDeviceConfig = (width: number) => {
        if (width >= 1400) {
            return {
                type: "desktop",
                descPadding: "24px",
                descFontSize: "16px",
                containerPadding: "0px",
                minIframeHeight: "600px",
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
            {/* INLINE HEADER DESCRIPTION */}
            {props.showDescription && (
                <div
                    style={{
                        width: "100%",
                        padding: `${device.type === "phone" ? "12px" : "16px"} 0`,
                        marginBottom: device.type === "phone" ? "12px" : "16px",
                        borderRadius: "8px",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                        fontSize: device.descFontSize,
                        lineHeight: "1.6",
                        boxSizing: "border-box",
                        flexShrink: 0,
                        background: "transparent",
                        color: "#e0e0e0",
                        borderLeft: "3px solid #00d9ff",
                        paddingLeft: "16px",
                    }}
                >
                    Review these resources to explore the topic deeper.
                </div>
            )}

            {/* VIEWER PLAYER */}
            <div
                style={{
                    flex: 1,
                    width: "100%",
                    minHeight: device.minIframeHeight,
                    background: "#0d0f12",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.05)"
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
                        Initializing Neural Link...
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

addPropertyControls(CyberdelicExternalLinks, {
    moduleFolder: {
        type: ControlType.String,
        title: "Module",
        placeholder: "e.g. 1",
        defaultValue: "1",
        hidden: (props: Props) => props.customPathToggle,
    },
    lessonFolder: {
        type: ControlType.String,
        title: "Lesson",
        placeholder: "e.g. 1",
        defaultValue: "1",
        hidden: (props: Props) => props.customPathToggle,
    },
    customPathToggle: {
        type: ControlType.Boolean,
        title: "Use Custom Path",
        defaultValue: false,
    },
    customMarkdownPath: {
        type: ControlType.String,
        title: "Custom Path",
        placeholder: "e.g. Modules/Module_1/.../External-Links.md",
        defaultValue: "",
        hidden: (props) => !props.customPathToggle,
    },
    showDescription: {
        type: ControlType.Boolean,
        title: "Show Label",
        defaultValue: false,
    },
})

CyberdelicExternalLinks.defaultProps = {
    width: "100%",
    height: "auto",
    showDescription: false,
    customPathToggle: false,
}
