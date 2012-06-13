panelApp.controller('OptionsCtrl', function OptionsCtrl($scope, appContext, chromeExtension) {

  $scope.debugger = {
    scopes: false,
    bindings: false
  };

  $scope.$watch('debugger.scopes', function (newVal, oldVal) {
    if (newVal) {
      chromeExtension.sendRequest('showScopes');
    } else {
      chromeExtension.sendRequest('hideScopes');
    }
  });

  $scope.$watch('debugger.bindings', function (newVal, oldVal) {
    if (newVal) {
      chromeExtension.sendRequest('showBindings');
    } else {
      chromeExtension.sendRequest('hideBindings');
    }
  });
});
