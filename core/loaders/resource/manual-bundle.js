
const fs = require('fs');
const path = require('path');

module.exports = function (source, map) {

  const callback = this.async();
  const resource = this.resourcePath;
  const dir = path.dirname(resource);
  const resolve = [ ];

  const lns = source.split('\n');

  for (const ln of lns) {
    const name = ln.trim();
    if (name.length === 0) {
      continue;
    }
    const file = path.join(dir, name);
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
      return `exports['${file}'] = require('${file}')`;
    }));
  }

  Promise.all(resolve).then(exports => {
    callback(null, exports.join('\n'), map);
  }, err => {
    callback(err);
  });

}
