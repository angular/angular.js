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
  this.$get = ['$$rAF', '$q', function($$rAF, $q) {

    var RAFPromise = function() {};
    RAFPromise.prototype = {
      done: function(cancel) {
        this.defer && this.defer[cancel === true ? 'reject' : 'resolve']();
      },
      end: function() {
        this.done();
      },
      cancel: function() {
        this.done(true);
      },
      getPromise: function() {
        if (!this.defer) {
          this.defer = $q.defer();
        }
        return this.defer.promise;
      },
      then: function(f1,f2) {
        return this.getPromise().then(f1,f2);
      },
      'catch': function(f1) {
        return this.getPromise()['catch'](f1);
      },
      'finally': function(f1) {
        return this.getPromise()['finally'](f1);
      }
    };

    return function(element, options) {
      if (options.from) {
        element.css(options.from);
        options.from = null;
      }

      var closed, runner = new RAFPromise();
      return {
        start: run,
        end: run
      };

      function run() {
        $$rAF(function() {
          close();
          if (!closed) {
            runner.done();
          }
          closed = true;
        });
        return runner;
      }

      function close() {
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
