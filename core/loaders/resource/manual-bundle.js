
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
  const { options: { src: { abs: srcPathAbs }, out: { rel: outPathRel } } } = loaders[loaderIndex];


  /**
   * retrieve resource directory
   */
  const dir = {
    src: path.dirname(resourcePath),
    out: path.relative(srcPathAbs, resourcePath),
  };

  const resolve = [ ];

  const lns = source.split('\n');

  for (const ln of lns) {
    const name = ln.trim();
    if (name.length === 0 || name === '-') {
      continue;
    }
    const file = path.join(dir.src, name);
    resolve.push(new Promise((resolve, reject) => {
      fs.stat(file, (err, stats) => {
        if (err) {
          return reject(err);
        }
        if (!stats.isFile()) {
          return reject(`${file} is not a file`);
        }
        return resolve(file);
      });
    }).then(file => {
      return `exports['${path.join(outPathRel, name)}'] = require('${path.join(srcPathAbs, name)}')`;
    }));
  }

  Promise.all(resolve).then(exports => {
    const output = `
${exports.join('\n')}
module.exports = ${JSON.stringify(source)}`;
    callback(null, output, map);
  }, err => {
    callback(err);
  });

}
