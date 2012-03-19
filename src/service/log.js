'use strict';

/**
 * @ngdoc object
 * @name angular.module.ng.$log
 * @requires $window
 *
 * @description
 * Simple service for logging. Default implementation writes the message
 * into the browser's console (if present).
 *
 * The main purpose of this service is to simplify debugging and troubleshooting.
 *
 * @example
    <doc:example>
      <doc:source>
         <script>
           function LogCtrl($log) {
             this.$log = $log;
             this.message = 'Hello World!';
           }
         </script>
         <div ng-controller="LogCtrl">
           <p>Reload this page with open console, enter text and hit the log button...</p>
           Message:
           <input type="text" ng-model="message"/>
           <button ng-click="$log.log(message)">log</button>
           <button ng-click="$log.warn(message)">warn</button>
           <button ng-click="$log.info(message)">info</button>
           <button ng-click="$log.error(message)">error</button>
         </div>
      </doc:source>
      <doc:scenario>
      </doc:scenario>
    </doc:example>
 */

function $LogProvider(){
  this.$get = ['$window', function($window){
    return {
      /**
       * @ngdoc method
       * @name angular.module.ng.$log#log
       * @methodOf angular.module.ng.$log
       *
       * @description
       * Write a log message
       */
      log: consoleLog('log'),

      /**
       * @ngdoc method
       * @name angular.module.ng.$log#warn
       * @methodOf angular.module.ng.$log
       *
       * @description
       * Write a warning message
       */
      warn: consoleLog('warn'),

      /**
       * @ngdoc method
       * @name angular.module.ng.$log#info
       * @methodOf angular.module.ng.$log
       *
       * @description
       * Write an information message
       */
      info: consoleLog('info'),

      /**
       * @ngdoc method
       * @name angular.module.ng.$log#error
       * @methodOf angular.module.ng.$log
       *
       * @description
       * Write an error message
       */
      error: consoleLog('error')
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
      var console = $window.console || {};
      var logFn = console[type] || console.log || noop;
      if (logFn.apply) {
        return function() {
          var args = [];
          forEach(arguments, function(arg){
            args.push(formatError(arg));
          });
          return logFn.apply(console, args);
        };
      } else {
        // we are IE, in which case there is nothing we can do
        return logFn;
      }
    }
  }];
}
