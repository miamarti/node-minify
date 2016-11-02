/*!
 * node-minify
 * Copyright(c) 2011-2017 Rodolphe Stoclin
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

import { utils } from '../utils';

/**
 * Just merge, no compression.
 *
 * @param {Object} settings
 * @param {String} content
 * @param {Function} callback
 */

function noCompress(settings, content, callback) {
  utils.writeFile(settings.output, content);
  if (callback) {
    return callback(null, content);
  }
  return content;
}

/**
 * Expose `noCompress()`.
 */

export { noCompress };
