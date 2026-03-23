/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF6FF",
          100: "#D9EBFF",
          200: "#BDD9FF",
          300: "#8EC2FF",
          400: "#589FFF",
          500: "#3178FF",
          600: "#1A56F5",
          700: "#1341E1",
          800: "#1635B6",
          900: "#19318F",
          950: "#141F57",
        },
        surface: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        success: {
          500: "#22C55E",
          600: "#16A34A",
        },
        danger: {
          500: "#EF4444",
          600: "#DC2626",
        },
      },
      fontFamily: {
        onest: ["Onest_400Regular"],
        "onest-bold": ["Onest_700Bold"],
      },
    },
  },
  plugins: [],
};
