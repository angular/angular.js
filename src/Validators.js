foreach({
  'regexp': function(value, regexp, msg) {
    if (!value.match(regexp)) {
      return msg ||
        "Value does not match expected format " + regexp + ".";
    } else {
      return null;
    }
  },
  
  'number': function(value, min, max) {
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
  },
  
  'integer': function(value, min, max) {
    var number = angularValidator['number'](value, min, max);
    if (number === null && value != Math.round(value)) {
      return "Value is not a whole number.";
    }
    return number;
  },
  
  'date': function(value, min, max) {
    if (value.match(/^\d\d?\/\d\d?\/\d\d\d\d$/)) {
      return null;
    }
    return "Value is not a date. (Expecting format: 12/31/2009).";
  },
  
  'ssn': function(value) {
    if (value.match(/^\d\d\d-\d\d-\d\d\d\d$/)) {
      return null;
    }
    return "SSN needs to be in 999-99-9999 format.";
  },
  
  'email': function(value) {
    if (value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) {
      return null;
    }
    return "Email needs to be in username@host.com format.";
  },
  
  'phone': function(value) {
    if (value.match(/^1\(\d\d\d\)\d\d\d-\d\d\d\d$/)) {
      return null;
    }
    if (value.match(/^\+\d{2,3} (\(\d{1,5}\))?[\d ]+\d$/)) {
      return null;
    }
    return "Phone number needs to be in 1(987)654-3210 format in North America or +999 (123) 45678 906 internationaly.";
  },
  
  'url': function(value) {
    if (value.match(/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/)) {
      return null;
    }
    return "URL needs to be in http://server[:port]/path format.";
  },
  
  'json': function(value) {
    try {
      fromJson(value);
      return null;
    } catch (e) {
      return e.toString();
    }
  }
}, function(v,k) {angularValidator[k] = v;});
