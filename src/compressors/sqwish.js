/*!
 * node-minify
 * Copyright(c) 2011-2017 Rodolphe Stoclin
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

import sqwish from 'sqwish';
import { utils } from '../utils';

/**
 * Run sqwish.
 *
 * @param {Object} settings
 * @param {String} content
 * @param {Function} callback
 */

function compressSqwish(settings, content, callback) {
  const contentMinified = sqwish.minify(content, settings.options.strict);
  utils.writeFile(settings.output, contentMinified);
  if (callback) {
    return callback(null, contentMinified);
  }
  return contentMinified;
}

/**
 * Expose `compressSqwish()`.
 */

export { compressSqwish };
