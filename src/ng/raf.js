'use strict';

function createRAF($window) {
  var requestAnimationFrame = $window.requestAnimationFrame ||
                              $window.webkitRequestAnimationFrame;

  var cancelAnimationFrame = $window.cancelAnimationFrame ||
                             $window.webkitCancelAnimationFrame ||
                             $window.webkitCancelRequestAnimationFrame;

  var raf = function(fn) {
    var id = requestAnimationFrame(fn);
    return function() {
      cancelAnimationFrame(id);
    };
  };

  raf.supported = !!requestAnimationFrame;

  return raf;
}

function $$RAFProvider(){ //rAF
  this.$get = ['$window', function($window) {
    return createRAF($window);
  }];
}
