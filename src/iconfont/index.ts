import $script from 'scriptjs'
import { noop } from '@/utils/index'

const ICONFONT_URL = 'font_2132275_j86516oavzq'

// repair electron packaging '//' protocol problem
$script(`https://at.alicdn.com/t/${ICONFONT_URL}.js`, noop)

void (function () {
  if (document) {
    const iconfont = document.createElement('style')
    document.getElementsByTagName('head')[0].appendChild(iconfont)
    const iconfontSheet = document.styleSheets[document.styleSheets.length - 1]
    iconfontSheet.insertRule(`
      @font-face {
        font-family: 'iconfont';
        src: url('https://at.alicdn.com/t/${ICONFONT_URL}.eot');
        src: url('https://at.alicdn.com/t/${ICONFONT_URL}.eot?#iefix') format('embedded-opentype'),
        url('https://at.alicdn.com/t/${ICONFONT_URL}.woff2') format('woff2'),
        url('https://at.alicdn.com/t/${ICONFONT_URL}.woff') format('woff'),
        url('https://at.alicdn.com/t/${ICONFONT_URL}.ttf') format('truetype'),
        url('https://at.alicdn.com/t/${ICONFONT_URL}.svg#iconfont') format('svg');
      }`)
  }
})()
