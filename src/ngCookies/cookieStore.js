'use strict';

angular.module('ngCookies').
  /**
   * @ngdoc service
   * @name $cookieStore
   * @requires $cookies
   *
   * @description
   * Provides a key-value (string-object) storage, that is backed by session cookies.
   * Objects put or retrieved from this storage are automatically serialized or
   * deserialized by angular's toJson/fromJson.
   *
   * Requires the {@link ngCookies `ngCookies`} module to be installed.
   *
   * @example
   *
   * ```js
   * angular.module('cookieStoreExample', ['ngCookies'])
   *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
   *     // Put cookie
   *     $cookieStore.put('myFavorite','oatmeal');
   *     // Get cookie
   *     var favoriteCookie = $cookieStore.get('myFavorite');
   *     // Removing a cookie
   *     $cookieStore.remove('myFavorite');
   *   }]);
   * ```
   */
   factory('$cookieStore', ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {

      return {
        /**
         * @ngdoc method
         * @name $cookieStore#get
         *
         * @description
         * Returns the value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {Object} Deserialized cookie value.
         */
        get: function(key) {
          var value = $$cookieReader()[key];
          return value ? angular.fromJson(value) : value;
        },

        /**
         * @ngdoc method
         * @name $cookieStore#getRaw
         *
         * @description
         * Returns the value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {string} Raw cookie value.
         */
        getRaw: function(key) {
          return $$cookieReader()[key];
        },

        /**
         * @ngdoc method
         * @name $cookieStore#getAll
         *
         * @description
         * Returns a key value object with all the cookies
         *
         * @returns {Object} All cookies
         */
        getAll: function() {
          return $$cookieReader();
        },

        /**
         * @ngdoc method
         * @name $cookieStore#put
         *
         * @description
         * Sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {Object} value Value to be stored.
         * @param {Object=} options Object with options that need to be stored for the cookie.
         *    The object may have following properties:
         *
         *    - **path** - `{string}` - The cookie will be available only for this path and its
         *      sub-paths. By default, this would be the URL that appears in your base tag.
         *    - **domain** - `{string}` - The cookie will be available only for this domain and
         *      its sub-domains. For obvious security reasons the user agent will not accept the
         *      cookie if the current domain is not a sub domain or equals to the requested domain.
         *    - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
         *      or a Date object indicating the exact date/time this cookie will expire.
         *    - **secure** - `{boolean}` - The cookie will be available only in secured connection.
         */
        put: function(key, value, options) {
          $$cookieWriter(key, angular.toJson(value), options);
        },

        /**
         * @ngdoc method
         * @name $cookieStore#putRaw
         *
         * @description
         * Sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {string} value Raw value to be stored.
         * @param {Object=} options Options object.
         */
        putRaw: function(key, value, options) {
          $$cookieWriter(key, value, options);
        },

        /**
         * @ngdoc method
         * @name $cookieStore#remove
         *
         * @description
         * Remove given cookie
         *
         * @param {string} key Id of the key-value pair to delete.
         */
        remove: function(key) {
          $$cookieWriter(key, undefined);
        }
      };

    }]);
