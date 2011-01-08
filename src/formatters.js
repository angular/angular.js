function formatter(format, parse) {return {'format':format, 'parse':parse || format};}
function toString(obj) {
  return (isDefined(obj) && obj !== _null) ? "" + obj : obj;
}

var NUMBER = /^\s*[-+]?\d*(\.\d*)?\s*$/;

angularFormatter.noop = formatter(identity, identity);

/**
 * @workInProgress
 * @ngdoc formatter
 * @name angular.formatter.json
 *
 * @description
 *   Formats the user input as JSON text.
 *
 * @returns {string} A JSON string representation of the model.
 *
 * @example
 * <div ng:init="data={name:'misko', project:'angular'}">
 *   <input type="text" size='50' name="data" ng:format="json"/>
 *   <pre>data={{data}}</pre>
 * </div>
 *
 * @scenario
 * it('should format json', function(){
 *   expect(binding('data')).toEqual('data={\n  \"name\":\"misko\",\n  \"project\":\"angular\"}');
 *   input('data').enter('{}');
 *   expect(binding('data')).toEqual('data={\n  }');
 * });
 */
angularFormatter.json = formatter(toJson, fromJson);

/**
 * @workInProgress
 * @ngdoc formatter
 * @name angular.formatter.boolean
 *
 * @description
 *   Use boolean formatter if you wish to store the data as boolean.
 *
 * @returns {boolean} Converts to `true` unless user enters (blank), `f`, `false`, `0`, `no`, `[]`.
 *
 * @example
 * Enter truthy text:
 * <input type="text" name="value" ng:format="boolean" value="no"/>
 * <input type="checkbox" name="value"/>
 * <pre>value={{value}}</pre>
 *
 * @scenario
 * it('should format boolean', function(){
 *   expect(binding('value')).toEqual('value=false');
 *   input('value').enter('truthy');
 *   expect(binding('value')).toEqual('value=true');
 * });
 */
angularFormatter['boolean'] = formatter(toString, toBoolean);

/**
 * @workInProgress
 * @ngdoc formatter
 * @name angular.formatter.number
 *
 * @description
 * Use number formatter if you wish to convert the user entered string to a number.
 *
 * @returns {number} Number from the parsed string.
 *
 * @example
 * Enter valid number:
 * <input type="text" name="value" ng:format="number" value="1234"/>
 * <pre>value={{value}}</pre>
 *
 * @scenario
 * it('should format numbers', function(){
 *   expect(binding('value')).toEqual('value=1234');
 *   input('value').enter('5678');
 *   expect(binding('value')).toEqual('value=5678');
 * });
 */
angularFormatter.number = formatter(toString, function(obj){
  if (obj == _null || NUMBER.exec(obj)) {
    return obj===_null || obj === '' ? _null : 1*obj;
  } else {
    throw "Not a number";
  }
});

/**
 * @workInProgress
 * @ngdoc formatter
 * @name angular.formatter.list
 *
 * @description
 * Use list formatter if you wish to convert the user entered string to an array.
 *
 * @returns {Array} Array parsed from the entered string.
 *
 * @example
 * Enter a list of items:
 * <input type="text" name="value" ng:format="list" value=" chair ,, table"/>
 * <input type="text" name="value" ng:format="list"/>
 * <pre>value={{value}}</pre>
 *
 * @scenario
 * it('should format lists', function(){
 *   expect(binding('value')).toEqual('value=["chair","table"]');
 *   this.addFutureAction('change to XYZ', function($window, $document, done){
 *     $document.elements('.doc-example :input:last').val(',,a,b,').trigger('change');
 *     done();
 *   });
 *   expect(binding('value')).toEqual('value=["a","b"]');
 * });
 */
angularFormatter.list = formatter(
  function(obj) { return obj ? obj.join(", ") : obj; },
  function(value) {
    var list = [];
    forEach((value || '').split(','), function(item){
      item = trim(item);
      if (item) list.push(item);
    });
    return list;
  }
);

/**
 * @workInProgress
 * @ngdoc formatter
 * @name angular.formatter.trim
 *
 * @description
 * Use trim formatter if you wish to trim extra spaces in user text.
 *
 * @returns {String} Trim excess leading and trailing space.
 *
 * @example
 * Enter text with leading/trailing spaces:
 * <input type="text" name="value" ng:format="trim" value="  book  "/>
 * <input type="text" name="value" ng:format="trim"/>
 * <pre>value={{value|json}}</pre>
 *
 * @scenario
 * it('should format trim', function(){
 *   expect(binding('value')).toEqual('value="book"');
 *   this.addFutureAction('change to XYZ', function($window, $document, done){
 *     $document.elements('.doc-example :input:last').val('  text  ').trigger('change');
 *     done();
 *   });
 *   expect(binding('value')).toEqual('value="text"');
 * });
 */
angularFormatter.trim = formatter(
  function(obj) { return obj ? trim("" + obj) : ""; }
);
