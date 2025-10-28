// client/tailwind.config.js

/** @type {import('tailwindcss').Config} */
// 🛑 Change from module.exports to export default
export default { 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}