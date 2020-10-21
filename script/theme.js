const less = require('less')
const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

const themePath = path.resolve(__dirname, '../src/theme')

console.log(
  'Start monitoring',
  chalk.blue(path.resolve(themePath, 'color.less'))
)

fs.watchFile(path.resolve(themePath, 'color.less'), (curr, prev) => {
  if (curr.size === prev.size) return
  fs.readFile(
    path.resolve(themePath, 'color.less'),
    'utf8',
    async (err, theme) => {
      if (err) {
        return console.error(err)
      }

      const contentLess = theme.split('\n').filter(n => !!n)
      let content = ''
      for (let i = 0; i < contentLess.length; i++) {
        const line = contentLess[i]
        let name = line.match(/^@.+:/)
        let value = line.match(/:\s.+;/)
        if (name) {
          name = name[0].slice(1, -1)
        }
        if (value) {
          value = value[0].slice(2, -1)
        }
        content += `@${name}: ${value};\n${name}: @${name};\n`
      }

      const lessSource = `.css {
        ${content}
      }`
      let { css } = await less.render(lessSource)
      css = css.split('\n')
      content = ''
      for (let i = 0; i < css.length; i++) {
        const v = css[i]
        if (v.includes(':')) {
          let name = v.match(/[(a-zA-Z)|-]+:/)
          let value = v.match(/#[a-z0-9]+/)
          if (name) {
            name = name[0].slice(0, -1)
          }
          if (value) {
            value = value[0]
          }
          content += `  --${name}: ${value};\n`
        }
      }

      const output = `:root {
${content}}\n`
      const history = fs.readFileSync(
        path.resolve(themePath, 'index.css'),
        'utf8'
      )
      if (history !== output) {
        fs.writeFile(path.resolve(themePath, 'index.css'), output, err => {
          if (err) {
            console.log(err)
          }
          console.log(chalk.green('File updated successfully'))
        })
      }
    }
  )
})
