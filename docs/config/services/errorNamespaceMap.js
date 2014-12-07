"use strict";
var StringMap = require('stringmap');

/**
 * @dgService errorNamespaceMap
 * A map of error namespaces by name.
 */
module.exports = function errorNamespaceMap() {
  return new StringMap();
};