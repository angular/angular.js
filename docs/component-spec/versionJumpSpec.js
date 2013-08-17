describe('DocsApp', function() {

  beforeEach(module('docsApp'));

  describe('DocsVersionsCtrl', function() {
    var $scope, ctrl, window, version = '9.8.7';

    beforeEach(function() {
      module(function($provide) {
        $provide.value('NG_VERSIONS',[
          '1.0.0',
          '1.0.1',
          '1.0.2',
          '1.0.3',
          '1.0.4',
          '1.0.5',
          '1.0.6',
          '1.1.0',
          '1.1.1',
          '1.1.2',
          '1.1.3',
          '1.1.4',
          '2.1.3'
        ]);
        $provide.value('$window', window = createMockWindow());
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
    });

    it('should list unstable versions at the top of the list', function() {
      expect($scope.versions[0].stable).toBe(false);
    });

    it('should list all items below the last stable as stable regardless of version number', function() {
      var limit = $scope.versions.length - 1,
          lastUnstableIndex = 0;

      while(lastUnstableIndex <= limit) {
        if($scope.versions[lastUnstableIndex++].stable) break;
      }

      for(var i=lastUnstableIndex;i<=limit;i++) {
        expect($scope.versions[i].stable).toBe(true);
      }
    });

    describe('changing the URL', function() {
      it('should not support the old < 1.0 docs pages', function() {
        window.location = 'old';

        $scope.versions.unshift({
          stable : true,
          version : '0.9.10'
        });
        $scope.jumpToDocsVersion('0.9.10');
        expect(window.location).toBe('old');

        $scope.versions.unshift({
          stable : true,
          version : '0.10.1'
        });
        $scope.jumpToDocsVersion('0.10.1');
        expect(window.location).toBe('old');

        $scope.jumpToDocsVersion('2.1.3');
        expect(window.location).toBe('http://code.angularjs.org/2.1.3/docs');
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
          title : 'test',
          version : '1.1.1'
        }];

        $scope.jumpToDocsVersion('1.1.1');
        expect(window.location).toBe('http://docs.angularjs.org');

        $scope.versions.unshift({
          stable : true,
          title : 'test2',
          version : '1.2.1'
        });

        $scope.jumpToDocsVersion('1.1.1');
        expect(window.location).toBe('http://code.angularjs.org/1.1.1/docs');
        $scope.jumpToDocsVersion('1.2.1');
        expect(window.location).toBe('http://docs.angularjs.org');
      });

    });
  });

});
