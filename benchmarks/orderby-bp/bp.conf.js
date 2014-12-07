module.exports = function(config) {
  config.set({
    scripts: [
    {
      "id": "jquery",
      "src": "jquery-noop.js"
    },{
      id: 'angular',
      src: '/build/angular.js'
    },{
      src: 'app.js',
    }]
  });
};
