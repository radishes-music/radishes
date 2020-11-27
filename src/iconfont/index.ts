import $script from 'scriptjs'
import { noop } from '@/utils/index'

// repair electron packaging '//' protocol problem
$script('//at.alicdn.com/t/font_2132275_edwe4same0b.js', noop)
