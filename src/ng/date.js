'use strict';

/**
 * @ngdoc service
 * @name $date
 * @requires $window
 *
 * @description
 * Simple service for accessing date.
 *
 * The main purpose of this service is to simplify mocking date in tests.
 *
 * @example
   <example module="dateExample">
     <file name="script.js">
       angular.module('dateExample', [])
         .controller('TimeController', ['$scope', '$date', function($scope, $date) {
           $scope.now = $date.now();
         }]);
     </file>
     <file name="index.html">
       <div ng-controller="TimeController">
         <p>Time when the page was created: {{now | date}}</p>
       </div>
     </file>
   </example>
 */
function $DateProvider() {
  var self = this;

  this.$get = ['$window', function($window) {
    return {
      /**
       * @ngdoc method
       * @name $date#now
       *
       * @description
       * Return Date object representing current date
       */
      now: function() {
        return $window.Date();
      }
    };
  }];
}
