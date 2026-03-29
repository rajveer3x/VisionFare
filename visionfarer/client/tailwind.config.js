/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBase: '#0a0a0f',
      },
      fontFamily: {
        display: ['"Space Mono"', 'monospace'],
        sans: ['"Sora"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
