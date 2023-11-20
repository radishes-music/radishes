const fs = require('fs')
const path = require('path')
const glob = require('glob')
const prettier = require('prettier')
const { parserCore, trackNormalized, renderOutputCode } = require('./core')

// Todo remove
const rootPath = path.join(__dirname, '../..')

const isDir = path => {
  try {
    const stat = fs.lstatSync(path)
    return stat.isDirectory()
  } catch (e) {
    return false
  }
}

const readAllFile = root => {
  const suffix = ['ts', 'tsx', 'js']
  let paths = []
  return new Promise((resole, reject) => {
    for (let i = 0; i < suffix.length; i++) {
      const mime = suffix[i]
      glob(
        `**/*.${mime}`,
        {
          cwd: root,
          ignore: ['node_nodules']
        },
        (err, matches) => {
          if (err) {
            reject()
            return console.error(err)
          }
          const absolutePath = matches.map(filename => {
            return path.join(root, filename)
          })
          paths = paths.concat(absolutePath)
          if (i === suffix.length - 1) {
            resole(paths)
          }
        }
      )
    }
  })
}

const writeHandle = err => {
  if (err) {
    console.log('写入失败', err)
    return false
  }
  return true
}

exports.normalizedJsonToFile = normalized => {
  const normalizedJson = {}
  if (normalized.length) {
    normalized.forEach(item => {
      Object.assign(normalizedJson, {
        [item.key]: item.output
      })
    })
  }
  return normalizedJson
}

exports.parser = pathOrFile => {
  const merge = (file, path) => {
    const filetrack = parserCore(file, path)
    const normalized = trackNormalized(filetrack, rootPath)
    const pathSplit = path.split('/')
    const filename = pathSplit[pathSplit.length - 1]
    const type = normalized.length ? normalized[0].fileType : null
    return {
      [path]: normalized,
      key: path,
      filename: filename,
      type: type
    }
  }

  if (isDir(pathOrFile)) {
    return readAllFile(pathOrFile).then(filePath => {
      return filePath
        .map(absolutePath => {
          const file = fs.readFileSync(absolutePath, {
            encoding: 'utf8'
          })
          return merge(file, absolutePath)
        })
        .filter(item => {
          return item[item.key].length > 0
        })
    })
  }

  const file = fs.readFileSync(pathOrFile, {
    encoding: 'utf8'
  })
  return merge(file, pathOrFile)
}

exports.writeOutputCode = (path, code) => {
  return fs.promises.writeFile(path, code).then(writeHandle)
}

exports.writeLanguageZhCn = (content, filePath) => {
  const fileLinkPath = filePath || path.join(rootPath, 'src/locale/zh-cn.json')
  const source = prettier.format(JSON.stringify(content), {
    parser: 'json-stringify'
  })
  return fs.promises.writeFile(fileLinkPath, source).then(writeHandle)
}

exports.renderOutputCode = renderOutputCode
