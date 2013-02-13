'use strict';

describe('animations', function() {

  var animation, module, injector;

  beforeEach(inject(function($animation, $injector){
    module    = angular.module('ng');
    animation = $animation;
    injector  = $injector;
  }));

  it("should be a function that can be called", function() {
    expect(typeof(animation)).toBe('function');
  });

  describe('module', function() {

    it("should have an animation module method available", function() {
      expect(typeof(module.animation)).toBe('function');
    });

    /*
    it("should define an animation", function() {
      var value = {};
      animation('customAni', function() {
        return value;
      });

      expect(animation('customAni')).toBe(value);
      //expect(injector.get('customAniAnimation')).toBe(value);
    });
    */

  });

  describe('$AnimationProvider', function() {

    it("should exist", function() {
      expect($AnimationProvider).toBeDefined();
    });

    /*
    describe("method definitions", function() {

      var providedAnimation;
      beforeEach(inject(function() {
        var injector = angular.injector();
        providedAnimation = injector.invoke($AnimationProvider);
      }));

      it("should have a register function", function() {
        expect(typeof(providedAnimation.register)).toBe('function');
      });

      it("should have a $get function", function() {
        expect(typeof(providedAnimation.$get)).toBe('function');
      });
    });
    */

  });

  describe('noopAnimations', function() {

    describe("enter",function() {
      var enter;
      beforeEach(function() {
        enter = animation('noopEnter');
      });

      it("should have a default animation", function() {
        expect(typeof(enter)).toBe('function');
      });

      it("the animation should be defined as an injector", function() {
        expect(injector.get('noopEnterAnimation')).toBe(enter);
      });
    });

    describe("leave",function() {
      var leave;
      beforeEach(function() {
        leave = animation('noopLeave');
      });

      it("should have a default animation", function() {
        expect(typeof(leave)).toBe('function');
      });

      it("the animation should be defined as an injector", function() {
        expect(injector.get('noopLeaveAnimation')).toBe(leave);
      });
    });

    describe("move",function() {
      var move;
      beforeEach(function() {
        move = animation('noopMove');
      });

      it("should have a default animation", function() {
        expect(typeof(move)).toBe('function');
      });

      it("the animation should be defined as an injector", function() {
        expect(injector.get('noopMoveAnimation')).toBe(move);
      });
    });
  });

});
