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
    /* jshint -W001 */
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


  it("should allow ngClassOdd/Even on the same element with overlapping classes", inject(function($rootScope, $compile, $animate) {
      var className;

      element = $compile('<ul><li ng-repeat="i in [0,1,2]" ng-class-odd="\'same odd\'" ng-class-even="\'same even\'"></li><ul>')($rootScope);
      $rootScope.$digest();
      var e1 = jqLite(element[0].childNodes[1]);
      var e2 = jqLite(element[0].childNodes[5]);
      expect(e1.hasClass('same')).toBeTruthy();
      expect(e1.hasClass('odd')).toBeTruthy();
      expect(e2.hasClass('same')).toBeTruthy();
      expect(e2.hasClass('odd')).toBeTruthy();
    })
  );

  it('should allow ngClass with overlapping classes', inject(function($rootScope, $compile, $animate) {
    element = $compile('<div ng-class="{\'same yes\': test, \'same no\': !test}"></div>')($rootScope);
    $rootScope.$digest();

    expect(element).toHaveClass('same');
    expect(element).not.toHaveClass('yes');
    expect(element).toHaveClass('no');

    $rootScope.$apply(function() {
      $rootScope.test = true;
    });

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


  it('should reapply ngClass when interpolated class attribute changes', inject(function($rootScope, $compile) {
    element = $compile('<div class="one {{cls}} three" ng-class="{four: four}"></div>')($rootScope);

    $rootScope.$apply(function() {
      $rootScope.cls = "two";
      $rootScope.four = true;
    });
    expect(element).toHaveClass('one');
    expect(element).toHaveClass('two'); // interpolated
    expect(element).toHaveClass('three');
    expect(element).toHaveClass('four');

    $rootScope.$apply(function() {
      $rootScope.cls = "too";
    });
    expect(element).toHaveClass('one');
    expect(element).toHaveClass('too'); // interpolated
    expect(element).toHaveClass('three');
    expect(element).toHaveClass('four'); // should still be there
    expect(element.hasClass('two')).toBeFalsy();

    $rootScope.$apply(function() {
      $rootScope.cls = "to";
    });
    expect(element).toHaveClass('one');
    expect(element).toHaveClass('to'); // interpolated
    expect(element).toHaveClass('three');
    expect(element).toHaveClass('four'); // should still be there
    expect(element.hasClass('two')).toBeFalsy();
    expect(element.hasClass('too')).toBeFalsy();
  }));


  it('should not mess up class value due to observing an interpolated class attribute', inject(function($rootScope, $compile) {
    $rootScope.foo = true;
    $rootScope.$watch("anything", function() {
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
});

describe('ngClass animations', function() {
  var body, element, $rootElement;

  afterEach(function() {
    dealoc(element);
  });

  it("should avoid calling addClass accidentally when removeClass is going on", function() {
    module('ngAnimateMock');
    inject(function($compile, $rootScope, $animate, $timeout) {
      element = angular.element('<div ng-class="val"></div>');
      var body = jqLite(document.body);
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

  it("should combine the ngClass evaluation with the enter animation", function() {

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
    inject(function($compile, $rootScope, $browser, $rootElement, $animate, $timeout, $$body) {
      $animate.enabled(true);

      $rootScope.val = 'crazy';
      element = angular.element('<div ng-class="val"></div>');
      $$body.append($rootElement);

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

  it("should not remove classes if they're going to be added back right after", function() {
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
