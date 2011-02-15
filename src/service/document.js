/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$document
 * @requires $window
 *
 * @description
 * Reference to the browser window.document, but wrapped into angular.element().
 */
angularServiceInject("$document", function(window){
  return jqLite(window.document);
}, ['$window'], true);
