// Underscore.js
// (c) 2009 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the terms of the MIT license.
// Portions of Underscore are inspired by or borrowed from Prototype.js,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore/

(function() {

  /*------------------------- Baseline setup ---------------------------------*/

  // Establish the root object, "window" in the browser, or "global" on the server.
  var root = this;

  // Save the previous value of the "_" variable.
  var previousUnderscore = root._;

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Establish the object that gets thrown to break out of a loop iteration.
  var breaker = typeof StopIteration !== 'undefined' ? StopIteration : '__break__';

  // Create a safe reference to the Underscore object for reference below.
  var _ = root._ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for CommonJS.
  if (typeof exports !== 'undefined') exports._ = _;

  // Create quick reference variables for speed access to core prototypes.
  var slice                 = Array.prototype.slice,
      unshift               = Array.prototype.unshift,
      toString              = Object.prototype.toString,
      hasOwnProperty        = Object.prototype.hasOwnProperty,
      propertyIsEnumerable  = Object.prototype.propertyIsEnumerable;

  // Current version.
  _.VERSION = '0.5.1';

  /*------------------------ Collection Functions: ---------------------------*/

  // The cornerstone, an each implementation.
  // Handles objects implementing forEach, arrays, and raw objects.
  _.each = function(obj, iterator, context) {
    var index = 0;
    try {
      if (obj.forEach) {
        obj.forEach(iterator, context);
      } else if (_.isArray(obj) || _.isArguments(obj)) {
        for (var i=0, l=obj.length; i<l; i++) iterator.call(context, obj[i], i, obj);
      } else {
        var keys = _.keys(obj), l = keys.length;
        for (var i=0; i<l; i++) iterator.call(context, obj[keys[i]], keys[i], obj);
      }
    } catch(e) {
      if (e != breaker) throw e;
    }
    return obj;
  };

  // Return the results of applying the iterator to each element. Use JavaScript
  // 1.6's version of map, if possible.
  _.map = function(obj, iterator, context) {
    if (obj && _.isFunction(obj.map)) return obj.map(iterator, context);
    var results = [];
    _.each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  // Reduce builds up a single result from a list of values. Also known as
  // inject, or foldl. Uses JavaScript 1.8's version of reduce, if possible.
  _.reduce = function(obj, memo, iterator, context) {
    if (obj && _.isFunction(obj.reduce)) return obj.reduce(_.bind(iterator, context), memo);
    _.each(obj, function(value, index, list) {
      memo = iterator.call(context, memo, value, index, list);
    });
    return memo;
  };

  // The right-associative version of reduce, also known as foldr. Uses
  // JavaScript 1.8's version of reduceRight, if available.
  _.reduceRight = function(obj, memo, iterator, context) {
    if (obj && _.isFunction(obj.reduceRight)) return obj.reduceRight(_.bind(iterator, context), memo);
    var reversed = _.clone(_.toArray(obj)).reverse();
    _.each(reversed, function(value, index) {
      memo = iterator.call(context, memo, value, index, obj);
    });
    return memo;
  };

  // Return the first value which passes a truth test.
  _.detect = function(obj, iterator, context) {
    var result;
    _.each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        _.breakLoop();
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test. Use JavaScript 1.6's
  // filter(), if it exists.
  _.select = function(obj, iterator, context) {
    if (obj && _.isFunction(obj.filter)) return obj.filter(iterator, context);
    var results = [];
    _.each(obj, function(value, index, list) {
      iterator.call(context, value, index, list) && results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    _.each(obj, function(value, index, list) {
      !iterator.call(context, value, index, list) && results.push(value);
    });
    return results;
  };

  // Determine whether all of the elements match a truth test. Delegate to
  // JavaScript 1.6's every(), if it is present.
  _.all = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    if (obj && _.isFunction(obj.every)) return obj.every(iterator, context);
    var result = true;
    _.each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) _.breakLoop();
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test. Use
  // JavaScript 1.6's some(), if it exists.
  _.any = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    if (obj && _.isFunction(obj.some)) return obj.some(iterator, context);
    var result = false;
    _.each(obj, function(value, index, list) {
      if (result = iterator.call(context, value, index, list)) _.breakLoop();
    });
    return result;
  };

  // Determine if a given value is included in the array or object,
  // based on '==='.
  _.include = function(obj, target) {
    if (_.isArray(obj)) return _.indexOf(obj, target) != -1;
    var found = false;
    _.each(obj, function(value) {
      if (found = value === target) _.breakLoop();
    });
    return found;
  };

  // Invoke a method with arguments on every item in a collection.
  _.invoke = function(obj, method) {
    var args = _.rest(arguments, 2);
    return _.map(obj, function(value) {
      return (method ? value[method] : value).apply(value, args);
    });
  };

  // Convenience version of a common use case of map: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum item or (item-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    var result = {computed : -Infinity};
    _.each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    var result = {computed : Infinity};
    _.each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Sort the object's values by a criteria produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator = iterator || _.identity;
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return iterable;
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.map(iterable, function(val){ return val; });
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  /*-------------------------- Array Functions: ------------------------------*/

  // Get the first element of an array. Passing "n" will return the first N
  // values in the array. Aliased as "head". The "guard" check allows it to work
  // with _.map.
  _.first = function(array, n, guard) {
    return n && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the first entry of the array. Aliased as "tail".
  // Especially useful on the arguments object. Passing an "index" will return
  // the rest of the values in the array from that index onward. The "guard"
   //check allows it to work with _.map.
  _.rest = function(array, index, guard) {
    return slice.call(array, _.isUndefined(index) || guard ? 1 : index);
  };

  // Get the last element of an array.
  _.last = function(array) {
    return array[array.length - 1];
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.select(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array) {
    return _.reduce(array, [], function(memo, value) {
      if (_.isArray(value)) return memo.concat(_.flatten(value));
      memo.push(value);
      return memo;
    });
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    var values = _.rest(arguments);
    return _.select(array, function(value){ return !_.include(values, value); });
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  _.uniq = function(array, isSorted) {
    return _.reduce(array, [], function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) memo.push(el);
      return memo;
    });
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersect = function(array) {
    var rest = _.rest(arguments);
    return _.select(_.uniq(array), function(item) {
      return _.all(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = _.toArray(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i=0; i<length; i++) results[i] = _.pluck(args, String(i));
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, MSIE),
  // we need this function. Return the position of the first occurence of an
  // item in an array, or -1 if the item is not included in the array.
  _.indexOf = function(array, item) {
    if (array.indexOf) return array.indexOf(item);
    for (var i=0, l=array.length; i<l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Provide JavaScript 1.6's lastIndexOf, delegating to the native function,
  // if possible.
  _.lastIndexOf = function(array, item) {
    if (array.lastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python range() function. See:
  // http://docs.python.org/library/functions.html#range
  _.range = function(start, stop, step) {
    var a     = _.toArray(arguments);
    var solo  = a.length <= 1;
    var start = solo ? 0 : a[0], stop = solo ? a[0] : a[1], step = a[2] || 1;
    var len   = Math.ceil((stop - start) / step);
    if (len <= 0) return [];
    var range = new Array(len);
    for (var i = start, idx = 0; true; i += step) {
      if ((step > 0 ? i - stop : stop - i) >= 0) return range;
      range[idx++] = i;
    }
  };

  /* ----------------------- Function Functions: -----------------------------*/

  // Create a function bound to a given object (assigning 'this', and arguments,
  // optionally). Binding with arguments is also known as 'curry'.
  _.bind = function(func, obj) {
    var args = _.rest(arguments, 2);
    return function() {
      return func.apply(obj || root, args.concat(_.toArray(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = _.rest(arguments);
    if (funcs.length == 0) funcs = _.functions(obj);
    _.each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = _.rest(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(_.rest(arguments)));
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(_.toArray(arguments));
      return wrapper.apply(wrapper, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = _.toArray(arguments);
    return function() {
      var args = _.toArray(arguments);
      for (var i=funcs.length-1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  /* ------------------------- Object Functions: ---------------------------- */

  // Retrieve the names of an object's properties.
  _.keys = function(obj) {
    if(_.isArray(obj)) return _.range(0, obj.length);
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available in Underscore.
  _.functions = function(obj) {
    return _.select(_.keys(obj), function(key){ return _.isFunction(obj[key]); }).sort();
  };

  // Extend a given object with all of the properties in a source object.
  _.extend = function(destination, source) {
    for (var property in source) destination[property] = source[property];
    return destination;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (_.isArray(obj)) return obj.slice(0);
    return _.extend({}, obj);
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    // Check object identity.
    if (a === b) return true;
    // Different types?
    var atype = typeof(a), btype = typeof(b);
    if (atype != btype) return false;
    // Basic equality test (watch out for coercions).
    if (a == b) return true;
    // One is falsy and the other truthy.
    if ((!a && b) || (a && !b)) return false;
    // One of them implements an isEqual()?
    if (a.isEqual) return a.isEqual(b);
    // Check dates' integer values.
    if (_.isDate(a) && _.isDate(b)) return a.getTime() === b.getTime();
    // Both are NaN?
    if (_.isNaN(a) && _.isNaN(b)) return true;
    // Compare regular expressions.
    if (_.isRegExp(a) && _.isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    // If a is not an object by this point, we can't handle it.
    if (atype !== 'object') return false;
    // Check for different array lengths before comparing contents.
    if (a.length && (a.length !== b.length)) return false;
    // Nothing else worked, deep compare the contents.
    var aKeys = _.keys(a), bKeys = _.keys(b);
    // Different object sizes?
    if (aKeys.length != bKeys.length) return false;
    // Recursive comparison of contents.
    for (var key in a) if (!_.isEqual(a[key], b[key])) return false;
    return true;
  };

  // Is a given array or object empty?
  _.isEmpty = function(obj) {
    return _.keys(obj).length == 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return obj && _.isNumber(obj.length) && !_.isArray(obj) && !propertyIsEnumerable.call(obj, 'length');
  };

  // Is the given value NaN -- this one is interesting. NaN != NaN, and
  // isNaN(undefined) == true, so we make sure it's a number first.
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return typeof obj == 'undefined';
  };

  // Define the isArray, isDate, isFunction, isNumber, isRegExp, and isString
  // functions based on their toString identifiers.
  var types = ['Array', 'Date', 'Function', 'Number', 'RegExp', 'String'];
  for (var i=0, l=types.length; i<l; i++) {
    (function() {
      var identifier = '[object ' + types[i] + ']';
      _['is' + types[i]] = function(obj) { return toString.call(obj) == identifier; };
    })();
  }

  /* -------------------------- Utility Functions: -------------------------- */

  // Run Underscore.js in noConflict mode, returning the '_' variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Break out of the middle of an iteration.
  _.breakLoop = function() {
    throw breaker;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // JavaScript templating a-la ERB, pilfered from John Resig's
  // "Secrets of the JavaScript Ninja", page 83.
  _.template = function(str, data) {
    var fn = new Function('obj',
      'var p=[],print=function(){p.push.apply(p,arguments);};' +
      'with(obj){p.push(\'' +
      str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'")
    + "');}return p.join('');");
    return data ? fn(data) : fn;
  };

  /*------------------------------- Aliases ----------------------------------*/

  _.forEach  = _.each;
  _.foldl    = _.inject       = _.reduce;
  _.foldr    = _.reduceRight;
  _.filter   = _.select;
  _.every    = _.all;
  _.some     = _.any;
  _.head     = _.first;
  _.tail     = _.rest;
  _.methods  = _.functions;

  /*------------------------ Setup the OOP Wrapper: --------------------------*/

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.each(_.functions(_), function(name) {
    var method = _[name];
    wrapper.prototype[name] = function() {
      unshift.call(arguments, this._wrapped);
      return result(method.apply(_, arguments), this._chain);
    };
  });

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = Array.prototype[name];
    wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = Array.prototype[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

})();

(function(window, document){/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

};// Copyright (C) 2008,2009 BRAT Tech LLC

// IE compatibility

if (typeof document.getAttribute == 'undefined')
  document.getAttribute = function() {
  };
if (typeof Node == 'undefined') {
  Node = {
    ELEMENT_NODE : 1,
    ATTRIBUTE_NODE : 2,
    TEXT_NODE : 3,
    CDATA_SECTION_NODE : 4,
    ENTITY_REFERENCE_NODE : 5,
    ENTITY_NODE : 6,
    PROCESSING_INSTRUCTION_NODE : 7,
    COMMENT_NODE : 8,
    DOCUMENT_NODE : 9,
    DOCUMENT_TYPE_NODE : 10,
    DOCUMENT_FRAGMENT_NODE : 11,
    NOTATION_NODE : 12
  };
}

if (_.isUndefined(window.nglr))       nglr = {};
if (_.isUndefined(window.angular))    angular = {};
if (_.isUndefined(angular.validator)) angular.validator = {};
if (_.isUndefined(angular.filter))    angular.filter = {};
if (_.isUndefined(window.console))
  window.console = {
    log:function() {},
    error:function() {}
  };
if (_.isUndefined(alert)) {
  alert = function(){console.log(arguments); window.alert.apply(window, arguments); };
}

consoleLog = function(level, objs) {
  var log = document.createElement("div");
  log.className = level;
  var msg = "";
  var sep = "";
  for ( var i = 0; i < objs.length; i++) {
    var obj = objs[i];
    msg += sep + (typeof obj == 'string' ? obj : toJson(obj));
    sep = " ";
  }
  log.appendChild(document.createTextNode(msg));
  consoleNode.appendChild(log);
};

isNode = function(inp) {
  return inp &&
      inp.tagName &&
      inp.nodeName &&
      inp.ownerDocument &&
      inp.removeAttribute;
};

isLeafNode = function(node) {
  switch (node.nodeName) {
  case "OPTION":
  case "PRE":
  case "TITLE":
    return true;
  default:
    return false;
  }
};

noop = function() {
};
setHtml = function(node, html) {
  if (isLeafNode(node)) {
    if (msie) {
      node.innerText = html;
    } else {
      node.textContent = html;
    }
  } else {
    node.innerHTML = html;
  }
};

escapeHtml = function(html) {
  if (!html || !html.replace)
    return html;
  return html.
      replace(/&/g, '&amp;').
      replace(/</g, '&lt;').
      replace(/>/g, '&gt;');
};

escapeAttr = function(html) {
  if (!html || !html.replace)
    return html;
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g,
      '&quot;');
};

bind = function(_this, _function) {
  if (!_this)
    throw "Missing this";
  if (!_.isFunction(_function))
    throw "Missing function";
  return function() {
    return _function.apply(_this, arguments);
  };
};

shiftBind = function(_this, _function) {
  return function() {
    var args = [ this ];
    for ( var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    return _function.apply(_this, args);
  };
};

outerHTML = function(node) {
  var temp = document.createElement('div');
  temp.appendChild(node);
  var outerHTML = temp.innerHTML;
  temp.removeChild(node);
  return outerHTML;
};

trim = function(str) {
  return str.replace(/^ */, '').replace(/ *$/, '');
};

toBoolean = function(value) {
  var v = ("" + value).toLowerCase();
  if (v == 'f' || v == '0' || v == 'false' || v == 'no')
    value = false;
  return !!value;
};

merge = function(src, dst) {
  for ( var key in src) {
    var value = dst[key];
    var type = typeof value;
    if (type == 'undefined') {
      dst[key] = fromJson(toJson(src[key]));
    } else if (type == 'object' && value.constructor != array &&
        key.substring(0, 1) != "$") {
      merge(src[key], value);
    }
  }
};

// ////////////////////////////
// Loader
// ////////////////////////////

Loader = function(document, head, config) {
  this.document = jQuery(document);
  this.head = jQuery(head);
  this.config = config;
  this.location = window.location;
};

Loader.prototype.load = function() {
  this.configureLogging();
  this.loadCss('/stylesheets/jquery-ui/smoothness/jquery-ui-1.7.1.css');
  this.loadCss('/stylesheets/css');
  console.log("Server: " + this.config.server);
  msie = jQuery.browser.msie;
  this.configureJQueryPlugins();
  this.computeConfiguration();
  this.bindHtml();
};

Loader.prototype.configureJQueryPlugins = function() {
  console.log('Loader.configureJQueryPlugins()');
  jQuery.fn.removeNode = function() {
    var node = this.get(0);
    node.parentNode.removeChild(node);
  };
  jQuery.fn.scope = function() {
    var element = this;
    while (element && element.get(0)) {
      var scope = element.data("scope");
      if (scope)
        return scope;
      element = element.parent();
    }
    return null;
  };
  jQuery.fn.controller = function() {
    return this.data('controller') || NullController.instance;
  };
};

Loader.prototype.uid = function() {
  return "" + new Date().getTime();
};

Loader.prototype.computeConfiguration = function() {
  var config = this.config;
  if (!config.database) {
    var match = config.server.match(/https?:\/\/([\w]*)/);
    config.database = match ? match[1] : "$MEMORY";
  }
};

Loader.prototype.bindHtml = function() {
  console.log('Loader.bindHtml()');
  var watcher = new UrlWatcher(this.location);
  var document = this.document;
  var widgetFactory = new WidgetFactory(this.config.server, this.config.database);
  var binder = new Binder(document[0], widgetFactory, watcher, this.config);
  widgetFactory.onChangeListener = shiftBind(binder, binder.updateModel);
  var controlBar = new ControlBar(document.find('body'), this.config.server);
  var onUpdate = function(){binder.updateView();};
  var server = this.config.database=="$MEMORY" ?
      new FrameServer(this.window) :
      new Server(this.config.server, jQuery.getScript);
  server = new VisualServer(server, new Status(jQuery(document.body)), onUpdate);
  var users = new Users(server, controlBar);
  var databasePath = '/data/' + this.config.database;
  var post = function(request, callback){
    server.request("POST", databasePath, request, callback);
  };
  var datastore = new DataStore(post, users, binder.anchor);
  binder.updateListeners.push(function(){datastore.flush();});
  var scope = new Scope( {
    $anchor : binder.anchor,
    $binder : binder,
    $config : this.config,
    $console : window.console,
    $datastore : datastore,
    $save : function(callback) {
      datastore.saveScope(scope.state, callback, binder.anchor);
    },
    $window : window,
    $uid : this.uid,
    $users : users
  }, "ROOT");

  jQuery.each(["get", "set", "eval", "addWatchListener", "updateView"],
    function(i, method){
      angular[method] = bind(scope, scope[method]);
    });

  document.data('scope', scope);
  console.log('$binder.entity()');
  binder.entity(scope);

  console.log('$binder.compile()');
  binder.compile();

  console.log('ControlBar.bind()');
  controlBar.bind();

  console.log('$users.fetchCurrentUser()');
  function fetchCurrentUser() {
    users.fetchCurrentUser(function(u) {
      if (!u && document.find("[ng-auth=eager]").length) {
        users.login();
      }
    });
  }
  fetchCurrentUser();

  console.log('PopUp.bind()');
  new PopUp(document).bind();

  console.log('$binder.parseAnchor()');
  binder.parseAnchor();

  console.log('$binder.executeInit()');
  binder.executeInit();

  console.log('$binder.updateView()');
  binder.updateView();

  watcher.listener = bind(binder, binder.onUrlChange, watcher);
  watcher.onUpdate = function(){alert("update");};
  watcher.watch();
  document.find("body").show();
  console.log('ready()');

};

Loader.prototype.visualPost = function(delegate) {
  var status = new Status(jQuery(document.body));
  return function(request, delegateCallback) {
    status.beginRequest(request);
    var callback = function() {
      status.endRequest();
      try {
        delegateCallback.apply(this, arguments);
      } catch (e) {
        alert(toJson(e));
      }
    };
    delegate(request, callback);
  };
};

Loader.prototype.configureLogging = function() {
  var url = window.location.href + '#';
  url = url.split('#')[1];
  var config = {
    debug : null
  };
  var configs = url.split('&');
  for ( var i = 0; i < configs.length; i++) {
    var part = (configs[i] + '=').split('=');
    config[part[0]] = part[1];
  }
  if (config.debug == 'console') {
    consoleNode = document.createElement("div");
    consoleNode.id = 'ng-console';
    document.getElementsByTagName('body')[0].appendChild(consoleNode);
    console.log = function() {
      consoleLog('ng-console-info', arguments);
    };
    console.error = function() {
      consoleLog('ng-console-error', arguments);
    };
  }
};

Loader.prototype.loadCss = function(css) {
  var cssTag = document.createElement('link');
  cssTag.rel = "stylesheet";
  cssTag.type = "text/css";
  if (!css.match(/^http:/))
    css = this.config.server + css;
  cssTag.href = css;
  this.head[0].appendChild(cssTag);
};

UrlWatcher = function(location) {
  this.location = location;
  this.delay = 25;
  this.setTimeout = function(fn, delay) {
    window.setTimeout(fn, delay);
  };
  this.listener = function(url) {
    return url;
  };
  this.expectedUrl = location.href;
};

UrlWatcher.prototype.watch = function() {
  var self = this;
  var pull = function() {
    if (self.expectedUrl !== self.location.href) {
      var notify = self.location.hash.match(/^#\$iframe_notify=(.*)$/);
      if (notify) {
        if (!self.expectedUrl.match(/#/)) {
          self.expectedUrl += "#";
        }
        self.location.href = self.expectedUrl;
        var id = '_iframe_notify_' + notify[1];
        var notifyFn = nglr[id];
        delete nglr[id];
        try {
          (notifyFn||noop)();
        } catch (e) {
          alert(e);
        }
      } else {
        self.listener(self.location.href);
        self.expectedUrl = self.location.href;
      }
    }
    self.setTimeout(pull, self.delay);
  };
  pull();
};

UrlWatcher.prototype.setUrl = function(url) {
  var existingURL = window.location.href;
  if (!existingURL.match(/#/))
    existingURL += '#';
  if (existingURL != url)
    window.location.href = url;
  self.existingURL = url;
};

UrlWatcher.prototype.getUrl = function() {
  return window.location.href;
};

angular['compile'] = function(root, config) {
  config = config || {};
  var defaults = {
    server: ""
  };
  //todo: don't load stylesheet by default
  //todo: don't start watcher
  var loader = new Loader(root, jQuery("head"), _(defaults).extend(config));
  loader.load();
  return jQuery(root).scope();
};

angular.Global = {
  typeOf:function(obj){
    var type = typeof obj;
    switch(type) {
    case "object":
      if (obj === null) return "null";
      if (obj instanceof Array) return "array";
      if (obj instanceof Date) return "date";
      if (obj.nodeType == 1) return "element";
    }
    return type;
  }
};

angular.Collection = {};
angular.Object = {};
angular.Array = {
  includeIf:function(array, value, condition) {
    var index = _.indexOf(array, value);
    if (condition) {
      if (index == -1)
        array.push(value);
    } else {
      array.splice(index, 1);
    }
    return array;
  },
  sum:function(array, expression) {
    var fn = angular.Function.compile(expression);
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
      var value = 1 * fn(array[i]);
      if (!isNaN(value)){
        sum += value;
      }
    }
    return sum;
  },
  remove:function(array, value) {
    var index = _.indexOf(array, value);
    if (index >=0)
      array.splice(index, 1);
    return value;
  },
  find:function(array, condition, defaultValue) {
    if (!condition) return undefined;
    var fn = angular.Function.compile(condition);
    _.detect(array, function($){
      if (fn($)){
        defaultValue = $;
        return true;
      }      
    });
    return defaultValue;
  },
  findById:function(array, id) {
    return angular.Array.find(array, function($){return $.$id == id;}, null);
  },
  filter:function(array, expression) {
    var predicates = [];
    predicates.check = function(value) {
      for (var j = 0; j < predicates.length; j++) {
        if(!predicates[j](value)) {
          return false;
        }
      }
      return true;
    };
    var getter = Scope.getter;
    var search = function(obj, text){
      if (text.charAt(0) === '!') {
        return !search(obj, text.substr(1));
      }
      switch (typeof obj) {
      case "boolean":
      case "number":
      case "string":
        return ('' + obj).toLowerCase().indexOf(text) > -1;
      case "object":
        for ( var objKey in obj) {
          if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
            return true;
          }
        }
        return false;
      case "array":
        for ( var i = 0; i < obj.length; i++) {
          if (search(obj[i], text)) {
            return true;
          }
        }
        return false;
      default:
        return false;
      }
    };
    switch (typeof expression) {
      case "boolean":
      case "number":
      case "string":
        expression = {$:expression};
      case "object":
        for (var key in expression) {
          if (key == '$') {
            (function(){
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(value, text);
              });
            })();
          } else {
            (function(){
              var path = key;
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(getter(value, path), text);
              });
            })();
          }
        }
        break;
      case "function":
        predicates.push(expression);
        break;
      default:
        return array;
    }
    var filtered = [];
    for ( var j = 0; j < array.length; j++) {
      var value = array[j];
      if (predicates.check(value)) {
        filtered.push(value);
      }
    }
    return filtered;
  },
  add:function(array, value) {
    array.push(_.isUndefined(value)? {} : value);
    return array;
  },
  count:function(array, condition) {
    if (!condition) return array.length;
    var fn = angular.Function.compile(condition);
    return _.reduce(array, 0, function(count, $){return count + (fn($)?1:0);});
  },
  orderBy:function(array, expression, descend) {
    function reverse(comp, descending) {
      return toBoolean(descending) ? 
          function(a,b){return comp(b,a);} : comp;
    }
    function compare(v1, v2){
      var t1 = typeof v1;
      var t2 = typeof v2;
      if (t1 == t2) {
        if (t1 == "string") v1 = v1.toLowerCase();
        if (t1 == "string") v2 = v2.toLowerCase();
        if (v1 === v2) return 0;
        return v1 < v2 ? -1 : 1;
      } else {
        return t1 < t2 ? -1 : 1;
      }
    }
    expression = _.isArray(expression) ? expression: [expression];
    expression = _.map(expression, function($){
      var descending = false;
      if (typeof $ == "string" && ($.charAt(0) == '+' || $.charAt(0) == '-')) {
        descending = $.charAt(0) == '-';
        $ = $.substring(1);
      }
      var get = $ ? angular.Function.compile($) : _.identity;
      return reverse(function(a,b){
        return compare(get(a),get(b));
      }, descending);
    });
    var comparator = function(o1, o2){
      for ( var i = 0; i < expression.length; i++) {
        var comp = expression[i](o1, o2);
        if (comp != 0) return comp;
      }
      return 0;
    };
    return _.clone(array).sort(reverse(comparator, descend));
  },
  orderByToggle:function(predicate, attribute) {
    var STRIP = /^([+|-])?(.*)/;
    var ascending = false;
    var index = -1;
    _.detect(predicate, function($, i){
      if ($ == attribute) {
        ascending = true;
        index = i;
        return true;
      }
      if (($.charAt(0)=='+'||$.charAt(0)=='-') && $.substring(1) == attribute) {
        ascending = $.charAt(0) == '+';
        index = i;
        return true;
      };
    });
    if (index >= 0) {
      predicate.splice(index, 1);
    }
    predicate.unshift((ascending ? "-" : "+") + attribute);
    return predicate;
  },
  orderByDirection:function(predicate, attribute, ascend, descend) {
    ascend = ascend || 'ng-ascend';
    descend = descend || 'ng-descend';
    var att = predicate[0] || '';
    var direction = true;
    if (att.charAt(0) == '-') {
      att = att.substring(1);
      direction = false;
    } else if(att.charAt(0) == '+') {
      att = att.substring(1);
    }
    return att == attribute ? (direction ? ascend : descend) : "";
  },
  merge:function(array, index, mergeValue) {
    var value = array[index];
    if (!value) {
      value = {};
      array[index] = value;
    }
    merge(mergeValue, value);
    return array;
  }
};
angular.String = {
  quote:function(string) {
    return '"' + string.replace(/\\/g, '\\\\').
                        replace(/"/g, '\\"').
                        replace(/\n/g, '\\n').
                        replace(/\f/g, '\\f').
                        replace(/\r/g, '\\r').
                        replace(/\t/g, '\\t').
                        replace(/\v/g, '\\v') +
             '"';
  },
  quoteUnicode:function(string) {
    var str = angular.String.quote(string);
    var chars = [];
    for ( var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      if (ch < 128) {
        chars.push(str.charAt(i));
      } else {
        var encode = "000" + ch.toString(16);
        chars.push("\\u" + encode.substring(encode.length - 4));
      }
    }
    return chars.join('');
  },
  toDate:function(string){
    var match;
    if (typeof string == 'string' && 
        (match = string.match(/^(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z$/))){
      var date = new Date(0);
      date.setUTCFullYear(match[1], match[2] - 1, match[3]);
      date.setUTCHours(match[4], match[5], match[6], 0);
      return date;
    }
    return string;
  }
};
angular.Date = {
    toString:function(date){
      function pad(n) { return n < 10 ? "0" + n : n; }
      return  (date.getUTCFullYear()) + '-' +
        pad(date.getUTCMonth() + 1) + '-' +
        pad(date.getUTCDate()) + 'T' +
        pad(date.getUTCHours()) + ':' +
        pad(date.getUTCMinutes()) + ':' +
        pad(date.getUTCSeconds()) + 'Z';
    }
  };
angular.Function = {
  compile:function(expression) {
    if (_.isFunction(expression)){
      return expression;
    } else if (expression){
      var scope = new Scope();
      return function($) {
        scope.state = $;
        return scope.eval(expression);
      };
    } else {
      return function($){return $;};
    }
  }
};

(function(){
  function extend(dst, src, names){
    _.extend(dst, src);
    _.each((names||[]), function(name){
      dst[name] = _[name];
    });
  };
  extend(angular.Global, {}, 
      ['extend', 'clone','isEqual', 
       'isElement', 'isArray', 'isFunction', 'isUndefined']);
  extend(angular.Collection, angular.Global, 
      ['each', 'map', 'reduce', 'reduceRight', 'detect', 
       'select', 'reject', 'all', 'any', 'include', 
       'invoke', 'pluck', 'max', 'min', 'sortBy', 
       'sortedIndex', 'toArray', 'size']);
  extend(angular.Array, angular.Collection, 
      ['first', 'last', 'compact', 'flatten', 'without', 
       'uniq', 'intersect', 'zip', 'indexOf', 'lastIndexOf']);
  extend(angular.Object, angular.Collection,
      ['keys', 'values']);
  extend(angular.String, angular.Global);
  extend(angular.Function, angular.Global,
      ['bind', 'bindAll', 'delay', 'defer', 'wrap', 'compose']);
})();// Copyright (C) 2009 BRAT Tech LLC
Binder = function(doc, widgetFactory, urlWatcher, config) {
  this.doc = doc;
  this.urlWatcher = urlWatcher;
  this.anchor = {};
  this.widgetFactory = widgetFactory;
  this.config = config || {};
  this.updateListeners = [];
};

Binder.parseBindings = function(string) {
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
};

Binder.hasBinding = function(string) {
  var bindings = Binder.parseBindings(string);
  return bindings.length > 1 || Binder.binding(bindings[0]) !== null;
};

Binder.binding = function(string) {
  var binding = string.replace(/\n/gm, ' ').match(/^\{\{(.*)\}\}$/);
  return binding ? binding[1] : null;
};


Binder.prototype.parseQueryString = function(query) {
  var params = {};
  query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,
      function (match, left, right) {
        if (left) params[decodeURIComponent(left)] = decodeURIComponent(right);
      });
  return params;
};

Binder.prototype.parseAnchor = function(url) {
  var self = this;
  url = url || this.urlWatcher.getUrl();

  var anchorIndex = url.indexOf('#');
  if (anchorIndex < 0) return;
  var anchor = url.substring(anchorIndex + 1);

  var anchorQuery = this.parseQueryString(anchor);
  jQuery.each(self.anchor, function(key, newValue) {
    delete self.anchor[key];
  });
  jQuery.each(anchorQuery, function(key, newValue) {
    self.anchor[key] = newValue;
  });
};

Binder.prototype.onUrlChange = function (url) {
  console.log("URL change detected", url);
  this.parseAnchor(url);
  this.updateView();
};

Binder.prototype.updateAnchor = function() {
  var url = this.urlWatcher.getUrl();
  var anchorIndex = url.indexOf('#');
  if (anchorIndex > -1)
    url = url.substring(0, anchorIndex);
  url += "#";
  var sep = '';
  for (var key in this.anchor) {
    var value = this.anchor[key];
    if (typeof value === 'undefined' || value === null) {
      delete this.anchor[key];
    } else {
      url += sep + encodeURIComponent(key);
      if (value !== true)
        url += "=" + encodeURIComponent(value);
      sep = '&';
    }
  }
  this.urlWatcher.setUrl(url);
  return url;
};

Binder.prototype.updateView = function() {
  var start = new Date().getTime();
  var scope = jQuery(this.doc).scope();
  scope.set("$invalidWidgets", []);
  scope.updateView();
  var end = new Date().getTime();
  this.updateAnchor();
  _.each(this.updateListeners, function(fn) {fn();});
};

Binder.prototype.docFindWithSelf = function(exp){
  var doc = jQuery(this.doc);
  var selection = doc.find(exp);
  if (doc.is(exp)){
    selection = selection.andSelf();
  }
  return selection;
};

Binder.prototype.executeInit = function() {
  this.docFindWithSelf("[ng-init]").each(function() {
    var jThis = jQuery(this);
    var scope = jThis.scope();
    try {
      scope.eval(jThis.attr('ng-init'));
    } catch (e) {
      alert("EVAL ERROR:\n" + jThis.attr('ng-init') + '\n' + toJson(e, true));
    }
  });
};

Binder.prototype.entity = function (scope) {
  this.docFindWithSelf("[ng-entity]").attr("ng-watch", function() {
    try {
      var jNode = jQuery(this);
      var decl = scope.entity(jNode.attr("ng-entity"));
      return decl + (jNode.attr('ng-watch') || "");
    } catch (e) {
      alert(e);
    }
  });
};

Binder.prototype.compile = function() {
  var jNode = jQuery(this.doc);
  var self = this;
  if (this.config.autoSubmit) {
    var submits = this.docFindWithSelf(":submit").not("[ng-action]");
    submits.attr("ng-action", "$save()");
    submits.not(":disabled").not("ng-bind-attr").attr("ng-bind-attr", '{disabled:"{{$invalidWidgets}}"}');
  }
  this.precompile(this.doc)(this.doc, jNode.scope(), "");
  this.docFindWithSelf("a[ng-action]").live('click', function (event) {
    var jNode = jQuery(this);
    try {
      jNode.scope().eval(jNode.attr('ng-action'));
      jNode.removeAttr('ng-error');
      jNode.removeClass("ng-exception");
    } catch (e) {
      jNode.addClass("ng-exception");
      jNode.attr('ng-error', toJson(e, true));
    }
    self.updateView();
    return false;
  });
};

Binder.prototype.translateBinding = function(node, parentPath, factories) {
  var path = parentPath.concat();
  var offset = path.pop();
  var parts = Binder.parseBindings(node.nodeValue);
  if (parts.length > 1 || Binder.binding(parts[0])) {
    var parent = node.parentNode;
    if (isLeafNode(parent)) {
      parent.setAttribute('ng-bind-template', node.nodeValue);
      factories.push({path:path, fn:function(node, scope, prefix) {
        return new BindUpdater(node, node.getAttribute('ng-bind-template'));
      }});
    } else {
      for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var binding = Binder.binding(part);
        var newNode;
        if (binding) {
          newNode = document.createElement("span");
          var jNewNode = jQuery(newNode);
          jNewNode.attr("ng-bind", binding);
          if (i === 0) {
            factories.push({path:path.concat(offset + i), fn:Binder.prototype.ng_bind});
          }
        } else if (msie && part.charAt(0) == ' ') {
          newNode = document.createElement("span");
          newNode.innerHTML = '&nbsp;' + part.substring(1);
        } else {
          newNode = document.createTextNode(part);
        }
        parent.insertBefore(newNode, node);
      }
    }
    parent.removeChild(node);
  }
};

Binder.prototype.precompile = function(root) {
  var factories = [];
  this.precompileNode(root, [], factories);
  return function (template, scope, prefix) {
    var len = factories.length;
    for (var i = 0; i < len; i++) {
      var factory = factories[i];
      var node = template;
      var path = factory.path;
      for (var j = 0; j < path.length; j++) {
        node = node.childNodes[path[j]];
      }
      try {
        scope.addWidget(factory.fn(node, scope, prefix));
      } catch (e) {
        alert(e);
      }
    }
  };
};

Binder.prototype.precompileNode = function(node, path, factories) {
  var nodeType = node.nodeType;
  if (nodeType == Node.TEXT_NODE) {
    this.translateBinding(node, path, factories);
    return;
  } else if (nodeType != Node.ELEMENT_NODE && nodeType != Node.DOCUMENT_NODE) {
    return;
  }

  if (!node.getAttribute) return;
  var nonBindable = node.getAttribute('ng-non-bindable');
  if (nonBindable || nonBindable === "") return;

  var attributes = node.attributes;
  if (attributes) {
    var bindings = node.getAttribute('ng-bind-attr');
    node.removeAttribute('ng-bind-attr');
    bindings = bindings ? fromJson(bindings) : {};
    var attrLen = attributes.length;
    for (var i = 0; i < attrLen; i++) {
      var attr = attributes[i];
      var attrName = attr.name;
      // http://www.glennjones.net/Post/809/getAttributehrefbug.htm
      var attrValue = msie && attrName == 'href' ?
                      decodeURI(node.getAttribute(attrName, 2)) : attr.value;
      if (Binder.hasBinding(attrValue)) {
        bindings[attrName] = attrValue;
      }
    }
    var json = toJson(bindings);
    if (json.length > 2) {
      node.setAttribute("ng-bind-attr", json);
    }
  }

  if (!node.getAttribute) console.log(node);
  var repeaterExpression = node.getAttribute('ng-repeat');
  if (repeaterExpression) {
    node.removeAttribute('ng-repeat');
    var precompiled = this.precompile(node);
    var view = document.createComment("ng-repeat: " + repeaterExpression);
    var parentNode = node.parentNode;
    parentNode.insertBefore(view, node);
    parentNode.removeChild(node);
    var template = function(childScope, prefix, i) {
      var clone = jQuery(node).clone();
      clone.css('display', '');
      clone.attr('ng-repeat-index', "" + i);
      clone.data('scope', childScope);
      precompiled(clone[0], childScope, prefix + i + ":");
      return clone;
    };
    factories.push({path:path, fn:function(node, scope, prefix) {
      return new RepeaterUpdater(jQuery(node), repeaterExpression, template, prefix);
    }});
    return;
  }

  if (node.getAttribute('ng-eval')) factories.push({path:path, fn:this.ng_eval});
  if (node.getAttribute('ng-bind')) factories.push({path:path, fn:this.ng_bind});
  if (node.getAttribute('ng-bind-attr')) factories.push({path:path, fn:this.ng_bind_attr});
  if (node.getAttribute('ng-hide')) factories.push({path:path, fn:this.ng_hide});
  if (node.getAttribute('ng-show')) factories.push({path:path, fn:this.ng_show});
  if (node.getAttribute('ng-class')) factories.push({path:path, fn:this.ng_class});
  if (node.getAttribute('ng-class-odd')) factories.push({path:path, fn:this.ng_class_odd});
  if (node.getAttribute('ng-class-even')) factories.push({path:path, fn:this.ng_class_even});
  if (node.getAttribute('ng-style')) factories.push({path:path, fn:this.ng_style});
  if (node.getAttribute('ng-watch')) factories.push({path:path, fn:this.ng_watch});
  var nodeName = node.nodeName;
  if ((nodeName == 'INPUT' ) ||
      nodeName == 'TEXTAREA' ||
      nodeName == 'SELECT' ||
      nodeName == 'BUTTON') {
    var self = this;
    factories.push({path:path, fn:function(node, scope, prefix) {
      node.name = prefix + node.name.split(":").pop();
      return self.widgetFactory.createController(jQuery(node), scope);
    }});
  }
  if (nodeName == 'OPTION') {
    var html = jQuery('<select/>').append(jQuery(node).clone()).html();
    if (!html.match(/<option(\s.*\s|\s)value\s*=\s*.*>.*<\/\s*option\s*>/gi)) {
      node.value = node.text;
    }
  }

  var children = node.childNodes;
  for (var k = 0; k < children.length; k++) {
    this.precompileNode(children[k], path.concat(k), factories);
  }
};

Binder.prototype.ng_eval = function(node) {
  return new EvalUpdater(node, node.getAttribute('ng-eval'));
};

Binder.prototype.ng_bind = function(node) {
  return new BindUpdater(node, "{{" + node.getAttribute('ng-bind') + "}}");
};

Binder.prototype.ng_bind_attr = function(node) {
  return new BindAttrUpdater(node, fromJson(node.getAttribute('ng-bind-attr')));
};

Binder.prototype.ng_hide = function(node) {
  return new HideUpdater(node, node.getAttribute('ng-hide'));
};

Binder.prototype.ng_show = function(node) {
  return new ShowUpdater(node, node.getAttribute('ng-show'));
};

Binder.prototype.ng_class = function(node) {
  return new ClassUpdater(node, node.getAttribute('ng-class'));
};

Binder.prototype.ng_class_even = function(node) {
  return new ClassEvenUpdater(node, node.getAttribute('ng-class-even'));
};

Binder.prototype.ng_class_odd = function(node) {
  return new ClassOddUpdater(node, node.getAttribute('ng-class-odd'));
};

Binder.prototype.ng_style = function(node) {
  return new StyleUpdater(node, node.getAttribute('ng-style'));
};

Binder.prototype.ng_watch = function(node, scope) {
  scope.watch(node.getAttribute('ng-watch'));
};
// Copyright (C) 2008,2009 BRAT Tech LLC

ControlBar = function (document, serverUrl) {
  this.document = document;
  this.serverUrl = serverUrl;
  this.window = window;
  this.callbacks = [];
};

ControlBar.prototype.bind = function () {
};

ControlBar.HTML =
  '<div>' +
    '<div class="ui-widget-overlay"></div>' +
    '<div id="ng-login" ng-non-bindable="true">' +
      '<div class="ng-login-container"></div>' +
    '</div>' +
  '</div>';

ControlBar.prototype.login = function (loginSubmitFn) {
  this.callbacks.push(loginSubmitFn);
  if (this.callbacks.length == 1) {
    this.doTemplate("/user_session/new.mini?return_url=" + encodeURIComponent(this.urlWithoutAnchor()));
  }
};

ControlBar.prototype.logout = function (loginSubmitFn) {
  this.callbacks.push(loginSubmitFn);
  if (this.callbacks.length == 1) {
    this.doTemplate("/user_session/do_destroy.mini");
  }
};

ControlBar.prototype.urlWithoutAnchor = function (path) {
  return this.window.location.href.split("#")[0];
};

ControlBar.prototype.doTemplate = function (path) {
  var self = this;
  var id = new Date().getTime();
  var url = this.urlWithoutAnchor();
  url += "#$iframe_notify=" + id;
  var iframeHeight = 330;
  var loginView = jQuery('<div style="overflow:hidden; padding:2px 0 0 0;"><iframe name="'+ url +'" src="'+this.serverUrl + path + '" width="500" height="'+ iframeHeight +'"/></div>');
  this.document.append(loginView);
  loginView.dialog({
    height:iframeHeight + 33, width:500,
    resizable: false, modal:true,
    title: 'Authentication: <a href="http://www.getangular.com"><tt>&lt;angular/&gt;</tt></a>'
  });
  nglr["_iframe_notify_" + id] = function() {
    loginView.dialog("destroy");
    loginView.remove();
    jQuery.each(self.callbacks, function(i, callback){
      callback();
    });
    self.callbacks = [];
  };
};

ControlBar.FORBIDEN =
  '<div ng-non-bindable="true" title="Permission Error:">' +
    'Sorry, you do not have permission for this!'+
  '</div>';

ControlBar.prototype.notAuthorized = function () {
  if (this.forbidenView) return;
  this.forbidenView = jQuery(ControlBar.FORBIDEN);
  this.forbidenView.dialog({bgiframe:true, height:70, modal:true});
};
// Copyright (C) 2009 BRAT Tech LLC

DataStore = function(post, users, anchor) {
  this.post = post;
  this.users = users;
  this._cache = {$collections:[]};
  this.anchor = anchor;
  this.bulkRequest = [];
};

DataStore.prototype.cache = function(document) {
  if (document.constructor != Model) {
    throw "Parameter must be an instance of Entity! " + toJson(document);
  }
  var key = document.$entity + '/' + document.$id;
  var cachedDocument = this._cache[key];
  if (cachedDocument) {
    Model.copyDirectFields(document, cachedDocument);
  } else {
    this._cache[key] = document;
    cachedDocument = document;
  }
  return cachedDocument;
};

DataStore.prototype.load = function(instance, id, callback, failure) {
  if (id && id !== '*') {
    var self = this;
    this._jsonRequest(["GET", instance.$entity + "/" + id], function(response) {
      instance.$loadFrom(response);
      instance.$migrate();
      var clone = instance.$$entity(instance);
      self.cache(clone);
      (callback||noop)(instance);
    }, failure);
  }
  return instance;
};

DataStore.prototype.loadMany = function(entity, ids, callback) {
  var self=this;
  var list = [];
  var callbackCount = 0;
  jQuery.each(ids, function(i, id){
    list.push(self.load(entity(), id, function(){
      callbackCount++;
      if (callbackCount == ids.length) {
        (callback||noop)(list);
      }
    }));
  });
  return list;
}

DataStore.prototype.loadOrCreate = function(instance, id, callback) {
  var self=this;
  return this.load(instance, id, callback, function(response){
    if (response.$status_code == 404) {
      instance.$id = id;
      (callback||noop)(instance);
    } else {
      throw response;
    }
  });
};

DataStore.prototype.loadAll = function(entity, callback) {
  var self = this;
  var list = [];
  list.$$accept = function(doc){
    return doc.$entity == entity.title;
  };
  this._cache.$collections.push(list);
  this._jsonRequest(["GET", entity.title], function(response) {
    var rows = response;
    for ( var i = 0; i < rows.length; i++) {
      var document = entity();
      document.$loadFrom(rows[i]);
      list.push(self.cache(document));
    }
    (callback||noop)(list);
  });
  return list;
};

DataStore.prototype.save = function(document, callback) {
  var self = this;
  var data = {};
  document.$saveTo(data);
  this._jsonRequest(["POST", "", data], function(response) {
    document.$loadFrom(response);
    var cachedDoc = self.cache(document);
    _.each(self._cache.$collections, function(collection){
      if (collection.$$accept(document)) {
        angular.Array.includeIf(collection, cachedDoc, true);
      }
    });
    if (document.$$anchor) {
      self.anchor[document.$$anchor] = document.$id;
    }
    if (callback)
      callback(document);
  });
};

DataStore.prototype.remove = function(document, callback) {
  var self = this;
  var data = {};
  document.$saveTo(data);
  this._jsonRequest(["DELETE", "", data], function(response) {
    delete self._cache[document.$entity + '/' + document.$id];
    _.each(self._cache.$collections, function(collection){
      for ( var i = 0; i < collection.length; i++) {
        var item = collection[i];
        if (item.$id == document.$id) {
          collection.splice(i, 1);
        }
      }
    });
    (callback||noop)(response);
  });
};

DataStore.prototype._jsonRequest = function(request, callback, failure) {
  request.$$callback = callback;
  request.$$failure = failure||function(response){
    throw response;
  };
  this.bulkRequest.push(request);
};

DataStore.prototype.flush = function() {
  if (this.bulkRequest.length === 0) return;
  var self = this;
  var bulkRequest = this.bulkRequest;
  this.bulkRequest = [];
  console.log('REQUEST:', bulkRequest);
  function callback(code, bulkResponse){
    console.log('RESPONSE[' + code + ']: ', bulkResponse);
    if(bulkResponse.$status_code == 401) {
      self.users.login(function(){
        self.post(bulkRequest, callback);
      });
    } else if(bulkResponse.$status_code) {
      alert(toJson(bulkResponse));
    } else {
      for ( var i = 0; i < bulkResponse.length; i++) {
        var response = bulkResponse[i];
        var request = bulkRequest[i];
        var code = response.$status_code;
        if(code) {
          if(code == 403) {
            self.users.notAuthorized();
          } else {
            request.$$failure(response);
          }
        } else {
          request.$$callback(response);
        }
      }
    }
  }
  this.post(bulkRequest, callback);
};

DataStore.prototype.saveScope = function(scope, callback) {
  var saveCounter = 1;
  function onSaveDone() {
    saveCounter--;
    if (saveCounter === 0 && callback)
      callback();
  }
  for(var key in scope) {
    var item = scope[key];
    if (item && item.$save == Model.prototype.$save) {
      saveCounter++;
      item.$save(onSaveDone);
    }
  }
  onSaveDone();
};

DataStore.prototype.query = function(type, query, arg, callback){
  var self = this;
  var queryList = [];
  queryList.$$accept = function(doc){
    return false;
  };
  this._cache.$collections.push(queryList);
  var request = type.title + '/' + query + '=' + arg;
  this._jsonRequest(["GET", request], function(response){
    var list = response;
    for(var i = 0; i < list.length; i++) {
      var document = new type().$loadFrom(list[i]);
      queryList.push(self.cache(document));
    }
    if (callback)
      callback(queryList);
  });
  return queryList;
};

DataStore.prototype.entities = function(callback) {
  var entities = [];
  var self = this;
  this._jsonRequest(["GET", "$entities"], function(response) {
    for (var entityName in response) {
      entities.push(self.entity(entityName));
    }
    entities.sort(function(a,b){return a.title > b.title ? 1 : -1;});
    if (callback) callback(entities);
  });
  return entities;
};

DataStore.prototype.documentCountsByUser = function(){
  var counts = {};
  var self = this;
  self.post([["GET", "$users"]], function(code, response){
    jQuery.each(response[0], function(key, value){
      counts[key] = value;
    });
  });
  return counts;
};

DataStore.prototype.userDocumentIdsByEntity = function(user){
  var ids = {};
  var self = this;
  self.post([["GET", "$users/" + user]], function(code, response){
    jQuery.each(response[0], function(key, value){
      ids[key] = value;
    });
  });
  return ids;
};

DataStore.NullEntity = function(){};
DataStore.NullEntity.all = function(){return [];};
DataStore.NullEntity.query = function(){return [];};
DataStore.NullEntity.load = function(){return {};};
DataStore.NullEntity.title = undefined;

DataStore.prototype.entity = function(name, defaults){
  if (!name) {
    return DataStore.NullEntity;
  }
  var self = this;
  var entity =  function(initialState){
    return new Model(entity, initialState);
  };
  // entity.name does not work as name seems to be reserved for functions
  entity.title = name;
  entity.$$factory = true;
  entity.datastore = this;
  entity.defaults = defaults || {};
  entity.load = function(id, callback){
    return self.load(entity(), id, callback);
  };
  entity.loadMany = function(ids, callback){
    return self.loadMany(entity, ids, callback);
  };
  entity.loadOrCreate = function(id, callback){
    return self.loadOrCreate(entity(), id, callback);
  };
  entity.all = function(callback){
    return self.loadAll(entity, callback);
  };
  entity.query = function(query, queryArgs, callback){
    return self.query(entity, query, queryArgs, callback);
  };
  entity.properties = function(callback) {
    self._jsonRequest(["GET", name + "/$properties"], callback);
  };
  return entity;
};

DataStore.prototype.join = function(join){
  var fn = function(){
    throw "Joined entities can not be instantiated into a document.";
  };
  function base(name){return name ? name.substring(0, name.indexOf('.')) : undefined;}
  function next(name){return name.substring(name.indexOf('.') + 1);}
  var joinOrder = _(join).chain().
    map(function($, name){
      return name;}).
    sortBy(function(name){
      var path = [];
      do {
        if (_(path).include(name)) throw "Infinite loop in join: " + path.join(" -> ");
        path.push(name);
        if (!join[name]) throw _("Named entity '<%=name%>' is undefined.").template({name:name});
        name = base(join[name].on);
      } while(name);
      return path.length;
    }).
    value();
  if (_(joinOrder).select(function($){return join[$].on;}).length != joinOrder.length - 1)
    throw "Exactly one entity needs to be primary.";
  fn.query = function(exp, value) {
    var joinedResult = [];
    var baseName = base(exp);
    if (baseName != joinOrder[0]) throw _("Named entity '<%=name%>' is not a primary entity.").template({name:baseName});
    var Entity = join[baseName].join;
    var joinIndex = 1;
    Entity.query(next(exp), value, function(result){
      var nextJoinName = joinOrder[joinIndex++];
      var nextJoin = join[nextJoinName];
      var nextJoinOn = nextJoin.on;
      var joinIds = {};
      _(result).each(function(doc){
        var row = {};
        joinedResult.push(row);
        row[baseName] = doc;
        var id = Scope.getter(row, nextJoinOn);
        joinIds[id] = id;
      });
      nextJoin.join.loadMany(_.toArray(joinIds), function(result){
        var byId = {};
        _(result).each(function(doc){
          byId[doc.$id] = doc;
        });
        _(joinedResult).each(function(row){
          var id = Scope.getter(row, nextJoinOn);
          row[nextJoinName] = byId[id];
        });
      });
    });
    return joinedResult;
  };
  return fn;
};
// Copyright (C) 2009 BRAT Tech LLC

angular.filter.Meta = function(obj){
  if (obj) {
    for ( var key in obj) {
      this[key] = obj[key];
    }
  }
};
angular.filter.Meta.get = function(obj, attr){
  attr = attr || 'text';
  switch(typeof obj) {
  case "string":
    return attr == "text" ? obj : undefined;
  case "object":
    if (obj && typeof obj[attr] !== "undefined") {
      return obj[attr];
    }
    return undefined;
  default:
    return obj;
  }
};

angular.filter.currency = function(amount){
  jQuery(this.element).toggleClass('ng-format-negative', amount < 0);
  return '$' + angular.filter.number.apply(this, [amount, 2]);
};

angular.filter.number = function(amount, fractionSize){
  if (isNaN(amount) || !isFinite(amount)) {
    return '';
  }
  fractionSize = typeof fractionSize == 'undefined' ? 2 : fractionSize;
  var isNegative = amount < 0;
  amount = Math.abs(amount);
  var pow = Math.pow(10, fractionSize);
  var text = "" + Math.round(amount * pow);
  var whole = text.substring(0, text.length - fractionSize);
  whole = whole || '0';
  var frc = text.substring(text.length - fractionSize);
  text = isNegative ? '-' : '';
  for (var i = 0; i < whole.length; i++) {
    if ((whole.length - i)%3 === 0 && i !== 0) {
      text += ',';
    }
    text += whole.charAt(i);
  }
  if (fractionSize > 0) {
    for (var j = frc.length; j < fractionSize; j++) {
      frc += '0';
    }
    text += '.' + frc.substring(0, fractionSize);
  }
  return text;
};

angular.filter.date = function(amount) {
};

angular.filter.json = function(object) {
  jQuery(this.element).addClass("ng-monospace");
  return toJson(object, true);
};

angular.filter.trackPackage = function(trackingNo, noMatch) {
  trackingNo = trim(trackingNo);
  var tNo = trackingNo.replace(/ /g, '');
  var MATCHERS = angular.filter.trackPackage.MATCHERS;
  for ( var i = 0; i < MATCHERS.length; i++) {
    var carrier = MATCHERS[i];
    for ( var j = 0; j < carrier.regexp.length; j++) {
      var regexp = carrier.regexp[j];
      if (regexp.test(tNo)) {
        var text = carrier.name + ": " + trackingNo;
        var url = carrier.url + trackingNo;
        return new angular.filter.Meta({
          text:text,
          url:url,
          html: '<a href="' + escapeAttr(url) + '">' + text + '</a>',
          trackingNo:trackingNo});
      }
    }
  }
  if (trackingNo)
    return noMatch ||
      new angular.filter.Meta({text:trackingNo + " is not recognized"});
  else
    return null;
};

angular.filter.trackPackage.MATCHERS = [
    { name: "UPS",
      url: "http://wwwapps.ups.com/WebTracking/processInputRequest?sort_by=status&tracknums_displayed=1&TypeOfInquiryNumber=T&loc=en_US&track.x=0&track.y=0&InquiryNumber1=",
      regexp: [
        /^1Z[0-9A-Z]{16}$/i]},
    { name: "FedEx",
      url: "http://www.fedex.com/Tracking?tracknumbers=",
      regexp: [
        /^96\d{10}?$/i,
        /^96\d{17}?$/i,
        /^96\d{20}?$/i,
        /^\d{15}$/i,
        /^\d{12}$/i]},
    { name: "USPS",
      url: "http://trkcnfrm1.smi.usps.com/PTSInternetWeb/InterLabelInquiry.do?origTrackNum=",
      regexp: [
        /^(91\d{20})$/i,
        /^(91\d{18})$/i]}];

angular.filter.link = function(obj, title) {
  var text = title || angular.filter.Meta.get(obj);
  var url = angular.filter.Meta.get(obj, "url") || angular.filter.Meta.get(obj);
  if (url) {
    if (angular.validator.email(url) === null) {
      url = "mailto:" + url;
    }
    var html = '<a href="' + escapeHtml(url) + '">' + text + '</a>';
    return new angular.filter.Meta({text:text, url:url, html:html});
  }
  return obj;
};


angular.filter.bytes = function(size) {
  if(size === null) return "";

  var suffix = 0;
  while (size > 1000) {
    size = size / 1024;
    suffix++;
  }
  var txt = "" + size;
  var dot = txt.indexOf('.');
  if (dot > -1 && dot + 2 < txt.length) {
    txt = txt.substring(0, dot + 2);
  }
  return txt + " " + angular.filter.bytes.SUFFIX[suffix];
};
angular.filter.bytes.SUFFIX = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

angular.filter.image = function(obj, width, height) {
  if (obj && obj.url) {
    var style = "";
    if (width) {
      style = ' style="max-width: ' + width +
              'px; max-height: ' + (height || width) + 'px;"';
    }
    return new angular.filter.Meta({url:obj.url, text:obj.url,
      html:'<img src="'+obj.url+'"' + style + '/>'});
  }
  return null;
};

angular.filter.lowercase = function (obj) {
  var text = angular.filter.Meta.get(obj);
  return text ? ("" + text).toLowerCase() : text;
};

angular.filter.uppercase = function (obj) {
  var text = angular.filter.Meta.get(obj);
  return text ? ("" + text).toUpperCase() : text;
};

angular.filter.linecount = function (obj) {
  var text = angular.filter.Meta.get(obj);
  if (text==='' || !text) return 1;
  return text.split(/\n|\f/).length;
};

angular.filter['if'] = function (result, expression) {
  return expression ? result : undefined;
};

angular.filter.unless = function (result, expression) {
  return expression ? undefined : result;
};

angular.filter.googleChartApi = function(type, data, width, height) {
  data = data || {};
  var api = angular.filter.googleChartApi;
  var chart = {
      cht:type, 
      chco:api.collect(data, 'color'),
      chtt:api.title(data),
      chdl:api.collect(data, 'label'),
      chd:api.values(data),
      chf:'bg,s,FFFFFF00'
    };
  if (_.isArray(data.xLabels)) {
    chart.chxt='x';
    chart.chxl='0:|' + data.xLabels.join('|');
  }
  return angular.filter.googleChartApi.encode(chart, width, height);
};

angular.filter.googleChartApi.values = function(data){
  var seriesValues = [];
  _.each(data.series||[], function(serie){
    var values = [];
    _.each(serie.values||[], function(value){
      values.push(value);
    });
    seriesValues.push(values.join(','));
  });
  var values = seriesValues.join('|');
  return values === "" ? null : "t:" + values;
};

angular.filter.googleChartApi.title = function(data){
  var titles = [];
  var title = data.title || [];
  _.each(_.isArray(title)?title:[title], function(text){
    titles.push(encodeURIComponent(text));
  });
  return titles.join('|');
};

angular.filter.googleChartApi.collect = function(data, key){
  var outterValues = [];
  var count = 0;
  _.each(data.series||[], function(serie){
    var innerValues = [];
    var value = serie[key] || [];
    _.each(_.isArray(value)?value:[value], function(color){
        innerValues.push(encodeURIComponent(color));
        count++;
      });
    outterValues.push(innerValues.join('|'));
  });
  return count?outterValues.join(','):null;
};

angular.filter.googleChartApi.encode= function(params, width, height) {
  width = width || 200;
  height = height || width;
  var url = "http://chart.apis.google.com/chart?";
  var urlParam = [];
  params.chs = width + "x" + height;
  for ( var key in params) {
    var value = params[key];
    if (value) {
      urlParam.push(key + "=" + value);
    }
  }
  urlParam.sort();
  url += urlParam.join("&");
  return new angular.filter.Meta({url:url, text:value,
    html:'<img width="' + width + '" height="' + height + '" src="'+url+'"/>'});
};

angular.filter.qrcode = function(value, width, height) {
  return angular.filter.googleChartApi.encode({cht:'qr', chl:encodeURIComponent(value)}, width, height);
};
angular.filter.chart = {
  pie:function(data, width, height) {
    return angular.filter.googleChartApi('p', data, width, height);
  },
  pie3d:function(data, width, height) {
    return angular.filter.googleChartApi('p3', data, width, height);
  },
  pieConcentric:function(data, width, height) {
    return angular.filter.googleChartApi('pc', data, width, height);
  },
  barHorizontalStacked:function(data, width, height) {
    return angular.filter.googleChartApi('bhs', data, width, height);
  },
  barHorizontalGrouped:function(data, width, height) {
    return angular.filter.googleChartApi('bhg', data, width, height);
  },
  barVerticalStacked:function(data, width, height) {
    return angular.filter.googleChartApi('bvs', data, width, height);
  },
  barVerticalGrouped:function(data, width, height) {
    return angular.filter.googleChartApi('bvg', data, width, height);
  },
  line:function(data, width, height) {
    return angular.filter.googleChartApi('lc', data, width, height);
  },
  sparkline:function(data, width, height) {
    return angular.filter.googleChartApi('ls', data, width, height);
  },
  scatter:function(data, width, height) {
    return angular.filter.googleChartApi('s', data, width, height);
  }
};

angular.filter.html = function(html){
  return new angular.filter.Meta({html:html});
};
array = [].constructor;

toJson = function(obj, pretty){
  var buf = [];
  toJsonArray(buf, obj, pretty ? "\n  " : null);
  return buf.join('');
};

toPrettyJson = function(obj) {
  return toJson(obj, true);
};

fromJson = function(json) {
  try {
    var parser = new Parser(json, true);
    var expression =  parser.primary();
    parser.assertAllConsumed();
    return expression();
  } catch (e) {
    console.error("fromJson error: ", json, e);
    throw e;
  }
};


toJsonArray = function(buf, obj, pretty){
  var type = typeof obj;
  if (obj === null) {
    buf.push("null");
  } else if (type === 'function') {
    return;
  } else if (type === 'boolean') {
    buf.push('' + obj);
  } else if (type === 'number') {
    if (isNaN(obj)) {
      buf.push('null');
    } else {
      buf.push('' + obj);
    }
  } else if (type === 'string') {
    return buf.push(angular.String.quoteUnicode(obj));
  } else if (type === 'object') {
    if (obj instanceof Array) {
      buf.push("[");
      var len = obj.length;
      var sep = false;
      for(var i=0; i<len; i++) {
        var item = obj[i];
        if (sep) buf.push(",");
        if (typeof item == 'function' || typeof item == 'undefined') {
          buf.push("null");
        } else {
          toJsonArray(buf, item, pretty);
        }
        sep = true;
      }
      buf.push("]");
    } else if (obj instanceof Date) {
      buf.push(angular.String.quoteUnicode(angular.Date.toString(obj)));
    } else {
      buf.push("{");
      if (pretty) buf.push(pretty);
      var comma = false;
      var childPretty = pretty ? pretty + "  " : false;
      var keys = [];
      for(var k in obj) {
        if (k.indexOf('$$') === 0)
          continue;
        keys.push(k);
      }
      keys.sort();
      for ( var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        var key = keys[keyIndex];
        try {
          var value = obj[key];
          if (typeof value != 'function') {
            if (comma) {
              buf.push(",");
              if (pretty) buf.push(pretty);
            }
            buf.push(angular.String.quote(key));
            buf.push(":");
            toJsonArray(buf, value, childPretty);
            comma = true;
          }
        } catch (e) {
        }
      }
      buf.push("}");
    }
  }
};
// Copyright (C) 2009 BRAT Tech LLC

// Single $ is special and does not get searched
// Double $$ is special an is client only (does not get sent to server)

Model = function(entity, initial) {
  this.$$entity = entity;
  this.$loadFrom(initial||{});
  this.$entity = entity.title;
  this.$migrate();
};

Model.copyDirectFields = function(src, dst) {
  if (src === dst || !src || !dst) return;
  var isDataField = function(src, dst, field) {
    return (field.substring(0,2) !== '$$') &&
        (typeof src[field] !== 'function') &&
        (typeof dst[field] !== 'function');
  };
  for (var field in dst) {
    if (isDataField(src, dst, field))
      delete dst[field];
  }
  for (field in src) {
    if (isDataField(src, dst, field))
      dst[field] = src[field];
  }
};

Model.prototype.$migrate = function() {
  merge(this.$$entity.defaults, this);
  return this;
};

Model.prototype.$merge = function(other) {
  merge(other, this);
  return this;
};

Model.prototype.$save = function(callback) {
  this.$$entity.datastore.save(this, callback === true ? undefined : callback);
  if (callback === true) this.$$entity.datastore.flush();
  return this;
};

Model.prototype.$delete = function(callback) {
  this.$$entity.datastore.remove(this, callback === true ? undefined : callback);
  if (callback === true) this.$$entity.datastore.flush();
  return this;
};

Model.prototype.$loadById = function(id, callback) {
  this.$$entity.datastore.load(this, id, callback);
  return this;
};

Model.prototype.$loadFrom = function(other) {
  Model.copyDirectFields(other, this);
  return this;
};

Model.prototype.$saveTo = function(other) {
  Model.copyDirectFields(this, other);
  return this;
};
Lexer = function(text, parsStrings){
  this.text = text;
  // UTC dates have 20 characters, we send them through parser
  this.dateParseLength = parsStrings ? 20 : -1;
  this.tokens = [];
  this.index = 0;
};

Lexer.OPERATORS = {
    'null':function(self){return null;},
    'true':function(self){return true;},
    'false':function(self){return false;},
    '+':function(self, a,b){return (a||0)+(b||0);},
    '-':function(self, a,b){return (a||0)-(b||0);},
    '*':function(self, a,b){return a*b;},
    '/':function(self, a,b){return a/b;},
    '%':function(self, a,b){return a%b;},
    '^':function(self, a,b){return a^b;},
    '=':function(self, a,b){return self.scope.set(a, b);},
    '==':function(self, a,b){return a==b;},
    '!=':function(self, a,b){return a!=b;},
    '<':function(self, a,b){return a<b;},
    '>':function(self, a,b){return a>b;},
    '<=':function(self, a,b){return a<=b;},
    '>=':function(self, a,b){return a>=b;},
    '&&':function(self, a,b){return a&&b;},
    '||':function(self, a,b){return a||b;},
    '&':function(self, a,b){return a&b;},
//    '|':function(self, a,b){return a|b;},
    '|':function(self, a,b){return b(self, a);},
    '!':function(self, a){return !a;}
};

Lexer.prototype.peek = function() {
  if (this.index + 1 < this.text.length) {
    return this.text.charAt(this.index + 1);
  } else {
    return false;
  }
};

Lexer.prototype.parse = function() {
  var tokens = this.tokens;
  var OPERATORS = Lexer.OPERATORS;
  var canStartRegExp = true;
  while (this.index < this.text.length) {
    var ch = this.text.charAt(this.index);
    if (ch == '"' || ch == "'") {
      this.readString(ch);
      canStartRegExp = true;
    } else if (ch == '(' || ch == '[') {
      tokens.push({index:this.index, text:ch});
      this.index++;
    } else if (ch == '{' ) {
      var peekCh = this.peek();
      if (peekCh == ':' || peekCh == '(') {
        tokens.push({index:this.index, text:ch + peekCh});
        this.index++;
      } else {
        tokens.push({index:this.index, text:ch});
      }
      this.index++;
      canStartRegExp = true;
    } else if (ch == ')' || ch == ']' || ch == '}' ) {
      tokens.push({index:this.index, text:ch});
      this.index++;
      canStartRegExp = false;
    } else if ( ch == ':' || ch == '.' || ch == ',' || ch == ';') {
      tokens.push({index:this.index, text:ch});
      this.index++;
      canStartRegExp = true;
    } else if ( canStartRegExp && ch == '/' ) {
      this.readRegexp();
      canStartRegExp = false;
    } else if ( this.isNumber(ch) ) {
      this.readNumber();
      canStartRegExp = false;
    } else if (this.isIdent(ch)) {
      this.readIdent();
      canStartRegExp = false;
    } else if (this.isWhitespace(ch)) {
      this.index++;
    } else {
      var ch2 = ch + this.peek();
      var fn = OPERATORS[ch];
      var fn2 = OPERATORS[ch2];
      if (fn2) {
        tokens.push({index:this.index, text:ch2, fn:fn2});
        this.index += 2;
      } else if (fn) {
        tokens.push({index:this.index, text:ch, fn:fn});
        this.index += 1;
      } else {
        throw "Lexer Error: Unexpected next character [" +
            this.text.substring(this.index) +
            "] in expression '" + this.text +
            "' at column '" + (this.index+1) + "'.";
      }
      canStartRegExp = true;
    }
  }
  return tokens;
};

Lexer.prototype.isNumber = function(ch) {
  return '0' <= ch && ch <= '9';
};

Lexer.prototype.isWhitespace = function(ch) {
  return ch == ' ' || ch == '\r' || ch == '\t' ||
         ch == '\n' || ch == '\v';
};

Lexer.prototype.isIdent = function(ch) {
  return 'a' <= ch && ch <= 'z' ||
         'A' <= ch && ch <= 'Z' ||
         '_' == ch || ch == '$';
};

Lexer.prototype.readNumber = function() {
  var number = "";
  var start = this.index;
  while (this.index < this.text.length) {
    var ch = this.text.charAt(this.index);
    if (ch == '.' || this.isNumber(ch)) {
      number += ch;
    } else {
      break;
    }
    this.index++;
  }
  number = 1 * number;
  this.tokens.push({index:start, text:number,
    fn:function(){return number;}});
};

Lexer.prototype.readIdent = function() {
  var ident = "";
  var start = this.index;
  while (this.index < this.text.length) {
    var ch = this.text.charAt(this.index);
    if (ch == '.' || this.isIdent(ch) || this.isNumber(ch)) {
      ident += ch;
    } else {
      break;
    }
    this.index++;
  }
  var fn = Lexer.OPERATORS[ident];
  if (!fn) {
    fn = function(self){
      return self.scope.get(ident);
    };
    fn.isAssignable = ident;
  }
  this.tokens.push({index:start, text:ident, fn:fn});
};
Lexer.ESCAPE = {"n":"\n", "f":"\f", "r":"\r", "t":"\t", "v":"\v", "'":"'", '"':'"'};
Lexer.prototype.readString = function(quote) {
  var start = this.index;
  var dateParseLength = this.dateParseLength;
  this.index++;
  var string = "";
  var escape = false;
  while (this.index < this.text.length) {
    var ch = this.text.charAt(this.index);
    if (escape) {
      if (ch == 'u') {
        var hex = this.text.substring(this.index + 1, this.index + 5);
        this.index += 4;
        string += String.fromCharCode(parseInt(hex, 16));
      } else {
        var rep = Lexer.ESCAPE[ch];
        if (rep) {
          string += rep;
        } else {
          string += ch;
        }
      }
      escape = false;
    } else if (ch == '\\') {
      escape = true;
    } else if (ch == quote) {
      this.index++;
      this.tokens.push({index:start, text:string,
        fn:function(){
          return (string.length == dateParseLength) ?
            angular.String.toDate(string) : string;
        }});
      return;
    } else {
      string += ch;
    }
    this.index++;
  }
  throw "Lexer Error: Unterminated quote [" +
      this.text.substring(start) + "] starting at column '" +
      (start+1) + "' in expression '" + this.text + "'.";
};

Lexer.prototype.readRegexp = function(quote) {
  var start = this.index;
  this.index++;
  var regexp = "";
  var escape = false;
  while (this.index < this.text.length) {
    var ch = this.text.charAt(this.index);
    if (escape) {
      regexp += ch;
      escape = false;
    } else if (ch === '\\') {
      regexp += ch;
      escape = true;
    } else if (ch === '/') {
      this.index++;
      var flags = "";
      if (this.isIdent(this.text.charAt(this.index))) {
        this.readIdent();
        flags = this.tokens.pop().text;
      }
      var compiledRegexp = new RegExp(regexp, flags);
      this.tokens.push({index:start, text:regexp, flags:flags,
        fn:function(){return compiledRegexp;}});
      return;
    } else {
      regexp += ch;
    }
    this.index++;
  }
  throw "Lexer Error: Unterminated RegExp [" +
      this.text.substring(start) + "] starting at column '" +
      (start+1) + "' in expression '" + this.text + "'.";
};


Parser = function(text, parseStrings){
  this.text = text;
  this.tokens = new Lexer(text, parseStrings).parse();
  this.index = 0;
};

Parser.ZERO = function(){
  return 0;
};

Parser.prototype.error = function(msg, token) {
  throw "Token '" + token.text + 
    "' is " + msg + " at column='" + 
    (token.index + 1) + "' of expression '" + 
    this.text + "' starting at '" + this.text.substring(token.index) + "'.";
};

Parser.prototype.peekToken = function() {
  if (this.tokens.length === 0) 
    throw "Unexpected end of expression: " + this.text;
  return this.tokens[0];
};

Parser.prototype.peek = function(e1, e2, e3, e4) {
  var tokens = this.tokens;
  if (tokens.length > 0) {
    var token = tokens[0];
    var t = token.text;
    if (t==e1 || t==e2 || t==e3 || t==e4 ||
        (!e1 && !e2 && !e3 && !e4)) {
      return token;
    }
  }
  return false;
};

Parser.prototype.expect = function(e1, e2, e3, e4){
  var token = this.peek(e1, e2, e3, e4);
  if (token) {
    this.tokens.shift();
    this.currentToken = token;
    return token;
  }
  return false;
};

Parser.prototype.consume = function(e1){
  if (!this.expect(e1)) {
    var token = this.peek();
    throw "Expecting '" + e1 + "' at column '" +
        (token.index+1) + "' in '" +
        this.text + "' got '" +
        this.text.substring(token.index) + "'.";
  }
};

Parser.prototype._unary = function(fn, parse) {
  var right = parse.apply(this);
  return function(self) {
    return fn(self, right(self));
  };
};

Parser.prototype._binary = function(left, fn, parse) {
  var right = parse.apply(this);
  return function(self) {
    return fn(self, left(self), right(self));
  };
};

Parser.prototype.hasTokens = function () {
  return this.tokens.length > 0;
};

Parser.prototype.assertAllConsumed = function(){
  if (this.tokens.length !== 0) {
    throw "Did not understand '" + this.text.substring(this.tokens[0].index) +
        "' while evaluating '" + this.text + "'.";
  }
};

Parser.prototype.statements = function(){
  var statements = [];
  while(true) {
    if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
      statements.push(this.filterChain());
    if (!this.expect(';')) {
      return function (self){
        var value;
        for ( var i = 0; i < statements.length; i++) {
          var statement = statements[i];
          if (statement)
            value = statement(self);
        }
        return value;
      };
    }
  }
};

Parser.prototype.filterChain = function(){
  var left = this.expression();
  var token;
  while(true) {
    if ((token = this.expect('|'))) {
      left = this._binary(left, token.fn, this.filter);
    } else {
      return left;
    }
  }
};

Parser.prototype.filter = function(){
  return this._pipeFunction(angular.filter);
};

Parser.prototype.validator = function(){
  return this._pipeFunction(angular.validator);
};

Parser.prototype._pipeFunction = function(fnScope){
  var fn = this.functionIdent(fnScope);
  var argsFn = [];
  var token;
  while(true) {
    if ((token = this.expect(':'))) {
      argsFn.push(this.expression());
    } else {
      var fnInvoke = function(self, input){
        var args = [input];
        for ( var i = 0; i < argsFn.length; i++) {
          args.push(argsFn[i](self));
        }
        return fn.apply(self, args);
      };
      return function(){
        return fnInvoke;
      };
    }
  }
};

Parser.prototype.expression = function(){
  return this.throwStmt();
};

Parser.prototype.throwStmt = function(){
  if (this.expect('throw')) {
    var throwExp = this.assignment();
    return function (self) {
      throw throwExp(self);
    };
  } else {
   return this.assignment();
  }
};

Parser.prototype.assignment = function(){
  var left = this.logicalOR();
  var token;
  if (token = this.expect('=')) {
    if (!left.isAssignable) {
      throw "Left hand side '" +
          this.text.substring(0, token.index) + "' of assignment '" +
          this.text.substring(token.index) + "' is not assignable.";
    }
    var ident = function(){return left.isAssignable;};
    return this._binary(ident, token.fn, this.logicalOR);
  } else {
   return left;
  }
};

Parser.prototype.logicalOR = function(){
  var left = this.logicalAND();
  var token;
  while(true) {
    if ((token = this.expect('||'))) {
      left = this._binary(left, token.fn, this.logicalAND);
    } else {
      return left;
    }
  }
};

Parser.prototype.logicalAND = function(){
  var left = this.negated();
  var token;
  while(true) {
    if ((token = this.expect('&&'))) {
      left = this._binary(left, token.fn, this.negated);
    } else {
      return left;
    }
  }
};

Parser.prototype.negated = function(){
  var token;
  if (token = this.expect('!')) {
    return this._unary(token.fn, this.equality);
  } else {
   return this.equality();
  }
};

Parser.prototype.equality = function(){
  var left = this.relational();
  var token;
  while(true) {
    if ((token = this.expect('==','!='))) {
      left = this._binary(left, token.fn, this.relational);
    } else {
      return left;
    }
  }
};

Parser.prototype.relational = function(){
  var left = this.additive();
  var token;
  while(true) {
    if ((token = this.expect('<', '>', '<=', '>='))) {
      left = this._binary(left, token.fn, this.additive);
    } else {
      return left;
    }
  }
};

Parser.prototype.additive = function(){
  var left = this.multiplicative();
  var token;
  while(token = this.expect('+','-')) {
    left = this._binary(left, token.fn, this.multiplicative);
  }
  return left;
};

Parser.prototype.multiplicative = function(){
  var left = this.unary();
  var token;
  while(token = this.expect('*','/','%')) {
      left = this._binary(left, token.fn, this.unary);
  }
  return left;
};

Parser.prototype.unary = function(){
  var token;
  if (this.expect('+')) {
    return this.primary();
  } else if (token = this.expect('-')) {
    return this._binary(Parser.ZERO, token.fn, this.multiplicative);
  } else {
   return this.primary();
  }
};

Parser.prototype.functionIdent = function(fnScope) {
  var token = this.expect();
  var element = token.text.split('.');
  var instance = fnScope;
  var key;
  for ( var i = 0; i < element.length; i++) {
    key = element[i];
    if (instance)
      instance = instance[key];
  }
  if (typeof instance != 'function') {
    throw "Function '" + token.text + "' at column '" +
    (token.index+1)  + "' in '" + this.text + "' is not defined.";
  }
  return instance;
};

Parser.prototype.primary = function() {
  var primary;
  if (this.expect('(')) {
    var expression = this.filterChain();
    this.consume(')');
    primary = expression;
  } else if (this.expect('[')) {
    primary = this.arrayDeclaration();
  } else if (this.expect('{')) {
    primary = this.object();
  } else if (this.expect('{:')) {
    primary = this.closure(false);
  } else if (this.expect('{(')) {
    primary = this.closure(true);
  } else {
    var token = this.expect();
    primary = token.fn;
    if (!primary) {
      this.error("not a primary expression", token);
    }
  }
  var next;
  while (next = this.expect('(', '[', '.')) {
    if (next.text === '(') {
      primary = this.functionCall(primary);
    } else if (next.text === '[') {
      primary = this.objectIndex(primary);
    } else if (next.text === '.') {
      primary = this.fieldAccess(primary);
    } else {
      throw "IMPOSSIBLE";
    }
  }
  return primary;
};

Parser.prototype.closure = function(hasArgs) {
  var args = [];
  if (hasArgs) {
    if (!this.expect(')')) {
      args.push(this.expect().text);
      while(this.expect(',')) {
        args.push(this.expect().text);
      }
      this.consume(')');
    }
    this.consume(":");
  }
  var statements = this.statements();
  this.consume("}");
  return function(self){
    return function($){
      var scope = new Scope(self.scope.state);
      scope.set('$', $);
      for ( var i = 0; i < args.length; i++) {
        scope.set(args[i], arguments[i]);
      }
      return statements({scope:scope});
    };
  };
};

Parser.prototype.fieldAccess = function(object) {
  var field = this.expect().text;
  var fn = function (self){
    return Scope.getter(object(self), field);
  };
  fn.isAssignable = field;
  return fn;
};

Parser.prototype.objectIndex = function(obj) {
  var indexFn = this.expression();
  this.consume(']');
  if (this.expect('=')) {
    var rhs = this.expression();
    return function (self){
      return obj(self)[indexFn(self)] = rhs(self);
    };
  } else {
    return function (self){
      var o = obj(self);
      var i = indexFn(self);
      return (o) ? o[i] : undefined;
    };
  }
};

Parser.prototype.functionCall = function(fn) {
  var argsFn = [];
  if (this.peekToken().text != ')') {
    do {
      argsFn.push(this.expression());
    } while (this.expect(','));
  }
  this.consume(')');
  return function (self){
    var args = [];
    for ( var i = 0; i < argsFn.length; i++) {
      args.push(argsFn[i](self));
    }
    var fnPtr = fn(self);
    if (typeof fnPtr === 'function') {
      return fnPtr.apply(self, args);
    } else {
      throw "Expression '" + fn.isAssignable + "' is not a function.";
    }
  };
};

// This is used with json array declaration
Parser.prototype.arrayDeclaration = function () {
  var elementFns = [];
  if (this.peekToken().text != ']') {
    do {
      elementFns.push(this.expression());
    } while (this.expect(','));
  }
  this.consume(']');
  return function (self){
    var array = [];
    for ( var i = 0; i < elementFns.length; i++) {
      array.push(elementFns[i](self));
    }
    return array;
  };
};

Parser.prototype.object = function () {
  var keyValues = [];
  if (this.peekToken().text != '}') {
    do {
      var key = this.expect().text;
      this.consume(":");
      var value = this.expression();
      keyValues.push({key:key, value:value});
    } while (this.expect(','));
  }
  this.consume('}');
  return function (self){
    var object = {};
    for ( var i = 0; i < keyValues.length; i++) {
      var keyValue = keyValues[i];
      var value = keyValue.value(self);
      object[keyValue.key] = value;
    }
    return object;
  };
};

Parser.prototype.entityDeclaration = function () {
  var decl = [];
  while(this.hasTokens()) {
    decl.push(this.entityDecl());
    if (!this.expect(';')) {
      this.assertAllConsumed();
    }
  }
  return function (self){
    var code = "";
    for ( var i = 0; i < decl.length; i++) {
      code += decl[i](self);
    }
    return code;
  };
};

Parser.prototype.entityDecl = function () {
  var entity = this.expect().text;
  var instance;
  var defaults;
  if (this.expect('=')) {
    instance = entity;
    entity = this.expect().text;
  }
  if (this.expect(':')) {
    defaults = this.primary()(null);
  }
  return function(self) {
    var datastore = self.scope.get('$datastore');
    var Entity = datastore.entity(entity, defaults);
    self.scope.set(entity, Entity);
    if (instance) {
      var document = Entity();
      document.$$anchor = instance;
      self.scope.set(instance, document);
      return "$anchor." + instance + ":{" + 
          instance + "=" + entity + ".load($anchor." + instance + ");" +
          instance + ".$$anchor=" + angular.String.quote(instance) + ";" + 
        "};";
    } else {
      return "";
    }
  };
};

Parser.prototype.watch = function () {
  var decl = [];
  while(this.hasTokens()) {
    decl.push(this.watchDecl());
    if (!this.expect(';')) {
      this.assertAllConsumed();
    }
  }
  this.assertAllConsumed();
  return function (self){
    for ( var i = 0; i < decl.length; i++) {
      var d = decl[i](self);
      self.addListener(d.name, d.fn);
    }
  };
};

Parser.prototype.watchDecl = function () {
  var anchorName = this.expect().text;
  this.consume(":");
  var expression;
  if (this.peekToken().text == '{') {
    this.consume("{");
    expression = this.statements();
    this.consume("}");
  } else {
    expression = this.expression();
  }
  return function(self) {
    return {name:anchorName, fn:expression};
  };
};


// Copyright (C) 2009 BRAT Tech LLC

Scope = function(initialState, name) {
  this.widgets = [];
  this.watchListeners = {};
  this.name = name;
  initialState = initialState || {};
  var State = function(){};
  State.prototype = initialState;
  this.state = new State();
  this.state.$parent = initialState;
  if (name == "ROOT") {
    this.state.$root = this.state;
  }
};

Scope.expressionCache = {};

Scope.prototype.updateView = function() {
  var self = this;
  this.fireWatchers();
  _.each(this.widgets, function(widget){
    self.evalWidget(widget, "", {}, function(){
      this.updateView(self);
    });
  });
};

Scope.prototype.addWidget = function(controller) {
  if (controller) this.widgets.push(controller);
};

Scope.prototype.isProperty = function(exp) {
  for ( var i = 0; i < exp.length; i++) {
    var ch = exp.charAt(i);
    if (ch!='.'  && !Lexer.prototype.isIdent(ch)) {
      return false;
    }
  }
  return true;
};

Scope.getter = function(instance, path) {
  if (!path) return instance;
  var element = path.split('.');
  var key;
  var lastInstance = instance;
  var len = element.length;
  for ( var i = 0; i < len; i++) {
    key = element[i];
    if (!key.match(/^[\$\w][\$\w\d]*$/))
        throw "Expression '" + path + "' is not a valid expression for accesing variables.";
    if (instance) {
      lastInstance = instance;
      instance = instance[key];
    }
    if (_.isUndefined(instance)  && key.charAt(0) == '$') {
      var type = angular.Global.typeOf(lastInstance);
      type = angular[type.charAt(0).toUpperCase()+type.substring(1)];
      var fn = type ? type[[key.substring(1)]] : undefined;
      if (fn) {
        instance = _.bind(fn, lastInstance, lastInstance);
        return instance;
      }
    }
  }
  if (typeof instance === 'function' && !instance.$$factory) {
    return bind(lastInstance, instance);
  }
  return instance;
};

Scope.prototype.get = function(path) {
  return Scope.getter(this.state, path);
};

Scope.prototype.set = function(path, value) {
  var element = path.split('.');
  var instance = this.state;
  for ( var i = 0; element.length > 1; i++) {
    var key = element.shift();
    var newInstance = instance[key];
    if (!newInstance) {
      newInstance = {};
      instance[key] = newInstance;
    }
    instance = newInstance;
  }
  instance[element.shift()] = value;
  return value;
};

Scope.prototype.setEval = function(expressionText, value) {
  this.eval(expressionText + "=" + toJson(value));
};

Scope.prototype.eval = function(expressionText, context) {
  var expression = Scope.expressionCache[expressionText];
  if (!expression) {
    var parser = new Parser(expressionText);
    expression = parser.statements();
    parser.assertAllConsumed();
    Scope.expressionCache[expressionText] = expression;
  }
  context = context || {};
  context.scope = this;
  return expression(context);
};

//TODO: Refactor. This function needs to be an execution closure for widgets
// move to widgets
// remove expression, just have inner closure.
Scope.prototype.evalWidget = function(widget, expression, context, onSuccess, onFailure) {
  try {
    var value = this.eval(expression, context);
    if (widget.hasError) {
      widget.hasError = false;
      jQuery(widget.view).
        removeClass('ng-exception').
        removeAttr('ng-error');
    }
    if (onSuccess) {
      value = onSuccess.apply(widget, [value]);
    }
    return true;
  } catch (e){
    console.error('Eval Widget Error:', e);
    var jsonError = toJson(e, true);
    widget.hasError = true;
    jQuery(widget.view).
      addClass('ng-exception').
      attr('ng-error', jsonError);
    if (onFailure) {
      onFailure.apply(widget, [e, jsonError]);
    }
    return false;
  }
};

Scope.prototype.validate = function(expressionText, value) {
  var expression = Scope.expressionCache[expressionText];
  if (!expression) {
    expression = new Parser(expressionText).validator();
    Scope.expressionCache[expressionText] = expression;
  }
  var self = {scope:this};
  return expression(self)(self, value);
};

Scope.prototype.entity = function(entityDeclaration) {
  var expression = new Parser(entityDeclaration).entityDeclaration();
  return expression({scope:this});
};

Scope.prototype.markInvalid = function(widget) {
  this.state.$invalidWidgets.push(widget);
};

Scope.prototype.watch = function(declaration) {
  var self = this;
  new Parser(declaration).watch()({
    scope:this,
    addListener:function(watch, exp){
      self.addWatchListener(watch, function(n,o){
        try {
          return exp({scope:self}, n, o);
        } catch(e) {
          alert(e);
        }
      });
    }
  });
};

Scope.prototype.addWatchListener = function(watchExpression, listener) {
  var watcher = this.watchListeners[watchExpression];
  if (!watcher) {
    watcher = {listeners:[], expression:watchExpression};
    this.watchListeners[watchExpression] = watcher;
  }
  watcher.listeners.push(listener);
};

Scope.prototype.fireWatchers = function() {
  var self = this;
  var fired = false;
  jQuery.each(this.watchListeners, function(name, watcher) {
    var value = self.eval(watcher.expression);
    if (value !== watcher.lastValue) {
      jQuery.each(watcher.listeners, function(i, listener){
        listener(value, watcher.lastValue);
        fired = true;
      });
      watcher.lastValue = value;
    }
  });
  return fired;
};
// Copyright (C) 2008,2009 BRAT Tech LLC

Server = function(url, getScript) {
  this.url = url;
  this.nextId = 0;
  this.getScript = getScript;
  this.uuid = "_" + ("" + Math.random()).substr(2) + "_";
  this.maxSize = 1800;
};

Server.prototype.base64url = function(txt) {
  return Base64.encode(txt);
};

Server.prototype.request = function(method, url, request, callback) {
  var requestId = this.uuid + (this.nextId++);
  nglr[requestId] = function(response) {
    delete nglr[requestId];
    callback(200, response);
  };
  var payload = {u:url, m:method, p:request};
  payload = this.base64url(toJson(payload));
  var totalPockets = Math.ceil(payload.length / this.maxSize);
  var baseUrl = this.url + "/$/" + requestId +  "/" + totalPockets + "/";
  for ( var pocketNo = 0; pocketNo < totalPockets; pocketNo++) {
    var pocket = payload.substr(pocketNo * this.maxSize, this.maxSize);
    this.getScript(baseUrl + (pocketNo+1) + "?h=" + pocket, noop);
  }
};

FrameServer = function(frame) {
  this.frame = frame;
};
FrameServer.PREFIX = "$DATASET:";

FrameServer.prototype = {
  read:function(){
    this.data = fromJson(this.frame.name.substr(FrameServer.PREFIX.length));
  },
  write:function(){
    this.frame.name = FrameServer.PREFIX +  toJson(this.data);
  }, 
  request: function(method, url, request, callback) {
    //alert(method + " " + url + " " + toJson(request) + " " + toJson(callback));
  }
};


VisualServer = function(delegate, status, update) {
  this.delegate = delegate;
  this.update = update;
  this.status = status;
};

VisualServer.prototype = {
  request:function(method, url, request, callback) {
    var self = this;
    this.status.beginRequest(request);
    this.delegate.request(method, url, request, function() {
      self.status.endRequest();
      try {
        callback.apply(this, arguments);
      } catch (e) {
        alert(toJson(e));
      }
      self.update();
    });
  }
};
// Copyright (C) 2008,2009 BRAT Tech LLC
Users = function(server, controlBar) {
  this.server = server;
  this.controlBar = controlBar;
};

Users.prototype = {
  fetchCurrentUser:function(callback) {
    var self = this;
    this.server.request("GET", "/account.json", {}, function(code, response){
      self.current = response.user;
      callback(response.user);
    });
  },
  
  logout: function(callback) {
    var self = this;
    this.controlBar.logout(function(){
      delete self.current;
      (callback||noop)();
    });
  },
  
  login: function(callback) {
    var self = this;
    this.controlBar.login(function(){
      self.fetchCurrentUser(function(){
        (callback||noop)();
      });
    });
  },

  notAuthorized: function(){
    this.controlBar.notAuthorized();
  }
};
// Copyright (C) 2009 BRAT Tech LLC

angular.validator.regexp = function(value, regexp, msg) {
  if (!value.match(regexp)) {
    return msg ||
      "Value does not match expected format " + regexp + ".";
  } else {
    return null;
  }
};

angular.validator.number = function(value, min, max) {
  var num = 1 * value;
  if (num == value) {
    if (typeof min != 'undefined' && num < min) {
      return "Value can not be less than " + min + ".";
    }
    if (typeof min != 'undefined' && num > max) {
      return "Value can not be greater than " + max + ".";
    }
    return null;
  } else {
    return "Value is not a number.";
  }
};

angular.validator.integer = function(value, min, max) {
  var number = angular.validator.number(value, min, max);
  if (number === null && value != Math.round(value)) {
    return "Value is not a whole number.";
  }
  return number;
};

angular.validator.date = function(value, min, max) {
  if (value.match(/^\d\d?\/\d\d?\/\d\d\d\d$/)) {
    return null;
  }
  return "Value is not a date. (Expecting format: 12/31/2009).";
};

angular.validator.ssn = function(value) {
  if (value.match(/^\d\d\d-\d\d-\d\d\d\d$/)) {
    return null;
  }
  return "SSN needs to be in 999-99-9999 format.";
};

angular.validator.email = function(value) {
  if (value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) {
    return null;
  }
  return "Email needs to be in username@host.com format.";
};

angular.validator.phone = function(value) {
  if (value.match(/^1\(\d\d\d\)\d\d\d-\d\d\d\d$/)) {
    return null;
  }
  if (value.match(/^\+\d{2,3} (\(\d{1,5}\))?[\d ]+\d$/)) {
    return null;
  }
  return "Phone number needs to be in 1(987)654-3210 format in North America or +999 (123) 45678 906 internationaly.";
};

angular.validator.url = function(value) {
  if (value.match(/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/)) {
    return null;
  }
  return "URL needs to be in http://server[:port]/path format.";
};

angular.validator.json = function(value) {
  try {
    fromJson(value);
    return null;
  } catch (e) {
    return e.toString();
  }
};
// Copyright (C) 2009 BRAT Tech LLC


WidgetFactory = function(serverUrl, database) {
  this.nextUploadId = 0;
  this.serverUrl = serverUrl;
  this.database = database;
  this.createSWF = swfobject.createSWF;
  this.onChangeListener = function(){};
};

WidgetFactory.prototype.createController = function(input, scope) {
  var controller;
  var type = input.attr('type').toLowerCase();
  var exp = input.attr('name');
  if (exp) exp = exp.split(':').pop();
  var event = "change";
  var bubbleEvent = true;
  if (type == 'button' || type == 'submit' || type == 'reset' || type == 'image') {
    controller = new ButtonController(input[0], exp);
    event = "click";
    bubbleEvent = false;
  } else if (type == 'text' || type == 'textarea' || type == 'hidden' || type == 'password') {
    controller = new TextController(input[0], exp);
    event = "keyup change";
  } else if (type == 'checkbox') {
    controller = new CheckboxController(input[0], exp);
    event = "click";
  } else if (type == 'radio') {
    controller = new RadioController(input[0], exp);
    event="click";
  } else if (type == 'select-one') {
    controller = new SelectController(input[0], exp);
  } else if (type == 'select-multiple') {
    controller = new MultiSelectController(input[0], exp);
  } else if (type == 'file') {
    controller = this.createFileController(input, exp);
  } else {
    throw 'Unknown type: ' + type;
  }
  input.data('controller', controller);
  var binder = scope.get('$binder');
  var action = function() {
    if (controller.updateModel(scope)) {
      var action = jQuery(controller.view).attr('ng-action') || "";
      if (scope.evalWidget(controller, action)) {
        binder.updateView(scope);
      }
    }
    return bubbleEvent;
  };
  jQuery(controller.view, ":input").
    bind(event, action);
  return controller;
};

WidgetFactory.prototype.createFileController = function(fileInput) {
  var uploadId = '__uploadWidget_' + (this.nextUploadId++);
  var view = FileController.template(uploadId);
  fileInput.after(view);
  var att = {
      data:this.serverUrl + "/admin/ServerAPI.swf",
      width:"95", height:"20", align:"top",
      wmode:"transparent"};
  var par = {
      flashvars:"uploadWidgetId=" + uploadId,
      allowScriptAccess:"always"};
  var swfNode = this.createSWF(att, par, uploadId);
  fileInput.remove();
  var cntl = new FileController(view, fileInput[0].name, swfNode, this.serverUrl + "/data/" + this.database);
  jQuery(swfNode).data('controller', cntl);
  return cntl;
};

WidgetFactory.prototype.createTextWidget = function(textInput) {
  var controller = new TextController(textInput);
  controller.onChange(this.onChangeListener);
  return controller;
};

/////////////////////
// FileController
///////////////////////

FileController = function(view, scopeName, uploader, databaseUrl) {
  this.view = view;
  this.uploader = uploader;
  this.scopeName = scopeName;
  this.attachmentsPath = databaseUrl + '/_attachments';
  this.value = null;
  this.lastValue = undefined;
};

FileController.dispatchEvent = function(id, event, args) {
  var object = document.getElementById(id);
  var controller = jQuery(object).data("controller");
  FileController.prototype['_on_' + event].apply(controller, args);
};

FileController.template = function(id) {
  return jQuery('<span class="ng-upload-widget">' +
      '<input type="checkbox" ng-non-bindable="true"/>' +
      '<object id="' + id + '" />' +
      '<a></a>' +
      '<span/>' +
    '</span>');
};

FileController.prototype._on_cancel = function() {
};

FileController.prototype._on_complete = function() {
};

FileController.prototype._on_httpStatus = function(status) {
  alert("httpStatus:" + this.scopeName + " status:" + status);
};

FileController.prototype._on_ioError = function() {
  alert("ioError:" + this.scopeName);
};

FileController.prototype._on_open = function() {
  alert("open:" + this.scopeName);
};

FileController.prototype._on_progress = function(bytesLoaded, bytesTotal) {
};

FileController.prototype._on_securityError = function() {
  alert("securityError:" + this.scopeName);
};

FileController.prototype._on_uploadCompleteData = function(data) {
  var value = fromJson(data);
  value.url = this.attachmentsPath + '/' + value.id + '/' + value.text;
  this.view.find("input").attr('checked', true);
  var scope = this.view.scope();
  this.value = value;
  this.updateModel(scope);
  this.value = null;
  scope.get('$binder').updateView();
};

FileController.prototype._on_select = function(name, size, type) {
  this.name = name;
  this.view.find("a").text(name).attr('href', name);
  this.view.find("span").text(angular.filter.bytes(size));
  this.upload();
};

FileController.prototype.updateModel = function(scope) {
  var isChecked = this.view.find("input").attr('checked');
  var value = isChecked ? this.value : null;
  if (this.lastValue === value) {
    return false;
  } else {
    scope.set(this.scopeName, value);
    return true;
  }
};

FileController.prototype.updateView = function(scope) {
  var modelValue = scope.get(this.scopeName);
  if (modelValue && this.value !== modelValue) {
    this.value = modelValue;
    this.view.find("a").
      attr("href", this.value.url).
      text(this.value.text);
    this.view.find("span").text(angular.filter.bytes(this.value.size));
  }
  this.view.find("input").attr('checked', !!modelValue);
};

FileController.prototype.upload = function() {
  if (this.name) {
    this.uploader.uploadFile(this.attachmentsPath);
  }
};


///////////////////////
// NullController
///////////////////////
NullController = function(view) {this.view = view;};
NullController.prototype.updateModel = function() { return true; };
NullController.prototype.updateView = function() { };
NullController.instance = new NullController();


///////////////////////
// ButtonController
///////////////////////
ButtonController = function(view) {this.view = view;};
ButtonController.prototype.updateModel = function(scope) { return true; };
ButtonController.prototype.updateView = function(scope) {};

///////////////////////
// TextController
///////////////////////
TextController = function(view, exp) {
  this.view = view;
  this.exp = exp;
  this.validator = view.getAttribute('ng-validate');
  this.required = typeof view.attributes['ng-required'] != "undefined";
  this.lastErrorText = null;
  this.lastValue = undefined;
  this.initialValue = view.value;
  var widget = view.getAttribute('ng-widget');
  if (widget === 'datepicker') {
    jQuery(view).datepicker();
  }
};

TextController.prototype.updateModel = function(scope) {
  var value = this.view.value;
  if (this.lastValue === value) {
    return false;
  } else {
    scope.setEval(this.exp, value);
    this.lastValue = value;
    return true;
  }
};

TextController.prototype.updateView = function(scope) {
  var view = this.view;
  var value = scope.get(this.exp);
  if (typeof value === "undefined") {
    value = this.initialValue;
    scope.setEval(this.exp, value);
  }
  value = value ? value : '';
  if (this.lastValue != value) {
    view.value = value;
    this.lastValue = value;
  }
  var isValidationError = false;
  view.removeAttribute('ng-error');
  if (this.required) {
    isValidationError = !(value && value.length > 0);
  }
  var errorText = isValidationError ? "Required Value" : null;
  if (!isValidationError && this.validator && value) {
    errorText = scope.validate(this.validator, value);
    isValidationError = !!errorText;
  }
  if (this.lastErrorText !== errorText) {
    this.lastErrorText = isValidationError;
    if (errorText !== null) {
      view.setAttribute('ng-error', errorText);
      scope.markInvalid(this);
    }
    jQuery(view).toggleClass('ng-validation-error', isValidationError);
  }
};

///////////////////////
// CheckboxController
///////////////////////
CheckboxController = function(view, exp) {
  this.view = view;
  this.exp = exp;
  this.lastValue = undefined;
  this.initialValue = view.checked ? view.value : "";
};

CheckboxController.prototype.updateModel = function(scope) {
  var input = this.view;
  var value = input.checked ? input.value : '';
  if (this.lastValue === value) {
    return false;
  } else {
    scope.setEval(this.exp, value);
    this.lastValue = value;
    return true;
  }
};

CheckboxController.prototype.updateView = function(scope) {
  var input = this.view;
  var value = scope.eval(this.exp);
  if (typeof value === "undefined") {
    value = this.initialValue;
    scope.setEval(this.exp, value);
  }
  input.checked = input.value == (''+value);
};

///////////////////////
// SelectController
///////////////////////
SelectController = function(view, exp) {
  this.view = view;
  this.exp = exp;
  this.lastValue = undefined;
  this.initialValue = view.value;
};

SelectController.prototype.updateModel = function(scope) {
  var input = this.view;
  if (input.selectedIndex < 0) {
    scope.setEval(this.exp, null);
  } else {
    var value = this.view.value;
    if (this.lastValue === value) {
      return false;
    } else {
      scope.setEval(this.exp, value);
      this.lastValue = value;
      return true;
    }
  }
};

SelectController.prototype.updateView = function(scope) {
  var input = this.view;
  var value = scope.get(this.exp);
  if (typeof value === 'undefined') {
    value = this.initialValue;
    scope.setEval(this.exp, value);
  }
  if (value !== this.lastValue) {
    input.value = value ? value : "";
    this.lastValue = value;
  }
};

///////////////////////
// MultiSelectController
///////////////////////
MultiSelectController = function(view, exp) {
  this.view = view;
  this.exp = exp;
  this.lastValue = undefined;
  this.initialValue = this.selected();
};

MultiSelectController.prototype.selected = function () {
  var value = [];
  var options = this.view.options;
  for ( var i = 0; i < options.length; i++) {
    var option = options[i];
    if (option.selected) {
      value.push(option.value);
    }
  }
  return value;
};

MultiSelectController.prototype.updateModel = function(scope) {
  var value = this.selected();
  // TODO: This is wrong! no caching going on here as we are always comparing arrays
  if (this.lastValue === value) {
    return false;
  } else {
    scope.setEval(this.exp, value);
    this.lastValue = value;
    return true;
  }
};

MultiSelectController.prototype.updateView = function(scope) {
  var input = this.view;
  var selected = scope.get(this.exp);
  if (typeof selected === "undefined") {
    selected = this.initialValue;
    scope.setEval(this.exp, selected);
  }
  if (selected !== this.lastValue) {
    var options = input.options;
    for ( var i = 0; i < options.length; i++) {
      var option = options[i];
      option.selected = _.include(selected, option.value);
    }
    this.lastValue = selected;
  }
};

///////////////////////
// RadioController
///////////////////////
RadioController = function(view, exp) {
  this.view = view;
  this.exp = exp;
  this.lastChecked = undefined;
  this.lastValue = undefined;
  this.inputValue = view.value;
  this.initialValue = view.checked ? view.value : null;
};

RadioController.prototype.updateModel = function(scope) {
  var input = this.view;
  if (this.lastChecked) {
    return false;
  } else {
    input.checked = true;
    this.lastValue = scope.setEval(this.exp, this.inputValue);
    this.lastChecked = true;
    return true;
  }
};

RadioController.prototype.updateView = function(scope) {
  var input = this.view;
  var value = scope.get(this.exp);
  if (this.initialValue && typeof value === "undefined") {
    value = this.initialValue;
    scope.setEval(this.exp, value);
  }
  if (this.lastValue != value) {
    this.lastChecked = input.checked = this.inputValue == (''+value);
    this.lastValue = value;
  }
};

///////////////////////
//ElementController
///////////////////////
BindUpdater = function(view, exp) {
  this.view = view;
  this.exp = Binder.parseBindings(exp);
  this.hasError = false;
  this.scopeSelf = {element:view};
};

BindUpdater.toText = function(obj) {
  var e = escapeHtml;
  switch(typeof obj) {
    case "string":
    case "boolean":
    case "number":
      return e(obj);
    case "function":
      return BindUpdater.toText(obj());
    case "object":
      if (isNode(obj)) {
        return outerHTML(obj);
      } else if (obj instanceof angular.filter.Meta) {
        switch(typeof obj.html) {
          case "string":
          case "number":
            return obj.html;
          case "function":
            return obj.html();
          case "object":
            if (isNode(obj.html))
              return outerHTML(obj.html);
          default:
            break;
        }
        switch(typeof obj.text) {
          case "string":
          case "number":
            return e(obj.text);
          case "function":
            return e(obj.text());
          default:
            break;
        }
      }
      if (obj === null)
        return "";
      return e(toJson(obj, true));
    default:
      return "";
  }
};

BindUpdater.prototype.updateModel = function(scope) {};
BindUpdater.prototype.updateView = function(scope) {
  var html = [];
  var parts = this.exp;
  var length = parts.length;
  for(var i=0; i<length; i++) {
    var part = parts[i];
    var binding = Binder.binding(part);
    if (binding) {
      scope.evalWidget(this, binding, this.scopeSelf, function(value){
        html.push(BindUpdater.toText(value));
      }, function(e, text){
        setHtml(this.view, text);
      });
      if (this.hasError) {
        return;
      }
    } else {
      html.push(escapeHtml(part));
    }
  }
  setHtml(this.view, html.join(''));
};

BindAttrUpdater = function(view, attrs) {
  this.view = view;
  this.attrs = attrs;
};

BindAttrUpdater.prototype.updateModel = function(scope) {};
BindAttrUpdater.prototype.updateView = function(scope) {
  var jNode = jQuery(this.view);
  var attributeTemplates = this.attrs;
  if (this.hasError) {
    this.hasError = false;
    jNode.
      removeClass('ng-exception').
      removeAttr('ng-error');
  }
  var isImage = jNode.is('img');
  for (var attrName in attributeTemplates) {
    var attributeTemplate = Binder.parseBindings(attributeTemplates[attrName]);
    var attrValues = [];
    for ( var i = 0; i < attributeTemplate.length; i++) {
      var binding = Binder.binding(attributeTemplate[i]);
      if (binding) {
        try {
          var value = scope.eval(binding, {element:jNode[0], attrName:attrName});
          if (value && (value.constructor !== array || value.length !== 0))
            attrValues.push(value);
        } catch (e) {
          this.hasError = true;
          console.error('BindAttrUpdater', e);
          var jsonError = toJson(e, true);
          attrValues.push('[' + jsonError + ']');
          jNode.
            addClass('ng-exception').
            attr('ng-error', jsonError);
        }
      } else {
        attrValues.push(attributeTemplate[i]);
      }
    }
    var attrValue = attrValues.length ? attrValues.join('') : null;
    if(isImage && attrName == 'src' && !attrValue)
      attrValue = scope.get('config.server') + '/images/blank.gif';
    jNode.attr(attrName, attrValue);
  }
};

EvalUpdater = function(view, exp) {
  this.view = view;
  this.exp = exp;
  this.hasError = false;
};
EvalUpdater.prototype.updateModel = function(scope) {};
EvalUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp);
};

HideUpdater = function(view, exp) { this.view = view; this.exp = exp; };
HideUpdater.prototype.updateModel = function(scope) {};
HideUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp, {}, function(hideValue){
    var view = jQuery(this.view);
    if (toBoolean(hideValue)) {
      view.hide();
    } else {
      view.show();
    }
  });
};

ShowUpdater = function(view, exp) { this.view = view; this.exp = exp; };
ShowUpdater.prototype.updateModel = function(scope) {};
ShowUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp, {}, function(hideValue){
    var view = jQuery(this.view);
    if (toBoolean(hideValue)) {
      view.show();
    } else {
      view.hide();
    }
  });
};

ClassUpdater = function(view, exp) { this.view = view; this.exp = exp; };
ClassUpdater.prototype.updateModel = function(scope) {};
ClassUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp, {}, function(classValue){
    if (classValue !== null && classValue !== undefined) {
      this.view.className = classValue;
    }
  });
};

ClassEvenUpdater = function(view, exp) { this.view = view; this.exp = exp; };
ClassEvenUpdater.prototype.updateModel = function(scope) {};
ClassEvenUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp, {}, function(classValue){
    var index = scope.get('$index');
    jQuery(this.view).toggleClass(classValue, index % 2 === 1);
  });
};

ClassOddUpdater = function(view, exp) { this.view = view; this.exp = exp; };
ClassOddUpdater.prototype.updateModel = function(scope) {};
ClassOddUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp, {}, function(classValue){
    var index = scope.get('$index');
    jQuery(this.view).toggleClass(classValue, index % 2 === 0);
  });
};

StyleUpdater = function(view, exp) { this.view = view; this.exp = exp; };
StyleUpdater.prototype.updateModel = function(scope) {};
StyleUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.exp, {}, function(styleValue){
    jQuery(this.view).attr('style', "").css(styleValue);
  });
};

///////////////////////
// RepeaterUpdater
///////////////////////
RepeaterUpdater = function(view, repeaterExpression, template, prefix) {
  this.view = view;
  this.template = template;
  this.prefix = prefix;
  this.children = [];
  var match = repeaterExpression.match(/^\s*(.+)\s+in\s+(.*)\s*$/);
  if (! match) {
    throw "Expected ng-repeat in form of 'item in collection' but got '" +
      repeaterExpression + "'.";
  }
  var keyValue = match[1];
  this.iteratorExp = match[2];
  match = keyValue.match(/^([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\)$/);
  if (!match) {
    throw "'item' in 'item in collection' should be identifier or (key, value) but get '" +
      keyValue + "'.";
  }
  this.valueExp = match[3] || match[1];
  this.keyExp = match[2];
};

RepeaterUpdater.prototype.updateModel = function(scope) {};
RepeaterUpdater.prototype.updateView = function(scope) {
  scope.evalWidget(this, this.iteratorExp, {}, function(iterator){
    var self = this;
    if (!iterator) {
      iterator = [];
      if (scope.isProperty(this.iteratorExp)) {
        scope.set(this.iteratorExp, iterator);
      }
    }
    var iteratorLength = iterator.length;
    var childrenLength = this.children.length;
    var cursor = this.view;
    var time = 0;
    var child = null;
    var keyExp = this.keyExp;
    var valueExp = this.valueExp;
    var i = 0;
    jQuery.each(iterator, function(key, value){
      if (i < childrenLength) {
        // reuse children
        child = self.children[i];
        child.scope.set(valueExp, value);
      } else {
        // grow children
        var name = self.prefix +
          valueExp + " in " + self.iteratorExp + "[" + i + "]";
        var childScope = new Scope(scope.state, name);
        childScope.set('$index', i);
        if (keyExp)
          childScope.set(keyExp, key);
        childScope.set(valueExp, value);
        child = { scope:childScope, element:self.template(childScope, self.prefix, i) };
        cursor.after(child.element);
        self.children.push(child);
      }
      cursor = child.element;
      var s = new Date().getTime();
      child.scope.updateView();
      time += new Date().getTime() - s;
      i++;
    });
    // shrink children
    for ( var r = childrenLength; r > iteratorLength; --r) {
      var unneeded = this.children.pop();
      unneeded.element.removeNode();
    }
    // Special case for option in select
    if (child && child.element[0].nodeName === "OPTION") {
      var select = jQuery(child.element[0].parentNode);
      var cntl = select.data('controller');
      if (cntl) {
        cntl.lastValue = undefined;
        cntl.updateView(scope);
      }
    }
  });
};

//////////////////////////////////
// PopUp
//////////////////////////////////

PopUp = function(doc) {
  this.doc = doc;
};

PopUp.OUT_EVENT = "mouseleave mouseout click dblclick keypress keyup";

PopUp.prototype.bind = function () {
  var self = this;
  this.doc.find('.ng-validation-error,.ng-exception').
    live("mouseover", PopUp.onOver);
};

PopUp.onOver = function(e) {
  PopUp.onOut();
  var jNode = jQuery(this);
  jNode.bind(PopUp.OUT_EVENT, PopUp.onOut);
  var position = jNode.position();
  var de = document.documentElement;
  var w = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
  var hasArea = w - position.left;
  var width = 300;
  var title = jNode.hasClass("ng-exception") ? "EXCEPTION:" : "Validation error...";
  var msg = jNode.attr("ng-error");

  var x;
  var arrowPos = hasArea>(width+75) ? "left" : "right";
  var tip = jQuery(
    "<div id='ng-callout' style='width:"+width+"px'>" +
      "<div class='ng-arrow-"+arrowPos+"'/>" +
      "<div class='ng-title'>"+title+"</div>" +
      "<div class='ng-content'>"+msg+"</div>" +
    "</div>");
  jQuery("body").append(tip);
  if(arrowPos === 'left'){
    x = position.left + this.offsetWidth + 11;
  }else{
    x = position.left - (width + 15);
    tip.find('.ng-arrow-right').css({left:width+1});
  }

  tip.css({left: x+"px", top: (position.top - 3)+"px"});
  return true;
};

PopUp.onOut = function() {
  jQuery('#ng-callout').
    unbind(PopUp.OUT_EVENT, PopUp.onOut).
    remove();
  return true;
};

//////////////////////////////////
// Status
//////////////////////////////////


Status = function(body) {
  this.loader = body.append(Status.DOM).find("#ng-loading");
  this.requestCount = 0;
};

Status.DOM ='<div id="ng-spacer"></div><div id="ng-loading">loading....</div>';

Status.prototype.beginRequest = function () {
  if (this.requestCount === 0) {
    this.loader.show();
  }
  this.requestCount++;
};

Status.prototype.endRequest = function () {
  this.requestCount--;
  if (this.requestCount === 0) {
    this.loader.hide("fold");
  }
};
})(window, document);