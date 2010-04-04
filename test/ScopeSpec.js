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

  //$eval
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

  //$watch
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
    expect(nameCount).toEqual(1);
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

  //$bind
  it('should curry a function with respect to scope', function(){
    var model = createScope();
    model.name = 'misko';
    expect(model.$bind(function(){return this.name;})()).toEqual('misko');
  });

  //$tryEval
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
    expect(element.attr('ng-error')).toEqual('"myError"'); // errors are jsonified
    expect(element.hasClass('ng-exception')).toBeTruthy();
  });

  // $onEval

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

  // Service injection
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
