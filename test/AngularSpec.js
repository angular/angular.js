'use strict';

describe('angular', function(){
  describe('case', function(){
    it('should change case', function(){
      expect(lowercase('ABC90')).toEqual('abc90');
      expect(manualLowercase('ABC90')).toEqual('abc90');
      expect(uppercase('abc90')).toEqual('ABC90');
      expect(manualUppercase('abc90')).toEqual('ABC90');
    });
  });

  describe("copy", function(){
    it("should return same object", function (){
      var obj = {};
      var arr = [];
      expect(copy({}, obj)).toBe(obj);
      expect(copy([], arr)).toBe(arr);
    });

    it("should copy Date", function(){
      var date = new Date(123);
      expect(copy(date) instanceof Date).toBeTruthy();
      expect(copy(date).getTime()).toEqual(123);
      expect(copy(date) === date).toBeFalsy();
    });

    it("should copy array", function(){
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

    it("should copy object", function(){
      var src = {a:{name:"value"}};
      var dst = {b:{key:"v"}};
      expect(copy(src, dst)).toBe(dst);
      expect(dst).toEqual({a:{name:"value"}});
      expect(dst.a).toEqual(src.a);
      expect(dst.a).not.toBe(src.a);
    });

    it("should copy primitives", function(){
      expect(copy(null)).toEqual(null);
      expect(copy('')).toBe('');
      expect(copy('lala')).toBe('lala');
      expect(copy(123)).toEqual(123);
      expect(copy([{key:null}])).toEqual([{key:null}]);
    });
  });

  describe('equals', function(){
    it('should return true if same object', function(){
      var o = {};
      expect(equals(o, o)).toEqual(true);
      expect(equals(1, '1')).toEqual(true);
      expect(equals(1, '2')).toEqual(false);
    });

    it('should recurse into object', function(){
      expect(equals({}, {})).toEqual(true);
      expect(equals({name:'misko'}, {name:'misko'})).toEqual(true);
      expect(equals({name:'misko', age:1}, {name:'misko'})).toEqual(false);
      expect(equals({name:'misko'}, {name:'misko', age:1})).toEqual(false);
      expect(equals({name:'misko'}, {name:'adam'})).toEqual(false);
      expect(equals(['misko'], ['misko'])).toEqual(true);
      expect(equals(['misko'], ['adam'])).toEqual(false);
      expect(equals(['misko'], ['misko', 'adam'])).toEqual(false);
    });

    it('should ignore $ member variables', function(){
      expect(equals({name:'misko', $id:1}, {name:'misko', $id:2})).toEqual(true);
      expect(equals({name:'misko'}, {name:'misko', $id:2})).toEqual(true);
      expect(equals({name:'misko', $id:1}, {name:'misko'})).toEqual(true);
    });

    it('should ignore functions', function(){
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


  describe ('rngScript', function() {
    it('should match angular.js', function() {
      expect('angular.js'.match(rngScript)).not.toBeNull();
      expect('../angular.js'.match(rngScript)).not.toBeNull();
      expect('foo/angular.js'.match(rngScript)).not.toBeNull();

      expect('foo.js'.match(rngScript)).toBeNull();
      expect('foo/foo.js'.match(rngScript)).toBeNull();
      expect('my-angular-app.js'.match(rngScript)).toBeNull();
      expect('foo/../my-angular-app.js'.match(rngScript)).toBeNull();
    });

    it('should match angular.min.js', function() {
      expect('angular.min.js'.match(rngScript)).not.toBeNull();
      expect('../angular.min.js'.match(rngScript)).not.toBeNull();
      expect('foo/angular.min.js'.match(rngScript)).not.toBeNull();

      expect('my-angular-app.min.js'.match(rngScript)).toBeNull();
      expect('foo/../my-angular-app.min.js'.match(rngScript)).toBeNull();
    });

    it('should match angular-bootstrap.js', function() {
      expect('angular-bootstrap.js'.match(rngScript)).not.toBeNull();
      expect('../angular-bootstrap.js'.match(rngScript)).not.toBeNull();
      expect('foo/angular-bootstrap.js'.match(rngScript)).not.toBeNull();

      expect('my-angular-app-bootstrap.js'.match(rngScript)).toBeNull();
      expect('foo/../my-angular-app-bootstrap.js'.match(rngScript)).toBeNull();
    });

    it('should match angular-0.9.0.js', function() {
      expect('angular-0.9.0.js'.match(rngScript)).not.toBeNull();
      expect('../angular-0.9.0.js'.match(rngScript)).not.toBeNull();
      expect('foo/angular-0.9.0.js'.match(rngScript)).not.toBeNull();

      expect('my-angular-app-0.9.0.js'.match(rngScript)).toBeNull();
      expect('foo/../my-angular-app-0.9.0.js'.match(rngScript)).toBeNull();
    });

    it('should match angular-0.9.0.min.js', function() {
      expect('angular-0.9.0.min.js'.match(rngScript)).not.toBeNull();
      expect('../angular-0.9.0.min.js'.match(rngScript)).not.toBeNull();
      expect('foo/angular-0.9.0.min.js'.match(rngScript)).not.toBeNull();

      expect('my-angular-app-0.9.0.min.js'.match(rngScript)).toBeNull();
      expect('foo/../my-angular-app-0.9.0.min.js'.match(rngScript)).toBeNull();
    });

    it('should match angular-0.9.0-de0a8612.js', function() {
      expect('angular-0.9.0-de0a8612.js'.match(rngScript)).not.toBeNull();
      expect('../angular-0.9.0-de0a8612.js'.match(rngScript)).not.toBeNull();
      expect('foo/angular-0.9.0-de0a8612.js'.match(rngScript)).not.toBeNull();

      expect('my-angular-app-0.9.0-de0a8612.js'.match(rngScript)).toBeNull();
      expect('foo/../my-angular-app-0.9.0-de0a8612.js'.match(rngScript)).toBeNull();
    });

    it('should match angular-0.9.0-de0a8612.min.js', function() {
      expect('angular-0.9.0-de0a8612.min.js'.match(rngScript)).not.toBeNull();
      expect('../angular-0.9.0-de0a8612.min.js'.match(rngScript)).not.toBeNull();
      expect('foo/angular-0.9.0-de0a8612.min.js'.match(rngScript)).not.toBeNull();

      expect('my-angular-app-0.9.0-de0a8612.min.js'.match(rngScript)).toBeNull();
      expect('foo/../my-angular-app-0.9.0-de0a8612.min.js'.match(rngScript)).toBeNull();
    });

    it('should match angular-scenario.js', function() {
      expect('angular-scenario.js'.match(rngScript)).not.toBeNull();
      expect('angular-scenario.min.js'.match(rngScript)).not.toBeNull();
      expect('../angular-scenario.js'.match(rngScript)).not.toBeNull();
      expect('foo/angular-scenario.min.js'.match(rngScript)).not.toBeNull();
    });

    it('should match angular-scenario-0.9.0(.min).js', function() {
      expect('angular-scenario-0.9.0.js'.match(rngScript)).not.toBeNull();
      expect('angular-scenario-0.9.0.min.js'.match(rngScript)).not.toBeNull();
      expect('../angular-scenario-0.9.0.js'.match(rngScript)).not.toBeNull();
      expect('foo/angular-scenario-0.9.0.min.js'.match(rngScript)).not.toBeNull();
    });

    it('should match angular-scenario-0.9.0-de0a8612(.min).js', function() {
      expect('angular-scenario-0.9.0-de0a8612.js'.match(rngScript)).not.toBeNull();
      expect('angular-scenario-0.9.0-de0a8612.min.js'.match(rngScript)).not.toBeNull();
      expect('../angular-scenario-0.9.0-de0a8612.js'.match(rngScript)).not.toBeNull();
      expect('foo/angular-scenario-0.9.0-de0a8612.min.js'.match(rngScript)).not.toBeNull();
    });
  });


  describe('angularJsConfig', function() {
    it('should find angular.js script tag and config', function() {
      var doc = { getElementsByTagName: function(tagName) {
        expect(tagName).toEqual('script');
        return [{nodeName: 'SCRIPT', src: 'random.js'},
                {nodeName: 'SCRIPT', src: 'angular.js'},
                {nodeName: 'SCRIPT', src: 'my-angular-app.js'}];
      }
      };

      expect(angularJsConfig(doc)).toEqual({base_url: '',
        ie_compat: 'angular-ie-compat.js',
        ie_compat_id: 'ng-ie-compat'});
    });


    it('should extract angular config from the ng: attributes',
        function() {
      var doc = { getElementsByTagName: function(tagName) {
        expect(lowercase(tagName)).toEqual('script');
        return [{nodeName: 'SCRIPT',
          src: 'angularjs/angular.js',
          attributes: [{name: 'ng:autobind', value:'elementIdToCompile'},
                       {name: 'ng:css', value: 'css/my_custom_angular.css'},
                       {name: 'ng:ie-compat', value: 'myjs/angular-ie-compat.js'},
                       {name: 'ng:ie-compat-id', value: 'ngcompat'}] }];
      }};

      expect(angularJsConfig(doc)).toEqual({base_url: 'angularjs/',
        autobind: 'elementIdToCompile',
        css: 'css/my_custom_angular.css',
        ie_compat: 'myjs/angular-ie-compat.js',
        ie_compat_id: 'ngcompat'});
    });


    it('should extract angular config and default autobind value to true if present', function() {
      var doc = { getElementsByTagName: function(tagName) {
        expect(lowercase(tagName)).toEqual('script');
        return [{nodeName: 'SCRIPT',
          src: 'angularjs/angular.js',
          attributes: [{name: 'ng:autobind', value:undefined}]}];
      }};

      expect(angularJsConfig(doc)).toEqual({autobind: true,
                                            base_url: 'angularjs/',
                                            ie_compat_id: 'ng-ie-compat',
                                            ie_compat: 'angularjs/angular-ie-compat.js'});
    });


    it('should extract angular autobind config from the script hashpath attributes', function() {
      var doc = { getElementsByTagName: function(tagName) {
        expect(lowercase(tagName)).toEqual('script');
        return [{nodeName: 'SCRIPT',
          src: 'angularjs/angular.js#autobind'}];
      }};

      expect(angularJsConfig(doc)).toEqual({base_url: 'angularjs/',
        autobind: true,
        ie_compat: 'angularjs/angular-ie-compat.js',
        ie_compat_id: 'ng-ie-compat'});
    });


    it('should extract autobind config with element id from the script hashpath', function() {
      var doc = { getElementsByTagName: function(tagName) {
        expect(lowercase(tagName)).toEqual('script');
        return [{nodeName: 'SCRIPT',
          src: 'angularjs/angular.js#autobind=foo'}];
      }};

      expect(angularJsConfig(doc)).toEqual({base_url: 'angularjs/',
        autobind: 'foo',
        ie_compat: 'angularjs/angular-ie-compat.js',
        ie_compat_id: 'ng-ie-compat'});
    });


    it("should default to versioned ie-compat file if angular file is versioned", function() {
      var doc = { getElementsByTagName: function(tagName) {
        expect(lowercase(tagName)).toEqual('script');
        return [{nodeName: 'SCRIPT',
          src: 'js/angular-0.9.0.js'}];
      }};

      expect(angularJsConfig(doc)).toEqual({base_url: 'js/',
        ie_compat: 'js/angular-ie-compat-0.9.0.js',
        ie_compat_id: 'ng-ie-compat'});
    });


    it("should default to versioned ie-compat file if angular file is versioned and minified", function() {
      var doc = { getElementsByTagName: function(tagName) {
        expect(lowercase(tagName)).toEqual('script');
        return [{nodeName: 'SCRIPT',
          src: 'js/angular-0.9.0-cba23f00.min.js'}];
      }};

      expect(angularJsConfig(doc)).toEqual({base_url: 'js/',
        ie_compat: 'js/angular-ie-compat-0.9.0-cba23f00.js',
        ie_compat_id: 'ng-ie-compat'});
    });
  });


  describe('angularInit', function() {
    var dom;

    beforeEach(function() {
      dom = jqLite('<div foo="{{1+2}}">{{2+3}}' +
                     '<div id="child" bar="{{3+4}}">{{4+5}}</div>' +
                   '</div>')[0];
    });


    afterEach(function() {
      dealoc(dom);
    });


    it('should not compile anything if autobind is missing or false', function() {
      angularInit({}, dom);
      expect(sortedHtml(dom)).toEqual('<div foo="{{1+2}}">{{2+3}}' +
                                        '<div bar="{{3+4}}" id="child">{{4+5}}</div>' +
                                      '</div>');
    });


    it('should compile the document if autobind is true', function() {
      angularInit({autobind: true}, dom);
      expect(sortedHtml(dom)).toEqual('<div foo="3" ng:bind-attr="{"foo":"{{1+2}}"}">' +
                                        '<span ng:bind="2+3">5</span>' +
                                        '<div bar="7" id="child" ng:bind-attr="{"bar":"{{3+4}}"}">'+
                                          '<span ng:bind="4+5">9</span>' +
                                        '</div>' +
                                      '</div>');
    });


    it('should compile only the element specified via autobind', function() {
      dom.getElementById = function() {
        return this.childNodes[1];
      };


      angularInit({autobind: 'child'}, dom);

      expect(sortedHtml(dom)).toEqual('<div foo="{{1+2}}">{{2+3}}' +
                                        '<div bar="7" id="child" ng:bind-attr="{"bar":"{{3+4}}"}">'+
                                          '<span ng:bind="4+5">9</span>' +
                                        '</div>' +
                                      '</div>');
    });


    xit('should add custom css when specified via css', function() {
      //TODO
    });
  });


  describe('angular service', function() {
    it('should override services', function() {
      var scope = createScope();
      angular.service('fake', function() { return 'old'; });
      angular.service('fake', function() { return 'new'; });

      expect(scope.$service('fake')).toEqual('new');
    });

    it('should not preserve properties on override', function() {
      angular.service('fake', {$one: true}, {$two: true}, {three: true});
      var result = angular.service('fake', {$four: true});

      expect(result.$one).toBeUndefined();
      expect(result.$two).toBeUndefined();
      expect(result.three).toBeUndefined();
      expect(result.$four).toBe(true);
    });

    it('should not preserve non-angular properties on override', function() {
      angular.service('fake', {one: true}, {two: true});
      var result = angular.service('fake', {third: true});

      expect(result.one).not.toBeDefined();
      expect(result.two).not.toBeDefined();
      expect(result.third).toBeTruthy();
    });

    it('should inject dependencies specified by $inject', function() {
	  angular.service('svc1', function() { return 'svc1'; });
	  angular.service('svc2', function(svc1) { return 'svc2-' + svc1; }, {$inject: ['svc1']});
	  expect(angular.scope().$service('svc2')).toEqual('svc2-svc1');
    });

    it('should inject dependencies specified by $inject and ignore function argument name', function() {
	  angular.service('svc1', function() { return 'svc1'; });
	  angular.service('svc2', function(foo) { return 'svc2-' + foo; }, {$inject: ['svc1']});
	  expect(angular.scope().$service('svc2')).toEqual('svc2-svc1');
    });

    it('should inject infered dependencies when $inject is missing', function() {
	  angular.service('svc1', function() { return 'svc1'; });
	  angular.service('svc2', function(svc1) { return 'svc2-' + svc1; });
	  expect(angular.scope().$service('svc2')).toEqual('svc2-svc1');
    });

    it('should eagerly instantiate a service if $eager is true', function() {
      var log = [];
      angular.service('svc1', function() { log.push('svc1'); }, {$eager: true});
      angular.scope();
      expect(log).toEqual(['svc1']);
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

  describe('compile', function(){
    var scope, template;

    afterEach(function(){
      dealoc(scope);
    });

    it('should link to existing node and create scope', function(){
      template = angular.element('<div>{{greeting = "hello world"}}</div>');
      scope = angular.compile(template)();
      expect(template.text()).toEqual('hello world');
      expect(scope.greeting).toEqual('hello world');
    });

    it('should link to existing node and given scope', function(){
      scope = angular.scope();
      template = angular.element('<div>{{greeting = "hello world"}}</div>');
      angular.compile(template)(scope);
      expect(template.text()).toEqual('hello world');
      expect(scope).toEqual(scope);
    });

    it('should link to new node and given scope', function(){
      scope = angular.scope();
      template = jqLite('<div>{{greeting = "hello world"}}</div>');

      var templateFn = angular.compile(template);
      var templateClone = template.clone();

      templateFn(scope, function(clone){
        templateClone = clone;
      });

      expect(template.text()).toEqual('');
      expect(scope.$element.text()).toEqual('hello world');
      expect(scope.$element).toEqual(templateClone);
      expect(scope.greeting).toEqual('hello world');
    });

    it('should link to cloned node and create scope', function(){
      scope = angular.scope();
      template = jqLite('<div>{{greeting = "hello world"}}</div>');
      angular.compile(template)(scope, noop);
      expect(template.text()).toEqual('');
      expect(scope.$element.text()).toEqual('hello world');
      expect(scope.greeting).toEqual('hello world');
    });
  });


  describe('nodeName_', function() {
    it('should correctly detect node name with "namespace" when xmlns is defined', function() {
      var div = jqLite('<div xmlns:ngtest="http://angularjs.org/">' +
                         '<ngtest:foo ngtest:attr="bar"></ng:test>' +
                       '</div>')[0];
      expect(nodeName_(div.childNodes[0])).toBe('NGTEST:FOO');
      expect(div.childNodes[0].getAttribute('ngtest:attr')).toBe('bar');
    });

    if (!msie || msie >= 9) {
      it('should correctly detect node name with "namespace" when xmlns is NOT defined', function() {
        var div = jqLite('<div xmlns:ngtest="http://angularjs.org/">' +
                           '<ngtest:foo ngtest:attr="bar"></ng:test>' +
                         '</div>')[0];
        expect(nodeName_(div.childNodes[0])).toBe('NGTEST:FOO');
        expect(div.childNodes[0].getAttribute('ngtest:attr')).toBe('bar');
      });
    }
  });


  describe('nextUid()', function(){
    it('should return new id per call', function(){
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
  })
});
