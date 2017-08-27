'use strict';

describe('$animateCss', function() {

  var triggerRAF, element;
  beforeEach(inject(function($$rAF, $rootElement, $document) {
    triggerRAF = function() {
      $$rAF.flush();
    };

    var body = jqLite($document[0].body);
    element = jqLite('<div></div>');
    $rootElement.append(element);
    body.append($rootElement);
  }));

  describe('without animation', function() {

    it('should not alter the provided options input in any way', inject(function($animateCss) {
      var initialOptions = {
        from: { height: '50px' },
        to: { width: '50px' },
        addClass: 'one',
        removeClass: 'two'
      };

      var copiedOptions = copy(initialOptions);

      expect(copiedOptions).toEqual(initialOptions);
      $animateCss(element, copiedOptions).start();
      expect(copiedOptions).toEqual(initialOptions);
    }));

    it('should not create a copy of the provided options if they have already been prepared earlier',
      inject(function($animateCss, $$rAF) {

      var options = {
        from: { height: '50px' },
        to: { width: '50px' },
        addClass: 'one',
        removeClass: 'two'
      };

      options.$$prepared = true;
      var runner = $animateCss(element, options).start();
      runner.end();

      $$rAF.flush();

      expect(options.addClass).toBeFalsy();
      expect(options.removeClass).toBeFalsy();
      expect(options.to).toBeFalsy();
      expect(options.from).toBeFalsy();
    }));

    it('should apply the provided [from] CSS to the element', inject(function($animateCss) {
      $animateCss(element, { from: { height: '50px' }}).start();
      expect(element.css('height')).toBe('50px');
    }));

    it('should apply the provided [to] CSS to the element after the first frame', inject(function($animateCss) {
      $animateCss(element, { to: { width: '50px' }}).start();
      expect(element.css('width')).not.toBe('50px');
      triggerRAF();
      expect(element.css('width')).toBe('50px');
    }));

    it('should apply the provided [addClass] CSS classes to the element after the first frame', inject(function($animateCss) {
      $animateCss(element, { addClass: 'golden man' }).start();
      expect(element).not.toHaveClass('golden man');
      triggerRAF();
      expect(element).toHaveClass('golden man');
    }));

    it('should apply the provided [removeClass] CSS classes to the element after the first frame', inject(function($animateCss) {
      element.addClass('silver');
      $animateCss(element, { removeClass: 'silver dude' }).start();
      expect(element).toHaveClass('silver');
      triggerRAF();
      expect(element).not.toHaveClass('silver');
    }));

    it('should return an animator with a start method which returns a promise', inject(function($animateCss) {
      var promise = $animateCss(element, { addClass: 'cool' }).start();
      expect(isPromiseLike(promise)).toBe(true);
    }));

    it('should return an animator with an end method which returns a promise', inject(function($animateCss) {
      var promise = $animateCss(element, { addClass: 'cool' }).end();
      expect(isPromiseLike(promise)).toBe(true);
    }));

    it('should only resolve the promise once both a digest and RAF have passed after start',
      inject(function($animateCss, $rootScope) {

      var doneSpy = jasmine.createSpy();
      var runner = $animateCss(element, { addClass: 'cool' }).start();

      runner.then(doneSpy);
      expect(doneSpy).not.toHaveBeenCalled();

      triggerRAF();
      expect(doneSpy).not.toHaveBeenCalled();

      $rootScope.$digest();
      expect(doneSpy).toHaveBeenCalled();
    }));

    it('should resolve immediately if runner.end() is called',
      inject(function($animateCss, $rootScope) {

      var doneSpy = jasmine.createSpy();
      var runner = $animateCss(element, { addClass: 'cool' }).start();

      runner.then(doneSpy);
      runner.end();
      expect(doneSpy).not.toHaveBeenCalled();

      $rootScope.$digest();
      expect(doneSpy).toHaveBeenCalled();
    }));

    it('should reject immediately if runner.end() is called',
      inject(function($animateCss, $rootScope) {

      var cancelSpy = jasmine.createSpy();
      var runner = $animateCss(element, { addClass: 'cool' }).start();

      runner.catch(cancelSpy);
      runner.cancel();
      expect(cancelSpy).not.toHaveBeenCalled();

      $rootScope.$digest();
      expect(cancelSpy).toHaveBeenCalled();
    }));

    it('should not resolve after the next frame if the runner has already been cancelled',
      inject(function($animateCss, $rootScope) {

      var doneSpy = jasmine.createSpy();
      var cancelSpy = jasmine.createSpy();
      var runner = $animateCss(element, { addClass: 'cool' }).start();

      runner.then(doneSpy, cancelSpy);
      runner.cancel();

      $rootScope.$digest();
      expect(cancelSpy).toHaveBeenCalled();
      expect(doneSpy).not.toHaveBeenCalled();

      triggerRAF();
      expect(cancelSpy).toHaveBeenCalled();
      expect(doneSpy).not.toHaveBeenCalled();
    }));

    it('should not bother applying the provided [from] and [to] styles to the element if [cleanupStyles] is present',
      inject(function($animateCss, $rootScope) {

      var animator = $animateCss(element, {
        cleanupStyles: true,
        from: { width: '100px' },
        to: { width: '900px', height: '1000px' }
      });

      assertStyleIsEmpty(element, 'width');
      assertStyleIsEmpty(element, 'height');

      var runner = animator.start();

      assertStyleIsEmpty(element, 'width');
      assertStyleIsEmpty(element, 'height');

      triggerRAF();

      assertStyleIsEmpty(element, 'width');
      assertStyleIsEmpty(element, 'height');

      runner.end();

      assertStyleIsEmpty(element, 'width');
      assertStyleIsEmpty(element, 'height');

      function assertStyleIsEmpty(element, prop) {
        expect(element[0].style.getPropertyValue(prop)).toBeFalsy();
      }
    }));
  });

});
