'use strict';

describe('angular', function() {
  var element;

  afterEach(function(){
    dealoc(element);
  });

  describe('case', function() {
    it('should change case', function() {
      expect(lowercase('ABC90')).toEqual('abc90');
      expect(manualLowercase('ABC90')).toEqual('abc90');
      expect(uppercase('abc90')).toEqual('ABC90');
      expect(manualUppercase('abc90')).toEqual('ABC90');
    });
  });

  describe("copy", function() {
    it("should return same object", function () {
      var obj = {};
      var arr = [];
      expect(copy({}, obj)).toBe(obj);
      expect(copy([], arr)).toBe(arr);
    });

    it("should copy Date", function() {
      var date = new Date(123);
      expect(copy(date) instanceof Date).toBeTruthy();
      expect(copy(date).getTime()).toEqual(123);
      expect(copy(date) === date).toBeFalsy();
    });

    it("should copy array", function() {
      var src = [1, {name:"value"}];
      var dst = [{key:"v"}];
      expect(copy(src, dst)).toBe(dst);
      expect(dst).toEqual([1, {name:"value"}]);
      expect(dst[1]).toEqual({name:"value"});
      expect(dst[1]).not.toBe(src[1]);
    });

    it('should copy empty array', function() {
      var src = [];
      var dst = [{key: "v"}];
      expect(copy(src, dst)).toEqual([]);
      expect(dst).toEqual([]);
    });

    it("should copy object", function() {
      var src = {a:{name:"value"}};
      var dst = {b:{key:"v"}};
      expect(copy(src, dst)).toBe(dst);
      expect(dst).toEqual({a:{name:"value"}});
      expect(dst.a).toEqual(src.a);
      expect(dst.a).not.toBe(src.a);
    });

    it("should copy primitives", function() {
      expect(copy(null)).toEqual(null);
      expect(copy('')).toBe('');
      expect(copy('lala')).toBe('lala');
      expect(copy(123)).toEqual(123);
      expect(copy([{key:null}])).toEqual([{key:null}]);
    });

    it('should throw an exception if a Scope is being copied', inject(function($rootScope) {
      expect(function() { copy($rootScope.$new()); }).toThrow("Can't copy Window or Scope");
    }));

    it('should throw an exception if a Window is being copied', function() {
      expect(function() { copy(window); }).toThrow("Can't copy Window or Scope");
    });

    it('should throw an exception when source and destination are equivalent', function() {
      var src, dst;
	    src = dst = {key: 'value'};
      expect(function() { copy(src, dst); }).toThrow("Can't copy equivalent objects or arrays");
      src = dst = [2, 4];
      expect(function() { copy(src, dst); }).toThrow("Can't copy equivalent objects or arrays");
    });
  });

  describe('shallow copy', function() {
    it('should make a copy', function() {
      var original = {key:{}};
      var copy = shallowCopy(original);
      expect(copy).toEqual(original);
      expect(copy.key).toBe(original.key);
    });

    it('should not copy $$ properties nor prototype properties', function() {
      var original = {$$some: true, $$: true};
      var clone = {};

      expect(shallowCopy(original, clone)).toBe(clone);
      expect(clone.$$some).toBeUndefined();
      expect(clone.$$).toBeUndefined();
    });
  });

  describe('elementHTML', function() {
    it('should dump element', function() {
      expect(startingTag('<div attr="123">something<span></span></div>')).
        toEqual('<div attr="123">');
    });
  });

  describe('equals', function() {
    it('should return true if same object', function() {
      var o = {};
      expect(equals(o, o)).toEqual(true);
      expect(equals(o, {})).toEqual(true);
      expect(equals(1, '1')).toEqual(false);
      expect(equals(1, '2')).toEqual(false);
    });

    it('should recurse into object', function() {
      expect(equals({}, {})).toEqual(true);
      expect(equals({name:'misko'}, {name:'misko'})).toEqual(true);
      expect(equals({name:'misko', age:1}, {name:'misko'})).toEqual(false);
      expect(equals({name:'misko'}, {name:'misko', age:1})).toEqual(false);
      expect(equals({name:'misko'}, {name:'adam'})).toEqual(false);
      expect(equals(['misko'], ['misko'])).toEqual(true);
      expect(equals(['misko'], ['adam'])).toEqual(false);
      expect(equals(['misko'], ['misko', 'adam'])).toEqual(false);
    });

    it('should ignore $ member variables', function() {
      expect(equals({name:'misko', $id:1}, {name:'misko', $id:2})).toEqual(true);
      expect(equals({name:'misko'}, {name:'misko', $id:2})).toEqual(true);
      expect(equals({name:'misko', $id:1}, {name:'misko'})).toEqual(true);
    });

    it('should ignore functions', function() {
      expect(equals({func: function() {}}, {bar: function() {}})).toEqual(true);
    });

    it('should work well with nulls', function() {
      expect(equals(null, '123')).toBe(false);
      expect(equals('123', null)).toBe(false);

      var obj = {foo:'bar'};
      expect(equals(null, obj)).toBe(false);
      expect(equals(obj, null)).toBe(false);

      expect(equals(null, null)).toBe(true);
    });

    it('should work well with undefined', function() {
      expect(equals(undefined, '123')).toBe(false);
      expect(equals('123', undefined)).toBe(false);

      var obj = {foo:'bar'};
      expect(equals(undefined, obj)).toBe(false);
      expect(equals(obj, undefined)).toBe(false);

      expect(equals(undefined, undefined)).toBe(true);
    });

    it('should treat two NaNs as equal', function() {
      expect(equals(NaN, NaN)).toBe(true);
    });

    it('should compare Scope instances only by identity', inject(function($rootScope) {
      var scope1 = $rootScope.$new(),
          scope2 = $rootScope.$new();

      expect(equals(scope1, scope1)).toBe(true);
      expect(equals(scope1, scope2)).toBe(false);
      expect(equals($rootScope, scope1)).toBe(false);
      expect(equals(undefined, scope1)).toBe(false);
    }));

    it('should compare Window instances only by identity', function() {
      expect(equals(window, window)).toBe(true);
      expect(equals(window, window.parent)).toBe(false);
      expect(equals(window, undefined)).toBe(false);
    });

    it('should compare dates', function() {
      expect(equals(new Date(0), new Date(0))).toBe(true);
      expect(equals(new Date(0), new Date(1))).toBe(false);
      expect(equals(new Date(0), 0)).toBe(false);
      expect(equals(0, new Date(0))).toBe(false);
    });
  });

  describe('size', function() {
    it('should return the number of items in an array', function() {
      expect(size([])).toBe(0);
      expect(size(['a', 'b', 'c'])).toBe(3);
    });

    it('should return the number of properties of an object', function() {
      expect(size({})).toBe(0);
      expect(size({a:1, b:'a', c:noop})).toBe(3);
    });

    it('should return the number of own properties of an object', function() {
      var obj = inherit({protoProp: 'c', protoFn: noop}, {a:1, b:'a', c:noop});

      expect(size(obj)).toBe(5);
      expect(size(obj, true)).toBe(3);
    });

    it('should return the string length', function() {
      expect(size('')).toBe(0);
      expect(size('abc')).toBe(3);
    });

    it('should not rely on length property of an object to determine its size', function() {
      expect(size({length:99})).toBe(1);
    });
  });


  describe('parseKeyValue', function() {
    it('should parse a string into key-value pairs', function() {
      expect(parseKeyValue('')).toEqual({});
      expect(parseKeyValue('simple=pair')).toEqual({simple: 'pair'});
      expect(parseKeyValue('first=1&second=2')).toEqual({first: '1', second: '2'});
      expect(parseKeyValue('escaped%20key=escaped%20value')).
      toEqual({'escaped key': 'escaped value'});
      expect(parseKeyValue('emptyKey=')).toEqual({emptyKey: ''});
      expect(parseKeyValue('flag1&key=value&flag2')).
      toEqual({flag1: true, key: 'value', flag2: true});
    });
  });

  describe('toKeyValue', function() {
    it('should parse key-value pairs into string', function() {
      expect(toKeyValue({})).toEqual('');
      expect(toKeyValue({simple: 'pair'})).toEqual('simple=pair');
      expect(toKeyValue({first: '1', second: '2'})).toEqual('first=1&second=2');
      expect(toKeyValue({'escaped key': 'escaped value'})).
      toEqual('escaped%20key=escaped%20value');
      expect(toKeyValue({emptyKey: ''})).toEqual('emptyKey=');
    });

    it('should parse true values into flags', function() {
      expect(toKeyValue({flag1: true, key: 'value', flag2: true})).toEqual('flag1&key=value&flag2');
    });
  });


  describe('forEach', function() {
    it('should iterate over *own* object properties', function() {
      function MyObj() {
        this.bar = 'barVal';
        this.baz = 'bazVal';
      };
      MyObj.prototype.foo = 'fooVal';

      var obj = new MyObj(),
          log = [];

      forEach(obj, function(value, key) { log.push(key + ':' + value)});

      expect(log).toEqual(['bar:barVal', 'baz:bazVal']);
    });
  });


  describe('sortedKeys', function() {
    it('should collect keys from object', function() {
      expect(sortedKeys({c:0, b:0, a:0})).toEqual(['a', 'b', 'c']);
    });
  });


  describe('encodeUriSegment', function() {
    it('should correctly encode uri segment and not encode chars defined as pchar set in rfc3986',
        function() {
      //don't encode alphanum
      expect(encodeUriSegment('asdf1234asdf')).
        toEqual('asdf1234asdf');

      //don't encode unreserved'
      expect(encodeUriSegment("-_.!~*'() -_.!~*'()")).
        toEqual("-_.!~*'()%20-_.!~*'()");

      //don't encode the rest of pchar'
      expect(encodeUriSegment(':@&=+$, :@&=+$,')).
        toEqual(':@&=+$,%20:@&=+$,');

      //encode '/', ';' and ' ''
      expect(encodeUriSegment('/; /;')).
        toEqual('%2F%3B%20%2F%3B');
    });
  });


  describe('encodeUriQuery', function() {
    it('should correctly encode uri query and not encode chars defined as pchar set in rfc3986',
        function() {
      //don't encode alphanum
      expect(encodeUriQuery('asdf1234asdf')).
        toEqual('asdf1234asdf');

      //don't encode unreserved
      expect(encodeUriQuery("-_.!~*'() -_.!~*'()")).
        toEqual("-_.!~*'()+-_.!~*'()");

      //don't encode the rest of pchar
      expect(encodeUriQuery(':@$, :@$,')).
        toEqual(':@$,+:@$,');

      //encode '&', ';', '=', '+', and '#'
      expect(encodeUriQuery('&;=+# &;=+#')).
        toEqual('%26%3B%3D%2B%23+%26%3B%3D%2B%23');

      //encode ' ' as '+'
      expect(encodeUriQuery('  ')).
        toEqual('++');

      //encode ' ' as '%20' when a flag is used
      expect(encodeUriQuery('  ', true)).
        toEqual('%20%20');
    });
  });


  describe('angularInit', function() {
    var bootstrap;
    var element;

    beforeEach(function() {
      element = {
        getElementById: function (id) {
          return element.getElementById[id] || [];
        },

        getAttribute: function(name) {
          return element[name];
        }
      };
      bootstrap = jasmine.createSpy('bootstrap');
    });


    it('should do nothing when not found', function() {
      angularInit(element, bootstrap);
      expect(bootstrap).not.toHaveBeenCalled();
    });


    it('should look for ngApp directive in id', function() {
      var appElement = jqLite('<div id="ng-app" data-ng-app="ABC"></div>')[0];
      jqLite(document.body).append(appElement);
      angularInit(element, bootstrap);
      expect(bootstrap).toHaveBeenCalledOnceWith(appElement, ['ABC']);
    });


    it('should look for ngApp directive in className', function() {
      var appElement = jqLite('<div data-ng-app="ABC"></div>')[0];
      element.querySelectorAll = function(arg) { return element.querySelectorAll[arg] || []; }
      element.querySelectorAll['.ng\\:app'] = [appElement];
      angularInit(element, bootstrap);
      expect(bootstrap).toHaveBeenCalledOnceWith(appElement, ['ABC']);
    });


    it('should look for ngApp directive using querySelectorAll', function() {
      var appElement = jqLite('<div x-ng-app="ABC"></div>')[0];
      element.querySelectorAll = function(arg) { return element.querySelectorAll[arg] || []; }
      element.querySelectorAll['[ng\\:app]'] = [ appElement ];
      angularInit(element, bootstrap);
      expect(bootstrap).toHaveBeenCalledOnceWith(appElement, ['ABC']);
    });


    it('should bootstrap using class name', function() {
      var appElement = jqLite('<div class="ng-app: ABC;"></div>')[0];
      angularInit(jqLite('<div></div>').append(appElement)[0], bootstrap);
      expect(bootstrap).toHaveBeenCalledOnceWith(appElement, ['ABC']);
    });


    it('should bootstrap anonymously', function() {
      var appElement = jqLite('<div x-ng-app></div>')[0];
      element.querySelectorAll = function(arg) { return element.querySelectorAll[arg] || []; }
      element.querySelectorAll['[x-ng-app]'] = [ appElement ];
      angularInit(element, bootstrap);
      expect(bootstrap).toHaveBeenCalledOnceWith(appElement, []);
    });


    it('should bootstrap anonymously using class only', function() {
      var appElement = jqLite('<div class="ng-app"></div>')[0];
      angularInit(jqLite('<div></div>').append(appElement)[0], bootstrap);
      expect(bootstrap).toHaveBeenCalledOnceWith(appElement, []);
    });


    it('should bootstrap if the annotation is on the root element', function() {
      var appElement = jqLite('<div class="ng-app"></div>')[0];
      angularInit(appElement, bootstrap);
      expect(bootstrap).toHaveBeenCalledOnceWith(appElement, []);
    });
  });


  describe('angular service', function() {
    it('should override services', function() {
      module(function($provide){
        $provide.value('fake', 'old');
        $provide.value('fake', 'new');
      });
      inject(function(fake) {
        expect(fake).toEqual('new');
      });
    });

    it('should inject dependencies specified by $inject and ignore function argument name', function() {
      expect(angular.injector([function($provide){
        $provide.factory('svc1', function() { return 'svc1'; });
        $provide.factory('svc2', ['svc1', function(s) { return 'svc2-' + s; }]);
      }]).get('svc2')).toEqual('svc2-svc1');
    });

  });


  describe('isDate', function() {
    it('should return true for Date object', function() {
      expect(isDate(new Date())).toBe(true);
    });

    it('should return false for non Date objects', function() {
      expect(isDate([])).toBe(false);
      expect(isDate('')).toBe(false);
      expect(isDate(23)).toBe(false);
      expect(isDate({})).toBe(false);
    });
  });

  describe('compile', function() {
    it('should link to existing node and create scope', inject(function($rootScope, $compile) {
      var template = angular.element('<div>{{greeting = "hello world"}}</div>');
      element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect(template.text()).toEqual('hello world');
      expect($rootScope.greeting).toEqual('hello world');
    }));

    it('should link to existing node and given scope', inject(function($rootScope, $compile) {
      var template = angular.element('<div>{{greeting = "hello world"}}</div>');
      element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect(template.text()).toEqual('hello world');
    }));

    it('should link to new node and given scope', inject(function($rootScope, $compile) {
      var template = jqLite('<div>{{greeting = "hello world"}}</div>');

      var compile = $compile(template);
      var templateClone = template.clone();

      element = compile($rootScope, function(clone){
        templateClone = clone;
      });
      $rootScope.$digest();

      expect(template.text()).toEqual('{{greeting = "hello world"}}');
      expect(element.text()).toEqual('hello world');
      expect(element).toEqual(templateClone);
      expect($rootScope.greeting).toEqual('hello world');
    }));

    it('should link to cloned node and create scope', inject(function($rootScope, $compile) {
      var template = jqLite('<div>{{greeting = "hello world"}}</div>');
      element = $compile(template)($rootScope, noop);
      $rootScope.$digest();
      expect(template.text()).toEqual('{{greeting = "hello world"}}');
      expect(element.text()).toEqual('hello world');
      expect($rootScope.greeting).toEqual('hello world');
    }));
  });


  describe('nodeName_', function() {
    it('should correctly detect node name with "namespace" when xmlns is defined', function() {
      var div = jqLite('<div xmlns:ngtest="http://angularjs.org/">' +
                         '<ngtest:foo ngtest:attr="bar"></ngtest:foo>' +
                       '</div>')[0];
      expect(nodeName_(div.childNodes[0])).toBe('NGTEST:FOO');
      expect(div.childNodes[0].getAttribute('ngtest:attr')).toBe('bar');
    });

    if (!msie || msie >= 9) {
      it('should correctly detect node name with "namespace" when xmlns is NOT defined', function() {
        var div = jqLite('<div xmlns:ngtest="http://angularjs.org/">' +
                           '<ngtest:foo ngtest:attr="bar"></ng-test>' +
                         '</div>')[0];
        expect(nodeName_(div.childNodes[0])).toBe('NGTEST:FOO');
        expect(div.childNodes[0].getAttribute('ngtest:attr')).toBe('bar');
      });
    }
  });


  describe('nextUid()', function() {
    it('should return new id per call', function() {
      var seen = {};
      var count = 100;

      while(count--) {
        var current = nextUid();
        expect(current.match(/[\d\w]+/)).toBeTruthy();
        expect(seen[current]).toBeFalsy();
        seen[current] = true;
      }
    });
  });


  describe('version', function() {
    it('version should have full/major/minor/dot/codeName properties', function() {
      expect(version).toBeDefined();
      expect(version.full).toBe('"NG_VERSION_FULL"');
      expect(version.major).toBe("NG_VERSION_MAJOR");
      expect(version.minor).toBe("NG_VERSION_MINOR");
      expect(version.dot).toBe("NG_VERSION_DOT");
      expect(version.codeName).toBe('"NG_VERSION_CODENAME"');
    });
  });

  describe('bootstrap', function() {
    it('should bootstrap app', function(){
      var element = jqLite('<div>{{1+2}}</div>');
      var injector = angular.bootstrap(element);
      expect(injector).toBeDefined();
      expect(element.data('$injector')).toBe(injector);
      dealoc(element);
    });
  });


  describe('startingElementHtml', function(){
    it('should show starting element tag only', function(){
      expect(startingTag('<ng-abc x="2A"><div>text</div></ng-abc>')).
          toBe('<ng-abc x="2A">');
    });
  });

  describe('snake_case', function(){
    it('should convert to snake_case', function() {
      expect(snake_case('ABC')).toEqual('a_b_c');
      expect(snake_case('alanBobCharles')).toEqual('alan_bob_charles');
    });
  });


  describe('fromJson', function() {

    it('should delegate to JSON.parse', function() {
      var spy = spyOn(JSON, 'parse').andCallThrough();

      expect(fromJson('{}')).toEqual({});
      expect(spy).toHaveBeenCalled();
    });
  });


  describe('toJson', function() {

    it('should delegate to JSON.stringify', function() {
      var spy = spyOn(JSON, 'stringify').andCallThrough();

      expect(toJson({})).toEqual('{}');
      expect(spy).toHaveBeenCalled();
    });


    it('should format objects pretty', function() {
      expect(toJson({a: 1, b: 2}, true)).
          toBeOneOf('{\n  "a": 1,\n  "b": 2\n}', '{\n  "a":1,\n  "b":2\n}');
      expect(toJson({a: {b: 2}}, true)).
          toBeOneOf('{\n  "a": {\n    "b": 2\n  }\n}', '{\n  "a":{\n    "b":2\n  }\n}');
    });


    it('should not serialize properties starting with $', function() {
      expect(toJson({$few: 'v', $$some:'value'}, false)).toEqual('{}');
    });


    it('should not serialize $window object', function() {
      expect(toJson(window)).toEqual('"$WINDOW"');
    });


    it('should not serialize $document object', function() {
      expect(toJson(document)).toEqual('"$DOCUMENT"');
    });


    it('should not serialize scope instances', inject(function($rootScope) {
      expect(toJson({key: $rootScope})).toEqual('{"key":"$SCOPE"}');
    }));
  });
});
