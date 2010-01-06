// Copyright (C) 2009 BRAT Tech LLC

angular.filter.Meta = function(obj){
  if (obj) {
    for ( var key in obj) {
      this[key] = obj[key];
    }
  }
};
angular.filter.Meta.get = function(obj, attr){
  attr = attr || 'text';
  switch(typeof obj) {
  case "string":
    return attr == "text" ? obj : undefined;
  case "object":
    if (obj && typeof obj[attr] !== "undefined") {
      return obj[attr];
    }
    return undefined;
  default:
    return obj;
  }
};

angular.filter.currency = function(amount){
  jQuery(this.element).toggleClass('ng-format-negative', amount < 0);
  return '$' + angular.filter.number.apply(this, [amount, 2]);
};

angular.filter.number = function(amount, fractionSize){
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
};

angular.filter.date = function(amount) {
};

angular.filter.json = function(object) {
  jQuery(this.element).addClass("ng-monospace");
  return nglr.toJson(object, true);
};

angular.filter.trackPackage = function(trackingNo, noMatch) {
  trackingNo = nglr.trim(trackingNo);
  var tNo = trackingNo.replace(/ /g, '');
  var MATCHERS = angular.filter.trackPackage.MATCHERS;
  for ( var i = 0; i < MATCHERS.length; i++) {
    var carrier = MATCHERS[i];
    for ( var j = 0; j < carrier.regexp.length; j++) {
      var regexp = carrier.regexp[j];
      if (regexp.test(tNo)) {
        var text = carrier.name + ": " + trackingNo;
        var url = carrier.url + trackingNo;
        return new angular.filter.Meta({
          text:text,
          url:url,
          html: '<a href="' + nglr.escapeAttr(url) + '">' + text + '</a>',
          trackingNo:trackingNo});
      }
    }
  }
  if (trackingNo)
    return noMatch ||
      new angular.filter.Meta({text:trackingNo + " is not recognized"});
  else
    return null;
};

angular.filter.trackPackage.MATCHERS = [
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

angular.filter.link = function(obj, title) {
  var text = title || angular.filter.Meta.get(obj);
  var url = angular.filter.Meta.get(obj, "url") || angular.filter.Meta.get(obj);
  if (url) {
    if (angular.validator.email(url) === null) {
      url = "mailto:" + url;
    }
    var html = '<a href="' + nglr.escapeHtml(url) + '">' + text + '</a>';
    return new angular.filter.Meta({text:text, url:url, html:html});
  }
  return obj;
};


angular.filter.bytes = function(size) {
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
  return txt + " " + angular.filter.bytes.SUFFIX[suffix];
};
angular.filter.bytes.SUFFIX = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

angular.filter.image = function(obj, width, height) {
  if (obj && obj.url) {
    var style = "";
    if (width) {
      style = ' style="max-width: ' + width +
              'px; max-height: ' + (height || width) + 'px;"';
    }
    return new angular.filter.Meta({url:obj.url, text:obj.url,
      html:'<img src="'+obj.url+'"' + style + '/>'});
  }
  return null;
};

angular.filter.lowercase = function (obj) {
  var text = angular.filter.Meta.get(obj);
  return text ? ("" + text).toLowerCase() : text;
};

angular.filter.uppercase = function (obj) {
  var text = angular.filter.Meta.get(obj);
  return text ? ("" + text).toUpperCase() : text;
};

angular.filter.linecount = function (obj) {
  var text = angular.filter.Meta.get(obj);
  if (text==='' || !text) return 1;
  return text.split(/\n|\f/).length;
};

angular.filter['if'] = function (result, expression) {
  return expression ? result : undefined;
};

angular.filter.unless = function (result, expression) {
  return expression ? undefined : result;
};

angular.filter.googleChartApi = function(type, data, width, height) {
  data = data || {};
  var api = angular.filter.googleChartApi;
  var chart = {
      cht:type, 
      chco:api.collect(data, 'color'),
      chtt:api.title(data),
      chdl:api.collect(data, 'label'),
      chd:api.values(data),
      chf:'bg,s,FFFFFF00'
    };
  if (_.isArray(data.xLabels)) {
    chart.chxt='x';
    chart.chxl='0:|' + data.xLabels.join('|');
  }
  return angular.filter.googleChartApi.encode(chart, width, height);
};

angular.filter.googleChartApi.values = function(data){
  var seriesValues = [];
  _.each(data.series||[], function(serie){
    var values = [];
    _.each(serie.values||[], function(value){
      values.push(value);
    });
    seriesValues.push(values.join(','));
  });
  var values = seriesValues.join('|');
  return values === "" ? null : "t:" + values;
};

angular.filter.googleChartApi.title = function(data){
  var titles = [];
  var title = data.title || [];
  _.each(_.isArray(title)?title:[title], function(text){
    titles.push(encodeURIComponent(text));
  });
  return titles.join('|');
};

angular.filter.googleChartApi.collect = function(data, key){
  var outterValues = [];
  var count = 0;
  _.each(data.series||[], function(serie){
    var innerValues = [];
    var value = serie[key] || [];
    _.each(_.isArray(value)?value:[value], function(color){
        innerValues.push(encodeURIComponent(color));
        count++;
      });
    outterValues.push(innerValues.join('|'));
  });
  return count?outterValues.join(','):null;
};

angular.filter.googleChartApi.encode= function(params, width, height) {
  width = width || 200;
  height = height || width;
  var url = "http://chart.apis.google.com/chart?";
  var urlParam = [];
  params.chs = width + "x" + height;
  for ( var key in params) {
    var value = params[key];
    if (value) {
      urlParam.push(key + "=" + value);
    }
  }
  urlParam.sort();
  url += urlParam.join("&");
  return new angular.filter.Meta({url:url, text:value,
    html:'<img width="' + width + '" height="' + height + '" src="'+url+'"/>'});
};

angular.filter.qrcode = function(value, width, height) {
  return angular.filter.googleChartApi.encode({cht:'qr', chl:encodeURIComponent(value)}, width, height);
};
angular.filter.chart = {
  pie:function(data, width, height) {
    return angular.filter.googleChartApi('p', data, width, height);
  },
  pie3d:function(data, width, height) {
    return angular.filter.googleChartApi('p3', data, width, height);
  },
  pieConcentric:function(data, width, height) {
    return angular.filter.googleChartApi('pc', data, width, height);
  },
  barHorizontalStacked:function(data, width, height) {
    return angular.filter.googleChartApi('bhs', data, width, height);
  },
  barHorizontalGrouped:function(data, width, height) {
    return angular.filter.googleChartApi('bhg', data, width, height);
  },
  barVerticalStacked:function(data, width, height) {
    return angular.filter.googleChartApi('bvs', data, width, height);
  },
  barVerticalGrouped:function(data, width, height) {
    return angular.filter.googleChartApi('bvg', data, width, height);
  },
  line:function(data, width, height) {
    return angular.filter.googleChartApi('lc', data, width, height);
  },
  sparkline:function(data, width, height) {
    return angular.filter.googleChartApi('ls', data, width, height);
  },
  scatter:function(data, width, height) {
    return angular.filter.googleChartApi('s', data, width, height);
  }
};

angular.filter.html = function(html){
  return new angular.filter.Meta({html:html});
};
