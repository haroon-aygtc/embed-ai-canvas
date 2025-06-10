// Widget appearance constants
export const COLOR_PRESETS = [
    {
        name: "Professional Blue",
        value: "#3b82f6",
        description: "Trustworthy and professional",
    },
    {
        name: "Success Green",
        value: "#10b981",
        description: "Growth and success focused",
    },
    {
        name: "Creative Purple",
        value: "#8b5cf6",
        description: "Creative and innovative",
    },
    {
        name: "Energetic Orange",
        value: "#f59e0b",
        description: "Energetic and friendly",
    },
    {
        name: "Bold Red",
        value: "#ef4444",
        description: "Urgent and attention-grabbing",
    },
    {
        name: "Elegant Pink",
        value: "#ec4899",
        description: "Modern and approachable",
    },
] as const;

// Widget position options for select components
export const POSITION_OPTIONS = [
    { value: "bottom-right", label: "↘️ Bottom Right" },
    { value: "bottom-left", label: "↙️ Bottom Left" },
    { value: "top-right", label: "↗️ Top Right" },
    { value: "top-left", label: "↖️ Top Left" },
] as const;

// Widget position options for preview component with CSS classes
export const PREVIEW_POSITION_OPTIONS = [
    { id: 'top-left', label: 'Top Left', classes: 'top-6 left-6' },
    { id: 'top-right', label: 'Top Right', classes: 'top-6 right-6' },
    { id: 'bottom-left', label: 'Bottom Left', classes: 'bottom-6 left-6' },
    { id: 'bottom-right', label: 'Bottom Right', classes: 'bottom-6 right-6' },
] as const;

// Widget trigger types for conversation starters
export const TRIGGER_TYPES = [
    { id: "immediate", label: "Immediate", icon: "⚡" },
    { id: "time_delay", label: "Time Delay", icon: "⏱️" },
    { id: "scroll", label: "Scroll Trigger", icon: "📜" },
    { id: "exit_intent", label: "Exit Intent", icon: "🚪" },
] as const;

// Auto-open trigger options
export const AUTO_OPEN_TRIGGERS = [
    {
        id: "immediate_trigger",
        label: "Immediate",
        description: "Open widget as soon as page loads",
        icon: "⚡",
    },
    {
        id: "time_delay_trigger",
        label: "Time Delay",
        description: "Open after visitor spends time on page",
        icon: "⏱️",
    },
    {
        id: "scroll_trigger",
        label: "Scroll Trigger",
        description: "Open when visitor scrolls down the page",
        icon: "📜",
    },
    {
        id: "exit_intent_trigger",
        label: "Exit Intent",
        description: "Open when visitor is about to leave",
        icon: "🚪",
    },
] as const;

// Safety features for AI model configuration
export const SAFETY_FEATURES = [
    {
        id: "profanity",
        title: "Profanity Filter",
        description: "Block inappropriate language and offensive content",
        enabled: true,
    },
    {
        id: "spam",
        title: "Spam Detection",
        description: "Detect and prevent spam messages automatically",
        enabled: true,
    },
    {
        id: "pii",
        title: "PII Protection",
        description: "Protect personal identifiable information",
        enabled: true,
    },
    {
        id: "harmful",
        title: "Harmful Content",
        description: "Block harmful or dangerous content",
        enabled: true,
    },
] as const;

// Default language options (these will be replaced with API data)
export const DEFAULT_LANGUAGES = [
    { code: "en", name: "English", enabled: true, primary: true },
    { code: "es", name: "Spanish", enabled: true, primary: false },
    { code: "fr", name: "French", enabled: false, primary: false },
    { code: "de", name: "German", enabled: false, primary: false },
    { code: "it", name: "Italian", enabled: false, primary: false },
    { code: "pt", name: "Portuguese", enabled: false, primary: false },
] as const;

// Days of the week for operating hours
export const DAYS_OF_WEEK = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
] as const; 