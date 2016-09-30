'use strict';

angular.
  module('test', []).
  run(function($sce) {
    window.isTrustedUrl = function(url) {
      try {
        $sce.getTrustedResourceUrl(url);
      } catch (e) {
        return false;
      }
      return true;
    };
  });
