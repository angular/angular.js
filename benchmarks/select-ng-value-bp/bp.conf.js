/* eslint-env node */

'use strict';

module.exports = function(config) {
  config.set({
    scripts: [{
      id: 'angular',
      src: '/build/angular.js'
    },
    {
      src: 'app.js'
    }]
  });
};
