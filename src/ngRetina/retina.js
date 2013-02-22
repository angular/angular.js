(function(angular, undefined) {
'use strict';

/**
 * @ngdoc overview
 * @name ngRetina
 * @description
 */

/*
 * ngRetina by Jacob Rief <jacob.rief@gmail.com>
 * 
 * Add support for Retina displays when using element attribute "ng-src".
 * This module overrides the built-in directive "ng-src" with one which 
 * distinguishes between standard or high-resolution (Retina) displays.
 */

/**
 * @ngdoc service
 * @name ngRetina
 * @function
 *
 * @description
 *   To make use of this feature, include this file just after including the main
 *   angular.js file.
 * 
 *   Applications supporting Retina displays should include two separate files for
 *   each image resource. One file provides a standard-resolution version of a
 *   given image, and the second provides a high-resolution version of the same
 *   image. The naming conventions for each pair of image files is as follows:
 *   - Standard: <image_name>.<filename_extension>
 *   - High resolution: <image_name>@2x.<filename_extension>
 *
 *   If the browser runs on a high-resolution display, and if the referenced image
 *   is available in high-resolution, the corresponding <img ng-src="..."> tag is
 *   interpreted, such that the image in high-resolution is referenced.
 *   This module also rewrites <img ng-src="..."> tags, which contain a static
 *   image url, ie. one without any mark-up directives.
 *
 *   Note that when using this module, adding the element attributes 'width="..."'
 *   and 'height="..."' becomes mandatory, as the displayed high-resolution image
 *   otherwise gets scaled to the double size.
 */

angular.module('ngRetina', []).config(function($provide) {
  $provide.decorator('ngSrcDirective', function($delegate) {
    $delegate[0].compile = function(element, attrs) {
      // intentionally empty to override the built-in directive ng-src
    };
    return $delegate;
  });
})
.directive('ngSrc', function($window, $http, $cacheFactory) {
  var cache = $cacheFactory('retinaImageURLs');
  var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), "
    + "(-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)";
  var msie = parseInt(((/msie (\d+)/.exec($window.navigator.userAgent.toLowerCase()) || [])[1]), 10);

  function isRetina() {
    if ($window.devicePixelRatio > 1)
      return true;
    return ($window.matchMedia && $window.matchMedia(mediaQuery).matches);
  };

  function getHighResolutionURL(url) {
    var parts = url.split('.');
    if (parts.length < 2)
      return url;
    parts[parts.length - 2] += '@2x';
    return parts.join('.');
  }

  return function(scope, element, attrs) {
    function setImgSrc(img_url) {
      attrs.$set('src', img_url);
      if (msie) element.prop('src', img_url);
    }

    function set2xVariant(img_url) {
      var img_url_2x = cache.get(img_url);
      if (img_url_2x === undefined) {
        img_url_2x = getHighResolutionURL(img_url);
        $http.head(img_url_2x).
        success(function(data, status) {
          setImgSrc(img_url_2x);
          cache.put(img_url, img_url_2x);
        }).
        error(function(data, status, headers, config) {
          setImgSrc(img_url);
          cache.put(img_url, img_url);
        });
      } else {
        setImgSrc(img_url_2x);
      }
    }

    attrs.$observe('ngSrc', function(value) {
      if (!value)
        return;
      if (isRetina()) {
        set2xVariant(value);
      } else {
        setImgSrc(value);
      }
    });
  };
});

})(window.angular);
