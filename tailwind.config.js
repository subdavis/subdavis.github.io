/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    colors: {
      primary: colors.purple,
      secondary: colors.gray,
      accent: colors.pink,
      white: colors.white,
      black: colors.black
    }
  },
  variants: {},
  plugins: []
}
