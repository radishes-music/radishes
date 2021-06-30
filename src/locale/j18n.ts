import zh from './zh-cn.json'
import en from './en.json'
import { Language } from '@/interface'

const LanguageNormalized = {
  [Language.ZH]: zh,
  [Language.En]: en
}

type Locale = Record<string, string>

window.j18n = {
  getLanguage() {
    let language = Language.ZH
    try {
      const store = JSON.parse(localStorage.getItem('RADISHES-VUEX') as string)
      language = store.Setting.language
    } catch (e) {
      console.warn(e)
    }
    return language
  },
  load(key: string, ...args: any[]) {
    const language = window.j18n.getLanguage() as Language
    const value = (LanguageNormalized[language] as Locale)[key]
    if (!value) {
      console.warn('j18n.load not find key: ', key)
    }

    const r = value.replace(/\{\d+?\}/g, (match: any) => {
      const n = match.match(/\d+/)
      const index = n ? Number(n[0]) : -1
      return args[index]
    })
    return r
  }
}
