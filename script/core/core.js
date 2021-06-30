const Type = {
  CHAR: 'CHAR',
  HTML: 'HTML',
  JSX: 'JSX'
}

const renderKey = (filePath, rootPath) => {
  const key = filePath
    .replace(rootPath, '')
    .slice(1)
    .replace(/\//g, '__')
    .replace(/\..+$/, '')
  return key
}

const checkInExpression = (type, content, start) => {
  const isVue = false
  const beforeContent = content.slice(0, start)
  const isAttributeExpression = isVue
    ? /:[a-zA-Z-]*=".*/.test(beforeContent)
    : /[a-zA-Z]={/.test(beforeContent)
  return isAttributeExpression
}

const checkJSXExpression = (type, content, start) => {
  const beforeContent = content.slice(0, start)
  return /.*{$/.test(beforeContent)
}

const charParser = (content, regexp, line, isAttribute, type, cb) => {
  const match = content.match(regexp)
  const variable = []
  const chinese = /[\u4e00-\u9fa5]/
  const attr = isAttribute > 0
  let i = 0
  if (!match) {
    return null
  }
  const r = match
    .filter(item => chinese.test(item))
    .map(item => {
      const start = content.indexOf(item)
      const end = start + item.length

      const isAttributeExpression = attr
        ? checkInExpression(type, content, start)
        : false
      const isJSXNodeExpression = !attr
        ? checkJSXExpression(type, content, start)
        : false

      // 处理模版字符串
      const output = item.replace(/\$\{.+?\}/g, match => {
        variable.push(match.slice(2, -1))
        return `{${i++}}`
      })
      return {
        source: content,
        line,
        output,
        variable,
        start,
        end,
        type: Type.CHAR,
        isAttribute: attr,
        isAttributeExpression,
        isJSXNodeExpression
      }
    })
  cb()
  return r
}

const tagParser = (content, regexp, isVue, type, line, isAttribute, cb) => {
  const variable = []
  let i = 0
  const match = content.match(regexp)
  let output = match[0]
  const start = match.index
  const end = start + output.length
  if (isVue) {
    // 处理 vue html 里的变量
    output = output.replace(/\{\{.+?\}\}/g, match => {
      variable.push(match.slice(2, -2))
      return `{${i++}}`
    })
  }
  cb()
  return {
    source: content,
    line,
    output,
    variable,
    start,
    end,
    isVueTag: isVue,
    type: type,
    isAttribute: isAttribute > 0
  }
}

const renderVueExpressionCode = (source, code, start, end) => {
  const tags = source
    .split('')
    .map((item, index) => {
      if (item === ' ') {
        return index
      }
      return null
    })
    .filter(item => typeof item === 'number')
    .filter(item => item < start)
  const tagIndex = tags[tags.length - 1]
  const rewriteCode =
    source.slice(0, tagIndex) +
    ' :' +
    source.slice(tagIndex + 1, start) +
    code +
    source.slice(end)
  return rewriteCode
}

exports.renderOutputCode = (normalized, file) => {
  // {
  //   source: '          title: `{{${code}.${autoSheetOptions(event)[0].value}}} 异常警告`,',
  //   rewriteCode: '          title: j18n.expand(j18n.load('src__components__automationDrawer__model__action___199', code, autoSheetOptions(event)[0].value)),',
  //   fileType: 'js',
  //   type: 'CHAR',
  //   isVueTag: false,
  //   output: '`{{{0}.{1}}} 异常警告`',
  //   filePath: '/Users/inkl/Desktop/work/console/src/components/automationDrawer/model/action.js',
  //   line: 199,
  //   code: 'j18n.expand(j18n.load('src__components__automationDrawer__model__action___199', code, autoSheetOptions(event)[0].value))'
  //   variable?: ['code', 'autoSheetOptions(event)[0].value'],
  //   src__components__automationDrawer__model__action___199: '`{{{0}.{1}}} 异常警告`',
  //   key: 'src__components__automationDrawer__model__action___199'
  // }
  if (normalized.length) {
    const code = file.split('\n')
    for (let index = 0; index < normalized.length; index++) {
      const item = normalized[index]
      if (normalized[index + 1] && item.line === normalized[index + 1].line) {
        // 处理相同行数的中文
        const [current, next] = [item, normalized[index + 1]]
        const { source, start, end } = current
        const rCode =
          source.slice(0, start) +
          current.code +
          source.slice(end, next.start) +
          next.code +
          next.source.slice(next.end)
        code[item.line] = rCode
        // 跳过下一行的写入
        index++
      } else {
        code[item.line] = item.rewriteCode
      }
    }
    return code.join('\n')
  }
  return null
}

exports.trackNormalized = (filetrack, rootPath) => {
  const json = filetrack.map((track, index) => {
    const prefixKey = renderKey(track.filePath, rootPath)
    // 处理头尾带引号的字符串
    const output = track.output.replace(/^["'`]/, '').replace(/["'`]$/, '')
    // 同一行中有两个中文字符串
    if (filetrack[index + 1] && track.line === filetrack[index + 1].line) {
      const key = `${prefixKey}___${track.line}____${index}`
      return {
        [key]: output,
        key: key,
        output
      }
    }
    const key = `${prefixKey}___${track.line}`
    return {
      [key]: output,
      key: key,
      output
    }
  })
  return json.map((item, index) => {
    let code,
      filling = '',
      rewriteCode = ''
    const itemTrack = filetrack[index]
    const {
      variable,
      fileType,
      type,
      start,
      end,
      source,
      isVueTag,
      isAttribute,
      isAttributeExpression,
      isJSXNodeExpression
    } = itemTrack
    if (Array.isArray(variable) && variable.length) {
      // filling expressions
      filling = `, ${variable.join(', ')}`
    }
    if (fileType === 'tsx' || fileType === 'ts') {
      if (type === Type.CHAR && !isAttribute) {
        code = `j18n.load('${item.key}'${filling})`
      } else {
        // isJSXNodeExpression 表示当前内容是否为 {`xxx`} 模式
        if ((isAttribute && isAttributeExpression) || isJSXNodeExpression) {
          code = `j18n.load('${item.key}'${filling})`
        } else {
          code = `{ j18n.load('${item.key}'${filling}) }`
        }
      }
    }
    rewriteCode =
      rewriteCode || source.slice(0, start) + code + source.slice(end)

    return {
      ...itemTrack,
      ...item,
      code: code,
      rewriteCode: rewriteCode
    }
  })
}

exports.parserCore = (content, path) => {
  // const regexp = /["'`]?[\u4e00-\u9fa5]+(.+)?[\u4e00-\u9fa5]+(\?|!)?["'`）]?/;
  const double = /".*?"/g
  const single = /'.*?'/g
  // eslint-disable-next-line no-unused-vars
  const backtick = /`.*?`/g
  const charRegexp = /["'`].*?["'`]/g
  const htmlChineseRegexp = /(?<=>).{0,}[\u4e00-\u9fa5].{0,}(?=<)/
  const allChineseRegexp = /[\u4e00-\u9fa5]{1,}.*?[\u4e00-\u9fa5]{1,}/
  const type = path.match(/\.(tsx|ts|js)$/)[0].slice(1)

  const isVue = false

  let isAttribute = 0,
    processed = false
  if (
    charRegexp.test(content) ||
    htmlChineseRegexp.test(content) ||
    allChineseRegexp.test(content)
  ) {
    return content
      .split('\n')
      .map((lineContent, line) => {
        // jsx / vue 中的语义处理 < 中的属性值（中文字符串），应该加上 ‘{}’ 符号
        if (/<[a-zA-Z]+/.test(lineContent)) {
          isAttribute++
        }

        const tagClose = () => {
          // 处理完当前行了之后再决定标签是否闭合
          const close =
            /<.+>/.test(lineContent) ||
            /^>/.test(lineContent.trim()) ||
            /\/>/.test(lineContent)
          if (close) {
            isAttribute = isAttribute > 0 ? isAttribute - 1 : 0
          }
        }

        if (
          isVue &&
          isAttribute &&
          double.test(lineContent) &&
          single.test(lineContent)
        ) {
          // vue template ExpressionStatement
          // 总共只有13处需要处理，手动替换
          return charParser(
            lineContent,
            single,
            line,
            isAttribute,
            type,
            tagClose
          )
        }

        // 处理 <><> tag 中的中文
        if (htmlChineseRegexp.test(lineContent)) {
          return tagParser(
            lineContent,
            htmlChineseRegexp,
            isVue,
            Type.HTML,
            line,
            isAttribute,
            tagClose
          )
        }

        if (backtick.test(lineContent)) {
          return charParser(
            lineContent,
            backtick,
            line,
            isAttribute,
            type,
            tagClose
          )
        }

        // 处理字符串中的中文
        if (charRegexp.test(lineContent)) {
          const parser = charParser(
            lineContent,
            charRegexp,
            line,
            isAttribute,
            type,
            tagClose
          )
          processed = true
          if (parser.length) {
            return parser
          }
        }

        // 处理 jsx / vue 中的中文
        if (
          allChineseRegexp.test(lineContent) &&
          !lineContent.includes('//') &&
          !lineContent.includes('* ')
        ) {
          return tagParser(
            lineContent,
            allChineseRegexp,
            isVue,
            Type.JSX,
            line,
            isAttribute,
            tagClose
          )
        }

        // 没有匹配到中文也需要检查标签是否已关闭
        !processed && tagClose()

        // 当前行处理完，标记量回退
        processed = false

        return null
      })
      .filter(item => {
        if (Array.isArray(item)) {
          return item.length > 0
        }
        return !!item
      })
      .flat()
      .map(item => ({ ...item, filePath: path, fileType: type }))
  }

  return []
}
