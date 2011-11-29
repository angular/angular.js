'use strict';

describe('$compile', function() {
  var element;

  beforeEach(module(provideLog, function($provide, $compileProvider){
    element = null;

    $compileProvider.directive('log', function(log) {
      return {
        priority:0,
        compile: valueFn(function(scope, element, attrs) {
          log(attrs.log || 'LOG');
        })
      };
    });

    $compileProvider.directive('highLog', function(log) {
      return { priority:3, compile: valueFn(function(scope, element, attrs) {
        log(attrs.highLog || 'HIGH');
      })};
    });

    $compileProvider.directive('mediumLog', function(log) {
      return { priority:2, compile: valueFn(function(scope, element, attrs) {
        log(attrs.mediumLog || 'MEDIUM');
      })};
    });

    $compileProvider.directive('greet', function() {
      return { priority:10, compile: valueFn(function(scope, element, attrs) {
        element.text("Hello " + attrs.greet);
      })};
    });

    $compileProvider.directive('set', function() {
      return function(scope, element, attrs) {
        element.text(attrs.set);
      };
    });

    $compileProvider.directive('mediumStop', valueFn({
      priority: 2,
      terminal: true
    }));

    $compileProvider.directive('stop', valueFn({
      terminal: true
    }));

    $compileProvider.directive('negativeStop', valueFn({
      priority: -100, // even with negative priority we still should be able to stop descend
      terminal: true
    }));
  }));


  afterEach(function(){
    dealoc(element);
  });


  describe('configuration', function() {
    it('should register a directive', function() {
      module(function($compileProvider) {
        $compileProvider.directive('div', function(log) {
          return function(scope, element) {
            log('OK');
            element.text('SUCCESS');
          };
        })
      });
      inject(function($compile, $rootScope, log) {
        element = $compile('<div></div>')($rootScope);
        expect(element.text()).toEqual('SUCCESS');
        expect(log).toEqual('OK');
      })
    });

    it('should allow registration of multiple directives with same name', function() {
      module(function($compileProvider) {
        $compileProvider.directive('div', function(log) {
          return log.fn('1');
        });
        $compileProvider.directive('div', function(log) {
          return log.fn('2');
        });
      });
      inject(function($compile, $rootScope, log) {
        element = $compile('<div></div>')($rootScope);
        expect(log).toEqual('1; 2');
      });
    });
  });


  describe('compile phase', function() {

    describe('multiple directives per element', function() {
      it('should allow multiple directives per element', inject(function($compile, $rootScope, log){
        element = $compile(
          '<span greet="angular" log="L" x-high-log="H" data-medium-log="M"></span>')
          ($rootScope);
        expect(element.text()).toEqual('Hello angular');
        expect(log).toEqual('H; M; L');
      }));


      it('should recurse to children', inject(function($compile, $rootScope){
        element = $compile('<div>0<a set="hello">1</a>2<b set="angular">3</b>4</div>')($rootScope);
        expect(element.text()).toEqual('0hello2angular4');
      }));


      it('should allow directives in classes', inject(function($compile, $rootScope, log) {
        element = $compile('<div class="greet: angular; log:123;"></div>')($rootScope);
        expect(element.html()).toEqual('Hello angular');
        expect(log).toEqual('123');
      }));


      it('should allow directives in comments', inject(
        function($compile, $rootScope, log) {
          element = $compile('<div>0<!-- directive: log angular -->1</div>')($rootScope);
          expect(log).toEqual('angular');
        }
      ));


      it('should receive scope, element, and attributes', function() {
        var injector;
        module(function($compileProvider) {
          $compileProvider.directive('log', function($injector, $rootScope) {
            injector = $injector;
            return {
              compile: function(element, templateAttr) {
                expect(typeof templateAttr.$normalize).toBe('function');
                expect(typeof templateAttr.$set).toBe('function');
                expect(isElement(templateAttr.$element)).toBeTruthy();
                expect(element.text()).toEqual('unlinked');
                expect(templateAttr.exp).toEqual('abc');
                expect(templateAttr.aa).toEqual('A');
                expect(templateAttr.bb).toEqual('B');
                expect(templateAttr.cc).toEqual('C');
                return function(scope, element, attr) {
                  expect(element.text()).toEqual('unlinked');
                  expect(attr).toBe(templateAttr);
                  expect(scope).toEqual($rootScope);
                  element.text('worked');
                }
              }
            };
          });
        });
        inject(function($rootScope, $compile, $injector) {
          element = $compile(
              '<div class="log" exp="abc" aa="A" x-Bb="B" daTa-cC="C">unlinked</div>')($rootScope);
          expect(element.text()).toEqual('worked');
          expect(injector).toBe($injector); // verify that directive is injectable
        });
      });
    });

    describe('error handling', function() {

      it('should handle exceptions', function() {
        module(function($compileProvider, $exceptionHandlerProvider) {
          $exceptionHandlerProvider.mode('log');
          $compileProvider.directive('factoryError', function() { throw 'FactoryError'; });
          $compileProvider.directive('templateError',
              valueFn({ compile: function() { throw 'TemplateError'; } }));
          $compileProvider.directive('linkingError',
              valueFn(function() { throw 'LinkingError'; }));
        });
        inject(function($rootScope, $compile, $exceptionHandler) {
          element = $compile('<div factory-error template-error linking-error></div>')($rootScope);
          expect($exceptionHandler.errors[0]).toEqual('FactoryError');
          expect($exceptionHandler.errors[1][0]).toEqual('TemplateError');
          expect(ie($exceptionHandler.errors[1][1])).
              toEqual('<div factory-error linking-error template-error>');
          expect($exceptionHandler.errors[2][0]).toEqual('LinkingError');
          expect(ie($exceptionHandler.errors[2][1])).
              toEqual('<div factory-error linking-error template-error>');


          // crazy stuff to make IE happy
          function ie(text) {
            var list = [],
                parts;

            parts = lowercase(text).
                replace('<', '').
                replace('>', '').
                split(' ');
            parts.sort();
            forEach(parts, function(value, key){
              if (value.substring(0,3) == 'ng-') {
              } else {
                list.push(value.replace('=""', ''));
              }
            });
            return '<' + list.join(' ') + '>';
          }
        });
      });


      it('should prevent changing of structure', inject(
        function($compile, $rootScope){
          element = jqLite("<div><div log></div></div>");
          var linkFn = $compile(element);
          element.append("<div></div>");
          expect(function() {
            linkFn($rootScope);
          }).toThrow('Template changed structure!');
        }
      ));
    });

    describe('compiler control', function() {
      describe('priority', function() {
        it('should honor priority', inject(function($compile, $rootScope, log){
          element = $compile(
            '<span log="L" x-high-log="H" data-medium-log="M"></span>')
            ($rootScope);
          expect(log).toEqual('H; M; L');
        }));
      });


      describe('terminal', function() {

        it('should prevent further directives from running', inject(function($rootScope, $compile) {
            element = $compile('<div negative-stop><a set="FAIL">OK</a></div>')($rootScope);
            expect(element.text()).toEqual('OK');
          }
        ));


        it('should prevent further directives from running, but finish current priority level',
          inject(function($rootScope, $compile, log) {
            // class is processed after attrs, so putting log in class will put it after
            // the stop in the current level. This proves that the log runs after stop
            element = $compile(
              '<div high-log medium-stop log class="medium-log"><a set="FAIL">OK</a></div>')($rootScope);
            expect(element.text()).toEqual('OK');
            expect(log.toArray().sort()).toEqual(['HIGH', 'MEDIUM']);
          })
        );
      });


      describe('restrict', function() {

        it('should allow restriction of attributes', function() {
            module(function($compileProvider, $provide) {
              forEach({div:'E', attr:'A', clazz:'C', all:'EAC'}, function(restrict, name) {
                $compileProvider.directive(name, function(log) {
                  return {
                    restrict: restrict,
                    compile: valueFn(function(scope, element, attr) {
                      log(name);
                    })
                  };
                });
              });
            });
            inject(function($rootScope, $compile, log) {
              dealoc($compile('<span div class="div"></span>')($rootScope));
              expect(log).toEqual('');
              log.reset();

              dealoc($compile('<div></div>')($rootScope));
              expect(log).toEqual('div');
              log.reset();

              dealoc($compile('<attr class=""attr"></attr>')($rootScope));
              expect(log).toEqual('');
              log.reset();

              dealoc($compile('<span attr></span>')($rootScope));
              expect(log).toEqual('attr');
              log.reset();

              dealoc($compile('<clazz clazz></clazz>')($rootScope));
              expect(log).toEqual('');
              log.reset();

              dealoc($compile('<span class="clazz"></span>')($rootScope));
              expect(log).toEqual('clazz');
              log.reset();

              dealoc($compile('<all class="all" all></all>')($rootScope));
              expect(log).toEqual('all; all; all');
            });
        });
      });


      describe('template', function() {


        beforeEach(module(function($compileProvider) {
          $compileProvider.directive('replace', valueFn({
            replace: true,
            template: '<div class="log" style="width: 10px" high-log>Hello: <<CONTENT>></div>',
            compile: function(element, attr) {
              attr.$set('compiled', 'COMPILED');
              expect(element).toBe(attr.$element);
            }
          }));
          $compileProvider.directive('append', valueFn({
            template: '<div class="log" style="width: 10px" high-log>Hello: <<CONTENT>></div>',
            compile: function(element, attr) {
              attr.$set('compiled', 'COMPILED');
              expect(element).toBe(attr.$element);
            }
          }));
        }));


        it('should replace element with template', inject(function($compile, $rootScope) {
          element = $compile('<div><div replace>content</div><div>')($rootScope);
          expect(element.text()).toEqual('Hello: content');
          expect(element.find('div').attr('compiled')).toEqual('COMPILED');
        }));


        it('should append element with template', inject(function($compile, $rootScope) {
          element = $compile('<div><div append>content</div><div>')($rootScope);
          expect(element.text()).toEqual('Hello: content');
          expect(element.find('div').attr('compiled')).toEqual('COMPILED');
        }));


        it('should compile replace template', inject(function($compile, $rootScope, log) {
          element = $compile('<div><div replace medium-log>{{ "angular"  }}</div><div>')
            ($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('Hello: angular');
          // HIGH goes after MEDIUM since it executes as part of replaced template
          expect(log).toEqual('MEDIUM; HIGH; LOG');
        }));


        it('should compile append template', inject(function($compile, $rootScope, log) {
          element = $compile('<div><div append medium-log>{{ "angular"  }}</div><div>')
            ($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('Hello: angular');
          expect(log).toEqual('HIGH; LOG; MEDIUM');
        }));


        it('should merge attributes', inject(function($compile, $rootScope) {
          element = $compile(
            '<div><div replace class="medium-log" style="height: 20px" ></div><div>')
            ($rootScope);
          var div = element.find('div');
          expect(div.hasClass('medium-log')).toBe(true);
          expect(div.hasClass('log')).toBe(true);
          expect(div.css('width')).toBe('10px');
          expect(div.css('height')).toBe('20px');
          expect(div.attr('replace')).toEqual('');
          expect(div.attr('high-log')).toEqual('');
        }));

        it('should prevent multiple templates per element', inject(function($compile) {
          try {
            $compile('<div><span replace class="replace"></span></div>')
            fail();
          } catch(e) {
            expect(e.message).toMatch(/Multiple directives .* asking for template/);
          }
        }));

        it('should play nice with repeater when inline', inject(function($compile, $rootScope) {
          element = $compile(
            '<div>' +
              '<div ng-repeat="i in [1,2]" replace>{{i}}; </div>' +
            '</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('Hello: 1; Hello: 2; ');
        }));


        it('should play nice with repeater when append', inject(function($compile, $rootScope) {
          element = $compile(
            '<div>' +
              '<div ng-repeat="i in [1,2]" append>{{i}}; </div>' +
            '</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('Hello: 1; Hello: 2; ');
        }));
      });


      describe('async templates', function() {

        beforeEach(module(
          function($compileProvider) {
            $compileProvider.directive('hello', valueFn({ templateUrl: 'hello.html' }));
            $compileProvider.directive('cau', valueFn({ templateUrl:'cau.html' }));

            $compileProvider.directive('cError', valueFn({
              templateUrl:'error.html',
              compile: function() {
                throw Error('cError');
              }
            }));
            $compileProvider.directive('lError', valueFn({
              templateUrl: 'error.html',
              compile: function() {
                throw Error('lError');
              }
            }));


            $compileProvider.directive('iHello', valueFn({
              replace: true,
              templateUrl: 'hello.html'
            }));
            $compileProvider.directive('iCau', valueFn({
              replace: true,
              templateUrl:'cau.html'
            }));

            $compileProvider.directive('iCError', valueFn({
              replace: true,
              templateUrl:'error.html',
              compile: function() {
                throw Error('cError');
              }
            }));
            $compileProvider.directive('iLError', valueFn({
              replace: true,
              templateUrl: 'error.html',
              compile: function() {
                throw Error('lError');
              }
            }));

          }
        ));


        it('should append template via $http and cache it in $templateCache', inject(
            function($compile, $httpBackend, $templateCache, $rootScope, $browser) {
              $httpBackend.expect('GET', 'hello.html').respond('<span>Hello!</span> World!');
              $templateCache.put('cau.html', '<span>Cau!</span>');
              element = $compile('<div><b class="hello">ignore</b><b class="cau">ignore</b></div>')($rootScope);
              expect(sortedHtml(element)).
                  toEqual('<div><b class="hello"></b><b class="cau"></b></div>');

              $rootScope.$digest();


              expect(sortedHtml(element)).
                  toEqual('<div><b class="hello"></b><b class="cau"><span>Cau!</span></b></div>');

              $httpBackend.flush();
              expect(sortedHtml(element)).toEqual(
                  '<div>' +
                    '<b class="hello"><span>Hello!</span> World!</b>' +
                    '<b class="cau"><span>Cau!</span></b>' +
                  '</div>');
            }
        ));


        it('should inline template via $http and cache it in $templateCache', inject(
            function($compile, $httpBackend, $templateCache, $rootScope) {
              $httpBackend.expect('GET', 'hello.html').respond('<span>Hello!</span>');
              $templateCache.put('cau.html', '<span>Cau!</span>');
              element = $compile('<div><b class=i-hello>ignore</b><b class=i-cau>ignore</b></div>')($rootScope);
              expect(sortedHtml(element)).
                  toEqual('<div><b class="i-hello"></b><b class="i-cau"></b></div>');

              $rootScope.$digest();


              expect(sortedHtml(element)).
                  toEqual('<div><b class="i-hello"></b><span class="i-cau">Cau!</span></div>');

              $httpBackend.flush();
              expect(sortedHtml(element)).
                  toEqual('<div><span class="i-hello">Hello!</span><span class="i-cau">Cau!</span></div>');
            }
        ));


        it('should compile, link and flush the template append', inject(
            function($compile, $templateCache, $rootScope, $browser) {
              $templateCache.put('hello.html', '<span>Hello, {{name}}!</span>');
              $rootScope.name = 'Elvis';
              element = $compile('<div><b class="hello"></b></div>')($rootScope);

              $rootScope.$digest();

              expect(sortedHtml(element)).
                  toEqual('<div><b class="hello"><span>Hello, Elvis!</span></b></div>');
            }
        ));


        it('should compile, link and flush the template inline', inject(
            function($compile, $templateCache, $rootScope) {
              $templateCache.put('hello.html', '<span>Hello, {{name}}!</span>');
              $rootScope.name = 'Elvis';
              element = $compile('<div><b class=i-hello></b></div>')($rootScope);

              $rootScope.$digest();

              expect(sortedHtml(element)).
                  toEqual('<div><span class="i-hello">Hello, Elvis!</span></div>');
            }
        ));


        it('should compile, flush and link the template append', inject(
            function($compile, $templateCache, $rootScope) {
              $templateCache.put('hello.html', '<span>Hello, {{name}}!</span>');
              $rootScope.name = 'Elvis';
              var template = $compile('<div><b class="hello"></b></div>');

              element = template($rootScope);
              $rootScope.$digest();

              expect(sortedHtml(element)).
                  toEqual('<div><b class="hello"><span>Hello, Elvis!</span></b></div>');
            }
        ));


        it('should compile, flush and link the template inline', inject(
            function($compile, $templateCache, $rootScope) {
              $templateCache.put('hello.html', '<span>Hello, {{name}}!</span>');
              $rootScope.name = 'Elvis';
              var template = $compile('<div><b class=i-hello></b></div>');

              element = template($rootScope);
              $rootScope.$digest();

              expect(sortedHtml(element)).
                  toEqual('<div><span class="i-hello">Hello, Elvis!</span></div>');
            }
        ));


        it('should resolve widgets after cloning in append mode', function() {
          module(function($exceptionHandlerProvider) {
            $exceptionHandlerProvider.mode('log');
          });
          inject(function($compile, $templateCache, $rootScope, $httpBackend, $browser,
                   $exceptionHandler) {
            $httpBackend.expect('GET', 'hello.html').respond('<span>{{greeting}} </span>');
            $httpBackend.expect('GET', 'error.html').respond('<div></div>');
            $templateCache.put('cau.html', '<span>{{name}}</span>');
            $rootScope.greeting = 'Hello';
            $rootScope.name = 'Elvis';
            var template = $compile(
              '<div>' +
                '<b class="hello"></b>' +
                '<b class="cau"></b>' +
                '<b class=c-error></b>' +
                '<b class=l-error></b>' +
              '</div>');
            var e1;
            var e2;

            e1 = template($rootScope.$new(), noop); // clone
            expect(e1.text()).toEqual('');

            $httpBackend.flush();

            e2 = template($rootScope.$new(), noop); // clone
            $rootScope.$digest();
            expect(e1.text()).toEqual('Hello Elvis');
            expect(e2.text()).toEqual('Hello Elvis');

            expect($exceptionHandler.errors.length).toEqual(2);
            expect($exceptionHandler.errors[0][0].message).toEqual('cError');
            expect($exceptionHandler.errors[1][0].message).toEqual('lError');

            dealoc(e1);
            dealoc(e2);
          });
        });


        it('should resolve widgets after cloning in inline mode', function() {
          module(function($exceptionHandlerProvider) {
            $exceptionHandlerProvider.mode('log');
          });
          inject(function($compile, $templateCache, $rootScope, $httpBackend, $browser,
                   $exceptionHandler) {
            $httpBackend.expect('GET', 'hello.html').respond('<span>{{greeting}} </span>');
            $httpBackend.expect('GET', 'error.html').respond('<div></div>');
            $templateCache.put('cau.html', '<span>{{name}}</span>');
            $rootScope.greeting = 'Hello';
            $rootScope.name = 'Elvis';
            var template = $compile(
              '<div>' +
                '<b class=i-hello></b>' +
                '<b class=i-cau></b>' +
                '<b class=i-c-error></b>' +
                '<b class=i-l-error></b>' +
              '</div>');
            var e1;
            var e2;

            e1 = template($rootScope.$new(), noop); // clone
            expect(e1.text()).toEqual('');

            $httpBackend.flush();

            e2 = template($rootScope.$new(), noop); // clone
            $rootScope.$digest();
            expect(e1.text()).toEqual('Hello Elvis');
            expect(e2.text()).toEqual('Hello Elvis');

            expect($exceptionHandler.errors.length).toEqual(2);
            expect($exceptionHandler.errors[0][0].message).toEqual('cError');
            expect($exceptionHandler.errors[1][0].message).toEqual('lError');

            dealoc(e1);
            dealoc(e2);
          });
        });


        it('should be implicitly terminal and not compile placeholder content in append', inject(
            function($compile, $templateCache, $rootScope, log) {
              // we can't compile the contents because that would result in a memory leak

              $templateCache.put('hello.html', 'Hello!');
              element = $compile('<div><b class="hello"><div log></div></b></div>')($rootScope);

              expect(log).toEqual('');
            }
        ));


        it('should be implicitly terminal and not compile placeholder content in inline', inject(
            function($compile, $templateCache, $rootScope, log) {
              // we can't compile the contents because that would result in a memory leak

              $templateCache.put('hello.html', 'Hello!');
              element = $compile('<div><b class=i-hello><div log></div></b></div>')($rootScope);

              expect(log).toEqual('');
            }
        ));


        it('should throw an error and clear element content if the template fails to load', inject(
            function($compile, $httpBackend, $rootScope) {
              $httpBackend.expect('GET', 'hello.html').respond(404, 'Not Found!');
              element = $compile('<div><b class="hello">content</b></div>')($rootScope);

              expect(function() {
                $httpBackend.flush();
              }).toThrow('Failed to load template: hello.html');
              expect(sortedHtml(element)).toBe('<div><b class="hello"></b></div>');
            }
        ));


        it('should prevent multiple templates per element', function() {
          module(function($compileProvider) {
            $compileProvider.directive('sync', valueFn({
              template: '<span></span>'
            }));
            $compileProvider.directive('async', valueFn({
              templateUrl: 'template.html'
            }));
          });
          inject(function($compile){
            expect(function() {
              $compile('<div><div class="sync async"></div></div>');
            }).toThrow('Multiple directives [sync, async] asking for template on: <'+
                (msie <= 8 ? 'DIV' : 'div') + ' class="sync async">');
          });
        });


        describe('delay compile / linking functions until after template is resolved', function(){
          var template;
          beforeEach(module(function($compileProvider) {
            function directive (name, priority, options) {
              $compileProvider.directive(name, function(log) {
                return (extend({
                 priority: priority,
                 compile: function() {
                   log(name + '-C');
                   return function() { log(name + '-L'); }
                 }
               }, options || {}));
              });
            }

            directive('first', 10);
            directive('second', 5, { templateUrl: 'second.html' });
            directive('third', 3);
            directive('last', 0);

            directive('iFirst', 10, {replace: true});
            directive('iSecond', 5, {replace: true, templateUrl: 'second.html' });
            directive('iThird', 3, {replace: true});
            directive('iLast', 0, {replace: true});
          }));

          it('should flush after link append', inject(
              function($compile, $rootScope, $httpBackend, log) {
            $httpBackend.expect('GET', 'second.html').respond('<div third>{{1+2}}</div>');
            template = $compile('<div><span first second last></span></div>');
            element = template($rootScope);
            expect(log).toEqual('first-C');

            log('FLUSH');
            $httpBackend.flush();
            $rootScope.$digest();
            expect(log).toEqual(
              'first-C; FLUSH; second-C; last-C; third-C; ' +
              'third-L; first-L; second-L; last-L');

            var span = element.find('span');
            expect(span.attr('first')).toEqual('');
            expect(span.attr('second')).toEqual('');
            expect(span.find('div').attr('third')).toEqual('');
            expect(span.attr('last')).toEqual('');

            expect(span.text()).toEqual('3');
          }));


          it('should flush after link inline', inject(
              function($compile, $rootScope, $httpBackend, log) {
            $httpBackend.expect('GET', 'second.html').respond('<div i-third>{{1+2}}</div>');
            template = $compile('<div><span i-first i-second i-last></span></div>');
            element = template($rootScope);
            expect(log).toEqual('iFirst-C');

            log('FLUSH');
            $httpBackend.flush();
            $rootScope.$digest();
            expect(log).toEqual(
              'iFirst-C; FLUSH; iSecond-C; iThird-C; iLast-C; ' +
              'iFirst-L; iSecond-L; iThird-L; iLast-L');

            var div = element.find('div');
            expect(div.attr('i-first')).toEqual('');
            expect(div.attr('i-second')).toEqual('');
            expect(div.attr('i-third')).toEqual('');
            expect(div.attr('i-last')).toEqual('');

            expect(div.text()).toEqual('3');
          }));


          it('should flush before link append', inject(
              function($compile, $rootScope, $httpBackend, log) {
            $httpBackend.expect('GET', 'second.html').respond('<div third>{{1+2}}</div>');
            template = $compile('<div><span first second last></span></div>');
            expect(log).toEqual('first-C');
            log('FLUSH');
            $httpBackend.flush();
            expect(log).toEqual('first-C; FLUSH; second-C; last-C; third-C');

            element = template($rootScope);
            $rootScope.$digest();
            expect(log).toEqual(
              'first-C; FLUSH; second-C; last-C; third-C; ' +
              'third-L; first-L; second-L; last-L');

            var span = element.find('span');
            expect(span.attr('first')).toEqual('');
            expect(span.attr('second')).toEqual('');
            expect(span.find('div').attr('third')).toEqual('');
            expect(span.attr('last')).toEqual('');

            expect(span.text()).toEqual('3');
          }));


          it('should flush before link inline', inject(
              function($compile, $rootScope, $httpBackend, log) {
            $httpBackend.expect('GET', 'second.html').respond('<div i-third>{{1+2}}</div>');
            template = $compile('<div><span i-first i-second i-last></span></div>');
            expect(log).toEqual('iFirst-C');
            log('FLUSH');
            $httpBackend.flush();
            expect(log).toEqual('iFirst-C; FLUSH; iSecond-C; iThird-C; iLast-C');

            element = template($rootScope);
            $rootScope.$digest();
            expect(log).toEqual(
              'iFirst-C; FLUSH; iSecond-C; iThird-C; iLast-C; ' +
              'iFirst-L; iSecond-L; iThird-L; iLast-L');

            var div = element.find('div');
            expect(div.attr('i-first')).toEqual('');
            expect(div.attr('i-second')).toEqual('');
            expect(div.attr('i-third')).toEqual('');
            expect(div.attr('i-last')).toEqual('');

            expect(div.text()).toEqual('3');
          }));
        });


        it('should check that template has root element', inject(function($compile, $httpBackend) {
          $httpBackend.expect('GET', 'hello.html').respond('before <b>mid</b> after');
          $compile('<div i-hello></div>');
          expect(function(){
            $httpBackend.flush();
          }).toThrow('Template must have exactly one root element: before <b>mid</b> after');
        }));


        it('should allow multiple elements in template', inject(function($compile, $httpBackend) {
          $httpBackend.expect('GET', 'hello.html').respond('before <b>mid</b> after');
          element = jqLite('<div hello></div>');
          $compile(element);
          $httpBackend.flush();
          expect(element.text()).toEqual('before mid after');
        }));


        it('should work when widget is in root element', inject(
          function($compile, $httpBackend, $rootScope) {
            $httpBackend.expect('GET', 'hello.html').respond('<span>3==<<content>></span>');
            element = jqLite('<b class="hello">{{1+2}}</b>');
            $compile(element)($rootScope);

            $httpBackend.flush();
            expect(element.text()).toEqual('3==3');
          }
        ));


        it('should work when widget is a repeater', inject(
          function($compile, $httpBackend, $rootScope) {
            $httpBackend.expect('GET', 'hello.html').respond('<span>i=<<content>>;</span>');
            element = jqLite('<div><b class=hello ng-repeat="i in [1,2]">{{i}}</b></div>');
            $compile(element)($rootScope);

            $httpBackend.flush();
            expect(element.text()).toEqual('i=1;i=2;');
          }
        ));
      });


      describe('scope', function() {

        beforeEach(module(function($compileProvider) {
          forEach(['', 'a', 'b'], function(name) {
            $compileProvider.directive('scope' + uppercase(name), function(log) {
              return {
                scope: true,
                compile: function() {
                  return function (scope, element) {
                    log(scope.$id);
                    expect(element.data('$scope')).toBe(scope);
                  };
                }
              };
            });
          });
          $compileProvider.directive('log', function(log) {
            return function(scope) {
              log('log-' + scope.$id + '-' + scope.$parent.$id);
            };
          });
        }));


        it('should allow creation of new scopes', inject(function($rootScope, $compile, log) {
          element = $compile('<div><span scope><a log></a></span></div>')($rootScope);
          expect(log).toEqual('LOG; log-002-001; 002');
        }));


        it('should correctly create the scope hierachy properly', inject(
            function($rootScope, $compile, log) {
          element = $compile(
              '<div>' + //1
                '<b class=scope>' + //2
                  '<b class=scope><b class=log></b></b>' + //3
                  '<b class=log></b>' +
                '</b>' +
                '<b class=scope>' + //4
                  '<b class=log></b>' +
                '</b>' +
              '</div>'
            )($rootScope);
          expect(log).toEqual('LOG; log-003-002; 003; LOG; log-002-001; 002; LOG; log-004-001; 004');
        }));


        it('should not allow more then one scope creation per element', inject(
          function($rootScope, $compile) {
            expect(function(){
              $compile('<div class="scope-a; scope-b"></div>');
            }).toThrow('Multiple directives [scopeA, scopeB] asking for new scope on: ' +
                '<' + (msie < 9 ? 'DIV' : 'div') + ' class="scope-a; scope-b">');
          }));


        it('should treat new scope on new template as noop', inject(
          function($rootScope, $compile, log) {
            element = $compile('<div scope-a></div>')($rootScope);
            expect(log).toEqual('001');
          }));
      });
    });
  });


  describe('interpolation', function() {

    it('should compile and link both attribute and text bindings', inject(
        function($rootScope, $compile) {
          $rootScope.name = 'angular';
          element = $compile('<div name="attr: {{name}}">text: {{name}}</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('text: angular');
          expect(element.attr('name')).toEqual('attr: angular');
        }));


    it('should decorate the binding with ng-binding and interpolation function', inject(
        function($compile, $rootScope) {
          element = $compile('<div>{{1+2}}</div>')($rootScope);
          expect(element.hasClass('ng-binding')).toBe(true);
          expect(element.data('$binding')[0].exp).toEqual('{{1+2}}');
        }));
  });


  describe('link phase', function() {

    beforeEach(module(function($compileProvider) {

      forEach(['a', 'b', 'c'], function(name) {
        $compileProvider.directive(name, function(log) {
          return {
            compile: function() {
              log('t' + uppercase(name))
              return {
                pre: function() {
                  log('pre' + uppercase(name));
                },
                post: function linkFn() {
                  log('post' + uppercase(name));
                }
              };
            }
          };
        });
      });
    }));


    it('should not store linkingFns for noop branches', inject(function ($rootScope, $compile) {
      element = jqLite('<div name="{{a}}"><span>ignore</span></div>');
      var linkingFn = $compile(element);
      // Now prune the branches with no directives
      element.find('span').remove();
      expect(element.find('span').length).toBe(0);
      // and we should still be able to compile without errors
      linkingFn($rootScope);
    }));


    it('should compile from top to bottom but link from bottom up', inject(
        function($compile, $rootScope, log) {
          element = $compile('<a b><c></c></a>')($rootScope);
          expect(log).toEqual('tA; tB; tC; preA; preB; preC; postC; postA; postB');
        }
    ));


    it('should support link function on directive object', function() {
      module(function($compileProvider) {
        $compileProvider.directive('abc', valueFn({
          link: function(scope, element, attrs) {
            element.text(attrs.abc);
          }
        }));
      });
      inject(function($compile, $rootScope) {
        element = $compile('<div abc="WORKS">FAIL</div>')($rootScope);
        expect(element.text()).toEqual('WORKS');
      });
    });
  });


  describe('attrs', function() {

    it('should allow setting of attributes', function() {
      module(function($compileProvider) {
        $compileProvider.directive({
          setter: valueFn(function(scope, element, attr) {
            attr.$set('name', 'abc');
            attr.$set('disabled', true);
            expect(attr.name).toBe('abc');
            expect(attr.disabled).toBe(true);
          })
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile('<div setter></div>')($rootScope);
        expect(element.attr('name')).toEqual('abc');
        expect(element.attr('disabled')).toEqual('disabled');
      });
    });


    it('should read boolean attributes as boolean', function() {
      module(function($compileProvider) {
        $compileProvider.directive({
          div: valueFn(function(scope, element, attr) {
            element.text(attr.required);
          })
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile('<div required></div>')($rootScope);
        expect(element.text()).toEqual('true');
      });
    });

    it('should allow setting of attributes', function() {
      module(function($compileProvider) {
        $compileProvider.directive({
          setter: valueFn(function(scope, element, attr) {
            attr.$set('name', 'abc');
            attr.$set('disabled', true);
            expect(attr.name).toBe('abc');
            expect(attr.disabled).toBe(true);
          })
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile('<div setter></div>')($rootScope);
        expect(element.attr('name')).toEqual('abc');
        expect(element.attr('disabled')).toEqual('disabled');
      });
    });


    it('should read boolean attributes as boolean', function() {
      module(function($compileProvider) {
        $compileProvider.directive({
          div: valueFn(function(scope, element, attr) {
            element.text(attr.required);
          })
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile('<div required></div>')($rootScope);
        expect(element.text()).toEqual('true');
      });
    });


    it('should create new instance of attr for each template stamping', function() {
      module(function($compileProvider, $provide) {
        var state = { first: [], second: [] };
        $provide.value('state', state);
        $compileProvider.directive({
          first: valueFn({
            priority: 1,
            compile: function(templateElement, templateAttr) {
              return function(scope, element, attr) {
                state.first.push({
                  template: {element: templateElement, attr:templateAttr},
                  link: {element: element, attr: attr}
                });
              }
            }
          }),
          second: valueFn({
            priority: 2,
            compile: function(templateElement, templateAttr) {
              return function(scope, element, attr) {
                state.second.push({
                  template: {element: templateElement, attr:templateAttr},
                  link: {element: element, attr: attr}
                });
              }
            }
          })
        });
      });
      inject(function($rootScope, $compile, state) {
        var template = $compile('<div first second>');
        dealoc(template($rootScope.$new(), noop));
        dealoc(template($rootScope.$new(), noop));

        // instance between directives should be shared
        expect(state.first[0].template.element).toBe(state.second[0].template.element);
        expect(state.first[0].template.attr).toBe(state.second[0].template.attr);

        // the template and the link can not be the same instance
        expect(state.first[0].template.element).not.toBe(state.first[0].link.element);
        expect(state.first[0].template.attr).not.toBe(state.first[0].link.attr);

        // each new template needs to be new instance
        expect(state.first[0].link.element).not.toBe(state.first[1].link.element);
        expect(state.first[0].link.attr).not.toBe(state.first[1].link.attr);
        expect(state.second[0].link.element).not.toBe(state.second[1].link.element);
        expect(state.second[0].link.attr).not.toBe(state.second[1].link.attr);
      });
    });


    describe('$set', function() {
      var attr;
      beforeEach(function(){
        module(function($compileProvider) {
          $compileProvider.directive('div', valueFn(function(scope, element, attr){
            scope.attr = attr;
          }));
        });
        inject(function($compile, $rootScope) {
          element = $compile('<div></div>')($rootScope);
          attr = $rootScope.attr;
          expect(attr).toBeDefined();
        });
      });


      it('should set attributes', function() {
        attr.$set('ngMyAttr', 'value');
        expect(element.attr('ng-my-attr')).toEqual('value');
        expect(attr.ngMyAttr).toEqual('value');
      });


      it('should allow overriding of attribute name and remember the name', function() {
        attr.$set('ngOther', '123', 'other');
        expect(element.attr('other')).toEqual('123');
        expect(attr.ngOther).toEqual('123');

        attr.$set('ngOther', '246');
        expect(element.attr('other')).toEqual('246');
        expect(attr.ngOther).toEqual('246');
      });


      it('should set boolean attributes', function() {
        attr.$set('disabled', 'true');
        attr.$set('readOnly', 'true');
        expect(element.attr('disabled')).toEqual('disabled');
        expect(element.attr('readonly')).toEqual('readonly');

        attr.$set('disabled', 'false');
        expect(element.attr('disabled')).toEqual(undefined);

        attr.$set('disabled', false);
        attr.$set('readOnly', false);
        expect(element.attr('disabled')).toEqual(undefined);
        expect(element.attr('readonly')).toEqual(undefined);
      });


      it('should remove attribute', function() {
        attr.$set('ngMyAttr', 'value');
        expect(element.attr('ng-my-attr')).toEqual('value');

        attr.$set('ngMyAttr', undefined);
        expect(element.attr('ng-my-attr')).toBe(undefined);

        attr.$set('ngMyAttr', 'value');
        attr.$set('ngMyAttr', null);
        expect(element.attr('ng-my-attr')).toBe(undefined);
      })
    });
  });
});
