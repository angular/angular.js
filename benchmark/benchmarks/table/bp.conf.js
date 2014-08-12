module.exports = function(config) {
  config.set({
    scripts: [
      {
        id: 'angular',
        src: '../../../build/angular.js'
      },
      {
        src: 'table.js'
      }
    ]
  });
};
