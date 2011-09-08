'use strict';

describe('widget: input', function(){
  var compile = null, element = null, scope = null, defer = null;
  var doc = null;

  beforeEach(function() {
    scope = null;
    element = null;
    compile = function(html, parent) {
      if (parent) {
        parent.html(html);
        element = parent.children();
      } else {
        element = jqLite(html);
      }
      scope = angular.compile(element)();
      scope.$apply();
      defer = scope.$service('$browser').defer;
      return scope;
    };
  });

  afterEach(function(){
    dealoc(element);
    dealoc(doc);
  });


  describe('text', function(){
    var scope = null,
        form = null,
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
      scope = angular.compile(doc)();
      form = formElement.inheritedData('$form');
    };


    it('should bind update scope from model', function(){
      createInput();
      expect(scope.form.name.$required).toBe(false);
      scope.name = 'misko';
      scope.$digest();
      expect(inputElement.val()).toEqual('misko');
    });


    it('should require', function(){
      createInput({required:''});
      expect(scope.form.name.$required).toBe(true);
      scope.$digest();
      expect(scope.form.name.$valid).toBe(false);
      scope.name = 'misko';
      scope.$digest();
      expect(scope.form.name.$valid).toBe(true);
    });


    it('should call $destroy on element remove', function(){
      createInput();
      var log = '';
      form.$on('$destroy', function(){
        log += 'destroy;';
      });
      inputElement.remove();
      expect(log).toEqual('destroy;');
    });


    it('should update the model and trim input', function(){
      createInput();
      var log = '';
      scope.change = function(){
        log += 'change();';
      };
      inputElement.val(' a ');
      browserTrigger(inputElement);
      scope.$service('$browser').defer.flush();
      expect(scope.name).toEqual('a');
      expect(log).toEqual('change();');
    });


    it('should change non-html5 types to text', function(){
      doc = angular.element('<form name="form"><input type="abc" ng:model="name"></form>');
      scope = angular.compile(doc)();
      expect(doc.find('input').attr('type')).toEqual('text');
    });


    it('should not change html5 types to text', function(){
      doc = angular.element('<form name="form"><input type="number" ng:model="name"></form>');
      scope = angular.compile(doc)();
      expect(doc.find('input')[0].getAttribute('type')).toEqual('number');
    });
  });


  describe("input", function(){

    describe("text", function(){
      it('should input-text auto init and handle keydown/change events', function(){
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
        scope.$service('$browser').defer.flush();
        expect(scope.name).toEqual('Kai');
      });


      it('should not trigger eval if value does not change', function(){
        compile('<input type="text" ng:model="name" ng:change="count = count + 1" ng:init="count=0"/>');
        scope.name = 'Misko';
        scope.$digest();
        expect(scope.name).toEqual("Misko");
        expect(scope.count).toEqual(0);
        browserTrigger(element, 'keydown');
        scope.$service('$browser').defer.flush();
        expect(scope.name).toEqual("Misko");
        expect(scope.count).toEqual(0);
      });


      it('should allow complex reference binding', function(){
        compile('<div>'+
                  '<input type="text" ng:model="obj[\'abc\'].name"/>'+
                '</div>');
        scope.obj = { abc: { name: 'Misko'} };
        scope.$digest();
        expect(scope.$element.find('input').val()).toEqual('Misko');
      });


      describe("ng:format", function(){
        it("should format text", function(){
          compile('<input type="list" ng:model="list"/>');

          scope.list = ['x', 'y', 'z'];
          scope.$digest();
          expect(element.val()).toEqual("x, y, z");

          element.val('1, 2, 3');
          browserTrigger(element);
          scope.$service('$browser').defer.flush();
          expect(scope.list).toEqual(['1', '2', '3']);
        });


        it("should render as blank if null", function(){
          compile('<input type="text" ng:model="age" ng:format="number" ng:init="age=null"/>');
          expect(scope.age).toBeNull();
          expect(scope.$element[0].value).toEqual('');
        });


        it("should show incorrect text while number does not parse", function(){
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
          scope.$service('$browser').defer.flush();
          expect(scope.$element.val()).toEqual('123X');
          expect(scope.age).toEqual(123);
          expect(scope.$element).toBeInvalid();
        });


        it("should not clobber text if model changes due to itself", function(){
          // When the user types 'a,b' the 'a,' stage parses to ['a'] but if the
          // $parseModel function runs it will change to 'a', in essence preventing
          // the user from ever typying ','.
          compile('<input type="list" ng:model="list"/>');

          scope.$element.val('a ');
          browserTrigger(scope.$element, 'change');
          scope.$service('$browser').defer.flush();
          expect(scope.$element.val()).toEqual('a ');
          expect(scope.list).toEqual(['a']);

          scope.$element.val('a ,');
          browserTrigger(scope.$element, 'change');
          scope.$service('$browser').defer.flush();
          expect(scope.$element.val()).toEqual('a ,');
          expect(scope.list).toEqual(['a']);

          scope.$element.val('a , ');
          browserTrigger(scope.$element, 'change');
          scope.$service('$browser').defer.flush();
          expect(scope.$element.val()).toEqual('a , ');
          expect(scope.list).toEqual(['a']);

          scope.$element.val('a , b');
          browserTrigger(scope.$element, 'change');
          scope.$service('$browser').defer.flush();
          expect(scope.$element.val()).toEqual('a , b');
          expect(scope.list).toEqual(['a', 'b']);
        });


        it("should come up blank when no value specified", function(){
          compile('<input type="number" ng:model="age"/>');
          scope.$digest();
          expect(scope.$element.val()).toEqual('');
          expect(scope.age).toEqual(null);
        });
      });


      describe("checkbox", function(){
        it("should format booleans", function(){
          compile('<input type="checkbox" ng:model="name" ng:init="name=false"/>');
          expect(scope.name).toBe(false);
          expect(scope.$element[0].checked).toBe(false);
        });


        it('should support type="checkbox" with non-standard capitalization', function(){
          compile('<input type="checkBox" ng:model="checkbox"/>');

          browserTrigger(element);
          expect(scope.checkbox).toBe(true);

          browserTrigger(element);
          expect(scope.checkbox).toBe(false);
        });


        it('should allow custom enumeration', function(){
          compile('<input type="checkbox" ng:model="name" true-value="ano" false-value="nie"/>');

          scope.name='ano';
          scope.$digest();
          expect(scope.$element[0].checked).toBe(true);

          scope.name='nie';
          scope.$digest();
          expect(scope.$element[0].checked).toBe(false);

          scope.name='abc';
          scope.$digest();
          expect(scope.$element[0].checked).toBe(false);

          browserTrigger(element);
          expect(scope.name).toEqual('ano');

          browserTrigger(element);
          expect(scope.name).toEqual('nie');
        });
      });
    });


    it("should process required", function(){
      compile('<input type="text" ng:model="price" name="p" required/>', jqLite(document.body));
      expect(scope.$service('$formFactory').rootForm.p.$required).toBe(true);
      expect(element.hasClass('ng-invalid')).toBeTruthy();

      scope.price = 'xxx';
      scope.$digest();
      expect(element.hasClass('ng-invalid')).toBeFalsy();

      element.val('');
      browserTrigger(element);
      scope.$service('$browser').defer.flush();
      expect(element.hasClass('ng-invalid')).toBeTruthy();
    });


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
      scope.$service('$browser').defer.flush();
      expect(element).toBeValid();
    });


    describe('textarea', function(){
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


    describe('radio', function(){
      it('should support type="radio"', function(){
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


      it('should honor model over html checked keyword after', function(){
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


      it('should honor model over html checked keyword before', function(){
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
    });


    it('should ignore text widget which have no name', function(){
      compile('<input type="text"/>');
      expect(scope.$element.attr('ng-exception')).toBeFalsy();
      expect(scope.$element.hasClass('ng-exception')).toBeFalsy();
    });


    it('should ignore checkbox widget which have no name', function(){
      compile('<input type="checkbox"/>');
      expect(scope.$element.attr('ng-exception')).toBeFalsy();
      expect(scope.$element.hasClass('ng-exception')).toBeFalsy();
    });


    it('should report error on assignment error', function(){
      expect(function(){
        compile('<input type="text" ng:model="throw \'\'">');
      }).toThrow("Syntax Error: Token '''' is an unexpected token at column 7 of the expression [throw ''] starting at [''].");
      $logMock.error.logs.shift();
    });
  });


  describe('scope declaration', function(){
    it('should read the declaration from scope', function(){
      var input, $formFactory;
      element = angular.element('<input type="@MyType" ng:model="abc">');
      scope = angular.scope();
      scope.MyType = function($f, i) {
        input = i;
        $formFactory = $f;
      };
      scope.MyType.$inject = ['$formFactory'];

      angular.compile(element)(scope);

      expect($formFactory).toBe(scope.$service('$formFactory'));
      expect(input[0]).toBe(element[0]);
    });

    it('should throw an error of Cntoroller not declared in scope', function() {
      var input, $formFactory;
      element = angular.element('<input type="@DontExist" ng:model="abc">');
      var error;
      try {
        scope = angular.scope();
        angular.compile(element)(scope);
        error = 'no error thrown';
      } catch (e) {
        error = e;
      }
      expect(error.message).toEqual("Argument 'DontExist' is not a function, got undefined");
    });
  });


  describe('text subtypes', function(){

    function itShouldVerify(type, validList, invalidList, params, fn) {
      describe(type, function(){
        forEach(validList, function(value){
          it('should validate "' + value + '"', function(){
            setup(value);
            expect(scope.$element).toBeValid();
          });
        });
        forEach(invalidList, function(value){
          it('should NOT validate "' + value + '"', function(){
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
            scope.$service('$browser').defer.flush();
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


    itShouldVerify('text with inlined pattern contraint',
        ['', '000-00-0000', '123-45-6789'],
        ['x000-00-0000x', 'x'],
        {'ng:pattern':'/^\\d\\d\\d-\\d\\d-\\d\\d\\d\\d$/'});


    itShouldVerify('text with pattern constraint on scope',
        ['', '000-00-0000', '123-45-6789'],
        ['x000-00-0000x', 'x'],
        {'ng:pattern':'regexp'}, function(scope){
          scope.regexp = /^\d\d\d-\d\d-\d\d\d\d$/;
        });


    it('should throw an error when scope pattern can\'t be found', function() {
      var el = jqLite('<input ng:model="foo" ng:pattern="fooRegexp">'),
          scope = angular.compile(el)();

      el.val('xx');
      browserTrigger(el, 'keydown');
      expect(function() { scope.$service('$browser').defer.flush(); }).
        toThrow('Expected fooRegexp to be a RegExp but was undefined');

      dealoc(el);
    });
  });
});
