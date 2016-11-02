/*!
 * node-minify
 * Copyright(c) 2011-2017 Rodolphe Stoclin
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

import path from 'path';
import { utils } from '../utils';
import { runCommandLine } from '../runner';

/**
 * Module variables.
 */
const binGcc = path.normalize(__dirname + '/../binaries/google_closure_compiler-v20151216.jar');
const binGccLegacy = path.normalize(__dirname + '/../binaries/google_closure_compiler-v20131014-legacy-java-1.6.jar');

/**
 * Run Google Closure Compiler.
 *
 * @param {Object} settings
 * @param {String} content
 * @param {Boolean} legacy
 * @param {Function} callback
 */

function compressGCC(settings, content, callback, legacy) {
  return runCommandLine(gccCommand(settings.options, legacy), content, settings, function(err, contentMinified) {
    if (err) {
      return handleErrors(err, callback);
    }
    utils.writeFile(settings.output, contentMinified);
    if (callback) {
      return callback(null, contentMinified);
    }
    return contentMinified;
  });
}

function handleErrors(err, callback) {
  let message = null;
  if (err.message.indexOf('UnsupportedClassVersionError') > -1) {
    message = 'Latest Google Closure Compiler requires Java >= 1.7, please update Java or use gcc-legacy';
  }

  if (callback) {
    return callback(message || err);
  } else {
    throw message || err;
  }
}

/**
 * Google Closure Compiler command line.
 */

function gccCommand(options, legacy) {
  return [
    '-server',
    '-XX:+TieredCompilation',
    '-jar',
    '-Xss2048k',
    legacy ? binGccLegacy : binGcc,
    '--warning_level',
    'QUIET'
  ].concat(utils.buildArgs(options));
}

/**
 * Expose `compressGCC()`.
 */

export { compressGCC };
