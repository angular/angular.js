'use strict';

/**
 * @ngdoc object
 * @name ng.$log
 * @requires $window
 *
 * @description
 * Simple service for logging. Default implementation writes the message
 * into the browser's console (if present).
 *
 * The main purpose of this service is to simplify debugging and troubleshooting.
 *
 * @example
 <example>
 <file name="script.js">
 function LogCtrl($scope, $log) {
         $scope.$log = $log;
         $scope.message = 'Hello World!';
       }
 </file>
 <file name="index.html">
 <div ng-controller="LogCtrl">
 <p>Reload this page with open console, enter text and hit the log button...</p>
 Message:
 <input type="text" ng-model="message"/>
 <button ng-click="$log.debug(message)">debug</button>
 <button ng-click="$log.log(message)">log</button>
 <button ng-click="$log.warn(message)">warn</button>
 <button ng-click="$log.info(message)">info</button>
 <button ng-click="$log.error(message)">error</button>
 </div>
 </file>
 </example>
 */

/**
 * @ngdoc object
 * @name ng.$logProvider
 * @description
 * Use the `$logProvider` to configure how the application logs messages
 */
function $LogProvider(){
    var levels = {
            off: Number.MAX_VALUE,
            error: 5,
            warn: 4,
            info: 3,
            log: 2,
            debug: 1,
            all: Number.MIN_VALUE
        },
        self = this;

    /**
     * @ngdoc property
     * @name ng.$logProvider#level
     * @description
     * A hierarchical level controlling what is logged to the console.
     * Possible values (in order of priority):
     *      'off', 'error', 'warn', 'info', 'log', 'debug', 'all'
     *
     *  For example, a level of info results in error, warn, and info messages being logged.
     */
    this.level = levels.debug;

    /**
     * @ngdoc property
     * @name ng.$logProvider#debugEnabled
     * @methodOf ng.$logProvider
     * @deprecated use the ng.$logProvider#setLogLevel method instead.
     * @description
     * @param {string=} flag enable or disable debug level messages
     * @returns {*} current value if used as getter or itself (chaining) if used as setter
     */
    this.debugEnabled = function(flag) {
        if (isDefined(flag)) {
            if (flag) {
                this.setLogLevel('debug');
            } else {
                this.setLogLevel('log');
            }
            return this;
        } else {
            return (this.level <= levels.debug);
        }
    };

    /**
     * @ngdoc method
     * @name ng.$logProvider#setLogLevel
     * @methodOf ng.$logProvider
     * @description
     * Sets the ng.$logProvider#level property.
     * @param {string=} Possible values (in order of priority):
     *      'off', 'error', 'warn', 'info', 'log', 'debug', 'all'
     */
    this.setLogLevel = function (level) {
        this.level = levels[level];
    };

    this.$get = ['$window', function($window){
        return {
            /**
             * @ngdoc method
             * @name ng.$log#log
             * @methodOf ng.$log
             *
             * @description
             * Write a log message
             */
            log: meetsLevel('log') ? consoleLog('log') : noop,

            /**
             * @ngdoc method
             * @name ng.$log#info
             * @methodOf ng.$log
             *
             * @description
             * Write an information message
             */
            info: meetsLevel('info') ? consoleLog('info') : noop,

            /**
             * @ngdoc method
             * @name ng.$log#warn
             * @methodOf ng.$log
             *
             * @description
             * Write a warning message
             */
            warn: meetsLevel('warn') ? consoleLog('warn') : noop,

            /**
             * @ngdoc method
             * @name ng.$log#error
             * @methodOf ng.$log
             *
             * @description
             * Write an error message
             */
            error: meetsLevel('error') ? consoleLog('error') : noop,

            /**
             * @ngdoc method
             * @name ng.$log#debug
             * @methodOf ng.$log
             *
             * @description
             * Write a debug message
             */
            debug: meetsLevel('debug') ? consoleLog('debug') : noop
        };

        function meetsLevel(level) {
            return (self.level <= levels[level]);
        }

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
                logFn = console[type] || console.log || noop;

            if (logFn.apply) {
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
                logFn(arg1, arg2);
            }
        }
    }];
}