it('should have different transclude element content', function() {
         expect(element(by.id('fallback')).getText()).toBe('Button1');
         expect(element(by.id('modified')).getText()).toBe('Button2');
       });