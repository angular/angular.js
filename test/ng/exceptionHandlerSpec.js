'use strict';

describe('$exceptionHandler', function() {
  /* global $ExceptionHandlerProvider:false */
  it('should log errors with single argument', function() {
    module(function($provide) {
      $provide.provider('$exceptionHandler', $ExceptionHandlerProvider);
    });
    inject(function($log, $exceptionHandler) {
      $exceptionHandler('myError');
      expect($log.error.logs.shift()).toEqual(['myError']);
    });
  });


  it('should log errors with multiple arguments', function() {
    module(function($provide) {
      $provide.provider('$exceptionHandler', $ExceptionHandlerProvider);
    });
    inject(function($log, $exceptionHandler) {
      $exceptionHandler('myError', 'comment');
      expect($log.error.logs.shift()).toEqual(['myError', 'comment']);
    });
  });
});
