describe("widget", function(){
  var compile, element, scope;

  beforeEach(function() {
    scope = null;
    element = null;
    var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget);
    compile = function(html, before) {
      element = jqLite(html);
      scope = compiler.compile(element)(element);
      (before||noop).apply(scope);
      scope.$init();
    };
  });

  afterEach(function(){
    if (element && element.dealoc) element.dealoc();
    expect(size(jqCache)).toEqual(0);
  });

  describe("input", function(){

    describe("text", function(){
      it('should input-text auto init and handle keyup/change events', function(){
        compile('<input type="Text" name="name" value="Misko" ng:change="count = count + 1" ng:init="count=0"/>');
        expect(scope.$get('name')).toEqual("Misko");
        expect(scope.$get('count')).toEqual(0);

        scope.$set('name', 'Adam');
        scope.$eval();
        expect(element.val()).toEqual("Adam");

        element.val('Shyam');
        element.trigger('keyup');
        expect(scope.$get('name')).toEqual('Shyam');
        expect(scope.$get('count')).toEqual(1);

        element.val('Kai');
        element.trigger('change');
        expect(scope.$get('name')).toEqual('Kai');
        expect(scope.$get('count')).toEqual(2);
      });

      describe("ng:format", function(){

        it("should format text", function(){
          compile('<input type="Text" name="list" value="a,b,c" ng:format="list"/>');
          expect(scope.$get('list')).toEqual(['a', 'b', 'c']);

          scope.$set('list', ['x', 'y', 'z']);
          scope.$eval();
          expect(element.val()).toEqual("x, y, z");

          element.val('1, 2, 3');
          element.trigger('keyup');
          expect(scope.$get('list')).toEqual(['1', '2', '3']);
        });

        it("should come up blank if null", function(){
          compile('<input type="text" name="age" ng:format="number"/>', function(){
            scope.age = null;
          });
          expect(scope.age).toBeNull();
          expect(scope.$element[0].value).toEqual('');
        });

        it("should show incorect text while number does not parse", function(){
          compile('<input type="text" name="age" ng:format="number"/>');
          scope.age = 123;
          scope.$eval();
          scope.$element.val('123X');
          scope.$element.trigger('change');
          expect(scope.$element.val()).toEqual('123X');
          expect(scope.age).toEqual(123);
          expect(scope.$element).toBeInvalid();
        });

        it("should clober incorect text if model changes", function(){
          compile('<input type="text" name="age" ng:format="number" value="123X"/>');
          scope.age = 456;
          scope.$eval();
          expect(scope.$element.val()).toEqual('456');
        });

        it("should not clober text if model changes doe to itself", function(){
          compile('<input type="text" name="list" ng:format="list" value="a"/>');

          scope.$element.val('a ');
          scope.$element.trigger('change');
          expect(scope.$element.val()).toEqual('a ');
          expect(scope.list).toEqual(['a']);

          scope.$element.val('a ,');
          scope.$element.trigger('change');
          expect(scope.$element.val()).toEqual('a ,');
          expect(scope.list).toEqual(['a']);

          scope.$element.val('a , ');
          scope.$element.trigger('change');
          expect(scope.$element.val()).toEqual('a , ');
          expect(scope.list).toEqual(['a']);

          scope.$element.val('a , b');
          scope.$element.trigger('change');
          expect(scope.$element.val()).toEqual('a , b');
          expect(scope.list).toEqual(['a', 'b']);
        });

        it("should come up blank when no value specifiend", function(){
          compile('<input type="text" name="age" ng:format="number"/>');
          scope.$eval();
          expect(scope.$element.val()).toEqual('');
          expect(scope.age).toEqual(null);
        });

      });

      describe("checkbox", function(){
        it("should format booleans", function(){
          compile('<input type="checkbox" name="name"/>', function(){
            scope.name = false;
          });
          expect(scope.name).toEqual(false);
          expect(scope.$element[0].checked).toEqual(false);
        });

        it('should support type="checkbox"', function(){
          compile('<input type="checkBox" name="checkbox" checked ng:change="action = true"/>');
          expect(scope.checkbox).toEqual(true);
          click(element);
          expect(scope.checkbox).toEqual(false);
          expect(scope.action).toEqual(true);
          click(element);
          expect(scope.checkbox).toEqual(true);
        });

        it("should use ng:format", function(){
          angularFormatter('testFormat', {
            parse: function(value){
              return value ? "Worked" : "Failed";
            },

            format: function(value) {
              if (value == undefined) return value;
              return value == "Worked";
            }

          });
          compile('<input type="checkbox" name="state" ng:format="testFormat" checked/>');
          expect(scope.state).toEqual("Worked");
          expect(scope.$element[0].checked).toEqual(true);

          click(scope.$element);
          expect(scope.state).toEqual("Failed");
          expect(scope.$element[0].checked).toEqual(false);

          scope.state = "Worked";
          scope.$eval();
          expect(scope.state).toEqual("Worked");
          expect(scope.$element[0].checked).toEqual(true);
        });
      });

      describe("ng:validate", function(){
        it("should process ng:validate", function(){
          compile('<input type="text" name="price" value="abc" ng:validate="number"/>');
          expect(element.hasClass('ng-validation-error')).toBeTruthy();
          expect(element.attr('ng-validation-error')).toEqual('Not a number');

          scope.$set('price', '123');
          scope.$eval();
          expect(element.hasClass('ng-validation-error')).toBeFalsy();
          expect(element.attr('ng-validation-error')).toBeFalsy();

          element.val('x');
          element.trigger('keyup');
          expect(element.hasClass('ng-validation-error')).toBeTruthy();
          expect(element.attr('ng-validation-error')).toEqual('Not a number');
        });

        it('should not blow up for validation with bound attributes', function() {
          compile('<input type="text" name="price" boo="{{abc}}" ng:required/>');
          expect(element.hasClass('ng-validation-error')).toBeTruthy();
          expect(element.attr('ng-validation-error')).toEqual('Required');

          scope.$set('price', '123');
          scope.$eval();
          expect(element.hasClass('ng-validation-error')).toBeFalsy();
          expect(element.attr('ng-validation-error')).toBeFalsy();
        });

        it("should not call validator if undefined/empty", function(){
          var lastValue = "NOT_CALLED";
          angularValidator.myValidator = function(value){lastValue = value;};
          compile('<input type="text" name="url" ng:validate="myValidator"/>');
          expect(lastValue).toEqual("NOT_CALLED");

          scope.url = 'http://server';
          scope.$eval();
          expect(lastValue).toEqual("http://server");

          delete angularValidator.myValidator;
        });
      });
    });

    it("should ignore disabled widgets", function(){
      compile('<input type="text" name="price" ng:required disabled/>');
      expect(element.hasClass('ng-validation-error')).toBeFalsy();
      expect(element.attr('ng-validation-error')).toBeFalsy();
    });

    it("should ignore readonly widgets", function(){
      compile('<input type="text" name="price" ng:required readonly/>');
      expect(element.hasClass('ng-validation-error')).toBeFalsy();
      expect(element.attr('ng-validation-error')).toBeFalsy();
    });

    it("should process ng:required", function(){
      compile('<input type="text" name="price" ng:required/>');
      expect(element.hasClass('ng-validation-error')).toBeTruthy();
      expect(element.attr('ng-validation-error')).toEqual('Required');

      scope.$set('price', 'xxx');
      scope.$eval();
      expect(element.hasClass('ng-validation-error')).toBeFalsy();
      expect(element.attr('ng-validation-error')).toBeFalsy();

      element.val('');
      element.trigger('keyup');
      expect(element.hasClass('ng-validation-error')).toBeTruthy();
      expect(element.attr('ng-validation-error')).toEqual('Required');
    });

    it('should allow conditions on ng:required', function() {
      compile('<input type="text" name="price" ng:required="ineedz"/>');
      scope.$set('ineedz', false);
      scope.$eval();
      expect(element.hasClass('ng-validation-error')).toBeFalsy();
      expect(element.attr('ng-validation-error')).toBeFalsy();

      scope.$set('price', 'xxx');
      scope.$eval();
      expect(element.hasClass('ng-validation-error')).toBeFalsy();
      expect(element.attr('ng-validation-error')).toBeFalsy();

      scope.$set('price', '');
      scope.$set('ineedz', true);
      scope.$eval();
      expect(element.hasClass('ng-validation-error')).toBeTruthy();
      expect(element.attr('ng-validation-error')).toEqual('Required');

      element.val('abc');
      element.trigger('keyup');
      expect(element.hasClass('ng-validation-error')).toBeFalsy();
      expect(element.attr('ng-validation-error')).toBeFalsy();
    });

    it("should process ng:required2", function() {
      compile('<textarea name="name">Misko</textarea>');
      expect(scope.$get('name')).toEqual("Misko");

      scope.$set('name', 'Adam');
      scope.$eval();
      expect(element.val()).toEqual("Adam");

      element.val('Shyam');
      element.trigger('keyup');
      expect(scope.$get('name')).toEqual('Shyam');

      element.val('Kai');
      element.trigger('change');
      expect(scope.$get('name')).toEqual('Kai');
    });

    it('should call ng:change on button click', function(){
      compile('<input type="button" value="Click Me" ng:change="clicked = true"/>');
      click(element);
      expect(scope.$get('clicked')).toEqual(true);
    });

    it('should support button alias', function(){
      compile('<button ng:change="clicked = true">Click Me</button>');
      click(element);
      expect(scope.$get('clicked')).toEqual(true);
    });

    describe('radio', function(){

      it('should support type="radio"', function(){
        compile('<div>' +
            '<input type="radio" name="chose" value="A" ng:change="clicked = 1"/>' +
            '<input type="radio" name="chose" value="B" checked ng:change="clicked = 2"/>' +
            '<input type="radio" name="chose" value="C" ng:change="clicked = 3"/>' +
        '</div>');
        var a = element[0].childNodes[0];
        var b = element[0].childNodes[1];
        expect(b.name.split('@')[1]).toEqual('chose');
        expect(scope.chose).toEqual('B');
        scope.chose = 'A';
        scope.$eval();
        expect(a.checked).toEqual(true);

        scope.chose = 'B';
        scope.$eval();
        expect(a.checked).toEqual(false);
        expect(b.checked).toEqual(true);
        expect(scope.clicked).not.toBeDefined();

        click(a);
        expect(scope.chose).toEqual('A');
        expect(scope.clicked).toEqual(1);
      });

      it('should honor model over html checked keyword after', function(){
        compile('<div>' +
            '<input type="radio" name="choose" value="A""/>' +
            '<input type="radio" name="choose" value="B" checked/>' +
            '<input type="radio" name="choose" value="C"/>' +
        '</div>', function(){
          this.choose = 'C';
        });

        expect(scope.choose).toEqual('C');
      });

      it('should honor model over html checked keyword before', function(){
        compile('<div>' +
            '<input type="radio" name="choose" value="A""/>' +
            '<input type="radio" name="choose" value="B" checked/>' +
            '<input type="radio" name="choose" value="C"/>' +
        '</div>', function(){
          this.choose = 'A';
        });

        expect(scope.choose).toEqual('A');
      });

    });

    it('should support type="select-one"', function(){
      compile(
        '<select name="selection">' +
          '<option>A</option>' +
          '<option selected>B</option>' +
        '</select>');
      expect(scope.selection).toEqual('B');
      scope.selection = 'A';
      scope.$eval();
      expect(scope.selection).toEqual('A');
      expect(element[0].childNodes[0].selected).toEqual(true);
    });

    it('should support type="select-multiple"', function(){
      compile(
        '<select name="selection" multiple>' +
          '<option>A</option>' +
          '<option selected>B</option>' +
        '</select>');
      expect(scope.selection).toEqual(['B']);
      scope.selection = ['A'];
      scope.$eval();
      expect(element[0].childNodes[0].selected).toEqual(true);
    });

    it('should report error on missing field', function(){
      compile('<input type="text"/>');
      expect(element.hasClass('ng-exception')).toBeTruthy();
    });

    it('should report error on assignment error', function(){
      compile('<input type="text" name="throw \'\'" value="x"/>');
      expect(element.hasClass('ng-exception')).toBeTruthy();
    });

    it('should report error on ng:change exception', function(){
      compile('<button ng:change="a-2=x">click</button>');
      click(element);
      expect(element.hasClass('ng-exception')).toBeTruthy();
    });
  });

  describe('ng:switch', function(){
    it('should switch on value change', function(){
      compile('<ng:switch on="select"><div ng:switch-when="1">first:{{name}}</div><div ng:switch-when="2">second:{{name}}</div></ng:switch>');
      expect(element.html()).toEqual('');
      scope.select = 1;
      scope.$eval();
      expect(element.text()).toEqual('first:');
      scope.name="shyam";
      scope.$eval();
      expect(element.text()).toEqual('first:shyam');
      scope.select = 2;
      scope.$eval();
      expect(element.text()).toEqual('second:shyam');
      scope.name = 'misko';
      scope.$eval();
      expect(element.text()).toEqual('second:misko');
    });

    it("should match urls", function(){
      var scope = angular.compile('<ng:switch on="url" using="route:params"><div ng:switch-when="/Book/:name">{{params.name}}</div></ng:switch>');
      scope.url = '/Book/Moby';
      scope.$init();
      expect(scope.$element.text()).toEqual('Moby');
    });

    it("should match sandwich ids", function(){
      var scope = {};
      var match = angular.widget('NG:SWITCH').route.call(scope, '/a/123/b', '/a/:id');
      expect(match).toBeFalsy();
    });

    it('should call init on switch', function(){
      var scope = angular.compile('<ng:switch on="url" change="name=\'works\'"><div ng:switch-when="a">{{name}}</div></ng:switch>');
      var cleared = false;
      scope.url = 'a';
      scope.$invalidWidgets = {clearOrphans: function(){
        cleared = true;
      }};
      scope.$init();
      expect(scope.name).toEqual(undefined);
      expect(scope.$element.text()).toEqual('works');
      expect(cleared).toEqual(true);
    });
  });

  describe('ng:include', function(){
    it('should include on external file', function() {
      var element = jqLite('<ng:include src="url" scope="childScope"></ng:include>');
      var scope = angular.compile(element);
      scope.childScope = createScope();
      scope.childScope.name = 'misko';
      scope.url = 'myUrl';
      scope.$xhr.cache.data.myUrl = {value:'{{name}}'};
      scope.$init();
      expect(element.text()).toEqual('misko');
    });
  });
});

