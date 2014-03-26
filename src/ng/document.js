'use strict';

/**
 * @ngdoc service
 * @name $document
 * @requires $window
 *
 * @description
 * A {@link angular.element jQuery or jqLite} wrapper for the browser's `window.document` object.
 *
 * @example
   <example>
     <file name="index.html">
       <div ng-controller="MainCtrl">
         <p>$document title: <b ng-bind="title"></b></p>
         <p>window.document title: <b ng-bind="windowTitle"></b></p>
       </div>
     </file>
     <file name="script.js">
       function MainCtrl($scope, $document) {
         $scope.title = $document[0].title;
         $scope.windowTitle = angular.element(window.document)[0].title;
       }
     </file>
   </example>
 */
function $DocumentProvider(){
  this.$get = ['$window', function(window){
    return jqLite(window.document);
  }];
}
