angular.module('DocsController', [])

.controller('DocsController', [
          '$scope', '$rootScope', '$location', '$window', '$cookies', 'openPlunkr',
              'NG_PAGES', 'NG_NAVIGATION', 'NG_VERSION',
  function($scope, $rootScope, $location, $window, $cookies, openPlunkr,
              NG_PAGES, NG_NAVIGATION, NG_VERSION) {


  $scope.openPlunkr = openPlunkr;

  $scope.docsVersion = NG_VERSION.isSnapshot ? 'snapshot' : NG_VERSION.version;

  var INDEX_PATH = /^(\/|\/index[^\.]*.html)$/;


  /**********************************
   Publish methods
   ***********************************/

  $scope.navClass = function(navItem) {
    return {
      active: navItem.href && this.currentPage && this.currentPage.path,
      'nav-index-section': navItem.type === 'section'
    };
  };

  $scope.afterPartialLoaded = function() {
    var pagePath = $scope.currentPage ? $scope.currentPage.path : $location.path();
    $window._gaq.push(['_trackPageview', pagePath]);
  };


  /**********************************
   Watches
   ***********************************/


  $scope.$watch(function docsPathWatch() {return $location.path(); }, function docsPathWatchAction(path) {

    var currentPage = $scope.currentPage = NG_PAGES[path];
    if ( !currentPage && path.charAt(0)==='/' ) {
      // Strip off leading slash
      path = path.substr(1);
    }

    currentPage = $scope.currentPage = NG_PAGES[path];
    if ( !currentPage && path.charAt(path.length-1) === '/' && path.length > 1 ) {
      // Strip off trailing slash
      path = path.substr(0, path.length-1);
    }

    currentPage = $scope.currentPage = NG_PAGES[path];
    if ( !currentPage && /\/index$/.test(path) ) {
      // Strip off index from the end
      path = path.substr(0, path.length - 6);
    }

    currentPage = $scope.currentPage = NG_PAGES[path];

    if ( currentPage ) {
      $scope.currentArea = currentPage && NG_NAVIGATION[currentPage.area];
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
    }
  });

  /**********************************
   Initialize
   ***********************************/

  $scope.versionNumber = angular.version.full;
  $scope.version = angular.version.full + "  " + angular.version.codeName;
  $scope.loading = 0;


  if (!$location.path() || INDEX_PATH.test($location.path())) {
    $location.path('/api').replace();
  }

}]);
