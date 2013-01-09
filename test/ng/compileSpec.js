'use strict';

describe('$compile', function() {
  var element, directive, $compile, $rootScope;

  beforeEach(module(provideLog, function($provide, $compileProvider){
    element = null;
    directive = $compileProvider.directive;

    directive('log', function(log) {
      return {
        restrict: 'CAM',
        priority:0,
        compile: valueFn(function(scope, element, attrs) {
          log(attrs.log || 'LOG');
        })
      };
    });

    directive('highLog', function(log) {
      return { restrict: 'CAM', priority:3, compile: valueFn(function(scope, element, attrs) {
        log(attrs.highLog || 'HIGH');
      })};
    });

    directive('mediumLog', function(log) {
      return { restrict: 'CAM', priority:2, compile: valueFn(function(scope, element, attrs) {
        log(attrs.mediumLog || 'MEDIUM');
      })};
    });

    directive('greet', function() {
      return { restrict: 'CAM', priority:10,  compile: valueFn(function(scope, element, attrs) {
        element.text("Hello " + attrs.greet);
      })};
    });

    directive('set', function() {
      return function(scope, element, attrs) {
        element.text(attrs.set);
      };
    });

    directive('mediumStop', valueFn({
      priority: 2,
      terminal: true
    }));

    directive('stop', valueFn({
      terminal: true
    }));

    directive('negativeStop', valueFn({
      priority: -100, // even with negative priority we still should be able to stop descend
      terminal: true
    }));

    return function(_$compile_, _$rootScope_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    };
  }));

  function compile(html) {
    element = angular.element(html);
    $compile(element)($rootScope);
  }

  afterEach(function(){
    dealoc(element);
  });


  describe('configuration', function() {
    it('should register a directive', function() {
      module(function() {
        directive('div', function(log) {
          return {
            restrict: 'ECA',
            link: function(scope, element) {
              log('OK');
              element.text('SUCCESS');
            }
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
      module(function() {
        directive('div', function(log) {
          return {
            restrict: 'ECA',
            link: log.fn('1')
          };
        });
        directive('div', function(log) {
          return {
            restrict: 'ECA',
            link: log.fn('2')
          };
        });
      });
      inject(function($compile, $rootScope, log) {
        element = $compile('<div></div>')($rootScope);
        expect(log).toEqual('1; 2');
      });
    });
  });


  describe('compile phase', function() {

    it('should wrap root text nodes in spans', inject(function($compile, $rootScope) {
      element = jqLite('<div>A&lt;a&gt;B&lt;/a&gt;C</div>');
      var text = element.contents();
      expect(text[0].nodeName).toEqual('#text');
      text = $compile(text)($rootScope);
      expect(lowercase(text[0].nodeName)).toEqual('span');
      expect(element.find('span').text()).toEqual('A<a>B</a>C');
    }));


    it('should not wrap root whitespace text nodes in spans', function() {
      element = jqLite(
        '<div>   <div>A</div>\n  '+ // The spaces and newlines here should not get wrapped
        '<div>B</div>C\t\n  '+  // The "C", tabs and spaces here will be wrapped
        '</div>');
      $compile(element.contents())($rootScope);
      var spans = element.find('span');
      expect(spans.length).toEqual(1);
      expect(spans.text().indexOf('C')).toEqual(0);
    });


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


      it('should ignore not set CSS classes on SVG elements', inject(function($compile, $rootScope, log) {
        if (!window.SVGElement) return;
        // According to spec SVG element className property is readonly, but only FF
        // implements it this way which causes compile exceptions.
        element = $compile('<svg><text>{{1}}</text></svg>')($rootScope);
        $rootScope.$digest();
        expect(element.text()).toEqual('1');
      }));


      it('should allow directives in comments', inject(
        function($compile, $rootScope, log) {
          element = $compile('<div>0<!-- directive: log angular -->1</div>')($rootScope);
          expect(log).toEqual('angular');
        }
      ));


      it('should receive scope, element, and attributes', function() {
        var injector;
        module(function() {
          directive('log', function($injector, $rootScope) {
            injector = $injector;
            return {
              restrict: 'CA',
              compile: function(element, templateAttr) {
                expect(typeof templateAttr.$normalize).toBe('function');
                expect(typeof templateAttr.$set).toBe('function');
                expect(isElement(templateAttr.$$element)).toBeTruthy();
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
        module(function($exceptionHandlerProvider) {
          $exceptionHandlerProvider.mode('log');
          directive('factoryError', function() { throw 'FactoryError'; });
          directive('templateError',
              valueFn({ compile: function() { throw 'TemplateError'; } }));
          directive('linkingError',
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
              toEqual('<div class="ng-scope" factory-error linking-error template-error>');


          // crazy stuff to make IE happy
          function ie(text) {
            var list = [],
                parts, elementName;

            parts = lowercase(text).
                replace('<', '').
                replace('>', '').
                split(' ');
            elementName = parts.shift();
            parts.sort();
            parts.unshift(elementName);
            forEach(parts, function(value, key){
              if (value.substring(0,3) == 'ng-') {
              } else {
                value = value.replace('=""', '');
                var match = value.match(/=(.*)/);
                if (match && match[1].charAt(0) != '"') {
                  value = value.replace(/=(.*)/, '="$1"');
                }
                list.push(value);
              }
            });
            return '<' + list.join(' ') + '>';
          }
        });
      });


      it('should allow changing the template structure after the current node', function() {
        module(function(){
          directive('after', valueFn({
            compile: function(element) {
              element.after('<span log>B</span>');
            }
          }));
        });
        inject(function($compile, $rootScope, log){
          element = jqLite("<div><div after>A</div></div>");
          $compile(element)($rootScope);
          expect(element.text()).toBe('AB');
          expect(log).toEqual('LOG');
        });
      });


      it('should allow changing the template structure after the current node inside ngRepeat', function() {
        module(function(){
          directive('after', valueFn({
            compile: function(element) {
              element.after('<span log>B</span>');
            }
          }));
        });
        inject(function($compile, $rootScope, log){
          element = jqLite('<div><div ng-repeat="i in [1,2]"><div after>A</div></div></div>');
          $compile(element)($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('ABAB');
          expect(log).toEqual('LOG; LOG');
        });
      });
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
            module(function() {
              forEach({div:'E', attr:'A', clazz:'C', all:'EAC'}, function(restrict, name) {
                directive(name, function(log) {
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

        beforeEach(module(function() {
          directive('replace', valueFn({
            restrict: 'CAM',
            replace: true,
            template: '<div class="log" style="width: 10px" high-log>Replace!</div>',
            compile: function(element, attr) {
              attr.$set('compiled', 'COMPILED');
              expect(element).toBe(attr.$$element);
            }
          }));
          directive('append', valueFn({
            restrict: 'CAM',
            template: '<div class="log" style="width: 10px" high-log>Append!</div>',
            compile: function(element, attr) {
              attr.$set('compiled', 'COMPILED');
              expect(element).toBe(attr.$$element);
            }
          }));
          directive('replaceWithInterpolatedClass', valueFn({
            replace: true,
            template: '<div class="class_{{1+1}}">Replace with interpolated class!</div>',
            compile: function(element, attr) {
              attr.$set('compiled', 'COMPILED');
              expect(element).toBe(attr.$$element);
            }
          }));
        }));


        it('should replace element with template', inject(function($compile, $rootScope) {
          element = $compile('<div><div replace>ignore</div><div>')($rootScope);
          expect(element.text()).toEqual('Replace!');
          expect(element.find('div').attr('compiled')).toEqual('COMPILED');
        }));


        it('should append element with template', inject(function($compile, $rootScope) {
          element = $compile('<div><div append>ignore</div><div>')($rootScope);
          expect(element.text()).toEqual('Append!');
          expect(element.find('div').attr('compiled')).toEqual('COMPILED');
        }));


        it('should compile template when replacing', inject(function($compile, $rootScope, log) {
          element = $compile('<div><div replace medium-log>ignore</div><div>')
            ($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('Replace!');
          // HIGH goes after MEDIUM since it executes as part of replaced template
          expect(log).toEqual('MEDIUM; HIGH; LOG');
        }));


        it('should compile template when appending', inject(function($compile, $rootScope, log) {
          element = $compile('<div><div append medium-log>ignore</div><div>')
            ($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('Append!');
          expect(log).toEqual('HIGH; LOG; MEDIUM');
        }));


        it('should merge attributes including style attr', inject(function($compile, $rootScope) {
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

        it('should play nice with repeater when replacing', inject(function($compile, $rootScope) {
          element = $compile(
            '<div>' +
              '<div ng-repeat="i in [1,2]" replace></div>' +
            '</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('Replace!Replace!');
        }));


        it('should play nice with repeater when appending', inject(function($compile, $rootScope) {
          element = $compile(
            '<div>' +
              '<div ng-repeat="i in [1,2]" append></div>' +
            '</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('Append!Append!');
        }));


        it('should handle interpolated css from replacing directive', inject(
            function($compile, $rootScope) {
          element = $compile('<div replace-with-interpolated-class></div>')($rootScope);
          $rootScope.$digest();
          expect(element).toHaveClass('class_2');
        }));


        it('should merge interpolated css class', inject(function($compile, $rootScope) {
          element = $compile('<div class="one {{cls}} three" replace></div>')($rootScope);

          $rootScope.$apply(function() {
            $rootScope.cls = 'two';
          });

          expect(element).toHaveClass('one');
          expect(element).toHaveClass('two'); // interpolated
          expect(element).toHaveClass('three');
          expect(element).toHaveClass('log'); // merged from replace directive template
        }));


        it('should merge interpolated css class with ngRepeat',
            inject(function($compile, $rootScope) {
          element = $compile(
              '<div>' +
                '<div ng-repeat="i in [1]" class="one {{cls}} three" replace></div>' +
              '</div>')($rootScope);

          $rootScope.$apply(function() {
            $rootScope.cls = 'two';
          });

          var child = element.find('div').eq(0);
          expect(child).toHaveClass('one');
          expect(child).toHaveClass('two'); // interpolated
          expect(child).toHaveClass('three');
          expect(child).toHaveClass('log'); // merged from replace directive template
        }));

        it("should fail if replacing and template doesn't have a single root element", function() {
          module(function() {
            directive('noRootElem', function() {
              return {
                replace: true,
                template: 'dada'
              }
            });
            directive('multiRootElem', function() {
              return {
                replace: true,
                template: '<div></div><div></div>'
              }
            });
            directive('singleRootWithWhiteSpace', function() {
              return {
                replace: true,
                template: '  <div></div> \n'
              }
            });
          });

          inject(function($compile) {
            expect(function() {
              $compile('<p no-root-elem></p>');
            }).toThrow('Template must have exactly one root element. was: dada');

            expect(function() {
              $compile('<p multi-root-elem></p>');
            }).toThrow('Template must have exactly one root element. was: <div></div><div></div>');

            // ws is ok
            expect(function() {
              $compile('<p single-root-with-white-space></p>');
            }).not.toThrow();
          });
        });
      });


      describe('templateUrl', function() {

        beforeEach(module(
          function() {
            directive('hello', valueFn({
              restrict: 'CAM', templateUrl: 'hello.html', transclude: true
            }));
            directive('cau', valueFn({
              restrict: 'CAM', templateUrl:'cau.html'
            }));

            directive('cError', valueFn({
              restrict: 'CAM',
              templateUrl:'error.html',
              compile: function() {
                throw Error('cError');
              }
            }));
            directive('lError', valueFn({
              restrict: 'CAM',
              templateUrl: 'error.html',
              compile: function() {
                throw Error('lError');
              }
            }));


            directive('iHello', valueFn({
              restrict: 'CAM',
              replace: true,
              templateUrl: 'hello.html'
            }));
            directive('iCau', valueFn({
              restrict: 'CAM',
              replace: true,
              templateUrl:'cau.html'
            }));

            directive('iCError', valueFn({
              restrict: 'CAM',
              replace: true,
              templateUrl:'error.html',
              compile: function() {
                throw Error('cError');
              }
            }));
            directive('iLError', valueFn({
              restrict: 'CAM',
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
          module(function() {
            directive('sync', valueFn({
              restrict: 'C',
              template: '<span></span>'
            }));
            directive('async', valueFn({
              restrict: 'C',
              templateUrl: 'template.html'
            }));
          });
          inject(function($compile){
            expect(function() {
              $compile('<div><div class="sync async"></div></div>');
            }).toThrow('Multiple directives [sync, async] asking for template on: '+
                '<div class="sync async">');
          });
        });


        describe('delay compile / linking functions until after template is resolved', function(){
          var template;
          beforeEach(module(function() {
            function logDirective (name, priority, options) {
              directive(name, function(log) {
                return (extend({
                 priority: priority,
                 compile: function() {
                   log(name + '-C');
                   return function() { log(name + '-L'); }
                 }
               }, options || {}));
              });
            }

            logDirective('first', 10);
            logDirective('second', 5, { templateUrl: 'second.html' });
            logDirective('third', 3);
            logDirective('last', 0);

            logDirective('iFirst', 10, {replace: true});
            logDirective('iSecond', 5, {replace: true, templateUrl: 'second.html' });
            logDirective('iThird', 3, {replace: true});
            logDirective('iLast', 0, {replace: true});
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


        it('should allow multiple elements in template', inject(function($compile, $httpBackend) {
          $httpBackend.expect('GET', 'hello.html').respond('before <b>mid</b> after');
          element = jqLite('<div hello></div>');
          $compile(element);
          $httpBackend.flush();
          expect(element.text()).toEqual('before mid after');
        }));


        it('should work when directive is on the root element', inject(
          function($compile, $httpBackend, $rootScope) {
            $httpBackend.expect('GET', 'hello.html').
                respond('<span>3==<span ng-transclude></span></span>');
            element = jqLite('<b class="hello">{{1+2}}</b>');
            $compile(element)($rootScope);

            $httpBackend.flush();
            expect(element.text()).toEqual('3==3');
          }
        ));


        it('should work when directive is a repeater', inject(
          function($compile, $httpBackend, $rootScope) {
            $httpBackend.expect('GET', 'hello.html').
                respond('<span>i=<span ng-transclude></span>;</span>');
            element = jqLite('<div><b class=hello ng-repeat="i in [1,2]">{{i}}</b></div>');
            $compile(element)($rootScope);

            $httpBackend.flush();
            expect(element.text()).toEqual('i=1;i=2;');
          }
        ));


        it("should fail if replacing and template doesn't have a single root element", function() {
          module(function($exceptionHandlerProvider) {
            $exceptionHandlerProvider.mode('log');

            directive('template', function() {
              return {
                replace: true,
                templateUrl: 'template.html'
              }
            });
          });

          inject(function($compile, $templateCache, $rootScope, $exceptionHandler) {
            // no root element
            $templateCache.put('template.html', 'dada');
            $compile('<p template></p>');
            $rootScope.$digest();
            expect($exceptionHandler.errors.pop().message).
                toBe('Template must have exactly one root element. was: dada');

            // multi root
            $templateCache.put('template.html', '<div></div><div></div>');
            $compile('<p template></p>');
            $rootScope.$digest();
            expect($exceptionHandler.errors.pop().message).
                toBe('Template must have exactly one root element. was: <div></div><div></div>');

            // ws is ok
            $templateCache.put('template.html', '  <div></div> \n');
            $compile('<p template></p>');
            $rootScope.$apply();
            expect($exceptionHandler.errors).toEqual([]);
          });
        });


        it('should resume delayed compilation without duplicates when in a repeater', function() {
          // this is a test for a regression
          // scope creation, isolate watcher setup, controller instantiation, etc should happen
          // only once even if we are dealing with delayed compilation of a node due to templateUrl
          // and the template node is in a repeater

          var controllerSpy = jasmine.createSpy('controller');

          module(function($compileProvider) {
            $compileProvider.directive('delayed', valueFn({
              controller: controllerSpy,
              templateUrl: 'delayed.html',
              scope: {
                title: '@'
              }
            }));
          });

          inject(function($templateCache, $compile, $rootScope) {
            $rootScope.coolTitle = 'boom!';
            $templateCache.put('delayed.html', '<div>{{title}}</div>');
            element = $compile(
                '<div><div ng-repeat="i in [1,2]"><div delayed title="{{coolTitle + i}}"></div>|</div></div>'
            )($rootScope);

            $rootScope.$apply();

            expect(controllerSpy.callCount).toBe(2);
            expect(element.text()).toBe('boom!1|boom!2|');
          });
        });
      });


      describe('scope', function() {
        var iscope;

        beforeEach(module(function() {
          forEach(['', 'a', 'b'], function(name) {
            directive('scope' + uppercase(name), function(log) {
              return {
                scope: true,
                restrict: 'CA',
                compile: function() {
                  return function (scope, element) {
                    log(scope.$id);
                    expect(element.data('$scope')).toBe(scope);
                  };
                }
              };
            });
            directive('iscope' + uppercase(name), function(log) {
              return {
                scope: {},
                restrict: 'CA',
                compile: function() {
                  return function (scope, element) {
                    iscope = scope;
                    log(scope.$id);
                    expect(element.data('$scope')).toBe(scope);
                  };
                }
              };
            });
            directive('tscope' + uppercase(name), function(log) {
              return {
                scope: true,
                restrict: 'CA',
                templateUrl: 'tscope.html',
                compile: function() {
                  return function (scope, element) {
                    log(scope.$id);
                    expect(element.data('$scope')).toBe(scope);
                  };
                }
              };
            });
            directive('trscope' + uppercase(name), function(log) {
              return {
                scope: true,
                replace: true,
                restrict: 'CA',
                templateUrl: 'trscope.html',
                compile: function() {
                  return function (scope, element) {
                    log(scope.$id);
                    expect(element.data('$scope')).toBe(scope);
                  };
                }
              };
            });
            directive('tiscope' + uppercase(name), function(log) {
              return {
                scope: {},
                restrict: 'CA',
                templateUrl: 'tiscope.html',
                compile: function() {
                  return function (scope, element) {
                    iscope = scope;
                    log(scope.$id);
                    expect(element.data('$scope')).toBe(scope);
                  };
                }
              };
            });
          });
          directive('log', function(log) {
            return {
              restrict: 'CA',
              link: function(scope) {
                log('log-' + scope.$id + '-' + scope.$parent.$id);
              }
            };
          });
        }));


        it('should allow creation of new scopes', inject(function($rootScope, $compile, log) {
          element = $compile('<div><span scope><a log></a></span></div>')($rootScope);
          expect(log).toEqual('LOG; log-002-001; 002');
          expect(element.find('span').hasClass('ng-scope')).toBe(true);
        }));


        it('should allow creation of new isolated scopes for directives', inject(
            function($rootScope, $compile, log) {
          element = $compile('<div><span iscope><a log></a></span></div>')($rootScope);
          expect(log).toEqual('LOG; log-002-001; 002');
          $rootScope.name = 'abc';
          expect(iscope.$parent).toBe($rootScope);
          expect(iscope.name).toBeUndefined();
        }));


        it('should allow creation of new scopes for directives with templates', inject(
            function($rootScope, $compile, log, $httpBackend) {
          $httpBackend.expect('GET', 'tscope.html').respond('<a log>{{name}}; scopeId: {{$id}}</a>');
          element = $compile('<div><span tscope></span></div>')($rootScope);
          $httpBackend.flush();
          expect(log).toEqual('LOG; log-002-001; 002');
          $rootScope.name = 'Jozo';
          $rootScope.$apply();
          expect(element.text()).toBe('Jozo; scopeId: 002');
          expect(element.find('span').scope().$id).toBe('002');
        }));


        it('should allow creation of new scopes for replace directives with templates', inject(
            function($rootScope, $compile, log, $httpBackend) {
          $httpBackend.expect('GET', 'trscope.html').
              respond('<p><a log>{{name}}; scopeId: {{$id}}</a></p>');
          element = $compile('<div><span trscope></span></div>')($rootScope);
          $httpBackend.flush();
          expect(log).toEqual('LOG; log-002-001; 002');
          $rootScope.name = 'Jozo';
          $rootScope.$apply();
          expect(element.text()).toBe('Jozo; scopeId: 002');
          expect(element.find('a').scope().$id).toBe('002');
        }));


        it('should allow creation of new scopes for replace directives with templates in a repeater',
            inject(function($rootScope, $compile, log, $httpBackend) {
          $httpBackend.expect('GET', 'trscope.html').
              respond('<p><a log>{{name}}; scopeId: {{$id}} |</a></p>');
          element = $compile('<div><span ng-repeat="i in [1,2,3]" trscope></span></div>')($rootScope);
          $httpBackend.flush();
          expect(log).toEqual('LOG; log-003-002; 003; LOG; log-005-004; 005; LOG; log-007-006; 007');
          $rootScope.name = 'Jozo';
          $rootScope.$apply();
          expect(element.text()).toBe('Jozo; scopeId: 003 |Jozo; scopeId: 005 |Jozo; scopeId: 007 |');
          expect(element.find('p').scope().$id).toBe('003');
          expect(element.find('a').scope().$id).toBe('003');
        }));


        it('should allow creation of new isolated scopes for directives with templates', inject(
            function($rootScope, $compile, log, $httpBackend) {
          $httpBackend.expect('GET', 'tiscope.html').respond('<a log></a>');
          element = $compile('<div><span tiscope></span></div>')($rootScope);
          $httpBackend.flush();
          expect(log).toEqual('LOG; log-002-001; 002');
          $rootScope.name = 'abc';
          expect(iscope.$parent).toBe($rootScope);
          expect(iscope.name).toBeUndefined();
        }));


        it('should correctly create the scope hierachy', inject(
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
          })
        );


        it('should allow more one new scope directives per element, but directives should share' +
            'the scope', inject(
          function($rootScope, $compile, log) {
            element = $compile('<div class="scope-a; scope-b"></div>')($rootScope);
            expect(log).toEqual('002; 002');
          })
        );

        it('should not allow more then one isolate scope creation per element', inject(
          function($rootScope, $compile) {
            expect(function(){
              $compile('<div class="iscope-a; scope-b"></div>');
            }).toThrow('Multiple directives [iscopeA, scopeB] asking for isolated scope on: ' +
                '<div class="iscope-a; scope-b ng-isolate-scope ng-scope">');
          })
        );


        it('should not allow more then one isolate scope creation per element', inject(
          function($rootScope, $compile) {
            expect(function(){
              $compile('<div class="iscope-a; iscope-b"></div>');
            }).toThrow('Multiple directives [iscopeA, iscopeB] asking for isolated scope on: ' +
                '<div class="iscope-a; iscope-b ng-isolate-scope ng-scope">');
          })
        );


        it('should create new scope even at the root of the template', inject(
          function($rootScope, $compile, log) {
            element = $compile('<div scope-a></div>')($rootScope);
            expect(log).toEqual('002');
          })
        );


        it('should create isolate scope even at the root of the template', inject(
          function($rootScope, $compile, log) {
            element = $compile('<div iscope></div>')($rootScope);
            expect(log).toEqual('002');
          })
        );
      });
    });
  });


  describe('interpolation', function() {
    var observeSpy, directiveAttrs;

    beforeEach(module(function() {
      directive('observer', function() {
        return function(scope, elm, attr) {
          directiveAttrs = attr;
          observeSpy = jasmine.createSpy('$observe attr');

          expect(attr.$observe('someAttr', observeSpy)).toBe(observeSpy);
        };
      });
    }));


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


    it('should observe interpolated attrs', inject(function($rootScope, $compile) {
      $compile('<div some-attr="{{value}}" observer></div>')($rootScope);

      // should be async
      expect(observeSpy).not.toHaveBeenCalled();

      $rootScope.$apply(function() {
        $rootScope.value = 'bound-value';
      });
      expect(observeSpy).toHaveBeenCalledOnceWith('bound-value');
    }));


    it('should set interpolated attrs to undefined', inject(function($rootScope, $compile) {
      $compile('<div some-attr="{{whatever}}" observer></div>')($rootScope);
      expect(directiveAttrs.someAttr).toBeUndefined();
    }));


    it('should call observer of non-interpolated attr through $evalAsync',
      inject(function($rootScope, $compile) {
        $compile('<div some-attr="nonBound" observer></div>')($rootScope);
        expect(directiveAttrs.someAttr).toBe('nonBound');

        expect(observeSpy).not.toHaveBeenCalled();
        $rootScope.$digest();
        expect(observeSpy).toHaveBeenCalled();
      })
    );


    it('should delegate exceptions to $exceptionHandler', function() {
      observeSpy = jasmine.createSpy('$observe attr').andThrow('ERROR');

      module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
        directive('error', function() {
          return function(scope, elm, attr) {
            attr.$observe('someAttr', observeSpy);
            attr.$observe('someAttr', observeSpy);
          };
        });
      });

      inject(function($compile, $rootScope, $exceptionHandler) {
        $compile('<div some-attr="{{value}}" error></div>')($rootScope);
        $rootScope.$digest();

        expect(observeSpy).toHaveBeenCalled();
        expect(observeSpy.callCount).toBe(2);
        expect($exceptionHandler.errors).toEqual(['ERROR', 'ERROR']);
      });
    });


    it('should translate {{}} in terminal nodes', inject(function($rootScope, $compile) {
      element = $compile('<select ng:model="x"><option value="">Greet {{name}}!</option></select>')($rootScope)
      $rootScope.$digest();
      expect(sortedHtml(element).replace(' selected="true"', '')).
        toEqual('<select ng:model="x">' +
                  '<option>Greet !</option>' +
                '</select>');
      $rootScope.name = 'Misko';
      $rootScope.$digest();
      expect(sortedHtml(element).replace(' selected="true"', '')).
        toEqual('<select ng:model="x">' +
                  '<option>Greet Misko!</option>' +
                '</select>');
    }));


    it('should support custom start/end interpolation symbols in template and directive template',
        function() {
      module(function($interpolateProvider, $compileProvider) {
        $interpolateProvider.startSymbol('##').endSymbol(']]');
        $compileProvider.directive('myDirective', function() {
          return {
            template: '<span>{{hello}}|{{hello|uppercase}}</span>'
          };
        });
      });

      inject(function($compile, $rootScope) {
        element = $compile('<div>##hello|uppercase]]|<div my-directive></div></div>')($rootScope);
        $rootScope.hello = 'ahoj';
        $rootScope.$digest();
        expect(element.text()).toBe('AHOJ|ahoj|AHOJ');
      });
    });


    it('should support custom start/end interpolation symbols in async directive template',
        function() {
      module(function($interpolateProvider, $compileProvider) {
        $interpolateProvider.startSymbol('##').endSymbol(']]');
        $compileProvider.directive('myDirective', function() {
          return {
            templateUrl: 'myDirective.html'
          };
        });
      });

      inject(function($compile, $rootScope, $templateCache) {
        $templateCache.put('myDirective.html', '<span>{{hello}}|{{hello|uppercase}}</span>');
        element = $compile('<div>##hello|uppercase]]|<div my-directive></div></div>')($rootScope);
        $rootScope.hello = 'ahoj';
        $rootScope.$digest();
        expect(element.text()).toBe('AHOJ|ahoj|AHOJ');
      });
    });
  });


  describe('link phase', function() {

    beforeEach(module(function() {

      forEach(['a', 'b', 'c'], function(name) {
        directive(name, function(log) {
          return {
            restrict: 'ECA',
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
      module(function() {
        directive('abc', valueFn({
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
      module(function() {
        directive({
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


    it('should read boolean attributes as boolean only on control elements', function() {
      var value;
      module(function() {
        directive({
          input: valueFn({
            restrict: 'ECA',
            link:function(scope, element, attr) {
              value = attr.required;
            }
          })
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile('<input required></input>')($rootScope);
        expect(value).toEqual(true);
      });
    });

    it('should read boolean attributes as text on non-controll elements', function() {
      var value;
      module(function() {
        directive({
          div: valueFn({
            restrict: 'ECA',
            link:function(scope, element, attr) {
              value = attr.required;
            }
          })
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile('<div required="some text"></div>')($rootScope);
        expect(value).toEqual('some text');
      });
    });

    it('should allow setting of attributes', function() {
      module(function() {
        directive({
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


    it('should create new instance of attr for each template stamping', function() {
      module(function($provide) {
        var state = { first: [], second: [] };
        $provide.value('state', state);
        directive({
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


    it('should properly $observe inside ng-repeat', function() {
      var spies = [];

      module(function() {
        directive('observer', function() {
          return function(scope, elm, attr) {
            spies.push(jasmine.createSpy('observer ' + spies.length));
            attr.$observe('some', spies[spies.length - 1]);
          };
        });
      });

      inject(function($compile, $rootScope) {
        element = $compile('<div><div ng-repeat="i in items">'+
                              '<span some="id_{{i.id}}" observer></span>'+
                           '</div></div>')($rootScope);

        $rootScope.$apply(function() {
          $rootScope.items = [{id: 1}, {id: 2}];
        });

        expect(spies[0]).toHaveBeenCalledOnceWith('id_1');
        expect(spies[1]).toHaveBeenCalledOnceWith('id_2');
        spies[0].reset();
        spies[1].reset();

        $rootScope.$apply(function() {
          $rootScope.items[0].id = 5;
        });

        expect(spies[0]).toHaveBeenCalledOnceWith('id_5');
      });
    });


    describe('$set', function() {
      var attr;
      beforeEach(function(){
        module(function() {
          directive('input', valueFn({
            restrict: 'ECA',
            link: function(scope, element, attr) {
              scope.attr = attr;
            }
          }));
        });
        inject(function($compile, $rootScope) {
          element = $compile('<input></input>')($rootScope);
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
        attr.$set('ngOther', '123', true, 'other');
        expect(element.attr('other')).toEqual('123');
        expect(attr.ngOther).toEqual('123');

        attr.$set('ngOther', '246');
        expect(element.attr('other')).toEqual('246');
        expect(attr.ngOther).toEqual('246');
      });


      it('should remove attribute', function() {
        attr.$set('ngMyAttr', 'value');
        expect(element.attr('ng-my-attr')).toEqual('value');

        attr.$set('ngMyAttr', undefined);
        expect(element.attr('ng-my-attr')).toBe(undefined);

        attr.$set('ngMyAttr', 'value');
        attr.$set('ngMyAttr', null);
        expect(element.attr('ng-my-attr')).toBe(undefined);
      });


      it('should not set DOM element attr if writeAttr false', function() {
        attr.$set('test', 'value', false);

        expect(element.attr('test')).toBeUndefined();
        expect(attr.test).toBe('value');
      });
    });
  });


  describe('isolated locals', function() {
    var componentScope;

    beforeEach(module(function() {
      directive('myComponent', function() {
        return {
          scope: {
            attr: '@',
            attrAlias: '@attr',
            ref: '=',
            refAlias: '= ref',
            reference: '=',
            expr: '&',
            exprAlias: '&expr'
          },
          link: function(scope) {
            componentScope = scope;
          }
        };
      });
      directive('badDeclaration', function() {
        return {
          scope: { attr: 'xxx' }
        };
      });
    }));

    describe('attribute', function() {
      it('should copy simple attribute', inject(function() {
        compile('<div><span my-component attr="some text">');
        expect(componentScope.attr).toEqual(undefined);
        expect(componentScope.attrAlias).toEqual(undefined);

        $rootScope.$apply();

        expect(componentScope.attr).toEqual('some text');
        expect(componentScope.attrAlias).toEqual('some text');
        expect(componentScope.attrAlias).toEqual(componentScope.attr);
      }));


      it('should update when interpolated attribute updates', inject(function() {
        compile('<div><span my-component attr="hello {{name}}">');
        expect(componentScope.attr).toEqual(undefined);
        expect(componentScope.attrAlias).toEqual(undefined);

        $rootScope.name = 'misko';
        $rootScope.$apply();

        expect(componentScope.attr).toEqual('hello misko');
        expect(componentScope.attrAlias).toEqual('hello misko');

        $rootScope.name = 'igor';
        $rootScope.$apply();

        expect(componentScope.attr).toEqual('hello igor');
        expect(componentScope.attrAlias).toEqual('hello igor');
      }));
    });


    describe('object reference', function() {
      it('should update local when origin changes', inject(function() {
        compile('<div><span my-component ref="name">');
        expect(componentScope.ref).toBe(undefined);
        expect(componentScope.refAlias).toBe(componentScope.ref);

        $rootScope.name = 'misko';
        $rootScope.$apply();
        expect(componentScope.ref).toBe($rootScope.name);
        expect(componentScope.refAlias).toBe($rootScope.name);

        $rootScope.name = {};
        $rootScope.$apply();
        expect(componentScope.ref).toBe($rootScope.name);
        expect(componentScope.refAlias).toBe($rootScope.name);
      }));


      it('should update local when origin changes', inject(function() {
        compile('<div><span my-component ref="name">');
        expect(componentScope.ref).toBe(undefined);
        expect(componentScope.refAlias).toBe(componentScope.ref);

        componentScope.ref = 'misko';
        $rootScope.$apply();
        expect($rootScope.name).toBe('misko');
        expect(componentScope.ref).toBe('misko');
        expect($rootScope.name).toBe(componentScope.ref);
        expect(componentScope.refAlias).toBe(componentScope.ref);

        componentScope.name = {};
        $rootScope.$apply();
        expect($rootScope.name).toBe(componentScope.ref);
        expect(componentScope.refAlias).toBe(componentScope.ref);
      }));


      it('should update local when both change', inject(function() {
        compile('<div><span my-component ref="name">');
        $rootScope.name = {mark:123};
        componentScope.ref = 'misko';

        $rootScope.$apply();
        expect($rootScope.name).toEqual({mark:123})
        expect(componentScope.ref).toBe($rootScope.name);
        expect(componentScope.refAlias).toBe($rootScope.name);

        $rootScope.name = 'igor';
        componentScope.ref = {};
        $rootScope.$apply();
        expect($rootScope.name).toEqual('igor')
        expect(componentScope.ref).toBe($rootScope.name);
        expect(componentScope.refAlias).toBe($rootScope.name);
      }));

      it('should complain on non assignable changes', inject(function() {
        compile('<div><span my-component ref="\'hello \' + name">');
        $rootScope.name = 'world';
        $rootScope.$apply();
        expect(componentScope.ref).toBe('hello world');

        componentScope.ref = 'ignore me';
        expect($rootScope.$apply).
            toThrow("Non-assignable model expression: 'hello ' + name (directive: myComponent)");
        expect(componentScope.ref).toBe('hello world');
        // reset since the exception was rethrown which prevented phase clearing
        $rootScope.$$phase = null;

        $rootScope.name = 'misko';
        $rootScope.$apply();
        expect(componentScope.ref).toBe('hello misko');
      }));

      // regression
      it('should stabilize model', inject(function() {
        compile('<div><span my-component reference="name">');

        var lastRefValueInParent;
        $rootScope.$watch('name', function(ref) {
          lastRefValueInParent = ref;
        });

        $rootScope.name = 'aaa';
        $rootScope.$apply();

        componentScope.reference = 'new';
        $rootScope.$apply();

        expect(lastRefValueInParent).toBe('new');
      }));
    });


    describe('executable expression', function() {
      it('should allow expression execution with locals', inject(function() {
        compile('<div><span my-component expr="count = count + offset">');
        $rootScope.count = 2;

        expect(typeof componentScope.expr).toBe('function');
        expect(typeof componentScope.exprAlias).toBe('function');

        expect(componentScope.expr({offset: 1})).toEqual(3);
        expect($rootScope.count).toEqual(3);

        expect(componentScope.exprAlias({offset: 10})).toEqual(13);
        expect($rootScope.count).toEqual(13);
      }));
    });

    it('should throw on unknown definition', inject(function() {
      expect(function() {
        compile('<div><span bad-declaration>');
      }).toThrow('Invalid isolate scope definition for directive badDeclaration: xxx');
    }));
  });


  describe('controller', function() {
    it('should get required controller', function() {
      module(function() {
        directive('main', function(log) {
          return {
            priority: 2,
            controller: function() {
              this.name = 'main';
            },
            link: function(scope, element, attrs, controller) {
              log(controller.name);
            }
          };
        });
        directive('dep', function(log) {
          return {
            priority: 1,
            require: 'main',
            link: function(scope, element, attrs, controller) {
              log('dep:' + controller.name);
            }
          };
        });
        directive('other', function(log) {
          return {
            link: function(scope, element, attrs, controller) {
              log(!!controller); // should be false
            }
          };
        });
      });
      inject(function(log, $compile, $rootScope) {
        element = $compile('<div main dep other></div>')($rootScope);
        expect(log).toEqual('main; dep:main; false');
      });
    });


    it('should require controller on parent element',function() {
      module(function() {
        directive('main', function(log) {
          return {
            controller: function() {
              this.name = 'main';
            }
          };
        });
        directive('dep', function(log) {
          return {
            require: '^main',
            link: function(scope, element, attrs, controller) {
              log('dep:' + controller.name);
            }
          };
        });
      });
      inject(function(log, $compile, $rootScope) {
        element = $compile('<div main><div dep></div></div>')($rootScope);
        expect(log).toEqual('dep:main');
      });
    });


    it('should have optional controller on current element', function() {
      module(function() {
        directive('dep', function(log) {
          return {
            require: '?main',
            link: function(scope, element, attrs, controller) {
              log('dep:' + !!controller);
            }
          };
        });
      });
      inject(function(log, $compile, $rootScope) {
        element = $compile('<div main><div dep></div></div>')($rootScope);
        expect(log).toEqual('dep:false');
      });
    });


    it('should support multiple controllers', function() {
      module(function() {
        directive('c1', valueFn({
          controller: function() { this.name = 'c1'; }
        }));
        directive('c2', valueFn({
          controller: function() { this.name = 'c2'; }
        }));
        directive('dep', function(log) {
          return {
            require: ['^c1', '^c2'],
            link: function(scope, element, attrs, controller) {
              log('dep:' + controller[0].name + '-' + controller[1].name);
            }
          };
        });
      });
      inject(function(log, $compile, $rootScope) {
        element = $compile('<div c1 c2><div dep></div></div>')($rootScope);
        expect(log).toEqual('dep:c1-c2');
      });
    });


    it('should instantiate the controller just once when template/templateUrl', function() {
      var syncCtrlSpy = jasmine.createSpy('sync controller'),
          asyncCtrlSpy = jasmine.createSpy('async controller');

      module(function() {
        directive('myDirectiveSync', valueFn({
          template: '<div>Hello!</div>',
          controller: syncCtrlSpy
        }));
        directive('myDirectiveAsync', valueFn({
          templateUrl: 'myDirectiveAsync.html',
          controller: asyncCtrlSpy,
          compile: function() {
            return function() {
            }
          }
        }));
      });

      inject(function($templateCache, $compile, $rootScope) {
        expect(syncCtrlSpy).not.toHaveBeenCalled();
        expect(asyncCtrlSpy).not.toHaveBeenCalled();

        $templateCache.put('myDirectiveAsync.html', '<div>Hello!</div>');
        element = $compile('<div>'+
                   '<span xmy-directive-sync></span>' +
                   '<span my-directive-async></span>' +
                 '</div>')($rootScope);
        expect(syncCtrlSpy).not.toHaveBeenCalled();
        expect(asyncCtrlSpy).not.toHaveBeenCalled();

        $rootScope.$apply();

        //expect(syncCtrlSpy).toHaveBeenCalledOnce();
        expect(asyncCtrlSpy).toHaveBeenCalledOnce();
      });
    });
  });


  describe('transclude', function() {
    it('should compile get templateFn', function() {
      module(function() {
        directive('trans', function(log) {
          return {
            transclude: 'element',
            priority: 2,
            controller: function($transclude) { this.$transclude = $transclude; },
            compile: function(element, attrs, template) {
              log('compile: ' + angular.mock.dump(element));
              return function(scope, element, attrs, ctrl) {
                log('link');
                var cursor = element;
                template(scope.$new(), function(clone) {cursor.after(cursor = clone)});
                ctrl.$transclude(function(clone) {cursor.after(clone)});
              };
            }
          }
        });
      });
      inject(function(log, $rootScope, $compile) {
        element = $compile('<div><div high-log trans="text" log>{{$parent.$id}}-{{$id}};</div></div>')
            ($rootScope);
        $rootScope.$apply();
        expect(log).toEqual('compile: <!-- trans: text -->; HIGH; link; LOG; LOG');
        expect(element.text()).toEqual('001-002;001-003;');
      });
    });


    it('should support transclude directive', function() {
      module(function() {
        directive('trans', function() {
          return {
            transclude: 'content',
            replace: true,
            scope: true,
            template: '<ul><li>W:{{$parent.$id}}-{{$id}};</li><li ng-transclude></li></ul>'
          }
        });
      });
      inject(function(log, $rootScope, $compile) {
        element = $compile('<div><div trans>T:{{$parent.$id}}-{{$id}}<span>;</span></div></div>')
            ($rootScope);
        $rootScope.$apply();
        expect(element.text()).toEqual('W:001-002;T:001-003;');
        expect(jqLite(element.find('span')[0]).text()).toEqual('T:001-003');
        expect(jqLite(element.find('span')[1]).text()).toEqual(';');
      });
    });


    it('should transclude transcluded content', function() {
      module(function() {
        directive('book', valueFn({
          transclude: 'content',
          template: '<div>book-<div chapter>(<div ng-transclude></div>)</div></div>'
        }));
        directive('chapter', valueFn({
          transclude: 'content',
          templateUrl: 'chapter.html'
        }));
        directive('section', valueFn({
          transclude: 'content',
          template: '<div>section-!<div ng-transclude></div>!</div></div>'
        }));
        return function($httpBackend) {
          $httpBackend.
              expect('GET', 'chapter.html').
              respond('<div>chapter-<div section>[<div ng-transclude></div>]</div></div>');
        }
      });
      inject(function(log, $rootScope, $compile, $httpBackend) {
        element = $compile('<div><div book>paragraph</div></div>')($rootScope);
        $rootScope.$apply();

        expect(element.text()).toEqual('book-');

        $httpBackend.flush();
        $rootScope.$apply();
        expect(element.text()).toEqual('book-chapter-section-![(paragraph)]!');
      });
    });


    it('should only allow one transclude per element', function() {
      module(function() {
        directive('first', valueFn({
          scope: {},
          restrict: 'CA',
          transclude: 'content'
        }));
        directive('second', valueFn({
          restrict: 'CA',
          transclude: 'content'
        }));
      });
      inject(function($compile) {
        expect(function() {
          $compile('<div class="first second"></div>');
        }).toThrow('Multiple directives [first, second] asking for transclusion on: ' +
            '<div class="first second ng-isolate-scope ng-scope">');
      });
    });


    it('should remove transclusion scope, when the DOM is destroyed', function() {
      module(function() {
        directive('box', valueFn({
          transclude: 'content',
          scope: { name: '=', show: '=' },
          template: '<div><h1>Hello: {{name}}!</h1><div ng-transclude></div></div>',
          link: function(scope, element) {
            scope.$watch(
                'show',
                function(show) {
                  if (!show) {
                    element.find('div').find('div').remove();
                  }
                }
            );
          }
        }));
      });
      inject(function($compile, $rootScope) {
        $rootScope.username = 'Misko';
        $rootScope.select = true;
        element = $compile(
            '<div><div box name="username" show="select">user: {{username}}</div></div>')
              ($rootScope);
        $rootScope.$apply();
        expect(element.text()).toEqual('Hello: Misko!user: Misko');

        var widgetScope = $rootScope.$$childHead;
        var transcludeScope = widgetScope.$$nextSibling;
        expect(widgetScope.name).toEqual('Misko');
        expect(widgetScope.$parent).toEqual($rootScope);
        expect(transcludeScope.$parent).toEqual($rootScope);

        $rootScope.select = false;
        $rootScope.$apply();
        expect(element.text()).toEqual('Hello: Misko!');
        expect(widgetScope.$$nextSibling).toEqual(null);
      });
    });


    it('should support transcluded element on root content', function() {
      var comment;
      module(function() {
        directive('transclude', valueFn({
          transclude: 'element',
          compile: function(element, attr, linker) {
            return function(scope, element, attr) {
              comment = element;
            };
          }
        }));
      });
      inject(function($compile, $rootScope) {
        var element = jqLite('<div>before<div transclude></div>after</div>').contents();
        expect(element.length).toEqual(3);
        expect(nodeName_(element[1])).toBe('DIV');
        $compile(element)($rootScope);
        expect(nodeName_(element[1])).toBe('#comment');
        expect(nodeName_(comment)).toBe('#comment');
      });
    });


    it('should safely create transclude comment node and not break with "-->"',
        inject(function($rootScope) {
      // see: https://github.com/angular/angular.js/issues/1740
      element = $compile('<ul><li ng-repeat="item in [\'-->\', \'x\']">{{item}}|</li></ul>')($rootScope);
      $rootScope.$digest();

      expect(element.text()).toBe('-->|x|');
    }));
  });
});
