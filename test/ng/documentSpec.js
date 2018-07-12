'use strict';

describe('$document', function() {


  it('should inject $document', inject(function($document) {
    expect($document).toEqual(jqLite(window.document));
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


describe('$$isDocumentHidden', function() {
  it('should listen on the visibilitychange event', function() {
    var doc;

    var spy = spyOn(window.document, 'addEventListener').and.callThrough();

    inject(function($$isDocumentHidden, $document) {
      expect(spy.calls.mostRecent().args[0]).toBe('visibilitychange');
      expect(spy.calls.mostRecent().args[1]).toEqual(jasmine.any(Function));
      expect($$isDocumentHidden()).toBeFalsy(); // undefined in browsers that don't support visibility
    });

  });

  it('should remove the listener when the $rootScope is destroyed', function() {
    var spy = spyOn(window.document, 'removeEventListener').and.callThrough();

    inject(function($$isDocumentHidden, $rootScope) {
      $rootScope.$destroy();
      expect(spy.calls.mostRecent().args[0]).toBe('visibilitychange');
      expect(spy.calls.mostRecent().args[1]).toEqual(jasmine.any(Function));
    });
  });
});
