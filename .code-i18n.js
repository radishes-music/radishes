const { format } = require('prettier');

const root = process.cwd();

const renderKey = (filePath, rootPath) => {
  let key = '';
  if (process.platform === 'win32') {
    key = filePath
      .replace(rootPath, '')
      .slice(1)
      .replace(/\\/g, '__')
      .replace(/\..+$/, '');
  } else if (process.platform === 'darwin') {
    key = filePath
      .replace(rootPath, '')
      .slice(1)
      .replace(/\//g, '__')
      .replace(/\..+$/, '');
  } else {
    console.log('warn render key, current type ' + process.platform);
  }
  return key;
};

module.exports = {
  ruleKey: (node, path) => {
    const loc = node.loc;
    return (
      renderKey(path, root) +
      `__${loc.start.line}_${loc.start.column}_${loc.end.line}_${loc.end.column}`
    );
  },
  prettier: (code) => {
    let r = code;
    return format(r, {
      parser: 'babel',
      tabWidth: 2,
      singleQuote: true
    });
  },
  identifier: '$t',
  parserOptions: {
    babel: {
      plugins: [['decorators', { decoratorsBeforeExport: true }], 'jsx', 'typescript']
    }
  }
};
