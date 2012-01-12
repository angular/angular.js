'use strict';

describe('$exceptionHandler', function() {


  it('should log errors', function() {
    module(function($provide){
      $provide.service('$exceptionHandler', $ExceptionHandlerProvider);
    });
    inject(function($log, $exceptionHandler) {
      $exceptionHandler('myError');
      expect($log.error.logs.shift()).toEqual(['myError']);
    });
  });
});
