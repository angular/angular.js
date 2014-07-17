angular.module('docsApp', [
  'ngRoute',
  'ngCookies',
  'ngSanitize',
  'ngAnimate',
  'DocsController',
  'versionsData',
  'pagesData',
  'directives',
  'errors',
  'examples',
  'search',
  'tutorials',
  'versions',
  'bootstrap',
  'bootstrapPrettify',
  'ui.bootstrap.dropdown'
])


.config(function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
});