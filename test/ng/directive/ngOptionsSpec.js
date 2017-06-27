'use strict';

describe('ngOptions', function() {

  var scope, formElement, element, $compile, linkLog, childListMutationObserver, ngModelCtrl;

  function compile(html) {
    formElement = jqLite('<form name="form">' + html + '</form>');
    element = formElement.find('select');
    $compile(formElement)(scope);
    ngModelCtrl = element.controller('ngModel');
    scope.$apply();
  }

  function setSelectValue(selectElement, optionIndex) {
    var option = selectElement.find('option').eq(optionIndex);
    selectElement.val(option.val());
    browserTrigger(element, 'change');
  }


  beforeEach(function() {
    jasmine.addMatchers({
      toEqualSelectValue: function() {
        return {
          compare: function(_actual_, value, multiple) {
            var errors = [];
            var actual = _actual_.val();

            if (multiple) {
              value = value.map(function(val) { return hashKey(val); });
              actual = actual || [];
            } else {
              value = hashKey(value);
            }

            if (!equals(actual, value)) {
              errors.push('Expected select value "' + actual + '" to equal "' + value + '"');
            }
            var message = function() {
              return errors.join('\n');
            };

            return { pass: errors.length === 0, message: message };
          }
        };
      },
      toEqualOption: function() {
        return {
          compare: function(actual, value, text, label) {
            var errors = [];
            var hash = hashKey(value);
            if (actual.attr('value') !== hash) {
              errors.push('Expected option value "' + actual.attr('value') + '" to equal "' + hash + '"');
            }
            if (text && actual.text() !== text) {
              errors.push('Expected option text "' + actual.text() + '" to equal "' + text + '"');
            }
            if (label && actual.attr('label') !== label) {
              errors.push('Expected option label "' + actual.attr('label') + '" to equal "' + label + '"');
            }

            var message = function() {
              return errors.join('\n');
            };

            return { pass: errors.length === 0, message: message };
          }
        };
      },
      toEqualTrackedOption: function() {
        return {
          compare: function(actual, value, text, label) {
            var errors = [];
            if (actual.attr('value') !== '' + value) {
              errors.push('Expected option value "' + actual.attr('value') + '" to equal "' + value + '"');
            }
            if (text && actual.text() !== text) {
              errors.push('Expected option text "' + actual.text() + '" to equal "' + text + '"');
            }
            if (label && actual.attr('label') !== label) {
              errors.push('Expected option label "' + actual.attr('label') + '" to equal "' + label + '"');
            }

            var message = function() {
              return errors.join('\n');
            };

            return { pass: errors.length === 0, message: message };
          }
        };
      },
      toEqualUnknownOption: function() {
        return {
          compare: function(actual) {
            var errors = [];
            if (actual.attr('value') !== '?') {
              errors.push('Expected option value "' + actual.attr('value') + '" to equal "?"');
            }

            var message = function() {
              return errors.join('\n');
            };

            return { pass: errors.length === 0, message: message };
          }
        };
      },
      toEqualUnknownValue: function() {
        return {
          compare: function(actual, value) {
            var errors = [];
            if (actual !== '?') {
              errors.push('Expected select value "' + actual + '" to equal "?"');
            }

            var message = function() {
              return errors.join('\n');
            };

            return { pass: errors.length === 0, message: message };
          }
        };
      }
    });
  });

  beforeEach(module(function($compileProvider, $provide) {
    linkLog = [];

    $compileProvider
      .directive('customSelect', function() {
        return {
          restrict: 'E',
          replace: true,
          scope: {
            ngModel: '=',
            options: '='
          },
          templateUrl: 'select_template.html',
          link: function(scope, $element, attributes) {
            scope.selectable_options = scope.options;
          }
        };
      })

      .directive('oCompileContents', function() {
        return {
          link: function(scope, element) {
            linkLog.push('linkCompileContents');
            $compile(element.contents())(scope);
          }
        };
      })

      .directive('observeChildList', function() {
        return {
          link: function(scope, element) {
            var config = { childList: true };

            childListMutationObserver = new window.MutationObserver(noop);
            childListMutationObserver.observe(element[0], config);
          }
        };
      });

    $provide.decorator('ngOptionsDirective', function($delegate) {

      var origPreLink = $delegate[0].link.pre;
      var origPostLink = $delegate[0].link.post;

      $delegate[0].compile = function() {
        return {
          pre: origPreLink,
          post: function() {
            linkLog.push('linkNgOptions');
            origPostLink.apply(this, arguments);
          }
        };
      };

      return $delegate;
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
    ngModelCtrl = null;
  });

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


  it('should have a dependency on ngModel', function() {
    expect(function() {
      compile('<select ng-options="item in items"></select>');
    }).toThrow();
  });


  it('should render a list', function() {
    createSingleSelect();

    scope.$apply(function() {
      scope.values = [{name: 'A'}, {name: 'B'}, {name: 'C'}];
      scope.selected = scope.values[1];
    });

    var options = element.find('option');
    expect(options.length).toEqual(3);
    expect(options.eq(0)).toEqualOption(scope.values[0], 'A');
    expect(options.eq(1)).toEqualOption(scope.values[1], 'B');
    expect(options.eq(2)).toEqualOption(scope.values[2], 'C');
    expect(options[1].selected).toEqual(true);
  });


  it('should not include properties with non-numeric keys in array-like collections when using array syntax', function() {
    createSelect({
      'ng-model':'selected',
      'ng-options':'value for value in values'
    });

    scope.$apply(function() {
      scope.values = { 0: 'X', 1: 'Y', 2: 'Z', 'a': 'A', length: 3};
      scope.selected = scope.values[1];
    });

    var options = element.find('option');
    expect(options.length).toEqual(3);
    expect(options.eq(0)).toEqualOption('X');
    expect(options.eq(1)).toEqualOption('Y');
    expect(options.eq(2)).toEqualOption('Z');

  });


  it('should include properties with non-numeric keys in array-like collections when using object syntax', function() {
    createSelect({
      'ng-model':'selected',
      'ng-options':'value for (key, value) in values'
    });

    scope.$apply(function() {
      scope.values = { 0: 'X', 1: 'Y', 2: 'Z', 'a': 'A', length: 3};
      scope.selected = scope.values[1];
    });

    var options = element.find('option');
    expect(options.length).toEqual(5);
    expect(options.eq(0)).toEqualOption('X');
    expect(options.eq(1)).toEqualOption('Y');
    expect(options.eq(2)).toEqualOption('Z');
    expect(options.eq(3)).toEqualOption('A');
    expect(options.eq(4)).toEqualOption(3);
  });


  it('should render an object', function() {
    createSelect({
      'ng-model': 'selected',
      'ng-options': 'value as key for (key, value) in object'
    });

    scope.$apply(function() {
      scope.object = {'red': 'FF0000', 'green': '00FF00', 'blue': '0000FF'};
      scope.selected = scope.object.green;
    });

    var options = element.find('option');
    expect(options.length).toEqual(3);
    expect(options.eq(0)).toEqualOption('FF0000', 'red');
    expect(options.eq(1)).toEqualOption('00FF00', 'green');
    expect(options.eq(2)).toEqualOption('0000FF', 'blue');
    expect(options[1].selected).toEqual(true);

    scope.$apply('object.azur = "8888FF"');

    options = element.find('option');
    expect(options[1].selected).toEqual(true);

    scope.$apply('selected = object.azur');

    options = element.find('option');
    expect(options[3].selected).toEqual(true);

  });

  it('should set the "selected" attribute and property on selected options', function() {
    scope.values = [{
      id: 'FF0000',
      display: 'red'
    }, {
      id: '0000FF',
      display: 'blue'
    }];
    scope.selected = 'FF0000';

    createSelect({
      'ng-model': 'selected',
      'ng-options': 'option.id as option.display for option in values'
    });
    scope.$digest();

    var options = element.find('option');
    expect(options.length).toEqual(2);
    expect(options.eq(0)).toEqualOption('FF0000', 'red');
    expect(options.eq(1)).toEqualOption('0000FF', 'blue');

    expect(options.eq(0)[0].getAttribute('selected')).toBe('selected');
    expect(options.eq(0).attr('selected')).toBe('selected');
    expect(options.eq(0)[0].selected).toBe(true);
    expect(options.eq(0).prop('selected')).toBe(true);

    scope.selected = '0000FF';
    scope.$digest();

    expect(options.eq(1)[0].getAttribute('selected')).toBe('selected');
    expect(options.eq(1).attr('selected')).toBe('selected');
    expect(options.eq(1)[0].selected).toBe(true);
    expect(options.eq(1).prop('selected')).toBe(true);
  });

  it('should render zero as a valid display value', function() {
    createSingleSelect();

    scope.$apply(function() {
      scope.values = [{name: 0}, {name: 1}, {name: 2}];
      scope.selected = scope.values[0];
    });

    var options = element.find('option');
    expect(options.length).toEqual(3);
    expect(options.eq(0)).toEqualOption(scope.values[0], '0');
    expect(options.eq(1)).toEqualOption(scope.values[1], '1');
    expect(options.eq(2)).toEqualOption(scope.values[2], '2');
  });


  it('should not be set when an option is selected and options are set asynchronously',
    inject(function($timeout) {
      compile('<select ng-model="model" ng-options="opt.id as opt.label for opt in options">' +
                  '</select>');

      scope.$apply(function() {
        scope.model = 0;
      });

      $timeout(function() {
        scope.options = [
          {id: 0, label: 'x'},
          {id: 1, label: 'y'}
        ];
      }, 0);

      $timeout.flush();

      var options = element.find('option');

      expect(options.length).toEqual(2);
      expect(options.eq(0)).toEqualOption(0, 'x');
      expect(options.eq(1)).toEqualOption(1, 'y');
    })
  );


  it('should grow list', function() {
    createSingleSelect();

    scope.$apply(function() {
      scope.values = [];
    });

    expect(element.find('option').length).toEqual(1); // because we add special unknown option
    expect(element.find('option').eq(0)).toEqualUnknownOption();

    scope.$apply(function() {
      scope.values.push({name:'A'});
      scope.selected = scope.values[0];
    });

    expect(element.find('option').length).toEqual(1);
    expect(element.find('option')).toEqualOption(scope.values[0], 'A');

    scope.$apply(function() {
      scope.values.push({name:'B'});
    });

    expect(element.find('option').length).toEqual(2);
    expect(element.find('option').eq(0)).toEqualOption(scope.values[0], 'A');
    expect(element.find('option').eq(1)).toEqualOption(scope.values[1], 'B');
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
    expect(element.find('option').eq(0)).toEqualOption(scope.values[0], 'A');
    expect(element.find('option').eq(1)).toEqualOption(scope.values[1], 'B');

    scope.$apply(function() {
      scope.values.pop();
    });

    expect(element.find('option').length).toEqual(1);
    expect(element.find('option')).toEqualOption(scope.values[0], 'A');

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
    expect(options.eq(0)).toEqualOption(scope.values[0], 'B');
    expect(options.eq(1)).toEqualOption(scope.values[1], 'C');
    expect(options.eq(2)).toEqualOption(scope.values[2], 'D');
  });


  it('should preserve pre-existing empty option', function() {
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
    expect(options.eq(0)).toEqualOption('regularProperty', 'visible');
  });


  it('should not watch non-numeric array properties', function() {
    createSelect({
      'ng-options': 'value as createLabel(value) for value in array',
      'ng-model': 'selected'
    });
    scope.createLabel = jasmine.createSpy('createLabel').and.callFake(function(value) { return value; });
    scope.array = ['a', 'b', 'c'];
    scope.array.$$private = 'do not watch';
    scope.array.$property = 'do not watch';
    scope.array.other = 'do not watch';
    scope.array.fn = function() {};
    scope.selected = 'b';
    scope.$digest();

    expect(scope.createLabel).toHaveBeenCalledWith('a');
    expect(scope.createLabel).toHaveBeenCalledWith('b');
    expect(scope.createLabel).toHaveBeenCalledWith('c');
    expect(scope.createLabel).not.toHaveBeenCalledWith('do not watch');
    expect(scope.createLabel).not.toHaveBeenCalledWith(jasmine.any(Function));
  });


  it('should not watch object properties that start with $ or $$', function() {
    createSelect({
      'ng-options': 'key as createLabel(key) for (key, value) in object',
      'ng-model': 'selected'
    });
    scope.createLabel = jasmine.createSpy('createLabel').and.callFake(function(value) { return value; });
    scope.object = {'regularProperty': 'visible', '$$private': 'invisible', '$property': 'invisible'};
    scope.selected = 'regularProperty';
    scope.$digest();

    expect(scope.createLabel).toHaveBeenCalledWith('regularProperty');
    expect(scope.createLabel).not.toHaveBeenCalledWith('$$private');
    expect(scope.createLabel).not.toHaveBeenCalledWith('$property');
  });

  it('should allow expressions over multiple lines', function() {
    scope.isNotFoo = function(item) {
      return item.name !== 'Foo';
    };

    createSelect({
      'ng-options': 'key.id\n' +
        'for key in values\n' +
        '| filter:isNotFoo',
      'ng-model': 'selected'
    });

    scope.$apply(function() {
      scope.values = [{'id': 1, 'name': 'Foo'},
                      {'id': 2, 'name': 'Bar'},
                      {'id': 3, 'name': 'Baz'}];
      scope.selected = scope.values[0];
    });

    var options = element.find('option');
    expect(options.length).toEqual(3);
    expect(options.eq(1)).toEqualOption(scope.values[1], '2');
    expect(options.eq(2)).toEqualOption(scope.values[2], '3');
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

    expect(scope.selected).toEqual(jasmine.objectContaining({ name: 'A' }));
    expect(options.eq(0).prop('selected')).toBe(true);
    expect(options.eq(1).prop('selected')).toBe(false);

    var optionToSelect = options.eq(1);

    expect(optionToSelect.text()).toBe('B');

    optionToSelect.prop('selected', true);
    scope.$digest();

    expect(optionToSelect.prop('selected')).toBe(true);
    expect(scope.selected).toBe(scope.values[0]);
  });


  // bug fix #9621
  it('should update the label property', function() {
    // ng-options="value.name for value in values"
    // ng-model="selected"
    createSingleSelect();

    scope.$apply(function() {
      scope.values = [{name: 'A'}, {name: 'B'}, {name: 'C'}];
      scope.selected = scope.values[0];
    });

    var options = element.find('option');
    expect(options.eq(0).prop('label')).toEqual('A');
    expect(options.eq(1).prop('label')).toEqual('B');
    expect(options.eq(2).prop('label')).toEqual('C');
  });


  it('should update the label if only the property has changed', function() {
    // ng-options="value.name for value in values"
    // ng-model="selected"
    createSingleSelect();

    scope.$apply(function() {
      scope.values = [{name: 'A'}, {name: 'B'}, {name: 'C'}];
      scope.selected = scope.values[0];
    });

    var options = element.find('option');
    expect(options.eq(0).prop('label')).toEqual('A');
    expect(options.eq(1).prop('label')).toEqual('B');
    expect(options.eq(2).prop('label')).toEqual('C');


    scope.$apply('values[0].name = "X"');

    options = element.find('option');
    expect(options.eq(0).prop('label')).toEqual('X');

  });


  // bug fix #9714
  it('should select the matching option when the options are updated', function() {

    // first set up a select with no options
    scope.selected = '';
    createSelect({
      'ng-options': 'val.id as val.label for val in values',
      'ng-model': 'selected'
    });
    var options = element.find('option');
    // we expect the selected option to be the "unknown" option
    expect(options.eq(0)).toEqualUnknownOption('');
    expect(options.eq(0).prop('selected')).toEqual(true);

    // now add some real options - one of which matches the selected value
    scope.$apply('values = [{id:"",label:"A"},{id:"1",label:"B"},{id:"2",label:"C"}]');

    // we expect the selected option to be the one that matches the correct item
    // and for the unknown option to have been removed
    options = element.find('option');
    expect(element).toEqualSelectValue('');
    expect(options.eq(0)).toEqualOption('','A');
  });



  it('should be possible to use one-time binding on the expression', function() {
    createSelect({
      'ng-model': 'someModel',
      'ng-options': 'o as o for o in ::arr'
    });

    var options;

    // Initially the options list is just the unknown option
    options = element.find('option');
    expect(options.length).toEqual(1);

    // Now initialize the scope and the options should be updated
    scope.$apply(function() {
      scope.arr = ['a','b','c'];
    });
    options = element.find('option');
    expect(options.length).toEqual(4);
    expect(options.eq(0)).toEqualUnknownOption();
    expect(options.eq(1)).toEqualOption('a');
    expect(options.eq(2)).toEqualOption('b');
    expect(options.eq(3)).toEqualOption('c');

    // Change the scope but the options should not change
    scope.arr = ['w', 'x', 'y', 'z'];
    scope.$digest();
    options = element.find('option');
    expect(options.length).toEqual(4);
    expect(options.eq(0)).toEqualUnknownOption();
    expect(options.eq(1)).toEqualOption('a');
    expect(options.eq(2)).toEqualOption('b');
    expect(options.eq(3)).toEqualOption('c');
  });


  it('should remove the "selected" attribute from the previous option when the model changes', function() {
    scope.values = [{id: 10, label: 'ten'}, {id:20, label: 'twenty'}];

    createSelect({
      'ng-model': 'selected',
      'ng-options': 'item.label for item in values'
    }, true);

    var options = element.find('option');
    expect(options[0]).toBeMarkedAsSelected();
    expect(options[1]).not.toBeMarkedAsSelected();
    expect(options[2]).not.toBeMarkedAsSelected();

    scope.selected = scope.values[0];
    scope.$digest();

    expect(options[0]).not.toBeMarkedAsSelected();
    expect(options[1]).toBeMarkedAsSelected();
    expect(options[2]).not.toBeMarkedAsSelected();

    scope.selected = scope.values[1];
    scope.$digest();

    expect(options[0]).not.toBeMarkedAsSelected();
    expect(options[1]).not.toBeMarkedAsSelected();
    expect(options[2]).toBeMarkedAsSelected();

    // This will select the empty option
    scope.selected = null;
    scope.$digest();

    expect(options[0]).toBeMarkedAsSelected();
    expect(options[1]).not.toBeMarkedAsSelected();
    expect(options[2]).not.toBeMarkedAsSelected();

    // This will add and select the unknown option
    scope.selected = 'unmatched value';
    scope.$digest();
    options = element.find('option');

    expect(options[0]).toBeMarkedAsSelected();
    expect(options[1]).not.toBeMarkedAsSelected();
    expect(options[2]).not.toBeMarkedAsSelected();
    expect(options[3]).not.toBeMarkedAsSelected();

    // Back to matched value
    scope.selected = scope.values[1];
    scope.$digest();
    options = element.find('option');

    expect(options[0]).not.toBeMarkedAsSelected();
    expect(options[1]).not.toBeMarkedAsSelected();
    expect(options[2]).toBeMarkedAsSelected();
  });


  if (window.MutationObserver) {
    //IE9 and IE10 do not support MutationObserver
    //Since the feature is only needed for a test, it's okay to skip these browsers
    it('should render the initial options only one time', function() {
      scope.value = 'black';
      scope.values = ['black', 'white', 'red'];
      // observe-child-list adds a MutationObserver that we will read out after ngOptions
      // has been compiled
      createSelect({
        'ng-model':'value',
        'ng-options':'value.name for value in values',
        'observe-child-list': ''
      });

      var optionEls = element[0].querySelectorAll('option');
      var records = childListMutationObserver.takeRecords();

      expect(records.length).toBe(1);
      expect(records[0].addedNodes).toEqual(optionEls);
    });
  }

  describe('disableWhen expression', function() {

    describe('on single select', function() {

      it('should disable options', function() {

        scope.selected = '';
        scope.options = [
          { name: 'white', value: '#FFFFFF' },
          { name: 'one', value: 1, unavailable: true },
          { name: 'notTrue', value: false },
          { name: 'thirty', value: 30, unavailable: false }
        ];
        createSelect({
          'ng-options': 'o.value as o.name disable when o.unavailable for o in options',
          'ng-model': 'selected'
        });
        var options = element.find('option');

        expect(options.length).toEqual(5);
        expect(options.eq(1).prop('disabled')).toEqual(false);
        expect(options.eq(2).prop('disabled')).toEqual(true);
        expect(options.eq(3).prop('disabled')).toEqual(false);
        expect(options.eq(4).prop('disabled')).toEqual(false);
      });


      it('should select disabled options when model changes', function() {
        scope.options = [
          { name: 'white', value: '#FFFFFF' },
          { name: 'one', value: 1, unavailable: true },
          { name: 'notTrue', value: false },
          { name: 'thirty', value: 30, unavailable: false }
        ];
        createSelect({
          'ng-options': 'o.value as o.name disable when o.unavailable for o in options',
          'ng-model': 'selected'
        });

        // Initially the model is set to an enabled option
        scope.$apply('selected = 30');
        var options = element.find('option');
        expect(options.eq(3).prop('selected')).toEqual(true);

        // Now set the model to a disabled option
        scope.$apply('selected = 1');
        options = element.find('option');

        // jQuery returns null for val() when the option is disabled, see
        // https://bugs.jquery.com/ticket/13097
        expect(element[0].value).toBe('number:1');
        expect(options.length).toEqual(4);
        expect(options.eq(0).prop('selected')).toEqual(false);
        expect(options.eq(1).prop('selected')).toEqual(true);
        expect(options.eq(2).prop('selected')).toEqual(false);
        expect(options.eq(3).prop('selected')).toEqual(false);
      });


      it('should select options in model when they become enabled', function() {
        scope.options = [
          { name: 'white', value: '#FFFFFF' },
          { name: 'one', value: 1, unavailable: true },
          { name: 'notTrue', value: false },
          { name: 'thirty', value: 30, unavailable: false }
        ];
        createSelect({
          'ng-options': 'o.value as o.name disable when o.unavailable for o in options',
          'ng-model': 'selected'
        });

        // Set the model to a disabled option
        scope.$apply('selected = 1');
        var options = element.find('option');

        // jQuery returns null for val() when the option is disabled, see
        // https://bugs.jquery.com/ticket/13097
        expect(element[0].value).toBe('number:1');
        expect(options.length).toEqual(4);
        expect(options.eq(0).prop('selected')).toEqual(false);
        expect(options.eq(1).prop('selected')).toEqual(true);
        expect(options.eq(2).prop('selected')).toEqual(false);
        expect(options.eq(3).prop('selected')).toEqual(false);

        // Now enable that option
        scope.$apply(function() {
          scope.options[1].unavailable = false;
        });

        expect(element).toEqualSelectValue(1);
        options = element.find('option');
        expect(options.length).toEqual(4);
        expect(options.eq(1).prop('selected')).toEqual(true);
        expect(options.eq(3).prop('selected')).toEqual(false);
      });
    });


    describe('on multi select', function() {

      it('should disable options', function() {

        scope.selected = [];
        scope.options = [
          { name: 'a', value: 0 },
          { name: 'b', value: 1, unavailable: true },
          { name: 'c', value: 2 },
          { name: 'd', value: 3, unavailable: false }
        ];
        createSelect({
          'ng-options': 'o.value as o.name disable when o.unavailable for o in options',
          'multiple': true,
          'ng-model': 'selected'
        });
        var options = element.find('option');

        expect(options.eq(0).prop('disabled')).toEqual(false);
        expect(options.eq(1).prop('disabled')).toEqual(true);
        expect(options.eq(2).prop('disabled')).toEqual(false);
        expect(options.eq(3).prop('disabled')).toEqual(false);
      });


      it('should select disabled options when model changes', function() {
        scope.options = [
          { name: 'a', value: 0 },
          { name: 'b', value: 1, unavailable: true },
          { name: 'c', value: 2 },
          { name: 'd', value: 3, unavailable: false }
        ];
        createSelect({
          'ng-options': 'o.value as o.name disable when o.unavailable for o in options',
          'multiple': true,
          'ng-model': 'selected'
        });

        // Initially the model is set to an enabled option
        scope.$apply('selected = [3]');
        var options = element.find('option');
        expect(options.eq(0).prop('selected')).toEqual(false);
        expect(options.eq(1).prop('selected')).toEqual(false);
        expect(options.eq(2).prop('selected')).toEqual(false);
        expect(options.eq(3).prop('selected')).toEqual(true);

        // Now add a disabled option
        scope.$apply('selected = [1,3]');
        options = element.find('option');
        expect(options.eq(0).prop('selected')).toEqual(false);
        expect(options.eq(1).prop('selected')).toEqual(true);
        expect(options.eq(2).prop('selected')).toEqual(false);
        expect(options.eq(3).prop('selected')).toEqual(true);

        // Now only select the disabled option
        scope.$apply('selected = [1]');
        expect(options.eq(0).prop('selected')).toEqual(false);
        expect(options.eq(1).prop('selected')).toEqual(true);
        expect(options.eq(2).prop('selected')).toEqual(false);
        expect(options.eq(3).prop('selected')).toEqual(false);
      });


      it('should select options in model when they become enabled', function() {
        scope.options = [
          { name: 'a', value: 0 },
          { name: 'b', value: 1, unavailable: true },
          { name: 'c', value: 2 },
          { name: 'd', value: 3, unavailable: false }
        ];
        createSelect({
          'ng-options': 'o.value as o.name disable when o.unavailable for o in options',
          'multiple': true,
          'ng-model': 'selected'
        });

        // Set the model to a disabled option
        scope.$apply('selected = [1]');
        var options = element.find('option');

        expect(options.eq(0).prop('selected')).toEqual(false);
        expect(options.eq(1).prop('selected')).toEqual(true);
        expect(options.eq(2).prop('selected')).toEqual(false);
        expect(options.eq(3).prop('selected')).toEqual(false);

        // Now enable that option
        scope.$apply(function() {
          scope.options[1].unavailable = false;
        });

        expect(element).toEqualSelectValue([1], true);
        options = element.find('option');
        expect(options.eq(0).prop('selected')).toEqual(false);
        expect(options.eq(1).prop('selected')).toEqual(true);
        expect(options.eq(2).prop('selected')).toEqual(false);
        expect(options.eq(3).prop('selected')).toEqual(false);
      });
    });
  });


  describe('selectAs expression', function() {
    beforeEach(function() {
      scope.arr = [{id: 10, label: 'ten'}, {id:20, label: 'twenty'}];
      scope.obj = {'10': {score: 10, label: 'ten'}, '20': {score: 20, label: 'twenty'}};
    });

    it('should support single select with array source', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.id as item.label for item in arr'
      });

      scope.$apply(function() {
        scope.selected = 10;
      });
      expect(element).toEqualSelectValue(10);

      setSelectValue(element, 1);
      expect(scope.selected).toBe(20);
    });


    it('should support multi select with array source', function() {
      createSelect({
        'ng-model': 'selected',
        'multiple': true,
        'ng-options': 'item.id as item.label for item in arr'
      });

      scope.$apply(function() {
        scope.selected = [10,20];
      });
      expect(element).toEqualSelectValue([10,20], true);
      expect(scope.selected).toEqual([10,20]);

      element.children()[0].selected = false;
      browserTrigger(element, 'change');
      expect(scope.selected).toEqual([20]);
      expect(element).toEqualSelectValue([20], true);
    });


    it('should re-render if an item in an array source is added/removed', function() {
      createSelect({
        'ng-model': 'selected',
        'multiple': true,
        'ng-options': 'item.id as item.label for item in arr'
      });

      scope.$apply(function() {
        scope.selected = [10];
      });
      expect(element).toEqualSelectValue([10], true);

      scope.$apply(function() {
        scope.selected.push(20);
      });
      expect(element).toEqualSelectValue([10, 20], true);


      scope.$apply(function() {
        scope.selected.shift();
      });
      expect(element).toEqualSelectValue([20], true);
    });


    it('should handle a options containing circular references', function() {
      scope.arr[0].ref = scope.arr[0];
      scope.selected = [scope.arr[0]];
      createSelect({
        'ng-model': 'selected',
        'multiple': true,
        'ng-options': 'item as item.label for item in arr'
      });
      expect(element).toEqualSelectValue([scope.arr[0]], true);

      scope.$apply(function() {
        scope.selected.push(scope.arr[1]);
      });
      expect(element).toEqualSelectValue([scope.arr[0], scope.arr[1]], true);


      scope.$apply(function() {
        scope.selected.pop();
      });
      expect(element).toEqualSelectValue([scope.arr[0]], true);
    });


    it('should support single select with object source', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'val.score as val.label for (key, val) in obj'
      });

      scope.$apply(function() {
        scope.selected = 10;
      });
      expect(element).toEqualSelectValue(10);

      setSelectValue(element, 1);
      expect(scope.selected).toBe(20);
    });


    it('should support multi select with object source', function() {
      createSelect({
        'ng-model': 'selected',
        'multiple': true,
        'ng-options': 'val.score as val.label for (key, val) in obj'
      });

      scope.$apply(function() {
        scope.selected = [10,20];
      });
      expect(element).toEqualSelectValue([10,20], true);

      element.children()[0].selected = false;
      browserTrigger(element, 'change');
      expect(scope.selected).toEqual([20]);
      expect(element).toEqualSelectValue([20], true);
    });
  });


  describe('trackBy expression', function() {
    beforeEach(function() {
      scope.arr = [{id: 10, label: 'ten'}, {id:20, label: 'twenty'}];
      scope.obj = {'1': {score: 10, label: 'ten'}, '2': {score: 20, label: 'twenty'}};
    });


    it('should set the result of track by expression to element value', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.label for item in arr track by item.id'
      });

      expect(element.val()).toEqualUnknownValue();

      scope.$apply(function() {
        scope.selected = scope.arr[0];
      });
      expect(element.val()).toBe('10');

      scope.$apply(function() {
        scope.arr[0] = {id: 10, label: 'new ten'};
      });
      expect(element.val()).toBe('10');

      element.children()[1].selected = 'selected';
      browserTrigger(element, 'change');
      expect(scope.selected).toEqual(scope.arr[1]);
    });


    it('should use the tracked expression as option value', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.label for item in arr track by item.id'
      });

      var options = element.find('option');
      expect(options.length).toEqual(3);
      expect(options.eq(0)).toEqualUnknownOption();
      expect(options.eq(1)).toEqualTrackedOption(10, 'ten');
      expect(options.eq(2)).toEqualTrackedOption(20, 'twenty');
    });


    it('should update the selected option even if only the tracked property on the selected object changes (single)', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.label for item in arr track by item.id'
      });

      scope.$apply(function() {
        scope.selected = {id: 10, label: 'ten'};
      });

      expect(element.val()).toEqual('10');

      // Update the properties on the selected object, rather than replacing the whole object
      scope.$apply(function() {
        scope.selected.id = 20;
        scope.selected.label = 'new twenty';
      });

      // The value of the select should change since the id property changed
      expect(element.val()).toEqual('20');

      // But the label of the selected option does not change
      var option = element.find('option').eq(1);
      expect(option.prop('selected')).toEqual(true);
      expect(option.text()).toEqual('twenty'); // not 'new twenty'
    });


    it('should update the selected options even if only the tracked properties on the objects in the ' +
        'selected collection change (multi)', function() {
      createSelect({
        'ng-model': 'selected',
        'multiple': true,
        'ng-options': 'item.label for item in arr track by item.id'
      });

      scope.$apply(function() {
        scope.selected = [{id: 10, label: 'ten'}];
      });

      expect(element.val()).toEqual(['10']);

      // Update the tracked property on the object in the selected array, rather than replacing the whole object
      scope.$apply(function() {
        scope.selected[0].id = 20;
      });

      // The value of the select should change since the id property changed
      expect(element.val()).toEqual(['20']);

      // But the label of the selected option does not change
      var option = element.find('option').eq(1);
      expect(option.prop('selected')).toEqual(true);
      expect(option.text()).toEqual('twenty'); // not 'new twenty'
    });


    it('should prevent changes to the selected object from modifying the options objects (single)', function() {

      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.label for item in arr track by item.id'
      });

      element.val('10');
      browserTrigger(element, 'change');

      expect(scope.selected).toEqual(scope.arr[0]);

      scope.$apply(function() {
        scope.selected.id = 20;
      });

      expect(scope.selected).not.toEqual(scope.arr[0]);
      expect(element.val()).toEqual('20');
      expect(scope.arr).toEqual([{id: 10, label: 'ten'}, {id:20, label: 'twenty'}]);
    });


    it('should preserve value even when reference has changed (single&array)', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.label for item in arr track by item.id'
      });

      scope.$apply(function() {
        scope.selected = scope.arr[0];
      });
      expect(element.val()).toBe('10');

      scope.$apply(function() {
        scope.arr[0] = {id: 10, label: 'new ten'};
      });
      expect(element.val()).toBe('10');

      element.children()[1].selected = 1;
      browserTrigger(element, 'change');
      expect(scope.selected).toEqual(scope.arr[1]);
    });


    it('should preserve value even when reference has changed (multi&array)', function() {
      createSelect({
        'ng-model': 'selected',
        'multiple': true,
        'ng-options': 'item.label for item in arr track by item.id'
      });

      scope.$apply(function() {
        scope.selected = scope.arr;
      });
      expect(element.val()).toEqual(['10','20']);

      scope.$apply(function() {
        scope.arr[0] = {id: 10, label: 'new ten'};
      });
      expect(element.val()).toEqual(['10','20']);

      element.children()[0].selected = false;
      browserTrigger(element, 'change');
      expect(scope.selected).toEqual([scope.arr[1]]);
    });


    it('should preserve value even when reference has changed (single&object)', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'val.label for (key, val) in obj track by val.score'
      });

      scope.$apply(function() {
        scope.selected = scope.obj['1'];
      });
      expect(element.val()).toBe('10');

      scope.$apply(function() {
        scope.obj['1'] = {score: 10, label: 'ten'};
      });
      expect(element.val()).toBe('10');

      setSelectValue(element, 1);
      expect(scope.selected).toEqual(scope.obj['2']);
    });


    it('should preserve value even when reference has changed (multi&object)', function() {
      createSelect({
        'ng-model': 'selected',
        'multiple': true,
        'ng-options': 'val.label for (key, val) in obj track by val.score'
      });

      scope.$apply(function() {
        scope.selected = [scope.obj['1']];
      });
      expect(element.val()).toEqual(['10']);

      scope.$apply(function() {
        scope.obj['1'] = {score: 10, label: 'ten'};
      });
      expect(element.val()).toEqual(['10']);

      element.children()[1].selected = 'selected';
      browserTrigger(element, 'change');
      expect(scope.selected).toEqual([scope.obj['1'], scope.obj['2']]);
    });

    it('should prevent infinite digest if track by expression is stable', function() {
      scope.makeOptions = function() {
          var options = [];
          for (var i = 0; i < 5; i++) {
              options.push({ label: 'Value = ' + i, value: i });
          }
          return options;
      };
      scope.selected = { label: 'Value = 1', value: 1 };
      expect(function() {
        createSelect({
          'ng-model': 'selected',
          'ng-options': 'item.label for item in makeOptions() track by item.value'
        });
      }).not.toThrow();
    });

    it('should re-render if the tracked property of the model is changed when using trackBy', function() {

      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item for item in arr track by item.id'
      });

      scope.$apply(function() {
        scope.selected = {id: 10, label: 'ten'};
      });

      spyOn(element.controller('ngModel'), '$render');

      scope.$apply(function() {
        scope.arr[0].id = 20;
      });

      // update render due to equality watch
      expect(element.controller('ngModel').$render).toHaveBeenCalled();

    });

    it('should not set view value again if the tracked property of the model has not changed when using trackBy', function() {

      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item for item in arr track by item.id'
      });

      scope.$apply(function() {
        scope.selected = {id: 10, label: 'ten'};
      });

      spyOn(element.controller('ngModel'), '$setViewValue');

      scope.$apply(function() {
        scope.arr[0] = {id: 10, label: 'ten'};
      });

      expect(element.controller('ngModel').$setViewValue).not.toHaveBeenCalled();
    });

    it('should not re-render if a property of the model is changed when not using trackBy', function() {

      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item for item in arr'
      });

      scope.$apply(function() {
        scope.selected = scope.arr[0];
      });

      spyOn(element.controller('ngModel'), '$render');

      scope.$apply(function() {
        scope.selected.label = 'changed';
      });

      // no render update as no equality watch
      expect(element.controller('ngModel').$render).not.toHaveBeenCalled();
    });


    it('should handle options containing circular references (single)', function() {
      scope.arr[0].ref = scope.arr[0];
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item for item in arr track by item.id'
      });

      expect(function() {
        scope.$apply(function() {
          scope.selected = scope.arr[0];
        });
      }).not.toThrow();
    });


    it('should handle options containing circular references (multiple)', function() {
      scope.arr[0].ref = scope.arr[0];
      createSelect({
        'ng-model': 'selected',
        'multiple': true,
        'ng-options': 'item for item in arr track by item.id'
      });

      expect(function() {
        scope.$apply(function() {
          scope.selected = [scope.arr[0]];
        });

        scope.$apply(function() {
          scope.selected.push(scope.arr[1]);
        });
      }).not.toThrow();
    });

    it('should remove the "selected" attribute when the model changes', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.label for item in arr track by item.id'
      });

      var options = element.find('option');
      browserTrigger(options[2], 'click');

      expect(scope.selected).toEqual(scope.arr[1]);

      scope.selected = {};
      scope.$digest();

      expect(options[0]).toBeMarkedAsSelected();
      expect(options[2]).not.toBeMarkedAsSelected();
      expect(options[2]).not.toBeMarkedAsSelected();
    });

  });


  /**
   * This behavior is broken and should probably be cleaned up later as track by and select as
   * aren't compatible.
   */
  describe('selectAs+trackBy expression', function() {
    beforeEach(function() {
      scope.arr = [{subItem: {label: 'ten', id: 10}}, {subItem: {label: 'twenty', id: 20}}];
      scope.obj = {'10': {subItem: {id: 10, label: 'ten'}}, '20': {subItem: {id: 20, label: 'twenty'}}};
    });


    it('It should use the "value" variable to represent items in the array as well as for the ' +
        'selected values in track by expression (single&array)', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.subItem as item.subItem.label for item in arr track by (item.id || item.subItem.id)'
      });

      // First test model -> view

      scope.$apply(function() {
        scope.selected = scope.arr[0].subItem;
      });
      expect(element.val()).toEqual('10');

      scope.$apply(function() {
        scope.selected = scope.arr[1].subItem;
      });
      expect(element.val()).toEqual('20');

      // Now test view -> model

      element.val('10');
      browserTrigger(element, 'change');
      expect(scope.selected).toEqual(scope.arr[0].subItem);

      // Now reload the array
      scope.$apply(function() {
        scope.arr = [{
          subItem: {label: 'new ten', id: 10}
        },{
          subItem: {label: 'new twenty', id: 20}
        }];
      });
      expect(element.val()).toBe('10');
      expect(scope.selected.id).toBe(10);
    });


    it('It should use the "value" variable to represent items in the array as well as for the ' +
        'selected values in track by expression (multiple&array)', function() {
      createSelect({
        'ng-model': 'selected',
        'multiple': true,
        'ng-options': 'item.subItem as item.subItem.label for item in arr track by (item.id || item.subItem.id)'
      });

      // First test model -> view

      scope.$apply(function() {
        scope.selected = [scope.arr[0].subItem];
      });
      expect(element.val()).toEqual(['10']);

      scope.$apply(function() {
        scope.selected = [scope.arr[1].subItem];
      });
      expect(element.val()).toEqual(['20']);

      // Now test view -> model

      element.find('option')[0].selected = true;
      element.find('option')[1].selected = false;
      browserTrigger(element, 'change');
      expect(scope.selected).toEqual([scope.arr[0].subItem]);

      // Now reload the array
      scope.$apply(function() {
        scope.arr = [{
          subItem: {label: 'new ten', id: 10}
        },{
          subItem: {label: 'new twenty', id: 20}
        }];
      });
      expect(element.val()).toEqual(['10']);
      expect(scope.selected[0].id).toEqual(10);
      expect(scope.selected.length).toBe(1);
    });


    it('It should use the "value" variable to represent items in the array as well as for the ' +
        'selected values in track by expression (multiple&object)', function() {
      createSelect({
        'ng-model': 'selected',
        'multiple': true,
        'ng-options': 'val.subItem as val.subItem.label for (key, val) in obj track by (val.id || val.subItem.id)'
      });

      // First test model -> view

      scope.$apply(function() {
        scope.selected = [scope.obj['10'].subItem];
      });
      expect(element.val()).toEqual(['10']);


      scope.$apply(function() {
        scope.selected = [scope.obj['10'].subItem];
      });
      expect(element.val()).toEqual(['10']);

      // Now test view -> model

      element.find('option')[0].selected = true;
      element.find('option')[1].selected = false;
      browserTrigger(element, 'change');
      expect(scope.selected).toEqual([scope.obj['10'].subItem]);

      // Now reload the object
      scope.$apply(function() {
        scope.obj = {
          '10': {
            subItem: {label: 'new ten', id: 10}
          },
          '20': {
            subItem: {label: 'new twenty', id: 20}
          }
        };
      });
      expect(element.val()).toEqual(['10']);
      expect(scope.selected[0].id).toBe(10);
      expect(scope.selected.length).toBe(1);
    });


    it('It should use the "value" variable to represent items in the array as well as for the ' +
        'selected values in track by expression (single&object)', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'val.subItem as val.subItem.label for (key, val) in obj track by (val.id || val.subItem.id)'
      });

      // First test model -> view

      scope.$apply(function() {
        scope.selected = scope.obj['10'].subItem;
      });
      expect(element.val()).toEqual('10');


      scope.$apply(function() {
        scope.selected = scope.obj['10'].subItem;
      });
      expect(element.val()).toEqual('10');

      // Now test view -> model

      element.find('option')[0].selected = true;
      browserTrigger(element, 'change');
      expect(scope.selected).toEqual(scope.obj['10'].subItem);

      // Now reload the object
      scope.$apply(function() {
        scope.obj = {
          '10': {
            subItem: {label: 'new ten', id: 10}
          },
          '20': {
            subItem: {label: 'new twenty', id: 20}
          }
        };
      });
      expect(element.val()).toEqual('10');
      expect(scope.selected.id).toBe(10);
    });
  });


  describe('binding', function() {

    it('should bind to scope value', function() {
      createSingleSelect();

      scope.$apply(function() {
        scope.values = [{name: 'A'}, {name: 'B'}];
        scope.selected = scope.values[0];
      });

      expect(element).toEqualSelectValue(scope.selected);

      scope.$apply(function() {
        scope.selected = scope.values[1];
      });

      expect(element).toEqualSelectValue(scope.selected);
    });


    it('should bind to scope value and group', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.name group by item.group for item in values'
      });

      scope.$apply(function() {
        scope.values = [{name: 'A'},
                        {name: 'B', group: 0},
                        {name: 'C', group: 'first'},
                        {name: 'D', group: 'second'},
                        {name: 'E', group: 0},
                        {name: 'F', group: 'first'},
                        {name: 'G', group: 'second'}];
        scope.selected = scope.values[3];
      });

      expect(element).toEqualSelectValue(scope.selected);

      var optgroups = element.find('optgroup');
      expect(optgroups.length).toBe(3);

      var zero = optgroups.eq(0);
      var b = zero.find('option').eq(0);
      var e = zero.find('option').eq(1);
      expect(zero.attr('label')).toEqual('0');
      expect(b.text()).toEqual('B');
      expect(e.text()).toEqual('E');

      var first = optgroups.eq(1);
      var c = first.find('option').eq(0);
      var f = first.find('option').eq(1);
      expect(first.attr('label')).toEqual('first');
      expect(c.text()).toEqual('C');
      expect(f.text()).toEqual('F');

      var second = optgroups.eq(2);
      var d = second.find('option').eq(0);
      var g = second.find('option').eq(1);
      expect(second.attr('label')).toEqual('second');
      expect(d.text()).toEqual('D');
      expect(g.text()).toEqual('G');

      scope.$apply(function() {
        scope.selected = scope.values[0];
      });

      expect(element).toEqualSelectValue(scope.selected);
    });


    it('should group when the options are available on compile time', function() {
      scope.values = [{name: 'C', group: 'first'},
                      {name: 'D', group: 'second'},
                      {name: 'F', group: 'first'},
                      {name: 'G', group: 'second'}];
      scope.selected = scope.values[3];

      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item as item.name group by item.group for item in values'
      });

      expect(element).toEqualSelectValue(scope.selected);

      var optgroups = element.find('optgroup');
      expect(optgroups.length).toBe(2);

      var first = optgroups.eq(0);
      var c = first.find('option').eq(0);
      var f = first.find('option').eq(1);
      expect(first.attr('label')).toEqual('first');
      expect(c.text()).toEqual('C');
      expect(f.text()).toEqual('F');

      var second = optgroups.eq(1);
      var d = second.find('option').eq(0);
      var g = second.find('option').eq(1);
      expect(second.attr('label')).toEqual('second');
      expect(d.text()).toEqual('D');
      expect(g.text()).toEqual('G');

      scope.$apply(function() {
        scope.selected = scope.values[0];
      });

      expect(element).toEqualSelectValue(scope.selected);
    });


    it('should group when the options are updated', function() {
      var optgroups, one, two, three, alpha, beta, gamma, delta, epsilon;

      createSelect({
        'ng-model': 'selected',
        'ng-options': 'i.name group by i.cls for i in list'
      });

      scope.list = [
        {cls: 'one', name: 'Alpha'},
        {cls: 'one', name: 'Beta'},
        {cls: 'two', name: 'Gamma'}
      ];
      scope.$digest();

      optgroups = element.find('optgroup');
      expect(optgroups.length).toBe(2);

      one = optgroups.eq(0);
      expect(one.children('option').length).toBe(2);

      alpha = one.find('option').eq(0);
      beta = one.find('option').eq(1);
      expect(one.attr('label')).toEqual('one');
      expect(alpha.text()).toEqual('Alpha');
      expect(beta.text()).toEqual('Beta');

      two = optgroups.eq(1);
      expect(two.children('option').length).toBe(1);

      gamma = two.find('option').eq(0);
      expect(two.attr('label')).toEqual('two');
      expect(gamma.text()).toEqual('Gamma');

      // Remove item from first group, add item to second group, add new group
      scope.list.shift();
      scope.list.push(
        {cls: 'two', name: 'Delta'},
        {cls: 'three', name: 'Epsilon'}
      );
      scope.$digest();

      optgroups = element.find('optgroup');
      expect(optgroups.length).toBe(3);

      // Group with removed item
      one = optgroups.eq(0);
      expect(one.children('option').length).toBe(1);

      beta = one.find('option').eq(0);
      expect(one.attr('label')).toEqual('one');
      expect(beta.text()).toEqual('Beta');

      // Group with new item
      two = optgroups.eq(1);
      expect(two.children('option').length).toBe(2);

      gamma = two.find('option').eq(0);
      expect(two.attr('label')).toEqual('two');
      expect(gamma.text()).toEqual('Gamma');
      delta = two.find('option').eq(1);
      expect(two.attr('label')).toEqual('two');
      expect(delta.text()).toEqual('Delta');

      // New group
      three = optgroups.eq(2);
      expect(three.children('option').length).toBe(1);

      epsilon = three.find('option').eq(0);
      expect(three.attr('label')).toEqual('three');
      expect(epsilon.text()).toEqual('Epsilon');
    });

    it('should place non-grouped items in the list where they appear', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.name group by item.group for item in values'
      });

      scope.$apply(function() {
        scope.values = [{name: 'A'},
                        {name: 'B', group: 'first'},
                        {name: 'C', group: 'second'},
                        {name: 'D'},
                        {name: 'E', group: 'first'},
                        {name: 'F'},
                        {name: 'G'},
                        {name: 'H', group: 'second'}];
        scope.selected = scope.values[0];
      });

      var children = element.children();
      expect(children.length).toEqual(6);

      expect(nodeName_(children[0])).toEqual('option');
      expect(nodeName_(children[1])).toEqual('optgroup');
      expect(nodeName_(children[2])).toEqual('optgroup');
      expect(nodeName_(children[3])).toEqual('option');
      expect(nodeName_(children[4])).toEqual('option');
      expect(nodeName_(children[5])).toEqual('option');
    });


    it('should group if the group has a falsy value (except undefined)', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.name group by item.group for item in values'
      });

      scope.$apply(function() {
        scope.values = [{name: 'A'},
                        {name: 'B', group: ''},
                        {name: 'C', group: null},
                        {name: 'D', group: false},
                        {name: 'E', group: 0}];
        scope.selected = scope.values[0];
      });

      var optgroups = element.find('optgroup');
      var options = element.find('option');

      expect(optgroups.length).toEqual(4);
      expect(options.length).toEqual(5);

      expect(optgroups[0].label).toBe('');
      expect(optgroups[1].label).toBe('null');
      expect(optgroups[2].label).toBe('false');
      expect(optgroups[3].label).toBe('0');

      expect(options[0].textContent).toBe('A');
      expect(options[0].parentNode).toBe(element[0]);

      expect(options[1].textContent).toBe('B');
      expect(options[1].parentNode).toBe(optgroups[0]);

      expect(options[2].textContent).toBe('C');
      expect(options[2].parentNode).toBe(optgroups[1]);

      expect(options[3].textContent).toBe('D');
      expect(options[3].parentNode).toBe(optgroups[2]);

      expect(options[4].textContent).toBe('E');
      expect(options[4].parentNode).toBe(optgroups[3]);
    });


    it('should not duplicate a group with a falsy value when the options are updated', function() {

      scope.$apply(function() {
        scope.values = [{value: 'A', group: ''},
                        {value: 'B', group: 'First'}];
        scope.selected = scope.values[0];
      });

      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.value group by item.group for item in values'
      });

      scope.$apply(function() {
        scope.values.push({value: 'C', group: false});
      });

      var optgroups = element.find('optgroup');
      var options = element.find('option');

      expect(optgroups.length).toEqual(3);
      expect(options.length).toEqual(3);

      expect(optgroups[0].label).toBe('');
      expect(optgroups[1].label).toBe('First');
      expect(optgroups[2].label).toBe('false');

      expect(options[0].textContent).toBe('A');
      expect(options[0].parentNode).toBe(optgroups[0]);

      expect(options[1].textContent).toBe('B');
      expect(options[1].parentNode).toBe(optgroups[1]);

      expect(options[2].textContent).toBe('C');
      expect(options[2].parentNode).toBe(optgroups[2]);
    });


    it('should bind to scope value and track/identify objects', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.name for item in values track by item.id'
      });

      scope.$apply(function() {
        scope.values = [{id: 1, name: 'first'},
                        {id: 2, name: 'second'},
                        {id: 3, name: 'third'},
                        {id: 4, name: 'forth'}];
        scope.selected = scope.values[1];
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


    it('should bind to scope value through expression', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.id as item.name for item in values'
      });

      scope.$apply(function() {
        scope.values = [{id: 10, name: 'A'}, {id: 20, name: 'B'}];
        scope.selected = scope.values[0].id;
      });

      expect(element).toEqualSelectValue(scope.selected);

      scope.$apply(function() {
        scope.selected = scope.values[1].id;
      });

      expect(element).toEqualSelectValue(scope.selected);
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
      expect(options.eq(0)).toEqualOption(10, 'C');
      expect(options.eq(1)).toEqualOption(20, 'B');
    });


    it('should update options in the DOM from object source', function() {
      compile(
        '<select ng-model="selected" ng-options="val.id as val.name for (key, val) in values"></select>'
      );

      scope.$apply(function() {
        scope.values = {a: {id: 10, name: 'A'}, b: {id: 20, name: 'B'}};
        scope.selected = scope.values.a.id;
      });

      scope.$apply(function() {
        scope.values.a.name = 'C';
      });

      var options = element.find('option');
      expect(options.length).toEqual(2);
      expect(options.eq(0)).toEqualOption(10, 'C');
      expect(options.eq(1)).toEqualOption(20, 'B');
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

      expect(element).toEqualSelectValue(scope.selected);

      scope.$apply(function() {
        scope.selected = 'blue';
      });

      expect(element).toEqualSelectValue(scope.selected);
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

      expect(element).toEqualSelectValue(scope.selected);

      scope.$apply(function() {
        scope.selected = '0000FF';
      });

      expect(element).toEqualSelectValue(scope.selected);
    });

    it('should bind to object disabled', function() {
      scope.selected = 30;
      scope.options = [
        { name: 'white', value: '#FFFFFF' },
        { name: 'one', value: 1, unavailable: true },
        { name: 'notTrue', value: false },
        { name: 'thirty', value: 30, unavailable: false }
      ];
      createSelect({
        'ng-options': 'o.value as o.name disable when o.unavailable for o in options',
        'ng-model': 'selected'
      });

      var options = element.find('option');

      expect(scope.options[1].unavailable).toEqual(true);
      expect(options.eq(1).prop('disabled')).toEqual(true);

      scope.$apply(function() {
        scope.options[1].unavailable = false;
      });

      options = element.find('option');

      expect(scope.options[1].unavailable).toEqual(false);
      expect(options.eq(1).prop('disabled')).toEqual(false);
    });

    it('should insert the unknown option if bound to null', function() {
      createSingleSelect();

      scope.$apply(function() {
        scope.values = [{name: 'A'}];
        scope.selected = null;
      });

      expect(element.find('option').length).toEqual(2);
      expect(element.val()).toEqual('?');
      expect(jqLite(element.find('option')[0]).val()).toEqual('?');

      scope.$apply(function() {
        scope.selected = scope.values[0];
      });

      expect(element).toEqualSelectValue(scope.selected);
      expect(element.find('option').length).toEqual(1);
    });

    it('should select the provided empty option if bound to null', function() {
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

      expect(element).toEqualSelectValue(scope.selected);
      expect(jqLite(element.find('option')[0]).val()).toEqual('');
      expect(element.find('option').length).toEqual(2);
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

      expect(element).toEqualSelectValue(scope.selected);
      expect(element.find('option').length).toEqual(2);
    });


    it('should not insert a blank option if one of the options maps to null', function() {
      createSelect({
        'ng-model': 'myColor',
        'ng-options': 'color.shade as color.name for color in colors'
      });

      scope.$apply(function() {
        scope.colors = [
          {name:'nothing', shade:null},
          {name:'red', shade:'dark'}
        ];
        scope.myColor = null;
      });

      expect(element.find('option').length).toEqual(2);
      expect(element.find('option').eq(0)).toEqualOption(null);
      expect(element.val()).not.toEqualUnknownValue(null);
      expect(element.find('option').eq(0)).not.toEqualUnknownOption(null);
    });


    it('should insert a unknown option if bound to something not in the list', function() {
      createSingleSelect();

      scope.$apply(function() {
        scope.values = [{name: 'A'}];
        scope.selected = {};
      });

      expect(element.find('option').length).toEqual(2);
      expect(element.val()).toEqualUnknownValue(scope.selected);
      expect(element.find('option').eq(0)).toEqualUnknownOption(scope.selected);

      scope.$apply(function() {
        scope.selected = scope.values[0];
      });

      expect(element).toEqualSelectValue(scope.selected);
      expect(element.find('option').length).toEqual(1);
    });


  it('should insert and select temporary unknown option when no options-model match, empty ' +
        'option is present and model is defined', function() {
      scope.selected = 'C';
      scope.values = [{name: 'A'}, {name: 'B'}];
      createSingleSelect(true);

      expect(element).toEqualSelect(['?'], '', 'object:3', 'object:4');

      scope.$apply('selected = values[1]');

      expect(element).toEqualSelect('', 'object:3', ['object:4']);
    });


    it('should select correct input if previously selected option was "?"', function() {
      createSingleSelect();

      scope.$apply(function() {
        scope.values = [{name: 'A'}, {name: 'B'}];
        scope.selected = {};
      });

      expect(element.find('option').length).toEqual(3);
      expect(element.val()).toEqualUnknownValue();
      expect(element.find('option').eq(0)).toEqualUnknownOption();

      browserTrigger(element.find('option').eq(1));
      expect(element.find('option').length).toEqual(2);
      expect(element).toEqualSelectValue(scope.selected);
      expect(element.find('option').eq(0).prop('selected')).toBeTruthy();
    });


    it('should remove unknown option when empty option exists and model is undefined', function() {
      scope.selected = 'C';
      scope.values = [{name: 'A'}, {name: 'B'}];
      createSingleSelect(true);

      expect(element).toEqualSelect(['?'], '', 'object:3', 'object:4');

      scope.selected = undefined;
      scope.$digest();

      expect(element).toEqualSelect([''], 'object:3', 'object:4');
    });

    it('should use exact same values as values in scope with one-time bindings', function() {
      scope.values = [{name: 'A'}, {name: 'B'}];
      scope.selected = scope.values[0];
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'value.name for value in ::values'
      });

      browserTrigger(element.find('option').eq(1));

      expect(scope.selected).toBe(scope.values[1]);
    });


    it('should ensure that at least one option element has the "selected" attribute', function() {
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'item.id as item.name for item in values'
      });

      scope.$apply(function() {
        scope.values = [{id: 10, name: 'A'}, {id: 20, name: 'B'}];
      });
      expect(element.val()).toEqualUnknownValue();
      expect(element.find('option').eq(0).attr('selected')).toEqual('selected');

      scope.$apply(function() {
        scope.selected = 10;
      });
      // Here the ? option should disappear and the first real option should have selected attribute
      expect(element).toEqualSelectValue(scope.selected);
      expect(element.find('option').eq(0).attr('selected')).toEqual('selected');

      // Here the selected value is changed and we change the selected attribute
      scope.$apply(function() {
        scope.selected = 20;
      });
      expect(element).toEqualSelectValue(scope.selected);
      expect(element.find('option').eq(1).attr('selected')).toEqual('selected');

      scope.$apply(function() {
        scope.values.push({id: 30, name: 'C'});
      });
      expect(element).toEqualSelectValue(scope.selected);
      expect(element.find('option').eq(1).attr('selected')).toEqual('selected');

      // Here the ? option should reappear and have selected attribute
      scope.$apply(function() {
        scope.selected = undefined;
      });
      expect(element.val()).toEqualUnknownValue();
      expect(element.find('option').eq(0).attr('selected')).toEqual('selected');
    });


    it('should select the correct option for selectAs and falsy values', function() {
      scope.values = [{value: 0, label: 'zero'}, {value: 1, label: 'one'}];
      scope.selected = '';
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'option.value as option.label for option in values'
      });

      var option = element.find('option').eq(0);
      expect(option).toEqualUnknownOption();
    });


    it('should update the model if the selected option is removed', function() {
      scope.values = [{value: 0, label: 'zero'}, {value: 1, label: 'one'}];
      scope.selected = 1;
      createSelect({
        'ng-model': 'selected',
        'ng-options': 'option.value as option.label for option in values'
      });
      expect(element).toEqualSelectValue(1);

      // Check after initial option update
      scope.$apply(function() {
        scope.values.pop();
      });

      expect(element.val()).toEqual('?');
      expect(scope.selected).toEqual(null);

      // Check after model change
      scope.$apply(function() {
        scope.selected = 0;
      });

      expect(element).toEqualSelectValue(0);

      scope.$apply(function() {
        scope.values.pop();
      });

      expect(element.val()).toEqual('?');
      expect(scope.selected).toEqual(null);
    });


    it('should update the model if all the selected (multiple) options are removed', function() {
      scope.values = [{value: 0, label: 'zero'}, {value: 1, label: 'one'}, {value: 2, label: 'two'}];
      scope.selected = [1, 2];
      createSelect({
        'ng-model': 'selected',
        'multiple': true,
        'ng-options': 'option.value as option.label for option in values'
      });

      expect(element).toEqualSelectValue([1, 2], true);

      // Check after initial option update
      scope.$apply(function() {
        scope.values.pop();
      });

      expect(element).toEqualSelectValue([1], true);
      expect(scope.selected).toEqual([1]);

      scope.$apply(function() {
        scope.values.pop();
      });

      expect(element).toEqualSelectValue([], true);
      expect(scope.selected).toEqual([]);

      // Check after model change
      scope.$apply(function() {
        scope.selected = [0];
      });

      expect(element).toEqualSelectValue([0], true);

      scope.$apply(function() {
        scope.values.pop();
      });

      expect(element).toEqualSelectValue([], true);
      expect(scope.selected).toEqual([]);
    });

  });


  describe('empty option', function() {

    it('should be compiled as template, be watched and updated', function() {
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


    it('should support binding via ngBindTemplate directive', function() {
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


    it('should support binding via ngBind attribute', function() {
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

    it('should be ignored when it has no value attribute', function() {
      // The option value is set to the textContent if there's no value attribute,
      // so in that case it doesn't count as a blank option
      createSingleSelect('<option>--select--</option>');
      scope.$apply(function() {
        scope.values = [{name: 'A'}, {name: 'B'}, {name: 'C'}];
      });

      var options = element.find('option');

      expect(options.eq(0)).toEqualUnknownOption();
      expect(options.eq(1)).toEqualOption(scope.values[0], 'A');
      expect(options.eq(2)).toEqualOption(scope.values[1], 'B');
      expect(options.eq(3)).toEqualOption(scope.values[2], 'C');
    });


    it('should be rendered with the attributes preserved', function() {
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


    it('should be selectable if select is multiple', function() {
      createMultiSelect(true);

      // select the empty option
      setSelectValue(element, 0);

      // ensure selection and correct binding
      expect(element[0].selectedIndex).toEqual(0);
      expect(scope.selected).toEqual([]);
    });


    it('should be possible to use ngIf in the blank option', function() {
      var option;
      createSingleSelect('<option ng-if="isBlank" value="">blank</option>');

      scope.$apply(function() {
        scope.values = [{name: 'A'}];
        scope.isBlank = true;
      });

      expect(element).toEqualSelect([''], 'object:4');

      scope.$apply('isBlank = false');

      expect(element).toEqualSelect(['?'], 'object:4');

      scope.$apply('isBlank = true');

      expect(element).toEqualSelect([''], 'object:4');
    });


    it('should be possible to use ngIf in the blank option when values are available upon linking',
      function() {
        var options;

        scope.values = [{name: 'A'}];
        createSingleSelect('<option ng-if="isBlank" value="">blank</option>');

        scope.$apply('isBlank = true');

        options = element.find('option');
        expect(options.length).toBe(2);
        expect(options.eq(0).val()).toBe('');
        expect(options.eq(0).text()).toBe('blank');

        scope.$apply('isBlank = false');

        expect(element).toEqualSelect(['?'], 'object:3');
      }
    );


    it('should select the correct option after linking when the ngIf expression is initially falsy', function() {
      scope.values = [
        {name:'black'},
        {name:'white'},
        {name:'red'}
      ];
      scope.selected = scope.values[2];

      expect(function() {
        createSingleSelect('<option ng-if="isBlank" value="">blank</option>');
        scope.$apply();
      }).not.toThrow();

      expect(element.find('option')[2]).toBeMarkedAsSelected();
      expect(linkLog).toEqual(['linkNgOptions']);
    });


    it('should add / remove the "selected" attribute on empty option which has an initially falsy ngIf expression', function() {
      scope.values = [
        {name:'black'},
        {name:'white'},
        {name:'red'}
      ];
      scope.selected = scope.values[2];

      createSingleSelect('<option ng-if="isBlank" value="">blank</option>');
      scope.$apply();

      expect(element.find('option')[2]).toBeMarkedAsSelected();

      scope.$apply('isBlank = true');
      expect(element.find('option')[0].value).toBe('');
      expect(element.find('option')[0]).not.toBeMarkedAsSelected();

      scope.$apply('selected = null');
      expect(element.find('option')[0].value).toBe('');
      expect(element.find('option')[0]).toBeMarkedAsSelected();

      scope.selected = scope.values[1];
      scope.$apply();
      expect(element.find('option')[0].value).toBe('');
      expect(element.find('option')[0]).not.toBeMarkedAsSelected();
      expect(element.find('option')[2]).toBeMarkedAsSelected();
    });


    it('should add / remove the "selected" attribute on empty option which has an initially truthy ngIf expression when no option is selected', function() {
      scope.values = [
        {name:'black'},
        {name:'white'},
        {name:'red'}
      ];
      scope.isBlank = true;

      createSingleSelect('<option ng-if="isBlank" value="">blank</option>');
      scope.$apply();

      expect(element.find('option')[0].value).toBe('');
      expect(element.find('option')[0]).toBeMarkedAsSelected();

      scope.selected = scope.values[2];
      scope.$apply();
      expect(element.find('option')[0]).not.toBeMarkedAsSelected();
      expect(element.find('option')[3]).toBeMarkedAsSelected();
    });


    it('should add the "selected" attribute on empty option which has an initially falsy ngIf expression when no option is selected', function() {
      scope.values = [
        {name:'black'},
        {name:'white'},
        {name:'red'}
      ];

      createSingleSelect('<option ng-if="isBlank" value="">blank</option>');
      scope.$apply();

      expect(element.find('option')[0]).not.toBeMarkedAsSelected();

      scope.isBlank = true;
      scope.$apply();

      expect(element.find('option')[0].value).toBe('');
      expect(element.find('option')[0]).toBeMarkedAsSelected();
      expect(element.find('option')[1]).not.toBeMarkedAsSelected();
    });


    it('should not throw when a directive compiles the blank option before ngOptions is linked', function() {
      expect(function() {
        createSelect({
          'o-compile-contents': '',
          'name': 'select',
          'ng-model': 'value',
          'ng-options': 'item for item in items'
        }, true);
      }).not.toThrow();

      expect(linkLog).toEqual(['linkCompileContents', 'linkNgOptions']);
    });


    it('should not throw with a directive that replaces', inject(function($templateCache, $httpBackend) {
      $templateCache.put('select_template.html', '<select ng-options="option as option for option in selectable_options"> <option value="">This is a test</option> </select>');

      scope.options = ['a', 'b', 'c', 'd'];

      expect(function() {
        element = $compile('<custom-select ng-model="value" options="options"></custom-select>')(scope);
        scope.$digest();
      }).not.toThrow();

      dealoc(element);
    }));

  });


  describe('on change', function() {

    it('should update model on change', function() {
      createSingleSelect();

      scope.$apply(function() {
        scope.values = [{name: 'A'}, {name: 'B'}];
        scope.selected = scope.values[0];
      });

      expect(element).toEqualSelectValue(scope.selected);

      setSelectValue(element, 1);
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

      expect(element).toEqualSelectValue(scope.selected);

      setSelectValue(element, 1);
      expect(scope.selected).toEqual(scope.values[1].id);
    });


    it('should update model to null on change', function() {
      createSingleSelect(true);

      scope.$apply(function() {
        scope.values = [{name: 'A'}, {name: 'B'}];
        scope.selected = scope.values[0];
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


    it('should not re-set the `selected` property if it already has the correct value', function() {
      scope.values = [{name: 'A'}, {name: 'B'}];
      createMultiSelect();

      var options = element.find('option');
      var optionsSetSelected = [];
      var _selected = [];

      // Set up spies
      forEach(options, function(option, i) {
        optionsSetSelected[i] = jasmine.createSpy('optionSetSelected' + i);
        _selected[i] = option.selected;
        Object.defineProperty(option, 'selected', {
          get: function() { return _selected[i]; },
          set: optionsSetSelected[i].and.callFake(function(value) { _selected[i] = value; })
        });
      });

      // Select `optionA`
      scope.$apply('selected = [values[0]]');

      expect(optionsSetSelected[0]).toHaveBeenCalledOnceWith(true);
      expect(optionsSetSelected[1]).not.toHaveBeenCalled();
      expect(options[0].selected).toBe(true);
      expect(options[1].selected).toBe(false);
      optionsSetSelected[0].calls.reset();
      optionsSetSelected[1].calls.reset();

      // Select `optionB` (`optionA` remains selected)
      scope.$apply('selected.push(values[1])');

      expect(optionsSetSelected[0]).not.toHaveBeenCalled();
      expect(optionsSetSelected[1]).toHaveBeenCalledOnceWith(true);
      expect(options[0].selected).toBe(true);
      expect(options[1].selected).toBe(true);
      optionsSetSelected[0].calls.reset();
      optionsSetSelected[1].calls.reset();

      // Unselect `optionA` (`optionB` remains selected)
      scope.$apply('selected.shift()');

      expect(optionsSetSelected[0]).toHaveBeenCalledOnceWith(false);
      expect(optionsSetSelected[1]).not.toHaveBeenCalled();
      expect(options[0].selected).toBe(false);
      expect(options[1].selected).toBe(true);
      optionsSetSelected[0].calls.reset();
      optionsSetSelected[1].calls.reset();

      // Reselect `optionA` (`optionB` remains selected)
      scope.$apply('selected.push(values[0])');

      expect(optionsSetSelected[0]).toHaveBeenCalledOnceWith(true);
      expect(optionsSetSelected[1]).not.toHaveBeenCalled();
      expect(options[0].selected).toBe(true);
      expect(options[1].selected).toBe(true);
      optionsSetSelected[0].calls.reset();
      optionsSetSelected[1].calls.reset();

      // Unselect `optionB` (`optionA` remains selected)
      scope.$apply('selected.shift()');

      expect(optionsSetSelected[0]).not.toHaveBeenCalled();
      expect(optionsSetSelected[1]).toHaveBeenCalledOnceWith(false);
      expect(options[0].selected).toBe(true);
      expect(options[1].selected).toBe(false);
      optionsSetSelected[0].calls.reset();
      optionsSetSelected[1].calls.reset();

      // Unselect `optionA`
      scope.$apply('selected.length = 0');

      expect(optionsSetSelected[0]).toHaveBeenCalledOnceWith(false);
      expect(optionsSetSelected[1]).not.toHaveBeenCalled();
      expect(options[0].selected).toBe(false);
      expect(options[1].selected).toBe(false);
      optionsSetSelected[0].calls.reset();
      optionsSetSelected[1].calls.reset();
    });

    if (window.MutationObserver) {
      //IE9 and IE10 do not support MutationObserver
      //Since the feature is only needed for a test, it's okay to skip these browsers
      it('should render the initial options only one time', function() {
        scope.value = ['black'];
        scope.values = ['black', 'white', 'red'];
        // observe-child-list adds a MutationObserver that we will read out after ngOptions
        // has been compiled
        createSelect({
          'ng-model':'selected',
          'ng-options':'value.name for value in values',
          'multiple': 'true',
          'observe-child-list': ''
        });

        var optionEls = element[0].querySelectorAll('option');
        var records = childListMutationObserver.takeRecords();

        expect(records.length).toBe(1);
        expect(records[0].addedNodes).toEqual(optionEls);
      });
    }

  });


  describe('required state', function() {

    it('should set the error if the empty option is selected', function() {
      createSelect({
        'ng-model': 'selection',
        'ng-options': 'item for item in values',
        'required': ''
      }, true);

      scope.$apply(function() {
        scope.values = ['a', 'b'];
        scope.selection = scope.values[0];
      });
      expect(element).toBeValid();
      expect(ngModelCtrl.$error.required).toBeFalsy();

      var options = element.find('option');

      // view -> model
      browserTrigger(options[0], 'click');
      expect(element).toBeInvalid();
      expect(ngModelCtrl.$error.required).toBeTruthy();

      browserTrigger(options[1], 'click');
      expect(element).toBeValid();
      expect(ngModelCtrl.$error.required).toBeFalsy();

      // model -> view
      scope.$apply('selection = null');
      expect(options[0]).toBeMarkedAsSelected();
      expect(element).toBeInvalid();
      expect(ngModelCtrl.$error.required).toBeTruthy();
    });


    it('should validate with empty option and bound ngRequired', function() {
      createSelect({
        'ng-model': 'value',
        'ng-options': 'item.name for item in values',
        'ng-required': 'required'
      }, true);

      scope.$apply(function() {
        scope.values = [{name: 'A', id: 1}, {name: 'B', id: 2}];
        scope.required = false;
      });

      var options = element.find('option');

      browserTrigger(options[0], 'click');
      expect(element).toBeValid();

      scope.$apply('required = true');
      expect(element).toBeInvalid();

      scope.$apply('value = values[0]');
      expect(element).toBeValid();

      browserTrigger(options[0], 'click');
      expect(element).toBeInvalid();

      scope.$apply('required = false');
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


    it('should NOT set the error if the empty option is present but required attribute is not',
      function() {
        scope.$apply(function() {
          scope.values = ['a', 'b'];
        });

        createSingleSelect();

        expect(element).toBeValid();
        expect(element).toBePristine();
        expect(ngModelCtrl.$error.required).toBeFalsy();
      }
    );


    it('should NOT set the error if the unknown option is selected', function() {
      createSelect({
        'ng-model': 'selection',
        'ng-options': 'item for item in values',
        'required': ''
      });

      scope.$apply(function() {
        scope.values = ['a', 'b'];
        scope.selection = 'a';
      });

      expect(element).toBeValid();
      expect(ngModelCtrl.$error.required).toBeFalsy();

      scope.$apply('selection = "c"');
      expect(element).toEqualSelect(['?'], 'string:a', 'string:b');
      expect(element).toBeValid();
      expect(ngModelCtrl.$error.required).toBeFalsy();
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

      setSelectValue(element, 2);
      expect(element).toBeValid();
      expect(scope.value).toBe(false);

      scope.$apply('required = true');
      expect(element).toBeValid();
      expect(scope.value).toBe(false);
    });


    it('should validate after option list was updated', function() {
      createSelect({
        'ng-model': 'selection',
        'ng-options': 'item for item in values',
        'required': ''
      }, true);

      scope.$apply(function() {
        scope.values = ['A', 'B'];
        scope.selection = scope.values[0];
      });

      expect(element).toEqualSelect('', ['string:A'], 'string:B');
      expect(element).toBeValid();
      expect(ngModelCtrl.$error.required).toBeFalsy();

      scope.$apply(function() {
        scope.values = ['C', 'D'];
      });

      expect(element).toEqualSelect([''], 'string:C', 'string:D');
      expect(element).toBeInvalid();
      expect(ngModelCtrl.$error.required).toBeTruthy();
      // ngModel sets undefined for invalid values
      expect(scope.selection).toBeUndefined();
    });
  });

  describe('required and empty option', function() {

    it('should select the empty option after compilation', function() {
      createSelect({
        'name': 'select',
        'ng-model': 'value',
        'ng-options': 'item for item in [\'first\', \'second\', \'third\']',
        'required': 'required'
      }, true);

      expect(element.val()).toBe('');
      var emptyOption = element.find('option').eq(0);
      expect(emptyOption.prop('selected')).toBe(true);
      expect(emptyOption.val()).toBe('');
    });
  });

  describe('ngModelCtrl', function() {
    it('should prefix the model value with the word "the" using $parsers', function() {
      createSelect({
        'name': 'select',
        'ng-model': 'value',
        'ng-options': 'item for item in [\'first\', \'second\', \'third\', \'fourth\']'
      });

      scope.form.select.$parsers.push(function(value) {
        return 'the ' + value;
      });

      setSelectValue(element, 3);
      expect(scope.value).toBe('the third');
      expect(element).toEqualSelectValue('third');
    });

    it('should prefix the view value with the word "the" using $formatters', function() {
      createSelect({
        'name': 'select',
        'ng-model': 'value',
        'ng-options': 'item for item in [\'the first\', \'the second\', \'the third\', \'the fourth\']'
      });

      scope.form.select.$formatters.push(function(value) {
        return 'the ' + value;
      });

      scope.$apply(function() {
        scope.value = 'third';
      });
      expect(element).toEqualSelectValue('the third');
    });

    it('should fail validation when $validators fail', function() {
      createSelect({
        'name': 'select',
        'ng-model': 'value',
        'ng-options': 'item for item in [\'first\', \'second\', \'third\', \'fourth\']'
      });

      scope.form.select.$validators.fail = function() {
        return false;
      };

      setSelectValue(element, 3);
      expect(element).toBeInvalid();
      expect(scope.value).toBeUndefined();
      expect(element).toEqualSelectValue('third');
    });

    it('should pass validation when $validators pass', function() {
      createSelect({
        'name': 'select',
        'ng-model': 'value',
        'ng-options': 'item for item in [\'first\', \'second\', \'third\', \'fourth\']'
      });

      scope.form.select.$validators.pass = function() {
        return true;
      };

      setSelectValue(element, 3);
      expect(element).toBeValid();
      expect(scope.value).toBe('third');
      expect(element).toEqualSelectValue('third');
    });

    it('should fail validation when $asyncValidators fail', inject(function($q, $rootScope) {
      var defer;
      createSelect({
        'name': 'select',
        'ng-model': 'value',
        'ng-options': 'item for item in [\'first\', \'second\', \'third\', \'fourth\']'
      });

      scope.form.select.$asyncValidators.async = function() {
        defer = $q.defer();
        return defer.promise;
      };

      setSelectValue(element, 3);
      expect(scope.form.select.$pending).toBeDefined();
      expect(scope.value).toBeUndefined();
      expect(element).toEqualSelectValue('third');

      defer.reject();
      $rootScope.$digest();
      expect(scope.form.select.$pending).toBeUndefined();
      expect(scope.value).toBeUndefined();
      expect(element).toEqualSelectValue('third');
    }));

    it('should pass validation when $asyncValidators pass', inject(function($q, $rootScope) {
      var defer;
      createSelect({
        'name': 'select',
        'ng-model': 'value',
        'ng-options': 'item for item in [\'first\', \'second\', \'third\', \'fourth\']'
      });

      scope.form.select.$asyncValidators.async = function() {
        defer = $q.defer();
        return defer.promise;
      };

      setSelectValue(element, 3);
      expect(scope.form.select.$pending).toBeDefined();
      expect(scope.value).toBeUndefined();
      expect(element).toEqualSelectValue('third');

      defer.resolve();
      $rootScope.$digest();
      expect(scope.form.select.$pending).toBeUndefined();
      expect(scope.value).toBe('third');
      expect(element).toEqualSelectValue('third');
    }));

    it('should not set $dirty with select-multiple after compilation', function() {
      scope.values = ['a', 'b'];
      scope.selected = ['b'];

      createSelect({
        'ng-model':'selected',
        'multiple':true,
        'ng-options':'value for value in values',
        'name': 'select'
      });

      expect(element.find('option')[1].selected).toBe(true);
      expect(scope.form.select.$pristine).toBe(true);
    });
  });

  describe('selectCtrl api', function() {

    it('should reflect the status of empty and unknown option', function() {
      createSingleSelect('<option ng-if="isBlank" value="">blank</option>');

      var selectCtrl = element.controller('select');

      scope.$apply(function() {
        scope.values = [{name: 'A'}, {name: 'B'}];
        scope.isBlank = true;
      });

      expect(element).toEqualSelect([''], 'object:4', 'object:5');
      expect(selectCtrl.$hasEmptyOption()).toBe(true);
      expect(selectCtrl.$isEmptyOptionSelected()).toBe(true);
      expect(selectCtrl.$isUnknownOptionSelected()).toBe(false);

      // empty -> selection
      scope.$apply(function() {
        scope.selected = scope.values[0];
      });

      expect(element).toEqualSelect('', ['object:4'], 'object:5');
      expect(selectCtrl.$hasEmptyOption()).toBe(true);
      expect(selectCtrl.$isEmptyOptionSelected()).toBe(false);
      expect(selectCtrl.$isUnknownOptionSelected()).toBe(false);

      // remove empty
      scope.$apply('isBlank = false');

      expect(element).toEqualSelect(['object:4'], 'object:5');
      expect(selectCtrl.$hasEmptyOption()).toBe(false);
      expect(selectCtrl.$isEmptyOptionSelected()).toBe(false);
      expect(selectCtrl.$isUnknownOptionSelected()).toBe(false);

      // selection -> unknown
      scope.$apply('selected = "unmatched"');

      expect(element).toEqualSelect(['?'], 'object:4', 'object:5');
      expect(selectCtrl.$hasEmptyOption()).toBe(false);
      expect(selectCtrl.$isEmptyOptionSelected()).toBe(false);
      expect(selectCtrl.$isUnknownOptionSelected()).toBe(true);

      // add empty
      scope.$apply('isBlank = true');

      expect(element).toEqualSelect(['?'], '', 'object:4', 'object:5');
      expect(selectCtrl.$hasEmptyOption()).toBe(true);
      expect(selectCtrl.$isEmptyOptionSelected()).toBe(false);
      expect(selectCtrl.$isUnknownOptionSelected()).toBe(true);

      // unknown -> empty
      scope.$apply(function() {
        scope.selected = null;
      });

      expect(element).toEqualSelect([''], 'object:4', 'object:5');
      expect(selectCtrl.$hasEmptyOption()).toBe(true);
      expect(selectCtrl.$isEmptyOptionSelected()).toBe(true);
      expect(selectCtrl.$isUnknownOptionSelected()).toBe(false);

      // empty -> unknown
      scope.$apply('selected = "unmatched"');

      expect(element).toEqualSelect(['?'], '', 'object:4', 'object:5');
      expect(selectCtrl.$hasEmptyOption()).toBe(true);
      expect(selectCtrl.$isEmptyOptionSelected()).toBe(false);
      expect(selectCtrl.$isUnknownOptionSelected()).toBe(true);

      // unknown -> selection
      scope.$apply(function() {
        scope.selected = scope.values[1];
      });

      expect(element).toEqualSelect('', 'object:4', ['object:5']);
      expect(selectCtrl.$hasEmptyOption()).toBe(true);
      expect(selectCtrl.$isEmptyOptionSelected()).toBe(false);
      expect(selectCtrl.$isUnknownOptionSelected()).toBe(false);

      // selection -> empty
      scope.$apply('selected = null');

      expect(element).toEqualSelect([''], 'object:4', 'object:5');
      expect(selectCtrl.$hasEmptyOption()).toBe(true);
      expect(selectCtrl.$isEmptyOptionSelected()).toBe(true);
      expect(selectCtrl.$isUnknownOptionSelected()).toBe(false);
    });
  });

});
