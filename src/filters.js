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

angularFilter.date = function(date) {
  if (date instanceof Date)
    return date.toLocaleDateString();
  else
    return date;
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
