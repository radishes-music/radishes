const babel = require('@babel/core')

describe('$t', () => {
  test('basic $t', () => {
    const { code } = babel.transform(`
      const name = $t('_')
    `)
    expect(code).toBe(`import { $t } from \"@/locale/i18n\";
const name = $t('_');`)
  })
})
