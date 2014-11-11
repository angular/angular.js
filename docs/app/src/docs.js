angular.module('DocsController', [])

.controller('DocsController', [
          '$scope', '$rootScope', '$location', '$window', '$cookies', 'openPlunkr',
              'NG_PAGES', 'NG_NAVIGATION', 'NG_VERSION',
  function($scope, $rootScope, $location, $window, $cookies, openPlunkr,
              NG_PAGES, NG_NAVIGATION, NG_VERSION) {

  $scope.openPlunkr = openPlunkr;

  $scope.docsVersion = NG_VERSION.isSnapshot ? 'snapshot' : NG_VERSION.version;

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
  });

  $scope.$watch(function docsPathWatch() {return $location.path(); }, function docsPathWatchAction(path) {

    path = path.replace(/^\/?(.+?)(\/index)?\/?$/, '$1');

    currentPage = $scope.currentPage = NG_PAGES[path];

    if ( currentPage ) {
      $scope.partialPath = 'partials/' + path + '.html';
      $scope.currentArea = NG_NAVIGATION[currentPage.area];
      var pathParts = currentPage.path.split('/');
      var breadcrumb = $scope.breadcrumb = [];
      var breadcrumbPath = '';
      angular.forEach(pathParts, function(part) {
        breadcrumbPath += part;
        breadcrumb.push({ name: (NG_PAGES[breadcrumbPath]&&NG_PAGES[breadcrumbPath].name) || part, url: breadcrumbPath });
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

  $scope.versionNumber = angular.version.full;
  $scope.version = angular.version.full + "  " + angular.version.codeName;
  $scope.loading = 0;


  var INDEX_PATH = /^(\/|\/index[^\.]*.html)$/;
  if (!$location.path() || INDEX_PATH.test($location.path())) {
    $location.path('/api').replace();
  }

}]);
