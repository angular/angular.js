/**
 * Template provides directions an how to bind to a given element.
 * It contains a list of init functions which need to be called to
 * bind to a new instance of elements. It also provides a list
 * of child paths which contain child templates
 */
function Template() {
  this.paths = [];
  this.children = [];
  this.inits = [];
}

Template.prototype = {
  init: function(element, scope) {
    foreach(this.inits, function(fn) {
      scope.apply(fn, element);
    });

    var i,
        childNodes = element.childNodes,
        children = this.children,
        paths = this.paths,
        length = paths.length;
    for (i = 0; i < length; i++) {
      children[i].init(childNodes[paths[i]], scope);
    }
  },

  addInit:function(init) {
    if (init) {
      this.inits.push(init);
    }
  },

  setExclusiveInit: function(init) {
    this.inits = [init];
    this.addInit = noop;
  },


  addChild: function(index, template) {
    this.paths.push(index);
    this.children.push(template);
  }
};

///////////////////////////////////
// Compiler
//////////////////////////////////

function Compiler(markup, directives){
  this.markup = markup;
  this.directives = directives;
}

DIRECTIVE = /^ng-(.*)$/;

Compiler.prototype = {
  compile: function(element) {
    var template = this.templetize(element) || new Template();
    return function(element){
      var scope = new Scope();
      scope.element = element;
      return {
        scope: scope,
        element:element,
        init: bind(template, template.init, element, scope)
      };
    };
  },

  templetize: function(element){
    var chldrn, item, child, length, i, j, directive, init, template,
        childTemplate, recurse = true, directives = this.directives,
        markup = this.markup, markupLength = markup.length;

    for (i = 0, chldrn = element.childNodes, length = chldrn.length;
        i < length; i++) {
      if ((child = chldrn[i]).nodeType == Node.TEXT_NODE) {
        for (j = 0; j < markupLength; j++) {
          markup[j].call(this, child.nodeValue, child, element);
        }
      }
    }

    // Process attributes/directives
    for (i = 0, chldrn = element.attributes || [], length = chldrn.length;
         i < length; i++) {
      item = chldrn[i];
      var match = item.name.match(DIRECTIVE);
      if (match) {
        directive = directives[match[1]];
        if (directive) {
          init = directive.call(this, item.value, element);
          template = template || new Template();
          if (directive.exclusive) {
            template.setExclusiveInit(init);
            i = length; // quit iterations
          } else {
            template.addInit(init);
          }
          recurse = recurse && init;
        } else {
          error("Directive '" + match[0] + "' is not recognized.");
        }
      }
    }

    // Process children
    if (recurse) {
      for (i = 0, chldrn = element.childNodes, length = chldrn.length;
           i < length; i++) {
        if((child = chldrn[i]).nodeType != Node.TEXT_NODE &&
            (childTemplate = this.templetize(child))) {
          template = template || new Template();
          template.addChild(i, childTemplate);
        }
      }
    }
    return template;
  }
};

describe('compiler', function(){
  function element(html) {
    return jQuery(html)[0];
  }

  var compiler, markup, directives, compile, log;

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
    compiler = new Compiler(markup, directives);
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
      expect(element).toEqual(e);
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
          marker = document.createComment("marker"),
          parentNode = element.parentNode;
      parentNode.insertBefore(marker, element);
      parentNode.removeChild(element);
      element.removeAttribute("ng-duplicate");
      template = this.compile(element);
      return function(marker) {
        var parentNode = marker.parentNode;
        this.$eval(function() {
          parentNode.insertBefore(
              template(element.cloneNode(true)).element,
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
        expect(textNode.nodeValue).toEqual(text);
        parentNode.setAttribute('ng-hello', text);
        textNode.nodeValue = 'replaced';
      }
    });
    var scope = compile('before<span>middle</span>after');
    expect(scope.element.innerHTML).toEqual('before<span ng-hello="middle">replaced</span>after');
    expect(log).toEqual("hello middle");
  });
});
