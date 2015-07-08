'use strict';

describe('$document', function() {


  it("should inject $document", inject(function($document) {
    expect($document).toEqual(jqLite(document));
  }));


  it('should be able to mock $document object', function() {
    module({$document: {}});
    inject(function($httpBackend, $http) {
      $httpBackend.expectGET('/dummy').respond('dummy');
      $http.get('/dummy');
      $httpBackend.flush();
    });
  });


  it('should be able to mock $document array', function() {
    module({$document: [{}]});
    inject(function($httpBackend, $http) {
      $httpBackend.expectGET('/dummy').respond('dummy');
      $http.get('/dummy');
      $httpBackend.flush();
    });
  });
});
