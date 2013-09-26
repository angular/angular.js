'use strict';

describe('widgets', function() {
  it('should verify that basic widgets work', function() {
    browser().navigateTo('widgets.html');

    using('#text-basic-box').input('text.basic').enter('Carlos');
    expect(binding('text.basic')).toEqual('Carlos');
    input('text.basic').enter('Carlos Santana');
    expect(binding('text.basic')).not().toEqual('Carlos Boozer');

    input('text.password').enter('secret');
    expect(binding('text.password')).toEqual('secret');

    expect(binding('text.hidden')).toEqual('hiddenValue');

    expect(binding('gender')).toEqual('male');
    input('gender').select('female');
    expect(using('#gender-box').binding('gender')).toEqual('female');

    expect(repeater('#repeater-row ul li').count()).toEqual(2);
    expect(repeater('#repeater-row ul li').row(1)).toEqual(['adam']);
    expect(repeater('#repeater-row ul li').column('name')).toEqual(['misko', 'adam']);

    select('select').option('B');
    expect(binding('select')).toEqual('B');

    select('multiselect').options('A', 'C');
    expect(binding('multiselect').fromJson()).toEqual(['A', 'C']);

    expect(binding('button').fromJson()).toEqual({'count': 0});
    expect(binding('form').fromJson()).toEqual({'count': 0});

    element('form a', "'action' link").click();
    expect(binding('button').fromJson()).toEqual({'count': 1});

    element('input[value="submit input"]', "'submit input' button").click();
    expect(binding('button').fromJson()).toEqual({'count': 2});
    expect(binding('form').fromJson()).toEqual({'count': 1});

    element('button:contains("submit button")', "'submit button' button").click();
    expect(binding('button').fromJson()).toEqual({'count': 2});
    expect(binding('form').fromJson()).toEqual({'count': 2});

    element('input[value="button"]', "'button' button").click();
    expect(binding('button').fromJson()).toEqual({'count': 3});

    element('input[type="image"]', 'form image').click();
    expect(binding('button').fromJson()).toEqual({'count': 4});

    /**
     * Custom value parser for futures.
     */
    function checkboxParser(value) {
      return angular.fromJson(value.substring(value.indexOf('=')+1));
    }

    input('checkbox.tea').check();
    expect(binding('checkbox').parsedWith(checkboxParser)).toEqual({coffee: false, tea: false});
    input('checkbox.coffee').check();
    expect(binding('checkbox').parsedWith(checkboxParser)).toEqual({coffee: true, tea: false});
    input('checkbox.tea').check();
    input('checkbox.tea').check();
    input('checkbox.tea').check();
    expect(binding('checkbox').parsedWith(checkboxParser)).toEqual({coffee: true, tea: true});
  });
});
