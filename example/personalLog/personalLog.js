/**
 * @fileOverview Very simple personal log demo application to demonstrate angular functionality,
 *               especially:
 *               - the MVC model
 *               - testability of controllers
 *               - dependency injection for controllers via $inject and constructor function
 *               - $cookieStore for persistent cookie-backed storage
 *               - simple templating constructs such as ng-repeat and {{}}
 *               - date filter
 *               - and binding onSubmit and onClick events to angular expressions
 * @author Igor Minar
 */

//name space isolating closure
(function() {

var app = angular.module('personalLog', ['ngCookies']);

var LOGS = 'logs';

/**
 * The controller for the personal log app.
 */
app.controller('LogCtrl', ['$cookieStore', '$scope', function LogCtrl($cookieStore, $scope) {

  var logs = $scope.logs = $cookieStore.get(LOGS) || []; //main model


  /**
   * Adds newMsg to the logs array as a log, persists it and clears newMsg.
   * @param {string} msg Message to add (message is passed as parameter to make testing easier).
   */
  $scope.addLog = function(msg) {
    var newMsg = msg || $scope.newMsg;
    if (!newMsg) return;
    var log = {
      at: new Date().getTime(),
      msg: newMsg
    };

    logs.push(log);
    $cookieStore.put(LOGS, logs);
    $scope.newMsg = '';
  };


  /**
   * Persistently removes a log from logs.
   * @param {object} log The log to remove.
   */
  $scope.rmLog = function(log) {
    for ( var i = 0; i < logs.length; i++) {
      if (log === logs[i]) {
        logs.splice(i, 1);
        break;
      }
    }

    $cookieStore.put(LOGS, logs);
  };


  /**
   * Persistently removes all logs.
   */
  $scope.rmLogs = function() {
    logs.splice(0, logs.length);
    $cookieStore.remove(LOGS);
  };
}]);

})();
