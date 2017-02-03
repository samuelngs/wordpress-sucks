
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
   * return modified source code
   */
  if (this.sourceMap === false) {
    callback(null, source);
  } else {
    callback(null, source, map);
  }
}
