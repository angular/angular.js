'use strict';

/**
 * @ngdoc object
 * @name angular.module.NG.$cookieStore
 * @requires $cookies
 *
 * @description
 * Provides a key-value (string-object) storage, that is backed by session cookies.
 * Objects put or retrieved from this storage are automatically serialized or
 * deserialized by angular's toJson/fromJson.
 * @example
 */
function $CookieStoreProvider(){
  this.$get = ['$cookies', function($cookies) {

    return {
      /**
       * @ngdoc method
       * @name angular.module.NG.$cookieStore#get
       * @methodOf angular.module.NG.$cookieStore
       *
       * @description
       * Returns the value of given cookie key
       *
       * @param {string} key Id to use for lookup.
       * @returns {Object} Deserialized cookie value.
       */
      get: function(key) {
        return fromJson($cookies[key]);
      },

      /**
       * @ngdoc method
       * @name angular.module.NG.$cookieStore#put
       * @methodOf angular.module.NG.$cookieStore
       *
       * @description
       * Sets a value for given cookie key
       *
       * @param {string} key Id for the `value`.
       * @param {Object} value Value to be stored.
       */
      put: function(key, value) {
        $cookies[key] = toJson(value);
      },

      /**
       * @ngdoc method
       * @name angular.module.NG.$cookieStore#remove
       * @methodOf angular.module.NG.$cookieStore
       *
       * @description
       * Remove given cookie
       *
       * @param {string} key Id of the key-value pair to delete.
       */
      remove: function(key) {
        delete $cookies[key];
      }
    };

  }];
}
