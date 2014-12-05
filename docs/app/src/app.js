'use strict';

angular.module('docsApp', [
  'ngMaterial',
  'HeaderController',
  'FooterController',
  'DocsController',
  'ViewUtils',
  'versionsData',
  'pagesData',
  'navData',
  'directives',
  'errors',
  'examples',
  'search',
  'tutorials',
  'versions',
  'responsiveMenu'
])

.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
}]);
