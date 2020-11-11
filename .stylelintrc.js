module.exports = {
  plugins: ['stylelint-prettier', 'stylelint-order'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-recess-order'
  ],
  rules: {
    'prettier/prettier': true,
    'order/properties-order': ['width', 'height', 'padding', 'margin']
  }
}
