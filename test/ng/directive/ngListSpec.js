'use strict';

/* globals getInputCompileHelper: false */

describe('ngList', function() {

  var helper, $rootScope;

  beforeEach(function() {
    helper = getInputCompileHelper(this);
  });

  afterEach(function() {
    helper.dealoc();
  });


  beforeEach(inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;
  }));

  it('should parse text into an array', function() {
    var inputElm = helper.compileInput('<input type="text" ng-model="list" ng-list />');

    // model -> view
    $rootScope.$apply("list = ['x', 'y', 'z']");
    expect(inputElm.val()).toBe('x, y, z');

    // view -> model
    helper.changeInputValueTo('1, 2, 3');
    expect($rootScope.list).toEqual(['1', '2', '3']);
  });


  it("should not clobber text if model changes due to itself", function() {
    // When the user types 'a,b' the 'a,' stage parses to ['a'] but if the
    // $parseModel function runs it will change to 'a', in essence preventing
    // the user from ever typing ','.
    var inputElm = helper.compileInput('<input type="text" ng-model="list" ng-list />');

    helper.changeInputValueTo('a ');
    expect(inputElm.val()).toEqual('a ');
    expect($rootScope.list).toEqual(['a']);

    helper.changeInputValueTo('a ,');
    expect(inputElm.val()).toEqual('a ,');
    expect($rootScope.list).toEqual(['a']);

    helper.changeInputValueTo('a , ');
    expect(inputElm.val()).toEqual('a , ');
    expect($rootScope.list).toEqual(['a']);

    helper.changeInputValueTo('a , b');
    expect(inputElm.val()).toEqual('a , b');
    expect($rootScope.list).toEqual(['a', 'b']);
  });


  it('should convert empty string to an empty array', function() {
    helper.compileInput('<input type="text" ng-model="list" ng-list />');

    helper.changeInputValueTo('');
    expect($rootScope.list).toEqual([]);
  });


  it('should be invalid if required and empty', function() {
    var inputElm = helper.compileInput('<input type="text" ng-list ng-model="list" required>');
    helper.changeInputValueTo('');
    expect($rootScope.list).toBeUndefined();
    expect(inputElm).toBeInvalid();
    helper.changeInputValueTo('a,b');
    expect($rootScope.list).toEqual(['a','b']);
    expect(inputElm).toBeValid();
  });

  describe('with a custom separator', function() {
    it('should split on the custom separator', function() {
      helper.compileInput('<input type="text" ng-model="list" ng-list=":" />');

      helper.changeInputValueTo('a,a');
      expect($rootScope.list).toEqual(['a,a']);

      helper.changeInputValueTo('a:b');
      expect($rootScope.list).toEqual(['a', 'b']);
    });


    it("should join the list back together with the custom separator", function() {
      var inputElm = helper.compileInput('<input type="text" ng-model="list" ng-list=" : " />');

      $rootScope.$apply(function() {
        $rootScope.list = ['x', 'y', 'z'];
      });
      expect(inputElm.val()).toBe('x : y : z');
    });
  });

  describe('(with ngTrim undefined or true)', function() {

    it('should ignore separator whitespace when splitting', function() {
      helper.compileInput('<input type="text" ng-model="list" ng-list="  |  " />');

      helper.changeInputValueTo('a|b');
      expect($rootScope.list).toEqual(['a', 'b']);
    });

    it('should trim whitespace from each list item', function() {
      helper.compileInput('<input type="text" ng-model="list" ng-list="|" />');

      helper.changeInputValueTo('a | b');
      expect($rootScope.list).toEqual(['a', 'b']);
    });
  });

  describe('(with ngTrim set to false)', function() {

    it('should use separator whitespace when splitting', function() {
      helper.compileInput('<input type="text" ng-model="list" ng-trim="false" ng-list="  |  " />');

      helper.changeInputValueTo('a|b');
      expect($rootScope.list).toEqual(['a|b']);

      helper.changeInputValueTo('a  |  b');
      expect($rootScope.list).toEqual(['a','b']);

    });

    it("should not trim whitespace from each list item", function() {
      helper.compileInput('<input type="text" ng-model="list" ng-trim="false" ng-list="|" />');
      helper.changeInputValueTo('a  |  b');
      expect($rootScope.list).toEqual(['a  ','  b']);
    });

    it("should support splitting on newlines", function() {
      helper.compileInput('<textarea type="text" ng-model="list" ng-trim="false" ng-list="&#10;"></textarea');
      helper.changeInputValueTo('a\nb');
      expect($rootScope.list).toEqual(['a','b']);
    });
  });
});

