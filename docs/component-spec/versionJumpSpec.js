describe('DocsApp', function() {

  beforeEach(module('docsApp'));

  describe('DocsVersionsCtrl', function() {
    var $scope, ctrl, window, version = '9.8.7';

    beforeEach(function() {
      module(function($provide) {
        $provide.value('$window', window = angular.mock.createMockWindow());
      });
      inject(function($controller, $rootScope) {
        $scope = $rootScope.$new();
        $scope.version = version;
        ctrl = $controller('DocsVersionsCtrl',{
          $scope : $scope,
          $window : window
        });
      });
    });

    it('should have the correct version of angular', function() {
      expect(version).toBe($scope.version);
    });

    it('should order versions in decending order', function() {
      expect($scope.versions.length).toBeGreaterThan(0);

      var one = $scope.versions[0].version;
      var two = $scope.versions[1].version;

      expect(one).toBeGreaterThan(two);
      expect(two).not.toBeGreaterThan(one);
    });

    it('should list unstable versions at the top of the list', function() {
      expect($scope.versions[0].stable).toBe(false);
    });

    it('should list stable versions at the bottom of the list', function() {
      expect($scope.versions[$scope.versions.length-1].stable).toBe(true);
    });

    describe('changing the URL', function() {
      it('should not support the old < 1.0 docs pages', function() {
        window.location = 'old';

        $scope.jumpToDocsVersion('0.9.10');
        expect(window.location).toBe('old');

        $scope.jumpToDocsVersion('0.10.1');
        expect(window.location).toBe('old');

        $scope.jumpToDocsVersion('1.1.5');
        expect(window.location).toBe('http://code.angularjs.org/1.1.5/docs');
      }); 

      it('should jump to the older versions of current docs for version >= 1.0.2', function() {
        $scope.jumpToDocsVersion('1.0.1');
        expect(window.location).toBe('http://code.angularjs.org/1.0.1/docs-1.0.1');

        $scope.jumpToDocsVersion('1.0.2');
        expect(window.location).toBe('http://code.angularjs.org/1.0.2/docs');

        $scope.jumpToDocsVersion('1.1.2');
        expect(window.location).toBe('http://code.angularjs.org/1.1.2/docs');
      });

      it('should use the current docs.angularjs.org page when the selected version is the last stable version', function() {
        $scope.versions = [{
          stable : true,
          lhs : '1.x',
          rhs : 'x',
          title : 'test',
          version : '1.x.x',
          status : '1.x.x'
        }];

        $scope.jumpToDocsVersion('1.x.x');
        expect(window.location).toBe('http://docs.angularjs.org');
      });
    });
  });

});
