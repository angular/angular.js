describe('panelApp:TreeCtrl', function () {

  beforeEach(module('panelApp'));
  beforeEach(module(function($provide) {
    $provide.factory('appContext', createAppContextMock);
    $provide.factory('chromeExtension', createChromeExtensionMock);
  }));

  describe('TreeCtrl', function() {
    var ctrl,
      $scope,
      appContext,
      chromeExtension;

    beforeEach(inject(function(_$rootScope_, _appContext_, _chromeExtension_, $controller) {
      $scope = _$rootScope_;

      // mock accessor
      $scope.val = {
        id: "ZZZ"
      };
      //inspect.reset();
      appContext = _appContext_;
      chromeExtension = _chromeExtension_;
      ctrl = $controller('TreeCtrl', {$scope: $scope});
    }));

    it('should call inspect when there is an element to inspect', function () {
      $scope.inspect();
      expect(appContext.inspect).toHaveBeenCalledWith('ZZZ');
    });

    it('should change the corresponding value in the scope when edit is called', function () {

      // mock accessor
      $scope.val = {
        id: $scope.$id
      };

      // feel like this might be cheating
      appContext.registerScope($scope);

      $scope.key = 'someKey';
      $scope.someKey = 'someOldValue';
      $scope.item = '"someNewValue"';

      $scope.edit();

      expect($scope.someKey).toBe('someNewValue');
    });
  });
});