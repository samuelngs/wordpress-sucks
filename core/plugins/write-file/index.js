
const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const dir = require('node-dir');

/**
 * When 'webpack' program is used, constructor name is equal to 'NodeOutputFileSystem'.
 * When 'webpack-dev-server' program is used, constructor name is equal to 'MemoryFileSystem'.
 */
const isMemoryFileSystem = (outputFileSystem) => {
  return outputFileSystem.constructor.name === 'MemoryFileSystem';
};

module.exports = function (userOptions = {}) {

  const options = _.assign({}, {
    exitOnErrors: true,
    force: false,
    log: true,
    test: null,
    output: null,
    useHashIndex: true
  }, userOptions);

  if (!_.isNull(options.test) && !_.isRegExp(options.test)) {
    throw new Error('options.test value must be an instance of RegExp.');
  }

  if (!_.isBoolean(options.useHashIndex)) {
    throw new Error('options.useHashIndex value must be of boolean type.');
  }

  if (!_.isBoolean(options.log)) {
    throw new Error('options.log value must be of boolean type.');
  }

  if (!_.isBoolean(options.exitOnErrors)) {
    throw new Error('options.exitOnErrors value must be of boolean type.');
  }

  if (!_.isBoolean(options.force)) {
    throw new Error('options.force value must be of boolean type.');
  }

  const log = (...append) => {
    if (!options.log) {
      return;
    }

    // eslint-disable-next-line no-console
    console.log('[write-file-webpack-plugin]', ...append);
  };

  const assetSourceHashIndex = {};

  log('options', options);

  const apply = (compiler) => {
    let outputPath,
      setupDone,
      setupStatus;

    const setup = () => {
      if (setupDone) {
        return setupStatus;
      }

      setupDone = true;

      log('compiler.outputFileSystem is "' + compiler.outputFileSystem.constructor.name + '".');

      if (!isMemoryFileSystem(compiler.outputFileSystem) && !options.force) {
        return false;
      }

      // https://github.com/gajus/write-file-webpack-plugin/issues/1
      // `compiler.options.output.path` will be hardcoded to '/' in
      // webpack-dev-server's command line wrapper. So it should be
      // ignored here.
      if (_.has(compiler, 'options.output.path') && compiler.options.output.path !== '/') {
        outputPath = compiler.options.output.path;
      }

      if (!outputPath) {
        outputPath = path.join(__dirname, '..', '..', '..');
      }

      log('compiler.options.devServer.outputPath is "' + outputPath + '".');

      setupStatus = true;

      return setupStatus;
    };

    compiler.plugin('done', (stats) => {
      if (!setup()) {
        return;
      }

      if (options.exitOnErrors && stats.compilation.errors.length) {
        return;
      }

      log('stats.compilation.errors.length is "' + stats.compilation.errors.length + '".');

      dir.files(options.output.abs, (err, tree) => {
        if (err) {
          log('stats.compilation.error: "' + err + '".');
          return;
        }

        const outputFilePaths = Object.keys(stats.compilation.assets);
        const clean = tree.map(file => path.join(options.output.rel, path.relative(options.output.abs, file))).filter(file => outputFilePaths.indexOf(file) === -1);

        _.forEach(stats.compilation.assets, (asset, assetPath) => {
          const outputFilePath = path.join(outputPath, assetPath);
          const relativeOutputPath = path.relative(process.cwd(), outputFilePath);
          const targetDefinition = 'asset: ' + './' + assetPath + '; destination: ' + './' + relativeOutputPath;

          if (options.test && !options.test.test(assetPath) || assetPath.indexOf('.hot-update.json') > -1) {
            log(targetDefinition, '[skipped; does not match test]');

            return;
          }

          const assetSize = asset.size();
          const assetSource = asset.source();

          if (options.useHashIndex) {
            const assetSourceHash = createHash('sha256').update(assetSource).digest('hex');

            if (assetSourceHashIndex[assetPath] && assetSourceHashIndex[assetPath] === assetSourceHash && fs.existsSync(assetPath)) {
              log(targetDefinition, '[skipped; matched hash index]');

              return;
            }

            assetSourceHashIndex[assetPath] = assetSourceHash;
          }

          const filename = relativeOutputPath.split('?')[0];

          if (filename.indexOf('.hot-update.js') > -1 || filename.indexOf('/node_modules/') > -1) {
            log(targetDefinition, '[skipped; file ignored]');
            return;
          }

          log(targetDefinition, '[written]');

          mkdirp.sync(path.dirname(relativeOutputPath));

          fs.writeFileSync(filename, assetSource);
        });

        _.forEach(clean, file => {
          const targetDefinition = 'asset: ' + './' + file;
          const relativeOutputPath = path.relative(process.cwd(), file);

          if (fs.existsSync(relativeOutputPath.split('?')[0])) {
            log(targetDefinition, '[deleted]');

            fs.unlinkSync(relativeOutputPath.split('?')[0]);
          }
        });

      });

    });
  };

  return {
    apply
  };
};
