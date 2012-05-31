function createChromeExtensionMock() {
  var windowMock = {
    // TODO: use real jQuery, or write better mock ?
    // jQuery (zepto) mock
    $: function (arg) {
      if (arg === '.ng-scope') {
        var ret = [];

        ret.each = function (fn) {
          var i;
          for (i = 0; i < this.length; i++) {
            fn(i, this[i]);
          }
        }
      }
      throw new Error('unknown sleector');
    }
  };

  return {
    eval: function (fn, args, cb) {
      fn(windowMock, args, cb);
    },
    sendRequest: jasmine.createSpy('sendRequest')
  };
}