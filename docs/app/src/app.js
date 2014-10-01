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
  'bootstrap',
  'ui.bootstrap.dropdown',
  'heading-offset'
])


.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
}])

.run(['headingOffset', function(headingOffset) {
  // Provide the initial offset for heading anchors
  headingOffset.value = '120px';
}]);
