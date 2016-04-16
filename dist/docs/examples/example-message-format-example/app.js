(function(angular) {
  'use strict';
function Person(name, gender) {
  this.name = name;
  this.gender = gender;
}

angular.module('messageFormatExample', ['ngMessageFormat'])
  .controller('ckCtrl', function ($scope, $injector, $parse) {
    var people = [ new Person("Alice", "female"),
                   new Person("Bob", "male"),
                   new Person("Charlie", "male") ];

    $scope.sender = new Person("Harry Potter", "male");
    $scope.recipients = people.slice();

    $scope.setNumRecipients = function(n) {
      n = n > people.length ? people.length : n;
      $scope.recipients = people.slice(0, n);
    };

    $scope.setGender = function(person, gender) {
      person.gender = gender;
    };
  });
})(window.angular);