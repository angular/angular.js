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
   <example module="logExample">
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
         Message:
         <input type="text" ng-model="message"/>
         <button ng-click="$log.log(message)">log</button>
         <button ng-click="$log.warn(message)">warn</button>
         <button ng-click="$log.info(message)">info</button>
         <button ng-click="$log.error(message)">error</button>
       </div>
     </file>
   </example>
 */

/**
 * @ngdoc provider
 * @name $logProvider
 * @description
 * Use the `$logProvider` to configure how the application logs messages
 */
function $LogProvider(){
  var debug = true,
      error = true,
      warn = true,
      info = true,
      log = true,
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

  /**
   * @ngdoc method
   * @name $logProvider#errorEnabled
   * @description
   * @param {boolean=} flag enable or disable error level messages
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.errorEnabled = function(flag) {
    if (isDefined(flag)){
      error = flag;
    return this;
    } else {
      return error;
    }
  };

  /**
   * @ngdoc method
   * @name $logProvider#warnEnabled
   * @description
   * @param {boolean=} flag enable or disable warn level messages
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.warnEnabled = function(flag) {
    if (isDefined(flag)){
      warn = flag;
    return this;
    } else {
      return warn;
    }
  };

  /**
   * @ngdoc method
   * @name $logProvider#infoEnabled
   * @description
   * @param {boolean=} flag enable or disable info level messages
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.infoEnabled = function(flag) {
    if (isDefined(flag)){
      info = flag;
    } else {
      return info;
    }
  };

  /**
   * @ngdoc method
   * @name $logProvider#logEnabled
   * @description
   * @param {boolean=} flag enable or disable log level messages
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.logEnabled = function(flag) {
    if (isDefined(flag)){
      log = flag;
    return this;
    } else {
      return log;
    }
  };

  this.$get = ['$window', function($window){
    return {
      /**
       * @ngdoc method
       * @name $log#log
       *
       * @description
       * Write a log message
       */
      log: (function () {
        var fn = consoleLog('log');

        return function() {
          if (log) {
            fn.apply(self, arguments);
          }
        };
      }()),
      /**
       * @ngdoc method
       * @name $log#info
       *
       * @description
       * Write an information message
       */
      info: (function () {
        var fn = consoleLog('info');

        return function() {
          if (info) {
            fn.apply(self, arguments);
          }
        };
      }()),

      /**
       * @ngdoc method
       * @name $log#warn
       *
       * @description
       * Write a warning message
       */
      warn: (function () {
        var fn = consoleLog('warn');

        return function() {
          if (warn) {
            fn.apply(self, arguments);
          }
        };
      }()),

      /**
       * @ngdoc method
       * @name $log#error
       *
       * @description
       * Write an error message
       */
      error: (function () {
        var fn = consoleLog('error');

        return function() {
          if (error) {
            fn.apply(self, arguments);
          }
        };
      }()),

      /**
       * @ngdoc method
       * @name $log#debug
       *
       * @description
       * Write a debug message
       */
      debug: (function () {
        var fn = consoleLog('debug');

        return function() {
          if (debug) {
            fn.apply(self, arguments);
          }
        };
      }())
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
      } catch (e) {}

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
