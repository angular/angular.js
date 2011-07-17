'use strict';

describe('$window', function() {
  var scope;

  beforeEach(function(){
    scope = angular.scope();
  });


  afterEach(function(){
    dealoc(scope);
  });


  it("should inject $window", function(){
    expect(scope.$service('$window')).toBe(window);
  });
});
