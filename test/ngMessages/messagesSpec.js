'use strict';

describe('ngMessages', function() {
  beforeEach(inject.strictDi());
  beforeEach(module('ngMessages'));

  function they(msg, vals, spec, focus) {
    forEach(vals, function(val, key) {
      var m = msg.replace('$prop', key);
      (focus ? iit : it)(m, function() {
        spec(val);
      });
    });
  }

  function tthey(msg, vals, spec) {
    they(msg, vals, spec, true);
  }

  function s(str) {
    return str.replace(/\s+/g,'');
  }

  var element;
  afterEach(function() {
    dealoc(element);
  });

  it('should render based off of a hashmap collection', inject(function($rootScope, $compile) {
    element = $compile('<div ng-messages="col">' +
                       '  <div ng-message="val">Message is set</div>' +
                       '</div>')($rootScope);
    $rootScope.$digest();

    expect(element.text()).not.toContain('Message is set');

    $rootScope.$apply(function() {
      $rootScope.col = { val: true };
    });

    expect(element.text()).toContain('Message is set');
  }));

  it('should render the same message if multiple message keys match', inject(function($rootScope, $compile) {
    element = $compile('<div ng-messages="col">' +
                       '  <div ng-message="one, two, three">Message is set</div>' +
                       '</div>')($rootScope);
    $rootScope.$digest();

    expect(element.text()).not.toContain('Message is set');

    $rootScope.$apply(function() {
      $rootScope.col = { one: true };
    });

    expect(element.text()).toContain('Message is set');

    $rootScope.$apply(function() {
      $rootScope.col = { two: true, one: false };
    });

    expect(element.text()).toContain('Message is set');

    $rootScope.$apply(function() {
      $rootScope.col = { three: true, two: false };
    });

    expect(element.text()).toContain('Message is set');

    $rootScope.$apply(function() {
      $rootScope.col = { three: false };
    });

    expect(element.text()).not.toContain('Message is set');
  }));

  it('should use the when attribute when an element directive is used',
    inject(function($rootScope, $compile) {

    element = $compile('<ng-messages for="col">' +
                       '  <ng-message when="val">Message is set</div>' +
                       '</ng-messages>')($rootScope);
    $rootScope.$digest();

    expect(element.text()).not.toContain('Message is set');

    $rootScope.$apply(function() {
      $rootScope.col = { val: true };
    });

    expect(element.text()).toContain('Message is set');
  }));

  it('should render the same message if multiple message keys match based on the when attribute', inject(function($rootScope, $compile) {
    element = $compile('<ng-messages for="col">' +
                       '  <ng-message when=" one two three ">Message is set</div>' +
                       '</ng-messages>')($rootScope);
    $rootScope.$digest();

    expect(element.text()).not.toContain('Message is set');

    $rootScope.$apply(function() {
      $rootScope.col = { one: true };
    });

    expect(element.text()).toContain('Message is set');

    $rootScope.$apply(function() {
      $rootScope.col = { two: true, one: false };
    });

    expect(element.text()).toContain('Message is set');

    $rootScope.$apply(function() {
      $rootScope.col = { three: true, two: false };
    });

    expect(element.text()).toContain('Message is set');

    $rootScope.$apply(function() {
      $rootScope.col = { three: false };
    });

    expect(element.text()).not.toContain('Message is set');
  }));

  it('should allow a dynamic expression to be set when ng-message-exp is used',
    inject(function($rootScope, $compile) {

    element = $compile('<div ng-messages="col">' +
                       '  <div ng-message-exp="variable">Message is crazy</div>' +
                       '</div>')($rootScope);
    $rootScope.$digest();

    expect(element.text()).not.toContain('Message is crazy');

    $rootScope.$apply(function() {
      $rootScope.variable = 'error';
      $rootScope.col = { error: true };
    });

    expect(element.text()).toContain('Message is crazy');

    $rootScope.$apply(function() {
      $rootScope.col = { error: false, failure: true };
    });

    expect(element.text()).not.toContain('Message is crazy');

    $rootScope.$apply(function() {
      $rootScope.variable = ['failure'];
    });

    expect(element.text()).toContain('Message is crazy');

    $rootScope.$apply(function() {
      $rootScope.variable = null;
    });

    expect(element.text()).not.toContain('Message is crazy');
  }));

  it('should allow a dynamic expression to be set when the when-exp attribute is used',
    inject(function($rootScope, $compile) {

    element = $compile('<ng-messages for="col">' +
                       '  <ng-message when-exp="variable">Message is crazy</ng-message>' +
                       '</ng-messages>')($rootScope);
    $rootScope.$digest();

    expect(element.text()).not.toContain('Message is crazy');

    $rootScope.$apply(function() {
      $rootScope.variable = 'error, failure';
      $rootScope.col = { error: true };
    });

    expect(element.text()).toContain('Message is crazy');

    $rootScope.$apply(function() {
      $rootScope.col = { error: false, failure: true };
    });

    expect(element.text()).toContain('Message is crazy');

    $rootScope.$apply(function() {
      $rootScope.variable = [];
    });

    expect(element.text()).not.toContain('Message is crazy');

    $rootScope.$apply(function() {
      $rootScope.variable = null;
    });

    expect(element.text()).not.toContain('Message is crazy');
  }));

  they('should render empty when $prop is used as a collection value',
    { 'null': null,
      'false': false,
      '0': 0,
      '[]': [],
      '[{}]': [{}],
      '': '',
      '{ val2 : true }': { val2: true } },
  function(prop) {
    inject(function($rootScope, $compile) {
      element = $compile('<div ng-messages="col">' +
                         '  <div ng-message="val">Message is set</div>' +
                         '</div>')($rootScope);
      $rootScope.$digest();

      $rootScope.$apply(function() {
        $rootScope.col = prop;
      });
      expect(element.text()).not.toContain('Message is set');
    });
  });

  they('should insert and remove matching inner elements when $prop is used as a value',
    { 'true': true,
      '1': 1,
      '{}': {},
      '[]': [],
      '[null]': [null] },
  function(prop) {
    inject(function($rootScope, $compile) {

      element = $compile('<div ng-messages="col">' +
                         '  <div ng-message="blue">This message is blue</div>' +
                         '  <div ng-message="red">This message is red</div>' +
                         '</div>')($rootScope);

      $rootScope.$apply(function() {
        $rootScope.col = {};
      });

      expect(element.children().length).toBe(0);
      expect(trim(element.text())).toEqual('');

      $rootScope.$apply(function() {
        $rootScope.col = {
          blue: true,
          red: false
        };
      });

      expect(element.children().length).toBe(1);
      expect(trim(element.text())).toEqual('This message is blue');

      $rootScope.$apply(function() {
        $rootScope.col = {
          red: prop
        };
      });

      expect(element.children().length).toBe(1);
      expect(trim(element.text())).toEqual('This message is red');

      $rootScope.$apply(function() {
        $rootScope.col = null;
      });
      expect(element.children().length).toBe(0);
      expect(trim(element.text())).toEqual('');


      $rootScope.$apply(function() {
        $rootScope.col = {
          blue: 0,
          red: null
        };
      });

      expect(element.children().length).toBe(0);
      expect(trim(element.text())).toEqual('');
    });
  });

  it('should display the elements in the order defined in the DOM',
    inject(function($rootScope, $compile) {

    element = $compile('<div ng-messages="col">' +
                       '  <div ng-message="one">Message#one</div>' +
                       '  <div ng-message="two">Message#two</div>' +
                       '  <div ng-message="three">Message#three</div>' +
                       '</div>')($rootScope);

    $rootScope.$apply(function() {
      $rootScope.col = {
        three: true,
        one: true,
        two: true
      };
    });

    angular.forEach(['one','two','three'], function(key) {
      expect(s(element.text())).toEqual('Message#' + key);

      $rootScope.$apply(function() {
        $rootScope.col[key] = false;
      });
    });

    expect(s(element.text())).toEqual('');
  }));

  it('should add ng-active/ng-inactive CSS classes to the element when errors are/aren\'t displayed',
    inject(function($rootScope, $compile) {

    element = $compile('<div ng-messages="col">' +
                       '  <div ng-message="ready">This message is ready</div>' +
                       '</div>')($rootScope);

    $rootScope.$apply(function() {
      $rootScope.col = {};
    });

    expect(element.hasClass('ng-active')).toBe(false);
    expect(element.hasClass('ng-inactive')).toBe(true);

    $rootScope.$apply(function() {
      $rootScope.col = { ready: true };
    });

    expect(element.hasClass('ng-active')).toBe(true);
    expect(element.hasClass('ng-inactive')).toBe(false);
  }));

  it('should automatically re-render the messages when other directives dynmically change them',
    inject(function($rootScope, $compile) {

    element = $compile('<div ng-messages="col">' +
                       '  <div ng-message="primary">Enter something</div>' +
                       '  <div ng-repeat="item in items">' +
                       '    <div ng-message-exp="item.name">{{ item.text }}</div>' +
                       '  </div>' +
                       '</div>')($rootScope);

    $rootScope.$apply(function() {
      $rootScope.col = {};
      $rootScope.items = [
        { text: 'Your age is incorrect', name: 'age' },
        { text: 'You\'re too tall man!', name: 'height' },
        { text: 'Your hair is too long', name: 'hair' }
      ];
    });

    expect(messageChildren().length).toBe(0);
    expect(trim(element.text())).toEqual("");

    $rootScope.$apply(function() {
      $rootScope.col = { hair: true };
    });

    expect(messageChildren().length).toBe(1);
    expect(trim(element.text())).toEqual("Your hair is too long");

    $rootScope.$apply(function() {
      $rootScope.col = { age: true, hair: true};
    });

    expect(messageChildren().length).toBe(1);
    expect(trim(element.text())).toEqual("Your age is incorrect");

    $rootScope.$apply(function() {
      // remove the age!
      $rootScope.items.shift();
    });

    expect(messageChildren().length).toBe(1);
    expect(trim(element.text())).toEqual("Your hair is too long");

    $rootScope.$apply(function() {
      // remove the hair!
      $rootScope.items.length = 0;
      $rootScope.col.primary = true;
    });

    expect(messageChildren().length).toBe(1);
    expect(trim(element.text())).toEqual("Enter something");

    function messageChildren() {
      return element[0].querySelectorAll('[ng-message], [ng-message-exp]');
    }
  }));


  it('should render animations when the active/inactive classes are added/removed', function() {
    module('ngAnimate');
    module('ngAnimateMock');
    inject(function($rootScope, $compile, $animate) {
      element = $compile('<div ng-messages="col">' +
                         '  <div ng-message="ready">This message is ready</div>' +
                         '</div>')($rootScope);

      $rootScope.$apply(function() {
        $rootScope.col = {};
      });

      var event = $animate.queue.pop();
      expect(event.event).toBe('setClass');
      expect(event.args[1]).toBe('ng-inactive');
      expect(event.args[2]).toBe('ng-active');

      $rootScope.$apply(function() {
        $rootScope.col = { ready: true };
      });

      event = $animate.queue.pop();
      expect(event.event).toBe('setClass');
      expect(event.args[1]).toBe('ng-active');
      expect(event.args[2]).toBe('ng-inactive');
    });
  });

  describe('when including templates', function() {
    they('should load a remote template using $prop',
      {'<div ng-messages-include="...">': '<div ng-messages="data">' +
                                            '<div ng-messages-include="abc.html"></div>' +
                                          '</div>',
       '<ng-messages-include src="...">': '<ng-messages for="data">' +
                                            '<ng-messages-include src="abc.html"></ng-messages-include>' +
                                          '</ng-messages>'},
    function(html) {
      inject(function($compile, $rootScope, $templateCache) {
        $templateCache.put('abc.html', '<div ng-message="a">A</div>' +
                                       '<div ng-message="b">B</div>' +
                                       '<div ng-message="c">C</div>');

        element = $compile(html)($rootScope);
        $rootScope.$apply(function() {
          $rootScope.data = {
            'a': 1,
            'b': 2,
            'c': 3
          };
        });

        expect(element.children().length).toBe(1);
        expect(trim(element.text())).toEqual("A");

        $rootScope.$apply(function() {
          $rootScope.data = {
            'c': 3
          };
        });

        expect(element.children().length).toBe(1);
        expect(trim(element.text())).toEqual("C");
      });
    });

    it('should cache the template after download',
      inject(function($rootScope, $compile, $templateCache, $httpBackend) {

      $httpBackend.expect('GET', 'tpl').respond(201, 'abc');

      expect($templateCache.get('tpl')).toBeUndefined();

      element = $compile('<div ng-messages="data"><div ng-messages-include="tpl"></div></div>')($rootScope);

      $rootScope.$digest();
      $httpBackend.flush();

      expect($templateCache.get('tpl')).toBeDefined();
    }));

    it('should re-render the messages after download without an extra digest',
      inject(function($rootScope, $compile, $httpBackend) {

      $httpBackend.expect('GET', 'my-messages').respond(201,
        '<div ng-message="required">You did not enter a value</div>');

      element = $compile('<div ng-messages="data">' +
                         '  <div ng-messages-include="my-messages"></div>' +
                         '  <div ng-message="failed">Your value is that of failure</div>' +
                         '</div>')($rootScope);

      $rootScope.data = {
        required: true,
        failed: true
      };

      $rootScope.$digest();

      expect(element.children().length).toBe(1);
      expect(trim(element.text())).toEqual("Your value is that of failure");

      $httpBackend.flush();
      $rootScope.$digest();

      expect(element.children().length).toBe(1);
      expect(trim(element.text())).toEqual("You did not enter a value");
    }));

    it('should allow for overriding the remote template messages within the element depending on where the remote template is placed',
      inject(function($compile, $rootScope, $templateCache) {

      $templateCache.put('abc.html', '<div ng-message="a">A</div>' +
                                     '<div ng-message="b">B</div>' +
                                     '<div ng-message="c">C</div>');

      element = $compile('<div ng-messages="data">' +
                         '  <div ng-message="a">AAA</div>' +
                         '  <div ng-messages-include="abc.html"></div>' +
                         '  <div ng-message="c">CCC</div>' +
                         '</div>')($rootScope);

      $rootScope.$apply(function() {
        $rootScope.data = {
          'a': 1,
          'b': 2,
          'c': 3
        };
      });

      expect(element.children().length).toBe(1);
      expect(trim(element.text())).toEqual("AAA");

      $rootScope.$apply(function() {
        $rootScope.data = {
          'b': 2,
          'c': 3
        };
      });

      expect(element.children().length).toBe(1);
      expect(trim(element.text())).toEqual("B");

      $rootScope.$apply(function() {
        $rootScope.data = {
          'c': 3
        };
      });

      expect(element.children().length).toBe(1);
      expect(trim(element.text())).toEqual("C");
    }));

  });

  describe('when multiple', function() {
    they('should show all truthy messages when the $prop attr is present',
      { 'multiple': 'multiple',
        'ng-messages-multiple': 'ng-messages-multiple' },
    function(prop) {
      inject(function($rootScope, $compile) {
        element = $compile('<div ng-messages="data" ' + prop + '>' +
                           '  <div ng-message="one">1</div>' +
                           '  <div ng-message="two">2</div>' +
                           '  <div ng-message="three">3</div>' +
                           '</div>')($rootScope);

        $rootScope.$apply(function() {
          $rootScope.data = {
            'one': true,
            'two': false,
            'three': true
          };
        });

        expect(element.children().length).toBe(2);
        expect(s(element.text())).toContain("13");
      });
    });

    it('should render all truthy messages from a remote template',
      inject(function($rootScope, $compile, $templateCache) {

      $templateCache.put('xyz.html', '<div ng-message="x">X</div>' +
                                     '<div ng-message="y">Y</div>' +
                                     '<div ng-message="z">Z</div>');

      element = $compile('<div ng-messages="data" ng-messages-multiple="true">' +
                           '<div ng-messages-include="xyz.html"></div>' +
                         '</div>')($rootScope);

      $rootScope.$apply(function() {
        $rootScope.data = {
          'x': 'a',
          'y': null,
          'z': true
        };
      });

      expect(element.children().length).toBe(2);
      expect(s(element.text())).toEqual("XZ");

      $rootScope.$apply(function() {
        $rootScope.data.y = {};
      });

      expect(element.children().length).toBe(3);
      expect(s(element.text())).toEqual("XYZ");
    }));

    it('should render and override all truthy messages from a remote template',
      inject(function($rootScope, $compile, $templateCache) {

      $templateCache.put('xyz.html', '<div ng-message="x">X</div>' +
                                     '<div ng-message="y">Y</div>' +
                                     '<div ng-message="z">Z</div>');

      element = $compile('<div ng-messages="data" ng-messages-multiple="true">' +
                            '<div ng-message="y">YYY</div>' +
                            '<div ng-message="z">ZZZ</div>' +
                            '<div ng-messages-include="xyz.html"></div>' +
                         '</div>')($rootScope);

      $rootScope.$apply(function() {
        $rootScope.data = {
          'x': 'a',
          'y': null,
          'z': true
        };
      });

      expect(element.children().length).toBe(2);
      expect(s(element.text())).toEqual("ZZZX");

      $rootScope.$apply(function() {
        $rootScope.data.y = {};
      });

      expect(element.children().length).toBe(3);
      expect(s(element.text())).toEqual("YYYZZZX");
    }));
  });
});
