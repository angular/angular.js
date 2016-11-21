/* global $LogProvider: false */
'use strict';

describe('$log', function() {
  var $window, logger, log, warn, info, error, debug;



  beforeEach(module(function($provide) {
    $window = {navigator: {}, document: {}};
    logger = '';
    log = function() { logger += 'log;'; };
    warn = function() { logger += 'warn;'; };
    info = function() { logger += 'info;'; };
    error = function() { logger += 'error;'; };
    debug = function() { logger += 'debug;'; };

    $provide.provider('$log', $LogProvider);
    $provide.value('$exceptionHandler', angular.mock.rethrow);
    $provide.value('$window', $window);
  }));

  it('should use console if present', inject(
    function() {
      $window.console = {log: log,
                         warn: warn,
                         info: info,
                         error: error,
                         debug: debug};
    },
    function($log) {
      $log.log();
      $log.warn();
      $log.info();
      $log.error();
      $log.debug();
      expect(logger).toEqual('log;warn;info;error;debug;');
    }
  ));


  it('should use console.log() if other not present', inject(
    function() {
      $window.console = {log: log};
    },
    function($log) {
      $log.log();
      $log.warn();
      $log.info();
      $log.error();
      $log.debug();
      expect(logger).toEqual('log;log;log;log;log;');
    }
  ));


  it('should use noop if no console', inject(
    function($log) {
      $log.log();
      $log.warn();
      $log.info();
      $log.error();
      $log.debug();
    }
  ));

  describe('IE logging behavior', function() {
    function removeApplyFunctionForIE() {
      log.apply = log.call =
        warn.apply = warn.call =
        info.apply = info.call =
        error.apply = error.call =
        debug.apply = debug.call = null;

      $window.console = {log: log,
        warn: warn,
        info: info,
        error: error,
        debug: debug};
    }

    it('should work in IE where console.error doesn\'t have an apply method', inject(
      removeApplyFunctionForIE,
      function($log) {
        $log.log.apply($log);
        $log.warn.apply($log);
        $log.info.apply($log);
        $log.error.apply($log);
        $log.debug.apply($log);
        expect(logger).toEqual('log;warn;info;error;debug;');
      })
    );

    it('should not attempt to log the second argument in IE if it is not specified', inject(
      function() {
        log = function(arg1, arg2) { logger += 'log;' + arg2; };
        warn = function(arg1, arg2) { logger += 'warn;' + arg2; };
        info = function(arg1, arg2) { logger += 'info;' + arg2; };
        error = function(arg1, arg2) { logger += 'error;' + arg2; };
        debug = function(arg1, arg2) { logger += 'debug;' + arg2; };
      },
      removeApplyFunctionForIE,
      function($log) {
        $log.log();
        $log.warn();
        $log.info();
        $log.error();
        $log.debug();
        expect(logger).toEqual('log;warn;info;error;debug;');
      })
    );
  });

  describe('$log.debug', function() {

    beforeEach(initService(false));

    it('should skip debugging output if disabled', inject(
      function() {
        $window.console = {log: log,
                           warn: warn,
                           info: info,
                           error: error,
                           debug: debug};
      },
      function($log) {
        $log.log();
        $log.warn();
        $log.info();
        $log.error();
        $log.debug();
        expect(logger).toEqual('log;warn;info;error;');
      }
  ));

  });

  describe('$log.error', function() {
    var e, $log, errorArgs;

    function TestError() {
      Error.prototype.constructor.apply(this, arguments);
      this.message = undefined;
      this.sourceURL = undefined;
      this.line = undefined;
      this.stack = undefined;
    }
    TestError.prototype = Object.create(Error.prototype);
    TestError.prototype.constructor = TestError;

    beforeEach(function() {
      e = new TestError('');
      var mockWindow = {
        console: {
          error: function() {
            errorArgs = [].slice.call(arguments, 0);
          }
        }
      };
      $log = new $LogProvider().$get[1](mockWindow);
    });


    it('should pass error if does not have trace', function() {
      $log.error('abc', e);
      expect(errorArgs).toEqual(['abc', e]);
    });


    it('should print stack', function() {
      e.stack = 'stack';
      $log.error('abc', e);
      expect(errorArgs).toEqual(['abc', 'stack']);
    });


    it('should print line', function() {
      e.message = 'message';
      e.sourceURL = 'sourceURL';
      e.line = '123';
      $log.error('abc', e);
      expect(errorArgs).toEqual(['abc', 'message\nsourceURL:123']);
    });
  });

  function initService(debugEnabled) {
    return module(function($logProvider) {
      $logProvider.debugEnabled(debugEnabled);
    });
  }

});
