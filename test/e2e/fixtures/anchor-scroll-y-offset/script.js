'use strict';

angular.
  module('test', []).
  controller('TestController', function($anchorScroll, $location, $scope) {
    $anchorScroll.yOffset = 50;

    $scope.scrollTo = function(target) {
      if ($location.hash() !== target) {
        // Set `$location.hash()` to `target` and
        // `$anchorScroll` will detect the change and scroll
        $location.hash(target);
      } else {
        // The hash is the same, but `target` might be out of view -
        // explicitly call `$anchorScroll`
        $anchorScroll();
      }
    };
  });
