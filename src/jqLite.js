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
 * - [bind()](http://api.jquery.com/bind/) - Does not support namespaces
 * - [children()](http://api.jquery.com/children/) - Does not support selectors
 * - [clone()](http://api.jquery.com/clone/)
 * - [contents()](http://api.jquery.com/contents/)
 * - [css()](http://api.jquery.com/css/)
 * - [data()](http://api.jquery.com/data/)
 * - [eq()](http://api.jquery.com/eq/)
 * - [find()](http://api.jquery.com/find/) - Limited to lookups by tag name
 * - [hasClass()](http://api.jquery.com/hasClass/)
 * - [html()](http://api.jquery.com/html/)
 * - [next()](http://api.jquery.com/next/) - Does not support selectors
 * - [parent()](http://api.jquery.com/parent/) - Does not support selectors
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
 * - [unbind()](http://api.jquery.com/unbind/) - Does not support namespaces
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
 * @param {string|DOMElement} element HTML string or DOMElement to be wrapped into jQuery.
 * @returns {Object} jQuery object.
 */

var jqCache = JQLite.cache = {},
    jqName = JQLite.expando = 'ng-' + new Date().getTime(),
    jqId = 1,
    addEventListenerFn = (window.document.addEventListener
      ? function(element, type, fn) {element.addEventListener(type, fn, false);}
      : function(element, type, fn) {element.attachEvent('on' + type, fn);}),
    removeEventListenerFn = (window.document.removeEventListener
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

function JQLitePatchJQueryRemove(name, dispatchThis) {
  var originalJqFn = jQuery.fn[name];
  originalJqFn = originalJqFn.$original || originalJqFn;
  removePatch.$original = originalJqFn;
  jQuery.fn[name] = removePatch;

  function removePatch() {
    var list = [this],
        fireEvent = dispatchThis,
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
          fireEvent = !fireEvent;
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

/////////////////////////////////////////////
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

function JQLiteClone(element) {
  return element.cloneNode(true);
}

function JQLiteDealoc(element){
  JQLiteRemoveData(element);
  for ( var i = 0, children = element.childNodes || []; i < children.length; i++) {
    JQLiteDealoc(children[i]);
  }
}

function JQLiteUnbind(element, type, fn) {
  var events = JQLiteExpandoStore(element, 'events'),
      handle = JQLiteExpandoStore(element, 'handle');

  if (!handle) return; //no listeners registered

  if (isUndefined(type)) {
    forEach(events, function(eventHandler, type) {
      removeEventListenerFn(element, type, eventHandler);
      delete events[type];
    });
  } else {
    if (isUndefined(fn)) {
      removeEventListenerFn(element, type, events[type]);
      delete events[type];
    } else {
      arrayRemove(events[type], fn);
    }
  }
}

function JQLiteRemoveData(element) {
  var expandoId = element[jqName],
      expandoStore = jqCache[expandoId];

  if (expandoStore) {
    if (expandoStore.handle) {
      expandoStore.events.$destroy && expandoStore.handle({}, '$destroy');
      JQLiteUnbind(element);
    }
    delete jqCache[expandoId];
    element[jqName] = undefined; // ie does not allow deletion of attributes on elements.
  }
}

function JQLiteExpandoStore(element, key, value) {
  var expandoId = element[jqName],
      expandoStore = jqCache[expandoId || -1];

  if (isDefined(value)) {
    if (!expandoStore) {
      element[jqName] = expandoId = jqNextId();
      expandoStore = jqCache[expandoId] = {};
    }
    expandoStore[key] = value;
  } else {
    return expandoStore && expandoStore[key];
  }
}

function JQLiteData(element, key, value) {
  var data = JQLiteExpandoStore(element, 'data'),
      isSetter = isDefined(value),
      keyDefined = !isSetter && isDefined(key),
      isSimpleGetter = keyDefined && !isObject(key);

  if (!data && !isSimpleGetter) {
    JQLiteExpandoStore(element, 'data', data = {});
  }

  if (isSetter) {
    data[key] = value;
  } else {
    if (keyDefined) {
      if (isSimpleGetter) {
        // don't create data in this case.
        return data && data[key];
      } else {
        extend(data, key);
      }
    } else {
      return data;
    }
  }
}

function JQLiteHasClass(element, selector) {
  return ((" " + element.className + " ").replace(/[\n\t]/g, " ").
      indexOf( " " + selector + " " ) > -1);
}

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

function JQLiteAddClass(element, cssClasses) {
  if (cssClasses) {
    forEach(cssClasses.split(' '), function(cssClass) {
      if (!JQLiteHasClass(element, cssClass)) {
        element.className = trim(element.className + ' ' + trim(cssClass));
      }
    });
  }
}

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

function JQLiteController(element, name) {
  return JQLiteInheritedData(element, '$' + (name || 'ngController' ) + 'Controller');
}

function JQLiteInheritedData(element, name, value) {
  element = jqLite(element);

  // if element is the document object work with the html element instead
  // this makes $(document).scope() possible
  if(element[0].nodeType == 9) {
    element = element.find('html');
  }

  while (element.length) {
    if (value = element.data(name)) return value;
    element = element.parent();
  }
}

//////////////////////////////////////////
// Functions which are declared directly.
//////////////////////////////////////////
var JQLitePrototype = JQLite.prototype = {
  ready: function(fn) {
    var fired = false;

    function trigger() {
      if (fired) return;
      fired = true;
      fn();
    }

    // check if document already is loaded
    if (document.readyState === 'complete'){
      setTimeout(trigger);
    } else {
      this.bind('DOMContentLoaded', trigger); // works for modern browsers and IE9
      // we can not use jqLite since we are not done loading and jQuery could be loaded later.
      JQLite(window).bind('load', trigger); // fallback to window.onload for others
    }
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
};

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

forEach({
  data: JQLiteData,
  inheritedData: JQLiteInheritedData,

  scope: function(element) {
    return JQLiteInheritedData(element, '$scope');
  },

  controller: JQLiteController ,

  injector: function(element) {
    return JQLiteInheritedData(element, '$injector');
  },

  removeAttr: function(element,name) {
    element.removeAttribute(name);
  },

  hasClass: JQLiteHasClass,

  css: function(element, name, value) {
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
  },

  attr: function(element, name, value){
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
  },

  prop: function(element, name, value) {
    if (isDefined(value)) {
      element[name] = value;
    } else {
      return element[name];
    }
  },

  text: extend((msie < 9)
      ? function(element, value) {
        if (element.nodeType == 1 /** Element */) {
          if (isUndefined(value))
            return element.innerText;
          element.innerText = value;
        } else {
          if (isUndefined(value))
            return element.nodeValue;
          element.nodeValue = value;
        }
      }
      : function(element, value) {
        if (isUndefined(value)) {
          return element.textContent;
        }
        element.textContent = value;
      }, {$dv:''}),

  val: function(element, value) {
    if (isUndefined(value)) {
      return element.value;
    }
    element.value = value;
  },

  html: function(element, value) {
    if (isUndefined(value)) {
      return element.innerHTML;
    }
    for (var i = 0, childNodes = element.childNodes; i < childNodes.length; i++) {
      JQLiteDealoc(childNodes[i]);
    }
    element.innerHTML = value;
  }
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
      event.preventDefault = null;
      event.stopPropagation = null;
      event.isDefaultPrevented = null;
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
forEach({
  removeData: JQLiteRemoveData,

  dealoc: JQLiteDealoc,

  bind: function bindFn(element, type, fn){
    var events = JQLiteExpandoStore(element, 'events'),
        handle = JQLiteExpandoStore(element, 'handle');

    if (!events) JQLiteExpandoStore(element, 'events', events = {});
    if (!handle) JQLiteExpandoStore(element, 'handle', handle = createEventHandler(element, events));

    forEach(type.split(' '), function(type){
      var eventFns = events[type];

      if (!eventFns) {
        if (type == 'mouseenter' || type == 'mouseleave') {
          var contains = document.body.contains || document.body.compareDocumentPosition ?
          function( a, b ) {
            var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;
            return a === bup || !!( bup && bup.nodeType === 1 && (
              adown.contains ?
              adown.contains( bup ) :
              a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
              ));
            } :
            function( a, b ) {
              if ( b ) {
                while ( (b = b.parentNode) ) {
                  if ( b === a ) {
                    return true;
                  }
                }
              }
              return false;
            };	

          events[type] = [];
		
		  // Refer to jQuery's implementation of mouseenter & mouseleave
          // Read about mouseenter and mouseleave:
          // http://www.quirksmode.org/js/events_mouse.html#link8
          var eventmap = { mouseleave : "mouseout", mouseenter : "mouseover"}          
          bindFn(element, eventmap[type], function(event) {
            var ret, target = this, related = event.relatedTarget;
            // For mousenter/leave call the handler if related is outside the target.
            // NB: No relatedTarget if the mouse left/entered the browser window
            if ( !related || (related !== target && !contains(target, related)) ){
              handle(event, type);
            }	

          });

        } else {
          addEventListenerFn(element, type, handle);
          events[type] = [];
        }
        eventFns = events[type]
      }
      eventFns.push(fn);
    });
  },

  unbind: JQLiteUnbind,

  replaceWith: function(element, replaceNode) {
    var index, parent = element.parentNode;
    JQLiteDealoc(element);
    forEach(new JQLite(replaceNode), function(node){
      if (index) {
        parent.insertBefore(node, index.nextSibling);
      } else {
        parent.replaceChild(node, element);
      }
      index = node;
    });
  },

  children: function(element) {
    var children = [];
    forEach(element.childNodes, function(element){
      if (element.nodeType === 1)
        children.push(element);
    });
    return children;
  },

  contents: function(element) {
    return element.childNodes || [];
  },

  append: function(element, node) {
    forEach(new JQLite(node), function(child){
      if (element.nodeType === 1 || element.nodeType === 11) {
        element.appendChild(child);
      }
    });
  },

  prepend: function(element, node) {
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
  },

  wrap: function(element, wrapNode) {
    wrapNode = jqLite(wrapNode)[0];
    var parent = element.parentNode;
    if (parent) {
      parent.replaceChild(wrapNode, element);
    }
    wrapNode.appendChild(element);
  },

  remove: function(element) {
    JQLiteDealoc(element);
    var parent = element.parentNode;
    if (parent) parent.removeChild(element);
  },

  after: function(element, newElement) {
    var index = element, parent = element.parentNode;
    forEach(new JQLite(newElement), function(node){
      parent.insertBefore(node, index.nextSibling);
      index = node;
    });
  },

  addClass: JQLiteAddClass,
  removeClass: JQLiteRemoveClass,

  toggleClass: function(element, selector, condition) {
    if (isUndefined(condition)) {
      condition = !JQLiteHasClass(element, selector);
    }
    (condition ? JQLiteAddClass : JQLiteRemoveClass)(element, selector);
  },

  parent: function(element) {
    var parent = element.parentNode;
    return parent && parent.nodeType !== 11 ? parent : null;
  },

  next: function(element) {
    if (element.nextElementSibling) {
      return element.nextElementSibling;
    }

    // IE8 doesn't have nextElementSibling
    var elm = element.nextSibling;
    while (elm != null && elm.nodeType !== 1) {
      elm = elm.nextSibling;
    }
    return elm;
  },

  find: function(element, selector) {
    return element.getElementsByTagName(selector);
  },

  clone: JQLiteClone,

  triggerHandler: function(element, eventName) {
    var eventFns = (JQLiteExpandoStore(element, 'events') || {})[eventName];

    forEach(eventFns, function(fn) {
      fn.call(element, null);
    });
  }
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
