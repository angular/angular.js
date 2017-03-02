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

ngTouch.provider('$touch', $TouchProvider);

function nodeName_(element) {
  return angular.lowercase(element.nodeName || (element[0] && element[0].nodeName));
}

/**
 * @ngdoc provider
 * @name $touchProvider
 *
 * @description
 * The `$touchProvider` allows configuration of the ngTouch module. It currently contains
 * no methods.
 */
$TouchProvider.$inject = [];
function $TouchProvider() {

  /**
  * @ngdoc service
  * @name $touch
  * @kind object
  *
  * @description
  * The `$touch` service currently has no contents.
  */
  // eslint-disable-next-line no-invalid-this
  this.$get = function() {
    return {};
  };

}
