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
      docsSearch(q).then(function(hits) {
        var results = {};
        angular.forEach(hits, function(hit) {
          var area = hit.area;

          var limit = (area == 'api') ? 40 : 14;
          results[area] = results[area] || [];
          if(results[area].length < limit) {
            results[area].push(hit);
          }
        });

        var totalAreas = 0;
        for(var i in results) {
          ++totalAreas;
        }
        if(totalAreas > 0) {
          $scope.colClassName = 'cols-' + totalAreas;
        }
        $scope.hasResults = totalAreas > 0;
        $scope.results = results;
      });
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

.provider('docsSearch', function() {

  // This version of the service builds the index in the current thread,
  // which blocks rendering and other browser activities.
  // It should only be used where the browser does not support WebWorkers
  function localSearchFactory($http, $timeout, $q) {

    console.log('Using Local Search Index');

    // Create the lunr index
    var index = lunr(function() {
      this.ref('id');
      this.field('title', {boost: 50});
      this.field('members', { boost: 40});
      this.field('keywords', { boost : 20 });
    });

    var pagesData = {};

    // Delay building the index by loading the data asynchronously
    $http.get('js/pages-data.json').then(function(response) {
      pagesData = response.data;
      // Delay building the index for 500ms to allow the page to render
      $timeout(function() {
        // load the page data into the index
        angular.forEach(pagesData, function(page, key) {
          if(page.searchTerms) {
            index.add({
              id : key,
              title : page.searchTerms.titleWords,
              keywords : page.searchTerms.keywords,
              members : page.searchTerms.members
            });
          };
        });
      }, 500);
    });
    localSearchFactory.$inject = ['$http', '$timeout', '$q'];

    // The actual service is a function that takes a query string and
    // returns a promise to the search results
    // (In this case we just resolve the promise immediately as it is not
    // inherently an async process)
    return function(q) {
      var hits = index.search(q);
      var results = [];
      angular.forEach(hits, function(hit) {
        results.push(pagesData[hit.ref]);
      });
      return $q.when(results);
    };
  }

  // This version of the service builds the index in a WebWorker,
  // which does not block rendering and other browser activities.
  // It should only be used where the browser does support WebWorkers
  function webWorkerSearchFactory($q) {

    console.log('Using WebWorker Search Index')

    var results;

    var worker = new Worker('js/search.js');

    // The worker will send us a message when it has completed a
    // search query and has the result available
    worker.onmessage = function(oEvent) {
      results.resolve(oEvent.data);
    };

    // The actual service is a function that takes a query string and
    // returns a promise to the search results
    return function(q) {
      results = $q.defer();
      worker.postMessage({ q: q });
      return results.promise;
    };
  }
  webWorkerSearchFactory.$inject = ['$q'];

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

.directive('docsSearchInput', ['$document',function($document) {
  return function(scope, element, attrs) {
    var ESCAPE_KEY_KEYCODE = 27,
        FORWARD_SLASH_KEYCODE = 191;
    angular.element($document[0].body).on('keydown', function(event) {
      var input = element[0];
      if(event.keyCode == FORWARD_SLASH_KEYCODE && document.activeElement != input) {
        event.stopPropagation();
        event.preventDefault();
        input.focus();
      }
    });

    element.on('keydown', function(event) {
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
