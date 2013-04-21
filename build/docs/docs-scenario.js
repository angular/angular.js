describe("angular+jqlite", function() {
  describe("cookbook/mvc", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/mvc");
    });
  
      it('should play a game', function() {
       piece(1, 1);
       expect(binding('nextMove')).toEqual('O');
       piece(3, 1);
       expect(binding('nextMove')).toEqual('X');
       piece(1, 2);
       piece(3, 2);
       piece(1, 3);
       expect(element('.winner').text()).toEqual('Player X has won!');
      });
    
      function piece(row, col) {
        element('.board tr:nth-child('+row+') td:nth-child('+col+')').click();
      }

});

  describe("cookbook/deeplinking_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/deeplinking_ru");
    });
  
      it('should navigate to URL', function() {
        element('a:contains(Welcome)').click();
        expect(element('[ng-view]').text()).toMatch(/Hello anonymous/);
        element('a:contains(Settings)').click();
        input('form.name').enter('yourname');
        element(':button:contains(Save)').click();
        element('a:contains(Welcome)').click();
        expect(element('[ng-view]').text()).toMatch(/Hello yourname/);
      });

});

  describe("cookbook/deeplinking", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/deeplinking");
    });
  
      it('should navigate to URL', function() {
        element('a:contains(Welcome)').click();
        expect(element('[ng-view]').text()).toMatch(/Hello anonymous/);
        element('a:contains(Settings)').click();
        input('form.name').enter('yourname');
        element(':button:contains(Save)').click();
        element('a:contains(Welcome)').click();
        expect(element('[ng-view]').text()).toMatch(/Hello yourname/);
      });

});

  describe("cookbook/helloworld_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/helloworld_ru");
    });
  
    it('should change the binding when user enters text', function() {
      expect(binding('name')).toEqual('World');
      input('name').enter('angular');
      expect(binding('name')).toEqual('angular');
    });

});

  describe("cookbook/advancedform_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/advancedform_ru");
    });
  
    it('should enable save button', function() {
      expect(element(':button:contains(Save)').attr('disabled')).toBeTruthy();
      input('form.name').enter('');
      expect(element(':button:contains(Save)').attr('disabled')).toBeTruthy();
      input('form.name').enter('change');
      expect(element(':button:contains(Save)').attr('disabled')).toBeFalsy();
      element(':button:contains(Save)').click();
      expect(element(':button:contains(Save)').attr('disabled')).toBeTruthy();
    });
    it('should enable cancel button', function() {
      expect(element(':button:contains(Cancel)').attr('disabled')).toBeTruthy();
      input('form.name').enter('change');
      expect(element(':button:contains(Cancel)').attr('disabled')).toBeFalsy();
      element(':button:contains(Cancel)').click();
      expect(element(':button:contains(Cancel)').attr('disabled')).toBeTruthy();
      expect(element(':input[ng\\:model="form.name"]').val()).toEqual('John Smith');
    });

});

  describe("cookbook/form", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/form");
    });
  
     it('should show debug', function() {
       expect(binding('user')).toMatch(/John Smith/);
     });
     it('should add contact', function() {
       using('.example').element('a:contains(add)').click();
       using('.example div:last').input('contact.value').enter('you@example.org');
       expect(binding('user')).toMatch(/\(234\) 555\-1212/);
       expect(binding('user')).toMatch(/you@example.org/);
     });
    
     it('should remove contact', function() {
       using('.example').element('a:contains(X)').click();
       expect(binding('user')).not().toMatch(/\(234\) 555\-1212/);
     });
    
     it('should validate zip', function() {
       expect(using('.example').
         element(':input[ng\\:model="user.address.zip"]').
         prop('className')).not().toMatch(/ng-invalid/);
       using('.example').input('user.address.zip').enter('abc');
       expect(using('.example').
         element(':input[ng\\:model="user.address.zip"]').
         prop('className')).toMatch(/ng-invalid/);
     });
    
     it('should validate state', function() {
       expect(using('.example').element(':input[ng\\:model="user.address.state"]').prop('className'))
         .not().toMatch(/ng-invalid/);
       using('.example').input('user.address.state').enter('XXX');
       expect(using('.example').element(':input[ng\\:model="user.address.state"]').prop('className'))
         .toMatch(/ng-invalid/);
     });

});

  describe("cookbook/buzz_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/buzz_ru");
    });
  
     xit('fetch buzz and expand', function() {
       element(':button:contains(fetch)').click();
       expect(repeater('div.buzz').count()).toBeGreaterThan(0);
       element('.buzz a:contains(Expand replies):first').click();
       expect(repeater('div.reply').count()).toBeGreaterThan(0);
     });

});

  describe("cookbook/buzz", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/buzz");
    });
  
     xit('fetch buzz and expand', function() {
       element(':button:contains(fetch)').click();
       expect(repeater('div.buzz').count()).toBeGreaterThan(0);
       element('.buzz a:contains(Expand replies):first').click();
       expect(repeater('div.reply').count()).toBeGreaterThan(0);
     });

});

  describe("cookbook/index", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/index");
    });
  
});

  describe("cookbook/helloworld", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/helloworld");
    });
  
    it('should change the binding when user enters text', function() {
      expect(binding('name')).toEqual('World');
      input('name').enter('angular');
      expect(binding('name')).toEqual('angular');
    });

});

  describe("cookbook/advancedform", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/advancedform");
    });
  
    it('should enable save button', function() {
      expect(element(':button:contains(Save)').attr('disabled')).toBeTruthy();
      input('form.name').enter('');
      expect(element(':button:contains(Save)').attr('disabled')).toBeTruthy();
      input('form.name').enter('change');
      expect(element(':button:contains(Save)').attr('disabled')).toBeFalsy();
      element(':button:contains(Save)').click();
      expect(element(':button:contains(Save)').attr('disabled')).toBeTruthy();
    });
    it('should enable cancel button', function() {
      expect(element(':button:contains(Cancel)').attr('disabled')).toBeTruthy();
      input('form.name').enter('change');
      expect(element(':button:contains(Cancel)').attr('disabled')).toBeFalsy();
      element(':button:contains(Cancel)').click();
      expect(element(':button:contains(Cancel)').attr('disabled')).toBeTruthy();
      expect(element(':input[ng\\:model="form.name"]').val()).toEqual('John Smith');
    });

});

  describe("cookbook/form_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/form_ru");
    });
  
     it('should show debug', function() {
       expect(binding('user')).toMatch(/John Smith/);
     });
     it('should add contact', function() {
       using('.example').element('a:contains(add)').click();
       using('.example div:last').input('contact.value').enter('you@example.org');
       expect(binding('user')).toMatch(/\(234\) 555\-1212/);
       expect(binding('user')).toMatch(/you@example.org/);
     });
    
     it('should remove contact', function() {
       using('.example').element('a:contains(X)').click();
       expect(binding('user')).not().toMatch(/\(234\) 555\-1212/);
     });
    
     it('should validate zip', function() {
       expect(using('.example').
         element(':input[ng\\:model="user.address.zip"]').
         prop('className')).not().toMatch(/ng-invalid/);
       using('.example').input('user.address.zip').enter('abc');
       expect(using('.example').
         element(':input[ng\\:model="user.address.zip"]').
         prop('className')).toMatch(/ng-invalid/);
     });
    
     it('should validate state', function() {
       expect(using('.example').element(':input[ng\\:model="user.address.state"]').prop('className'))
         .not().toMatch(/ng-invalid/);
       using('.example').input('user.address.state').enter('XXX');
       expect(using('.example').element(':input[ng\\:model="user.address.state"]').prop('className'))
         .toMatch(/ng-invalid/);
     });

});

  describe("cookbook/index_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/index_ru");
    });
  
});

  describe("cookbook/mvc_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/cookbook/mvc_ru");
    });
  
      it('should play a game', function() {
       piece(1, 1);
       expect(binding('nextMove')).toEqual('O');
       piece(3, 1);
       expect(binding('nextMove')).toEqual('X');
       piece(1, 2);
       piece(3, 2);
       piece(1, 3);
       expect(element('.winner').text()).toEqual('Player X has won!');
      });
    
      function piece(row, col) {
        element('.board tr:nth-child('+row+') td:nth-child('+col+')').click();
      }

});

  describe("api/index", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/index");
    });
  
});

  describe("api/ng", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng");
    });
  
});

  describe("api/index_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/index_ru");
    });
  
});

  describe("api/ng_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng_ru");
    });
  
});

  describe("tutorial/step_00", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_00");
    });
  
});

  describe("tutorial/step_05", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_05");
    });
  
});

  describe("tutorial/step_11_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_11_ru");
    });
  
});

  describe("tutorial/the_end_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/the_end_ru");
    });
  
});

  describe("tutorial/step_07_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_07_ru");
    });
  
});

  describe("tutorial/step_03_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_03_ru");
    });
  
});

  describe("tutorial/step_06", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_06");
    });
  
});

  describe("tutorial/step_03", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_03");
    });
  
});

  describe("tutorial/step_04_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_04_ru");
    });
  
});

  describe("tutorial/step_02", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_02");
    });
  
});

  describe("tutorial/step_10_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_10_ru");
    });
  
});

  describe("tutorial/step_09_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_09_ru");
    });
  
});

  describe("tutorial/the_end", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/the_end");
    });
  
});

  describe("tutorial/index", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/index");
    });
  
});

  describe("tutorial/step_01_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_01_ru");
    });
  
});

  describe("tutorial/step_09", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_09");
    });
  
});

  describe("tutorial/step_00_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_00_ru");
    });
  
});

  describe("tutorial/step_07", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_07");
    });
  
});

  describe("tutorial/step_06_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_06_ru");
    });
  
});

  describe("tutorial/step_02_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_02_ru");
    });
  
});

  describe("tutorial/index_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/index_ru");
    });
  
});

  describe("tutorial/step_08_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_08_ru");
    });
  
});

  describe("tutorial/step_01", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_01");
    });
  
});

  describe("tutorial/step_10", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_10");
    });
  
});

  describe("tutorial/step_11", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_11");
    });
  
});

  describe("tutorial/step_05_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_05_ru");
    });
  
});

  describe("tutorial/step_08", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_08");
    });
  
});

  describe("tutorial/step_04", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/tutorial/step_04");
    });
  
});

  describe("misc/downloading_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/misc/downloading_ru");
    });
  
});

  describe("misc/started_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/misc/started_ru");
    });
  
});

  describe("misc/contribute", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/misc/contribute");
    });
  
});

  describe("misc/faq", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/misc/faq");
    });
  
});

  describe("misc/downloading", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/misc/downloading");
    });
  
});

  describe("misc/started", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/misc/started");
    });
  
});

  describe("misc/contribute_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/misc/contribute_ru");
    });
  
});

  describe("misc/faq_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/misc/faq_ru");
    });
  
});

  describe("guide/expression_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/expression_ru");
    });
  
    it('should calculate expression in binding', function() {
      expect(binding('1+2')).toEqual('3');
    });

    it('should allow user expression testing', function() {
       element('.expressions :button').click();
       var li = using('.expressions ul').repeater('li');
       expect(li.count()).toBe(1);
       expect(li.row(0)).toEqual(["3*10|currency", "$30.00"]);
    });

    it('should calculate expression in binding', function() {
      var alertText;
      this.addFutureAction('set mock', function($window, $document, done) {
        $window.mockWindow = {
          alert: function(text){ alertText = text; }
        };
        done();
      });
      element(':button:contains(Greet)').click();
      expect(this.addFuture('alert text', function(done) {
        done(null, alertText);
      })).toBe('Hello World');
    });

});

  describe("guide/dev_guide.unit-testing", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.unit-testing");
    });
  
});

  describe("guide/dev_guide.services.injecting_controllers", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services.injecting_controllers");
    });
  
    it('should test service', function() {
      expect(element(':input[ng\\:model="message"]').val()).toEqual('test');
    });

});

  describe("guide/bootstrap_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/bootstrap_ru");
    });
  
});

  describe("guide/concepts", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/concepts");
    });
  
});

  describe("guide/introduction", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/introduction");
    });
  
});

  describe("guide/dev_guide.e2e-testing", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.e2e-testing");
    });
  
});

  describe("guide/i18n", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/i18n");
    });
  
});

  describe("guide/dev_guide.services.testing_services_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services.testing_services_ru");
    });
  
});

  describe("guide/dev_guide.services.testing_services", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services.testing_services");
    });
  
});

  describe("guide/dev_guide.templates.filters_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.templates.filters_ru");
    });
  
});

  describe("guide/dev_guide.mvc.understanding_controller", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.mvc.understanding_controller");
    });
  
});

  describe("guide/type", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/type");
    });
  
});

  describe("guide/dev_guide.templates.filters.using_filters_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.templates.filters.using_filters_ru");
    });
  
});

  describe("guide/forms", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/forms");
    });
  
});

  describe("guide/dev_guide.services.creating_services", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services.creating_services");
    });
  
});

  describe("guide/dev_guide.templates.databinding_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.templates.databinding_ru");
    });
  
});

  describe("guide/concepts_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/concepts_ru");
    });
  
});

  describe("guide/directive", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/directive");
    });
  
      it('should show off bindings', function() {
        expect(element('div[ng-controller="Ctrl1"] span[ng-bind]').text()).toBe('angular');
      });

      it('should bind and open / close', function() {
        input('title').enter('TITLE');
        input('text').enter('TEXT');
        expect(element('.title').text()).toEqual('Details: TITLE...');
        expect(binding('text')).toEqual('TEXT');
    
        expect(element('.zippy').prop('className')).toMatch(/closed/);
        element('.zippy > .title').click();
        expect(element('.zippy').prop('className')).toMatch(/opened/);
      });

});

  describe("guide/dev_guide.templates.databinding", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.templates.databinding");
    });
  
});

  describe("guide/di_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/di_ru");
    });
  
});

  describe("guide/bootstrap", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/bootstrap");
    });
  
});

  describe("guide/dev_guide.unit-testing_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.unit-testing_ru");
    });
  
});

  describe("guide/dev_guide.e2e-testing_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.e2e-testing_ru");
    });
  
});

  describe("guide/dev_guide.templates.css-styling", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.templates.css-styling");
    });
  
});

  describe("guide/introduction_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/introduction_ru");
    });
  
});

  describe("guide/compiler", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/compiler");
    });
  
});

  describe("guide/dev_guide.templates.filters.creating_filters_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.templates.filters.creating_filters_ru");
    });
  
    it('should reverse greeting', function() {
      expect(binding('greeting|reverse')).toEqual('olleh');
      input('greeting').enter('ABC');
      expect(binding('greeting|reverse')).toEqual('CBA');
    });

});

  describe("guide/compiler_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/compiler_ru");
    });
  
});

  describe("guide/dev_guide.templates.filters", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.templates.filters");
    });
  
});

  describe("guide/dev_guide.services.managing_dependencies", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services.managing_dependencies");
    });
  
});

  describe("guide/dev_guide.templates", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.templates");
    });
  
});

  describe("guide/dev_guide.mvc.understanding_view", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.mvc.understanding_view");
    });
  
});

  describe("guide/dev_guide.mvc", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.mvc");
    });
  
});

  describe("guide/index", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/index");
    });
  
});

  describe("guide/overview", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/overview");
    });
  
      it('should show of angular binding', function() {
        expect(binding('qty * cost')).toEqual('$19.95');
        input('qty').enter('2');
        input('cost').enter('5.00');
        expect(binding('qty * cost')).toEqual('$10.00');
      });

});

  describe("guide/forms_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/forms_ru");
    });
  
});

  describe("guide/dev_guide.templates.filters.creating_filters", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.templates.filters.creating_filters");
    });
  
    it('should reverse greeting', function() {
      expect(binding('greeting|reverse')).toEqual('olleh');
      input('greeting').enter('ABC');
      expect(binding('greeting|reverse')).toEqual('CBA');
    });

});

  describe("guide/module", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/module");
    });
  
});

  describe("guide/dev_guide.templates_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.templates_ru");
    });
  
});

  describe("guide/dev_guide.mvc.understanding_model", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.mvc.understanding_model");
    });
  
});

  describe("guide/scope_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/scope_ru");
    });
  
});

  describe("guide/dev_guide.mvc.understanding_model_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.mvc.understanding_model_ru");
    });
  
});

  describe("guide/dev_guide.services.understanding_services_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services.understanding_services_ru");
    });
  
});

  describe("guide/ie_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/ie_ru");
    });
  
});

  describe("guide/dev_guide.mvc.understanding_view_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.mvc.understanding_view_ru");
    });
  
});

  describe("guide/scope", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/scope");
    });
  
});

  describe("guide/dev_guide.services.managing_dependencies_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services.managing_dependencies_ru");
    });
  
});

  describe("guide/dev_guide.services.$location_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services.$location_ru");
    });
  
});

  describe("guide/dev_guide.services.injecting_controllers_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services.injecting_controllers_ru");
    });
  
    it('should test service', function() {
      expect(element(':input[ng\\:model="message"]').val()).toEqual('test');
    });

});

  describe("guide/type_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/type_ru");
    });
  
});

  describe("guide/dev_guide.mvc_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.mvc_ru");
    });
  
});

  describe("guide/dev_guide.services.$location", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services.$location");
    });
  
});

  describe("guide/di", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/di");
    });
  
});

  describe("guide/ie", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/ie");
    });
  
});

  describe("guide/dev_guide.services.understanding_services", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services.understanding_services");
    });
  
});

  describe("guide/directive_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/directive_ru");
    });
  
      it('should show off bindings', function() {
        expect(element('div[ng-controller="Ctrl1"] span[ng-bind]').text()).toBe('angular');
      });

      it('should bind and open / close', function() {
        input('title').enter('TITLE');
        input('text').enter('TEXT');
        expect(element('.title').text()).toEqual('Details: TITLE...');
        expect(binding('text')).toEqual('TEXT');
    
        expect(element('.zippy').prop('className')).toMatch(/closed/);
        element('.zippy > .title').click();
        expect(element('.zippy').prop('className')).toMatch(/opened/);
      });

});

  describe("guide/i18n_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/i18n_ru");
    });
  
});

  describe("guide/expression", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/expression");
    });
  
    it('should calculate expression in binding', function() {
      expect(binding('1+2')).toEqual('3');
    });

    it('should allow user expression testing', function() {
       element('.expressions :button').click();
       var li = using('.expressions ul').repeater('li');
       expect(li.count()).toBe(1);
       expect(li.row(0)).toEqual(["3*10|currency", "$30.00"]);
    });

    it('should calculate expression in binding', function() {
      var alertText;
      this.addFutureAction('set mock', function($window, $document, done) {
        $window.mockWindow = {
          alert: function(text){ alertText = text; }
        };
        done();
      });
      element(':button:contains(Greet)').click();
      expect(this.addFuture('alert text', function(done) {
        done(null, alertText);
      })).toBe('Hello World');
    });

});

  describe("guide/dev_guide.services_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services_ru");
    });
  
});

  describe("guide/dev_guide.templates.filters.using_filters", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.templates.filters.using_filters");
    });
  
});

  describe("guide/overview_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/overview_ru");
    });
  
      it('should show of angular binding', function() {
        expect(binding('qty * cost')).toEqual('$19.95');
        input('qty').enter('2');
        input('cost').enter('5.00');
        expect(binding('qty * cost')).toEqual('$10.00');
      });

});

  describe("guide/index_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/index_ru");
    });
  
});

  describe("guide/dev_guide.services.creating_services_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services.creating_services_ru");
    });
  
});

  describe("guide/dev_guide.mvc.understanding_controller_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.mvc.understanding_controller_ru");
    });
  
});

  describe("guide/module_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/module_ru");
    });
  
});

  describe("guide/dev_guide.templates.css-styling_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.templates.css-styling_ru");
    });
  
});

  describe("guide/dev_guide.services", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/guide/dev_guide.services");
    });
  
});

  describe("api/ngSanitize.directive:ngBindHtml", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngSanitize.directive:ngBindHtml");
    });
  
});

  describe("api/ngSanitize.filter:linky", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngSanitize.filter:linky");
    });
  
    it('should linkify the snippet with urls', function() {
      expect(using('#linky-filter').binding('snippet | linky')).
        toBe('Pretty text with some links:&#10;' +
             '<a href="http://angularjs.org/">http://angularjs.org/</a>,&#10;' +
             '<a href="mailto:us@somewhere.org">us@somewhere.org</a>,&#10;' +
             '<a href="mailto:another@somewhere.org">another@somewhere.org</a>,&#10;' +
             'and one more: <a href="ftp://127.0.0.1/">ftp://127.0.0.1/</a>.');
    });
    
    it ('should not linkify snippet without the linky filter', function() {
      expect(using('#escaped-html').binding('snippet')).
        toBe("Pretty text with some links:\n" +
             "http://angularjs.org/,\n" +
             "mailto:us@somewhere.org,\n" +
             "another@somewhere.org,\n" +
             "and one more: ftp://127.0.0.1/.");
    });
    
    it('should update', function() {
      input('snippet').enter('new http://link.');
      expect(using('#linky-filter').binding('snippet | linky')).
        toBe('new <a href="http://link">http://link</a>.');
      expect(using('#escaped-html').binding('snippet')).toBe('new http://link.');
    });
    
    it('should work with the target property', function() {
     expect(using('#linky-target').binding("snippetWithTarget | linky:'_blank'")).
       toBe('<a target="_blank" href="http://angularjs.org/">http://angularjs.org/</a>');
    });

});

  describe("api/ngSanitize", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngSanitize");
    });
  
});

  describe("api/ngSanitize.$sanitize", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngSanitize.$sanitize");
    });
  
    it('should sanitize the html snippet ', function() {
      expect(using('#html-filter').element('div').html()).
        toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
    });
    
    it('should escape snippet without any filter', function() {
      expect(using('#escaped-html').element('div').html()).
        toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
             "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
             "snippet&lt;/p&gt;");
    });
    
    it('should inline raw snippet if filtered as unsafe', function() {
      expect(using('#html-unsafe-filter').element("div").html()).
        toBe("<p style=\"color:blue\">an html\n" +
             "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
             "snippet</p>");
    });
    
    it('should update', function() {
      input('snippet').enter('new <b>text</b>');
      expect(using('#html-filter').binding('snippet')).toBe('new <b>text</b>');
      expect(using('#escaped-html').element('div').html()).toBe("new &lt;b&gt;text&lt;/b&gt;");
      expect(using('#html-unsafe-filter').binding("snippet")).toBe('new <b>text</b>');
    });

});

  describe("api/ngCookies", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngCookies");
    });
  
});

  describe("api/ngCookies.$cookies", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngCookies.$cookies");
    });
  
});

  describe("api/ngCookies.$cookieStore", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngCookies.$cookieStore");
    });
  
});

  describe("api/angular.injector", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.injector");
    });
  
});

  describe("api/AUTO", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/AUTO");
    });
  
});

  describe("api/AUTO.$injector", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/AUTO.$injector");
    });
  
});

  describe("api/AUTO.$provide", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/AUTO.$provide");
    });
  
});

  describe("api/angular.element", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.element");
    });
  
});

  describe("api/ngResource", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngResource");
    });
  
});

  describe("api/ngResource.$resource", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngResource.$resource");
    });
  
    

});

  describe("api/angular.lowercase", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.lowercase");
    });
  
});

  describe("api/angular.uppercase", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.uppercase");
    });
  
});

  describe("api/angular.noConflict", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.noConflict");
    });
  
});

  describe("api/angular.forEach", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.forEach");
    });
  
});

  describe("api/angular.extend", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.extend");
    });
  
});

  describe("api/angular.noop", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.noop");
    });
  
});

  describe("api/angular.identity", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.identity");
    });
  
});

  describe("api/angular.isUndefined", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.isUndefined");
    });
  
});

  describe("api/angular.isDefined", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.isDefined");
    });
  
});

  describe("api/angular.isObject", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.isObject");
    });
  
});

  describe("api/angular.isString", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.isString");
    });
  
});

  describe("api/angular.isNumber", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.isNumber");
    });
  
});

  describe("api/angular.isDate", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.isDate");
    });
  
});

  describe("api/angular.isArray", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.isArray");
    });
  
});

  describe("api/angular.isFunction", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.isFunction");
    });
  
});

  describe("api/angular.isElement", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.isElement");
    });
  
});

  describe("api/angular.copy", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.copy");
    });
  
});

  describe("api/angular.equals", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.equals");
    });
  
});

  describe("api/angular.bind", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.bind");
    });
  
});

  describe("api/angular.toJson", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.toJson");
    });
  
});

  describe("api/angular.fromJson", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.fromJson");
    });
  
});

  describe("api/ng.directive:ngApp", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngApp");
    });
  
});

  describe("api/angular.bootstrap", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.bootstrap");
    });
  
});

  describe("api/angular.Module", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.Module");
    });
  
});

  describe("api/angular.module", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.module");
    });
  
});

  describe("api/angular.version", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.version");
    });
  
});

  describe("api/angular.mock", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.mock");
    });
  
});

  describe("api/ngMock.$exceptionHandlerProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngMock.$exceptionHandlerProvider");
    });
  
});

  describe("api/ngMock.$exceptionHandler", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngMock.$exceptionHandler");
    });
  
});

  describe("api/ngMock.$log", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngMock.$log");
    });
  
});

  describe("api/angular.mock.TzDate", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.mock.TzDate");
    });
  
});

  describe("api/angular.mock.createMockWindow", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.mock.createMockWindow");
    });
  
});

  describe("api/angular.mock.dump", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.mock.dump");
    });
  
});

  describe("api/ngMock.$httpBackend", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngMock.$httpBackend");
    });
  
});

  describe("api/ngMock.$timeout", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngMock.$timeout");
    });
  
});

  describe("api/ngMock", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngMock");
    });
  
});

  describe("api/ngMockE2E", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngMockE2E");
    });
  
});

  describe("api/ngMockE2E.$httpBackend", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngMockE2E.$httpBackend");
    });
  
});

  describe("api/angular.mock.module", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.mock.module");
    });
  
});

  describe("api/angular.mock.inject", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/angular.mock.inject");
    });
  
});

  describe("api/ng.$exceptionHandler", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$exceptionHandler");
    });
  
});

  describe("api/ng.$parse", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$parse");
    });
  
});

  describe("api/ng.$routeParams", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$routeParams");
    });
  
});

  describe("api/ng.$http", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$http");
    });
  
    it('should make an xhr GET request', function() {
      element(':button:contains("Sample GET")').click();
      element(':button:contains("fetch")').click();
      expect(binding('status')).toBe('200');
      expect(binding('data')).toMatch(/Hello, \$http!/);
    });
    
    it('should make a JSONP request to angularjs.org', function() {
      element(':button:contains("Sample JSONP")').click();
      element(':button:contains("fetch")').click();
      expect(binding('status')).toBe('200');
      expect(binding('data')).toMatch(/Super Hero!/);
    });
    
    it('should make JSONP request to invalid URL and invoke the error handler',
        function() {
      element(':button:contains("Invalid JSONP")').click();
      element(':button:contains("fetch")').click();
      expect(binding('status')).toBe('0');
      expect(binding('data')).toBe('Request failed');
    });

});

  describe("api/ng.$animationProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$animationProvider");
    });
  
});

  describe("api/ng.$animation", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$animation");
    });
  
});

  describe("api/ng.directive:ngClick", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngClick");
    });
  
    it('should check ng-click', function() {
      expect(binding('count')).toBe('0');
      element('.doc-example-live :button').click();
      expect(binding('count')).toBe('1');
    });

});

  describe("api/ng.directive:ngDblclick", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngDblclick");
    });
  
});

  describe("api/ng.directive:ngMousedown", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngMousedown");
    });
  
});

  describe("api/ng.directive:ngMouseup", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngMouseup");
    });
  
});

  describe("api/ng.directive:ngMouseover", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngMouseover");
    });
  
});

  describe("api/ng.directive:ngMouseenter", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngMouseenter");
    });
  
});

  describe("api/ng.directive:ngMouseleave", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngMouseleave");
    });
  
});

  describe("api/ng.directive:ngMousemove", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngMousemove");
    });
  
});

  describe("api/ng.directive:ngKeydown", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngKeydown");
    });
  
});

  describe("api/ng.directive:ngKeyup", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngKeyup");
    });
  
});

  describe("api/ng.directive:ngKeypress", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngKeypress");
    });
  
});

  describe("api/ng.directive:ngSubmit", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngSubmit");
    });
  
    it('should check ng-submit', function() {
      expect(binding('list')).toBe('[]');
      element('.doc-example-live #submit').click();
      expect(binding('list')).toBe('["hello"]');
      expect(input('text').val()).toBe('');
    });
    it('should ignore empty strings', function() {
      expect(binding('list')).toBe('[]');
      element('.doc-example-live #submit').click();
      element('.doc-example-live #submit').click();
      expect(binding('list')).toBe('["hello"]');
    });

});

  describe("api/ng.directive:ngCloak", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngCloak");
    });
  
    it('should remove the template directive and css class', function() {
      expect(element('.doc-example-live #template1').attr('ng-cloak')).
        not().toBeDefined();
      expect(element('.doc-example-live #template2').attr('ng-cloak')).
        not().toBeDefined();
    });

});

  describe("api/ng.directive:ngShow", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngShow");
    });
  
    it('should check ng-show / ng-hide', function() {
      expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);
      expect(element('.doc-example-live span:last:visible').count()).toEqual(1);
    
      input('checked').check();
    
      expect(element('.doc-example-live span:first:visible').count()).toEqual(1);
      expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);
    });

});

  describe("api/ng.directive:ngHide", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngHide");
    });
  
    it('should check ng-show / ng-hide', function() {
      expect(element('.doc-example-live .check-element:first:hidden').count()).toEqual(1);
      expect(element('.doc-example-live .check-element:last:visible').count()).toEqual(1);
    
      input('checked').check();
    
      expect(element('.doc-example-live .check-element:first:visible').count()).toEqual(1);
      expect(element('.doc-example-live .check-element:last:hidden').count()).toEqual(1);
    });

});

  describe("api/ng.directive:ngPluralize", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngPluralize");
    });
  
    it('should show correct pluralized string', function() {
      expect(element('.doc-example-live ng-pluralize:first').text()).
                                         toBe('1 person is viewing.');
      expect(element('.doc-example-live ng-pluralize:last').text()).
                                            toBe('Igor is viewing.');
    
      using('.doc-example-live').input('personCount').enter('0');
      expect(element('.doc-example-live ng-pluralize:first').text()).
                                           toBe('Nobody is viewing.');
      expect(element('.doc-example-live ng-pluralize:last').text()).
                                          toBe('Nobody is viewing.');
    
      using('.doc-example-live').input('personCount').enter('2');
      expect(element('.doc-example-live ng-pluralize:first').text()).
                                        toBe('2 people are viewing.');
      expect(element('.doc-example-live ng-pluralize:last').text()).
                          toBe('Igor and Misko are viewing.');
    
      using('.doc-example-live').input('personCount').enter('3');
      expect(element('.doc-example-live ng-pluralize:first').text()).
                                        toBe('3 people are viewing.');
      expect(element('.doc-example-live ng-pluralize:last').text()).
                          toBe('Igor, Misko and one other person are viewing.');
    
      using('.doc-example-live').input('personCount').enter('4');
      expect(element('.doc-example-live ng-pluralize:first').text()).
                                        toBe('4 people are viewing.');
      expect(element('.doc-example-live ng-pluralize:last').text()).
                          toBe('Igor, Misko and 2 other people are viewing.');
    });
    
    it('should show data-binded names', function() {
      using('.doc-example-live').input('personCount').enter('4');
      expect(element('.doc-example-live ng-pluralize:last').text()).
          toBe('Igor, Misko and 2 other people are viewing.');
    
      using('.doc-example-live').input('person1').enter('Di');
      using('.doc-example-live').input('person2').enter('Vojta');
      expect(element('.doc-example-live ng-pluralize:last').text()).
          toBe('Di, Vojta and 2 other people are viewing.');
    });

});

  describe("api/ng.directive:ngCsp", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngCsp");
    });
  
});

  describe("api/ng.directive:ngView", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngView");
    });
  
    it('should load and compile correct template', function() {
      element('a:contains("Moby: Ch1")').click();
      var content = element('.doc-example-live [ng-view]').text();
      expect(content).toMatch(/controller\: ChapterCntl/);
      expect(content).toMatch(/Book Id\: Moby/);
      expect(content).toMatch(/Chapter Id\: 1/);
    
      element('a:contains("Scarlet")').click();
      content = element('.doc-example-live [ng-view]').text();
      expect(content).toMatch(/controller\: BookCntl/);
      expect(content).toMatch(/Book Id\: Scarlet/);
    });

});

  describe("api/ng.directive:ngHref", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngHref");
    });
  
      it('should execute ng-click but not reload when href without value', function() {
        element('#link-1').click();
        expect(input('value').val()).toEqual('1');
        expect(element('#link-1').attr('href')).toBe("");
      });
    
      it('should execute ng-click but not reload when href empty string', function() {
        element('#link-2').click();
        expect(input('value').val()).toEqual('2');
        expect(element('#link-2').attr('href')).toBe("");
      });
    
      it('should execute ng-click and change url when ng-href specified', function() {
        expect(element('#link-3').attr('href')).toBe("/123");
    
        element('#link-3').click();
        expect(browser().window().path()).toEqual('/123');
      });
    
      it('should execute ng-click but not reload when href empty string and name specified', function() {
        element('#link-4').click();
        expect(input('value').val()).toEqual('4');
        expect(element('#link-4').attr('href')).toBe('');
      });
    
      it('should execute ng-click but not reload when no href but name specified', function() {
        element('#link-5').click();
        expect(input('value').val()).toEqual('5');
        expect(element('#link-5').attr('href')).toBe(undefined);
      });
    
      it('should only change url when only ng-href', function() {
        input('value').enter('6');
        expect(element('#link-6').attr('href')).toBe('6');
    
        element('#link-6').click();
        expect(browser().location().url()).toEqual('/6');
      });

});

  describe("api/ng.directive:ngSrc", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngSrc");
    });
  
});

  describe("api/ng.directive:ngDisabled", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngDisabled");
    });
  
    it('should toggle button', function() {
      expect(element('.doc-example-live :button').prop('disabled')).toBeFalsy();
      input('checked').check();
      expect(element('.doc-example-live :button').prop('disabled')).toBeTruthy();
    });

});

  describe("api/ng.directive:ngChecked", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngChecked");
    });
  
    it('should check both checkBoxes', function() {
      expect(element('.doc-example-live #checkSlave').prop('checked')).toBeFalsy();
      input('master').check();
      expect(element('.doc-example-live #checkSlave').prop('checked')).toBeTruthy();
    });

});

  describe("api/ng.directive:ngMultiple", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngMultiple");
    });
  
    it('should toggle multiple', function() {
      expect(element('.doc-example-live #select').prop('multiple')).toBeFalsy();
      input('checked').check();
      expect(element('.doc-example-live #select').prop('multiple')).toBeTruthy();
    });

});

  describe("api/ng.directive:ngReadonly", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngReadonly");
    });
  
    it('should toggle readonly attr', function() {
      expect(element('.doc-example-live :text').prop('readonly')).toBeFalsy();
      input('checked').check();
      expect(element('.doc-example-live :text').prop('readonly')).toBeTruthy();
    });

});

  describe("api/ng.directive:ngSelected", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngSelected");
    });
  
    it('should select Greetings!', function() {
      expect(element('.doc-example-live #greet').prop('selected')).toBeFalsy();
      input('selected').check();
      expect(element('.doc-example-live #greet').prop('selected')).toBeTruthy();
    });

});

  describe("api/ng.directive:ngOpen", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngOpen");
    });
  
    it('should toggle open', function() {
      expect(element('#details').prop('open')).toBeFalsy();
      input('open').check();
      expect(element('#details').prop('open')).toBeTruthy();
    });

});

  describe("api/ng.directive:ngNonBindable", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngNonBindable");
    });
  
    it('should check ng-non-bindable', function() {
      expect(using('.doc-example-live').binding('1 + 2')).toBe('3');
      expect(using('.doc-example-live').element('div:last').text()).
        toMatch(/1 \+ 2/);
    });

});

  describe("api/ng.directive:ngClass", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngClass");
    });
  
    it('should check ng-class', function() {
      expect(element('.doc-example-live span').prop('className')).not().
        toMatch(/my-class/);
    
      using('.doc-example-live').element(':button:first').click();
    
      expect(element('.doc-example-live span').prop('className')).
        toMatch(/my-class/);
    
      using('.doc-example-live').element(':button:last').click();
    
      expect(element('.doc-example-live span').prop('className')).not().
        toMatch(/my-class/);
    });

});

  describe("api/ng.directive:ngClassOdd", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngClassOdd");
    });
  
    it('should check ng-class-odd and ng-class-even', function() {
      expect(element('.doc-example-live li:first span').prop('className')).
        toMatch(/odd/);
      expect(element('.doc-example-live li:last span').prop('className')).
        toMatch(/even/);
    });

});

  describe("api/ng.directive:ngClassEven", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngClassEven");
    });
  
    it('should check ng-class-odd and ng-class-even', function() {
      expect(element('.doc-example-live li:first span').prop('className')).
        toMatch(/odd/);
      expect(element('.doc-example-live li:last span').prop('className')).
        toMatch(/even/);
    });

});

  describe("api/ng.directive:ngSwitch", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngSwitch");
    });
  
    it('should start in settings', function() {
      expect(element('.doc-example-live [ng-switch]').text()).toMatch(/Settings Div/);
    });
    it('should change to home', function() {
      select('selection').option('home');
      expect(element('.doc-example-live [ng-switch]').text()).toMatch(/Home Span/);
    });
    it('should select default', function() {
      select('selection').option('other');
      expect(element('.doc-example-live [ng-switch]').text()).toMatch(/default/);
    });

});

  describe("api/ng.directive:input.text", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:input.text");
    });
  
    it('should initialize to model', function() {
      expect(binding('text')).toEqual('guest');
      expect(binding('myForm.input.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty', function() {
      input('text').enter('');
      expect(binding('text')).toEqual('');
      expect(binding('myForm.input.$valid')).toEqual('false');
    });
    
    it('should be invalid if multi word', function() {
      input('text').enter('hello world');
      expect(binding('myForm.input.$valid')).toEqual('false');
    });
    
    it('should not be trimmed', function() {
      input('text').enter('untrimmed ');
      expect(binding('text')).toEqual('untrimmed ');
      expect(binding('myForm.input.$valid')).toEqual('true');
    });

});

  describe("api/ng.directive:input.number", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:input.number");
    });
  
    it('should initialize to model', function() {
     expect(binding('value')).toEqual('12');
     expect(binding('myForm.input.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty', function() {
     input('value').enter('');
     expect(binding('value')).toEqual('');
     expect(binding('myForm.input.$valid')).toEqual('false');
    });
    
    it('should be invalid if over max', function() {
     input('value').enter('123');
     expect(binding('value')).toEqual('');
     expect(binding('myForm.input.$valid')).toEqual('false');
    });

});

  describe("api/ng.directive:input.url", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:input.url");
    });
  
    it('should initialize to model', function() {
      expect(binding('text')).toEqual('http://google.com');
      expect(binding('myForm.input.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty', function() {
      input('text').enter('');
      expect(binding('text')).toEqual('');
      expect(binding('myForm.input.$valid')).toEqual('false');
    });
    
    it('should be invalid if not url', function() {
      input('text').enter('xxx');
      expect(binding('myForm.input.$valid')).toEqual('false');
    });

});

  describe("api/ng.directive:input.email", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:input.email");
    });
  
    it('should initialize to model', function() {
      expect(binding('text')).toEqual('me@example.com');
      expect(binding('myForm.input.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty', function() {
      input('text').enter('');
      expect(binding('text')).toEqual('');
      expect(binding('myForm.input.$valid')).toEqual('false');
    });
    
    it('should be invalid if not email', function() {
      input('text').enter('xxx');
      expect(binding('myForm.input.$valid')).toEqual('false');
    });

});

  describe("api/ng.directive:input.radio", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:input.radio");
    });
  
    it('should change state', function() {
      expect(binding('color')).toEqual('blue');
    
      input('color').select('red');
      expect(binding('color')).toEqual('red');
    });

});

  describe("api/ng.directive:input.checkbox", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:input.checkbox");
    });
  
    it('should change state', function() {
      expect(binding('value1')).toEqual('true');
      expect(binding('value2')).toEqual('YES');
    
      input('value1').check();
      input('value2').check();
      expect(binding('value1')).toEqual('false');
      expect(binding('value2')).toEqual('NO');
    });

});

  describe("api/ng.directive:textarea", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:textarea");
    });
  
});

  describe("api/ng.directive:input", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:input");
    });
  
    it('should initialize to model', function() {
      expect(binding('user')).toEqual('{"name":"guest","last":"visitor"}');
      expect(binding('myForm.userName.$valid')).toEqual('true');
      expect(binding('myForm.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty when required', function() {
      input('user.name').enter('');
      expect(binding('user')).toEqual('{"last":"visitor"}');
      expect(binding('myForm.userName.$valid')).toEqual('false');
      expect(binding('myForm.$valid')).toEqual('false');
    });
    
    it('should be valid if empty when min length is set', function() {
      input('user.last').enter('');
      expect(binding('user')).toEqual('{"name":"guest","last":""}');
      expect(binding('myForm.lastName.$valid')).toEqual('true');
      expect(binding('myForm.$valid')).toEqual('true');
    });
    
    it('should be invalid if less than required min length', function() {
      input('user.last').enter('xx');
      expect(binding('user')).toEqual('{"name":"guest"}');
      expect(binding('myForm.lastName.$valid')).toEqual('false');
      expect(binding('myForm.lastName.$error')).toMatch(/minlength/);
      expect(binding('myForm.$valid')).toEqual('false');
    });
    
    it('should be invalid if longer than max length', function() {
      input('user.last').enter('some ridiculously long name');
      expect(binding('user'))
        .toEqual('{"name":"guest"}');
      expect(binding('myForm.lastName.$valid')).toEqual('false');
      expect(binding('myForm.lastName.$error')).toMatch(/maxlength/);
      expect(binding('myForm.$valid')).toEqual('false');
    });

});

  describe("api/ng.directive:ngModel.NgModelController", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngModel.NgModelController");
    });
  
      it('should data-bind and become invalid', function() {
        var contentEditable = element('[contenteditable]');
    
        expect(contentEditable.text()).toEqual('Change me!');
        input('userContent').enter('');
        expect(contentEditable.text()).toEqual('');
        expect(contentEditable.prop('className')).toMatch(/ng-invalid-required/);
      });

});

  describe("api/ng.directive:ngModel", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngModel");
    });
  
});

  describe("api/ng.directive:ngChange", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngChange");
    });
  
    it('should evaluate the expression if changing from view', function() {
      expect(binding('counter')).toEqual('0');
      element('#ng-change-example1').click();
      expect(binding('counter')).toEqual('1');
      expect(binding('confirmed')).toEqual('true');
    });
    
    it('should not evaluate the expression if changing from model', function() {
      element('#ng-change-example2').click();
      expect(binding('counter')).toEqual('0');
      expect(binding('confirmed')).toEqual('true');
    });

});

  describe("api/ng.directive:ngList", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngList");
    });
  
    it('should initialize to model', function() {
      expect(binding('names')).toEqual('["igor","misko","vojta"]');
      expect(binding('myForm.namesInput.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty', function() {
      input('names').enter('');
      expect(binding('names')).toEqual('[]');
      expect(binding('myForm.namesInput.$valid')).toEqual('false');
    });

});

  describe("api/ng.directive:ngTransclude", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngTransclude");
    });
  
    it('should have transcluded', function() {
      input('title').enter('TITLE');
      input('text').enter('TEXT');
      expect(binding('title')).toEqual('TITLE');
      expect(binding('text')).toEqual('TEXT');
    });

});

  describe("api/ng.directive:ngRepeat", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngRepeat");
    });
  
     it('should render initial data set', function() {
       var r = using('.doc-example-live').repeater('ul li');
       expect(r.count()).toBe(10);
       expect(r.row(0)).toEqual(["1","John","25"]);
       expect(r.row(1)).toEqual(["2","Jessie","30"]);
       expect(r.row(9)).toEqual(["10","Samantha","60"]);
       expect(binding('friends.length')).toBe("10");
     });
    
     it('should update repeater when filter predicate changes', function() {
       var r = using('.doc-example-live').repeater('ul li');
       expect(r.count()).toBe(10);
    
       input('q').enter('ma');
    
       expect(r.count()).toBe(2);
       expect(r.row(0)).toEqual(["1","Mary","28"]);
       expect(r.row(1)).toEqual(["2","Samantha","60"]);
     });

});

  describe("api/ng.directive:form.FormController", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:form.FormController");
    });
  
});

  describe("api/ng.directive:ngForm", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngForm");
    });
  
});

  describe("api/ng.directive:form", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:form");
    });
  
    it('should initialize to model', function() {
     expect(binding('userType')).toEqual('guest');
     expect(binding('myForm.input.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty', function() {
     input('userType').enter('');
     expect(binding('userType')).toEqual('');
     expect(binding('myForm.input.$valid')).toEqual('false');
    });

});

  describe("api/ng.directive:script", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:script");
    });
  
    it('should load template defined inside script tag', function() {
      element('#tpl-link').click();
      expect(element('#tpl-content').text()).toMatch(/Content of the template/);
    });

});

  describe("api/ng.directive:ngInclude", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngInclude");
    });
  
    it('should load template1.html', function() {
     expect(element('.doc-example-live [ng-include]').text()).
       toMatch(/Content of template1.html/);
    });
    it('should load template2.html', function() {
     select('template').option('1');
     expect(element('.doc-example-live [ng-include]').text()).
       toMatch(/Content of template2.html/);
    });
    it('should change to blank', function() {
     select('template').option('');
     expect(element('.doc-example-live [ng-include]').text()).toEqual('');
    });

});

  describe("api/ng.directive:ngBind", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngBind");
    });
  
      it('should check ng-bind', function() {
        expect(using('.doc-example-live').binding('name')).toBe('Whirled');
        using('.doc-example-live').input('name').enter('world');
        expect(using('.doc-example-live').binding('name')).toBe('world');
      });

});

  describe("api/ng.directive:ngBindTemplate", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngBindTemplate");
    });
  
      it('should check ng-bind', function() {
        expect(using('.doc-example-live').binding('salutation')).
          toBe('Hello');
        expect(using('.doc-example-live').binding('name')).
          toBe('World');
        using('.doc-example-live').input('salutation').enter('Greetings');
        using('.doc-example-live').input('name').enter('user');
        expect(using('.doc-example-live').binding('salutation')).
          toBe('Greetings');
        expect(using('.doc-example-live').binding('name')).
          toBe('user');
      });

});

  describe("api/ng.directive:ngBindHtmlUnsafe", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngBindHtmlUnsafe");
    });
  
});

  describe("api/ng.directive:ngStyle", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngStyle");
    });
  
    it('should check ng-style', function() {
      expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
      element('.doc-example-live :button[value=set]').click();
      expect(element('.doc-example-live span').css('color')).toBe('rgb(255, 0, 0)');
      element('.doc-example-live :button[value=clear]').click();
      expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
    });

});

  describe("api/ng.directive:ngIf", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngIf");
    });
  
});

  describe("api/ng.directive:select", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:select");
    });
  
    it('should check ng-options', function() {
      expect(binding('{selected_color:color}')).toMatch('red');
      select('color').option('0');
      expect(binding('{selected_color:color}')).toMatch('black');
      using('.nullable').select('color').option('');
      expect(binding('{selected_color:color}')).toMatch('null');
    });

});

  describe("api/ng.directive:ngInit", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngInit");
    });
  
      it('should check greeting', function() {
        expect(binding('greeting')).toBe('Hello');
        expect(binding('person')).toBe('World');
      });

});

  describe("api/ng.directive:a", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:a");
    });
  
});

  describe("api/ng.directive:ngController", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngController");
    });
  
      it('should check controller', function() {
        expect(element('.doc-example-live div>:input').val()).toBe('John Smith');
        expect(element('.doc-example-live li:nth-child(1) input').val())
          .toBe('408 555 1212');
        expect(element('.doc-example-live li:nth-child(2) input').val())
          .toBe('john.smith@example.org');
    
        element('.doc-example-live li:first a:contains("clear")').click();
        expect(element('.doc-example-live li:first input').val()).toBe('');
    
        element('.doc-example-live li:last a:contains("add")').click();
        expect(element('.doc-example-live li:nth-child(3) input').val())
          .toBe('yourname@example.org');
      });

});

  describe("api/ng.$controllerProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$controllerProvider");
    });
  
});

  describe("api/ng.$controller", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$controller");
    });
  
});

  describe("api/ng.$compile", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$compile");
    });
  
      it('should auto compile', function() {
        expect(element('div[compile]').text()).toBe('Hello Angular');
        input('html').enter('{{name}}!');
        expect(element('div[compile]').text()).toBe('Angular!');
      });

});

  describe("api/ng.$compileProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$compileProvider");
    });
  
});

  describe("api/ng.$compile.directive.Attributes", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$compile.directive.Attributes");
    });
  
});

  describe("api/ng.filter:currency", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.filter:currency");
    });
  
    it('should init with 1234.56', function() {
      expect(binding('amount | currency')).toBe('$1,234.56');
      expect(binding('amount | currency:"USD$"')).toBe('USD$1,234.56');
    });
    it('should update', function() {
      input('amount').enter('-1234');
      expect(binding('amount | currency')).toBe('($1,234.00)');
      expect(binding('amount | currency:"USD$"')).toBe('(USD$1,234.00)');
    });

});

  describe("api/ng.filter:number", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.filter:number");
    });
  
    it('should format numbers', function() {
      expect(binding('val | number')).toBe('1,234.568');
      expect(binding('val | number:0')).toBe('1,235');
      expect(binding('-val | number:4')).toBe('-1,234.5679');
    });
    
    it('should update', function() {
      input('val').enter('3374.333');
      expect(binding('val | number')).toBe('3,374.333');
      expect(binding('val | number:0')).toBe('3,374');
      expect(binding('-val | number:4')).toBe('-3,374.3330');
    });

});

  describe("api/ng.filter:date", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.filter:date");
    });
  
    it('should format date', function() {
      expect(binding("1288323623006 | date:'medium'")).
         toMatch(/Oct 2\d, 2010 \d{1,2}:\d{2}:\d{2} (AM|PM)/);
      expect(binding("1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'")).
         toMatch(/2010\-10\-2\d \d{2}:\d{2}:\d{2} (\-|\+)?\d{4}/);
      expect(binding("'1288323623006' | date:'MM/dd/yyyy @ h:mma'")).
         toMatch(/10\/2\d\/2010 @ \d{1,2}:\d{2}(AM|PM)/);
    });

});

  describe("api/ng.filter:json", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.filter:json");
    });
  
    it('should jsonify filtered objects', function() {
      expect(binding("{'name':'value'}")).toMatch(/\{\n  "name": ?"value"\n}/);
    });

});

  describe("api/ng.filter:lowercase", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.filter:lowercase");
    });
  
});

  describe("api/ng.filter:uppercase", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.filter:uppercase");
    });
  
});

  describe("api/ng.filter:filter", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.filter:filter");
    });
  
    it('should search across all fields when filtering with a string', function() {
      input('searchText').enter('m');
      expect(repeater('#searchTextResults tr', 'friend in friends').column('friend.name')).
        toEqual(['Mary', 'Mike', 'Adam']);
    
      input('searchText').enter('76');
      expect(repeater('#searchTextResults tr', 'friend in friends').column('friend.name')).
        toEqual(['John', 'Julie']);
    });
    
    it('should search in specific fields when filtering with a predicate object', function() {
      input('search.$').enter('i');
      expect(repeater('#searchObjResults tr', 'friend in friends').column('friend.name')).
        toEqual(['Mary', 'Mike', 'Julie', 'Juliette']);
    });
    it('should use a equal comparison when comparator is true', function() {
      input('search.name').enter('Julie');
      input('strict').check();
      expect(repeater('#searchObjResults tr', 'friend in friends').column('friend.name')).
        toEqual(['Julie']);
    });

});

  describe("api/ng.filter:limitTo", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.filter:limitTo");
    });
  
    it('should limit the number array to first three items', function() {
      expect(element('.doc-example-live input[ng-model=numLimit]').val()).toBe('3');
      expect(element('.doc-example-live input[ng-model=letterLimit]').val()).toBe('3');
      expect(binding('numbers | limitTo:numLimit')).toEqual('[1,2,3]');
      expect(binding('letters | limitTo:letterLimit')).toEqual('abc');
    });
    
    it('should update the output when -3 is entered', function() {
      input('numLimit').enter(-3);
      input('letterLimit').enter(-3);
      expect(binding('numbers | limitTo:numLimit')).toEqual('[7,8,9]');
      expect(binding('letters | limitTo:letterLimit')).toEqual('ghi');
    });
    
    it('should not exceed the maximum size of input array', function() {
      input('numLimit').enter(100);
      input('letterLimit').enter(100);
      expect(binding('numbers | limitTo:numLimit')).toEqual('[1,2,3,4,5,6,7,8,9]');
      expect(binding('letters | limitTo:letterLimit')).toEqual('abcdefghi');
    });

});

  describe("api/ng.filter:orderBy", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.filter:orderBy");
    });
  
    it('should be reverse ordered by aged', function() {
      expect(binding('predicate')).toBe('-age');
      expect(repeater('table.friend', 'friend in friends').column('friend.age')).
        toEqual(['35', '29', '21', '19', '10']);
      expect(repeater('table.friend', 'friend in friends').column('friend.name')).
        toEqual(['Adam', 'Julie', 'Mike', 'Mary', 'John']);
    });
    
    it('should reorder the table when user selects different predicate', function() {
      element('.doc-example-live a:contains("Name")').click();
      expect(repeater('table.friend', 'friend in friends').column('friend.name')).
        toEqual(['Adam', 'John', 'Julie', 'Mary', 'Mike']);
      expect(repeater('table.friend', 'friend in friends').column('friend.age')).
        toEqual(['35', '10', '29', '19', '21']);
    
      element('.doc-example-live a:contains("Phone")').click();
      expect(repeater('table.friend', 'friend in friends').column('friend.phone')).
        toEqual(['555-9876', '555-8765', '555-5678', '555-4321', '555-1212']);
      expect(repeater('table.friend', 'friend in friends').column('friend.name')).
        toEqual(['Mary', 'Julie', 'Adam', 'Mike', 'John']);
    });

});

  describe("api/ng.$filterProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$filterProvider");
    });
  
});

  describe("api/ng.$filter", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$filter");
    });
  
});

  describe("api/ng.$document", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$document");
    });
  
});

  describe("api/ng.$interpolateProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$interpolateProvider");
    });
  
});

  describe("api/ng.$interpolate", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$interpolate");
    });
  
});

  describe("api/ng.$cacheFactory", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$cacheFactory");
    });
  
});

  describe("api/ng.$templateCache", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$templateCache");
    });
  
});

  describe("api/ng.$log", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$log");
    });
  
});

  describe("api/ng.$logProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$logProvider");
    });
  
});

  describe("api/ng.$rootScopeProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$rootScopeProvider");
    });
  
});

  describe("api/ng.$rootScope", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$rootScope");
    });
  
});

  describe("api/ng.$rootScope.Scope", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$rootScope.Scope");
    });
  
});

  describe("api/ng.$httpBackend", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$httpBackend");
    });
  
});

  describe("api/ng.$q", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$q");
    });
  
});

  describe("api/ng.$routeProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$routeProvider");
    });
  
});

  describe("api/ng.$route", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$route");
    });
  
    it('should load and compile correct template', function() {
      element('a:contains("Moby: Ch1")').click();
      var content = element('.doc-example-live [ng-view]').text();
      expect(content).toMatch(/controller\: ChapterCntl/);
      expect(content).toMatch(/Book Id\: Moby/);
      expect(content).toMatch(/Chapter Id\: 1/);
    
      element('a:contains("Scarlet")').click();
      sleep(2); // promises are not part of scenario waiting
      content = element('.doc-example-live [ng-view]').text();
      expect(content).toMatch(/controller\: BookCntl/);
      expect(content).toMatch(/Book Id\: Scarlet/);
    });

});

  describe("api/ng.$location", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$location");
    });
  
});

  describe("api/ng.$locationProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$locationProvider");
    });
  
});

  describe("api/ng.$rootElement", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$rootElement");
    });
  
});

  describe("api/ng.$locale", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$locale");
    });
  
});

  describe("api/ng.$window", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$window");
    });
  
    

});

  describe("api/ng.$anchorScroll", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$anchorScroll");
    });
  
});

  describe("api/ng.directive:ngAnimate", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.directive:ngAnimate");
    });
  
});

  describe("api/ng.$animator", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$animator");
    });
  
});

  describe("api/ng.$timeout", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ng.$timeout");
    });
  
});

  describe("api/ngMobile.directive:ngSwipeLeft", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngMobile.directive:ngSwipeLeft");
    });
  
});

  describe("api/ngMobile.directive:ngSwipeRight", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngMobile.directive:ngSwipeRight");
    });
  
});

  describe("api/ngMobile.directive:ngTap", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngMobile.directive:ngTap");
    });
  
});

  describe("api/ngMobile", function() {
    beforeEach(function() {
      browser().navigateTo("index-nocache.html#!/api/ngMobile");
    });
  
});

});


describe("angular+jquery", function() {
  describe("cookbook/mvc", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/mvc");
    });
  
      it('should play a game', function() {
       piece(1, 1);
       expect(binding('nextMove')).toEqual('O');
       piece(3, 1);
       expect(binding('nextMove')).toEqual('X');
       piece(1, 2);
       piece(3, 2);
       piece(1, 3);
       expect(element('.winner').text()).toEqual('Player X has won!');
      });
    
      function piece(row, col) {
        element('.board tr:nth-child('+row+') td:nth-child('+col+')').click();
      }

});

  describe("cookbook/deeplinking_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/deeplinking_ru");
    });
  
      it('should navigate to URL', function() {
        element('a:contains(Welcome)').click();
        expect(element('[ng-view]').text()).toMatch(/Hello anonymous/);
        element('a:contains(Settings)').click();
        input('form.name').enter('yourname');
        element(':button:contains(Save)').click();
        element('a:contains(Welcome)').click();
        expect(element('[ng-view]').text()).toMatch(/Hello yourname/);
      });

});

  describe("cookbook/deeplinking", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/deeplinking");
    });
  
      it('should navigate to URL', function() {
        element('a:contains(Welcome)').click();
        expect(element('[ng-view]').text()).toMatch(/Hello anonymous/);
        element('a:contains(Settings)').click();
        input('form.name').enter('yourname');
        element(':button:contains(Save)').click();
        element('a:contains(Welcome)').click();
        expect(element('[ng-view]').text()).toMatch(/Hello yourname/);
      });

});

  describe("cookbook/helloworld_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/helloworld_ru");
    });
  
    it('should change the binding when user enters text', function() {
      expect(binding('name')).toEqual('World');
      input('name').enter('angular');
      expect(binding('name')).toEqual('angular');
    });

});

  describe("cookbook/advancedform_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/advancedform_ru");
    });
  
    it('should enable save button', function() {
      expect(element(':button:contains(Save)').attr('disabled')).toBeTruthy();
      input('form.name').enter('');
      expect(element(':button:contains(Save)').attr('disabled')).toBeTruthy();
      input('form.name').enter('change');
      expect(element(':button:contains(Save)').attr('disabled')).toBeFalsy();
      element(':button:contains(Save)').click();
      expect(element(':button:contains(Save)').attr('disabled')).toBeTruthy();
    });
    it('should enable cancel button', function() {
      expect(element(':button:contains(Cancel)').attr('disabled')).toBeTruthy();
      input('form.name').enter('change');
      expect(element(':button:contains(Cancel)').attr('disabled')).toBeFalsy();
      element(':button:contains(Cancel)').click();
      expect(element(':button:contains(Cancel)').attr('disabled')).toBeTruthy();
      expect(element(':input[ng\\:model="form.name"]').val()).toEqual('John Smith');
    });

});

  describe("cookbook/form", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/form");
    });
  
     it('should show debug', function() {
       expect(binding('user')).toMatch(/John Smith/);
     });
     it('should add contact', function() {
       using('.example').element('a:contains(add)').click();
       using('.example div:last').input('contact.value').enter('you@example.org');
       expect(binding('user')).toMatch(/\(234\) 555\-1212/);
       expect(binding('user')).toMatch(/you@example.org/);
     });
    
     it('should remove contact', function() {
       using('.example').element('a:contains(X)').click();
       expect(binding('user')).not().toMatch(/\(234\) 555\-1212/);
     });
    
     it('should validate zip', function() {
       expect(using('.example').
         element(':input[ng\\:model="user.address.zip"]').
         prop('className')).not().toMatch(/ng-invalid/);
       using('.example').input('user.address.zip').enter('abc');
       expect(using('.example').
         element(':input[ng\\:model="user.address.zip"]').
         prop('className')).toMatch(/ng-invalid/);
     });
    
     it('should validate state', function() {
       expect(using('.example').element(':input[ng\\:model="user.address.state"]').prop('className'))
         .not().toMatch(/ng-invalid/);
       using('.example').input('user.address.state').enter('XXX');
       expect(using('.example').element(':input[ng\\:model="user.address.state"]').prop('className'))
         .toMatch(/ng-invalid/);
     });

});

  describe("cookbook/buzz_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/buzz_ru");
    });
  
     xit('fetch buzz and expand', function() {
       element(':button:contains(fetch)').click();
       expect(repeater('div.buzz').count()).toBeGreaterThan(0);
       element('.buzz a:contains(Expand replies):first').click();
       expect(repeater('div.reply').count()).toBeGreaterThan(0);
     });

});

  describe("cookbook/buzz", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/buzz");
    });
  
     xit('fetch buzz and expand', function() {
       element(':button:contains(fetch)').click();
       expect(repeater('div.buzz').count()).toBeGreaterThan(0);
       element('.buzz a:contains(Expand replies):first').click();
       expect(repeater('div.reply').count()).toBeGreaterThan(0);
     });

});

  describe("cookbook/index", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/index");
    });
  
});

  describe("cookbook/helloworld", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/helloworld");
    });
  
    it('should change the binding when user enters text', function() {
      expect(binding('name')).toEqual('World');
      input('name').enter('angular');
      expect(binding('name')).toEqual('angular');
    });

});

  describe("cookbook/advancedform", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/advancedform");
    });
  
    it('should enable save button', function() {
      expect(element(':button:contains(Save)').attr('disabled')).toBeTruthy();
      input('form.name').enter('');
      expect(element(':button:contains(Save)').attr('disabled')).toBeTruthy();
      input('form.name').enter('change');
      expect(element(':button:contains(Save)').attr('disabled')).toBeFalsy();
      element(':button:contains(Save)').click();
      expect(element(':button:contains(Save)').attr('disabled')).toBeTruthy();
    });
    it('should enable cancel button', function() {
      expect(element(':button:contains(Cancel)').attr('disabled')).toBeTruthy();
      input('form.name').enter('change');
      expect(element(':button:contains(Cancel)').attr('disabled')).toBeFalsy();
      element(':button:contains(Cancel)').click();
      expect(element(':button:contains(Cancel)').attr('disabled')).toBeTruthy();
      expect(element(':input[ng\\:model="form.name"]').val()).toEqual('John Smith');
    });

});

  describe("cookbook/form_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/form_ru");
    });
  
     it('should show debug', function() {
       expect(binding('user')).toMatch(/John Smith/);
     });
     it('should add contact', function() {
       using('.example').element('a:contains(add)').click();
       using('.example div:last').input('contact.value').enter('you@example.org');
       expect(binding('user')).toMatch(/\(234\) 555\-1212/);
       expect(binding('user')).toMatch(/you@example.org/);
     });
    
     it('should remove contact', function() {
       using('.example').element('a:contains(X)').click();
       expect(binding('user')).not().toMatch(/\(234\) 555\-1212/);
     });
    
     it('should validate zip', function() {
       expect(using('.example').
         element(':input[ng\\:model="user.address.zip"]').
         prop('className')).not().toMatch(/ng-invalid/);
       using('.example').input('user.address.zip').enter('abc');
       expect(using('.example').
         element(':input[ng\\:model="user.address.zip"]').
         prop('className')).toMatch(/ng-invalid/);
     });
    
     it('should validate state', function() {
       expect(using('.example').element(':input[ng\\:model="user.address.state"]').prop('className'))
         .not().toMatch(/ng-invalid/);
       using('.example').input('user.address.state').enter('XXX');
       expect(using('.example').element(':input[ng\\:model="user.address.state"]').prop('className'))
         .toMatch(/ng-invalid/);
     });

});

  describe("cookbook/index_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/index_ru");
    });
  
});

  describe("cookbook/mvc_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/cookbook/mvc_ru");
    });
  
      it('should play a game', function() {
       piece(1, 1);
       expect(binding('nextMove')).toEqual('O');
       piece(3, 1);
       expect(binding('nextMove')).toEqual('X');
       piece(1, 2);
       piece(3, 2);
       piece(1, 3);
       expect(element('.winner').text()).toEqual('Player X has won!');
      });
    
      function piece(row, col) {
        element('.board tr:nth-child('+row+') td:nth-child('+col+')').click();
      }

});

  describe("api/index", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/index");
    });
  
});

  describe("api/ng", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng");
    });
  
});

  describe("api/index_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/index_ru");
    });
  
});

  describe("api/ng_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng_ru");
    });
  
});

  describe("tutorial/step_00", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_00");
    });
  
});

  describe("tutorial/step_05", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_05");
    });
  
});

  describe("tutorial/step_11_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_11_ru");
    });
  
});

  describe("tutorial/the_end_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/the_end_ru");
    });
  
});

  describe("tutorial/step_07_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_07_ru");
    });
  
});

  describe("tutorial/step_03_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_03_ru");
    });
  
});

  describe("tutorial/step_06", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_06");
    });
  
});

  describe("tutorial/step_03", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_03");
    });
  
});

  describe("tutorial/step_04_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_04_ru");
    });
  
});

  describe("tutorial/step_02", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_02");
    });
  
});

  describe("tutorial/step_10_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_10_ru");
    });
  
});

  describe("tutorial/step_09_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_09_ru");
    });
  
});

  describe("tutorial/the_end", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/the_end");
    });
  
});

  describe("tutorial/index", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/index");
    });
  
});

  describe("tutorial/step_01_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_01_ru");
    });
  
});

  describe("tutorial/step_09", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_09");
    });
  
});

  describe("tutorial/step_00_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_00_ru");
    });
  
});

  describe("tutorial/step_07", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_07");
    });
  
});

  describe("tutorial/step_06_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_06_ru");
    });
  
});

  describe("tutorial/step_02_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_02_ru");
    });
  
});

  describe("tutorial/index_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/index_ru");
    });
  
});

  describe("tutorial/step_08_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_08_ru");
    });
  
});

  describe("tutorial/step_01", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_01");
    });
  
});

  describe("tutorial/step_10", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_10");
    });
  
});

  describe("tutorial/step_11", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_11");
    });
  
});

  describe("tutorial/step_05_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_05_ru");
    });
  
});

  describe("tutorial/step_08", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_08");
    });
  
});

  describe("tutorial/step_04", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/tutorial/step_04");
    });
  
});

  describe("misc/downloading_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/misc/downloading_ru");
    });
  
});

  describe("misc/started_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/misc/started_ru");
    });
  
});

  describe("misc/contribute", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/misc/contribute");
    });
  
});

  describe("misc/faq", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/misc/faq");
    });
  
});

  describe("misc/downloading", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/misc/downloading");
    });
  
});

  describe("misc/started", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/misc/started");
    });
  
});

  describe("misc/contribute_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/misc/contribute_ru");
    });
  
});

  describe("misc/faq_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/misc/faq_ru");
    });
  
});

  describe("guide/expression_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/expression_ru");
    });
  
    it('should calculate expression in binding', function() {
      expect(binding('1+2')).toEqual('3');
    });

    it('should allow user expression testing', function() {
       element('.expressions :button').click();
       var li = using('.expressions ul').repeater('li');
       expect(li.count()).toBe(1);
       expect(li.row(0)).toEqual(["3*10|currency", "$30.00"]);
    });

    it('should calculate expression in binding', function() {
      var alertText;
      this.addFutureAction('set mock', function($window, $document, done) {
        $window.mockWindow = {
          alert: function(text){ alertText = text; }
        };
        done();
      });
      element(':button:contains(Greet)').click();
      expect(this.addFuture('alert text', function(done) {
        done(null, alertText);
      })).toBe('Hello World');
    });

});

  describe("guide/dev_guide.unit-testing", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.unit-testing");
    });
  
});

  describe("guide/dev_guide.services.injecting_controllers", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services.injecting_controllers");
    });
  
    it('should test service', function() {
      expect(element(':input[ng\\:model="message"]').val()).toEqual('test');
    });

});

  describe("guide/bootstrap_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/bootstrap_ru");
    });
  
});

  describe("guide/concepts", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/concepts");
    });
  
});

  describe("guide/introduction", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/introduction");
    });
  
});

  describe("guide/dev_guide.e2e-testing", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.e2e-testing");
    });
  
});

  describe("guide/i18n", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/i18n");
    });
  
});

  describe("guide/dev_guide.services.testing_services_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services.testing_services_ru");
    });
  
});

  describe("guide/dev_guide.services.testing_services", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services.testing_services");
    });
  
});

  describe("guide/dev_guide.templates.filters_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.templates.filters_ru");
    });
  
});

  describe("guide/dev_guide.mvc.understanding_controller", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.mvc.understanding_controller");
    });
  
});

  describe("guide/type", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/type");
    });
  
});

  describe("guide/dev_guide.templates.filters.using_filters_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.templates.filters.using_filters_ru");
    });
  
});

  describe("guide/forms", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/forms");
    });
  
});

  describe("guide/dev_guide.services.creating_services", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services.creating_services");
    });
  
});

  describe("guide/dev_guide.templates.databinding_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.templates.databinding_ru");
    });
  
});

  describe("guide/concepts_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/concepts_ru");
    });
  
});

  describe("guide/directive", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/directive");
    });
  
      it('should show off bindings', function() {
        expect(element('div[ng-controller="Ctrl1"] span[ng-bind]').text()).toBe('angular');
      });

      it('should bind and open / close', function() {
        input('title').enter('TITLE');
        input('text').enter('TEXT');
        expect(element('.title').text()).toEqual('Details: TITLE...');
        expect(binding('text')).toEqual('TEXT');
    
        expect(element('.zippy').prop('className')).toMatch(/closed/);
        element('.zippy > .title').click();
        expect(element('.zippy').prop('className')).toMatch(/opened/);
      });

});

  describe("guide/dev_guide.templates.databinding", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.templates.databinding");
    });
  
});

  describe("guide/di_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/di_ru");
    });
  
});

  describe("guide/bootstrap", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/bootstrap");
    });
  
});

  describe("guide/dev_guide.unit-testing_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.unit-testing_ru");
    });
  
});

  describe("guide/dev_guide.e2e-testing_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.e2e-testing_ru");
    });
  
});

  describe("guide/dev_guide.templates.css-styling", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.templates.css-styling");
    });
  
});

  describe("guide/introduction_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/introduction_ru");
    });
  
});

  describe("guide/compiler", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/compiler");
    });
  
});

  describe("guide/dev_guide.templates.filters.creating_filters_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.templates.filters.creating_filters_ru");
    });
  
    it('should reverse greeting', function() {
      expect(binding('greeting|reverse')).toEqual('olleh');
      input('greeting').enter('ABC');
      expect(binding('greeting|reverse')).toEqual('CBA');
    });

});

  describe("guide/compiler_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/compiler_ru");
    });
  
});

  describe("guide/dev_guide.templates.filters", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.templates.filters");
    });
  
});

  describe("guide/dev_guide.services.managing_dependencies", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services.managing_dependencies");
    });
  
});

  describe("guide/dev_guide.templates", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.templates");
    });
  
});

  describe("guide/dev_guide.mvc.understanding_view", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.mvc.understanding_view");
    });
  
});

  describe("guide/dev_guide.mvc", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.mvc");
    });
  
});

  describe("guide/index", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/index");
    });
  
});

  describe("guide/overview", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/overview");
    });
  
      it('should show of angular binding', function() {
        expect(binding('qty * cost')).toEqual('$19.95');
        input('qty').enter('2');
        input('cost').enter('5.00');
        expect(binding('qty * cost')).toEqual('$10.00');
      });

});

  describe("guide/forms_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/forms_ru");
    });
  
});

  describe("guide/dev_guide.templates.filters.creating_filters", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.templates.filters.creating_filters");
    });
  
    it('should reverse greeting', function() {
      expect(binding('greeting|reverse')).toEqual('olleh');
      input('greeting').enter('ABC');
      expect(binding('greeting|reverse')).toEqual('CBA');
    });

});

  describe("guide/module", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/module");
    });
  
});

  describe("guide/dev_guide.templates_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.templates_ru");
    });
  
});

  describe("guide/dev_guide.mvc.understanding_model", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.mvc.understanding_model");
    });
  
});

  describe("guide/scope_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/scope_ru");
    });
  
});

  describe("guide/dev_guide.mvc.understanding_model_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.mvc.understanding_model_ru");
    });
  
});

  describe("guide/dev_guide.services.understanding_services_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services.understanding_services_ru");
    });
  
});

  describe("guide/ie_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/ie_ru");
    });
  
});

  describe("guide/dev_guide.mvc.understanding_view_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.mvc.understanding_view_ru");
    });
  
});

  describe("guide/scope", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/scope");
    });
  
});

  describe("guide/dev_guide.services.managing_dependencies_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services.managing_dependencies_ru");
    });
  
});

  describe("guide/dev_guide.services.$location_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services.$location_ru");
    });
  
});

  describe("guide/dev_guide.services.injecting_controllers_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services.injecting_controllers_ru");
    });
  
    it('should test service', function() {
      expect(element(':input[ng\\:model="message"]').val()).toEqual('test');
    });

});

  describe("guide/type_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/type_ru");
    });
  
});

  describe("guide/dev_guide.mvc_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.mvc_ru");
    });
  
});

  describe("guide/dev_guide.services.$location", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services.$location");
    });
  
});

  describe("guide/di", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/di");
    });
  
});

  describe("guide/ie", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/ie");
    });
  
});

  describe("guide/dev_guide.services.understanding_services", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services.understanding_services");
    });
  
});

  describe("guide/directive_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/directive_ru");
    });
  
      it('should show off bindings', function() {
        expect(element('div[ng-controller="Ctrl1"] span[ng-bind]').text()).toBe('angular');
      });

      it('should bind and open / close', function() {
        input('title').enter('TITLE');
        input('text').enter('TEXT');
        expect(element('.title').text()).toEqual('Details: TITLE...');
        expect(binding('text')).toEqual('TEXT');
    
        expect(element('.zippy').prop('className')).toMatch(/closed/);
        element('.zippy > .title').click();
        expect(element('.zippy').prop('className')).toMatch(/opened/);
      });

});

  describe("guide/i18n_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/i18n_ru");
    });
  
});

  describe("guide/expression", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/expression");
    });
  
    it('should calculate expression in binding', function() {
      expect(binding('1+2')).toEqual('3');
    });

    it('should allow user expression testing', function() {
       element('.expressions :button').click();
       var li = using('.expressions ul').repeater('li');
       expect(li.count()).toBe(1);
       expect(li.row(0)).toEqual(["3*10|currency", "$30.00"]);
    });

    it('should calculate expression in binding', function() {
      var alertText;
      this.addFutureAction('set mock', function($window, $document, done) {
        $window.mockWindow = {
          alert: function(text){ alertText = text; }
        };
        done();
      });
      element(':button:contains(Greet)').click();
      expect(this.addFuture('alert text', function(done) {
        done(null, alertText);
      })).toBe('Hello World');
    });

});

  describe("guide/dev_guide.services_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services_ru");
    });
  
});

  describe("guide/dev_guide.templates.filters.using_filters", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.templates.filters.using_filters");
    });
  
});

  describe("guide/overview_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/overview_ru");
    });
  
      it('should show of angular binding', function() {
        expect(binding('qty * cost')).toEqual('$19.95');
        input('qty').enter('2');
        input('cost').enter('5.00');
        expect(binding('qty * cost')).toEqual('$10.00');
      });

});

  describe("guide/index_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/index_ru");
    });
  
});

  describe("guide/dev_guide.services.creating_services_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services.creating_services_ru");
    });
  
});

  describe("guide/dev_guide.mvc.understanding_controller_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.mvc.understanding_controller_ru");
    });
  
});

  describe("guide/module_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/module_ru");
    });
  
});

  describe("guide/dev_guide.templates.css-styling_ru", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.templates.css-styling_ru");
    });
  
});

  describe("guide/dev_guide.services", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/guide/dev_guide.services");
    });
  
});

  describe("api/ngSanitize.directive:ngBindHtml", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngSanitize.directive:ngBindHtml");
    });
  
});

  describe("api/ngSanitize.filter:linky", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngSanitize.filter:linky");
    });
  
    it('should linkify the snippet with urls', function() {
      expect(using('#linky-filter').binding('snippet | linky')).
        toBe('Pretty text with some links:&#10;' +
             '<a href="http://angularjs.org/">http://angularjs.org/</a>,&#10;' +
             '<a href="mailto:us@somewhere.org">us@somewhere.org</a>,&#10;' +
             '<a href="mailto:another@somewhere.org">another@somewhere.org</a>,&#10;' +
             'and one more: <a href="ftp://127.0.0.1/">ftp://127.0.0.1/</a>.');
    });
    
    it ('should not linkify snippet without the linky filter', function() {
      expect(using('#escaped-html').binding('snippet')).
        toBe("Pretty text with some links:\n" +
             "http://angularjs.org/,\n" +
             "mailto:us@somewhere.org,\n" +
             "another@somewhere.org,\n" +
             "and one more: ftp://127.0.0.1/.");
    });
    
    it('should update', function() {
      input('snippet').enter('new http://link.');
      expect(using('#linky-filter').binding('snippet | linky')).
        toBe('new <a href="http://link">http://link</a>.');
      expect(using('#escaped-html').binding('snippet')).toBe('new http://link.');
    });
    
    it('should work with the target property', function() {
     expect(using('#linky-target').binding("snippetWithTarget | linky:'_blank'")).
       toBe('<a target="_blank" href="http://angularjs.org/">http://angularjs.org/</a>');
    });

});

  describe("api/ngSanitize", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngSanitize");
    });
  
});

  describe("api/ngSanitize.$sanitize", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngSanitize.$sanitize");
    });
  
    it('should sanitize the html snippet ', function() {
      expect(using('#html-filter').element('div').html()).
        toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
    });
    
    it('should escape snippet without any filter', function() {
      expect(using('#escaped-html').element('div').html()).
        toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
             "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
             "snippet&lt;/p&gt;");
    });
    
    it('should inline raw snippet if filtered as unsafe', function() {
      expect(using('#html-unsafe-filter').element("div").html()).
        toBe("<p style=\"color:blue\">an html\n" +
             "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
             "snippet</p>");
    });
    
    it('should update', function() {
      input('snippet').enter('new <b>text</b>');
      expect(using('#html-filter').binding('snippet')).toBe('new <b>text</b>');
      expect(using('#escaped-html').element('div').html()).toBe("new &lt;b&gt;text&lt;/b&gt;");
      expect(using('#html-unsafe-filter').binding("snippet")).toBe('new <b>text</b>');
    });

});

  describe("api/ngCookies", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngCookies");
    });
  
});

  describe("api/ngCookies.$cookies", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngCookies.$cookies");
    });
  
});

  describe("api/ngCookies.$cookieStore", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngCookies.$cookieStore");
    });
  
});

  describe("api/angular.injector", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.injector");
    });
  
});

  describe("api/AUTO", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/AUTO");
    });
  
});

  describe("api/AUTO.$injector", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/AUTO.$injector");
    });
  
});

  describe("api/AUTO.$provide", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/AUTO.$provide");
    });
  
});

  describe("api/angular.element", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.element");
    });
  
});

  describe("api/ngResource", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngResource");
    });
  
});

  describe("api/ngResource.$resource", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngResource.$resource");
    });
  
    

});

  describe("api/angular.lowercase", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.lowercase");
    });
  
});

  describe("api/angular.uppercase", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.uppercase");
    });
  
});

  describe("api/angular.noConflict", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.noConflict");
    });
  
});

  describe("api/angular.forEach", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.forEach");
    });
  
});

  describe("api/angular.extend", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.extend");
    });
  
});

  describe("api/angular.noop", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.noop");
    });
  
});

  describe("api/angular.identity", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.identity");
    });
  
});

  describe("api/angular.isUndefined", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.isUndefined");
    });
  
});

  describe("api/angular.isDefined", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.isDefined");
    });
  
});

  describe("api/angular.isObject", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.isObject");
    });
  
});

  describe("api/angular.isString", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.isString");
    });
  
});

  describe("api/angular.isNumber", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.isNumber");
    });
  
});

  describe("api/angular.isDate", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.isDate");
    });
  
});

  describe("api/angular.isArray", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.isArray");
    });
  
});

  describe("api/angular.isFunction", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.isFunction");
    });
  
});

  describe("api/angular.isElement", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.isElement");
    });
  
});

  describe("api/angular.copy", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.copy");
    });
  
});

  describe("api/angular.equals", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.equals");
    });
  
});

  describe("api/angular.bind", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.bind");
    });
  
});

  describe("api/angular.toJson", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.toJson");
    });
  
});

  describe("api/angular.fromJson", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.fromJson");
    });
  
});

  describe("api/ng.directive:ngApp", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngApp");
    });
  
});

  describe("api/angular.bootstrap", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.bootstrap");
    });
  
});

  describe("api/angular.Module", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.Module");
    });
  
});

  describe("api/angular.module", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.module");
    });
  
});

  describe("api/angular.version", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.version");
    });
  
});

  describe("api/angular.mock", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.mock");
    });
  
});

  describe("api/ngMock.$exceptionHandlerProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngMock.$exceptionHandlerProvider");
    });
  
});

  describe("api/ngMock.$exceptionHandler", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngMock.$exceptionHandler");
    });
  
});

  describe("api/ngMock.$log", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngMock.$log");
    });
  
});

  describe("api/angular.mock.TzDate", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.mock.TzDate");
    });
  
});

  describe("api/angular.mock.createMockWindow", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.mock.createMockWindow");
    });
  
});

  describe("api/angular.mock.dump", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.mock.dump");
    });
  
});

  describe("api/ngMock.$httpBackend", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngMock.$httpBackend");
    });
  
});

  describe("api/ngMock.$timeout", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngMock.$timeout");
    });
  
});

  describe("api/ngMock", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngMock");
    });
  
});

  describe("api/ngMockE2E", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngMockE2E");
    });
  
});

  describe("api/ngMockE2E.$httpBackend", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngMockE2E.$httpBackend");
    });
  
});

  describe("api/angular.mock.module", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.mock.module");
    });
  
});

  describe("api/angular.mock.inject", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/angular.mock.inject");
    });
  
});

  describe("api/ng.$exceptionHandler", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$exceptionHandler");
    });
  
});

  describe("api/ng.$parse", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$parse");
    });
  
});

  describe("api/ng.$routeParams", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$routeParams");
    });
  
});

  describe("api/ng.$http", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$http");
    });
  
    it('should make an xhr GET request', function() {
      element(':button:contains("Sample GET")').click();
      element(':button:contains("fetch")').click();
      expect(binding('status')).toBe('200');
      expect(binding('data')).toMatch(/Hello, \$http!/);
    });
    
    it('should make a JSONP request to angularjs.org', function() {
      element(':button:contains("Sample JSONP")').click();
      element(':button:contains("fetch")').click();
      expect(binding('status')).toBe('200');
      expect(binding('data')).toMatch(/Super Hero!/);
    });
    
    it('should make JSONP request to invalid URL and invoke the error handler',
        function() {
      element(':button:contains("Invalid JSONP")').click();
      element(':button:contains("fetch")').click();
      expect(binding('status')).toBe('0');
      expect(binding('data')).toBe('Request failed');
    });

});

  describe("api/ng.$animationProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$animationProvider");
    });
  
});

  describe("api/ng.$animation", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$animation");
    });
  
});

  describe("api/ng.directive:ngClick", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngClick");
    });
  
    it('should check ng-click', function() {
      expect(binding('count')).toBe('0');
      element('.doc-example-live :button').click();
      expect(binding('count')).toBe('1');
    });

});

  describe("api/ng.directive:ngDblclick", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngDblclick");
    });
  
});

  describe("api/ng.directive:ngMousedown", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngMousedown");
    });
  
});

  describe("api/ng.directive:ngMouseup", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngMouseup");
    });
  
});

  describe("api/ng.directive:ngMouseover", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngMouseover");
    });
  
});

  describe("api/ng.directive:ngMouseenter", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngMouseenter");
    });
  
});

  describe("api/ng.directive:ngMouseleave", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngMouseleave");
    });
  
});

  describe("api/ng.directive:ngMousemove", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngMousemove");
    });
  
});

  describe("api/ng.directive:ngKeydown", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngKeydown");
    });
  
});

  describe("api/ng.directive:ngKeyup", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngKeyup");
    });
  
});

  describe("api/ng.directive:ngKeypress", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngKeypress");
    });
  
});

  describe("api/ng.directive:ngSubmit", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngSubmit");
    });
  
    it('should check ng-submit', function() {
      expect(binding('list')).toBe('[]');
      element('.doc-example-live #submit').click();
      expect(binding('list')).toBe('["hello"]');
      expect(input('text').val()).toBe('');
    });
    it('should ignore empty strings', function() {
      expect(binding('list')).toBe('[]');
      element('.doc-example-live #submit').click();
      element('.doc-example-live #submit').click();
      expect(binding('list')).toBe('["hello"]');
    });

});

  describe("api/ng.directive:ngCloak", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngCloak");
    });
  
    it('should remove the template directive and css class', function() {
      expect(element('.doc-example-live #template1').attr('ng-cloak')).
        not().toBeDefined();
      expect(element('.doc-example-live #template2').attr('ng-cloak')).
        not().toBeDefined();
    });

});

  describe("api/ng.directive:ngShow", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngShow");
    });
  
    it('should check ng-show / ng-hide', function() {
      expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);
      expect(element('.doc-example-live span:last:visible').count()).toEqual(1);
    
      input('checked').check();
    
      expect(element('.doc-example-live span:first:visible').count()).toEqual(1);
      expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);
    });

});

  describe("api/ng.directive:ngHide", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngHide");
    });
  
    it('should check ng-show / ng-hide', function() {
      expect(element('.doc-example-live .check-element:first:hidden').count()).toEqual(1);
      expect(element('.doc-example-live .check-element:last:visible').count()).toEqual(1);
    
      input('checked').check();
    
      expect(element('.doc-example-live .check-element:first:visible').count()).toEqual(1);
      expect(element('.doc-example-live .check-element:last:hidden').count()).toEqual(1);
    });

});

  describe("api/ng.directive:ngPluralize", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngPluralize");
    });
  
    it('should show correct pluralized string', function() {
      expect(element('.doc-example-live ng-pluralize:first').text()).
                                         toBe('1 person is viewing.');
      expect(element('.doc-example-live ng-pluralize:last').text()).
                                            toBe('Igor is viewing.');
    
      using('.doc-example-live').input('personCount').enter('0');
      expect(element('.doc-example-live ng-pluralize:first').text()).
                                           toBe('Nobody is viewing.');
      expect(element('.doc-example-live ng-pluralize:last').text()).
                                          toBe('Nobody is viewing.');
    
      using('.doc-example-live').input('personCount').enter('2');
      expect(element('.doc-example-live ng-pluralize:first').text()).
                                        toBe('2 people are viewing.');
      expect(element('.doc-example-live ng-pluralize:last').text()).
                          toBe('Igor and Misko are viewing.');
    
      using('.doc-example-live').input('personCount').enter('3');
      expect(element('.doc-example-live ng-pluralize:first').text()).
                                        toBe('3 people are viewing.');
      expect(element('.doc-example-live ng-pluralize:last').text()).
                          toBe('Igor, Misko and one other person are viewing.');
    
      using('.doc-example-live').input('personCount').enter('4');
      expect(element('.doc-example-live ng-pluralize:first').text()).
                                        toBe('4 people are viewing.');
      expect(element('.doc-example-live ng-pluralize:last').text()).
                          toBe('Igor, Misko and 2 other people are viewing.');
    });
    
    it('should show data-binded names', function() {
      using('.doc-example-live').input('personCount').enter('4');
      expect(element('.doc-example-live ng-pluralize:last').text()).
          toBe('Igor, Misko and 2 other people are viewing.');
    
      using('.doc-example-live').input('person1').enter('Di');
      using('.doc-example-live').input('person2').enter('Vojta');
      expect(element('.doc-example-live ng-pluralize:last').text()).
          toBe('Di, Vojta and 2 other people are viewing.');
    });

});

  describe("api/ng.directive:ngCsp", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngCsp");
    });
  
});

  describe("api/ng.directive:ngView", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngView");
    });
  
    it('should load and compile correct template', function() {
      element('a:contains("Moby: Ch1")').click();
      var content = element('.doc-example-live [ng-view]').text();
      expect(content).toMatch(/controller\: ChapterCntl/);
      expect(content).toMatch(/Book Id\: Moby/);
      expect(content).toMatch(/Chapter Id\: 1/);
    
      element('a:contains("Scarlet")').click();
      content = element('.doc-example-live [ng-view]').text();
      expect(content).toMatch(/controller\: BookCntl/);
      expect(content).toMatch(/Book Id\: Scarlet/);
    });

});

  describe("api/ng.directive:ngHref", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngHref");
    });
  
      it('should execute ng-click but not reload when href without value', function() {
        element('#link-1').click();
        expect(input('value').val()).toEqual('1');
        expect(element('#link-1').attr('href')).toBe("");
      });
    
      it('should execute ng-click but not reload when href empty string', function() {
        element('#link-2').click();
        expect(input('value').val()).toEqual('2');
        expect(element('#link-2').attr('href')).toBe("");
      });
    
      it('should execute ng-click and change url when ng-href specified', function() {
        expect(element('#link-3').attr('href')).toBe("/123");
    
        element('#link-3').click();
        expect(browser().window().path()).toEqual('/123');
      });
    
      it('should execute ng-click but not reload when href empty string and name specified', function() {
        element('#link-4').click();
        expect(input('value').val()).toEqual('4');
        expect(element('#link-4').attr('href')).toBe('');
      });
    
      it('should execute ng-click but not reload when no href but name specified', function() {
        element('#link-5').click();
        expect(input('value').val()).toEqual('5');
        expect(element('#link-5').attr('href')).toBe(undefined);
      });
    
      it('should only change url when only ng-href', function() {
        input('value').enter('6');
        expect(element('#link-6').attr('href')).toBe('6');
    
        element('#link-6').click();
        expect(browser().location().url()).toEqual('/6');
      });

});

  describe("api/ng.directive:ngSrc", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngSrc");
    });
  
});

  describe("api/ng.directive:ngDisabled", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngDisabled");
    });
  
    it('should toggle button', function() {
      expect(element('.doc-example-live :button').prop('disabled')).toBeFalsy();
      input('checked').check();
      expect(element('.doc-example-live :button').prop('disabled')).toBeTruthy();
    });

});

  describe("api/ng.directive:ngChecked", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngChecked");
    });
  
    it('should check both checkBoxes', function() {
      expect(element('.doc-example-live #checkSlave').prop('checked')).toBeFalsy();
      input('master').check();
      expect(element('.doc-example-live #checkSlave').prop('checked')).toBeTruthy();
    });

});

  describe("api/ng.directive:ngMultiple", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngMultiple");
    });
  
    it('should toggle multiple', function() {
      expect(element('.doc-example-live #select').prop('multiple')).toBeFalsy();
      input('checked').check();
      expect(element('.doc-example-live #select').prop('multiple')).toBeTruthy();
    });

});

  describe("api/ng.directive:ngReadonly", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngReadonly");
    });
  
    it('should toggle readonly attr', function() {
      expect(element('.doc-example-live :text').prop('readonly')).toBeFalsy();
      input('checked').check();
      expect(element('.doc-example-live :text').prop('readonly')).toBeTruthy();
    });

});

  describe("api/ng.directive:ngSelected", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngSelected");
    });
  
    it('should select Greetings!', function() {
      expect(element('.doc-example-live #greet').prop('selected')).toBeFalsy();
      input('selected').check();
      expect(element('.doc-example-live #greet').prop('selected')).toBeTruthy();
    });

});

  describe("api/ng.directive:ngOpen", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngOpen");
    });
  
    it('should toggle open', function() {
      expect(element('#details').prop('open')).toBeFalsy();
      input('open').check();
      expect(element('#details').prop('open')).toBeTruthy();
    });

});

  describe("api/ng.directive:ngNonBindable", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngNonBindable");
    });
  
    it('should check ng-non-bindable', function() {
      expect(using('.doc-example-live').binding('1 + 2')).toBe('3');
      expect(using('.doc-example-live').element('div:last').text()).
        toMatch(/1 \+ 2/);
    });

});

  describe("api/ng.directive:ngClass", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngClass");
    });
  
    it('should check ng-class', function() {
      expect(element('.doc-example-live span').prop('className')).not().
        toMatch(/my-class/);
    
      using('.doc-example-live').element(':button:first').click();
    
      expect(element('.doc-example-live span').prop('className')).
        toMatch(/my-class/);
    
      using('.doc-example-live').element(':button:last').click();
    
      expect(element('.doc-example-live span').prop('className')).not().
        toMatch(/my-class/);
    });

});

  describe("api/ng.directive:ngClassOdd", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngClassOdd");
    });
  
    it('should check ng-class-odd and ng-class-even', function() {
      expect(element('.doc-example-live li:first span').prop('className')).
        toMatch(/odd/);
      expect(element('.doc-example-live li:last span').prop('className')).
        toMatch(/even/);
    });

});

  describe("api/ng.directive:ngClassEven", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngClassEven");
    });
  
    it('should check ng-class-odd and ng-class-even', function() {
      expect(element('.doc-example-live li:first span').prop('className')).
        toMatch(/odd/);
      expect(element('.doc-example-live li:last span').prop('className')).
        toMatch(/even/);
    });

});

  describe("api/ng.directive:ngSwitch", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngSwitch");
    });
  
    it('should start in settings', function() {
      expect(element('.doc-example-live [ng-switch]').text()).toMatch(/Settings Div/);
    });
    it('should change to home', function() {
      select('selection').option('home');
      expect(element('.doc-example-live [ng-switch]').text()).toMatch(/Home Span/);
    });
    it('should select default', function() {
      select('selection').option('other');
      expect(element('.doc-example-live [ng-switch]').text()).toMatch(/default/);
    });

});

  describe("api/ng.directive:input.text", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:input.text");
    });
  
    it('should initialize to model', function() {
      expect(binding('text')).toEqual('guest');
      expect(binding('myForm.input.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty', function() {
      input('text').enter('');
      expect(binding('text')).toEqual('');
      expect(binding('myForm.input.$valid')).toEqual('false');
    });
    
    it('should be invalid if multi word', function() {
      input('text').enter('hello world');
      expect(binding('myForm.input.$valid')).toEqual('false');
    });
    
    it('should not be trimmed', function() {
      input('text').enter('untrimmed ');
      expect(binding('text')).toEqual('untrimmed ');
      expect(binding('myForm.input.$valid')).toEqual('true');
    });

});

  describe("api/ng.directive:input.number", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:input.number");
    });
  
    it('should initialize to model', function() {
     expect(binding('value')).toEqual('12');
     expect(binding('myForm.input.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty', function() {
     input('value').enter('');
     expect(binding('value')).toEqual('');
     expect(binding('myForm.input.$valid')).toEqual('false');
    });
    
    it('should be invalid if over max', function() {
     input('value').enter('123');
     expect(binding('value')).toEqual('');
     expect(binding('myForm.input.$valid')).toEqual('false');
    });

});

  describe("api/ng.directive:input.url", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:input.url");
    });
  
    it('should initialize to model', function() {
      expect(binding('text')).toEqual('http://google.com');
      expect(binding('myForm.input.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty', function() {
      input('text').enter('');
      expect(binding('text')).toEqual('');
      expect(binding('myForm.input.$valid')).toEqual('false');
    });
    
    it('should be invalid if not url', function() {
      input('text').enter('xxx');
      expect(binding('myForm.input.$valid')).toEqual('false');
    });

});

  describe("api/ng.directive:input.email", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:input.email");
    });
  
    it('should initialize to model', function() {
      expect(binding('text')).toEqual('me@example.com');
      expect(binding('myForm.input.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty', function() {
      input('text').enter('');
      expect(binding('text')).toEqual('');
      expect(binding('myForm.input.$valid')).toEqual('false');
    });
    
    it('should be invalid if not email', function() {
      input('text').enter('xxx');
      expect(binding('myForm.input.$valid')).toEqual('false');
    });

});

  describe("api/ng.directive:input.radio", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:input.radio");
    });
  
    it('should change state', function() {
      expect(binding('color')).toEqual('blue');
    
      input('color').select('red');
      expect(binding('color')).toEqual('red');
    });

});

  describe("api/ng.directive:input.checkbox", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:input.checkbox");
    });
  
    it('should change state', function() {
      expect(binding('value1')).toEqual('true');
      expect(binding('value2')).toEqual('YES');
    
      input('value1').check();
      input('value2').check();
      expect(binding('value1')).toEqual('false');
      expect(binding('value2')).toEqual('NO');
    });

});

  describe("api/ng.directive:textarea", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:textarea");
    });
  
});

  describe("api/ng.directive:input", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:input");
    });
  
    it('should initialize to model', function() {
      expect(binding('user')).toEqual('{"name":"guest","last":"visitor"}');
      expect(binding('myForm.userName.$valid')).toEqual('true');
      expect(binding('myForm.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty when required', function() {
      input('user.name').enter('');
      expect(binding('user')).toEqual('{"last":"visitor"}');
      expect(binding('myForm.userName.$valid')).toEqual('false');
      expect(binding('myForm.$valid')).toEqual('false');
    });
    
    it('should be valid if empty when min length is set', function() {
      input('user.last').enter('');
      expect(binding('user')).toEqual('{"name":"guest","last":""}');
      expect(binding('myForm.lastName.$valid')).toEqual('true');
      expect(binding('myForm.$valid')).toEqual('true');
    });
    
    it('should be invalid if less than required min length', function() {
      input('user.last').enter('xx');
      expect(binding('user')).toEqual('{"name":"guest"}');
      expect(binding('myForm.lastName.$valid')).toEqual('false');
      expect(binding('myForm.lastName.$error')).toMatch(/minlength/);
      expect(binding('myForm.$valid')).toEqual('false');
    });
    
    it('should be invalid if longer than max length', function() {
      input('user.last').enter('some ridiculously long name');
      expect(binding('user'))
        .toEqual('{"name":"guest"}');
      expect(binding('myForm.lastName.$valid')).toEqual('false');
      expect(binding('myForm.lastName.$error')).toMatch(/maxlength/);
      expect(binding('myForm.$valid')).toEqual('false');
    });

});

  describe("api/ng.directive:ngModel.NgModelController", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngModel.NgModelController");
    });
  
      it('should data-bind and become invalid', function() {
        var contentEditable = element('[contenteditable]');
    
        expect(contentEditable.text()).toEqual('Change me!');
        input('userContent').enter('');
        expect(contentEditable.text()).toEqual('');
        expect(contentEditable.prop('className')).toMatch(/ng-invalid-required/);
      });

});

  describe("api/ng.directive:ngModel", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngModel");
    });
  
});

  describe("api/ng.directive:ngChange", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngChange");
    });
  
    it('should evaluate the expression if changing from view', function() {
      expect(binding('counter')).toEqual('0');
      element('#ng-change-example1').click();
      expect(binding('counter')).toEqual('1');
      expect(binding('confirmed')).toEqual('true');
    });
    
    it('should not evaluate the expression if changing from model', function() {
      element('#ng-change-example2').click();
      expect(binding('counter')).toEqual('0');
      expect(binding('confirmed')).toEqual('true');
    });

});

  describe("api/ng.directive:ngList", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngList");
    });
  
    it('should initialize to model', function() {
      expect(binding('names')).toEqual('["igor","misko","vojta"]');
      expect(binding('myForm.namesInput.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty', function() {
      input('names').enter('');
      expect(binding('names')).toEqual('[]');
      expect(binding('myForm.namesInput.$valid')).toEqual('false');
    });

});

  describe("api/ng.directive:ngTransclude", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngTransclude");
    });
  
    it('should have transcluded', function() {
      input('title').enter('TITLE');
      input('text').enter('TEXT');
      expect(binding('title')).toEqual('TITLE');
      expect(binding('text')).toEqual('TEXT');
    });

});

  describe("api/ng.directive:ngRepeat", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngRepeat");
    });
  
     it('should render initial data set', function() {
       var r = using('.doc-example-live').repeater('ul li');
       expect(r.count()).toBe(10);
       expect(r.row(0)).toEqual(["1","John","25"]);
       expect(r.row(1)).toEqual(["2","Jessie","30"]);
       expect(r.row(9)).toEqual(["10","Samantha","60"]);
       expect(binding('friends.length')).toBe("10");
     });
    
     it('should update repeater when filter predicate changes', function() {
       var r = using('.doc-example-live').repeater('ul li');
       expect(r.count()).toBe(10);
    
       input('q').enter('ma');
    
       expect(r.count()).toBe(2);
       expect(r.row(0)).toEqual(["1","Mary","28"]);
       expect(r.row(1)).toEqual(["2","Samantha","60"]);
     });

});

  describe("api/ng.directive:form.FormController", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:form.FormController");
    });
  
});

  describe("api/ng.directive:ngForm", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngForm");
    });
  
});

  describe("api/ng.directive:form", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:form");
    });
  
    it('should initialize to model', function() {
     expect(binding('userType')).toEqual('guest');
     expect(binding('myForm.input.$valid')).toEqual('true');
    });
    
    it('should be invalid if empty', function() {
     input('userType').enter('');
     expect(binding('userType')).toEqual('');
     expect(binding('myForm.input.$valid')).toEqual('false');
    });

});

  describe("api/ng.directive:script", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:script");
    });
  
    it('should load template defined inside script tag', function() {
      element('#tpl-link').click();
      expect(element('#tpl-content').text()).toMatch(/Content of the template/);
    });

});

  describe("api/ng.directive:ngInclude", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngInclude");
    });
  
    it('should load template1.html', function() {
     expect(element('.doc-example-live [ng-include]').text()).
       toMatch(/Content of template1.html/);
    });
    it('should load template2.html', function() {
     select('template').option('1');
     expect(element('.doc-example-live [ng-include]').text()).
       toMatch(/Content of template2.html/);
    });
    it('should change to blank', function() {
     select('template').option('');
     expect(element('.doc-example-live [ng-include]').text()).toEqual('');
    });

});

  describe("api/ng.directive:ngBind", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngBind");
    });
  
      it('should check ng-bind', function() {
        expect(using('.doc-example-live').binding('name')).toBe('Whirled');
        using('.doc-example-live').input('name').enter('world');
        expect(using('.doc-example-live').binding('name')).toBe('world');
      });

});

  describe("api/ng.directive:ngBindTemplate", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngBindTemplate");
    });
  
      it('should check ng-bind', function() {
        expect(using('.doc-example-live').binding('salutation')).
          toBe('Hello');
        expect(using('.doc-example-live').binding('name')).
          toBe('World');
        using('.doc-example-live').input('salutation').enter('Greetings');
        using('.doc-example-live').input('name').enter('user');
        expect(using('.doc-example-live').binding('salutation')).
          toBe('Greetings');
        expect(using('.doc-example-live').binding('name')).
          toBe('user');
      });

});

  describe("api/ng.directive:ngBindHtmlUnsafe", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngBindHtmlUnsafe");
    });
  
});

  describe("api/ng.directive:ngStyle", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngStyle");
    });
  
    it('should check ng-style', function() {
      expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
      element('.doc-example-live :button[value=set]').click();
      expect(element('.doc-example-live span').css('color')).toBe('rgb(255, 0, 0)');
      element('.doc-example-live :button[value=clear]').click();
      expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
    });

});

  describe("api/ng.directive:ngIf", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngIf");
    });
  
});

  describe("api/ng.directive:select", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:select");
    });
  
    it('should check ng-options', function() {
      expect(binding('{selected_color:color}')).toMatch('red');
      select('color').option('0');
      expect(binding('{selected_color:color}')).toMatch('black');
      using('.nullable').select('color').option('');
      expect(binding('{selected_color:color}')).toMatch('null');
    });

});

  describe("api/ng.directive:ngInit", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngInit");
    });
  
      it('should check greeting', function() {
        expect(binding('greeting')).toBe('Hello');
        expect(binding('person')).toBe('World');
      });

});

  describe("api/ng.directive:a", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:a");
    });
  
});

  describe("api/ng.directive:ngController", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngController");
    });
  
      it('should check controller', function() {
        expect(element('.doc-example-live div>:input').val()).toBe('John Smith');
        expect(element('.doc-example-live li:nth-child(1) input').val())
          .toBe('408 555 1212');
        expect(element('.doc-example-live li:nth-child(2) input').val())
          .toBe('john.smith@example.org');
    
        element('.doc-example-live li:first a:contains("clear")').click();
        expect(element('.doc-example-live li:first input').val()).toBe('');
    
        element('.doc-example-live li:last a:contains("add")').click();
        expect(element('.doc-example-live li:nth-child(3) input').val())
          .toBe('yourname@example.org');
      });

});

  describe("api/ng.$controllerProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$controllerProvider");
    });
  
});

  describe("api/ng.$controller", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$controller");
    });
  
});

  describe("api/ng.$compile", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$compile");
    });
  
      it('should auto compile', function() {
        expect(element('div[compile]').text()).toBe('Hello Angular');
        input('html').enter('{{name}}!');
        expect(element('div[compile]').text()).toBe('Angular!');
      });

});

  describe("api/ng.$compileProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$compileProvider");
    });
  
});

  describe("api/ng.$compile.directive.Attributes", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$compile.directive.Attributes");
    });
  
});

  describe("api/ng.filter:currency", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.filter:currency");
    });
  
    it('should init with 1234.56', function() {
      expect(binding('amount | currency')).toBe('$1,234.56');
      expect(binding('amount | currency:"USD$"')).toBe('USD$1,234.56');
    });
    it('should update', function() {
      input('amount').enter('-1234');
      expect(binding('amount | currency')).toBe('($1,234.00)');
      expect(binding('amount | currency:"USD$"')).toBe('(USD$1,234.00)');
    });

});

  describe("api/ng.filter:number", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.filter:number");
    });
  
    it('should format numbers', function() {
      expect(binding('val | number')).toBe('1,234.568');
      expect(binding('val | number:0')).toBe('1,235');
      expect(binding('-val | number:4')).toBe('-1,234.5679');
    });
    
    it('should update', function() {
      input('val').enter('3374.333');
      expect(binding('val | number')).toBe('3,374.333');
      expect(binding('val | number:0')).toBe('3,374');
      expect(binding('-val | number:4')).toBe('-3,374.3330');
    });

});

  describe("api/ng.filter:date", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.filter:date");
    });
  
    it('should format date', function() {
      expect(binding("1288323623006 | date:'medium'")).
         toMatch(/Oct 2\d, 2010 \d{1,2}:\d{2}:\d{2} (AM|PM)/);
      expect(binding("1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'")).
         toMatch(/2010\-10\-2\d \d{2}:\d{2}:\d{2} (\-|\+)?\d{4}/);
      expect(binding("'1288323623006' | date:'MM/dd/yyyy @ h:mma'")).
         toMatch(/10\/2\d\/2010 @ \d{1,2}:\d{2}(AM|PM)/);
    });

});

  describe("api/ng.filter:json", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.filter:json");
    });
  
    it('should jsonify filtered objects', function() {
      expect(binding("{'name':'value'}")).toMatch(/\{\n  "name": ?"value"\n}/);
    });

});

  describe("api/ng.filter:lowercase", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.filter:lowercase");
    });
  
});

  describe("api/ng.filter:uppercase", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.filter:uppercase");
    });
  
});

  describe("api/ng.filter:filter", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.filter:filter");
    });
  
    it('should search across all fields when filtering with a string', function() {
      input('searchText').enter('m');
      expect(repeater('#searchTextResults tr', 'friend in friends').column('friend.name')).
        toEqual(['Mary', 'Mike', 'Adam']);
    
      input('searchText').enter('76');
      expect(repeater('#searchTextResults tr', 'friend in friends').column('friend.name')).
        toEqual(['John', 'Julie']);
    });
    
    it('should search in specific fields when filtering with a predicate object', function() {
      input('search.$').enter('i');
      expect(repeater('#searchObjResults tr', 'friend in friends').column('friend.name')).
        toEqual(['Mary', 'Mike', 'Julie', 'Juliette']);
    });
    it('should use a equal comparison when comparator is true', function() {
      input('search.name').enter('Julie');
      input('strict').check();
      expect(repeater('#searchObjResults tr', 'friend in friends').column('friend.name')).
        toEqual(['Julie']);
    });

});

  describe("api/ng.filter:limitTo", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.filter:limitTo");
    });
  
    it('should limit the number array to first three items', function() {
      expect(element('.doc-example-live input[ng-model=numLimit]').val()).toBe('3');
      expect(element('.doc-example-live input[ng-model=letterLimit]').val()).toBe('3');
      expect(binding('numbers | limitTo:numLimit')).toEqual('[1,2,3]');
      expect(binding('letters | limitTo:letterLimit')).toEqual('abc');
    });
    
    it('should update the output when -3 is entered', function() {
      input('numLimit').enter(-3);
      input('letterLimit').enter(-3);
      expect(binding('numbers | limitTo:numLimit')).toEqual('[7,8,9]');
      expect(binding('letters | limitTo:letterLimit')).toEqual('ghi');
    });
    
    it('should not exceed the maximum size of input array', function() {
      input('numLimit').enter(100);
      input('letterLimit').enter(100);
      expect(binding('numbers | limitTo:numLimit')).toEqual('[1,2,3,4,5,6,7,8,9]');
      expect(binding('letters | limitTo:letterLimit')).toEqual('abcdefghi');
    });

});

  describe("api/ng.filter:orderBy", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.filter:orderBy");
    });
  
    it('should be reverse ordered by aged', function() {
      expect(binding('predicate')).toBe('-age');
      expect(repeater('table.friend', 'friend in friends').column('friend.age')).
        toEqual(['35', '29', '21', '19', '10']);
      expect(repeater('table.friend', 'friend in friends').column('friend.name')).
        toEqual(['Adam', 'Julie', 'Mike', 'Mary', 'John']);
    });
    
    it('should reorder the table when user selects different predicate', function() {
      element('.doc-example-live a:contains("Name")').click();
      expect(repeater('table.friend', 'friend in friends').column('friend.name')).
        toEqual(['Adam', 'John', 'Julie', 'Mary', 'Mike']);
      expect(repeater('table.friend', 'friend in friends').column('friend.age')).
        toEqual(['35', '10', '29', '19', '21']);
    
      element('.doc-example-live a:contains("Phone")').click();
      expect(repeater('table.friend', 'friend in friends').column('friend.phone')).
        toEqual(['555-9876', '555-8765', '555-5678', '555-4321', '555-1212']);
      expect(repeater('table.friend', 'friend in friends').column('friend.name')).
        toEqual(['Mary', 'Julie', 'Adam', 'Mike', 'John']);
    });

});

  describe("api/ng.$filterProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$filterProvider");
    });
  
});

  describe("api/ng.$filter", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$filter");
    });
  
});

  describe("api/ng.$document", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$document");
    });
  
});

  describe("api/ng.$interpolateProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$interpolateProvider");
    });
  
});

  describe("api/ng.$interpolate", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$interpolate");
    });
  
});

  describe("api/ng.$cacheFactory", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$cacheFactory");
    });
  
});

  describe("api/ng.$templateCache", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$templateCache");
    });
  
});

  describe("api/ng.$log", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$log");
    });
  
});

  describe("api/ng.$logProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$logProvider");
    });
  
});

  describe("api/ng.$rootScopeProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$rootScopeProvider");
    });
  
});

  describe("api/ng.$rootScope", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$rootScope");
    });
  
});

  describe("api/ng.$rootScope.Scope", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$rootScope.Scope");
    });
  
});

  describe("api/ng.$httpBackend", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$httpBackend");
    });
  
});

  describe("api/ng.$q", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$q");
    });
  
});

  describe("api/ng.$routeProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$routeProvider");
    });
  
});

  describe("api/ng.$route", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$route");
    });
  
    it('should load and compile correct template', function() {
      element('a:contains("Moby: Ch1")').click();
      var content = element('.doc-example-live [ng-view]').text();
      expect(content).toMatch(/controller\: ChapterCntl/);
      expect(content).toMatch(/Book Id\: Moby/);
      expect(content).toMatch(/Chapter Id\: 1/);
    
      element('a:contains("Scarlet")').click();
      sleep(2); // promises are not part of scenario waiting
      content = element('.doc-example-live [ng-view]').text();
      expect(content).toMatch(/controller\: BookCntl/);
      expect(content).toMatch(/Book Id\: Scarlet/);
    });

});

  describe("api/ng.$location", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$location");
    });
  
});

  describe("api/ng.$locationProvider", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$locationProvider");
    });
  
});

  describe("api/ng.$rootElement", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$rootElement");
    });
  
});

  describe("api/ng.$locale", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$locale");
    });
  
});

  describe("api/ng.$window", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$window");
    });
  
    

});

  describe("api/ng.$anchorScroll", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$anchorScroll");
    });
  
});

  describe("api/ng.directive:ngAnimate", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.directive:ngAnimate");
    });
  
});

  describe("api/ng.$animator", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$animator");
    });
  
});

  describe("api/ng.$timeout", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ng.$timeout");
    });
  
});

  describe("api/ngMobile.directive:ngSwipeLeft", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngMobile.directive:ngSwipeLeft");
    });
  
});

  describe("api/ngMobile.directive:ngSwipeRight", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngMobile.directive:ngSwipeRight");
    });
  
});

  describe("api/ngMobile.directive:ngTap", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngMobile.directive:ngTap");
    });
  
});

  describe("api/ngMobile", function() {
    beforeEach(function() {
      browser().navigateTo("index-jq-nocache.html#!/api/ngMobile");
    });
  
});

});