"use strict";
exports.__esModule = true;
function default_1(_a) {
    var t = _a.types;
    var visitor = {};
    visitor.Program = function (path) {
        var shouldImport = false;
        path.traverse({
            CallExpression: function (path) {
                if (t.isIdentifier(path.node.callee, { name: '$t' })) {
                    shouldImport = true;
                }
            }
        });
        if (shouldImport) {
            var node = t.importDeclaration([t.importSpecifier(t.identifier('$t'), t.identifier('$t'))], t.stringLiteral('@/locale/i18n'));
            path.get('body')[0].getStatementParent().insertBefore(node);
        }
    };
    return {
        visitor: visitor
    };
}
exports["default"] = default_1;
