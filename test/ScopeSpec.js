'use strict';

describe('scope/model', function(){

  var temp;

  beforeEach(function() {
    temp = window.temp = {};
    temp.InjectController = function(exampleService, extra) {
      this.localService = exampleService;
      this.extra = extra;
      this.$root.injectController = this;
    };
    temp.InjectController.$inject = ["exampleService"];
  });

  afterEach(function() {
    window.temp = undefined;
  });

  it('should create a scope with parent', function(){
    var model = createScope({name:'Misko'});
    expect(model.name).toEqual('Misko');
  });

  it('should have $get/$set/$parent', function(){
    var parent = {};
    var model = createScope(parent);
    model.$set('name', 'adam');
    expect(model.name).toEqual('adam');
    expect(model.$get('name')).toEqual('adam');
    expect(model.$parent).toEqual(model);
    expect(model.$root).toEqual(model);
  });

  it('should return noop function when LHS is undefined', function(){
    var model = createScope();
    expect(model.$eval('x.$filter()')).toEqual(undefined);
  });

  describe('$eval', function(){
    var model;

    beforeEach(function(){model = createScope();});

    it('should eval function with correct this', function(){
      model.$eval(function(){
        this.name = 'works';
      });
      expect(model.name).toEqual('works');
    });

    it('should eval expression with correct this', function(){
      model.$eval('name="works"');
      expect(model.name).toEqual('works');
    });

    it('should not bind regexps', function(){
      model.exp = /abc/;
      expect(model.$eval('exp')).toEqual(model.exp);
    });

    it('should do nothing on empty string and not update view', function(){
      var onEval = jasmine.createSpy('onEval');
      model.$onEval(onEval);
      model.$eval('');
      expect(onEval).not.toHaveBeenCalled();
    });

    it('should ignore none string/function', function(){
      model.$eval(null);
      model.$eval({});
      model.$tryEval(null);
      model.$tryEval({});
    });

  });

  describe('$watch', function(){
    it('should watch an expression for change', function(){
      var model = createScope();
      model.oldValue = "";
      var nameCount = 0, evalCount = 0;
      model.name = 'adam';
      model.$watch('name', function(){ nameCount ++; });
      model.$watch(function(){return model.name;}, function(newValue, oldValue){
        this.newValue = newValue;
        this.oldValue = oldValue;
      });
      model.$onEval(function(){evalCount ++;});
      model.name = 'misko';
      model.$eval();
      expect(nameCount).toEqual(2);
      expect(evalCount).toEqual(1);
      expect(model.newValue).toEqual('misko');
      expect(model.oldValue).toEqual('adam');
    });

    it('should eval with no arguments', function(){
      var model = createScope();
      var count = 0;
      model.$onEval(function(){count++;});
      model.$eval();
      expect(count).toEqual(1);
    });

    it('should run listener upon registration by default', function() {
      var model = createScope();
      var count = 0,
          nameNewVal = 'crazy val 1',
          nameOldVal = 'crazy val 2';

      model.$watch('name', function(newVal, oldVal){
        count ++;
        nameNewVal = newVal;
        nameOldVal = oldVal;
      });

      expect(count).toBe(1);
      expect(nameNewVal).not.toBeDefined();
      expect(nameOldVal).not.toBeDefined();
    });

    it('should not run listener upon registration if flag is passed in', function() {
      var model = createScope();
      var count = 0,
          nameNewVal = 'crazy val 1',
          nameOldVal = 'crazy val 2';

      model.$watch('name', function(newVal, oldVal){
        count ++;
        nameNewVal = newVal;
        nameOldVal = oldVal;
      }, undefined, false);

      expect(count).toBe(0);
      expect(nameNewVal).toBe('crazy val 1');
      expect(nameOldVal).toBe('crazy val 2');
    });
  });

  describe('$bind', function(){
    it('should curry a function with respect to scope', function(){
      var model = createScope();
      model.name = 'misko';
      expect(model.$bind(function(){return this.name;})()).toEqual('misko');
    });
  });

  describe('$tryEval', function(){
    it('should report error using the provided error handler and $log.error', function(){
      var scope = createScope(),
          errorLogs = scope.$service('$log').error.logs;

      scope.$tryEval(function(){throw "myError";}, function(error){
        scope.error = error;
      });
      expect(scope.error).toEqual('myError');
      expect(errorLogs.shift()[0]).toBe("myError");
    });

    it('should report error on visible element', function(){
      var element = jqLite('<div></div>'),
          scope = createScope(),
          errorLogs = scope.$service('$log').error.logs;

      scope.$tryEval(function(){throw "myError";}, element);
      expect(element.attr('ng-exception')).toEqual('myError');
      expect(element.hasClass('ng-exception')).toBeTruthy();
      expect(errorLogs.shift()[0]).toBe("myError");
    });

    it('should report error on $excetionHandler', function(){
      var scope = createScope(null, {$exceptionHandler: $exceptionHandlerMockFactory},
                                    {$log: $logMock});
      scope.$tryEval(function(){throw "myError";});
      expect(scope.$service('$exceptionHandler').errors.shift()).toEqual("myError");
      expect(scope.$service('$log').error.logs.shift()).toEqual(["myError"]);
    });
  });

  // $onEval
  describe('$onEval', function(){
    it("should eval using priority", function(){
      var scope = createScope();
      scope.log = "";
      scope.$onEval('log = log + "middle;"');
      scope.$onEval(-1, 'log = log + "first;"');
      scope.$onEval(1, 'log = log + "last;"');
      scope.$eval();
      expect(scope.log).toEqual('first;middle;last;');
    });

    it("should have $root and $parent", function(){
      var parent = createScope();
      var scope = createScope(parent);
      expect(scope.$root).toEqual(parent);
      expect(scope.$parent).toEqual(parent);
    });
  });

  describe('getterFn', function(){
    it('should get chain', function(){
      expect(getterFn('a.b')(undefined)).toEqual(undefined);
      expect(getterFn('a.b')({})).toEqual(undefined);
      expect(getterFn('a.b')({a:null})).toEqual(undefined);
      expect(getterFn('a.b')({a:{}})).toEqual(undefined);
      expect(getterFn('a.b')({a:{b:null}})).toEqual(null);
      expect(getterFn('a.b')({a:{b:0}})).toEqual(0);
      expect(getterFn('a.b')({a:{b:'abc'}})).toEqual('abc');
    });

    it('should map type method on top of expression', function(){
      expect(getterFn('a.$filter')({a:[]})('')).toEqual([]);
    });

    it('should bind function this', function(){
      expect(getterFn('a')({a:function($){return this.b + $;}, b:1})(2)).toEqual(3);

    });
  });

  describe('$new', function(){
    it('should create new child scope and $become controller', function(){
      var parent = createScope(null, angularService, {exampleService: 'Example Service'});
      var child = parent.$new(temp.InjectController, 10);
      expect(child.localService).toEqual('Example Service');
      expect(child.extra).toEqual(10);

      child.$onEval(function(){ this.run = true; });
      parent.$eval();
      expect(child.run).toEqual(true);
    });
  });

  describe('$become', function(){
    it('should inject properties on controller defined in $inject', function(){
      var parent = createScope(null, angularService, {exampleService: 'Example Service'});
      var child = createScope(parent);
      child.$become(temp.InjectController, 10);
      expect(child.localService).toEqual('Example Service');
      expect(child.extra).toEqual(10);
    });
  });

});
