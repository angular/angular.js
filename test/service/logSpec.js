describe('$log', function() {
  var scope;

  beforeEach(function(){
    scope = angular.scope();
  });


  afterEach(function(){
    dealoc(scope);
  });


  it('should use console if present', function(){
    var logger = "";
    function log(){ logger+= 'log;'; }
    function warn(){ logger+= 'warn;'; }
    function info(){ logger+= 'info;'; }
    function error(){ logger+= 'error;'; }
    var scope = createScope({}, {$log: $logFactory},
                                {$exceptionHandler: rethrow,
                                 $window: {console: {log: log,
                                                     warn: warn,
                                                     info: info,
                                                     error: error}}}),
        $log = scope.$service('$log');

    $log.log();
    $log.warn();
    $log.info();
    $log.error();
    expect(logger).toEqual('log;warn;info;error;');
  });


  it('should use console.log() if other not present', function(){
    var logger = "";
    function log(){ logger+= 'log;'; }
    var scope = createScope({}, {$log: $logFactory},
                                {$window: {console:{log:log}},
                                 $exceptionHandler: rethrow});
    var $log = scope.$service('$log');
    $log.log();
    $log.warn();
    $log.info();
    $log.error();
    expect(logger).toEqual('log;log;log;log;');
  });


  it('should use noop if no console', function(){
    var scope = createScope({}, {$log: $logFactory},
                                {$window: {},
                                 $exceptionHandler: rethrow}),
        $log = scope.$service('$log');
    $log.log();
    $log.warn();
    $log.info();
    $log.error();
  });


  describe('$log.error', function(){
    var e, $log, errorArgs;

    beforeEach(function(){
      e = new Error('');
      e.message = undefined;
      e.sourceURL = undefined;
      e.line = undefined;
      e.stack = undefined;

      $log = $logFactory({console:{error:function(){
        errorArgs = arguments;
      }}});
    });


    it('should pass error if does not have trace', function(){
      $log.error('abc', e);
      expect(errorArgs).toEqual(['abc', e]);
    });


    it('should print stack', function(){
      e.stack = 'stack';
      $log.error('abc', e);
      expect(errorArgs).toEqual(['abc', 'stack']);
    });


    it('should print line', function(){
      e.message = 'message';
      e.sourceURL = 'sourceURL';
      e.line = '123';
      $log.error('abc', e);
      expect(errorArgs).toEqual(['abc', 'message\nsourceURL:123']);
    });
  });
});
