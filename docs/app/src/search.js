'use strict';

angular.module('search', [])

.controller('DocsSearchCtrl', ['$scope', '$location', 'docsSearch', function($scope, $location, docsSearch) {
  function clearResults() {
    $scope.results = [];
    $scope.colClassName = null;
    $scope.hasResults = false;
  }

  $scope.search = function(q) {
    var MIN_SEARCH_LENGTH = 2;
    if (q.length >= MIN_SEARCH_LENGTH) {
      docsSearch(q).then(function(hits) {
        // Make sure the areas are always in the same order
        var results = {
          api: [],
          guide: [],
          tutorial: [],
          error: [],
          misc: []
        };

        angular.forEach(hits, function(hit) {
          var area = hit.area;

          var limit = (area === 'api') ? 40 : 14;
          results[area] = results[area] || [];
          if (results[area].length < limit) {
            results[area].push(hit);
          }
        });

        var totalAreas = Object.keys(results).length;
        if (totalAreas > 0) {
          $scope.colClassName = 'cols-' + totalAreas;
        }
        $scope.hasResults = totalAreas > 0;
        $scope.results = results;
      });
    } else {
      clearResults();
    }
    if (!$scope.$$phase) $scope.$apply();
  };

  $scope.submit = function() {
    var result;
    if ($scope.results.api) {
      result = $scope.results.api[0];
    } else {
      for (var i in $scope.results) {
        result = $scope.results[i][0];
        if (result) {
          break;
        }
      }
    }
    if (result) {
      $location.path(result.path);
      $scope.hideResults();
    }
  };

  $scope.hideResults = function() {
    clearResults();
    $scope.q = '';
  };
}])


.controller('Error404SearchCtrl', ['$scope', '$location', 'docsSearch',
        function($scope, $location, docsSearch) {
  docsSearch($location.path().split(/[/.:]/).pop()).then(function(results) {
    $scope.results = {};
    angular.forEach(results, function(result) {
      var area = $scope.results[result.area] || [];
      area.push(result);
      $scope.results[result.area] = area;
    });
  });
}])


.provider('docsSearch', function() {

  // This version of the service builds the index in the current thread,
  // which blocks rendering and other browser activities.
  // It should only be used where the browser does not support WebWorkers
  function localSearchFactory($http, $timeout, NG_PAGES) {

    if (window.console && window.console.log) {
      window.console.log('Using Local Search Index');
    }

    // Create the lunr index
    var index = lunr(/** @this */ function() {
      this.ref('path');
      this.field('titleWords', {boost: 50});
      this.field('members', { boost: 40});
      this.field('keywords', { boost : 20 });
    });

    // Delay building the index by loading the data asynchronously
    var indexReadyPromise = $http.get('js/search-data.json').then(function(response) {
      var searchData = response.data;
      // Delay building the index for 500ms to allow the page to render
      return $timeout(function() {
        // load the page data into the index
        angular.forEach(searchData, function(page) {
          index.add(page);
        });
      }, 500);
    });

    // The actual service is a function that takes a query string and
    // returns a promise to the search results
    // (In this case we just resolve the promise immediately as it is not
    // inherently an async process)
    return function(q) {
      return indexReadyPromise.then(function() {
        var hits = index.search(q);
        var results = [];
        angular.forEach(hits, function(hit) {
          results.push(NG_PAGES[hit.ref]);
        });
        return results;
      });
    };
  }
  localSearchFactory.$inject = ['$http', '$timeout', 'NG_PAGES'];

  // This version of the service builds the index in a WebWorker,
  // which does not block rendering and other browser activities.
  // It should only be used where the browser does support WebWorkers
  function webWorkerSearchFactory($q, $rootScope, NG_PAGES) {

    if (window.console && window.console.log) {
      window.console.log('Using WebWorker Search Index');
    }

    var searchIndex = $q.defer();
    var results;

    var worker = new window.Worker('js/search-worker.js');

    // The worker will send us a message in two situations:
    // - when the index has been built, ready to run a query
    // - when it has completed a search query and the results are available
    worker.onmessage = function(oEvent) {
      $rootScope.$apply(function() {

        switch (oEvent.data.e) {
          case 'index-ready':
            searchIndex.resolve();
            break;
          case 'query-ready':
            var pages = oEvent.data.d.map(function(path) {
              return NG_PAGES[path];
            });
            results.resolve(pages);
            break;
        }
      });
    };

    // The actual service is a function that takes a query string and
    // returns a promise to the search results
    return function(q) {

      // We only run the query once the index is ready
      return searchIndex.promise.then(function() {

        results = $q.defer();
        worker.postMessage({ q: q });
        return results.promise;
      });
    };
  }
  webWorkerSearchFactory.$inject = ['$q', '$rootScope', 'NG_PAGES'];

  return {
    $get: window.Worker ? webWorkerSearchFactory : localSearchFactory
  };
})

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

.directive('docsSearchInput', ['$document', function($document) {
  return function(scope, element, attrs) {
    var ESCAPE_KEY_KEYCODE = 27,
        FORWARD_SLASH_KEYCODE = 191;
    angular.element($document[0].body).on('keydown', function(event) {
      var input = element[0];
      if (event.keyCode === FORWARD_SLASH_KEYCODE && $document[0].activeElement !== input) {
        event.stopPropagation();
        event.preventDefault();
        input.focus();
      }
    });

    element.on('keydown', function(event) {
      if (event.keyCode === ESCAPE_KEY_KEYCODE) {
        event.stopPropagation();
        event.preventDefault();
        scope.$apply(function() {
          scope.hideResults();
        });
      }
    });
  };
}]);
