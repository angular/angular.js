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
    angular.forEach(angular.scenario.dsl, function(fn, name) {
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

  describe('Pause', function() {
    it('should pause until resume to complete', function() {
      expect($window.resume).toBeUndefined();
      $root.dsl.pause();
      expect(angular.isFunction($window.resume)).toBeTruthy();
      expect($root.futureLog).toEqual([]);
      $window.resume();
      expect($root.futureLog).
        toEqual(['pausing for you to resume']);
      expect(eventLog).toContain('InteractivePause');
    });
  });

  describe('Sleep', function() {
    beforeEach(function() {
      $root.$window.setTimeout = function(fn, value) {
        $root.timerValue = value;
        fn();
      };
    });

    it('should sleep for specified seconds', function() {
      $root.dsl.sleep(10);
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

  describe('Browser', function() {
    describe('Reload', function() {
      it('should navigateTo', function() {
        $window.location = {
          href: '#foo'
        };
        $root.dsl.browser().reload();
        expect($root.futureResult).toEqual('#foo');
        expect($window.location).toEqual('#foo');
      });
    });

    describe('NavigateTo', function() {
      it('should allow a string url', function() {
        $root.dsl.browser().navigateTo('http://myurl');
        expect($window.location).toEqual('http://myurl');
        expect($root.futureResult).toEqual('http://myurl');
      });

      it('should allow a future url', function() {
        $root.dsl.browser().navigateTo('http://myurl', function() {
          return 'http://futureUrl/';
        });
        expect($window.location).toEqual('http://futureUrl/');
        expect($root.futureResult).toEqual('http://futureUrl/');
      });

      it('should complete if angular is missing from app frame', function() {
        delete $window.angular;
        $root.dsl.browser().navigateTo('http://myurl');
        expect($window.location).toEqual('http://myurl');
        expect($root.futureResult).toEqual('http://myurl');
      });
    });

    describe('Location', function() {
      beforeEach(function() {
        $window.location = {
          href: 'http://myurl/some/path?foo=10#/bar?x=2',
          pathname: '/some/path',
          search: '?foo=10',
          hash: '#bar?x=2'
        };
        $window.angular.scope = function() {
          return {
            $service: function(serviceId) {
              if (serviceId == '$location') {
                return {
                  hashSearch: {x: 2},
                  hashPath: '/bar',
                  search: {foo: 10}
                };
              } else {
                throw new Error('unknown service id ' + serviceId);
              }
            }
          };
        };
      });

      it('should return full URL for href', function() {
        $root.dsl.browser().location().href();
        expect($root.futureResult).toEqual($window.location.href);
      });

      it('should return the pathname', function() {
        $root.dsl.browser().location().path();
        expect($root.futureResult).toEqual($window.location.pathname);
      });

      it('should return the hash without the #', function() {
        $root.dsl.browser().location().hash();
        expect($root.futureResult).toEqual('bar?x=2');
      });

      it('should return the query string as an object', function() {
        $root.dsl.browser().location().search();
        expect($root.futureResult).toEqual({foo: 10});
      });

      it('should return the hashSearch as an object', function() {
        $root.dsl.browser().location().hashSearch();
        expect($root.futureResult).toEqual({x: 2});
      });

      it('should return the hashPath', function() {
        $root.dsl.browser().location().hashPath();
        expect($root.futureResult).toEqual('/bar');
      });
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

      it('should get css', function() {
        doc.append('<div id="test" style="height: 30px"></div>');
        $root.dsl.element('#test').css('height');
        expect($root.futureResult).toMatch(/30px/);
      });

      it('should set css', function() {
        doc.append('<div id="test" style="height: 10px"></div>');
        $root.dsl.element('#test').css('height', '20px');
        expect(doc.find('#test').css('height')).toEqual('20px');
      });

      it('should add all jQuery key/value methods', function() {
        var METHODS = ['css', 'attr'];
        var chain = $root.dsl.element('input');
        angular.forEach(METHODS, function(name) {
          expect(angular.isFunction(chain[name])).toBeTruthy();
        });
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

      it('should use correct future name for generated set methods', function() {
        doc.append('<input value="bar">');
        $root.dsl.element('input').val(false);
        expect($root.futures.pop()).toMatch(/element 'input' set val/);
      });

      it('should use correct future name for generated get methods', function() {
        doc.append('<input value="bar">');
        $root.dsl.element('input').val();
        expect($root.futures.pop()).toMatch(/element 'input' val/);
      });

      it('should add all jQuery property methods', function() {
        var METHODS = [
          'val', 'text', 'html', 'height', 'innerHeight', 'outerHeight', 'width',
          'innerWidth', 'outerWidth', 'position', 'scrollLeft', 'scrollTop', 'offset'
        ];
        var chain = $root.dsl.element('input');
        angular.forEach(METHODS, function(name) {
          expect(angular.isFunction(chain[name])).toBeTruthy();
        });
      });

      it('should execute custom query', function() {
        doc.append('<a id="test" href="http://example.com/myUrl"></a>');
        $root.dsl.element('#test').query(function(elements, done) {
          done(null, elements.attr('href'));
        });
        expect($root.futureResult).toEqual('http://example.com/myUrl');
      });

      it('should use the selector as label if none is given', function() {
        $root.dsl.element('mySelector');
        expect($root.label).toEqual('mySelector');
      });

      it('should include the selector in paren when a label is given', function() {
        $root.dsl.element('mySelector', 'myLabel');
        expect($root.label).toEqual('myLabel ( mySelector )');
      });
    });

    describe('Repeater', function() {
      var chain;
      beforeEach(function() {
        doc.append(
          '<ul>' +
          '  <li ng:repeat-index="0"><span ng:bind="name" class="ng-binding">misko</span>' +
          '    <span ng:bind="test && gender" class="ng-binding">male</span></li>' +
          '  <li ng:repeat-index="1"><span ng:bind="name" class="ng-binding">felisa</span>' +
          '    <span ng:bind="gender | uppercase" class="ng-binding">female</span></li>' +
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

      it('should use the selector as label if none is given', function() {
        expect($root.label).toEqual('ul li');
      });

      it('should include the selector in paren when a label is given', function() {
        $root.dsl.repeater('mySelector', 'myLabel');
        expect($root.label).toEqual('myLabel ( ul li mySelector )');
      });
    });

    describe('Binding', function() {
      it('should select binding by name', function() {
        doc.append('<span class="ng-binding" ng:bind="foo.bar">some value</span>');
        $root.dsl.binding('foo.bar');
        expect($root.futureResult).toEqual('some value');
      });

      it('should select binding by regexp', function() {
        doc.append('<span class="ng-binding" ng:bind="foo.bar">some value</span>');
        $root.dsl.binding(/^foo\..+/);
        expect($root.futureResult).toEqual('some value');
      });

      it('should return value for input elements', function() {
        doc.append('<input type="text" class="ng-binding" ng:bind="foo.bar" value="some value"/>');
        $root.dsl.binding('foo.bar');
        expect($root.futureResult).toEqual('some value');
      });

      it('should return value for textarea elements', function() {
        doc.append('<textarea class="ng-binding" ng:bind="foo.bar">some value</textarea>');
        $root.dsl.binding('foo.bar');
        expect($root.futureResult).toEqual('some value');
      });

      it('should return innerHTML for all the other elements', function() {
        doc.append('<div class="ng-binding" ng:bind="foo.bar">some <b>value</b></div>');
        $root.dsl.binding('foo.bar');
        expect($root.futureResult.toLowerCase()).toEqual('some <b>value</b>');
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

      it('should use the selector as label if none is given', function() {
        $root.dsl.using('mySelector');
        expect($root.label).toEqual('mySelector');
      });

      it('should include the selector in paren when a label is given', function() {
        $root.dsl.using('mySelector', 'myLabel');
        expect($root.label).toEqual('myLabel ( mySelector )');
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

      describe('val', function() {
        it('should return value in text input', function() {
          doc.append('<input name="test.input" value="something">');
          $root.dsl.input('test.input').val();
          expect($root.futureResult).toEqual("something");
        });
      });
    });

    describe('Textarea', function() {

      it('should change value in textarea', function() {
        doc.append('<textarea name="test.textarea">something</textarea>');
        var chain = $root.dsl.input('test.textarea');
        chain.enter('foo');
        expect(_jQuery('textarea[name="test.textarea"]').val()).toEqual('foo');
      });

      it('should return error if no textarea exists', function() {
        var chain = $root.dsl.input('test.textarea');
        chain.enter('foo');
        expect($root.futureError).toMatch(/did not match/);
      });
    });
  });
});
