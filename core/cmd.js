
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const dev = require('./dev');
const prod = require('./prod');

const args = process.argv.slice(2);
const production = !!~args.indexOf('--production');
const theme = args.indexOf('--theme') > -1 && args[args.indexOf('--theme') + 1] || 'default';

const options = {
  extensions: [
    'ttf', 'otf', 'eot', 'woff', 'woff2',
    'svg', 'ico', 'webm', 'mp4', 'ogg', 'png', 'jpg', 'jpeg', 'gif', 'webp',
    'css', 'less', 'sass',
    'js', 'jsx',
    'php', 'twig',
  ],
  pwd: path.join(__dirname, '..'),
  src: {
    name: theme,
    rel: path.join('theme'),
    abs: path.join(__dirname, '..', 'theme'),
  },
  out: {
    name: theme,
    rel: path.join('wp-content', 'themes', theme),
    abs: path.join(__dirname, '..', 'wp-content', 'themes', theme),
  },
};

if (~theme.indexOf('--')) {
  console.error('--theme parameter is missing');
  return;
}

if (!fs.existsSync(options.src.abs)) {
  console.error(`'theme' folder does not exist`);
  return;
}

if (!fs.existsSync(path.join(options.src.abs, 'theme.resource'))) {
  console.error(`resource file 'theme.resource' does not exist`);
  return;
}

if (!fs.existsSync(options.out.abs)) {
  mkdirp.sync(options.out.abs);
}

const fn = production ? prod : dev;

fn(options);
