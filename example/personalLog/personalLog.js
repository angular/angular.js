/**
 * @fileOverview Very simple personal log demo application to demonstrate angular functionality,
 *               especially:
 *               - the MVC model
 *               - testability of controllers
 *               - dependency injection for controllers via $inject and constructor function
 *               - $cookieStore for persistent cookie-backed storage
 *               - simple templating constructs such as ng:repeat and {{}}
 *               - date filter
 *               - and binding onSubmit and onClick events to angular expressions
 * @author Igor Minar
 */


/** @namespace the 'example' namespace */
var example = example || {};
/** @namespace namespace of the personal log app */
example.personalLog = {};


//name space isolating closure
(function() {

var LOGS = 'logs';

/**
 * The controller for the personal log app.
 */
function LogCtrl($cookieStore) {
  var self = this,
      logs = self.logs = $cookieStore.get(LOGS) || []; //main model


  /**
   * Adds newMsg to the logs array as a log, persists it and clears newMsg.
   * @param {string} msg Message to add (message is passed as parameter to make testing easier).
   */
  this.addLog = function(msg) {
    var newMsg = msg || self.newMsg;
    if (!newMsg) return;
    var log = {
      at: new Date().getTime(),
      msg: newMsg
    }

    logs.push(log);
    $cookieStore.put(LOGS, logs);
    self.newMsg = '';
  };


  /**
   * Persistently removes a log from logs.
   * @param {object} log The log to remove.
   */
  this.rmLog = function(log) {
    angular.Array.remove(logs, log);
    $cookieStore.put(LOGS, logs);
  };


  /**
   * Persistently removes all logs.
   */
  this.rmLogs = function() {
    logs.splice(0, logs.length);
    $cookieStore.remove(LOGS);
  };
}

//inject
LogCtrl.$inject = ['$cookieStore'];

//export
example.personalLog.LogCtrl = LogCtrl;
})();