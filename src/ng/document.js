'use strict';

/**
 * @ngdoc object
 * @name ng.$document
 * @requires $window
 *
 * @description
 * A {@link angular.element jQuery or jqLite} wrapper for the browser's `window.document` object.
 */
function $DocumentProvider(){
  this.$get = ['$window', function(window){
    return jqLite(window.document);
  }];
}
