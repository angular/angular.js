(function(angular) {
  'use strict';
angular.module('ngAnimateChildren', ['ngAnimate'])
  .controller('mainController', function() {
    this.animateChildren = false;
    this.enterElement = false;
  });
})(window.angular);