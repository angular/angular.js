(function(angular) {
  'use strict';
angular.module('html5-mode', ['fake-browser', 'address-bar'])

.constant('initUrl', 'http://www.example.com/base/path?a=b#h')
.constant('baseHref', '/base/index.html')
.value('$sniffer', { history: true })

.controller("LocationController", function($scope, $location) {
  $scope.$location = {};
  angular.forEach("protocol host port path search hash".split(" "), function(method){
   $scope.$location[method] = function(){
     var result = $location[method].call($location);
     return angular.isObject(result) ? angular.toJson(result) : result;
   };
  });
})

.config(function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
})

.run(function($rootElement) {
  $rootElement.on('click', function(e) { e.stopPropagation(); });
});
})(window.angular);