import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

// --- HARDCODED CONFIG ---
const VIEWER_URL =
    "https://tee-rez.github.io/Cyberdelics-101-Web-Structure/Modules/external-links-viewer.html"
// ------------------------

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
            // Construct standard path based on module and lesson
            const moduleF = props.moduleFolder.trim()
            const lessonF = props.lessonFolder.trim()
            path = `Modules/${moduleF}/${lessonF}/External-Links.md`
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
        title: "Module Folder",
        placeholder: "e.g. Module_1_DefiningCyberdelics",
        defaultValue: "Module_1_DefiningCyberdelics",
        hidden: (props) => props.customPathToggle,
    },
    lessonFolder: {
        type: ControlType.String,
        title: "Lesson Folder",
        placeholder: "e.g. Lesson_1_CoreDefinitions&Components",
        defaultValue: "Lesson_1_CoreDefinitions&Components",
        hidden: (props) => props.customPathToggle,
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
