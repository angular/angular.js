'use strict';

angular.module('DocsController', ['currentVersionData'])

.controller('DocsController', [
          '$scope', '$rootScope', '$location', '$window', '$cookies',
              'NG_PAGES', 'NG_NAVIGATION', 'CURRENT_NG_VERSION',
  function($scope, $rootScope, $location, $window, $cookies,
              NG_PAGES, NG_NAVIGATION, CURRENT_NG_VERSION) {

  $scope.navClass = function(navItem) {
    return {
      active: navItem.href && this.currentPage && this.currentPage.path,
      current: this.currentPage && this.currentPage.path === navItem.href,
      'nav-index-section': navItem.type === 'section'
    };
  };



  $scope.$on('$includeContentLoaded', function() {
    var pagePath = $scope.currentPage ? $scope.currentPage.path : $location.path();
    $window._gaq.push(['_trackPageview', pagePath]);
    $scope.loading = false;
  });

  $scope.$on('$includeContentError', function() {
    $scope.loading = false;
  });

  $scope.$watch(function docsPathWatch() {return $location.path(); }, function docsPathWatchAction(path) {

    path = path.replace(/^\/?(.+?)(\/index)?\/?$/, '$1');

    var currentPage = $scope.currentPage = NG_PAGES[path];

    $scope.loading = true;

    if (currentPage) {
      $scope.partialPath = 'partials/' + path + '.html';
      $scope.currentArea = NG_NAVIGATION[currentPage.area];
      var pathParts = currentPage.path.split('/');
      var breadcrumb = $scope.breadcrumb = [];
      var breadcrumbPath = '';
      angular.forEach(pathParts, function(part) {
        breadcrumbPath += part;
        breadcrumb.push({ name: (NG_PAGES[breadcrumbPath] && NG_PAGES[breadcrumbPath].name) || part, url: breadcrumbPath });
        breadcrumbPath += '/';
      });
    } else {
      $scope.currentArea = NG_NAVIGATION['api'];
      $scope.breadcrumb = [];
      $scope.partialPath = 'Error404.html';
    }
  });

  /**********************************
   Initialize
   ***********************************/

  $scope.versionNumber = CURRENT_NG_VERSION.full;
  $scope.version = CURRENT_NG_VERSION.full + ' ' + CURRENT_NG_VERSION.codeName;
  $scope.loading = 0;


  var INDEX_PATH = /^(\/|\/index[^.]*.html)$/;
  if (!$location.path() || INDEX_PATH.test($location.path())) {
    $location.path('/api').replace();
  }

}]);
