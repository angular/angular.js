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
       * @name $log#time
       * @param {string} identifier identifier for this timer. Allows
       *                            starting many independent timers.
       *
       * @description
       * Wraps `console.time`.
       *
       * Starts a timer identified by the passed identifier for
       * timing a block of code.
       */
      time: consoleLog('time'),

      /**
       * @ngdoc method
       * @name $log#timeEnd
       * @param {string} identifier identifier for this timer.
       *
       * @description
       * Wraps `console.timeEnd`.
       *
       * Logs the time passed since calling `$log.time` with the
       * same identifier.
       */
      timeEnd: consoleLog('timeEnd'),

      /**
       * @ngdoc method
       * @name $log#group
       *
       * @description
       * Wraps `console.group`.
       *
       * use `$log.group();`
       *   to indent
       *     the output
       *       one level
       *         at a time.
       */
      group: consoleLog('group'),

      /**
       * @ngdoc method
       * @name $log#groupEnd
       *
       * @description
       * Wraps `console.groupEnd`.
       *
       *          use `$log.groupEnd();`
       *        to unindent
       *      the output
       *    one level
       *  at a time.
       */
      groupEnd: consoleLog('groupEnd'),

      /**
       * @ngdoc method
       * @name $log#groupCollapsed
       *
       * @description
       * Wraps `console.groupCollapsed`.
       *
       * `$log.groupCollapsed()` does the same as `$log.group()`,
       * but the indented section is collapsed by default.
       */
      groupCollapsed: consoleLog('groupCollapsed'),

      /**
       * @ngdoc method
       * @name $log#dir
       * @param {Object}  obj the object to be printed
       *
       * @description
       * Wraps `console.dir`.
       *
       * `$log.dir(obj)` prints obj as an indented directory-like
       * structure, perfect for inspecting the makeup of a function
       * or object.
       */
      dir: consoleLog('dir'),

      /**
       * @ngdoc method
       * @name $log#dirxml
       * @param {Object}  obj the object to be printed
       *
       * @description
       * Wraps `console.dirxml`.
       *
       * `$log.dirxml(obj)` prints the passed object as indented
       * XML-markup.
       */
      dirxml: consoleLog('dirxml'),

      /**
       * @ngdoc method
       * @name $log#profile
       * @param {string} identifier identifier for this profile. Allows
       *                            recording many independent profiles.
       *
       * @description
       * Wraps `console.profile`.
       *
       * `$log.profile('x')` starts recording a snapshot with id 'x',
       * which can be inspected in the Chrome developer console's
       * 'Profiles' section.
       *
       * If the parameter is omitted, the profile receives a numerical
       * identifier.
       */
      profile: consoleLog('profile'),

      /**
       * @ngdoc method
       * @name $log#profileEnd
       * @param {string} identifier identifier for this profile. Allows
       *                            recording many independent profiles.
       *
       * @description
       * Wraps `console.profileEnd`.
       *
       * `$log.profileEnd('x')` stops recording a snapshot with id 'x',
       * so and makes it available for inspection in the Chrome developer
       * console's'Profiles' section.
       */
      profileEnd: consoleLog('profileEnd'),

      /**
       * @ngdoc method
       * @name $log#assert
       * @param {expression} condition the expression to assert.
       * @param {string} message the message with which to fail if expression
       *                 evaluates as falsy.
       *
       * @description
       * Wraps `console.assert`.
       *
       * `$log.assert(condition, 'message')` checks if 'condition' evaluates
       * as truthy, otherwise will throw an error using the passed 'message'.
       */
      assert: consoleLog('assert'),

      /**
       * @ngdoc method
       * @name $log#table
       *
       * @description
       * Render a nicely formatted table to the console:
       *
       * $log.table([
       *    ['moo', 'baa'],
       *    ['gni', 'unf']
       * ]);
       *
       * or
       *
       * console.table({
       *    gah: {moo: 'baa', gni: 'fla'},
       *    doo: {'moo': 'unf', gni: 'hng'}
       * })
       */
      table: consoleLog('table'),

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
