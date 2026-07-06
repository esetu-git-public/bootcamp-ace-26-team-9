/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hr: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36aef7',
          500: '#0c93eb',
          600: '#0074ca',
          700: '#015da4',
          800: '#065086',
          900: '#0b426f',
          950: '#072a4a',
        }
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 116, 202, 0.08), 0 2px 6px -1px rgba(0, 116, 202, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(0, 116, 202, 0.15), 0 4px 10px -2px rgba(0, 116, 202, 0.08)',
      }
    },
  },
  plugins: [],
}
