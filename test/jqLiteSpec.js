'use strict';

describe('jqLite', function(){
  var scope, a, b, c;

  beforeEach(function(){
    a = jqLite('<div>A</div>')[0];
    b = jqLite('<div>B</div>')[0];
    c = jqLite('<div>C</div>')[0];
  });


  beforeEach(function(){
    scope = angular.scope();
    this.addMatchers({
      toJqEqual: function(expected) {
        var msg = "Unequal length";
        this.message = function() { return msg; };

        var value = this.actual && expected && this.actual.length == expected.length;
        for (var i = 0; value && i < expected.length; i++) {
          var actual = jqLite(this.actual[i])[0];
          var expect = jqLite(expected[i])[0];
          value = value && equals(expect, actual);
          msg = "Not equal at index: " + i
              + " - Expected: " + expect
              + " - Actual: " + actual;
        }
        return value;
      }
    });
  });


  afterEach(function(){
    dealoc(a);
    dealoc(b);
    dealoc(c);
  });


  describe('construction', function(){
    it('should allow construction with text node', function(){
      var text = a.firstChild;
      var selected = jqLite(text);
      expect(selected.length).toEqual(1);
      expect(selected[0]).toEqual(text);
    });


    it('should allow construction with html', function(){
      var nodes = jqLite('<div>1</div><span>2</span>');
      expect(nodes.length).toEqual(2);
      expect(nodes[0].innerHTML).toEqual('1');
      expect(nodes[1].innerHTML).toEqual('2');
    });


    it('should allow creation of comment tags', function() {
      var nodes = jqLite('<!-- foo -->');
      expect(nodes.length).toBe(1);
      expect(nodes[0].nodeType).toBe(8);
    });


    it('should allow creation of script tags', function() {
      var nodes = jqLite('<script></script>');
      expect(nodes.length).toBe(1);
      expect(nodes[0].tagName.toUpperCase()).toBe('SCRIPT');
    });


    it('should wrap document fragment', function() {
      var fragment = jqLite(document.createDocumentFragment());
      expect(fragment.length).toBe(1);
      expect(fragment[0].nodeType).toBe(11);
    });
  });


  describe('scope', function() {
    it('should retrieve scope attached to the current element', function() {
      var element = jqLite('<i>foo</i>');
      element.data('$scope', scope);
      expect(element.scope()).toBe(scope);
      dealoc(element);
    });


    it('should walk up the dom to find scope', function() {
      var element = jqLite('<ul><li><p><b>deep deep</b><p></li></ul>');
      var deepChild = jqLite(element[0].getElementsByTagName('b')[0]);
      element.data('$scope', scope);
      expect(deepChild.scope()).toBe(scope);
      dealoc(element);
    });


    it('should return undefined when no scope was found', function() {
      var element = jqLite('<ul><li><p><b>deep deep</b><p></li></ul>');
      var deepChild = jqLite(element[0].getElementsByTagName('b')[0]);
      expect(deepChild.scope()).toBeFalsy();
      dealoc(element);
    });
  });


  describe('data', function(){
    it('should set and get ande remove data', function(){
      var selected = jqLite([a, b, c]);

      expect(selected.data('prop', 'value')).toEqual(selected);
      expect(selected.data('prop')).toEqual('value');
      expect(jqLite(a).data('prop')).toEqual('value');
      expect(jqLite(b).data('prop')).toEqual('value');
      expect(jqLite(c).data('prop')).toEqual('value');

      jqLite(a).data('prop', 'new value');
      expect(jqLite(a).data('prop')).toEqual('new value');
      expect(selected.data('prop')).toEqual('new value');
      expect(jqLite(b).data('prop')).toEqual('value');
      expect(jqLite(c).data('prop')).toEqual('value');

      expect(selected.removeData('prop')).toEqual(selected);
      expect(jqLite(a).data('prop')).toEqual(undefined);
      expect(jqLite(b).data('prop')).toEqual(undefined);
      expect(jqLite(c).data('prop')).toEqual(undefined);
    });
  });


  describe('attr', function(){
    it('shoul read write and remove attr', function(){
      var selector = jqLite([a, b]);

      expect(selector.attr('prop', 'value')).toEqual(selector);
      expect(jqLite(a).attr('prop')).toEqual('value');
      expect(jqLite(b).attr('prop')).toEqual('value');

      expect(selector.attr({'prop': 'new value'})).toEqual(selector);
      expect(jqLite(a).attr('prop')).toEqual('new value');
      expect(jqLite(b).attr('prop')).toEqual('new value');

      jqLite(b).attr({'prop': 'new value 2'});
      expect(jqLite(selector).attr('prop')).toEqual('new value');
      expect(jqLite(b).attr('prop')).toEqual('new value 2');

      selector.removeAttr('prop');
      expect(jqLite(a).attr('prop')).toBeFalsy();
      expect(jqLite(b).attr('prop')).toBeFalsy();
    });

    it('should read special attributes as boolean', function(){
      var select = jqLite('<select>');
      expect(select.attr('multiple')).toEqual(false);
      expect(jqLite('<select multiple>').attr('multiple')).toEqual(true);
      expect(jqLite('<select multiple="">').attr('multiple')).toEqual(true);
      expect(jqLite('<select multiple="x">').attr('multiple')).toEqual(true);

      select.attr('multiple', false);
      expect(select.attr('multiple')).toEqual(false);

      select.attr('multiple', true);
      expect(select.attr('multiple')).toEqual(true);
    });

    it('should return undefined for non-existing attributes', function() {
      var elm = jqLite('<div class="any">a</div>');
      expect(elm.attr('non-existing')).toBeUndefined();
    });

    it('should special-case "class" attribute', function() {
      // stupid IE9 returns null for element.getAttribute('class') when element has ng:class attr
      var elm = jqLite('<div class=" any " ng:class="dynCls">a</div>');
      expect(elm.attr('class')).toBe(' any ');

      elm.attr('class', 'foo  bar');
      expect(elm.attr('class')).toBe('foo  bar');
    });
  });


  describe('class', function(){

    describe('hasClass', function(){
      it('should check class', function(){
        var selector = jqLite([a, b]);
        expect(selector.hasClass('abc')).toEqual(false);
      });
    });


    describe('addClass', function(){
      it('should allow adding of class', function(){
        var selector = jqLite([a, b]);
        expect(selector.addClass('abc')).toEqual(selector);
        expect(jqLite(a).hasClass('abc')).toEqual(true);
        expect(jqLite(b).hasClass('abc')).toEqual(true);
      });
    });


    describe('toggleClass', function(){
      it('should allow toggling of class', function(){
        var selector = jqLite([a, b]);
        expect(selector.toggleClass('abc')).toEqual(selector);
        expect(jqLite(a).hasClass('abc')).toEqual(true);
        expect(jqLite(b).hasClass('abc')).toEqual(true);

        expect(selector.toggleClass('abc')).toEqual(selector);
        expect(jqLite(a).hasClass('abc')).toEqual(false);
        expect(jqLite(b).hasClass('abc')).toEqual(false);

        expect(selector.toggleClass('abc'), true).toEqual(selector);
        expect(jqLite(a).hasClass('abc')).toEqual(true);
        expect(jqLite(b).hasClass('abc')).toEqual(true);

        expect(selector.toggleClass('abc'), false).toEqual(selector);
        expect(jqLite(a).hasClass('abc')).toEqual(false);
        expect(jqLite(b).hasClass('abc')).toEqual(false);

      });
    });


    describe('removeClass', function(){
      it('should allow removal of class', function(){
        var selector = jqLite([a, b]);
        expect(selector.addClass('abc')).toEqual(selector);
        expect(selector.removeClass('abc')).toEqual(selector);
        expect(jqLite(a).hasClass('abc')).toEqual(false);
        expect(jqLite(b).hasClass('abc')).toEqual(false);
      });

      it('should correctly remove middle class', function() {
        var element = jqLite('<div class="foo bar baz"></div>');
        expect(element.hasClass('bar')).toBe(true);

        element.removeClass('bar');

        expect(element.hasClass('foo')).toBe(true);
        expect(element.hasClass('bar')).toBe(false);
        expect(element.hasClass('baz')).toBe(true);
      });
    });
  });


  describe('css', function(){
    it('should set and read css', function(){
      var selector = jqLite([a, b]);

      expect(selector.css('prop', 'value')).toEqual(selector);
      expect(jqLite(a).css('prop')).toEqual('value');
      expect(jqLite(b).css('prop')).toEqual('value');

      expect(selector.css({'prop': 'new value'})).toEqual(selector);
      expect(jqLite(a).css('prop')).toEqual('new value');
      expect(jqLite(b).css('prop')).toEqual('new value');

      jqLite(b).css({'prop': 'new value 2'});
      expect(jqLite(selector).css('prop')).toEqual('new value');
      expect(jqLite(b).css('prop')).toEqual('new value 2');

      selector.css('prop', null);
      expect(jqLite(a).css('prop')).toBeFalsy();
      expect(jqLite(b).css('prop')).toBeFalsy();
    });


    it('should set a bunch of css properties specified via an object', function() {
      expect(jqLite(a).css('foo')).toBeFalsy();
      expect(jqLite(a).css('bar')).toBeFalsy();
      expect(jqLite(a).css('baz')).toBeFalsy();

      jqLite(a).css({'foo': 'a', 'bar': 'b', 'baz': ''});

      expect(jqLite(a).css('foo')).toBe('a');
      expect(jqLite(a).css('bar')).toBe('b');
      expect(jqLite(a).css('baz')).toBeFalsy();
    });
  });


  describe('text', function(){
    it('should return null on empty', function(){
      expect(jqLite().length).toEqual(0);
      expect(jqLite().text()).toEqual('');
    });


    it('should read/write value', function(){
      var element = jqLite('<div>abc</div>');
      expect(element.length).toEqual(1);
      expect(element[0].innerHTML).toEqual('abc');
      expect(element.text()).toEqual('abc');
      expect(element.text('xyz') == element).toBeTruthy();
      expect(element.text()).toEqual('xyz');
    });
  });


  describe('val', function(){
    it('should read, write value', function(){
      var input = jqLite('<input type="text"/>');
      expect(input.val('abc')).toEqual(input);
      expect(input[0].value).toEqual('abc');
      expect(input.val()).toEqual('abc');
    });
  });


  describe('html', function(){
    it('should return null on empty', function(){
      expect(jqLite().length).toEqual(0);
      expect(jqLite().html()).toEqual(null);
    });


    it('should read/write value', function(){
      var element = jqLite('<div>abc</div>');
      expect(element.length).toEqual(1);
      expect(element[0].innerHTML).toEqual('abc');
      expect(element.html()).toEqual('abc');
      expect(element.html('xyz') == element).toBeTruthy();
      expect(element.html()).toEqual('xyz');
    });
  });


  describe('bind', function(){
    it('should bind to window on hashchange', function(){
      if (jqLite.fn) return; // don't run in jQuery
      var eventFn;
      var window = {
          document: {},
          location: {},
          alert: noop,
          setInterval: noop,
          length:10, // pretend you are an array
          addEventListener: function(type, fn){
            expect(type).toEqual('hashchange');
            eventFn = fn;
          },
          removeEventListener: noop,
          attachEvent: function(type, fn){
            expect(type).toEqual('onhashchange');
            eventFn = fn;
          },
          detachEvent: noop
      };
      var log;
      var jWindow = jqLite(window).bind('hashchange', function(){
        log = 'works!';
      });
      eventFn({});
      expect(log).toEqual('works!');
      dealoc(jWindow);
    });


    it('should bind to all elements and return functions', function(){
      var selected = jqLite([a, b]);
      var log = '';
      expect(selected.bind('click', function(){
        log += 'click on: ' + jqLite(this).text() + ';';
      })).toEqual(selected);
      browserTrigger(a, 'click');
      expect(log).toEqual('click on: A;');
      browserTrigger(b, 'click');
      expect(log).toEqual('click on: A;click on: B;');
    });

    it('should bind to all events separated by space', function() {
      var elm = jqLite(a),
          callback = jasmine.createSpy('callback');

      elm.bind('click keypress', callback);
      elm.bind('click', callback);

      browserTrigger(a, 'click');
      expect(callback).toHaveBeenCalled();
      expect(callback.callCount).toBe(2);

      callback.reset();
      browserTrigger(a, 'keypress');
      expect(callback).toHaveBeenCalled();
      expect(callback.callCount).toBe(1);
    });

    it('should set event.target on IE', function() {
      var elm = jqLite(a);
      elm.bind('click', function(event) {
        expect(event.target).toBe(a);
      });

      browserTrigger(a, 'click');
    });
  });


  describe('replaceWith', function(){
    it('should replaceWith', function(){
      var root = jqLite('<div>').html('before-<div></div>after');
      var div = root.find('div');
      expect(div.replaceWith('<span>span-</span><b>bold-</b>')).toEqual(div);
      expect(root.text()).toEqual('before-span-bold-after');
    });


    it('should replaceWith text', function(){
      var root = jqLite('<div>').html('before-<div></div>after');
      var div = root.find('div');
      expect(div.replaceWith('text-')).toEqual(div);
      expect(root.text()).toEqual('before-text-after');
    });
  });


  describe('children', function(){
    it('should select non-text children', function(){
      var root = jqLite('<div>').html('before-<div></div>after-<span></span>');
      var div = root.find('div');
      var span = root.find('span');
      expect(root.children()).toJqEqual([div, span]);
    });
  });


  describe('append', function(){
    it('should append', function(){
      var root = jqLite('<div>');
      expect(root.append('<span>abc</span>')).toEqual(root);
      expect(root.html().toLowerCase()).toEqual('<span>abc</span>');
    });
    it('should append text', function(){
      var root = jqLite('<div>');
      expect(root.append('text')).toEqual(root);
      expect(root.html()).toEqual('text');
    });
    it('should not append anything if parent node is not of type element', function() {
      var root = jqLite(document.createDocumentFragment());
      expect(root.append('<p>foo</p>')).toBe(root);
      expect(root.children().length).toBe(0);
    });
  });

  describe('prepend', function(){
    it('should prepend to empty', function(){
      var root = jqLite('<div>');
      expect(root.prepend('<span>abc</span>')).toEqual(root);
      expect(root.html().toLowerCase()).toEqual('<span>abc</span>');
    });
    it('should prepend to content', function(){
      var root = jqLite('<div>text</div>');
      expect(root.prepend('<span>abc</span>')).toEqual(root);
      expect(root.html().toLowerCase()).toEqual('<span>abc</span>text');
    });
    it('should prepend text to content', function(){
      var root = jqLite('<div>text</div>');
      expect(root.prepend('abc')).toEqual(root);
      expect(root.html().toLowerCase()).toEqual('abctext');
    });
  });


  describe('remove', function(){
    it('should remove', function(){
      var root = jqLite('<div><span>abc</span></div>');
      var span = root.find('span');
      expect(span.remove()).toEqual(span);
      expect(root.html()).toEqual('');
    });
  });


  describe('after', function(){
    it('should after', function(){
      var root = jqLite('<div><span></span></div>');
      var span = root.find('span');
      expect(span.after('<i></i><b></b>')).toEqual(span);
      expect(root.html().toLowerCase()).toEqual('<span></span><i></i><b></b>');
    });


    it('should allow taking text', function(){
      var root = jqLite('<div><span></span></div>');
      var span = root.find('span');
      span.after('abc');
      expect(root.html().toLowerCase()).toEqual('<span></span>abc');
    });
  });


  describe('parent', function(){
    it('should return parent or an empty set when no parent', function(){
      var parent = jqLite('<div><p>abc</p></div>'),
          child = parent.find('p');

      expect(parent.parent()).toBeTruthy();
      expect(parent.parent().length).toEqual(0);

      expect(child.parent().length).toBe(1);
      expect(child.parent()[0]).toBe(parent[0]);
    });


    it('should return empty set when no parent', function() {
      var element = jqLite('<div>abc</div>');
      expect(element.parent()).toBeTruthy();
      expect(element.parent().length).toEqual(0);
    });


    it('should return empty jqLite object when parent is a document fragment', function() {
      //this is quite unfortunate but jQuery 1.5.1 behaves this way
      var fragment = document.createDocumentFragment(),
          child = jqLite('<p>foo</p>');

      fragment.appendChild(child[0]);
      expect(child[0].parentNode).toBe(fragment);
      expect(child.parent().length).toBe(0);
    });
  });


  describe('next', function() {
    it('should return next sibling', function(){
      var element = jqLite('<div><b>b</b><i>i</i></div>');
      var b = element.find('b');
      var i = element.find('i');
      expect(b.next()).toJqEqual([i]);
    });
  });


  describe('find', function() {
    it('should find child by name', function(){
      var root = jqLite('<div><div>text</div></div>');
      var innerDiv = root.find('div');
      expect(innerDiv.length).toEqual(1);
      expect(innerDiv.html()).toEqual('text');
    });
  });


  describe('eq', function() {
    it('should select the nth element ', function() {
      var element = jqLite('<div><span>aa</span></div><div><span>bb</span></div>');
      expect(element.find('span').eq(0).html()).toBe('aa');
      expect(element.find('span').eq(-1).html()).toBe('bb');
      expect(element.find('span').eq(20).length).toBe(0);
    });
  });
});
