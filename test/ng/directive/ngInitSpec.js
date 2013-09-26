'use strict';

describe('ngInit', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  it("should init model", inject(function($rootScope, $compile) {
    element = $compile('<div ng-init="a=123"></div>')($rootScope);
    expect($rootScope.a).toEqual(123);
  }));
});
