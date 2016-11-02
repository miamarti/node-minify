/*!
 * node-minify
 * Copyright(c) 2011-2017 Rodolphe Stoclin
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

import fs from 'fs';
import mkdirp from 'mkdirp';
import { utils } from './utils';
import { compressBabelMinify } from './compressors/babel-minify';
import { compressButternut } from './compressors/butternut';
import { compressCleanCSS } from './compressors/clean-css';
import { compressCSSO } from './compressors/csso';
let gcc;
import { compressGCC } from './compressors/gcc-java';
import { noCompress } from './compressors/no-compress';
import { compressSqwish } from './compressors/sqwish';
import { compressUglifyJS } from './compressors/uglifyjs';
import { compressYUI } from './compressors/yui';

if ((process.execArgv && process.execArgv.indexOf('--use_strict') > -1) || !utils.isNodeV4AndHigher()) {
  gcc = require('./compressors/gcc-java').compressGCC;
} else {
  gcc = require('./compressors/gcc').compressGCCJS;
}

/**
 * Mapping input compressors to functions
 * to be executed
 */

const compressorsMap = {
  'babel-minify': compressBabelMinify,
  butternut: compressButternut,
  yui: (settings, data, callback) => {
    return compressYUI('css', settings, data, callback);
  },
  'yui-css': (settings, data, callback) => {
    return compressYUI('css', settings, data, callback);
  },
  'yui-js': (settings, data, callback) => {
    return compressYUI('js', settings, data, callback);
  },
  gcc: gcc,
  'gcc-java': (settings, data, callback) => {
    return compressGCC(settings, data, callback, false);
  },
  'gcc-legacy': (settings, data, callback) => {
    return compressGCC(settings, data, callback, true);
  },
  uglifyjs: compressUglifyJS,
  sqwish: compressSqwish,
  'clean-css': compressCleanCSS,
  csso: compressCSSO,
  'no-compress': noCompress,
  /**
   * @deprecated since version 2.4.0 - babili was renamed to babel-minify
   */
  babili: compressBabelMinify
};

/**
 * Run compressor.
 *
 * @param {Object} settings
 */

const compress = settings => {
  if (typeof compressorsMap[settings.compressor] !== 'function') {
    throw new Error('Type "' + settings.compressor + '" does not exist');
  }

  createDirectory(settings.output);
  const content = getContentFromFiles(settings.input);
  return settings.sync ? runSync(settings, content) : runAsync(settings, content);
};

/**
 * Run compressor in sync.
 *
 * @param {Object} settings
 * @param {String} content
 * @return {String}
 */

function runSync(settings, content) {
  return compressorsMap[settings.compressor](settings, content);
}

/**
 * Run compressor in async.
 *
 * @param {Object} settings
 * @param {String} content
 * @return {Promise}
 */

function runAsync(settings, content) {
  return new Promise(function(resolve, reject) {
    compressorsMap[settings.compressor](settings, content, function(err, min) {
      if (err) {
        return reject(err);
      }
      resolve(min);
    });
  });
}

/**
 * Concatenate all input files and get the data.
 *
 * @param {String|Array} input
 * @return {String}
 */

const getContentFromFiles = input => {
  if (!Array.isArray(input)) {
    return fs.readFileSync(input, 'utf8');
  }

  return input
    .map(function(path) {
      return fs.readFileSync(path, 'utf8');
    })
    .join('\n');
};

/**
 * Create folder of the target file.
 *
 * @param {String} file - Full path of the file
 */

const createDirectory = file => {
  mkdirp.sync(file.substr(0, file.lastIndexOf('/')));
};

/**
 * Expose `compress()`.
 */

export { compress };
