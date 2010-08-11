angular.scenario.dsl.browser = {
  navigateTo: function(url){
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
      }
    });
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
  var nameSuffix = "element '" + selector + "'";
  return $scenario.addFuture('Find ' + nameSuffix, function(done) {
    var self = this;
    var element = angular.extend(this.testDocument.find(selector), {
      bindings: [],
      boundTo: function(name) { return this.bindings[name]; }
    });
    element.find('*').each(function() {
      var bindName = self.jQuery(this).attr('ng:bind');
      if (bindName) {
        element.bindings[bindName] = self.jQuery(this).text();
      }
    });
    done(element);
  });
};
