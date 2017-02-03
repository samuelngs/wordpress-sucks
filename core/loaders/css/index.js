
const path = require('path');

const prepend = `
$styles = array(
`

const builder = (o) => Object.keys(o).map(k => `  "${k}"  =>  "${o[k]}", `).join('\n');

const append = `
);
`

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

  if ( source.indexOf('module.exports = {') === -1 ) {
    return callback(null, source, map);
  }

  new Promise((resolve, reject) => {

    /**
     * remove comments, remove unused code
     */
    return resolve(source
      .replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '')
      .replace('module.exports = ', '')
      .trim());

  }).then(src => {

    /**
     * trim ;
     */
    if (src[src.length - 1] === ';') {
      return src.substring(0, src.length - 1);
    }
    return src;

  }).then(src => {

    /**
     * parse object
     */
    return JSON.parse(src);

  }).then(src => {

    return `${prepend}${builder(src)}${append}`;

  }).then(src => {

    /**
     * write resource to disk
     */
    this.emitFile(`${path.join(outPathRel, dir.out)}.php`, src);

    return callback(null, source, map);

  }).catch(err => {

    return callback(err);

  });

}
