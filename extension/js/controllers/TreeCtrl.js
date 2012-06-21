
panelApp.controller('TreeCtrl', function TreeCtrl($scope, chromeExtension, appContext) {

  $scope.inspect = function () {
    appContext.inspect(this.val.id);
  };

  $scope.edit = function () {
    appContext.executeOnScope(this.val.id, function (scope, elt, args) {
      scope[args.name] = args.value;
      scope.$apply();
    }, {
      name: this.key,
      value: JSON.parse(this.item)
    });
  };

  $scope.roots = [];

  var updateTree = function () {
    $scope.$apply(function () {
      if ($('input:focus').length > 0) {
        return;
      }
      var roots = appContext.getListOfRoots();
      if (!roots) {
        return;
      }
      
      $scope.trees = appContext.getModelTrees();

      $scope.roots.length = roots.length;
      roots.forEach(function (item, i) {
        $scope.roots[i] = {
          label: item,
          value: item
        };
      });
      if (roots.length === 0) {
        $scope.selectedRoot = null;
      } else if (!$scope.selectedRoot) {
        $scope.selectedRoot = $scope.roots[0].value;
      }
    });
  };

  setInterval(updateTree, 500);
});
