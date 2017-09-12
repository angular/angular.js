'use strict';

/**
 * @ngdoc module
 * @name ngTouch
 * @description
 *
 * # ngTouch
 *
 * The `ngTouch` module provides helpers for touch-enabled devices.
 * The implementation is based on jQuery Mobile touch event handling
 * ([jquerymobile.com](http://jquerymobile.com/)).
 *
 *
 * See {@link ngTouch.$swipe `$swipe`} for usage.
 *
 * <div doc-module-components="ngTouch"></div>
 *
 */

// define ngTouch module
/* global ngTouch */
var ngTouch = angular.module('ngTouch', []);

ngTouch.info({ angularVersion: '"NG_VERSION_FULL"' });

function nodeName_(element) {
  return angular.$$lowercase(element.nodeName || (element[0] && element[0].nodeName));
}
