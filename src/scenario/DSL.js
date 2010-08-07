angular.scenario.dsl.browser = {
  navigateTo: function(url){
    return $scenario.addFuture('Navigate to: ' + url, function(done){
      var self = this;
      this.testFrame.load(function(){
        self.testFrame.unbind();
        self.testWindow = self.testFrame[0].contentWindow;
        self.testDocument = jQuery(self.testWindow.document);
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

angular.scenario.dsl.repeater = function(selector) {
  var namePrefix = "repeater '" + selector + "'";
  return {
    count: function() {
      return $scenario.addFuture(namePrefix + ' count', function(done) {
          done(this.testDocument.find(selector).size());
      });
    },
    collect: function() {
      return $scenario.addFuture(namePrefix + ' collect', function(done) {
        var doCollect = bind(this, function() {
          var repeaterArray = [];
          this.testDocument.find(selector).each(function(index) {
            var element = angular.extend(_jQuery(this),
                {bindings: [],
                 boundTo: function(name) { return this.bindings[name]; }}
            );
            element.find('*').each(function(index) {
              var bindName = _jQuery(this).attr('ng:bind');
              element.bindings[bindName] = _jQuery(this).text();
            });
            repeaterArray[index] = element;
          });
          return repeaterArray;
        });
        done(doCollect());
      });
    }
  };
};
