describe('compiler', function(){
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
            if (val)
              log += ":" + val;
          });
        };
      }

    };
    markup = [];
    attrMarkup = [];
    widgets = extensionMap({}, 'widget');
    compiler = new Compiler(markup, attrMarkup, directives, widgets);
    compile = function(html){
      var e = jqLite("<div>" + html + "</div>");
      var scope = compiler.compile(e)(e);
      scope.$init();
      return scope;
    };
  });

  it('should recognize a directive', function(){
    var e = jqLite('<div directive="expr" ignore="me"></div>');
    directives.directive = function(expression, element){
      log += "found";
      expect(expression).toEqual("expr");
      expect(element).toEqual(e);
      return function initFn() {
        log += ":init";
      };
    };
    var template = compiler.compile(e);
    var init = template(e).$init;
    expect(log).toEqual("found");
    init();
    expect(e.hasClass('ng-directive')).toEqual(true);
    expect(log).toEqual("found:init");
  });

  it('should recurse to children', function(){
    var scope = compile('<div><span hello="misko"/></div>');
    expect(log).toEqual("hello misko");
  });

  it('should watch scope', function(){
    var scope = compile('<span watch="name"/>');
    expect(log).toEqual("");
    scope.$eval();
    scope.$set('name', 'misko');
    scope.$eval();
    scope.$eval();
    scope.$set('name', 'adam');
    scope.$eval();
    scope.$eval();
    expect(log).toEqual(":misko:adam");
  });

  it('should prevent descend', function(){
    directives.stop = function(){ this.descend(false); };
    var scope = compile('<span hello="misko" stop="true"><span hello="adam"/></span>');
    expect(log).toEqual("hello misko");
  });

  it('should allow creation of templates', function(){
    directives.duplicate = function(expr, element){
      var parent = element.parent();
      element.replaceWith(document.createComment("marker"));
      element.removeAttr("duplicate");
      var template = this.compile(element);
      return function(marker) {
        this.$onEval(function() {
          marker.after(template(element.clone()).$element);
        });
      };
    };
    var scope = compile('before<span duplicate="expr">x</span>after');
    expect(sortedHtml(scope.$element)).toEqual('<div>before<#comment></#comment><span>x</span>after</div>');
    scope.$eval();
    expect(sortedHtml(scope.$element)).toEqual('<div>before<#comment></#comment><span>x</span><span>x</span>after</div>');
    scope.$eval();
    expect(sortedHtml(scope.$element)).toEqual('<div>before<#comment></#comment><span>x</span><span>x</span><span>x</span>after</div>');
  });

  it('should process markup before directives', function(){
    markup.push(function(text, textNode, parentNode) {
      if (text == 'middle') {
        expect(textNode.text()).toEqual(text);
        parentNode.attr('hello', text);
        textNode[0].nodeValue = 'replaced';
      }
    });
    var scope = compile('before<span>middle</span>after');
    expect(sortedHtml(scope.$element[0], true)).toEqual('<div>before<span class="ng-directive" hello="middle">replaced</span>after</div>');
    expect(log).toEqual("hello middle");
  });

  it('should replace widgets', function(){
    widgets['NG:BUTTON'] = function(element) {
      expect(element.hasClass('ng-widget')).toEqual(true);
      element.replaceWith('<div>button</div>');
      return function(element) {
        log += 'init';
      };
    };
    var scope = compile('<ng:button>push me</ng:button>');
    expect(lowercase(scope.$element[0].innerHTML)).toEqual('<div>button</div>');
    expect(log).toEqual('init');
  });

  it('should use the replaced element after calling widget', function(){
    widgets['H1'] = function(element) {
      // HTML elements which are augmented by acting as widgets, should not be marked as so
      expect(element.hasClass('ng-widget')).toEqual(false);
      var span = angular.element('<span>{{1+2}}</span>');
      element.replaceWith(span);
      this.descend(true);
      this.directives(true);
      return noop;
    };
    markup.push(function(text, textNode, parent){
      if (text == '{{1+2}}')
        parent.text('3');
    });
    var scope = compile('<div><h1>ignore me</h1></div>');
    expect(scope.$element.text()).toEqual('3');
  });

  it('should allow multiple markups per text element', function(){
    markup.push(function(text, textNode, parent){
      var index = text.indexOf('---');
      if (index > -1) {
        textNode.after(text.substring(index + 3));
        textNode.after("<hr/>");
        textNode.after(text.substring(0, index));
        textNode.remove();
      }
    });
    markup.push(function(text, textNode, parent){
      var index = text.indexOf('===');
      if (index > -1) {
        textNode.after(text.substring(index + 3));
        textNode.after("<p>");
        textNode.after(text.substring(0, index));
        textNode.remove();
      }
    });
    var scope = compile('A---B---C===D');
    expect(sortedHtml(scope.$element)).toEqual('<div>A<hr></hr>B<hr></hr>C<p></p>D</div>');
  });

});
