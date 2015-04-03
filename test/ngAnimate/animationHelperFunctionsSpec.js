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
