import $script from 'scriptjs'
import { noop } from '@/utils/index'

// repair electron packaging '//' protocol problem
$script('https://at.alicdn.com/t/font_2132275_l43m9hqmon.js', noop)
