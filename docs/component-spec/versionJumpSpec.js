describe('DocsApp', function() {

  // Do not run this suite on Internet Explorer.
  if (msie < 10) return;

  beforeEach(module('docsApp'));

  describe('DocsVersionsCtrl', function() {
    var $scope, ctrl, window, version = '9.8.7';

    beforeEach(function() {
      module(function($provide) {
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

    describe('changing the URL', function() {
      it('should jump to the url provided', function() {
        $scope.jumpToDocsVersion({ version: '1.0.1', url : 'page123'});
        expect(window.location).toBe('page123');
      });
    });
  });

});
