'use strict';

describe("Animator", function() {

  var element, animationCntl;

  beforeEach(inject(function($injector) {
    animationCntl = $injector.instantiate(Animator);
  }));

  afterEach(function(){
    dealoc(element);
  });

  describe("set()", function() {
    it("should throw an error when used incorrectly", function() {
      var fn1 = function() {
        animationCntl.set('custom1');
      };
      expect(fn1).toThrow();

      var fn2 = function() {
        animationCntl.set('custom2', null);
      };
      expect(fn2).toThrow();

      var fn3 = function() {
        animationCntl.set('custom3', false);
      };
      expect(fn3).toThrow();

      var fn4 = function() {
        animationCntl.set('custom4', 'b');
      };
      expect(fn4).toThrow();

      var fn5 = function() {
        animationCntl.set('custom5', 0);
      };
      expect(fn5).toThrow();

      var fn6 = function() {
        animationCntl.set('custom6', 100);
      };
      expect(fn6).toThrow();

      var fn7 = function() {
        animationCntl.set('custom7', []);
      };
      expect(fn7).toThrow();

      var fn8 = function() {
        animationCntl.set('custom8', undefined);
      };
      expect(fn8).toThrow();
    });

    it("should not throw an error when used correctly", function() {
      var fn = function() {
        animationCntl.set('custom', function() { });
      };
      expect(fn).not.toThrow();
    });

    it("should overwrite the previous animator when set", function() {
      var response;
      animationCntl.set('enter', function() {
        response = 'a';
      });
      animationCntl.set('enter', function() {
        response = 'b';
      });
      animationCntl.animate('enter');
      expect(response).toBe('b');
    });
  });

  describe("animate()", function() {
    it("should be defined", function() {
      expect(typeof(animationCntl.animate)).toBe('function');
    });

    it("should throw an error when an animation is not defined", function() {
      var fn = function() {
        animationCntl.animate('custom');
      };
      expect(fn).toThrow();
    });

    it("should not throw an error when an animation is defined", function() {
      animationCntl.set('custom', function() {});
      var fn = function() {
        animationCntl.animate('custom');
      };
      expect(fn).not.toThrow();
    });

    it("should run the correct animator instantly", function() {
      var hasRun = false;
      animationCntl.set('enter', function() {
        hasRun = true;
      });
      animationCntl.animate('enter');
      expect(hasRun).toBe(true);
    });

    it("should run a custom animator", function() {
      var hasRun = false;
      animationCntl.set('custom', function() {
        hasRun = true;
      });
      animationCntl.animate('custom');
      expect(hasRun).toBe(true);
    });
  });

});
