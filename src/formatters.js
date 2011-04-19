/**
 * @workInProgress
 * @ngdoc overview
 * @name angular.formatter
 * @description
 *
 * Formatters are used for translating data formats between those used in for display and those used
 * for storage.
 *
 * Following is the list of built-in angular formatters:
 *
 * * {@link angular.formatter.boolean boolean} - Formats user input in boolean format
 * * {@link angular.formatter.index index} - Manages indexing into an HTML select widget
 * * {@link angular.formatter.json json} - Formats user input in JSON format
 * * {@link angular.formatter.list list} - Formats user input string as an array
 * * {@link angular.formatter.number} - Formats user input strings as a number
 * * {@link angular.formatter.trim} - Trims extras spaces from end of user input
 *
 * For more information about how angular formatters work, and how to create your own formatters,
 * see {@link guide/dev_guide.templates.formatters Understanding Angular Formatters} in the angular
 * Developer Guide.
 */

function formatter(format, parse) {return {'format':format, 'parse':parse || format};}
function toString(obj) {
  return (isDefined(obj) && obj !== null) ? "" + obj : obj;
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
 * @returns {?string} A JSON string representation of the model.
 *
 * @example
   <doc:example>
     <doc:source>
      <div ng:init="data={name:'misko', project:'angular'}">
        <input type="text" size='50' name="data" ng:format="json"/>
        <pre>data={{data}}</pre>
      </div>
     </doc:source>
     <doc:scenario>
      it('should format json', function(){
        expect(binding('data')).toEqual('data={\n  \"name\":\"misko\",\n  \"project\":\"angular\"}');
        input('data').enter('{}');
        expect(binding('data')).toEqual('data={\n  }');
      });
     </doc:scenario>
   </doc:example>
 */
angularFormatter.json = formatter(toJson, function(value){
  return fromJson(value || 'null');
});

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
   <doc:example>
     <doc:source>
        Enter truthy text:
        <input type="text" name="value" ng:format="boolean" value="no"/>
        <input type="checkbox" name="value"/>
        <pre>value={{value}}</pre>
     </doc:source>
     <doc:scenario>
        it('should format boolean', function(){
          expect(binding('value')).toEqual('value=false');
          input('value').enter('truthy');
          expect(binding('value')).toEqual('value=true');
        });
     </doc:scenario>
   </doc:example>
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
   <doc:example>
     <doc:source>
      Enter valid number:
      <input type="text" name="value" ng:format="number" value="1234"/>
      <pre>value={{value}}</pre>
     </doc:source>
     <doc:scenario>
      it('should format numbers', function(){
        expect(binding('value')).toEqual('value=1234');
        input('value').enter('5678');
        expect(binding('value')).toEqual('value=5678');
      });
     </doc:scenario>
   </doc:example>
 */
angularFormatter.number = formatter(toString, function(obj){
  if (obj == null || NUMBER.exec(obj)) {
    return obj===null || obj === '' ? null : 1*obj;
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
   <doc:example>
     <doc:source>
        Enter a list of items:
        <input type="text" name="value" ng:format="list" value=" chair ,, table"/>
        <input type="text" name="value" ng:format="list"/>
        <pre>value={{value}}</pre>
     </doc:source>
     <doc:scenario>
      it('should format lists', function(){
        expect(binding('value')).toEqual('value=["chair","table"]');
        this.addFutureAction('change to XYZ', function($window, $document, done){
          $document.elements('.doc-example-live :input:last').val(',,a,b,').trigger('change');
          done();
        });
        expect(binding('value')).toEqual('value=["a","b"]');
      });
     </doc:scenario>
   </doc:example>
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
   <doc:example>
     <doc:source>
        Enter text with leading/trailing spaces:
        <input type="text" name="value" ng:format="trim" value="  book  "/>
        <input type="text" name="value" ng:format="trim"/>
        <pre>value={{value|json}}</pre>
     </doc:source>
     <doc:scenario>
        it('should format trim', function(){
          expect(binding('value')).toEqual('value="book"');
          this.addFutureAction('change to XYZ', function($window, $document, done){
            $document.elements('.doc-example-live :input:last').val('  text  ').trigger('change');
            done();
          });
          expect(binding('value')).toEqual('value="text"');
        });
     </doc:scenario>
   </doc:example>
 */
angularFormatter.trim = formatter(
  function(obj) { return obj ? trim("" + obj) : ""; }
);

/**
 * @workInProgress
 * @ngdoc formatter
 * @name angular.formatter.index
 * @deprecated
 * @description
 * Index formatter is meant to be used with `select` input widget. It is useful when one needs
 * to select from a set of objects. To create pull-down one can iterate over the array of object
 * to build the UI. However  the value of the pull-down must be a string. This means that when on
 * object is selected form the pull-down, the pull-down value is a string which needs to be
 * converted back to an object. This conversion from string to on object is not possible, at best
 * the converted object is a copy of the original object. To solve this issue we create a pull-down
 * where the value strings are an index of the object in the array. When pull-down is selected the
 * index can be used to look up the original user object.
 *
 * @inputType select
 * @param {array} array to be used for selecting an object.
 * @returns {object} object which is located at the selected position.
 *
 * @example
   <doc:example>
     <doc:source>
        <script>
        function DemoCntl(){
          this.users = [
            {name:'guest', password:'guest'},
            {name:'user', password:'123'},
            {name:'admin', password:'abc'}
          ];
        }
        </script>
        <div ng:controller="DemoCntl">
          User:
          <select name="currentUser" ng:format="index:users">
            <option ng:repeat="user in users" value="{{$index}}">{{user.name}}</option>
          </select>
          <select name="currentUser" ng:format="index:users">
            <option ng:repeat="user in users" value="{{$index}}">{{user.name}}</option>
          </select>
          user={{currentUser.name}}<br/>
          password={{currentUser.password}}<br/>
     </doc:source>
     <doc:scenario>
        it('should retrieve object by index', function(){
          expect(binding('currentUser.password')).toEqual('guest');
          select('currentUser').option('2');
          expect(binding('currentUser.password')).toEqual('abc');
        });
     </doc:scenario>
   </doc:example>
 */
//TODO: delete me since this is replaced by ng:options
angularFormatter.index = formatter(
  function(object, array){
    return '' + indexOf(array || [], object);
  },
  function(index, array){
    return (array||[])[index];
  }
);
