'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngUpdateModelOn
 * @restrict A
 *
 * @description
 * The `ngUpdateModelOn` directive changes default behavior of model updates. You can customize
 * which events will be bound to the `input` elements so that the model update will
 * only be triggered when they occur.
 *
 * This option will be applicable to those `input` elements that descend from the
 * element containing the directive. So, if you use `ngUpdateModelOn` on a `form`
 * element, the default behavior will be used on the `input` elements within.
 *
 *  See {@link guide/forms this link} for more information about debouncing and custom
 *  events.
 *
 * @element ANY
 * @param {string} ngUpdateModelOn Allows specifying an event or a comma-delimited list of events
 *    that will trigger a model update. If it is not set, it defaults to any inmediate change. If
 *    the list contains "default", the original behavior is also kept. You can also specify an
 *    object in which the key is the event and the value the particular debouncing timeout to be
 *    applied to it.
 */

var SIMPLEOBJECT_TEST = /^\s*?\{(.*)\}\s*?$/;

var NgUpdateModelOnController = ['$attrs', '$scope',
    function UpdateModelOnController($attrs, $scope) {

  var attr = $attrs['ngUpdateModelOn'];
  var updateModelOnValue;
  var updateModelDebounceValue;

  if (SIMPLEOBJECT_TEST.test(attr)) {
    updateModelDebounceValue = $scope.$eval(attr);
    var keys = [];
    for(var k in updateModelDebounceValue) {
      keys.push(k);
    }
    updateModelOnValue = keys.join(',');
  }
  else {
    updateModelOnValue = attr;
  }

  this.$getEventList = function() {
    return updateModelOnValue;
  };

  this.$getDebounceTimeout = function() {
    return updateModelDebounceValue;
  };
}];

var ngUpdateModelOnDirective = [function() {
  return {
    restrict: 'A',
    controller: NgUpdateModelOnController
  };
}];


/**
 * @ngdoc directive
 * @name ng.directive:ngUpdateModelDebounce
 * @restrict A
 *
 * @description
 * The `ngUpdateModelDebounce` directive allows specifying a debounced timeout to model updates so they
 * are not triggerer instantly but after the timer has expired.
 *
 * If you need to specify different timeouts for each event, you can use
 * {@link module:ng.directive:ng.directive:ngUpdateModelOn ngUpdateModelOn} directive which the object notation.
 *
 * @element ANY
 * @param {integer} ngUpdateModelDebounce Time in milliseconds to wait since the last registered
   *    content change before triggering a model update.
 */
var NgUpdateModelDebounceController = ['$attrs',
    function UpdateModelDebounceController($attrs) {

  var updateModelDefaultTimeoutValue = $attrs['ngUpdateModelDebounce'];

  this.$getDefaultTimeout = function() {
    return updateModelDefaultTimeoutValue;
  };
}];

var ngUpdateModelDebounceDirective = [function() {
  return {
    restrict: 'A',
    controller: NgUpdateModelDebounceController
  };
}];
