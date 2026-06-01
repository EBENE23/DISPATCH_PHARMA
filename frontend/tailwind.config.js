/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e6f2fc',
          100: '#cce5f9',
          200: '#99cbf3',
          300: '#66b1ed',
          400: '#3397e7',
          500: '#0157bd',  // Bleu principal du logo
          600: '#01469a',
          700: '#013578',
          800: '#012455',
          900: '#001232',
        },
        secondary: {
          500: '#44ac40',  // Vert secondaire du logo
          600: '#3a9a36',
          700: '#30882d',
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}