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
  var mock = this;
  return {
    selector: '',
    attr: function(name, value) {
      mock.log.push('attr(' + name + (angular.isDefined(value) ? ',' + value : '') + ')');
      return _jQuery.fn.attr.apply(_jQuery(node), arguments); 
    },
    trigger: function(type) {
      mock.log.push('element().trigger(' + type + ')');
      //TODO(esprehn): See the HACK!! in the SpecRunner. This avoids
      // triggering the second part of the hack in tests
      delete this.selector;
    }
  };
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
    $root.dsl = {};
    angular.foreach(angular.scenario.dsl, function(fn, name) {
      $root.dsl[name] = function() {
        return fn.call($root).apply($root, arguments);
      };
    });
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
      $root.dsl.pause(10);
      expect($root.timerValue).toEqual(10000);
      expect($root.futureResult).toEqual(10000);
    });
  });

  describe('Expect', function() {
    it('should chain and execute matcher', function() {
      var future = {value: 10};
      var result = $root.dsl.expect(future);
      result.toEqual(10);
      expect($root.futureError).toBeUndefined();
      expect($root.futureResult).toBeUndefined();
      result = $root.dsl.expect(future);
      result.toEqual(20);
      expect($root.futureError).toBeDefined();
    });
  });

  describe('NavigateTo', function() {
    it('should allow a string url', function() {
      $root.dsl.navigateTo('http://myurl');
      expect($window.location).toEqual('http://myurl');
      expect($root.futureResult).toEqual('http://myurl');
    });

    it('should allow a future url', function() {
      var future = {name: 'future name', value: 'http://myurl'};
      $root.dsl.navigateTo(future);
      expect($window.location).toEqual('http://myurl');
      expect($root.futureResult).toEqual('http://myurl');
    });

    it('should complete if angular is missing from app frame', function() {
      delete $window.angular;
      $root.dsl.navigateTo('http://myurl');
      expect($window.location).toEqual('http://myurl');
      expect($root.futureResult).toEqual('http://myurl');
    });

    it('should wait for angular notify when no requests pending', function() {
      $root.dsl.navigateTo('url');
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

    describe('Select', function() {
      it('should select single option', function() {
        doc.append(
          '<select name="test">' +
          '  <option>A</option>' +
          '  <option selected>B</option>' +
          '</select>'
        );
        $root.dsl.select('test').option('A');
        expect(_jQuery('[name="test"]').val()).toEqual('A');
      });

      it('should select multiple options', function() {
        doc.append(
          '<select name="test" multiple>' +
          '  <option>A</option>' +
          '  <option selected>B</option>' +
          '  <option>C</option>' +
          '</select>'
        );
        $root.dsl.select('test').options('A', 'B');
        expect(_jQuery('[name="test"]').val()).toEqual(['A','B']);
      });
      
      it('should fail to select multiple options on non-multiple select', function() {
        doc.append('<select name="test"></select>');
        $root.dsl.select('test').options('A', 'B');
        expect($root.futureError).toMatch(/did not match/);
      });
    });

    describe('Element', function() {
      it('should execute click', function() {
        var clicked;
        doc.append('<a href=""></a>');
        doc.find('a').click(function() {
          clicked = true;
        });
        $root.dsl.element('a').click();
      });
      
      it('should get attribute', function() {
        doc.append('<div id="test" class="foo"></div>');
        $root.dsl.element('#test').attr('class');
        expect($root.futureResult).toEqual('foo');
      });

      it('should set attribute', function() {
        doc.append('<div id="test" class="foo"></div>');
        $root.dsl.element('#test').attr('class', 'bam');
        expect(doc.find('div').attr('class')).toEqual('bam');
      });
      
      it('should get val', function() {
        doc.append('<input value="bar">');
        $root.dsl.element('input').val();
        expect($root.futureResult).toEqual('bar');
      });
      
      it('should set val', function() {
        doc.append('<input value="bar">');
        $root.dsl.element('input').val('baz');
        expect(doc.find('input').val()).toEqual('baz');
      });

    });

    describe('Repeater', function() {
      var chain;
      beforeEach(function() {
        doc.append(
          '<ul>' +
          '  <li ng:repeat-index="0"><span ng:bind="name">misko</span><span ng:bind="gender">male</span></li>' +
          '  <li ng:repeat-index="1"><span ng:bind="name">felisa</span><span ng:bind="gender">female</span></li>' +
          '</ul>'
        );
        chain = $root.dsl.repeater('ul li');
      });

      it('should get the row count', function() {
        chain.count();
        expect($root.futureResult).toEqual(2);
      });

      it('should get a row of bindings', function() {
        chain.row(1);
        expect($root.futureResult).toEqual(['felisa', 'female']);
      });

      it('should get a column of bindings', function() {
        chain.column('gender');
        expect($root.futureResult).toEqual(['male', 'female']);
      });
    });

    describe('Binding', function() {
      it('should select binding by name', function() {
        doc.append('<span ng:bind="foo.bar">some value</span>');
        $root.dsl.binding('foo.bar');
        expect($root.futureResult).toEqual('some value');
      });
      
      it('should select binding in template by name', function() {
        doc.append('<pre ng:bind-template="foo {{bar}} baz">foo some baz</pre>');
        $root.dsl.binding('bar');
        expect($root.futureResult).toEqual('foo some baz');
      });

      it('should return error if no binding exists', function() {
        $root.dsl.binding('foo.bar');
        expect($root.futureError).toMatch(/did not match/);
      });
    });
    
    describe('Using', function() {
      it('should prefix selector in $document.elements()', function() {
        var chain;
        doc.append(
          '<div id="test1"><input name="test.input" value="something"></div>' +
          '<div id="test2"><input name="test.input" value="something"></div>'
        );
        chain = $root.dsl.using('div#test2');
        chain.input('test.input').enter('foo');
        expect($window.angular.log).toContain('element(input)');
        expect($window.angular.log).toContain('element().trigger(change)');
        var inputs = _jQuery('input[name="test.input"]');
        expect(inputs.first().val()).toEqual('something');
        expect(inputs.last().val()).toEqual('foo');
      });
    });

    describe('Input', function() {
      it('should change value in text input', function() {
        doc.append('<input name="test.input" value="something">');
        var chain = $root.dsl.input('test.input');
        chain.enter('foo');
        expect($window.angular.log).toContain('element(input)');
        expect($window.angular.log).toContain('element().trigger(change)');
        expect(_jQuery('input[name="test.input"]').val()).toEqual('foo');
      });

      it('should return error if no input exists', function() {
        var chain = $root.dsl.input('test.input');
        chain.enter('foo');
        expect($root.futureError).toMatch(/did not match/);
      });

      it('should toggle checkbox state', function() {
        doc.append('<input type="checkbox" name="test.input" checked>');
        expect(_jQuery('input[name="test.input"]').
          attr('checked')).toBeTruthy();
        var chain = $root.dsl.input('test.input');
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

      it('should return error if checkbox did not match', function() {
        var chain = $root.dsl.input('test.input');
        chain.check();
        expect($root.futureError).toMatch(/did not match/);
      });

      it('should select option from radio group', function() {
        doc.append(
          '<input type="radio" name="0@test.input" value="foo">' +
          '<input type="radio" name="0@test.input" value="bar" checked="checked">'
        );
        // HACK! We don't know why this is sometimes false on chrome
        _jQuery('input[name="0@test.input"][value="bar"]').attr('checked', true);
        expect(_jQuery('input[name="0@test.input"][value="bar"]').
          attr('checked')).toBeTruthy();
        expect(_jQuery('input[name="0@test.input"][value="foo"]').
          attr('checked')).toBeFalsy();
        var chain = $root.dsl.input('test.input');
        chain.select('foo');
        expect($window.angular.log).toContain('element(input)');
        expect($window.angular.log).toContain('element().trigger(click)');
        expect(_jQuery('input[name="0@test.input"][value="bar"]').
          attr('checked')).toBeFalsy();
        expect(_jQuery('input[name="0@test.input"][value="foo"]').
          attr('checked')).toBeTruthy();
      });

      it('should return error if radio button did not match', function() {
        var chain = $root.dsl.input('test.input');
        chain.select('foo');
        expect($root.futureError).toMatch(/did not match/);
      });
    });
    
  });
});
