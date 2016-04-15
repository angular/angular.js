(function(angular) {
  'use strict';
angular.module('mySceApp', ['ngSanitize'])
  .controller('AppController', ['$http', '$templateCache', '$sce',
    function($http, $templateCache, $sce) {
      var self = this;
      $http.get("test_data.json", {cache: $templateCache}).success(function(userComments) {
        self.userComments = userComments;
      });
      self.explicitlyTrustedHtml = $sce.trustAsHtml(
          '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' +
          'sanitization.&quot;">Hover over this text.</span>');
    }]);
})(window.angular);