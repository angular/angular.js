describe('panelApp:appContext', function () {

  beforeEach(module('panelApp'));
  beforeEach(module(function($provide) {
    $provide.factory('chromeExtension', createChromeExtensionMock);
  }));

  describe('appContext', function() {
    var chromeExtension,
      appContext;

    beforeEach(inject(function(_appContext_, _chromeExtension_) {
      appContext = _appContext_;
      chromeExtension = _chromeExtension_;

      chromeExtension.__registerWindow({
        angular: {
          element: function () {
            return {
              scope: function () {
                var sc = {
                  $id: '001',
                  $parent: null
                };
                sc.$root = sc;
                return sc;
              }
            };
          }
        }
      });
    }));

    describe('getModelTrees', function () {
      it('should work in the simple case', function () {
        chromeExtension.__registerQueryResult([1,2,3]);
        var infoVal;
        
        waitsFor(function () {
          return infoVal = appContext.getModelTrees();
        });
        runs(function () {
          expect(infoVal).toEqual({
            "001": {
              "locals": {},
              "id": "001",
              "children": []
            }
          });
        })
      });
    });
    describe('getListOfRoots', function () {
      it('should work in the simple case', function () {
        chromeExtension.__registerQueryResult([1,2,3]);
        var infoVal;
        waitsFor(function () {
          return infoVal = appContext.getListOfRoots();
        });
        runs(function() {
          expect(infoVal).toEqual([
            "001",
            "001",
            "001"
          ]);
        });
      });
    });
  });
});