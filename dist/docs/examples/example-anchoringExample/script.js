(function(angular) {
  'use strict';
angular.module('anchoringExample', ['ngAnimate', 'ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'home.html',
      controller: 'HomeController as home'
    });
    $routeProvider.when('/profile/:id', {
      templateUrl: 'profile.html',
      controller: 'ProfileController as profile'
    });
  }])
  .run(['$rootScope', function($rootScope) {
    $rootScope.records = [
      { id:1, title: "Miss Beulah Roob" },
      { id:2, title: "Trent Morissette" },
      { id:3, title: "Miss Ava Pouros" },
      { id:4, title: "Rod Pouros" },
      { id:5, title: "Abdul Rice" },
      { id:6, title: "Laurie Rutherford Sr." },
      { id:7, title: "Nakia McLaughlin" },
      { id:8, title: "Jordon Blanda DVM" },
      { id:9, title: "Rhoda Hand" },
      { id:10, title: "Alexandrea Sauer" }
    ];
  }])
  .controller('HomeController', [function() {
    //empty
  }])
  .controller('ProfileController', ['$rootScope', '$routeParams', function($rootScope, $routeParams) {
    var index = parseInt($routeParams.id, 10);
    var record = $rootScope.records[index - 1];

    this.title = record.title;
    this.id = record.id;
  }]);
})(window.angular);