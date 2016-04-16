(function(angular) {
  'use strict';
function Person(name, gender) {
  this.name = name;
  this.gender = gender;
}

var alice   = new Person("Alice", "female"),
    bob     = new Person("Bob", "male"),
    charlie = new Person("Charlie", "male"),
    harry   = new Person("Harry Potter", "male");

angular.module('msgFmtExample', ['ngMessageFormat'])
  .controller('AppController', ['$scope', function($scope) {
      $scope.recipients = [alice, bob, charlie];
      $scope.sender = harry;
      $scope.decreaseRecipients = function() {
        --$scope.recipients.length;
      };
    }]);
})(window.angular);