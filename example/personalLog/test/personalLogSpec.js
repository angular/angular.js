describe('example.personalLog.LogCtrl', function() {
  var logCtrl;

  function createNotesCtrl() {
    var scope = angular.scope();
    return scope.$new(example.personalLog.LogCtrl);
  }


  beforeEach(function() {
    logCtrl = createNotesCtrl();
  });
  

  it('should initialize notes with an empty array', function() {
    expect(logCtrl.logs).toEqual([]);
  });


  describe('addLog', function() {

    beforeEach(function() {
      expect(logCtrl.logs).toEqual([]);
    });


    it('should add newMsg to logs as a log entry', function() {
      logCtrl.newMsg = 'first log message';
      logCtrl.addLog();
      
      expect(logCtrl.logs.length).toBe(1);
      expect(logCtrl.logs[0].msg).toBe('first log message');

      //one more msg, this time passed in as param
      logCtrl.addLog('second log message');

      expect(logCtrl.logs.length).toBe(2);
      expect(logCtrl.logs[0].msg).toBe('first log message');
      expect(logCtrl.logs[1].msg).toBe('second log message');
    });


    it('should clear newMsg when log entry is persisted', function() {
      logCtrl.addLog('first log message');
      expect(logCtrl.newMsg).toBe('');
    });


    it('should store logs in the logs cookie', function() {
      expect(logCtrl.$cookies.logs).not.toBeDefined();
      logCtrl.addLog('first log message');
      expect(logCtrl.$cookies.logs).toBeTruthy();
    });


    it('should do nothing if newMsg is empty', function() {
      logCtrl.addLog('');
      expect(logCtrl.logs.length).toBe(0);
    });
  });


  describe('rmLog', function() {

    beforeEach(function() {
      logCtrl.addLog('message1');
      logCtrl.addLog('message2');
      logCtrl.addLog('message3');
      logCtrl.addLog('message4');
      expect(logCtrl.logs.length).toBe(4);
    });


    it('should delete a message identified by index', function() {
      logCtrl.rmLog(1);
      expect(logCtrl.logs.length).toBe(3);

      logCtrl.rmLog(2);
      expect(logCtrl.logs.length).toBe(2);
      expect(logCtrl.logs[0].msg).toBe('message1');
      expect(logCtrl.logs[1].msg).toBe('message3');
    });


    it('should update cookies when a log is deleted', function() {
      expect(logCtrl.$cookies.logs).toMatch(/\[\{.*?\}(,\{.*?\}){3}\]/);

      logCtrl.rmLog(1);
      expect(logCtrl.$cookies.logs).toMatch(/\[\{.*?\}(,\{.*?\}){2}\]/);

      logCtrl.rmLog(0);
      logCtrl.rmLog(0);
      logCtrl.rmLog(0);
      expect(logCtrl.$cookies.logs).toMatch(/\[\]/);
    });
  });


  describe('rmLogs', function() {

    beforeEach(function() {
      logCtrl.addLog('message1');
      logCtrl.addLog('message2');
      logCtrl.addLog('message3');
      logCtrl.addLog('message4');
      expect(logCtrl.logs.length).toBe(4);
    });


    it('should remove all logs', function() {
      logCtrl.rmLogs();
      expect(logCtrl.logs).toEqual([]);
    });


    it('should remove logs cookie', function() {
      expect(logCtrl.$cookies.logs).toBeTruthy();
      logCtrl.rmLogs();
      expect(logCtrl.$cookies.logs).not.toBeDefined();
    });
  });
});