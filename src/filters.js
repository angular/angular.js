angularFilter.currency = function(amount){
  this.$element.toggleClass('ng-format-negative', amount < 0);
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
function dateGetter(name, size, offset, trim) {
  return function(date) {
    var value = date['get' + name].call(date);
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
  a:    function(date){return date.getHours() < 12 ? 'am' : 'pm'; },
  Z:    function(date){
          var offset = date.getTimezoneOffset();
          return padNumber(offset / 60, 2) + padNumber(Math.abs(offset % 60), 2);
        }
};
var DATE_FORMATS_SPLIT = /([^yMdHhmsaZ]*)(y+|M+|d+|H+|h+|m+|s+|a|Z)(.*)/;

angularFilter.date = function(date, format) {
  if (!date instanceof Date) return date;
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
