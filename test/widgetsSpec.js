describe("widget", function(){
  var compile, element, scope;

  beforeEach(function() {
    scope = null;
    element = null;
    var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget);
    compile = function(html, before, parent) {
      element = jqLite(html);
      scope = compiler.compile(element)(element);
      (before||noop).apply(scope);
      if (parent) parent.append(element);
      scope.$init();
      return scope;
    };
  });

  afterEach(function(){
    dealoc(element);
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
        browserTrigger(element, 'keyup');
        expect(scope.$get('name')).toEqual('Shyam');
        expect(scope.$get('count')).toEqual(1);

        element.val('Kai');
        browserTrigger(element, 'change');
        expect(scope.$get('name')).toEqual('Kai');
        expect(scope.$get('count')).toEqual(2);
      });
      
      it('should not trigger eval if value does not change', function(){
        compile('<input type="Text" name="name" value="Misko" ng:change="count = count + 1" ng:init="count=0"/>');
        expect(scope.name).toEqual("Misko");
        expect(scope.count).toEqual(0);
        browserTrigger(element, 'keyup');
        expect(scope.name).toEqual("Misko");
        expect(scope.count).toEqual(0);
      });
      
      it('should allow complex refernce binding', function(){
        compile('<div ng:init="obj={abc:{}}">'+
                  '<input type="Text" name="obj[\'abc\'].name" value="Misko""/>'+
                '</div>');
        expect(scope.obj['abc'].name).toEqual('Misko');
      });

      describe("ng:format", function(){

        it("should format text", function(){
          compile('<input type="Text" name="list" value="a,b,c" ng:format="list"/>');
          expect(scope.$get('list')).toEqual(['a', 'b', 'c']);

          scope.$set('list', ['x', 'y', 'z']);
          scope.$eval();
          expect(element.val()).toEqual("x, y, z");

          element.val('1, 2, 3');
          browserTrigger(element, 'keyup');
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
          browserTrigger(scope.$element, 'change');
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
          browserTrigger(scope.$element, 'change');
          expect(scope.$element.val()).toEqual('a ');
          expect(scope.list).toEqual(['a']);

          scope.$element.val('a ,');
          browserTrigger(scope.$element, 'change');
          expect(scope.$element.val()).toEqual('a ,');
          expect(scope.list).toEqual(['a']);

          scope.$element.val('a , ');
          browserTrigger(scope.$element, 'change');
          expect(scope.$element.val()).toEqual('a , ');
          expect(scope.list).toEqual(['a']);

          scope.$element.val('a , b');
          browserTrigger(scope.$element, 'change');
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
          browserTrigger(element);
          expect(scope.checkbox).toEqual(false);
          expect(scope.action).toEqual(true);
          browserTrigger(element);
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

          browserTrigger(scope.$element);
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
          compile('<input type="text" name="price" value="abc" ng:validate="number"/>',
                  undefined, jqLite(document.body));
          expect(element.hasClass('ng-validation-error')).toBeTruthy();
          expect(element.attr('ng-validation-error')).toEqual('Not a number');

          scope.$set('price', '123');
          scope.$eval();
          expect(element.hasClass('ng-validation-error')).toBeFalsy();
          expect(element.attr('ng-validation-error')).toBeFalsy();

          element.val('x');
          browserTrigger(element, 'keyup');
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
      compile('<input type="text" name="price" ng:required/>', undefined, jqLite(document.body));
      expect(element.hasClass('ng-validation-error')).toBeTruthy();
      expect(element.attr('ng-validation-error')).toEqual('Required');

      scope.$set('price', 'xxx');
      scope.$eval();
      expect(element.hasClass('ng-validation-error')).toBeFalsy();
      expect(element.attr('ng-validation-error')).toBeFalsy();

      element.val('');
      browserTrigger(element, 'keyup');
      expect(element.hasClass('ng-validation-error')).toBeTruthy();
      expect(element.attr('ng-validation-error')).toEqual('Required');
    });

    it('should allow conditions on ng:required', function() {
      compile('<input type="text" name="price" ng:required="ineedz"/>',
              undefined, jqLite(document.body));
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
      browserTrigger(element, 'keyup');
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
      browserTrigger(element, 'keyup');
      expect(scope.$get('name')).toEqual('Shyam');

      element.val('Kai');
      browserTrigger(element, 'change');
      expect(scope.$get('name')).toEqual('Kai');
    });

    it('should call ng:change on button click', function(){
      compile('<input type="button" value="Click Me" ng:change="clicked = true"/>');
      browserTrigger(element);
      expect(scope.$get('clicked')).toEqual(true);
    });

    it('should support button alias', function(){
      compile('<button ng:change="clicked = true">Click Me</button>');
      browserTrigger(element);
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

        browserTrigger(a);
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

    describe('select-one', function(){
      it('should initialize to selected', function(){
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

      it('should honor the value field in option', function(){
        compile(
            '<select name="selection" ng:format="number">' +
              '<option value="{{$index}}" ng:repeat="name in [\'A\', \'B\', \'C\']">{{name}}</option>' +
            '</select>');
        // childNodes[0] is repeater comment
        expect(scope.selection).toEqual(0);

        browserTrigger(element[0].childNodes[2], 'change');
        expect(scope.selection).toEqual(1);

        scope.selection = 2;
        scope.$eval();
        expect(element[0].childNodes[3].selected).toEqual(true);
      });

      it('should unroll select options before eval', function(){
        compile(
            '<select name="selection" ng:required>' +
              '<option value="{{$index}}" ng:repeat="opt in options">{{opt}}</option>' +
            '</select>',
            undefined, jqLite(document.body));
        scope.selection = 1;
        scope.options = ['one', 'two'];
        scope.$eval();
        expect(element[0].value).toEqual('1');
        expect(element.hasClass(NG_VALIDATION_ERROR)).toEqual(false);
      });

      it('should update select when value changes', function(){
        compile(
            '<select name="selection">' +
              '<option value="...">...</option>' +
              '<option value="{{value}}">B</option>' +
            '</select>');
        scope.selection = 'B';
        scope.$eval();
        expect(element[0].childNodes[1].selected).toEqual(false);
        scope.value = 'B';
        scope.$eval();
        expect(element[0].childNodes[1].selected).toEqual(true);
      });
      
      it('should select default option on repeater', function(){
        compile(
            '<select name="selection">' +
              '<option ng:repeat="no in [1,2]">{{no}}</option>' +
            '</select>');
        expect(scope.selection).toEqual('1');
      });
      
      it('should select selected option on repeater', function(){
        compile(
            '<select name="selection">' +
              '<option ng:repeat="no in [1,2]">{{no}}</option>' +
              '<option selected>ABC</option>' +
            '</select>');
        expect(scope.selection).toEqual('ABC');
      });
      
      it('should select dynamically selected option on repeater', function(){
        compile(
            '<select name="selection">' +
              '<option ng:repeat="no in [1,2]" ng:bind-attr="{selected:\'{{no==2}}\'}">{{no}}</option>' +
            '</select>');
        expect(scope.selection).toEqual('2');
      });
      
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
      compile('<input type="text" name="throw \'\'" value="x"/>');
      expect(element.hasClass('ng-exception')).toBeTruthy();
    });

    it('should report error on ng:change exception', function(){
      compile('<button ng:change="a-2=x">click</button>');
      browserTrigger(element);
      expect(element.hasClass('ng-exception')).toBeTruthy();
    });
  });

  describe('ng:switch', function(){
    it('should switch on value change', function(){
      compile('<ng:switch on="select">' +
          '<div ng:switch-when="1">first:{{name}}</div>' +
          '<div ng:switch-when="2">second:{{name}}</div>' +
          '<div ng:switch-when="true">true:{{name}}</div>' +
        '</ng:switch>');
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
      scope.select = true;
      scope.$eval();
      expect(element.text()).toEqual('true:misko');
    });
    
    it("should compare stringified versions", function(){
      var switchWidget = angular.widget('ng:switch');
      expect(switchWidget.equals(true, 'true')).toEqual(true);
    });

    it('should switch on switch-when-default', function(){
      compile('<ng:switch on="select">' +
          '<div ng:switch-when="1">one</div>' +
          '<div ng:switch-default>other</div>' +
        '</ng:switch>');
      scope.$eval();
      expect(element.text()).toEqual('other');
      scope.select = 1;
      scope.$eval();
      expect(element.text()).toEqual('one');
    });
    
    it("should match urls", function(){
      var scope = angular.compile('<ng:switch on="url" using="route:params"><div ng:switch-when="/Book/:name">{{params.name}}</div></ng:switch>');
      scope.url = '/Book/Moby';
      scope.$init();
      expect(scope.$element.text()).toEqual('Moby');
      dealoc(scope);
    });

    it("should match sandwich ids", function(){
      var scope = {};
      var match = angular.widget('NG:SWITCH').route.call(scope, '/a/123/b', '/a/:id');
      expect(match).toBeFalsy();
    });

    it('should call change on switch', function(){
      var scope = angular.compile('<ng:switch on="url" change="name=\'works\'"><div ng:switch-when="a">{{name}}</div></ng:switch>');
      var cleared = false;
      scope.url = 'a';
      scope.$init();
      expect(scope.name).toEqual(undefined);
      expect(scope.$element.text()).toEqual('works');
      dealoc(scope);
    });
  });

  describe('ng:include', function(){
    it('should include on external file', function() {
      var element = jqLite('<ng:include src="url" scope="childScope"></ng:include>');
      var scope = angular.compile(element);
      scope.childScope = createScope();
      scope.childScope.name = 'misko';
      scope.url = 'myUrl';
      scope.$inject('$xhr.cache').data.myUrl = {value:'{{name}}'};
      scope.$init();
      scope.$inject('$browser').defer.flush();
      expect(element.text()).toEqual('misko');
      dealoc(scope);
    });

    it('should remove previously included text if a falsy value is bound to src', function() {
      var element = jqLite('<ng:include src="url" scope="childScope"></ng:include>');
      var scope = angular.compile(element);
      scope.childScope = createScope();
      scope.childScope.name = 'igor';
      scope.url = 'myUrl';
      scope.$inject('$xhr.cache').data.myUrl = {value:'{{name}}'};
      scope.$init();
      scope.$inject('$browser').defer.flush();

      expect(element.text()).toEqual('igor');

      scope.url = undefined;
      scope.$eval();

      expect(element.text()).toEqual('');
      dealoc(scope);
    });

    it('should allow this for scope', function(){
      var element = jqLite('<ng:include src="url" scope="this"></ng:include>');
      var scope = angular.compile(element);
      scope.url = 'myUrl';
      scope.$inject('$xhr.cache').data.myUrl = {value:'{{c=c+1}}'};
      scope.$init();
      scope.$inject('$browser').defer.flush();

      // this one should really be just '1', but due to lack of real events things are not working
      // properly. see discussion at: http://is.gd/ighKk
      expect(element.text()).toEqual('4');
      dealoc(element);
    });

    it('should evaluate onload expression when a partial is loaded', function() {
      var element = jqLite('<ng:include src="url" onload="loaded = true"></ng:include>');
      var scope = angular.compile(element);

      expect(scope.loaded).not.toBeDefined();

      scope.url = 'myUrl';
      scope.$inject('$xhr.cache').data.myUrl = {value:'my partial'};
      scope.$init();
      scope.$inject('$browser').defer.flush();
      expect(element.text()).toEqual('my partial');
      expect(scope.loaded).toBe(true);
      dealoc(element);
    });
  });

  describe('a', function() {
    it('should prevent default action to be executed when href is empty', function() {
      var orgLocation = document.location.href,
          preventDefaultCalled = false,
          event;

      compile('<a href="">empty link</a>');

      if (msie) {

        event = document.createEventObject();
        expect(event.returnValue).not.toBeDefined();
        element[0].fireEvent('onclick', event);
        expect(event.returnValue).toEqual(false);

      } else {

        event = document.createEvent('MouseEvent');
        event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, _null);

        event.preventDefaultOrg = event.preventDefault;
        event.preventDefault = function() {
          preventDefaultCalled = true;
          if (this.preventDefaultOrg) this.preventDefaultOrg();
        };

        element[0].dispatchEvent(event);

        expect(preventDefaultCalled).toEqual(true);
      }

      expect(document.location.href).toEqual(orgLocation);
    });
  });


  describe('@ng:repeat', function() {

    it('should ng:repeat over array', function(){
      var scope = compile('<ul><li ng:repeat="item in items" ng:init="suffix = \';\'" ng:bind="item + suffix"></li></ul>');

      Array.prototype.extraProperty = "should be ignored";
      scope.items = ['misko', 'shyam'];
      scope.$eval();
      expect(element.text()).toEqual('misko;shyam;');
      delete Array.prototype.extraProperty;

      scope.items = ['adam', 'kai', 'brad'];
      scope.$eval();
      expect(element.text()).toEqual('adam;kai;brad;');

      scope.items = ['brad'];
      scope.$eval();
      expect(element.text()).toEqual('brad;');
    });

    it('should ng:repeat over object', function(){
      var scope = compile('<ul><li ng:repeat="(key, value) in items" ng:bind="key + \':\' + value + \';\' "></li></ul>');
      scope.$set('items', {misko:'swe', shyam:'set'});
      scope.$eval();
      expect(element.text()).toEqual('misko:swe;shyam:set;');
    });

    it('should error on wrong parsing of ng:repeat', function(){
      var scope = compile('<ul><li ng:repeat="i dont parse"></li></ul>');
      var log = "";
      log += element.attr('ng-exception') + ';';
      log += element.hasClass('ng-exception') + ';';
      expect(log.match(/Expected ng:repeat in form of 'item in collection' but got 'i dont parse'./)).toBeTruthy();
    });

    it('should expose iterator offset as $index when iterating over arrays', function() {
      var scope = compile('<ul><li ng:repeat="item in items" ' +
                                  'ng:bind="item + $index + \'|\'"></li></ul>');
      scope.items = ['misko', 'shyam', 'frodo'];
      scope.$eval();
      expect(element.text()).toEqual('misko0|shyam1|frodo2|');
    });

    it('should expose iterator offset as $index when iterating over objects', function() {
      var scope = compile('<ul><li ng:repeat="(key, val) in items" ' +
                                  'ng:bind="key + \':\' + val + $index + \'|\'"></li></ul>');
      scope.items = {'misko':'m', 'shyam':'s', 'frodo':'f'};
      scope.$eval();
      expect(element.text()).toEqual('misko:m0|shyam:s1|frodo:f2|');
    });

    it('should expose iterator position as $position when iterating over arrays', function() {
      var scope = compile('<ul><li ng:repeat="item in items" ' +
                                  'ng:bind="item + \':\' + $position + \'|\'"></li></ul>');
      scope.items = ['misko', 'shyam', 'doug', 'frodo'];
      scope.$eval();
      expect(element.text()).toEqual('misko:first|shyam:middle|doug:middle|frodo:last|');
    });

    it('should expose iterator position as $position when iterating over objects', function() {
      var scope = compile('<ul><li ng:repeat="(key, val) in items" ' +
                                  'ng:bind="key + \':\' + val + \':\' + $position + \'|\'"></li></ul>');
      scope.items = {'misko':'m', 'shyam':'s', 'doug':'d', 'frodo':'f'};
      scope.$eval();
      expect(element.text()).toEqual('misko:m:first|shyam:s:middle|doug:d:middle|frodo:f:last|');
    });
  });


  describe('@ng:non-bindable', function() {

    it('should prevent compilation of the owning element and its children', function(){
      var scope = compile('<div ng:non-bindable><span ng:bind="name"></span></div>');
      scope.$set('name', 'misko');
      scope.$eval();
      expect(element.text()).toEqual('');
    });
  });
});

