/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        serif: ["var(--font-cormorant)", "serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
        "cormorant-sc": ["var(--font-cormorant)", "serif"],
      },
      colors: {
        navy: {
          800: "#002447",
          900: "#182134",
        },
        amber: {
          50: "#FFF7EB",
          100: "#F2DCC5",
          500: "#C99A4D",
          700: "#B1873F",
          800: "#BC672C",
        },
        blue: {
          50: "#E1F2FA",
          100: "#BDD0E5",
          300: "#99D3E4",
          400: "#79C5E7",
          500: "#6C98C5",
          700: "#2B3D96",
          800: "#235E93",
          900: "#002447",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "#222222",
            h1: {
              color: "#222222",
            },
            h2: {
              color: "#222222",
            },
            h3: {
              color: "#222222",
            },
            strong: {
              color: "#222222",
            },
            a: {
              color: "#B1873F",
              "&:hover": {
                color: "#9A7235",
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
