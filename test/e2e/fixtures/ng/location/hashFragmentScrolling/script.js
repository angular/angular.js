angular.module("test", [])
  .config(function($locationProvider) {
    $locationProvider.fixHashFragmentLinks(true);
  })
  .controller("TestCtrl", function($scope, $anchorScroll) {
    // $anchorScroll is required for handling automatic scrolling for hash fragment links
  });
