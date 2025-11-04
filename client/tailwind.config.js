// client/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default { 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    extend: {
      fontFamily: {
        // Add your custom font families
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'], // replaces Tailwind’s default sans
        serif: ['Merriweather', 'ui-serif', 'Georgia'],
      },
      colors: {
        primary: '#1d4ed8',   // blue-700
        secondary: '#9333ea', // purple-600
        accent: '#f59e0b',    // amber-500
      },
    },
  },
  plugins: [],
}