
const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const WriteFilePlugin = require('./plugins/write-file');
const WatchFilePlugin = require('./plugins/watch-file');

module.exports = (options) => ({
  name: 'server',
  target: 'node',
  context: options.src.abs,
  devtool: 'eval',
  entry: [
    'babel-polyfill',
    'webpack/hot/signal',
    path.join(__dirname, 'server.js'),
  ],
  output: {
    filename: `${options.out.rel}/server.js`,
    publicPath: '/',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.resource$/,
        use: { loader: path.join(__dirname, 'loaders', 'resource'), options },
      },
      {
        test: /\.php$/,
        use: { loader: path.join(__dirname, 'loaders', 'php'), options },
      },
      {
        test: /\.css$/,
        use: { loader: path.join(__dirname, 'loaders', 'css'), options },
      },
      {
        test: /\.js$/,
        use: { loader: path.join(__dirname, 'loaders', 'js'), options },
      },
      {
        test: /\.js$|\.jsx$/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['es2015', 'stage-0'],
            }
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          loader: 'css-loader?module&importLoaders=1!postcss-loader',
          options: {
            plugins: [],
          },
        })
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.THEME': JSON.stringify(options.src.name),
      'process.env.THEME_PATH': JSON.stringify(options.src.abs),
    }),
    new ExtractTextPlugin(`${options.out.rel}/styles.css`),
    new WatchFilePlugin(options),
    new WriteFilePlugin({
      test: new RegExp(`\.(${options.extensions.join('|')})$`),
      output: options.out,
      log: false,
    }),
  ],
});
