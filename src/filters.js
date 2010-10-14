angularFilter.currency = function(amount){
  this.$element.toggleClass('ng:format-negative', amount < 0);
  return '$' + angularFilter['number'].apply(this, [amount, 2]);
};

angularFilter.number = function(amount, fractionSize){
  if (isNaN(amount) || !isFinite(amount)) {
    return '';
  }
  fractionSize = typeof fractionSize == $undefined ? 2 : fractionSize;
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
function dateGetter(name, size, option) {
  return function(date) {
    var value = date[name].call(date) + 1*(option===1);
    if (option == -12 && value > 12) value += option;
    return padNumber(value, size, option === true);
  };
}
var DATE_FORMATS = {
  yyyy: dateGetter('getFullYear', 4),
  yy:   dateGetter('getFullYear', 2, true),
  MM:   dateGetter('getMonth', 2, 1),
  dd:   dateGetter('getDate', 2),
  HH:   dateGetter('getHours', 2),
  KK:   dateGetter('getHours', 2, -12),
  mm:   dateGetter('getMinutes', 2),
  ss:   dateGetter('getSeconds', 2),
  a:    function(date){return date.getHours() < 12 ? 'am' : 'pm'; },
  Z:    function(date){
          var offset = date.getTimezoneOffset();
          return padNumber(offset / 60, 2) + padNumber(Math.abs(offset % 60), 2);
        }
};
var DATE_FORMATS_SPLIT = new RegExp('('+
    map(DATE_FORMATS, function(value, key){return key;}).join('|')+')');
console.log(DATE_FORMATS_SPLIT);

angularFilter.date = function(date, format) {
  if (!date instanceof Date) return date;
  var text = date.toLocaleDateString(), fn;
  if (format && isString(format)) {
    text = '';
    foreach(format.split(DATE_FORMATS_SPLIT), function(value){
      fn = DATE_FORMATS[value];
      text += fn ? fn(date) : value;
    });
  }
  return text;
};

angularFilter.json = function(object) {
  this.$element.addClass("ng-monospace");
  return toJson(object, true);
};

angularFilter.lowercase = lowercase;

angularFilter.uppercase = uppercase;

angularFilter.html =  function(html){
  return new HTML(html);
};

angularFilter.linky = function(text){
  if (!text) return text;
  function regExpEscape(text) {
    return text.replace(/([\/\.\*\+\?\|\(\)\[\]\{\}\\])/g, '\\$1');
  }
  var URL = /(ftp|http|https|mailto):\/\/([^\(\)|\s]+)/;
  var match;
  var raw = text;
  var html = [];
  while (match=raw.match(URL)) {
    var url = match[0].replace(/[\.\;\,\(\)\{\}\<\>]$/,'');
    var i = raw.indexOf(url);
    html.push(escapeHtml(raw.substr(0, i)));
    html.push('<a href="' + url + '">');
    html.push(url);
    html.push('</a>');
    raw = raw.substring(i + url.length);
  }
  html.push(escapeHtml(raw));
  return new HTML(html.join(''));
};
