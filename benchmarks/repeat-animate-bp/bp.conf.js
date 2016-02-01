/* eslint-env node */

'use strict';

module.exports = function(config) {
  config.set({
    scripts: [
    {
      id: 'angular',
      src: '/build/angular.js'
    },
    {
      id: 'angular-animate',
      src: '/build/angular-animate.js'
    },
    {
      id: 'app',
      src: 'app.js'
    },
    {
      src: 'common.js'
    }]
  });
};
