describe("angular.scenario.dsl", function() {
  var $window, $root;
  var application, eventLog;

  beforeEach(function() {
    eventLog = [];
    $window = {
      document: _jQuery("<div></div>"),
      angular: new angular.scenario.testing.MockAngular()
    };
    $root = angular.scope({
      emit: function(eventName) {
        eventLog.push(eventName);
      },
      on: function(eventName) {
        eventLog.push('Listener Added for ' + eventName);
      }
    });
    $root.futures = [];
    $root.futureLog = [];
    $root.$window = $window;
    $root.addFuture = function(name, fn) {
      this.futures.push(name);
      fn.call(this, function(error, result) {
        $root.futureError = error;
        $root.futureResult = result;
        $root.futureLog.push(name);
      });
    };
    $root.dsl = {};
    angular.foreach(angular.scenario.dsl, function(fn, name) {
      $root.dsl[name] = function() {
        return fn.call($root).apply($root, arguments);
      };
    });
    $root.application = new angular.scenario.Application($window.document);
    $root.application.getWindow_ = function() {
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

  describe('Wait', function() {
    it('should wait until resume to complete', function() {
      expect($window.resume).toBeUndefined();
      $root.dsl.wait();
      expect(angular.isFunction($window.resume)).toBeTruthy();
      expect($root.futureLog).toEqual([]);
      $window.resume();
      expect($root.futureLog).
        toEqual(['waiting for you to resume']);
      expect(eventLog).toContain('InteractiveWait');
    });
  });

  describe('Pause', function() {
    beforeEach(function() {
      $root.$window.setTimeout = function(fn, value) {
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
      $root.dsl.navigateTo('http://myurl', function() {
        return 'http://futureUrl/';
      });
      expect($window.location).toEqual('http://futureUrl/');
      expect($root.futureResult).toEqual('http://futureUrl/');
    });

    it('should complete if angular is missing from app frame', function() {
      delete $window.angular;
      $root.dsl.navigateTo('http://myurl');
      expect($window.location).toEqual('http://myurl');
      expect($root.futureResult).toEqual('http://myurl');
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
        // Hash is important, otherwise we actually
        // go to a different page and break the runner
        doc.append('<a href="#"></a>');
        doc.find('a').click(function() {
          clicked = true;
        });
        $root.dsl.element('a').click();
      });

      it('should navigate page if click on anchor', function() {
        expect($window.location).not.toEqual('#foo');
        doc.append('<a href="#foo"></a>');
        $root.dsl.element('a').click();
        expect($window.location).toMatch(/#foo$/);
      });

      it('should count matching elements', function() {
        doc.append('<span></span><span></span>');
        $root.dsl.element('span').count();
        expect($root.futureResult).toEqual(2);
      });

      it('should return count of 0 if no matching elements', function() {
        $root.dsl.element('span').count();
        expect($root.futureResult).toEqual(0);
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

      it('should execute custom query', function() {
        doc.append('<a id="test" href="http://example.com/myUrl"></a>');
        $root.dsl.element('#test').query(function(elements, done) {
          done(null, elements.attr('href'));
        });
        expect($root.futureResult).toEqual('http://example.com/myUrl');
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

      it('should return 0 if repeater doesnt match', function() {
        doc.find('ul').html('');
        chain.count();
        expect($root.futureResult).toEqual(0);
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
        doc.append('<span class="ng-binding" ng:bind="foo.bar">some value</span>');
        $root.dsl.binding('foo.bar');
        expect($root.futureResult).toEqual('some value');
      });

      it('should select binding in template by name', function() {
        doc.append('<pre class="ng-binding" ng:bind-template="foo {{bar}} baz">foo some baz</pre>');
        $root.dsl.binding('bar');
        expect($root.futureResult).toEqual('foo some baz');
      });

      it('should match bindings by substring match', function() {
        doc.append('<pre class="ng-binding" ng:bind="foo.bar() && test.baz() | filter">binding value</pre>');
        $root.dsl.binding('test.baz');
        expect($root.futureResult).toEqual('binding value');
      });

      it('should return error if no bindings in document', function() {
        $root.dsl.binding('foo.bar');
        expect($root.futureError).toMatch(/did not match/);
      });

      it('should return error if no binding matches', function() {
        doc.append('<span class="ng-binding" ng:bind="foo">some value</span>');
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
        expect(_jQuery('input[name="test.input"]').
          attr('checked')).toBeFalsy();
        $window.angular.reset();
        chain.check();
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
