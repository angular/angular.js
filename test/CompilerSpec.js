xdescribe('compiler', function(){
  function element(html) {
    return jQuery(html)[0];
  }

  var compiler, textMarkup, directives, widgets, compile, log;

  beforeEach(function(){
    log = "";
    directives = {
      hello: function(expression, element){
        log += "hello ";
        return function() {
          log += expression;
        };
      },

      watch: function(expression, element){
        return function() {
          this.$watch(expression, function(val){
            log += ":" + val;
          });
        };
      }

    };
    textMarkup = [];
    attrMarkup = [];
    widgets = {};
    compiler = new Compiler(textMarkup, attrMarkup, directives, widgets);
    compile = function(html){
      var e = element("<div>" + html + "</div>");
      var view = compiler.compile(e)(e);
      view.init();
      return view.scope;
    };
  });

  it('should recognize a directive', function(){
    var e = element('<div directive="expr" ignore="me"></div>');
    directives.directive = function(expression, element){
      log += "found";
      expect(expression).toEqual("expr");
      expect(element[0]).toEqual(e);
      return function initFn() {
        log += ":init";
      };
    };
    var template = compiler.compile(e);
    var init = template(e).init;
    expect(log).toEqual("found");
    init();
    expect(log).toEqual("found:init");
  });

  it('should recurse to children', function(){
    var scope = compile('<div><span hello="misko"/></div>');
    expect(log).toEqual("hello misko");
  });

  it('should watch scope', function(){
    var scope = compile('<span watch="name"/>');
    expect(log).toEqual("");
    scope.updateView();
    scope.set('name', 'misko');
    scope.updateView();
    scope.updateView();
    scope.set('name', 'adam');
    scope.updateView();
    scope.updateView();
    expect(log).toEqual(":misko:adam");
  });

  it('should prevent descend', function(){
    directives.stop = function(){ this.descend(false); };
    var scope = compile('<span hello="misko" stop="true"><span hello="adam"/></span>');
    expect(log).toEqual("hello misko");
  });

  it('should allow creation of templates', function(){
    directives.duplicate = function(expr, element){
      element.replaceWith(document.createComment("marker"));
      element.removeAttr("duplicate");
      var template = this.compile(element);
      return function(marker) {
        this.$addEval(function() {
          marker.after(template(element.clone()).element);
        });
      };
    };
    var scope = compile('before<span duplicate="expr">x</span>after');
    expect($(scope.element).html()).toEqual('before<!--marker-->after');
    scope.updateView();
    expect($(scope.element).html()).toEqual('before<!--marker--><span>x</span>after');
    scope.updateView();
    expect($(scope.element).html()).toEqual('before<!--marker--><span>x</span><span>x</span>after');
  });

  it('should allow for exculsive tags which suppress others', function(){
    directives.exclusive = function(){
      return function() {
        log += ('exclusive');
      };
    };
    directives.exclusive.exclusive = true;

    compile('<span hello="misko", exclusive/>');
    expect(log).toEqual('exclusive');
  });

  it('should process markup before directives', function(){
    textMarkup.push(function(text, textNode, parentNode) {
      if (text == 'middle') {
        expect(textNode.text()).toEqual(text);
        parentNode.attr('hello', text);
        textNode.text('replaced');
      }
    });
    var scope = compile('before<span>middle</span>after');
    expect(scope.element.innerHTML).toEqual('before<span hello="middle">replaced</span>after');
    expect(log).toEqual("hello middle");
  });

  it('should replace widgets', function(){
    widgets['NG:BUTTON'] = function(element) {
      element.replaceWith('<div>button</div>', element);
      return function(element) {
        log += 'init';
      };
    };
    var scope = compile('<ng:button>push me</ng:button>');
    expect(scope.element.innerHTML).toEqual('<div>button</div>');
    expect(log).toEqual('init');
  });

});
