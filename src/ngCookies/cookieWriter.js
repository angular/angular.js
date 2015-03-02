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
 */
function $$CookieWriter($document, $log, $browser) {
  var cookiePath = $browser.baseHref();
  var rawDocument = $document[0];

  return function(name, value) {
    if (value === undefined) {
      rawDocument.cookie = encodeURIComponent(name) + "=;path=" + cookiePath +
                              ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } else {
      if (angular.isString(value)) {
        var cookieLength = (rawDocument.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) +
                              ';path=' + cookiePath).length + 1;

        // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
        // - 300 cookies
        // - 20 cookies per unique domain
        // - 4096 bytes per cookie
        if (cookieLength > 4096) {
          $log.warn("Cookie '" + name +
            "' possibly not set or overflowed because it was too large (" +
            cookieLength + " > 4096 bytes)!");
        }
      }
    }
  };
}

$$CookieWriter.$inject = ['$document', '$log', '$browser'];

angular.module('ngCookies').provider('$$cookieWriter', function $$CookieWriterProvider() {
  this.$get = $$CookieWriter;
});
