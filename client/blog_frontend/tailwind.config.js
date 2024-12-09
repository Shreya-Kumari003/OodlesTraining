/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        poppins: ["Poppins", "sans-serif"],
        comicsans:["Comic Neue","cursive"],
        couriernew: ["Courier Prime", "monospace"],
      },
      backgroundClip: {
        text: 'text', // Standard property support
      },
    },
  },
  plugins: [],
}