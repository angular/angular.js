'use strict';

describe('compiler', function() {
  var compiler, textMmarkup, attrMarkup, directives, widgets, compile, log, $rootScope;

  beforeEach(inject(function($provide){
    textMmarkup = [];
    attrMarkup = [];
    widgets = extensionMap({}, 'widget');
    directives = {
      hello: function(expression, element){
        log += "hello ";
        return function() {
          log += expression;
        };
      },

      observe: function(expression, element){
        return function() {
          this.$watch(expression, function(scope, val){
            if (val)
              log += ":" + val;
          });
        };
      }

    };
    log = "";
    $provide.value('$textMarkup', textMmarkup);
    $provide.value('$attrMarkup', attrMarkup);
    $provide.value('$directive', directives);
    $provide.value('$widget', widgets);
  }));


  it('should not allow compilation of multiple roots', inject(function($rootScope, $compile) {
    expect(function() {
      $compile('<div>A</div><span></span>');
    }).toThrow("Cannot compile multiple element roots: " + ie("<div>A</div><span></span>"));
    function ie(text) {
      return msie < 9 ? uppercase(text) : text;
    }
  }));


  it('should recognize a directive', inject(function($rootScope, $compile) {
    var e = jqLite('<div directive="expr" ignore="me"></div>');
    directives.directive = function(expression, element){
      log += "found";
      expect(expression).toEqual("expr");
      expect(element).toEqual(e);
      return function initFn() {
        log += ":init";
      };
    };
    var linkFn = $compile(e);
    expect(log).toEqual("found");
    linkFn($rootScope);
    expect(e.hasClass('ng-directive')).toEqual(true);
    expect(log).toEqual("found:init");
  }));


  it('should recurse to children', inject(function($rootScope, $compile) {
    $compile('<div><span hello="misko"/></div>')($rootScope);
    expect(log).toEqual("hello misko");
  }));


  it('should observe scope', inject(function($rootScope, $compile) {
    $compile('<span observe="name"></span>')($rootScope);
    expect(log).toEqual("");
    $rootScope.$digest();
    $rootScope.name = 'misko';
    $rootScope.$digest();
    $rootScope.$digest();
    $rootScope.name = 'adam';
    $rootScope.$digest();
    $rootScope.$digest();
    expect(log).toEqual(":misko:adam");
  }));


  it('should prevent descend', inject(function($rootScope, $compile) {
    directives.stop = function() { this.descend(false); };
    $compile('<span hello="misko" stop="true"><span hello="adam"/></span>')($rootScope);
    expect(log).toEqual("hello misko");
  }));


  it('should allow creation of templates', inject(function($rootScope, $compile) {
    directives.duplicate = function(expr, element){
      element.replaceWith(document.createComment("marker"));
      element.removeAttr("duplicate");
      var linker = this.compile(element);
      return function(marker) {
        this.$watch('value', function() {
          var scope = $rootScope.$new;
          linker(scope, noop);
          marker.after(scope.$element);
        });
      };
    };
    $compile('<div>before<span duplicate="expr">x</span>after</div>')($rootScope);
    expect(sortedHtml($rootScope.$element)).
      toEqual('<div>' +
                'before<#comment></#comment>' +
                'after' +
              '</div>');
    $rootScope.value = 1;
    $rootScope.$digest();
    expect(sortedHtml($rootScope.$element)).
      toEqual('<div>' +
          'before<#comment></#comment>' +
          '<span>x</span>' +
          'after' +
        '</div>');
    $rootScope.value = 2;
    $rootScope.$digest();
    expect(sortedHtml($rootScope.$element)).
      toEqual('<div>' +
          'before<#comment></#comment>' +
          '<span>x</span>' +
          '<span>x</span>' +
          'after' +
        '</div>');
    $rootScope.value = 3;
    $rootScope.$digest();
    expect(sortedHtml($rootScope.$element)).
      toEqual('<div>' +
          'before<#comment></#comment>' +
          '<span>x</span>' +
          '<span>x</span>' +
          '<span>x</span>' +
          'after' +
        '</div>');
  }));


  it('should process markup before directives', inject(function($rootScope, $compile) {
    textMmarkup.push(function(text, textNode, parentNode) {
      if (text == 'middle') {
        expect(textNode.text()).toEqual(text);
        parentNode.attr('hello', text);
        textNode[0].nodeValue = 'replaced';
      }
    });
    $compile('<div>before<span>middle</span>after</div>')($rootScope);
    expect(sortedHtml($rootScope.$element[0], true)).
      toEqual('<div>before<span class="ng-directive" hello="middle">replaced</span>after</div>');
    expect(log).toEqual("hello middle");
  }));


  it('should replace widgets', inject(function($rootScope, $compile) {
    widgets['NG:BUTTON'] = function(element) {
      expect(element.hasClass('ng-widget')).toEqual(true);
      element.replaceWith('<div>button</div>');
      return function(element) {
        log += 'init';
      };
    };
    $compile('<div><ng:button>push me</ng:button></div>')($rootScope);
    expect(lowercase($rootScope.$element[0].innerHTML)).toEqual('<div>button</div>');
    expect(log).toEqual('init');
  }));


  it('should use the replaced element after calling widget', inject(function($rootScope, $compile) {
    widgets['H1'] = function(element) {
      // HTML elements which are augmented by acting as widgets, should not be marked as so
      expect(element.hasClass('ng-widget')).toEqual(false);
      var span = angular.element('<span>{{1+2}}</span>');
      element.replaceWith(span);
      this.descend(true);
      this.directives(true);
      return noop;
    };
    textMmarkup.push(function(text, textNode, parent){
      if (text == '{{1+2}}')
        parent.text('3');
    });
    $compile('<div><h1>ignore me</h1></div>')($rootScope);
    expect($rootScope.$element.text()).toEqual('3');
  }));


  it('should allow multiple markups per text element', inject(function($rootScope, $compile) {
    textMmarkup.push(function(text, textNode, parent){
      var index = text.indexOf('---');
      if (index > -1) {
        textNode.after(text.substring(index + 3));
        textNode.after("<hr/>");
        textNode.after(text.substring(0, index));
        textNode.remove();
      }
    });
    textMmarkup.push(function(text, textNode, parent){
      var index = text.indexOf('===');
      if (index > -1) {
        textNode.after(text.substring(index + 3));
        textNode.after("<p>");
        textNode.after(text.substring(0, index));
        textNode.remove();
      }
    });
    $compile('<div>A---B---C===D</div>')($rootScope);
    expect(sortedHtml($rootScope.$element)).toEqual('<div>A<hr></hr>B<hr></hr>C<p></p>D</div>');
  }));


  it('should add class for namespace elements', inject(function($rootScope, $compile) {
    var element = $compile('<ng:space>abc</ng:space>')($rootScope);
    expect(element.hasClass('ng-space')).toEqual(true);
  }));
});
