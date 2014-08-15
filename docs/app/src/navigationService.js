angular.module('docsApp.navigationService', [])

.factory('navigationService', function($window) {
  var service = {
    currentPage: null,
    currentVersion: null,
    changePage: function(newPage) {

    },
    changeVersion: function(newVersion) {

      //TODO =========
    //   var currentPagePath = '';

    // // preserve URL path when switching between doc versions
    // if (angular.isObject($rootScope.currentPage) && $rootScope.currentPage.section && $rootScope.currentPage.id) {
    //   currentPagePath = '/' + $rootScope.currentPage.section + '/' + $rootScope.currentPage.id;
    // }

    // $window.location = version.url + currentPagePath;

    }
  };
});
