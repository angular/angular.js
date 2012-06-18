
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
    if ($('input:focus').length > 0) {
      return;
    }
    appContext.getDebugInfo(function (info) {
      if (!info || info.roots.length === 0) {
        setTimeout(updateTree, 50);
        return;
      }

      $scope.$apply(function () {
        $scope.roots.length = info.roots.length;
        info.roots.forEach(function (item, i) {
          $scope.roots[i] = {
            label: item,
            value: item
          };
        });
        if (info.roots.length === 0) {
          $scope.selectedRoot = null;
        } else if (!$scope.selectedRoot) {
          $scope.selectedRoot = $scope.roots[0].value;
        }
        $scope.trees = info.trees;
      });
    });
  };
  setInterval(updateTree, 500);
  updateTree();
  //appContext.watchRefresh(updateTree);
});
