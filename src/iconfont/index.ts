import $script from 'scriptjs'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

// repair electron packaging '//' protocol problem
$script('https://at.alicdn.com/t/font_2132275_kem20imtbs.js', noop)
