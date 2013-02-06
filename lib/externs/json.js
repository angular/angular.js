/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for the JSON specification.
 * @see http://www.json.org/json2.js.
 * @externs
 */

// This cannot go into the COMMON externs because it conflicts with the pure
// JavaScript implementations of the API.

var JSON = {};

/**
 * @param {string} jsonStr The string to parse.
 * @param {(function(string, *) : *)=} opt_reviver
 * @return {*} The JSON object.
 * @throws {Error}
 * @nosideeffects
 */
JSON.parse = function(jsonStr, opt_reviver) {};

/**
 * @param {*} jsonObj Input object.
 * @param {(Array.<string>|(function(string, *) : *)|null)=} opt_replacer
 * @param {(number|string)=} opt_space
 * @return {string} JSON string which represents jsonObj.
 * @throws {Error}
 * @nosideeffects
 */
JSON.stringify = function(jsonObj, opt_replacer, opt_space) {};
