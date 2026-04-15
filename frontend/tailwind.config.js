/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF2D55",
        "primary-soft": "#FFF0F3",
        "primary-deep": "#D61F44",
        background: "#FDFCFB",
        surface: "#FFFFFF",
        "on-surface": "#1F1D1D",
        "on-surface-variant": "#6B6766",
        outline: "#EAE5E3",
        "surface-container": "#F2F2F2",
        "surface-container-low": "#F8F8F8",
        "surface-container-lowest": "#FFFFFF",
        "surface-variant": "#F0ECEB",
        secondary: "#B90034",
      },
      borderRadius: {
        DEFAULT: "0px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px"
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
        headline: ["Pretendard", "sans-serif"]
      }
    },
  },
  plugins: [],
}

