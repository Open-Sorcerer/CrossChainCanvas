/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#97E30F',
        brandGray: {
          100: '#FBF9FE',
          200: '#AFABB6',
          300: '#252529',
          400: '#17171A',
          500: '#111112',
          600: '#0C0C0D',
        },
        brandPurple: {
          'lite': '#A881E6',
          'mid': '#7450AC',
          'dark': '#523480'
        },
        glass: {
          'lite':'#3A6BED',
          'deep':'#043ED6'
        },
      }
    },
  },
  plugins: [],
}