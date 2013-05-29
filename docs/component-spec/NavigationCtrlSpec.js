describe("DocsNavigationCtrl", function() {

  beforeEach(module('docsApp'));

  var ctrl, $scope;

  beforeEach(function() {
    module(function($provide) {
      $provide.value('docsPages', []);
      $provide.factory('docsSearch', function() {
        return function(q) {
          return ['one','two','three'];
        };
      });
    });
    inject(function($controller, $rootScope, $location, docsSearch) {
      $scope = $rootScope.$new();
      ctrl = $controller('DocsNavigationCtrl', {
        $scope : $scope,
        $location : $location,
        docsSearch : docsSearch
      });
    });
  });

  it("should search and return data from docsSearch", function() {
    $scope.search('1234')
    expect($scope.results.join(',')).toBe('one,two,three');
    expect($scope.hasResults).toBe(true);
  });

  it("should avoid searching if the search term is too short", function() {
    $scope.search('1')
    expect($scope.results.length).toBe(0);
    expect($scope.hasResults).toBe(false);
  });

  it("should set the columns classname based on the total grouped results", function() {
    $scope.search('1234');
    expect($scope.colClassName).toBe('cols-3');

    $scope.search('1');
    expect($scope.colClassName).toBe(null);
  });

  it("should hide and clear the results when called", function() {
    $scope.hasResults = true;
    $scope.results = ['one'];
    $scope.colClassName = '...';
    $scope.hideResults();
    expect($scope.hasResults).toBe(false);
    expect($scope.results.length).toBe(0);
    expect($scope.colClassName).toBe(null);
  });

  it("should hide, clear and change the path of the page when submitted", inject(function($location) {
    $scope.hasResults = true;
    $scope.results = {
      api : [
        {url : '/home'}
      ],
      tutorial : [
        {url : '/tutorial'}
      ]
    };
    $scope.submit();
    expect($location.path()).toBe('/home');
    expect($scope.results.length).toBe(0);
    expect($scope.hasResults).toBe(false);
  }));

});
