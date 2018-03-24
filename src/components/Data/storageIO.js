export default {
  // 设置本地存储
  setStrong: function (name, value) {
    window.localStorage.setItem(name, JSON.stringify(value))
  },
  getStrong: function (name) {
    return JSON.parse(window.localStorage.getItem(name) || '[]')
  },
  removeStrong: function (name) {
    window.localStorage.removeItem(name)
  }
}
