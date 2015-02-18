'use strict';

describe('$templateRequest', function() {

  it('should download the provided template file',
    inject(function($rootScope, $templateRequest, $httpBackend) {

    $httpBackend.expectGET('tpl.html').respond('<div>abc</div>');

    var content;
    $templateRequest('tpl.html').then(function(html) { content = html; });

    $rootScope.$digest();
    $httpBackend.flush();

    expect(content).toBe('<div>abc</div>');
  }));

  it('should cache the request to prevent extra downloads',
    inject(function($rootScope, $templateRequest, $templateCache, $httpBackend) {

    $httpBackend.expectGET('tpl.html').respond('matias');

    var content = [];
    function tplRequestCb(html) {
      content.push(html);
    }

    $templateRequest('tpl.html').then(tplRequestCb);
    $httpBackend.flush();

    $templateRequest('tpl.html').then(tplRequestCb);
    $rootScope.$digest();

    expect(content[0]).toBe('matias');
    expect(content[1]).toBe('matias');
    expect($templateCache.get('tpl.html')).toBe('matias');
  }));

  it('should throw an error when the template is not found',
    inject(function($rootScope, $templateRequest, $httpBackend) {

    $httpBackend.expectGET('tpl.html').respond(404, '', {}, 'Not found');

    $templateRequest('tpl.html');

    $rootScope.$digest();

    expect(function() {
      $rootScope.$digest();
      $httpBackend.flush();
    }).toThrowMinErr('$compile', 'tpload', 'Failed to load template: tpl.html (HTTP status: 404 Not found)');
  }));

  it('should not throw when the template is not found and ignoreRequestError is true',
    inject(function($rootScope, $templateRequest, $httpBackend) {

      $httpBackend.expectGET('tpl.html').respond(404);

      var err;
      $templateRequest('tpl.html', true).catch(function(reason) { err = reason; });

      $rootScope.$digest();
      $httpBackend.flush();

      expect(err.status).toBe(404);
  }));

  it('should not throw an error when the template is empty',
    inject(function($rootScope, $templateRequest, $httpBackend) {

    $httpBackend.expectGET('tpl.html').respond('');

    $templateRequest('tpl.html');

    $rootScope.$digest();

    expect(function() {
      $rootScope.$digest();
      $httpBackend.flush();
    }).not.toThrow();
  }));

  it('should keep track of how many requests are going on',
    inject(function($rootScope, $templateRequest, $httpBackend) {

    $httpBackend.expectGET('a.html').respond('a');
    $httpBackend.expectGET('b.html').respond('c');
    $templateRequest('a.html');
    $templateRequest('b.html');

    expect($templateRequest.totalPendingRequests).toBe(2);

    $rootScope.$digest();
    $httpBackend.flush();

    expect($templateRequest.totalPendingRequests).toBe(0);

    $httpBackend.expectGET('c.html').respond(404);
    $templateRequest('c.html');

    expect($templateRequest.totalPendingRequests).toBe(1);
    $rootScope.$digest();

    try {
      $httpBackend.flush();
    } catch (e) {}

    expect($templateRequest.totalPendingRequests).toBe(0);
  }));

  it('should not try to parse a response as JSON',
    inject(function($templateRequest, $httpBackend) {
      var spy = jasmine.createSpy('success');
      $httpBackend.expectGET('a.html').respond('{{text}}', {
        'Content-Type': 'application/json'
      });
      $templateRequest('a.html').then(spy);
      $httpBackend.flush();
      expect(spy).toHaveBeenCalledOnceWith('{{text}}');
  }));

  it('should use custom response transformers (array)', function() {
    module(function($httpProvider) {
      $httpProvider.defaults.transformResponse.push(function(data) {
        return data + '!!';
      });
    });
    inject(function($templateRequest, $httpBackend) {
      var spy = jasmine.createSpy('success');
      $httpBackend.expectGET('a.html').respond('{{text}}', {
        'Content-Type': 'application/json'
      });
      $templateRequest('a.html').then(spy);
      $httpBackend.flush();
      expect(spy).toHaveBeenCalledOnceWith('{{text}}!!');
    });
  });

  it('should use custom response transformers (function)', function() {
    module(function($httpProvider) {
      $httpProvider.defaults.transformResponse = function(data) {
        return data + '!!';
      };
    });
    inject(function($templateRequest, $httpBackend) {
      var spy = jasmine.createSpy('success');
      $httpBackend.expectGET('a.html').respond('{{text}}', {
        'Content-Type': 'application/json'
      });
      $templateRequest('a.html').then(spy);
      $httpBackend.flush();
      expect(spy).toHaveBeenCalledOnceWith('{{text}}!!');
    });
  });
});
