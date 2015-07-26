(function(angular) {
  'use strict';
angular.module('controllerExample', [])
  .controller('SettingsController2', ['$scope', SettingsController2]);

function SettingsController2($scope) {
  $scope.name = "John Smith";
  $scope.contacts = [
    {type:'phone', value:'408 555 1212'},
    {type:'email', value:'john.smith@example.org'} ];

  $scope.greet = function() {
    alert($scope.name);
  };

  $scope.addContact = function() {
    $scope.contacts.push({type:'email', value:'yourname@example.org'});
  };

  $scope.removeContact = function(contactToRemove) {
    var index = $scope.contacts.indexOf(contactToRemove);
    $scope.contacts.splice(index, 1);
  };

  $scope.clearContact = function(contact) {
    contact.type = 'phone';
    contact.value = '';
  };
}
})(window.angular);