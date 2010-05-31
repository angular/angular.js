describe('scope/model', function(){

  it('should create a scope with parent', function(){
    var model = createScope({name:'Misko'});
    expect(model.name).toEqual('Misko');
  });

  it('should have $get/set$/parent$', function(){
    var parent = {};
    var model = createScope(parent);
    model.$set('name', 'adam');
    expect(model.name).toEqual('adam');
    expect(model.$get('name')).toEqual('adam');
    expect(model.$parent).toEqual(model);
    expect(model.$root).toEqual(model);
  });

  describe('$eval', function(){
    it('should eval function with correct this and pass arguments', function(){
      var model = createScope();
      model.$eval(function(name){
        this.name = name;
      }, 'works');
      expect(model.name).toEqual('works');
    });

    it('should eval expression with correct this', function(){
      var model = createScope();
      model.$eval('name="works"');
      expect(model.name).toEqual('works');
    });

    it('should do nothing on empty string and not update view', function(){
      var model = createScope();
      var onEval = jasmine.createSpy('onEval');
      model.$onEval(onEval);
      model.$eval('');
      expect(onEval).wasNotCalled();
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
  });

  describe('$bind', function(){
    it('should curry a function with respect to scope', function(){
      var model = createScope();
      model.name = 'misko';
      expect(model.$bind(function(){return this.name;})()).toEqual('misko');
    });
  });

  describe('$tryEval', function(){
    it('should report error on element', function(){
      var scope = createScope();
      scope.$tryEval('throw "myerror";', function(error){
        scope.error = error;
      });
      expect(scope.error).toEqual('myerror');
    });

    it('should report error on visible element', function(){
      var element = jqLite('<div></div>');
      var scope = createScope();
      scope.$tryEval('throw "myError"', element);
      expect(element.attr('ng-exception')).toEqual('"myError"'); // errors are jsonified
      expect(element.hasClass('ng-exception')).toBeTruthy();
    });

    it('should report error on $excetionHandler', function(){
      var element = jqLite('<div></div>');
      var scope = createScope();
      scope.$exceptionHandler = function(e){
        this.error = e;
      };
      scope.$tryEval('throw "myError"');
      expect(scope.error).toEqual("myError");
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

  describe('service injection', function(){
    it('should inject services', function(){
      var scope = createScope(null, {
        service:function(){
        return "ABC";
      }
      });
      expect(scope.service).toEqual("ABC");
    });

    it('should inject arugments', function(){
      var scope = createScope(null, {
        name:function(){
        return "misko";
      },
      greet: extend(function(name) {
        return 'hello ' + name;
      }, {inject:['name']})
      });
      expect(scope.greet).toEqual("hello misko");
    });

    it('should throw error on missing dependency', function(){
      try {
        createScope(null, {
          greet: extend(function(name) {
          }, {inject:['name']})
        });
      } catch(e) {
        expect(e).toEqual("Don't know how to inject 'name'.");
      }
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
});
