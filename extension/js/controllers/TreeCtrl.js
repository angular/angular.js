
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

  var updateTree = function () {
    appContext.getDebugInfo(function (info) {
      if (!info || info.roots.length === 0) {
        setTimeout(updateTree, 50);
        return;
      }

      $scope.$apply(function () {
        if (info.err) {
          $scope.err = info.err;
          $scope.roots = [null];
          $scope.selectedRoot = null;
          $scope.trees = {};
        } else {
          var rootIdPairs = [];
          info.roots.forEach(function (item) {
            rootIdPairs.push({
              label: item,
              value: item
            });
          });
          $scope.roots = rootIdPairs;
          if (rootIdPairs.length === 0) {
            $scope.selectedRoot = null;
          } else {
            $scope.selectedRoot = rootIdPairs[0].value;
          }
          $scope.trees = info.trees;
        }
      });
    });
  };
  setInterval(updateTree, 500);
  updateTree();
  //appContext.watchRefresh(updateTree);
});
