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
        'ebony': '#101010', 
        // #101010
        // 
        // #171717
        'orchid': '#7E1E80',
        'deep-purple': '#9505E3',
        'bright-violet': '#B637FB',
        'subheader-purple': '#9c52b3',
        'starred-yellow': '#FFE205',
        'absent-red': '#F50202',
        'present-green': '#05FA19',
        'default-gray': '#808080',
      },
    },
  },
  plugins: [],
}
