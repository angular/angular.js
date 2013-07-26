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
      module(function($provide, $animateProvider) {
        $provide.value('$window', window = angular.mock.createMockWindow());
        $animateProvider.register('.foldout', function($timeout) {
          return {
            enter : function(element, done) {
              $timeout(done, 1000);
            },
            removeClass : function(element, className, done) {
              $timeout(done, 500);
            },
            addClass : function(element, className, done) {
              $timeout(done, 200);
            }
          }
        });
      });
      inject(function($rootScope, $compile, $templateCache, $rootElement, $animate) {
        $animate.enabled(true);
        url = '/page.html';
        $scope = $rootScope.$new();
        parent = angular.element('<div class="parent"></div>');

        //we're injecting the element to the $rootElement since the changes in
        //$animate only detect and perform animations if the root element has
        //animations enabled. If the element is not apart of the DOM
        //then animations are skipped.
        element = angular.element('<div data-url="' + url + '" class="foldout" foldout></div>');
        parent.append(element);
        $rootElement.append(parent);
        body.append($rootElement);

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

    it('should download a foldout HTML page and animate the contents', inject(function($httpBackend, $timeout) {
      $httpBackend.expect('GET', url).respond('hello');

      element.triggerHandler('click');
      $httpBackend.flush();

      $timeout.flushNext(0);
      $timeout.flushNext(1);
      $timeout.flushNext(0);
      $timeout.flushNext(1000);

      var kids = body.children();
      var foldout = angular.element(kids[kids.length-1]);
      expect(foldout.text()).toContain('hello');
    }));

    it('should hide then show when clicked again', inject(function($httpBackend, $timeout) {
      $httpBackend.expect('GET', url).respond('hello');

      //enter
      element.triggerHandler('click');
      $httpBackend.flush();
      $timeout.flushNext(0);
      $timeout.flushNext(1);
      $timeout.flushNext(0);
      $timeout.flushNext(1000);

      //hide
      element.triggerHandler('click');
      $timeout.flushNext(1);
      $timeout.flushNext(0);
      $timeout.flushNext(200);
      $timeout.flushNext(0);

      //show
      element.triggerHandler('click');
      $timeout.flushNext(1);
      $timeout.flushNext(0);
      $timeout.flushNext(500);
      $timeout.flushNext(0);
    }));

  });

  describe('DocsController fold', function() {

    var window, $scope, ctrl;
    beforeEach(function() {
      module(function($provide, $animateProvider) {
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
