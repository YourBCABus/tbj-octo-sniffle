/** @type {import('tailwindcss').Config} */

// when making a change to this file, restart with 
// npx react-native start --reset-cache
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'slate-950': '#020617',
        'zinc-950': '#09090b',
      },
    },
  },
  plugins: [],
}
