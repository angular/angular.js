var panelApp = angular.module('panelApp', []);

panelApp.filter('first', function () {
  return function (input, output) {
    return input.split("\n")[0];
  };
});
