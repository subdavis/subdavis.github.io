/** @type {import('tailwindcss').Config} */
const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    colors: {
      primary: 'purple',
      secondary:  'purple',
      accent:  'purple',
      white:  'purple',
      black:  'purple'
    }
  },
  // https://github.com/nuxt-community/tailwindcss-module/issues/111
  purge: [
    './pages/**/*.vue',
    './components/**/*.vue',
    './plugins/**/*.vue',
    './static/**/*.vue'
  ],
  variants: {},
  plugins: [],
  // https://tailwindcss.com/docs/upcoming-changes#purge-layers-by-default
  future: {
    purgeLayersByDefault: true
  }
}
