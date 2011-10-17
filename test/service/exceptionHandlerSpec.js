'use strict';

describe('$exceptionHandler', function() {


  it('should log errors', inject(
    function(service){
      service('$exceptionHandler', $exceptionHandlerFactory);
      service('$log', valueFn($logMock));
    },
    function($log, $exceptionHandler) {
      $log.error.rethrow = false;
      $exceptionHandler('myError');
      expect($log.error.logs.shift()).toEqual(['myError']);
    }
  ));
});
