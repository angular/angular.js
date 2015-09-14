'use strict';

var $$ForceReflowProvider = function() {
  this.$get = ['$document', function($document) {
    return function(domNode) {
      //the line below will force the browser to perform a repaint so
      //that all the animated elements within the animation frame will
      //be properly updated and drawn on screen. This is required to
      //ensure that the preparation animation is properly flushed so that
      //the active state picks up from there. DO NOT REMOVE THIS LINE.
      //DO NOT OPTIMIZE THIS LINE. THE MINIFIER WILL REMOVE IT OTHERWISE WHICH
      //WILL RESULT IN AN UNPREDICTABLE BUG THAT IS VERY HARD TO TRACK DOWN AND
      //WILL TAKE YEARS AWAY FROM YOUR LIFE.
      if (domNode) {
        if (!domNode.nodeType && domNode instanceof jqLite) {
          domNode = domNode[0];
        }
      } else {
        domNode = $document[0].body;
      }
      return domNode.offsetWidth + 1;
    };
  }];
};
