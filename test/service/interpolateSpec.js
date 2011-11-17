'use strict';

describe('$interpolate', function() {

  it('should return a function when there are no bindings and textOnly is undefined',
      inject(function($interpolate) {
    expect(typeof $interpolate('some text')).toBe('function');
  }));


  it('should return undefined when there are no bindings and textOnly is set to true',
      inject(function($interpolate) {
    expect($interpolate('some text', true)).toBeUndefined();
  }));


  it('should return interpolation function', inject(function($interpolate, $rootScope) {
    $rootScope.name = 'Misko';
    expect($interpolate('Hello {{name}}!')($rootScope)).toEqual('Hello Misko!');
  }));
});
