'use strict';

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$sniffer
 * @requires $window
 *
 * @property {boolean} history Does the browser support html5 history api ?
 * @property {boolean} hashchange Does the browser support hashchange event ?
 *
 * @description
 * This is very simple implementation of testing browser's features.
 */
angularServiceInject('$sniffer', function($window) {
  if ($window.Modernizr) return $window.Modernizr;

  return {
    history: !!($window.history && $window.history.pushState),
    hashchange: 'onhashchange' in $window &&
                // IE8 compatible mode lies
                (!$window.document.documentMode || $window.document.documentMode > 7)
  };
}, ['$window']);
