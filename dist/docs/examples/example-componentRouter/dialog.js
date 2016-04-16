(function(angular) {
  'use strict';
angular.module('dialog', [])

.service('dialogService', DialogService);

function DialogService($q) {
  this.confirm = function(message) {
    return $q.when(window.confirm(message || 'Is it OK?'));
  };
}
})(window.angular);