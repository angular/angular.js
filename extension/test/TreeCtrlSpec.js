inspect = jasmine.createSpy('inspect');

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
      $scope.val = function () {
        return {
          id: "ZZZ"
        }
      };
      inspect.reset();
      appContext = _appContext_;
      chromeExtension = _chromeExtension_;
      ctrl = $controller('TreeCtrl', {$scope: $scope});
    }));

    it('should call inspect when there is an element to inspect', function () {
      $scope.inspect();
      expect(inspect).toHaveBeenCalledWith('elementMock');
    });

    it('should not call inspect when there is no element associated with the scope', function () {

      // mock accessor
      $scope.val = function () {
        return {
          id: "this-is-not-a-valid-id"
        }
      };
      $scope.inspect();
      expect(inspect).wasNotCalled();
    });

    it('should change the corresponding value in the scope when edit is called', function () {

      // mock accessor
      $scope.val = function () {
        return {
          id: $scope.$id
        }
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