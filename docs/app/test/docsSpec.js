'use strict';

describe('DocsController', function() {
  var $scope;

  angular.module('fake', [])
    .value('$cookies', {})
    .value('NG_PAGES', {})
    .value('NG_NAVIGATION', {});

  angular.module('currentVersionData', [])
    .value('CURRENT_NG_VERSION', {});

  angular.module('allVersionsData', [])
    .value('ALL_NG_VERSIONS', {});

  beforeEach(module('fake', 'DocsController'));
  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope;
    $controller('DocsController', { $scope: $scope });
  }));


  describe('afterPartialLoaded', function() {
    it('should update the Google Analytics with currentPage path if currentPage exists', inject(function($window) {
      $window._gaq = [];
      $scope.currentPage = { path: 'a/b/c' };
      $scope.$broadcast('$includeContentLoaded');
      expect($window._gaq.pop()).toEqual(['_trackPageview', 'a/b/c']);
    }));


    it('should update the Google Analytics with $location.path if currentPage is missing', inject(function($window, $location) {
      $window._gaq = [];
      spyOn($location, 'path').and.returnValue('x/y/z');
      $scope.$broadcast('$includeContentLoaded');
      expect($window._gaq.pop()).toEqual(['_trackPageview', 'x/y/z']);
    }));
  });
});
