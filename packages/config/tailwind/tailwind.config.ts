import type { Config } from "tailwindcss";

const config: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#9A52E4",
          foreground: "#FFFFFF",
          hover: "#7E39D8",
        },
        secondary: {
          DEFAULT: "#F1CB46",
          foreground: "#442767",
        },
        accent: {
          DEFAULT: "#E73A77",
          foreground: "#FFFFFF",
        },
        background: "#FFFFFF",
        foreground: "#442767",
        muted: {
          DEFAULT: "#F8F9FA",
          foreground: "#6B7280",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#442767",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#442767",
        },
        border: "#E5E7EB",
        input: "#FFFFFF",
        destructive: {
          DEFAULT: "#ED536F",
          foreground: "#FFFFFF",
        },
        success: "#46E08C",
        warning: "#F08D5F",
        info: "#276DC0",
      },
      borderRadius: {
        sm: "calc(0.75rem - 4px)",
        md: "calc(0.75rem - 2px)",
        lg: "0.75rem",
        xl: "calc(0.75rem + 4px)",
        "2xl": "calc(0.75rem + 8px)",
        "3xl": "1.5rem",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        kanit: ["var(--font-kanit)", "sans-serif"],
        sarabun: ["var(--font-sarabun)", "sans-serif"],
        sans: ["var(--font-sarabun)", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "100%",
          md: "100%",
          lg: "1024px",
          xl: "1200px",
          "2xl": "1200px",
        },
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "64px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 24px rgba(154,82,228,0.12)",
        glow: "0 0 0 3px rgba(154,82,228,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
