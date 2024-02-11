let colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
// when making a change to this file, restart with
// npx react-native start --reset-cache
module.exports = {
    content: [
        './App.{js,jsx,ts,tsx}',
        './src/components/**/*.{js,jsx,ts,tsx}',
        './src/pages/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'slate-950': '#020617',
                'zinc-950': '#09090b',
                'zinc-aa-compliant': '#797881',
                'absent-red': colors.red['500'],
                'present-green': colors.green['500'],
                'default-gray': colors.slate['500'],
                'ebony': colors.slate['950'],
                'starred-yellow': colors.amber['300'],
                'partial-orange': '#fbb824',
            },
            width: {
                '48dip': '48px',
                '56dip': '56px',
            },
            height: {
                '48dip': '48px',
                '56dip': '56px',
            },
            minWidth: {
                '48dip': '48px',
                '56dip': '56px',
            },
            minHeight: {
                '48dip': '48px',
                '56dip': '56px',
            },
        },
    },
    plugins: [],
};
