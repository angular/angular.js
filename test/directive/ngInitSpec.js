'use strict';

describe('ng-init', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  it("should ng-init", inject(function($rootScope, $compile) {
    element = $compile('<div ng-init="a=123"></div>')($rootScope);
    expect($rootScope.a).toEqual(123);
  }));
});
