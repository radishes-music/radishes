import zh from './zh-cn.json'
import en from './en.json'
import { Language } from '@/interface'

const LanguageNormalized = {
  [Language.ZH]: zh,
  [Language.En]: en
}

window.j18n = {
  currentLanguage() {
    let language = Language.ZH
    try {
      const store = JSON.parse(localStorage.getItem('RADISHES-VUEX') as string)
      language = store.Setting.language || Language.ZH
    } catch (e) {
      console.warn(e)
    }
    return language
  },
  load(key: string, ...args: any[]) {
    const language = this.currentLanguage() as Language
    const value = (LanguageNormalized[language] as Record<string, string>)[key]
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
