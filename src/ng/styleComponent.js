'use strict';

/**
 * @ngdoc provider
 * @name $$styleComponentProvider
 *
 * @description
 * Default implementation of $style that doesn't perform any action, instead just
 * synchronously resolves the returned promise.
 *
 * In order to enable style the `ngStyle` module has to be loaded.
 *
 * To see the functional implementation check out `src/ngStyle/style.js`.
 */
  var $$StyleComponentProvider = /** @this */ function() {

    this.$get = [function() {
        return {
          registerStyles: noop,
          registerStyleUrls: noop,
          loadStyles: noop,
          unLoadStyles: noop,
          isRegistered: function() { return false; }
        };
      }];
  };
