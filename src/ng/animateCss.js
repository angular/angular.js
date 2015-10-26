'use strict';

/**
 * @ngdoc service
 * @name $animateCss
 * @kind object
 *
 * @description
 * This is the core version of `$animateCss`. By default, only when the `ngAnimate` is included,
 * then the `$animateCss` service will actually perform animations.
 *
 * Click here {@link ngAnimate.$animateCss to read the documentation for $animateCss}.
 */
var $CoreAnimateCssProvider = function() {
  this.$get = ['$$rAF', '$q', '$$AnimateRunner', function($$rAF, $q, $$AnimateRunner) {

    return function(element, initialOptions) {
      // we always make a copy of the options since
      // there should never be any side effects on
      // the input data when running `$animateCss`.
      var options = copy(initialOptions);

      // there is no point in applying the styles since
      // there is no animation that goes on at all in
      // this version of $animateCss.
      if (options.cleanupStyles) {
        options.from = options.to = null;
      }

      if (options.from) {
        element.css(options.from);
        options.from = null;
      }

      /* jshint newcap: false */
      var closed, runner = new $$AnimateRunner();
      return {
        start: run,
        end: run
      };

      function run() {
        $$rAF(function() {
          applyAnimationContents();
          if (!closed) {
            runner.complete();
          }
          closed = true;
        });
        return runner;
      }

      function applyAnimationContents() {
        if (options.addClass) {
          element.addClass(options.addClass);
          options.addClass = null;
        }
        if (options.removeClass) {
          element.removeClass(options.removeClass);
          options.removeClass = null;
        }
        if (options.to) {
          element.css(options.to);
          options.to = null;
        }
      }
    };
  }];
};
