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
        'ebony': '#1f1d1e',
        'orchid': '#7E1E80',
        'deep-purple': '#9505E3',
        'bright-violet': '#B637FB'
      },
    },
  },
  plugins: [],
}
