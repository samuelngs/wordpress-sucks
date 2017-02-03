
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
  const rel = path.relative(srcPathAbs, resourcePath);
  const out = path.join(outPathRel, rel);

  /**
   * write resource to disk
   */
  this.emitFile(out, source);

  const output = `
${source}
if (module.hot) {
  module.hot.accept();
}
`;

  callback(null, source, map);
}
