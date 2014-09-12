var ngSvgDirectives = {};
var svgAttrUrlMatcher = /^url\((.*)\)$/;
var svgElementMatcher = /\[object SVG[a-z]*Element/i;
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
  ], function(attr) {
  ngSvgDirectives[attr] = ['$location', '$interpolate', function($location, $interpolate) {
    return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      //TODO: verify whether or not attribute must end with )

      //TODO: support expressions
      //Only apply to svg elements to avoid observing
      if (!svgElementMatcher.test(element[0])) return;
      attrs.$observe(attr, function(val) {
        var match, newVal;
        if (match = svgAttrUrlMatcher.exec(attrs[attr])) {
          if (match[1].indexOf('#') === 0) {
            //Only works in html5Mode
            newVal = 'url(' + $location.absUrl() + match[1] + ')';
          }
          else {
            newVal = 'url(' + urlResolve(match[1]).href + ')';
          }

          //Prevent recursive updating
          if (val !== newVal) attrs.$set(attr, newVal);
        }
      });

    }
  }}];
});
