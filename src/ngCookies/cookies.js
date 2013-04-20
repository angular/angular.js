'use strict';

/**
 * @ngdoc overview
 * @name ngCookies
 */

var $cookieOptionsHash = {};

angular.module('ngCookies', ['ng']).
  /**
   * @ngdoc object
   * @name ngCookies.$cookies
   * @requires $browser
   *
   * @description
   * The '$cookies' service exposes the browser's cookies as a simple Object (I.E. dictionary/hashmap).
   * Allowing read/write operations on cookies to work similar to changing an object's variables
   * where each variable is a different cookie.
   *
   * The $cookies  object acts as a cache for the actual cookies, which flushes at the end of the current $eval.
   * That is, if you change a value of a cookie in $cookie, it will be written to the browser at the end of the $eval.
   *
     * @example
     <example module="ngCookies">
       <file name="index.html">
         <div ng-controller="CookieCtrl">
           <table>
             <caption>list of cookies</caption>
             <tr>
               <td>name</td>
               <td>value</td>
               <td></td>
             </tr>
             <tr ng-repeat="(key,value) in cookies">
                 <td>{{key}}</td>
                 <td><input type="text" ng-model="cookies[key]"</td>
                 <td><button ng-click="deleteCookie(key)">Delete</button></td>                 
             </tr>
           </table>
           <div>
           add new cookie:
           <form ng-submit="addCookie()">
             <input type="text" ng-model="newCookieName" placeholder="new cookie name">
             <input type="text" ng-model="newCookieValue" placeholder="new cookie value">
             <input type="submit" value="add">
           </form>
           </div>
         </div>
       </file>
       <file name="cookies.js">
         function CookieCtrl($scope,$cookies) {
           $scope.cookies = $cookies
           $scope.addCookie = function() {
             $cookies[$scope.newCookieName] = $scope.newCookieValue;
           }
           $scope.deleteCookie = function(key) {
             delete $cookies[key]
           }
         }
       </file>
     </example>
   * # Cookie defaults
   * when using the $cookie service, any cookies added/updated will be created with the following options:
   *   - if a base tag exists, then the path will be set to the base tag's href path. otherwise the path will be /.
   *   - no expiration date is passed, so all cookies set using $cookies will expire at end of session.   *
   * # Interoperability Considerations
   * It is not advised to access or modify the browsers cookies directly when using the $cookies service
   * on the same cookie, since the $cookie service caches changes and only flushes them at the end of the current $eval, 
   * interdependency is not predictable.
   * Also note that changes made directly to the cookie will only appear in the $cookie cache after 100ms and not at
   * the end of the current $eval (as opposed to changes made through the $cookie service) 
   */
   factory('$cookies', ['$rootScope', '$browser', function ($rootScope, $browser) {
      var cookies = {},
          lastCookies = {},
          lastBrowserCookies,
          runEval = false,
          copy = angular.copy,
          isUndefined = angular.isUndefined;

      //creates a poller fn that copies all cookies from the $browser to service & inits the service
      $browser.addPollFn(function() {
        var currentCookies = $browser.cookies();
        if (lastBrowserCookies != currentCookies) { //relies on browser.cookies() impl
          lastBrowserCookies = currentCookies;
          copy(currentCookies, lastCookies);
          copy(currentCookies, cookies);
          if (runEval) $rootScope.$apply();
        }
      })();

      runEval = true;

      //at the end of each eval, push cookies
      //TODO: this should happen before the "delayed" watches fire, because if some cookies are not
      //      strings or browser refuses to store some cookies, we update the model in the push fn.
      $rootScope.$watch(push);

      return cookies;


      /**
       * Pushes all the cookies from the service to the browser and verifies if all cookies were stored.
       */
      function push() {
        var name,
            value,
            browserCookies,
            updated;

        //delete any cookies deleted in $cookies
        for (name in lastCookies) {
          if (isUndefined(cookies[name])) {
            updated = true;
            $browser.cookies(name, undefined,$cookieOptionsHash[name]);
            delete $cookieOptionsHash[name];
          }
        }

        //update all cookies updated in $cookies
        for(name in cookies) {
          value = cookies[name];
          if (!angular.isString(value)) {
            if (angular.isDefined(lastCookies[name])) {
              cookies[name] = lastCookies[name];
            } else {
              //delete cookie who value was put as undefined, $browser already updated
              delete cookies[name];
            }
          } else if (value !== lastCookies[name] || $cookieOptionsHash[name]) {
            $browser.cookies(name, value,$cookieOptionsHash[name]);
            delete $cookieOptionsHash[name];
            updated = true;
          }
        }

        //verify what was actually stored
        if (updated){
          updated = false;
          browserCookies = $browser.cookies();

          for (name in cookies) {
            if (cookies[name] !== browserCookies[name]) {
              //delete or reset all cookies that the browser dropped from $cookies
              if (isUndefined(browserCookies[name])) {
                delete cookies[name];
              } else {
                cookies[name] = browserCookies[name];
              }
              updated = true;
            }
          }
          copy(browserCookies, lastCookies);
        }
      }
    }]).


  /**
   * @ngdoc object
   * @name ngCookies.$cookieStore
   * @requires $cookies
   *
   * @description
   * Provides a key-value (string-object) storage, that is backed by session cookies.
   * Objects put or retrieved from this storage are automatically serialized or
   * deserialized by angular's toJson/fromJson.
   *
   * The service uses the $cookies service internally, so anything that applies to that service, applies here
   * unless otherwise mentioned.
   * Unlike the $cookies service, the $cookieStore service allows custom Path and expirationDate settions for cookies.
     * @example
     <example module="ngCookies">
       <file name="index.html">
         <div ng-controller="CookieCtrl">
           <table>
             <caption>User info</caption>
             <tr>
               <td>first name:</td>
               <td><input type="text" ng-model="details.firstName" value="{{details.firstName}}"></td>
             </tr>
             <tr>
               <td>last name:</td>
               <td><input type="text" ng-model="details.lastName" value="{{details.lastName}}"></td>
             </tr>
           </table>
           Click to reset cookie in :<input type="text" ng-model="cookieTimeout" value="{{cookieTimeout}}">
            milliseconds. <button ng-click="setExpire()" >submit</button>
         </div>
       </file>
       <file name="cookies.js">
         function CookieCtrl($scope,$cookieStore,$cookies) {
           $scope.details = $cookieStore.get("details") || {firstName:"hugo",lastName:"gogo"};
           $scope.cookieTimeout = 1000;
           $scope.$watch("details",function(newValue){
             $cookieStore.put("details",newValue);
           },true);
           $scope.setExpire = function() {	
             $cookieStore.put("details",$cookieStore.get("details"),{expires: calcDate($scope)});
             setTimeout(function(){
               $scope.details = $cookieStore.get("details") || {firstName:"hugo",lastName:"gogo"};
                 $scope.$apply()
             }, +$scope.cookieTimeout + 50);
           }
         }
         function calcDate($scope) {
             return new Date(new Date().getTime() + +$scope.cookieTimeout);
         }
       </file>
     </example>
   */
   factory('$cookieStore', ['$cookies', function($cookies) {

      return {
        /**
         * @ngdoc method
         * @name ngCookies.$cookieStore#get
         * @methodOf ngCookies.$cookieStore
         *
         * @description
         * Returns the value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {Object} Deserialized cookie value.
         */
        get: function(key) {
          var value = $cookies[key];
          if (!value) return value;
          return angular.fromJson(value);
        },

        /**
         * @ngdoc method
         * @name ngCookies.$cookieStore#put
         * @methodOf ngCookies.$cookieStore
         *
         * @description
         * Sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {Object} value Value to be stored.
         * @param {object} options Options for the cookie stored, if not passed uses default.
         *    - **expires** - `{date}` - date for cookie to expire.
         *      If not passed, the object is not a date or the date is in the past, the cookie expiration
         *      date will not be set, so that the cookie will expire at the end of the session.
         *    - **path** - `{string}` - the path to set the cookie on.
         *      Defaults to / (or base tag's href attribute, if base tag exists)
         */
        put: function(key, value,options) {
          $cookieOptionsHash[key] = options;
          $cookies[key] = angular.toJson(value);
        },

        /**
         * @ngdoc method
         * @name ngCookies.$cookieStore#remove
         * @methodOf ngCookies.$cookieStore
         *
         * @description
         * Remove given cookie
         *
         * @param {string} key Id of the key-value pair to delete.
         * @param {object} options Options for the cookie to be deleted.
         *    - **path** - `{string}` - the path to delete the cookie
         *      If not passed, all cookies that matche the key are deleted.
         */
        remove: function(key,options) {
          $cookieOptionsHash[key] = options;
          delete $cookies[key];
        }
      };

    }]);
