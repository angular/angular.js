/**
 * @ngdoc filter
 * @name angular.filter.currency
 * @function
 *
 * @description
 *   Formats a number as a currency (ie $1,234.56).
 *
 * @param {number} amount Input to filter.
 * @returns {string} Formated number.
 *
 * @css ng-format-negative
 *   When the value is negative, this css class is applied to the binding making it by default red.
 *
 * @example
 *   <input type="text" name="amount" value="1234.56"/> <br/>
 *   {{amount | currency}}
 *
 * @scenario
 *   it('should init with 1234.56', function(){
 *     expect(binding('amount')).toEqual('$1,234.56');
 *   });
 *   it('should update', function(){
 *     input('amount').enter('-1234');
 *     expect(binding('amount')).toEqual('$-1,234.00');
 *     // TODO: implement
 *     // expect(binding('amount')).toHaveColor('red');
 *   });
 */
angularFilter.currency = function(amount){
  this.$element.toggleClass('ng-format-negative', amount < 0);
  return '$' + angularFilter['number'].apply(this, [amount, 2]);
};

/**
 * @ngdoc filter
 * @name angular.filter.number
 * @function
 *
 * @description
 *   Formats a number as text.
 *
 *   If the input is not a number empty string is returned.
 *
 * @param {(number|string)} number Number to format.
 * @param {(number|string)=2} fractionSize Number of decimal places to round the number to. Default 2.
 * @returns {string} Number rounded to decimalPlaces and places a “,” after each third digit.
 *
 * @example
 *   <span ng:non-bindable="true">{{1234.56789|number}}</span>: {{1234.56789|number}}<br/>
 *   <span ng:non-bindable="true">{{1234.56789|number:0}}</span>: {{1234.56789|number:0}}<br/>
 *   <span ng:non-bindable="true">{{1234.56789|number:2}}</span>: {{1234.56789|number:2}}<br/>
 *   <span ng:non-bindable="true">{{-1234.56789|number:4}}</span>: {{-1234.56789|number:4}}
 *
 * @scenario
 *   it('should format numbers', function(){
 *     expect(binding('1234.56789|number')).toEqual('1,234.57');
 *     expect(binding('1234.56789|number:0')).toEqual('1,235');
 *     expect(binding('1234.56789|number:2')).toEqual('1,234.57');
 *     expect(binding('-1234.56789|number:4')).toEqual('-1,234.5679');
 *   });
 */
angularFilter.number = function(number, fractionSize){
  if (isNaN(number) || !isFinite(number)) {
    return '';
  }
  fractionSize = typeof fractionSize == $undefined ? 2 : fractionSize;
  var isNegative = number < 0;
  number = Math.abs(number);
  var pow = Math.pow(10, fractionSize);
  var text = "" + Math.round(number * pow);
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


function padNumber(num, digits, trim) {
  var neg = '';
  if (num < 0) {
    neg =  '-';
    num = -num;
  }
  num = '' + num;
  while(num.length < digits) num = '0' + num;
  if (trim)
    num = num.substr(num.length - digits);
  return neg + num;
}


function dateGetter(name, size, offset, trim) {
  return function(date) {
    var value = date['get' + name]();
    if (offset > 0 || value > -offset)
      value += offset;
    if (value === 0 && offset == -12 ) value = 12;
    return padNumber(value, size, trim);
  };
}


var DATE_FORMATS = {
  yyyy: dateGetter('FullYear', 4),
  yy:   dateGetter('FullYear', 2, 0, true),
  MM:   dateGetter('Month', 2, 1),
   M:   dateGetter('Month', 1, 1),
  dd:   dateGetter('Date', 2),
   d:   dateGetter('Date', 1),
  HH:   dateGetter('Hours', 2),
   H:   dateGetter('Hours', 1),
  hh:   dateGetter('Hours', 2, -12),
   h:   dateGetter('Hours', 1, -12),
  mm:   dateGetter('Minutes', 2),
   m:   dateGetter('Minutes', 1),
  ss:   dateGetter('Seconds', 2),
   s:   dateGetter('Seconds', 1),
  a:    function(date){return date.getHours() < 12 ? 'am' : 'pm';},
  Z:    function(date){
          var offset = date.getTimezoneOffset();
          return padNumber(offset / 60, 2) + padNumber(Math.abs(offset % 60), 2);
        }
};


var DATE_FORMATS_SPLIT = /([^yMdHhmsaZ]*)(y+|M+|d+|H+|h+|m+|s+|a|Z)(.*)/;
var NUMBER_STRING = /^\d+$/;


/**
 * @ngdoc filter
 * @name angular.filter.date
 * @function
 *
 * @description
 *   Formats `date` to a string based on the requested `format`.
 *
 * @param {(Date|number|string)} date Date to format either as Date object or milliseconds.
 * @param {string=} format Formatting rules. If not specified, Date#toLocaleDateString is used.
 * @returns {string} Formatted string or the input if input is not recognized as date/millis.
 *
 * //TODO example + scenario
 */
angularFilter.date = function(date, format) {
  if (isString(date) && NUMBER_STRING.test(date)) {
    date = parseInt(date, 10);
  }

  if (isNumber(date)) {
    date = new Date(date);
  } else if (!(date instanceof Date)) {
    return date;
  }

  var text = date.toLocaleDateString(), fn;
  if (format && isString(format)) {
    text = '';
    var parts = [];
    while(format) {
      parts = concat(parts, DATE_FORMATS_SPLIT.exec(format), 1);
      format = parts.pop();
    }
    foreach(parts, function(value){
      fn = DATE_FORMATS[value];
      text += fn ? fn(date) : value;
    });
  }
  return text;
};


/**
 * @ngdoc filter
 * @name angular.filter.json
 * @function
 *
 * @description
 *   Allows you to convert a JavaScript object into JSON string.
 *
 *   This filter is mostly useful for debugging. When using the double curly {{value}} notation
 *   the binding is automatically converted to JSON.
 *
 * @param {*} object Any JavaScript object (including arrays and primitive types) to filter.
 * @returns {string} JSON string.
 *
 * @css ng-monospace Always applied to the encapsulating element.
 *
 * @example
 *   <span ng:non-bindable>{{   {a:1, b:[]} | json   }}</span>: <pre>{{ {a:1, b:[]} | json }}</pre>
 *
 * @scenario
 *   it('should jsonify filtered objects', function() {
 *     expect(binding('{{ {a:1, b:[]} | json')).toEqual(
 *      '{\n  "a":1,\n  "b":[]}'
 *     );
 *   });
 *
 */
angularFilter.json = function(object) {
  this.$element.addClass("ng-monospace");
  return toJson(object, true);
};


/**
 * @ngdoc filter
 * @name angular.filter.lowercase
 * @function
 *
 * @see angular.lowercase
 */
angularFilter.lowercase = lowercase;


/**
 * @ngdoc filter
 * @name angular.filter.uppercase
 * @function
 *
 * @see angular.uppercase
 */
angularFilter.uppercase = uppercase;


/**
 * @ngdoc filter
 * @name angular.filter.html
 * @function
 *
 * @description
 *   Prevents the input from getting escaped by angular. By default the input is sanitized and
 *   inserted into the DOM as is.
 *
 *   The input is sanitized by parsing the html into tokens. All safe tokens (from a whitelist) are
 *   then serialized back to properly escaped html string. This means that no unsafe input can make
 *   it into the returned string, however since our parser is more strict than a typical browser
 *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
 *   browser, won't make it through the sanitizer.
 *
 *   If you hate your users, you may call the filter with optional 'unsafe' argument, which bypasses
 *   the html sanitizer, but makes your application vulnerable to XSS and other attacks. Using this
 *   option is strongly discouraged and should be used only if you absolutely trust the input being
 *   filtered and you can't get the content through the sanitizer.
 *
 * @param {string} html Html input.
 * @param {string='safe'} option If 'unsafe' then do not sanitize the HTML input.
 * @returns {string} Sanitized or raw html.
 */
angularFilter.html =  function(html, option){
  return new HTML(html, option);
};


/**
 * @ngdoc filter
 * @name angular.filter.linky
 * @function
 *
 * @description
 *   Finds links in text input and turns them into html links. Supports http/https/ftp/mailto links.
 *
 * @param {string} text Input text.
 * @returns {string} Html-linkified text.
 */
//TODO: externalize all regexps
angularFilter.linky = function(text){
  if (!text) return text;
  function regExpEscape(text) {
    return text.replace(/([\/\.\*\+\?\|\(\)\[\]\{\}\\])/g, '\\$1');
  }
  var URL = /(ftp|http|https|mailto):\/\/([^\(\)|\s]+)/;
  var match;
  var raw = text;
  var html = [];
  var writer = htmlSanitizeWriter(html);
  var url;
  var i;
  while (match=raw.match(URL)) {
    url = match[0].replace(/[\.\;\,\(\)\{\}\<\>]$/,'');
    i = raw.indexOf(url);
    writer.chars(raw.substr(0, i));
    writer.start('a', {href:url});
    writer.chars(url);
    writer.end('a');
    raw = raw.substring(i + url.length);
  }
  writer.chars(raw);
  return new HTML(html.join(''));
};
