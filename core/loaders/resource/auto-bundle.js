
const fs = require('fs');
const path = require('path');

const dir = require('node-dir');

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
  const { options: { extensions } } = loaders[loaderIndex];

  const pwd = path.dirname(resourcePath);

  dir.files(pwd, (err, files) => {
    if (err) {
      return callback(err);
    }
    files = files.filter(file => {
      return extensions.indexOf(path.extname(file).substring(1)) > -1;
    });
    files = files.map(file => {
      return `exports['${file}'] = require('${file}')`;
    });
    callback(null, files.join('\n'), map);
  });
}
