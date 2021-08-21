import * as T from '@babel/types'
import { PluginObj, Node } from '@babel/core'

export default function({ types: t }: { types: typeof T }) {
  const visitor: PluginObj['visitor'] = {}
  
  visitor.Program = function(path) {
    let shouldImport = false
    path.traverse({
      CallExpression(path) {
        if (t.isIdentifier(path.node.callee, { name: '$t' })) {
          shouldImport = true
        }
      }
    })
    
    if (shouldImport) {

      const node = t.importDeclaration(
        [t.importSpecifier(t.identifier('$t'), t.identifier('$t'))],
        t.stringLiteral('@/locale/i18n')
      )
      
      path.get('body')[0].getStatementParent().insertBefore(node as unknown as Node)
    }
  }
  return {
    visitor
  }
}
