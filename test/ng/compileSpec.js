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
        });
      });
      inject(function($compile, $rootScope, log) {
        element = $compile('<div></div>')($rootScope);
        expect(element.text()).toEqual('SUCCESS');
        expect(log).toEqual('OK');
      });
    });

    it('should allow registration of multiple directives with same name', function() {
      module(function() {
        directive('div', function(log) {
          return {
            restrict: 'ECA',
            link: {
              pre: log.fn('pre1'),
              post: log.fn('post1')
            }
          };
        });
        directive('div', function(log) {
          return {
            restrict: 'ECA',
            link: {
              pre: log.fn('pre2'),
              post: log.fn('post2')
            }
          };
        });
      });
      inject(function($compile, $rootScope, log) {
        element = $compile('<div></div>')($rootScope);
        expect(log).toEqual('pre1; pre2; post2; post1');
      });
    });

    it('should throw an exception if a directive is called "hasOwnProperty"', function() {
      module(function() {
        expect(function() {
          directive('hasOwnProperty', function() { });
        }).toThrowMinErr('ng','badname', "hasOwnProperty is not a valid directive name");
      });
      inject(function($compile) {});
    });
  });


  describe('compile phase', function() {

    it('should attach scope to the document node when it is compiled explicitly', inject(function($document){
      $compile($document)($rootScope);
      expect($document.scope()).toBe($rootScope);
    }));

    it('should wrap root text nodes in spans', inject(function($compile, $rootScope) {
      element = jqLite('<div>A&lt;a&gt;B&lt;/a&gt;C</div>');
      var text = element.contents();
      expect(text[0].nodeName).toEqual('#text');
      text = $compile(text)($rootScope);
      expect(text[0].nodeName).toEqual('SPAN');
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

    it('should not leak memory when there are top level empty text nodes', function() {
      var calcCacheSize = function() {
        var size = 0;
        forEach(jqLite.cache, function(item, key) { size++; });
        return size;
      };

      // We compile the contents of element (i.e. not element itself)
      // Then delete these contents and check the cache has been reset to zero

      // First with only elements at the top level
      element = jqLite('<div><div></div></div>');
      $compile(element.contents())($rootScope);
      element.empty();
      expect(calcCacheSize()).toEqual(0);

      // Next with non-empty text nodes at the top level
      // (in this case the compiler will wrap them in a <span>)
      element = jqLite('<div>xxx</div>');
      $compile(element.contents())($rootScope);
      element.empty();
      expect(calcCacheSize()).toEqual(0);

      // Next with comment nodes at the top level
      element = jqLite('<div><!-- comment --></div>');
      $compile(element.contents())($rootScope);
      element.empty();
      expect(calcCacheSize()).toEqual(0);

      // Finally with empty text nodes at the top level
      element = jqLite('<div>   \n<div></div>   </div>');
      $compile(element.contents())($rootScope);
      element.empty();
      expect(calcCacheSize()).toEqual(0);
    });


    it('should not blow up when elements with no childNodes property are compiled', inject(
        function($compile, $rootScope) {
      // it turns out that when a browser plugin is bound to an DOM element (typically <object>),
      // the plugin's context rather than the usual DOM apis are exposed on this element, so
      // childNodes might not exist.
      if (msie < 9) return;

      element = jqLite('<div>{{1+2}}</div>');

      try {
        element[0].childNodes[1] = {nodeType: 3, nodeName: 'OBJECT', textContent: 'fake node'};
      } catch(e) {
      } finally {
        if (!element[0].childNodes[1]) return; //browser doesn't support this kind of mocking
      }

      expect(element[0].childNodes[1].textContent).toBe('fake node');

      $compile(element)($rootScope);
      $rootScope.$apply();

      // object's children can't be compiled in this case, so we expect them to be raw
      expect(element.html()).toBe("3");
    }));


    describe('multiple directives per element', function() {
      it('should allow multiple directives per element', inject(function($compile, $rootScope, log){
        element = $compile(
          '<span greet="angular" log="L" x-high-log="H" data-medium-log="M"></span>')
          ($rootScope);
        expect(element.text()).toEqual('Hello angular');
        expect(log).toEqual('L; M; H');
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
                };
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
            forEach(parts, function(value){
              if (value.substring(0,2) !== 'ng') {
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


      it('should allow modifying the DOM structure in post link fn', function() {
        module(function() {
          directive('removeNode', valueFn({
            link: function($scope, $element) {
              $element.remove();
            }
          }));
        });
        inject(function($compile, $rootScope) {
          element = jqLite('<div><div remove-node></div><div>{{test}}</div></div>');
          $rootScope.test = 'Hello';
          $compile(element)($rootScope);
          $rootScope.$digest();
          expect(element.children().length).toBe(1);
          expect(element.text()).toBe('Hello');
        });
      });
    });

    describe('compiler control', function() {
      describe('priority', function() {
        it('should honor priority', inject(function($compile, $rootScope, log){
          element = $compile(
            '<span log="L" x-high-log="H" data-medium-log="M"></span>')
            ($rootScope);
          expect(log).toEqual('L; M; H');
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
          directive('nomerge', valueFn({
            restrict: 'CAM',
            replace: true,
            template: '<div class="log" id="myid" high-log>No Merge!</div>',
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
          directive('replaceWithInterpolatedStyle', valueFn({
            replace: true,
            template: '<div style="width:{{1+1}}px">Replace with interpolated style!</div>',
            compile: function(element, attr) {
              attr.$set('compiled', 'COMPILED');
              expect(element).toBe(attr.$$element);
            }
          }));
          directive('replaceWithTr', valueFn({
            replace: true,
            template: '<tr><td>TR</td></tr>'
          }));
          directive('replaceWithTd', valueFn({
            replace: true,
            template: '<td>TD</td>'
          }));
          directive('replaceWithTh', valueFn({
            replace: true,
            template: '<th>TH</th>'
          }));
          directive('replaceWithThead', valueFn({
            replace: true,
            template: '<thead><tr><td>TD</td></tr></thead>'
          }));
          directive('replaceWithTbody', valueFn({
            replace: true,
            template: '<tbody><tr><td>TD</td></tr></tbody>'
          }));
          directive('replaceWithTfoot', valueFn({
            replace: true,
            template: '<tfoot><tr><td>TD</td></tr></tfoot>'
          }));
          directive('replaceWithOption', valueFn({
            replace: true,
            template: '<option>OPTION</option>'
          }));
          directive('replaceWithOptgroup', valueFn({
            replace: true,
            template: '<optgroup>OPTGROUP</optgroup>'
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
          expect(log).toEqual('LOG; HIGH; MEDIUM');
        }));


        it('should compile template when appending', inject(function($compile, $rootScope, log) {
          element = $compile('<div><div append medium-log>ignore</div><div>')
            ($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('Append!');
          expect(log).toEqual('LOG; HIGH; MEDIUM');
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

        it('should not merge attributes if they are the same', inject(function($compile, $rootScope) {
          element = $compile(
            '<div><div nomerge class="medium-log" id="myid"></div><div>')
            ($rootScope);
          var div = element.find('div');
          expect(div.hasClass('medium-log')).toBe(true);
          expect(div.hasClass('log')).toBe(true);
          expect(div.attr('id')).toEqual('myid');
        }));

        it('should prevent multiple templates per element', inject(function($compile) {
          try {
            $compile('<div><span replace class="replace"></span></div>');
            this.fail(new Error('should have thrown Multiple directives error'));
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


        it('should handle interpolated css class from replacing directive', inject(
            function($compile, $rootScope) {
          element = $compile('<div replace-with-interpolated-class></div>')($rootScope);
          $rootScope.$digest();
          expect(element).toHaveClass('class_2');
        }));

        if (!msie || msie > 11) {
          // style interpolation not working on IE (including IE11).
          it('should handle interpolated css style from replacing directive', inject(
            function($compile, $rootScope) {
              element = $compile('<div replace-with-interpolated-style></div>')($rootScope);
              $rootScope.$digest();
              expect(element.css('width')).toBe('2px');
            }
          ));
        }

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
              };
            });
            directive('multiRootElem', function() {
              return {
                replace: true,
                template: '<div></div><div></div>'
              };
            });
            directive('singleRootWithWhiteSpace', function() {
              return {
                replace: true,
                template: '  <div></div> \n'
              };
            });
          });

          inject(function($compile) {
            expect(function() {
              $compile('<p no-root-elem></p>');
            }).toThrowMinErr("$compile", "tplrt", "Template for directive 'noRootElem' must have exactly one root element. ");

            expect(function() {
              $compile('<p multi-root-elem></p>');
            }).toThrowMinErr("$compile", "tplrt", "Template for directive 'multiRootElem' must have exactly one root element. ");

            // ws is ok
            expect(function() {
              $compile('<p single-root-with-white-space></p>');
            }).not.toThrow();
          });
        });

        it('should support templates with root <tr> tags', inject(function($compile, $rootScope) {
          expect(function() {
            element = $compile('<div replace-with-tr></div>')($rootScope);
          }).not.toThrow();
          expect(nodeName_(element)).toMatch(/tr/i);
        }));

        it('should support templates with root <td> tags', inject(function($compile, $rootScope) {
          expect(function() {
            element = $compile('<div replace-with-td></div>')($rootScope);
          }).not.toThrow();
          expect(nodeName_(element)).toMatch(/td/i);
        }));

        it('should support templates with root <th> tags', inject(function($compile, $rootScope) {
          expect(function() {
            element = $compile('<div replace-with-th></div>')($rootScope);
          }).not.toThrow();
          expect(nodeName_(element)).toMatch(/th/i);
        }));

        it('should support templates with root <thead> tags', inject(function($compile, $rootScope) {
          expect(function() {
            element = $compile('<div replace-with-thead></div>')($rootScope);
          }).not.toThrow();
          expect(nodeName_(element)).toMatch(/thead/i);
        }));

        it('should support templates with root <tbody> tags', inject(function($compile, $rootScope) {
          expect(function() {
            element = $compile('<div replace-with-tbody></div>')($rootScope);
          }).not.toThrow();
          expect(nodeName_(element)).toMatch(/tbody/i);
        }));

        it('should support templates with root <tfoot> tags', inject(function($compile, $rootScope) {
          expect(function() {
            element = $compile('<div replace-with-tfoot></div>')($rootScope);
          }).not.toThrow();
          expect(nodeName_(element)).toMatch(/tfoot/i);
        }));

        it('should support templates with root <option> tags', inject(function($compile, $rootScope) {
          expect(function() {
            element = $compile('<div replace-with-option></div>')($rootScope);
          }).not.toThrow();
          expect(nodeName_(element)).toMatch(/option/i);
        }));

        it('should support templates with root <optgroup> tags', inject(function($compile, $rootScope) {
          expect(function() {
            element = $compile('<div replace-with-optgroup></div>')($rootScope);
          }).not.toThrow();
          expect(nodeName_(element)).toMatch(/optgroup/i);
        }));
      });


      describe('template as function', function() {

        beforeEach(module(function() {
          directive('myDirective', valueFn({
            replace: true,
            template: function($element, $attrs) {
              expect($element.text()).toBe('original content');
              expect($attrs.myDirective).toBe('some value');
              return '<div id="templateContent">template content</div>';
            },
            compile: function($element, $attrs) {
              expect($element.text()).toBe('template content');
              expect($attrs.id).toBe('templateContent');
            }
          }));
        }));


        it('should evaluate `template` when defined as fn and use returned string as template', inject(
            function($compile, $rootScope) {
          element = $compile('<div my-directive="some value">original content<div>')($rootScope);
          expect(element.text()).toEqual('template content');
        }));
      });


      describe('templateUrl', function() {

        beforeEach(module(
          function() {
            directive('hello', valueFn({
              restrict: 'CAM',
              templateUrl: 'hello.html',
              transclude: true
            }));
            directive('cau', valueFn({
              restrict: 'CAM',
              templateUrl: 'cau.html'
            }));
            directive('crossDomainTemplate', valueFn({
              restrict: 'CAM',
              templateUrl: 'http://example.com/should-not-load.html'
            }));
            directive('trustedTemplate', function($sce) {
              return {
                restrict: 'CAM',
                templateUrl: function() {
                  return $sce.trustAsResourceUrl('http://example.com/trusted-template.html');
                }
              };
            });
            directive('cError', valueFn({
              restrict: 'CAM',
              templateUrl:'error.html',
              compile: function() {
                throw new Error('cError');
              }
            }));
            directive('lError', valueFn({
              restrict: 'CAM',
              templateUrl: 'error.html',
              compile: function() {
                throw new Error('lError');
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
                throw new Error('cError');
              }
            }));
            directive('iLError', valueFn({
              restrict: 'CAM',
              replace: true,
              templateUrl: 'error.html',
              compile: function() {
                throw new Error('lError');
              }
            }));

            directive('replace', valueFn({
              replace: true,
              template: '<span>Hello, {{name}}!</span>'
            }));

            directive('replaceWithTr', valueFn({
              replace: true,
              templateUrl: 'tr.html'
            }));
            directive('replaceWithTd', valueFn({
              replace: true,
              templateUrl: 'td.html'
            }));
            directive('replaceWithTh', valueFn({
              replace: true,
              templateUrl: 'th.html'
            }));
            directive('replaceWithThead', valueFn({
              replace: true,
              templateUrl: 'thead.html'
            }));
            directive('replaceWithTbody', valueFn({
              replace: true,
              templateUrl: 'tbody.html'
            }));
            directive('replaceWithTfoot', valueFn({
              replace: true,
              templateUrl: 'tfoot.html'
            }));
            directive('replaceWithOption', valueFn({
              replace: true,
              templateUrl: 'option.html'
            }));
            directive('replaceWithOptgroup', valueFn({
              replace: true,
              templateUrl: 'optgroup.html'
            }));
          }
        ));

        it('should not load cross domain templates by default', inject(
          function($compile, $rootScope, $templateCache, $sce) {
            expect(function() {
              $templateCache.put('http://example.com/should-not-load.html', 'Should not load even if in cache.');
              $compile('<div class="crossDomainTemplate"></div>')($rootScope);
            }).toThrowMinErr('$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example.com/should-not-load.html');
          }
        ));

        it('should load cross domain templates when trusted', inject(
          function($compile, $httpBackend, $rootScope, $sce) {
            $httpBackend.expect('GET', 'http://example.com/trusted-template.html').respond('<span>example.com/trusted_template_contents</span>');
            element = $compile('<div class="trustedTemplate"></div>')($rootScope);
            expect(sortedHtml(element)).
                toEqual('<div class="trustedTemplate"></div>');
            $httpBackend.flush();
            expect(sortedHtml(element)).
                toEqual('<div class="trustedTemplate"><span>example.com/trusted_template_contents</span></div>');
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


              expect(sortedHtml(element)).toBeOneOf(
                  '<div><b class="i-hello"></b><span class="i-cau">Cau!</span></div>',
                  '<div><b class="i-hello"></b><span class="i-cau" i-cau="">Cau!</span></div>' //ie8
              );

              $httpBackend.flush();
              expect(sortedHtml(element)).toBeOneOf(
                  '<div><span class="i-hello">Hello!</span><span class="i-cau">Cau!</span></div>',
                  '<div><span class="i-hello" i-hello="">Hello!</span><span class="i-cau" i-cau="">Cau!</span></div>' //ie8
              );
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

              expect(sortedHtml(element)).toBeOneOf(
                  '<div><span class="i-hello">Hello, Elvis!</span></div>',
                  '<div><span class="i-hello" i-hello="">Hello, Elvis!</span></div>' //ie8
              );
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

              expect(sortedHtml(element)).toBeOneOf(
                  '<div><span class="i-hello">Hello, Elvis!</span></div>',
                  '<div><span class="i-hello" i-hello="">Hello, Elvis!</span></div>' //ie8
              );
            }
        ));


        it('should compile template when replacing element in another template',
            inject(function($compile, $templateCache, $rootScope) {
          $templateCache.put('hello.html', '<div replace></div>');
          $rootScope.name = 'Elvis';
          element = $compile('<div><b class="hello"></b></div>')($rootScope);

          $rootScope.$digest();

          expect(sortedHtml(element)).
            toEqual('<div><b class="hello"><span replace="">Hello, Elvis!</span></b></div>');
        }));


        it('should compile template when replacing root element',
            inject(function($compile, $templateCache, $rootScope) {
              $rootScope.name = 'Elvis';
              element = $compile('<div replace></div>')($rootScope);

              $rootScope.$digest();

              expect(sortedHtml(element)).
                  toEqual('<span replace="">Hello, Elvis!</span>');
            }));


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

        it('should resolve widgets after cloning in append mode without $templateCache', function() {
          module(function($exceptionHandlerProvider) {
            $exceptionHandlerProvider.mode('log');
          });
          inject(function($compile, $templateCache, $rootScope, $httpBackend, $browser,
                          $exceptionHandler) {
            $httpBackend.expect('GET', 'cau.html').respond('<span>{{name}}</span>');
            $rootScope.name = 'Elvis';
            var template = $compile('<div class="cau"></div>');
            var e1;
            var e2;

            e1 = template($rootScope.$new(), noop); // clone
            expect(e1.text()).toEqual('');

            $httpBackend.flush();

            e2 = template($rootScope.$new(), noop); // clone
            $rootScope.$digest();
            expect(e1.text()).toEqual('Elvis');
            expect(e2.text()).toEqual('Elvis');

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

        it('should resolve widgets after cloning in inline mode without $templateCache', function() {
          module(function($exceptionHandlerProvider) {
            $exceptionHandlerProvider.mode('log');
          });
          inject(function($compile, $templateCache, $rootScope, $httpBackend, $browser,
                          $exceptionHandler) {
            $httpBackend.expect('GET', 'cau.html').respond('<span>{{name}}</span>');
            $rootScope.name = 'Elvis';
            var template = $compile('<div class="i-cau"></div>');
            var e1;
            var e2;

            e1 = template($rootScope.$new(), noop); // clone
            expect(e1.text()).toEqual('');

            $httpBackend.flush();

            e2 = template($rootScope.$new(), noop); // clone
            $rootScope.$digest();
            expect(e1.text()).toEqual('Elvis');
            expect(e2.text()).toEqual('Elvis');

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
              }).toThrowMinErr('$compile', 'tpload', 'Failed to load template: hello.html');
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
          inject(function($compile, $httpBackend){
            $httpBackend.whenGET('template.html').respond('<p>template.html</p>');
            expect(function() {
              $compile('<div><div class="sync async"></div></div>');
              $httpBackend.flush();
            }).toThrowMinErr('$compile', 'multidir', 'Multiple directives [async, sync] asking for template on: '+
                '<div class="sync async">');
          });
        });


        it('should copy classes from pre-template node into linked element', function() {
          module(function() {
            directive('test', valueFn({
              templateUrl: 'test.html',
              replace: true
            }));
          });
          inject(function($compile, $templateCache, $rootScope) {
            var child;
            $templateCache.put('test.html', '<p class="template-class">Hello</p>');
            element = $compile('<div test></div>')($rootScope, function(node) {
              node.addClass('clonefn-class');
            });
            $rootScope.$digest();
            expect(element).toHaveClass('template-class');
            expect(element).toHaveClass('clonefn-class');
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
                    return {
                      pre: function() { log(name + '-PreL'); },
                      post: function() { log(name + '-PostL'); }
                    };
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
              'first-PreL; second-PreL; last-PreL; third-PreL; ' +
              'third-PostL; last-PostL; second-PostL; first-PostL');

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
              'iFirst-PreL; iSecond-PreL; iThird-PreL; iLast-PreL; ' +
              'iLast-PostL; iThird-PostL; iSecond-PostL; iFirst-PostL');

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
              'first-PreL; second-PreL; last-PreL; third-PreL; ' +
              'third-PostL; last-PostL; second-PostL; first-PostL');

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
              'iFirst-PreL; iSecond-PreL; iThird-PreL; iLast-PreL; ' +
              'iLast-PostL; iThird-PostL; iSecond-PostL; iFirst-PostL');

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


        it('should work when directive is in a repeater', inject(
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
              };
            });
          });

          inject(function($compile, $templateCache, $rootScope, $exceptionHandler) {
            // no root element
            $templateCache.put('template.html', 'dada');
            $compile('<p template></p>');
            $rootScope.$digest();
            expect($exceptionHandler.errors.pop().message).
                toMatch(/\[\$compile:tplrt\] Template for directive 'template' must have exactly one root element\. template\.html/);

            // multi root
            $templateCache.put('template.html', '<div></div><div></div>');
            $compile('<p template></p>');
            $rootScope.$digest();
            expect($exceptionHandler.errors.pop().message).
                toMatch(/\[\$compile:tplrt\] Template for directive 'template' must have exactly one root element\. template\.html/);

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


        it('should support templateUrl with replace', function() {
          // a regression https://github.com/angular/angular.js/issues/3792
          module(function($compileProvider) {
            $compileProvider.directive('simple', function() {
              return {
                templateUrl: '/some.html',
                replace: true
              };
            });
          });

          inject(function($templateCache, $rootScope, $compile) {
            $templateCache.put('/some.html',
              '<div ng-switch="i">' +
                '<div ng-switch-when="1">i = 1</div>' +
                '<div ng-switch-default>I dont know what `i` is.</div>' +
              '</div>');

            element = $compile('<div simple></div>')($rootScope);

            $rootScope.$apply(function() {
              $rootScope.i = 1;
            });

            expect(element.html()).toContain('i = 1');
          });
        });

        it('should support templates with root <tr> tags', inject(function($compile, $rootScope, $templateCache) {
          $templateCache.put('tr.html', '<tr><td>TR</td></tr>');
          expect(function() {
            element = $compile('<div replace-with-tr></div>')($rootScope);
          }).not.toThrow();
          $rootScope.$digest();
          expect(nodeName_(element)).toMatch(/tr/i);
        }));

        it('should support templates with root <td> tags', inject(function($compile, $rootScope, $templateCache) {
          $templateCache.put('td.html', '<td>TD</td>');
          expect(function() {
            element = $compile('<div replace-with-td></div>')($rootScope);
          }).not.toThrow();
          $rootScope.$digest();
          expect(nodeName_(element)).toMatch(/td/i);
        }));

        it('should support templates with root <th> tags', inject(function($compile, $rootScope, $templateCache) {
          $templateCache.put('th.html', '<th>TH</th>');
          expect(function() {
            element = $compile('<div replace-with-th></div>')($rootScope);
          }).not.toThrow();
          $rootScope.$digest();
          expect(nodeName_(element)).toMatch(/th/i);
        }));

        it('should support templates with root <thead> tags', inject(function($compile, $rootScope, $templateCache) {
          $templateCache.put('thead.html', '<thead><tr><td>TD</td></tr></thead>');
          expect(function() {
            element = $compile('<div replace-with-thead></div>')($rootScope);
          }).not.toThrow();
          $rootScope.$digest();
          expect(nodeName_(element)).toMatch(/thead/i);
        }));

        it('should support templates with root <tbody> tags', inject(function($compile, $rootScope, $templateCache) {
          $templateCache.put('tbody.html', '<tbody><tr><td>TD</td></tr></tbody>');
          expect(function() {
            element = $compile('<div replace-with-tbody></div>')($rootScope);
          }).not.toThrow();
          $rootScope.$digest();
          expect(nodeName_(element)).toMatch(/tbody/i);
        }));

        it('should support templates with root <tfoot> tags', inject(function($compile, $rootScope, $templateCache) {
          $templateCache.put('tfoot.html', '<tfoot><tr><td>TD</td></tr></tfoot>');
          expect(function() {
            element = $compile('<div replace-with-tfoot></div>')($rootScope);
          }).not.toThrow();
          $rootScope.$digest();
          expect(nodeName_(element)).toMatch(/tfoot/i);
        }));

        it('should support templates with root <option> tags', inject(function($compile, $rootScope, $templateCache) {
          $templateCache.put('option.html', '<option>OPTION</option>');
          expect(function() {
            element = $compile('<div replace-with-option></div>')($rootScope);
          }).not.toThrow();
          $rootScope.$digest();
          expect(nodeName_(element)).toMatch(/option/i);
        }));

        it('should support templates with root <optgroup> tags', inject(function($compile, $rootScope, $templateCache) {
          $templateCache.put('optgroup.html', '<optgroup>OPTGROUP</optgroup>');
          expect(function() {
            element = $compile('<div replace-with-optgroup></div>')($rootScope);
          }).not.toThrow();
          $rootScope.$digest();
          expect(nodeName_(element)).toMatch(/optgroup/i);
        }));
      });


      describe('templateUrl as function', function() {

        beforeEach(module(function() {
          directive('myDirective', valueFn({
            replace: true,
            templateUrl: function($element, $attrs) {
              expect($element.text()).toBe('original content');
              expect($attrs.myDirective).toBe('some value');
              return 'my-directive.html';
            },
            compile: function($element, $attrs) {
              expect($element.text()).toBe('template content');
              expect($attrs.id).toBe('templateContent');
            }
          }));
        }));


        it('should evaluate `templateUrl` when defined as fn and use returned value as url', inject(
            function($compile, $rootScope, $templateCache) {
          $templateCache.put('my-directive.html', '<div id="templateContent">template content</span>');
          element = $compile('<div my-directive="some value">original content<div>')($rootScope);
          expect(element.text()).toEqual('');

          $rootScope.$digest();

          expect(element.text()).toEqual('template content');
        }));
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
                  return {pre: function (scope, element) {
                    log(scope.$id);
                    expect(element.data('$scope')).toBe(scope);
                  }};
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
                    expect(element.data('$isolateScopeNoTemplate')).toBe(scope);
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
            directive('stscope' + uppercase(name), function(log) {
              return {
                scope: true,
                restrict: 'CA',
                template: '<span></span>',
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
                    expect(element.data('$isolateScope')).toBe(scope);
                  };
                }
              };
            });
            directive('stiscope' + uppercase(name), function(log) {
              return {
                scope: {},
                restrict: 'CA',
                template: '<span></span>',
                compile: function() {
                  return function (scope, element) {
                    iscope = scope;
                    log(scope.$id);
                    expect(element.data('$isolateScope')).toBe(scope);
                  };
                }
              };
            });
          });
          directive('log', function(log) {
            return {
              restrict: 'CA',
              link: {pre: function(scope) {
                log('log-' + scope.$id + '-' + (scope.$parent && scope.$parent.$id || 'no-parent'));
              }}
            };
          });
        }));


        it('should allow creation of new scopes', inject(function($rootScope, $compile, log) {
          element = $compile('<div><span scope><a log></a></span></div>')($rootScope);
          expect(log).toEqual('002; log-002-001; LOG');
          expect(element.find('span').hasClass('ng-scope')).toBe(true);
        }));


        it('should allow creation of new isolated scopes for directives', inject(
            function($rootScope, $compile, log) {
          element = $compile('<div><span iscope><a log></a></span></div>')($rootScope);
          expect(log).toEqual('log-001-no-parent; LOG; 002');
          $rootScope.name = 'abc';
          expect(iscope.$parent).toBe($rootScope);
          expect(iscope.name).toBeUndefined();
        }));


        it('should allow creation of new scopes for directives with templates', inject(
            function($rootScope, $compile, log, $httpBackend) {
          $httpBackend.expect('GET', 'tscope.html').respond('<a log>{{name}}; scopeId: {{$id}}</a>');
          element = $compile('<div><span tscope></span></div>')($rootScope);
          $httpBackend.flush();
          expect(log).toEqual('log-002-001; LOG; 002');
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
          expect(log).toEqual('log-002-001; LOG; 002');
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
          expect(log).toEqual('log-003-002; LOG; 003; log-005-004; LOG; 005; log-007-006; LOG; 007');
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
          expect(log).toEqual('log-002-001; LOG; 002');
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
            expect(log).toEqual('002; 003; log-003-002; LOG; log-002-001; LOG; 004; log-004-001; LOG');
          })
        );


        it('should allow more than one new scope directives per element, but directives should share' +
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
            }).toThrowMinErr('$compile', 'multidir', 'Multiple directives [iscopeA, scopeB] asking for new/isolated scope on: ' +
                '<div class="iscope-a; scope-b">');
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


        describe('scope()/isolate() scope getters', function() {

          describe('with no directives', function() {

            it('should return the scope of the parent node', inject(
              function($rootScope, $compile) {
                element = $compile('<div></div>')($rootScope);
                expect(element.scope()).toBe($rootScope);
              })
            );
          });


          describe('with new scope directives', function() {

            it('should return the new scope at the directive element', inject(
              function($rootScope, $compile) {
                element = $compile('<div scope></div>')($rootScope);
                expect(element.scope().$parent).toBe($rootScope);
              })
            );


            it('should return the new scope for children in the original template', inject(
              function($rootScope, $compile) {
                element = $compile('<div scope><a></a></div>')($rootScope);
                expect(element.find('a').scope().$parent).toBe($rootScope);
              })
            );


            it('should return the new scope for children in the directive template', inject(
              function($rootScope, $compile, $httpBackend) {
                $httpBackend.expect('GET', 'tscope.html').respond('<a></a>');
                element = $compile('<div tscope></div>')($rootScope);
                $httpBackend.flush();
                expect(element.find('a').scope().$parent).toBe($rootScope);
              })
            );

            it('should return the new scope for children in the directive sync template', inject(
              function($rootScope, $compile) {
                element = $compile('<div stscope></div>')($rootScope);
                expect(element.find('span').scope().$parent).toBe($rootScope);
              })
            );
          });


          describe('with isolate scope directives', function() {

            it('should return the root scope for directives at the root element', inject(
              function($rootScope, $compile) {
                element = $compile('<div iscope></div>')($rootScope);
                expect(element.scope()).toBe($rootScope);
              })
            );


            it('should return the non-isolate scope at the directive element', inject(
              function($rootScope, $compile) {
                var directiveElement;
                element = $compile('<div><div iscope></div></div>')($rootScope);
                directiveElement = element.children();
                expect(directiveElement.scope()).toBe($rootScope);
                expect(directiveElement.isolateScope().$parent).toBe($rootScope);
              })
            );


            it('should return the isolate scope for children in the original template', inject(
              function($rootScope, $compile) {
                element = $compile('<div iscope><a></a></div>')($rootScope);
                expect(element.find('a').scope()).toBe($rootScope); //xx
              })
            );


            it('should return the isolate scope for children in directive template', inject(
              function($rootScope, $compile, $httpBackend) {
                $httpBackend.expect('GET', 'tiscope.html').respond('<a></a>');
                element = $compile('<div tiscope></div>')($rootScope);
                expect(element.isolateScope()).toBeUndefined(); // this is the current behavior, not desired feature
                $httpBackend.flush();
                expect(element.find('a').scope()).toBe(element.isolateScope());
                expect(element.isolateScope()).not.toBe($rootScope);
              })
            );

            it('should return the isolate scope for children in directive sync template', inject(
              function($rootScope, $compile) {
                element = $compile('<div stiscope></div>')($rootScope);
                expect(element.find('span').scope()).toBe(element.isolateScope());
                expect(element.isolateScope()).not.toBe($rootScope);
              })
            );
          });


          describe('with isolate scope directives and directives that manually create a new scope', function() {

            it('should return the new scope at the directive element', inject(
              function($rootScope, $compile) {
                var directiveElement;
                element = $compile('<div><a ng-if="true" iscope></a></div>')($rootScope);
                $rootScope.$apply();
                directiveElement = element.find('a');
                expect(directiveElement.scope().$parent).toBe($rootScope);
                expect(directiveElement.scope()).not.toBe(directiveElement.isolateScope());
              })
            );


            it('should return the isolate scope for child elements', inject(
              function($rootScope, $compile, $httpBackend) {
                var directiveElement, child;
                $httpBackend.expect('GET', 'tiscope.html').respond('<span></span>');
                element = $compile('<div><a ng-if="true" tiscope></a></div>')($rootScope);
                $rootScope.$apply();
                $httpBackend.flush();
                directiveElement = element.find('a');
                child = directiveElement.find('span');
                expect(child.scope()).toBe(directiveElement.isolateScope());
              })
            );

            it('should return the isolate scope for child elements in directive sync template', inject(
              function($rootScope, $compile) {
                var directiveElement, child;
                element = $compile('<div><a ng-if="true" stiscope></a></div>')($rootScope);
                $rootScope.$apply();
                directiveElement = element.find('a');
                child = directiveElement.find('span');
                expect(child.scope()).toBe(directiveElement.isolateScope());
              })
            );
          });
        });
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
      directive('replaceSomeAttr', valueFn({
        compile: function(element, attr) {
          attr.$set('someAttr', 'bar-{{1+1}}');
          expect(element).toBe(attr.$$element);
        }
      }));
    }));


    it('should compile and link both attribute and text bindings', inject(
        function($rootScope, $compile) {
          $rootScope.name = 'angular';
          element = $compile('<div name="attr: {{name}}">text: {{name}}</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('text: angular');
          expect(element.attr('name')).toEqual('attr: angular');
        })
    );


    it('should process attribute interpolation in pre-linking phase at priority 100', function() {
      module(function() {
        directive('attrLog', function(log) {
          return {
            compile: function($element, $attrs) {
              log('compile=' + $attrs.myName);

              return {
                pre: function($scope, $element, $attrs) {
                  log('preLinkP0=' + $attrs.myName);
                },
                post: function($scope, $element, $attrs) {
                  log('postLink=' + $attrs.myName);
                }
              };
            }
          };
        });
      });
      module(function() {
        directive('attrLogHighPriority', function(log) {
          return {
            priority: 101,
            compile: function() {
              return {
                pre: function($scope, $element, $attrs) {
                  log('preLinkP101=' + $attrs.myName);
                }
              };
            }
          };
        });
      });
      inject(function($rootScope, $compile, log) {
        element = $compile('<div attr-log-high-priority attr-log my-name="{{name}}"></div>')($rootScope);
        $rootScope.name = 'angular';
        $rootScope.$apply();
        log('digest=' + element.attr('my-name'));
        expect(log).toEqual('compile={{name}}; preLinkP101={{name}}; preLinkP0=; postLink=; digest=angular');
      });
    });


    describe('SCE values', function() {
      it('should resolve compile and link both attribute and text bindings', inject(
          function($rootScope, $compile, $sce) {
            $rootScope.name = $sce.trustAsHtml('angular');
            element = $compile('<div name="attr: {{name}}">text: {{name}}</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toEqual('text: angular');
            expect(element.attr('name')).toEqual('attr: angular');
          }));
    });

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


    it('should set interpolated attrs to initial interpolation value', inject(function($rootScope, $compile) {
      $rootScope.whatever = 'test value';
      $compile('<div some-attr="{{whatever}}" observer></div>')($rootScope);
      expect(directiveAttrs.someAttr).toBe($rootScope.whatever);
    }));


    it('should allow directive to replace interpolated attributes before attr interpolation compilation', inject(
        function($compile, $rootScope) {
      element = $compile('<div some-attr="foo-{{1+1}}" replace-some-attr></div>')($rootScope);
      $rootScope.$digest();
      expect(element.attr('some-attr')).toEqual('bar-2');
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
      element = $compile('<select ng:model="x"><option value="">Greet {{name}}!</option></select>')($rootScope);
      $rootScope.$digest();
      expect(sortedHtml(element).replace(' selected="true"', '')).
        toEqual('<select ng:model="x">' +
                  '<option value="">Greet !</option>' +
                '</select>');
      $rootScope.name = 'Misko';
      $rootScope.$digest();
      expect(sortedHtml(element).replace(' selected="true"', '')).
        toEqual('<select ng:model="x">' +
                  '<option value="">Greet Misko!</option>' +
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


    it('should make attributes observable for terminal directives', function() {
      module(function() {
        directive('myAttr', function(log) {
          return {
            terminal: true,
            link: function(scope, element, attrs) {
              attrs.$observe('myAttr', function(val) {
                log(val);
              });
            }
          };
        });
      });

      inject(function($compile, $rootScope, log) {
        element = $compile('<div my-attr="{{myVal}}"></div>')($rootScope);
        expect(log).toEqual([]);

        $rootScope.myVal = 'carrot';
        $rootScope.$digest();

        expect(log).toEqual(['carrot']);
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
              log('t' + uppercase(name));
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
          expect(log).toEqual('tA; tB; tC; preA; preB; preC; postC; postB; postA');
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

    it('should support $observe inside link function on directive object', function() {
      module(function() {
        directive('testLink', valueFn({
          templateUrl: 'test-link.html',
          link: function(scope, element, attrs) {
            attrs.$observe( 'testLink', function ( val ) {
              scope.testAttr = val;
            });
          }
        }));
      });
      inject(function($compile, $rootScope, $templateCache) {
        $templateCache.put('test-link.html', '{{testAttr}}' );
        element = $compile('<div test-link="{{1+2}}"></div>')($rootScope);
        $rootScope.$apply();
        expect(element.text()).toBe('3');
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
              };
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
              };
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
    var componentScope, regularScope;

    beforeEach(module(function() {
      directive('myComponent', function() {
        return {
          scope: {
            attr: '@',
            attrAlias: '@attr',
            ref: '=',
            refAlias: '= ref',
            reference: '=',
            optref: '=?',
            optrefAlias: '=? optref',
            optreference: '=?',
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
      directive('storeScope', function() {
        return {
          link: function(scope) {
            regularScope = scope;
          }
        };
      });
    }));


    it('should give other directives the parent scope', inject(function($rootScope) {
      compile('<div><input type="text" my-component store-scope ng-model="value"></div>');
      $rootScope.$apply(function() {
        $rootScope.value = 'from-parent';
      });
      expect(element.find('input').val()).toBe('from-parent');
      expect(componentScope).not.toBe(regularScope);
      expect(componentScope.$parent).toBe(regularScope);
    }));


    it('should not give the isolate scope to other directive template', function() {
      module(function() {
        directive('otherTplDir', function() {
          return {
            template: 'value: {{value}}'
          };
        });
      });

      inject(function($rootScope) {
        compile('<div my-component other-tpl-dir>');

        $rootScope.$apply(function() {
          $rootScope.value = 'from-parent';
        });

        expect(element.html()).toBe('value: from-parent');
      });
    });


    it('should not give the isolate scope to other directive template (with templateUrl)', function() {
      module(function() {
        directive('otherTplDir', function() {
          return {
            templateUrl: 'other.html'
          };
        });
      });

      inject(function($rootScope, $templateCache) {
        $templateCache.put('other.html', 'value: {{value}}');
        compile('<div my-component other-tpl-dir>');

        $rootScope.$apply(function() {
          $rootScope.value = 'from-parent';
        });

        expect(element.html()).toBe('value: from-parent');
      });
    });


    it('should not give the isolate scope to regular child elements', function() {
      inject(function($rootScope) {
        compile('<div my-component>value: {{value}}</div>');

        $rootScope.$apply(function() {
          $rootScope.value = 'from-parent';
        });

        expect(element.html()).toBe('value: from-parent');
      });
    });


    it('should update parent scope when "="-bound NaN changes', inject(function($compile, $rootScope) {
      $rootScope.num = NaN;
      compile('<div my-component reference="num"></div>');
      var isolateScope = element.isolateScope();
      expect(isolateScope.reference).toBeNaN();

      isolateScope.$apply(function(scope) { scope.reference = 64; });
      expect($rootScope.num).toBe(64);
    }));


    it('should update isolate scope when "="-bound NaN changes', inject(function($compile, $rootScope) {
      $rootScope.num = NaN;
      compile('<div my-component reference="num"></div>');
      var isolateScope = element.isolateScope();
      expect(isolateScope.reference).toBeNaN();

      $rootScope.$apply(function(scope) { scope.num = 64; });
      expect(isolateScope.reference).toBe(64);
    }));


    describe('attribute', function() {
      it('should copy simple attribute', inject(function() {
        compile('<div><span my-component attr="some text">');

        expect(componentScope.attr).toEqual('some text');
        expect(componentScope.attrAlias).toEqual('some text');
        expect(componentScope.attrAlias).toEqual(componentScope.attr);
      }));

      it('should set up the interpolation before it reaches the link function', inject(function() {
        $rootScope.name = 'misko';
        compile('<div><span my-component attr="hello {{name}}">');
        expect(componentScope.attr).toEqual('hello misko');
        expect(componentScope.attrAlias).toEqual('hello misko');
      }));

      it('should update when interpolated attribute updates', inject(function() {
        compile('<div><span my-component attr="hello {{name}}">');

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

        expect($rootScope.name).toBe('misko');
        expect(componentScope.ref).toBe('misko');
        expect(componentScope.refAlias).toBe('misko');

        $rootScope.name = {};
        $rootScope.$apply();
        expect(componentScope.ref).toBe($rootScope.name);
        expect(componentScope.refAlias).toBe($rootScope.name);
      }));


      it('should update local when both change', inject(function() {
        compile('<div><span my-component ref="name">');
        $rootScope.name = {mark:123};
        componentScope.ref = 'misko';

        $rootScope.$apply();
        expect($rootScope.name).toEqual({mark:123});
        expect(componentScope.ref).toBe($rootScope.name);
        expect(componentScope.refAlias).toBe($rootScope.name);

        $rootScope.name = 'igor';
        componentScope.ref = {};
        $rootScope.$apply();
        expect($rootScope.name).toEqual('igor');
        expect(componentScope.ref).toBe($rootScope.name);
        expect(componentScope.refAlias).toBe($rootScope.name);
      }));

      it('should not break if local and origin both change to the same value', inject(function() {
        $rootScope.name = 'aaa';

        compile('<div><span my-component ref="name">');

        //change both sides to the same item withing the same digest cycle
        componentScope.ref = 'same';
        $rootScope.name = 'same';
        $rootScope.$apply();

        //change origin back to its previous value
        $rootScope.name = 'aaa';
        $rootScope.$apply();

        expect($rootScope.name).toBe('aaa');
        expect(componentScope.ref).toBe('aaa');
      }));

      it('should complain on non assignable changes', inject(function() {
        compile('<div><span my-component ref="\'hello \' + name">');
        $rootScope.name = 'world';
        $rootScope.$apply();
        expect(componentScope.ref).toBe('hello world');

        componentScope.ref = 'ignore me';
        expect($rootScope.$apply).
            toThrowMinErr("$compile", "nonassign", "Expression ''hello ' + name' used with directive 'myComponent' is non-assignable!");
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

      describe('literal objects', function() {
        it('should copy parent changes', inject(function() {
          compile('<div><span my-component reference="{name: name}">');

          $rootScope.name = 'a';
          $rootScope.$apply();
          expect(componentScope.reference).toEqual({name: 'a'});

          $rootScope.name = 'b';
          $rootScope.$apply();
          expect(componentScope.reference).toEqual({name: 'b'});
        }));

        it('should not change the component when parent does not change', inject(function() {
          compile('<div><span my-component reference="{name: name}">');

          $rootScope.name = 'a';
          $rootScope.$apply();
          var lastComponentValue = componentScope.reference;
          $rootScope.$apply();
          expect(componentScope.reference).toBe(lastComponentValue);
        }));

        it('should complain when the component changes', inject(function() {
          compile('<div><span my-component reference="{name: name}">');

          $rootScope.name = 'a';
          $rootScope.$apply();
          componentScope.reference = {name: 'b'};
          expect(function() {
            $rootScope.$apply();
          }).toThrowMinErr("$compile", "nonassign", "Expression '{name: name}' used with directive 'myComponent' is non-assignable!");

        }));

        it('should work for primitive literals', inject(function() {
          test('1', 1);
          test('null', null);
          test('undefined', undefined);
          test("'someString'", 'someString');


          function test(literalString, literalValue) {
            compile('<div><span my-component reference="'+literalString+'">');

            $rootScope.$apply();
            expect(componentScope.reference).toBe(literalValue);
            dealoc(element);

          }

        }));

      });

    });


    describe('optional object reference', function() {
      it('should update local when origin changes', inject(function() {
        compile('<div><span my-component optref="name">');
        expect(componentScope.optRef).toBe(undefined);
        expect(componentScope.optRefAlias).toBe(componentScope.optRef);

        $rootScope.name = 'misko';
        $rootScope.$apply();
        expect(componentScope.optref).toBe($rootScope.name);
        expect(componentScope.optrefAlias).toBe($rootScope.name);

        $rootScope.name = {};
        $rootScope.$apply();
        expect(componentScope.optref).toBe($rootScope.name);
        expect(componentScope.optrefAlias).toBe($rootScope.name);
      }));

      it('should not throw exception when reference does not exist', inject(function() {
        compile('<div><span my-component>');

        expect(componentScope.optref).toBe(undefined);
        expect(componentScope.optrefAlias).toBe(undefined);
        expect(componentScope.optreference).toBe(undefined);
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
      }).toThrowMinErr("$compile", "iscp", "Invalid isolate scope definition for directive 'badDeclaration'. Definition: {... attr: 'xxx' ...}");
    }));

    it('should expose a $$isolateBindings property onto the scope', inject(function() {
      compile('<div><span my-component>');

      expect(typeof componentScope.$$isolateBindings).toBe('object');

      expect(componentScope.$$isolateBindings.attr).toBe('@attr');
      expect(componentScope.$$isolateBindings.attrAlias).toBe('@attr');
      expect(componentScope.$$isolateBindings.ref).toBe('=ref');
      expect(componentScope.$$isolateBindings.refAlias).toBe('=ref');
      expect(componentScope.$$isolateBindings.reference).toBe('=reference');
      expect(componentScope.$$isolateBindings.expr).toBe('&expr');
      expect(componentScope.$$isolateBindings.exprAlias).toBe('&expr');

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
        expect(log).toEqual('false; dep:main; main');
      });
    });


    it('should get required controller via linkingFn (template)', function() {
      module(function() {
        directive('dirA', function() {
          return {
            controller: function() {
              this.name = 'dirA';
            }
          };
        });
        directive('dirB', function(log) {
          return {
            require: 'dirA',
            template: '<p>dirB</p>',
            link: function(scope, element, attrs, dirAController) {
              log('dirAController.name: ' + dirAController.name);
            }
          };
        });
      });
      inject(function(log, $compile, $rootScope) {
        element = $compile('<div dir-a dir-b></div>')($rootScope);
        expect(log).toEqual('dirAController.name: dirA');
      });
    });


    it('should get required controller via linkingFn (templateUrl)', function() {
      module(function() {
        directive('dirA', function() {
          return {
            controller: function() {
              this.name = 'dirA';
            }
          };
        });
        directive('dirB', function(log) {
          return {
            require: 'dirA',
            templateUrl: 'dirB.html',
            link: function(scope, element, attrs, dirAController) {
              log('dirAController.name: ' + dirAController.name);
            }
          };
        });
      });
      inject(function(log, $compile, $rootScope, $templateCache) {
        $templateCache.put('dirB.html', '<p>dirB</p>');
        element = $compile('<div dir-a dir-b></div>')($rootScope);
        $rootScope.$digest();
        expect(log).toEqual('dirAController.name: dirA');
      });
    });


    it('should require controller of an isolate directive from a non-isolate directive on the ' +
        'same element', function() {
      var IsolateController = function() {};
      var isolateDirControllerInNonIsolateDirective;

      module(function() {
        directive('isolate', function() {
          return {
            scope: {},
            controller: IsolateController
          };
        });
        directive('nonIsolate', function() {
          return {
            require: 'isolate',
            link: function(_, __, ___, isolateDirController) {
              isolateDirControllerInNonIsolateDirective = isolateDirController;
            }
          };
        });
      });

      inject(function($compile, $rootScope) {
        element = $compile('<div isolate non-isolate></div>')($rootScope);

        expect(isolateDirControllerInNonIsolateDirective).toBeDefined();
        expect(isolateDirControllerInNonIsolateDirective instanceof IsolateController).toBe(true);
      });
    });


    it('should give the isolate scope to the controller of another replaced directives in the template', function() {
      module(function() {
        directive('testDirective', function() {
          return {
            replace: true,
            restrict: 'E',
            scope: {},
            template: '<input type="checkbox" ng-model="model">'
          };
        });
      });

      inject(function($rootScope) {
        compile('<div><test-directive></test-directive></div>');

        element = element.children().eq(0);
        expect(element[0].checked).toBe(false);
        element.isolateScope().model = true;
        $rootScope.$digest();
        expect(element[0].checked).toBe(true);
      });
    });


    it('should share isolate scope with replaced directives (template)', function() {
      var normalScope;
      var isolateScope;

      module(function() {
        directive('isolate', function() {
          return {
            replace: true,
            scope: {},
            template: '<span ng-init="name=\'WORKS\'">{{name}}</span>',
            link: function(s) {
              isolateScope = s;
            }
          };
        });
        directive('nonIsolate', function() {
          return {
            link: function(s) {
              normalScope = s;
            }
          };
        });
      });

      inject(function($compile, $rootScope) {
        element = $compile('<div isolate non-isolate></div>')($rootScope);

        expect(normalScope).toBe($rootScope);
        expect(normalScope.name).toEqual(undefined);
        expect(isolateScope.name).toEqual('WORKS');
        $rootScope.$digest();
        expect(element.text()).toEqual('WORKS');
      });
    });


    it('should share isolate scope with replaced directives (templateUrl)', function() {
      var normalScope;
      var isolateScope;

      module(function() {
        directive('isolate', function() {
          return {
            replace: true,
            scope: {},
            templateUrl: 'main.html',
            link: function(s) {
              isolateScope = s;
            }
          };
        });
        directive('nonIsolate', function() {
          return {
            link: function(s) {
              normalScope = s;
            }
          };
        });
      });

      inject(function($compile, $rootScope, $templateCache) {
        $templateCache.put('main.html', '<span ng-init="name=\'WORKS\'">{{name}}</span>');
        element = $compile('<div isolate non-isolate></div>')($rootScope);
        $rootScope.$apply();

        expect(normalScope).toBe($rootScope);
        expect(normalScope.name).toEqual(undefined);
        expect(isolateScope.name).toEqual('WORKS');
        expect(element.text()).toEqual('WORKS');
      });
    });


    it('should not get confused about where to use isolate scope when a replaced directive is used multiple times',
        function() {

      module(function() {
        directive('isolate', function() {
          return {
            replace: true,
            scope: {},
            template: '<span scope-tester="replaced"><span scope-tester="inside"></span></span>'
          };
        });
        directive('scopeTester', function(log) {
          return {
            link: function($scope, $element) {
              log($element.attr('scope-tester') + '=' + ($scope.$root === $scope ? 'non-isolate' : 'isolate'));
            }
          };
        });
      });

      inject(function($compile, $rootScope, log) {
        element = $compile('<div>' +
                             '<div isolate scope-tester="outside"></div>' +
                             '<span scope-tester="sibling"></span>' +
                           '</div>')($rootScope);

        $rootScope.$digest();
        expect(log).toEqual('inside=isolate; ' +
                            'outside replaced=non-isolate; ' + // outside
                            'outside replaced=isolate; ' + // replaced
                            'sibling=non-isolate');
      });
    });


    it('should require controller of a non-isolate directive from an isolate directive on the ' +
       'same element', function() {
      var NonIsolateController = function() {};
      var nonIsolateDirControllerInIsolateDirective;

      module(function() {
        directive('isolate', function() {
          return {
            scope: {},
            require: 'nonIsolate',
            link: function(_, __, ___, nonIsolateDirController) {
              nonIsolateDirControllerInIsolateDirective = nonIsolateDirController;
            }
          };
        });
        directive('nonIsolate', function() {
          return {
            controller: NonIsolateController
          };
        });
      });

      inject(function($compile, $rootScope) {
        element = $compile('<div isolate non-isolate></div>')($rootScope);

        expect(nonIsolateDirControllerInIsolateDirective).toBeDefined();
        expect(nonIsolateDirControllerInIsolateDirective instanceof NonIsolateController).toBe(true);
      });
    });


    it('should support controllerAs', function() {
      module(function() {
        directive('main', function() {
          return {
            templateUrl: 'main.html',
            transclude: true,
            scope: {},
            controller: function() {
              this.name = 'lucas';
            },
            controllerAs: 'mainCtrl'
          };
        });
      });
      inject(function($templateCache, $compile, $rootScope) {
        $templateCache.put('main.html', '<span>template:{{mainCtrl.name}} <div ng-transclude></div></span>');
        element = $compile('<div main>transclude:{{mainCtrl.name}}</div>')($rootScope);
        $rootScope.$apply();
        expect(element.text()).toBe('template:lucas transclude:');
      });
    });


    it('should support controller alias', function() {
      module(function($controllerProvider) {
        $controllerProvider.register('MainCtrl', function() {
          this.name = 'lucas';
        });
        directive('main', function() {
          return {
            templateUrl: 'main.html',
            scope: {},
            controller: 'MainCtrl as mainCtrl'
          };
        });
      });
      inject(function($templateCache, $compile, $rootScope) {
        $templateCache.put('main.html', '<span>{{mainCtrl.name}}</span>');
        element = $compile('<div main></div>')($rootScope);
        $rootScope.$apply();
        expect(element.text()).toBe('lucas');
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


    it("should throw an error if required controller can't be found",function() {
      module(function() {
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
        expect(function() {
          $compile('<div main><div dep></div></div>')($rootScope);
        }).toThrowMinErr("$compile", "ctreq", "Controller 'main', required by directive 'dep', can't be found!");
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
            };
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



    it('should instantiate controllers in the parent->child order when transluction, templateUrl and replacement ' +
        'are in the mix', function() {
      // When a child controller is in the transclusion that replaces the parent element that has a directive with
      // a controller, we should ensure that we first instantiate the parent and only then stuff that comes from the
      // transclusion.
      //
      // The transclusion moves the child controller onto the same element as parent controller so both controllers are
      // on the same level.

      module(function() {
        directive('parentDirective', function() {
          return {
            transclude: true,
            replace: true,
            templateUrl: 'parentDirective.html',
            controller: function (log) { log('parentController'); }
          };
        });
        directive('childDirective', function() {
          return {
            require: '^parentDirective',
            templateUrl: 'childDirective.html',
            controller : function(log) { log('childController'); }
          };
        });
      });

      inject(function($templateCache, log, $compile, $rootScope) {
        $templateCache.put('parentDirective.html', '<div ng-transclude>parentTemplateText;</div>');
        $templateCache.put('childDirective.html', '<span>childTemplateText;</span>');

        element = $compile('<div parent-directive><div child-directive></div>childContentText;</div>')($rootScope);
        $rootScope.$apply();
        expect(log).toEqual('parentController; childController');
        expect(element.text()).toBe('childTemplateText;childContentText;');
      });
    });


    it('should instantiate the controller after the isolate scope bindings are initialized (with template)', function () {
      module(function () {
        var Ctrl = function ($scope, log) {
          log('myFoo=' + $scope.myFoo);
        };

        directive('myDirective', function () {
          return {
            scope: {
              myFoo: "="
            },
            template: '<p>Hello</p>',
            controller: Ctrl
          };
        });
      });

      inject(function ($templateCache, $compile, $rootScope, log) {
        $rootScope.foo = "bar";

        element = $compile('<div my-directive my-foo="foo"></div>')($rootScope);
        $rootScope.$apply();
        expect(log).toEqual('myFoo=bar');
      });
    });


    it('should instantiate the controller after the isolate scope bindings are initialized (with templateUrl)', function () {
      module(function () {
        var Ctrl = function ($scope, log) {
          log('myFoo=' + $scope.myFoo);
        };

        directive('myDirective', function () {
          return {
            scope: {
              myFoo: "="
            },
            templateUrl: 'hello.html',
            controller: Ctrl
          };
        });
      });

      inject(function ($templateCache, $compile, $rootScope, log) {
        $templateCache.put('hello.html', '<p>Hello</p>');
        $rootScope.foo = "bar";

        element = $compile('<div my-directive my-foo="foo"></div>')($rootScope);
        $rootScope.$apply();
        expect(log).toEqual('myFoo=bar');
      });
    });


    it('should instantiate controllers in the parent->child->baby order when nested transluction, templateUrl and ' +
        'replacement are in the mix', function() {
      // similar to the test above, except that we have one more layer of nesting and nested transclusion

      module(function() {
        directive('parentDirective', function() {
          return {
            transclude: true,
            replace: true,
            templateUrl: 'parentDirective.html',
            controller: function (log) { log('parentController'); }
          };
        });
        directive('childDirective', function() {
          return {
            require: '^parentDirective',
            transclude: true,
            replace: true,
            templateUrl: 'childDirective.html',
            controller : function(log) { log('childController'); }
          };
        });
        directive('babyDirective', function() {
          return {
            require: '^childDirective',
            templateUrl: 'babyDirective.html',
            controller : function(log) { log('babyController'); }
          };
        });
      });

      inject(function($templateCache, log, $compile, $rootScope) {
        $templateCache.put('parentDirective.html', '<div ng-transclude>parentTemplateText;</div>');
        $templateCache.put('childDirective.html', '<span ng-transclude>childTemplateText;</span>');
        $templateCache.put('babyDirective.html', '<span>babyTemplateText;</span>');

        element = $compile('<div parent-directive>' +
                             '<div child-directive>' +
                               'childContentText;' +
                               '<div baby-directive>babyContent;</div>' +
                              '</div>' +
                            '</div>')($rootScope);
        $rootScope.$apply();
        expect(log).toEqual('parentController; childController; babyController');
        expect(element.text()).toBe('childContentText;babyTemplateText;');
      });
    });


    it('should allow controller usage in pre-link directive functions with templateUrl', function () {
      module(function () {
        var Ctrl = function (log) {
          log('instance');
        };

        directive('myDirective', function () {
          return {
            scope: true,
            templateUrl: 'hello.html',
            controller: Ctrl,
            compile: function () {
              return {
                pre: function (scope, template, attr, ctrl) {},
                post: function () {}
              };
            }
          };
        });
      });

      inject(function ($templateCache, $compile, $rootScope, log) {
        $templateCache.put('hello.html', '<p>Hello</p>');

        element = $compile('<div my-directive></div>')($rootScope);
        $rootScope.$apply();

        expect(log).toEqual('instance');
        expect(element.text()).toBe('Hello');
      });
    });


    it('should allow controller usage in pre-link directive functions with a template', function () {
      module(function () {
        var Ctrl = function (log) {
          log('instance');
        };

        directive('myDirective', function () {
          return {
            scope: true,
            template: '<p>Hello</p>',
            controller: Ctrl,
            compile: function () {
              return {
                pre: function (scope, template, attr, ctrl) {},
                post: function () {}
              };
            }
          };
        });
      });

      inject(function ($templateCache, $compile, $rootScope, log) {
        element = $compile('<div my-directive></div>')($rootScope);
        $rootScope.$apply();

        expect(log).toEqual('instance');
        expect(element.text()).toBe('Hello');
      });
    });


    it('should throw ctreq with correct directive name, regardless of order', function() {
      module(function($compileProvider) {
        $compileProvider.directive('aDir', valueFn({
          restrict: "E",
          require: "ngModel",
          link: noop
        }));
      });
      inject(function($compile, $rootScope) {
        expect(function() {
          // a-dir will cause a ctreq error to be thrown. Previously, the error would reference
          // the last directive in the chain (which in this case would be ngClick), based on
          // priority and alphabetical ordering. This test verifies that the ordering does not
          // affect which directive is referenced in the minErr message.
          element = $compile('<a-dir ng-click="foo=bar"></a-dir>')($rootScope);
        }).toThrowMinErr('$compile', 'ctreq',
            "Controller 'ngModel', required by directive 'aDir', can't be found!");
      });
    });
  });


  describe('transclude', function() {

    describe('content transclusion', function() {

      it('should support transclude directive', function() {
        module(function() {
          directive('trans', function() {
            return {
              transclude: 'content',
              replace: true,
              scope: true,
              template: '<ul><li>W:{{$parent.$id}}-{{$id}};</li><li ng-transclude></li></ul>'
            };
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
          };
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


      it('should only allow one content transclusion per element', function() {
        module(function() {
          directive('first', valueFn({
            transclude: true
          }));
          directive('second', valueFn({
            transclude: true
          }));
        });
        inject(function($compile) {
          expect(function() {
            $compile('<div first="" second=""></div>');
          }).toThrowMinErr('$compile', 'multidir', /Multiple directives \[first, second\] asking for transclusion on: <div .+/);
        });
      });


      it('should remove transclusion scope, when the DOM is destroyed', function() {
        module(function() {
          directive('box', valueFn({
            transclude: true,
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


      it('should add a $$transcluded property onto the transcluded scope', function() {
        module(function() {
          directive('trans', function() {
            return {
              transclude: true,
              replace: true,
              scope: true,
              template: '<div><span>I:{{$$transcluded}}</span><div ng-transclude></div></div>'
            };
          });
        });
        inject(function(log, $rootScope, $compile) {
          element = $compile('<div><div trans>T:{{$$transcluded}}</div></div>')
              ($rootScope);
          $rootScope.$apply();
          expect(jqLite(element.find('span')[0]).text()).toEqual('I:');
          expect(jqLite(element.find('span')[1]).text()).toEqual('T:true');
        });
      });


      it('should clear contents of the ng-translude element before appending transcluded content', function() {
        module(function() {
          directive('trans', function() {
            return {
              transclude: true,
              template: '<div ng-transclude>old stuff! </div>'
            };
          });
        });
        inject(function(log, $rootScope, $compile) {
          element = $compile('<div trans>unicorn!</div>')($rootScope);
          $rootScope.$apply();
          expect(sortedHtml(element.html())).toEqual('<div ng-transclude=""><span>unicorn!</span></div>');
        });
      });


      it('should throw on an ng-translude element inside no transclusion directive', function() {
        inject(function ($rootScope, $compile) {
          // we need to do this because different browsers print empty attributres differently
          try {
            $compile('<div><div ng-transclude></div></div>')($rootScope);
          } catch(e) {
            expect(e.message).toMatch(new RegExp(
                '^\\[ngTransclude:orphan\\] ' +
                    'Illegal use of ngTransclude directive in the template! ' +
                    'No parent directive that requires a transclusion found\\. ' +
                    'Element: <div ng-transclude.+'));
          }
        });
      });


      it('should not pass transclusion into a template directive when the directive didn\'t request transclusion', function() {

        module(function($compileProvider) {

          $compileProvider.directive('transFoo', valueFn({
            template: '<div>' +
              '<div no-trans-bar></div>' +
              '<div ng-transclude>this one should get replaced with content</div>' +
              '<div class="foo" ng-transclude></div>' +
            '</div>',
            transclude: true

          }));

          $compileProvider.directive('noTransBar', valueFn({
            template: '<div>' +
              // This ng-transclude is invalid. It should throw an error.
              '<div class="bar" ng-transclude></div>' +
            '</div>',
            transclude: false

          }));
        });

        inject(function($compile, $rootScope) {
          var message = 'Illegal use of ngTransclude directive in the template! No parent ' +
                        'directive that requires a transclusion found. Element: <div class="bar" ' +
                        'ng-transclude="">';
          if (msie <= 8) {
            // MSIE ヽ(｀Д´)ﾉ
            message = 'Illegal use of ngTransclude directive in the template! No parent ' +
                      'directive that requires a transclusion found. Element: <div class=bar ' +
                      'ng-transclude>';
          }
          expect(function() {
            $compile('<div trans-foo>content</div>')($rootScope);
          }).toThrowMinErr('ngTransclude', 'orphan', message);
        });
      });


      it('should not pass transclusion into a templateUrl directive', function() {

        module(function($compileProvider) {

          $compileProvider.directive('transFoo', valueFn({
            template: '<div>' +
              '<div no-trans-bar></div>' +
              '<div ng-transclude>this one should get replaced with content</div>' +
              '<div class="foo" ng-transclude></div>' +
            '</div>',
            transclude: true

          }));

          $compileProvider.directive('noTransBar', valueFn({
            templateUrl: 'noTransBar.html',
            transclude: false

          }));
        });

        inject(function($compile, $rootScope, $templateCache) {
          $templateCache.put('noTransBar.html',
            '<div>' +
              // This ng-transclude is invalid. It should throw an error.
              '<div class="bar" ng-transclude></div>' +
            '</div>');
          var message = 'Illegal use of ngTransclude directive in the template! No parent directive that '
                      + 'requires a transclusion found. Element: <div class="bar" ng-transclude="">';
          if (msie <= 8) {
            // MSIE ヽ(｀Д´)ﾉ
            message = 'Illegal use of ngTransclude directive in the template! No parent directive that '
                    + 'requires a transclusion found. Element: <div class=bar ng-transclude>';
          }
          expect(function() {
            element = $compile('<div trans-foo>content</div>')($rootScope);
            $rootScope.$apply();
          }).toThrowMinErr('ngTransclude', 'orphan', message);
        });
      });

      it('should make the result of a transclusion available to the parent directive in post-linking phase' +
          '(template)', function() {
        module(function() {
          directive('trans', function(log) {
            return {
              transclude: true,
              template: '<div ng-transclude></div>',
              link: {
                pre: function($scope, $element) {
                  log('pre(' + $element.text() + ')');
                },
                post: function($scope, $element) {
                  log('post(' + $element.text() + ')');
                }
              }
            };
          });
        });
        inject(function(log, $rootScope, $compile) {
          element = $compile('<div trans><span>unicorn!</span></div>')($rootScope);
          $rootScope.$apply();
          expect(log).toEqual('pre(); post(unicorn!)');
        });
      });


      it('should make the result of a transclusion available to the parent directive in post-linking phase' +
          '(templateUrl)', function() {
        // when compiling an async directive the transclusion is always processed before the directive
        // this is different compared to sync directive. delaying the transclusion makes little sense.

        module(function() {
          directive('trans', function(log) {
            return {
              transclude: true,
              templateUrl: 'trans.html',
              link: {
                pre: function($scope, $element) {
                  log('pre(' + $element.text() + ')');
                },
                post: function($scope, $element) {
                  log('post(' + $element.text() + ')');
                }
              }
            };
          });
        });
        inject(function(log, $rootScope, $compile, $templateCache) {
          $templateCache.put('trans.html', '<div ng-transclude></div>');

          element = $compile('<div trans><span>unicorn!</span></div>')($rootScope);
          $rootScope.$apply();
          expect(log).toEqual('pre(); post(unicorn!)');
        });
      });


      it('should make the result of a transclusion available to the parent *replace* directive in post-linking phase' +
          '(template)', function() {
        module(function() {
          directive('replacedTrans', function(log) {
            return {
              transclude: true,
              replace: true,
              template: '<div ng-transclude></div>',
              link: {
                pre: function($scope, $element) {
                  log('pre(' + $element.text() + ')');
                },
                post: function($scope, $element) {
                  log('post(' + $element.text() + ')');
                }
              }
            };
          });
        });
        inject(function(log, $rootScope, $compile) {
          element = $compile('<div replaced-trans><span>unicorn!</span></div>')($rootScope);
          $rootScope.$apply();
          expect(log).toEqual('pre(); post(unicorn!)');
        });
      });


      it('should make the result of a transclusion available to the parent *replace* directive in post-linking phase' +
          ' (templateUrl)', function() {
        module(function() {
          directive('replacedTrans', function(log) {
            return {
              transclude: true,
              replace: true,
              templateUrl: 'trans.html',
              link: {
                pre: function($scope, $element) {
                  log('pre(' + $element.text() + ')');
                },
                post: function($scope, $element) {
                  log('post(' + $element.text() + ')');
                }
              }
            };
          });
        });
        inject(function(log, $rootScope, $compile, $templateCache) {
          $templateCache.put('trans.html', '<div ng-transclude></div>');

          element = $compile('<div replaced-trans><span>unicorn!</span></div>')($rootScope);
          $rootScope.$apply();
          expect(log).toEqual('pre(); post(unicorn!)');
        });
      });

      it('should copy the directive controller to all clones', function() {
        var transcludeCtrl, cloneCount = 2;
        module(function() {
          directive('transclude', valueFn({
            transclude: 'content',
            controller: function($transclude) {
              transcludeCtrl = this;
            },
            link: function(scope, el, attr, ctrl, $transclude) {
              var i;
              for (i=0; i<cloneCount; i++) {
                $transclude(cloneAttach);
              }

              function cloneAttach(clone) {
                el.append(clone);
              }
            }
          }));
        });
        inject(function($compile) {
          element = $compile('<div transclude><span></span></div>')($rootScope);
          var children = element.children(), i;
          expect(transcludeCtrl).toBeDefined();

          expect(element.data('$transcludeController')).toBe(transcludeCtrl);
          for (i=0; i<cloneCount; i++) {
            expect(children.eq(i).data('$transcludeController')).toBeUndefined();
          }
        });
      });

      it('should provide the $transclude controller local as 5th argument to the pre and post-link function', function() {
        var ctrlTransclude, preLinkTransclude, postLinkTransclude;
        module(function() {
          directive('transclude', valueFn({
            transclude: 'content',
            controller: function($transclude) {
              ctrlTransclude = $transclude;
            },
            compile: function() {
              return {
                pre: function(scope, el, attr, ctrl, $transclude) {
                  preLinkTransclude = $transclude;
                },
                post: function(scope, el, attr, ctrl, $transclude) {
                  postLinkTransclude = $transclude;
                }
              };
            }
          }));
        });
        inject(function($compile) {
          element = $compile('<div transclude></div>')($rootScope);
          expect(ctrlTransclude).toBeDefined();
          expect(ctrlTransclude).toBe(preLinkTransclude);
          expect(ctrlTransclude).toBe(postLinkTransclude);
        });
      });

      it('should allow an optional scope argument in $transclude', function() {
        var capturedChildCtrl;
        module(function() {
          directive('transclude', valueFn({
            transclude: 'content',
            link: function(scope, element, attr, ctrl, $transclude) {
              $transclude(scope, function(clone) {
                element.append(clone);
              });
            }
          }));
        });
        inject(function($compile) {
          element = $compile('<div transclude>{{$id}}</div>')($rootScope);
          $rootScope.$apply();
          expect(element.text()).toBe($rootScope.$id);
        });

      });

      it('should expose the directive controller to transcluded children', function() {
        var capturedChildCtrl;
        module(function() {
          directive('transclude', valueFn({
            transclude: 'content',
            controller: function() {
            },
            link: function(scope, element, attr, ctrl, $transclude) {
              $transclude(function(clone) {
                element.append(clone);
              });
            }
          }));
          directive('child', valueFn({
            require: '^transclude',
            link: function(scope, element, attr, ctrl) {
              capturedChildCtrl = ctrl;
            }
          }));
        });
        inject(function($compile) {
          element = $compile('<div transclude><div child></div></div>')($rootScope);
          expect(capturedChildCtrl).toBeTruthy();
        });

      });


      describe('nested transcludes', function() {

        beforeEach(module(function($compileProvider) {

          $compileProvider.directive('noop', valueFn({}));

          $compileProvider.directive('sync', valueFn({
            template: '<div ng-transclude></div>',
            transclude: true
          }));

          $compileProvider.directive('async', valueFn({
            templateUrl: 'async',
            transclude: true
          }));

          $compileProvider.directive('syncSync', valueFn({
            template: '<div noop><div sync><div ng-transclude></div></div></div>',
            transclude: true
          }));

          $compileProvider.directive('syncAsync', valueFn({
            template: '<div noop><div async><div ng-transclude></div></div></div>',
            transclude: true
          }));

          $compileProvider.directive('asyncSync', valueFn({
            templateUrl: 'asyncSync',
            transclude: true
          }));

          $compileProvider.directive('asyncAsync', valueFn({
            templateUrl: 'asyncAsync',
            transclude: true
          }));

        }));

        beforeEach(inject(function($templateCache) {
          $templateCache.put('async', '<div ng-transclude></div>');
          $templateCache.put('asyncSync', '<div noop><div sync><div ng-transclude></div></div></div>');
          $templateCache.put('asyncAsync', '<div noop><div async><div ng-transclude></div></div></div>');
        }));


        it('should allow nested transclude directives with sync template containing sync template', inject(function($compile, $rootScope) {
          element = $compile('<div sync-sync>transcluded content</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('transcluded content');
        }));

        it('should allow nested transclude directives with sync template containing async template', inject(function($compile, $rootScope) {
          element = $compile('<div sync-async>transcluded content</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('transcluded content');
        }));

        it('should allow nested transclude directives with async template containing sync template', inject(function($compile, $rootScope) {
          element = $compile('<div async-sync>transcluded content</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('transcluded content');
        }));

        it('should allow nested transclude directives with async template containing asynch template', inject(function($compile, $rootScope) {
          element = $compile('<div async-async>transcluded content</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('transcluded content');
        }));
      });


      describe('nested isolated scope transcludes', function() {
        beforeEach(module(function($compileProvider) {

          $compileProvider.directive('trans', valueFn({
            restrict: 'E',
            template: '<div ng-transclude></div>',
            transclude: true
          }));

          $compileProvider.directive('transAsync', valueFn({
            restrict: 'A',
            templateUrl: 'transAsync',
            transclude: true
          }));

          $compileProvider.directive('iso', valueFn({
            restrict: 'A',
            transclude: true,
            template: '<div trans><span ng-transclude></span></div>',
            scope: {}
          }));
          $compileProvider.directive('isoAsync1', valueFn({
            restrict: 'A',
            transclude: true,
            template: '<div trans-async><span ng-transclude></span></div>',
            scope: {}
          }));
          $compileProvider.directive('isoAsync2', valueFn({
            restrict: 'A',
            transclude: true,
            templateUrl: 'isoAsync',
            scope: {}
          }));
        }));

        beforeEach(inject(function($templateCache) {
          $templateCache.put('transAsync', '<div ng-transclude></div>');
          $templateCache.put('isoAsync', '<div trans-async><span ng-transclude></span></div>');
        }));


        it('should pass the outer scope to the transclude on the isolated template sync-sync', inject(function($compile, $rootScope) {

          $rootScope.val = 'transcluded content';
          element = $compile('<div iso><span ng-bind="val"></span></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('transcluded content');
        }));

        it('should pass the outer scope to the transclude on the isolated template async-sync', inject(function($compile, $rootScope) {

          $rootScope.val = 'transcluded content';
          element = $compile('<div iso-async1><span ng-bind="val"></span></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('transcluded content');
        }));

        it('should pass the outer scope to the transclude on the isolated template async-async', inject(function($compile, $rootScope) {

          $rootScope.val = 'transcluded content';
          element = $compile('<div iso-async2><span ng-bind="val"></span></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('transcluded content');
        }));

      });

      describe('multiple siblings receiving transclusion', function() {

        it("should only receive transclude from parent", function() {

          module(function($compileProvider) {

            $compileProvider.directive('myExample', valueFn({
              scope: {},
              link: function link(scope, element, attrs) {
                var foo = element[0].querySelector('.foo');
                scope.children = angular.element(foo).children().length;
              },
              template: '<div>' +
                '<div>myExample {{children}}!</div>' +
                '<div ng-if="children">has children</div>' +
                '<div class="foo" ng-transclude></div>' +
              '</div>',
              transclude: true

            }));

          });

          inject(function($compile, $rootScope) {
            var element = $compile('<div my-example></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toEqual('myExample 0!');
            dealoc(element);

            element = $compile('<div my-example><p></p></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toEqual('myExample 1!has children');
            dealoc(element);
          });
        });
      });
    });


    describe('element transclusion', function() {

      it('should support basic element transclusion', function() {
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
                  template(scope.$new(), function(clone) { cursor.after(cursor = clone); });
                  ctrl.$transclude(function(clone) { cursor.after(clone); });
                };
              }
            };
          });
        });
        inject(function(log, $rootScope, $compile) {
          element = $compile('<div><div high-log trans="text" log>{{$parent.$id}}-{{$id}};</div></div>')
              ($rootScope);
          $rootScope.$apply();
          expect(log).toEqual('compile: <!-- trans: text -->; link; LOG; LOG; HIGH');
          expect(element.text()).toEqual('001-002;001-003;');
        });
      });

      it('should only allow one element transclusion per element', function() {
        module(function() {
          directive('first', valueFn({
            transclude: 'element'
          }));
          directive('second', valueFn({
            transclude: 'element'
          }));
        });
        inject(function($compile) {
          expect(function() {
            $compile('<div first second></div>');
          }).toThrowMinErr('$compile', 'multidir', 'Multiple directives [first, second] asking for transclusion on: ' +
                  '<!-- first:  -->');
        });
      });


      it('should only allow one element transclusion per element when directives have different priorities', function() {
        // we restart compilation in this case and we need to remember the duplicates during the second compile
        // regression #3893
        module(function() {
          directive('first', valueFn({
            transclude: 'element',
            priority: 100
          }));
          directive('second', valueFn({
            transclude: 'element'
          }));
        });
        inject(function($compile) {
          expect(function() {
            $compile('<div first second></div>');
          }).toThrowMinErr('$compile', 'multidir', /Multiple directives \[first, second\] asking for transclusion on: <div .+/);
        });
      });


      it('should only allow one element transclusion per element when async replace directive is in the mix', function() {
        module(function() {
          directive('template', valueFn({
            templateUrl: 'template.html',
            replace: true
          }));
          directive('first', valueFn({
            transclude: 'element',
            priority: 100
          }));
          directive('second', valueFn({
            transclude: 'element'
          }));
        });
        inject(function($compile, $httpBackend) {
          $httpBackend.expectGET('template.html').respond('<p second>template.html</p>');
          $compile('<div template first></div>');
          expect(function() {
            $httpBackend.flush();
          }).toThrowMinErr('$compile', 'multidir', /Multiple directives \[first, second\] asking for transclusion on: <p .+/);
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


      it('should terminate compilation only for element trasclusion', function() {
        module(function() {
          directive('elementTrans', function(log) {
            return {
              transclude: 'element',
              priority: 50,
              compile: log.fn('compile:elementTrans')
            };
          });
          directive('regularTrans', function(log) {
            return {
              transclude: true,
              priority: 50,
              compile: log.fn('compile:regularTrans')
            };
          });
        });
        inject(function(log, $compile, $rootScope) {
          $compile('<div><div element-trans log="elem"></div><div regular-trans log="regular"></div></div>')($rootScope);
          expect(log).toEqual('compile:elementTrans; compile:regularTrans; regular');
        });
      });


      it('should instantiate high priority controllers only once, but low priority ones each time we transclude',
          function() {
        module(function() {
          directive('elementTrans', function(log) {
            return {
              transclude: 'element',
              priority: 50,
              controller: function($transclude, $element) {
                log('controller:elementTrans');
                $transclude(function(clone) {
                  $element.after(clone);
                });
                $transclude(function(clone) {
                  $element.after(clone);
                });
                $transclude(function(clone) {
                  $element.after(clone);
                });
              }
            };
          });
          directive('normalDir', function(log) {
            return {
              controller: function() {
                log('controller:normalDir');
              }
            };
          });
        });
        inject(function($compile, $rootScope, log) {
          element = $compile('<div><div element-trans normal-dir></div></div>')($rootScope);
          expect(log).toEqual([
            'controller:elementTrans',
            'controller:normalDir',
            'controller:normalDir',
            'controller:normalDir'
          ]);
        });
      });

      it('should allow to access $transclude in the same directive', function() {
        var _$transclude;
        module(function() {
          directive('transclude', valueFn({
            transclude: 'element',
            controller: function($transclude) {
              _$transclude = $transclude;
            }
          }));
        });
        inject(function($compile) {
          element = $compile('<div transclude></div>')($rootScope);
          expect(_$transclude).toBeDefined();
        });
      });

      it('should copy the directive controller to all clones', function() {
        var transcludeCtrl, cloneCount = 2;
        module(function() {
          directive('transclude', valueFn({
            transclude: 'element',
            controller: function() {
              transcludeCtrl = this;
            },
            link: function(scope, el, attr, ctrl, $transclude) {
              var i;
              for (i=0; i<cloneCount; i++) {
                $transclude(cloneAttach);
              }

              function cloneAttach(clone) {
                el.after(clone);
              }
            }
          }));
        });
        inject(function($compile) {
          element = $compile('<div><div transclude></div></div>')($rootScope);
          var children = element.children(), i;
          for (i=0; i<cloneCount; i++) {
            expect(children.eq(i).data('$transcludeController')).toBe(transcludeCtrl);
          }
        });
      });

      it('should expose the directive controller to transcluded children', function() {
        var capturedTranscludeCtrl;
        module(function() {
          directive('transclude', valueFn({
            transclude: 'element',
            controller: function() {
            },
            link: function(scope, element, attr, ctrl, $transclude) {
              $transclude(scope, function(clone) {
                element.after(clone);
              });
            }
          }));
          directive('child', valueFn({
            require: '^transclude',
            link: function(scope, element, attr, ctrl) {
              capturedTranscludeCtrl = ctrl;
            }
          }));
        });
        inject(function($compile) {
          element = $compile('<div transclude><div child></div></div>')($rootScope);
          expect(capturedTranscludeCtrl).toBeTruthy();
        });
      });

      it('should allow access to $transclude in a templateUrl directive', function() {
        var transclude;
        module(function() {
          directive('template', valueFn({
            templateUrl: 'template.html',
            replace: true
          }));
          directive('transclude', valueFn({
            transclude: 'content',
            controller: function($transclude) {
              transclude = $transclude;
            }
          }));
        });
        inject(function($compile, $httpBackend) {
          $httpBackend.expectGET('template.html').respond('<div transclude></div>');
          element = $compile('<div template></div>')($rootScope);
          $httpBackend.flush();
          expect(transclude).toBeDefined();
        });
      });

      // issue #6006
      it('should link directive with $element as a comment node', function() {
        module(function($provide) {
          directive('innerAgain', function(log) {
            return {
              transclude: 'element',
              link: function(scope, element, attr, controllers, transclude) {
                log('innerAgain:'+lowercase(nodeName_(element))+':'+trim(element[0].data));
                transclude(scope, function(clone) {
                  element.parent().append(clone);
                });
              }
            };
          });
          directive('inner', function(log) {
            return {
              replace: true,
              templateUrl: 'inner.html',
              link: function(scope, element) {
                log('inner:'+lowercase(nodeName_(element))+':'+trim(element[0].data));
              }
            };
          });
          directive('outer', function(log) {
            return {
              transclude: 'element',
              link: function(scope, element, attrs, controllers, transclude) {
                log('outer:'+lowercase(nodeName_(element))+':'+trim(element[0].data));
                transclude(scope, function(clone) {
                  element.parent().append(clone);
                });
              }
            };
          });
        });
        inject(function(log, $compile, $rootScope, $templateCache) {
          $templateCache.put('inner.html', '<div inner-again><p>Content</p></div>');
          element = $compile('<div><div outer><div inner></div></div></div>')($rootScope);
          $rootScope.$digest();
          var child = element.children();

          expect(log.toArray()).toEqual([
            "outer:#comment:outer:",
            "innerAgain:#comment:innerAgain:",
            "inner:#comment:innerAgain:"
          ]);
          expect(child.length).toBe(1);
          expect(child.contents().length).toBe(2);
          expect(lowercase(nodeName_(child.contents().eq(0)))).toBe('#comment');
          expect(lowercase(nodeName_(child.contents().eq(1)))).toBe('div');
        });
      });
    });

    it('should safely create transclude comment node and not break with "-->"',
        inject(function($rootScope) {
      // see: https://github.com/angular/angular.js/issues/1740
      element = $compile('<ul><li ng-repeat="item in [\'-->\', \'x\']">{{item}}|</li></ul>')($rootScope);
      $rootScope.$digest();

      expect(element.text()).toBe('-->|x|');
    }));


    // See https://github.com/angular/angular.js/issues/7183
    it("should pass transclusion through to template of a 'replace' directive", function() {
      module(function() {
        directive('transSync', function() {
          return {
            transclude: true,
            link: function(scope, element, attr, ctrl, transclude) {

              expect(transclude).toEqual(jasmine.any(Function));

              transclude(function(child) { element.append(child); });
            }
          };
        });

        directive('trans', function($timeout) {
          return {
            transclude: true,
            link: function(scope, element, attrs, ctrl, transclude) {

              // We use timeout here to simulate how ng-if works
              $timeout(function()  {
                transclude(function(child) { element.append(child); });
              });
            }
          };
        });

        directive('replaceWithTemplate', function() {
          return {
            templateUrl: "template.html",
            replace: true
          };
        });
      });

      inject(function($compile, $rootScope, $templateCache, $timeout) {

        $templateCache.put('template.html', '<div trans-sync>Content To Be Transcluded</div>');

        expect(function() {
          element = $compile('<div><div trans><div replace-with-template></div></div></div>')($rootScope);
          $timeout.flush();
        }).not.toThrow();

        expect(element.text()).toEqual('Content To Be Transcluded');
      });

    });
  });


  describe('img[src] sanitization', function() {

    it('should NOT require trusted values for img src', inject(function($rootScope, $compile, $sce) {
      element = $compile('<img src="{{testUrl}}"></img>')($rootScope);
      $rootScope.testUrl = 'http://example.com/image.png';
      $rootScope.$digest();
      expect(element.attr('src')).toEqual('http://example.com/image.png');
      // But it should accept trusted values anyway.
      $rootScope.testUrl = $sce.trustAsUrl('http://example.com/image2.png');
      $rootScope.$digest();
      expect(element.attr('src')).toEqual('http://example.com/image2.png');
    }));

    it('should not sanitize attributes other than src', inject(function($compile, $rootScope) {
      /* jshint scripturl:true */
      element = $compile('<img title="{{testUrl}}"></img>')($rootScope);
      $rootScope.testUrl = "javascript:doEvilStuff()";
      $rootScope.$apply();

      expect(element.attr('title')).toBe('javascript:doEvilStuff()');
    }));

    it('should use $$sanitizeUriProvider for reconfiguration of the src whitelist', function() {
      module(function($compileProvider, $$sanitizeUriProvider) {
        var newRe = /javascript:/,
          returnVal;
        expect($compileProvider.imgSrcSanitizationWhitelist()).toBe($$sanitizeUriProvider.imgSrcSanitizationWhitelist());

        returnVal = $compileProvider.imgSrcSanitizationWhitelist(newRe);
        expect(returnVal).toBe($compileProvider);
        expect($$sanitizeUriProvider.imgSrcSanitizationWhitelist()).toBe(newRe);
        expect($compileProvider.imgSrcSanitizationWhitelist()).toBe(newRe);
      });
      inject(function() {
        // needed to the module definition above is run...
      });
    });

    it('should use $$sanitizeUri', function() {
      var $$sanitizeUri = jasmine.createSpy('$$sanitizeUri');
      module(function($provide) {
        $provide.value('$$sanitizeUri', $$sanitizeUri);
      });
      inject(function($compile, $rootScope) {
        element = $compile('<img src="{{testUrl}}"></img>')($rootScope);
        $rootScope.testUrl = "someUrl";

        $$sanitizeUri.andReturn('someSanitizedUrl');
        $rootScope.$apply();
        expect(element.attr('src')).toBe('someSanitizedUrl');
        expect($$sanitizeUri).toHaveBeenCalledWith($rootScope.testUrl, true);
      });
    });
  });


  describe('a[href] sanitization', function() {

    it('should not sanitize href on elements other than anchor', inject(function($compile, $rootScope) {
      /* jshint scripturl:true */
      element = $compile('<div href="{{testUrl}}"></div>')($rootScope);
      $rootScope.testUrl = "javascript:doEvilStuff()";
      $rootScope.$apply();

      expect(element.attr('href')).toBe('javascript:doEvilStuff()');
    }));

    it('should not sanitize attributes other than href', inject(function($compile, $rootScope) {
      /* jshint scripturl:true */
      element = $compile('<a title="{{testUrl}}"></a>')($rootScope);
      $rootScope.testUrl = "javascript:doEvilStuff()";
      $rootScope.$apply();

      expect(element.attr('title')).toBe('javascript:doEvilStuff()');
    }));

    it('should use $$sanitizeUriProvider for reconfiguration of the href whitelist', function() {
      module(function($compileProvider, $$sanitizeUriProvider) {
        var newRe = /javascript:/,
          returnVal;
        expect($compileProvider.aHrefSanitizationWhitelist()).toBe($$sanitizeUriProvider.aHrefSanitizationWhitelist());

        returnVal = $compileProvider.aHrefSanitizationWhitelist(newRe);
        expect(returnVal).toBe($compileProvider);
        expect($$sanitizeUriProvider.aHrefSanitizationWhitelist()).toBe(newRe);
        expect($compileProvider.aHrefSanitizationWhitelist()).toBe(newRe);
      });
      inject(function() {
        // needed to the module definition above is run...
      });
    });

    it('should use $$sanitizeUri', function() {
      var $$sanitizeUri = jasmine.createSpy('$$sanitizeUri');
      module(function($provide) {
        $provide.value('$$sanitizeUri', $$sanitizeUri);
      });
      inject(function($compile, $rootScope) {
        element = $compile('<a href="{{testUrl}}"></a>')($rootScope);
        $rootScope.testUrl = "someUrl";

        $$sanitizeUri.andReturn('someSanitizedUrl');
        $rootScope.$apply();
        expect(element.attr('href')).toBe('someSanitizedUrl');
        expect($$sanitizeUri).toHaveBeenCalledWith($rootScope.testUrl, false);
      });
    });

  });

  describe('interpolation on HTML DOM event handler attributes onclick, onXYZ, formaction', function() {
    it('should disallow interpolation on onclick', inject(function($compile, $rootScope) {
      // All interpolations are disallowed.
      $rootScope.onClickJs = "";
      expect(function() {
          $compile('<button onclick="{{onClickJs}}"></script>')($rootScope);
        }).toThrowMinErr(
          "$compile", "nodomevents", "Interpolations for HTML DOM event attributes are disallowed.  " +
          "Please use the ng- versions (such as ng-click instead of onclick) instead.");
      expect(function() {
          $compile('<button ONCLICK="{{onClickJs}}"></script>')($rootScope);
        }).toThrowMinErr(
          "$compile", "nodomevents", "Interpolations for HTML DOM event attributes are disallowed.  " +
          "Please use the ng- versions (such as ng-click instead of onclick) instead.");
      expect(function() {
          $compile('<button ng-attr-onclick="{{onClickJs}}"></script>')($rootScope);
        }).toThrowMinErr(
          "$compile", "nodomevents", "Interpolations for HTML DOM event attributes are disallowed.  " +
          "Please use the ng- versions (such as ng-click instead of onclick) instead.");
    }));

    it('should pass through arbitrary values on onXYZ event attributes that contain a hyphen', inject(function($compile, $rootScope) {
      /* jshint scripturl:true */
      element = $compile('<button on-click="{{onClickJs}}"></script>')($rootScope);
      $rootScope.onClickJs = 'javascript:doSomething()';
      $rootScope.$apply();
      expect(element.attr('on-click')).toEqual('javascript:doSomething()');
    }));

    it('should pass through arbitrary values on "on" and "data-on" attributes', inject(function($compile, $rootScope) {
      element = $compile('<button data-on="{{dataOnVar}}"></script>')($rootScope);
      $rootScope.dataOnVar = 'data-on text';
      $rootScope.$apply();
      expect(element.attr('data-on')).toEqual('data-on text');

      element = $compile('<button on="{{onVar}}"></script>')($rootScope);
      $rootScope.onVar = 'on text';
      $rootScope.$apply();
      expect(element.attr('on')).toEqual('on text');
    }));
  });

  describe('iframe[src]', function() {
    it('should pass through src attributes for the same domain', inject(function($compile, $rootScope, $sce) {
      element = $compile('<iframe src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = "different_page";
      $rootScope.$apply();
      expect(element.attr('src')).toEqual('different_page');
    }));

    it('should clear out src attributes for a different domain', inject(function($compile, $rootScope, $sce) {
      element = $compile('<iframe src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = "http://a.different.domain.example.com";
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          "$interpolate", "interr", "Can't interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked " +
          "loading resource from url not allowed by $sceDelegate policy.  URL: " +
          "http://a.different.domain.example.com");
    }));

    it('should clear out JS src attributes', inject(function($compile, $rootScope, $sce) {
      /* jshint scripturl:true */
      element = $compile('<iframe src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = "javascript:alert(1);";
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          "$interpolate", "interr", "Can't interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked " +
          "loading resource from url not allowed by $sceDelegate policy.  URL: " +
          "javascript:alert(1);");
    }));

    it('should clear out non-resource_url src attributes', inject(function($compile, $rootScope, $sce) {
      /* jshint scripturl:true */
      element = $compile('<iframe src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = $sce.trustAsUrl("javascript:doTrustedStuff()");
      expect($rootScope.$apply).toThrowMinErr(
          "$interpolate", "interr", "Can't interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked " +
          "loading resource from url not allowed by $sceDelegate policy.  URL: javascript:doTrustedStuff()");
    }));

    it('should pass through $sce.trustAs() values in src attributes', inject(function($compile, $rootScope, $sce) {
      /* jshint scripturl:true */
      element = $compile('<iframe src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = $sce.trustAsResourceUrl("javascript:doTrustedStuff()");
      $rootScope.$apply();

      expect(element.attr('src')).toEqual('javascript:doTrustedStuff()');
    }));
  });

  describe('form[action]', function() {
    it('should pass through action attribute for the same domain', inject(function($compile, $rootScope, $sce) {
      element = $compile('<form action="{{testUrl}}"></form>')($rootScope);
      $rootScope.testUrl = "different_page";
      $rootScope.$apply();
      expect(element.attr('action')).toEqual('different_page');
    }));

    it('should clear out action attribute for a different domain', inject(function($compile, $rootScope, $sce) {
      element = $compile('<form action="{{testUrl}}"></form>')($rootScope);
      $rootScope.testUrl = "http://a.different.domain.example.com";
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          "$interpolate", "interr", "Can't interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked " +
          "loading resource from url not allowed by $sceDelegate policy.  URL: " +
          "http://a.different.domain.example.com");
    }));

    it('should clear out JS action attribute', inject(function($compile, $rootScope, $sce) {
      /* jshint scripturl:true */
      element = $compile('<form action="{{testUrl}}"></form>')($rootScope);
      $rootScope.testUrl = "javascript:alert(1);";
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          "$interpolate", "interr", "Can't interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked " +
          "loading resource from url not allowed by $sceDelegate policy.  URL: " +
          "javascript:alert(1);");
    }));

    it('should clear out non-resource_url action attribute', inject(function($compile, $rootScope, $sce) {
      /* jshint scripturl:true */
      element = $compile('<form action="{{testUrl}}"></form>')($rootScope);
      $rootScope.testUrl = $sce.trustAsUrl("javascript:doTrustedStuff()");
      expect($rootScope.$apply).toThrowMinErr(
          "$interpolate", "interr", "Can't interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked " +
          "loading resource from url not allowed by $sceDelegate policy.  URL: javascript:doTrustedStuff()");
    }));

    it('should pass through $sce.trustAs() values in action attribute', inject(function($compile, $rootScope, $sce) {
      /* jshint scripturl:true */
      element = $compile('<form action="{{testUrl}}"></form>')($rootScope);
      $rootScope.testUrl = $sce.trustAsResourceUrl("javascript:doTrustedStuff()");
      $rootScope.$apply();

      expect(element.attr('action')).toEqual('javascript:doTrustedStuff()');
    }));
  });

  if (!msie || msie >= 11) {
    describe('iframe[srcdoc]', function() {
      it('should NOT set iframe contents for untrusted values', inject(function($compile, $rootScope, $sce) {
        element = $compile('<iframe srcdoc="{{html}}"></iframe>')($rootScope);
        $rootScope.html = '<div onclick="">hello</div>';
        expect(function() { $rootScope.$digest(); }).toThrowMinErr('$interpolate', 'interr', new RegExp(
            /Can't interpolate: {{html}}\n/.source +
            /[^[]*\[\$sce:unsafe\] Attempting to use an unsafe value in a safe context./.source));
      }));

      it('should NOT set html for wrongly typed values', inject(function($rootScope, $compile, $sce) {
        element = $compile('<iframe srcdoc="{{html}}"></iframe>')($rootScope);
        $rootScope.html = $sce.trustAsCss('<div onclick="">hello</div>');
        expect(function() { $rootScope.$digest(); }).toThrowMinErr('$interpolate', 'interr', new RegExp(
            /Can't interpolate: {{html}}\n/.source +
            /[^[]*\[\$sce:unsafe\] Attempting to use an unsafe value in a safe context./.source));
      }));

      it('should set html for trusted values', inject(function($rootScope, $compile, $sce) {
        element = $compile('<iframe srcdoc="{{html}}"></iframe>')($rootScope);
        $rootScope.html = $sce.trustAsHtml('<div onclick="">hello</div>');
        $rootScope.$digest();
        expect(angular.lowercase(element.attr('srcdoc'))).toEqual('<div onclick="">hello</div>');
      }));
    });
  }

  describe('ngAttr* attribute binding', function() {

    it('should bind after digest but not before', inject(function($compile, $rootScope) {
      $rootScope.name = "Misko";
      element = $compile('<span ng-attr-test="{{name}}"></span>')($rootScope);
      expect(element.attr('test')).toBeUndefined();
      $rootScope.$digest();
      expect(element.attr('test')).toBe('Misko');
    }));

    it('should bind after digest but not before when after overridden attribute', inject(function($compile, $rootScope) {
      $rootScope.name = "Misko";
      element = $compile('<span test="123" ng-attr-test="{{name}}"></span>')($rootScope);
      expect(element.attr('test')).toBe('123');
      $rootScope.$digest();
      expect(element.attr('test')).toBe('Misko');
    }));

    it('should bind after digest but not before when before overridden attribute', inject(function($compile, $rootScope) {
      $rootScope.name = "Misko";
      element = $compile('<span ng-attr-test="{{name}}" test="123"></span>')($rootScope);
      expect(element.attr('test')).toBe('123');
      $rootScope.$digest();
      expect(element.attr('test')).toBe('Misko');
    }));


    describe('in directive', function() {
      beforeEach(module(function() {
        directive('syncTest', function(log) {
          return {
            link: {
              pre: function(s, e, attr) { log(attr.test); },
              post: function(s, e, attr) { log(attr.test); }
            }
          };
        });
        directive('asyncTest', function(log) {
          return {
            templateUrl: 'async.html',
            link: {
              pre: function(s, e, attr) { log(attr.test); },
              post: function(s, e, attr) { log(attr.test); }
            }
          };
        });
      }));

      beforeEach(inject(function($templateCache) {
        $templateCache.put('async.html', '<h1>Test</h1>');
      }));

      it('should provide post-digest value in synchronous directive link functions when after overridden attribute',
          inject(function(log, $rootScope, $compile) {
        $rootScope.test = "TEST";
        element = $compile('<div sync-test test="123" ng-attr-test="{{test}}"></div>')($rootScope);
        expect(element.attr('test')).toBe('123');
        expect(log.toArray()).toEqual(['TEST', 'TEST']);
      }));

      it('should provide post-digest value in synchronous directive link functions when before overridden attribute',
          inject(function(log, $rootScope, $compile) {
        $rootScope.test = "TEST";
        element = $compile('<div sync-test ng-attr-test="{{test}}" test="123"></div>')($rootScope);
        expect(element.attr('test')).toBe('123');
        expect(log.toArray()).toEqual(['TEST', 'TEST']);
      }));


      it('should provide post-digest value in asynchronous directive link functions when after overridden attribute',
          inject(function(log, $rootScope, $compile) {
        $rootScope.test = "TEST";
        element = $compile('<div async-test test="123" ng-attr-test="{{test}}"></div>')($rootScope);
        expect(element.attr('test')).toBe('123');
        $rootScope.$digest();
        expect(log.toArray()).toEqual(['TEST', 'TEST']);
      }));

      it('should provide post-digest value in asynchronous directive link functions when before overridden attribute',
          inject(function(log, $rootScope, $compile) {
        $rootScope.test = "TEST";
        element = $compile('<div async-test ng-attr-test="{{test}}" test="123"></div>')($rootScope);
        expect(element.attr('test')).toBe('123');
        $rootScope.$digest();
        expect(log.toArray()).toEqual(['TEST', 'TEST']);
      }));
    });

    it('should work with different prefixes', inject(function($compile, $rootScope) {
      $rootScope.name = "Misko";
      element = $compile('<span ng:attr:test="{{name}}" ng-Attr-test2="{{name}}" ng_Attr_test3="{{name}}"></span>')($rootScope);
      expect(element.attr('test')).toBeUndefined();
      expect(element.attr('test2')).toBeUndefined();
      expect(element.attr('test3')).toBeUndefined();
      $rootScope.$digest();
      expect(element.attr('test')).toBe('Misko');
      expect(element.attr('test2')).toBe('Misko');
      expect(element.attr('test3')).toBe('Misko');
    }));

    it('should work with the "href" attribute', inject(function($compile, $rootScope) {
      $rootScope.value = 'test';
      element = $compile('<a ng-attr-href="test/{{value}}"></a>')($rootScope);
      $rootScope.$digest();
      expect(element.attr('href')).toBe('test/test');
    }));

    it('should work if they are prefixed with x- or data-', inject(function($compile, $rootScope) {
      $rootScope.name = "Misko";
      element = $compile('<span data-ng-attr-test2="{{name}}" x-ng-attr-test3="{{name}}" data-ng:attr-test4="{{name}}"></span>')($rootScope);
      expect(element.attr('test2')).toBeUndefined();
      expect(element.attr('test3')).toBeUndefined();
      expect(element.attr('test4')).toBeUndefined();
      $rootScope.$digest();
      expect(element.attr('test2')).toBe('Misko');
      expect(element.attr('test3')).toBe('Misko');
      expect(element.attr('test4')).toBe('Misko');
    }));

    describe('when an attribute has a dash-separated name', function () {

      it('should work with different prefixes', inject(function($compile, $rootScope) {
        $rootScope.name = "JamieMason";
        element = $compile('<span ng:attr:dash-test="{{name}}" ng-Attr-dash-test2="{{name}}" ng_Attr_dash-test3="{{name}}"></span>')($rootScope);
        expect(element.attr('dash-test')).toBeUndefined();
        expect(element.attr('dash-test2')).toBeUndefined();
        expect(element.attr('dash-test3')).toBeUndefined();
        $rootScope.$digest();
        expect(element.attr('dash-test')).toBe('JamieMason');
        expect(element.attr('dash-test2')).toBe('JamieMason');
        expect(element.attr('dash-test3')).toBe('JamieMason');
      }));

      it('should work if they are prefixed with x- or data-', inject(function($compile, $rootScope) {
        $rootScope.name = "JamieMason";
        element = $compile('<span data-ng-attr-dash-test2="{{name}}" x-ng-attr-dash-test3="{{name}}" data-ng:attr-dash-test4="{{name}}"></span>')($rootScope);
        expect(element.attr('dash-test2')).toBeUndefined();
        expect(element.attr('dash-test3')).toBeUndefined();
        expect(element.attr('dash-test4')).toBeUndefined();
        $rootScope.$digest();
        expect(element.attr('dash-test2')).toBe('JamieMason');
        expect(element.attr('dash-test3')).toBe('JamieMason');
        expect(element.attr('dash-test4')).toBe('JamieMason');
      }));

    });

  });


  describe('multi-element directive', function() {
    it('should group on link function', inject(function($compile, $rootScope) {
      $rootScope.show = false;
      element = $compile(
          '<div>' +
              '<span ng-show-start="show"></span>' +
              '<span ng-show-end></span>' +
          '</div>')($rootScope);
      $rootScope.$digest();
      var spans = element.find('span');
      expect(spans.eq(0)).toBeHidden();
      expect(spans.eq(1)).toBeHidden();
    }));


    it('should group on compile function', inject(function($compile, $rootScope) {
      $rootScope.show = false;
      element = $compile(
          '<div>' +
              '<span ng-repeat-start="i in [1,2]">{{i}}A</span>' +
              '<span ng-repeat-end>{{i}}B;</span>' +
          '</div>')($rootScope);
      $rootScope.$digest();
      expect(element.text()).toEqual('1A1B;2A2B;');
    }));


    it('should support grouping over text nodes', inject(function($compile, $rootScope) {
      $rootScope.show = false;
      element = $compile(
          '<div>' +
              '<span ng-repeat-start="i in [1,2]">{{i}}A</span>' +
              ':' + // Important: proves that we can iterate over non-elements
              '<span ng-repeat-end>{{i}}B;</span>' +
          '</div>')($rootScope);
      $rootScope.$digest();
      expect(element.text()).toEqual('1A:1B;2A:2B;');
    }));


    it('should group on $root compile function', inject(function($compile, $rootScope) {
      $rootScope.show = false;
      element = $compile(
          '<div></div>' +
              '<span ng-repeat-start="i in [1,2]">{{i}}A</span>' +
              '<span ng-repeat-end>{{i}}B;</span>' +
          '<div></div>')($rootScope);
      $rootScope.$digest();
      element = jqLite(element[0].parentNode.childNodes); // reset because repeater is top level.
      expect(element.text()).toEqual('1A1B;2A2B;');
    }));


    it('should group on nested groups of same directive', inject(function($compile, $rootScope) {
      $rootScope.show = false;
      element = $compile(
          '<div></div>' +
              '<div ng-repeat-start="i in [1,2]">{{i}}A</div>' +
              '<span ng-bind-start="\'.\'"></span>' +
              '<span ng-bind-end></span>' +
              '<div ng-repeat-end>{{i}}B;</div>' +
          '<div></div>')($rootScope);
      $rootScope.$digest();
      element = jqLite(element[0].parentNode.childNodes); // reset because repeater is top level.
      expect(element.text()).toEqual('1A..1B;2A..2B;');
    }));


    it('should group on nested groups', inject(function($compile, $rootScope) {
      $rootScope.show = false;
      element = $compile(
          '<div></div>' +
              '<div ng-repeat-start="i in [1,2]">{{i}}(</div>' +
              '<span ng-repeat-start="j in [2,3]">{{j}}-</span>' +
              '<span ng-repeat-end>{{j}}</span>' +
              '<div ng-repeat-end>){{i}};</div>' +
          '<div></div>')($rootScope);
      $rootScope.$digest();
      element = jqLite(element[0].parentNode.childNodes); // reset because repeater is top level.
      expect(element.text()).toEqual('1(2-23-3)1;2(2-23-3)2;');
    }));


    it('should throw error if unterminated', function () {
      module(function($compileProvider) {
        $compileProvider.directive('foo', function() {
          return {
          };
        });
      });
      inject(function($compile, $rootScope) {
        expect(function() {
          element = $compile(
              '<div>' +
                '<span foo-start></span>' +
              '</div>');
        }).toThrowMinErr("$compile", "uterdir", "Unterminated attribute, found 'foo-start' but no matching 'foo-end' found.");
      });
    });


    it('should correctly collect ranges on multiple directives on a single element', function () {
      module(function($compileProvider) {
        $compileProvider.directive('emptyDirective', function() {
          return function (scope, element) {
            element.data('x', 'abc');
          };
        });
        $compileProvider.directive('rangeDirective', function() {
          return {
            link: function (scope) {
              scope.x = 'X';
              scope.y = 'Y';
            }
          };
        });
      });

      inject(function ($compile, $rootScope) {
        element = $compile(
          '<div>' +
            '<div range-directive-start empty-directive>{{x}}</div>' +
            '<div range-directive-end>{{y}}</div>' +
          '</div>'
        )($rootScope);

        $rootScope.$digest();
        expect(element.text()).toBe('XY');
        expect(angular.element(element[0].firstChild).data('x')).toBe('abc');
      });
    });


    it('should throw error if unterminated (containing termination as a child)', function () {
      module(function($compileProvider) {
        $compileProvider.directive('foo', function() {
          return {
          };
        });
      });
      inject(function($compile) {
        expect(function() {
          element = $compile(
              '<div>' +
                  '<span foo-start><span foo-end></span></span>' +
              '</div>');
        }).toThrowMinErr("$compile", "uterdir", "Unterminated attribute, found 'foo-start' but no matching 'foo-end' found.");
      });
    });


    it('should support data- and x- prefix', inject(function($compile, $rootScope) {
      $rootScope.show = false;
      element = $compile(
          '<div>' +
              '<span data-ng-show-start="show"></span>' +
              '<span data-ng-show-end></span>' +
              '<span x-ng-show-start="show"></span>' +
              '<span x-ng-show-end></span>' +
          '</div>')($rootScope);
      $rootScope.$digest();
      var spans = element.find('span');
      expect(spans.eq(0)).toBeHidden();
      expect(spans.eq(1)).toBeHidden();
      expect(spans.eq(2)).toBeHidden();
      expect(spans.eq(3)).toBeHidden();
    }));
  });

  describe('$animate animation hooks', function() {

    beforeEach(module('ngAnimateMock'));

    it('should automatically fire the addClass and removeClass animation hooks',
      inject(function($compile, $animate, $rootScope) {

        var data, element = jqLite('<div class="{{val1}} {{val2}} fire"></div>');
        $compile(element)($rootScope);

        $rootScope.$digest();

        expect(element.hasClass('fire')).toBe(true);

        $rootScope.val1 = 'ice';
        $rootScope.val2 = 'rice';
        $rootScope.$digest();

        data = $animate.queue.shift();
        expect(data.event).toBe('addClass');
        expect(data.args[1]).toBe('ice rice');

        expect(element.hasClass('ice')).toBe(true);
        expect(element.hasClass('rice')).toBe(true);
        expect(element.hasClass('fire')).toBe(true);

        $rootScope.val2 = 'dice';
        $rootScope.$digest();

        data = $animate.queue.shift();
        expect(data.event).toBe('setClass');
        expect(data.args[1]).toBe('dice');
        expect(data.args[2]).toBe('rice');

        expect(element.hasClass('ice')).toBe(true);
        expect(element.hasClass('dice')).toBe(true);
        expect(element.hasClass('fire')).toBe(true);

        $rootScope.val1 = '';
        $rootScope.val2 = '';
        $rootScope.$digest();

        data = $animate.queue.shift();
        expect(data.event).toBe('removeClass');
        expect(data.args[1]).toBe('ice dice');

        expect(element.hasClass('ice')).toBe(false);
        expect(element.hasClass('dice')).toBe(false);
        expect(element.hasClass('fire')).toBe(true);
      }));
  });
});
