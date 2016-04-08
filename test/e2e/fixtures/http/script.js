angular.module('test', [])
  .controller('TestCtrl', function($scope, $http, $cacheFactory, $timeout) {
    var cache = $cacheFactory('sites');
    var siteUrl = "http://some.site";
    cache.put(siteUrl, "Something");
    $http.get(siteUrl, {cache: cache}).then(function(data) {
      $scope.text = "Hello, world!";
    });
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $window) {
      return {
       'request': function(config) {
          return $q(function(resolve,reject) {
            $window.setTimeout(function() {
              resolve(config);
            }, 50);
          });
        },
        'response': function(response) {
          return $q(function(resolve,reject) {
            $window.setTimeout(function() {
              resolve(response);
            }, 50);
          });
        }
      };
    });
  });
