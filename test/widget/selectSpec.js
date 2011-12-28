'use strict';

describe('select', function() {
  var compile = null, element = null, scope = null;

  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope;
    element = null;
    compile = function(html, parent) {
      if (parent) {
        parent.html(html);
        element = parent.children();
      } else {
        element = jqLite(html);
      }
      element = $compile(element)($rootScope);
      scope.$apply();
      return scope;
    };
  }));

  afterEach(function() {
    dealoc(element);
  });


  describe('select-one', function() {

    it('should compile children of a select without a name, but not create a model for it',
        function() {
      compile('<select>' +
                '<option selected="true">{{a}}</option>' +
                '<option value="">{{b}}</option>' +
                '<option>C</option>' +
              '</select>');
      scope.a = 'foo';
      scope.b = 'bar';
      scope.$digest();

      expect(element.text()).toBe('foobarC');
    });

    it('should require', inject(function($formFactory) {
      compile('<select name="select" ng:model="selection" required ng:change="log=log+\'change;\'">' +
          '<option value=""></option>' +
          '<option value="c">C</option>' +
        '</select>');
      scope.log = '';
      scope.selection = 'c';
      scope.$digest();
      expect($formFactory.forElement(element).select.$error.REQUIRED).toEqual(undefined);
      expect(element).toBeValid();
      expect(element).toBePristine();

      scope.selection = '';
      scope.$digest();
      expect($formFactory.forElement(element).select.$error.REQUIRED).toEqual(true);
      expect(element).toBeInvalid();
      expect(element).toBePristine();
      expect(scope.log).toEqual('');

      element[0].value = 'c';
      browserTrigger(element, 'change');
      expect(element).toBeValid();
      expect(element).toBeDirty();
      expect(scope.log).toEqual('change;');
    }));

    it('should not be invalid if no require', function() {
      compile('<select name="select" ng:model="selection">' +
          '<option value=""></option>' +
          '<option value="c">C</option>' +
        '</select>');

      expect(element).toBeValid();
      expect(element).toBePristine();
    });

  });


  describe('select-multiple', function() {
    it('should support type="select-multiple"', function() {
      compile('<select ng:model="selection" multiple>' +
                '<option>A</option>' +
                '<option>B</option>' +
              '</select>');
      scope.selection = ['A'];
      scope.$digest();
      expect(element[0].childNodes[0].selected).toEqual(true);
    });

    it('should require', inject(function($formFactory) {
      compile('<select name="select" ng:model="selection" multiple required>' +
          '<option>A</option>' +
          '<option>B</option>' +
        '</select>');

      scope.selection = [];
      scope.$digest();
      expect($formFactory.forElement(element).select.$error.REQUIRED).toEqual(true);
      expect(element).toBeInvalid();
      expect(element).toBePristine();

      scope.selection = ['A'];
      scope.$digest();
      expect(element).toBeValid();
      expect(element).toBePristine();

      element[0].value = 'B';
      browserTrigger(element, 'change');
      expect(element).toBeValid();
      expect(element).toBeDirty();
    }));

  });


  describe('ng:options', function() {
    var select, scope;

    function createSelect(attrs, blank, unknown){
      var html = '<select';
      forEach(attrs, function(value, key){
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
      select = jqLite(html);
      scope = compile(select);
    }

    function createSingleSelect(blank, unknown){
      createSelect({
        'ng:model':'selected',
        'ng:options':'value.name for value in values'
      }, blank, unknown);
    }

    function createMultiSelect(blank, unknown){
      createSelect({
        'ng:model':'selected',
        'multiple':true,
        'ng:options':'value.name for value in values'
      }, blank, unknown);
    }

    afterEach(function() {
      dealoc(select);
      dealoc(scope);
    });

    it('should throw when not formated "? for ? in ?"', inject(function($rootScope, $exceptionHandler) {
      expect(function() {
        compile('<select ng:model="selected" ng:options="i dont parse"></select>');
      }).toThrow("Expected ng:options in form of '_select_ (as _label_)? for (_key_,)?_value_ in" +
                 " _collection_' but got 'i dont parse'.");
    }));

    it('should render a list', function() {
      createSingleSelect();
      scope.values = [{name:'A'}, {name:'B'}, {name:'C'}];
      scope.selected = scope.values[0];
      scope.$digest();
      var options = select.find('option');
      expect(options.length).toEqual(3);
      expect(sortedHtml(options[0])).toEqual('<option value="0">A</option>');
      expect(sortedHtml(options[1])).toEqual('<option value="1">B</option>');
      expect(sortedHtml(options[2])).toEqual('<option value="2">C</option>');
    });

    it('should render an object', function() {
      createSelect({
        'ng:model':'selected',
        'ng:options': 'value as key for (key, value) in object'
      });
      scope.object = {'red':'FF0000', 'green':'00FF00', 'blue':'0000FF'};
      scope.selected = scope.object.red;
      scope.$digest();
      var options = select.find('option');
      expect(options.length).toEqual(3);
      expect(sortedHtml(options[0])).toEqual('<option value="blue">blue</option>');
      expect(sortedHtml(options[1])).toEqual('<option value="green">green</option>');
      expect(sortedHtml(options[2])).toEqual('<option value="red">red</option>');
      expect(options[2].selected).toEqual(true);

      scope.object.azur = '8888FF';
      scope.$digest();
      options = select.find('option');
      expect(options[3].selected).toEqual(true);
    });

    it('should grow list', function() {
      createSingleSelect();
      scope.values = [];
      scope.$digest();
      expect(select.find('option').length).toEqual(1); // because we add special empty option
      expect(sortedHtml(select.find('option')[0])).toEqual('<option value="?"></option>');

      scope.values.push({name:'A'});
      scope.selected = scope.values[0];
      scope.$digest();
      expect(select.find('option').length).toEqual(1);
      expect(sortedHtml(select.find('option')[0])).toEqual('<option value="0">A</option>');

      scope.values.push({name:'B'});
      scope.$digest();
      expect(select.find('option').length).toEqual(2);
      expect(sortedHtml(select.find('option')[0])).toEqual('<option value="0">A</option>');
      expect(sortedHtml(select.find('option')[1])).toEqual('<option value="1">B</option>');
    });

    it('should shrink list', function() {
      createSingleSelect();
      scope.values = [{name:'A'}, {name:'B'}, {name:'C'}];
      scope.selected = scope.values[0];
      scope.$digest();
      expect(select.find('option').length).toEqual(3);

      scope.values.pop();
      scope.$digest();
      expect(select.find('option').length).toEqual(2);
      expect(sortedHtml(select.find('option')[0])).toEqual('<option value="0">A</option>');
      expect(sortedHtml(select.find('option')[1])).toEqual('<option value="1">B</option>');

      scope.values.pop();
      scope.$digest();
      expect(select.find('option').length).toEqual(1);
      expect(sortedHtml(select.find('option')[0])).toEqual('<option value="0">A</option>');

      scope.values.pop();
      scope.selected = null;
      scope.$digest();
      expect(select.find('option').length).toEqual(1); // we add back the special empty option
    });

    it('should shrink and then grow list', function() {
      createSingleSelect();
      scope.values = [{name:'A'}, {name:'B'}, {name:'C'}];
      scope.selected = scope.values[0];
      scope.$digest();
      expect(select.find('option').length).toEqual(3);

      scope.values = [{name:'1'}, {name:'2'}];
      scope.selected = scope.values[0];
      scope.$digest();
      expect(select.find('option').length).toEqual(2);

      scope.values = [{name:'A'}, {name:'B'}, {name:'C'}];
      scope.selected = scope.values[0];
      scope.$digest();
      expect(select.find('option').length).toEqual(3);
    });

    it('should update list', function() {
      createSingleSelect();
      scope.values = [{name:'A'}, {name:'B'}, {name:'C'}];
      scope.selected = scope.values[0];
      scope.$digest();

      scope.values = [{name:'B'}, {name:'C'}, {name:'D'}];
      scope.selected = scope.values[0];
      scope.$digest();
      var options = select.find('option');
      expect(options.length).toEqual(3);
      expect(sortedHtml(options[0])).toEqual('<option value="0">B</option>');
      expect(sortedHtml(options[1])).toEqual('<option value="1">C</option>');
      expect(sortedHtml(options[2])).toEqual('<option value="2">D</option>');
    });

    it('should preserve existing options', function() {
      createSingleSelect(true);

      scope.values = [];
      scope.$digest();
      expect(select.find('option').length).toEqual(1);

      scope.values = [{name:'A'}];
      scope.selected = scope.values[0];
      scope.$digest();
      expect(select.find('option').length).toEqual(2);
      expect(jqLite(select.find('option')[0]).text()).toEqual('blank');
      expect(jqLite(select.find('option')[1]).text()).toEqual('A');

      scope.values = [];
      scope.selected = null;
      scope.$digest();
      expect(select.find('option').length).toEqual(1);
      expect(jqLite(select.find('option')[0]).text()).toEqual('blank');
    });

    describe('binding', function() {
      it('should bind to scope value', function() {
        createSingleSelect();
        scope.values = [{name:'A'}, {name:'B'}];
        scope.selected = scope.values[0];
        scope.$digest();
        expect(select.val()).toEqual('0');

        scope.selected = scope.values[1];
        scope.$digest();
        expect(select.val()).toEqual('1');
      });

      it('should bind to scope value and group', function() {
        createSelect({
          'ng:model':'selected',
          'ng:options':'item.name group by item.group for item in values'
        });
        scope.values = [{name:'A'},
                        {name:'B', group:'first'},
                        {name:'C', group:'second'},
                        {name:'D', group:'first'},
                        {name:'E', group:'second'}];
        scope.selected = scope.values[3];
        scope.$digest();
        expect(select.val()).toEqual('3');

        var first = jqLite(select.find('optgroup')[0]);
        var b = jqLite(first.find('option')[0]);
        var d = jqLite(first.find('option')[1]);
        expect(first.attr('label')).toEqual('first');
        expect(b.text()).toEqual('B');
        expect(d.text()).toEqual('D');

        var second = jqLite(select.find('optgroup')[1]);
        var c = jqLite(second.find('option')[0]);
        var e = jqLite(second.find('option')[1]);
        expect(second.attr('label')).toEqual('second');
        expect(c.text()).toEqual('C');
        expect(e.text()).toEqual('E');

        scope.selected = scope.values[0];
        scope.$digest();
        expect(select.val()).toEqual('0');
      });

      it('should bind to scope value through experession', function() {
        createSelect({'ng:model':'selected', 'ng:options':'item.id as item.name for item in values'});
        scope.values = [{id:10, name:'A'}, {id:20, name:'B'}];
        scope.selected = scope.values[0].id;
        scope.$digest();
        expect(select.val()).toEqual('0');

        scope.selected = scope.values[1].id;
        scope.$digest();
        expect(select.val()).toEqual('1');
      });

      it('should bind to object key', function() {
        createSelect({
          'ng:model':'selected',
          'ng:options':'key as value for (key, value) in object'
        });
        scope.object = {'red':'FF0000', 'green':'00FF00', 'blue':'0000FF'};
        scope.selected = 'green';
        scope.$digest();
        expect(select.val()).toEqual('green');

        scope.selected = 'blue';
        scope.$digest();
        expect(select.val()).toEqual('blue');
      });

      it('should bind to object value', function() {
        createSelect({
          'ng:model':'selected',
          'ng:options':'value as key for (key, value) in object'
        });
        scope.object = {'red':'FF0000', 'green':'00FF00', 'blue':'0000FF'};
        scope.selected = '00FF00';
        scope.$digest();
        expect(select.val()).toEqual('green');

        scope.selected = '0000FF';
        scope.$digest();
        expect(select.val()).toEqual('blue');
      });

      it('should insert a blank option if bound to null', function() {
        createSingleSelect();
        scope.values = [{name:'A'}];
        scope.selected = null;
        scope.$digest();
        expect(select.find('option').length).toEqual(2);
        expect(select.val()).toEqual('');
        expect(jqLite(select.find('option')[0]).val()).toEqual('');

        scope.selected = scope.values[0];
        scope.$digest();
        expect(select.val()).toEqual('0');
        expect(select.find('option').length).toEqual(1);
      });

      it('should reuse blank option if bound to null', function() {
        createSingleSelect(true);
        scope.values = [{name:'A'}];
        scope.selected = null;
        scope.$digest();
        expect(select.find('option').length).toEqual(2);
        expect(select.val()).toEqual('');
        expect(jqLite(select.find('option')[0]).val()).toEqual('');

        scope.selected = scope.values[0];
        scope.$digest();
        expect(select.val()).toEqual('0');
        expect(select.find('option').length).toEqual(2);
      });

      it('should insert a unknown option if bound to something not in the list', function() {
        createSingleSelect();
        scope.values = [{name:'A'}];
        scope.selected = {};
        scope.$digest();
        expect(select.find('option').length).toEqual(2);
        expect(select.val()).toEqual('?');
        expect(jqLite(select.find('option')[0]).val()).toEqual('?');

        scope.selected = scope.values[0];
        scope.$digest();
        expect(select.val()).toEqual('0');
        expect(select.find('option').length).toEqual(1);
      });

      it('should select correct input if previously selected option was "?"', function() {
        createSingleSelect();
        scope.values = [{name:'A'},{name:'B'}];
        scope.selected = {};
        scope.$digest();
        expect(select.find('option').length).toEqual(3);
        expect(select.val()).toEqual('?');
        expect(select.find('option').eq(0).val()).toEqual('?');

        browserTrigger(select.find('option').eq(1));
        expect(select.val()).toEqual('0');
        expect(select.find('option').eq(0).prop('selected')).toBeTruthy();
        expect(select.find('option').length).toEqual(2);
      });
    });


    describe('blank option', function () {
      it('should be compiled as template, be watched and updated', function () {
        var option;

        createSingleSelect('<option value="">blank is {{blankVal}}</option>');
        scope.blankVal = 'so blank';
        scope.values = [{name:'A'}];
        scope.$digest();

        // check blank option is first and is compiled
        expect(select.find('option').length == 2);
        option = jqLite(select.find('option')[0]);
        expect(option.val()).toBe('');
        expect(option.text()).toBe('blank is so blank');

        // change blankVal and $digest
        scope.blankVal = 'not so blank';
        scope.$digest();

        // check blank option is first and is compiled
        expect(select.find('option').length == 2);
        option = jqLite(select.find('option')[0]);
        expect(option.val()).toBe('');
        expect(option.text()).toBe('blank is not so blank');
      });

      it('should support binding via ng:bind-template attribute', function () {
        var option;

        createSingleSelect('<option value="" ng:bind-template="blank is {{blankVal}}"></option>');
        scope.blankVal = 'so blank';
        scope.values = [{name:'A'}];
        scope.$digest();

        // check blank option is first and is compiled
        expect(select.find('option').length == 2);
        option = jqLite(select.find('option')[0]);
        expect(option.val()).toBe('');
        expect(option.text()).toBe('blank is so blank');
      });

      it('should support biding via ng:bind attribute', function () {
        var option;

        createSingleSelect('<option value="" ng:bind="blankVal"></option>');
        scope.blankVal = 'is blank';
        scope.values = [{name:'A'}];
        scope.$digest();

        // check blank option is first and is compiled
        expect(select.find('option').length == 2);
        option = jqLite(select.find('option')[0]);
        expect(option.val()).toBe('');
        expect(option.text()).toBe('is blank');
      });

      it('should be rendered with the attributes preserved', function () {
        var option;

        createSingleSelect('<option value="" class="coyote" id="road-runner" ' +
          'custom-attr="custom-attr">{{blankVal}}</option>');
        scope.blankVal = 'is blank';
        scope.$digest();

        // check blank option is first and is compiled
        option = jqLite(select.find('option')[0]);
        expect(option.hasClass('coyote')).toBeTruthy();
        expect(option.attr('id')).toBe('road-runner');
        expect(option.attr('custom-attr')).toBe('custom-attr');
      });
    });


    describe('on change', function() {
      it('should update model on change', function() {
        createSingleSelect();
        scope.values = [{name:'A'}, {name:'B'}];
        scope.selected = scope.values[0];
        scope.$digest();
        expect(select.val()).toEqual('0');

        select.val('1');
        browserTrigger(select, 'change');
        expect(scope.selected).toEqual(scope.values[1]);
      });

      it('should update model on change through expression', function() {
        createSelect({'ng:model':'selected', 'ng:options':'item.id as item.name for item in values'});
        scope.values = [{id:10, name:'A'}, {id:20, name:'B'}];
        scope.selected = scope.values[0].id;
        scope.$digest();
        expect(select.val()).toEqual('0');

        select.val('1');
        browserTrigger(select, 'change');
        expect(scope.selected).toEqual(scope.values[1].id);
      });

      it('should update model to null on change', function() {
        createSingleSelect(true);
        scope.values = [{name:'A'}, {name:'B'}];
        scope.selected = scope.values[0];
        select.val('0');
        scope.$digest();

        select.val('');
        browserTrigger(select, 'change');
        expect(scope.selected).toEqual(null);
      });
    });

    describe('select-many', function() {
      it('should read multiple selection', function() {
        createMultiSelect();
        scope.values = [{name:'A'}, {name:'B'}];

        scope.selected = [];
        scope.$digest();
        expect(select.find('option').length).toEqual(2);
        expect(jqLite(select.find('option')[0]).prop('selected')).toBeFalsy();
        expect(jqLite(select.find('option')[1]).prop('selected')).toBeFalsy();

        scope.selected.push(scope.values[1]);
        scope.$digest();
        expect(select.find('option').length).toEqual(2);
        expect(select.find('option')[0].selected).toEqual(false);
        expect(select.find('option')[1].selected).toEqual(true);

        scope.selected.push(scope.values[0]);
        scope.$digest();
        expect(select.find('option').length).toEqual(2);
        expect(select.find('option')[0].selected).toEqual(true);
        expect(select.find('option')[1].selected).toEqual(true);
      });

      it('should update model on change', function() {
        createMultiSelect();
        scope.values = [{name:'A'}, {name:'B'}];

        scope.selected = [];
        scope.$digest();
        select.find('option')[0].selected = true;

        browserTrigger(select, 'change');
        expect(scope.selected).toEqual([scope.values[0]]);
      });
    });
  });
});
