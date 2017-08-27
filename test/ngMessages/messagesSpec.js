'use strict';

describe('ngMessages', function() {
  beforeEach(inject.strictDi());
  beforeEach(module('ngMessages'));

  function messageChildren(element) {
    return (element.length ? element[0] : element).querySelectorAll('[ng-message], [ng-message-exp]');
  }

  function s(str) {
    return str.replace(/\s+/g,'');
  }

  function trim(value) {
    return isString(value) ? value.trim() : value;
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

      expect(messageChildren(element).length).toBe(0);
      expect(trim(element.text())).toEqual('');

      $rootScope.$apply(function() {
        $rootScope.col = {
          blue: true,
          red: false
        };
      });

      expect(messageChildren(element).length).toBe(1);
      expect(trim(element.text())).toEqual('This message is blue');

      $rootScope.$apply(function() {
        $rootScope.col = {
          red: prop
        };
      });

      expect(messageChildren(element).length).toBe(1);
      expect(trim(element.text())).toEqual('This message is red');

      $rootScope.$apply(function() {
        $rootScope.col = null;
      });
      expect(messageChildren(element).length).toBe(0);
      expect(trim(element.text())).toEqual('');


      $rootScope.$apply(function() {
        $rootScope.col = {
          blue: 0,
          red: null
        };
      });

      expect(messageChildren(element).length).toBe(0);
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

  it('should automatically re-render the messages when other directives dynamically change them',
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

    expect(messageChildren(element).length).toBe(0);
    expect(trim(element.text())).toEqual('');

    $rootScope.$apply(function() {
      $rootScope.col = { hair: true };
    });

    expect(messageChildren(element).length).toBe(1);
    expect(trim(element.text())).toEqual('Your hair is too long');

    $rootScope.$apply(function() {
      $rootScope.col = { age: true, hair: true};
    });

    expect(messageChildren(element).length).toBe(1);
    expect(trim(element.text())).toEqual('Your age is incorrect');

    $rootScope.$apply(function() {
      // remove the age!
      $rootScope.items.shift();
    });

    expect(messageChildren(element).length).toBe(1);
    expect(trim(element.text())).toEqual('Your hair is too long');

    $rootScope.$apply(function() {
      // remove the hair!
      $rootScope.items.length = 0;
      $rootScope.col.primary = true;
    });

    expect(messageChildren(element).length).toBe(1);
    expect(trim(element.text())).toEqual('Enter something');
  }));


  it('should be compatible with ngBind',
    inject(function($rootScope, $compile) {

    element = $compile('<div ng-messages="col">' +
                       '        <div ng-message="required" ng-bind="errorMessages.required"></div>' +
                       '        <div ng-message="extra" ng-bind="errorMessages.extra"></div>' +
                       '</div>')($rootScope);

    $rootScope.$apply(function() {
      $rootScope.col = {
        required: true,
        extra: true
      };
      $rootScope.errorMessages = {
        required: 'Fill in the text field.',
        extra: 'Extra error message.'
      };
    });

    expect(messageChildren(element).length).toBe(1);
    expect(trim(element.text())).toEqual('Fill in the text field.');

    $rootScope.$apply(function() {
      $rootScope.col.required = false;
      $rootScope.col.extra = true;
    });

    expect(messageChildren(element).length).toBe(1);
    expect(trim(element.text())).toEqual('Extra error message.');

    $rootScope.$apply(function() {
      $rootScope.errorMessages.extra = 'New error message.';
    });

    expect(messageChildren(element).length).toBe(1);
    expect(trim(element.text())).toEqual('New error message.');
  }));


  // issue #12856
  it('should only detach the message object that is associated with the message node being removed',
    inject(function($rootScope, $compile, $animate) {

    // We are going to spy on the `leave` method to give us control over
    // when the element is actually removed
    spyOn($animate, 'leave');

    // Create a basic ng-messages set up
    element = $compile('<div ng-messages="col">' +
                       '  <div ng-message="primary">Enter something</div>' +
                       '</div>')($rootScope);

    // Trigger the message to be displayed
    $rootScope.col = { primary: true };
    $rootScope.$digest();
    expect(messageChildren(element).length).toEqual(1);
    var oldMessageNode = messageChildren(element)[0];

    // Remove the message
    $rootScope.col = { primary: undefined };
    $rootScope.$digest();

    // Since we have spied on the `leave` method, the message node is still in the DOM
    expect($animate.leave).toHaveBeenCalledOnce();
    var nodeToRemove = $animate.leave.calls.mostRecent().args[0][0];
    expect(nodeToRemove).toBe(oldMessageNode);
    $animate.leave.calls.reset();

    // Add the message back in
    $rootScope.col = { primary: true };
    $rootScope.$digest();

    // Simulate the animation completing on the node
    jqLite(nodeToRemove).remove();

    // We should not get another call to `leave`
    expect($animate.leave).not.toHaveBeenCalled();

    // There should only be the new message node
    expect(messageChildren(element).length).toEqual(1);
    var newMessageNode = messageChildren(element)[0];
    expect(newMessageNode).not.toBe(oldMessageNode);
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

  describe('ngMessage nested nested inside elements', function() {

    it('should not crash or leak memory when the messages are transcluded, the first message is ' +
      'visible, and ngMessages is removed by ngIf', function() {

      module(function($compileProvider) {
        $compileProvider.directive('messageWrap', function() {
          return {
            transclude: true,
            scope: {
              col: '=col'
            },
            template: '<div ng-messages="col"><ng-transclude></ng-transclude></div>'
          };
        });
      });

      inject(function($rootScope, $compile) {

        element = $compile('<div><div ng-if="show"><div message-wrap col="col">' +
                           '        <div ng-message="a">A</div>' +
                           '        <div ng-message="b">B</div>' +
                           '</div></div></div>')($rootScope);

        $rootScope.$apply(function() {
          $rootScope.show = true;
          $rootScope.col = {
            a: true,
            b: true
          };
        });

        expect(messageChildren(element).length).toBe(1);
        expect(trim(element.text())).toEqual('A');

        $rootScope.$apply('show = false');

        expect(messageChildren(element).length).toBe(0);
      });
    });


    it('should not crash when the first of two nested messages is removed', function() {
      inject(function($rootScope, $compile) {

        element = $compile(
          '<div ng-messages="col">' +
            '<div class="wrapper">' +
              '<div remove-me ng-message="a">A</div>' +
              '<div ng-message="b">B</div>' +
            '</div>' +
          '</div>'
        )($rootScope);

        $rootScope.$apply(function() {
          $rootScope.col = {
            a: true,
            b: false
          };
        });

        expect(messageChildren(element).length).toBe(1);
        expect(trim(element.text())).toEqual('A');

        var ctrl = element.controller('ngMessages');
        var deregisterSpy = spyOn(ctrl, 'deregister').and.callThrough();

        var nodeA = element[0].querySelector('[ng-message="a"]');
        jqLite(nodeA).remove();
        $rootScope.$digest(); // The next digest triggers the error

        // Make sure removing the element triggers the deregistration in ngMessages
        expect(trim(deregisterSpy.calls.mostRecent().args[0].nodeValue)).toBe('ngMessage: a');
        expect(messageChildren(element).length).toBe(0);
      });
    });


    it('should not crash, but show deeply nested messages correctly after a message ' +
      'has been removed', function() {
      inject(function($rootScope, $compile) {

        element = $compile(
          '<div ng-messages="col" ng-messages-multiple>' +
            '<div class="another-wrapper">' +
              '<div ng-message="a">A</div>' +
              '<div class="wrapper">' +
                '<div ng-message="b">B</div>' +
                '<div ng-message="c">C</div>' +
              '</div>' +
              '<div ng-message="d">D</div>' +
            '</div>' +
          '</div>'
        )($rootScope);

        $rootScope.$apply(function() {
          $rootScope.col = {
            a: true,
            b: true
          };
        });

        expect(messageChildren(element).length).toBe(2);
        expect(trim(element.text())).toEqual('AB');

        var ctrl = element.controller('ngMessages');
        var deregisterSpy = spyOn(ctrl, 'deregister').and.callThrough();

        var nodeB = element[0].querySelector('[ng-message="b"]');
        jqLite(nodeB).remove();
        $rootScope.$digest(); // The next digest triggers the error

        // Make sure removing the element triggers the deregistration in ngMessages
        expect(trim(deregisterSpy.calls.mostRecent().args[0].nodeValue)).toBe('ngMessage: b');
        expect(messageChildren(element).length).toBe(1);
        expect(trim(element.text())).toEqual('A');
      });
    });
  });


  it('should clean-up the ngMessage scope when a message is removed',
    inject(function($compile, $rootScope) {

      var html =
          '<div ng-messages="items">' +
            '<div ng-message="a">{{forA}}</div>' +
          '</div>';

      element = $compile(html)($rootScope);
      $rootScope.$apply(function() {
        $rootScope.forA = 'A';
        $rootScope.items = {a: true};
      });

      expect(element.text()).toBe('A');
      var watchers = $rootScope.$countWatchers();

      $rootScope.$apply('items.a = false');

      expect(element.text()).toBe('');
      // We don't know exactly how many watchers are on the scope, only that there should be
      // one less now
      expect($rootScope.$countWatchers()).toBe(watchers - 1);
    })
  );


  describe('when including templates', function() {
    they('should work with a dynamic collection model which is managed by ngRepeat',
      {'<div ng-messages-include="...">': '<div ng-messages="item">' +
                                            '<div ng-messages-include="abc.html"></div>' +
                                          '</div>',
       '<ng-messages-include src="...">': '<ng-messages for="item">' +
                                            '<ng-messages-include src="abc.html"></ng-messages-include>' +
                                          '</ng-messages>'},
    function(html) {
      inject(function($compile, $rootScope, $templateCache) {
        $templateCache.put('abc.html', '<div ng-message="a">A</div>' +
                                       '<div ng-message="b">B</div>' +
                                       '<div ng-message="c">C</div>');

        html = '<div><div ng-repeat="item in items">' + html + '</div></div>';
        $rootScope.items = [{},{},{}];

        element = $compile(html)($rootScope);
        $rootScope.$apply(function() {
          $rootScope.items[0].a = true;
          $rootScope.items[1].b = true;
          $rootScope.items[2].c = true;
        });

        var elements = element[0].querySelectorAll('[ng-repeat]');

        // all three collections should have at least one error showing up
        expect(messageChildren(element).length).toBe(3);
        expect(messageChildren(elements[0]).length).toBe(1);
        expect(messageChildren(elements[1]).length).toBe(1);
        expect(messageChildren(elements[2]).length).toBe(1);

        // this is the standard order of the displayed error messages
        expect(element.text().trim()).toBe('ABC');

        $rootScope.$apply(function() {
          $rootScope.items[0].a = false;
          $rootScope.items[0].c = true;

          $rootScope.items[1].b = false;

          $rootScope.items[2].c = false;
          $rootScope.items[2].a = true;
        });

        // with the 2nd item gone and the values changed
        // we should see both 1 and 3 changed
        expect(element.text().trim()).toBe('CA');

        $rootScope.$apply(function() {
          // add the value for the 2nd item back
          $rootScope.items[1].b = true;
          $rootScope.items.reverse();
        });

        // when reversed we get back to our original value
        expect(element.text().trim()).toBe('ABC');
      });
    });

    they('should remove the $prop element and place a comment anchor node where it used to be',
      {'<div ng-messages-include="...">': '<div ng-messages="data">' +
                                            '<div ng-messages-include="abc.html"></div>' +
                                          '</div>',
       '<ng-messages-include src="...">': '<ng-messages for="data">' +
                                            '<ng-messages-include src="abc.html"></ng-messages-include>' +
                                          '</ng-messages>'},
    function(html) {
      inject(function($compile, $rootScope, $templateCache) {
        $templateCache.put('abc.html', '<div></div>');

        element = $compile(html)($rootScope);
        $rootScope.$digest();

        var includeElement = element[0].querySelector('[ng-messages-include], ng-messages-include');
        expect(includeElement).toBeFalsy();

        var comment = element[0].childNodes[0];
        expect(comment.nodeType).toBe(8);
        expect(comment.nodeValue).toBe(' ngMessagesInclude: abc.html ');
      });
    });

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

        expect(messageChildren(element).length).toBe(1);
        expect(trim(element.text())).toEqual('A');

        $rootScope.$apply(function() {
          $rootScope.data = {
            'c': 3
          };
        });

        expect(messageChildren(element).length).toBe(1);
        expect(trim(element.text())).toEqual('C');
      });
    });

    it('should cache the template after download',
      inject(function($rootScope, $compile, $templateCache, $httpBackend) {

      $httpBackend.expect('GET', 'tpl').respond(201, '<div>abc</div>');

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

      expect(messageChildren(element).length).toBe(1);
      expect(trim(element.text())).toEqual('Your value is that of failure');

      $httpBackend.flush();
      $rootScope.$digest();

      expect(messageChildren(element).length).toBe(1);
      expect(trim(element.text())).toEqual('You did not enter a value');
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

      expect(messageChildren(element).length).toBe(1);
      expect(trim(element.text())).toEqual('AAA');

      $rootScope.$apply(function() {
        $rootScope.data = {
          'b': 2,
          'c': 3
        };
      });

      expect(messageChildren(element).length).toBe(1);
      expect(trim(element.text())).toEqual('B');

      $rootScope.$apply(function() {
        $rootScope.data = {
          'c': 3
        };
      });

      expect(messageChildren(element).length).toBe(1);
      expect(trim(element.text())).toEqual('C');
    }));

    it('should properly detect a previous message, even if it was registered later',
      inject(function($compile, $rootScope, $templateCache) {
        $templateCache.put('include.html', '<div ng-message="a">A</div>');
        var html =
            '<div ng-messages="items">' +
              '<div ng-include="\'include.html\'"></div>' +
              '<div ng-message="b">B</div>' +
              '<div ng-message="c">C</div>' +
            '</div>';

        element = $compile(html)($rootScope);
        $rootScope.$apply('items = {b: true, c: true}');

        expect(element.text()).toBe('B');

        var ctrl = element.controller('ngMessages');
        var deregisterSpy = spyOn(ctrl, 'deregister').and.callThrough();

        var nodeB = element[0].querySelector('[ng-message="b"]');
        jqLite(nodeB).remove();

        // Make sure removing the element triggers the deregistration in ngMessages
        expect(trim(deregisterSpy.calls.mostRecent().args[0].nodeValue)).toBe('ngMessage: b');

        $rootScope.$apply('items.a = true');

        expect(element.text()).toBe('A');
      })
    );

    it('should not throw if scope has been destroyed when template request is ready',
      inject(function($rootScope, $httpBackend, $compile) {
        $httpBackend.expectGET('messages.html').respond('<div ng-message="a">A</div>');
        $rootScope.show = true;
        var html =
            '<div ng-if="show">' +
              '<div ng-messages="items">' +
                '<div ng-messages-include="messages.html"></div>' +
              '</div>' +
            '</div>';

        element = $compile(html)($rootScope);
        $rootScope.$digest();
        $rootScope.show = false;
        $rootScope.$digest();
        expect(function() {
          $httpBackend.flush();
        }).not.toThrow();
    }));

    it('should not throw if the template is empty',
      inject(function($compile, $rootScope, $templateCache) {
        var html =
            '<div ng-messages="items">' +
              '<div ng-messages-include="messages1.html"></div>' +
              '<div ng-messages-include="messages2.html"></div>' +
            '</div>';

        $templateCache.put('messages1.html', '');
        $templateCache.put('messages2.html', '   ');
        element = $compile(html)($rootScope);
        $rootScope.$digest();

        expect(element.text()).toBe('');
        expect(element.children().length).toBe(0);
        expect(element.contents().length).toBe(2);
      })
    );
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

        expect(messageChildren(element).length).toBe(2);
        expect(s(element.text())).toContain('13');
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

      expect(messageChildren(element).length).toBe(2);
      expect(s(element.text())).toEqual('XZ');

      $rootScope.$apply(function() {
        $rootScope.data.y = {};
      });

      expect(messageChildren(element).length).toBe(3);
      expect(s(element.text())).toEqual('XYZ');
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

      expect(messageChildren(element).length).toBe(2);
      expect(s(element.text())).toEqual('ZZZX');

      $rootScope.$apply(function() {
        $rootScope.data.y = {};
      });

      expect(messageChildren(element).length).toBe(3);
      expect(s(element.text())).toEqual('YYYZZZX');
    }));
  });
});
