'use strict';

/**
 * @ngdoc module
 * @name ngTouch
 * @description
 *
 * The `ngTouch` module provides helpers for touch-enabled devices.
 * The implementation is based on jQuery Mobile touch event handling
 * ([jquerymobile.com](http://jquerymobile.com/)). *
 *
 * See {@link ngTouch.$swipe `$swipe`} for usage.
 *
 * @deprecated
 * sinceVersion="1.7.0"
 * The ngTouch module with the {@link ngTouch.$swipe `$swipe`} service and
 * the {@link ngTouch.ngSwipeLeft} and {@link ngTouch.ngSwipeRight} directives are
 * deprecated. Instead, stand-alone libraries for touch handling and gesture interaction
 * should be used, for example [HammerJS](https://hammerjs.github.io/) (which is also used by
 * Angular).
 */

// define ngTouch module
/* global ngTouch */
var ngTouch = angular.module('ngTouch', []);

ngTouch.info({ angularVersion: '"NG_VERSION_FULL"' });

function nodeName_(element) {
  return angular.$$lowercase(element.nodeName || (element[0] && element[0].nodeName));
}
