'use strict';

describe('$document', function() {
  var scope;

  beforeEach(function(){
    scope = angular.scope();
  });


  afterEach(function(){
    dealoc(scope);
  });


  it("should inject $document", function(){
    expect(scope.$service('$document')).toEqual(jqLite(document));
  });
});
