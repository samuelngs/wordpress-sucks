
const path = require('path');
const webpack = require('webpack');

module.exports = (theme, dir) => ({
  name: 'client',
  target: 'web',
  context: dir,
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:5001',
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'client.js'),
  ],
  output: {
    filename: 'client.js',
    publicPath: `http://localhost:5001/`,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.THEME': JSON.stringify(theme),
      'process.env.THEME_PATH': JSON.stringify(dir),
    }),
  ],
});
