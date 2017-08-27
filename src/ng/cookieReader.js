'use strict';

/**
 * @name $$cookieReader
 * @requires $document
 *
 * @description
 * This is a private service for reading cookies used by $http and ngCookies
 *
 * @return {Object} a key/value map of the current cookies
 */
function $$CookieReader($document) {
  var rawDocument = $document[0] || {};
  var lastCookies = {};
  var lastCookieString = '';

  function safeGetCookie(rawDocument) {
    try {
      return rawDocument.cookie || '';
    } catch (e) {
      return '';
    }
  }

  function safeDecodeURIComponent(str) {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      return str;
    }
  }

  return function() {
    var cookieArray, cookie, i, index, name;
    var currentCookieString = safeGetCookie(rawDocument);

    if (currentCookieString !== lastCookieString) {
      lastCookieString = currentCookieString;
      cookieArray = lastCookieString.split('; ');
      lastCookies = {};

      for (i = 0; i < cookieArray.length; i++) {
        cookie = cookieArray[i];
        index = cookie.indexOf('=');
        if (index > 0) { //ignore nameless cookies
          name = safeDecodeURIComponent(cookie.substring(0, index));
          // the first value that is seen for a cookie is the most
          // specific one.  values for the same cookie name that
          // follow are for less specific paths.
          if (isUndefined(lastCookies[name])) {
            lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1));
          }
        }
      }
    }
    return lastCookies;
  };
}

$$CookieReader.$inject = ['$document'];

/** @this */
function $$CookieReaderProvider() {
  this.$get = $$CookieReader;
}
