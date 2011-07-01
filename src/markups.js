/**
 * @workInProgress
 * @ngdoc overview
 * @name angular.markup
 * @description
 *
 * Angular markup transforms content of DOM elements or portions of this content into other text or
 * DOM elements for further compilation.
 *
 * Markup extensions do not themselves produce linking functions. Think of markup as a way to
 * produce shorthand for a {@link angular.widget widget} or a {@link angular.directive directive}.
 *
 * The most prominent example of an markup in angular is the built-in double curly markup
 * `{{expression}}`, which is a shorthand for `<span ng:bind="expression"></span>`.
 *
 * Create custom markup like this:
 *
 * <pre>
 *   angular.markup('newMarkup', function(text, textNode, parentElement){
 *     //tranformation code
 *   });
 * </pre>
 *
 * For more information about angular markup, see {@link guide/dev_guide.compiler.markup
 * Understanding Angular Markup} in the angular Developer Guide.
 */

/**
 * @workInProgress
 * @ngdoc overview
 * @name angular.attrMarkup
 * @description
 *
 * Attribute markup extends the angular compiler in a very similar way as {@link angular.markup}
 * except that it allows you to modify the state of the attribute text rather then the content of a
 * node.
 *
 * Create custom attribute markup like this:
 *
 * <pre>
 *   angular.attrMarkup('newAttrMarkup', function(attrValue, attrName, element){
 *     //tranformation code
 *   });
 * </pre>
 *
 * For more information about angular attribute markup, see {@link guide/dev_guide.compiler.markup
 * Understanding Angular Markup} in the angular Developer Guide.
 */

function parseBindings(string) {
  var results = [];
  var lastIndex = 0;
  var index;
  while((index = string.indexOf('{{', lastIndex)) > -1) {
    if (lastIndex < index)
      results.push(string.substr(lastIndex, index - lastIndex));
    lastIndex = index;

    index = string.indexOf('}}', index);
    index = index < 0 ? string.length : index + 2;

    results.push(string.substr(lastIndex, index - lastIndex));
    lastIndex = index;
  }
  if (lastIndex != string.length)
    results.push(string.substr(lastIndex, string.length - lastIndex));
  return results.length === 0 ? [ string ] : results;
}

function binding(string) {
  var binding = string.replace(/\n/gm, ' ').match(/^\{\{(.*)\}\}$/);
  return binding ? binding[1] : null;
}

function hasBindings(bindings) {
  return bindings.length > 1 || binding(bindings[0]) !== null;
}

angularTextMarkup('{{}}', function(text, textNode, parentElement) {
  var bindings = parseBindings(text),
      self = this;
  if (hasBindings(bindings)) {
    if (isLeafNode(parentElement[0])) {
      parentElement.attr('ng:bind-template', text);
    } else {
      var cursor = textNode, newElement;
      forEach(parseBindings(text), function(text){
        var exp = binding(text);
        if (exp) {
          newElement = jqLite('<span>');
          newElement.attr('ng:bind', exp);
        } else {
          newElement = jqLite(document.createTextNode(text));
        }
        if (msie && text.charAt(0) == ' ') {
          newElement = jqLite('<span>&nbsp;</span>');
          var nbsp = newElement.html();
          newElement.text(text.substr(1));
          newElement.html(nbsp + newElement.html());
        }
        cursor.after(newElement);
        cursor = newElement;
      });
      textNode.remove();
    }
  }
});

/**
 * This tries to normalize the behavior of value attribute across browsers. If value attribute is
 * not specified, then specify it to be that of the text.
 */
angularTextMarkup('option', function(text, textNode, parentElement){
  if (lowercase(nodeName_(parentElement)) == 'option') {
    if (msie <= 7) {
      // In IE7 The issue is that there is no way to see if the value was specified hence
      // we have to resort to parsing HTML;
      htmlParser(parentElement[0].outerHTML, {
        start: function(tag, attrs) {
          if (isUndefined(attrs.value)) {
            parentElement.attr('value', text);
          }
        }
      });
    } else if (parentElement[0].getAttribute('value') == null) {
      // jQuery does normalization on 'value' so we have to bypass it.
      parentElement.attr('value', text);
    }
  }
});

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:href
 *
 * @description
 * Using <angular/> markup like {{hash}} in an href attribute makes
 * the page open to a wrong URL, ff the user clicks that link before
 * angular has a chance to replace the {{hash}} with actual URL, the
 * link will be broken and will most likely return a 404 error.
 * The `ng:href` solves this problem by placing the `href` in the
 * `ng:` namespace.
 *
 * The buggy way to write it:
 * <pre>
 * <a href="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * The correct way to write it:
 * <pre>
 * <a ng:href="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * @element ANY
 * @param {template} template any string which can contain `{{}}` markup.
 *
 * @example
 * This example uses `link` variable inside `href` attribute:
    <doc:example>
      <doc:source>
        <input name="value" /><br />
        <a id="link-1" href ng:click="value = 1">link 1</a> (link, don't reload)<br />
        <a id="link-2" href="" ng:click="value = 2">link 2</a> (link, don't reload)<br />
        <a id="link-3" ng:href="#{{'123'}}" ng:click="value = 3">link 3</a> (link, reload!)<br />
        <a id="link-4" href="" name="xx" ng:click="value = 4">anchor</a> (link, don't reload)<br />
        <a id="link-5" name="xxx" ng:click="value = 5">anchor</a> (no link)<br />
        <a id="link-6" ng:href="#/{{value}}">link</a> (link, change hash)
      </doc:source>
      <doc:scenario>
        it('should execute ng:click but not reload when href without value', function() {
          element('#link-1').click();
          expect(input('value').val()).toEqual('1');
          expect(element('#link-1').attr('href')).toBe("");
        });

        it('should execute ng:click but not reload when href empty string', function() {
          element('#link-2').click();
          expect(input('value').val()).toEqual('2');
          expect(element('#link-2').attr('href')).toBe("");
        });

        it('should execute ng:click and change url when ng:href specified', function() {
          element('#link-3').click();
          expect(input('value').val()).toEqual('3');
          expect(element('#link-3').attr('href')).toBe("#123");
          expect(browser().location().hash()).toEqual('123');
        });

        it('should execute ng:click but not reload when href empty string and name specified', function() {
          element('#link-4').click();
          expect(input('value').val()).toEqual('4');
          expect(element('#link-4').attr('href')).toBe("");
        });

        it('should execute ng:click but not reload when no href but name specified', function() {
          element('#link-5').click();
          expect(input('value').val()).toEqual('5');
          expect(element('#link-5').attr('href')).toBe(undefined);
        });

        it('should only change url when only ng:href', function() {
          input('value').enter('6');
          element('#link-6').click();
          expect(browser().location().hash()).toEqual('/6');
          expect(element('#link-6').attr('href')).toBe("#/6");
        });
      </doc:scenario>
    </doc:example>
 */

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:src
 *
 * @description
 * Using <angular/> markup like `{{hash}}` in a `src` attribute doesn't
 * work right: The browser will fetch from the URL with the literal
 * text `{{hash}}` until <angular/> replaces the expression inside
 * `{{hash}}`. The `ng:src` attribute solves this problem by placing
 *  the `src` attribute in the `ng:` namespace.
 *
 * The buggy way to write it:
 * <pre>
 * <img src="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * The correct way to write it:
 * <pre>
 * <img ng:src="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * @element ANY
 * @param {template} template any string which can contain `{{}}` markup.
 */

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:disabled
 *
 * @description
 *
 * The following markup will make the button enabled on Chrome/Firefox but not on IE8 and older IEs:
 * <pre>
 * <div ng:init="scope = { isDisabled: false }">
 *  <button disabled="{{scope.isDisabled}}">Disabled</button>
 * </div>
 * </pre>
 *
 * the HTML specs do not require browsers preserve the special attributes such as disabled.(The presense of them means true and absense means false)
 * This prevents the angular compiler from correctly retrieving the binding expression.
 * To solve this problem, we introduce ng:disabled.
 *
 * @example
    <doc:example>
      <doc:source>
        Click me to toggle: <input type="checkbox" name="checked"><br/>
        <button name="button" ng:disabled="{{checked}}">Button</button>
      </doc:source>
      <doc:scenario>
        it('should toggle button', function() {
          expect(element('.doc-example-live :button').attr('disabled')).toBeFalsy();
          input('checked').check();
          expect(element('.doc-example-live :button').attr('disabled')).toBeTruthy();
        });
      </doc:scenario>
    </doc:example>
 *
 * @element ANY
 * @param {template} template any string which can contain '{{}}' markup.
 */


/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:checked
 *
 * @description
 * the HTML specs do not require browsers preserve the special attributes such as checked.(The presense of them means true and absense means false)
 * This prevents the angular compiler from correctly retrieving the binding expression.
 * To solve this problem, we introduce ng:checked.
 * @example
    <doc:example>
      <doc:source>
        Check me to check both: <input type="checkbox" name="master"><br/>
        <input id="checkSlave" type="checkbox" ng:checked="{{master}}">
      </doc:source>
      <doc:scenario>
        it('should check both checkBoxes', function() {
          expect(element('.doc-example-live #checkSlave').attr('checked')).toBeFalsy();
          input('master').check();
          expect(element('.doc-example-live #checkSlave').attr('checked')).toBeTruthy();
        });
      </doc:scenario>
    </doc:example>
 *
 * @element ANY
 * @param {template} template any string which can contain '{{}}' markup.
 */


/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:multiple
 *
 * @description
 * the HTML specs do not require browsers preserve the special attributes such as multiple.(The presense of them means true and absense means false)
 * This prevents the angular compiler from correctly retrieving the binding expression.
 * To solve this problem, we introduce ng:multiple.
 *
 * @example
     <doc:example>
       <doc:source>
         Check me check multiple: <input type="checkbox" name="checked"><br/>
         <select id="select" ng:multiple="{{checked}}">
           <option>Misko</option>
           <option>Igor</option>
           <option>Vojta</option>
           <option>Di</option>
         </select>
       </doc:source>
       <doc:scenario>
         it('should toggle multiple', function() {
           expect(element('.doc-example-live #select').attr('multiple')).toBeFalsy();
           input('checked').check();
           expect(element('.doc-example-live #select').attr('multiple')).toBeTruthy();
         });
       </doc:scenario>
     </doc:example>
 *
 * @element ANY
 * @param {template} template any string which can contain '{{}}' markup.
 */


/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:readonly
 *
 * @description
 * the HTML specs do not require browsers preserve the special attributes such as readonly.(The presense of them means true and absense means false)
 * This prevents the angular compiler from correctly retrieving the binding expression.
 * To solve this problem, we introduce ng:readonly.
 * @example
    <doc:example>
      <doc:source>
        Check me to make text readonly: <input type="checkbox" name="checked"><br/>
        <input type="text" ng:readonly="{{checked}}" value="I'm Angular"/>
      </doc:source>
      <doc:scenario>
        it('should toggle readonly attr', function() {
          expect(element('.doc-example-live :text').attr('readonly')).toBeFalsy();
          input('checked').check();
          expect(element('.doc-example-live :text').attr('readonly')).toBeTruthy();
        });
      </doc:scenario>
    </doc:example>
 *
 * @element ANY
 * @param {template} template any string which can contain '{{}}' markup.
 */


/**
* @workInProgress
* @ngdoc directive
* @name angular.directive.ng:selected
*
* @description
* the HTML specs do not require browsers preserve the special attributes such as selected.(The presense of them means true and absense means false)
* This prevents the angular compiler from correctly retrieving the binding expression.
* To solve this problem, we introduce ng:selected.
* @example
   <doc:example>
     <doc:source>
       Check me to select: <input type="checkbox" name="checked"><br/>
       <select>
         <option>Hello!</option>
         <option id="greet" ng:selected="{{checked}}">Greetings!</option>
       </select>
     </doc:source>
     <doc:scenario>
       it('should select Greetings!', function() {
         expect(element('.doc-example-live #greet').attr('selected')).toBeFalsy();
         input('checked').check();
         expect(element('.doc-example-live #greet').attr('selected')).toBeTruthy();
       });
     </doc:scenario>
   </doc:example>
* @element ANY
* @param {template} template any string which can contain '{{}}' markup.
*/


var NG_BIND_ATTR = 'ng:bind-attr';
var SPECIAL_ATTRS = {};

forEach('src,href,checked,disabled,multiple,readonly,selected'.split(','), function(name) {
  SPECIAL_ATTRS['ng:' + name] = name;
});

angularAttrMarkup('{{}}', function(value, name, element){
  // don't process existing attribute markup
  if (angularDirective(name) || angularDirective("@" + name)) return;
  if (msie && name == 'src')
    value = decodeURI(value);
  var bindings = parseBindings(value),
      bindAttr;
  if (hasBindings(bindings)) {
    element.removeAttr(name);
    bindAttr = fromJson(element.attr(NG_BIND_ATTR) || "{}");
    bindAttr[SPECIAL_ATTRS[name] || name] = value;
    element.attr(NG_BIND_ATTR, toJson(bindAttr));
  }
});
