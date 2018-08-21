'use strict';

/* global routeToRegExp: true */

/**
 * @param {string} path - The path to parse. (It is assumed to have query and hash stripped off.)
 * @param {Object} opts - Options.
 * @return {Object} - An object containing an array of path parameter names (`keys`) and a regular
 *     expression (`regexp`) that can be used to identify a matching URL and extract the path
 *     parameter values.
 *
 * @description
 * Parses the given path, extracting path parameter names and a regular expression to match URLs.
 *
 * Originally inspired by `pathRexp` in `visionmedia/express/lib/utils.js`.
 */
function routeToRegExp(path, opts) {
  var keys = [];

  var pattern = path
    .replace(/([().])/g, '\\$1')
    .replace(/(\/)?:(\w+)(\*\?|[?*])?/g, function(_, slash, key, option) {
      var optional = option === '?' || option === '*?';
      var star = option === '*' || option === '*?';
      keys.push({name: key, optional: optional});
      slash = slash || '';
      return (
        (optional ? '(?:' + slash : slash + '(?:') +
        (star ? '(.+?)' : '([^/]+)') +
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
