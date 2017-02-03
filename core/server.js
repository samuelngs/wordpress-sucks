//
// [server] wordpress-sucks helper
//

console.log('server', process.env.THEME);
require(`${process.env.THEME_PATH}/theme.resource`);

if (module.hot) {
  module.hot.accept();
}

