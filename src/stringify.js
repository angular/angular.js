'use strict';

/* global: toDebugString: true */

function serializeObject(obj) {
  return JSON.stringify(decycleObject(obj), toJsonReplacer);
}

function toDebugString(obj) {
  if (typeof obj === 'function') {
    return obj.toString().replace(/ \{[\s\S]*$/, '');
  } else if (typeof obj === 'undefined') {
    return 'undefined';
  } else if (typeof obj !== 'string') {
    return serializeObject(obj);
  }
  return obj;
}

/**
 * Loops through object properties and detects circular references.
 * Detected circular references are replaced with '...'.
 *
 * @param {Object} object Object instance
 * @param {Array=} seen Private argument, leave it undefined (it is used internally for recursion)
 * @returns {Object} Simple representation of an object (plain object or array)
 */
function decycleObject(object, seen) {
  // make sure simple types are returned untouched
  if (!canContainCircularReference(object)) return object;

  // make sure to assign correct type of a safe object
  var safeObject = isArray(object) ? [] : {};

  // make local copy of the reference array to be sure
  // objects are referenced in straight line
  seen = seen ? seen.slice() : [];

  for (var key in object) {
    var property = object[key];

    if (canContainCircularReference(property)) {
      if (seen.indexOf(property) >= 0) {
        safeObject[key] = '...';
      } else {
        if (seen.indexOf(object) === -1) seen.push(object);
        safeObject[key] = decycleObject(property, seen);
      }
    } else {
      safeObject[key] = property;
    }
  }

  return safeObject;
}

/**
 * Check if passed object is an enumerable object and has at least one key
 *
 * @param {Object} object
 * @returns {Boolean}
 */
function canContainCircularReference(object) {
  if (isObject(object)) {
    for (var i in object) {
      return true;
    }
  }
  return false;
}
