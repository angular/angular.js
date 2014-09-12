'use strict';

var ngSvgDirectives = {};
var svgAttrUrlMatcher = /^url\((.*)\)$/;
var svgElementMatcher = /\[object SVG[a-z]*Element/i;
var svgUrlHashMatchExp = /#.*/;

function computeSVGAttrValue (url, $loc) {
  var match, fullUrl;
  if (match = svgAttrUrlMatcher.exec(url)) {
    //hash in html5Mode, forces to be relative to current url instead of base
    if (match[1].indexOf('#') === 0 && $loc.$$html5) {
      fullUrl = $loc.absUrl() + match[1];
    }
    //Hash in non-html5Mode
    else if (match[1].indexOf('#') === 0) {
      fullUrl = $loc.absUrl().replace(svgUrlHashMatchExp, '') + match[1];
    }
    //Non-hash URLs in any mode
    else {
      fullUrl = urlResolve(match[1]).href;
    }
  }

  return fullUrl ? 'url(' + fullUrl + ')' : null;
}

forEach([
    'clipPath',
    'colorProfile',
    'src',
    'cursor',
    'fill',
    'filter',
    'marker',
    'markerStart',
    'markerMid',
    'markerEnd',
    'mask',
    'stroke'
  ],
  function(attr) {
    ngSvgDirectives[attr] = [
        '$rootScope', '$location', '$interpolate',
        function($rootScope, $location, $interpolate) {
          return {
            restrict: 'A',
            link: function(scope, element, attrs) {
              var initialUrl;
              //TODO: verify whether or not attribute must end with )
              //TODO: support expressions

              //Only apply to svg elements to avoid unnecessary observing
              if (!svgElementMatcher.test(element[0])) return;

              initialUrl = attrs[attr];
              attrs.$observe(attr, updateValue);
              if ($location.$$html5) $rootScope.$on('$locationChangeSuccess', updateValue);

              function updateValue () {
                var newVal = computeSVGAttrValue(initialUrl, $location);
                //Prevent recursive updating
                if (newVal && attrs[attr] !== newVal) attrs.$set(attr, newVal);
              }
            }
          };
        }];
});
