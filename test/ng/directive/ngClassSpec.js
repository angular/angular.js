'use strict';

describe('ngClass', function() {
  var element;

  beforeEach(module(function($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
  }));

  afterEach(function() {
    dealoc(element);
  });


  it('should add new and remove old classes dynamically', inject(function($rootScope, $compile) {
    element = $compile('<div class="existing" ng-class="dynClass"></div>')($rootScope);
    $rootScope.dynClass = 'A';
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBe(true);
    expect(element.hasClass('A')).toBe(true);

    $rootScope.dynClass = 'B';
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBe(true);
    expect(element.hasClass('A')).toBe(false);
    expect(element.hasClass('B')).toBe(true);

    delete $rootScope.dynClass;
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBe(true);
    expect(element.hasClass('A')).toBe(false);
    expect(element.hasClass('B')).toBe(false);
  }));


  it('should add new and remove old classes with same names as Object.prototype properties dynamically', inject(function($rootScope, $compile) {
    element = $compile('<div class="existing" ng-class="dynClass"></div>')($rootScope);
    $rootScope.dynClass = { watch: true, hasOwnProperty: true, isPrototypeOf: true };
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBe(true);
    expect(element.hasClass('watch')).toBe(true);
    expect(element.hasClass('hasOwnProperty')).toBe(true);
    expect(element.hasClass('isPrototypeOf')).toBe(true);

    $rootScope.dynClass.watch = false;
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBe(true);
    expect(element.hasClass('watch')).toBe(false);
    expect(element.hasClass('hasOwnProperty')).toBe(true);
    expect(element.hasClass('isPrototypeOf')).toBe(true);

    delete $rootScope.dynClass;
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBe(true);
    expect(element.hasClass('watch')).toBe(false);
    expect(element.hasClass('hasOwnProperty')).toBe(false);
    expect(element.hasClass('isPrototypeOf')).toBe(false);
  }));


  it('should support adding multiple classes via an array', inject(function($rootScope, $compile) {
    element = $compile('<div class="existing" ng-class="[\'A\', \'B\']"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBeTruthy();
    expect(element.hasClass('A')).toBeTruthy();
    expect(element.hasClass('B')).toBeTruthy();
  }));


  it('should support adding multiple classes conditionally via a map of class names to boolean ' +
      'expressions', inject(function($rootScope, $compile) {
    element = $compile(
        '<div class="existing" ' +
            'ng-class="{A: conditionA, B: conditionB(), AnotB: conditionA&&!conditionB()}">' +
        '</div>')($rootScope);
    $rootScope.conditionA = true;
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBeTruthy();
    expect(element.hasClass('A')).toBeTruthy();
    expect(element.hasClass('B')).toBeFalsy();
    expect(element.hasClass('AnotB')).toBeTruthy();

    $rootScope.conditionB = function() { return true; };
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBeTruthy();
    expect(element.hasClass('A')).toBeTruthy();
    expect(element.hasClass('B')).toBeTruthy();
    expect(element.hasClass('AnotB')).toBeFalsy();
  }));

  it('should support adding multiple classes via an array mixed with conditionally via a map', inject(function($rootScope, $compile) {
    element = $compile('<div class="existing" ng-class="[\'A\', {\'B\': condition}]"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBeTruthy();
    expect(element.hasClass('A')).toBeTruthy();
    expect(element.hasClass('B')).toBeFalsy();
    $rootScope.condition = true;
    $rootScope.$digest();
    expect(element.hasClass('B')).toBeTruthy();

  }));

  it('should remove classes when the referenced object is the same but its property is changed',
    inject(function($rootScope, $compile) {
      element = $compile('<div ng-class="classes"></div>')($rootScope);
      $rootScope.classes = { A: true, B: true };
      $rootScope.$digest();
      expect(element.hasClass('A')).toBeTruthy();
      expect(element.hasClass('B')).toBeTruthy();
      $rootScope.classes.A = false;
      $rootScope.$digest();
      expect(element.hasClass('A')).toBeFalsy();
      expect(element.hasClass('B')).toBeTruthy();
    })
  );


  it('should support adding multiple classes via a space delimited string', inject(function($rootScope, $compile) {
    element = $compile('<div class="existing" ng-class="\'A B\'"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBeTruthy();
    expect(element.hasClass('A')).toBeTruthy();
    expect(element.hasClass('B')).toBeTruthy();
  }));


  it('should support adding multiple classes via a space delimited string inside an array', inject(function($rootScope, $compile) {
    element = $compile('<div class="existing" ng-class="[\'A B\', \'C\']"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBeTruthy();
    expect(element.hasClass('A')).toBeTruthy();
    expect(element.hasClass('B')).toBeTruthy();
    expect(element.hasClass('C')).toBeTruthy();
  }));


  it('should preserve class added post compilation with pre-existing classes', inject(function($rootScope, $compile) {
    element = $compile('<div class="existing" ng-class="dynClass"></div>')($rootScope);
    $rootScope.dynClass = 'A';
    $rootScope.$digest();
    expect(element.hasClass('existing')).toBe(true);

    // add extra class, change model and eval
    element.addClass('newClass');
    $rootScope.dynClass = 'B';
    $rootScope.$digest();

    expect(element.hasClass('existing')).toBe(true);
    expect(element.hasClass('B')).toBe(true);
    expect(element.hasClass('newClass')).toBe(true);
  }));


  it('should preserve class added post compilation without pre-existing classes"', inject(function($rootScope, $compile) {
    element = $compile('<div ng-class="dynClass"></div>')($rootScope);
    $rootScope.dynClass = 'A';
    $rootScope.$digest();
    expect(element.hasClass('A')).toBe(true);

    // add extra class, change model and eval
    element.addClass('newClass');
    $rootScope.dynClass = 'B';
    $rootScope.$digest();

    expect(element.hasClass('B')).toBe(true);
    expect(element.hasClass('newClass')).toBe(true);
  }));


  it('should preserve other classes with similar name"', inject(function($rootScope, $compile) {
    element = $compile('<div class="ui-panel ui-selected" ng-class="dynCls"></div>')($rootScope);
    $rootScope.dynCls = 'panel';
    $rootScope.$digest();
    $rootScope.dynCls = 'foo';
    $rootScope.$digest();
    expect(element[0].className).toBe('ui-panel ui-selected foo');
  }));


  it('should not add duplicate classes', inject(function($rootScope, $compile) {
    element = $compile('<div class="panel bar" ng-class="dynCls"></div>')($rootScope);
    $rootScope.dynCls = 'panel';
    $rootScope.$digest();
    expect(element[0].className).toBe('panel bar');
  }));


  it('should remove classes even if it was specified via class attribute', inject(function($rootScope, $compile) {
    element = $compile('<div class="panel bar" ng-class="dynCls"></div>')($rootScope);
    $rootScope.dynCls = 'panel';
    $rootScope.$digest();
    $rootScope.dynCls = 'window';
    $rootScope.$digest();
    expect(element[0].className).toBe('bar window');
  }));


  it('should remove classes even if they were added by another code', inject(function($rootScope, $compile) {
    element = $compile('<div ng-class="dynCls"></div>')($rootScope);
    $rootScope.dynCls = 'foo';
    $rootScope.$digest();
    element.addClass('foo');
    $rootScope.dynCls = '';
    $rootScope.$digest();
    expect(element[0].className).toBe('');
  }));


  it('should convert undefined and null values to an empty string', inject(function($rootScope, $compile) {
    element = $compile('<div ng-class="dynCls"></div>')($rootScope);
    $rootScope.dynCls = [undefined, null];
    $rootScope.$digest();
    expect(element[0].className).toBe('');
  }));


  it('should ngClass odd/even', inject(function($rootScope, $compile) {
    element = $compile('<ul><li ng-repeat="i in [0,1]" class="existing" ng-class-odd="\'odd\'" ng-class-even="\'even\'"></li><ul>')($rootScope);
    $rootScope.$digest();
    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[3]);
    expect(e1.hasClass('existing')).toBeTruthy();
    expect(e1.hasClass('odd')).toBeTruthy();
    expect(e2.hasClass('existing')).toBeTruthy();
    expect(e2.hasClass('even')).toBeTruthy();
  }));


  it('should allow both ngClass and ngClassOdd/Even on the same element', inject(function($rootScope, $compile) {
    element = $compile('<ul>' +
      '<li ng-repeat="i in [0,1]" ng-class="\'plainClass\'" ' +
      'ng-class-odd="\'odd\'" ng-class-even="\'even\'"></li>' +
      '<ul>')($rootScope);
    $rootScope.$apply();
    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[3]);

    expect(e1.hasClass('plainClass')).toBeTruthy();
    expect(e1.hasClass('odd')).toBeTruthy();
    expect(e1.hasClass('even')).toBeFalsy();
    expect(e2.hasClass('plainClass')).toBeTruthy();
    expect(e2.hasClass('even')).toBeTruthy();
    expect(e2.hasClass('odd')).toBeFalsy();
  }));


  it('should allow ngClassOdd/Even on the same element with overlapping classes',
    inject(function($compile, $rootScope) {
      element = $compile(
          '<ul>' +
            '<li ng-repeat="i in [0,1,2]" ' +
                'ng-class-odd="\'same odd\'" ' +
                'ng-class-even="\'same even\'">' +
            '</li>' +
          '<ul>')($rootScope);
      $rootScope.$digest();

      var e1 = element.children().eq(0);
      var e2 = element.children().eq(1);
      var e3 = element.children().eq(2);

      expect(e1).toHaveClass('same');
      expect(e1).toHaveClass('odd');
      expect(e1).not.toHaveClass('even');
      expect(e2).toHaveClass('same');
      expect(e2).not.toHaveClass('odd');
      expect(e2).toHaveClass('even');
      expect(e3).toHaveClass('same');
      expect(e3).toHaveClass('odd');
      expect(e3).not.toHaveClass('even');
    })
  );

  it('should allow ngClass with overlapping classes', inject(function($rootScope, $compile) {
    element = $compile('<div ng-class="{\'same yes\': test, \'same no\': !test}"></div>')($rootScope);
    $rootScope.$digest();

    expect(element).toHaveClass('same');
    expect(element).not.toHaveClass('yes');
    expect(element).toHaveClass('no');

    $rootScope.$apply('test = true');

    expect(element).toHaveClass('same');
    expect(element).toHaveClass('yes');
    expect(element).not.toHaveClass('no');
  }));

  it('should allow both ngClass and ngClassOdd/Even with multiple classes', inject(function($rootScope, $compile) {
    element = $compile('<ul>' +
      '<li ng-repeat="i in [0,1]" ng-class="[\'A\', \'B\']" ' +
      'ng-class-odd="[\'C\', \'D\']" ng-class-even="[\'E\', \'F\']"></li>' +
      '<ul>')($rootScope);
    $rootScope.$apply();
    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[3]);

    expect(e1.hasClass('A')).toBeTruthy();
    expect(e1.hasClass('B')).toBeTruthy();
    expect(e1.hasClass('C')).toBeTruthy();
    expect(e1.hasClass('D')).toBeTruthy();
    expect(e1.hasClass('E')).toBeFalsy();
    expect(e1.hasClass('F')).toBeFalsy();

    expect(e2.hasClass('A')).toBeTruthy();
    expect(e2.hasClass('B')).toBeTruthy();
    expect(e2.hasClass('E')).toBeTruthy();
    expect(e2.hasClass('F')).toBeTruthy();
    expect(e2.hasClass('C')).toBeFalsy();
    expect(e2.hasClass('D')).toBeFalsy();
  }));

  it('should reapply ngClass when interpolated class attribute changes',
    inject(function($compile, $rootScope) {
      element = $compile(
        '<div>' +
          '<div class="one {{two}} three" ng-class="{five: five}"></div>' +
          '<div class="one {{two}} three {{four}}" ng-class="{five: five}"></div>' +
        '</div>')($rootScope);
      var e1 = element.children().eq(0);
      var e2 = element.children().eq(1);

      $rootScope.$apply('two = "two"; five = true');

      expect(e1).toHaveClass('one');
      expect(e1).toHaveClass('two');
      expect(e1).toHaveClass('three');
      expect(e1).not.toHaveClass('four');
      expect(e1).toHaveClass('five');
      expect(e2).toHaveClass('one');
      expect(e2).toHaveClass('two');
      expect(e2).toHaveClass('three');
      expect(e2).not.toHaveClass('four');
      expect(e2).toHaveClass('five');

      $rootScope.$apply('two = "another-two"');

      expect(e1).toHaveClass('one');
      expect(e1).not.toHaveClass('two');
      expect(e1).toHaveClass('another-two');
      expect(e1).toHaveClass('three');
      expect(e1).not.toHaveClass('four');
      expect(e1).toHaveClass('five');
      expect(e2).toHaveClass('one');
      expect(e2).not.toHaveClass('two');
      expect(e2).toHaveClass('another-two');
      expect(e2).toHaveClass('three');
      expect(e2).not.toHaveClass('four');
      expect(e2).toHaveClass('five');

      $rootScope.$apply('two = "two-more"; four = "four"');

      expect(e1).toHaveClass('one');
      expect(e1).not.toHaveClass('two');
      expect(e1).not.toHaveClass('another-two');
      expect(e1).toHaveClass('two-more');
      expect(e1).toHaveClass('three');
      expect(e1).not.toHaveClass('four');
      expect(e1).toHaveClass('five');
      expect(e2).toHaveClass('one');
      expect(e2).not.toHaveClass('two');
      expect(e2).not.toHaveClass('another-two');
      expect(e2).toHaveClass('two-more');
      expect(e2).toHaveClass('three');
      expect(e2).toHaveClass('four');
      expect(e2).toHaveClass('five');

      $rootScope.$apply('five = false');

      expect(e1).toHaveClass('one');
      expect(e1).not.toHaveClass('two');
      expect(e1).not.toHaveClass('another-two');
      expect(e1).toHaveClass('two-more');
      expect(e1).toHaveClass('three');
      expect(e1).not.toHaveClass('four');
      expect(e1).not.toHaveClass('five');
      expect(e2).toHaveClass('one');
      expect(e2).not.toHaveClass('two');
      expect(e2).not.toHaveClass('another-two');
      expect(e2).toHaveClass('two-more');
      expect(e2).toHaveClass('three');
      expect(e2).toHaveClass('four');
      expect(e2).not.toHaveClass('five');
    })
  );


  it('should not mess up class value due to observing an interpolated class attribute', inject(function($rootScope, $compile) {
    $rootScope.foo = true;
    $rootScope.$watch('anything', function() {
      $rootScope.foo = false;
    });
    element = $compile('<div ng-class="{foo:foo}"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.hasClass('foo')).toBe(false);
  }));


  it('should update ngClassOdd/Even when an item is added to the model', inject(function($rootScope, $compile) {
    element = $compile('<ul>' +
      '<li ng-repeat="i in items" ' +
      'ng-class-odd="\'odd\'" ng-class-even="\'even\'">i</li>' +
      '<ul>')($rootScope);
    $rootScope.items = ['b','c','d'];
    $rootScope.$digest();

    $rootScope.items.unshift('a');
    $rootScope.$digest();

    var e1 = jqLite(element[0].childNodes[1]);
    var e4 = jqLite(element[0].childNodes[7]);

    expect(e1.hasClass('odd')).toBeTruthy();
    expect(e1.hasClass('even')).toBeFalsy();

    expect(e4.hasClass('even')).toBeTruthy();
    expect(e4.hasClass('odd')).toBeFalsy();
  }));


  it('should update ngClassOdd/Even when model is changed by filtering', inject(function($rootScope, $compile) {
    element = $compile('<ul>' +
      '<li ng-repeat="i in items track by $index" ' +
      'ng-class-odd="\'odd\'" ng-class-even="\'even\'"></li>' +
      '<ul>')($rootScope);
    $rootScope.items = ['a','b','a'];
    $rootScope.$digest();

    $rootScope.items = ['a','a'];
    $rootScope.$digest();

    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[3]);

    expect(e1.hasClass('odd')).toBeTruthy();
    expect(e1.hasClass('even')).toBeFalsy();

    expect(e2.hasClass('even')).toBeTruthy();
    expect(e2.hasClass('odd')).toBeFalsy();
  }));


  it('should update ngClassOdd/Even when model is changed by sorting', inject(function($rootScope, $compile) {
    element = $compile('<ul>' +
      '<li ng-repeat="i in items" ' +
      'ng-class-odd="\'odd\'" ng-class-even="\'even\'">i</li>' +
      '<ul>')($rootScope);
    $rootScope.items = ['a','b'];
    $rootScope.$digest();

    $rootScope.items = ['b','a'];
    $rootScope.$digest();

    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[3]);

    expect(e1.hasClass('odd')).toBeTruthy();
    expect(e1.hasClass('even')).toBeFalsy();

    expect(e2.hasClass('even')).toBeTruthy();
    expect(e2.hasClass('odd')).toBeFalsy();
  }));


  it('should add/remove the correct classes when the expression and `$index` change simultaneously',
    inject(function($compile, $rootScope) {
      element = $compile(
          '<div>' +
            '<div ng-class-odd="foo"></div>' +
            '<div ng-class-even="foo"></div>' +
          '</div>')($rootScope);
      var odd = element.children().eq(0);
      var even = element.children().eq(1);

      $rootScope.$apply('$index = 0; foo = "class1"');

      expect(odd).toHaveClass('class1');
      expect(odd).not.toHaveClass('class2');
      expect(even).not.toHaveClass('class1');
      expect(even).not.toHaveClass('class2');

      $rootScope.$apply('$index = 1; foo = "class2"');

      expect(odd).not.toHaveClass('class1');
      expect(odd).not.toHaveClass('class2');
      expect(even).not.toHaveClass('class1');
      expect(even).toHaveClass('class2');

      $rootScope.$apply('foo = "class1"');

      expect(odd).not.toHaveClass('class1');
      expect(odd).not.toHaveClass('class2');
      expect(even).toHaveClass('class1');
      expect(even).not.toHaveClass('class2');

      $rootScope.$apply('$index = 2');

      expect(odd).toHaveClass('class1');
      expect(odd).not.toHaveClass('class2');
      expect(even).not.toHaveClass('class1');
      expect(even).not.toHaveClass('class2');
    })
  );

  it('should support mixed array/object variable with a mutating object',
    inject(function($rootScope, $compile) {
      element = $compile('<div ng-class="classVar"></div>')($rootScope);

      $rootScope.classVar = [{orange: true}];
      $rootScope.$digest();
      expect(element).toHaveClass('orange');

      $rootScope.classVar[0].orange = false;
      $rootScope.$digest();

      expect(element).not.toHaveClass('orange');
    })
  );

  it('should do value stabilization as expected when one-time binding',
    inject(function($rootScope, $compile) {
      element = $compile('<div ng-class="::className"></div>')($rootScope);

      $rootScope.$apply('className = "foo"');
      expect(element).toHaveClass('foo');

      $rootScope.$apply('className = "bar"');
      expect(element).toHaveClass('foo');
    })
  );

  it('should remove the watcher when static array one-time binding',
    inject(function($rootScope, $compile) {
      element = $compile('<div ng-class="::[className]"></div>')($rootScope);

      $rootScope.$apply('className = "foo"');
      expect(element).toHaveClass('foo');

      $rootScope.$apply('className = "bar"');
      expect(element).toHaveClass('foo');
      expect(element).not.toHaveClass('bar');
    })
  );

  it('should remove the watcher when static map one-time binding',
    inject(function($rootScope, $compile) {
      element = $compile('<div ng-class="::{foo: fooPresent}"></div>')($rootScope);

      $rootScope.$apply('fooPresent = true');
      expect(element).toHaveClass('foo');

      $rootScope.$apply('fooPresent = false');
      expect(element).toHaveClass('foo');
    })
  );

  it('should track changes of mutating object inside an array',
    inject(function($rootScope, $compile) {
      $rootScope.classVar = [{orange: true}];
      element = $compile('<div ng-class="classVar"></div>')($rootScope);

      $rootScope.$digest();
      expect(element).toHaveClass('orange');

      $rootScope.$apply('classVar[0].orange = false');
      expect(element).not.toHaveClass('orange');
    })
  );

  describe('large objects', function() {
    var getProp;
    var veryLargeObj;

    beforeEach(function() {
      getProp = jasmine.createSpy('getProp');
      veryLargeObj = {};

      Object.defineProperty(veryLargeObj, 'prop', {
        get: getProp,
        enumerable: true
      });
    });

    it('should not be copied when using an expression', inject(function($compile, $rootScope) {
      element = $compile('<div ng-class="fooClass"></div>')($rootScope);
      $rootScope.fooClass = {foo: veryLargeObj};
      $rootScope.$digest();

      expect(element).toHaveClass('foo');
      expect(getProp).not.toHaveBeenCalled();
    }));

    it('should not be copied when using a literal', inject(function($compile, $rootScope) {
      element = $compile('<div ng-class="{foo: veryLargeObj}"></div>')($rootScope);
      $rootScope.veryLargeObj = veryLargeObj;
      $rootScope.$digest();

      expect(element).toHaveClass('foo');
      expect(getProp).not.toHaveBeenCalled();
    }));

    it('should not be copied when inside an array', inject(function($compile, $rootScope) {
      element = $compile('<div ng-class="[{foo: veryLargeObj}]"></div>')($rootScope);
      $rootScope.veryLargeObj = veryLargeObj;
      $rootScope.$digest();

      expect(element).toHaveClass('foo');
      expect(getProp).not.toHaveBeenCalled();
    }));

    it('should not be copied when using one-time binding', inject(function($compile, $rootScope) {
      element = $compile('<div ng-class="::{foo: veryLargeObj, bar: bar}"></div>')($rootScope);
      $rootScope.veryLargeObj = veryLargeObj;
      $rootScope.$digest();

      expect(element).toHaveClass('foo');
      expect(element).not.toHaveClass('bar');
      expect(getProp).not.toHaveBeenCalled();

      $rootScope.$apply('veryLargeObj.bar = "bar"');

      expect(element).toHaveClass('foo');
      expect(element).not.toHaveClass('bar');
      expect(getProp).not.toHaveBeenCalled();

      $rootScope.$apply('bar = "bar"');

      expect(element).toHaveClass('foo');
      expect(element).toHaveClass('bar');
      expect(getProp).not.toHaveBeenCalled();

      $rootScope.$apply('veryLargeObj.bar = "qux"');

      expect(element).toHaveClass('foo');
      expect(element).toHaveClass('bar');
      expect(getProp).not.toHaveBeenCalled();
    }));
  });
});

describe('ngClass animations', function() {
  var body, element, $rootElement;

  afterEach(function() {
    dealoc(element);
  });

  it('should avoid calling addClass accidentally when removeClass is going on', function() {
    module('ngAnimateMock');
    inject(function($compile, $rootScope, $animate, $timeout) {
      element = angular.element('<div ng-class="val"></div>');
      var body = jqLite(window.document.body);
      body.append(element);
      $compile(element)($rootScope);

      expect($animate.queue.length).toBe(0);

      $rootScope.val = 'one';
      $rootScope.$digest();
      expect($animate.queue.shift().event).toBe('addClass');
      expect($animate.queue.length).toBe(0);

      $rootScope.val = '';
      $rootScope.$digest();
      expect($animate.queue.shift().event).toBe('removeClass'); //only removeClass is called
      expect($animate.queue.length).toBe(0);

      $rootScope.val = 'one';
      $rootScope.$digest();
      expect($animate.queue.shift().event).toBe('addClass');
      expect($animate.queue.length).toBe(0);

      $rootScope.val = 'two';
      $rootScope.$digest();
      expect($animate.queue.shift().event).toBe('addClass');
      expect($animate.queue.shift().event).toBe('removeClass');
      expect($animate.queue.length).toBe(0);
    });
  });

  it('should combine the ngClass evaluation with the enter animation', function() {

    //mocks are not used since the enter delegation method is called before addClass and
    //it makes it impossible to test to see that addClass is called first
    module('ngAnimate');
    module('ngAnimateMock');

    module(function($animateProvider) {
      $animateProvider.register('.crazy', function() {
        return {
          enter: function(element, done) {
            element.data('state', 'crazy-enter');
            done();
          }
        };
      });
    });
    inject(function($compile, $rootScope, $browser, $rootElement, $animate, $document) {
      $animate.enabled(true);

      $rootScope.val = 'crazy';
      element = angular.element('<div ng-class="val"></div>');
      jqLite($document[0].body).append($rootElement);

      $compile(element)($rootScope);

      var enterComplete = false;
      $animate.enter(element, $rootElement, null).then(function() {
        enterComplete = true;
      });

      //jquery doesn't compare both elements properly so let's use the nodes
      expect(element.parent()[0]).toEqual($rootElement[0]);
      expect(element.hasClass('crazy')).toBe(false);
      expect(enterComplete).toBe(false);

      $rootScope.$digest();
      $animate.flush();
      $rootScope.$digest();

      expect(element.hasClass('crazy')).toBe(true);
      expect(enterComplete).toBe(true);
      expect(element.data('state')).toBe('crazy-enter');
    });
  });

  it('should not remove classes if they\'re going to be added back right after', function() {
    module('ngAnimateMock');

    inject(function($rootScope, $compile, $animate) {
      var className;

      $rootScope.one = true;
      $rootScope.two = true;
      $rootScope.three = true;

      element = angular.element('<div ng-class="{one:one, two:two, three:three}"></div>');
      $compile(element)($rootScope);
      $rootScope.$digest();

      //this fires twice due to the class observer firing
      var item = $animate.queue.shift();
      expect(item.event).toBe('addClass');
      expect(item.args[1]).toBe('one two three');

      expect($animate.queue.length).toBe(0);

      $rootScope.three = false;
      $rootScope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('removeClass');
      expect(item.args[1]).toBe('three');

      expect($animate.queue.length).toBe(0);

      $rootScope.two = false;
      $rootScope.three = true;
      $rootScope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('addClass');
      expect(item.args[1]).toBe('three');

      item = $animate.queue.shift();
      expect(item.event).toBe('removeClass');
      expect(item.args[1]).toBe('two');

      expect($animate.queue.length).toBe(0);
    });
  });
});
