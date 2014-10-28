/* global describe: false, beforeEach: false, it: false, expect: false, spyOn: false */
'use strict';

describe('validate-commit-msg.js', function() {
  var m = require('./validate-commit-msg');
  var errors = [];
  var logs = [];

  var VALID = true;
  var INVALID = false;

  beforeEach(function() {
    errors.length = 0;
    logs.length = 0;

    spyOn(console, 'error').andCallFake(function(msg) {
      errors.push(msg.replace(/\x1B\[\d+m/g, '')); // uncolor
    });

    spyOn(console, 'log').andCallFake(function(msg) {
      logs.push(msg.replace(/\x1B\[\d+m/g, '')); // uncolor
    });
  });

  describe('validateMessage', function() {

    it('should be valid', function() {
      expect(m.validateMessage('fixup! fix($compile): something')).toBe(VALID);
      expect(m.validateMessage('fix($compile): something')).toBe(VALID);
      expect(m.validateMessage('feat($location): something')).toBe(VALID);
      expect(m.validateMessage('docs($filter): something')).toBe(VALID);
      expect(m.validateMessage('style($http): something')).toBe(VALID);
      expect(m.validateMessage('refactor($httpBackend): something')).toBe(VALID);
      expect(m.validateMessage('test($resource): something')).toBe(VALID);
      expect(m.validateMessage('chore($controller): something')).toBe(VALID);
      expect(m.validateMessage('chore(foo-bar): something')).toBe(VALID);
      expect(m.validateMessage('chore(*): something')).toBe(VALID);
      expect(m.validateMessage('chore(guide/location): something')).toBe(VALID);
      expect(m.validateMessage('revert(foo): something')).toBe(VALID);
      expect(errors).toEqual([]);
    });


    it('should validate 100 characters length', function() {
      var msg = "fix($compile): something super mega extra giga tera long, maybe even longer and longer and longer... ";

      expect(m.validateMessage(msg)).toBe(INVALID);
      expect(errors).toEqual(['INVALID COMMIT MSG: is longer than 100 characters !']);
    });


    it('should validate "<type>(<scope>): <subject>" format', function() {
      var msg = 'not correct format';

      expect(m.validateMessage(msg)).toBe(INVALID);
      expect(errors).toEqual(['INVALID COMMIT MSG: does not match "<type>(<scope>): <subject>" ! was: not correct format']);
    });


    it('should validate type', function() {
      expect(m.validateMessage('weird($filter): something')).toBe(INVALID);
      expect(errors).toEqual(['INVALID COMMIT MSG: "weird" is not allowed type !']);
    });


    it('should allow empty scope', function() {
      expect(m.validateMessage('fix: blablabla')).toBe(VALID);
    });


    it('should allow dot in scope', function() {
      expect(m.validateMessage('chore(mocks.$httpBackend): something')).toBe(VALID);
    });


    it('should ignore msg prefixed with "WIP: "', function() {
      expect(m.validateMessage('WIP: bullshit')).toBe(VALID);
    });
  });
});
