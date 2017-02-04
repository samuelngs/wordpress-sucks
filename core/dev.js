
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const { onError, onProxyReq, onProxyRes } = require('./dev.proxy');
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
      target: `http://${process.env.WP_TARGET_HOST || 0}:${process.env.WP_TARGET_PORT || 80}`,
      secure: false,
      xfwd: true,
      autoRewrite: true,
      hostRewrite: `${process.env.WP_PROXY_HOST || 'localhost'}:${process.env.WP_PROXY_PORT || 5001}`,
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
  dev.listen(process.env.WP_PROXY_PORT || 5001, process.env.WP_PROXY_ADDR || '127.0.0.1', err => {
    console.log(`Server running on port ${process.env.WP_PROXY_PORT || 5001}`);
  });
}
