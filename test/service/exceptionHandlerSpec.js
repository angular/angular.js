'use strict';

describe('$exceptionHandler', function() {
  var scope;

  beforeEach(function() {
    scope = angular.scope();
  });


  afterEach(function() {
    dealoc(scope);
  });


  it('should log errors', function() {
    var scope = createScope({$exceptionHandler: $exceptionHandlerFactory},
                            {$log: $logMock}),
        $log = scope.$service('$log'),
        $exceptionHandler = scope.$service('$exceptionHandler');

    $log.error.rethrow = false;
    $exceptionHandler('myError');
    expect($log.error.logs.shift()).toEqual(['myError']);
  });
});
