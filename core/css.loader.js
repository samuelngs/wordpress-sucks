
module.exports = function (source, map) {

  const callback = this.async();

  /**
   * execute cacheable
   */
  this.cacheable && this.cacheable();

  /**
   * return modified source code
   */
  if (this.sourceMap === false) {
    callback(null, source);
  } else {
    callback(null, source, map);
  }
}
