/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$document
 * @requires $window
 *
 * @description
 * A {@link angular.element jQuery (lite)}-wrapped reference to the browser's `window.document`
 * element.
 */
angularServiceInject("$document", function(window){
  return jqLite(window.document);
}, ['$window'], true);
