'use strict';

describe('select', function() {
  var scope, formElement, element, $compile;

  function compile(html) {
    formElement = jqLite('<form name="form">' + html + '</form>');
    element = formElement.find('select');
    $compile(formElement)(scope);
    scope.$apply();
  }

  beforeEach(inject(function($injector, $rootScope) {
    scope = $rootScope;
    $compile = $injector.get('$compile');
    formElement = element = null;
  }));

  afterEach(function() {
    dealoc(formElement);
  });


  describe('select-one', function() {

    it('should compile children of a select without a ng:model, but not create a model for it',
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


    it('should require', function() {
      compile(
        '<select name="select" ng:model="selection" required ng:change="change()">' +
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

      expect(scope.form.select.error.REQUIRED).toBeFalsy();
      expect(element).toBeValid();
      expect(element).toBePristine();

      scope.$apply(function() {
        scope.selection = '';
      });

      expect(scope.form.select.error.REQUIRED).toBeTruthy();
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
        '<select name="select" ng:model="selection">' +
          '<option value=""></option>' +
          '<option value="c">C</option>' +
        '</select>');

      expect(element).toBeValid();
      expect(element).toBePristine();
    });
  });


  describe('select-multiple', function() {

    it('should support type="select-multiple"', function() {
      compile(
        '<select ng:model="selection" multiple>' +
          '<option>A</option>' +
          '<option>B</option>' +
        '</select>');

      scope.$apply(function() {
        scope.selection = ['A'];
      });

      expect(element[0].childNodes[0].selected).toEqual(true);
    });


    it('should require', function() {
      compile(
        '<select name="select" ng:model="selection" multiple required>' +
          '<option>A</option>' +
          '<option>B</option>' +
        '</select>');

      scope.$apply(function() {
        scope.selection = [];
      });

      expect(scope.form.select.error.REQUIRED).toBeTruthy();
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


  describe('ng:options', function() {
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
        'ng:model':'selected',
        'ng:options':'value.name for value in values'
      }, blank, unknown);
    }

    function createMultiSelect(blank, unknown) {
      createSelect({
        'ng:model':'selected',
        'multiple':true,
        'ng:options':'value.name for value in values'
      }, blank, unknown);
    }


    it('should throw when not formated "? for ? in ?"', function() {
      expect(function() {
        compile('<select ng:model="selected" ng:options="i dont parse"></select>');
      }).toThrow("Expected ng:options in form of '_select_ (as _label_)? for (_key_,)?_value_ in" +
                 " _collection_' but got 'i dont parse'.");
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


    it('should render an object', function() {
      createSelect({
        'ng:model': 'selected',
        'ng:options': 'value as key for (key, value) in object'
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
          'ng:model': 'selected',
          'ng:options': 'item.name group by item.group for item in values'
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


      it('should bind to scope value through experession', function() {
        createSelect({
          'ng:model': 'selected',
          'ng:options': 'item.id as item.name for item in values'
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


      it('should bind to object key', function() {
        createSelect({
          'ng:model': 'selected',
          'ng:options': 'key as value for (key, value) in object'
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
          'ng:model': 'selected',
          'ng:options': 'value as key for (key, value) in object'
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


      it('should support binding via ng:bind-template attribute', function () {
        var option;
        createSingleSelect('<option value="" ng:bind-template="blank is {{blankVal}}"></option>');

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


      it('should support biding via ng:bind attribute', function () {
        var option;
        createSingleSelect('<option value="" ng:bind="blankVal"></option>');

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
          'ng:model': 'selected',
          'ng:options': 'item.id as item.name for item in values'
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
          'ng:model':'selected',
          'multiple':true,
          'ng:options':'key as value for (key,value) in values'
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
    });


    describe('ng:required', function() {

      it('should allow bindings on ng:required', function() {
        createSelect({
          'ng:model': 'value',
          'ng:options': 'item.name for item in values',
          'ng:required': '{{required}}'
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
    });
  });
});
