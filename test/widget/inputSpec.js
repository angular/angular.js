'use strict';

describe('widget: input', function() {
  var compile = null, element = null, scope = null, defer = null;
  var $compile = null;
  var doc = null;

  beforeEach(inject(function($rootScope, $compile, $browser) {
    scope = $rootScope;
    defer = $browser.defer;
    set$compile($compile);
    element = null;
    compile = function(html, parent) {
      if (parent) {
        parent.html(html);
        element = parent.children();
      } else {
        element = jqLite(html);
      }
      $compile(element)(scope);
      scope.$apply();
      return scope;
    };
  }));

  function set$compile(c) { $compile = c; }

  afterEach(function() {
    dealoc(element);
    dealoc(doc);
  });


  describe('text', function() {
    var form = null,
        formElement = null,
        inputElement = null;

    function createInput(flags){
      var prefix = '';
      forEach(flags, function(value, key){
        prefix += key + '="' + value + '" ';
      });
      formElement = doc = angular.element('<form name="form"><input ' + prefix +
          'type="text" ng:model="name" name="name" ng:change="change()"></form>');
      inputElement = formElement.find('input');
      $compile(doc)(scope);
      form = formElement.inheritedData('$form');
    };


    it('should bind update scope from model', function() {
      createInput();
      expect(scope.form.name.$required).toBe(false);
      scope.name = 'misko';
      scope.$digest();
      expect(inputElement.val()).toEqual('misko');
    });


    it('should require', function() {
      createInput({required:''});
      expect(scope.form.name.$required).toBe(true);
      scope.$digest();
      expect(scope.form.name.$valid).toBe(false);
      scope.name = 'misko';
      scope.$digest();
      expect(scope.form.name.$valid).toBe(true);
    });


    it('should call $destroy on element remove', function() {
      createInput();
      var log = '';
      form.$on('$destroy', function() {
        log += 'destroy;';
      });
      inputElement.remove();
      expect(log).toEqual('destroy;');
    });


    it('should update the model and trim input', function() {
      createInput();
      var log = '';
      scope.change = function() {
        log += 'change();';
      };
      inputElement.val(' a ');
      browserTrigger(inputElement);
      defer.flush();
      expect(scope.name).toEqual('a');
      expect(log).toEqual('change();');
    });


    it('should change non-html5 types to text', inject(function($rootScope, $compile) {
      doc = angular.element('<form name="form"><input type="abc" ng:model="name"></form>');
      $compile(doc)($rootScope);
      expect(doc.find('input').attr('type')).toEqual('text');
    }));


    it('should not change html5 types to text', inject(function($rootScope, $compile) {
      doc = angular.element('<form name="form"><input type="number" ng:model="name"></form>');
      $compile(doc)($rootScope);
      expect(doc.find('input')[0].getAttribute('type')).toEqual('number');
    }));
  });


  describe("input", function() {

    describe("text", function() {
      it('should input-text auto init and listen on keydown/change/input events', function() {
        compile('<input type="text" ng:model="name"/>');

        scope.name = 'Adam';
        scope.$digest();
        expect(element.val()).toEqual("Adam");

        element.val('Shyam');
        browserTrigger(element, 'keydown');
        // keydown event must be deferred
        expect(scope.name).toEqual('Adam');
        defer.flush();
        expect(scope.name).toEqual('Shyam');

        element.val('Kai');
        browserTrigger(element, 'change');
        defer.flush();
        expect(scope.name).toEqual('Kai');

        if (!(msie<=8)) {
          element.val('Lunar');
          browserTrigger(element, 'input');
          defer.flush();
          expect(scope.name).toEqual('Lunar');
        }
      });


      it('should not trigger eval if value does not change', function() {
        compile('<input type="text" ng:model="name" ng:change="count = count + 1" ng:init="count=0"/>');
        scope.name = 'Misko';
        scope.$digest();
        expect(scope.name).toEqual("Misko");
        expect(scope.count).toEqual(0);
        browserTrigger(element, 'keydown');
        defer.flush();
        expect(scope.name).toEqual("Misko");
        expect(scope.count).toEqual(0);
      });


      it('should allow complex reference binding', function() {
        compile('<div>'+
                  '<input type="text" ng:model="obj[\'abc\'].name"/>'+
                '</div>');
        scope.obj = { abc: { name: 'Misko'} };
        scope.$digest();
        expect(scope.$element.find('input').val()).toEqual('Misko');
      });


      describe("ng:format", function() {
        it("should format text", function() {
          compile('<input type="list" ng:model="list"/>');

          scope.list = ['x', 'y', 'z'];
          scope.$digest();
          expect(element.val()).toEqual("x, y, z");

          element.val('1, 2, 3');
          browserTrigger(element);
          defer.flush();
          expect(scope.list).toEqual(['1', '2', '3']);
        });


        it("should render as blank if null", function() {
          compile('<input type="text" ng:model="age" ng:format="number" ng:init="age=null"/>');
          expect(scope.age).toBeNull();
          expect(scope.$element[0].value).toEqual('');
        });


        it("should show incorrect text while number does not parse", function() {
          compile('<input type="number" ng:model="age"/>');
          scope.age = 123;
          scope.$digest();
          expect(scope.$element.val()).toEqual('123');
          try {
            // to allow non-number values, we have to change type so that
            // the browser which have number validation will not interfere with
            // this test. IE8 won't allow it hence the catch.
            scope.$element[0].setAttribute('type', 'text');
          } catch (e){}
          scope.$element.val('123X');
          browserTrigger(scope.$element, 'change');
          defer.flush();
          expect(scope.$element.val()).toEqual('123X');
          expect(scope.age).toEqual(123);
          expect(scope.$element).toBeInvalid();
        });


        it("should not clobber text if model changes due to itself", function() {
          // When the user types 'a,b' the 'a,' stage parses to ['a'] but if the
          // $parseModel function runs it will change to 'a', in essence preventing
          // the user from ever typying ','.
          compile('<input type="list" ng:model="list"/>');

          scope.$element.val('a ');
          browserTrigger(scope.$element, 'change');
          defer.flush();
          expect(scope.$element.val()).toEqual('a ');
          expect(scope.list).toEqual(['a']);

          scope.$element.val('a ,');
          browserTrigger(scope.$element, 'change');
          defer.flush();
          expect(scope.$element.val()).toEqual('a ,');
          expect(scope.list).toEqual(['a']);

          scope.$element.val('a , ');
          browserTrigger(scope.$element, 'change');
          defer.flush();
          expect(scope.$element.val()).toEqual('a , ');
          expect(scope.list).toEqual(['a']);

          scope.$element.val('a , b');
          browserTrigger(scope.$element, 'change');
          defer.flush();
          expect(scope.$element.val()).toEqual('a , b');
          expect(scope.list).toEqual(['a', 'b']);
        });


        it("should come up blank when no value specified", function() {
          compile('<input type="number" ng:model="age"/>');
          scope.$digest();
          expect(scope.$element.val()).toEqual('');
          expect(scope.age).toEqual(null);
        });
      });


      describe("checkbox", function() {
        it("should format booleans", function() {
          compile('<input type="checkbox" ng:model="name" ng:init="name=false"/>');
          expect(scope.name).toBe(false);
          expect(scope.$element[0].checked).toBe(false);
        });


        it('should support type="checkbox" with non-standard capitalization', function() {
          compile('<input type="checkBox" ng:model="checkbox"/>');

          browserTrigger(element);
          expect(scope.checkbox).toBe(true);

          browserTrigger(element);
          expect(scope.checkbox).toBe(false);
        });


        it('should allow custom enumeration', function() {
          compile('<input type="checkbox" ng:model="name" ng:true-value="y" ng:false-value="n">');

          scope.name='y';
          scope.$digest();
          expect(scope.$element[0].checked).toBe(true);

          scope.name='n';
          scope.$digest();
          expect(scope.$element[0].checked).toBe(false);

          scope.name='abc';
          scope.$digest();
          expect(scope.$element[0].checked).toBe(false);

          browserTrigger(element);
          expect(scope.name).toEqual('y');

          browserTrigger(element);
          expect(scope.name).toEqual('n');
        });


        it('should fire ng:change when the value changes', function() {
          compile('<input type="checkbox" ng:model="foo" ng:change="changeFn()">');
          scope.changeFn = jasmine.createSpy('changeFn');
          scope.$digest();
          expect(scope.changeFn).not.toHaveBeenCalledOnce();
          browserTrigger(element);
          expect(scope.changeFn).toHaveBeenCalledOnce();
        });
      });
    });


    it("should process required", inject(function($formFactory) {
      compile('<input type="text" ng:model="price" name="p" required/>', jqLite(document.body));
      expect($formFactory.rootForm.p.$required).toBe(true);
      expect(element.hasClass('ng-invalid')).toBeTruthy();

      scope.price = 'xxx';
      scope.$digest();
      expect(element.hasClass('ng-invalid')).toBeFalsy();

      element.val('');
      browserTrigger(element);
      defer.flush();
      expect(element.hasClass('ng-invalid')).toBeTruthy();
    }));


    it('should allow bindings on ng:required', function() {
      compile('<input type="text" ng:model="price" ng:required="{{required}}"/>',
              jqLite(document.body));
      scope.price = '';
      scope.required = false;
      scope.$digest();
      expect(element).toBeValid();

      scope.price = 'xxx';
      scope.$digest();
      expect(element).toBeValid();

      scope.price = '';
      scope.required =  true;
      scope.$digest();
      expect(element).toBeInvalid();

      element.val('abc');
      browserTrigger(element);
      defer.flush();
      expect(element).toBeValid();
    });


    describe('textarea', function() {
      it("should process textarea", function() {
        compile('<textarea ng:model="name"></textarea>');

        scope.name = 'Adam';
        scope.$digest();
        expect(element.val()).toEqual("Adam");

        element.val('Shyam');
        browserTrigger(element);
        defer.flush();
        expect(scope.name).toEqual('Shyam');

        element.val('Kai');
        browserTrigger(element);
        defer.flush();
        expect(scope.name).toEqual('Kai');
      });
    });


    describe('radio', function() {
      it('should support type="radio"', function() {
        compile('<div>' +
            '<input type="radio" name="r" ng:model="chose" value="A"/>' +
            '<input type="radio" name="r" ng:model="chose" value="B"/>' +
            '<input type="radio" name="r" ng:model="chose" value="C"/>' +
        '</div>');
        var a = element[0].childNodes[0];
        var b = element[0].childNodes[1];
        expect(b.name.split('@')[1]).toEqual('r');
        scope.chose = 'A';
        scope.$digest();
        expect(a.checked).toBe(true);

        scope.chose = 'B';
        scope.$digest();
        expect(a.checked).toBe(false);
        expect(b.checked).toBe(true);
        expect(scope.clicked).not.toBeDefined();

        browserTrigger(a);
        expect(scope.chose).toEqual('A');
      });


      it('should honor model over html checked keyword after', function() {
        compile('<div ng:init="choose=\'C\'">' +
            '<input type="radio" ng:model="choose" value="A""/>' +
            '<input type="radio" ng:model="choose" value="B" checked/>' +
            '<input type="radio" ng:model="choose" value="C"/>' +
        '</div>');

        expect(scope.choose).toEqual('C');
        var inputs = scope.$element.find('input');
        expect(inputs[1].checked).toBe(false);
        expect(inputs[2].checked).toBe(true);
      });


      it('should honor model over html checked keyword before', function() {
        compile('<div ng:init="choose=\'A\'">' +
            '<input type="radio" ng:model="choose" value="A""/>' +
            '<input type="radio" ng:model="choose" value="B" checked/>' +
            '<input type="radio" ng:model="choose" value="C"/>' +
        '</div>');

        expect(scope.choose).toEqual('A');
        var inputs = scope.$element.find('input');
        expect(inputs[0].checked).toBe(true);
        expect(inputs[1].checked).toBe(false);
      });


      it('it should work with value attribute that is data-bound', function(){
        compile(
            '<li>'+
              '<input ng:repeat="item in [\'a\', \'b\']" ' +
              '       type="radio" ng:model="choice" value="{{item}}" name="choice">'+
            '</li>');

        var inputs = scope.$element.find('input');
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(false);

        scope.choice = 'b';
        scope.$digest();
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
      });

      it('should data-bind the value attribute on initialization', inject(
          function($rootScope, $compile){
        $rootScope.choice = 'b';
        $rootScope.items = ['a', 'b'];
        var element = $compile(
            '<li>'+
              '<input ng:repeat="item in items" ' +
              '       type="radio" ng:model="choice" value="{{item}}" name="choice">'+
            '</li>')($rootScope);

        $rootScope.$digest();
        var inputs = element.find('input');
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
      }));
    });


    describe('password', function () {
      it('should not change password type to text', function () {
        compile('<input type="password" ng:model="name" >');
        expect(element.attr('type')).toBe('password');
      });
    });

    describe('number', function(){
      it('should clear number on non-number', inject(function($compile, $rootScope){
        $rootScope.value = 123;
        var element = $compile('<input type="number" ng:model="value" >')($rootScope);
        $rootScope.$digest();
        expect(element.val()).toEqual('123');
        $rootScope.value = undefined;
        $rootScope.$digest();
        expect(element.val()).toEqual('');
      }));
    });


    it('should ignore text widget which have no name', function() {
      compile('<input type="text"/>');
      expect(scope.$element.attr('ng-exception')).toBeFalsy();
      expect(scope.$element.hasClass('ng-exception')).toBeFalsy();
    });


    it('should ignore checkbox widget which have no name', function() {
      compile('<input type="checkbox"/>');
      expect(scope.$element.attr('ng-exception')).toBeFalsy();
      expect(scope.$element.hasClass('ng-exception')).toBeFalsy();
    });


    it('should report error on assignment error', inject(function($log) {
      expect(function() {
        compile('<input type="text" ng:model="throw \'\'">');
      }).toThrow("Syntax Error: Token '''' is an unexpected token at column 7 of the expression [throw ''] starting at [''].");
      $log.error.logs.shift();
    }));
  });


  describe('scope declaration', function() {
    it('should read the declaration from scope', inject(function($rootScope, $compile, $formFactory) {
      var input, formFactory;
      var element = angular.element('<input type="@MyType" ng:model="abc">');
      $rootScope.MyType = function($f, i) {
        input = i;
        formFactory = $f;
      };
      $rootScope.MyType.$inject = ['$formFactory', '$element'];

      $compile(element)($rootScope);

      expect(formFactory).toBe($formFactory);
      expect(input[0]).toBe(element[0]);
    }));

    it('should throw an error of Controller not declared in scope', inject(function($rootScope, $compile) {
      var input, $formFactory;
      var element = angular.element('<input type="@DontExist" ng:model="abc">');
      var error;
      try {
        $compile(element)($rootScope);
        error = 'no error thrown';
      } catch (e) {
        error = e;
      }
      expect(error.message).toEqual("Argument 'DontExist' is not a function, got undefined");
    }));
  });


  describe('text subtypes', function() {

    function itShouldVerify(type, validList, invalidList, params, fn) {
      describe(type, function() {
        forEach(validList, function(value){
          it('should validate "' + value + '"', function() {
            setup(value);
            expect(scope.$element).toBeValid();
          });
        });
        forEach(invalidList, function(value){
          it('should NOT validate "' + value + '"', function() {
            setup(value);
            expect(scope.$element).toBeInvalid();
          });
        });

        function setup(value){
          var html = ['<input type="', type.split(' ')[0], '" '];
          forEach(params||{}, function(value, key){
            html.push(key + '="' + value + '" ');
          });
          html.push('ng:model="value">');
          compile(html.join(''));
          (fn||noop)(scope);
          scope.value = null;
          try {
            // to allow non-number values, we have to change type so that
            // the browser which have number validation will not interfere with
            // this test. IE8 won't allow it hence the catch.
            scope.$element[0].setAttribute('type', 'text');
          } catch (e){}
          if (value != undefined) {
            scope.$element.val(value);
            browserTrigger(element, 'keydown');
            defer.flush();
          }
          scope.$digest();
        }
      });
    }


    itShouldVerify('email', ['a@b.com'], ['a@B.c']);


    itShouldVerify('url', ['http://server:123/path'], ['a@b.c']);


    itShouldVerify('number',
        ['', '1', '12.34', '-4', '+13', '.1'],
        ['x', '12b', '-6', '101'],
        {min:-5, max:100});


    itShouldVerify('integer',
        [null, '', '1', '12', '-4', '+13'],
        ['x', '12b', '-6', '101', '1.', '1.2'],
        {min:-5, max:100});


    itShouldVerify('integer',
        [null, '', '0', '1'],
        ['-1', '2'],
        {min:0, max:1});


    itShouldVerify('text with inlined pattern constraint',
        ['', '000-00-0000', '123-45-6789'],
        ['x000-00-0000x', 'x000-00-0000', '000-00-0000x', 'x'],
        {'ng:pattern':'/^\\d\\d\\d-\\d\\d-\\d\\d\\d\\d$/'});


    itShouldVerify('text with pattern constraint on scope',
        ['', '000-00-0000', '123-45-6789'],
        ['x000-00-0000x', 'x'],
        {'ng:pattern':'regexp'}, function(scope){
          scope.regexp = /^\d\d\d-\d\d-\d\d\d\d$/;
        });


    itShouldVerify('text with ng:minlength limit',
        ['', 'aaa', 'aaaaa', 'aaaaaaaaa'],
        ['a', 'aa'],
        {'ng:minlength': 3});


    itShouldVerify('text with ng:maxlength limit',
        ['', 'a', 'aa', 'aaa'],
        ['aaaa', 'aaaaa', 'aaaaaaaaa'],
        {'ng:maxlength': 3});


    it('should throw an error when scope pattern can\'t be found', inject(function($rootScope, $compile) {
      var el = jqLite('<input ng:model="foo" ng:pattern="fooRegexp">');
      $compile(el)($rootScope);

      el.val('xx');
      browserTrigger(el, 'keydown');
      expect(function() { defer.flush(); }).
        toThrow('Expected fooRegexp to be a RegExp but was undefined');

      dealoc(el);
    }));
  });
});
