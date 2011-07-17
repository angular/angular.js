'use strict';

describe('ValidatorTest', function(){

  it('ShouldHaveThisSet', function() {
    var validator = {};
    angular.validator.myValidator = function(first, last){
      validator.first = first;
      validator.last = last;
      validator._this = this;
    };
    var scope = compile('<input name="name" ng:validate="myValidator:\'hevery\'"/>')();
    scope.name = 'misko';
    scope.$eval();
    assertEquals('misko', validator.first);
    assertEquals('hevery', validator.last);
    expect(validator._this.$id).toEqual(scope.$id);
    delete angular.validator.myValidator;
    scope.$element.remove();
  });

  it('Regexp', function() {
    assertEquals(angular.validator.regexp("abc", /x/, "E1"), "E1");
    assertEquals(angular.validator.regexp("abc", '/x/'),
        "Value does not match expected format /x/.");
    assertEquals(angular.validator.regexp("ab", '^ab$'), null);
    assertEquals(angular.validator.regexp("ab", '^axb$', "E3"), "E3");
  });

  it('Number', function() {
    assertEquals(angular.validator.number("ab"), "Not a number");
    assertEquals(angular.validator.number("-0.1",0), "Value can not be less than 0.");
    assertEquals(angular.validator.number("10.1",0,10), "Value can not be greater than 10.");
    assertEquals(angular.validator.number("1.2"), null);
    assertEquals(angular.validator.number(" 1 ", 1, 1), null);
  });

  it('Integer', function() {
    assertEquals(angular.validator.integer("ab"), "Not a number");
    assertEquals(angular.validator.integer("1.1"), "Not a whole number");
    assertEquals(angular.validator.integer("1.0"), "Not a whole number");
    assertEquals(angular.validator.integer("1."), "Not a whole number");
    assertEquals(angular.validator.integer("-1",0), "Value can not be less than 0.");
    assertEquals(angular.validator.integer("11",0,10), "Value can not be greater than 10.");
    assertEquals(angular.validator.integer("1"), null);
    assertEquals(angular.validator.integer(" 1 ", 1, 1), null);
  });

  it('Date', function() {
    var error = "Value is not a date. (Expecting format: 12/31/2009).";
    expect(angular.validator.date("ab")).toEqual(error);
    expect(angular.validator.date("12/31/2009")).toEqual(null);
    expect(angular.validator.date("1/1/1000")).toEqual(null);
    expect(angular.validator.date("12/31/9999")).toEqual(null);
    expect(angular.validator.date("2/29/2004")).toEqual(null);
    expect(angular.validator.date("2/29/2000")).toEqual(null);
    expect(angular.validator.date("2/29/2100")).toEqual(error);
    expect(angular.validator.date("2/29/2003")).toEqual(error);
    expect(angular.validator.date("41/1/2009")).toEqual(error);
    expect(angular.validator.date("13/1/2009")).toEqual(error);
    expect(angular.validator.date("1/1/209")).toEqual(error);
    expect(angular.validator.date("1/32/2010")).toEqual(error);
    expect(angular.validator.date("001/031/2009")).toEqual(error);
  });

  it('Phone', function() {
    var error = "Phone number needs to be in 1(987)654-3210 format in North America or +999 (123) 45678 906 internationaly.";
    assertEquals(angular.validator.phone("ab"), error);
    assertEquals(null, angular.validator.phone("1(408)757-3023"));
    assertEquals(null, angular.validator.phone("+421 (0905) 933 297"));
    assertEquals(null, angular.validator.phone("+421 0905 933 297"));
  });

  it('URL', function() {
    var error = "URL needs to be in http://server[:port]/path format.";
    assertEquals(angular.validator.url("ab"), error);
    assertEquals(angular.validator.url("http://server:123/path"), null);
  });

  it('Email', function() {
    var error = "Email needs to be in username@host.com format.";
    assertEquals(error, angular.validator.email("ab"));
    assertEquals(null, angular.validator.email("misko@hevery.com"));
  });

  it('Json', function() {
    assertNotNull(angular.validator.json("'"));
    assertNotNull(angular.validator.json("''X"));
    assertNull(angular.validator.json("{}"));
  });

  describe('asynchronous', function(){
    var asynchronous = angular.validator.asynchronous;
    var self;
    var value, fn;

    beforeEach(function(){
      value = null;
      fn = null;
      self = angular.compile('<input />')();
      jqLite(document.body).append(self.$element);
      self.$element.data('$validate', noop);
      self.$root = self;
    });

    afterEach(function(){
      if (self.$element) self.$element.remove();
    });

    it('should make a request and show spinner', function(){
      var value, fn;
      var scope = angular.compile(
          '<input type="text" name="name" ng:validate="asynchronous:asyncFn"/>')();
      jqLite(document.body).append(scope.$element);
      var input = scope.$element;
      scope.asyncFn = function(v,f){
        value=v; fn=f;
      };
      scope.name = "misko";
      scope.$eval();
      expect(value).toEqual('misko');
      expect(input.hasClass('ng-input-indicator-wait')).toBeTruthy();
      fn("myError");
      expect(input.hasClass('ng-input-indicator-wait')).toBeFalsy();
      expect(input.attr(NG_VALIDATION_ERROR)).toEqual("myError");
      scope.$element.remove();
    });

    it("should not make second request to same value", function(){
      asynchronous.call(self, "kai", function(v,f){value=v; fn=f;});
      expect(value).toEqual('kai');
      expect(self.$service('$invalidWidgets')[0]).toEqual(self.$element);

      var spy = jasmine.createSpy();
      asynchronous.call(self, "kai", spy);
      expect(spy).not.toHaveBeenCalled();

      asynchronous.call(self, "misko", spy);
      expect(spy).toHaveBeenCalled();
    });

    it("should ignore old callbacks, and not remove spinner", function(){
      var firstCb, secondCb;
      asynchronous.call(self, "first", function(v,f){value=v; firstCb=f;});
      asynchronous.call(self, "second", function(v,f){value=v; secondCb=f;});

      firstCb();
      expect(self.$element.hasClass('ng-input-indicator-wait')).toBeTruthy();

      secondCb();
      expect(self.$element.hasClass('ng-input-indicator-wait')).toBeFalsy();
    });

    it("should handle update function", function(){
      var scope = angular.compile(
          '<input name="name" ng:validate="asynchronous:asyncFn:updateFn"/>')();
      scope.asyncFn = jasmine.createSpy();
      scope.updateFn = jasmine.createSpy();
      scope.name = 'misko';
      scope.$eval();
      expect(scope.asyncFn).toHaveBeenCalledWith('misko', scope.asyncFn.mostRecentCall.args[1]);
      assertTrue(scope.$element.hasClass('ng-input-indicator-wait'));
      scope.asyncFn.mostRecentCall.args[1]('myError', {id: 1234, data:'data'});
      assertFalse(scope.$element.hasClass('ng-input-indicator-wait'));
      assertEquals('myError', scope.$element.attr('ng-validation-error'));
      expect(scope.updateFn.mostRecentCall.args[0]).toEqual({id: 1234, data:'data'});
      scope.$element.remove();
    });

  });
});
