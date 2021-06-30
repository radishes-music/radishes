import zh from './zh-cn.json'

type Locale = Record<string, string>

window.j18n = {
  expand(txt: string) {
    return txt
  },
  load(key: string, ...args: any[]) {
    const value = (zh as Locale)[key]
    if (!value) {
      console.warn('j18n.load not find key: ', key)
    }

    const r = value.replace(/\{\d+?\}/g, match => {
      const n = match.match(/\d+/)
      const index = n ? Number(n[0]) : -1
      return args[index]
    })
    return r
  }
}
