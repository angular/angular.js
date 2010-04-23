var angularFilterGoogleChartApi;

foreach({
  'currency': function(amount){
    this.$element.toggleClass('ng-format-negative', amount < 0);
    return '$' + angularFilter['number'].apply(this, [amount, 2]);
  },

  'number': function(amount, fractionSize){
    if (isNaN(amount) || !isFinite(amount)) {
      return '';
    }
    fractionSize = typeof fractionSize == 'undefined' ? 2 : fractionSize;
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
  },

  'date': function(amount) {
  },

  'json': function(object) {
    this.$element.addClass("ng-monospace");
    return toJson(object, true);
  },

  'trackPackage': (function(){
    var MATCHERS = [
      { name: "UPS",
        url: "http://wwwapps.ups.com/WebTracking/processInputRequest?sort_by=status&tracknums_displayed=1&TypeOfInquiryNumber=T&loc=en_US&track.x=0&track.y=0&InquiryNumber1=",
        regexp: [
          /^1Z[0-9A-Z]{16}$/i]},
      { name: "FedEx",
        url: "http://www.fedex.com/Tracking?tracknumbers=",
        regexp: [
          /^96\d{10}?$/i,
          /^96\d{17}?$/i,
          /^96\d{20}?$/i,
          /^\d{15}$/i,
          /^\d{12}$/i]},
      { name: "USPS",
        url: "http://trkcnfrm1.smi.usps.com/PTSInternetWeb/InterLabelInquiry.do?origTrackNum=",
        regexp: [
          /^(91\d{20})$/i,
          /^(91\d{18})$/i]}];
    return function(trackingNo, noMatch) {
      trackingNo = trim(trackingNo);
      var tNo = trackingNo.replace(/ /g, '');
      var returnValue;
      foreach(MATCHERS, function(carrier){
        foreach(carrier.regexp, function(regexp){
          if (!returnValue && regexp.test(tNo)) {
            var text = carrier.name + ": " + trackingNo;
            var url = carrier.url + trackingNo;
            returnValue = jqLite('<a></a>');
            returnValue.text(text);
            returnValue.attr('href', url);
          }
        });
      });
      if (returnValue)
        return returnValue;
      else if (trackingNo)
        return noMatch || trackingNo + " is not recognized";
      else
        return null;
    };})(),

  'link': function(obj, title) {
    if (obj) {
      var text = title || obj.text || obj;
      var url = obj.url || obj;
      if (url) {
        if (angular.validator.email(url) === null) {
          url = "mailto:" + url;
        }
        var a = jqLite('<a></a>');
        a.attr('href', url);
        a.text(text);
        return a;
      }
    }
    return obj;
  },


  'bytes': (function(){
    var SUFFIX = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    return function(size) {
      if(size === null) return "";

      var suffix = 0;
      while (size > 1000) {
        size = size / 1024;
        suffix++;
      }
      var txt = "" + size;
      var dot = txt.indexOf('.');
      if (dot > -1 && dot + 2 < txt.length) {
        txt = txt.substring(0, dot + 2);
      }
      return txt + " " + SUFFIX[suffix];
    };
  })(),

  'image': function(obj, width, height) {
    if (obj && obj.url) {
      var style = "", img = jqLite('<img>');
      if (width) {
        img.css('max-width', width + 'px');
        img.css('max-height', (height || width) + 'px');
      }
      img.attr('src', obj.url);
      return img;
    }
    return null;
  },

  'lowercase': lowercase,

  'uppercase': uppercase,

  'linecount': function (obj) {
    if (isString(obj)) {
      if (obj==='') return 1;
      return obj.split(/\n|\f/).length;
    }
    return 1;
  },

  'if': function (result, expression) {
    return expression ? result : undefined;
  },

  'unless': function (result, expression) {
    return expression ? undefined : result;
  },

  'googleChartApi': extend(
    function(type, data, width, height) {
      data = data || {};
      var chart = {
          'cht':type,
          'chco':angularFilterGoogleChartApi['collect'](data, 'color'),
          'chtt':angularFilterGoogleChartApi['title'](data),
          'chdl':angularFilterGoogleChartApi['collect'](data, 'label'),
          'chd':angularFilterGoogleChartApi['values'](data),
          'chf':'bg,s,FFFFFF00'
        };
      if (_.isArray(data['xLabels'])) {
        chart['chxt']='x';
        chart['chxl']='0:|' + data.xLabels.join('|');
      }
      return angularFilterGoogleChartApi['encode'](chart, width, height);
    },
    {
      'values': function(data){
        var seriesValues = [];
        foreach(data['series']||[], function(serie){
          var values = [];
          foreach(serie['values']||[], function(value){
            values.push(value);
          });
          seriesValues.push(values.join(','));
        });
        var values = seriesValues.join('|');
        return values === "" ? null : "t:" + values;
      },

      'title': function(data){
        var titles = [];
        var title = data['title'] || [];
        foreach(_.isArray(title)?title:[title], function(text){
          titles.push(encodeURIComponent(text));
        });
        return titles.join('|');
      },

      'collect': function(data, key){
        var outterValues = [];
        var count = 0;
        foreach(data['series']||[], function(serie){
          var innerValues = [];
          var value = serie[key] || [];
          foreach(_.isArray(value)?value:[value], function(color){
              innerValues.push(encodeURIComponent(color));
              count++;
            });
          outterValues.push(innerValues.join('|'));
        });
        return count?outterValues.join(','):null;
      },

      'encode': function(params, width, height) {
        width = width || 200;
        height = height || width;
        var url = "http://chart.apis.google.com/chart?",
            urlParam = [],
            img = jqLite('<img>');
        params['chs'] = width + "x" + height;
        foreach(params, function(value, key){
          if (value) {
            urlParam.push(key + "=" + value);
          }
        });
        urlParam.sort();
        url += urlParam.join("&");
        img.attr('src', url);
        img.css({width: width + 'px', height: height + 'px'});
        return img;
      }
    }
  ),


  'qrcode': function(value, width, height) {
    return angularFilterGoogleChartApi['encode']({
      'cht':'qr', 'chl':encodeURIComponent(value)}, width, height);
  },
  'chart': {
    'pie':function(data, width, height) {
      return angularFilterGoogleChartApi('p', data, width, height);
    },
    'pie3d':function(data, width, height) {
      return angularFilterGoogleChartApi('p3', data, width, height);
    },
    'pieConcentric':function(data, width, height) {
      return angularFilterGoogleChartApi('pc', data, width, height);
    },
    'barHorizontalStacked':function(data, width, height) {
      return angularFilterGoogleChartApi('bhs', data, width, height);
    },
    'barHorizontalGrouped':function(data, width, height) {
      return angularFilterGoogleChartApi('bhg', data, width, height);
    },
    'barVerticalStacked':function(data, width, height) {
      return angularFilterGoogleChartApi('bvs', data, width, height);
    },
    'barVerticalGrouped':function(data, width, height) {
      return angularFilterGoogleChartApi('bvg', data, width, height);
    },
    'line':function(data, width, height) {
      return angularFilterGoogleChartApi('lc', data, width, height);
    },
    'sparkline':function(data, width, height) {
      return angularFilterGoogleChartApi('ls', data, width, height);
    },
    'scatter':function(data, width, height) {
      return angularFilterGoogleChartApi('s', data, width, height);
    }
  },

  'html': function(html){
    return new HTML(html);
  },

  'linky': function(text){
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
  }
}, function(v,k){angularFilter[k] = v;});

angularFilterGoogleChartApi = angularFilter['googleChartApi'];
