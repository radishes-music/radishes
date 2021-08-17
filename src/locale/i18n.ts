import { createI18n } from 'vue-i18n'
import zhCN from './zh-cn.json'
import enUS from './en-us.json'

const language = JSON.parse(window.localStorage.getItem('RADISHES-VUEX') || '')

const i18n = createI18n({
  messages: {
    'zh-cn': zhCN,
    'en-us': enUS
  },
  locale: language?.Setting?.language
})

export const $t = i18n.global.t

export default i18n
