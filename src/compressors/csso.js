/*!
 * node-minify
 * Copyright(c) 2011-2017 Rodolphe Stoclin
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

import csso from 'csso';
import { utils } from '../utils';

/**
 * Run csso.
 *
 * @param {Object} settings
 * @param {String} content
 * @param {Function} callback
 */

function compressCSSO(settings, content, callback) {
  const contentMinified = csso.minify(content, settings.options.restructureOff);
  utils.writeFile(settings.output, contentMinified.css);
  if (callback) {
    return callback(null, contentMinified.css);
  }
  return contentMinified.css;
}

/**
 * Expose `compressCSSO()`.
 */

export { compressCSSO };
