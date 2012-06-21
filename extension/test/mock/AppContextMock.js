function createAppContextMock () {
  var scopeMocks = {
    "ZZZ": {
      id: "ZZZ",
      $apply: function () {},
      someKey: 'someOldValue'
    }
  };
  var scopeEltMocks = {
    "ZZZ": "elementMock"
  };
  var regScope;
  return {
    executeOnScope: function (scopeId, fn, args, cb) {
      if (regScope && regScope.$id === scopeId) {
        fn(regScope, 'elementMock', args);
        if (cb) {
          cb();
        }
      }
      if (scopeMocks[scopeId] && scopeEltMocks[scopeId]) {
        fn(scopeMocks[scopeId],
          scopeEltMocks[scopeId],
          args);

        if (cb) {
          cb();
        }
      }
    },
    registerScope: function (scope) {
      regScope = scope;
    },
    getDebugInfo: function (cb) {
      cb({
        roots: [ "YYY" ],
        trees: {}
      });
    },
    watchRefresh: function (cb) {},
    setDebug: jasmine.createSpy('setDebug'),
    setLog: jasmine.createSpy('setLog'),
    setPollInterval: jasmine.createSpy('setPollInterval'),
    inspect: jasmine.createSpy('inspect'),
    refresh: jasmine.createSpy('refresh')
  }
}