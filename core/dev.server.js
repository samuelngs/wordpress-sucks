
const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (theme, dir) => ({
  name: 'server',
  target: 'node',
  context: dir,
  devtool: 'eval',
  entry: [
    'webpack/hot/signal',
    path.join(__dirname, 'server.js'),
  ],
  output: {
    filename: `${dir}/server.js`,
    publicPath: `http://localhost:5001/`,
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          loader: 'css-loader?module&importLoaders=1!postcss-loader',
          options: {
            plugins: [],
          },
        }).concat([
          {
            loader: path.join(__dirname, 'css.loader.js'),
            options: { },
          },
        ])
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.THEME': JSON.stringify(theme),
      'process.env.THEME_PATH': JSON.stringify(dir),
    }),
    new ExtractTextPlugin(`${dir}/styles.css`),
  ],
});
