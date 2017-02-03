
const watch = require('node-watch');

module.exports = function (options = {}) {

  const apply = (compiler) => {
    compiler.plugin('emit', (compilation, callback) => {
      const watcher = watch(options.src.abs, { recursive: false, followSymLinks: true }, file => {
        compiler.run(err => {
          if (err) {
            console.log(err);
            watcher.close();
          }
        });
      });
      callback();
    });
  }

  return { apply };
}
