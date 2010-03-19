describe('compiler', function(){
  function element(html) {
    return jQuery(html)[0];
  }

  var compiler, markup, directives, widgets, compile, log;

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
    markup = [];
    widgets = {};
    compiler = new Compiler(markup, directives, widgets);
    compile = function(html){
      var e = element("<div>" + html + "</div>");
      var view = compiler.compile(e)(e);
      view.init();
      return view.scope;
    };
  });

  it('should recognize a directive', function(){
    var e = element('<div ng-directive="expr" ignore="me"></div>');
    directives.directive = function(expression, element){
      log += "found";
      expect(expression).toEqual("expr");
      expect(element.element).toEqual(e);
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
    var scope = compile('<div><span ng-hello="misko"/></div>');
    expect(log).toEqual("hello misko");
  });

  it('should watch scope', function(){
    var scope = compile('<span ng-watch="name"/>');
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

  it('should prevent recursion', function(){
    directives.stop = function(){ return false; };
    var scope = compile('<span ng-hello="misko" ng-stop="true"><span ng-hello="adam"/></span>');
    expect(log).toEqual("hello misko");
  });

  it('should allow creation of templates', function(){
    directives.duplicate = function(expr, element){
      var template,
          marker = document.createComment("marker");
      element.replaceWith(marker);
      element.removeAttribute("ng-duplicate");
      template = this.compile(element);
      return function(marker) {
        var parentNode = marker.parentNode;
        this.$eval(function() {
          parentNode.insertBefore(
              template(element.clone()).element,
              marker.nextSibling);
        });
      };
    };
    var scope = compile('before<span ng-duplicate="expr">x</span>after');
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

    compile('<span ng-hello="misko", ng-exclusive/>');
    expect(log).toEqual('exclusive');
  });

  it('should process markup before directives', function(){
    markup.push(function(text, textNode, parentNode) {
      if (text == 'middle') {
        expect(textNode.text()).toEqual(text);
        parentNode.attr('ng-hello', text);
        textNode.nodeValue = 'replaced';
      }
    });
    var scope = compile('before<span>middle</span>after');
    expect(scope.element.innerHTML).toEqual('before<span ng-hello="middle">replaced</span>after');
    expect(log).toEqual("hello middle");
  });

  it('should replace widgets', function(){
    widgets.button = function(element) {
      element.parentNode.replaceChild(button, element);
      return function(element) {
        log += 'init';
      };
    };
    var scope = compile('<ng:button>push me</ng:button>');
    expect(scope.element.innerHTML).toEqual('before<span ng-hello="middle">replaced</span>after');
  });
});
