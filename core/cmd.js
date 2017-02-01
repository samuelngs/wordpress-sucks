
const fs = require('fs');
const path = require('path');

const dev = require('./dev');
const prod = require('./prod');

const args = process.argv.slice(2);
const production = !!~args.indexOf('--production');
const theme = args.indexOf('--theme') > -1 && args[args.indexOf('--theme') + 1] || 'default';

const themePath = path.join(__dirname, '..', 'themes', theme);

if (~theme.indexOf('--')) {
  console.error('--theme parameter is missing');
  return;
}

if (!fs.existsSync(themePath)) {
  console.error(`'${theme}' theme does not exist`);
  return;
}

const fn = production ? prod : dev;

fn(theme, themePath);
