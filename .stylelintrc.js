module.exports = {
  plugins: ['stylelint-prettier', 'stylelint-order'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-recess-order'
  ],
  rules: {
    'prettier/prettier': true,
    'font-family-no-missing-generic-family-keyword': null
  }
}
