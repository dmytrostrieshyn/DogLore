/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#173124',
          secondary: '#2D4739',
          accent: '#FEAE87',
          'light-sage': '#98B5A3',
        },
        bg: {
          main: '#F6F3F2',
          warm: '#FBF9F8',
        },
        text: {
          primary: '#1B1C1C',
          secondary: '#424844',
          muted: '#6B7280',
        },
        surface: {
          primary: '#EAE8E7',
          dark: '#41423F',
          positive: '#B0CDBB',
        },
        natural: {
          earth: '#8C4E2E',
          mint: '#CCEAD6',
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}