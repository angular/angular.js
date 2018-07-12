/* eslint-env node */

'use strict';

module.exports = function(config) {
  config.set({
    scripts: [
      {
        id: 'jquery',
        src: 'jquery-noop.js'
      }, {
        id: 'angular',
        src: '/build/angular.js'
      }, {
        id: 'angular-animate',
        src: '/build/angular-animate.js'
      }, {
        src: 'app.js'
      }
    ]
  });
};
