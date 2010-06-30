angular.scenario.dsl.browser = {
  navigateTo: function(url){
    $scenario.addFuture('Navigate to: ' + url, function(done){
      var self = this;
      this.testFrame.load(function(){
        self.testFrame.unbind();
        self.testWindow = self.testFrame[0].contentWindow;
        self.testDocument = jQuery(self.testWindow.document);
        self.$browser = self.testWindow.angular.service.$browser();
        self.notifyWhenNoOutstandingRequests = bind(self.$browser, self.$browser.notifyWhenNoOutstandingRequests);
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
  return {
    enter: function(value){
      $scenario.addFuture("Set input text of '" + selector + "' to '" +
        value + "'", function(done){
          var input = this.testDocument.find('input[name=' + selector + ']');
          input.val(value);
          this.testWindow.angular.element(input[0]).trigger('change');
          done();
      });
    },
    select: function(value){
      $scenario.addFuture("Select radio '" + selector + "' to '" +
              value + "'", function(done){
        var input = this.testDocument.
          find(':radio[name$=@' + selector + '][value=' + value + ']');
        var event = this.testWindow.document.createEvent('MouseEvent');
        event.initMouseEvent('click', true, true, this.testWindow, 0,0,0,0,0, false, false, false, false, 0, null);
        input[0].dispatchEvent(event);
        done();
      });
    }
  };
};

angular.scenario.dsl.expect = {
  repeater: function(selector) {
    return {
      count: {
        toEqual: function(number) {
          $scenario.addFuture("Expect that there are " + number + " items in Repeater with selector '" + selector + "'", function(done) {
            var items = this.testDocument.find(selector);
            if (items.length != number) {
              this.result.fail("Expected " + number + " but was " + items.length);
            }
            done();
          });
        }
      }
    };
  }
};
