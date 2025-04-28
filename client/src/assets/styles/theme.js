export const theme = {
    colors: {
        background: "#0E0E10", // Dark background
        surface: "#1C1C1E", // Card background
        primary: "#A855F7", // Violet Accent
        primaryHover: "#9333EA", // Darker Violet on hover
        secondary: "#C084FC", // Light Purple
        textPrimary: "#F4F4F5", // Main white text
        textSecondary: "#A1A1AA", // Subtle text
        border: "#27272A", // Card/Input border
        success: "#22C55E", // Success
        warning: "#F59E0B", // Warning
        error: "#EF4444", // Error
        gradientPrimary: "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)",
        glowPrimary: "0 0 10px #A855F7, 0 0 20px #9333EA, 0 0 30px #9333EA",
    },

    fonts: {
        main: "'Inter', 'Roboto', 'Helvetica Neue', 'Segoe UI', sans-serif",
        heading: "'Inter', 'Roboto', sans-serif",
    },

    spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
    },

    borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        full: "9999px",
    },

    shadows: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.1)",
        lg: "0 10px 15px rgba(0,0,0,0.15)",
    },

    transitions: {
        default: "all 0.3s ease",
        fast: "all 0.15s ease",
    },
};
