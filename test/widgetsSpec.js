describe("widget", function(){
  var compile, element, scope;

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
      return scope = angular.compile(element)();
    };
  });

  afterEach(function(){
    dealoc(element);
  });

  describe("input", function(){

    describe("text", function(){
      it('should input-text auto init and handle keydown/change events', function(){
        compile('<input type="Text" name="name" value="Misko" ng:change="count = count + 1" ng:init="count=0"/>');
        expect(scope.$get('name')).toEqual("Misko");
        expect(scope.$get('count')).toEqual(0);

        scope.$set('name', 'Adam');
        scope.$eval();
        expect(element.val()).toEqual("Adam");

        element.val('Shyam');
        browserTrigger(element, 'keydown');
        // keydown event must be deferred
        expect(scope.$get('name')).toEqual('Adam');
        scope.$service('$browser').defer.flush();
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
        browserTrigger(element, 'keydown');
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
          browserTrigger(element);
          expect(scope.$get('list')).toEqual(['1', '2', '3']);
        });

        it("should come up blank if null", function(){
          compile('<input type="text" name="age" ng:format="number" ng:init="age=null"/>');
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
          compile('<input type="checkbox" name="name" ng:init="name=false"/>');
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
                  jqLite(document.body));
          expect(element.hasClass('ng-validation-error')).toBeTruthy();
          expect(element.attr('ng-validation-error')).toEqual('Not a number');

          scope.$set('price', '123');
          scope.$eval();
          expect(element.hasClass('ng-validation-error')).toBeFalsy();
          expect(element.attr('ng-validation-error')).toBeFalsy();

          element.val('x');
          browserTrigger(element);
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
      compile('<input type="text" name="price" ng:required/>', jqLite(document.body));
      expect(element.hasClass('ng-validation-error')).toBeTruthy();
      expect(element.attr('ng-validation-error')).toEqual('Required');

      scope.$set('price', 'xxx');
      scope.$eval();
      expect(element.hasClass('ng-validation-error')).toBeFalsy();
      expect(element.attr('ng-validation-error')).toBeFalsy();

      element.val('');
      browserTrigger(element);
      expect(element.hasClass('ng-validation-error')).toBeTruthy();
      expect(element.attr('ng-validation-error')).toEqual('Required');
    });

    it('should allow conditions on ng:required', function() {
      compile('<input type="text" name="price" ng:required="ineedz"/>',
              jqLite(document.body));
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
      browserTrigger(element);
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
      browserTrigger(element);
      expect(scope.$get('name')).toEqual('Shyam');

      element.val('Kai');
      browserTrigger(element);
      expect(scope.$get('name')).toEqual('Kai');
    });

    it('should call ng:change on button click', function(){
      compile('<input type="button" value="Click Me" ng:change="clicked = true"/>');
      browserTrigger(element);
      expect(scope.$get('clicked')).toEqual(true);
    });

    it('should support button alias', function(){
      compile('<button ng:change="clicked = true">Click {{"Me"}}.</button>');
      browserTrigger(element);
      expect(scope.$get('clicked')).toEqual(true);
      expect(scope.$element.text()).toEqual("Click Me.");
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
        compile('<div ng:init="choose=\'C\'">' +
            '<input type="radio" name="choose" value="A""/>' +
            '<input type="radio" name="choose" value="B" checked/>' +
            '<input type="radio" name="choose" value="C"/>' +
        '</div>');

        expect(scope.choose).toEqual('C');
      });

      it('should honor model over html checked keyword before', function(){
        compile('<div ng:init="choose=\'A\'">' +
            '<input type="radio" name="choose" value="A""/>' +
            '<input type="radio" name="choose" value="B" checked/>' +
            '<input type="radio" name="choose" value="C"/>' +
        '</div>');

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


      it('should compile children of a select without a name, but not create a model for it',
          function() {
        compile('<select>' +
                  '<option selected="true">{{a}}</option>' +
                  '<option value="">{{b}}</option>' +
                  '<option>C</option>' +
                '</select>');
        scope.a = 'foo';
        scope.b = 'bar';
        scope.$eval();

        expect(scope.$element.text()).toBe('foobarC');
      });

    });

    describe('select-multiple', function(){
      it('should support type="select-multiple"', function(){
        compile('<select name="selection" multiple>' +
                  '<option>A</option>' +
                  '<option selected>B</option>' +
                '</select>');
        expect(scope.selection).toEqual(['B']);
        scope.selection = ['A'];
        scope.$eval();
        expect(element[0].childNodes[0].selected).toEqual(true);
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
      compile('<input type="text" name="throw \'\'" value="x"/>');
      expect(element.hasClass('ng-exception')).toBeTruthy();
      expect(scope.$service('$log').error.logs.shift()[0]).
        toMatchError(/Syntax Error: Token '''' is an unexpected token/);
    });

    it('should report error on ng:change exception', function(){
      compile('<button ng:change="a-2=x">click</button>');
      browserTrigger(element);
      expect(element.hasClass('ng-exception')).toBeTruthy();
      expect(scope.$service('$log').error.logs.shift()[0]).
        toMatchError(/Syntax Error: Token '=' implies assignment but \[a-2\] can not be assigned to/);
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

    it('should call change on switch', function(){
      var scope = angular.compile('<ng:switch on="url" change="name=\'works\'"><div ng:switch-when="a">{{name}}</div></ng:switch>')();
      scope.url = 'a';
      scope.$eval();
      expect(scope.name).toEqual(undefined);
      expect(scope.$element.text()).toEqual('works');
      dealoc(scope);
    });
  });

  describe('ng:include', function(){
    it('should include on external file', function() {
      var element = jqLite('<ng:include src="url" scope="childScope"></ng:include>');
      var scope = angular.compile(element)();
      scope.childScope = createScope();
      scope.childScope.name = 'misko';
      scope.url = 'myUrl';
      scope.$service('$xhr.cache').data.myUrl = {value:'{{name}}'};
      scope.$eval();
      expect(element.text()).toEqual('misko');
      dealoc(scope);
    });

    it('should remove previously included text if a falsy value is bound to src', function() {
      var element = jqLite('<ng:include src="url" scope="childScope"></ng:include>');
      var scope = angular.compile(element)();
      scope.childScope = createScope();
      scope.childScope.name = 'igor';
      scope.url = 'myUrl';
      scope.$service('$xhr.cache').data.myUrl = {value:'{{name}}'};
      scope.$eval();

      expect(element.text()).toEqual('igor');

      scope.url = undefined;
      scope.$eval();

      expect(element.text()).toEqual('');
      dealoc(scope);
    });

    it('should allow this for scope', function(){
      var element = jqLite('<ng:include src="url" scope="this"></ng:include>');
      var scope = angular.compile(element)();
      scope.url = 'myUrl';
      scope.$service('$xhr.cache').data.myUrl = {value:'{{c=c+1}}'};
      scope.$eval();

      // this one should really be just '1', but due to lack of real events things are not working
      // properly. see discussion at: http://is.gd/ighKk
      expect(element.text()).toEqual('4');
      dealoc(element);
    });

    it('should evaluate onload expression when a partial is loaded', function() {
      var element = jqLite('<ng:include src="url" onload="loaded = true"></ng:include>');
      var scope = angular.compile(element)();

      expect(scope.loaded).not.toBeDefined();

      scope.url = 'myUrl';
      scope.$service('$xhr.cache').data.myUrl = {value:'my partial'};
      scope.$eval();
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

      if (msie < 9) {

        event = document.createEventObject();
        expect(event.returnValue).not.toBeDefined();
        element[0].fireEvent('onclick', event);
        expect(event.returnValue).toEqual(false);

      } else {

        event = document.createEvent('MouseEvent');
        event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

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

  describe('ng:options', function(){
    var select, scope;

    function createSelect(multiple, blank, unknown){
      select = jqLite(
          '<select name="selected" ' + (multiple ? ' multiple' : '') +
                 ' ng:options="value.name for value in values">' +
            (blank ? '<option value="">blank</option>' : '') +
            (unknown ? '<option value="?">unknown</option>' : '') +
          '</select>');
      scope = compile(select);
    };

    function createSingleSelect(blank, unknown){
      createSelect(false, blank, unknown);
    };

    function createMultiSelect(blank, unknown){
      createSelect(true, blank, unknown);
    };

    afterEach(function(){
      dealoc(select);
      dealoc(scope);
    });

    it('should throw when not formated "? for ? in ?"', function(){
      expect(function(){
        compile('<select name="selected" ng:options="i dont parse"></select>');
      }).toThrow("Expected ng:options in form of '_expresion_ for _item_ in _collection_' but got 'i dont parse'.");

      $logMock.error.logs.shift();
    });

    it('should render a list', function(){
      createSingleSelect();
      scope.values = [{name:'A'}, {name:'B'}, {name:'C'}];
      scope.selected = scope.values[0];
      scope.$eval();
      var options = select.find('option');
      expect(options.length).toEqual(3);
      expect(sortedHtml(options[0])).toEqual('<option value="0">A</option>');
      expect(sortedHtml(options[1])).toEqual('<option value="1">B</option>');
      expect(sortedHtml(options[2])).toEqual('<option value="2">C</option>');
    });

    it('should grow list', function(){
      createSingleSelect();
      scope.values = [];
      scope.$eval();
      expect(select.find('option').length).toEqual(1); // because we add special empty option
      expect(sortedHtml(select.find('option')[0])).toEqual('<option></option>');

      scope.values.push({name:'A'});
      scope.selected = scope.values[0];
      scope.$eval();
      expect(select.find('option').length).toEqual(1);
      expect(sortedHtml(select.find('option')[0])).toEqual('<option value="0">A</option>');

      scope.values.push({name:'B'});
      scope.$eval();
      expect(select.find('option').length).toEqual(2);
      expect(sortedHtml(select.find('option')[0])).toEqual('<option value="0">A</option>');
      expect(sortedHtml(select.find('option')[1])).toEqual('<option value="1">B</option>');
    });

    it('should shrink list', function(){
      createSingleSelect();
      scope.values = [{name:'A'}, {name:'B'}, {name:'C'}];
      scope.selected = scope.values[0];
      scope.$eval();
      expect(select.find('option').length).toEqual(3);

      scope.values.pop();
      scope.$eval();
      expect(select.find('option').length).toEqual(2);
      expect(sortedHtml(select.find('option')[0])).toEqual('<option value="0">A</option>');
      expect(sortedHtml(select.find('option')[1])).toEqual('<option value="1">B</option>');

      scope.values.pop();
      scope.$eval();
      expect(select.find('option').length).toEqual(1);
      expect(sortedHtml(select.find('option')[0])).toEqual('<option value="0">A</option>');

      scope.values.pop();
      scope.selected = null;
      scope.$eval();
      expect(select.find('option').length).toEqual(1); // we add back the special empty option
    });

    it('should update list', function(){
      createSingleSelect();
      scope.values = [{name:'A'}, {name:'B'}, {name:'C'}];
      scope.selected = scope.values[0];
      scope.$eval();

      scope.values = [{name:'B'}, {name:'C'}, {name:'D'}];
      scope.selected = scope.values[0];
      scope.$eval();
      var options = select.find('option');
      expect(options.length).toEqual(3);
      expect(sortedHtml(options[0])).toEqual('<option value="0">B</option>');
      expect(sortedHtml(options[1])).toEqual('<option value="1">C</option>');
      expect(sortedHtml(options[2])).toEqual('<option value="2">D</option>');
    });

    it('should preserve existing options', function(){
      createSingleSelect(true);

      scope.$eval();
      expect(select.find('option').length).toEqual(1);

      scope.values = [{name:'A'}];
      scope.selected = scope.values[0];
      scope.$eval();
      expect(select.find('option').length).toEqual(2);
      expect(jqLite(select.find('option')[0]).text()).toEqual('blank');
      expect(jqLite(select.find('option')[1]).text()).toEqual('A');

      scope.values = [];
      scope.selected = null;
      scope.$eval();
      expect(select.find('option').length).toEqual(1);
      expect(jqLite(select.find('option')[0]).text()).toEqual('blank');
    });

    describe('binding', function(){
      it('should bind to scope value', function(){
        createSingleSelect();
        scope.values = [{name:'A'}, {name:'B'}];
        scope.selected = scope.values[0];
        scope.$eval();
        expect(select.val()).toEqual('0');

        scope.selected = scope.values[1];
        scope.$eval();
        expect(select.val()).toEqual('1');
      });

      it('should insert a blank option if bound to null', function(){
        createSingleSelect();
        scope.values = [{name:'A'}];
        scope.selected = null;
        scope.$eval();
        expect(select.find('option').length).toEqual(2);
        expect(select.val()).toEqual('');
        expect(jqLite(select.find('option')[0]).val()).toEqual('');

        scope.selected = scope.values[0];
        scope.$eval();
        expect(select.val()).toEqual('0');
        expect(select.find('option').length).toEqual(1);
      });

      it('should reuse blank option if bound to null', function(){
        createSingleSelect(true);
        scope.values = [{name:'A'}];
        scope.selected = null;
        scope.$eval();
        expect(select.find('option').length).toEqual(2);
        expect(select.val()).toEqual('');
        expect(jqLite(select.find('option')[0]).val()).toEqual('');

        scope.selected = scope.values[0];
        scope.$eval();
        expect(select.val()).toEqual('0');
        expect(select.find('option').length).toEqual(2);
      });

      it('should insert a unknown option if bound to not in list', function(){
        createSingleSelect();
        scope.values = [{name:'A'}];
        scope.selected = {};
        scope.$eval();
        expect(select.find('option').length).toEqual(2);
        expect(select.val()).toEqual('?');
        expect(jqLite(select.find('option')[0]).val()).toEqual('?');

        scope.selected = scope.values[0];
        scope.$eval();
        expect(select.val()).toEqual('0');
        expect(select.find('option').length).toEqual(1);
      });
    });

    describe('on change', function(){
      it('should update model on change', function(){
        createSingleSelect();
        scope.values = [{name:'A'}, {name:'B'}];
        scope.selected = scope.values[0];
        scope.$eval();
        expect(select.val()).toEqual('0');

        select.val('1');
        browserTrigger(select, 'change');
        expect(scope.selected).toEqual(scope.values[1]);
      });

      it('should update model to null on change', function(){
        createSingleSelect(true);
        scope.values = [{name:'A'}, {name:'B'}];
        scope.selected = scope.values[0];
        select.val('0');
        scope.$eval();

        select.val('');
        browserTrigger(select, 'change');
        expect(scope.selected).toEqual(null);
      });
    });

    describe('select-many', function(){
      it('should read multiple selection', function(){
        createMultiSelect();
        scope.values = [{name:'A'}, {name:'B'}];

        scope.selected = [];
        scope.$eval();
        expect(select.find('option').length).toEqual(2);
        expect(jqLite(select.find('option')[0]).attr('selected')).toEqual(false);
        expect(jqLite(select.find('option')[1]).attr('selected')).toEqual(false);

        scope.selected.push(scope.values[1]);
        scope.$eval();
        expect(select.find('option').length).toEqual(2);
        expect(select.find('option')[0].selected).toEqual(false);
        expect(select.find('option')[1].selected).toEqual(true);

        scope.selected.push(scope.values[0]);
        scope.$eval();
        expect(select.find('option').length).toEqual(2);
        expect(select.find('option')[0].selected).toEqual(true);
        expect(select.find('option')[1].selected).toEqual(true);
      });

      it('should update model on change', function(){
        createMultiSelect();
        scope.values = [{name:'A'}, {name:'B'}];

        scope.selected = [];
        scope.$eval();
        select.find('option')[0].selected = true;

        browserTrigger(select, 'change');
        expect(scope.selected).toEqual([scope.values[0]]);
      });
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

    it('should not ng:repeat over parent properties', function(){
      var Class = function(){};
      Class.prototype.abc = function(){};
      Class.prototype.value = 'abc';

      var scope = compile('<ul><li ng:repeat="(key, value) in items" ng:bind="key + \':\' + value + \';\' "></li></ul>');
      scope.items = new Class();
      scope.items.name = 'value';
      scope.$eval();
      expect(element.text()).toEqual('name:value;');
    });

    it('should error on wrong parsing of ng:repeat', function(){
      var scope = compile('<ul><li ng:repeat="i dont parse"></li></ul>');

      expect(scope.$service('$log').error.logs.shift()[0]).
        toEqualError("Expected ng:repeat in form of '_item_ in _collection_' but got 'i dont parse'.");

      expect(scope.$element.attr('ng-exception')).
        toMatch(/Expected ng:repeat in form of '_item_ in _collection_' but got 'i dont parse'/);
      expect(scope.$element).toHaveClass('ng-exception');

      dealoc(scope);
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
      scope.items = ['misko', 'shyam', 'doug'];
      scope.$eval();
      expect(element.text()).toEqual('misko:first|shyam:middle|doug:last|');

      scope.items.push('frodo');
      scope.$eval();
      expect(element.text()).toEqual('misko:first|shyam:middle|doug:middle|frodo:last|');

      scope.items.pop();
      scope.items.pop();
      scope.$eval();
      expect(element.text()).toEqual('misko:first|shyam:last|');
    });

    it('should expose iterator position as $position when iterating over objects', function() {
      var scope = compile('<ul><li ng:repeat="(key, val) in items" ' +
                                  'ng:bind="key + \':\' + val + \':\' + $position + \'|\'"></li></ul>');
      scope.items = {'misko':'m', 'shyam':'s', 'doug':'d', 'frodo':'f'};
      scope.$eval();
      expect(element.text()).toEqual('misko:m:first|shyam:s:middle|doug:d:middle|frodo:f:last|');

      delete scope.items.doug;
      delete scope.items.frodo;
      scope.$eval();
      expect(element.text()).toEqual('misko:m:first|shyam:s:last|');
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


  describe('ng:view', function() {
    var rootScope, $route, $location, $browser;

    beforeEach(function() {
      rootScope = angular.compile('<ng:view></ng:view>')();
      $route = rootScope.$service('$route');
      $location = rootScope.$service('$location');
      $browser = rootScope.$service('$browser');
    });

    afterEach(function() {
      dealoc(rootScope);
    });


    it('should do nothing when no routes are defined', function() {
      $location.updateHash('/unknown');
      rootScope.$eval();
      expect(rootScope.$element.text()).toEqual('');
    });


    it('should load content via xhr when route changes', function() {
      $route.when('/foo', {controller: angular.noop, template: 'myUrl1'});
      $route.when('/bar', {controller: angular.noop, template: 'myUrl2'});

      expect(rootScope.$element.text()).toEqual('');

      $location.updateHash('/foo');
      $browser.xhr.expectGET('myUrl1').respond('<div>{{1+3}}</div>');
      rootScope.$eval();
      $browser.xhr.flush();
      expect(rootScope.$element.text()).toEqual('4');

      $location.updateHash('/bar');
      $browser.xhr.expectGET('myUrl2').respond('angular is da best');
      rootScope.$eval();
      $browser.xhr.flush();
      expect(rootScope.$element.text()).toEqual('angular is da best');
    });

    it('should remove all content when location changes to an unknown route', function() {
      $route.when('/foo', {controller: angular.noop, template: 'myUrl1'});

      $location.updateHash('/foo');
      $browser.xhr.expectGET('myUrl1').respond('<div>{{1+3}}</div>');
      rootScope.$eval();
      $browser.xhr.flush();
      expect(rootScope.$element.text()).toEqual('4');

      $location.updateHash('/unknown');
      rootScope.$eval();
      expect(rootScope.$element.text()).toEqual('');
    });

    it('should chain scopes and propagate evals to the child scope', function() {
      $route.when('/foo', {controller: angular.noop, template: 'myUrl1'});
      rootScope.parentVar = 'parent';

      $location.updateHash('/foo');
      $browser.xhr.expectGET('myUrl1').respond('<div>{{parentVar}}</div>');
      rootScope.$eval();
      $browser.xhr.flush();
      expect(rootScope.$element.text()).toEqual('parent');

      rootScope.parentVar = 'new parent';
      rootScope.$eval();
      expect(rootScope.$element.text()).toEqual('new parent');
    });

    it('should be possible to nest ng:view in ng:include', function() {
      var myApp = angular.scope();
      var $browser = myApp.$service('$browser');
      $browser.xhr.expectGET('includePartial.html').respond('view: <ng:view></ng:view>');
      $browser.setUrl('http://server/#/foo');

      var $route = myApp.$service('$route');
      $route.when('/foo', {controller: angular.noop, template: 'viewPartial.html'});

      dealoc(rootScope); // we are about to override it.
      rootScope = angular.compile(
          '<div>' +
            'include: <ng:include src="\'includePartial.html\'">' +
          '</ng:include></div>')(myApp);

      $browser.xhr.expectGET('viewPartial.html').respond('content');
      $browser.xhr.flush();

      expect(rootScope.$element.text()).toEqual('include: view: content');
      expect($route.current.template).toEqual('viewPartial.html');
      dealoc($route.current.scope);
    });


    it('should initialize view template after the view controller was initialized even when ' +
       'templates were cached', function() {
      //this is a test for a regression that was introduced by making the ng:view cache sync

      $route.when('/foo', {controller: ParentCtrl, template: 'viewPartial.html'});

      rootScope.log = [];

      function ParentCtrl() {
        this.log.push('parent');
      }

      rootScope.ChildCtrl = function() {
        this.log.push('child');
      };

      $location.updateHash('/foo');
      $browser.xhr.expectGET('viewPartial.html').
          respond('<div ng:init="log.push(\'init\')">' +
                    '<div ng:controller="ChildCtrl"></div>' +
                  '</div>');
      rootScope.$eval();
      $browser.xhr.flush();

      expect(rootScope.log).toEqual(['parent', 'init', 'child']);

      $location.updateHash('');
      rootScope.$eval();
      expect(rootScope.log).toEqual(['parent', 'init', 'child']);

      rootScope.log = [];
      $location.updateHash('/foo');
      rootScope.$eval();
      $browser.defer.flush();

      expect(rootScope.log).toEqual(['parent', 'init', 'child']);
    });
  });
});

