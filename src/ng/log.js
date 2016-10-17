'use strict';

/**
 * @ngdoc service
 * @name $log
 * @requires $window
 *
 * @description
 * Simple service for logging. Default implementation safely writes the message
 * into the browser's console (if present).
 *
 * The main purpose of this service is to simplify debugging and troubleshooting.
 *
 * The default is to log `debug` messages. You can use
 * {@link ng.$logProvider ng.$logProvider#debugEnabled} to change this.
 *
 * @example
   <example module="logExample" name="log-service">
     <file name="script.js">
       angular.module('logExample', [])
         .controller('LogController', ['$scope', '$log', function($scope, $log) {
           $scope.$log = $log;
           $scope.message = 'Hello World!';
         }]);
     </file>
     <file name="index.html">
       <div ng-controller="LogController">
         <p>Reload this page with open console, enter text and hit the log button...</p>
         <label>Message:
         <input type="text" ng-model="message" /></label>
         <button ng-click="$log.log(message)">log</button>
         <button ng-click="$log.warn(message)">warn</button>
         <button ng-click="$log.info(message)">info</button>
         <button ng-click="$log.error(message)">error</button>
         <button ng-click="$log.debug(message)">debug</button>
       </div>
     </file>
   </example>
 */

/**
 * @ngdoc provider
 * @name $logProvider
 * @this
 *
 * @description
 * Use the `$logProvider` to configure how the application logs messages
 */
function $LogProvider() {
  var debug = true,
      self = this;

  /**
   * @ngdoc method
   * @name $logProvider#debugEnabled
   * @description
   * @param {boolean=} flag enable or disable debug level messages
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.debugEnabled = function(flag) {
    if (isDefined(flag)) {
      debug = flag;
    return this;
    } else {
      return debug;
    }
  };

  this.$get = ['$window', function($window) {
    return {
      /**
       * @ngdoc method
       * @name $log#log
       *
       * @description
       * Write a log message
       */
      log: consoleLog('log'),

      /**
       * @ngdoc method
       * @name $log#info
       *
       * @description
       * Write an information message
       */
      info: consoleLog('info'),

      /**
       * @ngdoc method
       * @name $log#warn
       *
       * @description
       * Write a warning message
       */
      warn: consoleLog('warn'),

      /**
       * @ngdoc method
       * @name $log#error
       *
       * @description
       * Write an error message
       */
      error: consoleLog('error'),

      /**
       * @ngdoc method
       * @name $log#debug
       *
       * @description
       * Write a debug message
       */
      debug: (function() {
        var fn = consoleLog('debug');

        return function() {
          if (debug) {
            fn.apply(self, arguments);
          }
        };
      })()
    };

    function formatError(arg) {
      if (arg instanceof Error) {
        if (arg.stack) {
          arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
              ? 'Error: ' + arg.message + '\n' + arg.stack
              : arg.stack;
        } else if (arg.sourceURL) {
          arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
        }
      }
      return arg;
    }

    function consoleLog(type) {
      var console = $window.console || {},
          logFn = console[type] || console.log || noop,
          hasApply = false;

      // Note: reading logFn.apply throws an error in IE11 in IE8 document mode.
      // The reason behind this is that console.log has type "object" in IE8...
      try {
        hasApply = !!logFn.apply;
      } catch (e) { /* empty */ }

      if (hasApply) {
        return function() {
          var args = [];
          forEach(arguments, function(arg) {
            args.push(formatError(arg));
          });
          return logFn.apply(console, args);
        };
      }

      // we are IE which either doesn't have window.console => this is noop and we do nothing,
      // or we are IE where console.log doesn't have apply so we log at least first 2 args
      return function(arg1, arg2) {
        logFn(arg1, arg2 == null ? '' : arg2);
      };
    }
  }];
}
