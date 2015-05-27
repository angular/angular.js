'use strict';

describe("animation option helper functions", function() {

  beforeEach(module('ngAnimate'));

  var element, applyAnimationClasses;
  beforeEach(inject(function($$jqLite) {
    applyAnimationClasses = applyAnimationClassesFactory($$jqLite);
    element = jqLite('<div></div>');
  }));

  describe('prepareAnimationOptions', function() {
    it('should construct an options wrapper from the provided options',
      inject(function() {

      var options = prepareAnimationOptions({
        value: 'hello'
      });

      expect(options.value).toBe('hello');
    }));

    it('should return the same instance it already instantiated as an options object with the given element',
      inject(function() {

      var options = prepareAnimationOptions({});
      expect(prepareAnimationOptions(options)).toBe(options);

      var options2 = {};
      expect(prepareAnimationOptions(options2)).not.toBe(options);
    }));

    they('should append a "px" value to the $prop styles if they are provided as number values',
      ['from', 'to'], function(phase) {

      inject(function() {
        var options = {};
        options[phase] = {};
        options[phase].height = 200;
        options[phase].width = '200';
        options[phase].border = '1px solid red';

        options = prepareAnimationOptions(options);
        expect(options[phase].height).toBe('200px');
        expect(options[phase].width).toBe('200');
        expect(options[phase].border).toBe('1px solid red');
      });
    });

    it('should ignore appending a "px" to the from/to styles when a style with a value of `0` is provided',
      inject(function() {

      var options = {
        from: {},
        to: {}
      };

      options.from.width = 0;
      options.to.height = 0;

      options = prepareAnimationOptions(options);
      expect(options.from.width).toBe(0);
      expect(options.to.height).toBe(0);
    }));

    they('should ignore appending a "px" to the styles value when a $prop style is provided with a numerical value',
      ['z-index', 'zIndex'], function(prop) {

      inject(function() {
        var options = {
          from: {},
          to: {}
        };

        options.from[prop] = 2;
        options.to[prop] = 10;

        options = prepareAnimationOptions(options);
        expect(options.from[prop]).toBe(2);
        expect(options.to[prop]).toBe(10);
      });
    });
  });

  describe('applyAnimationStyles', function() {
    it('should apply the provided `from` styles', inject(function() {
      var options = prepareAnimationOptions({
        from: { color: 'maroon' },
        to: { color: 'blue' }
      });

      applyAnimationFromStyles(element, options);
      expect(element.attr('style')).toContain('maroon');
    }));

    it('should apply the provided `to` styles', inject(function() {
      var options = prepareAnimationOptions({
        from: { color: 'red' },
        to: { color: 'black' }
      });

      applyAnimationToStyles(element, options);
      expect(element.attr('style')).toContain('black');
    }));

    it('should apply the both provided `from` and `to` styles', inject(function() {
      var options = prepareAnimationOptions({
        from: { color: 'red', 'font-size':'50px' },
        to: { color: 'green' }
      });

      applyAnimationStyles(element, options);
      expect(element.attr('style')).toContain('green');
      expect(element.css('font-size')).toBe('50px');
    }));

    it('should only apply the options once', inject(function() {
      var options = prepareAnimationOptions({
        from: { color: 'red', 'font-size':'50px' },
        to: { color: 'blue' }
      });

      applyAnimationStyles(element, options);
      expect(element.attr('style')).toContain('blue');

      element.attr('style', '');

      applyAnimationStyles(element, options);
      expect(element.attr('style') || '').toBe('');
    }));
  });

  describe('applyAnimationClasses', function() {
    it('should add/remove the provided CSS classes', inject(function() {
      element.addClass('four six');
      var options = prepareAnimationOptions({
        addClass: 'one two three',
        removeClass: 'four'
      });

      applyAnimationClasses(element, options);
      expect(element).toHaveClass('one two three');
      expect(element).toHaveClass('six');
      expect(element).not.toHaveClass('four');
    }));

    it('should add/remove the provided CSS classes only once', inject(function() {
      element.attr('class', 'blue');
      var options = prepareAnimationOptions({
        addClass: 'black',
        removeClass: 'blue'
      });

      applyAnimationClasses(element, options);
      element.attr('class', 'blue');

      applyAnimationClasses(element, options);
      expect(element).toHaveClass('blue');
      expect(element).not.toHaveClass('black');
    }));
  });

  describe('mergeAnimationOptions', function() {
    it('should merge in new options', inject(function() {
      element.attr('class', 'blue');
      var options = prepareAnimationOptions({
        name: 'matias',
        age: 28,
        addClass: 'black',
        removeClass: 'blue gold'
      });

      mergeAnimationOptions(element, options, {
        age: 29,
        addClass: 'gold brown',
        removeClass: 'orange'
      });

      expect(options.name).toBe('matias');
      expect(options.age).toBe(29);
      expect(options.addClass).toBe('black brown');
      expect(options.removeClass).toBe('blue');
    }));
  });
});
