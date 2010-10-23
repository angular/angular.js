//app namespace
var example = {};
example.personalLog = {};


//name space isolating closure
(function() {

var LOGS = 'logs';

/**
 * The controller for the personal log app.
 */
function LogCtrl($cookieStore) {
  var self = this,
      logs = self.logs = $cookieStore.get(LOGS) || [];


  /**
   * Adds newMsg to the logs array as a log, persists it and clears newMsg.
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
  }


  /**
   * Persistently removes a log from logs.
   * @param {number} msgIdx Index of the log to remove.
   */
  this.rmLog = function(msgIdx) {
    logs.splice(msgIdx,1);
    $cookieStore.put(LOGS, logs);
  }


  /**
   * Persistently removes all logs.
   */
  this.rmLogs = function() {
    logs.splice(0);
    $cookieStore.remove(LOGS);
  }
}

//inject
LogCtrl.$inject = ['$cookieStore'];

//export
example.personalLog.LogCtrl = LogCtrl;
})();