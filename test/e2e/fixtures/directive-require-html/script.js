'use strict';

angular.
  module('test', []).
    provider('$exceptionHandler', /** @this */ function() {
      this.$get = [function() {
        return function(error) {
          window.document.querySelector('#container').textContent = error && error.message;
        };
      }];
  }).

  directive('requireDirective', function() {
    return {
      require: '^^requireTargetDirective',
      link: function(scope, element, attrs, ctrl) {
        window.document.querySelector('#container').textContent = ctrl.content;
      }
    };
  }).
  directive('requireTargetDirective', function() {
    return {
      controller: function() {
        this.content = 'requiredContent';
      }
    };
  });

