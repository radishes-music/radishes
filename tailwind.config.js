/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false
  },
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--base-color)',
        masked: 'rgba(0,0,0,0.5)',
        'masked-light': 'rgba(0,0,0,0.2)'
      }
    }
  },
  plugins: []
}
