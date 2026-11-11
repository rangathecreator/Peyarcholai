/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-tamil)", "sans-serif"],
        tamil: ["var(--font-noto-tamil)", "var(--font-inter)", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fdf8f3",
          100: "#faeee1",
          200: "#f4dac0",
          300: "#ecc096",
          400: "#e29d67",
          500: "#db8143",
          600: "#cd6936",
          700: "#ab522e",
          800: "#89432b",
          900: "#6f3826",
        },
      },
    },
  },
  plugins: [],
};

