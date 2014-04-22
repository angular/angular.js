angular.module('DocsController', [])

.controller('DocsController', [
          '$scope', '$rootScope', '$location', '$window', '$cookies', 'openPlunkr',
              'NG_PAGES', 'NG_NAVIGATION', 'NG_VERSION',
  function($scope, $rootScope, $location, $window, $cookies, openPlunkr,
              NG_PAGES, NG_NAVIGATION, NG_VERSION) {


  $scope.openPlunkr = openPlunkr;

  $scope.docsVersion = NG_VERSION.isSnapshot ? 'snapshot' : NG_VERSION.version;

  $scope.fold = function(url) {
    if(url) {
      $scope.docs_fold = '/notes/' + url;
      if(/\/build/.test($window.location.href)) {
        $scope.docs_fold = '/build/docs' + $scope.docs_fold;
      }
      window.scrollTo(0,0);
    }
    else {
      $scope.docs_fold = null;
    }
  };
  var OFFLINE_COOKIE_NAME = 'ng-offline',
      INDEX_PATH = /^(\/|\/index[^\.]*.html)$/;


  /**********************************
   Publish methods
   ***********************************/

  $scope.navClass = function(navItem) {
    return {
      active: navItem.href && this.currentPage.path,
      'nav-index-section': navItem.type === 'section'
    };
  };

  $scope.afterPartialLoaded = function() {
    var pagePath = $scope.currentPage ? $scope.currentPage.path : $location.path();
    $window._gaq.push(['_trackPageview', pagePath]);
  };

  /** stores a cookie that is used by apache to decide which manifest ot send */
  $scope.enableOffline = function() {
    //The cookie will be good for one year!
    var date = new Date();
    date.setTime(date.getTime()+(365*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
    var value = angular.version.full;
    document.cookie = OFFLINE_COOKIE_NAME + "="+value+expires+"; path=" + $location.path;

    //force the page to reload so server can serve new manifest file
    window.location.reload(true);
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
  $scope.subpage = false;
  $scope.offlineEnabled = ($cookies[OFFLINE_COOKIE_NAME] == angular.version.full);
  $scope.futurePartialTitle = null;
  $scope.loading = 0;
  $scope.$cookies = $cookies;

  $cookies.platformPreference = $cookies.platformPreference || 'gitUnix';

  if (!$location.path() || INDEX_PATH.test($location.path())) {
    $location.path('/api').replace();
  }

  // bind escape to hash reset callback
  angular.element(window).on('keydown', function(e) {
    if (e.keyCode === 27) {
      $scope.$apply(function() {
        $scope.subpage = false;
      });
    }
  });
}]);
