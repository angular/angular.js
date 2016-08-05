'use strict';

angular.module('docsApp', [
  'ngRoute',
  'ngCookies',
  'ngSanitize',
  'ngAnimate',
  'DocsController',
  'versionsData',
  'pagesData',
  'navData',
  'directives',
  'errors',
  'examples',
  'search',
  'tutorials',
  'versions',
  'ui.bootstrap.dropdown'
])

.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
}]);
