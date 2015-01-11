'use strict';

/**
 * @name $$cookieWriter
 * @requires $document
 *
 * @description
 * This is a private service for writing cookies
 *
 * @param {string} name Cookie name
 * @param {string=} value Cookie value (if undefined, cookie will be deleted)
 * @param {Object=} options Object with options that need to be stored for the cookie.
 */
function $$CookieWriter($document, $log, $browser) {
  var cookiePath = $browser.baseHref();
  var rawDocument = $document[0];

  function buildCookieString(name, value, options) {
    options = angular.extend({path: cookiePath}, options);
    if (value === undefined) {
      options.expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
      value = '';
    }
    if (angular.isString(options.expires)) {
      options.expires = new Date(options.expires);
    }

    var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    str += options.path ? ';path=' + options.path : '';
    str += options.domain ? ';domain=' + options.domain : '';
    str += options.expires ? ';expires=' + options.expires.toUTCString() : '';
    str += options.secure ? ';secure' : '';

    // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
    // - 300 cookies
    // - 20 cookies per unique domain
    // - 4096 bytes per cookie
    var cookieLength = str.length + 1;
    if (cookieLength > 4096) {
      $log.warn("Cookie '" + name +
        "' possibly not set or overflowed because it was too large (" +
        cookieLength + " > 4096 bytes)!");
    }

    return str;
  }

  return function(name, value, options) {
    rawDocument.cookie = buildCookieString(name, value, options);
  };
}

$$CookieWriter.$inject = ['$document', '$log', '$browser'];

angular.module('ngCookies').provider('$$cookieWriter', function $$CookieWriterProvider() {
  this.$get = $$CookieWriter;
});
