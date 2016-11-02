/*!
 * node-minify
 * Copyright(c) 2011-2017 Rodolphe Stoclin
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

const deprecate = require('depd')('node-minify');

/**
 * Deprecate some old syntax.
 *
 * @param {Object} settings
 */

const deprecated = settings => {
  if (settings.type) {
    deprecate('type was renamed to compressor');
  }

  if (settings.fileIn) {
    deprecate('fileIn was renamed to input');
  }

  if (settings.fileOut) {
    deprecate('fileOut was renamed to output');
  }

  if (settings.compressor === 'babili') {
    deprecate('babili was renamed to babel-minify');
  }
};

/**
 * Expose `deprecated()`.
 */

export { deprecated };
