describe('example.personalLog.LogCtrl', function() {
  var logScope;


  beforeEach(module('personalLog'));

  beforeEach(inject(function($rootScope, $controller) {
    logScope = $rootScope.$new();
    $controller('LogCtrl', {$scope: logScope});
  }));


  it('should initialize notes with an empty array', function() {
    expect(logScope.logs).toEqual([]);
  });


  describe('addLog', function() {

    beforeEach(function() {
      expect(logScope.logs).toEqual([]);
    });


    it('should add newMsg to logs as a log entry', function() {
      logScope.newMsg = 'first log message';
      logScope.addLog();

      expect(logScope.logs.length).toBe(1);
      expect(logScope.logs[0].msg).toBe('first log message');

      //one more msg, this time passed in as param
      logScope.addLog('second log message');

      expect(logScope.logs.length).toBe(2);
      expect(logScope.logs[0].msg).toBe('first log message');
      expect(logScope.logs[1].msg).toBe('second log message');
    });


    it('should clear newMsg when log entry is persisted', function() {
      logScope.addLog('first log message');
      expect(logScope.newMsg).toBe('');
    });


    it('should store logs in the logs cookie', inject(function($cookies) {
      expect($cookies.logs).not.toBeDefined();
      logScope.addLog('first log message');
      expect($cookies.logs).toBeTruthy();
    }));


    it('should do nothing if newMsg is empty', function() {
      logScope.addLog('');
      expect(logScope.logs.length).toBe(0);
    });
  });


  describe('rmLog', function() {

    beforeEach(function() {
      logScope.addLog('message1');
      logScope.addLog('message2');
      logScope.addLog('message3');
      logScope.addLog('message4');
      expect(logScope.logs.length).toBe(4);
    });


    it('should delete a message identified by index', function() {
      logScope.rmLog(logScope.logs[1]);
      expect(logScope.logs.length).toBe(3);

      logScope.rmLog(logScope.logs[2]);
      expect(logScope.logs.length).toBe(2);
      expect(logScope.logs[0].msg).toBe('message1');
      expect(logScope.logs[1].msg).toBe('message3');
    });


    it('should update cookies when a log is deleted', inject(function($cookies) {
      expect($cookies.logs).toMatch(/\[\{.*?\}(,\{.*?\}){3}\]/);

      logScope.rmLog(logScope.logs[1]);
      expect($cookies.logs).toMatch(/\[\{.*?\}(,\{.*?\}){2}\]/);

      logScope.rmLog(logScope.logs[0]);
      logScope.rmLog(logScope.logs[0]);
      logScope.rmLog(logScope.logs[0]);
      expect($cookies.logs).toMatch(/\[\]/);
    }));
  });


  describe('rmLogs', function() {

    beforeEach(function() {
      logScope.addLog('message1');
      logScope.addLog('message2');
      logScope.addLog('message3');
      logScope.addLog('message4');
      expect(logScope.logs.length).toBe(4);
    });


    it('should remove all logs', function() {
      logScope.rmLogs();
      expect(logScope.logs).toEqual([]);
    });


    it('should remove logs cookie', inject(function($cookies) {
      expect($cookies.logs).toBeTruthy();
      logScope.rmLogs();
      expect($cookies.logs).not.toBeDefined();
    }));
  });
});
