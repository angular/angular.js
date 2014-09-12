var ngSvgDirectives = {};
var svgAttrUrlMatcher = /^url\((.*)\)$/;
var svgElementMatcher = /\[object SVG[a-z]*Element/i;

function computeSVGAttrValue (url, $loc) {
  var match, fullUrl = url;
  if (match = svgAttrUrlMatcher.exec(url)) {
    //hash in html5Mode, forces to be relative to current url instead of base
    if (match[1].indexOf('#') === 0 && $loc.$$html5) {
      fullUrl = $loc.absUrl() + match[1];
    }
    else if (match[1].indexOf('#') === 0) {
      // fullUrl = $loc.absUrl().replace(/#.*/, matc)
      fullUrl = $loc.protocol() + '://' + $loc.host() + ($loc.port() !== 80 ? ':' + $loc.port() : '') + $loc.path() + match[1];
    }
    else {
      //supports relative urls and hash in non-html5Mode
      fullUrl = urlResolve(match[1]).href;
    }

  }

  return 'url(' + fullUrl + ')';
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
  ], function(attr) {
  ngSvgDirectives[attr] = ['$rootScope', '$location', '$interpolate', function($rootScope, $location, $interpolate) {
    return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var initialUrl;
      //TODO: verify whether or not attribute must end with )
      //TODO: support expressions

      //Only apply to svg elements to avoid observing
      if (!svgElementMatcher.test(element[0])) return;
      initialUrl = attrs[attr];
      attrs.$observe(attr, updateValue);
      $rootScope.$on('$locationChangeSuccess', updateValue);


      function updateValue () {
        var newVal = computeSVGAttrValue(initialUrl, $location);
        //Prevent recursive updating
        if (attrs[attr] !== newVal) attrs.$set(attr, newVal);
      }
    }
  }}];
});
