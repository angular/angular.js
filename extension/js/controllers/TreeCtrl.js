
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
    var roots = appContext.getListOfRoots();
    if (!roots) {
      return;
    }
    
    var trees = appContext.getModelTrees();
    if (!$scope.trees || $scope.trees.length !== trees.length) {
      $scope.trees = trees;
    } else {

      var syncBranch = function (oldTree, newTree) {
        if (!oldTree || !newTree) {
          return;
        }
        oldTree.locals = newTree.locals;
        if (oldTree.children.length !== newTree.children.length) {
          oldTree.children = newTree.children;
        } else {
          oldTree.children.forEach(function (oldBranch, i) {
            var newBranch = newTree.children[i];
            syncBranch(oldBranch, newBranch);
          });
        }
      };

      var treeId, oldTree, newTree;
      for (treeId in $scope.trees) {
        if ($scope.trees.hasOwnProperty(treeId)) {
          oldTree = $scope.trees[treeId];
          newTree = trees[treeId];
          syncBranch(oldTree, newTree);
        }
      }
    }

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
    $scope.$apply();
  };

  appContext.watchPoll(updateTree);
});
