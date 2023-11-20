/* eslint-disable no-unused-vars */
const path = require('path')
const fs = require('fs')
const {
  parser,
  renderOutputCode,
  normalizedJsonToFile,
  writeLanguageZhCn,
  writeOutputCode
} = require('./core/index')

const rootPath = path.join(__dirname, '..')
const v1 = path.join(rootPath, 'src')

const startTime = Date.now()

// 正式
async function start() {
  const [v1Normalized] = await Promise.all([parser(v1)])
  const test = [].concat(v1Normalized).flat()

  const mergeJson = []
  const errorFile = []
  test.map(async json => {
    const normalized = json[json.key]
    const code = renderOutputCode(
      normalized,
      fs.readFileSync(json.key, { encoding: 'utf8' })
    )
    mergeJson.push(...normalized)
    try {
      await writeOutputCode(path.normalize(json.key), code, json.type)
    } catch (e) {
      // console.warn(e.stack);
      errorFile.push({
        name: json.key,
        error: e.stack
      })
    }
  })
  const json = normalizedJsonToFile(mergeJson)
  await writeLanguageZhCn({
    ...json
  })
  if (errorFile.length) {
    await writeLanguageZhCn(errorFile, path.join(rootPath, 'script/error.json'))
  }
  console.log('Script time:', Date.now() - startTime, 'ms')
}

start()
