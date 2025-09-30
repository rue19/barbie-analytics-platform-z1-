/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899', // Main pink
          600: '#db2777', // Darker pink
          700: '#be185d', // Deep pink
          800: '#9d174d',
          900: '#831843',
        },
        barbie: {
          50: '#fff1f5',
          100: '#ffe4ec',
          200: '#fecddb',
          300: '#fda4c4',
          400: '#fb71a7',
          500: '#f43f8c', // Barbie pink
          600: '#e21a67',
          700: '#be125d',
          800: '#9f124d',
          900: '#88133d',
        }
      },
      backgroundImage: {
        'barbie-gradient': 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
        'bubblegum': 'linear-gradient(135deg, #f9a8d4 0%, #f472b6 50%, #ec4899 100%)',
      }
    },
  },
  plugins: [],
}