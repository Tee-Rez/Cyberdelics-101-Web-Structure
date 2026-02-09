import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

// --- HARDCODED CONFIG ---
const GITHUB_USER = "Tee-Rez"
const GITHUB_REPO = "Cyberdelics-101-Web-Structure"
const FOLDER_PATH = "manifests"
const PLAYER_URL =
    "https://tee-rez.github.io/Cyberdelics-101-Web-Structure/Modules/universal-player.html"
// ------------------------

interface Props {
    sourceType: "GitHub" | "Paste"
    lessonId: string
    jsonContent: string
    width: number
    height: number
    // NEW PROPERTIES
    showDescription: boolean
    descriptionText: string
    descriptionStyle: "minimal" | "standard" | "featured"
}

export default function CyberdelicsLesson(props: Props) {
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
                    let cleanId = props.lessonId.trim()
                    cleanId = cleanId.replace(/\.json$/, "")
                    cleanId = cleanId.replace(/^manifests\//, "")

                    if (cleanId) {
                        const manifestUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${FOLDER_PATH}/${cleanId}.json`
                        try {
                            console.log("Fetching:", manifestUrl)
                            const response = await fetch(manifestUrl)
                            if (!response.ok)
                                throw new Error(
                                    `Manifest not found at: ${manifestUrl}`
                                )
                            manifestData = await response.json()
                        } catch (e) {
                            console.error("Failed to load lesson:", e)
                        }
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
    // Desktop: >= 1400
    // Tablet: 690 - 1399
    // Phone: < 690
    const getDeviceConfig = (width: number) => {
        if (width >= 1400) {
            return {
                type: "desktop",
                descPadding: "24px",
                descFontSize: "16px",
                containerPadding: "0px",
            }
        } else if (width >= 690) {
            return {
                type: "tablet",
                descPadding: "20px",
                descFontSize: "15px",
                containerPadding: "0px",
            }
        } else {
            return {
                type: "phone",
                descPadding: "16px",
                descFontSize: "14px",
                containerPadding: "0px",
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
            flexShrink: 0, // Prevents description from shrinking
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
                boxSizing: "border-box", // Ensure padding doesn't overflow
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
                    minHeight: 0, // Critical for flexbox children
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

addPropertyControls(CyberdelicsLesson, {
    sourceType: {
        type: ControlType.SegmentedEnum,
        title: "Source",
        options: ["GitHub", "Paste"],
        defaultValue: "GitHub",
    },
    lessonId: {
        type: ControlType.String,
        title: "Lesson ID",
        placeholder: "e.g. intro",
        hidden: (props) => props.sourceType === "Paste",
        description: "ID from Builder (Auto-fetches from GitHub)",
    },
    jsonContent: {
        type: ControlType.String,
        title: "JSON Paste",
        displayTextArea: true,
        hidden: (props) => props.sourceType === "GitHub",
        defaultValue: "{}",
    },
    // NEW CONTROLS
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
});

CyberdelicsLesson.defaultProps = {
    width: 775,
    height: 900,
    showDescription: true,
    descriptionText: "This mini-lesson will guide you through key concepts...",
    descriptionStyle: "standard",
};
