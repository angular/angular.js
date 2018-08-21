'use strict';

/* global routeToRegExp: true */

/**
 * @param pathOrUrl {string} path or url
 * @param opts {Object} options
 * @return {?Object}
 *
 * @description
 * Normalizes the given path, returning a regular expression
 * and the original path.
 *
 * Inspired by pathRexp in visionmedia/express/lib/utils.js.
 */
function routeToRegExp(pathOrUrl, opts) {
  var keys = [];

  var pattern = pathOrUrl
    .replace(/([().])/g, '\\$1')
    .replace(/(\/)?:(\w+)(\*\?|[?*])?/g, function(_, slash, key, option) {
      var optional = option === '?' || option === '*?';
      var star = option === '*' || option === '*?';
      keys.push({ name: key, optional: optional });
      slash = slash || '';
      return (
        (optional ? '(?:' + slash : slash + '(?:') +
        (opts.isUrl ? (star ? '([^?#]+?)' : '([^/?#]+)') : (star ? '(.+?)' : '([^/]+)')) +
        (optional ? '?)?' : ')')
      );
    })
    .replace(/([/$*])/g, '\\$1');

  if (opts.ignoreTrailingSlashes) {
    pattern = pattern.replace(/\/+$/, '') + '/*';
  }

  return {
    keys: keys,
    regexp: new RegExp(
      '^' + pattern + '(?:[?#]|$)',
      opts.caseInsensitiveMatch ? 'i' : ''
    )
  };
}
