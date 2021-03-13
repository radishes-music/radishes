const { getOptions } =  require('loader-utils');
const validateOptions = require('schema-utils');
const MarkdownIt = require('markdown-it');
const Hljs = require('highlight.js');
const slugify = require('transliteration').slugify;
const compiler = require('@vue/compiler-sfc');
const hashsum = require('hash-sum');
const path = require('path');

const schema = {
  type: 'object',
  properties: {
    html: {
      type: "boolean"
    }
  }
};

function mdOption (options = {}) {
  return new MarkdownIt({
    html: options.html,
    highlight: function (str, lang) {
      if (lang && Hljs.getLanguage(lang)) {
        try {
          return Hljs.highlight(lang, str, true).value;
        } catch (e) {
          console.error(e)
        }
      }
      return str;
    }
  }).use(require('markdown-it-anchor'), {
    slugify: slugify,
    permalink: options.permalink
  });
}

/** Friendly error display */
function displayError({contents, filePath, error}) {
  const pad = (number, pad) => `${Array.from(new Array(pad + 1)).join(' ')}${number}`;

  let output = [`${error.toString()}`, `[${filePath}]`];
  if (error.loc) {
    output[1] += ` Line ${error.loc.start.line}, Column ${error.loc.start.column}`;
    const lineNo = (number) =>
      ' ' +
      pad(number, (error.loc.end.line + 1).toString().length - number.toString().length) +
      ' | ';
    output.push('');
    const allLines = ['', ...contents.split('\n')];
    let currentLine = error.loc.start.line;
    output.push(lineNo(currentLine - 1) + allLines[currentLine - 1]);
    while (currentLine <= error.loc.end.line) {
      output.push(lineNo(currentLine) + allLines[currentLine]);
      currentLine++;
    }
    output.push(
      Array.from(new Array(error.loc.start.column + lineNo(currentLine - 1).length)).join(' ') +
        '^',
    );
    output.push(lineNo(currentLine) + allLines[currentLine]);
  }
  return output.join('\n');
}

/**
 * @param source
 * @returns {string}
 */
module.exports = async function (source) {
  const options = getOptions(this);

  validateOptions(schema, options);

  const mdSource = mdOption(options).render(source.replace(/^<script>([\s\S]*)<\/script>/, ''));
  let outputScript = source.match(/^<script>([\s\S]*)<\/script>/) || '';
  if (outputScript) {
    outputScript = outputScript[0];
  }
  
  const res = `
    <template>
      <section class="markdown-body">
        ${mdSource}
      </section>
    </template>
    ${outputScript}
  `;

  // https://github.com/snowpackjs/snowpack/blob/6935bf3c65dde432d0fa06098a1744fc837b966f/plugins/plugin-vue/plugin.js
  const filePath = this.resourcePath;
  const id = hashsum(filePath);
  const sourceMaps = options.sourceMaps || false;
  
  const {descriptor, errors} = compiler.parse(res, {filename: filePath});
  
  // display errors
  if (errors && errors.length > 0) {
    throw new Error(displayError({error: errors[0], res, filePath}));
  }

  const output = {
    '.js': {code: '', map: ''},
    '.css': {code: '', map: ''},
  };

  if (descriptor.script) {
    const scriptLang = descriptor.script.lang;
    let scriptContent = descriptor.script.content;
    if (['jsx', 'ts', 'tsx'].includes(scriptLang)) {
      scriptContent = scriptCompilers.esbuildCompile(scriptContent, scriptLang);
    }
    if (['js', 'ts'].includes(scriptLang) || !scriptLang) {
      scriptContent = scriptContent.replace(`export default`, 'const defaultExport =');
    }
    output['.js'].code += scriptContent;
  } else {
    output['.js'].code += `const defaultExport = {};`;
  }
  await Promise.all(
    descriptor.styles.map((stylePart) => {
      const css = compiler.compileStyle({
        filename: path.relative(process.cwd(), filePath),
        source: stylePart.content,
        id: `data-v-${id}`,
        scoped: stylePart.scoped != null,
        modules: stylePart.module != null,
        preprocessLang: stylePart.lang,
        // preprocessCustomRequire: (id: string) => require(resolve(root, id))
        // TODO load postcss config if present
      });
      if (css.errors && css.errors.length > 0) {
        console.error(JSON.stringify(css.errors));
      }
      output['.css'].code += css.code;
      if (sourceMaps && css.map) output['.css'].map += JSON.stringify(css.map);
    }),
  );

  if (descriptor.template) {
    const js = compiler.compileTemplate({
      id,
      filename: path.relative(process.cwd(), filePath),
      source: descriptor.template.content,
      preprocessLang: descriptor.template.lang,
      compilerOptions: {
        scopeId: descriptor.styles.some((s) => s.scoped) ? `data-v-${id}` : null,
      },
    });
    if (js.errors && js.errors.length > 0) {
      console.error(JSON.stringify(js.errors));
    }
    output['.js'].code += `\n${js.code}\n`;
    output['.js'].code += `\ndefaultExport.render = render`;
    output['.js'].code += `\nexport default defaultExport`;

    if (sourceMaps && js.map) output['.js'].map += JSON.stringify(js.map);
  }

  // clean up
  if (!output['.js'].code) delete output['.js'];
  if (!output['.css'].code) delete output['.css'];

  return output['.js'].code;
};
