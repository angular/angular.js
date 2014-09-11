'use strict';

describe('select', function() {
  var scope, formElement, element, $compile;

  function compile(html) {
    formElement = jqLite('<form name="form">' + html + '</form>');
    element = formElement.find('select');
    $compile(formElement)(scope);
    scope.$apply();
  }

  beforeEach(inject(function($rootScope, _$compile_) {
    scope = $rootScope.$new(); //create a child scope because the root scope can't be $destroy-ed
    $compile = _$compile_;
    formElement = element = null;
  }));


  afterEach(function() {
    scope.$destroy(); //disables unknown option work during destruction
    dealoc(formElement);
  });


  beforeEach(function() {
    this.addMatchers({
      toEqualSelect: function(expected){
        var actualValues = [],
            expectedValues = [].slice.call(arguments);

        forEach(this.actual.find('option'), function(option) {
          actualValues.push(option.selected ? [option.value] : option.value);
        });

        this.message = function() {
          return 'Expected ' + toJson(actualValues) + ' to equal ' + toJson(expectedValues) + '.';
        };

        return equals(expectedValues, actualValues);
      }
    });
  });


  describe('select-one', function() {

    it('should compile children of a select without a ngModel, but not create a model for it',
        function() {
      compile('<select>' +
                '<option selected="true">{{a}}</option>' +
                '<option value="">{{b}}</option>' +
                '<option>C</option>' +
              '</select>');
      scope.$apply(function() {
        scope.a = 'foo';
        scope.b = 'bar';
      });

      expect(element.text()).toBe('foobarC');
    });


    it('should not interfere with selection via selected attr if ngModel directive is not present',
        function() {
      compile('<select>' +
                '<option>not me</option>' +
                '<option selected>me!</option>' +
                '<option>nah</option>' +
              '</select>');
      expect(element).toEqualSelect('not me', ['me!'], 'nah');
    });


    it('should require', function() {
      compile(
        '<select name="select" ng-model="selection" required ng-change="change()">' +
          '<option value=""></option>' +
          '<option value="c">C</option>' +
        '</select>');

      scope.change = function() {
        scope.log += 'change;';
      };

      scope.$apply(function() {
        scope.log = '';
        scope.selection = 'c';
      });

      expect(scope.form.select.$error.required).toBeFalsy();
      expect(element).toBeValid();
      expect(element).toBePristine();

      scope.$apply(function() {
        scope.selection = '';
      });

      expect(scope.form.select.$error.required).toBeTruthy();
      expect(element).toBeInvalid();
      expect(element).toBePristine();
      expect(scope.log).toEqual('');

      element[0].value = 'c';
      browserTrigger(element, 'change');
      expect(element).toBeValid();
      expect(element).toBeDirty();
      expect(scope.log).toEqual('change;');
    });


    it('should not be invalid if no require', function() {
      compile(
        '<select name="select" ng-model="selection">' +
          '<option value=""></option>' +
          '<option value="c">C</option>' +
        '</select>');

      expect(element).toBeValid();
      expect(element).toBePristine();
    });


    it('should work with repeated value options', function() {
      scope.robots = ['c3p0', 'r2d2'];
      scope.robot = 'r2d2';
      compile('<select ng-model="robot">' +
                '<option ng-repeat="r in robots">{{r}}</option>' +
              '</select>');
      expect(element).toEqualSelect('c3p0', ['r2d2']);

      browserTrigger(element.find('option').eq(0));
      expect(element).toEqualSelect(['c3p0'], 'r2d2');
      expect(scope.robot).toBe('c3p0');

      scope.$apply(function() {
        scope.robots.unshift('wallee');
      });
      expect(element).toEqualSelect('wallee', ['c3p0'], 'r2d2');
      expect(scope.robot).toBe('c3p0');

      scope.$apply(function() {
        scope.robots = ['c3p0+', 'r2d2+'];
        scope.robot = 'r2d2+';
      });
      expect(element).toEqualSelect('c3p0+', ['r2d2+']);
      expect(scope.robot).toBe('r2d2+');
    });


    describe('empty option', function() {

      it('should select the empty option when model is undefined', function() {
        compile('<select ng-model="robot">' +
                  '<option value="">--select--</option>' +
                  '<option value="x">robot x</option>' +
                  '<option value="y">robot y</option>' +
                '</select>');

        expect(element).toEqualSelect([''], 'x', 'y');
      });


      it('should support defining an empty option anywhere in the option list', function() {
        compile('<select ng-model="robot">' +
                  '<option value="x">robot x</option>' +
                  '<option value="">--select--</option>' +
                  '<option value="y">robot y</option>' +
                '</select>');

        expect(element).toEqualSelect('x', [''], 'y');
      });


      it('should set the model to empty string when empty option is selected', function() {
        scope.robot = 'x';
        compile('<select ng-model="robot">' +
                  '<option value="">--select--</option>' +
                  '<option value="x">robot x</option>' +
                  '<option value="y">robot y</option>' +
                '</select>');
        expect(element).toEqualSelect('', ['x'], 'y');

        browserTrigger(element.find('option').eq(0));
        expect(element).toEqualSelect([''], 'x', 'y');
        expect(scope.robot).toBe('');
      });


      describe('interactions with repeated options', function() {

        it('should select empty option when model is undefined', function() {
          scope.robots = ['c3p0', 'r2d2'];
          compile('<select ng-model="robot">' +
                    '<option value="">--select--</option>' +
                    '<option ng-repeat="r in robots">{{r}}</option>' +
                  '</select>');
          expect(element).toEqualSelect([''], 'c3p0', 'r2d2');
        });


        it('should set model to empty string when selected', function() {
          scope.robots = ['c3p0', 'r2d2'];
          compile('<select ng-model="robot">' +
                    '<option value="">--select--</option>' +
                    '<option ng-repeat="r in robots">{{r}}</option>' +
                  '</select>');

          browserTrigger(element.find('option').eq(1));
          expect(element).toEqualSelect('', ['c3p0'], 'r2d2');
          expect(scope.robot).toBe('c3p0');

          browserTrigger(element.find('option').eq(0));
          expect(element).toEqualSelect([''], 'c3p0', 'r2d2');
          expect(scope.robot).toBe('');
        });


        it('should not break if both the select and repeater models change at once', function() {
          scope.robots = ['c3p0', 'r2d2'];
          scope.robot = 'c3p0';
          compile('<select ng-model="robot">' +
                    '<option value="">--select--</option>' +
                    '<option ng-repeat="r in robots">{{r}}</option>' +
                  '</select>');
          expect(element).toEqualSelect('', ['c3p0'], 'r2d2');

          scope.$apply(function() {
            scope.robots = ['wallee'];
            scope.robot = '';
          });

          expect(element).toEqualSelect([''], 'wallee');
        });
      });
    });


    describe('unknown option', function() {

      it("should insert&select temporary unknown option when no options-model match", function() {
        compile('<select ng-model="robot">' +
                  '<option>c3p0</option>' +
                  '<option>r2d2</option>' +
                '</select>');

        expect(element).toEqualSelect(['? undefined:undefined ?'], 'c3p0', 'r2d2');

        scope.$apply(function() {
          scope.robot = 'r2d2';
        });
        expect(element).toEqualSelect('c3p0', ['r2d2']);


        scope.$apply(function() {
          scope.robot = "wallee";
        });
        expect(element).toEqualSelect(['? string:wallee ?'], 'c3p0', 'r2d2');
      });


      it("should NOT insert temporary unknown option when model is undefined and empty options " +
          "is present", function() {
        compile('<select ng-model="robot">' +
                  '<option value="">--select--</option>' +
                  '<option>c3p0</option>' +
                  '<option>r2d2</option>' +
                '</select>');

        expect(element).toEqualSelect([''], 'c3p0', 'r2d2');
        expect(scope.robot).toBeUndefined();

        scope.$apply(function() {
          scope.robot = null;
        });
        expect(element).toEqualSelect(['? object:null ?'], '', 'c3p0', 'r2d2');

        scope.$apply(function() {
          scope.robot = 'r2d2';
        });
        expect(element).toEqualSelect('', 'c3p0', ['r2d2']);

        scope.$apply(function() {
          delete scope.robot;
        });
        expect(element).toEqualSelect([''], 'c3p0', 'r2d2');
      });


      it("should insert&select temporary unknown option when no options-model match, empty " +
          "option is present and model is defined", function() {
        scope.robot = 'wallee';
        compile('<select ng-model="robot">' +
                  '<option value="">--select--</option>' +
                  '<option>c3p0</option>' +
                  '<option>r2d2</option>' +
                '</select>');

        expect(element).toEqualSelect(['? string:wallee ?'], '', 'c3p0', 'r2d2');

        scope.$apply(function() {
          scope.robot = 'r2d2';
        });
        expect(element).toEqualSelect('', 'c3p0', ['r2d2']);
      });


      describe('interactions with repeated options', function() {

        it('should work with repeated options', function() {
          compile('<select ng-model="robot">' +
                    '<option ng-repeat="r in robots">{{r}}</option>' +
                  '</select>');
          expect(element).toEqualSelect(['? undefined:undefined ?']);
          expect(scope.robot).toBeUndefined();

          scope.$apply(function() {
            scope.robot = 'r2d2';
          });
          expect(element).toEqualSelect(['? string:r2d2 ?']);
          expect(scope.robot).toBe('r2d2');

          scope.$apply(function() {
            scope.robots = ['c3p0', 'r2d2'];
          });
          expect(element).toEqualSelect('c3p0', ['r2d2']);
          expect(scope.robot).toBe('r2d2');
        });


        it('should work with empty option and repeated options', function() {
          compile('<select ng-model="robot">' +
                    '<option value="">--select--</option>' +
                    '<option ng-repeat="r in robots">{{r}}</option>' +
                  '</select>');
          expect(element).toEqualSelect(['']);
          expect(scope.robot).toBeUndefined();

          scope.$apply(function() {
            scope.robot = 'r2d2';
          });
          expect(element).toEqualSelect(['? string:r2d2 ?'], '');
          expect(scope.robot).toBe('r2d2');

          scope.$apply(function() {
            scope.robots = ['c3p0', 'r2d2'];
          });
          expect(element).toEqualSelect('', 'c3p0', ['r2d2']);
          expect(scope.robot).toBe('r2d2');
        });


        it('should insert unknown element when repeater shrinks and selected option is unavailable',
            function() {
          scope.robots = ['c3p0', 'r2d2'];
          scope.robot = 'r2d2';
          compile('<select ng-model="robot">' +
                    '<option ng-repeat="r in robots">{{r}}</option>' +
                  '</select>');
          expect(element).toEqualSelect('c3p0', ['r2d2']);
          expect(scope.robot).toBe('r2d2');

          scope.$apply(function() {
            scope.robots.pop();
          });
          expect(element).toEqualSelect(['? string:r2d2 ?'], 'c3p0');
          expect(scope.robot).toBe('r2d2');

          scope.$apply(function() {
            scope.robots.unshift('r2d2');
          });
          expect(element).toEqualSelect(['r2d2'], 'c3p0');
          expect(scope.robot).toBe('r2d2');

          scope.$apply(function() {
            delete scope.robots;
          });
          expect(element).toEqualSelect(['? string:r2d2 ?']);
          expect(scope.robot).toBe('r2d2');
        });
      });
    });
  });


  describe('select-multiple', function() {

    it('should support type="select-multiple"', function() {
      compile(
        '<select ng-model="selection" multiple>' +
          '<option>A</option>' +
          '<option>B</option>' +
        '</select>');

      scope.$apply(function() {
        scope.selection = ['A'];
      });

      expect(element).toEqualSelect(['A'], 'B');

      scope.$apply(function() {
        scope.selection.push('B');
      });

      expect(element).toEqualSelect(['A'], ['B']);
    });

    it('should work with optgroups', function() {
      compile('<select ng-model="selection" multiple>' +
                '<optgroup label="group1">' +
                  '<option>A</option>' +
                  '<option>B</option>' +
                '</optgroup>' +
              '</select>');

      expect(element).toEqualSelect('A', 'B');
      expect(scope.selection).toBeUndefined();

      scope.$apply(function() {
        scope.selection = ['A'];
      });
      expect(element).toEqualSelect(['A'], 'B');

      scope.$apply(function() {
        scope.selection.push('B');
      });
      expect(element).toEqualSelect(['A'], ['B']);
    });

    it('should require', function() {
      compile(
        '<select name="select" ng-model="selection" multiple required>' +
          '<option>A</option>' +
          '<option>B</option>' +
        '</select>');

      scope.$apply(function() {
        scope.selection = [];
      });

      expect(scope.form.select.$error.required).toBeTruthy();
      expect(element).toBeInvalid();
      expect(element).toBePristine();

      scope.$apply(function() {
        scope.selection = ['A'];
      });

      expect(element).toBeValid();
      expect(element).toBePristine();

      element[0].value = 'B';
      browserTrigger(element, 'change');
      expect(element).toBeValid();
      expect(element).toBeDirty();
    });
  });


  describe('ngOptions', function() {
    function createSelect(attrs, blank, unknown) {
      var html = '<select';
      forEach(attrs, function(value, key) {
        if (isBoolean(value)) {
          if (value) html += ' ' + key;
        } else {
          html += ' ' + key + '="' + value + '"';
        }
      });
      html += '>' +
        (blank ? (isString(blank) ? blank : '<option value="">blank</option>') : '') +
        (unknown ? (isString(unknown) ? unknown : '<option value="?">unknown</option>') : '') +
      '</select>';

      compile(html);
    }

    function createSingleSelect(blank, unknown) {
      createSelect({
        'ng-model':'selected',
        'ng-options':'value.name for value in values'
      }, blank, unknown);
    }

    function createMultiSelect(blank, unknown) {
      createSelect({
        'ng-model':'selected',
        'multiple':true,
        'ng-options':'value.name for value in values'
      }, blank, unknown);
    }


    it('should throw when not formated "? for ? in ?"', function() {
      expect(function() {
          compile('<select ng-model="selected" ng-options="i dont parse"></select>');
        }).toThrowMinErr('ngOptions', 'iexp', /Expected expression in form of/);
    });


    it('should render a list', function() {
      createSingleSelect();

      scope.$apply(function() {
        scope.values = [{name: 'A'}, {name: 'B'}, {name: 'C'}];
        scope.selected = scope.values[0];
      });

      var options = element.find('option');
      expect(options.length).toEqual(3);
      expect(sortedHtml(options[0])).toEqual('<option value="0">A</option>');
      expect(sortedHtml(options[1])).toEqual('<option value="1">B</option>');
      expect(sortedHtml(options[2])).toEqual('<option value="2">C</option>');
    });

    it('should render zero as a valid display value', function() {
      createSingleSelect();

      scope.$apply(function() {
        scope.values = [{name: 0}, {name: 1}, {name: 2}];
        scope.selected = scope.values[0];
      });

      var options = element.find('option');
      expect(options.length).toEqual(3);
      expect(sortedHtml(options[0])).toEqual('<option value="0">0</option>');
      expect(sortedHtml(options[1])).toEqual('<option value="1">1</option>');
      expect(sortedHtml(options[2])).toEqual('<option value="2">2</option>');
    });


    it('should render an object', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'value as key for (key, value) in object'
      });

      scope.$apply(function() {
        scope.object = {'red': 'FF0000', 'green': '00FF00', 'blue': '0000FF'};
        scope.selected = scope.object.red;
      });

      var options = element.find('option');
      expect(options.length).toEqual(3);
      expect(sortedHtml(options[0])).toEqual('<option value="blue">blue</option>');
      expect(sortedHtml(options[1])).toEqual('<option value="green">green</option>');
      expect(sortedHtml(options[2])).toEqual('<option value="red">red</option>');
      expect(options[2].selected).toEqual(true);

      scope.$apply(function() {
        scope.object.azur = '8888FF';
      });

      options = element.find('option');
      expect(options[3].selected).toEqual(true);
    });


    it('should grow list', function() {
      createSingleSelect();

      scope.$apply(function() {
        scope.values = [];
      });

      expect(element.find('option').length).toEqual(1); // because we add special empty option
      expect(sortedHtml(element.find('option')[0])).toEqual('<option value="?"></option>');

      scope.$apply(function() {
        scope.values.push({name:'A'});
        scope.selected = scope.values[0];
      });

      expect(element.find('option').length).toEqual(1);
      expect(sortedHtml(element.find('option')[0])).toEqual('<option value="0">A</option>');

      scope.$apply(function() {
        scope.values.push({name:'B'});
      });

      expect(element.find('option').length).toEqual(2);
      expect(sortedHtml(element.find('option')[0])).toEqual('<option value="0">A</option>');
      expect(sortedHtml(element.find('option')[1])).toEqual('<option value="1">B</option>');
    });


    it('should shrink list', function() {
      createSingleSelect();

      scope.$apply(function() {
        scope.values = [{name:'A'}, {name:'B'}, {name:'C'}];
        scope.selected = scope.values[0];
      });

      expect(element.find('option').length).toEqual(3);

      scope.$apply(function() {
        scope.values.pop();
      });

      expect(element.find('option').length).toEqual(2);
      expect(sortedHtml(element.find('option')[0])).toEqual('<option value="0">A</option>');
      expect(sortedHtml(element.find('option')[1])).toEqual('<option value="1">B</option>');

      scope.$apply(function() {
        scope.values.pop();
      });

      expect(element.find('option').length).toEqual(1);
      expect(sortedHtml(element.find('option')[0])).toEqual('<option value="0">A</option>');

      scope.$apply(function() {
        scope.values.pop();
        scope.selected = null;
      });

      expect(element.find('option').length).toEqual(1); // we add back the special empty option
    });


    it('should shrink and then grow list', function() {
      createSingleSelect();

      scope.$apply(function() {
        scope.values = [{name:'A'}, {name:'B'}, {name:'C'}];
        scope.selected = scope.values[0];
      });

      expect(element.find('option').length).toEqual(3);

      scope.$apply(function() {
        scope.values = [{name: '1'}, {name: '2'}];
        scope.selected = scope.values[0];
      });

      expect(element.find('option').length).toEqual(2);

      scope.$apply(function() {
        scope.values = [{name: 'A'}, {name: 'B'}, {name: 'C'}];
        scope.selected = scope.values[0];
      });

      expect(element.find('option').length).toEqual(3);
    });


    it('should update list', function() {
      createSingleSelect();

      scope.$apply(function() {
        scope.values = [{name: 'A'}, {name: 'B'}, {name: 'C'}];
        scope.selected = scope.values[0];
      });

      scope.$apply(function() {
        scope.values = [{name: 'B'}, {name: 'C'}, {name: 'D'}];
        scope.selected = scope.values[0];
      });

      var options = element.find('option');
      expect(options.length).toEqual(3);
      expect(sortedHtml(options[0])).toEqual('<option value="0">B</option>');
      expect(sortedHtml(options[1])).toEqual('<option value="1">C</option>');
      expect(sortedHtml(options[2])).toEqual('<option value="2">D</option>');
    });


    it('should preserve existing options', function() {
      createSingleSelect(true);

      scope.$apply(function() {
        scope.values = [];
      });

      expect(element.find('option').length).toEqual(1);

      scope.$apply(function() {
        scope.values = [{name: 'A'}];
        scope.selected = scope.values[0];
      });

      expect(element.find('option').length).toEqual(2);
      expect(jqLite(element.find('option')[0]).text()).toEqual('blank');
      expect(jqLite(element.find('option')[1]).text()).toEqual('A');

      scope.$apply(function() {
        scope.values = [];
        scope.selected = null;
      });

      expect(element.find('option').length).toEqual(1);
      expect(jqLite(element.find('option')[0]).text()).toEqual('blank');
    });

    it('should ignore $ and $$ properties', function() {
      createSelect({
        'ng-options': 'key as value for (key, value) in object',
        'ng-model': 'selected'
      });

      scope.$apply(function() {
        scope.object = {'regularProperty': 'visible', '$$private': 'invisible', '$property': 'invisible'};
        scope.selected = 'regularProperty';
      });

      var options = element.find('option');
      expect(options.length).toEqual(1);
      expect(sortedHtml(options[0])).toEqual('<option value="regularProperty">visible</option>');
    });

    it('should allow expressions over multiple lines', function() {
      scope.isNotFoo = function(item) {
        return item.name !== 'Foo';
      };

      createSelect({
        'ng-options': 'key.id\n' +
          'for key in object\n' +
          '| filter:isNotFoo',
        'ng-model': 'selected'
      });

      scope.$apply(function() {
        scope.object = [{'id': 1, 'name': 'Foo'},
                        {'id': 2, 'name': 'Bar'},
                        {'id': 3, 'name': 'Baz'}];
        scope.selected = scope.object[0];
      });

      var options = element.find('option');
      expect(options.length).toEqual(3);
      expect(sortedHtml(options[1])).toEqual('<option value="0">2</option>');
      expect(sortedHtml(options[2])).toEqual('<option value="1">3</option>');
    });

    it('should not update selected property of an option element on digest with no change event',
        function() {
      // ng-options="value.name for value in values"
      // ng-model="selected"
      createSingleSelect();

      scope.$apply(function() {
        scope.values = [{name: 'A'}, {name: 'B'}, {name: 'C'}];
        scope.selected = scope.values[0];
      });

      var options = element.find('option');

      expect(scope.selected).toEqual({ name: 'A' });
      expect(options.eq(0).prop('selected')).toBe(true);
      expect(options.eq(1).prop('selected')).toBe(false);

      var optionToSelect = options.eq(1);

      expect(optionToSelect.text()).toBe('B');

      optionToSelect.prop('selected', true);
      scope.$digest();

      expect(optionToSelect.prop('selected')).toBe(true);
      expect(scope.selected).toBe(scope.values[0]);
    });

    describe('binding', function() {

      it('should bind to scope value', function() {
        createSingleSelect();

        scope.$apply(function() {
          scope.values = [{name: 'A'}, {name: 'B'}];
          scope.selected = scope.values[0];
        });

        expect(element.val()).toEqual('0');

        scope.$apply(function() {
          scope.selected = scope.values[1];
        });

        expect(element.val()).toEqual('1');
      });


      it('should bind to scope value and group', function() {
        createSelect({
          'ng-model': 'selected',
          'ng-options': 'item.name group by item.group for item in values'
        });

        scope.$apply(function() {
          scope.values = [{name: 'A'},
                          {name: 'B', group: 'first'},
                          {name: 'C', group: 'second'},
                          {name: 'D', group: 'first'},
                          {name: 'E', group: 'second'}];
          scope.selected = scope.values[3];
        });

        expect(element.val()).toEqual('3');

        var first = jqLite(element.find('optgroup')[0]);
        var b = jqLite(first.find('option')[0]);
        var d = jqLite(first.find('option')[1]);
        expect(first.attr('label')).toEqual('first');
        expect(b.text()).toEqual('B');
        expect(d.text()).toEqual('D');

        var second = jqLite(element.find('optgroup')[1]);
        var c = jqLite(second.find('option')[0]);
        var e = jqLite(second.find('option')[1]);
        expect(second.attr('label')).toEqual('second');
        expect(c.text()).toEqual('C');
        expect(e.text()).toEqual('E');

        scope.$apply(function() {
          scope.selected = scope.values[0];
        });

        expect(element.val()).toEqual('0');
      });


      it('should bind to scope value and track/identify objects', function() {
        createSelect({
          'ng-model': 'selected',
          'ng-options': 'item as item.name for item in values track by item.id'
        });

        scope.$apply(function() {
          scope.values = [{id: 1, name: 'first'},
                          {id: 2, name: 'second'},
                          {id: 3, name: 'third'},
                          {id: 4, name: 'forth'}];
          scope.selected = {id: 2};
        });

        expect(element.val()).toEqual('2');

        var first = jqLite(element.find('option')[0]);
        expect(first.text()).toEqual('first');
        expect(first.attr('value')).toEqual('1');
        var forth = jqLite(element.find('option')[3]);
        expect(forth.text()).toEqual('forth');
        expect(forth.attr('value')).toEqual('4');

        scope.$apply(function() {
          scope.selected = scope.values[3];
        });

        expect(element.val()).toEqual('4');
      });


      it('should bind to scope value through experession', function() {
        createSelect({
          'ng-model': 'selected',
          'ng-options': 'item.id as item.name for item in values'
        });

        scope.$apply(function() {
          scope.values = [{id: 10, name: 'A'}, {id: 20, name: 'B'}];
          scope.selected = scope.values[0].id;
        });

        expect(element.val()).toEqual('0');

        scope.$apply(function() {
          scope.selected = scope.values[1].id;
        });

        expect(element.val()).toEqual('1');
      });

      it('should update options in the DOM', function() {
        compile(
          '<select ng-model="selected" ng-options="item.id as item.name for item in values"></select>'
        );

        scope.$apply(function() {
          scope.values = [{id: 10, name: 'A'}, {id: 20, name: 'B'}];
          scope.selected = scope.values[0].id;
        });

        scope.$apply(function() {
          scope.values[0].name = 'C';
        });

        var options = element.find('option');
        expect(options.length).toEqual(2);
        expect(sortedHtml(options[0])).toEqual('<option value="0">C</option>');
        expect(sortedHtml(options[1])).toEqual('<option value="1">B</option>');
      });


      it('should bind to object key', function() {
        createSelect({
          'ng-model': 'selected',
          'ng-options': 'key as value for (key, value) in object'
        });

        scope.$apply(function() {
          scope.object = {red: 'FF0000', green: '00FF00', blue: '0000FF'};
          scope.selected = 'green';
        });

        expect(element.val()).toEqual('green');

        scope.$apply(function() {
          scope.selected = 'blue';
        });

        expect(element.val()).toEqual('blue');
      });


      it('should bind to object value', function() {
        createSelect({
          'ng-model': 'selected',
          'ng-options': 'value as key for (key, value) in object'
        });

        scope.$apply(function() {
          scope.object = {red: 'FF0000', green: '00FF00', blue:'0000FF'};
          scope.selected = '00FF00';
        });

        expect(element.val()).toEqual('green');

        scope.$apply(function() {
          scope.selected = '0000FF';
        });

        expect(element.val()).toEqual('blue');
      });


      it('should insert a blank option if bound to null', function() {
        createSingleSelect();

        scope.$apply(function() {
          scope.values = [{name: 'A'}];
          scope.selected = null;
        });

        expect(element.find('option').length).toEqual(2);
        expect(element.val()).toEqual('');
        expect(jqLite(element.find('option')[0]).val()).toEqual('');

        scope.$apply(function() {
          scope.selected = scope.values[0];
        });

        expect(element.val()).toEqual('0');
        expect(element.find('option').length).toEqual(1);
      });


      it('should reuse blank option if bound to null', function() {
        createSingleSelect(true);

        scope.$apply(function() {
          scope.values = [{name: 'A'}];
          scope.selected = null;
        });

        expect(element.find('option').length).toEqual(2);
        expect(element.val()).toEqual('');
        expect(jqLite(element.find('option')[0]).val()).toEqual('');

        scope.$apply(function() {
          scope.selected = scope.values[0];
        });

        expect(element.val()).toEqual('0');
        expect(element.find('option').length).toEqual(2);
      });


      it('should insert a unknown option if bound to something not in the list', function() {
        createSingleSelect();

        scope.$apply(function() {
          scope.values = [{name: 'A'}];
          scope.selected = {};
        });

        expect(element.find('option').length).toEqual(2);
        expect(element.val()).toEqual('?');
        expect(jqLite(element.find('option')[0]).val()).toEqual('?');

        scope.$apply(function() {
          scope.selected = scope.values[0];
        });

        expect(element.val()).toEqual('0');
        expect(element.find('option').length).toEqual(1);
      });


      it('should select correct input if previously selected option was "?"', function() {
        createSingleSelect();

        scope.$apply(function() {
          scope.values = [{name: 'A'}, {name: 'B'}];
          scope.selected = {};
        });

        expect(element.find('option').length).toEqual(3);
        expect(element.val()).toEqual('?');
        expect(element.find('option').eq(0).val()).toEqual('?');

        browserTrigger(element.find('option').eq(1));
        expect(element.val()).toEqual('0');
        expect(element.find('option').eq(0).prop('selected')).toBeTruthy();
        expect(element.find('option').length).toEqual(2);
      });


      it('should ensure that at least one option element has the "selected" attribute', function() {
        function countSelected() {
          var count = 0;
          forEach(element.find('option'), function(option) {
            count += option.getAttribute('selected') ? 1 : 0;
          });
          return count;
        }


        createSelect({
          'ng-model': 'selected',
          'ng-options': 'item.id as item.name for item in values'
        });

        scope.$apply(function() {
          scope.values = [{id: 10, name: 'A'}, {id: 20, name: 'B'}];
        });
        expect(element.val()).toEqual('?');
        expect(countSelected()).toEqual(1);

        scope.$apply(function() {
          scope.selected = 10;
        });
        // Here the ? option should disappear and the first real option should have selected attribute
        expect(element.val()).toEqual('0');
        expect(countSelected()).toEqual(1);

        // Here the selected value is changed but we don't change the selected attribute
        scope.$apply(function() {
          scope.selected = 20;
        });
        expect(element.val()).toEqual('1');
        expect(countSelected()).toEqual(1);

        scope.$apply(function() {
          scope.values.push({id: 30, name: 'C'});
        });
        expect(element.val()).toEqual('1');
        expect(countSelected()).toEqual(1);

        // Here the ? option should reappear and have selected attribute
        scope.$apply(function() {
          scope.selected = undefined;
        });
        expect(element.val()).toEqual('?');
        expect(countSelected()).toEqual(1);
      });
    });


    describe('blank option', function () {

      it('should be compiled as template, be watched and updated', function () {
        var option;
        createSingleSelect('<option value="">blank is {{blankVal}}</option>');

        scope.$apply(function() {
          scope.blankVal = 'so blank';
          scope.values = [{name: 'A'}];
        });

        // check blank option is first and is compiled
        expect(element.find('option').length).toBe(2);
        option = element.find('option').eq(0);
        expect(option.val()).toBe('');
        expect(option.text()).toBe('blank is so blank');

        scope.$apply(function() {
          scope.blankVal = 'not so blank';
        });

        // check blank option is first and is compiled
        expect(element.find('option').length).toBe(2);
        option = element.find('option').eq(0);
        expect(option.val()).toBe('');
        expect(option.text()).toBe('blank is not so blank');
      });


      it('should support binding via ngBindTemplate directive', function () {
        var option;
        createSingleSelect('<option value="" ng-bind-template="blank is {{blankVal}}"></option>');

        scope.$apply(function() {
          scope.blankVal = 'so blank';
          scope.values = [{name: 'A'}];
        });

        // check blank option is first and is compiled
        expect(element.find('option').length).toBe(2);
        option = element.find('option').eq(0);
        expect(option.val()).toBe('');
        expect(option.text()).toBe('blank is so blank');
      });


      it('should support biding via ngBind attribute', function () {
        var option;
        createSingleSelect('<option value="" ng-bind="blankVal"></option>');

        scope.$apply(function() {
          scope.blankVal = 'is blank';
          scope.values = [{name: 'A'}];
        });

        // check blank option is first and is compiled
        expect(element.find('option').length).toBe(2);
        option = element.find('option').eq(0);
        expect(option.val()).toBe('');
        expect(option.text()).toBe('is blank');
      });


      it('should be rendered with the attributes preserved', function () {
        var option;
        createSingleSelect('<option value="" class="coyote" id="road-runner" ' +
          'custom-attr="custom-attr">{{blankVal}}</option>');

        scope.$apply(function() {
          scope.blankVal = 'is blank';
        });

        // check blank option is first and is compiled
        option = element.find('option').eq(0);
        expect(option.hasClass('coyote')).toBeTruthy();
        expect(option.attr('id')).toBe('road-runner');
        expect(option.attr('custom-attr')).toBe('custom-attr');
      });

      it('should be selected, if it is available and no other option is selected', function() {
        // selectedIndex is used here because jqLite incorrectly reports element.val()
        scope.$apply(function() {
          scope.values = [{name: 'A'}];
        });
        createSingleSelect(true);
        // ensure the first option (the blank option) is selected
        expect(element[0].selectedIndex).toEqual(0);
        scope.$digest();
        // ensure the option has not changed following the digest
        expect(element[0].selectedIndex).toEqual(0);
      });
    });


    describe('on change', function() {

      it('should update model on change', function() {
        createSingleSelect();

        scope.$apply(function() {
          scope.values = [{name: 'A'}, {name: 'B'}];
          scope.selected = scope.values[0];
        });

        expect(element.val()).toEqual('0');

        element.val('1');
        browserTrigger(element, 'change');
        expect(scope.selected).toEqual(scope.values[1]);
      });


      it('should update model on change through expression', function() {
        createSelect({
          'ng-model': 'selected',
          'ng-options': 'item.id as item.name for item in values'
        });

        scope.$apply(function() {
          scope.values = [{id: 10, name: 'A'}, {id: 20, name: 'B'}];
          scope.selected = scope.values[0].id;
        });

        expect(element.val()).toEqual('0');

        element.val('1');
        browserTrigger(element, 'change');
        expect(scope.selected).toEqual(scope.values[1].id);
      });


      it('should update model to null on change', function() {
        createSingleSelect(true);

        scope.$apply(function() {
          scope.values = [{name: 'A'}, {name: 'B'}];
          scope.selected = scope.values[0];
          element.val('0');
        });

        element.val('');
        browserTrigger(element, 'change');
        expect(scope.selected).toEqual(null);
      });


      // Regression https://github.com/angular/angular.js/issues/7855
      it('should update the model with ng-change', function() {
        createSelect({
          'ng-change':'change()',
          'ng-model':'selected',
          'ng-options':'value for value in values'
        });

        scope.$apply(function() {
          scope.values = ['A', 'B'];
          scope.selected = 'A';
        });

        scope.change = function() {
          scope.selected = 'A';
        };

        element.find('option')[1].selected = true;

        browserTrigger(element, 'change');
        expect(element.find('option')[0].selected).toBeTruthy();
        expect(scope.selected).toEqual('A');
      });
    });

    describe('disabled blank', function() {
      it('should select disabled blank by default', function() {
        var html = '<select ng-model="someModel" ng-options="c for c in choices">' +
                     '<option value="" disabled>Choose One</option>' +
                   '</select>';
        scope.$apply(function() {
          scope.choices = ['A', 'B', 'C'];
        });

        compile(html);

        var options = element.find('option');
        var optionToSelect = options.eq(0);
        expect(optionToSelect.text()).toBe('Choose One');
        expect(optionToSelect.prop('selected')).toBe(true);
        expect(element[0].value).toBe('');

        dealoc(element);
      });


      it('should select disabled blank by default when select is required', function() {
        var html = '<select ng-model="someModel" ng-options="c for c in choices" required>' +
                     '<option value="" disabled>Choose One</option>' +
                   '</select>';
        scope.$apply(function() {
          scope.choices = ['A', 'B', 'C'];
        });

        compile(html);

        var options = element.find('option');
        var optionToSelect = options.eq(0);
        expect(optionToSelect.text()).toBe('Choose One');
        expect(optionToSelect.prop('selected')).toBe(true);
        expect(element[0].value).toBe('');

        dealoc(element);
      });
    });

    describe('select-many', function() {

      it('should read multiple selection', function() {
        createMultiSelect();

        scope.$apply(function() {
          scope.values = [{name: 'A'}, {name: 'B'}];
          scope.selected = [];
        });

        expect(element.find('option').length).toEqual(2);
        expect(element.find('option')[0].selected).toBeFalsy();
        expect(element.find('option')[1].selected).toBeFalsy();

        scope.$apply(function() {
          scope.selected.push(scope.values[1]);
        });

        expect(element.find('option').length).toEqual(2);
        expect(element.find('option')[0].selected).toBeFalsy();
        expect(element.find('option')[1].selected).toBeTruthy();

        scope.$apply(function() {
          scope.selected.push(scope.values[0]);
        });

        expect(element.find('option').length).toEqual(2);
        expect(element.find('option')[0].selected).toBeTruthy();
        expect(element.find('option')[1].selected).toBeTruthy();
      });


      it('should update model on change', function() {
        createMultiSelect();

        scope.$apply(function() {
          scope.values = [{name: 'A'}, {name: 'B'}];
          scope.selected = [];
        });

        element.find('option')[0].selected = true;

        browserTrigger(element, 'change');
        expect(scope.selected).toEqual([scope.values[0]]);
      });


      it('should select from object', function() {
        createSelect({
          'ng-model':'selected',
          'multiple':true,
          'ng-options':'key as value for (key,value) in values'
        });
        scope.values = {'0':'A', '1':'B'};

        scope.selected = ['1'];
        scope.$digest();
        expect(element.find('option')[1].selected).toBe(true);

        element.find('option')[0].selected = true;
        browserTrigger(element, 'change');
        expect(scope.selected).toEqual(['0', '1']);

        element.find('option')[1].selected = false;
        browserTrigger(element, 'change');
        expect(scope.selected).toEqual(['0']);
      });

      it('should deselect all options when model is emptied', function() {
        createMultiSelect();
        scope.$apply(function() {
          scope.values = [{name: 'A'}, {name: 'B'}];
          scope.selected = [scope.values[0]];
        });
        expect(element.find('option')[0].selected).toEqual(true);

        scope.$apply(function() {
          scope.selected.pop();
        });

        expect(element.find('option')[0].selected).toEqual(false);
      });
    });


    describe('ngRequired', function() {

      it('should allow bindings on ngRequired', function() {
        createSelect({
          'ng-model': 'value',
          'ng-options': 'item.name for item in values',
          'ng-required': 'required'
        }, true);


        scope.$apply(function() {
          scope.values = [{name: 'A', id: 1}, {name: 'B', id: 2}];
          scope.required = false;
        });

        element.val('');
        browserTrigger(element, 'change');
        expect(element).toBeValid();

        scope.$apply(function() {
          scope.required = true;
        });
        expect(element).toBeInvalid();

        scope.$apply(function() {
          scope.value = scope.values[0];
        });
        expect(element).toBeValid();

        element.val('');
        browserTrigger(element, 'change');
        expect(element).toBeInvalid();

        scope.$apply(function() {
          scope.required = false;
        });
        expect(element).toBeValid();
      });


      it('should treat an empty array as invalid when `multiple` attribute used', function() {
        createSelect({
          'ng-model': 'value',
          'ng-options': 'item.name for item in values',
          'ng-required': 'required',
          'multiple': ''
        }, true);

        scope.$apply(function() {
          scope.value = [];
          scope.values = [{name: 'A', id: 1}, {name: 'B', id: 2}];
          scope.required = true;
        });
        expect(element).toBeInvalid();

        scope.$apply(function() {
          // ngModelWatch does not set objectEquality flag
          // array must be replaced in order to trigger $formatters
          scope.value = [scope.values[0]];
        });
        expect(element).toBeValid();
      });


      it('should allow falsy values as values', function() {
        createSelect({
          'ng-model': 'value',
          'ng-options': 'item.value as item.name for item in values',
          'ng-required': 'required'
        }, true);

        scope.$apply(function() {
          scope.values = [{name: 'True', value: true}, {name: 'False', value: false}];
          scope.required = false;
        });

        element.val('1');
        browserTrigger(element, 'change');
        expect(element).toBeValid();
        expect(scope.value).toBe(false);

        scope.$apply(function() {
          scope.required = true;
        });
        expect(element).toBeValid();
        expect(scope.value).toBe(false);
      });
    });
  });


  describe('option', function() {

    it('should populate value attribute on OPTION', function() {
      compile('<select ng-model="x"><option selected>abc</option></select>');
      expect(element).toEqualSelect(['? undefined:undefined ?'], 'abc');
    });

    it('should ignore value if already exists', function() {
      compile('<select ng-model="x"><option value="abc">xyz</option></select>');
      expect(element).toEqualSelect(['? undefined:undefined ?'], 'abc');
    });

    it('should set value even if self closing HTML', function() {
      scope.x = 'hello';
      compile('<select ng-model="x"><option>hello</select>');
      expect(element).toEqualSelect(['hello']);
    });

    it('should not blow up when option directive is found inside of a datalist',
        inject(function($compile, $rootScope) {
      var element = $compile('<div>' +
                               '<datalist><option>some val</option></datalist>' +
                               '<span>{{foo}}</span>' +
                             '</div>')($rootScope);

      $rootScope.foo = 'success';
      $rootScope.$digest();
      expect(element.find('span').text()).toBe('success');
      dealoc(element);
    }));

    it('should throw an exception if an option value interpolates to "hasOwnProperty"', function() {
      scope.hasOwnPropertyOption = "hasOwnProperty";
      expect(function() {
        compile('<select ng-model="x">'+
                  '<option>{{hasOwnPropertyOption}}</option>'+
                '</select>');
      }).toThrowMinErr('ng','badname', 'hasOwnProperty is not a valid "option value" name');
    });

  });
});
