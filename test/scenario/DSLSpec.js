/**
 * Very basic Mock of angular.
 */
function AngularMock() {
  this.reset();
  this.service = this;
}

AngularMock.prototype.reset = function() {
  this.log = [];
};

AngularMock.prototype.element = function(node) {
  this.log.push('element(' + node.nodeName.toLowerCase() + ')');
  return this;
};

AngularMock.prototype.trigger = function(value) {
  this.log.push('element().trigger(' + value + ')');
};

AngularMock.prototype.$browser = function() {
  this.log.push('$brower()');
  return this;
};

AngularMock.prototype.poll = function() {
  this.log.push('$brower.poll()');
  return this;
};

AngularMock.prototype.notifyWhenNoOutstandingRequests = function(fn) {
  this.log.push('$brower.notifyWhenNoOutstandingRequests()');
  fn();
};

describe("angular.scenario.dsl", function() {
  var $window;
  var $root;
  var application;

  beforeEach(function() {
    $window = {
      document: _jQuery("<div></div>"),
      angular: new AngularMock()
    };
    $root = angular.scope({}, angular.service);
    $root.futures = [];
    $root.addFuture = function(name, fn) {
      this.futures.push(name);
      fn.call(this, function(error, result) {
        $root.futureError = error;
        $root.futureResult = result;
      });
    };
    $root.application = new angular.scenario.Application($window.document);
    $root.application.getWindow = function() {
      return $window;
    };
    $root.application.navigateTo = function(url, callback) {
      $window.location = url;
      callback();
    };
    // Just use the real one since it delegates to this.addFuture
    $root.addFutureAction = angular.scenario.
      SpecRunner.prototype.addFutureAction;
  });

  describe('Pause', function() {
    beforeEach(function() {
      $root.setTimeout = function(fn, value) {
        $root.timerValue = value;
        fn();
      };
    });

    it('should pause for specified seconds', function() {
      angular.scenario.dsl.pause.call($root).call($root, 10);
      expect($root.timerValue).toEqual(10000);
      expect($root.futureResult).toEqual(10000);
    });
  });

  describe('Expect', function() {
    it('should chain and execute matcher', function() {
      var future = {value: 10};
      var result = angular.scenario.dsl.expect.call($root).call($root, future);
      result.toEqual(10);
      expect($root.futureError).toBeUndefined();
      expect($root.futureResult).toBeUndefined();
      result = angular.scenario.dsl.expect.call($root).call($root, future);
      result.toEqual(20);
      expect($root.futureError).toBeDefined();
    });
  });

  describe('NavigateTo', function() {
    it('should allow a string url', function() {
      angular.scenario.dsl.navigateTo.call($root).call($root, 'http://myurl');
      expect($window.location).toEqual('http://myurl');
      expect($root.futureResult).toEqual('http://myurl');
    });

    it('should allow a future url', function() {
      var future = {name: 'future name', value: 'http://myurl'};
      angular.scenario.dsl.navigateTo.call($root).call($root, future);
      expect($window.location).toEqual('http://myurl');
      expect($root.futureResult).toEqual('http://myurl');
    });

    it('should complete if angular is missing from app frame', function() {
      delete $window.angular;
      angular.scenario.dsl.navigateTo.call($root).call($root, 'http://myurl');
      expect($window.location).toEqual('http://myurl');
      expect($root.futureResult).toEqual('http://myurl');
    });

    it('should wait for angular notify when no requests pending', function() {
      angular.scenario.dsl.navigateTo.call($root).call($root, 'url');
      expect($window.angular.log).toContain('$brower.poll()');
      expect($window.angular.log).
        toContain('$brower.notifyWhenNoOutstandingRequests()');
    });
  });

  describe('Element Finding', function() {
    var doc;
    //TODO(esprehn): Work around a bug in jQuery where attribute selectors
    //  only work if they are executed on a real document, not an element.
    //
    //  ex. jQuery('#foo').find('[name="bar"]') // fails
    //  ex. jQuery('#foo [name="bar"]') // works, wtf?
    //
    beforeEach(function() {
      doc = _jQuery('<div id="angular-scenario-binding"></div>');
      _jQuery(document.body).html('').append(doc);
     $window.document = window.document;
    });

    afterEach(function() {
      _jQuery(document.body).
        find('#angular-scenario-binding').
        remove();
    });

    describe('Binding', function() {
      it('should select binding by name', function() {
        doc.append('<span ng:bind="foo.bar">some value</span>');
        angular.scenario.dsl.binding.call($root).call($root, 'foo.bar');
        expect($root.futureResult).toEqual('some value');
      });

      it('should return error if no binding exists', function() {
        angular.scenario.dsl.binding.call($root).call($root, 'foo.bar');
        expect($root.futureError).toMatch(/does not exist/);
      });
    });

    describe('Input', function() {
      it('should change value in text input', function() {
        doc.append('<input name="test.input" value="something">');
        var chain = angular.scenario.dsl.input.
          call($root).call($root, 'test.input');
        chain.enter('foo');
        expect($window.angular.log).toContain('element(input)');
        expect($window.angular.log).toContain('element().trigger(change)');
        expect(_jQuery('input[name="test.input"]').val()).toEqual('foo');
      });

      it('should return error if no input exists', function() {
        var chain = angular.scenario.dsl.input.
          call($root).call($root, 'test.input');
        chain.enter('foo');
        expect($root.futureError).toMatch(/does not exist/);
      });

      it('should toggle checkbox state', function() {
        doc.append('<input type="checkbox" name="test.input" checked>');
        expect(_jQuery('input[name="test.input"]').
          attr('checked')).toBeTruthy();
        var chain = angular.scenario.dsl.input.
          call($root).call($root, 'test.input');
        chain.check();
        expect($window.angular.log).toContain('element(input)');
        expect($window.angular.log).toContain('element().trigger(click)');
        expect(_jQuery('input[name="test.input"]').
          attr('checked')).toBeFalsy();
        $window.angular.reset();
        chain.check();
        expect($window.angular.log).toContain('element(input)');
        expect($window.angular.log).toContain('element().trigger(click)');
        expect(_jQuery('input[name="test.input"]').
          attr('checked')).toBeTruthy();
      });

      it('should return error if checkbox does not exist', function() {
        var chain = angular.scenario.dsl.input.
          call($root).call($root, 'test.input');
        chain.check();
        expect($root.futureError).toMatch(/does not exist/);
      });

      it('should select option from radio group', function() {
        doc.append(
          '<input type="radio" name="0@test.input" value="foo">' +
          '<input type="radio" name="0@test.input" value="bar" checked="checked">');
        // HACK! We don't know why this is sometimes false on chrome
        _jQuery('input[name="0@test.input"][value="bar"]').attr('checked', true);
        expect(_jQuery('input[name="0@test.input"][value="bar"]').
          attr('checked')).toBeTruthy();
        expect(_jQuery('input[name="0@test.input"][value="foo"]').
          attr('checked')).toBeFalsy();
        var chain = angular.scenario.dsl.input.
          call($root).call($root, 'test.input');
        chain.select('foo');
        expect($window.angular.log).toContain('element(input)');
        expect($window.angular.log).toContain('element().trigger(click)');
        expect(_jQuery('input[name="0@test.input"][value="bar"]').
          attr('checked')).toBeFalsy();
        expect(_jQuery('input[name="0@test.input"][value="foo"]').
          attr('checked')).toBeTruthy();
      });

      it('should return error if radio button does not exist', function() {
        var chain = angular.scenario.dsl.input.
          call($root).call($root, 'test.input');
        chain.select('foo');
        expect($root.futureError).toMatch(/does not exist/);
      });
    });
  });

});
