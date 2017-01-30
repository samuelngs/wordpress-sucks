
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const webpackDevConfig = {
  hot: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'SourceMap,X-SourceMap',
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: false,
  },
  historyApiFallback: true,
  inline: true,
  quiet: false,
  noInfo: false,
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    warnings: false,
    chunkModules: false,
  },
  outputPath: __dirname,
};

module.exports = () => {
  return new webpackDevServer(webpack([
  ]), webpackDevConfig).listen(5001, '0.0.0.0', err => {
  });
}
