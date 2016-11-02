/*!
 * node-minify
 * Copyright(c) 2011-2017 Rodolphe Stoclin
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

import { squash } from 'butternut';
import { utils } from '../utils';

/**
 * Run butternut.
 *
 * @param {Object} settings
 * @param {String} content
 * @param {Function} callback
 */

function compressButternut(settings, content, callback) {
  const contentMinified = squash(content, settings.options);
  if (contentMinified.map && settings.options.sourceMap) {
    utils.writeFile(settings.output + '.map', contentMinified.map);
  }
  utils.writeFile(settings.output, contentMinified.code);
  if (callback) {
    return callback(null, contentMinified.code);
  }
  return contentMinified.code;
}

/**
 * Expose `compressButternut()`.
 */

export { compressButternut };
