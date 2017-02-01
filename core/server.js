//
// [server] wordpress-sucks helper
//

console.log('server', process.env.THEME);
const css = require(`${process.env.THEME_PATH}/main.css`);

if (module.hot) {
  module.hot.accept();
}

