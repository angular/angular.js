'use strict';

describe('$interpolate', function() {

  it('should return nothing when no binding', inject(function($interpolate) {
    expect($interpolate('some text', true)).toBeFalsy();
    expect($interpolate('some text')).toBeTruthy();
  }));


  it('should return interpolation function', inject(function($interpolate, $rootScope) {
    $rootScope.name = 'Misko';
    expect($interpolate('Hello {{name}}!')($rootScope)).toEqual('Hello Misko!');
  }));
});
