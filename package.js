/* eslint strict: 0, no-shadow: 0, no-unused-vars: 0, no-console: 0 */
'use strict';

var os = require('os');
var webpack = require('webpack');
var cfg = require('./webpack.config.production.js');
var packager = require('electron-packager');
var del = require('del');
var exec = require('child_process').exec;
var argv = require('minimist')(process.argv.slice(2));
var pkg = require('./package.json');
var devDeps = Object.keys(pkg.devDependencies);

var appName = argv.name || argv.n || pkg.productName;
var shouldUseAsar = argv.asar || argv.a || true;
var shouldBuildAll = argv.all || false;


var DEFAULT_OPTS = {
  dir: './',
  name: appName,
  asar: shouldUseAsar,
  ignore: [
    '/test($|/)',
    '/tools($|/)',
    '/release($|/)'
  ].concat(devDeps.map(function(name) { return '/node_modules/' + name + '($|/)';}))
};

var icon = argv.icon || argv.i || 'app/app';

if (icon) {
  DEFAULT_OPTS.icon = icon;
}

var version = argv.version || argv.v;

if (version) {
  DEFAULT_OPTS.electronVersion = version;
  startPack();
} else {
  // use the same version as the currently-installed electron-prebuilt
  exec('npm list electron-prebuilt', function(err, stdout) {
    if (err) {
      DEFAULT_OPTS.electronVersion = '0.37.2';
    } else {
      DEFAULT_OPTS.electronVersion = stdout.split('electron-prebuilt@')[1].replace(/\s/g, '');
    }

    startPack();
  });
}


function startPack() {
  console.log('start pack...');
  webpack(cfg, function(err, stats) {
    if (err) return console.error(err);
    del('release')
    .then(function(paths) {
      if (shouldBuildAll) {
        // build for all platforms
        var archs = ['ia32', 'x64'];
        var platforms = ['linux', 'win32', 'darwin'];

        platforms.forEach(function(plat) {
          archs.forEach(function(arch) {
            pack(plat, arch, log(plat, arch));
          });
        });
      } else {
        // build for current platform only
        pack(os.platform(), os.arch(), log(os.platform(), os.arch()));
      }
    })
    .catch(function(err) {
      console.error(err);
    });
  });
}

function pack(plat, arch, cb) {

  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') return;

  var currentExtension = function () {
    var extension = '.png';
    if (plat === 'darwin') {
      extension = '.icns';
    } else if (plat === 'win32') {
      extension = '.ico';
    }
    return extension;
  }();

  var iconObj = {
    icon: DEFAULT_OPTS.icon + currentExtension
  };

  var opts = Object.assign({}, DEFAULT_OPTS, iconObj, {
    platform: plat,
    arch: arch,
    prune: true,
    appVersion: pkg.version || DEFAULT_OPTS.electronVersion,
    out: 'release/' + plat + '-' + arch
  });

  packager(opts, cb);
}


function log(plat, arch) {
  return function(err, filepath) {
    if (err) return console.error(err);
    console.log(plat + '-' + arch + ' finished!');
  };
}
