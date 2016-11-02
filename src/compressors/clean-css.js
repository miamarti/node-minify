/*!
 * node-minify
 * Copyright(c) 2011-2017 Rodolphe Stoclin
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

import CleanCSS from 'clean-css';
import { utils } from '../utils';

/**
 * Run clean-css.
 *
 * @param {Object} settings
 * @param {String} content
 * @param {Function} callback
 */

function compressCleanCSS(settings, content, callback) {
  const contentMinified = new CleanCSS(settings.options).minify(content).styles;
  utils.writeFile(settings.output, contentMinified);
  if (callback) {
    return callback(null, contentMinified);
  }
  return contentMinified;
}

/**
 * Expose `compressCleanCSS()`.
 */

export { compressCleanCSS };
