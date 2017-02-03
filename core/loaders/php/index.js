
const fs = require('fs');
const path = require('path');

module.exports = function (source, map) {

  const { cacheable, async, resourcePath, loaders, loaderIndex } = this;

  /**
   * execute cacheable
   */
  cacheable();

  /**
   * execute async mode
   */
  const callback = async();

  /**
   * retrieve webpack loader options
   */
  const { options: { pwd, extensions, src: { abs: srcPathAbs }, out: { rel: outPathRel } } } = loaders[loaderIndex];

  /**
   * retrieve resource directory
   */
  const dir = {
    src: path.dirname(resourcePath),
    out: path.relative(srcPathAbs, resourcePath),
  };

  /**
   * resolve dependencies
   */
  const resolve = [ ];
  const matches = source.match(/([\"'])(?:\\\1|.)*?\1/g) || [];

  for (const match of matches) {
    const val = match.slice(1, -1);
    if (extensions.indexOf(path.extname(val).substring(1)) === -1) {
      continue;
    }
    const file = path.join(dir.src, val);
    resolve.push(new Promise((resolve, reject) => {
      fs.stat(file, (err, stats) => {
        if (err || !stats.isFile()) {
          return resolve(-1);
        }
        return resolve(`exports['${path.join(outPathRel, val)}'] = require('${file}')`);
      });
    }));
  }

  /**
   * write resource to disk
   */
  this.emitFile(path.join(outPathRel, dir.out), source);

  /**
   * export dependencies
   */
  Promise.all(resolve).then(exports => {
    const output = `${exports.filter(n => n !== -1).join('\n')}
module.exports = ${JSON.stringify(source)};`;
    this.value = JSON.stringify(source);
    callback(null, output, map);
  }, err => {
    callback(err);
  });

}
