/*!
 * node-minify
 * Copyright(c) 2011-2017 Rodolphe Stoclin
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

import gcc from 'google-closure-compiler-js';
import { utils } from '../utils';
// the allowed flags, taken from https://github.com/google/closure-compiler-js
const allowedFlags = [
  'angularPass',
  'applyInputSourceMaps',
  'assumeFunctionWrapper',
  'checksOnly',
  'compilationLevel',
  'createSourceMap',
  'dartPass',
  'defines',
  'env',
  'externs',
  'exportLocalPropertyDefinitions',
  'generateExports',
  'languageIn',
  'languageOut',
  'newTypeInf',
  'outputWrapper',
  'polymerVersion',
  'preserveTypeAnnotations',
  'processCommonJsModules',
  'renamePrefixNamespace',
  'rewritePolyfills',
  'useTypesForOptimization',
  'warningLevel'
];

/**
 * Run Google Closure Compiler.
 *
 * @param {Object} settings
 * @param {String} content
 * @param {Function} callback
 */

function compressGCCJS(settings, content, callback) {
  let flags = { jsCode: [{ src: content }] };
  flags = applyOptions(flags, settings.options);
  const contentMinified = gcc.compile(flags);
  utils.writeFile(settings.output, contentMinified.compiledCode);
  if (callback) {
    return callback(null, contentMinified.compiledCode);
  }
  return contentMinified.compiledCode;
}

/**
 * Adds any valid options passed in the options parameters to the flags parameter and returns the flags object.
 * @param {Object} flags
 * @param {Object} options
 * @returns {Object} flags
 */

function applyOptions(flags, options) {
  if (!options || Object.keys(options).length === 0) {
    return flags;
  }
  Object.keys(options)
    .filter(function(option) {
      return allowedFlags.indexOf(option) > -1;
    })
    .forEach(function(option) {
      return (flags[option] = options[option]);
    });
  return flags;
}

/**
 * Expose `compressGCCJS()`.
 */

export { compressGCCJS };
