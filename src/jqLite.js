'use strict';

//////////////////////////////////
//JQLite
//////////////////////////////////

/**
 * @ngdoc function
 * @name angular.element
 * @function
 *
 * @description
 * Wraps a raw DOM element or HTML string as a [jQuery](http://jquery.com) element.
 * `angular.element` can be either an alias for [jQuery](http://api.jquery.com/jQuery/) function, if
 * jQuery is available, or a function that wraps the element or string in Angular's jQuery lite
 * implementation (commonly referred to as jqLite).
 *
 * Real jQuery always takes precedence over jqLite, provided it was loaded before `DOMContentLoaded`
 * event fired.
 *
 * jqLite is a tiny, API-compatible subset of jQuery that allows
 * Angular to manipulate the DOM. jqLite implements only the most commonly needed functionality
 * within a very small footprint, so only a subset of the jQuery API - methods, arguments and
 * invocation styles - are supported.
 *
 * Note: All element references in Angular are always wrapped with jQuery or jqLite; they are never
 * raw DOM references.
 *
 * ## Angular's jQuery lite provides the following methods:
 *
 * - [addClass()](http://api.jquery.com/addClass/)
 * - [after()](http://api.jquery.com/after/)
 * - [append()](http://api.jquery.com/append/)
 * - [attr()](http://api.jquery.com/attr/)
 * - [bind()](http://api.jquery.com/bind/)
 * - [children()](http://api.jquery.com/children/)
 * - [clone()](http://api.jquery.com/clone/)
 * - [contents()](http://api.jquery.com/contents/)
 * - [css()](http://api.jquery.com/css/)
 * - [data()](http://api.jquery.com/data/)
 * - [eq()](http://api.jquery.com/eq/)
 * - [find()](http://api.jquery.com/find/) - Limited to lookups by tag name.
 * - [hasClass()](http://api.jquery.com/hasClass/)
 * - [html()](http://api.jquery.com/html/)
 * - [next()](http://api.jquery.com/next/)
 * - [parent()](http://api.jquery.com/parent/)
 * - [prepend()](http://api.jquery.com/prepend/)
 * - [prop()](http://api.jquery.com/prop/)
 * - [ready()](http://api.jquery.com/ready/)
 * - [remove()](http://api.jquery.com/remove/)
 * - [removeAttr()](http://api.jquery.com/removeAttr/)
 * - [removeClass()](http://api.jquery.com/removeClass/)
 * - [removeData()](http://api.jquery.com/removeData/)
 * - [replaceWith()](http://api.jquery.com/replaceWith/)
 * - [text()](http://api.jquery.com/text/)
 * - [toggleClass()](http://api.jquery.com/toggleClass/)
 * - [triggerHandler()](http://api.jquery.com/triggerHandler/) - Doesn't pass native event objects to handlers.
 * - [unbind()](http://api.jquery.com/unbind/)
 * - [val()](http://api.jquery.com/val/)
 * - [wrap()](http://api.jquery.com/wrap/)
 *
 * ## In addition to the above, Angular provides additional methods to both jQuery and jQuery lite:
 *
 * - `controller(name)` - retrieves the controller of the current element or its parent. By default
 *   retrieves controller associated with the `ngController` directive. If `name` is provided as
 *   camelCase directive name, then the controller for this directive will be retrieved (e.g.
 *   `'ngModel'`).
 * - `injector()` - retrieves the injector of the current element or its parent.
 * - `scope()` - retrieves the {@link api/ng.$rootScope.Scope scope} of the current
 *   element or its parent.
 * - `inheritedData()` - same as `data()`, but walks up the DOM until a value is found or the top
 *   parent element is reached.
 *
 * @param {string|Element} element HTML string or Element to be wrapped into jQuery.
 * @returns {Object} jQuery object.
 */


/////////////////////////////////////////////

/**
 * @constructor
 */
function JQLite(element) {
  if (element instanceof JQLite) {
    return element;
  }
  if (!(this instanceof JQLite)) {
    if (isString(element) && element.charAt(0) != '<') {
      throw Error('selectors not implemented');
    }
    return new JQLite(element);
  }

  if (isString(element)) {
    var div = document.createElement('div');
    // Read about the NoScope elements here:
    // http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx
    div.innerHTML = '<div>&#160;</div>' + element; // IE insanity to make NoScope elements work!
    div.removeChild(div.firstChild); // remove the superfluous div
    JQLiteAddNodes(this, div.childNodes);
    this.remove(); // detach the elements from the temporary DOM div.
  } else {
    JQLiteAddNodes(this, element);
  }
}

/////////////////////////////////////////////

var jqCache = JQLite.cache = {};
var jqName = JQLite.expando = 'ng-' + new Date().getTime();
var jqId = 1;
var addEventListenerFn = (window.document.addEventListener
      ? function(element, type, fn) {element.addEventListener(type, fn, false);}
      : function(element, type, fn) {element.attachEvent('on' + type, fn);});
var removeEventListenerFn = (window.document.removeEventListener
      ? function(element, type, fn) {element.removeEventListener(type, fn, false); }
      : function(element, type, fn) {element.detachEvent('on' + type, fn); });

function jqNextId() { return ++jqId; }


var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;

/**
 * Converts snake_case to camelCase.
 * Also there is special case for Moz prefix starting with upper case letter.
 * @param name Name to normalize
 */
function camelCase(name) {
  return name.
    replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).
    replace(MOZ_HACK_REGEXP, 'Moz$1');
}

/////////////////////////////////////////////
// jQuery mutation patch
//
//  In conjunction with bindJQuery intercepts all jQuery's DOM destruction apis and fires a
// $destroy event on all DOM nodes being removed.
//
/////////////////////////////////////////////

/**
 * @param {!string} name
 * @param {!boolean=} fireEventOnMainElement if the $destroy event should be fired on the
 *    current element of the method call.
 */
function JQLitePatchJQueryRemove(name, fireEventOnMainElement) {
  var originalJqFn = jQuery.fn[name];
  originalJqFn = originalJqFn.$original || originalJqFn;
  removePatch.$original = originalJqFn;
  jQuery.fn[name] = removePatch;

  function removePatch() {
    var list = [this],
        fireEvent = fireEventOnMainElement,
        set, setIndex, setLength,
        element, childIndex, childLength, children,
        fns, events;

    while(list.length) {
      set = list.shift();
      for(setIndex = 0, setLength = set.length; setIndex < setLength; setIndex++) {
        element = jqLite(set[setIndex]);
        if (fireEvent) {
          element.triggerHandler('$destroy');
        } else {
          fireEvent = !fireEvent; // skip the main element and then fire on children
        }
        for(childIndex = 0, childLength = (children = element.children()).length;
            childIndex < childLength;
            childIndex++) {
          list.push(jQuery(children[childIndex]));
        }
      }
    }
    return originalJqFn.apply(this, arguments);
  }
}


/**
 * @param {!Node} node
 * @return {!Node}
 */
function JQLiteClone(node) {
  return /** @type {!Node} */(node.cloneNode(true));
}


/**
 * @param {!Node} node
 */
function JQLiteDealoc(node){
  JQLiteRemoveData(node);
  for ( var i = 0, children = node.childNodes || []; i < children.length; i++) {
    JQLiteDealoc(children[i]);
  }
}


/**
 * @param {!Node} node
 * @param {!string} type
 * @param {!Function} fn
 */
function JQLiteBind(node, type, fn){
  var events = JQLiteExpandoStore(node, 'events'),
      handle = JQLiteExpandoStore(node, 'handle');

  if (!events) JQLiteExpandoStore(node, 'events', events = {});
  if (!handle) JQLiteExpandoStore(node, 'handle', handle = createEventHandler(node, events));

  forEach(type.split(' '), function(type){
    var eventFns = events[type];

    if (!eventFns) {
      if (type == 'mouseenter' || type == 'mouseleave') {
        var counter = 0;

        events.mouseenter = [];
        events.mouseleave = [];

        JQLiteBind(node, 'mouseover', function(event) {
          counter++;
          if (counter == 1) {
            handle(event, 'mouseenter');
          }
        });
        JQLiteBind(node, 'mouseout', function(event) {
          counter --;
          if (counter == 0) {
            handle(event, 'mouseleave');
          }
        });
      } else {
        addEventListenerFn(node, type, handle);
        events[type] = [];
      }
      eventFns = events[type]
    }
    eventFns.push(fn);
  });
}


/**
 * @param {!Node} node
 * @param {!string=} type
 * @param {!Function=} fn
 */
function JQLiteUnbind(node, type, fn) {
  var events = JQLiteExpandoStore(node, 'events'),
      handle = JQLiteExpandoStore(node, 'handle');

  if (!handle) return; //no listeners registered

  if (isUndefined(type)) {
    forEach(events, function(eventHandler, type) {
      removeEventListenerFn(node, type, eventHandler);
      delete events[type];
    });
  } else {
    if (isUndefined(fn)) {
      removeEventListenerFn(node, type, events[type]);
      delete events[type];
    } else {
      arrayRemove(events[type], fn);
    }
  }
}


/**
 * @param {!Element} element
 * @param {!string} eventName
 */
function JQLiteTriggerHandler(element, eventName) {
  var eventFns = (JQLiteExpandoStore(element, 'events') || {})[eventName];

  forEach(eventFns, function(fn) {
    fn.call(element, null);
  });
}


/**
 * @param {!Node} origNode
 * @param {!Node} replaceNode
 */
function JQLiteReplaceWith(origNode, replaceNode) {
  var index, parent = origNode.parentNode;
  JQLiteDealoc(origNode);
  forEach(new JQLite(replaceNode), function(node){
    if (index) {
      parent.insertBefore(node, index.nextSibling);
    } else {
      parent.replaceChild(node, origNode);
    }
    index = node;
  });
}


/**
 * @param {!Element} element
 * @param {!Node} node
 */
function JQLiteAppend(element, node) {
  forEach(new JQLite(node), function(child){
    if (element.nodeType === 1 || element.nodeType === 11) {
      element.appendChild(child);
    }
  });
}


/**
 * @param {!Element} element
 * @param {!Node} node
 */
function JQLitePrepend(element, node) {
  if (element.nodeType === 1) {
    var index = element.firstChild;
    forEach(new JQLite(node), function(child){
      if (index) {
        element.insertBefore(child, index);
      } else {
        element.appendChild(child);
        index = child;
      }
    });
  }
}


/**
 * @param {!Element} element
 * @param {!Element} wrapElement
 */
function JQLiteWrap(element, wrapElement) {
  wrapElement = jqLite(wrapElement)[0];
  var parent = element.parentNode;
  if (parent) {
    parent.replaceChild(wrapElement, element);
  }
  wrapElement.appendChild(element);
}


/**
 * @param {!Node} node
 */
function JQLiteRemove(node) {
  JQLiteDealoc(node);
  var parent = node.parentNode;
  if (parent) parent.removeChild(node);
}


/**
 * @param {!Node} origNode
 * @param {!Node} newNode
 */
function JQLiteAfter(origNode, newNode) {
  var index = origNode, parent = origNode.parentNode;
  forEach(new JQLite(newNode), function(node){
    parent.insertBefore(node, index.nextSibling);
    index = node;
  });
}


/**
 * @param {!Element} element
 * @return {!Array.<!Node>}
 */
function JQLiteChildren(element) {
  var children = [];
  forEach(element.childNodes, function(element){
    if (element.nodeType === 1)
      children.push(element);
  });
  return children;
}


/**
 * @param {!Element} element
 * @return {!NodeList|!Array}
 */
function JQLiteContents(element) {
  return element.childNodes || [];
}


/**
 * @param {!Node} node
 */
function JQLiteRemoveData(node) {
  var expandoId = node[jqName],
      expandoStore = jqCache[expandoId];

  if (expandoStore) {
    if (expandoStore.handle) {
      expandoStore.events.$destroy && expandoStore.handle({}, '$destroy');
      JQLiteUnbind(node);
    }
    delete jqCache[expandoId];
    node[jqName] = undefined; // ie does not allow deletion of attributes on elements.
  }
}


/**
 * @param {!Node} node
 * @param {!string} key
 * @param {*=} value
 */
function JQLiteExpandoStore(node, key, value) {
  var expandoId = node[jqName],
      expandoStore = jqCache[expandoId || -1];

  if (isDefined(value)) {
    if (!expandoStore) {
      node[jqName] = expandoId = jqNextId();
      expandoStore = jqCache[expandoId] = {};
    }
    expandoStore[key] = value;
  } else {
    return expandoStore && expandoStore[key];
  }
}


/**
 * @param {!Node} node
 * @param {!(string|Object)} key
 * @param {*=} value
 * @return {*}
 */
function JQLiteData(node, key, value) {
  var data = JQLiteExpandoStore(node, 'data'),
      isSetter = isDefined(value),
      keyDefined = !isSetter && isDefined(key),
      isSimpleGetter = keyDefined && !isObject(key);

  if (!data && !isSimpleGetter) {
    JQLiteExpandoStore(node, 'data', data = {});
  }

  if (isSetter) {
    data[key] = value;
  } else {
    if (keyDefined) {
      if (isSimpleGetter) {
        // don't create data in this case.
        return data && data[key];
      } else {
        extend(data, /** @type {Object} */(key));
      }
    } else {
      return data;
    }
  }
}


/**
 * @param {!Element} element
 * @param {!string} name
 */
function JQLiteRemoveAttr(element,name) {
  element.removeAttribute(name);
}

/**
 * @param {!Element} element
 * @param {!string} className
 * @return {!boolean}
 */
function JQLiteHasClass(element, className) {
  return ((" " + element.className + " ").replace(/[\n\t]/g, " ").
      indexOf( " " + className + " " ) > -1);
}


/**
 * @param {!Element} element
 * @param {!string} name
 * @param {!string=} value
 * @return {string|undefined}
 */
function JQLiteCss(element, name, value) {
  name = camelCase(name);

  if (isDefined(value)) {
    element.style[name] = value;
  } else {
    var val;

    if (msie <= 8) {
      // this is some IE specific weirdness that jQuery 1.6.4 does not sure why
      val = element.currentStyle && element.currentStyle[name];
      if (val === '') val = 'auto';
    }

    val = val || element.style[name];

    if (msie <= 8) {
      // jquery weirdness :-/
      val = (val === '') ? undefined : val;
    }

    return  val;
  }
}


/**
 * @param {!Element} element
 * @param {!string} name
 * @param {!(string|boolean)} value
 * @return {(string|undefined)}
 */
function JQLiteAttr(element, name, value){
  var lowercasedName = lowercase(name);
  if (BOOLEAN_ATTR[lowercasedName]) {
    if (isDefined(value)) {
      if (!!value) {
        element[name] = true;
        element.setAttribute(name, lowercasedName);
      } else {
        element[name] = false;
        element.removeAttribute(lowercasedName);
      }
    } else {
      return (element[name] ||
          (element.attributes.getNamedItem(name)|| noop).specified)
          ? lowercasedName
          : undefined;
    }
  } else if (isDefined(value)) {
    element.setAttribute(name, value);
  } else if (element.getAttribute) {
    // the extra argument "2" is to get the right thing for a.href in IE, see jQuery code
    // some elements (e.g. Document) don't have get attribute, so return undefined
    var ret = element.getAttribute(name, 2);
    // normalize non-existing attributes to undefined (as jQuery)
    return ret === null ? undefined : ret;
  }
}


/**
 * @param {!Node} element
 * @param {!string} name
 * @param {*=} value
 * @return {*}
 */
function JQLiteProp(element, name, value) {
  if (isDefined(value)) {
    element[name] = value;
  } else {
    return element[name];
  }
}


/**
 * @param {!Node} node
 * @param {!string=} value
 * @return {string|undefined}
 */
function JQLiteTextOldIE(node, value) {
  if (node.nodeType == 1 /** Element */) {
    if (isUndefined(value))
      return node.innerText;
    node.innerText = value;
  } else {
    if (isUndefined(value)) return node.nodeValue;
    node.nodeValue = /** @type {string} */(value);
  }
}


/**
 * @param {!Element} element
 * @param {!string=} value
 * @return {string|undefined}
 */
function JQLiteText(element, value) {
  if (isUndefined(value)) {
    return element.textContent;
  }
  element.textContent = value;
}


/**
 * @param {!Node} element
 * @param {!string=} value
 * @return {*}
 */
function JQLiteVal(element, value) {
  if (isUndefined(value)) {
    return element.value;
  }
  element.value = value;
}


/**
 * @param {!Element} element
 * @param {!string=} value
 * @return {string|undefined}
 */
function JQLiteHtml(element, value) {
  if (isUndefined(value)) {
    return element.innerHTML;
  }
  for (var i = 0, childNodes = element.childNodes; i < childNodes.length; i++) {
    JQLiteDealoc(childNodes[i]);
  }
  element.innerHTML = value;
}


/**
 * @param {!Element} element
 * @param {!string} cssClasses
 */
function JQLiteRemoveClass(element, cssClasses) {
  if (cssClasses) {
    forEach(cssClasses.split(' '), function(cssClass) {
      element.className = trim(
          (" " + element.className + " ")
          .replace(/[\n\t]/g, " ")
          .replace(" " + trim(cssClass) + " ", " ")
      );
    });
  }
}


/**
 * @param {!Element} element
 * @param {!string} cssClasses
 */
function JQLiteAddClass(element, cssClasses) {
  if (cssClasses) {
    forEach(cssClasses.split(' '), function(cssClass) {
      if (!JQLiteHasClass(element, cssClass)) {
        element.className = trim(element.className + ' ' + trim(cssClass));
      }
    });
  }
}


/**
 * @param {!Element} element
 * @param {!string} className
 * @param {!boolean=} condition
 */
function JQLiteToggleClass(element, className, condition) {
  if (isUndefined(condition)) {
    condition = !JQLiteHasClass(element, className);
  }
  (condition ? JQLiteAddClass : JQLiteRemoveClass)(element, className);
}


/**
 * @param {!Node} node
 * @return {Element}
 */
function JQLiteParent(node) {
  var parent = node.parentNode;
  return /** @type {Element} */(parent && parent.nodeType !== 11 ? parent : null);
}


/**
 * @param {!Element} element
 * @return {Element}
 */
function JQLiteNext(element) {
  if (element.nextElementSibling) {
    return element.nextElementSibling;
  }

  // IE8 doesn't have nextElementSibling
  var elm = element.nextSibling;
  while (elm != null && elm.nodeType !== 1) {
    elm = elm.nextSibling;
  }
  return /** @type {Element} */(elm);
}


/**
 * @param {!Element} element
 * @param {!string} selector
 * @return {!NodeList}
 */
function JQLiteFind(element, selector) {
  return element.getElementsByTagName(selector);
}


/**
 * @param {!JQLite} root
 * @param {!(Element|NodeList|JQLite|Array)} elements
 */
function JQLiteAddNodes(root, elements) {
  if (elements) {
    elements = (!elements.nodeName && isDefined(elements.length) && !isWindow(elements))
      ? elements
      : [ elements ];
    for(var i=0; i < elements.length; i++) {
      root.push(elements[i]);
    }
  }
}

/**
 * @param {!Element} element
 * @param {!string} name
 * @return {!Object|undefined}
 */
function JQLiteController(element, name) {
  return JQLiteInheritedData(element, '$' + (name || 'ngController' ) + 'Controller');
}


/**
 * @param {!Element} element
 * @return {!ng.Injector}
 */
function JQLiteInjector(element) {
  return JQLiteInheritedData(element, '$injector');
}


/**
 * @param {!Node} node
 * @param {string} name
 * @param {*=} value Bogus param to make this fn look like getter/setter (fn.length === 3)
 */
function JQLiteInheritedData(node, name, value) {
  var $element = jqLite(node);

  // if node is the document object work with the html node instead
  // this makes $(document).scope() possible
  if(node.nodeType == 9) {
    $element = $element.find('html');
  }

  while ($element.length) {
    if (value = $element.data(name)) return value;
    $element = $element.parent();
  }
}


/**
 * @param {!Element} element
 * @return {!ng.Scope}
 */
function JQLiteScope(element) {
  return JQLiteInheritedData(element, '$scope');
}

//////////////////////////////////////////
// Functions which are declared directly.
//////////////////////////////////////////
var JQLitePrototype = extend(JQLite.prototype, /** @lends {JQLite.prototype} */{

  ready: function(fn) {
    var fired = false;

    function trigger() {
      if (fired) return;
      fired = true;
      fn();
    }

    this.bind('DOMContentLoaded', trigger); // works for modern browsers and IE9
    // we can not use jqLite since we are not done loading and jQuery could be loaded later.
    new JQLite(window).bind('load', trigger); // fallback to window.onload for others
  },
  toString: function() {
    var value = [];
    forEach(this, function(e){ value.push('' + e);});
    return '[' + value.join(', ') + ']';
  },

  eq: function(index) {
      return (index >= 0) ? jqLite(this[index]) : jqLite(this[this.length + index]);
  },

  length: 0,
  push: push,
  sort: [].sort,
  splice: [].splice
});

//////////////////////////////////////////
// Functions iterating getter/setters.
// these functions return self on setter and
// value on get.
//////////////////////////////////////////
var BOOLEAN_ATTR = {};
forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function(value) {
  BOOLEAN_ATTR[lowercase(value)] = value;
});
var BOOLEAN_ELEMENTS = {};
forEach('input,select,option,textarea,button,form,details'.split(','), function(value) {
  BOOLEAN_ELEMENTS[uppercase(value)] = true;
});

function getBooleanAttrName(element, name) {
  // check dom last since we will most likely fail on name
  var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];

  // booleanAttr is here twice to minimize DOM access
  return booleanAttr && BOOLEAN_ELEMENTS[element.nodeName] && booleanAttr;
}


forEach(/** @lends {JQLite.prototype} */{


  data: /** @type function(!string, *=):* */(JQLiteData),

  inheritedData: /** @type function(!string):* */(JQLiteInheritedData),

  scope: /** @type function():!ng.Scope */(JQLiteScope),

  controller: /** @type function():!Object */(JQLiteController),

  injector: /** @type function():!ng.Injector */(JQLiteInjector),

  removeAttr: /** @type function(!string):undefined */(JQLiteRemoveAttr),

  hasClass: /** @type function(!string):!boolean */(JQLiteHasClass),

  css: /** @type function(!string, !string):(string|undefined) */(JQLiteCss),

  attr: /** @type function(!string, !(string|boolean)=):(string|undefined) */(JQLiteAttr),

  prop: /** @type function(!string, *=):* */(JQLiteProp),

  text: /** @type function(!string=):!* */(extend((msie < 9) ? JQLiteTextOldIE : JQLiteText, {$dv:''})),

  val: /** @type function(!string=):(string|undefined) */(JQLiteVal),

  html: /** @type function(!string=):(string|undefined) */(JQLiteHtml)

}, function(fn, name){
  /**
   * Properties: writes return selection, reads return first value
   */
  JQLite.prototype[name] = function(arg1, arg2) {
    var i, key;

    // JQLiteHasClass has only two arguments, but is a getter-only fn, so we need to special-case it
    // in a way that survives minification.
    if (((fn.length == 2 && (fn !== JQLiteHasClass && fn !== JQLiteController)) ? arg1 : arg2) === undefined) {
      if (isObject(arg1)) {

        // we are a write, but the object properties are the key/values
        for(i=0; i < this.length; i++) {
          if (fn === JQLiteData) {
            // data() takes the whole object in jQuery
            fn(this[i], arg1);
          } else {
            for (key in arg1) {
              fn(this[i], key, arg1[key]);
            }
          }
        }
        // return self for chaining
        return this;
      } else {
        // we are a read, so read the first child.
        if (this.length)
          return fn(this[0], arg1, arg2);
      }
    } else {
      // we are a write, so apply to all children
      for(i=0; i < this.length; i++) {
        fn(this[i], arg1, arg2);
      }
      // return self for chaining
      return this;
    }
    return fn.$dv;
  };
});

function createEventHandler(element, events) {
  var eventHandler = function (event, type) {
    if (!event.preventDefault) {
      event.preventDefault = function() {
        event.returnValue = false; //ie
      };
    }

    if (!event.stopPropagation) {
      event.stopPropagation = function() {
        event.cancelBubble = true; //ie
      };
    }

    if (!event.target) {
      event.target = event.srcElement || document;
    }

    if (isUndefined(event.defaultPrevented)) {
      var prevent = event.preventDefault;
      event.preventDefault = function() {
        event.defaultPrevented = true;
        prevent.call(event);
      };
      event.defaultPrevented = false;
    }

    event.isDefaultPrevented = function() {
      return event.defaultPrevented;
    };

    forEach(events[type || event.type], function(fn) {
      fn.call(element, event);
    });

    // Remove monkey-patched methods (IE),
    // as they would cause memory leaks in IE8.
    if (msie <= 8) {
      // IE7/8 does not allow to delete property on native object
      /**
       * @type {*}
       */
      var releaseMem = null;
      event.preventDefault = null;
      event.stopPropagation = null;
      event.isDefaultPrevented = /** @type {function (): ?} */(releaseMem);
    } else {
      // It shouldn't affect normal browsers (native methods are defined on prototype).
      delete event.preventDefault;
      delete event.stopPropagation;
      delete event.isDefaultPrevented;
    }
  };
  eventHandler.elem = element;
  return eventHandler;
}

//////////////////////////////////////////
// Functions iterating traversal.
// These functions chain results into a single
// selector.
//////////////////////////////////////////
forEach(/** @lends {JQLite.prototype} */{

  removeData: /** @type {function():!JQLite} */(JQLiteRemoveData),

  dealoc: /** @type {function():!JQLite}*/(JQLiteDealoc),

  bind: /** @type {function(!string, !Function):!JQLite} */(JQLiteBind),

  unbind: /** @type {function(string=, Function=):!JQLite}*/(JQLiteUnbind),

  replaceWith: /** @type {function(!Node):!JQLite} */(JQLiteReplaceWith),

  children: /** @type {function():!JQLite} */(JQLiteChildren),

  contents: /** @type {function():!JQLite} */(JQLiteContents),

  append: /** @type {function(!Node):!JQLite} */(JQLiteAppend),

  prepend: /** @type {function(!Node):!JQLite} */(JQLitePrepend),

  wrap: /** @type {function(!Element):!JQLite} */(JQLiteWrap),

  remove: /** @type {function():!JQLite} */(JQLiteRemove),

  after: /** @type {function(!Node):!JQLite} */(JQLiteAfter),

  addClass: /** @type {function(!string):!JQLite}*/(JQLiteAddClass),

  removeClass: /** @type {function(!string):!JQLite}*/(JQLiteRemoveClass),

  toggleClass: /** @type {function(!string, !boolean=):!JQLite} */(JQLiteToggleClass),

  parent: /** @type {function():!JQLite} */(JQLiteParent),

  next: /** @type {function():!JQLite} */(JQLiteNext),

  find: /** @type {function(!string):!JQLite} */(JQLiteFind),

  clone: /** @type {function():!JQLite}*/(JQLiteClone),

  triggerHandler: /** @type {function(!string):!JQLite} */(JQLiteTriggerHandler)

}, function(fn, name){
  /**
   * chaining functions
   */
  JQLite.prototype[name] = function(arg1, arg2) {
    var value;
    for(var i=0; i < this.length; i++) {
      if (value == undefined) {
        value = fn(this[i], arg1, arg2);
        if (value !== undefined) {
          // any function which returns a value needs to be wrapped
          value = jqLite(value);
        }
      } else {
        JQLiteAddNodes(value, fn(this[i], arg1, arg2));
      }
    }
    return value == undefined ? this : value;
  };
});
