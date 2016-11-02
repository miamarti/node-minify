/*!
 * node-minify
 * Copyright(c) 2011-2017 Rodolphe Stoclin
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

import { deprecated } from './deprecated';
import { setup } from './setup';
import { compress } from './compress';

/**
 * Run node-minify.
 *
 * @param {Object} settings - Settings from user input
 */

const minify = settings => {
  deprecated(settings);
  return new Promise(function(resolve, reject) {
    settings = setup(settings);
    if (!settings.sync) {
      compress(settings)
        .then(min => {
          if (settings.callback) {
            settings.callback(null, min);
          }
          resolve(min);
        })
        .catch(function(err) {
          if (settings.callback) {
            settings.callback(err);
          }
          reject(err);
        });
    } else {
      const min = compress(settings);
      if (settings.callback) {
        settings.callback(null, min);
      }
      resolve(min);
    }
  });
};

export { minify };
