
const path = require('path');
const webpack = require('webpack');

module.exports = options => ({
  name: 'client',
  target: 'web',
  context: options.src.abs,
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:5001',
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'client.js'),
  ],
  output: {
    filename: 'client.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.THEME': JSON.stringify(options.src.name),
      'process.env.THEME_PATH': JSON.stringify(options.src.abs),
    }),
  ],
});
