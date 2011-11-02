'use strict';

describe('$exceptionHandler', function() {


  it('should log errors', inject(
    function($provide){
      $provide.factory('$exceptionHandler', $exceptionHandlerFactory);
      $provide.value('$log', $logMock);
    },
    function($log, $exceptionHandler) {
      $log.error.rethrow = false;
      $exceptionHandler('myError');
      expect($log.error.logs.shift()).toEqual(['myError']);
    }
  ));
});
