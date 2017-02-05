'use strict';

describe('select', function() {
  var scope, formElement, element, $compile, ngModelCtrl, selectCtrl, renderSpy, optionAttributesList = [];

  function compile(html) {
    formElement = jqLite('<form name="form">' + html + '</form>');
    element = formElement.find('select');
    $compile(formElement)(scope);
    scope.$digest();
  }

  function compileRepeatedOptions() {
    compile('<select ng-model="robot">' +
              '<option value="{{item.value}}" ng-repeat="item in robots">{{item.label}}</option>' +
            '</select>');
  }

  function compileGroupedOptions() {
    compile(
      '<select ng-model="mySelect">' +
        '<option ng-repeat="item in values">{{item.name}}</option>' +
        '<optgroup ng-repeat="group in groups" label="{{group.name}}">' +
          '<option ng-repeat="item in group.values">{{item.name}}</option>' +
        '</optgroup>' +
      '</select>');
  }

  function unknownValue(value) {
    return '? ' + hashKey(value) + ' ?';
  }

  beforeEach(module(function($compileProvider) {
    $compileProvider.directive('spyOnWriteValue', function() {
      return {
        require: 'select',
        link: {
          pre: function(scope, element, attrs, ctrl) {
            selectCtrl = ctrl;
            renderSpy = jasmine.createSpy('renderSpy');
            selectCtrl.ngModelCtrl.$render = renderSpy.and.callFake(selectCtrl.ngModelCtrl.$render);
            spyOn(selectCtrl, 'writeValue').and.callThrough();
          }
        }
      };
    });

    $compileProvider.directive('myOptions', function() {
      return {
        scope: {myOptions: '='},
        replace: true,
        template:
            '<option value="{{ option.value }}" ng-repeat="option in myOptions">' +
              '{{ options.label }}' +
            '</option>'
      };
    });

    $compileProvider.directive('exposeAttributes', function() {
      return {
        require: '^^select',
        link: {
          pre: function(scope, element, attrs, ctrl) {
            optionAttributesList.push(attrs);
          }
        }
      };
    });

  }));

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
    jasmine.addMatchers({
      toEqualSelect: function() {
        return {
          compare: function(actual, expected) {
            var actualValues = [],
                expectedValues = [].slice.call(arguments, 1);

            forEach(actual.find('option'), function(option) {
              actualValues.push(option.selected ? [option.value] : option.value);
            });

            var message = function() {
              return 'Expected ' + toJson(actualValues) + ' to equal ' + toJson(expectedValues) + '.';
            };

            return {
              pass: equals(expectedValues, actualValues),
              message: message
            };
          }
        };
      },

      toEqualSelectWithOptions: function() {
        return {
          compare: function(actual, expected) {
            var actualValues = {};
            var optionGroup;
            var optionValue;

            forEach(actual.find('option'), function(option) {
              optionGroup = option.parentNode.label || '';
              actualValues[optionGroup] = actualValues[optionGroup] || [];
              // IE9 doesn't populate the label property from the text property like other browsers
              optionValue = option.label || option.text;
              actualValues[optionGroup].push(option.selected ? [optionValue] : optionValue);
            });

            var message = function() {
              return 'Expected ' + toJson(actualValues) + ' to equal ' + toJson(expected) + '.';
            };

            return {
              pass: equals(expected, actualValues),
              message: message
            };
          }
        };
      }
    });

  });

  it('should not add options to the select if ngModel is not present', inject(function($rootScope) {
    var scope = $rootScope;
    scope.d = 'd';
    scope.e = 'e';
    scope.f = 'f';

    compile('<select>' +
      '<option ng-value="\'a\'">alabel</option>' +
      '<option value="b">blabel</option>' +
      '<option >c</option>' +
      '<option ng-value="d">dlabel</option>' +
      '<option value="{{e}}">elabel</option>' +
      '<option>{{f}}</option>' +
    '</select>');

    var selectCtrl = element.controller('select');

    expect(selectCtrl.hasOption('a')).toBe(false);
    expect(selectCtrl.hasOption('b')).toBe(false);
    expect(selectCtrl.hasOption('c')).toBe(false);
    expect(selectCtrl.hasOption('d')).toBe(false);
    expect(selectCtrl.hasOption('e')).toBe(false);
    expect(selectCtrl.hasOption('f')).toBe(false);
  }));

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


    it('should interpolate select names', function() {
      scope.robots = ['c3p0', 'r2d2'];
      scope.name = 'r2d2';
      scope.nameID = 47;
      compile('<select ng-model="name" name="name{{nameID}}">' +
                '<option ng-repeat="r in robots">{{r}}</option>' +
              '</select>');
      expect(scope.form.name47.$pristine).toBeTruthy();
      browserTrigger(element.find('option').eq(0));
      expect(scope.form.name47.$dirty).toBeTruthy();
      expect(scope.name).toBe('c3p0');
    });


    it('should rename select controls in form when interpolated name changes', function() {
      scope.nameID = 'A';
      compile('<select ng-model="name" name="name{{nameID}}"></select>');
      expect(scope.form.nameA.$name).toBe('nameA');
      var oldModel = scope.form.nameA;
      scope.nameID = 'B';
      scope.$digest();
      expect(scope.form.nameA).toBeUndefined();
      expect(scope.form.nameB).toBe(oldModel);
      expect(scope.form.nameB.$name).toBe('nameB');
    });


    it('should select options in a group when there is a linebreak before an option', function() {
      scope.mySelect = 'B';
      scope.$apply();

      var select = jqLite(
        '<select ng-model="mySelect">' +
          '<optgroup label="first">' +
            '<option value="A">A</option>' +
        '</optgroup>' +
        '<optgroup label="second">\n' +
            '<option value="B">B</option>' +
        '</optgroup>      ' +
      '</select>');

      $compile(select)(scope);
      scope.$apply();

      expect(select).toEqualSelectWithOptions({'first':['A'], 'second': [['B']]});
      dealoc(select);
    });


    it('should only call selectCtrl.writeValue after a digest has occured', function() {
      scope.mySelect = 'B';
      scope.$apply();

      var select = jqLite(
        '<select spy-on-write-value ng-model="mySelect">' +
          '<optgroup label="first">' +
            '<option value="A">A</option>' +
        '</optgroup>' +
        '<optgroup label="second">\n' +
            '<option value="B">B</option>' +
        '</optgroup>      ' +
      '</select>');

      $compile(select)(scope);
      expect(selectCtrl.writeValue).not.toHaveBeenCalled();

      scope.$digest();
      expect(selectCtrl.writeValue).toHaveBeenCalled();
      dealoc(select);
    });


    it('should remove the "selected" attribute from the previous option when the model changes', function() {
      compile('<select name="select" ng-model="selected">' +
        '<option value="a">A</option>' +
        '<option value="b">B</option>' +
      '</select>');

      scope.$digest();

      var options = element.find('option');
      expect(options[0]).toBeMarkedAsSelected();
      expect(options[1]).not.toBeMarkedAsSelected();
      expect(options[2]).not.toBeMarkedAsSelected();

      scope.selected = 'a';
      scope.$digest();

      options = element.find('option');
      expect(options.length).toBe(2);
      expect(options[0]).toBeMarkedAsSelected();
      expect(options[1]).not.toBeMarkedAsSelected();

      scope.selected = 'b';
      scope.$digest();

      options = element.find('option');
      expect(options[0]).not.toBeMarkedAsSelected();
      expect(options[1]).toBeMarkedAsSelected();

      scope.selected = 'no match';
      scope.$digest();

      options = element.find('option');
      expect(options[0]).toBeMarkedAsSelected();
      expect(options[1]).not.toBeMarkedAsSelected();
      expect(options[2]).not.toBeMarkedAsSelected();
    });

    describe('empty option', function() {

      it('should allow empty option to be added and removed dynamically', function() {

        scope.dynamicOptions = [];
        scope.robot = '';
        compile('<select ng-model="robot">' +
                  '<option ng-repeat="opt in dynamicOptions" value="{{opt.val}}">{{opt.display}}</option>' +
                '</select>');
        expect(element).toEqualSelect(['? string: ?']);


        scope.dynamicOptions = [
          { val: '', display: '--select--' },
          { val: 'x', display: 'robot x' },
          { val: 'y', display: 'robot y' }
        ];
        scope.$digest();
        expect(element).toEqualSelect([''], 'x', 'y');


        scope.robot = 'x';
        scope.$digest();
        expect(element).toEqualSelect('', ['x'], 'y');


        scope.dynamicOptions.shift();
        scope.$digest();
        expect(element).toEqualSelect(['x'], 'y');


        scope.robot = undefined;
        scope.$digest();
        expect(element).toEqualSelect([unknownValue(undefined)], 'x', 'y');
      });


      it('should cope use a dynamic empty option that is added to a static empty option', function() {
        // We do not make any special provisions for multiple empty options, so this behavior is
        // largely untested
        scope.dynamicOptions = [];
        scope.robot = 'x';
        compile('<select ng-model="robot">' +
                 '<option value="">--static-select--</option>' +
                 '<option ng-repeat="opt in dynamicOptions" value="{{opt.val}}">{{opt.display}}</option>' +
               '</select>');
        scope.$digest();
        expect(element).toEqualSelect([unknownValue('x')], '');

        scope.robot = undefined;
        scope.$digest();
        expect(element.find('option').eq(0).prop('selected')).toBe(true);
        expect(element.find('option').eq(0).text()).toBe('--static-select--');

        scope.dynamicOptions = [
         { val: '', display: '--dynamic-select--' },
         { val: 'x', display: 'robot x' },
         { val: 'y', display: 'robot y' }
        ];
        scope.$digest();
        expect(element).toEqualSelect('', [''], 'x', 'y');

        scope.dynamicOptions = [];
        scope.$digest();
        expect(element).toEqualSelect(['']);
      });


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


      it('should remove unknown option when model is undefined', function() {
        scope.robot = 'other';
        compile('<select ng-model="robot">' +
                  '<option value="">--select--</option>' +
                  '<option value="x">robot x</option>' +
                  '<option value="y">robot y</option>' +
                '</select>');

        expect(element).toEqualSelect([unknownValue('other')], '', 'x', 'y');

        scope.robot = undefined;
        scope.$digest();

        expect(element).toEqualSelect([''], 'x', 'y');
      });


      it('should support option without a value attribute', function() {
        compile('<select ng-model="robot">' +
                  '<option>--select--</option>' +
                  '<option value="x">robot x</option>' +
                  '<option value="y">robot y</option>' +
                '</select>');
        expect(element).toEqualSelect(['? undefined:undefined ?'], '--select--', 'x', 'y');
      });


      it('should support option without a value with other HTML attributes', function() {
        compile('<select ng-model="robot">' +
                  '<option data-foo="bar">--select--</option>' +
                  '<option value="x">robot x</option>' +
                  '<option value="y">robot y</option>' +
                '</select>');
        expect(element).toEqualSelect(['? undefined:undefined ?'], '--select--', 'x', 'y');
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

      it('should add/remove the "selected" attribute when the empty option is selected/unselected', function() {
        compile('<select name="select" ng-model="selected">' +
          '<option value="">--select--</option>' +
          '<option value="a">A</option>' +
          '<option value="b">B</option>' +
        '</select>');

        scope.$digest();

        var options = element.find('option');
        expect(options.length).toBe(3);
        expect(options[0]).toBeMarkedAsSelected();
        expect(options[1]).not.toBeMarkedAsSelected();
        expect(options[2]).not.toBeMarkedAsSelected();

        scope.selected = 'a';
        scope.$digest();

        options = element.find('option');
        expect(options.length).toBe(3);
        expect(options[0]).not.toBeMarkedAsSelected();
        expect(options[1]).toBeMarkedAsSelected();
        expect(options[2]).not.toBeMarkedAsSelected();

        scope.selected = 'no match';
        scope.$digest();

        options = element.find('option');
        expect(options[0]).toBeMarkedAsSelected();
        expect(options[1]).not.toBeMarkedAsSelected();
        expect(options[2]).not.toBeMarkedAsSelected();
      });

    });


    describe('unknown option', function() {

      it('should insert&select temporary unknown option when no options-model match', function() {
        compile('<select ng-model="robot">' +
                  '<option>c3p0</option>' +
                  '<option>r2d2</option>' +
                '</select>');

        expect(element).toEqualSelect([unknownValue(undefined)], 'c3p0', 'r2d2');

        scope.$apply(function() {
          scope.robot = 'r2d2';
        });
        expect(element).toEqualSelect('c3p0', ['r2d2']);


        scope.$apply(function() {
          scope.robot = 'wallee';
        });
        expect(element).toEqualSelect([unknownValue('wallee')], 'c3p0', 'r2d2');
      });


      it('should NOT insert temporary unknown option when model is undefined and empty options ' +
          'is present', function() {
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
        expect(element).toEqualSelect([''], 'c3p0', 'r2d2');

        scope.$apply(function() {
          scope.robot = 'r2d2';
        });
        expect(element).toEqualSelect('', 'c3p0', ['r2d2']);

        scope.$apply(function() {
          delete scope.robot;
        });
        expect(element).toEqualSelect([''], 'c3p0', 'r2d2');
      });


      it('should insert&select temporary unknown option when no options-model match, empty ' +
          'option is present and model is defined', function() {
        scope.robot = 'wallee';
        compile('<select ng-model="robot">' +
                  '<option value="">--select--</option>' +
                  '<option>c3p0</option>' +
                  '<option>r2d2</option>' +
                '</select>');

        expect(element).toEqualSelect([unknownValue('wallee')], '', 'c3p0', 'r2d2');

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
          expect(element).toEqualSelect([unknownValue(undefined)]);
          expect(scope.robot).toBeUndefined();

          scope.$apply(function() {
            scope.robot = 'r2d2';
          });
          expect(element).toEqualSelect([unknownValue('r2d2')]);
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
          expect(element).toEqualSelect([unknownValue('r2d2')], '');
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
          expect(element).toEqualSelect([unknownValue(null)], 'c3p0');
          expect(scope.robot).toBe(null);

          scope.$apply(function() {
            scope.robots.unshift('r2d2');
          });
          expect(element).toEqualSelect([unknownValue(null)], 'r2d2', 'c3p0');
          expect(scope.robot).toBe(null);

          scope.$apply(function() {
            scope.robot = 'r2d2';
          });

          expect(element).toEqualSelect(['r2d2'], 'c3p0');

          scope.$apply(function() {
            delete scope.robots;
          });

          expect(element).toEqualSelect([unknownValue(null)]);
          expect(scope.robot).toBe(null);
        });
      });

    });


    it('should not break when adding options via a directive with `replace: true` '
        + 'and a structural directive in its template',
      function() {
        scope.options = [
          {value: '1', label: 'Option 1'},
          {value: '2', label: 'Option 2'},
          {value: '3', label: 'Option 3'}
        ];
        compile('<select ng-model="mySelect"><option my-options="options"></option></select>');

        expect(element).toEqualSelect([unknownValue()], '1', '2', '3');
      }
    );


    it('should not throw when removing the element and all its children', function() {
      var template =
        '<select ng-model="mySelect" ng-if="visible">' +
          '<option value="">--- Select ---</option>' +
        '</select>';
      scope.visible = true;

      compile(template);

      // It should not throw when removing the element
      scope.$apply('visible = false');
    });
  });


  describe('selectController.hasOption', function() {

    describe('flat options', function() {
      it('should return false for options shifted via ngRepeat', function() {
        scope.robots = [
          {value: 1, label: 'c3p0'},
          {value: 2, label: 'r2d2'}
        ];

        compileRepeatedOptions();

        var selectCtrl = element.controller('select');

        scope.$apply(function() {
          scope.robots.shift();
        });

        expect(selectCtrl.hasOption('1')).toBe(false);
        expect(selectCtrl.hasOption('2')).toBe(true);
      });


      it('should return false for options popped via ngRepeat', function() {
        scope.robots = [
          {value: 1, label: 'c3p0'},
          {value: 2, label: 'r2d2'}
        ];

        compileRepeatedOptions();

        var selectCtrl = element.controller('select');

        scope.$apply(function() {
          scope.robots.pop();
        });

        expect(selectCtrl.hasOption('1')).toBe(true);
        expect(selectCtrl.hasOption('2')).toBe(false);
      });


      it('should return true for options added via ngRepeat', function() {
        scope.robots = [
          {value: 2, label: 'r2d2'}
        ];

        compileRepeatedOptions();

        var selectCtrl = element.controller('select');

        scope.$apply(function() {
          scope.robots.unshift({value: 1, label: 'c3p0'});
        });

        expect(selectCtrl.hasOption('1')).toBe(true);
        expect(selectCtrl.hasOption('2')).toBe(true);
      });


      it('should keep all the options when changing the model', function() {

        compile('<select ng-model="mySelect"><option ng-repeat="o in [\'A\',\'B\',\'C\']">{{o}}</option></select>');

        var selectCtrl = element.controller('select');

        scope.$apply(function() {
          scope.mySelect = 'C';
        });

        expect(selectCtrl.hasOption('A')).toBe(true);
        expect(selectCtrl.hasOption('B')).toBe(true);
        expect(selectCtrl.hasOption('C')).toBe(true);
        expect(element).toEqualSelectWithOptions({'': ['A', 'B', ['C']]});
      });
    });


    describe('grouped options', function() {

      it('should be able to detect when elements move from a previous group', function() {
        scope.values = [{name: 'A'}];
        scope.groups = [
          {
            name: 'first',
            values: [
              {name: 'B'},
              {name: 'C'},
              {name: 'D'}
            ]
          },
          {
            name: 'second',
            values: [
              {name: 'E'}
            ]
          }
        ];

        compileGroupedOptions();

        var selectCtrl = element.controller('select');

        scope.$apply(function() {
          var itemD = scope.groups[0].values.pop();
          scope.groups[1].values.unshift(itemD);
          scope.values.shift();
        });

        expect(selectCtrl.hasOption('A')).toBe(false);
        expect(selectCtrl.hasOption('B')).toBe(true);
        expect(selectCtrl.hasOption('C')).toBe(true);
        expect(selectCtrl.hasOption('D')).toBe(true);
        expect(selectCtrl.hasOption('E')).toBe(true);
        expect(element).toEqualSelectWithOptions({'': [['']], 'first':['B', 'C'], 'second': ['D', 'E']});
      });


      it('should be able to detect when elements move from a following group', function() {
        scope.values = [{name: 'A'}];
        scope.groups = [
          {
            name: 'first',
            values: [
              {name: 'B'},
              {name: 'C'}
            ]
          },
          {
            name: 'second',
            values: [
              {name: 'D'},
              {name: 'E'}
            ]
          }
        ];

        compileGroupedOptions();

        var selectCtrl = element.controller('select');

        scope.$apply(function() {
          var itemD = scope.groups[1].values.shift();
          scope.groups[0].values.push(itemD);
          scope.values.shift();
        });
        expect(selectCtrl.hasOption('A')).toBe(false);
        expect(selectCtrl.hasOption('B')).toBe(true);
        expect(selectCtrl.hasOption('C')).toBe(true);
        expect(selectCtrl.hasOption('D')).toBe(true);
        expect(selectCtrl.hasOption('E')).toBe(true);
        expect(element).toEqualSelectWithOptions({'': [['']], 'first':['B', 'C', 'D'], 'second': ['E']});
      });


      it('should be able to detect when an element is replaced with an element from a previous group', function() {
        scope.values = [{name: 'A'}];
        scope.groups = [
          {
            name: 'first',
            values: [
              {name: 'B'},
              {name: 'C'},
              {name: 'D'}
            ]
          },
          {
            name: 'second',
            values: [
              {name: 'E'},
              {name: 'F'}
            ]
          }
        ];

        compileGroupedOptions();

        var selectCtrl = element.controller('select');

        scope.$apply(function() {
          var itemD = scope.groups[0].values.pop();
          scope.groups[1].values.unshift(itemD);
          scope.groups[1].values.pop();
        });
        expect(selectCtrl.hasOption('A')).toBe(true);
        expect(selectCtrl.hasOption('B')).toBe(true);
        expect(selectCtrl.hasOption('C')).toBe(true);
        expect(selectCtrl.hasOption('D')).toBe(true);
        expect(selectCtrl.hasOption('E')).toBe(true);
        expect(selectCtrl.hasOption('F')).toBe(false);
        expect(element).toEqualSelectWithOptions({'': [[''], 'A'], 'first':['B', 'C'], 'second': ['D', 'E']});
      });


      it('should be able to detect when element is replaced with an element from a following group', function() {
        scope.values = [{name: 'A'}];
        scope.groups = [
          {
            name: 'first',
            values: [
              {name: 'B'},
              {name: 'C'}
            ]
          },
          {
            name: 'second',
            values: [
              {name: 'D'},
              {name: 'E'}
            ]
          }
        ];

        compileGroupedOptions();

        var selectCtrl = element.controller('select');

        scope.$apply(function() {
          scope.groups[0].values.pop();
          var itemD = scope.groups[1].values.shift();
          scope.groups[0].values.push(itemD);
        });
        expect(selectCtrl.hasOption('A')).toBe(true);
        expect(selectCtrl.hasOption('B')).toBe(true);
        expect(selectCtrl.hasOption('C')).toBe(false);
        expect(selectCtrl.hasOption('D')).toBe(true);
        expect(selectCtrl.hasOption('E')).toBe(true);
        expect(element).toEqualSelectWithOptions({'': [[''], 'A'], 'first':['B', 'D'], 'second': ['E']});
      });


      it('should be able to detect when an element is removed', function() {
        scope.values = [{name: 'A'}];
        scope.groups = [
          {
            name: 'first',
            values: [
              {name: 'B'},
              {name: 'C'}
            ]
          },
          {
            name: 'second',
            values: [
              {name: 'D'},
              {name: 'E'}
            ]
          }
        ];

        compileGroupedOptions();

        var selectCtrl = element.controller('select');

        scope.$apply(function() {
          scope.groups[1].values.shift();
        });
        expect(selectCtrl.hasOption('A')).toBe(true);
        expect(selectCtrl.hasOption('B')).toBe(true);
        expect(selectCtrl.hasOption('C')).toBe(true);
        expect(selectCtrl.hasOption('D')).toBe(false);
        expect(selectCtrl.hasOption('E')).toBe(true);
        expect(element).toEqualSelectWithOptions({'': [[''], 'A'], 'first':['B', 'C'], 'second': ['E']});
      });


      it('should be able to detect when a group is removed', function() {
        scope.values = [{name: 'A'}];
        scope.groups = [
          {
            name: 'first',
            values: [
              {name: 'B'},
              {name: 'C'}
            ]
          },
          {
            name: 'second',
            values: [
              {name: 'D'},
              {name: 'E'}
            ]
          }
        ];

        compileGroupedOptions();

        var selectCtrl = element.controller('select');

        scope.$apply(function() {
          scope.groups.pop();
        });
        expect(selectCtrl.hasOption('A')).toBe(true);
        expect(selectCtrl.hasOption('B')).toBe(true);
        expect(selectCtrl.hasOption('C')).toBe(true);
        expect(selectCtrl.hasOption('D')).toBe(false);
        expect(selectCtrl.hasOption('E')).toBe(false);
        expect(element).toEqualSelectWithOptions({'': [[''], 'A'], 'first':['B', 'C']});
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

      var optionElements = element.find('option');

      expect(element).toEqualSelect(['A'], 'B');
      expect(optionElements[0]).toBeMarkedAsSelected();
      expect(optionElements[1]).not.toBeMarkedAsSelected();

      scope.$apply(function() {
        scope.selection.push('B');
      });

      optionElements = element.find('option');

      expect(element).toEqualSelect(['A'], ['B']);
      expect(optionElements[0]).toBeMarkedAsSelected();
      expect(optionElements[1]).toBeMarkedAsSelected();
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


    describe('calls to $render', function() {

      var ngModelCtrl;

      beforeEach(function() {
        compile(
          '<select name="select" ng-model="selection" multiple>' +
          '<option>A</option>' +
          '<option>B</option>' +
          '</select>');

        ngModelCtrl = element.controller('ngModel');
        spyOn(ngModelCtrl, '$render').and.callThrough();
      });


      it('should call $render once when the reference to the viewValue changes', function() {
        scope.$apply(function() {
          scope.selection = ['A'];
        });
        expect(ngModelCtrl.$render).toHaveBeenCalledTimes(1);

        scope.$apply(function() {
          scope.selection = ['A', 'B'];
        });
        expect(ngModelCtrl.$render).toHaveBeenCalledTimes(2);

        scope.$apply(function() {
          scope.selection = [];
        });
        expect(ngModelCtrl.$render).toHaveBeenCalledTimes(3);
      });


      it('should call $render once when the viewValue deep-changes', function() {
        scope.$apply(function() {
          scope.selection = ['A'];
        });
        expect(ngModelCtrl.$render).toHaveBeenCalledTimes(1);

        scope.$apply(function() {
          scope.selection.push('B');
        });
        expect(ngModelCtrl.$render).toHaveBeenCalledTimes(2);

        scope.$apply(function() {
          scope.selection.length = 0;
        });
        expect(ngModelCtrl.$render).toHaveBeenCalledTimes(3);
      });

    });

  });


  describe('option', function() {

    it('should populate a missing value attribute with the option text', function() {
      compile('<select ng-model="x"><option selected>abc</option></select>');
      expect(element).toEqualSelect([unknownValue(undefined)], 'abc');
    });


    it('should ignore the option text if the value attribute exists', function() {
      compile('<select ng-model="x"><option value="abc">xyz</option></select>');
      expect(element).toEqualSelect([unknownValue(undefined)], 'abc');
    });


    it('should set value even if self closing HTML', function() {
      scope.x = 'hello';
      compile('<select ng-model="x"><option>hello</select>');
      expect(element).toEqualSelect(['hello']);
    });


    it('should add options with interpolated value attributes', function() {
      scope.option1 = 'option1';
      scope.option2 = 'option2';

     compile('<select ng-model="selected">' +
        '<option value="{{option1}}">Option 1</option>' +
        '<option value="{{option2}}">Option 2</option>' +
      '</select>');

      scope.$digest();
      expect(scope.selected).toBeUndefined();

      browserTrigger(element.find('option').eq(0));
      expect(scope.selected).toBe('option1');

      scope.selected = 'option2';
      scope.$digest();
      expect(element.find('option').eq(1).prop('selected')).toBe(true);
      expect(element.find('option').eq(1).text()).toBe('Option 2');
    });


    it('should update the option when the interpolated value attribute changes', function() {
      scope.option1 = 'option1';
      scope.option2 = '';

      compile('<select ng-model="selected">' +
        '<option value="{{option1}}">Option 1</option>' +
        '<option value="{{option2}}">Option 2</option>' +
      '</select>');

      var selectCtrl = element.controller('select');
      spyOn(selectCtrl, 'removeOption').and.callThrough();

      scope.$digest();
      expect(scope.selected).toBeUndefined();
      expect(selectCtrl.removeOption).not.toHaveBeenCalled();

      //Change value of option2
      scope.option2 = 'option2Changed';
      scope.selected = 'option2Changed';
      scope.$digest();

      expect(selectCtrl.removeOption).toHaveBeenCalledWith('');
      expect(element.find('option').eq(1).prop('selected')).toBe(true);
      expect(element.find('option').eq(1).text()).toBe('Option 2');
    });


    it('should add options with interpolated text', function() {
      scope.option1 = 'Option 1';
      scope.option2 = 'Option 2';

      compile('<select ng-model="selected">' +
        '<option>{{option1}}</option>' +
        '<option>{{option2}}</option>' +
      '</select>');

      scope.$digest();
      expect(scope.selected).toBeUndefined();

      browserTrigger(element.find('option').eq(0));
      expect(scope.selected).toBe('Option 1');

      scope.selected = 'Option 2';
      scope.$digest();
      expect(element.find('option').eq(1).prop('selected')).toBe(true);
      expect(element.find('option').eq(1).text()).toBe('Option 2');
    });


    it('should update options when their interpolated text changes', function() {
      scope.option1 = 'Option 1';
      scope.option2 = '';

      compile('<select ng-model="selected">' +
        '<option>{{option1}}</option>' +
        '<option>{{option2}}</option>' +
      '</select>');

      var selectCtrl = element.controller('select');
      spyOn(selectCtrl, 'removeOption').and.callThrough();

      scope.$digest();
      expect(scope.selected).toBeUndefined();
      expect(selectCtrl.removeOption).not.toHaveBeenCalled();

      //Change value of option2
      scope.option2 = 'Option 2 Changed';
      scope.selected = 'Option 2 Changed';
      scope.$digest();

      expect(selectCtrl.removeOption).toHaveBeenCalledWith('');
      expect(element.find('option').eq(1).prop('selected')).toBe(true);
      expect(element.find('option').eq(1).text()).toBe('Option 2 Changed');
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
      scope.hasOwnPropertyOption = 'hasOwnProperty';
      expect(function() {
        compile('<select ng-model="x">' +
                  '<option>{{hasOwnPropertyOption}}</option>' +
                '</select>');
      }).toThrowMinErr('ng','badname', 'hasOwnProperty is not a valid "option value" name');
    });

    describe('with ngValue (and non-primitive values)', function() {

      they('should set the option attribute and select it for value $prop', [
          'string',
          undefined,
          1,
          true,
          null,
          {prop: 'value'},
          ['a'],
          NaN
        ], function(prop) {
          scope.option1 = prop;
          scope.selected = 'NOMATCH';

          compile('<select ng-model="selected">' +
            '<option ng-value="option1">{{option1}}</option>' +
          '</select>');

          scope.$digest();
          expect(element.find('option').eq(0).val()).toBe('? string:NOMATCH ?');

          scope.selected = prop;
          scope.$digest();

          expect(element.find('option').eq(0).val()).toBe(hashKey(prop));

          // Reset
          scope.selected = false;
          scope.$digest();

          expect(element.find('option').eq(0).val()).toBe('? boolean:false ?');

          browserTrigger(element.find('option').eq(0));
          if (isNumberNaN(prop)) {
            expect(scope.selected).toBeNaN();
          } else {
            expect(scope.selected).toBe(prop);
          }
      });


      they('should update the option attribute and select it for value $prop', [
          'string',
          undefined,
          1,
          true,
          null,
          {prop: 'value'},
          ['a'],
          NaN
        ], function(prop) {
          scope.option = prop;
          scope.selected = 'NOMATCH';

          compile('<select ng-model="selected">' +
            '<option ng-value="option">{{option}}</option>' +
          '</select>');

          var selectController = element.controller('select');
          spyOn(selectController, 'removeOption').and.callThrough();

          scope.$digest();
          expect(selectController.removeOption).not.toHaveBeenCalled();
          expect(element.find('option').eq(0).val()).toBe('? string:NOMATCH ?');

          scope.selected = prop;
          scope.$digest();

          expect(element.find('option').eq(0).val()).toBe(hashKey(prop));
          expect(element[0].selectedIndex).toBe(0);

          scope.option = 'UPDATEDVALUE';
          scope.$digest();

          expect(selectController.removeOption.calls.count()).toBe(1);

          // Updating the option value currently does not update the select model
          if (isNumberNaN(prop)) {
            expect(selectController.removeOption.calls.argsFor(0)[0]).toBeNaN();
          } else {
            expect(selectController.removeOption.calls.argsFor(0)[0]).toBe(prop);
          }

          expect(scope.selected).toBe(null);
          expect(element[0].selectedIndex).toBe(0);
          expect(element.find('option').length).toBe(2);
          expect(element.find('option').eq(0).prop('selected')).toBe(true);
          expect(element.find('option').eq(0).val()).toBe(unknownValue(prop));
          expect(element.find('option').eq(1).prop('selected')).toBe(false);
          expect(element.find('option').eq(1).val()).toBe('string:UPDATEDVALUE');

          scope.selected = 'UPDATEDVALUE';
          scope.$digest();

          expect(element[0].selectedIndex).toBe(0);
          expect(element.find('option').eq(0).val()).toBe('string:UPDATEDVALUE');
      });

      it('should interact with custom attribute $observe and $set calls', function() {
        var log = [], optionAttr;

        compile('<select ng-model="selected">' +
          '<option expose-attributes ng-value="option">{{option}}</option>' +
        '</select>');

        optionAttr = optionAttributesList[0];
        optionAttr.$observe('value', function(newVal) {
          log.push(newVal);
        });

        scope.option = 'init';
        scope.$digest();

        expect(log[0]).toBe('init');
        expect(element.find('option').eq(1).val()).toBe('string:init');

        optionAttr.$set('value', 'update');
        expect(log[1]).toBe('update');
        expect(element.find('option').eq(1).val()).toBe('string:update');

      });

    it('should ignore the option text / value attribute if the ngValue attribute exists', function() {
      scope.ngvalue = 'abc';
      scope.value = 'def';
      scope.textvalue = 'ghi';

      compile('<select ng-model="x"><option ng-value="ngvalue" value="{{value}}">{{textvalue}}</option></select>');
      expect(element).toEqualSelect([unknownValue(undefined)], 'string:abc');
    });

    it('should ignore option text with multiple interpolations if the ngValue attribute exists', function() {
      scope.ngvalue = 'abc';
      scope.textvalue = 'def';
      scope.textvalue2 = 'ghi';

      compile('<select ng-model="x"><option ng-value="ngvalue">{{textvalue}} {{textvalue2}}</option></select>');
      expect(element).toEqualSelect([unknownValue(undefined)], 'string:abc');
    });

      describe('and select[multiple]', function() {

        it('should allow multiple selection', function() {
            scope.options = {
              a: 'string',
              b: undefined,
              c: 1,
              d: true,
              e: null,
              f: {prop: 'value'},
              g: ['a'],
              h: NaN
            };
            scope.selected = [];

            compile('<select multiple ng-model="selected">' +
              '<option ng-value="options.a">{{options.a}}</option>' +
              '<option ng-value="options.b">{{options.b}}</option>' +
              '<option ng-value="options.c">{{options.c}}</option>' +
              '<option ng-value="options.d">{{options.d}}</option>' +
              '<option ng-value="options.e">{{options.e}}</option>' +
              '<option ng-value="options.f">{{options.f}}</option>' +
              '<option ng-value="options.g">{{options.g}}</option>' +
              '<option ng-value="options.h">{{options.h}}</option>' +
            '</select>');

            scope.$digest();
            expect(element).toEqualSelect(
              'string:string',
              'undefined:undefined',
              'number:1',
              'boolean:true',
              'object:null',
              'object:3',
              'object:4',
              'number:NaN'
            );

            scope.selected = ['string', 1];
            scope.$digest();

            expect(element.find('option').eq(0).prop('selected')).toBe(true);
            expect(element.find('option').eq(2).prop('selected')).toBe(true);

            browserTrigger(element.find('option').eq(1));
            expect(scope.selected).toEqual([undefined]);

            //reset
            scope.selected = [];
            scope.$digest();

            forEach(element.find('option'), function(option) {
              // browserTrigger can't produce click + ctrl, so set selection manually
              jqLite(option).prop('selected', true);
            });

            browserTrigger(element, 'change');

            var arrayVal = ['a'];
            arrayVal.$$hashKey = 'object:4';

            expect(scope.selected).toEqual([
              'string',
              undefined,
              1,
              true,
              null,
              {prop: 'value', $$hashKey: 'object:3'},
              arrayVal,
              NaN
            ]);
        });

      });

    });

    describe('updating the model and selection when option elements are manipulated', function() {

      they('should set the model to null when the currently selected option with $prop is removed',
        ['ngValue', 'interpolatedValue', 'interpolatedText'], function(prop) {

          var A = { name: 'A'}, B = { name: 'B'}, C = { name: 'C'};

          scope.options = [A, B, C];
          scope.obj = {};

          var optionString = '';

          switch (prop) {
            case 'ngValue':
              optionString = '<option ng-repeat="option in options" ng-value="option">{{$index}}</option>';
              break;
            case 'interpolatedValue':
              optionString = '<option ng-repeat="option in options" value="{{option.name}}">{{$index}}</option>';
              break;
            case 'interpolatedText':
              optionString = '<option ng-repeat="option in options">{{option.name}}</option>';
              break;
          }

          compile(
            '<select ng-model="obj.value">' +
              optionString +
            '</select>'
          );

          var optionElements = element.find('option');
          expect(optionElements.length).toEqual(4);
          browserTrigger(optionElements.eq(0));

          optionElements = element.find('option');
          expect(optionElements.length).toEqual(3);
          expect(scope.obj.value).toBe(prop === 'ngValue' ? A : 'A');

          scope.options.shift();
          scope.$digest();

          optionElements = element.find('option');
          expect(optionElements.length).toEqual(3);
          expect(scope.obj.value).toBe(null);
          expect(element.val()).toBe('? object:null ?');
      });


      they('should set the model to null when the currently selected option with $prop changes its value',
        [
          'ngValue',
          'interpolatedValue',
          'interpolatedText'
        ], function(prop) {

          var A = { name: 'A'}, B = { name: 'B'}, C = { name: 'C'};

          scope.options = [A, B, C];
          scope.obj = {};

          var optionString = '';

          switch (prop) {
            case 'ngValue':
              optionString = '<option ng-repeat="option in options" ng-value="option.name">{{$index}}</option>';
              break;
            case 'interpolatedValue':
              optionString = '<option ng-repeat="option in options" value="{{option.name}}">{{$index}}</option>';
              break;
            case 'interpolatedText':
              optionString = '<option ng-repeat="option in options">{{option.name}}</option>';
              break;
          }

          compile(
            '<select ng-model="obj.value">' +
              optionString +
            '</select>'
          );

          var optionElements = element.find('option');
          expect(optionElements.length).toEqual(4);
          browserTrigger(optionElements.eq(0));

          optionElements = element.find('option');
          expect(optionElements.length).toEqual(3);
          expect(scope.obj.value).toBe('A');

          A.name = 'X';
          scope.$digest();

          optionElements = element.find('option');
          expect(optionElements.length).toEqual(4);
          expect(scope.obj.value).toBe(null);
          expect(element.val()).toBe('? string:A ?');
      });


      they('should set the model to null when the currently selected option with $prop is disabled',
        [
          'ngValue',
          'interpolatedValue',
          'interpolatedText'
        ], function(prop) {

          var A = { name: 'A'}, B = { name: 'B'}, C = { name: 'C'};

          scope.options = [A, B, C];
          scope.obj = {};

          var optionString = '';

          switch (prop) {
            case 'ngValue':
              optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled" ng-value="option.name">{{$index}}</option>';
              break;
            case 'interpolatedValue':
              optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled" value="{{option.name}}">{{$index}}</option>';
              break;
            case 'interpolatedText':
              optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled">{{option.name}}</option>';
              break;
          }

          compile(
            '<select ng-model="obj.value">' +
              optionString +
            '</select>'
          );

          var optionElements = element.find('option');
          expect(optionElements.length).toEqual(4);
          browserTrigger(optionElements.eq(0));

          optionElements = element.find('option');
          expect(optionElements.length).toEqual(3);
          expect(scope.obj.value).toBe('A');

          A.disabled = true;
          scope.$digest();

          optionElements = element.find('option');
          expect(optionElements.length).toEqual(4);
          expect(scope.obj.value).toBe(null);
          expect(element.val()).toBe('? object:null ?');
      });


      they('should select a disabled option with $prop when the model is set to the matching value',
        [
          'ngValue',
          'interpolatedValue',
          'interpolatedText'
        ], function(prop) {

          var A = { name: 'A'}, B = { name: 'B'}, C = { name: 'C'};

          scope.options = [A, B, C];
          scope.obj = {};

          var optionString = '';

          switch (prop) {
            case 'ngValue':
              optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled" ng-value="option.name">{{$index}}</option>';
              break;
            case 'interpolatedValue':
              optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled" value="{{option.name}}">{{$index}}</option>';
              break;
            case 'interpolatedText':
              optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled">{{option.name}}</option>';
              break;
          }

          compile(
            '<select ng-model="obj.value">' +
              optionString +
            '</select>'
          );

          var optionElements = element.find('option');
          expect(optionElements.length).toEqual(4);
          expect(optionElements[0].value).toEqual(unknownValue(undefined));

          B.disabled = true;
          scope.$digest();

          optionElements = element.find('option');
          expect(optionElements.length).toEqual(4);
          expect(optionElements[0].value).toEqual(unknownValue(undefined));

          scope.obj.value = 'B';
          scope.$digest();

          optionElements = element.find('option');
          expect(optionElements.length).toEqual(3);
          expect(scope.obj.value).toBe('B');
          // jQuery returns null for val() when the option is disabled, see
          // https://bugs.jquery.com/ticket/13097
          expect(element[0].value).toBe(prop === 'ngValue' ? 'string:B' : 'B');
          expect(optionElements.eq(1).prop('selected')).toBe(true);
      });


      they('should ignore an option with $prop that becomes enabled and does not match the model',
        [
          'ngValue',
          'interpolatedValue',
          'interpolatedText'
        ], function(prop) {

          var A = { name: 'A'}, B = { name: 'B'}, C = { name: 'C'};

          scope.options = [A, B, C];
          scope.obj = {};

          var optionString = '';

          switch (prop) {
            case 'ngValue':
              optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled" ng-value="option.name">{{$index}}</option>';
              break;
            case 'interpolatedValue':
              optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled" value="{{option.name}}">{{$index}}</option>';
              break;
            case 'interpolatedText':
              optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled">{{option.name}}</option>';
              break;
          }

          compile(
            '<select ng-model="obj.value">' +
              optionString +
            '</select>'
          );

          var optionElements = element.find('option');
          expect(optionElements.length).toEqual(4);
          browserTrigger(optionElements.eq(0));

          optionElements = element.find('option');
          expect(optionElements.length).toEqual(3);
          expect(scope.obj.value).toBe('A');

          A.disabled = true;
          scope.$digest();

          optionElements = element.find('option');
          expect(optionElements.length).toEqual(4);
          expect(scope.obj.value).toBe(null);
          expect(element.val()).toBe('? object:null ?');

          A.disabled = false;
          scope.$digest();

          optionElements = element.find('option');
          expect(optionElements.length).toEqual(4);
          expect(scope.obj.value).toBe(null);
          expect(element.val()).toBe('? object:null ?');
      });


      they('should select a newly added option with $prop when it matches the current model',
        [
          'ngValue',
          'interpolatedValue',
          'interpolatedText'
        ], function(prop) {

          var A = { name: 'A'}, B = { name: 'B'}, C = { name: 'C'};

          scope.options = [A, B];
          scope.obj = {
            value: prop === 'ngValue' ? C : 'C'
          };

          var optionString = '';

          switch (prop) {
            case 'ngValue':
              optionString = '<option ng-repeat="option in options" ng-value="option">{{$index}}</option>';
              break;
            case 'interpolatedValue':
              optionString = '<option ng-repeat="option in options" value="{{option.name}}">{{$index}}</option>';
              break;
            case 'interpolatedText':
              optionString = '<option ng-repeat="option in options">{{option.name}}</option>';
              break;
          }

          compile(
            '<select ng-model="obj.value">' +
              optionString +
            '</select>'
          );

          var optionElements = element.find('option');
          expect(optionElements.length).toEqual(3);

          scope.options.push(C);
          scope.$digest();

          optionElements = element.find('option');
          expect(element.val()).toBe(prop === 'ngValue' ? 'object:3' : 'C');
          expect(optionElements.length).toEqual(3);
          expect(optionElements[2].selected).toBe(true);
          expect(scope.obj.value).toEqual(prop === 'ngValue' ? {name: 'C', $$hashKey: 'object:3'} : 'C');
      });


      they('should keep selection and model when repeated options with track by are replaced with equal options',
        [
          'ngValue',
          'interpolatedValue',
          'interpolatedText'
        ], function(prop) {

          var A = { name: 'A'}, B = { name: 'B'}, C = { name: 'C'};

          scope.options = [A, B, C];
          scope.obj = {
            value: 'C'
          };

          var optionString = '';

          switch (prop) {
            case 'ngValue':
              optionString = '<option ng-repeat="option in options track by option.name" ng-value="option.name">{{$index}}</option>';
              break;
            case 'interpolatedValue':
              optionString = '<option ng-repeat="option in options track by option.name" value="{{option.name}}">{{$index}}</option>';
              break;
            case 'interpolatedText':
              optionString = '<option ng-repeat="option in options track by option.name">{{option.name}}</option>';
              break;
          }

          compile(
            '<select ng-model="obj.value">' +
              optionString +
            '</select>'
          );

          var optionElements = element.find('option');
          expect(optionElements.length).toEqual(3);

          scope.obj.value = 'C';
          scope.$digest();

          optionElements = element.find('option');
          expect(element.val()).toBe(prop === 'ngValue' ? 'string:C' : 'C');
          expect(optionElements.length).toEqual(3);
          expect(optionElements[2].selected).toBe(true);
          expect(scope.obj.value).toBe('C');

          scope.options = [
            {name: 'A'},
            {name: 'B'},
            {name: 'C'}
          ];
          scope.$digest();

          optionElements = element.find('option');
          expect(element.val()).toBe(prop === 'ngValue' ? 'string:C' : 'C');
          expect(optionElements.length).toEqual(3);
          expect(optionElements[2].selected).toBe(true);
          expect(scope.obj.value).toBe('C');
      });

      describe('when multiple', function() {

        they('should set the model to null when the currently selected option with $prop is removed',
          [
            'ngValue',
            'interpolatedValue',
            'interpolatedText'
          ], function(prop) {

            var A = { name: 'A'}, B = { name: 'B'}, C = { name: 'C'};

            scope.options = [A, B, C];
            scope.obj = {};

            var optionString = '';

            switch (prop) {
              case 'ngValue':
                optionString = '<option ng-repeat="option in options" ng-value="option">{{$index}}</option>';
                break;
              case 'interpolatedValue':
                optionString = '<option ng-repeat="option in options" value="{{option.name}}">{{$index}}</option>';
                break;
              case 'interpolatedText':
                optionString = '<option ng-repeat="option in options">{{option.name}}</option>';
                break;
            }

            compile(
              '<select ng-model="obj.value" multiple>' +
                optionString +
              '</select>'
            );

            var ngModelCtrl = element.controller('ngModel');
            var ngModelCtrlSpy = spyOn(ngModelCtrl, '$setViewValue').and.callThrough();

            var optionElements = element.find('option');
            expect(optionElements.length).toEqual(3);

            optionElements.eq(0).prop('selected', true);
            optionElements.eq(2).prop('selected', true);
            browserTrigger(element);

            optionElements = element.find('option');
            expect(optionElements.length).toEqual(3);
            expect(scope.obj.value).toEqual(prop === 'ngValue' ? [A, C] : ['A', 'C']);


            ngModelCtrlSpy.calls.reset();
            scope.options.shift();
            scope.options.pop();
            scope.$digest();

            optionElements = element.find('option');
            expect(optionElements.length).toEqual(1);
            expect(scope.obj.value).toEqual([]);

            // Cover both jQuery 3.x ([]) and 2.x (null) behavior.
            var val = element.val();
            if (val === null) {
              val = [];
            }
            expect(val).toEqual([]);

            expect(ngModelCtrlSpy).toHaveBeenCalledTimes(1);
        });

        they('should set the model to null when the currently selected option with $prop changes its value',
          [
            'ngValue',
            'interpolatedValue',
            'interpolatedText'
          ], function(prop) {

            var A = { name: 'A'}, B = { name: 'B'}, C = { name: 'C'};

            scope.options = [A, B, C];
            scope.obj = {};

            var optionString = '';

            switch (prop) {
              case 'ngValue':
                optionString = '<option ng-repeat="option in options" ng-value="option.name">{{$index}}</option>';
                break;
              case 'interpolatedValue':
                optionString = '<option ng-repeat="option in options" value="{{option.name}}">{{$index}}</option>';
                break;
              case 'interpolatedText':
                optionString = '<option ng-repeat="option in options">{{option.name}}</option>';
                break;
            }

            compile(
              '<select ng-model="obj.value" multiple>' +
                optionString +
              '</select>'
            );

            var ngModelCtrl = element.controller('ngModel');
            var ngModelCtrlSpy = spyOn(ngModelCtrl, '$setViewValue').and.callThrough();

            var optionElements = element.find('option');
            expect(optionElements.length).toEqual(3);

            optionElements.eq(0).prop('selected', true);
            optionElements.eq(2).prop('selected', true);
            browserTrigger(element);

            optionElements = element.find('option');
            expect(optionElements.length).toEqual(3);
            expect(scope.obj.value).toEqual(['A', 'C']);

            ngModelCtrlSpy.calls.reset();
            A.name = 'X';
            C.name = 'Z';
            scope.$digest();

            optionElements = element.find('option');
            expect(optionElements.length).toEqual(3);
            expect(scope.obj.value).toEqual([]);

            // Cover both jQuery 3.x ([]) and 2.x (null) behavior.
            var val = element.val();
            if (val === null) {
              val = [];
            }
            expect(val).toEqual([]);

            expect(ngModelCtrlSpy).toHaveBeenCalledTimes(1);

        });

        they('should set the model to null when the currently selected option with $prop becomes disabled',
          [
            'ngValue',
            'interpolatedValue',
            'interpolatedText'
          ], function(prop) {

            var A = { name: 'A'}, B = { name: 'B'}, C = { name: 'C'}, D = { name: 'D'};

            scope.options = [A, B, C, D];
            scope.obj = {};

            var optionString = '';

            switch (prop) {
              case 'ngValue':
                optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled" ng-value="option.name">{{$index}}</option>';
                break;
              case 'interpolatedValue':
                optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled" value="{{option.name}}">{{$index}}</option>';
                break;
              case 'interpolatedText':
                optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled">{{option.name}}</option>';
                break;
            }

            compile(
              '<select ng-model="obj.value" multiple>' +
                optionString +
              '</select>'
            );

            var ngModelCtrl = element.controller('ngModel');
            var ngModelCtrlSpy = spyOn(ngModelCtrl, '$setViewValue').and.callThrough();

            var optionElements = element.find('option');
            expect(optionElements.length).toEqual(4);

            optionElements.eq(0).prop('selected', true);
            optionElements.eq(2).prop('selected', true);
            optionElements.eq(3).prop('selected', true);
            browserTrigger(element);

            optionElements = element.find('option');
            expect(optionElements.length).toEqual(4);
            expect(scope.obj.value).toEqual(['A', 'C', 'D']);

            ngModelCtrlSpy.calls.reset();
            A.disabled = true;
            C.disabled = true;
            scope.$digest();

            optionElements = element.find('option');
            expect(optionElements.length).toEqual(4);
            expect(scope.obj.value).toEqual(['D']);
            expect(element.val()).toEqual(prop === 'ngValue' ? ['string:D'] : ['D']);
            expect(ngModelCtrlSpy).toHaveBeenCalledTimes(1);
        });


        they('should select disabled options with $prop when the model is set to matching values',
          [
            'ngValue',
            'interpolatedValue',
            'interpolatedText'
          ], function(prop) {

            var A = { name: 'A'}, B = { name: 'B'}, C = { name: 'C'}, D = {name: 'D'};

            scope.options = [A, B, C, D];
            scope.obj = {};

            var optionString = '';

            switch (prop) {
              case 'ngValue':
                optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled" ng-value="option">{{$index}}</option>';
                break;
              case 'interpolatedValue':
                optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled" value="{{option.name}}">{{$index}}</option>';
                break;
              case 'interpolatedText':
                optionString = '<option ng-repeat="option in options" ng-disabled="option.disabled">{{option.name}}</option>';
                break;
            }

            compile(
              '<select ng-model="obj.value" multiple>' +
                optionString +
              '</select>'
            );

            var optionElements = element.find('option');
            expect(optionElements.length).toEqual(4);
            expect(element[0].value).toBe('');

            A.disabled = true;
            D.disabled = true;
            scope.$digest();

            optionElements = element.find('option');
            expect(optionElements.length).toEqual(4);
            expect(element[0].value).toBe('');

            scope.obj.value = prop === 'ngValue' ? [A, C, D] : ['A', 'C', 'D'];
            scope.$digest();

            optionElements = element.find('option');
            expect(optionElements.length).toEqual(4);
            expect(scope.obj.value).toEqual(prop === 'ngValue' ?
              [
                {name: 'A', $$hashKey: 'object:3', disabled: true},
                {name: 'C', $$hashKey: 'object:5'},
                {name: 'D', $$hashKey: 'object:6', disabled: true}
              ] :
              ['A', 'C', 'D']
            );

            expect(optionElements.eq(0).prop('selected')).toBe(true);
            expect(optionElements.eq(2).prop('selected')).toBe(true);
            expect(optionElements.eq(3).prop('selected')).toBe(true);
        });

        they('should select a newly added option with $prop when it matches the current model',
          [
            'ngValue',
            'interpolatedValue',
            'interpolatedText'
          ], function(prop) {

            var A = { name: 'A'}, B = { name: 'B'}, C = { name: 'C'};

            scope.options = [A, B];
            scope.obj = {
              value: prop === 'ngValue' ? [B, C] : ['B', 'C']
            };

            var optionString = '';

            switch (prop) {
              case 'ngValue':
                optionString = '<option ng-repeat="option in options" ng-value="option">{{$index}}</option>';
                break;
              case 'interpolatedValue':
                optionString = '<option ng-repeat="option in options" value="{{option.name}}">{{$index}}</option>';
                break;
              case 'interpolatedText':
                optionString = '<option ng-repeat="option in options">{{option.name}}</option>';
                break;
            }

            compile(
              '<select ng-model="obj.value" multiple>' +
                optionString +
              '</select>'
            );

            var optionElements = element.find('option');
            expect(optionElements.length).toEqual(2);
            expect(optionElements.eq(1).prop('selected')).toBe(true);

            scope.options.push(C);
            scope.$digest();

            optionElements = element.find('option');
            expect(element.val()).toEqual(prop === 'ngValue' ? ['object:4', 'object:7'] : ['B', 'C']);
            expect(optionElements.length).toEqual(3);
            expect(optionElements[1].selected).toBe(true);
            expect(optionElements[2].selected).toBe(true);
            expect(scope.obj.value).toEqual(prop === 'ngValue' ?
              [{ name: 'B', $$hashKey: 'object:4'},
                {name: 'C', $$hashKey: 'object:7'}] :
              ['B', 'C']);
        });

        they('should keep selection and model when a repeated options with track by are replaced with equal options',
          [
            'ngValue',
            'interpolatedValue',
            'interpolatedText'
          ], function(prop) {

            var A = { name: 'A'}, B = { name: 'B'}, C = { name: 'C'};

            scope.options = [A, B, C];
            scope.obj = {
              value: 'C'
            };

            var optionString = '';

            switch (prop) {
              case 'ngValue':
                optionString = '<option ng-repeat="option in options track by option.name" ng-value="option.name">{{$index}}</option>';
                break;
              case 'interpolatedValue':
                optionString = '<option ng-repeat="option in options track by option.name" value="{{option.name}}">{{$index}}</option>';
                break;
              case 'interpolatedText':
                optionString = '<option ng-repeat="option in options track by option.name">{{option.name}}</option>';
                break;
            }

            compile(
              '<select ng-model="obj.value" multiple>' +
                optionString +
              '</select>'
            );

            var optionElements = element.find('option');
            expect(optionElements.length).toEqual(3);

            scope.obj.value = ['B', 'C'];
            scope.$digest();

            optionElements = element.find('option');
            expect(element.val()).toEqual(prop === 'ngValue' ? ['string:B', 'string:C'] : ['B', 'C']);
            expect(optionElements.length).toEqual(3);
            expect(optionElements[1].selected).toBe(true);
            expect(optionElements[2].selected).toBe(true);
            expect(scope.obj.value).toEqual(['B', 'C']);

            scope.options = [
              {name: 'A'},
              {name: 'B'},
              {name: 'C'}
            ];
            scope.$digest();

            optionElements = element.find('option');
            expect(element.val()).toEqual(prop === 'ngValue' ? ['string:B', 'string:C'] : ['B', 'C']);
            expect(optionElements.length).toEqual(3);
            expect(optionElements[1].selected).toBe(true);
            expect(optionElements[2].selected).toBe(true);
            expect(scope.obj.value).toEqual(['B', 'C']);
        });

      });

      it('should keep the ngModel value when the selected option is recreated by ngRepeat', function() {
          scope.options = [{ name: 'A'}, { name: 'B'}, { name: 'C'}];
          scope.obj = {
            value: 'B'
          };

          compile(
            '<select ng-model="obj.value">' +
              '<option ng-repeat="option in options" value="{{option.name}}">{{option.name}}</option>' +
            '</select>'
          );

          var optionElements = element.find('option');
          expect(optionElements.length).toEqual(3);
          expect(optionElements[0].value).toBe('A');
          expect(optionElements[1]).toBeMarkedAsSelected();
          expect(scope.obj.value).toBe('B');

          scope.$apply(function() {
            // Only when new objects are used, ngRepeat re-creates the element from scratch
            scope.options = [{ name: 'B'}, { name: 'C'}, { name: 'D'}];
          });

          var previouslySelectedOptionElement = optionElements[1];
          optionElements = element.find('option');

          expect(optionElements.length).toEqual(3);
          expect(optionElements[0].value).toBe('B');
          expect(optionElements[0]).toBeMarkedAsSelected();
          expect(scope.obj.value).toBe('B');
          // Ensure the assumption that the element is re-created is true
          expect(previouslySelectedOptionElement).not.toBe(optionElements[0]);
      });

    });


  });
});
