'use strict';

/**
 * @ngdoc module
 * @name ngTouch
 * @description
 *
 * # ngTouch
 *
 * The `ngTouch` module provides the touch-event based {@link ngTouch.$swipe `$swipe`} directive.
 *
 * <div class="alert alert-info">
 * Angular 1.5.0 has **removed** the override to the `ngClick` directive that eliminates the 300ms delay
 * after a tap on mobile browsers. It was removed because the implementation was unreliable, and because
 * the 300ms delay is on its way out on modern mobile browsers.
 * If you need this behavior, consider using [FastClick](https://github.com/ftlabs/fastclick) or
 * [Tappy!](https://github.com/filamentgroup/tappy/)
 * </div>
 *
 *
 * <div doc-module-components="ngTouch"></div>
 *
 */

// define ngTouch module
/* global -ngTouch */
var ngTouch = angular.module('ngTouch', []);

function nodeName_(element) {
  return angular.lowercase(element.nodeName || (element[0] && element[0].nodeName));
}
