'use strict';

function $$RAFProvider(){ //rAF
  this.$get = ['$window', function($window) {
    var requestAnimationFrame = $window.requestAnimationFrame ||
                                $window.webkitRequestAnimationFrame;

    var cancelAnimationFrame = $window.cancelAnimationFrame ||
                               $window.webkitCancelAnimationFrame;

    var raf = function(fn) {
      var id = requestAnimationFrame(fn);
      return function() {
        cancelAnimationFrame(id);
      };
    };

    raf.supported = !!requestAnimationFrame;

    return raf;
  }];
}
