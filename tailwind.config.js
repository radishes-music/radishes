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
        word: 'var(--secondary-text);',
        wordhover: 'var(--secondary-text-hover)',
        masked: 'rgba(0,0,0,0.5)',
        'masked-light': 'rgba(0,0,0,0.2)'
      }
    }
  },
  plugins: []
}
