angular.module('search', [])

.controller('DocsSearchCtrl', ['$scope', '$location', 'docsSearch', function($scope, $location, docsSearch) {
  function clearResults() {
    $scope.results = [];
    $scope.colClassName = null;
    $scope.hasResults = false;
  }

  $scope.search = function(q) {
    var MIN_SEARCH_LENGTH = 2;
    if(q.length >= MIN_SEARCH_LENGTH) {
      var results = docsSearch(q);
      var totalAreas = 0;
      for(var i in results) {
        ++totalAreas;
      }
      if(totalAreas > 0) {
        $scope.colClassName = 'cols-' + totalAreas;
      }
      $scope.hasResults = totalAreas > 0;
      $scope.results = results;
    }
    else {
      clearResults();
    }
    if(!$scope.$$phase) $scope.$apply();
  };
  $scope.submit = function() {
    var result;
    for(var i in $scope.results) {
      result = $scope.results[i][0];
      if(result) {
        break;
      }
    }
    if(result) {
      $location.path(result.path);
      $scope.hideResults();
    }
  };
  $scope.hideResults = function() {
    clearResults();
    $scope.q = '';
  };
}])

.controller('Error404SearchCtrl', ['$scope', '$location', 'docsSearch', function($scope, $location, docsSearch) {
  $scope.results = docsSearch($location.path().split(/[\/\.:]/).pop());
}])

.factory('lunrSearch', function() {
  return function(properties) {
    if (window.RUNNING_IN_NG_TEST_RUNNER) return null;

    var engine = lunr(properties);
    return {
      store : function(values) {
        engine.add(values);
      },
      search : function(q) {
        return engine.search(q);
      }
    };
  };
})

.factory('docsSearch', ['$rootScope','lunrSearch', 'NG_PAGES',
    function($rootScope, lunrSearch, NG_PAGES) {
  if (window.RUNNING_IN_NG_TEST_RUNNER) {
    return null;
  }

  var index = lunrSearch(function() {
    this.ref('id');
    this.field('title', {boost: 50});
    this.field('keywords', { boost : 20 });
  });

  angular.forEach(NG_PAGES, function(page, key) {
    if(page.searchTerms) {
      index.store({
        id : key,
        title : page.searchTerms.titleWords,
        keywords : page.searchTerms.keywords
      });
    };
  });

  return function(q) {
    var results = {
      api : [],
      tutorial : [],
      guide : [],
      error : [],
      misc : []
    };
    angular.forEach(index.search(q), function(result) {
      var key = result.ref;
      var item = NG_PAGES[key];
      var area = item.area;
      item.path = key;

      var limit = area == 'api' ? 40 : 14;
      if(results[area].length < limit) {
        results[area].push(item);
      }
    });
    return results;
  };
}])

.directive('focused', function($timeout) {
  return function(scope, element, attrs) {
    element[0].focus();
    element.on('focus', function() {
      scope.$apply(attrs.focused + '=true');
    });
    element.on('blur', function() {
      // have to use $timeout, so that we close the drop-down after the user clicks,
      // otherwise when the user clicks we process the closing before we process the click.
      $timeout(function() {
        scope.$eval(attrs.focused + '=false');
      });
    });
    scope.$eval(attrs.focused + '=true');
  };
})

.directive('docsSearchInput', ['$document',function($document) {
  return function(scope, element, attrs) {
    var ESCAPE_KEY_KEYCODE = 27,
        FORWARD_SLASH_KEYCODE = 191;
    angular.element($document[0].body).bind('keydown', function(event) {
      var input = element[0];
      if(event.keyCode == FORWARD_SLASH_KEYCODE && document.activeElement != input) {
        event.stopPropagation();
        event.preventDefault();
        input.focus();
      }
    });

    element.bind('keydown', function(event) {
      if(event.keyCode == ESCAPE_KEY_KEYCODE) {
        event.stopPropagation();
        event.preventDefault();
        scope.$apply(function() {
          scope.hideResults();
        });
      }
    });
  };
}]);
