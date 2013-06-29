describe('Docs Annotations', function() {

  beforeEach(module('docsApp'));

  var body;
  beforeEach(function() {
    body = angular.element(document.body);
    body.html('');
  });

  describe('popover directive', function() {

    var $scope, element;
    beforeEach(inject(function($rootScope, $compile) {
      $scope = $rootScope.$new();
      element = angular.element(
        '<div style="margin:200px;" data-title="title_text" data-content="content_text" popover></div>'
      );
      element.attr('id','idx');
      body.append(element);
      $compile(element)($scope);
      $scope.$apply();
    }));

    it('should be hidden by default', inject(function(popoverElement) {
      expect(popoverElement.visible()).toBe(false);
    }));

    it('should capture the click event and set the title and content and position the tip', inject(function(popoverElement) {
      element.triggerHandler('click');
      expect(popoverElement.isSituatedAt(element)).toBe(true);
      expect(popoverElement.visible()).toBe(true);
      expect(popoverElement.title()).toBe('title_text');
      expect(popoverElement.content()).toContain('content_text');
      expect(popoverElement.besideElement.attr('id')).toBe('idx');
    }));

    it('should hide and clear the title and content if the same element is clicked again', inject(function(popoverElement) {
      //show the element
      element.triggerHandler('click');
      expect(popoverElement.isSituatedAt(element)).toBe(true);

      //hide the element
      element.triggerHandler('click');
      expect(popoverElement.isSituatedAt(element)).toBe(false);
      expect(popoverElement.visible()).toBe(false);
      expect(popoverElement.title()).toBe('');
      expect(popoverElement.content()).toBe('');
    }));

    it('should parse markdown content', inject(function(popoverElement, $compile) {
      element = angular.element(
        '<div style="margin:200px;" data-title="#title_text" data-content="#heading" popover></div>'
      );
      body.append(element);
      $compile(element)($scope);
      $scope.$apply();
      element.triggerHandler('click');
      expect(popoverElement.title()).toBe('#title_text');
      expect(popoverElement.content()).toBe('<h1 id="heading">heading</h1>');
    }));

  });


  describe('foldout directive', function() {

    var $scope, parent, element, url, window;
    beforeEach(function() {
      module(function($provide, $animationProvider) {
        $provide.value('$window', window = angular.mock.createMockWindow());
        $animationProvider.register('foldout-enter', function($window) {
          return {
            start : function(element, done) {
              $window.setTimeout(done, 1000);
            }
          }
        });
        $animationProvider.register('foldout-hide', function($window) {
          return {
            start : function(element, done) {
              $window.setTimeout(done, 500);
            }
          }
        });
        $animationProvider.register('foldout-show', function($window) {
          return {
            start : function(element, done) {
              $window.setTimeout(done, 200);
            }
          }
        });
      });
      inject(function($rootScope, $compile, $templateCache) {
        url = '/page.html';
        $scope = $rootScope.$new();
        parent = angular.element('<div class="parent"></div>');
        element = angular.element('<div data-url="' + url + '" foldout></div>');
        body.append(parent);
        parent.append(element);
        $compile(parent)($scope);
        $scope.$apply();
      });
    });

    it('should inform that it is loading', inject(function($httpBackend) {
      $httpBackend.expect('GET', url).respond('hello');
      element.triggerHandler('click');

      var kids = body.children();
      var foldout = angular.element(kids[kids.length-1]);
      expect(foldout.html()).toContain('loading');
    }));

    it('should download a foldout HTML page and animate the contents', inject(function($httpBackend) {
      $httpBackend.expect('GET', url).respond('hello');

      element.triggerHandler('click');
      $httpBackend.flush();

      window.setTimeout.expect(1).process();
      window.setTimeout.expect(1000).process();

      var kids = body.children();
      var foldout = angular.element(kids[kids.length-1]);
      expect(foldout.text()).toContain('hello');
    }));

    it('should hide then show when clicked again', inject(function($httpBackend) {
      $httpBackend.expect('GET', url).respond('hello');

      //enter
      element.triggerHandler('click');
      $httpBackend.flush();
      window.setTimeout.expect(1).process();
      window.setTimeout.expect(1000).process();

      //hide
      element.triggerHandler('click');
      window.setTimeout.expect(1).process();
      window.setTimeout.expect(500).process();

      //show
      element.triggerHandler('click');
      window.setTimeout.expect(1).process();
      window.setTimeout.expect(200).process();
    }));

  });

  describe('DocsController fold', function() {

    var window, $scope, ctrl;
    beforeEach(function() {
      module(function($provide, $animationProvider) {
        $provide.value('$window', window = angular.mock.createMockWindow());
      });
      inject(function($rootScope, $controller, $location, $cookies, sections) {
        $scope = $rootScope.$new();
        ctrl = $controller('DocsController',{
          $scope : $scope,
          $location : $location,
          $window : window,
          $cookies : $cookies,
          sections : sections
        });
      });
    });

    it('should download and reveal the foldover container', inject(function($compile, $httpBackend) {
      var url = '/page.html';
      var fullUrl = '/notes/' + url;
      $httpBackend.expect('GET', fullUrl).respond('hello');

      var element = angular.element('<div ng-include="docs_fold"></div>');
      $compile(element)($scope);
      $scope.$apply();

      $scope.fold(url);

      $httpBackend.flush();
    }));

  });

});
