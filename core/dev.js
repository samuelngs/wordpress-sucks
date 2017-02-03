
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const { onError, onProxyRes } = require('./dev.proxy');
const wordpress = require('./dev.wordpress');

const webpackDevConfig = {
  hot: true,
  compress: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'SourceMap,X-SourceMap',
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: false,
  },
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
  proxy: [
    {
      path: '**',
      target: 'http://0:8080',
      secure: false,
      changeOrigin: true,
      onError,
      onProxyRes,
    }
  ],
};

module.exports = (options) => {
  const compiler = Webpack([
    wordpress(options),
  ]);
  const dev = new WebpackDevServer(compiler, webpackDevConfig);
  dev.listen(5001, '127.0.0.1', err => {
    console.log('Server running on port 5001');
  });
}
