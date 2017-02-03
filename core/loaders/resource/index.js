
const all = require('./auto-bundle');
const manual = require('./manual-bundle');

module.exports = function (source, map) {

  this.cacheable && this.cacheable();

  const lns = source.split('\n');
  const auto = lns.length === 0 || lns.length === 1 && !lns[0];

  const fn = auto ? all : manual;

  fn.call(this, source, map);
}
