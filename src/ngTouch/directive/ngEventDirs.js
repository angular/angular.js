'use strict';

/* global ngTouch: false, POINTER_EVENTS: false, getPointerEventNames: false */

/*
 * A collection of directives that allows creation of custom event handlers that are defined as
 * angular expressions and are compiled and executed within the current scope.
 */
var ngTouchEventDirectives = {};


// Duplicate from the ng module...
var forceAsyncEvents = {
  'blur': true,
  'focus': true
};

// Duplicated from jqLite.
var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;
/**
 * Converts snake_case to camelCase.
 * Also there is special case for Moz prefix starting with upper case letter.
 * @param name Name to normalize
 */
function camelCase(name) {
  return name.
    replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).
    replace(MOZ_HACK_REGEXP, 'Moz$1');
}

angular.forEach(Object.keys(POINTER_EVENTS.mouse),
  function (eventType) {

    var eventName = POINTER_EVENTS.mouse[eventType];
    var directiveName = camelCase('ng-' + eventName);

    ngTouch.config(['$provide', function ($provide) {
      $provide.decorator(directiveName + 'Directive', ['$delegate', function ($delegate) {
        // drop the default mouse directives
        $delegate.shift();
        return $delegate;
      }]);
    }]);

    ngTouchEventDirectives[directiveName] = ['$parse', '$rootScope', function ($parse, $rootScope) {
      return {
        restrict: 'A',
        compile: function ($element, attr) {
          var fn = $parse(attr[directiveName]);
          return function ngEventHandler(scope, element) {
            //
            element.on(getPointerEventNames(eventType), function (event) {
              var callback = function () {
                fn(scope, {$event: event});
              };
              if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                scope.$evalAsync(callback);
              } else {
                scope.$apply(callback);
              }
            });

          };
        }
      };
    }];
  }
);

ngTouch.directive(ngTouchEventDirectives);


