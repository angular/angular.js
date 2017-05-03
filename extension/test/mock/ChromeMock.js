function createChromeExtensionMock() {

  var extend = function(obj, source) {
    for (var prop in source) {
      obj[prop] = source[prop];
    }
    return obj;
  };

  // TODO: rename the "jQuery" stuff
  var jQueryResult = [];

  var defaultMock = {
    document: {
      getElementsByClassName: function (arg) {
        if (arg === 'ng-scope') {
          return jQueryResult;
        }
        throw new Error('unknown selector');
      }
    }
  };

  var windowMock = defaultMock;

  return {
    eval: function (fn, args, cb) {
      if (!cb && typeof args === 'function') {
        cb = args;
        args = {};
      } else if (!args) {
        args = {};
      }
      var res = fn(windowMock, args);
      if (typeof cb === 'function') {
        cb(res);
      }
    },
    __registerWindow: function (win) {
      windowMock = extend(windowMock, win);
    },
    __registerQueryResult: function (res) {
      jQueryResult = res;

      jQueryResult.each = function (fn) {
        var i;
        for (i = 0; i < this.length; i++) {
          fn(i, this[i]);
        }
      };
    },
    sendRequest: jasmine.createSpy('sendRequest')
  };
}
