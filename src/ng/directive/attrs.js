'use strict';

/**
 * @ngdoc directive
 * @name ngHref
 * @restrict A
 * @priority 99
 *
 * @description
 * Using Angular markup like `{{hash}}` in an href attribute will
 * make the link go to the wrong URL if the user clicks it before
 * Angular has a chance to replace the `{{hash}}` markup with its
 * value. Until Angular replaces the markup the link will be broken
 * and will most likely return a 404 error. The `ngHref` directive
 * solves this problem.
 *
 * The wrong way to write it:
 * ```html
 * <a href="http://www.gravatar.com/avatar/{{hash}}">link1</a>
 * ```
 *
 * The correct way to write it:
 * ```html
 * <a ng-href="http://www.gravatar.com/avatar/{{hash}}">link1</a>
 * ```
 *
 * @element A
 * @param {template} ngHref any string which can contain `{{}}` markup.
 *
 * @example
 * This example shows various combinations of `href`, `ng-href` and `ng-click` attributes
 * in links and their different behaviors:
    <example>
      <file name="index.html">
        <input ng-model="value" /><br />
        <a id="link-1" href ng-click="value = 1">link 1</a> (link, don't reload)<br />
        <a id="link-2" href="" ng-click="value = 2">link 2</a> (link, don't reload)<br />
        <a id="link-3" ng-href="/{{'123'}}">link 3</a> (link, reload!)<br />
        <a id="link-4" href="" name="xx" ng-click="value = 4">anchor</a> (link, don't reload)<br />
        <a id="link-5" name="xxx" ng-click="value = 5">anchor</a> (no link)<br />
        <a id="link-6" ng-href="{{value}}">link</a> (link, change location)
      </file>
      <file name="protractor.js" type="protractor">
        it('should execute ng-click but not reload when href without value', function() {
          element(by.id('link-1')).click();
          expect(element(by.model('value')).getAttribute('value')).toEqual('1');
          expect(element(by.id('link-1')).getAttribute('href')).toBe('');
        });

        it('should execute ng-click but not reload when href empty string', function() {
          element(by.id('link-2')).click();
          expect(element(by.model('value')).getAttribute('value')).toEqual('2');
          expect(element(by.id('link-2')).getAttribute('href')).toBe('');
        });

        it('should execute ng-click and change url when ng-href specified', function() {
          expect(element(by.id('link-3')).getAttribute('href')).toMatch(/\/123$/);

          element(by.id('link-3')).click();

          // At this point, we navigate away from an Angular page, so we need
          // to use browser.driver to get the base webdriver.

          browser.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
              return url.match(/\/123$/);
            });
          }, 5000, 'page should navigate to /123');
        });

        it('should execute ng-click but not reload when href empty string and name specified', function() {
          element(by.id('link-4')).click();
          expect(element(by.model('value')).getAttribute('value')).toEqual('4');
          expect(element(by.id('link-4')).getAttribute('href')).toBe('');
        });

        it('should execute ng-click but not reload when no href but name specified', function() {
          element(by.id('link-5')).click();
          expect(element(by.model('value')).getAttribute('value')).toEqual('5');
          expect(element(by.id('link-5')).getAttribute('href')).toBe(null);
        });

        it('should only change url when only ng-href', function() {
          element(by.model('value')).clear();
          element(by.model('value')).sendKeys('6');
          expect(element(by.id('link-6')).getAttribute('href')).toMatch(/\/6$/);

          element(by.id('link-6')).click();

          // At this point, we navigate away from an Angular page, so we need
          // to use browser.driver to get the base webdriver.
          browser.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
              return url.match(/\/6$/);
            });
          }, 5000, 'page should navigate to /6');
        });
      </file>
    </example>
 */

/**
 * @ngdoc directive
 * @name ngSrc
 * @restrict A
 * @priority 99
 *
 * @description
 * Using Angular markup like `{{hash}}` in a `src` attribute doesn't
 * work right: The browser will fetch from the URL with the literal
 * text `{{hash}}` until Angular replaces the expression inside
 * `{{hash}}`. The `ngSrc` directive solves this problem.
 *
 * The buggy way to write it:
 * ```html
 * <img src="http://www.gravatar.com/avatar/{{hash}}"/>
 * ```
 *
 * The correct way to write it:
 * ```html
 * <img ng-src="http://www.gravatar.com/avatar/{{hash}}"/>
 * ```
 *
 * @element IMG
 * @param {template} ngSrc any string which can contain `{{}}` markup.
 */

/**
 * @ngdoc directive
 * @name ngSrcset
 * @restrict A
 * @priority 99
 *
 * @description
 * Using Angular markup like `{{hash}}` in a `srcset` attribute doesn't
 * work right: The browser will fetch from the URL with the literal
 * text `{{hash}}` until Angular replaces the expression inside
 * `{{hash}}`. The `ngSrcset` directive solves this problem.
 *
 * The buggy way to write it:
 * ```html
 * <img srcset="http://www.gravatar.com/avatar/{{hash}} 2x"/>
 * ```
 *
 * The correct way to write it:
 * ```html
 * <img ng-srcset="http://www.gravatar.com/avatar/{{hash}} 2x"/>
 * ```
 *
 * @element IMG
 * @param {template} ngSrcset any string which can contain `{{}}` markup.
 */

/**
 * @ngdoc directive
 * @name ngDisabled
 * @restrict A
 * @priority 100
 *
 * @description
 *
 * This directive sets the `disabled` attribute on the element if the
 * {@link guide/expression expression} inside `ngDisabled` evaluates to truthy.
 *
 * A special directive is necessary because we cannot use interpolation inside the `disabled`
 * attribute.  The following example would make the button enabled on Chrome/Firefox
 * but not on older IEs:
 *
 * ```html
 * <!-- See below for an example of ng-disabled being used correctly -->
 * <div ng-init="isDisabled = false">
 *  <button disabled="{{isDisabled}}">Disabled</button>
 * </div>
 * ```
 *
 * This is because the HTML specification does not require browsers to preserve the values of
 * boolean attributes such as `disabled` (Their presence means true and their absence means false.)
 * If we put an Angular interpolation expression into such an attribute then the
 * binding information would be lost when the browser removes the attribute.
 *
 * @example
    <example>
      <file name="index.html">
        Click me to toggle: <input type="checkbox" ng-model="checked"><br/>
        <button ng-model="button" ng-disabled="checked">Button</button>
      </file>
      <file name="protractor.js" type="protractor">
        it('should toggle button', function() {
          expect(element(by.css('button')).getAttribute('disabled')).toBeFalsy();
          element(by.model('checked')).click();
          expect(element(by.css('button')).getAttribute('disabled')).toBeTruthy();
        });
      </file>
    </example>
 *
 * @element INPUT
 * @param {expression} ngDisabled If the {@link guide/expression expression} is truthy,
 *     then the `disabled` attribute will be set on the element
 */


/**
 * @ngdoc directive
 * @name ngChecked
 * @restrict A
 * @priority 100
 *
 * @description
 * The HTML specification does not require browsers to preserve the values of boolean attributes
 * such as checked. (Their presence means true and their absence means false.)
 * If we put an Angular interpolation expression into such an attribute then the
 * binding information would be lost when the browser removes the attribute.
 * The `ngChecked` directive solves this problem for the `checked` attribute.
 * This complementary directive is not removed by the browser and so provides
 * a permanent reliable place to store the binding information.
 * @example
    <example>
      <file name="index.html">
        Check me to check both: <input type="checkbox" ng-model="master"><br/>
        <input id="checkSlave" type="checkbox" ng-checked="master">
      </file>
      <file name="protractor.js" type="protractor">
        it('should check both checkBoxes', function() {
          expect(element(by.id('checkSlave')).getAttribute('checked')).toBeFalsy();
          element(by.model('master')).click();
          expect(element(by.id('checkSlave')).getAttribute('checked')).toBeTruthy();
        });
      </file>
    </example>
 *
 * @element INPUT
 * @param {expression} ngChecked If the {@link guide/expression expression} is truthy,
 *     then special attribute "checked" will be set on the element
 */


/**
 * @ngdoc directive
 * @name ngReadonly
 * @restrict A
 * @priority 100
 *
 * @description
 * The HTML specification does not require browsers to preserve the values of boolean attributes
 * such as readonly. (Their presence means true and their absence means false.)
 * If we put an Angular interpolation expression into such an attribute then the
 * binding information would be lost when the browser removes the attribute.
 * The `ngReadonly` directive solves this problem for the `readonly` attribute.
 * This complementary directive is not removed by the browser and so provides
 * a permanent reliable place to store the binding information.
 * @example
    <example>
      <file name="index.html">
        Check me to make text readonly: <input type="checkbox" ng-model="checked"><br/>
        <input type="text" ng-readonly="checked" value="I'm Angular"/>
      </file>
      <file name="protractor.js" type="protractor">
        it('should toggle readonly attr', function() {
          expect(element(by.css('[type="text"]')).getAttribute('readonly')).toBeFalsy();
          element(by.model('checked')).click();
          expect(element(by.css('[type="text"]')).getAttribute('readonly')).toBeTruthy();
        });
      </file>
    </example>
 *
 * @element INPUT
 * @param {expression} ngReadonly If the {@link guide/expression expression} is truthy,
 *     then special attribute "readonly" will be set on the element
 */


/**
 * @ngdoc directive
 * @name ngSelected
 * @restrict A
 * @priority 100
 *
 * @description
 * The HTML specification does not require browsers to preserve the values of boolean attributes
 * such as selected. (Their presence means true and their absence means false.)
 * If we put an Angular interpolation expression into such an attribute then the
 * binding information would be lost when the browser removes the attribute.
 * The `ngSelected` directive solves this problem for the `selected` attribute.
 * This complementary directive is not removed by the browser and so provides
 * a permanent reliable place to store the binding information.
 *
 * @example
    <example>
      <file name="index.html">
        Check me to select: <input type="checkbox" ng-model="selected"><br/>
        <select>
          <option>Hello!</option>
          <option id="greet" ng-selected="selected">Greetings!</option>
        </select>
      </file>
      <file name="protractor.js" type="protractor">
        it('should select Greetings!', function() {
          expect(element(by.id('greet')).getAttribute('selected')).toBeFalsy();
          element(by.model('selected')).click();
          expect(element(by.id('greet')).getAttribute('selected')).toBeTruthy();
        });
      </file>
    </example>
 *
 * @element OPTION
 * @param {expression} ngSelected If the {@link guide/expression expression} is truthy,
 *     then special attribute "selected" will be set on the element
 */

/**
 * @ngdoc directive
 * @name ngOpen
 * @restrict A
 * @priority 100
 *
 * @description
 * The HTML specification does not require browsers to preserve the values of boolean attributes
 * such as open. (Their presence means true and their absence means false.)
 * If we put an Angular interpolation expression into such an attribute then the
 * binding information would be lost when the browser removes the attribute.
 * The `ngOpen` directive solves this problem for the `open` attribute.
 * This complementary directive is not removed by the browser and so provides
 * a permanent reliable place to store the binding information.
 * @example
     <example>
       <file name="index.html">
         Check me check multiple: <input type="checkbox" ng-model="open"><br/>
         <details id="details" ng-open="open">
            <summary>Show/Hide me</summary>
         </details>
       </file>
       <file name="protractor.js" type="protractor">
         it('should toggle open', function() {
           expect(element(by.id('details')).getAttribute('open')).toBeFalsy();
           element(by.model('open')).click();
           expect(element(by.id('details')).getAttribute('open')).toBeTruthy();
         });
       </file>
     </example>
 *
 * @element DETAILS
 * @param {expression} ngOpen If the {@link guide/expression expression} is truthy,
 *     then special attribute "open" will be set on the element
 */

var ngAttributeAliasDirectives = {};

// boolean attrs are evaluated
forEach(BOOLEAN_ATTR, function(propName, attrName) {
  // binding to multiple is not supported
  if (propName == "multiple") return;

  function defaultLinkFn(scope, element, attr) {
    scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {
      attr.$set(attrName, !!value);
    });
  }

  var normalized = directiveNormalize('ng-' + attrName);
  var linkFn = defaultLinkFn;

  if (propName === 'checked') {
    linkFn = function(scope, element, attr) {
      // ensuring ngChecked doesn't interfere with ngModel when both are set on the same input
      if (attr.ngModel !== attr[normalized]) {
        defaultLinkFn(scope, element, attr);
      }
    };
  }

  ngAttributeAliasDirectives[normalized] = function() {
    return {
      restrict: 'A',
      priority: 100,
      link: linkFn
    };
  };
});

// aliased input attrs are evaluated
forEach(ALIASED_ATTR, function(htmlAttr, ngAttr) {
  ngAttributeAliasDirectives[ngAttr] = function() {
    return {
      priority: 100,
      link: function(scope, element, attr) {
        //special case ngPattern when a literal regular expression value
        //is used as the expression (this way we don't have to watch anything).
        if (ngAttr === "ngPattern" && attr.ngPattern.charAt(0) == "/") {
          var match = attr.ngPattern.match(REGEX_STRING_REGEXP);
          if (match) {
            attr.$set("ngPattern", new RegExp(match[1], match[2]));
            return;
          }
        }

        scope.$watch(attr[ngAttr], function ngAttrAliasWatchAction(value) {
          attr.$set(ngAttr, value);
        });
      }
    };
  };
});

// ng-src, ng-srcset, ng-href are interpolated
forEach(['src', 'srcset', 'href'], function(attrName) {
  var normalized = directiveNormalize('ng-' + attrName);
  ngAttributeAliasDirectives[normalized] = function() {
    return {
      priority: 99, // it needs to run after the attributes are interpolated
      link: function(scope, element, attr) {
        var propName = attrName,
            name = attrName;

        if (attrName === 'href' &&
            toString.call(element.prop('href')) === '[object SVGAnimatedString]') {
          name = 'xlinkHref';
          attr.$attr[name] = 'xlink:href';
          propName = null;
        }

        attr.$observe(normalized, function(value) {
          if (!value) {
            if (attrName === 'href') {
              attr.$set(name, null);
            }
            return;
          }

          attr.$set(name, value);

          // on IE, if "ng:src" directive declaration is used and "src" attribute doesn't exist
          // then calling element.setAttribute('src', 'foo') doesn't do anything, so we need
          // to set the property as well to achieve the desired effect.
          // we use attr[attrName] value since $set can sanitize the url.
          if (msie && propName) element.prop(propName, attr[name]);
        });
      }
    };
  };
});
