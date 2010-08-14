angular.scenario.dsl.browser = {
  navigateTo: function(url){
    var location = this.location;
    return $scenario.addFuture('Navigate to: ' + url, function(done){
      var self = this;
      this.testFrame.load(function(){
        self.testFrame.unbind();
        self.testWindow = self.testFrame[0].contentWindow;
        self.testDocument = self.jQuery(self.testWindow.document);
        self.$browser = self.testWindow.angular.service.$browser();
        self.notifyWhenNoOutstandingRequests =
          bind(self.$browser, self.$browser.notifyWhenNoOutstandingRequests);
        self.notifyWhenNoOutstandingRequests(done);
      });
      if (this.testFrame.attr('src') == url) {
        this.testFrame[0].contentWindow.location.reload();
      } else {
        this.testFrame.attr('src', url);
        location.setLocation(url);
      }
    });
  },
  location: {
    href: "",
    hash: "",
    toEqual: function(url) {
      return (this.hash == "" ? (url == this.href) :
        (url == (this.href + "/#/" + this.hash)));
    },
    setLocation: function(url) {
      var urlParts = url.split("/#/");
      this.href = urlParts[0] || "";
      this.hash = urlParts[1] || "";
    }
  }
};

angular.scenario.dsl.input = function(selector) {
  var namePrefix = "input '" + selector + "'";
  return {
    enter: function(value) {
      return $scenario.addFuture(namePrefix + " enter '" + value + "'", function(done) {
        var input = this.testDocument.find('input[name=' + selector + ']');
        input.val(value);
        this.testWindow.angular.element(input[0]).trigger('change');
        done();
      });
    },
    select: function(value) {
      return $scenario.addFuture(namePrefix + " select '" + value + "'", function(done) {
        var input = this.testDocument.
          find(':radio[name$=@' + selector + '][value=' + value + ']');
        jqLiteWrap(input[0]).trigger('click');
        input[0].checked = true;
        done();
      });
    }
  };
},

angular.scenario.dsl.NG_BIND_PATTERN =/\{\{[^\}]+\}\}/;

angular.scenario.dsl.repeater = function(selector) {
  var namePrefix = "repeater '" + selector + "'";
  return {
    count: function() {
      return $scenario.addFuture(namePrefix + ' count', function(done) {
          done(this.testDocument.find(selector).size());
      });
    },
    collect: function(collectSelector) {
      return $scenario.addFuture(
          namePrefix + " collect '" + collectSelector + "'",
          function(done) {
        var self = this;
        var doCollect = bind(this, function() {
          var repeaterArray = [], ngBindPattern;
          var startIndex = collectSelector.search(
              angular.scenario.dsl.NG_BIND_PATTERN);
          if (startIndex >= 0) {
            ngBindPattern = collectSelector.substring(
                startIndex + 2, collectSelector.length - 2);
            collectSelector = '*';
            
          }
          this.testDocument.find(selector).each(function() {
            var element = self.jQuery(this);
            element.find(collectSelector).
              each(function() {
                var foundElem = self.jQuery(this);
                if (foundElem.attr('ng:bind') == ngBindPattern) {
                  repeaterArray.push(foundElem.text());
                }
            });
          });
          return repeaterArray;
        });
        done(doCollect());
      });
    }
  };
};

angular.scenario.dsl.element = function(selector) {
  var namePrefix = "Element '" + selector + "'";
  var futureJquery = {};
  for (key in (jQuery || _jQuery).fn) {
    (function(){
      var jqFnName = key;
      var jqFn = (jQuery || _jQuery).fn[key];
      futureJquery[key] = function() {
        var jqArgs = arguments;
        return $scenario.addFuture(namePrefix + "." + jqFnName + "()",
                function(done) {
          var self = this, repeaterArray = [], ngBindPattern;
          var startIndex = selector.search(angular.scenario.dsl.NG_BIND_PATTERN);
          if (startIndex >= 0) {
            ngBindPattern = selector.substring(startIndex + 2, selector.length - 2);
            var element = this.testDocument.find('*').filter(function() {
              return self.jQuery(this).attr('ng:bind') == ngBindPattern;
            });
            done(jqFn.apply(element, jqArgs));
          } else {
            done(jqFn.apply(this.testDocument.find(selector), jqArgs));
          }
        });
      };
    })();
  }
  return futureJquery;
};
