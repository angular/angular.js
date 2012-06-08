function createChromeExtensionMock() {

  var extend = function(obj, source) {
    for (var prop in source) {
      obj[prop] = source[prop];
    }
    return obj;
  };

  var jQueryResult = [];
  jQueryResult.each = function (fn) {
    var i;
    for (i = 0; i < this.length; i++) {
      fn(i, this[i]);
    }
  }

  var defaultMock = {
    // TODO: use real jQuery, or write better mock ?
    // jQuery (zepto) mock
    $: function (arg) {
      if (arg === '.ng-scope') {
        return jQueryResult;
      }
      throw new Error('unknown selector');
    }
  };

  var windowMock = defaultMock;

  return {
    eval: function (fn, args, cb) {

      // TODO(btford): test eval'd strings
      if (typeof fn === 'function') {
        fn(windowMock, args);
      }
      if (cb) {
        cb();
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