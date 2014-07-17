describe("DocsController", function() {
  var $scope;

  angular.module('fake', [])
    .value('$cookies', {})
    .value('openPlunkr', function() {})
    .value('NG_PAGES', {})
    .value('NG_NAVIGATION', {})
    .value('NG_VERSION', {});

  beforeEach(module('fake', 'DocsController'));
  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope;
    $controller('DocsController', { $scope: $scope });
  }));


  describe('afterPartialLoaded', function() {
    it("should update the Google Analytics with currentPage path if currentPage exists", inject(function($window) {
      $window._gaq = [];
      $scope.currentPage = { path: 'a/b/c' };
      $scope.afterPartialLoaded();
      expect($window._gaq.pop()).toEqual(['_trackPageview', 'a/b/c']);
    }));


    it("should update the Google Analytics with $location.path if currentPage is missing", inject(function($window, $location) {
      $window._gaq = [];
      spyOn($location, 'path').andReturn('x/y/z');
      $scope.afterPartialLoaded();
      expect($window._gaq.pop()).toEqual(['_trackPageview', 'x/y/z']);
    }));
  });
});