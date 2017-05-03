panelApp.filter('sortByTime', function () {
  return function (input) {
    return input.slice(0).sort(function (a, b) {
      return b.time - a.time;
    });
  };
});

panelApp.controller('PerfCtrl', function PerfCtrl($scope, appContext) {

  $scope.enable = false;

  $scope.histogram = [];
  $scope.timeline = [];

  $scope.clearHistogram = function () {
    appContext.clearHistogram();
  };

  var first = true;
  $scope.$watch('enable', function (newVal, oldVal) {

    // prevent refresh on initial pageload
    if (first) {
      first = false;
    } else {
      appContext.setDebug(newVal);
    }
    if (newVal) {
      //updateTimeline();
      updateHistogram();
    }
  });

  $scope.log = false;
  
  $scope.$watch('log', function (newVal, oldVal) {
    appContext.setLog(newVal);
    
    appContext.watchRefresh(function () {
      appContext.setLog(newVal);
    });
  });

  $scope.inspect = function () {
    appContext.inspect(this.val.id);
  };

  var updateTimeline = function () {
    var timeline = appContext.getTimeline();
    if (timeline && timeline.length > $scope.timeline.length) {
      $scope = $scope.concat(timeline.splice($scope.length - 1));
    }
  };

  var updateHistogram = function () {
    var info = appContext.getHistogram();
    if (!info) {
      return;
    }
    var total = 0;
    info.forEach(function (elt) {
      total += elt.time;
    });
    var i, elt, his;
    for (i = 0; (i < $scope.histogram.length && i < info.length); i++) {
      elt = info[i];
      his = $scope.histogram[i];
      his.time = elt.time.toPrecision(3);
      his.percent = (100 * elt.time / total).toPrecision(3);
    }
    for ( ; i < info.length; i++) {
      elt = info[i];
      elt.time = elt.time.toPrecision(3);
      elt.percent = (100 * elt.time / total).toPrecision(3);
      $scope.histogram.push(elt);
    }
    $scope.histogram.length = info.length;
  };

  var updateTree = function () {
    var rts = appContext.getListOfRoots();
    if (!rts) {
      return;
    }
    var roots = [];
    rts.forEach(function (item) {
      roots.push({
        label: item,
        value: item
      });
    });

    $scope.roots = roots;
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
            syncBranch(newBranch, oldBranch);
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

    if (roots.length === 0) {
      $scope.selectedRoot = null;
    } else if (!$scope.selectedRoot) {
      $scope.selectedRoot = roots[0].value;
    }
    $scope.$apply();
  };
  appContext.watchPoll(updateTree);
  appContext.watchPoll(updateHistogram);
});
