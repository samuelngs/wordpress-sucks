
const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const WriteFilePlugin = require('./plugins/write-file');

module.exports = (options) => ({
  name: 'wordpress',
  target: 'web',
  context: options.src.abs,
  devtool: 'eval',
  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:5001',
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'client.js'),
  ],
  output: {
    filename: `${options.out.rel}/client.js`,
    publicPath: `/`,
  },
  module: {
    rules: [
      {
        test: /\.resource$/,
        use: { loader: path.join(__dirname, 'loaders', 'resource'), options },
        exclude: /node_modules/,
      },
      {
        test: /\.(ttf|otf|eot|woff|woff2|svg|ico|webm|mp4|ogg|png|jpg|jpeg|gif|webp)$/,
        use: { loader: path.join(__dirname, 'loaders', 'binary'), options },
        exclude: /node_modules/,
      },
      {
        test: /\.(php|twig)$/,
        use: { loader: path.join(__dirname, 'loaders', 'php'), options },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: { loader: path.join(__dirname, 'loaders', 'css'), options },
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        use: { loader: path.join(__dirname, 'loaders', 'js'), options },
        exclude: /node_modules/,
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
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.THEME': JSON.stringify(options.src.name),
      'process.env.THEME_PATH': JSON.stringify(options.src.abs),
    }),
    new ExtractTextPlugin(`${options.out.rel}/styles.css`),
    new WriteFilePlugin({
      test: new RegExp(`\.(${options.extensions.join('|')})$`),
      output: options.out,
      log: false,
    }),
  ],
});
