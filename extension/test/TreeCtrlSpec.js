inspect = jasmine.createSpy('inspect');

describe('panelApp:TreeCtrl', function () {

  beforeEach(module('panelApp'));
  beforeEach(module(function($provide) {
    $provide.factory('chromeExtension', createChromeExtensionMock);
  }));

  describe('TreeCtrl', function() {
    var ctrl,
      $scope,
      chromeExtension;

    beforeEach(inject(function(_$rootScope_, _chromeExtension_) {
      $scope = _$rootScope_;
      chromeExtension = _chromeExtension_;
      ctrl = new TreeCtrl($scope, chromeExtension);
    }));

    it('should call inspect', function () {

      ctrl.inspect();
      $scope.$digest();

      expect(inspect).toHaveBeenCalledWith('');
    });
  });
});