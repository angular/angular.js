'use strict';

describe('$exceptionHandler', function() {


  it('should log errors', inject(
    function($provide){
      $provide.service('$exceptionHandler', $ExceptionHandlerProvider);
    },
    function($log, $exceptionHandler) {
      $exceptionHandler('myError');
      expect($log.error.logs.shift()).toEqual(['myError']);
    }
  ));
});
