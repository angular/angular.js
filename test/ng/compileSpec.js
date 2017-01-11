'use strict';

/* eslint-disable no-script-url */

describe('$compile', function() {
  var document = window.document;

  function isUnknownElement(el) {
    return !!el.toString().match(/Unknown/);
  }

  function isSVGElement(el) {
    return !!el.toString().match(/SVG/);
  }

  function isHTMLElement(el) {
    return !!el.toString().match(/HTML/);
  }

  function supportsMathML() {
    var d = document.createElement('div');
    d.innerHTML = '<math></math>';
    return !isUnknownElement(d.firstChild);
  }

  // IE9-11 do not support foreignObject in svg...
  function supportsForeignObject() {
    var d = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    return !!d.toString().match(/SVGForeignObject/);
  }

  function getChildScopes(scope) {
    var children = [];
    if (!scope.$$childHead) { return children; }
    var childScope = scope.$$childHead;
    do {
      children.push(childScope);
      children = children.concat(getChildScopes(childScope));
    } while ((childScope = childScope.$$nextSibling));
    return children;
  }

  var element, directive, $compile, $rootScope;

  beforeEach(module(provideLog, function($provide, $compileProvider) {
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
        element.text('Hello ' + attrs.greet);
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

    directive('svgContainer', function() {
      return {
        template: '<svg width="400" height="400" ng-transclude></svg>',
        replace: true,
        transclude: true
      };
    });

    directive('svgCustomTranscludeContainer', function() {
      return {
        template: '<svg width="400" height="400"></svg>',
        transclude: true,
        link: function(scope, element, attr, ctrls, $transclude) {
          var futureParent = element.children().eq(0);
          $transclude(function(clone) {
            futureParent.append(clone);
          }, futureParent);
        }
      };
    });

    directive('svgCircle', function() {
      return {
        template: '<circle cx="2" cy="2" r="1"></circle>',
        templateNamespace: 'svg',
        replace: true
      };
    });

    directive('myForeignObject', function() {
      return {
        template: '<foreignObject width="100" height="100" ng-transclude></foreignObject>',
        templateNamespace: 'svg',
        replace: true,
        transclude: true
      };
    });


    return function(_$compile_, _$rootScope_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    };
  }));

  function compile(html) {
    element = angular.element(html);
    $compile(element)($rootScope);
  }

  afterEach(function() {
    dealoc(element);
  });


  describe('configuration', function() {

    it('should allow aHrefSanitizationWhitelist to be configured', function() {
      module(function($compileProvider) {
        expect($compileProvider.aHrefSanitizationWhitelist()).toEqual(/^\s*(https?|ftp|mailto|tel|file):/); // the default
        $compileProvider.aHrefSanitizationWhitelist(/other/);
        expect($compileProvider.aHrefSanitizationWhitelist()).toEqual(/other/);
      });
      inject();
    });

    it('should allow debugInfoEnabled to be configured', function() {
      module(function($compileProvider) {
        expect($compileProvider.debugInfoEnabled()).toBe(true); // the default
        $compileProvider.debugInfoEnabled(false);
        expect($compileProvider.debugInfoEnabled()).toBe(false);
      });
      inject();
    });

    it('should allow preAssignBindingsEnabled to be configured', function() {
      module(function($compileProvider) {
        expect($compileProvider.preAssignBindingsEnabled()).toBe(false); // the default
        $compileProvider.preAssignBindingsEnabled(true);
        expect($compileProvider.preAssignBindingsEnabled()).toBe(true);
        $compileProvider.preAssignBindingsEnabled(false);
        expect($compileProvider.preAssignBindingsEnabled()).toBe(false);
      });
      inject();
    });

    it('should allow onChangesTtl to be configured', function() {
      module(function($compileProvider) {
        expect($compileProvider.onChangesTtl()).toBe(10); // the default
        $compileProvider.onChangesTtl(2);
        expect($compileProvider.onChangesTtl()).toBe(2);
      });
      inject();
    });

    it('should allow commentDirectivesEnabled to be configured', function() {
      module(function($compileProvider) {
        expect($compileProvider.commentDirectivesEnabled()).toBe(true); // the default
        $compileProvider.commentDirectivesEnabled(false);
        expect($compileProvider.commentDirectivesEnabled()).toBe(false);
      });
      inject();
    });

    it('should allow cssClassDirectivesEnabled to be configured', function() {
      module(function($compileProvider) {
        expect($compileProvider.cssClassDirectivesEnabled()).toBe(true); // the default
        $compileProvider.cssClassDirectivesEnabled(false);
        expect($compileProvider.cssClassDirectivesEnabled()).toBe(false);
      });
      inject();
    });

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
        }).toThrowMinErr('ng','badname', 'hasOwnProperty is not a valid directive name');
      });
      inject(function($compile) {});
    });

    it('should throw an exception if a directive name starts with a non-lowercase letter', function() {
      module(function() {
        expect(function() {
          directive('BadDirectiveName', function() { });
        }).toThrowMinErr('$compile','baddir', 'Directive/Component name \'BadDirectiveName\' is invalid. The first character must be a lowercase letter');
      });
      inject(function($compile) {});
    });

    it('should throw an exception if a directive name has leading or trailing whitespace', function() {
      module(function() {
        function assertLeadingOrTrailingWhitespaceInDirectiveName(name) {
          expect(function() {
            directive(name, function() { });
          }).toThrowMinErr(
            '$compile','baddir', 'Directive/Component name \'' + name + '\' is invalid. ' +
            'The name should not contain leading or trailing whitespaces');
        }
        assertLeadingOrTrailingWhitespaceInDirectiveName(' leadingWhitespaceDirectiveName');
        assertLeadingOrTrailingWhitespaceInDirectiveName('trailingWhitespaceDirectiveName ');
        assertLeadingOrTrailingWhitespaceInDirectiveName(' leadingAndTrailingWhitespaceDirectiveName ');
      });
      inject(function($compile) {});
    });

    it('should throw an exception if the directive name is not defined', function() {
      module(function() {
        expect(function() {
          directive();
        }).toThrowMinErr('ng','areq');
      });
      inject(function($compile) {});
    });

    it('should throw an exception if the directive factory is not defined', function() {
      module(function() {
        expect(function() {
          directive('myDir');
        }).toThrowMinErr('ng','areq');
      });
      inject(function($compile) {});
    });

    it('should preserve context within declaration', function() {
      module(function() {
        directive('ff', function(log) {
          var declaration = {
            restrict: 'E',
            template: function() {
              log('ff template: ' + (this === declaration));
            },
            compile: function() {
              log('ff compile: ' + (this === declaration));
              return function() {
                log('ff post: ' + (this === declaration));
              };
            }
          };
          return declaration;
        });

        directive('fff', function(log) {
          var declaration = {
            restrict: 'E',
            link: {
              pre: function() {
                log('fff pre: ' + (this === declaration));
              },
              post: function() {
                log('fff post: ' + (this === declaration));
              }
            }
          };
          return declaration;
        });

        directive('ffff', function(log) {
          var declaration = {
            restrict: 'E',
            compile: function() {
              return {
                pre: function() {
                  log('ffff pre: ' + (this === declaration));
                },
                post: function() {
                  log('ffff post: ' + (this === declaration));
                }
              };
            }
          };
          return declaration;
        });

        directive('fffff', function(log) {
          var declaration = {
            restrict: 'E',
            templateUrl: function() {
              log('fffff templateUrl: ' + (this === declaration));
              return 'fffff.html';
            },
            link: function() {
              log('fffff post: ' + (this === declaration));
            }
          };
          return declaration;
        });
      });

      inject(function($compile, $rootScope, $templateCache, log) {
        $templateCache.put('fffff.html', '');

        $compile('<ff></ff>')($rootScope);
        $compile('<fff></fff>')($rootScope);
        $compile('<ffff></ffff>')($rootScope);
        $compile('<fffff></fffff>')($rootScope);
        $rootScope.$digest();

        expect(log).toEqual(
          'ff template: true; ' +
          'ff compile: true; ' +
          'ff post: true; ' +
          'fff pre: true; ' +
          'fff post: true; ' +
          'ffff pre: true; ' +
          'ffff post: true; ' +
          'fffff templateUrl: true; ' +
          'fffff post: true'
        );
      });
    });
  });


  describe('svg namespace transcludes', function() {
    var ua = window.navigator.userAgent;
    var isEdge = /Edge/.test(ua);

    // this method assumes some sort of sized SVG element is being inspected.
    function assertIsValidSvgCircle(elem) {
      expect(isUnknownElement(elem)).toBe(false);
      expect(isSVGElement(elem)).toBe(true);
      var box = elem.getBoundingClientRect();
      expect(box.width === 0 && box.height === 0).toBe(false);
    }

    it('should handle transcluded svg elements', inject(function($compile) {
      element = jqLite('<div><svg-container>' +
          '<circle cx="4" cy="4" r="2"></circle>' +
          '</svg-container></div>');
      $compile(element.contents())($rootScope);
      document.body.appendChild(element[0]);

      var circle = element.find('circle');

      assertIsValidSvgCircle(circle[0]);
    }));

    it('should handle custom svg elements inside svg tag', inject(function() {
      element = jqLite('<div><svg width="300" height="300">' +
          '<svg-circle></svg-circle>' +
          '</svg></div>');
      $compile(element.contents())($rootScope);
      document.body.appendChild(element[0]);

      var circle = element.find('circle');
      assertIsValidSvgCircle(circle[0]);
    }));

    it('should handle transcluded custom svg elements', inject(function() {
      element = jqLite('<div><svg-container>' +
          '<svg-circle></svg-circle>' +
          '</svg-container></div>');
      $compile(element.contents())($rootScope);
      document.body.appendChild(element[0]);

      var circle = element.find('circle');
      assertIsValidSvgCircle(circle[0]);
    }));

    if (supportsForeignObject()) {
      // Supports: Chrome 53-57+
      // Since Chrome 53-57+, the reported size of `<foreignObject>` elements and their descendants
      // is affected by global display settings (e.g. font size) and browser settings (e.g. default
      // zoom level). In order to avoid false negatives, we compare against the size of the
      // equivalent, hand-written SVG instead of fixed widths/heights.
      var HAND_WRITTEN_SVG =
        '<svg width="400" height="400">' +
          '<foreignObject width="100" height="100">' +
            '<div style="position:absolute;width:20px;height:20px">test</div>' +
          '</foreignObject>' +
        '</svg>';

      it('should handle foreignObject', inject(function() {
        element = jqLite(
          '<div>' +
            // By hand (for reference)
            HAND_WRITTEN_SVG +
            // By directive
            '<svg-container>' +
              '<foreignObject width="100" height="100">' +
                '<div style="position:absolute;width:20px;height:20px">test</div>' +
              '</foreignObject>' +
            '</svg-container>' +
          '</div>');
        $compile(element.contents())($rootScope);
        document.body.appendChild(element[0]);

        var referenceElem = element.find('div')[0];
        var testElem = element.find('div')[1];
        var referenceBounds = referenceElem.getBoundingClientRect();
        var testBounds = testElem.getBoundingClientRect();

        expect(isHTMLElement(testElem)).toBe(true);
        expect(referenceBounds.width).toBeGreaterThan(0);
        expect(referenceBounds.height).toBeGreaterThan(0);
        expect(testBounds.width).toBe(referenceBounds.width);
        expect(testBounds.height).toBe(referenceBounds.height);
      }));

      it('should handle custom svg containers that transclude to foreignObject that transclude html', inject(function() {
        element = jqLite(
          '<div>' +
            // By hand (for reference)
            HAND_WRITTEN_SVG +
            // By directive
            '<svg-container>' +
              '<my-foreign-object>' +
                '<div style="width:20px;height:20px">test</div>' +
              '</my-foreign-object>' +
            '</svg-container>' +
          '</div>');
        $compile(element.contents())($rootScope);
        document.body.appendChild(element[0]);

        var referenceElem = element.find('div')[0];
        var testElem = element.find('div')[1];
        var referenceBounds = referenceElem.getBoundingClientRect();
        var testBounds = testElem.getBoundingClientRect();

        expect(isHTMLElement(testElem)).toBe(true);
        expect(referenceBounds.width).toBeGreaterThan(0);
        expect(referenceBounds.height).toBeGreaterThan(0);
        expect(testBounds.width).toBe(referenceBounds.width);
        expect(testBounds.height).toBe(referenceBounds.height);
      }));

      // NOTE: This test may be redundant.
      // Support: Edge 14+
      // An `<svg>` element inside a `<foreignObject>` element on MS Edge has no
      // size, causing the included `<circle>` element to also have no size and thus fails an
      // assertion (relying on the element having a non-zero size).
      if (!isEdge) {
        it('should handle custom svg containers that transclude to foreignObject' +
           ' that transclude to custom svg containers that transclude to custom elements', inject(function() {
          element = jqLite('<div><svg-container>' +
              '<my-foreign-object><svg-container><svg-circle></svg-circle></svg-container></my-foreign-object>' +
              '</svg-container></div>');
          $compile(element.contents())($rootScope);
          document.body.appendChild(element[0]);

          var circle = element.find('circle');
          assertIsValidSvgCircle(circle[0]);
        }));
      }
    }

    it('should handle directives with templates that manually add the transclude further down', inject(function() {
      element = jqLite('<div><svg-custom-transclude-container>' +
          '<circle cx="2" cy="2" r="1"></circle></svg-custom-transclude-container>' +
          '</div>');
      $compile(element.contents())($rootScope);
      document.body.appendChild(element[0]);

      var circle = element.find('circle');
      assertIsValidSvgCircle(circle[0]);

    }));

    it('should support directives with SVG templates and a slow url ' +
       'that are stamped out later by a transcluding directive', function() {
      module(function() {
        directive('svgCircleUrl', valueFn({
          replace: true,
          templateUrl: 'template.html',
          templateNamespace: 'SVG'
        }));
      });
      inject(function($compile, $rootScope, $httpBackend) {
        $httpBackend.expect('GET', 'template.html').respond('<circle></circle>');
        element = $compile('<svg><g ng-repeat="l in list"><svg-circle-url></svg-circle-url></g></svg>')($rootScope);

        // initially the template is not yet loaded
        $rootScope.$apply(function() {
          $rootScope.list = [1];
        });
        expect(element.find('svg-circle-url').length).toBe(1);
        expect(element.find('circle').length).toBe(0);

        // template is loaded and replaces the existing nodes
        $httpBackend.flush();
        expect(element.find('svg-circle-url').length).toBe(0);
        expect(element.find('circle').length).toBe(1);

        // new entry should immediately use the loaded template
        $rootScope.$apply(function() {
          $rootScope.list.push(2);
        });
        expect(element.find('svg-circle-url').length).toBe(0);
        expect(element.find('circle').length).toBe(2);
      });
    });
  });

  describe('compile phase', function() {

    it('should attach scope to the document node when it is compiled explicitly', inject(function($document) {
      $compile($document)($rootScope);
      expect($document.scope()).toBe($rootScope);
    }));


    it('should not wrap root text nodes in spans', function() {
      element = jqLite(
        '<div>   <div>A</div>\n  ' +
        '<div>B</div>C\t\n  ' +
        '</div>');
      $compile(element.contents())($rootScope);
      var spans = element.find('span');
      expect(spans.length).toEqual(0);
    });


    it('should be able to compile text nodes at the root', inject(function($rootScope) {
      element = jqLite('<div>Name: {{name}}<br />\nColor: {{color}}</div>');
      $rootScope.name = 'Lucas';
      $rootScope.color = 'blue';
      $compile(element.contents())($rootScope);
      $rootScope.$digest();
      expect(element.text()).toEqual('Name: Lucas\nColor: blue');
    }));


    it('should not leak memory when there are top level empty text nodes', function() {
      // We compile the contents of element (i.e. not element itself)
      // Then delete these contents and check the cache has been reset to zero

      // First with only elements at the top level
      element = jqLite('<div><div></div></div>');
      $compile(element.contents())($rootScope);
      element.empty();
      expect(jqLiteCacheSize()).toEqual(0);

      // Next with non-empty text nodes at the top level
      // (in this case the compiler will wrap them in a <span>)
      element = jqLite('<div>xxx</div>');
      $compile(element.contents())($rootScope);
      element.empty();
      expect(jqLiteCacheSize()).toEqual(0);

      // Next with comment nodes at the top level
      element = jqLite('<div><!-- comment --></div>');
      $compile(element.contents())($rootScope);
      element.empty();
      expect(jqLiteCacheSize()).toEqual(0);

      // Finally with empty text nodes at the top level
      element = jqLite('<div>   \n<div></div>   </div>');
      $compile(element.contents())($rootScope);
      element.empty();
      expect(jqLiteCacheSize()).toEqual(0);
    });


    it('should not blow up when elements with no childNodes property are compiled', inject(
        function($compile, $rootScope) {
      // it turns out that when a browser plugin is bound to a DOM element (typically <object>),
      // the plugin's context rather than the usual DOM apis are exposed on this element, so
      // childNodes might not exist.

      element = jqLite('<div>{{1+2}}</div>');

      try {
        element[0].childNodes[1] = {nodeType: 3, nodeName: 'OBJECT', textContent: 'fake node'};
      } catch (e) { /* empty */ }
      if (!element[0].childNodes[1]) return; // browser doesn't support this kind of mocking

      expect(element[0].childNodes[1].textContent).toBe('fake node');

      $compile(element)($rootScope);
      $rootScope.$apply();

      // object's children can't be compiled in this case, so we expect them to be raw
      expect(element.html()).toBe('3');
    }));

    it('should detect anchor elements with the string "SVG" in the `href` attribute as an anchor', inject(function($compile, $rootScope) {
      element = jqLite('<div><a href="/ID_SVG_ID">' +
        '<span ng-if="true">Should render</span>' +
        '</a></div>');
      $compile(element.contents())($rootScope);
      $rootScope.$digest();
      document.body.appendChild(element[0]);
      expect(element.find('span').text()).toContain('Should render');
    }));

    describe('multiple directives per element', function() {
      it('should allow multiple directives per element', inject(function($compile, $rootScope, log) {
        element = $compile(
          '<span greet="angular" log="L" x-high-log="H" data-medium-log="M"></span>')($rootScope);
        expect(element.text()).toEqual('Hello angular');
        expect(log).toEqual('L; M; H');
      }));


      it('should recurse to children', inject(function($compile, $rootScope) {
        element = $compile('<div>0<a set="hello">1</a>2<b set="angular">3</b>4</div>')($rootScope);
        expect(element.text()).toEqual('0hello2angular4');
      }));


      it('should allow directives in classes', inject(function($compile, $rootScope, log) {
        element = $compile('<div class="greet: angular; log:123;"></div>')($rootScope);
        expect(element.html()).toEqual('Hello angular');
        expect(log).toEqual('123');
      }));


      it('should allow directives in SVG element classes', inject(function($compile, $rootScope, log) {
        if (!window.SVGElement) return;
        element = $compile('<svg><text class="greet: angular; log:123;"></text></svg>')($rootScope);
        var text = element.children().eq(0);
        // In old Safari, SVG elements don't have innerHTML, so element.html() won't work
        // (https://bugs.webkit.org/show_bug.cgi?id=136903)
        expect(text.text()).toEqual('Hello angular');
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
            forEach(parts, function(value) {
              if (value.substring(0,2) !== 'ng') {
                value = value.replace('=""', '');
                var match = value.match(/=(.*)/);
                if (match && match[1].charAt(0) !== '"') {
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
        module(function() {
          directive('after', valueFn({
            compile: function(element) {
              element.after('<span log>B</span>');
            }
          }));
        });
        inject(function($compile, $rootScope, log) {
          element = jqLite('<div><div after>A</div></div>');
          $compile(element)($rootScope);
          expect(element.text()).toBe('AB');
          expect(log).toEqual('LOG');
        });
      });


      it('should allow changing the template structure after the current node inside ngRepeat', function() {
        module(function() {
          directive('after', valueFn({
            compile: function(element) {
              element.after('<span log>B</span>');
            }
          }));
        });
        inject(function($compile, $rootScope, log) {
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
        it('should honor priority', inject(function($compile, $rootScope, log) {
          element = $compile(
            '<span log="L" x-high-log="H" data-medium-log="M"></span>')($rootScope);
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

        it('should allow restriction of availability', function() {
          module(function() {
            forEach({div: 'E', attr: 'A', clazz: 'C', comment: 'M', all: 'EACM'},
                function(restrict, name) {
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

            dealoc($compile('<attr class="attr"></attr>')($rootScope));
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

            dealoc($compile('<!-- directive: comment -->')($rootScope));
            expect(log).toEqual('comment');
            log.reset();

            dealoc($compile('<all class="all" all><!-- directive: all --></all>')($rootScope));
            expect(log).toEqual('all; all; all; all');
          });
        });


        it('should use EA rule as the default', function() {
          module(function() {
            directive('defaultDir', function(log) {
              return {
                compile: function() {
                  log('defaultDir');
                }
              };
            });
          });
          inject(function($rootScope, $compile, log) {
            dealoc($compile('<span default-dir ></span>')($rootScope));
            expect(log).toEqual('defaultDir');
            log.reset();

            dealoc($compile('<default-dir></default-dir>')($rootScope));
            expect(log).toEqual('defaultDir');
            log.reset();

            dealoc($compile('<span class="default-dir"></span>')($rootScope));
            expect(log).toEqual('');
            log.reset();
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
          element = $compile('<div><div replace medium-log>ignore</div><div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('Replace!');
          expect(log).toEqual('LOG; HIGH; MEDIUM');
        }));


        it('should compile template when appending', inject(function($compile, $rootScope, log) {
          element = $compile('<div><div append medium-log>ignore</div><div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toEqual('Append!');
          expect(log).toEqual('LOG; HIGH; MEDIUM');
        }));


        it('should merge attributes including style attr', inject(function($compile, $rootScope) {
          element = $compile(
            '<div><div replace class="medium-log" style="height: 20px" ></div><div>')($rootScope);
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
            '<div><div nomerge class="medium-log" id="myid"></div><div>')($rootScope);
          var div = element.find('div');
          expect(div.hasClass('medium-log')).toBe(true);
          expect(div.hasClass('log')).toBe(true);
          expect(div.attr('id')).toEqual('myid');
        }));


        it('should correctly merge attributes that contain special characters', inject(function($compile, $rootScope) {
          element = $compile(
            '<div><div replace (click)="doSomething()" [value]="someExpression" ω="omega"></div><div>')($rootScope);
          var div = element.find('div');
          expect(div.attr('(click)')).toEqual('doSomething()');
          expect(div.attr('[value]')).toEqual('someExpression');
          expect(div.attr('ω')).toEqual('omega');
        }));


        it('should not add white-space when merging an attribute that is "" in the replaced element',
          inject(function($compile, $rootScope) {
            element = $compile(
              '<div><div replace class=""></div><div>')($rootScope);
            var div = element.find('div');
            expect(div.hasClass('log')).toBe(true);
            expect(div.attr('class')).toBe('log');
          })
        );


        it('should not set merged attributes twice in $attrs', function() {
          var attrs;

          module(function() {
            directive('logAttrs', function() {
              return {
                link: function($scope, $element, $attrs) {
                  attrs = $attrs;
                }
              };
            });
          });

          inject(function($compile, $rootScope) {
            element = $compile(
              '<div><div log-attrs replace class="myLog"></div><div>')($rootScope);
            var div = element.find('div');
            expect(div.attr('class')).toBe('myLog log');
            expect(attrs.class).toBe('myLog log');
          });
        });


        it('should prevent multiple templates per element', inject(function($compile) {
          try {
            $compile('<div><span replace class="replace"></span></div>');
            this.fail(new Error('should have thrown Multiple directives error'));
          } catch (e) {
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

        // Support: IE 9-11 only
        if (!msie) {
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

        it('should interpolate the values once per digest',
            inject(function($compile, $rootScope, log) {
          element = $compile('<div>{{log("A")}} foo {{::log("B")}}</div>')($rootScope);
          $rootScope.log = log;
          $rootScope.$digest();
          expect(log).toEqual('A; B; A; B');
        }));

        it('should update references to replaced jQuery context', function() {
          module(function($compileProvider) {
            $compileProvider.directive('foo', function() {
              return {
                replace: true,
                template: '<div></div>'
              };
            });
          });

          inject(function($compile, $rootScope) {
            element = jqLite(document.createElement('span')).attr('foo', '');
            expect(nodeName_(element)).toBe('span');

            var preCompiledNode = element[0];

            var linked = $compile(element)($rootScope);
            expect(linked).toBe(element);
            expect(nodeName_(element)).toBe('div');
            if (element.context) {
              expect(element.context).toBe(element[0]);
            }
          });
        });

        describe('replace and not exactly one root element', function() {
          var templateVar;

          beforeEach(module(function() {
            directive('template', function() {
              return {
                replace: true,
                template: function() {
                  return templateVar;
                }
              };
            });
          }));

          they('should throw if: $prop',
            {
              'no root element': 'dada',
              'multiple root elements': '<div></div><div></div>'
            }, function(directiveTemplate) {

              inject(function($compile) {
                templateVar = directiveTemplate;
                expect(function() {
                  $compile('<p template></p>');
                }).toThrowMinErr('$compile', 'tplrt',
                  'Template for directive \'template\' must have exactly one root element.'
                );
              });
          });

          they('should not throw if the root element is accompanied by: $prop',
            {
              'whitespace': '  <div>Hello World!</div> \n',
              'comments': '<!-- oh hi --><div>Hello World!</div> \n',
              'comments + whitespace': '  <!-- oh hi -->  <div>Hello World!</div>  <!-- oh hi -->\n'
            }, function(directiveTemplate) {

              inject(function($compile, $rootScope) {
                templateVar = directiveTemplate;
                var element;
                expect(function() {
                  element = $compile('<p template></p>')($rootScope);
                }).not.toThrow();
                expect(element.length).toBe(1);
                expect(element.text()).toBe('Hello World!');
              });
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

        it('should support SVG templates using directive.templateNamespace=svg', function() {
          module(function() {
            directive('svgAnchor', valueFn({
              replace: true,
              template: '<a xlink:href="{{linkurl}}">{{text}}</a>',
              templateNamespace: 'SVG',
              scope: {
                linkurl: '@svgAnchor',
                text: '@?'
              }
            }));
          });
          inject(function($compile, $rootScope) {
            element = $compile('<svg><g svg-anchor="/foo/bar" text="foo/bar!"></g></svg>')($rootScope);
            var child = element.children().eq(0);
            $rootScope.$digest();
            expect(nodeName_(child)).toMatch(/a/i);
            expect(isSVGElement(child[0])).toBe(true);
            expect(child[0].href.baseVal).toBe('/foo/bar');
          });
        });

        if (supportsMathML()) {
          // MathML is only natively supported in Firefox at the time of this test's writing,
          // and even there, the browser does not export MathML element constructors globally.
          it('should support MathML templates using directive.templateNamespace=math', function() {
            module(function() {
              directive('pow', valueFn({
                replace: true,
                transclude: true,
                template: '<msup><mn>{{pow}}</mn></msup>',
                templateNamespace: 'MATH',
                scope: {
                  pow: '@pow'
                },
                link: function(scope, elm, attr, ctrl, transclude) {
                  transclude(function(node) {
                    elm.prepend(node[0]);
                  });
                }
              }));
            });
            inject(function($compile, $rootScope) {
              element = $compile('<math><mn pow="2"><mn>8</mn></mn></math>')($rootScope);
              $rootScope.$digest();
              var child = element.children().eq(0);
              expect(nodeName_(child)).toMatch(/msup/i);
              expect(isUnknownElement(child[0])).toBe(false);
              expect(isHTMLElement(child[0])).toBe(false);
            });
          });
        }

        it('should keep prototype properties on directive', function() {
          module(function() {
            function DirectiveClass() {
              this.restrict = 'E';
              this.template = '<p>{{value}}</p>';
            }

            DirectiveClass.prototype.compile = function() {
              return function(scope, element, attrs) {
                scope.value = 'Test Value';
              };
            };

            directive('templateUrlWithPrototype', valueFn(new DirectiveClass()));
          });

          inject(function($compile, $rootScope) {
            element = $compile('<template-url-with-prototype><template-url-with-prototype>')($rootScope);
            $rootScope.$digest();
            expect(element.find('p')[0].innerHTML).toEqual('Test Value');
          });
        });
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
          function($compile, $rootScope) {
            expect(function() {
              $compile('<div class="crossDomainTemplate"></div>')($rootScope);
            }).toThrowMinErr('$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example.com/should-not-load.html');
          }
        ));

        it('should trust what is already in the template cache', inject(
          function($compile, $httpBackend, $rootScope, $templateCache) {
            $httpBackend.expect('GET', 'http://example.com/should-not-load.html').respond('<span>example.com/remote-version</span>');
            $templateCache.put('http://example.com/should-not-load.html', '<span>example.com/cached-version</span>');
            element = $compile('<div class="crossDomainTemplate"></div>')($rootScope);
            expect(sortedHtml(element)).toEqual('<div class="crossDomainTemplate"></div>');
            $rootScope.$digest();
            expect(sortedHtml(element)).toEqual('<div class="crossDomainTemplate"><span>example.com/cached-version</span></div>');
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


              expect(sortedHtml(element)).toBe('<div><b class="i-hello"></b><span class="i-cau">Cau!</span></div>');

              $httpBackend.flush();
              expect(sortedHtml(element)).toBe('<div><span class="i-hello">Hello!</span><span class="i-cau">Cau!</span></div>');
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

              expect(sortedHtml(element)).toBe('<div><span class="i-hello">Hello, Elvis!</span></div>');
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

              expect(sortedHtml(element)).toBe('<div><span class="i-hello">Hello, Elvis!</span></div>');
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


        it('should throw an error and clear element content if the template fails to load',
          inject(function($compile, $exceptionHandler, $httpBackend, $rootScope) {
            $httpBackend.expect('GET', 'hello.html').respond(404, 'Not Found!');
            element = $compile('<div><b class="hello">content</b></div>')($rootScope);

            $httpBackend.flush();

            expect(sortedHtml(element)).toBe('<div><b class="hello"></b></div>');
            expect($exceptionHandler.errors[0]).toEqualMinErr('$compile', 'tpload',
                'Failed to load template: hello.html');
          })
        );


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
          inject(function($compile, $exceptionHandler, $httpBackend) {
            $httpBackend.whenGET('template.html').respond('<p>template.html</p>');

            $compile('<div><div class="sync async"></div></div>');
            $httpBackend.flush();

            expect($exceptionHandler.errors[0]).toEqualMinErr('$compile', 'multidir',
                'Multiple directives [async, sync] asking for template on: ' +
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


        describe('delay compile / linking functions until after template is resolved', function() {
          var template;
          beforeEach(module(function() {
            function logDirective(name, priority, options) {
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

        describe('replace and not exactly one root element', function() {

          beforeEach(module(function() {

            directive('template', function() {
              return {
                replace: true,
                templateUrl: 'template.html'
              };
            });
          }));

          they('should throw if: $prop',
            {
              'no root element': 'dada',
              'multiple root elements': '<div></div><div></div>'
            }, function(directiveTemplate) {

              inject(function($compile, $templateCache, $rootScope, $exceptionHandler) {
                $templateCache.put('template.html', directiveTemplate);
                $compile('<p template></p>')($rootScope);
                $rootScope.$digest();

                expect($exceptionHandler.errors.pop()).toEqualMinErr('$compile', 'tplrt',
                  'Template for directive \'template\' must have exactly one root element. ' +
                  'template.html'
                );
              });
          });

          they('should not throw if the root element is accompanied by: $prop',
            {
              'whitespace': '  <div>Hello World!</div> \n',
              'comments': '<!-- oh hi --><div>Hello World!</div> \n',
              'comments + whitespace': '  <!-- oh hi -->  <div>Hello World!</div>  <!-- oh hi -->\n'
            }, function(directiveTemplate) {

              inject(function($compile, $templateCache, $rootScope) {
                $templateCache.put('template.html', directiveTemplate);
                element = $compile('<p template></p>')($rootScope);
                expect(function() {
                  $rootScope.$digest();
                }).not.toThrow();
                expect(element.length).toBe(1);
                expect(element.text()).toBe('Hello World!');
              });
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

            expect(controllerSpy).toHaveBeenCalledTimes(2);
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

        it('should support SVG templates using directive.templateNamespace=svg', function() {
          module(function() {
            directive('svgAnchor', valueFn({
              replace: true,
              templateUrl: 'template.html',
              templateNamespace: 'SVG',
              scope: {
                linkurl: '@svgAnchor',
                text: '@?'
              }
            }));
          });
          inject(function($compile, $rootScope, $templateCache) {
            $templateCache.put('template.html', '<a xlink:href="{{linkurl}}">{{text}}</a>');
            element = $compile('<svg><g svg-anchor="/foo/bar" text="foo/bar!"></g></svg>')($rootScope);
            $rootScope.$digest();
            var child = element.children().eq(0);
            expect(nodeName_(child)).toMatch(/a/i);
            expect(isSVGElement(child[0])).toBe(true);
            expect(child[0].href.baseVal).toBe('/foo/bar');
          });
        });

        if (supportsMathML()) {
          // MathML is only natively supported in Firefox at the time of this test's writing,
          // and even there, the browser does not export MathML element constructors globally.
          it('should support MathML templates using directive.templateNamespace=math', function() {
            module(function() {
              directive('pow', valueFn({
                replace: true,
                transclude: true,
                templateUrl: 'template.html',
                templateNamespace: 'math',
                scope: {
                  pow: '@pow'
                },
                link: function(scope, elm, attr, ctrl, transclude) {
                  transclude(function(node) {
                    elm.prepend(node[0]);
                  });
                }
              }));
            });
            inject(function($compile, $rootScope, $templateCache) {
              $templateCache.put('template.html', '<msup><mn>{{pow}}</mn></msup>');
              element = $compile('<math><mn pow="2"><mn>8</mn></mn></math>')($rootScope);
              $rootScope.$digest();
              var child = element.children().eq(0);
              expect(nodeName_(child)).toMatch(/msup/i);
              expect(isUnknownElement(child[0])).toBe(false);
              expect(isHTMLElement(child[0])).toBe(false);
            });
          });
        }

        it('should keep prototype properties on sync version of async directive', function() {
          module(function() {
            function DirectiveClass() {
              this.restrict = 'E';
              this.templateUrl = 'test.html';
            }

            DirectiveClass.prototype.compile = function() {
              return function(scope, element, attrs) {
                scope.value = 'Test Value';
              };
            };

            directive('templateUrlWithPrototype', valueFn(new DirectiveClass()));
          });

          inject(function($compile, $rootScope, $httpBackend) {
            $httpBackend.whenGET('test.html').
              respond('<p>{{value}}</p>');
            element = $compile('<template-url-with-prototype><template-url-with-prototype>')($rootScope);
            $httpBackend.flush();
            $rootScope.$digest();
            expect(element.find('p')[0].innerHTML).toEqual('Test Value');
          });
        });

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
                  return {pre: function(scope, element) {
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
                  return function(scope, element) {
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
                  return function(scope, element) {
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
                  return function(scope, element) {
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
                  return function(scope, element) {
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
                  return function(scope, element) {
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
                  return function(scope, element) {
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
          directive('prototypeMethodNameAsScopeVarA', function() {
            return {
              scope: {
                'constructor': '=?',
                'valueOf': '='
              },
              restrict: 'AE',
              template: '<span></span>'
            };
          });
          directive('prototypeMethodNameAsScopeVarB', function() {
            return {
              scope: {
                'constructor': '@?',
                'valueOf': '@'
              },
              restrict: 'AE',
              template: '<span></span>'
            };
          });
          directive('prototypeMethodNameAsScopeVarC', function() {
            return {
              scope: {
                'constructor': '&?',
                'valueOf': '&'
              },
              restrict: 'AE',
              template: '<span></span>'
            };
          });
          directive('watchAsScopeVar', function() {
            return {
              scope: {
                'watch': '='
              },
              restrict: 'AE',
              template: '<span></span>'
            };
          });
        }));


        it('should allow creation of new scopes', inject(function($rootScope, $compile, log) {
          element = $compile('<div><span scope><a log></a></span></div>')($rootScope);
          expect(log).toEqual('2; log-2-1; LOG');
          expect(element.find('span').hasClass('ng-scope')).toBe(true);
        }));


        it('should allow creation of new isolated scopes for directives', inject(
            function($rootScope, $compile, log) {
          element = $compile('<div><span iscope><a log></a></span></div>')($rootScope);
          expect(log).toEqual('log-1-no-parent; LOG; 2');
          $rootScope.name = 'abc';
          expect(iscope.$parent).toBe($rootScope);
          expect(iscope.name).toBeUndefined();
        }));


        it('should allow creation of new scopes for directives with templates', inject(
            function($rootScope, $compile, log, $httpBackend) {
          $httpBackend.expect('GET', 'tscope.html').respond('<a log>{{name}}; scopeId: {{$id}}</a>');
          element = $compile('<div><span tscope></span></div>')($rootScope);
          $httpBackend.flush();
          expect(log).toEqual('log-2-1; LOG; 2');
          $rootScope.name = 'Jozo';
          $rootScope.$apply();
          expect(element.text()).toBe('Jozo; scopeId: 2');
          expect(element.find('span').scope().$id).toBe(2);
        }));


        it('should allow creation of new scopes for replace directives with templates', inject(
            function($rootScope, $compile, log, $httpBackend) {
          $httpBackend.expect('GET', 'trscope.html').
              respond('<p><a log>{{name}}; scopeId: {{$id}}</a></p>');
          element = $compile('<div><span trscope></span></div>')($rootScope);
          $httpBackend.flush();
          expect(log).toEqual('log-2-1; LOG; 2');
          $rootScope.name = 'Jozo';
          $rootScope.$apply();
          expect(element.text()).toBe('Jozo; scopeId: 2');
          expect(element.find('a').scope().$id).toBe(2);
        }));


        it('should allow creation of new scopes for replace directives with templates in a repeater',
            inject(function($rootScope, $compile, log, $httpBackend) {
          $httpBackend.expect('GET', 'trscope.html').
              respond('<p><a log>{{name}}; scopeId: {{$id}} |</a></p>');
          element = $compile('<div><span ng-repeat="i in [1,2,3]" trscope></span></div>')($rootScope);
          $httpBackend.flush();
          expect(log).toEqual('log-3-2; LOG; 3; log-5-4; LOG; 5; log-7-6; LOG; 7');
          $rootScope.name = 'Jozo';
          $rootScope.$apply();
          expect(element.text()).toBe('Jozo; scopeId: 3 |Jozo; scopeId: 5 |Jozo; scopeId: 7 |');
          expect(element.find('p').scope().$id).toBe(3);
          expect(element.find('a').scope().$id).toBe(3);
        }));


        it('should allow creation of new isolated scopes for directives with templates', inject(
            function($rootScope, $compile, log, $httpBackend) {
          $httpBackend.expect('GET', 'tiscope.html').respond('<a log></a>');
          element = $compile('<div><span tiscope></span></div>')($rootScope);
          $httpBackend.flush();
          expect(log).toEqual('log-2-1; LOG; 2');
          $rootScope.name = 'abc';
          expect(iscope.$parent).toBe($rootScope);
          expect(iscope.name).toBeUndefined();
        }));


        it('should correctly create the scope hierarchy', inject(
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
            expect(log).toEqual('2; 3; log-3-2; LOG; log-2-1; LOG; 4; log-4-1; LOG');
          })
        );


        it('should allow more than one new scope directives per element, but directives should share' +
            'the scope', inject(
          function($rootScope, $compile, log) {
            element = $compile('<div class="scope-a; scope-b"></div>')($rootScope);
            expect(log).toEqual('2; 2');
          })
        );

        it('should not allow more than one isolate scope creation per element', inject(
          function($rootScope, $compile) {
            expect(function() {
              $compile('<div class="iscope-a; scope-b"></div>');
            }).toThrowMinErr('$compile', 'multidir', 'Multiple directives [iscopeA, scopeB] asking for new/isolated scope on: ' +
                '<div class="iscope-a; scope-b">');
          })
        );

        it('should not allow more than one isolate/new scope creation per element regardless of `templateUrl`',
          inject(function($exceptionHandler, $httpBackend) {
            $httpBackend.expect('GET', 'tiscope.html').respond('<div>Hello, world !</div>');

            compile('<div class="tiscope-a; scope-b"></div>');
            $httpBackend.flush();

            expect($exceptionHandler.errors[0]).toEqualMinErr('$compile', 'multidir',
                'Multiple directives [scopeB, tiscopeA] asking for new/isolated scope on: ' +
                '<div class="tiscope-a; scope-b ng-scope">');
          })
        );

        it('should not allow more than one isolate scope creation per element regardless of directive priority', function() {
          module(function($compileProvider) {
            $compileProvider.directive('highPriorityScope', function() {
              return {
                restrict: 'C',
                priority: 1,
                scope: true,
                link: function() {}
              };
            });
          });
          inject(function($compile) {
            expect(function() {
              $compile('<div class="iscope-a; high-priority-scope"></div>');
            }).toThrowMinErr('$compile', 'multidir', 'Multiple directives [highPriorityScope, iscopeA] asking for new/isolated scope on: ' +
                    '<div class="iscope-a; high-priority-scope">');
          });
        });


        it('should create new scope even at the root of the template', inject(
          function($rootScope, $compile, log) {
            element = $compile('<div scope-a></div>')($rootScope);
            expect(log).toEqual('2');
          })
        );


        it('should create isolate scope even at the root of the template', inject(
          function($rootScope, $compile, log) {
            element = $compile('<div iscope></div>')($rootScope);
            expect(log).toEqual('2');
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

            it('should handle "=" bindings with same method names in Object.prototype correctly when not present', inject(
              function($rootScope, $compile) {
                var func = function() {
                  element = $compile(
                    '<div prototype-method-name-as-scope-var-a></div>'
                  )($rootScope);
                };

                expect(func).not.toThrow();
                var scope = element.isolateScope();
                expect(element.find('span').scope()).toBe(scope);
                expect(scope).not.toBe($rootScope);

                // Not shadowed because optional
                expect(scope.constructor).toBe($rootScope.constructor);
                expect(scope.hasOwnProperty('constructor')).toBe(false);

                // Shadowed with undefined because not optional
                expect(scope.valueOf).toBeUndefined();
                expect(scope.hasOwnProperty('valueOf')).toBe(true);
              })
            );

            it('should handle "=" bindings with same method names in Object.prototype correctly when present', inject(
                function($rootScope, $compile) {
                  $rootScope.constructor = 'constructor';
                  $rootScope.valueOf = 'valueOf';
                  var func = function() {
                    element = $compile(
                      '<div prototype-method-name-as-scope-var-a constructor="constructor" value-of="valueOf"></div>'
                    )($rootScope);
                  };

                  expect(func).not.toThrow();
                  var scope = element.isolateScope();
                  expect(element.find('span').scope()).toBe(scope);
                  expect(scope).not.toBe($rootScope);
                  expect(scope.constructor).toBe('constructor');
                  expect(scope.hasOwnProperty('constructor')).toBe(true);
                  expect(scope.valueOf).toBe('valueOf');
                  expect(scope.hasOwnProperty('valueOf')).toBe(true);
                })
            );

            it('should handle "@" bindings with same method names in Object.prototype correctly when not present', inject(
                function($rootScope, $compile) {
                  var func = function() {
                    element = $compile('<div prototype-method-name-as-scope-var-b></div>')($rootScope);
                  };

                  expect(func).not.toThrow();
                  var scope = element.isolateScope();
                  expect(element.find('span').scope()).toBe(scope);
                  expect(scope).not.toBe($rootScope);

                  // Does not shadow value because optional
                  expect(scope.constructor).toBe($rootScope.constructor);
                  expect(scope.hasOwnProperty('constructor')).toBe(false);

                  // Shadows value because not optional
                  expect(scope.valueOf).toBeUndefined();
                  expect(scope.hasOwnProperty('valueOf')).toBe(true);
                })
            );

            it('should handle "@" bindings with same method names in Object.prototype correctly when present', inject(
                function($rootScope, $compile) {
                  var func = function() {
                    element = $compile(
                      '<div prototype-method-name-as-scope-var-b constructor="constructor" value-of="valueOf"></div>'
                    )($rootScope);
                  };

                  expect(func).not.toThrow();
                  expect(element.find('span').scope()).toBe(element.isolateScope());
                  expect(element.isolateScope()).not.toBe($rootScope);
                  expect(element.isolateScope()['constructor']).toBe('constructor');
                  expect(element.isolateScope()['valueOf']).toBe('valueOf');
                })
            );

            it('should handle "&" bindings with same method names in Object.prototype correctly when not present', inject(
                function($rootScope, $compile) {
                  var func = function() {
                    element = $compile('<div prototype-method-name-as-scope-var-c></div>')($rootScope);
                  };

                  expect(func).not.toThrow();
                  expect(element.find('span').scope()).toBe(element.isolateScope());
                  expect(element.isolateScope()).not.toBe($rootScope);
                  expect(element.isolateScope()['constructor']).toBe($rootScope.constructor);
                  expect(element.isolateScope()['valueOf']()).toBeUndefined();
                })
            );

            it('should handle "&" bindings with same method names in Object.prototype correctly when present', inject(
                function($rootScope, $compile) {
                  $rootScope.constructor = function() { return 'constructor'; };
                  $rootScope.valueOf = function() { return 'valueOf'; };
                  var func = function() {
                    element = $compile(
                      '<div prototype-method-name-as-scope-var-c constructor="constructor()" value-of="valueOf()"></div>'
                    )($rootScope);
                  };

                  expect(func).not.toThrow();
                  expect(element.find('span').scope()).toBe(element.isolateScope());
                  expect(element.isolateScope()).not.toBe($rootScope);
                  expect(element.isolateScope()['constructor']()).toBe('constructor');
                  expect(element.isolateScope()['valueOf']()).toBe('valueOf');
                })
            );

            it('should not throw exception when using "watch" as binding in Firefox', inject(
                function($rootScope, $compile) {
                  $rootScope.watch = 'watch';
                  var func = function() {
                    element = $compile(
                      '<div watch-as-scope-var watch="watch"></div>'
                    )($rootScope);
                  };

                  expect(func).not.toThrow();
                  expect(element.find('span').scope()).toBe(element.isolateScope());
                  expect(element.isolateScope()).not.toBe($rootScope);
                  expect(element.isolateScope()['watch']).toBe('watch');
                })
            );

            it('should handle @ bindings on BOOLEAN attributes', function() {
              var checkedVal;
              module(function($compileProvider) {
                $compileProvider.directive('test', function() {
                  return {
                    scope: { checked: '@' },
                    link: function(scope, element, attrs) {
                      checkedVal = scope.checked;
                    }
                  };
                });
              });
              inject(function($compile, $rootScope) {
                $compile('<input test checked="checked">')($rootScope);
                expect(checkedVal).toEqual(true);
              });
            });

            it('should handle updates to @ bindings on BOOLEAN attributes', function() {
              var componentScope;
              module(function($compileProvider) {
                $compileProvider.directive('test', function() {
                  return {
                    scope: {checked: '@'},
                    link: function(scope, element, attrs) {
                      componentScope = scope;
                      attrs.$set('checked', true);
                    }
                  };
                });
              });
              inject(function($compile, $rootScope) {
                $compile('<test></test>')($rootScope);
                expect(componentScope.checked).toBe(true);
              });
            });
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

        describe('multidir isolated scope error messages', function() {
          angular.module('fakeIsoledScopeModule', [])
            .directive('fakeScope', function(log) {
              return {
                scope: true,
                restrict: 'CA',
                compile: function() {
                  return {pre: function(scope, element) {
                    log(scope.$id);
                    expect(element.data('$scope')).toBe(scope);
                  }};
                }
              };
            })
            .directive('fakeIScope', function(log) {
              return {
                scope: {},
                restrict: 'CA',
                compile: function() {
                  return function(scope, element) {
                    iscope = scope;
                    log(scope.$id);
                    expect(element.data('$isolateScopeNoTemplate')).toBe(scope);
                  };
                }
              };
            });

          beforeEach(module('fakeIsoledScopeModule', function() {
            directive('anonymModuleScopeDirective', function(log) {
              return {
                scope: true,
                restrict: 'CA',
                compile: function() {
                  return {pre: function(scope, element) {
                    log(scope.$id);
                    expect(element.data('$scope')).toBe(scope);
                  }};
                }
              };
            });
          }));

          it('should add module name to multidir isolated scope message if directive defined through module', inject(
              function($rootScope, $compile) {
                expect(function() {
                  $compile('<div class="fake-scope; fake-i-scope"></div>');
                }).toThrowMinErr('$compile', 'multidir',
                  'Multiple directives [fakeIScope (module: fakeIsoledScopeModule), fakeScope (module: fakeIsoledScopeModule)] ' +
                  'asking for new/isolated scope on: <div class="fake-scope; fake-i-scope">');
              })
          );

          it('shouldn\'t add module name to multidir isolated scope message if directive is defined directly with $compileProvider', inject(
            function($rootScope, $compile) {
              expect(function() {
                $compile('<div class="anonym-module-scope-directive; fake-i-scope"></div>');
              }).toThrowMinErr('$compile', 'multidir',
                'Multiple directives [anonymModuleScopeDirective, fakeIScope (module: fakeIsoledScopeModule)] ' +
                'asking for new/isolated scope on: <div class="anonym-module-scope-directive; fake-i-scope">');
            })
          );
        });
      });
    });
  });


  describe('interpolation', function() {
    var observeSpy, directiveAttrs, deregisterObserver;

    beforeEach(module(function() {
      directive('observer', function() {
        return function(scope, elm, attr) {
          directiveAttrs = attr;
          observeSpy = jasmine.createSpy('$observe attr');
          deregisterObserver = attr.$observe('someAttr', observeSpy);
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


    it('should one-time bind if the expression starts with two colons', inject(
        function($rootScope, $compile) {
          $rootScope.name = 'angular';
          element = $compile('<div name="attr: {{::name}}">text: {{::name}}</div>')($rootScope);
          expect($rootScope.$$watchers.length).toBe(2);
          $rootScope.$digest();
          expect(element.text()).toEqual('text: angular');
          expect(element.attr('name')).toEqual('attr: angular');
          expect($rootScope.$$watchers.length).toBe(0);
          $rootScope.name = 'not-angular';
          $rootScope.$digest();
          expect(element.text()).toEqual('text: angular');
          expect(element.attr('name')).toEqual('attr: angular');
        })
    );

    it('should one-time bind if the expression starts with a space and two colons', inject(
        function($rootScope, $compile) {
          $rootScope.name = 'angular';
          element = $compile('<div name="attr: {{::name}}">text: {{ ::name }}</div>')($rootScope);
          expect($rootScope.$$watchers.length).toBe(2);
          $rootScope.$digest();
          expect(element.text()).toEqual('text: angular');
          expect(element.attr('name')).toEqual('attr: angular');
          expect($rootScope.$$watchers.length).toBe(0);
          $rootScope.name = 'not-angular';
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

    it('should allow the attribute to be removed before the attribute interpolation', function() {
       module(function() {
         directive('removeAttr', function() {
           return {
             restrict:'A',
             compile: function(tElement, tAttr) {
               tAttr.$set('removeAttr', null);
             }
           };
         });
       });
       inject(function($rootScope, $compile) {
         expect(function() {
           element = $compile('<div remove-attr="{{ toBeRemoved }}"></div>')($rootScope);
         }).not.toThrow();
         expect(element.attr('remove-attr')).toBeUndefined();
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

    describe('decorating with binding info', function() {

      it('should not occur if `debugInfoEnabled` is false', function() {
        module(function($compileProvider) {
          $compileProvider.debugInfoEnabled(false);
        });

        inject(function($compile, $rootScope) {
          element = $compile('<div>{{1+2}}</div>')($rootScope);
          expect(element.hasClass('ng-binding')).toBe(false);
          expect(element.data('$binding')).toBeUndefined();
        });
      });


      it('should occur if `debugInfoEnabled` is true', function() {
        module(function($compileProvider) {
          $compileProvider.debugInfoEnabled(true);
        });

        inject(function($compile, $rootScope) {
          element = $compile('<div>{{1+2}}</div>')($rootScope);
          expect(element.hasClass('ng-binding')).toBe(true);
          expect(element.data('$binding')).toEqual(['1+2']);
        });
      });
    });

    it('should observe interpolated attrs', inject(function($rootScope, $compile) {
      $compile('<div some-attr="{{value}}" observer></div>')($rootScope);

      // should be async
      expect(observeSpy).not.toHaveBeenCalled();

      $rootScope.$apply(function() {
        $rootScope.value = 'bound-value';
      });
      expect(observeSpy).toHaveBeenCalledOnceWith('bound-value');
    }));


    it('should return a deregistration function while observing an attribute', inject(function($rootScope, $compile) {
      $compile('<div some-attr="{{value}}" observer></div>')($rootScope);

      $rootScope.$apply('value = "first-value"');
      expect(observeSpy).toHaveBeenCalledWith('first-value');

      deregisterObserver();
      $rootScope.$apply('value = "new-value"');
      expect(observeSpy).not.toHaveBeenCalledWith('new-value');
    }));


    it('should set interpolated attrs to initial interpolation value', inject(function($rootScope, $compile) {
      // we need the interpolated attributes to be initialized so that linking fn in a component
      // can access the value during link
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


    it('should call observer only when the attribute value changes', function() {
      module(function() {
        directive('observingDirective', function() {
          return {
            restrict: 'E',
            scope: { someAttr: '@' }
          };
        });
      });
      inject(function($rootScope, $compile) {
        $compile('<observing-directive observer></observing-directive>')($rootScope);
        $rootScope.$digest();
        expect(observeSpy).not.toHaveBeenCalledWith(undefined);
      });
    });


    it('should delegate exceptions to $exceptionHandler', function() {
      observeSpy = jasmine.createSpy('$observe attr').and.throwError('ERROR');

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
        expect(observeSpy).toHaveBeenCalledTimes(2);
        expect($exceptionHandler.errors).toEqual([new Error('ERROR'), new Error('ERROR')]);
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


    it('should handle consecutive text elements as a single text element', inject(function($rootScope, $compile) {
      // No point it running the test, if there is no MutationObserver
      if (!window.MutationObserver) return;

      // Create and register the MutationObserver
      var observer = new window.MutationObserver(noop);
      observer.observe(document.body, {childList: true, subtree: true});

      // Run the actual test
      var base = jqLite('<div>&mdash; {{ "This doesn\'t." }}</div>');
      element = $compile(base)($rootScope);
      $rootScope.$digest();
      expect(element.text()).toBe('— This doesn\'t.');

      // Unregister the MutationObserver (and hope it doesn't mess up with subsequent tests)
      observer.disconnect();
    }));


    it('should not process text nodes merged into their sibling', inject(function($compile, $rootScope) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode('1{{ value }}'));
      div.appendChild(document.createTextNode('2{{ value }}'));
      div.appendChild(document.createTextNode('3{{ value }}'));

      element = jqLite(div.childNodes);

      var initialWatcherCount = $rootScope.$countWatchers();
      $compile(element)($rootScope);
      $rootScope.$apply('value = 0');
      var newWatcherCount = $rootScope.$countWatchers() - initialWatcherCount;

      expect(element.text()).toBe('102030');
      expect(newWatcherCount).toBe(3);

      dealoc(div);
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


    it('should support custom start interpolation symbol, even when `endSymbol` doesn\'t change',
      function() {
        module(function($compileProvider, $interpolateProvider) {
          $interpolateProvider.startSymbol('[[');
          $compileProvider.directive('myDirective', function() {
            return {
              template: '<span>{{ hello }}|{{ hello | uppercase }}</span>'
            };
          });
        });

        inject(function($compile, $rootScope) {
          var tmpl = '<div>[[ hello | uppercase }}|<div my-directive></div></div>';
          element = $compile(tmpl)($rootScope);

          $rootScope.hello = 'ahoj';
          $rootScope.$digest();

          expect(element.text()).toBe('AHOJ|ahoj|AHOJ');
        });
      }
    );


    it('should support custom end interpolation symbol, even when `startSymbol` doesn\'t change',
      function() {
        module(function($compileProvider, $interpolateProvider) {
          $interpolateProvider.endSymbol(']]');
          $compileProvider.directive('myDirective', function() {
            return {
              template: '<span>{{ hello }}|{{ hello | uppercase }}</span>'
            };
          });
        });

        inject(function($compile, $rootScope) {
          var tmpl = '<div>{{ hello | uppercase ]]|<div my-directive></div></div>';
          element = $compile(tmpl)($rootScope);

          $rootScope.hello = 'ahoj';
          $rootScope.$digest();

          expect(element.text()).toBe('AHOJ|ahoj|AHOJ');
        });
      }
    );


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

  describe('collector', function() {

    var collected;
    beforeEach(module(function($compileProvider) {
      collected = false;
      $compileProvider.directive('testCollect', function() {
        return {
          restrict: 'EACM',
          link: function() {
            collected = true;
          }
        };
      });
    }));

    it('should collect comment directives by default', inject(function() {
      var html = '<!-- directive: test-collect -->';
      element = $compile('<div>' + html + '</div>')($rootScope);
      expect(collected).toBe(true);
    }));

    it('should collect css class directives by default', inject(function() {
      element = $compile('<div class="test-collect"></div>')($rootScope);
      expect(collected).toBe(true);
    }));

    forEach([
      {commentEnabled: true, cssEnabled: true},
      {commentEnabled: true, cssEnabled: false},
      {commentEnabled: false, cssEnabled: true},
      {commentEnabled: false, cssEnabled: false}
    ], function(config) {
      describe('commentDirectivesEnabled(' + config.commentEnabled + ') ' +
               'cssClassDirectivesEnabled(' + config.cssEnabled + ')', function() {

        beforeEach(module(function($compileProvider) {
          $compileProvider.commentDirectivesEnabled(config.commentEnabled);
          $compileProvider.cssClassDirectivesEnabled(config.cssEnabled);
        }));

        var $compile, $rootScope;
        beforeEach(inject(function(_$compile_,_$rootScope_) {
          $compile = _$compile_;
          $rootScope = _$rootScope_;
        }));

        it('should handle comment directives appropriately', function() {
          var html = '<!-- directive: test-collect -->';
          element = $compile('<div>' + html + '</div>')($rootScope);
          expect(collected).toBe(config.commentEnabled);
        });

        it('should handle css directives appropriately', function() {
          element = $compile('<div class="test-collect"></div>')($rootScope);
          expect(collected).toBe(config.cssEnabled);
        });

        it('should not prevent to compile entity directives', function() {
          element = $compile('<test-collect></test-collect>')($rootScope);
          expect(collected).toBe(true);
        });

        it('should not prevent to compile attribute directives', function() {
          element = $compile('<span test-collect></span>')($rootScope);
          expect(collected).toBe(true);
        });

        it('should not prevent to compile interpolated expressions', function() {
          element = $compile('<span>{{"text "+"interpolated"}}</span>')($rootScope);
          $rootScope.$apply();
          expect(element.text()).toBe('text interpolated');
        });

        it('should interpolate expressions inside class attribute', function() {
          $rootScope.interpolateMe = 'interpolated';
          var html = '<div class="{{interpolateMe}}"></div>';
          element = $compile(html)($rootScope);
          $rootScope.$apply();
          expect(element).toHaveClass('interpolated');
        });
      });
    });

    it('should configure comment directives true by default',
      module(function($compileProvider) {
        var commentDirectivesEnabled = $compileProvider.commentDirectivesEnabled();
        expect(commentDirectivesEnabled).toBe(true);
      })
    );

    it('should return self when setting commentDirectivesEnabled',
      module(function($compileProvider) {
        var self = $compileProvider.commentDirectivesEnabled(true);
        expect(self).toBe($compileProvider);
      })
    );

    it('should cache commentDirectivesEnabled value when configure ends', function() {
      var $compileProvider;
      module(function(_$compileProvider_) {
        $compileProvider = _$compileProvider_;
        $compileProvider.commentDirectivesEnabled(false);
      });

      inject(function($compile, $rootScope) {
        $compileProvider.commentDirectivesEnabled(true);
        var html = '<!-- directive: test-collect -->';
        element = $compile('<div>' + html + '</div>')($rootScope);
        expect(collected).toBe(false);
      });
    });

    it('should configure css class directives true by default',
      module(function($compileProvider) {
        var cssClassDirectivesEnabled = $compileProvider.cssClassDirectivesEnabled();
        expect(cssClassDirectivesEnabled).toBe(true);
      })
    );

    it('should return self when setting cssClassDirectivesEnabled',
      module(function($compileProvider) {
        var self = $compileProvider.cssClassDirectivesEnabled(true);
        expect(self).toBe($compileProvider);
      })
    );

    it('should cache cssClassDirectivesEnabled value when configure ends', function() {
      var $compileProvider;
      module(function(_$compileProvider_) {
        $compileProvider = _$compileProvider_;
        $compileProvider.cssClassDirectivesEnabled(false);
      });

      inject(function($compile, $rootScope) {
        $compileProvider.cssClassDirectivesEnabled(true);
        element = $compile('<div class="test-collect"></div>')($rootScope);
        expect(collected).toBe(false);
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


    it('should not store linkingFns for noop branches', inject(function($rootScope, $compile) {
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
            attrs.$observe('testLink', function(val) {
              scope.testAttr = val;
            });
          }
        }));
      });
      inject(function($compile, $rootScope, $templateCache) {
        $templateCache.put('test-link.html', '{{testAttr}}');
        element = $compile('<div test-link="{{1+2}}"></div>')($rootScope);
        $rootScope.$apply();
        expect(element.text()).toBe('3');
      });
    });

    it('should throw multilink error when linking the same element more then once', function() {
      var linker = $compile('<div>');
      linker($rootScope).remove();
      expect(function() {
        linker($rootScope);
      }).toThrowMinErr('$compile', 'multilink', 'This element has already been linked.');
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
        element = $compile('<div><div ng-repeat="i in items">' +
                              '<span some="id_{{i.id}}" observer></span>' +
                           '</div></div>')($rootScope);

        $rootScope.$apply(function() {
          $rootScope.items = [{id: 1}, {id: 2}];
        });

        expect(spies[0]).toHaveBeenCalledOnceWith('id_1');
        expect(spies[1]).toHaveBeenCalledOnceWith('id_2');
        spies[0].calls.reset();
        spies[1].calls.reset();

        $rootScope.$apply(function() {
          $rootScope.items[0].id = 5;
        });

        expect(spies[0]).toHaveBeenCalledOnceWith('id_5');
      });
    });


    describe('$set', function() {
      var attr;
      beforeEach(function() {
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
        expect(element.attr('ng-my-attr')).toBeUndefined();

        attr.$set('ngMyAttr', 'value');
        attr.$set('ngMyAttr', null);
        expect(element.attr('ng-my-attr')).toBeUndefined();
      });


      it('should not set DOM element attr if writeAttr false', function() {
        attr.$set('test', 'value', false);

        expect(element.attr('test')).toBeUndefined();
        expect(attr.test).toBe('value');
      });
    });
  });

  forEach([true, false], function(preAssignBindingsEnabled) {
    describe((preAssignBindingsEnabled ? 'with' : 'without') + ' pre-assigned bindings', function() {
      beforeEach(module(function($compileProvider) {
        $compileProvider.preAssignBindingsEnabled(preAssignBindingsEnabled);
      }));

      describe('controller lifecycle hooks', function() {

        describe('$onInit', function() {

          it('should call `$onInit`, if provided, after all the controllers on the element have been initialized', function() {

            function check() {
              expect(this.element.controller('d1').id).toEqual(1);
              expect(this.element.controller('d2').id).toEqual(2);
            }

            function Controller1($element) { this.id = 1; this.element = $element; }
            Controller1.prototype.$onInit = jasmine.createSpy('$onInit').and.callFake(check);

            function Controller2($element) { this.id = 2; this.element = $element; }
            Controller2.prototype.$onInit = jasmine.createSpy('$onInit').and.callFake(check);

            angular.module('my', [])
              .directive('d1', valueFn({ controller: Controller1 }))
              .directive('d2', valueFn({ controller: Controller2 }));

            module('my');
            inject(function($compile, $rootScope) {
              element = $compile('<div d1 d2></div>')($rootScope);
              expect(Controller1.prototype.$onInit).toHaveBeenCalledOnce();
              expect(Controller2.prototype.$onInit).toHaveBeenCalledOnce();
            });
          });

          it('should continue to trigger other `$onInit` hooks if one throws an error', function() {
            function ThrowingController() {
              this.$onInit = function() {
                throw new Error('bad hook');
              };
            }
            function LoggingController($log) {
              this.$onInit = function() {
                $log.info('onInit');
              };
            }

            angular.module('my', [])
              .component('c1', {
                controller: ThrowingController,
                bindings: {'prop': '<'}
              })
              .component('c2', {
                controller: LoggingController,
                bindings: {'prop': '<'}
              })
              .config(function($exceptionHandlerProvider) {
                // We need to test with the exceptionHandler not rethrowing...
                $exceptionHandlerProvider.mode('log');
              });

            module('my');
            inject(function($compile, $rootScope, $exceptionHandler, $log) {

              // Setup the directive with bindings that will keep updating the bound value forever
              element = $compile('<div><c1 prop="a"></c1><c2 prop="a"></c2>')($rootScope);

              // The first component's error should be logged
              expect($exceptionHandler.errors.pop()).toEqual(new Error('bad hook'));

              // The second component's hook should still be called
              expect($log.info.logs.pop()).toEqual(['onInit']);
            });
          });
        });


        describe('$onDestroy', function() {

          it('should call `$onDestroy`, if provided, on the controller when its scope is destroyed', function() {

            function TestController() { this.count = 0; }
            TestController.prototype.$onDestroy = function() { this.count++; };

            angular.module('my', [])
              .directive('d1', valueFn({ scope: true, controller: TestController }))
              .directive('d2', valueFn({ scope: {}, controller: TestController }))
              .directive('d3', valueFn({ controller: TestController }));

            module('my');
            inject(function($compile, $rootScope) {

              element = $compile('<div><d1 ng-if="show[0]"></d1><d2 ng-if="show[1]"></d2><div ng-if="show[2]"><d3></d3></div></div>')($rootScope);

              $rootScope.$apply('show = [true, true, true]');
              var d1Controller = element.find('d1').controller('d1');
              var d2Controller = element.find('d2').controller('d2');
              var d3Controller = element.find('d3').controller('d3');

              expect([d1Controller.count, d2Controller.count, d3Controller.count]).toEqual([0,0,0]);
              $rootScope.$apply('show = [false, true, true]');
              expect([d1Controller.count, d2Controller.count, d3Controller.count]).toEqual([1,0,0]);
              $rootScope.$apply('show = [false, false, true]');
              expect([d1Controller.count, d2Controller.count, d3Controller.count]).toEqual([1,1,0]);
              $rootScope.$apply('show = [false, false, false]');
              expect([d1Controller.count, d2Controller.count, d3Controller.count]).toEqual([1,1,1]);
            });
          });


          it('should call `$onDestroy` top-down (the same as `scope.$broadcast`)', function() {
            var log = [];
            function ParentController() { log.push('parent created'); }
            ParentController.prototype.$onDestroy = function() { log.push('parent destroyed'); };
            function ChildController() { log.push('child created'); }
            ChildController.prototype.$onDestroy = function() { log.push('child destroyed'); };
            function GrandChildController() { log.push('grand child created'); }
            GrandChildController.prototype.$onDestroy = function() { log.push('grand child destroyed'); };

            angular.module('my', [])
              .directive('parent', valueFn({ scope: true, controller: ParentController }))
              .directive('child', valueFn({ scope: true, controller: ChildController }))
              .directive('grandChild', valueFn({ scope: true, controller: GrandChildController }));

            module('my');
            inject(function($compile, $rootScope) {

              element = $compile('<parent ng-if="show"><child><grand-child></grand-child></child></parent>')($rootScope);
              $rootScope.$apply('show = true');
              expect(log).toEqual(['parent created', 'child created', 'grand child created']);
              log = [];
              $rootScope.$apply('show = false');
              expect(log).toEqual(['parent destroyed', 'child destroyed', 'grand child destroyed']);
            });
          });
        });


        describe('$postLink', function() {

          it('should call `$postLink`, if provided, after the element has completed linking (i.e. post-link)', function() {

            var log = [];

            function Controller1() { }
            Controller1.prototype.$postLink = function() { log.push('d1 view init'); };

            function Controller2() { }
            Controller2.prototype.$postLink = function() { log.push('d2 view init'); };

            angular.module('my', [])
              .directive('d1', valueFn({
                controller: Controller1,
                link: { pre: function(s, e) { log.push('d1 pre: ' + e.text()); }, post: function(s, e) { log.push('d1 post: ' + e.text()); } },
                template: '<d2></d2>'
              }))
              .directive('d2', valueFn({
                controller: Controller2,
                link: { pre: function(s, e) { log.push('d2 pre: ' + e.text()); }, post: function(s, e) { log.push('d2 post: ' + e.text()); } },
                template: 'loaded'
              }));

            module('my');
            inject(function($compile, $rootScope) {
              element = $compile('<d1></d1>')($rootScope);
              expect(log).toEqual([
                'd1 pre: loaded',
                'd2 pre: loaded',
                'd2 post: loaded',
                'd2 view init',
                'd1 post: loaded',
                'd1 view init'
              ]);
            });
          });
        });

        describe('$doCheck', function() {
          it('should call `$doCheck`, if provided, for each digest cycle, after $onChanges and $onInit', function() {
            var log = [];

            function TestController() { }
            TestController.prototype.$doCheck = function() { log.push('$doCheck'); };
            TestController.prototype.$onChanges = function() { log.push('$onChanges'); };
            TestController.prototype.$onInit = function() { log.push('$onInit'); };

            angular.module('my', [])
              .component('dcc', {
                controller: TestController,
                bindings: { 'prop1': '<' }
              });

            module('my');
            inject(function($compile, $rootScope) {
              element = $compile('<dcc prop1="val"></dcc>')($rootScope);
              expect(log).toEqual([
                '$onChanges',
                '$onInit',
                '$doCheck'
              ]);

              // Clear log
              log = [];

              $rootScope.$apply();
              expect(log).toEqual([
                '$doCheck',
                '$doCheck'
              ]);

              // Clear log
              log = [];

              $rootScope.$apply('val = 2');
              expect(log).toEqual([
                '$doCheck',
                '$onChanges',
                '$doCheck'
              ]);
            });
          });

          it('should work if $doCheck is provided in the constructor', function() {
            var log = [];

            function TestController() {
              this.$doCheck = function() { log.push('$doCheck'); };
              this.$onChanges = function() { log.push('$onChanges'); };
              this.$onInit = function() { log.push('$onInit'); };
            }

            angular.module('my', [])
              .component('dcc', {
                controller: TestController,
                bindings: { 'prop1': '<' }
              });

            module('my');
            inject(function($compile, $rootScope) {
              element = $compile('<dcc prop1="val"></dcc>')($rootScope);
              expect(log).toEqual([
                '$onChanges',
                '$onInit',
                '$doCheck'
              ]);

              // Clear log
              log = [];

              $rootScope.$apply();
              expect(log).toEqual([
                '$doCheck',
                '$doCheck'
              ]);

              // Clear log
              log = [];

              $rootScope.$apply('val = 2');
              expect(log).toEqual([
                '$doCheck',
                '$onChanges',
                '$doCheck'
              ]);
            });
          });
        });

        describe('$onChanges', function() {

          it('should call `$onChanges`, if provided, when a one-way (`<`) or interpolation (`@`) bindings are updated', function() {
            var log = [];
            function TestController() { }
            TestController.prototype.$onChanges = function(change) { log.push(change); };

            angular.module('my', [])
              .component('c1', {
                controller: TestController,
                bindings: { 'prop1': '<', 'prop2': '<', 'other': '=', 'attr': '@' }
              });

            module('my');
            inject(function($compile, $rootScope) {
              // Setup a watch to indicate some complicated updated logic
              $rootScope.$watch('val', function(val, oldVal) { $rootScope.val2 = val * 2; });
              // Setup the directive with two bindings
              element = $compile('<c1 prop1="val" prop2="val2" other="val3" attr="{{val4}}"></c1>')($rootScope);

              expect(log).toEqual([
                {
                  prop1: jasmine.objectContaining({currentValue: undefined}),
                  prop2: jasmine.objectContaining({currentValue: undefined}),
                  attr: jasmine.objectContaining({currentValue: ''})
                }
              ]);

              // Clear the initial changes from the log
              log = [];

              // Update val to trigger the onChanges
              $rootScope.$apply('val = 42');

              // Now we should have a single changes entry in the log
              expect(log).toEqual([
                {
                  prop1: jasmine.objectContaining({currentValue: 42}),
                  prop2: jasmine.objectContaining({currentValue: 84})
                }
              ]);

              // Clear the log
              log = [];

              // Update val to trigger the onChanges
              $rootScope.$apply('val = 17');
              // Now we should have a single changes entry in the log
              expect(log).toEqual([
                {
                  prop1: jasmine.objectContaining({previousValue: 42, currentValue: 17}),
                  prop2: jasmine.objectContaining({previousValue: 84, currentValue: 34})
                }
              ]);

              // Clear the log
              log = [];

              // Update val3 to trigger the "other" two-way binding
              $rootScope.$apply('val3 = 63');
              // onChanges should not have been called
              expect(log).toEqual([]);

              // Update val4 to trigger the "attr" interpolation binding
              $rootScope.$apply('val4 = 22');
              // onChanges should not have been called
              expect(log).toEqual([
                {
                  attr: jasmine.objectContaining({previousValue: '', currentValue: '22'})
                }
              ]);
            });
          });


          it('should trigger `$onChanges` even if the inner value already equals the new outer value', function() {
            var log = [];
            function TestController() { }
            TestController.prototype.$onChanges = function(change) { log.push(change); };

            angular.module('my', [])
              .component('c1', {
                controller: TestController,
                bindings: { 'prop1': '<' }
              });

            module('my');
            inject(function($compile, $rootScope) {
              element = $compile('<c1 prop1="val"></c1>')($rootScope);

              $rootScope.$apply('val = 1');
              expect(log.pop()).toEqual({prop1: jasmine.objectContaining({previousValue: undefined, currentValue: 1})});

              element.isolateScope().$ctrl.prop1 = 2;
              $rootScope.$apply('val = 2');
              expect(log.pop()).toEqual({prop1: jasmine.objectContaining({previousValue: 1, currentValue: 2})});
            });
          });


          it('should pass the original value as `previousValue` even if there were multiple changes in a single digest', function() {
            var log = [];
            function TestController() { }
            TestController.prototype.$onChanges = function(change) { log.push(change); };

            angular.module('my', [])
              .component('c1', {
                controller: TestController,
                bindings: { 'prop': '<' }
              });

            module('my');
            inject(function($compile, $rootScope) {
              element = $compile('<c1 prop="a + b"></c1>')($rootScope);

              // We add this watch after the compilation to ensure that it will run after the binding watchers
              // therefore triggering the thing that this test is hoping to enforce
              $rootScope.$watch('a', function(val) { $rootScope.b = val * 2; });

              expect(log).toEqual([{prop: jasmine.objectContaining({currentValue: undefined})}]);

              // Clear the initial values from the log
              log = [];

              // Update val to trigger the onChanges
              $rootScope.$apply('a = 42');
              // Now the change should have the real previous value (undefined), not the intermediate one (42)
              expect(log).toEqual([{prop: jasmine.objectContaining({currentValue: 126})}]);

              // Clear the log
              log = [];

              // Update val to trigger the onChanges
              $rootScope.$apply('a = 7');
              // Now the change should have the real previous value (126), not the intermediate one, (91)
              expect(log).toEqual([{prop: jasmine.objectContaining({previousValue: 126, currentValue: 21})}]);
            });
          });


          it('should trigger an initial onChanges call for each binding with the `isFirstChange()` returning true', function() {
            var log = [];
            function TestController() { }
            TestController.prototype.$onChanges = function(change) { log.push(change); };

            angular.module('my', [])
              .component('c1', {
                controller: TestController,
                bindings: { 'prop': '<', attr: '@' }
              });

            module('my');
            inject(function($compile, $rootScope) {

              $rootScope.$apply('a = 7');
              element = $compile('<c1 prop="a" attr="{{a}}"></c1>')($rootScope);

              expect(log).toEqual([
                {
                  prop: jasmine.objectContaining({currentValue: 7}),
                  attr: jasmine.objectContaining({currentValue: '7'})
                }
              ]);
              expect(log[0].prop.isFirstChange()).toEqual(true);
              expect(log[0].attr.isFirstChange()).toEqual(true);

              log = [];
              $rootScope.$apply('a = 9');
              expect(log).toEqual([
                {
                  prop: jasmine.objectContaining({previousValue: 7, currentValue: 9}),
                  attr: jasmine.objectContaining({previousValue: '7', currentValue: '9'})
                }
              ]);
              expect(log[0].prop.isFirstChange()).toEqual(false);
              expect(log[0].attr.isFirstChange()).toEqual(false);
            });
          });


          it('should trigger an initial onChanges call for each binding even if the hook is defined in the constructor', function() {
            var log = [];
            function TestController() {
              this.$onChanges = function(change) { log.push(change); };
            }

            angular.module('my', [])
              .component('c1', {
                controller: TestController,
                bindings: { 'prop': '<', attr: '@' }
              });

            module('my');
            inject(function($compile, $rootScope) {
              $rootScope.$apply('a = 7');
              element = $compile('<c1 prop="a" attr="{{a}}"></c1>')($rootScope);

              expect(log).toEqual([
                {
                  prop: jasmine.objectContaining({currentValue: 7}),
                  attr: jasmine.objectContaining({currentValue: '7'})
                }
              ]);
              expect(log[0].prop.isFirstChange()).toEqual(true);
              expect(log[0].attr.isFirstChange()).toEqual(true);

              log = [];
              $rootScope.$apply('a = 10');
              expect(log).toEqual([
                {
                  prop: jasmine.objectContaining({previousValue: 7, currentValue: 10}),
                  attr: jasmine.objectContaining({previousValue: '7', currentValue: '10'})
                }
              ]);
              expect(log[0].prop.isFirstChange()).toEqual(false);
              expect(log[0].attr.isFirstChange()).toEqual(false);
            });
          });

          it('should clean up `@`-binding observers when re-assigning bindings', function() {
            var constructorSpy = jasmine.createSpy('constructor');
            var prototypeSpy = jasmine.createSpy('prototype');

            function TestController() {
              return {$onChanges: constructorSpy};
            }
            TestController.prototype.$onChanges = prototypeSpy;

            module(function($compileProvider) {
              $compileProvider.component('test', {
                bindings: {attr: '@'},
                controller: TestController
              });
            });

            inject(function($compile, $rootScope) {
              var template = '<test attr="{{a}}"></test>';
              $rootScope.a = 'foo';

              element = $compile(template)($rootScope);
              $rootScope.$digest();
              expect(constructorSpy).toHaveBeenCalled();
              expect(prototypeSpy).not.toHaveBeenCalled();

              constructorSpy.calls.reset();
              $rootScope.$apply('a = "bar"');
              expect(constructorSpy).toHaveBeenCalled();
              expect(prototypeSpy).not.toHaveBeenCalled();
            });
          });

          it('should not call `$onChanges` twice even when the initial value is `NaN`', function() {
            var onChangesSpy = jasmine.createSpy('$onChanges');

            module(function($compileProvider) {
              $compileProvider.component('test', {
                bindings: {prop: '<', attr: '@'},
                controller: function TestController() {
                  this.$onChanges = onChangesSpy;
                }
              });
            });

            inject(function($compile, $rootScope) {
              var template = '<test prop="a" attr="{{a}}"></test>' +
                             '<test prop="b" attr="{{b}}"></test>';
              $rootScope.a = 'foo';
              $rootScope.b = NaN;

              element = $compile(template)($rootScope);
              $rootScope.$digest();

              expect(onChangesSpy).toHaveBeenCalledTimes(2);
              expect(onChangesSpy.calls.argsFor(0)[0]).toEqual({
                prop: jasmine.objectContaining({currentValue: 'foo'}),
                attr: jasmine.objectContaining({currentValue: 'foo'})
              });
              expect(onChangesSpy.calls.argsFor(1)[0]).toEqual({
                prop: jasmine.objectContaining({currentValue: NaN}),
                attr: jasmine.objectContaining({currentValue: 'NaN'})
              });

              onChangesSpy.calls.reset();
              $rootScope.$apply('a = "bar"; b = 42');

              expect(onChangesSpy).toHaveBeenCalledTimes(2);
              expect(onChangesSpy.calls.argsFor(0)[0]).toEqual({
                prop: jasmine.objectContaining({previousValue: 'foo', currentValue: 'bar'}),
                attr: jasmine.objectContaining({previousValue: 'foo', currentValue: 'bar'})
              });
              expect(onChangesSpy.calls.argsFor(1)[0]).toEqual({
                prop: jasmine.objectContaining({previousValue: NaN, currentValue: 42}),
                attr: jasmine.objectContaining({previousValue: 'NaN', currentValue: '42'})
              });
            });
          });


          it('should only trigger one extra digest however many controllers have changes', function() {
            var log = [];
            function TestController1() { }
            TestController1.prototype.$onChanges = function(change) { log.push(['TestController1', change]); };
            function TestController2() { }
            TestController2.prototype.$onChanges = function(change) { log.push(['TestController2', change]); };

            angular.module('my', [])
              .component('c1', {
                controller: TestController1,
                bindings: {'prop': '<'}
              })
              .component('c2', {
                controller: TestController2,
                bindings: {'prop': '<'}
              });

            module('my');
            inject(function($compile, $rootScope) {

              // Create a watcher to count the number of digest cycles
              var watchCount = 0;
              $rootScope.$watch(function() { watchCount++; });

              // Setup two sibling components with bindings that will change
              element = $compile('<div><c1 prop="val1"></c1><c2 prop="val2"></c2></div>')($rootScope);

              // Clear out initial changes
              log = [];

              // Update val to trigger the onChanges
              $rootScope.$apply('val1 = 42; val2 = 17');

              expect(log).toEqual([
                ['TestController1', {prop: jasmine.objectContaining({currentValue: 42})}],
                ['TestController2', {prop: jasmine.objectContaining({currentValue: 17})}]
              ]);
              // A single apply should only trigger three turns of the digest loop
              expect(watchCount).toEqual(3);
            });
          });


          it('should cope with changes occurring inside `$onChanges()` hooks', function() {
            var log = [];
            function OuterController() {}
            OuterController.prototype.$onChanges = function(change) {
              log.push(['OuterController', change]);
              // Make a change to the inner component
              this.b = this.prop1 * 2;
            };

            function InnerController() { }
            InnerController.prototype.$onChanges = function(change) { log.push(['InnerController', change]); };

            angular.module('my', [])
              .component('outer', {
                controller: OuterController,
                bindings: {'prop1': '<'},
                template: '<inner prop2="$ctrl.b"></inner>'
              })
              .component('inner', {
                controller: InnerController,
                bindings: {'prop2': '<'}
              });

            module('my');
            inject(function($compile, $rootScope) {

              // Setup the directive with two bindings
              element = $compile('<outer prop1="a"></outer>')($rootScope);

              // Clear out initial changes
              log = [];

              // Update val to trigger the onChanges
              $rootScope.$apply('a = 42');

              expect(log).toEqual([
                ['OuterController', {prop1: jasmine.objectContaining({previousValue: undefined, currentValue: 42})}],
                ['InnerController', {prop2: jasmine.objectContaining({previousValue: NaN, currentValue: 84})}]
              ]);
            });
          });


          it('should throw an error if `$onChanges()` hooks are not stable', function() {
            function TestController() {}
            TestController.prototype.$onChanges = function(change) {
              this.onChange();
            };

            angular.module('my', [])
              .component('c1', {
                controller: TestController,
                bindings: {'prop': '<', onChange: '&'}
              });

            module('my');
            inject(function($compile, $rootScope) {

              // Setup the directive with bindings that will keep updating the bound value forever
              element = $compile('<c1 prop="a" on-change="a = -a"></c1>')($rootScope);

              // Update val to trigger the unstable onChanges, which will result in an error
              expect(function() {
                $rootScope.$apply('a = 42');
              }).toThrowMinErr('$compile', 'infchng');

              dealoc(element);
              element = $compile('<c1 prop="b" on-change=""></c1>')($rootScope);
              $rootScope.$apply('b = 24');
              $rootScope.$apply('b = 48');
            });
          });


          it('should log an error if `$onChanges()` hooks are not stable', function() {
            function TestController() {}
            TestController.prototype.$onChanges = function(change) {
              this.onChange();
            };

            angular.module('my', [])
              .component('c1', {
                controller: TestController,
                bindings: {'prop': '<', onChange: '&'}
              })
              .config(function($exceptionHandlerProvider) {
                // We need to test with the exceptionHandler not rethrowing...
                $exceptionHandlerProvider.mode('log');
              });

            module('my');
            inject(function($compile, $rootScope, $exceptionHandler) {

              // Setup the directive with bindings that will keep updating the bound value forever
              element = $compile('<c1 prop="a" on-change="a = -a"></c1>')($rootScope);

              // Update val to trigger the unstable onChanges, which will result in an error
              $rootScope.$apply('a = 42');
              expect($exceptionHandler.errors.length).toEqual(1);
              expect($exceptionHandler.errors[0]).
                  toEqualMinErr('$compile', 'infchng', '10 $onChanges() iterations reached.');
            });
          });


          it('should continue to trigger other `$onChanges` hooks if one throws an error', function() {
            function ThrowingController() {
              this.$onChanges = function(change) {
                throw new Error('bad hook');
              };
            }
            function LoggingController($log) {
              this.$onChanges = function(change) {
                $log.info('onChange');
              };
            }

            angular.module('my', [])
              .component('c1', {
                controller: ThrowingController,
                bindings: {'prop': '<'}
              })
              .component('c2', {
                controller: LoggingController,
                bindings: {'prop': '<'}
              })
              .config(function($exceptionHandlerProvider) {
                // We need to test with the exceptionHandler not rethrowing...
                $exceptionHandlerProvider.mode('log');
              });

            module('my');
            inject(function($compile, $rootScope, $exceptionHandler, $log) {

              // Setup the directive with bindings that will keep updating the bound value forever
              element = $compile('<div><c1 prop="a"></c1><c2 prop="a"></c2>')($rootScope);

              // The first component's error should be logged
              expect($exceptionHandler.errors.pop()).toEqual(new Error('bad hook'));

              // The second component's changes should still be called
              expect($log.info.logs.pop()).toEqual(['onChange']);

              $rootScope.$apply('a = 42');

              // The first component's error should be logged
              var errors = $exceptionHandler.errors.pop();
              expect(errors[0]).toEqual(new Error('bad hook'));

              // The second component's changes should still be called
              expect($log.info.logs.pop()).toEqual(['onChange']);
            });
          });


          it('should collect up all `$onChanges` errors into one throw', function() {
            function ThrowingController() {
              this.$onChanges = function(change) {
                throw new Error('bad hook: ' + this.prop);
              };
            }

            angular.module('my', [])
              .component('c1', {
                controller: ThrowingController,
                bindings: {'prop': '<'}
              })
              .config(function($exceptionHandlerProvider) {
                // We need to test with the exceptionHandler not rethrowing...
                $exceptionHandlerProvider.mode('log');
              });

            module('my');
            inject(function($compile, $rootScope, $exceptionHandler, $log) {

              // Setup the directive with bindings that will keep updating the bound value forever
              element = $compile('<div><c1 prop="a"></c1><c1 prop="a * 2"></c1>')($rootScope);

              // Both component's errors should be logged
              expect($exceptionHandler.errors.pop()).toEqual(new Error('bad hook: NaN'));
              expect($exceptionHandler.errors.pop()).toEqual(new Error('bad hook: undefined'));

              $rootScope.$apply('a = 42');

              // Both component's error should be logged
              var errors = $exceptionHandler.errors.pop();
              expect(errors.pop()).toEqual(new Error('bad hook: 84'));
              expect(errors.pop()).toEqual(new Error('bad hook: 42'));
            });
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
                $attrAlias: '@$attr$',
                ref: '=',
                refAlias: '= ref',
                $refAlias: '= $ref$',
                reference: '=',
                optref: '=?',
                optrefAlias: '=? optref',
                $optrefAlias: '=? $optref$',
                optreference: '=?',
                colref: '=*',
                colrefAlias: '=* colref',
                $colrefAlias: '=* $colref$',
                owRef: '<',
                owRefAlias: '< owRef',
                $owRefAlias: '< $owRef$',
                owOptref: '<?',
                owOptrefAlias: '<? owOptref',
                $owOptrefAlias: '<? $owOptref$',
                expr: '&',
                optExpr: '&?',
                exprAlias: '&expr',
                $exprAlias: '&$expr$',
                constructor: '&?'
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


        it('should be able to bind attribute names which are present in Object.prototype', function() {
          module(function() {
            directive('inProtoAttr', valueFn({
              scope: {
                'constructor': '@',
                'toString': '&',

                // Spidermonkey extension, may be obsolete in the future
                'watch': '='
              }
            }));
          });
          inject(function($rootScope) {
            expect(function() {
              compile('<div in-proto-attr constructor="hello, world" watch="[]" ' +
                        'to-string="value = !value"></div>');
            }).not.toThrow();
            var isolateScope = element.isolateScope();

            expect(typeof isolateScope.constructor).toBe('string');
            expect(isArray(isolateScope.watch)).toBe(true);
            expect(typeof isolateScope.toString).toBe('function');
            expect($rootScope.value).toBeUndefined();
            isolateScope.toString();
            expect($rootScope.value).toBe(true);
          });
        });

        it('should be able to interpolate attribute names which are present in Object.prototype', function() {
          var attrs;
          module(function() {
            directive('attrExposer', valueFn({
              link: function($scope, $element, $attrs) {
                attrs = $attrs;
              }
            }));
          });
          inject(function($compile, $rootScope) {
            $compile('<div attr-exposer to-string="{{1 + 1}}">')($rootScope);
            $rootScope.$apply();
            expect(attrs.toString).toBe('2');
          });
        });


        it('should not initialize scope value if optional expression binding is not passed', inject(function($compile) {
          compile('<div my-component></div>');
          var isolateScope = element.isolateScope();
          expect(isolateScope.optExpr).toBeUndefined();
        }));


        it('should not initialize scope value if optional expression binding with Object.prototype name is not passed', inject(function($compile) {
          compile('<div my-component></div>');
          var isolateScope = element.isolateScope();
          expect(isolateScope.constructor).toBe($rootScope.constructor);
        }));


        it('should initialize scope value if optional expression binding is passed', inject(function($compile) {
          compile('<div my-component opt-expr="value = \'did!\'"></div>');
          var isolateScope = element.isolateScope();
          expect(typeof isolateScope.optExpr).toBe('function');
          expect(isolateScope.optExpr()).toBe('did!');
          expect($rootScope.value).toBe('did!');
        }));


        it('should initialize scope value if optional expression binding with Object.prototype name is passed', inject(function($compile) {
          compile('<div my-component constructor="value = \'did!\'"></div>');
          var isolateScope = element.isolateScope();
          expect(typeof isolateScope.constructor).toBe('function');
          expect(isolateScope.constructor()).toBe('did!');
          expect($rootScope.value).toBe('did!');
        }));


        it('should not overwrite @-bound property each digest when not present', function() {
          module(function($compileProvider) {
            $compileProvider.directive('testDir', valueFn({
              scope: {prop: '@'},
              controller: function($scope) {
                $scope.prop = $scope.prop || 'default';
                this.getProp = function() {
                  return $scope.prop;
                };
              },
              controllerAs: 'ctrl',
              template: '<p></p>'
            }));
          });
          inject(function($compile, $rootScope) {
            element = $compile('<div test-dir></div>')($rootScope);
            var scope = element.isolateScope();
            expect(scope.ctrl.getProp()).toBe('default');

            $rootScope.$digest();
            expect(scope.ctrl.getProp()).toBe('default');
          });
        });


        it('should ignore optional "="-bound property if value is the empty string', function() {
          module(function($compileProvider) {
            $compileProvider.directive('testDir', valueFn({
              scope: {prop: '=?'},
              controller: function($scope) {
                $scope.prop = $scope.prop || 'default';
                this.getProp = function() {
                  return $scope.prop;
                };
              },
              controllerAs: 'ctrl',
              template: '<p></p>'
            }));
          });
          inject(function($compile, $rootScope) {
            element = $compile('<div test-dir></div>')($rootScope);
            var scope = element.isolateScope();
            expect(scope.ctrl.getProp()).toBe('default');
            $rootScope.$digest();
            expect(scope.ctrl.getProp()).toBe('default');
            scope.prop = 'foop';
            $rootScope.$digest();
            expect(scope.ctrl.getProp()).toBe('foop');
          });
        });


        describe('bind-once', function() {

          function countWatches(scope) {
            var result = 0;
            while (scope !== null) {
              result += (scope.$$watchers && scope.$$watchers.length) || 0;
              result += countWatches(scope.$$childHead);
              scope = scope.$$nextSibling;
            }
            return result;
          }

          it('should be possible to one-time bind a parameter on a component with a template', function() {
            module(function() {
              directive('otherTplDir', function() {
                return {
                  scope: {param1: '=', param2: '='},
                  template: '1:{{param1}};2:{{param2}};3:{{::param1}};4:{{::param2}}'
                };
              });
            });

            inject(function($rootScope) {
              compile('<div other-tpl-dir param1="::foo" param2="bar"></div>');
              expect(countWatches($rootScope)).toEqual(6); // 4 -> template watch group, 2 -> '='
              $rootScope.$digest();
              expect(element.html()).toBe('1:;2:;3:;4:');
              expect(countWatches($rootScope)).toEqual(6);

              $rootScope.foo = 'foo';
              $rootScope.$digest();
              expect(element.html()).toBe('1:foo;2:;3:foo;4:');
              expect(countWatches($rootScope)).toEqual(4);

              $rootScope.foo = 'baz';
              $rootScope.bar = 'bar';
              $rootScope.$digest();
              expect(element.html()).toBe('1:foo;2:bar;3:foo;4:bar');
              expect(countWatches($rootScope)).toEqual(3);

              $rootScope.bar = 'baz';
              $rootScope.$digest();
              expect(element.html()).toBe('1:foo;2:baz;3:foo;4:bar');
            });
          });

          it('should be possible to one-time bind a parameter on a component with a template', function() {
            module(function() {
              directive('otherTplDir', function() {
                return {
                  scope: {param1: '@', param2: '@'},
                  template: '1:{{param1}};2:{{param2}};3:{{::param1}};4:{{::param2}}'
                };
              });
            });

            inject(function($rootScope) {
              compile('<div other-tpl-dir param1="{{::foo}}" param2="{{bar}}"></div>');
              expect(countWatches($rootScope)).toEqual(6); // 4 -> template watch group, 2 -> {{ }}
              $rootScope.$digest();
              expect(element.html()).toBe('1:;2:;3:;4:');
              expect(countWatches($rootScope)).toEqual(4); // (- 2) -> bind-once in template

              $rootScope.foo = 'foo';
              $rootScope.$digest();
              expect(element.html()).toBe('1:foo;2:;3:;4:');
              expect(countWatches($rootScope)).toEqual(3);

              $rootScope.foo = 'baz';
              $rootScope.bar = 'bar';
              $rootScope.$digest();
              expect(element.html()).toBe('1:foo;2:bar;3:;4:');
              expect(countWatches($rootScope)).toEqual(3);

              $rootScope.bar = 'baz';
              $rootScope.$digest();
              expect(element.html()).toBe('1:foo;2:baz;3:;4:');
            });
          });

          it('should be possible to one-time bind a parameter on a component with a template', function() {
            module(function() {
              directive('otherTplDir', function() {
                return {
                  scope: {param1: '=', param2: '='},
                  templateUrl: 'other.html'
                };
              });
            });

            inject(function($rootScope, $templateCache) {
              $templateCache.put('other.html', '1:{{param1}};2:{{param2}};3:{{::param1}};4:{{::param2}}');
              compile('<div other-tpl-dir param1="::foo" param2="bar"></div>');
              $rootScope.$digest();
              expect(element.html()).toBe('1:;2:;3:;4:');
              expect(countWatches($rootScope)).toEqual(6); // 4 -> template watch group, 2 -> '='

              $rootScope.foo = 'foo';
              $rootScope.$digest();
              expect(element.html()).toBe('1:foo;2:;3:foo;4:');
              expect(countWatches($rootScope)).toEqual(4);

              $rootScope.foo = 'baz';
              $rootScope.bar = 'bar';
              $rootScope.$digest();
              expect(element.html()).toBe('1:foo;2:bar;3:foo;4:bar');
              expect(countWatches($rootScope)).toEqual(3);

              $rootScope.bar = 'baz';
              $rootScope.$digest();
              expect(element.html()).toBe('1:foo;2:baz;3:foo;4:bar');
            });
          });

          it('should be possible to one-time bind a parameter on a component with a template', function() {
            module(function() {
              directive('otherTplDir', function() {
                return {
                  scope: {param1: '@', param2: '@'},
                  templateUrl: 'other.html'
                };
              });
            });

            inject(function($rootScope, $templateCache) {
              $templateCache.put('other.html', '1:{{param1}};2:{{param2}};3:{{::param1}};4:{{::param2}}');
              compile('<div other-tpl-dir param1="{{::foo}}" param2="{{bar}}"></div>');
              $rootScope.$digest();
              expect(element.html()).toBe('1:;2:;3:;4:');
              expect(countWatches($rootScope)).toEqual(4); // (4 - 2) -> template watch group, 2 -> {{ }}

              $rootScope.foo = 'foo';
              $rootScope.$digest();
              expect(element.html()).toBe('1:foo;2:;3:;4:');
              expect(countWatches($rootScope)).toEqual(3);

              $rootScope.foo = 'baz';
              $rootScope.bar = 'bar';
              $rootScope.$digest();
              expect(element.html()).toBe('1:foo;2:bar;3:;4:');
              expect(countWatches($rootScope)).toEqual(3);

              $rootScope.bar = 'baz';
              $rootScope.$digest();
              expect(element.html()).toBe('1:foo;2:baz;3:;4:');
            });
          });

          it('should continue with a digets cycle when there is a two-way binding from the child to the parent', function() {
            module(function() {
              directive('hello', function() {
                return {
                  restrict: 'E',
                  scope: { greeting: '=' },
                  template: '<button ng-click="setGreeting()">Say hi!</button>',
                  link: function(scope) {
                    scope.setGreeting = function() { scope.greeting = 'Hello!'; };
                  }
                };
              });
            });

            inject(function($rootScope) {
              compile('<div>' +
                        '<p>{{greeting}}</p>' +
                        '<div><hello greeting="greeting"></hello></div>' +
                      '</div>');
              $rootScope.$digest();
              browserTrigger(element.find('button'), 'click');
              expect(element.find('p').text()).toBe('Hello!');
            });
          });

        });


        describe('attribute', function() {
          it('should copy simple attribute', inject(function() {
            compile('<div><span my-component attr="some text" $attr$="some other text">');

            expect(componentScope.attr).toEqual('some text');
            expect(componentScope.attrAlias).toEqual('some text');
            expect(componentScope.$attrAlias).toEqual('some other text');
            expect(componentScope.attrAlias).toEqual(componentScope.attr);
          }));

          it('should copy an attribute with spaces', inject(function() {
            compile('<div><span my-component attr=" some text " $attr$=" some other text ">');

            expect(componentScope.attr).toEqual(' some text ');
            expect(componentScope.attrAlias).toEqual(' some text ');
            expect(componentScope.$attrAlias).toEqual(' some other text ');
            expect(componentScope.attrAlias).toEqual(componentScope.attr);
          }));

          it('should set up the interpolation before it reaches the link function', inject(function() {
            $rootScope.name = 'misko';
            compile('<div><span my-component attr="hello {{name}}" $attr$="hi {{name}}">');
            expect(componentScope.attr).toEqual('hello misko');
            expect(componentScope.attrAlias).toEqual('hello misko');
            expect(componentScope.$attrAlias).toEqual('hi misko');
          }));

          it('should update when interpolated attribute updates', inject(function() {
            compile('<div><span my-component attr="hello {{name}}" $attr$="hi {{name}}">');

            $rootScope.name = 'igor';
            $rootScope.$apply();

            expect(componentScope.attr).toEqual('hello igor');
            expect(componentScope.attrAlias).toEqual('hello igor');
            expect(componentScope.$attrAlias).toEqual('hi igor');
          }));
        });


        describe('object reference', function() {
          it('should update local when origin changes', inject(function() {
            compile('<div><span my-component ref="name" $ref$="name">');
            expect(componentScope.ref).toBeUndefined();
            expect(componentScope.refAlias).toBe(componentScope.ref);
            expect(componentScope.$refAlias).toBe(componentScope.ref);

            $rootScope.name = 'misko';
            $rootScope.$apply();

            expect($rootScope.name).toBe('misko');
            expect(componentScope.ref).toBe('misko');
            expect(componentScope.refAlias).toBe('misko');
            expect(componentScope.$refAlias).toBe('misko');

            $rootScope.name = {};
            $rootScope.$apply();
            expect(componentScope.ref).toBe($rootScope.name);
            expect(componentScope.refAlias).toBe($rootScope.name);
            expect(componentScope.$refAlias).toBe($rootScope.name);
          }));


          it('should update local when both change', inject(function() {
            compile('<div><span my-component ref="name" $ref$="name">');
            $rootScope.name = {mark:123};
            componentScope.ref = 'misko';

            $rootScope.$apply();
            expect($rootScope.name).toEqual({mark:123});
            expect(componentScope.ref).toBe($rootScope.name);
            expect(componentScope.refAlias).toBe($rootScope.name);
            expect(componentScope.$refAlias).toBe($rootScope.name);

            $rootScope.name = 'igor';
            componentScope.ref = {};
            $rootScope.$apply();
            expect($rootScope.name).toEqual('igor');
            expect(componentScope.ref).toBe($rootScope.name);
            expect(componentScope.refAlias).toBe($rootScope.name);
            expect(componentScope.$refAlias).toBe($rootScope.name);
          }));

          it('should not break if local and origin both change to the same value', inject(function() {
            $rootScope.name = 'aaa';

            compile('<div><span my-component ref="name">');

            //change both sides to the same item within the same digest cycle
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
            expect(function() { $rootScope.$apply(); }).
                toThrowMinErr('$compile', 'nonassign', 'Expression \'\'hello \' + name\' in attribute \'ref\' used with directive \'myComponent\' is non-assignable!');
            expect(componentScope.ref).toBe('hello world');
            // reset since the exception was rethrown which prevented phase clearing
            $rootScope.$$phase = null;

            $rootScope.name = 'misko';
            $rootScope.$apply();
            expect(componentScope.ref).toBe('hello misko');
          }));

          it('should complain if assigning to undefined', inject(function() {
            compile('<div><span my-component>');
            $rootScope.$apply();
            expect(componentScope.ref).toBeUndefined();

            componentScope.ref = 'ignore me';
            expect(function() { $rootScope.$apply(); }).
                toThrowMinErr('$compile', 'nonassign', 'Expression \'undefined\' in attribute \'ref\' used with directive \'myComponent\' is non-assignable!');
            expect(componentScope.ref).toBeUndefined();

            $rootScope.$$phase = null; // reset since the exception was rethrown which prevented phase clearing
            $rootScope.$apply();
            expect(componentScope.ref).toBeUndefined();
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
              }).toThrowMinErr('$compile', 'nonassign', 'Expression \'{name: name}\' in attribute \'reference\' used with directive \'myComponent\' is non-assignable!');

            }));

            it('should work for primitive literals', inject(function() {
              test('1', 1);
              test('null', null);
              test('undefined', undefined);
              test('\'someString\'', 'someString');
              test('true', true);

              function test(literalString, literalValue) {
                compile('<div><span my-component reference="' + literalString + '">');

                $rootScope.$apply();
                expect(componentScope.reference).toBe(literalValue);
                dealoc(element);
              }
            }));

          });

        });


        describe('optional object reference', function() {
          it('should update local when origin changes', inject(function() {
            compile('<div><span my-component optref="name" $optref$="name">');
            expect(componentScope.optRef).toBeUndefined();
            expect(componentScope.optRefAlias).toBe(componentScope.optRef);
            expect(componentScope.$optRefAlias).toBe(componentScope.optRef);

            $rootScope.name = 'misko';
            $rootScope.$apply();
            expect(componentScope.optref).toBe($rootScope.name);
            expect(componentScope.optrefAlias).toBe($rootScope.name);
            expect(componentScope.$optrefAlias).toBe($rootScope.name);

            $rootScope.name = {};
            $rootScope.$apply();
            expect(componentScope.optref).toBe($rootScope.name);
            expect(componentScope.optrefAlias).toBe($rootScope.name);
            expect(componentScope.$optrefAlias).toBe($rootScope.name);
          }));

          it('should not throw exception when reference does not exist', inject(function() {
            compile('<div><span my-component>');

            expect(componentScope.optref).toBeUndefined();
            expect(componentScope.optrefAlias).toBeUndefined();
            expect(componentScope.$optrefAlias).toBeUndefined();
            expect(componentScope.optreference).toBeUndefined();
          }));
        });


        describe('collection object reference', function() {
          it('should update isolate scope when origin scope changes', inject(function() {
            $rootScope.collection = [{
              name: 'Gabriel',
              value: 18
            }, {
              name: 'Tony',
              value: 91
            }];
            $rootScope.query = '';
            $rootScope.$apply();

            compile('<div><span my-component colref="collection | filter:query" $colref$="collection | filter:query">');

            expect(componentScope.colref).toEqual($rootScope.collection);
            expect(componentScope.colrefAlias).toEqual(componentScope.colref);
            expect(componentScope.$colrefAlias).toEqual(componentScope.colref);

            $rootScope.query = 'Gab';
            $rootScope.$apply();

            expect(componentScope.colref).toEqual([$rootScope.collection[0]]);
            expect(componentScope.colrefAlias).toEqual([$rootScope.collection[0]]);
            expect(componentScope.$colrefAlias).toEqual([$rootScope.collection[0]]);
          }));

          it('should update origin scope when isolate scope changes', inject(function() {
            $rootScope.collection = [{
              name: 'Gabriel',
              value: 18
            }, {
              name: 'Tony',
              value: 91
            }];

            compile('<div><span my-component colref="collection">');

            var newItem = {
              name: 'Pablo',
              value: 10
            };
            componentScope.colref.push(newItem);
            componentScope.$apply();

            expect($rootScope.collection[2]).toEqual(newItem);
          }));
        });


        describe('one-way binding', function() {
          it('should update isolate when the identity of origin changes', inject(function() {
            compile('<div><span my-component ow-ref="obj" $ow-ref$="obj">');

            expect(componentScope.owRef).toBeUndefined();
            expect(componentScope.owRefAlias).toBe(componentScope.owRef);
            expect(componentScope.$owRefAlias).toBe(componentScope.owRef);

            $rootScope.obj = {value: 'initial'};
            $rootScope.$apply();

            expect($rootScope.obj).toEqual({value: 'initial'});
            expect(componentScope.owRef).toEqual({value: 'initial'});
            expect(componentScope.owRefAlias).toBe(componentScope.owRef);
            expect(componentScope.$owRefAlias).toBe(componentScope.owRef);

            // This changes in both scopes because of reference
            $rootScope.obj.value = 'origin1';
            $rootScope.$apply();
            expect(componentScope.owRef.value).toBe('origin1');
            expect(componentScope.owRefAlias.value).toBe('origin1');
            expect(componentScope.$owRefAlias.value).toBe('origin1');

            componentScope.owRef = {value: 'isolate1'};
            componentScope.$apply();
            expect($rootScope.obj.value).toBe('origin1');

            // Change does not propagate because object identity hasn't changed
            $rootScope.obj.value = 'origin2';
            $rootScope.$apply();
            expect(componentScope.owRef.value).toBe('isolate1');
            expect(componentScope.owRefAlias.value).toBe('origin2');
            expect(componentScope.$owRefAlias.value).toBe('origin2');

            // Change does propagate because object identity changes
            $rootScope.obj = {value: 'origin3'};
            $rootScope.$apply();
            expect(componentScope.owRef.value).toBe('origin3');
            expect(componentScope.owRef).toBe($rootScope.obj);
            expect(componentScope.owRefAlias).toBe($rootScope.obj);
            expect(componentScope.$owRefAlias).toBe($rootScope.obj);
          }));

          it('should update isolate when both change', inject(function() {
            compile('<div><span my-component ow-ref="name" $ow-ref$="name">');

            $rootScope.name = {mark:123};
            componentScope.owRef = 'misko';

            $rootScope.$apply();
            expect($rootScope.name).toEqual({mark:123});
            expect(componentScope.owRef).toBe($rootScope.name);
            expect(componentScope.owRefAlias).toBe($rootScope.name);
            expect(componentScope.$owRefAlias).toBe($rootScope.name);

            $rootScope.name = 'igor';
            componentScope.owRef = {};
            $rootScope.$apply();
            expect($rootScope.name).toEqual('igor');
            expect(componentScope.owRef).toBe($rootScope.name);
            expect(componentScope.owRefAlias).toBe($rootScope.name);
            expect(componentScope.$owRefAlias).toBe($rootScope.name);
          }));

          describe('initialization', function() {
            var component, log;

            beforeEach(function() {
              log = [];
              angular.module('owComponentTest', [])
                .component('owComponent', {
                  bindings: { input: '<' },
                  controller: function() {
                    component = this;
                    this.input = 'constructor';
                    log.push('constructor');

                    this.$onInit = function() {
                      this.input = '$onInit';
                      log.push('$onInit');
                    };

                    this.$onChanges = function(changes) {
                      if (changes.input) {
                        log.push(['$onChanges', copy(changes.input)]);
                      }
                    };
                  }
                });
            });

            it('should not update isolate again after $onInit if outer has not changed', function() {
              module('owComponentTest');
              inject(function() {
                $rootScope.name = 'outer';
                compile('<ow-component input="name"></ow-component>');

                expect($rootScope.name).toEqual('outer');
                expect(component.input).toEqual('$onInit');

                $rootScope.$digest();

                expect($rootScope.name).toEqual('outer');
                expect(component.input).toEqual('$onInit');

                expect(log).toEqual([
                  'constructor',
                  ['$onChanges', jasmine.objectContaining({ currentValue: 'outer' })],
                  '$onInit'
                ]);
              });
            });

            it('should not update isolate again after $onInit if outer object reference has not changed', function() {
              module('owComponentTest');
              inject(function() {
                $rootScope.name = ['outer'];
                compile('<ow-component input="name"></ow-component>');

                expect($rootScope.name).toEqual(['outer']);
                expect(component.input).toEqual('$onInit');

                $rootScope.name[0] = 'inner';
                $rootScope.$digest();

                expect($rootScope.name).toEqual(['inner']);
                expect(component.input).toEqual('$onInit');

                expect(log).toEqual([
                  'constructor',
                  ['$onChanges', jasmine.objectContaining({ currentValue: ['outer'] })],
                  '$onInit'
                ]);
              });
            });

            it('should update isolate again after $onInit if outer object reference changes even if equal', function() {
              module('owComponentTest');
              inject(function() {
                $rootScope.name = ['outer'];
                compile('<ow-component input="name"></ow-component>');

                expect($rootScope.name).toEqual(['outer']);
                expect(component.input).toEqual('$onInit');

                $rootScope.name = ['outer'];
                $rootScope.$digest();

                expect($rootScope.name).toEqual(['outer']);
                expect(component.input).toEqual(['outer']);

                expect(log).toEqual([
                  'constructor',
                  ['$onChanges', jasmine.objectContaining({ currentValue: ['outer'] })],
                  '$onInit',
                  ['$onChanges', jasmine.objectContaining({ previousValue: ['outer'], currentValue: ['outer'] })]
                ]);
              });
            });

            it('should not update isolate again after $onInit if outer is a literal', function() {
              module('owComponentTest');
              inject(function() {
                $rootScope.name = 'outer';
                compile('<ow-component input="[name]"></ow-component>');

                expect(component.input).toEqual('$onInit');

                // No outer change
                $rootScope.$apply('name = "outer"');
                expect(component.input).toEqual('$onInit');

                // Outer change
                $rootScope.$apply('name = "re-outer"');
                expect(component.input).toEqual(['re-outer']);

                expect(log).toEqual([
                  'constructor',
                  [
                    '$onChanges',
                    jasmine.objectContaining({currentValue: ['outer']})
                  ],
                  '$onInit',
                  [
                    '$onChanges',
                    jasmine.objectContaining({previousValue: ['outer'], currentValue: ['re-outer']})
                  ]
                ]);
              });
            });

            it('should update isolate again after $onInit if outer has changed (before initial watchAction call)', function() {
              module('owComponentTest');
              inject(function() {
                $rootScope.name = 'outer1';
                compile('<ow-component input="name"></ow-component>');

                expect(component.input).toEqual('$onInit');
                $rootScope.$apply('name = "outer2"');

                expect($rootScope.name).toEqual('outer2');
                expect(component.input).toEqual('outer2');
                expect(log).toEqual([
                  'constructor',
                  ['$onChanges', jasmine.objectContaining({ currentValue: 'outer1' })],
                  '$onInit',
                  ['$onChanges', jasmine.objectContaining({ currentValue: 'outer2', previousValue: 'outer1' })]
                ]);
              });
            });

            it('should update isolate again after $onInit if outer has changed (before initial watchAction call)', function() {
              angular.module('owComponentTest')
                .directive('changeInput', function() {
                  return function(scope, elem, attrs) {
                    scope.name = 'outer2';
                  };
                });
              module('owComponentTest');
              inject(function() {
                $rootScope.name = 'outer1';
                compile('<ow-component input="name" change-input></ow-component>');

                expect(component.input).toEqual('$onInit');
                $rootScope.$digest();

                expect($rootScope.name).toEqual('outer2');
                expect(component.input).toEqual('outer2');
                expect(log).toEqual([
                  'constructor',
                  ['$onChanges', jasmine.objectContaining({ currentValue: 'outer1' })],
                  '$onInit',
                  ['$onChanges', jasmine.objectContaining({ currentValue: 'outer2', previousValue: 'outer1' })]
                ]);
              });
            });
          });

          it('should not break when isolate and origin both change to the same value', inject(function() {
            $rootScope.name = 'aaa';
            compile('<div><span my-component ow-ref="name">');

            //change both sides to the same item within the same digest cycle
            componentScope.owRef = 'same';
            $rootScope.name = 'same';
            $rootScope.$apply();

            //change origin back to its previous value
            $rootScope.name = 'aaa';
            $rootScope.$apply();

            expect($rootScope.name).toBe('aaa');
            expect(componentScope.owRef).toBe('aaa');
          }));


          it('should not update origin when identity of isolate changes', inject(function() {
            $rootScope.name = {mark:123};
            compile('<div><span my-component ow-ref="name" $ow-ref$="name">');

            expect($rootScope.name).toEqual({mark:123});
            expect(componentScope.owRef).toBe($rootScope.name);
            expect(componentScope.owRefAlias).toBe($rootScope.name);
            expect(componentScope.$owRefAlias).toBe($rootScope.name);

            componentScope.owRef = 'martin';
            $rootScope.$apply();
            expect($rootScope.name).toEqual({mark: 123});
            expect(componentScope.owRef).toBe('martin');
            expect(componentScope.owRefAlias).toEqual({mark: 123});
            expect(componentScope.$owRefAlias).toEqual({mark: 123});
          }));


          it('should update origin when property of isolate object reference changes', inject(function() {
            $rootScope.obj = {mark:123};
            compile('<div><span my-component ow-ref="obj">');

            expect($rootScope.obj).toEqual({mark:123});
            expect(componentScope.owRef).toBe($rootScope.obj);

            componentScope.owRef.mark = 789;
            $rootScope.$apply();
            expect($rootScope.obj).toEqual({mark: 789});
            expect(componentScope.owRef).toBe($rootScope.obj);
          }));


          it('should not throw on non assignable expressions in the parent', inject(function() {
            compile('<div><span my-component ow-ref="\'hello \' + name">');

            $rootScope.name = 'world';
            $rootScope.$apply();
            expect(componentScope.owRef).toBe('hello world');

            componentScope.owRef = 'ignore me';
            expect(componentScope.owRef).toBe('ignore me');
            expect($rootScope.name).toBe('world');

            $rootScope.name = 'misko';
            $rootScope.$apply();
            expect(componentScope.owRef).toBe('hello misko');
          }));


          it('should not throw when assigning to undefined', inject(function() {
            compile('<div><span my-component>');

            expect(componentScope.owRef).toBeUndefined();

            componentScope.owRef = 'ignore me';
            expect(componentScope.owRef).toBe('ignore me');

            $rootScope.$apply();
            expect(componentScope.owRef).toBe('ignore me');
          }));


          it('should update isolate scope when "<"-bound NaN changes', inject(function() {
            $rootScope.num = NaN;
            compile('<div my-component ow-ref="num"></div>');

            var isolateScope = element.isolateScope();
            expect(isolateScope.owRef).toBeNaN();

            $rootScope.num = 64;
            $rootScope.$apply();
            expect(isolateScope.owRef).toBe(64);
          }));


          describe('literal objects', function() {
            it('should copy parent changes', inject(function() {
              compile('<div><span my-component ow-ref="{name: name}">');

              $rootScope.name = 'a';
              $rootScope.$apply();
              expect(componentScope.owRef).toEqual({name: 'a'});

              $rootScope.name = 'b';
              $rootScope.$apply();
              expect(componentScope.owRef).toEqual({name: 'b'});
            }));


            it('should not change the isolated scope when origin does not change', inject(function() {
              compile('<div><span my-component ref="{name: name}">');

              $rootScope.name = 'a';
              $rootScope.$apply();
              var lastComponentValue = componentScope.owRef;
              $rootScope.$apply();
              expect(componentScope.owRef).toBe(lastComponentValue);
            }));


            it('should deep-watch array literals', inject(function() {
              $rootScope.name = 'georgios';
              $rootScope.obj = {name: 'pete'};
              compile('<div><span my-component ow-ref="[{name: name}, obj]">');

              expect(componentScope.owRef).toEqual([{name: 'georgios'}, {name: 'pete'}]);

              $rootScope.name = 'lucas';
              $rootScope.obj = {name: 'martin'};
              $rootScope.$apply();
              expect(componentScope.owRef).toEqual([{name: 'lucas'}, {name: 'martin'}]);
            }));


            it('should deep-watch object literals', inject(function() {
              $rootScope.name = 'georgios';
              $rootScope.obj = {name: 'pete'};
              compile('<div><span my-component ow-ref="{name: name, item: obj}">');

              expect(componentScope.owRef).toEqual({name: 'georgios', item: {name: 'pete'}});

              $rootScope.name = 'lucas';
              $rootScope.obj = {name: 'martin'};
              $rootScope.$apply();
              expect(componentScope.owRef).toEqual({name: 'lucas', item: {name: 'martin'}});
            }));


            it('should not complain when the isolated scope changes', inject(function() {
              compile('<div><span my-component ow-ref="{name: name}">');

              $rootScope.name = 'a';
              $rootScope.$apply();
              componentScope.owRef = {name: 'b'};
              componentScope.$apply();

              expect(componentScope.owRef).toEqual({name: 'b'});
              expect($rootScope.name).toBe('a');

              $rootScope.name = 'c';
              $rootScope.$apply();
              expect(componentScope.owRef).toEqual({name: 'c'});
            }));

            it('should work for primitive literals', inject(function() {
              test('1', 1);
              test('null', null);
              test('undefined', undefined);
              test('\'someString\'', 'someString');
              test('true', true);

              function test(literalString, literalValue) {
                compile('<div><span my-component ow-ref="' + literalString + '">');

                expect(componentScope.owRef).toBe(literalValue);
                dealoc(element);
              }
            }));

            describe('optional one-way binding', function() {
              it('should update local when origin changes', inject(function() {
                compile('<div><span my-component ow-optref="name" $ow-optref$="name">');

                expect(componentScope.owOptref).toBeUndefined();
                expect(componentScope.owOptrefAlias).toBe(componentScope.owOptref);
                expect(componentScope.$owOptrefAlias).toBe(componentScope.owOptref);

                $rootScope.name = 'misko';
                $rootScope.$apply();
                expect(componentScope.owOptref).toBe($rootScope.name);
                expect(componentScope.owOptrefAlias).toBe($rootScope.name);
                expect(componentScope.$owOptrefAlias).toBe($rootScope.name);

                $rootScope.name = {};
                $rootScope.$apply();
                expect(componentScope.owOptref).toBe($rootScope.name);
                expect(componentScope.owOptrefAlias).toBe($rootScope.name);
                expect(componentScope.$owOptrefAlias).toBe($rootScope.name);
              }));

              it('should not throw exception when reference does not exist', inject(function() {
                compile('<div><span my-component>');

                expect(componentScope.owOptref).toBeUndefined();
                expect(componentScope.owOptrefAlias).toBeUndefined();
                expect(componentScope.$owOptrefAlias).toBeUndefined();
              }));
            });
          });
        });

        describe('executable expression', function() {
          it('should allow expression execution with locals', inject(function() {
            compile('<div><span my-component expr="count = count + offset" $expr$="count = count + offset">');
            $rootScope.count = 2;

            expect(typeof componentScope.expr).toBe('function');
            expect(typeof componentScope.exprAlias).toBe('function');
            expect(typeof componentScope.$exprAlias).toBe('function');

            expect(componentScope.expr({offset: 1})).toEqual(3);
            expect($rootScope.count).toEqual(3);

            expect(componentScope.exprAlias({offset: 10})).toEqual(13);
            expect(componentScope.$exprAlias({offset: 10})).toEqual(23);
            expect($rootScope.count).toEqual(23);
          }));
        });

        it('should throw on unknown definition', inject(function() {
          expect(function() {
            compile('<div><span bad-declaration>');
          }).toThrowMinErr('$compile', 'iscp', 'Invalid isolate scope definition for directive \'badDeclaration\'. Definition: {... attr: \'xxx\' ...}');
        }));

        it('should expose a $$isolateBindings property onto the scope', inject(function() {
          compile('<div><span my-component>');

          expect(typeof componentScope.$$isolateBindings).toBe('object');

          expect(componentScope.$$isolateBindings.attr.mode).toBe('@');
          expect(componentScope.$$isolateBindings.attr.attrName).toBe('attr');
          expect(componentScope.$$isolateBindings.attrAlias.attrName).toBe('attr');
          expect(componentScope.$$isolateBindings.$attrAlias.attrName).toBe('$attr$');
          expect(componentScope.$$isolateBindings.ref.mode).toBe('=');
          expect(componentScope.$$isolateBindings.ref.attrName).toBe('ref');
          expect(componentScope.$$isolateBindings.refAlias.attrName).toBe('ref');
          expect(componentScope.$$isolateBindings.$refAlias.attrName).toBe('$ref$');
          expect(componentScope.$$isolateBindings.reference.mode).toBe('=');
          expect(componentScope.$$isolateBindings.reference.attrName).toBe('reference');
          expect(componentScope.$$isolateBindings.owRef.mode).toBe('<');
          expect(componentScope.$$isolateBindings.owRef.attrName).toBe('owRef');
          expect(componentScope.$$isolateBindings.owRefAlias.attrName).toBe('owRef');
          expect(componentScope.$$isolateBindings.$owRefAlias.attrName).toBe('$owRef$');
          expect(componentScope.$$isolateBindings.expr.mode).toBe('&');
          expect(componentScope.$$isolateBindings.expr.attrName).toBe('expr');
          expect(componentScope.$$isolateBindings.exprAlias.attrName).toBe('expr');
          expect(componentScope.$$isolateBindings.$exprAlias.attrName).toBe('$expr$');

          var firstComponentScope = componentScope,
              first$$isolateBindings = componentScope.$$isolateBindings;

          dealoc(element);
          compile('<div><span my-component>');
          expect(componentScope).not.toBe(firstComponentScope);
          expect(componentScope.$$isolateBindings).toBe(first$$isolateBindings);
        }));


        it('should expose isolate scope variables on controller with controllerAs when bindToController is true (template)', function() {
          var controllerCalled = false;
          module(function($compileProvider) {
            $compileProvider.directive('fooDir', valueFn({
              template: '<p>isolate</p>',
              scope: {
                'data': '=dirData',
                'oneway': '<dirData',
                'str': '@dirStr',
                'fn': '&dirFn'
              },
              controller: function($scope) {
                this.check = function() {
                  expect(this.data).toEqualData({
                    'foo': 'bar',
                    'baz': 'biz'
                  });
                  expect(this.oneway).toEqualData({
                    'foo': 'bar',
                    'baz': 'biz'
                  });
                  expect(this.str).toBe('Hello, world!');
                  expect(this.fn()).toBe('called!');
                };
                if (preAssignBindingsEnabled) {
                  this.check();
                } else {
                  this.$onInit = this.check;
                }
                controllerCalled = true;
              },
              controllerAs: 'test',
              bindToController: true
            }));
          });
          inject(function($compile, $rootScope) {
            $rootScope.fn = valueFn('called!');
            $rootScope.whom = 'world';
            $rootScope.remoteData = {
              'foo': 'bar',
              'baz': 'biz'
            };
            element = $compile('<div foo-dir dir-data="remoteData" ' +
                                    'dir-str="Hello, {{whom}}!" ' +
                                    'dir-fn="fn()"></div>')($rootScope);
            expect(controllerCalled).toBe(true);
          });
        });


        it('should not pre-assign bound properties to the controller if `preAssignBindingsEnabled` is disabled', function() {
          var controllerCalled = false, onInitCalled = false;
          module(function($compileProvider) {
            $compileProvider.preAssignBindingsEnabled(false);
            $compileProvider.directive('fooDir', valueFn({
              template: '<p>isolate</p>',
              scope: {
                'data': '=dirData',
                'oneway': '<dirData',
                'str': '@dirStr',
                'fn': '&dirFn'
              },
              controller: function($scope) {
                expect(this.data).toBeUndefined();
                expect(this.oneway).toBeUndefined();
                expect(this.str).toBeUndefined();
                expect(this.fn).toBeUndefined();
                controllerCalled = true;
                this.$onInit = function() {
                  expect(this.data).toEqualData({
                    'foo': 'bar',
                    'baz': 'biz'
                  });
                  expect(this.oneway).toEqualData({
                    'foo': 'bar',
                    'baz': 'biz'
                  });
                  expect(this.str).toBe('Hello, world!');
                  expect(this.fn()).toBe('called!');
                  onInitCalled = true;
                };
              },
              controllerAs: 'test',
              bindToController: true
            }));
          });
          inject(function($compile, $rootScope) {
            $rootScope.fn = valueFn('called!');
            $rootScope.whom = 'world';
            $rootScope.remoteData = {
              'foo': 'bar',
              'baz': 'biz'
            };
            element = $compile('<div foo-dir dir-data="remoteData" ' +
                                    'dir-str="Hello, {{whom}}!" ' +
                                    'dir-fn="fn()"></div>')($rootScope);
            expect(controllerCalled).toBe(true);
            expect(onInitCalled).toBe(true);
          });
        });

        it('should pre-assign bound properties to the controller if `preAssignBindingsEnabled` is enabled', function() {
          var controllerCalled = false, onInitCalled = false;
          module(function($compileProvider) {
            $compileProvider.preAssignBindingsEnabled(true);
            $compileProvider.directive('fooDir', valueFn({
              template: '<p>isolate</p>',
              scope: {
                'data': '=dirData',
                'oneway': '<dirData',
                'str': '@dirStr',
                'fn': '&dirFn'
              },
              controller: function($scope) {
                expect(this.data).toEqualData({
                  'foo': 'bar',
                  'baz': 'biz'
                });
                expect(this.oneway).toEqualData({
                  'foo': 'bar',
                  'baz': 'biz'
                });
                expect(this.str).toBe('Hello, world!');
                expect(this.fn()).toBe('called!');
                controllerCalled = true;
                this.$onInit = function() {
                  onInitCalled = true;
                };
              },
              controllerAs: 'test',
              bindToController: true
            }));
          });
          inject(function($compile, $rootScope) {
            $rootScope.fn = valueFn('called!');
            $rootScope.whom = 'world';
            $rootScope.remoteData = {
              'foo': 'bar',
              'baz': 'biz'
            };
            element = $compile('<div foo-dir dir-data="remoteData" ' +
                                    'dir-str="Hello, {{whom}}!" ' +
                                    'dir-fn="fn()"></div>')($rootScope);
            expect(controllerCalled).toBe(true);
            expect(onInitCalled).toBe(true);
          });
        });

        it('should eventually expose isolate scope variables on ES6 class controller with controllerAs when bindToController is true', function() {
          if (!/chrome/i.test(window.navigator.userAgent)) return;
          var controllerCalled = false;
          // eslint-disable-next-line no-eval
          var Controller = eval(
            'class Foo {\n' +
            '  constructor($scope) {}\n' +
            '  $onInit() { this.check(); }\n' +
            '  check() {\n' +
            '    expect(this.data).toEqualData({\n' +
            '      \'foo\': \'bar\',\n' +
            '      \'baz\': \'biz\'\n' +
            '    });\n' +
            '    expect(this.oneway).toEqualData({\n' +
            '      \'foo\': \'bar\',\n' +
            '      \'baz\': \'biz\'\n' +
            '    });\n' +
            '    expect(this.str).toBe(\'Hello, world!\');\n' +
            '    expect(this.fn()).toBe(\'called!\');\n' +
            '    controllerCalled = true;\n' +
            '  }\n' +
            '}');
          spyOn(Controller.prototype, '$onInit').and.callThrough();

          module(function($compileProvider) {
            $compileProvider.directive('fooDir', valueFn({
              template: '<p>isolate</p>',
              scope: {
                'data': '=dirData',
                'oneway': '<dirData',
                'str': '@dirStr',
                'fn': '&dirFn'
              },
              controller: Controller,
              controllerAs: 'test',
              bindToController: true
            }));
          });
          inject(function($compile, $rootScope) {
            $rootScope.fn = valueFn('called!');
            $rootScope.whom = 'world';
            $rootScope.remoteData = {
              'foo': 'bar',
              'baz': 'biz'
            };
            element = $compile('<div foo-dir dir-data="remoteData" ' +
                                    'dir-str="Hello, {{whom}}!" ' +
                                    'dir-fn="fn()"></div>')($rootScope);
            expect(Controller.prototype.$onInit).toHaveBeenCalled();
            expect(controllerCalled).toBe(true);
          });
        });


        it('should update @-bindings on controller when bindToController and attribute change observed', function() {
          module(function($compileProvider) {
            $compileProvider.directive('atBinding', valueFn({
              template: '<p>{{At.text}}</p>',
              scope: {
                text: '@atBinding'
              },
              controller: function($scope) {},
              bindToController: true,
              controllerAs: 'At'
            }));
          });

          inject(function($compile, $rootScope) {
            element = $compile('<div at-binding="Test: {{text}}"></div>')($rootScope);
            var p = element.find('p');
            $rootScope.$digest();
            expect(p.text()).toBe('Test: ');

            $rootScope.text = 'Kittens';
            $rootScope.$digest();
            expect(p.text()).toBe('Test: Kittens');
          });
        });


        it('should expose isolate scope variables on controller with controllerAs when bindToController is true (templateUrl)', function() {
          var controllerCalled = false;
          module(function($compileProvider) {
            $compileProvider.directive('fooDir', valueFn({
              templateUrl: 'test.html',
              scope: {
                'data': '=dirData',
                'oneway': '<dirData',
                'str': '@dirStr',
                'fn': '&dirFn'
              },
              controller: function($scope) {
                this.check = function() {
                  expect(this.data).toEqualData({
                    'foo': 'bar',
                    'baz': 'biz'
                  });
                  expect(this.oneway).toEqualData({
                    'foo': 'bar',
                    'baz': 'biz'
                  });
                  expect(this.str).toBe('Hello, world!');
                  expect(this.fn()).toBe('called!');
                };
                if (preAssignBindingsEnabled) {
                  this.check();
                } else {
                  this.$onInit = this.check;
                }
                controllerCalled = true;
              },
              controllerAs: 'test',
              bindToController: true
            }));
          });
          inject(function($compile, $rootScope, $templateCache) {
            $templateCache.put('test.html', '<p>isolate</p>');
            $rootScope.fn = valueFn('called!');
            $rootScope.whom = 'world';
            $rootScope.remoteData = {
              'foo': 'bar',
              'baz': 'biz'
            };
            element = $compile('<div foo-dir dir-data="remoteData" ' +
                                    'dir-str="Hello, {{whom}}!" ' +
                                    'dir-fn="fn()"></div>')($rootScope);
            $rootScope.$digest();
            expect(controllerCalled).toBe(true);
          });
        });


        it('should throw noctrl when missing controller', function() {
          module(function($compileProvider) {
            $compileProvider.directive('noCtrl', valueFn({
              templateUrl: 'test.html',
              scope: {
                'data': '=dirData',
                'oneway': '<dirData',
                'str': '@dirStr',
                'fn': '&dirFn'
              },
              controllerAs: 'test',
              bindToController: true
            }));
          });
          inject(function($compile, $rootScope) {
            expect(function() {
              $compile('<div no-ctrl>')($rootScope);
            }).toThrowMinErr('$compile', 'noctrl',
                'Cannot bind to controller without directive \'noCtrl\'s controller.');
          });
        });


        it('should throw badrestrict on first compilation when restrict is invalid', function() {
          module(function($compileProvider, $exceptionHandlerProvider) {
            $compileProvider.directive('invalidRestrictBadString', valueFn({restrict: '"'}));
            $compileProvider.directive('invalidRestrictTrue', valueFn({restrict: true}));
            $compileProvider.directive('invalidRestrictObject', valueFn({restrict: {}}));
            $compileProvider.directive('invalidRestrictNumber', valueFn({restrict: 42}));

            // We need to test with the exceptionHandler not rethrowing...
            $exceptionHandlerProvider.mode('log');
          });

          inject(function($exceptionHandler, $compile, $rootScope) {
            $compile('<div invalid-restrict-true>')($rootScope);
            expect($exceptionHandler.errors.length).toBe(1);
            expect($exceptionHandler.errors[0]).toMatch(/\$compile.*badrestrict.*'true'/);

            $compile('<div invalid-restrict-bad-string>')($rootScope);
            $compile('<div invalid-restrict-bad-string>')($rootScope);
            expect($exceptionHandler.errors.length).toBe(2);
            expect($exceptionHandler.errors[1]).toMatch(/\$compile.*badrestrict.*'"'/);

            $compile('<div invalid-restrict-bad-string invalid-restrict-object>')($rootScope);
            expect($exceptionHandler.errors.length).toBe(3);
            expect($exceptionHandler.errors[2]).toMatch(/\$compile.*badrestrict.*'{}'/);

            $compile('<div invalid-restrict-object invalid-restrict-number>')($rootScope);
            expect($exceptionHandler.errors.length).toBe(4);
            expect($exceptionHandler.errors[3]).toMatch(/\$compile.*badrestrict.*'42'/);
          });
        });


        describe('should bind to controller via object notation', function() {
          var controllerOptions = [{
              description: 'no controller identifier',
              controller: 'myCtrl'
            }, {
              description: '"Ctrl as ident" syntax',
              controller: 'myCtrl as myCtrl'
            }, {
              description: 'controllerAs setting',
              controller: 'myCtrl',
              controllerAs: 'myCtrl'
            }],

            scopeOptions = [{
              description: 'isolate scope',
              scope: {}
            }, {
              description: 'new scope',
              scope: true
            }, {
              description: 'no scope',
              scope: false
            }],

            templateOptions = [{
              description: 'inline template',
              template: '<p>template</p>'
            }, {
              description: 'templateUrl setting',
              templateUrl: 'test.html'
            }, {
              description: 'no template'
            }];

          forEach(controllerOptions, function(controllerOption) {
            forEach(scopeOptions, function(scopeOption) {
              forEach(templateOptions, function(templateOption) {

                var description = [],
                  ddo = {
                    bindToController: {
                      'data': '=dirData',
                      'oneway': '<dirData',
                      'str': '@dirStr',
                      'fn': '&dirFn'
                    }
                  };

                forEach([controllerOption, scopeOption, templateOption], function(option) {
                  description.push(option.description);
                  delete option.description;
                  extend(ddo, option);
                });

                it('(' + description.join(', ') + ')', function() {
                  var controllerCalled = false;
                  module(function($compileProvider, $controllerProvider) {
                    $controllerProvider.register('myCtrl', function() {
                      this.check = function() {
                        expect(this.data).toEqualData({
                          'foo': 'bar',
                          'baz': 'biz'
                        });
                        expect(this.oneway).toEqualData({
                          'foo': 'bar',
                          'baz': 'biz'
                        });
                        expect(this.str).toBe('Hello, world!');
                        expect(this.fn()).toBe('called!');
                      };
                      controllerCalled = true;
                      if (preAssignBindingsEnabled) {
                        this.check();
                      } else {
                        this.$onInit = this.check;
                      }
                    });
                    $compileProvider.directive('fooDir', valueFn(ddo));
                  });
                  inject(function($compile, $rootScope, $templateCache) {
                    $templateCache.put('test.html', '<p>template</p>');
                    $rootScope.fn = valueFn('called!');
                    $rootScope.whom = 'world';
                    $rootScope.remoteData = {
                      'foo': 'bar',
                      'baz': 'biz'
                    };
                    element = $compile('<div foo-dir dir-data="remoteData" ' +
                                      'dir-str="Hello, {{whom}}!" ' +
                                      'dir-fn="fn()"></div>')($rootScope);
                    $rootScope.$digest();
                    expect(controllerCalled).toBe(true);
                    if (ddo.controllerAs || ddo.controller.indexOf(' as ') !== -1) {
                      if (ddo.scope) {
                        expect($rootScope.myCtrl).toBeUndefined();
                      } else {
                        // The controller identifier was added to the containing scope.
                        expect($rootScope.myCtrl).toBeDefined();
                      }
                    }
                  });
                });

              });
            });
          });

        });


        it('should bind to multiple directives controllers via object notation (no scope)', function() {
          var controller1Called = false;
          var controller2Called = false;
          module(function($compileProvider, $controllerProvider) {
            $compileProvider.directive('foo', valueFn({
              bindToController: {
                'data': '=fooData',
                'oneway': '<fooData',
                'str': '@fooStr',
                'fn': '&fooFn'
              },
              controllerAs: 'fooCtrl',
              controller: function() {
                this.check = function() {
                  expect(this.data).toEqualData({'foo': 'bar', 'baz': 'biz'});
                  expect(this.oneway).toEqualData({'foo': 'bar', 'baz': 'biz'});
                  expect(this.str).toBe('Hello, world!');
                  expect(this.fn()).toBe('called!');
                };
                controller1Called = true;
                if (preAssignBindingsEnabled) {
                  this.check();
                } else {
                  this.$onInit = this.check;
                }
              }
            }));
            $compileProvider.directive('bar', valueFn({
              bindToController: {
                'data': '=barData',
                'oneway': '<barData',
                'str': '@barStr',
                'fn': '&barFn'
              },
              controllerAs: 'barCtrl',
              controller: function() {
                this.check = function() {
                  expect(this.data).toEqualData({'foo2': 'bar2', 'baz2': 'biz2'});
                  expect(this.oneway).toEqualData({'foo2': 'bar2', 'baz2': 'biz2'});
                  expect(this.str).toBe('Hello, second world!');
                  expect(this.fn()).toBe('second called!');
                };
                controller2Called = true;
                if (preAssignBindingsEnabled) {
                  this.check();
                } else {
                  this.$onInit = this.check;
                }
              }
            }));
          });
          inject(function($compile, $rootScope) {
            $rootScope.fn = valueFn('called!');
            $rootScope.string = 'world';
            $rootScope.data = {'foo': 'bar','baz': 'biz'};
            $rootScope.fn2 = valueFn('second called!');
            $rootScope.string2 = 'second world';
            $rootScope.data2 = {'foo2': 'bar2', 'baz2': 'biz2'};
            element = $compile(
              '<div ' +
                'foo ' +
                'foo-data="data" ' +
                'foo-str="Hello, {{string}}!" ' +
                'foo-fn="fn()" ' +
                'bar ' +
                'bar-data="data2" ' +
                'bar-str="Hello, {{string2}}!" ' +
                'bar-fn="fn2()" > ' +
              '</div>')($rootScope);
            $rootScope.$digest();
            expect(controller1Called).toBe(true);
            expect(controller2Called).toBe(true);
          });
        });


        it('should bind to multiple directives controllers via object notation (new iso scope)', function() {
          var controller1Called = false;
          var controller2Called = false;
          module(function($compileProvider, $controllerProvider) {
            $compileProvider.directive('foo', valueFn({
              bindToController: {
                'data': '=fooData',
                'oneway': '<fooData',
                'str': '@fooStr',
                'fn': '&fooFn'
              },
              scope: {},
              controllerAs: 'fooCtrl',
              controller: function() {
                this.check = function() {
                  expect(this.data).toEqualData({'foo': 'bar', 'baz': 'biz'});
                  expect(this.oneway).toEqualData({'foo': 'bar', 'baz': 'biz'});
                  expect(this.str).toBe('Hello, world!');
                  expect(this.fn()).toBe('called!');
                };
                controller1Called = true;
                if (preAssignBindingsEnabled) {
                  this.check();
                } else {
                  this.$onInit = this.check;
                }
              }
            }));
            $compileProvider.directive('bar', valueFn({
              bindToController: {
                'data': '=barData',
                'oneway': '<barData',
                'str': '@barStr',
                'fn': '&barFn'
              },
              controllerAs: 'barCtrl',
              controller: function() {
                this.check = function() {
                  expect(this.data).toEqualData({'foo2': 'bar2', 'baz2': 'biz2'});
                  expect(this.oneway).toEqualData({'foo2': 'bar2', 'baz2': 'biz2'});
                  expect(this.str).toBe('Hello, second world!');
                  expect(this.fn()).toBe('second called!');
                };
                controller2Called = true;
                if (preAssignBindingsEnabled) {
                  this.check();
                } else {
                  this.$onInit = this.check;
                }
              }
            }));
          });
          inject(function($compile, $rootScope) {
            $rootScope.fn = valueFn('called!');
            $rootScope.string = 'world';
            $rootScope.data = {'foo': 'bar','baz': 'biz'};
            $rootScope.fn2 = valueFn('second called!');
            $rootScope.string2 = 'second world';
            $rootScope.data2 = {'foo2': 'bar2', 'baz2': 'biz2'};
            element = $compile(
              '<div ' +
                'foo ' +
                'foo-data="data" ' +
                'foo-str="Hello, {{string}}!" ' +
                'foo-fn="fn()" ' +
                'bar ' +
                'bar-data="data2" ' +
                'bar-str="Hello, {{string2}}!" ' +
                'bar-fn="fn2()" > ' +
              '</div>')($rootScope);
            $rootScope.$digest();
            expect(controller1Called).toBe(true);
            expect(controller2Called).toBe(true);
          });
        });


        it('should bind to multiple directives controllers via object notation (new scope)', function() {
          var controller1Called = false;
          var controller2Called = false;
          module(function($compileProvider, $controllerProvider) {
            $compileProvider.directive('foo', valueFn({
              bindToController: {
                'data': '=fooData',
                'oneway': '<fooData',
                'str': '@fooStr',
                'fn': '&fooFn'
              },
              scope: true,
              controllerAs: 'fooCtrl',
              controller: function() {
                this.check = function() {
                  expect(this.data).toEqualData({'foo': 'bar', 'baz': 'biz'});
                  expect(this.oneway).toEqualData({'foo': 'bar', 'baz': 'biz'});
                  expect(this.str).toBe('Hello, world!');
                  expect(this.fn()).toBe('called!');
                };
                controller1Called = true;
                if (preAssignBindingsEnabled) {
                  this.check();
                } else {
                  this.$onInit = this.check;
                }
              }
            }));
            $compileProvider.directive('bar', valueFn({
              bindToController: {
                'data': '=barData',
                'oneway': '<barData',
                'str': '@barStr',
                'fn': '&barFn'
              },
              scope: true,
              controllerAs: 'barCtrl',
              controller: function() {
                this.check = function() {
                  expect(this.data).toEqualData({'foo2': 'bar2', 'baz2': 'biz2'});
                  expect(this.oneway).toEqualData({'foo2': 'bar2', 'baz2': 'biz2'});
                  expect(this.str).toBe('Hello, second world!');
                  expect(this.fn()).toBe('second called!');
                };
                controller2Called = true;
                if (preAssignBindingsEnabled) {
                  this.check();
                } else {
                  this.$onInit = this.check;
                }
              }
            }));
          });
          inject(function($compile, $rootScope) {
            $rootScope.fn = valueFn('called!');
            $rootScope.string = 'world';
            $rootScope.data = {'foo': 'bar','baz': 'biz'};
            $rootScope.fn2 = valueFn('second called!');
            $rootScope.string2 = 'second world';
            $rootScope.data2 = {'foo2': 'bar2', 'baz2': 'biz2'};
            element = $compile(
              '<div ' +
                'foo ' +
                'foo-data="data" ' +
                'foo-str="Hello, {{string}}!" ' +
                'foo-fn="fn()" ' +
                'bar ' +
                'bar-data="data2" ' +
                'bar-str="Hello, {{string2}}!" ' +
                'bar-fn="fn2()" > ' +
              '</div>')($rootScope);
            $rootScope.$digest();
            expect(controller1Called).toBe(true);
            expect(controller2Called).toBe(true);
          });
        });


        it('should evaluate against the correct scope, when using `bindToController` (new scope)',
          function() {
            module(function($compileProvider, $controllerProvider) {
              $controllerProvider.register({
                'ParentCtrl': function() {
                  this.value1 = 'parent1';
                  this.value2 = 'parent2';
                  this.value3 = function() { return 'parent3'; };
                  this.value4 = 'parent4';
                },
                'ChildCtrl': function() {
                  this.value1 = 'child1';
                  this.value2 = 'child2';
                  this.value3 = function() { return 'child3'; };
                  this.value4 = 'child4';
                }
              });

              $compileProvider.directive('child', valueFn({
                scope: true,
                controller: 'ChildCtrl as ctrl',
                bindToController: {
                  fromParent1: '@',
                  fromParent2: '=',
                  fromParent3: '&',
                  fromParent4: '<'
                },
                template: ''
              }));
            });

            inject(function($compile, $rootScope) {
              element = $compile(
                  '<div ng-controller="ParentCtrl as ctrl">' +
                    '<child ' +
                        'from-parent-1="{{ ctrl.value1 }}" ' +
                        'from-parent-2="ctrl.value2" ' +
                        'from-parent-3="ctrl.value3" ' +
                        'from-parent-4="ctrl.value4">' +
                    '</child>' +
                  '</div>')($rootScope);
              $rootScope.$digest();

              var parentCtrl = element.controller('ngController');
              var childCtrl = element.find('child').controller('child');

              expect(childCtrl.fromParent1).toBe(parentCtrl.value1);
              expect(childCtrl.fromParent1).not.toBe(childCtrl.value1);
              expect(childCtrl.fromParent2).toBe(parentCtrl.value2);
              expect(childCtrl.fromParent2).not.toBe(childCtrl.value2);
              expect(childCtrl.fromParent3()()).toBe(parentCtrl.value3());
              expect(childCtrl.fromParent3()()).not.toBe(childCtrl.value3());
              expect(childCtrl.fromParent4).toBe(parentCtrl.value4);
              expect(childCtrl.fromParent4).not.toBe(childCtrl.value4);

              childCtrl.fromParent2 = 'modified';
              $rootScope.$digest();

              expect(parentCtrl.value2).toBe('modified');
              expect(childCtrl.value2).toBe('child2');
            });
          }
        );


        it('should evaluate against the correct scope, when using `bindToController` (new iso scope)',
          function() {
            module(function($compileProvider, $controllerProvider) {
              $controllerProvider.register({
                'ParentCtrl': function() {
                  this.value1 = 'parent1';
                  this.value2 = 'parent2';
                  this.value3 = function() { return 'parent3'; };
                  this.value4 = 'parent4';
                },
                'ChildCtrl': function() {
                  this.value1 = 'child1';
                  this.value2 = 'child2';
                  this.value3 = function() { return 'child3'; };
                  this.value4 = 'child4';
                }
              });

              $compileProvider.directive('child', valueFn({
                scope: {},
                controller: 'ChildCtrl as ctrl',
                bindToController: {
                  fromParent1: '@',
                  fromParent2: '=',
                  fromParent3: '&',
                  fromParent4: '<'
                },
                template: ''
              }));
            });

            inject(function($compile, $rootScope) {
              element = $compile(
                  '<div ng-controller="ParentCtrl as ctrl">' +
                    '<child ' +
                        'from-parent-1="{{ ctrl.value1 }}" ' +
                        'from-parent-2="ctrl.value2" ' +
                        'from-parent-3="ctrl.value3" ' +
                        'from-parent-4="ctrl.value4">' +
                    '</child>' +
                  '</div>')($rootScope);
              $rootScope.$digest();

              var parentCtrl = element.controller('ngController');
              var childCtrl = element.find('child').controller('child');

              expect(childCtrl.fromParent1).toBe(parentCtrl.value1);
              expect(childCtrl.fromParent1).not.toBe(childCtrl.value1);
              expect(childCtrl.fromParent2).toBe(parentCtrl.value2);
              expect(childCtrl.fromParent2).not.toBe(childCtrl.value2);
              expect(childCtrl.fromParent3()()).toBe(parentCtrl.value3());
              expect(childCtrl.fromParent3()()).not.toBe(childCtrl.value3());
              expect(childCtrl.fromParent4).toBe(parentCtrl.value4);
              expect(childCtrl.fromParent4).not.toBe(childCtrl.value4);

              childCtrl.fromParent2 = 'modified';
              $rootScope.$digest();

              expect(parentCtrl.value2).toBe('modified');
              expect(childCtrl.value2).toBe('child2');
            });
          }
        );


        it('should put controller in scope when controller identifier present but not using controllerAs', function() {
          var controllerCalled = false;
          var myCtrl;
          module(function($compileProvider, $controllerProvider) {
            $controllerProvider.register('myCtrl', function() {
              controllerCalled = true;
              myCtrl = this;
            });
            $compileProvider.directive('fooDir', valueFn({
              templateUrl: 'test.html',
              bindToController: {},
              scope: true,
              controller: 'myCtrl as theCtrl'
            }));
          });
          inject(function($compile, $rootScope, $templateCache) {
            $templateCache.put('test.html', '<p>isolate</p>');
            element = $compile('<div foo-dir>')($rootScope);
            $rootScope.$digest();
            expect(controllerCalled).toBe(true);
            var childScope = element.children().scope();
            expect(childScope).not.toBe($rootScope);
            expect(childScope.theCtrl).toBe(myCtrl);
          });
        });


        it('should re-install controllerAs and bindings for returned value from controller (new scope)', function() {
          var controllerCalled = false;
          var myCtrl;

          function MyCtrl() {
          }
          MyCtrl.prototype.test = function() {
            expect(this.data).toEqualData({
              'foo': 'bar',
              'baz': 'biz'
            });
            expect(this.oneway).toEqualData({
              'foo': 'bar',
              'baz': 'biz'
            });
            expect(this.str).toBe('Hello, world!');
            expect(this.fn()).toBe('called!');
          };

          module(function($compileProvider, $controllerProvider) {
            $controllerProvider.register('myCtrl', function() {
              controllerCalled = true;
              myCtrl = this;
              return new MyCtrl();
            });
            $compileProvider.directive('fooDir', valueFn({
              templateUrl: 'test.html',
              bindToController: {
                'data': '=dirData',
                'oneway': '<dirData',
                'str': '@dirStr',
                'fn': '&dirFn'
              },
              scope: true,
              controller: 'myCtrl as theCtrl'
            }));
          });
          inject(function($compile, $rootScope, $templateCache) {
            $templateCache.put('test.html', '<p>isolate</p>');
            $rootScope.fn = valueFn('called!');
            $rootScope.whom = 'world';
            $rootScope.remoteData = {
              'foo': 'bar',
              'baz': 'biz'
            };
            element = $compile('<div foo-dir dir-data="remoteData" ' +
                              'dir-str="Hello, {{whom}}!" ' +
                              'dir-fn="fn()"></div>')($rootScope);
            $rootScope.$digest();
            expect(controllerCalled).toBe(true);
            var childScope = element.children().scope();
            expect(childScope).not.toBe($rootScope);
            expect(childScope.theCtrl).not.toBe(myCtrl);
            expect(childScope.theCtrl.constructor).toBe(MyCtrl);
            childScope.theCtrl.test();
          });
        });


        it('should re-install controllerAs and bindings for returned value from controller (isolate scope)', function() {
          var controllerCalled = false;
          var myCtrl;

          function MyCtrl() {
          }
          MyCtrl.prototype.test = function() {
            expect(this.data).toEqualData({
              'foo': 'bar',
              'baz': 'biz'
            });
            expect(this.oneway).toEqualData({
              'foo': 'bar',
              'baz': 'biz'
            });
            expect(this.str).toBe('Hello, world!');
            expect(this.fn()).toBe('called!');
          };

          module(function($compileProvider, $controllerProvider) {
            $controllerProvider.register('myCtrl', function() {
              controllerCalled = true;
              myCtrl = this;
              return new MyCtrl();
            });
            $compileProvider.directive('fooDir', valueFn({
              templateUrl: 'test.html',
              bindToController: true,
              scope: {
                'data': '=dirData',
                'oneway': '<dirData',
                'str': '@dirStr',
                'fn': '&dirFn'
              },
              controller: 'myCtrl as theCtrl'
            }));
          });
          inject(function($compile, $rootScope, $templateCache) {
            $templateCache.put('test.html', '<p>isolate</p>');
            $rootScope.fn = valueFn('called!');
            $rootScope.whom = 'world';
            $rootScope.remoteData = {
              'foo': 'bar',
              'baz': 'biz'
            };
            element = $compile('<div foo-dir dir-data="remoteData" ' +
            'dir-str="Hello, {{whom}}!" ' +
            'dir-fn="fn()"></div>')($rootScope);
            $rootScope.$digest();
            expect(controllerCalled).toBe(true);
            var childScope = element.children().scope();
            expect(childScope).not.toBe($rootScope);
            expect(childScope.theCtrl).not.toBe(myCtrl);
            expect(childScope.theCtrl.constructor).toBe(MyCtrl);
            childScope.theCtrl.test();
          });
        });

        describe('should not overwrite @-bound property each digest when not present', function() {
          it('when creating new scope', function() {
            module(function($compileProvider) {
              $compileProvider.directive('testDir', valueFn({
                scope: true,
                bindToController: {
                  prop: '@'
                },
                controller: function() {
                  var self = this;
                  this.initProp = function() {
                    this.prop = this.prop || 'default';
                  };
                  if (preAssignBindingsEnabled) {
                    this.initProp();
                  } else {
                    this.$onInit = this.initProp;
                  }
                  this.getProp = function() {
                    return self.prop;
                  };
                },
                controllerAs: 'ctrl',
                template: '<p></p>'
              }));
            });
            inject(function($compile, $rootScope) {
              element = $compile('<div test-dir></div>')($rootScope);
              var scope = element.scope();
              expect(scope.ctrl.getProp()).toBe('default');

              $rootScope.$digest();
              expect(scope.ctrl.getProp()).toBe('default');
            });
          });

          it('when creating isolate scope', function() {
            module(function($compileProvider) {
              $compileProvider.directive('testDir', valueFn({
                scope: {},
                bindToController: {
                  prop: '@'
                },
                controller: function() {
                  var self = this;
                  this.initProp = function() {
                    this.prop = this.prop || 'default';
                  };
                  this.getProp = function() {
                    return self.prop;
                  };
                  if (preAssignBindingsEnabled) {
                    this.initProp();
                  } else {
                    this.$onInit = this.initProp;
                  }
                },
                controllerAs: 'ctrl',
                template: '<p></p>'
              }));
            });
            inject(function($compile, $rootScope) {
              element = $compile('<div test-dir></div>')($rootScope);
              var scope = element.isolateScope();
              expect(scope.ctrl.getProp()).toBe('default');

              $rootScope.$digest();
              expect(scope.ctrl.getProp()).toBe('default');
            });
          });
        });

      });

      describe('require', function() {

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


        it('should respect explicit return value from controller', function() {
          var expectedController;
          module(function() {
            directive('logControllerProp', function(log) {
              return {
                controller: function($scope) {
                  this.foo = 'baz'; // value should not be used.
                  expectedController = {foo: 'bar'};
                  return expectedController;
                },
                link: function(scope, element, attrs, controller) {
                  expect(expectedController).toBeDefined();
                  expect(controller).toBe(expectedController);
                  expect(controller.foo).toBe('bar');
                  log('done');
                }
              };
            });
          });
          inject(function(log, $compile, $rootScope) {
            element = $compile('<log-controller-prop></log-controller-prop>')($rootScope);
            expect(log).toEqual('done');
            expect(element.data('$logControllerPropController')).toBe(expectedController);
          });
        });


        it('should get explicit return value of required parent controller', function() {
          var expectedController;
          module(function() {
            directive('nested', function(log) {
              return {
                require: '^^?nested',
                controller: function() {
                  if (!expectedController) expectedController = {foo: 'bar'};
                  return expectedController;
                },
                link: function(scope, element, attrs, controller) {
                  if (element.parent().length) {
                    expect(expectedController).toBeDefined();
                    expect(controller).toBe(expectedController);
                    expect(controller.foo).toBe('bar');
                    log('done');
                  }
                }
              };
            });
          });
          inject(function(log, $compile, $rootScope) {
            element = $compile('<div nested><div nested></div></div>')($rootScope);
            expect(log).toEqual('done');
            expect(element.data('$nestedController')).toBe(expectedController);
          });
        });


        it('should respect explicit controller return value when using controllerAs', function() {
          module(function() {
            directive('main', function() {
              return {
                templateUrl: 'main.html',
                scope: {},
                controller: function() {
                  this.name = 'lucas';
                  return {name: 'george'};
                },
                controllerAs: 'mainCtrl'
              };
            });
          });
          inject(function($templateCache, $compile, $rootScope) {
            $templateCache.put('main.html', '<span>template:{{mainCtrl.name}}</span>');
            element = $compile('<main/>')($rootScope);
            $rootScope.$apply();
            expect(element.text()).toBe('template:george');
          });
        });


        it('transcluded children should receive explicit return value of parent controller', function() {
          var expectedController;
          module(function() {
            directive('nester', valueFn({
              transclude: true,
              controller: function($transclude) {
                this.foo = 'baz';
                expectedController = {transclude:$transclude, foo: 'bar'};
                return expectedController;
              },
              link: function(scope, el, attr, ctrl) {
                ctrl.transclude(cloneAttach);
                function cloneAttach(clone) {
                  el.append(clone);
                }
              }
            }));
            directive('nested', function(log) {
              return {
                require: '^^nester',
                link: function(scope, element, attrs, controller) {
                  expect(controller).toBeDefined();
                  expect(controller).toBe(expectedController);
                  log('done');
                }
              };
            });
          });
          inject(function(log, $compile) {
            element = $compile('<div nester><div nested></div></div>')($rootScope);
            $rootScope.$apply();
            expect(log.toString()).toBe('done');
            expect(element.data('$nesterController')).toBe(expectedController);
          });
        });


        it('explicit controller return values are ignored if they are primitives', function() {
          module(function() {
            directive('logControllerProp', function(log) {
              return {
                controller: function($scope) {
                  this.foo = 'baz'; // value *will* be used.
                  return 'bar';
                },
                link: function(scope, element, attrs, controller) {
                  log(controller.foo);
                }
              };
            });
          });
          inject(function(log, $compile, $rootScope) {
            element = $compile('<log-controller-prop></log-controller-prop>')($rootScope);
            expect(log).toEqual('baz');
            expect(element.data('$logControllerPropController').foo).toEqual('baz');
          });
        });


        it('should correctly assign controller return values for multiple directives', function() {
          var directiveController, otherDirectiveController;
          module(function() {

            directive('myDirective', function(log) {
              return {
                scope: true,
                controller: function($scope) {
                  directiveController = {
                    foo: 'bar'
                  };
                  return directiveController;
                }
              };
            });

            directive('myOtherDirective', function(log) {
              return {
                controller: function($scope) {
                  otherDirectiveController = {
                    baz: 'luh'
                  };
                  return otherDirectiveController;
                }
              };
            });

          });

          inject(function(log, $compile, $rootScope) {
            element = $compile('<my-directive my-other-directive></my-directive>')($rootScope);
            expect(element.data('$myDirectiveController')).toBe(directiveController);
            expect(element.data('$myOtherDirectiveController')).toBe(otherDirectiveController);
          });
        });


        it('should get required parent controller', function() {
          module(function() {
            directive('nested', function(log) {
              return {
                require: '^^?nested',
                controller: function($scope) {},
                link: function(scope, element, attrs, controller) {
                  log(!!controller);
                }
              };
            });
          });
          inject(function(log, $compile, $rootScope) {
            element = $compile('<div nested><div nested></div></div>')($rootScope);
            expect(log).toEqual('true; false');
          });
        });


        it('should get required parent controller when the question mark precedes the ^^', function() {
          module(function() {
            directive('nested', function(log) {
              return {
                require: '?^^nested',
                controller: function($scope) {},
                link: function(scope, element, attrs, controller) {
                  log(!!controller);
                }
              };
            });
          });
          inject(function(log, $compile, $rootScope) {
            element = $compile('<div nested><div nested></div></div>')($rootScope);
            expect(log).toEqual('true; false');
          });
        });


        it('should throw if required parent is not found', function() {
          module(function() {
            directive('nested', function() {
              return {
                require: '^^nested',
                controller: function($scope) {},
                link: function(scope, element, attrs, controller) {}
              };
            });
          });
          inject(function($compile, $rootScope) {
            expect(function() {
              element = $compile('<div nested></div>')($rootScope);
            }).toThrowMinErr('$compile', 'ctreq', 'Controller \'nested\', required by directive \'nested\', can\'t be found!');
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

        it('should bind the required controllers to the directive controller, if provided as an object and bindToController is truthy', function() {
          var parentController, siblingController;

          function ParentController() { this.name = 'Parent'; }
          function SiblingController() { this.name = 'Sibling'; }
          function MeController() { this.name = 'Me'; }
          MeController.prototype.$onInit = function() {
            parentController = this.container;
            siblingController = this.friend;
          };
          spyOn(MeController.prototype, '$onInit').and.callThrough();

          angular.module('my', [])
            .directive('me', function() {
              return {
                restrict: 'E',
                scope: {},
                require: { container: '^parent', friend: 'sibling' },
                bindToController: true,
                controller: MeController,
                controllerAs: '$ctrl'
              };
            })
            .directive('parent', function() {
              return {
                restrict: 'E',
                scope: {},
                controller: ParentController
              };
            })
            .directive('sibling', function() {
              return {
                controller: SiblingController
              };
            });

          module('my');
          inject(function($compile, $rootScope, meDirective) {
            element = $compile('<parent><me sibling></me></parent>')($rootScope);
            expect(MeController.prototype.$onInit).toHaveBeenCalled();
            expect(parentController).toEqual(jasmine.any(ParentController));
            expect(siblingController).toEqual(jasmine.any(SiblingController));
          });
        });

        it('should use the key if the name of a required controller is omitted', function() {
          function ParentController() { this.name = 'Parent'; }
          function ParentOptController() { this.name = 'ParentOpt'; }
          function ParentOrSiblingController() { this.name = 'ParentOrSibling'; }
          function ParentOrSiblingOptController() { this.name = 'ParentOrSiblingOpt'; }
          function SiblingController() { this.name = 'Sibling'; }
          function SiblingOptController() { this.name = 'SiblingOpt'; }

          angular.module('my', [])
            .component('me', {
              require: {
                parent: '^^',
                parentOpt: '?^^',
                parentOrSibling1: '^',
                parentOrSiblingOpt1: '?^',
                parentOrSibling2: '^',
                parentOrSiblingOpt2: '?^',
                sibling: '',
                siblingOpt: '?'
              }
            })
            .directive('parent', function() {
              return {controller: ParentController};
            })
            .directive('parentOpt', function() {
              return {controller: ParentOptController};
            })
            .directive('parentOrSibling1', function() {
              return {controller: ParentOrSiblingController};
            })
            .directive('parentOrSiblingOpt1', function() {
              return {controller: ParentOrSiblingOptController};
            })
            .directive('parentOrSibling2', function() {
              return {controller: ParentOrSiblingController};
            })
            .directive('parentOrSiblingOpt2', function() {
              return {controller: ParentOrSiblingOptController};
            })
            .directive('sibling', function() {
              return {controller: SiblingController};
            })
            .directive('siblingOpt', function() {
              return {controller: SiblingOptController};
            });

          module('my');
          inject(function($compile, $rootScope) {
            var template =
              '<div>' +
                // With optional
                '<parent parent-opt parent-or-sibling-1 parent-or-sibling-opt-1>' +
                  '<me parent-or-sibling-2 parent-or-sibling-opt-2 sibling sibling-opt></me>' +
                '</parent>' +
                // Without optional
                '<parent parent-or-sibling-1>' +
                  '<me parent-or-sibling-2 sibling></me>' +
                '</parent>' +
              '</div>';
            element = $compile(template)($rootScope);

            var ctrl1 = element.find('me').eq(0).controller('me');
            expect(ctrl1.parent).toEqual(jasmine.any(ParentController));
            expect(ctrl1.parentOpt).toEqual(jasmine.any(ParentOptController));
            expect(ctrl1.parentOrSibling1).toEqual(jasmine.any(ParentOrSiblingController));
            expect(ctrl1.parentOrSiblingOpt1).toEqual(jasmine.any(ParentOrSiblingOptController));
            expect(ctrl1.parentOrSibling2).toEqual(jasmine.any(ParentOrSiblingController));
            expect(ctrl1.parentOrSiblingOpt2).toEqual(jasmine.any(ParentOrSiblingOptController));
            expect(ctrl1.sibling).toEqual(jasmine.any(SiblingController));
            expect(ctrl1.siblingOpt).toEqual(jasmine.any(SiblingOptController));

            var ctrl2 = element.find('me').eq(1).controller('me');
            expect(ctrl2.parent).toEqual(jasmine.any(ParentController));
            expect(ctrl2.parentOpt).toBe(null);
            expect(ctrl2.parentOrSibling1).toEqual(jasmine.any(ParentOrSiblingController));
            expect(ctrl2.parentOrSiblingOpt1).toBe(null);
            expect(ctrl2.parentOrSibling2).toEqual(jasmine.any(ParentOrSiblingController));
            expect(ctrl2.parentOrSiblingOpt2).toBe(null);
            expect(ctrl2.sibling).toEqual(jasmine.any(SiblingController));
            expect(ctrl2.siblingOpt).toBe(null);
          });
        });


        it('should not bind required controllers if bindToController is falsy', function() {
          var parentController, siblingController;

          function ParentController() { this.name = 'Parent'; }
          function SiblingController() { this.name = 'Sibling'; }
          function MeController() { this.name = 'Me'; }
          MeController.prototype.$onInit = function() {
            parentController = this.container;
            siblingController = this.friend;
          };
          spyOn(MeController.prototype, '$onInit').and.callThrough();

          angular.module('my', [])
            .directive('me', function() {
              return {
                restrict: 'E',
                scope: {},
                require: { container: '^parent', friend: 'sibling' },
                controller: MeController
              };
            })
            .directive('parent', function() {
              return {
                restrict: 'E',
                scope: {},
                controller: ParentController
              };
            })
            .directive('sibling', function() {
              return {
                controller: SiblingController
              };
            });

          module('my');
          inject(function($compile, $rootScope, meDirective) {
            element = $compile('<parent><me sibling></me></parent>')($rootScope);
            expect(MeController.prototype.$onInit).toHaveBeenCalled();
            expect(parentController).toBeUndefined();
            expect(siblingController).toBeUndefined();
          });
        });

        it('should bind required controllers to controller that has an explicit constructor return value', function() {
          var parentController, siblingController, meController;

          function ParentController() { this.name = 'Parent'; }
          function SiblingController() { this.name = 'Sibling'; }
          function MeController() {
            meController = {
              name: 'Me',
              $onInit: function() {
                parentController = this.container;
                siblingController = this.friend;
              }
            };
            spyOn(meController, '$onInit').and.callThrough();
            return meController;
          }

          angular.module('my', [])
            .directive('me', function() {
              return {
                restrict: 'E',
                scope: {},
                require: { container: '^parent', friend: 'sibling' },
                bindToController: true,
                controller: MeController,
                controllerAs: '$ctrl'
              };
            })
            .directive('parent', function() {
              return {
                restrict: 'E',
                scope: {},
                controller: ParentController
              };
            })
            .directive('sibling', function() {
              return {
                controller: SiblingController
              };
            });

          module('my');
          inject(function($compile, $rootScope, meDirective) {
            element = $compile('<parent><me sibling></me></parent>')($rootScope);
            expect(meController.$onInit).toHaveBeenCalled();
            expect(parentController).toEqual(jasmine.any(ParentController));
            expect(siblingController).toEqual(jasmine.any(SiblingController));
          });
        });


        it('should bind required controllers to controllers that return an explicit constructor return value', function() {
          var parentController, containerController, siblingController, friendController, meController;

          function MeController() {
            this.name = 'Me';
            this.$onInit = function() {
              containerController = this.container;
              friendController = this.friend;
            };
          }
          function ParentController() {
            parentController = { name: 'Parent' };
            return parentController;
          }
          function SiblingController() {
            siblingController = { name: 'Sibling' };
            return siblingController;
          }

          angular.module('my', [])
            .directive('me', function() {
              return {
                priority: 1, // make sure it is run before sibling to test this case correctly
                restrict: 'E',
                scope: {},
                require: { container: '^parent', friend: 'sibling' },
                bindToController: true,
                controller: MeController,
                controllerAs: '$ctrl'
              };
            })
            .directive('parent', function() {
              return {
                restrict: 'E',
                scope: {},
                controller: ParentController
              };
            })
            .directive('sibling', function() {
              return {
                controller: SiblingController
              };
            });

          module('my');
          inject(function($compile, $rootScope, meDirective) {
            element = $compile('<parent><me sibling></me></parent>')($rootScope);
            expect(containerController).toEqual(parentController);
            expect(friendController).toEqual(siblingController);
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


        it('should throw an error if required controller can\'t be found',function() {
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
            }).toThrowMinErr('$compile', 'ctreq', 'Controller \'main\', required by directive \'dep\', can\'t be found!');
          });
        });


        it('should pass null if required controller can\'t be found and is optional',function() {
          module(function() {
            directive('dep', function(log) {
              return {
                require: '?^main',
                link: function(scope, element, attrs, controller) {
                  log('dep:' + controller);
                }
              };
            });
          });
          inject(function(log, $compile, $rootScope) {
            $compile('<div main><div dep></div></div>')($rootScope);
            expect(log).toEqual('dep:null');
          });
        });


        it('should pass null if required controller can\'t be found and is optional with the question mark on the right',function() {
          module(function() {
            directive('dep', function(log) {
              return {
                require: '^?main',
                link: function(scope, element, attrs, controller) {
                  log('dep:' + controller);
                }
              };
            });
          });
          inject(function(log, $compile, $rootScope) {
            $compile('<div main><div dep></div></div>')($rootScope);
            expect(log).toEqual('dep:null');
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

        it('should support multiple controllers as an object hash', function() {
          module(function() {
            directive('c1', valueFn({
              controller: function() { this.name = 'c1'; }
            }));
            directive('c2', valueFn({
              controller: function() { this.name = 'c2'; }
            }));
            directive('dep', function(log) {
              return {
                require: { myC1: '^c1', myC2: '^c2' },
                link: function(scope, element, attrs, controllers) {
                  log('dep:' + controllers.myC1.name + '-' + controllers.myC2.name);
                }
              };
            });
          });
          inject(function(log, $compile, $rootScope) {
            element = $compile('<div c1 c2><div dep></div></div>')($rootScope);
            expect(log).toEqual('dep:c1-c2');
          });
        });

        it('should support omitting the name of the required controller if it is the same as the key',
          function() {
            module(function() {
              directive('myC1', valueFn({
                controller: function() { this.name = 'c1'; }
              }));
              directive('myC2', valueFn({
                controller: function() { this.name = 'c2'; }
              }));
              directive('dep', function(log) {
                return {
                  require: { myC1: '^', myC2: '^' },
                  link: function(scope, element, attrs, controllers) {
                    log('dep:' + controllers.myC1.name + '-' + controllers.myC2.name);
                  }
                };
              });
            });
            inject(function(log, $compile, $rootScope) {
              element = $compile('<div my-c1 my-c2><div dep></div></div>')($rootScope);
              expect(log).toEqual('dep:c1-c2');
            });
          }
        );

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
            element = $compile('<div>' +
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



        it('should instantiate controllers in the parent->child order when transclusion, templateUrl and replacement ' +
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
                controller: function(log) { log('parentController'); }
              };
            });
            directive('childDirective', function() {
              return {
                require: '^parentDirective',
                templateUrl: 'childDirective.html',
                controller: function(log) { log('childController'); }
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


        it('should instantiate the controller after the isolate scope bindings are initialized (with template)', function() {
          module(function() {
            var Ctrl = function($scope, log) {
              log('myFoo=' + $scope.myFoo);
            };

            directive('myDirective', function() {
              return {
                scope: {
                  myFoo: '='
                },
                template: '<p>Hello</p>',
                controller: Ctrl
              };
            });
          });

          inject(function($templateCache, $compile, $rootScope, log) {
            $rootScope.foo = 'bar';

            element = $compile('<div my-directive my-foo="foo"></div>')($rootScope);
            $rootScope.$apply();
            expect(log).toEqual('myFoo=bar');
          });
        });


        it('should instantiate the controller after the isolate scope bindings are initialized (with templateUrl)', function() {
          module(function() {
            var Ctrl = function($scope, log) {
              log('myFoo=' + $scope.myFoo);
            };

            directive('myDirective', function() {
              return {
                scope: {
                  myFoo: '='
                },
                templateUrl: 'hello.html',
                controller: Ctrl
              };
            });
          });

          inject(function($templateCache, $compile, $rootScope, log) {
            $templateCache.put('hello.html', '<p>Hello</p>');
            $rootScope.foo = 'bar';

            element = $compile('<div my-directive my-foo="foo"></div>')($rootScope);
            $rootScope.$apply();
            expect(log).toEqual('myFoo=bar');
          });
        });


        it('should instantiate controllers in the parent->child->baby order when nested transclusion, templateUrl and ' +
            'replacement are in the mix', function() {
          // similar to the test above, except that we have one more layer of nesting and nested transclusion

          module(function() {
            directive('parentDirective', function() {
              return {
                transclude: true,
                replace: true,
                templateUrl: 'parentDirective.html',
                controller: function(log) { log('parentController'); }
              };
            });
            directive('childDirective', function() {
              return {
                require: '^parentDirective',
                transclude: true,
                replace: true,
                templateUrl: 'childDirective.html',
                controller: function(log) { log('childController'); }
              };
            });
            directive('babyDirective', function() {
              return {
                require: '^childDirective',
                templateUrl: 'babyDirective.html',
                controller: function(log) { log('babyController'); }
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


        it('should allow controller usage in pre-link directive functions with templateUrl', function() {
          module(function() {
            var Ctrl = function(log) {
              log('instance');
            };

            directive('myDirective', function() {
              return {
                scope: true,
                templateUrl: 'hello.html',
                controller: Ctrl,
                compile: function() {
                  return {
                    pre: function(scope, template, attr, ctrl) {},
                    post: function() {}
                  };
                }
              };
            });
          });

          inject(function($templateCache, $compile, $rootScope, log) {
            $templateCache.put('hello.html', '<p>Hello</p>');

            element = $compile('<div my-directive></div>')($rootScope);
            $rootScope.$apply();

            expect(log).toEqual('instance');
            expect(element.text()).toBe('Hello');
          });
        });


        it('should allow controller usage in pre-link directive functions with a template', function() {
          module(function() {
            var Ctrl = function(log) {
              log('instance');
            };

            directive('myDirective', function() {
              return {
                scope: true,
                template: '<p>Hello</p>',
                controller: Ctrl,
                compile: function() {
                  return {
                    pre: function(scope, template, attr, ctrl) {},
                    post: function() {}
                  };
                }
              };
            });
          });

          inject(function($templateCache, $compile, $rootScope, log) {
            element = $compile('<div my-directive></div>')($rootScope);
            $rootScope.$apply();

            expect(log).toEqual('instance');
            expect(element.text()).toBe('Hello');
          });
        });


        it('should throw ctreq with correct directive name, regardless of order', function() {
          module(function($compileProvider) {
            $compileProvider.directive('aDir', valueFn({
              restrict: 'E',
              require: 'ngModel',
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
                'Controller \'ngModel\', required by directive \'aDir\', can\'t be found!');
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
                  scope: {},
                  link: function(scope) {
                    scope.x = 'iso';
                  },
                  template: '<ul><li>W:{{x}}-{{$parent.$id}}-{{$id}};</li><li ng-transclude></li></ul>'
                };
              });
            });
            inject(function(log, $rootScope, $compile) {
              element = $compile('<div><div trans>T:{{x}}-{{$parent.$id}}-{{$id}}<span>;</span></div></div>')($rootScope);
              $rootScope.x = 'root';
              $rootScope.$apply();
              expect(element.text()).toEqual('W:iso-1-2;T:root-2-3;');
              expect(jqLite(jqLite(element.find('li')[1]).contents()[0]).text()).toEqual('T:root-2-3');
              expect(jqLite(element.find('span')[0]).text()).toEqual(';');
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


          it('should not merge text elements from transcluded content', function() {
            module(function() {
              directive('foo', valueFn({
                transclude: 'content',
                template: '<div>This is before {{before}}. </div>',
                link: function(scope, element, attr, ctrls, $transclude) {
                  var futureParent = element.children().eq(0);
                  $transclude(function(clone) {
                    futureParent.append(clone);
                  }, futureParent);
                },
                scope: true
              }));
            });
            inject(function($rootScope, $compile) {
              element = $compile('<div><div foo>This is after {{after}}</div></div>')($rootScope);
              $rootScope.before = 'BEFORE';
              $rootScope.after = 'AFTER';
              $rootScope.$apply();
              expect(element.text()).toEqual('This is before BEFORE. This is after AFTER');

              $rootScope.before = 'Not-Before';
              $rootScope.after = 'AfTeR';
              $rootScope.$$childHead.before = 'BeFoRe';
              $rootScope.$$childHead.after = 'Not-After';
              $rootScope.$apply();
              expect(element.text()).toEqual('This is before BeFoRe. This is after AfTeR');
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
              }).toThrowMinErr('$compile', 'multidir', /Multiple directives \[first, second] asking for transclusion on: <div .+/);
            });
          });

          //see issue https://github.com/angular/angular.js/issues/12936
          it('should use the proper scope when it is on the root element of a replaced directive template', function() {
            module(function() {
              directive('isolate', valueFn({
                scope: {},
                replace: true,
                template: '<div trans>{{x}}</div>',
                link: function(scope, element, attr, ctrl) {
                  scope.x = 'iso';
                }
              }));
              directive('trans', valueFn({
                transclude: 'content',
                link: function(scope, element, attr, ctrl, $transclude) {
                  $transclude(function(clone) {
                    element.append(clone);
                  });
                }
              }));
            });
            inject(function($rootScope, $compile) {
              element = $compile('<isolate></isolate>')($rootScope);
              $rootScope.x = 'root';
              $rootScope.$apply();
              expect(element.text()).toEqual('iso');
            });
          });


          //see issue https://github.com/angular/angular.js/issues/12936
          it('should use the proper scope when it is on the root element of a replaced directive template with child scope', function() {
            module(function() {
              directive('child', valueFn({
                scope: true,
                replace: true,
                template: '<div trans>{{x}}</div>',
                link: function(scope, element, attr, ctrl) {
                  scope.x = 'child';
                }
              }));
              directive('trans', valueFn({
                transclude: 'content',
                link: function(scope, element, attr, ctrl, $transclude) {
                  $transclude(function(clone) {
                    element.append(clone);
                  });
                }
              }));
            });
            inject(function($rootScope, $compile) {
              element = $compile('<child></child>')($rootScope);
              $rootScope.x = 'root';
              $rootScope.$apply();
              expect(element.text()).toEqual('child');
            });
          });

          it('should throw if a transcluded node is transcluded again', function() {
            module(function() {
              directive('trans', valueFn({
                transclude: true,
                link: function(scope, element, attr, ctrl, $transclude) {
                  $transclude();
                  $transclude();
                }
              }));
            });
            inject(function($rootScope, $compile) {
              expect(function() {
                $compile('<trans></trans>')($rootScope);
              }).toThrowMinErr('$compile', 'multilink', 'This element has already been linked.');
            });
          });

          it('should not leak if two "element" transclusions are on the same element (with debug info)', function() {
            if (jQuery) {
              // jQuery 2.x doesn't expose the cache storage.
              return;
            }


            module(function($compileProvider) {
              $compileProvider.debugInfoEnabled(true);
            });

            inject(function($compile, $rootScope) {
              var cacheSize = jqLiteCacheSize();

              element = $compile('<div><div ng-repeat="x in xs" ng-if="x==1">{{x}}</div></div>')($rootScope);
              expect(jqLiteCacheSize()).toEqual(cacheSize + 1);

              $rootScope.$apply('xs = [0,1]');
              expect(jqLiteCacheSize()).toEqual(cacheSize + 2);

              $rootScope.$apply('xs = [0]');
              expect(jqLiteCacheSize()).toEqual(cacheSize + 1);

              $rootScope.$apply('xs = []');
              expect(jqLiteCacheSize()).toEqual(cacheSize + 1);

              element.remove();
              expect(jqLiteCacheSize()).toEqual(cacheSize + 0);
            });
          });


          it('should not leak if two "element" transclusions are on the same element (without debug info)', function() {
            if (jQuery) {
              // jQuery 2.x doesn't expose the cache storage.
              return;
            }


            module(function($compileProvider) {
              $compileProvider.debugInfoEnabled(false);
            });

            inject(function($compile, $rootScope) {
              var cacheSize = jqLiteCacheSize();

              element = $compile('<div><div ng-repeat="x in xs" ng-if="x==1">{{x}}</div></div>')($rootScope);
              expect(jqLiteCacheSize()).toEqual(cacheSize);

              $rootScope.$apply('xs = [0,1]');
              expect(jqLiteCacheSize()).toEqual(cacheSize);

              $rootScope.$apply('xs = [0]');
              expect(jqLiteCacheSize()).toEqual(cacheSize);

              $rootScope.$apply('xs = []');
              expect(jqLiteCacheSize()).toEqual(cacheSize);

              element.remove();
              expect(jqLiteCacheSize()).toEqual(cacheSize);
            });
          });


          it('should not leak if two "element" transclusions are on the same element (with debug info)', function() {
            if (jQuery) {
              // jQuery 2.x doesn't expose the cache storage.
              return;
            }

            module(function($compileProvider) {
              $compileProvider.debugInfoEnabled(true);
            });

            inject(function($compile, $rootScope) {
              var cacheSize = jqLiteCacheSize();
              element = $compile('<div><div ng-repeat="x in xs" ng-if="val">{{x}}</div></div>')($rootScope);

              $rootScope.$apply('xs = [0,1]');
              // At this point we have a bunch of comment placeholders but no real transcluded elements
              // So the cache only contains the root element's data
              expect(jqLiteCacheSize()).toEqual(cacheSize + 1);

              $rootScope.$apply('val = true');
              // Now we have two concrete transcluded elements plus some comments so two more cache items
              expect(jqLiteCacheSize()).toEqual(cacheSize + 3);

              $rootScope.$apply('val = false');
              // Once again we only have comments so no transcluded elements and the cache is back to just
              // the root element
              expect(jqLiteCacheSize()).toEqual(cacheSize + 1);

              element.remove();
              // Now we've even removed the root element along with its cache
              expect(jqLiteCacheSize()).toEqual(cacheSize + 0);
            });
          });

          it('should not leak when continuing the compilation of elements on a scope that was destroyed', function() {
            if (jQuery) {
              // jQuery 2.x doesn't expose the cache storage.
              return;
            }

            var linkFn = jasmine.createSpy('linkFn');

            module(function($controllerProvider, $compileProvider) {
              $controllerProvider.register('Leak', function($scope, $timeout) {
                $scope.code = 'red';
                $timeout(function() {
                  $scope.code = 'blue';
                });
              });
              $compileProvider.directive('isolateRed', function() {
                return {
                  restrict: 'A',
                  scope: {},
                  template: '<div red></div>'
                };
              });
              $compileProvider.directive('red', function() {
                return {
                  restrict: 'A',
                  templateUrl: 'red.html',
                  scope: {},
                  link: linkFn
                };
              });
            });

            inject(function($compile, $rootScope, $httpBackend, $timeout, $templateCache) {
              var cacheSize = jqLiteCacheSize();
              $httpBackend.whenGET('red.html').respond('<p>red.html</p>');
              var template = $compile(
                '<div ng-controller="Leak">' +
                  '<div ng-switch="code">' +
                    '<div ng-switch-when="red">' +
                      '<div isolate-red></div>' +
                    '</div>' +
                  '</div>' +
                '</div>');
              element = template($rootScope, noop);
              $rootScope.$digest();
              $timeout.flush();
              $httpBackend.flush();
              expect(linkFn).not.toHaveBeenCalled();
              expect(jqLiteCacheSize()).toEqual(cacheSize + 2);

              $templateCache.removeAll();
              var destroyedScope = $rootScope.$new();
              destroyedScope.$destroy();
              var clone = template(destroyedScope, noop);
              $rootScope.$digest();
              $timeout.flush();
              expect(linkFn).not.toHaveBeenCalled();
              clone.remove();
            });
          });

          if (jQuery) {
            describe('cleaning up after a replaced element', function() {
              var $compile, xs;
              beforeEach(inject(function(_$compile_) {
                $compile = _$compile_;
                xs = [0, 1];
              }));

              function testCleanup() {
                var privateData, firstRepeatedElem;

                element = $compile('<div><div ng-repeat="x in xs" ng-click="noop()">{{x}}</div></div>')($rootScope);

                $rootScope.$apply('xs = [' + xs + ']');
                firstRepeatedElem = element.children('.ng-scope').eq(0);

                expect(firstRepeatedElem.data('$scope')).toBeDefined();
                privateData = jQuery._data(firstRepeatedElem[0]);
                expect(privateData.events).toBeDefined();
                expect(privateData.events.click).toBeDefined();
                expect(privateData.events.click[0]).toBeDefined();

                //Ensure the angular $destroy event is still sent
                var destroyCount = 0;
                element.find('div').on('$destroy', function() { destroyCount++; });

                $rootScope.$apply('xs = null');

                expect(destroyCount).toBe(2);
                expect(firstRepeatedElem.data('$scope')).not.toBeDefined();
                privateData = jQuery._data(firstRepeatedElem[0]);
                expect(privateData && privateData.events).not.toBeDefined();
              }

              it('should work without external libraries (except jQuery)', testCleanup);

              it('should work with another library patching jQuery.cleanData after Angular', function() {
                var cleanedCount = 0;
                var currentCleanData = jQuery.cleanData;
                jQuery.cleanData = function(elems) {
                  cleanedCount += elems.length;
                  // Don't return the output and explicitly pass only the first parameter
                  // so that we're sure we're not relying on either of them. jQuery UI patch
                  // behaves in this way.
                  currentCleanData(elems);
                };

                testCleanup();

                // The ng-repeat template is removed/cleaned (the +1)
                // and each clone of the ng-repeat template is also removed (xs.length)
                expect(cleanedCount).toBe(xs.length + 1);

                // Restore the previous jQuery.cleanData.
                jQuery.cleanData = currentCleanData;
              });
            });
          }


          it('should add a $$transcluded property onto the transcluded scope', function() {
            module(function() {
              directive('trans', function() {
                return {
                  transclude: true,
                  replace: true,
                  scope: true,
                  template: '<div><span>I:{{$$transcluded}}</span><span ng-transclude></span></div>'
                };
              });
            });
            inject(function($rootScope, $compile) {
              element = $compile('<div><div trans>T:{{$$transcluded}}</div></div>')($rootScope);
              $rootScope.$apply();
              expect(jqLite(element.find('span')[0]).text()).toEqual('I:');
              expect(jqLite(element.find('span')[1]).text()).toEqual('T:true');
            });
          });


          it('should clear contents of the ng-transclude element before appending transcluded content' +
            ' if transcluded content exists', function() {
            module(function() {
              directive('trans', function() {
                return {
                  transclude: true,
                  template: '<div ng-transclude>old stuff!</div>'
                };
              });
            });
            inject(function($rootScope, $compile) {
              element = $compile('<div trans>unicorn!</div>')($rootScope);
              $rootScope.$apply();
              expect(sortedHtml(element.html())).toEqual('<div ng-transclude="">unicorn!</div>');
            });
          });

          it('should NOT clear contents of the ng-transclude element before appending transcluded content' +
            ' if transcluded content does NOT exist', function() {
            module(function() {
              directive('trans', function() {
                return {
                  transclude: true,
                  template: '<div ng-transclude>old stuff!</div>'
                };
              });
            });
            inject(function(log, $rootScope, $compile) {
              element = $compile('<div trans></div>')($rootScope);
              $rootScope.$apply();
              expect(sortedHtml(element.html())).toEqual('<div ng-transclude="">old stuff!</div>');
            });
          });


          it('should clear the fallback content from the element during compile and before linking', function() {
            module(function() {
              directive('trans', function() {
                return {
                  transclude: true,
                  template: '<div ng-transclude>fallback content</div>'
                };
              });
            });
            inject(function(log, $rootScope, $compile) {
              element = jqLite('<div trans></div>');
              var linkfn = $compile(element);
              expect(element.html()).toEqual('<div ng-transclude=""></div>');
              linkfn($rootScope);
              $rootScope.$apply();
              expect(sortedHtml(element.html())).toEqual('<div ng-transclude="">fallback content</div>');
            });
          });


          it('should allow cloning of the fallback via ngRepeat', function() {
            module(function() {
              directive('trans', function() {
                return {
                  transclude: true,
                  template: '<div ng-repeat="i in [0,1,2]"><div ng-transclude>{{i}}</div></div>'
                };
              });
            });
            inject(function(log, $rootScope, $compile) {
              element = $compile('<div trans></div>')($rootScope);
              $rootScope.$apply();
              expect(element.text()).toEqual('012');
            });
          });


          it('should not link the fallback content if transcluded content is provided', function() {
            var linkSpy = jasmine.createSpy('postlink');

            module(function() {
              directive('inner', function() {
                return {
                  restrict: 'E',
                  template: 'old stuff! ',
                  link: linkSpy
                };
              });

              directive('trans', function() {
                return {
                  transclude: true,
                  template: '<div ng-transclude><inner></inner></div>'
                };
              });
            });
            inject(function($rootScope, $compile) {
              element = $compile('<div trans>unicorn!</div>')($rootScope);
              $rootScope.$apply();
              expect(sortedHtml(element.html())).toEqual('<div ng-transclude="">unicorn!</div>');
              expect(linkSpy).not.toHaveBeenCalled();
            });
          });

          it('should compile and link the fallback content if no transcluded content is provided', function() {
            var linkSpy = jasmine.createSpy('postlink');

            module(function() {
              directive('inner', function() {
                return {
                  restrict: 'E',
                  template: 'old stuff! ',
                  link: linkSpy
                };
              });

              directive('trans', function() {
                return {
                  transclude: true,
                  template: '<div ng-transclude><inner></inner></div>'
                };
              });
            });
            inject(function(log, $rootScope, $compile) {
              element = $compile('<div trans></div>')($rootScope);
              $rootScope.$apply();
              expect(sortedHtml(element.html())).toEqual('<div ng-transclude=""><inner>old stuff! </inner></div>');
              expect(linkSpy).toHaveBeenCalled();
            });
          });

          it('should compile and link the fallback content if only whitespace transcluded content is provided', function() {
            var linkSpy = jasmine.createSpy('postlink');

            module(function() {
              directive('inner', function() {
                return {
                  restrict: 'E',
                  template: 'old stuff! ',
                  link: linkSpy
                };
              });

              directive('trans', function() {
                return {
                  transclude: true,
                  template: '<div ng-transclude><inner></inner></div>'
                };
              });
            });
            inject(function(log, $rootScope, $compile) {
              element = $compile('<div trans>\n  \n</div>')($rootScope);
              $rootScope.$apply();
              expect(sortedHtml(element.html())).toEqual('<div ng-transclude=""><inner>old stuff! </inner></div>');
              expect(linkSpy).toHaveBeenCalled();
            });
          });

          it('should not link the fallback content if only whitespace and comments are provided as transclude content', function() {
            var linkSpy = jasmine.createSpy('postlink');

            module(function() {
              directive('inner', function() {
                return {
                  restrict: 'E',
                  template: 'old stuff! ',
                  link: linkSpy
                };
              });

              directive('trans', function() {
                return {
                  transclude: true,
                  template: '<div ng-transclude><inner></inner></div>'
                };
              });
            });
            inject(function(log, $rootScope, $compile) {
              element = $compile('<div trans>\n<!-- some comment -->  \n</div>')($rootScope);
              $rootScope.$apply();
              expect(sortedHtml(element.html())).toEqual('<div ng-transclude="">\n<!-- some comment -->  \n</div>');
              expect(linkSpy).not.toHaveBeenCalled();
            });
          });

          it('should compile and link the fallback content if an optional transclusion slot is not provided', function() {
            var linkSpy = jasmine.createSpy('postlink');

            module(function() {
              directive('inner', function() {
                return {
                  restrict: 'E',
                  template: 'old stuff! ',
                  link: linkSpy
                };
              });

              directive('trans', function() {
                return {
                  transclude: { optionalSlot: '?optional'},
                  template: '<div ng-transclude="optionalSlot"><inner></inner></div>'
                };
              });
            });
            inject(function(log, $rootScope, $compile) {
              element = $compile('<div trans></div>')($rootScope);
              $rootScope.$apply();
              expect(sortedHtml(element.html())).toEqual('<div ng-transclude="optionalSlot"><inner>old stuff! </inner></div>');
              expect(linkSpy).toHaveBeenCalled();
            });
          });

          it('should cope if there is neither transcluded content nor fallback content', function() {
            module(function() {
              directive('trans', function() {
                return {
                  transclude: true,
                  template: '<div ng-transclude></div>'
                };
              });
            });
            inject(function($rootScope, $compile) {
              element = $compile('<div trans></div>')($rootScope);
              $rootScope.$apply();
              expect(sortedHtml(element.html())).toEqual('<div ng-transclude=""></div>');
            });
          });

          it('should throw on an ng-transclude element inside no transclusion directive', function() {
            inject(function($rootScope, $compile) {
              var error;

              try {
                $compile('<div><div ng-transclude></div></div>')($rootScope);
              } catch (e) {
                error = e;
              }

              expect(error).toEqualMinErr('ngTransclude', 'orphan',
                  'Illegal use of ngTransclude directive in the template! ' +
                  'No parent directive that requires a transclusion found. ' +
                  'Element: <div ng-transclude');
              // we need to do this because different browsers print empty attributes differently
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
              expect(function() {
                $compile('<div trans-foo>content</div>')($rootScope);
              }).toThrowMinErr('ngTransclude', 'orphan',
                  'Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: <div class="bar" ng-transclude="">');
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

            inject(function($compile, $exceptionHandler, $rootScope, $templateCache) {
              $templateCache.put('noTransBar.html',
                '<div>' +
                  // This ng-transclude is invalid. It should throw an error.
                  '<div class="bar" ng-transclude></div>' +
                '</div>');

              element = $compile('<div trans-foo>content</div>')($rootScope);
              $rootScope.$digest();

              expect($exceptionHandler.errors[0][1]).toBe('<div class="bar" ng-transclude="">');
              expect($exceptionHandler.errors[0][0]).toEqualMinErr('ngTransclude', 'orphan',
                  'Illegal use of ngTransclude directive in the template! ' +
                  'No parent directive that requires a transclusion found. ' +
                  'Element: <div class="bar" ng-transclude="">');
            });
          });


          it('should expose transcludeFn in compile fn even for templateUrl', function() {
            module(function() {
              directive('transInCompile', valueFn({
                transclude: true,
                // template: '<div class="foo">whatever</div>',
                templateUrl: 'foo.html',
                compile: function(_, __, transclude) {
                  return function(scope, element) {
                    transclude(scope, function(clone, scope) {
                      element.html('');
                      element.append(clone);
                    });
                  };
                }
              }));
            });

            inject(function($compile, $rootScope, $templateCache) {
              $templateCache.put('foo.html', '<div class="foo">whatever</div>');

              compile('<div trans-in-compile>transcluded content</div>');
              $rootScope.$apply();

              expect(trim(element.text())).toBe('transcluded content');
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
                  for (i = 0; i < cloneCount; i++) {
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
              for (i = 0; i < cloneCount; i++) {
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
              expect(element.text()).toBe('' + $rootScope.$id);
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


          // See issue https://github.com/angular/angular.js/issues/14924
          it('should not process top-level transcluded text nodes merged into their sibling',
            function() {
              module(function() {
                directive('transclude', valueFn({
                  template: '<ng-transclude></ng-transclude>',
                  transclude: true,
                  scope: {}
                }));
              });

              inject(function($compile) {
                element = jqLite('<div transclude></div>');
                element[0].appendChild(document.createTextNode('1{{ value }}'));
                element[0].appendChild(document.createTextNode('2{{ value }}'));
                element[0].appendChild(document.createTextNode('3{{ value }}'));

                var initialWatcherCount = $rootScope.$countWatchers();
                $compile(element)($rootScope);
                $rootScope.$apply('value = 0');
                var newWatcherCount = $rootScope.$countWatchers() - initialWatcherCount;

                expect(element.text()).toBe('102030');
                expect(newWatcherCount).toBe(3);
              });
            }
          );


          // see issue https://github.com/angular/angular.js/issues/9413
          describe('passing a parent bound transclude function to the link ' +
              'function returned from `$compile`', function() {

            beforeEach(module(function() {
              directive('lazyCompile', function($compile) {
                return {
                  compile: function(tElement, tAttrs) {
                    var content = tElement.contents();
                    tElement.empty();
                    return function(scope, element, attrs, ctrls, transcludeFn) {
                      element.append(content);
                      $compile(content)(scope, undefined, {
                        parentBoundTranscludeFn: transcludeFn
                      });
                    };
                  }
                };
              });
              directive('toggle', valueFn({
                scope: {t: '=toggle'},
                transclude: true,
                template: '<div ng-if="t"><lazy-compile><div ng-transclude></div></lazy-compile></div>'
              }));
            }));

            it('should preserve the bound scope', function() {

              inject(function($compile, $rootScope) {
                element = $compile(
                  '<div>' +
                    '<div ng-init="outer=true"></div>' +
                    '<div toggle="t">' +
                      '<span ng-if="outer">Success</span><span ng-if="!outer">Error</span>' +
                    '</div>' +
                  '</div>')($rootScope);

                $rootScope.$apply('t = false');
                expect($rootScope.$countChildScopes()).toBe(1);
                expect(element.text()).toBe('');

                $rootScope.$apply('t = true');
                expect($rootScope.$countChildScopes()).toBe(4);
                expect(element.text()).toBe('Success');

                $rootScope.$apply('t = false');
                expect($rootScope.$countChildScopes()).toBe(1);
                expect(element.text()).toBe('');

                $rootScope.$apply('t = true');
                expect($rootScope.$countChildScopes()).toBe(4);
                expect(element.text()).toBe('Success');
              });
            });


            it('should preserve the bound scope when using recursive transclusion', function() {

              directive('recursiveTransclude', valueFn({
                transclude: true,
                template: '<div><lazy-compile><div ng-transclude></div></lazy-compile></div>'
              }));

              inject(function($compile, $rootScope) {
                element = $compile(
                  '<div>' +
                    '<div ng-init="outer=true"></div>' +
                    '<div toggle="t">' +
                      '<div recursive-transclude>' +
                        '<span ng-if="outer">Success</span><span ng-if="!outer">Error</span>' +
                      '</div>' +
                    '</div>' +
                  '</div>')($rootScope);

                $rootScope.$apply('t = false');
                expect($rootScope.$countChildScopes()).toBe(1);
                expect(element.text()).toBe('');

                $rootScope.$apply('t = true');
                expect($rootScope.$countChildScopes()).toBe(4);
                expect(element.text()).toBe('Success');

                $rootScope.$apply('t = false');
                expect($rootScope.$countChildScopes()).toBe(1);
                expect(element.text()).toBe('');

                $rootScope.$apply('t = true');
                expect($rootScope.$countChildScopes()).toBe(4);
                expect(element.text()).toBe('Success');
              });
            });
          });


          // see issue https://github.com/angular/angular.js/issues/9095
          describe('removing a transcluded element', function() {

            beforeEach(module(function() {
              directive('toggle', function() {
                return {
                  transclude: true,
                  template: '<div ng:if="t"><div ng:transclude></div></div>'
                };
              });
            }));


            it('should not leak the transclude scope when the transcluded content is an element transclusion directive',
                  inject(function($compile, $rootScope) {

              element = $compile(
                '<div toggle>' +
                  '<div ng:repeat="msg in [\'msg-1\']">{{ msg }}</div>' +
                '</div>'
              )($rootScope);

              $rootScope.$apply('t = true');
              expect(element.text()).toContain('msg-1');
              // Expected scopes: $rootScope, ngIf, transclusion, ngRepeat
              expect($rootScope.$countChildScopes()).toBe(3);

              $rootScope.$apply('t = false');
              expect(element.text()).not.toContain('msg-1');
              // Expected scopes: $rootScope
              expect($rootScope.$countChildScopes()).toBe(0);

              $rootScope.$apply('t = true');
              expect(element.text()).toContain('msg-1');
              // Expected scopes: $rootScope, ngIf, transclusion, ngRepeat
              expect($rootScope.$countChildScopes()).toBe(3);

              $rootScope.$apply('t = false');
              expect(element.text()).not.toContain('msg-1');
              // Expected scopes: $rootScope
              expect($rootScope.$countChildScopes()).toBe(0);
            }));


            it('should not leak the transclude scope when the transcluded content is an multi-element transclusion directive',
                  inject(function($compile, $rootScope) {

              element = $compile(
                '<div toggle>' +
                  '<div ng:repeat-start="msg in [\'msg-1\']">{{ msg }}</div>' +
                  '<div ng:repeat-end>{{ msg }}</div>' +
                '</div>'
              )($rootScope);

              $rootScope.$apply('t = true');
              expect(element.text()).toContain('msg-1msg-1');
              // Expected scopes: $rootScope, ngIf, transclusion, ngRepeat
              expect($rootScope.$countChildScopes()).toBe(3);

              $rootScope.$apply('t = false');
              expect(element.text()).not.toContain('msg-1msg-1');
              // Expected scopes: $rootScope
              expect($rootScope.$countChildScopes()).toBe(0);

              $rootScope.$apply('t = true');
              expect(element.text()).toContain('msg-1msg-1');
              // Expected scopes: $rootScope, ngIf, transclusion, ngRepeat
              expect($rootScope.$countChildScopes()).toBe(3);

              $rootScope.$apply('t = false');
              expect(element.text()).not.toContain('msg-1msg-1');
              // Expected scopes: $rootScope
              expect($rootScope.$countChildScopes()).toBe(0);
            }));


            it('should not leak the transclude scope if the transcluded contains only comments',
                  inject(function($compile, $rootScope) {

              element = $compile(
                '<div toggle>' +
                  '<!-- some comment -->' +
                '</div>'
              )($rootScope);

              $rootScope.$apply('t = true');
              expect(element.html()).toContain('some comment');
              // Expected scopes: $rootScope, ngIf, transclusion
              expect($rootScope.$countChildScopes()).toBe(2);

              $rootScope.$apply('t = false');
              expect(element.html()).not.toContain('some comment');
              // Expected scopes: $rootScope
              expect($rootScope.$countChildScopes()).toBe(0);

              $rootScope.$apply('t = true');
              expect(element.html()).toContain('some comment');
              // Expected scopes: $rootScope, ngIf, transclusion
              expect($rootScope.$countChildScopes()).toBe(2);

              $rootScope.$apply('t = false');
              expect(element.html()).not.toContain('some comment');
              // Expected scopes: $rootScope
              expect($rootScope.$countChildScopes()).toBe(0);
            }));

            it('should not leak the transclude scope if the transcluded contains only text nodes',
                  inject(function($compile, $rootScope) {

              element = $compile(
                '<div toggle>' +
                  'some text' +
                '</div>'
              )($rootScope);

              $rootScope.$apply('t = true');
              expect(element.html()).toContain('some text');
              // Expected scopes: $rootScope, ngIf, transclusion
              expect($rootScope.$countChildScopes()).toBe(2);

              $rootScope.$apply('t = false');
              expect(element.html()).not.toContain('some text');
              // Expected scopes: $rootScope
              expect($rootScope.$countChildScopes()).toBe(0);

              $rootScope.$apply('t = true');
              expect(element.html()).toContain('some text');
              // Expected scopes: $rootScope, ngIf, transclusion
              expect($rootScope.$countChildScopes()).toBe(2);

              $rootScope.$apply('t = false');
              expect(element.html()).not.toContain('some text');
              // Expected scopes: $rootScope
              expect($rootScope.$countChildScopes()).toBe(0);
            }));

            it('should mark as destroyed all sub scopes of the scope being destroyed',
                  inject(function($compile, $rootScope) {

              element = $compile(
                '<div toggle>' +
                  '<div ng:repeat="msg in [\'msg-1\']">{{ msg }}</div>' +
                '</div>'
              )($rootScope);

              $rootScope.$apply('t = true');
              var childScopes = getChildScopes($rootScope);

              $rootScope.$apply('t = false');
              for (var i = 0; i < childScopes.length; ++i) {
                expect(childScopes[i].$$destroyed).toBe(true);
              }
            }));
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


            it('should not leak memory with nested transclusion', function() {
              inject(function($compile, $rootScope) {
                var size, initialSize = jqLiteCacheSize();

                element = jqLite('<div><ul><li ng-repeat="n in nums">{{n}} => <i ng-if="0 === n%2">Even</i><i ng-if="1 === n%2">Odd</i></li></ul></div>');
                $compile(element)($rootScope.$new());

                $rootScope.nums = [0,1,2];
                $rootScope.$apply();
                size = jqLiteCacheSize();

                $rootScope.nums = [3,4,5];
                $rootScope.$apply();
                expect(jqLiteCacheSize()).toEqual(size);

                element.remove();
                expect(jqLiteCacheSize()).toEqual(initialSize);
              });
            });
          });


          describe('nested isolated scope transcludes', function() {
            beforeEach(module(function($compileProvider) {

              $compileProvider.directive('trans', valueFn({
                restrict: 'E',
                template: '<div ng-transclude></div>',
                transclude: true
              }));

              $compileProvider.directive('transAsync', valueFn({
                restrict: 'E',
                templateUrl: 'transAsync',
                transclude: true
              }));

              $compileProvider.directive('iso', valueFn({
                restrict: 'E',
                transclude: true,
                template: '<trans><span ng-transclude></span></trans>',
                scope: {}
              }));
              $compileProvider.directive('isoAsync1', valueFn({
                restrict: 'E',
                transclude: true,
                template: '<trans-async><span ng-transclude></span></trans-async>',
                scope: {}
              }));
              $compileProvider.directive('isoAsync2', valueFn({
                restrict: 'E',
                transclude: true,
                templateUrl: 'isoAsync',
                scope: {}
              }));
            }));

            beforeEach(inject(function($templateCache) {
              $templateCache.put('transAsync', '<div ng-transclude></div>');
              $templateCache.put('isoAsync', '<trans-async><span ng-transclude></span></trans-async>');
            }));


            it('should pass the outer scope to the transclude on the isolated template sync-sync', inject(function($compile, $rootScope) {

              $rootScope.val = 'transcluded content';
              element = $compile('<iso><span ng-bind="val"></span></iso>')($rootScope);
              $rootScope.$digest();
              expect(element.text()).toEqual('transcluded content');
            }));

            it('should pass the outer scope to the transclude on the isolated template async-sync', inject(function($compile, $rootScope) {

              $rootScope.val = 'transcluded content';
              element = $compile('<iso-async1><span ng-bind="val"></span></iso-async1>')($rootScope);
              $rootScope.$digest();
              expect(element.text()).toEqual('transcluded content');
            }));

            it('should pass the outer scope to the transclude on the isolated template async-async', inject(function($compile, $rootScope) {

              $rootScope.val = 'transcluded content';
              element = $compile('<iso-async2><span ng-bind="val"></span></iso-async2>')($rootScope);
              $rootScope.$digest();
              expect(element.text()).toEqual('transcluded content');
            }));

          });

          describe('multiple siblings receiving transclusion', function() {

            it('should only receive transclude from parent', function() {

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
                      template(scope.$new(), function(clone) {cursor.after(cursor = clone);});
                      ctrl.$transclude(function(clone) {cursor.after(clone);});
                    };
                  }
                };
              });
            });
            inject(function(log, $rootScope, $compile) {
              element = $compile('<div><div high-log trans="text" log>{{$parent.$id}}-{{$id}};</div></div>')($rootScope);
              $rootScope.$apply();
              expect(log).toEqual('compile: <!-- trans: text -->; link; LOG; LOG; HIGH');
              expect(element.text()).toEqual('1-2;1-3;');
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
                      '<!-- first: -->');
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
              }).toThrowMinErr('$compile', 'multidir', /Multiple directives \[first, second] asking for transclusion on: <div .+/);
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
            inject(function($compile, $exceptionHandler, $httpBackend) {
              $httpBackend.expectGET('template.html').respond('<p second>template.html</p>');

              $compile('<div template first></div>');
              $httpBackend.flush();

              expect($exceptionHandler.errors[0]).toEqualMinErr('$compile', 'multidir',
                  'Multiple directives [first, second] asking for transclusion on: <p ');
            });
          });

          it('should only allow one element transclusion per element when replace directive is in the mix', function() {
            module(function() {
              directive('template', valueFn({
                template: '<p second></p>',
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
            inject(function($compile) {
              expect(function() {
                $compile('<div template first></div>');
              }).toThrowMinErr('$compile', 'multidir', /Multiple directives \[first, second] asking for transclusion on: <p .+/);
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
              expect(nodeName_(element[1])).toBe('div');
              $compile(element)($rootScope);
              expect(nodeName_(element[1])).toBe('#comment');
              expect(nodeName_(comment)).toBe('#comment');
            });
          });


          it('should terminate compilation only for element transclusion', function() {
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
                  for (i = 0; i < cloneCount; i++) {
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
              for (i = 0; i < cloneCount; i++) {
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
              // We need to wrap the transclude directive's element in a parent element so that the
              // cloned element gets deallocated/cleaned up correctly
              element = $compile('<div><div transclude><div child></div></div></div>')($rootScope);
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
                    log('innerAgain:' + lowercase(nodeName_(element)) + ':' + trim(element[0].data));
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
                    log('inner:' + lowercase(nodeName_(element)) + ':' + trim(element[0].data));
                  }
                };
              });
              directive('outer', function(log) {
                return {
                  transclude: 'element',
                  link: function(scope, element, attrs, controllers, transclude) {
                    log('outer:' + lowercase(nodeName_(element)) + ':' + trim(element[0].data));
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
                'outer:#comment:outer:',
                'innerAgain:#comment:innerAgain:',
                'inner:#comment:innerAgain:'
              ]);
              expect(child.length).toBe(1);
              expect(child.contents().length).toBe(2);
              expect(lowercase(nodeName_(child.contents().eq(0)))).toBe('#comment');
              expect(lowercase(nodeName_(child.contents().eq(1)))).toBe('div');
            });
          });
        });


        it('should be possible to change the scope of a directive using $provide', function() {
          module(function($provide) {
            directive('foo', function() {
              return {
                scope: {},
                template: '<div></div>'
              };
            });
            $provide.decorator('fooDirective', function($delegate) {
              var directive = $delegate[0];
              directive.scope.something = '=';
              directive.template = '<span>{{something}}</span>';
              return $delegate;
            });
          });
          inject(function($compile, $rootScope) {
            element = $compile('<div><div foo something="bar"></div></div>')($rootScope);
            $rootScope.bar = 'bar';
            $rootScope.$digest();
            expect(element.text()).toBe('bar');
          });
        });


        it('should distinguish different bindings with the same binding name', function() {
          module(function() {
            directive('foo', function() {
              return {
                scope: {
                  foo: '=',
                  bar: '='
                },
                template: '<div><div>{{foo}}</div><div>{{bar}}</div></div>'
              };
            });
          });
          inject(function($compile, $rootScope) {
            element = $compile('<div><div foo="\'foo\'" bar="\'bar\'"></div></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('foobar');
          });
        });


        it('should safely create transclude comment node and not break with "-->"',
            inject(function($rootScope) {
          // see: https://github.com/angular/angular.js/issues/1740
          element = $compile('<ul><li ng-repeat="item in [\'-->\', \'x\']">{{item}}|</li></ul>')($rootScope);
          $rootScope.$digest();

          expect(element.text()).toBe('-->|x|');
        }));


        describe('lazy compilation', function() {
          // See https://github.com/angular/angular.js/issues/7183
          it('should pass transclusion through to template of a \'replace\' directive', function() {
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
                    $timeout(function() {
                      transclude(function(child) { element.append(child); });
                    });
                  }
                };
              });

              directive('replaceWithTemplate', function() {
                return {
                  templateUrl: 'template.html',
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

          it('should lazily compile the contents of directives that are transcluded', function() {
            var innerCompilationCount = 0, transclude;

            module(function() {
              directive('trans', valueFn({
                transclude: true,
                controller: function($transclude) {
                  transclude = $transclude;
                }
              }));

              directive('inner', valueFn({
                template: '<span>FooBar</span>',
                compile: function() {
                  innerCompilationCount += 1;
                }
              }));
            });

            inject(function($compile, $rootScope) {
              element = $compile('<trans><inner></inner></trans>')($rootScope);
              expect(innerCompilationCount).toBe(0);
              transclude(function(child) { element.append(child); });
              expect(innerCompilationCount).toBe(1);
              expect(element.text()).toBe('FooBar');
            });
          });

          it('should lazily compile the contents of directives that are transcluded with a template', function() {
            var innerCompilationCount = 0, transclude;

            module(function() {
              directive('trans', valueFn({
                transclude: true,
                template: '<div>Baz</div>',
                controller: function($transclude) {
                  transclude = $transclude;
                }
              }));

              directive('inner', valueFn({
                template: '<span>FooBar</span>',
                compile: function() {
                  innerCompilationCount += 1;
                }
              }));
            });

            inject(function($compile, $rootScope) {
              element = $compile('<trans><inner></inner></trans>')($rootScope);
              expect(innerCompilationCount).toBe(0);
              transclude(function(child) { element.append(child); });
              expect(innerCompilationCount).toBe(1);
              expect(element.text()).toBe('BazFooBar');
            });
          });

          it('should lazily compile the contents of directives that are transcluded with a templateUrl', function() {
            var innerCompilationCount = 0, transclude;

            module(function() {
              directive('trans', valueFn({
                transclude: true,
                templateUrl: 'baz.html',
                controller: function($transclude) {
                  transclude = $transclude;
                }
              }));

              directive('inner', valueFn({
                template: '<span>FooBar</span>',
                compile: function() {
                  innerCompilationCount += 1;
                }
              }));
            });

            inject(function($compile, $rootScope, $httpBackend) {
              $httpBackend.expectGET('baz.html').respond('<div>Baz</div>');
              element = $compile('<trans><inner></inner></trans>')($rootScope);
              $httpBackend.flush();

              expect(innerCompilationCount).toBe(0);
              transclude(function(child) { element.append(child); });
              expect(innerCompilationCount).toBe(1);
              expect(element.text()).toBe('BazFooBar');
            });
          });

          it('should lazily compile the contents of directives that are transclude element', function() {
            var innerCompilationCount = 0, transclude;

            module(function() {
              directive('trans', valueFn({
                transclude: 'element',
                controller: function($transclude) {
                  transclude = $transclude;
                }
              }));

              directive('inner', valueFn({
                template: '<span>FooBar</span>',
                compile: function() {
                  innerCompilationCount += 1;
                }
              }));
            });

            inject(function($compile, $rootScope) {
              element = $compile('<div><trans><inner></inner></trans></div>')($rootScope);
              expect(innerCompilationCount).toBe(0);
              transclude(function(child) { element.append(child); });
              expect(innerCompilationCount).toBe(1);
              expect(element.text()).toBe('FooBar');
            });
          });

          it('should lazily compile transcluded directives with ngIf on them', function() {
            var innerCompilationCount = 0, outerCompilationCount = 0, transclude;

            module(function() {
              directive('outer', valueFn({
                transclude: true,
                compile: function() {
                  outerCompilationCount += 1;
                },
                controller: function($transclude) {
                  transclude = $transclude;
                }
              }));

              directive('inner', valueFn({
                template: '<span>FooBar</span>',
                compile: function() {
                  innerCompilationCount += 1;
                }
              }));
            });

            inject(function($compile, $rootScope) {
              $rootScope.shouldCompile = false;

              element = $compile('<div><outer ng-if="shouldCompile"><inner></inner></outer></div>')($rootScope);
              expect(outerCompilationCount).toBe(0);
              expect(innerCompilationCount).toBe(0);
              expect(transclude).toBeUndefined();
              $rootScope.$apply('shouldCompile=true');
              expect(outerCompilationCount).toBe(1);
              expect(innerCompilationCount).toBe(0);
              expect(transclude).toBeDefined();
              transclude(function(child) { element.append(child); });
              expect(outerCompilationCount).toBe(1);
              expect(innerCompilationCount).toBe(1);
              expect(element.text()).toBe('FooBar');
            });
          });

          it('should eagerly compile multiple directives with transclusion and templateUrl/replace', function() {
            var innerCompilationCount = 0;

            module(function() {
              directive('outer', valueFn({
                transclude: true
              }));

              directive('outer', valueFn({
                templateUrl: 'inner.html',
                replace: true
              }));

              directive('inner', valueFn({
                compile: function() {
                  innerCompilationCount += 1;
                }
              }));
            });

            inject(function($compile, $rootScope, $httpBackend) {
              $httpBackend.expectGET('inner.html').respond('<inner></inner>');
              element = $compile('<outer></outer>')($rootScope);
              $httpBackend.flush();

              expect(innerCompilationCount).toBe(1);
            });
          });
        });

      });
    });
  });

  describe('multi-slot transclude', function() {
    it('should only include elements without a matching transclusion element in default transclusion slot', function() {
      module(function() {
        directive('minionComponent', function() {
          return {
            restrict: 'E',
            scope: {},
            transclude: {
              bossSlot: 'boss'
            },
            template:
              '<div class="other" ng-transclude></div>'
          };
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile(
          '<minion-component>' +
            '<span>stuart</span>' +
            '<span>bob</span>' +
            '<boss>gru</boss>' +
            '<span>kevin</span>' +
          '</minion-component>')($rootScope);
        $rootScope.$apply();
        expect(element.text()).toEqual('stuartbobkevin');
      });
    });

    it('should use the default transclusion slot if the ng-transclude attribute has the same value as its key', function() {
      module(function() {
        directive('minionComponent', function() {
          return {
            restrict: 'E',
            scope: {},
            transclude: {},
            template:
              '<div class="a" ng-transclude="ng-transclude"></div>' +
              '<div class="b" ng:transclude="ng:transclude"></div>' +
              '<div class="c" data-ng-transclude="data-ng-transclude"></div>'
          };
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile(
          '<minion-component>' +
            '<span>stuart</span>' +
            '<span>bob</span>' +
            '<span>kevin</span>' +
          '</minion-component>')($rootScope);
        $rootScope.$apply();
        var a = element.children().eq(0);
        var b = element.children().eq(1);
        var c = element.children().eq(2);
        expect(a).toHaveClass('a');
        expect(b).toHaveClass('b');
        expect(c).toHaveClass('c');
        expect(a.text()).toEqual('stuartbobkevin');
        expect(b.text()).toEqual('stuartbobkevin');
        expect(c.text()).toEqual('stuartbobkevin');
      });
    });


    it('should include non-element nodes in the default transclusion', function() {
      module(function() {
        directive('minionComponent', function() {
          return {
            restrict: 'E',
            scope: {},
            transclude: {
              bossSlot: 'boss'
            },
            template:
              '<div class="other" ng-transclude></div>'
          };
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile(
          '<minion-component>' +
            'text1' +
            '<span>stuart</span>' +
            '<span>bob</span>' +
            '<boss>gru</boss>' +
            'text2' +
            '<span>kevin</span>' +
          '</minion-component>')($rootScope);
        $rootScope.$apply();
        expect(element.text()).toEqual('text1stuartbobtext2kevin');
      });
    });

    it('should transclude elements to an `ng-transclude` with a matching transclusion slot name', function() {
      module(function() {
        directive('minionComponent', function() {
          return {
            restrict: 'E',
            scope: {},
            transclude: {
              minionSlot: 'minion',
              bossSlot: 'boss'
            },
            template:
              '<div class="boss" ng-transclude="bossSlot"></div>' +
              '<div class="minion" ng-transclude="minionSlot"></div>' +
              '<div class="other" ng-transclude></div>'
          };
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile(
          '<minion-component>' +
            '<minion>stuart</minion>' +
            '<span>dorothy</span>' +
            '<boss>gru</boss>' +
            '<minion>kevin</minion>' +
          '</minion-component>')($rootScope);
        $rootScope.$apply();
        expect(element.children().eq(0).text()).toEqual('gru');
        expect(element.children().eq(1).text()).toEqual('stuartkevin');
        expect(element.children().eq(2).text()).toEqual('dorothy');
      });
    });


    it('should use the `ng-transclude-slot` attribute if ng-transclude is used as an element', function() {
      module(function() {
        directive('minionComponent', function() {
          return {
            restrict: 'E',
            scope: {},
            transclude: {
              minionSlot: 'minion',
              bossSlot: 'boss'
            },
            template:
              '<ng-transclude class="boss" ng-transclude-slot="bossSlot"></ng-transclude>' +
              '<ng-transclude class="minion" ng-transclude-slot="minionSlot"></ng-transclude>' +
              '<ng-transclude class="other"></ng-transclude>'
          };
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile(
          '<minion-component>' +
            '<minion>stuart</minion>' +
            '<span>dorothy</span>' +
            '<boss>gru</boss>' +
            '<minion>kevin</minion>' +
          '</minion-component>')($rootScope);
        $rootScope.$apply();
        expect(element.children().eq(0).text()).toEqual('gru');
        expect(element.children().eq(1).text()).toEqual('stuartkevin');
        expect(element.children().eq(2).text()).toEqual('dorothy');
      });
    });

    it('should error if a required transclude slot is not filled', function() {
      module(function() {
        directive('minionComponent', function() {
          return {
            restrict: 'E',
            scope: {},
            transclude: {
              minionSlot: 'minion',
              bossSlot: 'boss'
            },
            template:
              '<div class="boss" ng-transclude="bossSlot"></div>' +
              '<div class="minion" ng-transclude="minionSlot"></div>' +
              '<div class="other" ng-transclude></div>'
          };
        });
      });
      inject(function($rootScope, $compile) {
        expect(function() {
          element = $compile(
            '<minion-component>' +
              '<minion>stuart</minion>' +
              '<span>dorothy</span>' +
            '</minion-component>')($rootScope);
        }).toThrowMinErr('$compile', 'reqslot', 'Required transclusion slot `bossSlot` was not filled.');
      });
    });


    it('should not error if an optional transclude slot is not filled', function() {
      module(function() {
        directive('minionComponent', function() {
          return {
            restrict: 'E',
            scope: {},
            transclude: {
              minionSlot: 'minion',
              bossSlot: '?boss'
            },
            template:
              '<div class="boss" ng-transclude="bossSlot"></div>' +
              '<div class="minion" ng-transclude="minionSlot"></div>' +
              '<div class="other" ng-transclude></div>'
          };
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile(
          '<minion-component>' +
            '<minion>stuart</minion>' +
            '<span>dorothy</span>' +
          '</minion-component>')($rootScope);
        $rootScope.$apply();
        expect(element.children().eq(1).text()).toEqual('stuart');
        expect(element.children().eq(2).text()).toEqual('dorothy');
      });
    });


    it('should error if we try to transclude a slot that was not declared by the directive', function() {
      module(function() {
        directive('minionComponent', function() {
          return {
            restrict: 'E',
            scope: {},
            transclude: {
              minionSlot: 'minion'
            },
            template:
              '<div class="boss" ng-transclude="bossSlot"></div>' +
              '<div class="minion" ng-transclude="minionSlot"></div>' +
              '<div class="other" ng-transclude></div>'
          };
        });
      });
      inject(function($rootScope, $compile) {
        expect(function() {
          element = $compile(
            '<minion-component>' +
              '<minion>stuart</minion>' +
              '<span>dorothy</span>' +
            '</minion-component>')($rootScope);
        }).toThrowMinErr('$compile', 'noslot',
          'No parent directive that requires a transclusion with slot name "bossSlot". ' +
          'Element: <div class="boss" ng-transclude="bossSlot">');
      });
    });

    it('should allow the slot name to equal the element name', function() {

      module(function() {
        directive('foo', function() {
          return {
            restrict: 'E',
            scope: {},
            transclude: {
              bar: 'bar'
            },
            template:
              '<div class="other" ng-transclude="bar"></div>'
          };
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile(
          '<foo>' +
            '<bar>baz</bar>' +
          '</foo>')($rootScope);
        $rootScope.$apply();
        expect(element.text()).toEqual('baz');
      });
    });


    it('should match the normalized form of the element name', function() {
      module(function() {
        directive('foo', function() {
          return {
            restrict: 'E',
            scope: {},
            transclude: {
              fooBarSlot: 'fooBar',
              mooKarSlot: 'mooKar'
            },
            template:
              '<div class="a" ng-transclude="fooBarSlot"></div>' +
              '<div class="b" ng-transclude="mooKarSlot"></div>'
          };
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile(
          '<foo>' +
            '<foo-bar>bar1</foo-bar>' +
            '<foo:bar>bar2</foo:bar>' +
            '<moo-kar>baz1</moo-kar>' +
            '<data-moo-kar>baz2</data-moo-kar>' +
          '</foo>')($rootScope);
        $rootScope.$apply();
        expect(element.children().eq(0).text()).toEqual('bar1bar2');
        expect(element.children().eq(1).text()).toEqual('baz1baz2');
      });
    });


    it('should return true from `isSlotFilled(slotName) for slots that have content in the transclusion', function() {
      var capturedTranscludeFn;
      module(function() {
        directive('minionComponent', function() {
          return {
            restrict: 'E',
            scope: {},
            transclude: {
              minionSlot: 'minion',
              bossSlot: '?boss'
            },
            template:
              '<div class="boss" ng-transclude="bossSlot"></div>' +
              '<div class="minion" ng-transclude="minionSlot"></div>' +
              '<div class="other" ng-transclude></div>',
            link: function(s, e, a, c, transcludeFn) {
              capturedTranscludeFn = transcludeFn;
            }
          };
        });
      });
      inject(function($rootScope, $compile, log) {
        element = $compile(
          '<minion-component>' +
          '  <minion>stuart</minion>' +
          '  <minion>bob</minion>' +
          '  <span>dorothy</span>' +
          '</minion-component>')($rootScope);
        $rootScope.$apply();

        var hasMinions = capturedTranscludeFn.isSlotFilled('minionSlot');
        var hasBosses = capturedTranscludeFn.isSlotFilled('bossSlot');

        expect(hasMinions).toBe(true);
        expect(hasBosses).toBe(false);
      });
    });

    it('should not overwrite the contents of an `ng-transclude` element, if the matching optional slot is not filled', function() {
      module(function() {
        directive('minionComponent', function() {
          return {
            restrict: 'E',
            scope: {},
            transclude: {
              minionSlot: 'minion',
              bossSlot: '?boss'
            },
            template:
              '<div class="boss" ng-transclude="bossSlot">default boss content</div>' +
              '<div class="minion" ng-transclude="minionSlot">default minion content</div>' +
              '<div class="other" ng-transclude>default content</div>'
          };
        });
      });
      inject(function($rootScope, $compile) {
        element = $compile(
          '<minion-component>' +
            '<minion>stuart</minion>' +
            '<span>dorothy</span>' +
            '<minion>kevin</minion>' +
          '</minion-component>')($rootScope);
        $rootScope.$apply();
        expect(element.children().eq(0).text()).toEqual('default boss content');
        expect(element.children().eq(1).text()).toEqual('stuartkevin');
        expect(element.children().eq(2).text()).toEqual('dorothy');
      });
    });


    // See issue https://github.com/angular/angular.js/issues/14924
    it('should not process top-level transcluded text nodes merged into their sibling',
      function() {
        module(function() {
          directive('transclude', valueFn({
            template: '<ng-transclude></ng-transclude>',
            transclude: {},
            scope: {}
          }));
        });

        inject(function($compile) {
          element = jqLite('<div transclude></div>');
          element[0].appendChild(document.createTextNode('1{{ value }}'));
          element[0].appendChild(document.createTextNode('2{{ value }}'));
          element[0].appendChild(document.createTextNode('3{{ value }}'));

          var initialWatcherCount = $rootScope.$countWatchers();
          $compile(element)($rootScope);
          $rootScope.$apply('value = 0');
          var newWatcherCount = $rootScope.$countWatchers() - initialWatcherCount;

          expect(element.text()).toBe('102030');
          expect(newWatcherCount).toBe(3);

          // Support: IE 11 only
          // See #11781 and #14924
          if (msie === 11) {
            expect(element.find('ng-transclude').contents().length).toBe(1);
          }
        });
      }
    );
  });

  describe('*[src] context requirement', function() {

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

    // Support: IE 9 only
    // IE9 rejects the video / audio tag with "Error: Not implemented" and the source tag with
    // "Unable to get value of the property 'childNodes': object is null or undefined"
    if (msie !== 9) {
      they('should NOT require trusted values for $prop src', ['video', 'audio'],
      function(tag) {
        inject(function($rootScope, $compile, $sce) {
          element = $compile('<' + tag + ' src="{{testUrl}}"></' + tag + '>')($rootScope);
          $rootScope.testUrl = 'http://example.com/image.mp4';
          $rootScope.$digest();
          expect(element.attr('src')).toEqual('http://example.com/image.mp4');

          // But it should accept trusted values anyway.
          $rootScope.testUrl = $sce.trustAsUrl('http://example.com/image2.mp4');
          $rootScope.$digest();
          expect(element.attr('src')).toEqual('http://example.com/image2.mp4');

          // and trustedResourceUrls for retrocompatibility
          $rootScope.testUrl = $sce.trustAsResourceUrl('http://example.com/image3.mp4');
          $rootScope.$digest();
          expect(element.attr('src')).toEqual('http://example.com/image3.mp4');
        });
      });

      they('should NOT require trusted values for $prop src', ['source', 'track'],
      function(tag) {
        inject(function($rootScope, $compile, $sce) {
          element = $compile('<video><' + tag + ' src="{{testUrl}}"></' + tag + '></video>')($rootScope);
          $rootScope.testUrl = 'http://example.com/image.mp4';
          $rootScope.$digest();
          expect(element.find(tag).attr('src')).toEqual('http://example.com/image.mp4');

          // But it should accept trusted values anyway.
          $rootScope.testUrl = $sce.trustAsUrl('http://example.com/image2.mp4');
          $rootScope.$digest();
          expect(element.find(tag).attr('src')).toEqual('http://example.com/image2.mp4');

          // and trustedResourceUrls for retrocompatibility
          $rootScope.testUrl = $sce.trustAsResourceUrl('http://example.com/image3.mp4');
          $rootScope.$digest();
          expect(element.find(tag).attr('src')).toEqual('http://example.com/image3.mp4');
        });
      });
    }
  });

  describe('img[src] sanitization', function() {

    it('should not sanitize attributes other than src', inject(function($compile, $rootScope) {
      element = $compile('<img title="{{testUrl}}"></img>')($rootScope);
      $rootScope.testUrl = 'javascript:doEvilStuff()';
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
        $rootScope.testUrl = 'someUrl';

        $$sanitizeUri.and.returnValue('someSanitizedUrl');
        $rootScope.$apply();
        expect(element.attr('src')).toBe('someSanitizedUrl');
        expect($$sanitizeUri).toHaveBeenCalledWith($rootScope.testUrl, true);
      });
    });
  });

  describe('img[srcset] sanitization', function() {

    it('should not error if undefined', function() {
      var linked = false;
      module(function() {
        directive('setter', valueFn(function(scope, elem, attrs) {
          attrs.$set('srcset', 'http://example.com/');
          expect(attrs.srcset).toBe('http://example.com/');

          attrs.$set('srcset', undefined);
          expect(attrs.srcset).toBeUndefined();

          linked = true;
        }));
      });
      inject(function($compile, $rootScope) {
        element = $compile('<img setter></img>')($rootScope);

        expect(linked).toBe(true);
        expect(element.attr('srcset')).toBeUndefined();
      });
    });

    it('should NOT require trusted values for img srcset', inject(function($rootScope, $compile, $sce) {
      element = $compile('<img srcset="{{testUrl}}"></img>')($rootScope);
      $rootScope.testUrl = 'http://example.com/image.png';
      $rootScope.$digest();
      expect(element.attr('srcset')).toEqual('http://example.com/image.png');
      // But it should accept trusted values anyway.
      $rootScope.testUrl = $sce.trustAsUrl('http://example.com/image2.png');
      $rootScope.$digest();
      expect(element.attr('srcset')).toEqual('http://example.com/image2.png');
    }));

    it('should use $$sanitizeUri', function() {
      var $$sanitizeUri = jasmine.createSpy('$$sanitizeUri');
      module(function($provide) {
        $provide.value('$$sanitizeUri', $$sanitizeUri);
      });
      inject(function($compile, $rootScope) {
        element = $compile('<img srcset="{{testUrl}}"></img>')($rootScope);
        $rootScope.testUrl = 'someUrl';

        $$sanitizeUri.and.returnValue('someSanitizedUrl');
        $rootScope.$apply();
        expect(element.attr('srcset')).toBe('someSanitizedUrl');
        expect($$sanitizeUri).toHaveBeenCalledWith($rootScope.testUrl, true);
      });
    });

    it('should sanitize all uris in srcset', inject(function($rootScope, $compile) {
      element = $compile('<img srcset="{{testUrl}}"></img>')($rootScope);
      var testSet = {
        'http://example.com/image.png':'http://example.com/image.png',
        ' http://example.com/image.png':'http://example.com/image.png',
        'http://example.com/image.png ':'http://example.com/image.png',
        'http://example.com/image.png 128w':'http://example.com/image.png 128w',
        'http://example.com/image.png 2x':'http://example.com/image.png 2x',
        'http://example.com/image.png 1.5x':'http://example.com/image.png 1.5x',
        'http://example.com/image1.png 1x,http://example.com/image2.png 2x':'http://example.com/image1.png 1x,http://example.com/image2.png 2x',
        'http://example.com/image1.png 1x ,http://example.com/image2.png 2x':'http://example.com/image1.png 1x ,http://example.com/image2.png 2x',
        'http://example.com/image1.png 1x, http://example.com/image2.png 2x':'http://example.com/image1.png 1x,http://example.com/image2.png 2x',
        'http://example.com/image1.png 1x , http://example.com/image2.png 2x':'http://example.com/image1.png 1x ,http://example.com/image2.png 2x',
        'http://example.com/image1.png 48w,http://example.com/image2.png 64w':'http://example.com/image1.png 48w,http://example.com/image2.png 64w',
        //Test regex to make sure doesn't mistake parts of url for width descriptors
        'http://example.com/image1.png?w=48w,http://example.com/image2.png 64w':'http://example.com/image1.png?w=48w,http://example.com/image2.png 64w',
        'http://example.com/image1.png 1x,http://example.com/image2.png 64w':'http://example.com/image1.png 1x,http://example.com/image2.png 64w',
        'http://example.com/image1.png,http://example.com/image2.png':'http://example.com/image1.png ,http://example.com/image2.png',
        'http://example.com/image1.png ,http://example.com/image2.png':'http://example.com/image1.png ,http://example.com/image2.png',
        'http://example.com/image1.png, http://example.com/image2.png':'http://example.com/image1.png ,http://example.com/image2.png',
        'http://example.com/image1.png , http://example.com/image2.png':'http://example.com/image1.png ,http://example.com/image2.png',
        'http://example.com/image1.png 1x, http://example.com/image2.png 2x, http://example.com/image3.png 3x':
          'http://example.com/image1.png 1x,http://example.com/image2.png 2x,http://example.com/image3.png 3x',
        'javascript:doEvilStuff() 2x': 'unsafe:javascript:doEvilStuff() 2x',
        'http://example.com/image1.png 1x,javascript:doEvilStuff() 2x':'http://example.com/image1.png 1x,unsafe:javascript:doEvilStuff() 2x',
        'http://example.com/image1.jpg?x=a,b 1x,http://example.com/ima,ge2.jpg 2x':'http://example.com/image1.jpg?x=a,b 1x,http://example.com/ima,ge2.jpg 2x',
        //Test regex to make sure doesn't mistake parts of url for pixel density descriptors
        'http://example.com/image1.jpg?x=a2x,b 1x,http://example.com/ima,ge2.jpg 2x':'http://example.com/image1.jpg?x=a2x,b 1x,http://example.com/ima,ge2.jpg 2x'
      };

      forEach(testSet, function(ref, url) {
        $rootScope.testUrl = url;
        $rootScope.$digest();
        expect(element.attr('srcset')).toEqual(ref);
      });

    }));
  });

  describe('a[href] sanitization', function() {

    it('should not sanitize href on elements other than anchor', inject(function($compile, $rootScope) {
      element = $compile('<div href="{{testUrl}}"></div>')($rootScope);
      $rootScope.testUrl = 'javascript:doEvilStuff()';
      $rootScope.$apply();

      expect(element.attr('href')).toBe('javascript:doEvilStuff()');
    }));

    it('should not sanitize attributes other than href', inject(function($compile, $rootScope) {
      element = $compile('<a title="{{testUrl}}"></a>')($rootScope);
      $rootScope.testUrl = 'javascript:doEvilStuff()';
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
        $rootScope.testUrl = 'someUrl';

        $$sanitizeUri.and.returnValue('someSanitizedUrl');
        $rootScope.$apply();
        expect(element.attr('href')).toBe('someSanitizedUrl');
        expect($$sanitizeUri).toHaveBeenCalledWith($rootScope.testUrl, false);
      });
    });

    it('should use $$sanitizeUri when declared via ng-href', function() {
      var $$sanitizeUri = jasmine.createSpy('$$sanitizeUri');
      module(function($provide) {
        $provide.value('$$sanitizeUri', $$sanitizeUri);
      });
      inject(function($compile, $rootScope) {
        element = $compile('<a ng-href="{{testUrl}}"></a>')($rootScope);
        $rootScope.testUrl = 'someUrl';

        $$sanitizeUri.and.returnValue('someSanitizedUrl');
        $rootScope.$apply();
        expect(element.attr('href')).toBe('someSanitizedUrl');
        expect($$sanitizeUri).toHaveBeenCalledWith($rootScope.testUrl, false);
      });
    });

    it('should use $$sanitizeUri when working with svg and xlink:href', function() {
      var $$sanitizeUri = jasmine.createSpy('$$sanitizeUri');
      module(function($provide) {
        $provide.value('$$sanitizeUri', $$sanitizeUri);
      });
      inject(function($compile, $rootScope) {
        element = $compile('<svg><a xlink:href="" ng-href="{{ testUrl }}"></a></svg>')($rootScope);
        $rootScope.testUrl = 'evilUrl';

        $$sanitizeUri.and.returnValue('someSanitizedUrl');
        $rootScope.$apply();
        expect(element.find('a').prop('href').baseVal).toBe('someSanitizedUrl');
        expect($$sanitizeUri).toHaveBeenCalledWith($rootScope.testUrl, false);
      });
    });


    it('should use $$sanitizeUri when working with svg and xlink:href', function() {
      var $$sanitizeUri = jasmine.createSpy('$$sanitizeUri');
      module(function($provide) {
        $provide.value('$$sanitizeUri', $$sanitizeUri);
      });
      inject(function($compile, $rootScope) {
        element = $compile('<svg><a xlink:href="" ng-href="{{ testUrl }}"></a></svg>')($rootScope);
        $rootScope.testUrl = 'evilUrl';

        $$sanitizeUri.and.returnValue('someSanitizedUrl');
        $rootScope.$apply();
        expect(element.find('a').prop('href').baseVal).toBe('someSanitizedUrl');
        expect($$sanitizeUri).toHaveBeenCalledWith($rootScope.testUrl, false);
      });
    });
  });

  describe('interpolation on HTML DOM event handler attributes onclick, onXYZ, formaction', function() {
    it('should disallow interpolation on onclick', inject(function($compile, $rootScope) {
      // All interpolations are disallowed.
      $rootScope.onClickJs = '';
      expect(function() {
          $compile('<button onclick="{{onClickJs}}"></script>');
        }).toThrowMinErr(
          '$compile', 'nodomevents', 'Interpolations for HTML DOM event attributes are disallowed.  ' +
          'Please use the ng- versions (such as ng-click instead of onclick) instead.');
      expect(function() {
          $compile('<button ONCLICK="{{onClickJs}}"></script>');
        }).toThrowMinErr(
          '$compile', 'nodomevents', 'Interpolations for HTML DOM event attributes are disallowed.  ' +
          'Please use the ng- versions (such as ng-click instead of onclick) instead.');
      expect(function() {
          $compile('<button ng-attr-onclick="{{onClickJs}}"></script>');
        }).toThrowMinErr(
          '$compile', 'nodomevents', 'Interpolations for HTML DOM event attributes are disallowed.  ' +
          'Please use the ng- versions (such as ng-click instead of onclick) instead.');
    }));

    it('should pass through arbitrary values on onXYZ event attributes that contain a hyphen', inject(function($compile, $rootScope) {
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
      $rootScope.testUrl = 'different_page';
      $rootScope.$apply();
      expect(element.attr('src')).toEqual('different_page');
    }));

    it('should clear out src attributes for a different domain', inject(function($compile, $rootScope, $sce) {
      element = $compile('<iframe src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = 'http://a.different.domain.example.com';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$interpolate', 'interr', 'Can\'t interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked ' +
          'loading resource from url not allowed by $sceDelegate policy.  URL: ' +
          'http://a.different.domain.example.com');
    }));

    it('should clear out JS src attributes', inject(function($compile, $rootScope, $sce) {
      element = $compile('<iframe src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = 'javascript:alert(1);';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$interpolate', 'interr', 'Can\'t interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked ' +
          'loading resource from url not allowed by $sceDelegate policy.  URL: ' +
          'javascript:alert(1);');
    }));

    it('should clear out non-resource_url src attributes', inject(function($compile, $rootScope, $sce) {
      element = $compile('<iframe src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = $sce.trustAsUrl('javascript:doTrustedStuff()');
      expect($rootScope.$apply).toThrowMinErr(
          '$interpolate', 'interr', 'Can\'t interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked ' +
          'loading resource from url not allowed by $sceDelegate policy.  URL: javascript:doTrustedStuff()');
    }));

    it('should pass through $sce.trustAs() values in src attributes', inject(function($compile, $rootScope, $sce) {
      element = $compile('<iframe src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = $sce.trustAsResourceUrl('javascript:doTrustedStuff()');
      $rootScope.$apply();

      expect(element.attr('src')).toEqual('javascript:doTrustedStuff()');
    }));
  });

  describe('base[href]', function() {
    it('should be a RESOURCE_URL context', inject(function($compile, $rootScope, $sce) {
      element = $compile('<base href="{{testUrl}}"/>')($rootScope);

      $rootScope.testUrl = $sce.trustAsResourceUrl('https://example.com/');
      $rootScope.$apply();
      expect(element.attr('href')).toContain('https://example.com/');

      $rootScope.testUrl = 'https://not.example.com/';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$interpolate', 'interr', 'Can\'t interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked ' +
          'loading resource from url not allowed by $sceDelegate policy.  URL: ' +
          'https://not.example.com/');
    }));
  });

  describe('form[action]', function() {
    it('should pass through action attribute for the same domain', inject(function($compile, $rootScope, $sce) {
      element = $compile('<form action="{{testUrl}}"></form>')($rootScope);
      $rootScope.testUrl = 'different_page';
      $rootScope.$apply();
      expect(element.attr('action')).toEqual('different_page');
    }));

    it('should clear out action attribute for a different domain', inject(function($compile, $rootScope, $sce) {
      element = $compile('<form action="{{testUrl}}"></form>')($rootScope);
      $rootScope.testUrl = 'http://a.different.domain.example.com';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$interpolate', 'interr', 'Can\'t interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked ' +
          'loading resource from url not allowed by $sceDelegate policy.  URL: ' +
          'http://a.different.domain.example.com');
    }));

    it('should clear out JS action attribute', inject(function($compile, $rootScope, $sce) {
      element = $compile('<form action="{{testUrl}}"></form>')($rootScope);
      $rootScope.testUrl = 'javascript:alert(1);';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$interpolate', 'interr', 'Can\'t interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked ' +
          'loading resource from url not allowed by $sceDelegate policy.  URL: ' +
          'javascript:alert(1);');
    }));

    it('should clear out non-resource_url action attribute', inject(function($compile, $rootScope, $sce) {
      element = $compile('<form action="{{testUrl}}"></form>')($rootScope);
      $rootScope.testUrl = $sce.trustAsUrl('javascript:doTrustedStuff()');
      expect($rootScope.$apply).toThrowMinErr(
          '$interpolate', 'interr', 'Can\'t interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked ' +
          'loading resource from url not allowed by $sceDelegate policy.  URL: javascript:doTrustedStuff()');
    }));


    it('should pass through $sce.trustAs() values in action attribute', inject(function($compile, $rootScope, $sce) {
      element = $compile('<form action="{{testUrl}}"></form>')($rootScope);
      $rootScope.testUrl = $sce.trustAsResourceUrl('javascript:doTrustedStuff()');
      $rootScope.$apply();

      expect(element.attr('action')).toEqual('javascript:doTrustedStuff()');
    }));
  });

  describe('link[href]', function() {
    it('should reject invalid RESOURCE_URLs', inject(function($compile, $rootScope) {
      element = $compile('<link href="{{testUrl}}" rel="stylesheet" />')($rootScope);
      $rootScope.testUrl = 'https://evil.example.org/css.css';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$interpolate', 'interr', 'Can\'t interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked ' +
          'loading resource from url not allowed by $sceDelegate policy.  URL: ' +
          'https://evil.example.org/css.css');
    }));

    it('should accept valid RESOURCE_URLs', inject(function($compile, $rootScope, $sce) {
      element = $compile('<link href="{{testUrl}}" rel="stylesheet" />')($rootScope);

      $rootScope.testUrl = './css1.css';
      $rootScope.$apply();
      expect(element.attr('href')).toContain('css1.css');

      $rootScope.testUrl = $sce.trustAsResourceUrl('https://elsewhere.example.org/css2.css');
      $rootScope.$apply();
      expect(element.attr('href')).toContain('https://elsewhere.example.org/css2.css');
    }));

    it('should accept valid constants', inject(function($compile, $rootScope) {
      element = $compile('<link href="https://elsewhere.example.org/css2.css" rel="stylesheet" />')($rootScope);

      $rootScope.$apply();
      expect(element.attr('href')).toContain('https://elsewhere.example.org/css2.css');
    }));
  });

  // Support: IE 9-10 only
  // IEs <11 don't support srcdoc
  if (!msie || msie === 11) {
    describe('iframe[srcdoc]', function() {
      it('should NOT set iframe contents for untrusted values', inject(function($compile, $rootScope, $sce) {
        element = $compile('<iframe srcdoc="{{html}}"></iframe>')($rootScope);
        $rootScope.html = '<div onclick="">hello</div>';
        expect(function() { $rootScope.$digest(); }).toThrowMinErr('$interpolate', 'interr', new RegExp(
            /Can't interpolate: {{html}}\n/.source +
            /[^[]*\[\$sce:unsafe] Attempting to use an unsafe value in a safe context./.source));
      }));

      it('should NOT set html for wrongly typed values', inject(function($rootScope, $compile, $sce) {
        element = $compile('<iframe srcdoc="{{html}}"></iframe>')($rootScope);
        $rootScope.html = $sce.trustAsCss('<div onclick="">hello</div>');
        expect(function() { $rootScope.$digest(); }).toThrowMinErr('$interpolate', 'interr', new RegExp(
            /Can't interpolate: \{\{html}}\n/.source +
            /[^[]*\[\$sce:unsafe] Attempting to use an unsafe value in a safe context./.source));
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
    it('should bind after digest but not before', inject(function() {
      $rootScope.name = 'Misko';
      element = $compile('<span ng-attr-test="{{name}}"></span>')($rootScope);
      expect(element.attr('test')).toBeUndefined();
      $rootScope.$digest();
      expect(element.attr('test')).toBe('Misko');
    }));

    it('should bind after digest but not before when after overridden attribute', inject(function() {
      $rootScope.name = 'Misko';
      element = $compile('<span test="123" ng-attr-test="{{name}}"></span>')($rootScope);
      expect(element.attr('test')).toBe('123');
      $rootScope.$digest();
      expect(element.attr('test')).toBe('Misko');
    }));

    it('should bind after digest but not before when before overridden attribute', inject(function() {
      $rootScope.name = 'Misko';
      element = $compile('<span ng-attr-test="{{name}}" test="123"></span>')($rootScope);
      expect(element.attr('test')).toBe('123');
      $rootScope.$digest();
      expect(element.attr('test')).toBe('Misko');
    }));

    it('should set the attribute (after digest) even if there is no interpolation', inject(function() {
      element = $compile('<span ng-attr-test="foo"></span>')($rootScope);
      expect(element.attr('test')).toBeUndefined();

      $rootScope.$digest();
      expect(element.attr('test')).toBe('foo');
    }));

    it('should remove attribute if any bindings are undefined', inject(function() {
      element = $compile('<span ng-attr-test="{{name}}{{emphasis}}"></span>')($rootScope);
      $rootScope.$digest();
      expect(element.attr('test')).toBeUndefined();
      $rootScope.name = 'caitp';
      $rootScope.$digest();
      expect(element.attr('test')).toBeUndefined();
      $rootScope.emphasis = '!!!';
      $rootScope.$digest();
      expect(element.attr('test')).toBe('caitp!!!');
    }));

    describe('in directive', function() {
      var log;

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

      beforeEach(inject(function($templateCache, _log_) {
        log = _log_;
        $templateCache.put('async.html', '<h1>Test</h1>');
      }));

      it('should provide post-digest value in synchronous directive link functions when after overridden attribute',
        function() {
          $rootScope.test = 'TEST';
          element = $compile('<div sync-test test="123" ng-attr-test="{{test}}"></div>')($rootScope);
          expect(element.attr('test')).toBe('123');
          expect(log.toArray()).toEqual(['TEST', 'TEST']);
        }
      );

      it('should provide post-digest value in synchronous directive link functions when before overridden attribute',
        function() {
          $rootScope.test = 'TEST';
          element = $compile('<div sync-test ng-attr-test="{{test}}" test="123"></div>')($rootScope);
          expect(element.attr('test')).toBe('123');
          expect(log.toArray()).toEqual(['TEST', 'TEST']);
        }
      );


      it('should provide post-digest value in asynchronous directive link functions when after overridden attribute',
        function() {
          $rootScope.test = 'TEST';
          element = $compile('<div async-test test="123" ng-attr-test="{{test}}"></div>')($rootScope);
          expect(element.attr('test')).toBe('123');
          $rootScope.$digest();
          expect(log.toArray()).toEqual(['TEST', 'TEST']);
        }
      );

      it('should provide post-digest value in asynchronous directive link functions when before overridden attribute',
        function() {
          $rootScope.test = 'TEST';
          element = $compile('<div async-test ng-attr-test="{{test}}" test="123"></div>')($rootScope);
          expect(element.attr('test')).toBe('123');
          $rootScope.$digest();
          expect(log.toArray()).toEqual(['TEST', 'TEST']);
        }
      );
    });

    it('should work with different prefixes', inject(function() {
      $rootScope.name = 'Misko';
      element = $compile('<span ng:attr:test="{{name}}" ng-Attr-test2="{{name}}" ng_Attr_test3="{{name}}"></span>')($rootScope);
      expect(element.attr('test')).toBeUndefined();
      expect(element.attr('test2')).toBeUndefined();
      expect(element.attr('test3')).toBeUndefined();
      $rootScope.$digest();
      expect(element.attr('test')).toBe('Misko');
      expect(element.attr('test2')).toBe('Misko');
      expect(element.attr('test3')).toBe('Misko');
    }));

    it('should work with the "href" attribute', inject(function() {
      $rootScope.value = 'test';
      element = $compile('<a ng-attr-href="test/{{value}}"></a>')($rootScope);
      $rootScope.$digest();
      expect(element.attr('href')).toBe('test/test');
    }));

    it('should work if they are prefixed with x- or data- and different prefixes', inject(function() {
      $rootScope.name = 'Misko';
      element = $compile('<span data-ng-attr-test2="{{name}}" x-ng-attr-test3="{{name}}" data-ng:attr-test4="{{name}}" ' +
        'x_ng-attr-test5="{{name}}" data:ng-attr-test6="{{name}}"></span>')($rootScope);
      expect(element.attr('test2')).toBeUndefined();
      expect(element.attr('test3')).toBeUndefined();
      expect(element.attr('test4')).toBeUndefined();
      expect(element.attr('test5')).toBeUndefined();
      expect(element.attr('test6')).toBeUndefined();
      $rootScope.$digest();
      expect(element.attr('test2')).toBe('Misko');
      expect(element.attr('test3')).toBe('Misko');
      expect(element.attr('test4')).toBe('Misko');
      expect(element.attr('test5')).toBe('Misko');
      expect(element.attr('test6')).toBe('Misko');
    }));

    describe('when an attribute has a dash-separated name', function() {
      it('should work with different prefixes', inject(function() {
        $rootScope.name = 'JamieMason';
        element = $compile('<span ng:attr:dash-test="{{name}}" ng-Attr-dash-test2="{{name}}" ng_Attr_dash-test3="{{name}}"></span>')($rootScope);
        expect(element.attr('dash-test')).toBeUndefined();
        expect(element.attr('dash-test2')).toBeUndefined();
        expect(element.attr('dash-test3')).toBeUndefined();
        $rootScope.$digest();
        expect(element.attr('dash-test')).toBe('JamieMason');
        expect(element.attr('dash-test2')).toBe('JamieMason');
        expect(element.attr('dash-test3')).toBe('JamieMason');
      }));

      it('should work if they are prefixed with x- or data-', inject(function() {
        $rootScope.name = 'JamieMason';
        element = $compile('<span data-ng-attr-dash-test2="{{name}}" x-ng-attr-dash-test3="{{name}}" data-ng:attr-dash-test4="{{name}}"></span>')($rootScope);
        expect(element.attr('dash-test2')).toBeUndefined();
        expect(element.attr('dash-test3')).toBeUndefined();
        expect(element.attr('dash-test4')).toBeUndefined();
        $rootScope.$digest();
        expect(element.attr('dash-test2')).toBe('JamieMason');
        expect(element.attr('dash-test3')).toBe('JamieMason');
        expect(element.attr('dash-test4')).toBe('JamieMason');
      }));

      it('should keep attributes ending with -start single-element directives', function() {
        module(function($compileProvider) {
          $compileProvider.directive('dashStarter', function(log) {
            return {
              link: function(scope, element, attrs) {
                log(attrs.onDashStart);
              }
            };
          });
        });
        inject(function($compile, $rootScope, log) {
          $compile('<span data-dash-starter data-on-dash-start="starter"></span>')($rootScope);
          $rootScope.$digest();
          expect(log).toEqual('starter');
        });
      });

      it('should keep attributes ending with -end single-element directives', function() {
        module(function($compileProvider) {
          $compileProvider.directive('dashEnder', function(log) {
            return {
              link: function(scope, element, attrs) {
                log(attrs.onDashEnd);
              }
            };
          });
        });
        inject(function($compile, $rootScope, log) {
          $compile('<span data-dash-ender data-on-dash-end="ender"></span>')($rootScope);
          $rootScope.$digest();
          expect(log).toEqual('ender');
        });
      });
    });
  });


  describe('when an attribute has an underscore-separated name', function() {

    it('should work with different prefixes', inject(function($compile, $rootScope) {
      $rootScope.dimensions = '0 0 0 0';
      element = $compile('<svg ng:attr:view_box="{{dimensions}}"></svg>')($rootScope);
      expect(element.attr('viewBox')).toBeUndefined();
      $rootScope.$digest();
      expect(element.attr('viewBox')).toBe('0 0 0 0');
    }));

    it('should work if they are prefixed with x- or data-', inject(function($compile, $rootScope) {
      $rootScope.dimensions = '0 0 0 0';
      $rootScope.number = 0.42;
      $rootScope.scale = 1;
      element = $compile('<svg data-ng-attr-view_box="{{dimensions}}">' +
        '<filter x-ng-attr-filter_units="{{number}}">' +
        '<feDiffuseLighting data-ng:attr_surface_scale="{{scale}}">' +
        '</feDiffuseLighting>' +
        '<feSpecularLighting x-ng:attr_surface_scale="{{scale}}">' +
        '</feSpecularLighting></filter></svg>')($rootScope);
      expect(element.attr('viewBox')).toBeUndefined();
      $rootScope.$digest();
      expect(element.attr('viewBox')).toBe('0 0 0 0');
      expect(element.find('filter').attr('filterUnits')).toBe('0.42');
      expect(element.find('feDiffuseLighting').attr('surfaceScale')).toBe('1');
      expect(element.find('feSpecularLighting').attr('surfaceScale')).toBe('1');
    }));
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


    it('should group on nested groups', function() {
      module(function($compileProvider) {
        $compileProvider.directive('ngMultiBind', valueFn({
          multiElement: true,
          link: function(scope, element, attr) {
            element.text(scope.$eval(attr.ngMultiBind));
          }
        }));
      });
      inject(function($compile, $rootScope) {
        $rootScope.show = false;
        element = $compile(
            '<div></div>' +
                '<div ng-repeat-start="i in [1,2]">{{i}}A</div>' +
                '<span ng-multi-bind-start="\'.\'"></span>' +
                '<span ng-multi-bind-end></span>' +
                '<div ng-repeat-end>{{i}}B;</div>' +
            '<div></div>')($rootScope);
        $rootScope.$digest();
        element = jqLite(element[0].parentNode.childNodes); // reset because repeater is top level.
        expect(element.text()).toEqual('1A..1B;2A..2B;');
      });
    });


    it('should group on nested groups of same directive', inject(function($compile, $rootScope) {
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


    it('should set up and destroy the transclusion scopes correctly',
          inject(function($compile, $rootScope) {
      element = $compile(
        '<div>' +
          '<div ng-if-start="val0"><span ng-if="val1"></span></div>' +
          '<div ng-if-end><span ng-if="val2"></span></div>' +
        '</div>'
      )($rootScope);
      $rootScope.$apply('val0 = true; val1 = true; val2 = true');

      // At this point we should have something like:
      //
      // <div class="ng-scope">
      //
      //   <!-- ngIf: val0 -->
      //
      //   <div ng-if-start="val0" class="ng-scope">
      //     <!-- ngIf: val1 -->
      //     <span ng-if="val1" class="ng-scope"></span>
      //     <!-- end ngIf: val1 -->
      //   </div>
      //
      //   <div ng-if-end="" class="ng-scope">
      //     <!-- ngIf: val2 -->
      //     <span ng-if="val2" class="ng-scope"></span>
      //     <!-- end ngIf: val2 -->
      //   </div>
      //
      //   <!-- end ngIf: val0 -->
      // </div>
      var ngIfStartScope = element.find('div').eq(0).scope();
      var ngIfEndScope = element.find('div').eq(1).scope();

      expect(ngIfStartScope.$id).toEqual(ngIfEndScope.$id);

      var ngIf1Scope = element.find('span').eq(0).scope();
      var ngIf2Scope = element.find('span').eq(1).scope();

      expect(ngIf1Scope.$id).not.toEqual(ngIf2Scope.$id);
      expect(ngIf1Scope.$parent.$id).toEqual(ngIf2Scope.$parent.$id);

      $rootScope.$apply('val1 = false');

      // Now we should have something like:
      //
      // <div class="ng-scope">
      //   <!-- ngIf: val0 -->
      //   <div ng-if-start="val0" class="ng-scope">
      //     <!-- ngIf: val1 -->
      //   </div>
      //   <div ng-if-end="" class="ng-scope">
      //     <!-- ngIf: val2 -->
      //     <span ng-if="val2" class="ng-scope"></span>
      //     <!-- end ngIf: val2 -->
      //   </div>
      //   <!-- end ngIf: val0 -->
      // </div>

      expect(ngIfStartScope.$$destroyed).not.toEqual(true);
      expect(ngIf1Scope.$$destroyed).toEqual(true);
      expect(ngIf2Scope.$$destroyed).not.toEqual(true);

      $rootScope.$apply('val0 = false');

      // Now we should have something like:
      //
      // <div class="ng-scope">
      //   <!-- ngIf: val0 -->
      // </div>

      expect(ngIfStartScope.$$destroyed).toEqual(true);
      expect(ngIf1Scope.$$destroyed).toEqual(true);
      expect(ngIf2Scope.$$destroyed).toEqual(true);
    }));


    it('should set up and destroy the transclusion scopes correctly',
          inject(function($compile, $rootScope) {
      element = $compile(
        '<div>' +
          '<div ng-repeat-start="val in val0" ng-if="val1"></div>' +
          '<div ng-repeat-end ng-if="val2"></div>' +
        '</div>'
      )($rootScope);

      // To begin with there is (almost) nothing:
      // <div class="ng-scope">
      //   <!-- ngRepeat: val in val0 -->
      // </div>

      expect(element.scope().$id).toEqual($rootScope.$id);

      // Now we create all the elements
      $rootScope.$apply('val0 = [1]; val1 = true; val2 = true');

      // At this point we have:
      //
      // <div class="ng-scope">
      //
      //   <!-- ngRepeat: val in val0 -->
      //   <!-- ngIf: val1 -->
      //   <div ng-repeat-start="val in val0" class="ng-scope">
      //   </div>
      //   <!-- end ngIf: val1 -->
      //
      //   <!-- ngIf: val2 -->
      //   <div ng-repeat-end="" class="ng-scope">
      //   </div>
      //   <!-- end ngIf: val2 -->
      //   <!-- end ngRepeat: val in val0 -->
      // </div>
      var ngIf1Scope = element.find('div').eq(0).scope();
      var ngIf2Scope = element.find('div').eq(1).scope();
      var ngRepeatScope = ngIf1Scope.$parent;

      expect(ngIf1Scope.$id).not.toEqual(ngIf2Scope.$id);
      expect(ngIf1Scope.$parent.$id).toEqual(ngRepeatScope.$id);
      expect(ngIf2Scope.$parent.$id).toEqual(ngRepeatScope.$id);

      // What is happening here??
      // We seem to have a repeater scope which doesn't actually match to any element
      expect(ngRepeatScope.$parent.$id).toEqual($rootScope.$id);


      // Now remove the first ngIf element from the first item in the repeater
      $rootScope.$apply('val1 = false');

      // At this point we should have:
      //
      // <div class="ng-scope">
      //   <!-- ngRepeat: val in val0 -->
      //
      //   <!-- ngIf: val1 -->
      //
      //   <!-- ngIf: val2 -->
      //   <div ng-repeat-end="" ng-if="val2" class="ng-scope"></div>
      //   <!-- end ngIf: val2 -->
      //
      //   <!-- end ngRepeat: val in val0 -->
      // </div>
      //
      expect(ngRepeatScope.$$destroyed).toEqual(false);
      expect(ngIf1Scope.$$destroyed).toEqual(true);
      expect(ngIf2Scope.$$destroyed).toEqual(false);

      // Now remove the second ngIf element from the first item in the repeater
      $rootScope.$apply('val2 = false');

      // We are mostly back to where we started
      //
      // <div class="ng-scope">
      //   <!-- ngRepeat: val in val0 -->
      //   <!-- ngIf: val1 -->
      //   <!-- ngIf: val2 -->
      //   <!-- end ngRepeat: val in val0 -->
      // </div>

      expect(ngRepeatScope.$$destroyed).toEqual(false);
      expect(ngIf1Scope.$$destroyed).toEqual(true);
      expect(ngIf2Scope.$$destroyed).toEqual(true);

      // Finally remove the repeat items
      $rootScope.$apply('val0 = []');

      // Somehow this ngRepeat scope knows how to destroy itself...
      expect(ngRepeatScope.$$destroyed).toEqual(true);
      expect(ngIf1Scope.$$destroyed).toEqual(true);
      expect(ngIf2Scope.$$destroyed).toEqual(true);
    }));

    it('should throw error if unterminated', function() {
      module(function($compileProvider) {
        $compileProvider.directive('foo', function() {
          return {
            multiElement: true
          };
        });
      });
      inject(function($compile, $rootScope) {
        expect(function() {
          element = $compile(
              '<div>' +
                '<span foo-start></span>' +
              '</div>');
        }).toThrowMinErr('$compile', 'uterdir', 'Unterminated attribute, found \'foo-start\' but no matching \'foo-end\' found.');
      });
    });


    it('should correctly collect ranges on multiple directives on a single element', function() {
      module(function($compileProvider) {
        $compileProvider.directive('emptyDirective', function() {
          return {
            multiElement: true,
            link: function(scope, element) {
              element.data('x', 'abc');
            }
          };
        });
        $compileProvider.directive('rangeDirective', function() {
          return {
            multiElement: true,
            link: function(scope) {
              scope.x = 'X';
              scope.y = 'Y';
            }
          };
        });
      });

      inject(function($compile, $rootScope) {
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


    it('should throw error if unterminated (containing termination as a child)', function() {
      module(function($compileProvider) {
        $compileProvider.directive('foo', function() {
          return {
            multiElement: true
          };
        });
      });
      inject(function($compile) {
        expect(function() {
          element = $compile(
              '<div>' +
                  '<span foo-start><span foo-end></span></span>' +
              '</div>');
        }).toThrowMinErr('$compile', 'uterdir', 'Unterminated attribute, found \'foo-start\' but no matching \'foo-end\' found.');
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
        expect(data.event).toBe('addClass');
        expect(data.args[1]).toBe('dice');

        data = $animate.queue.shift();
        expect(data.event).toBe('removeClass');
        expect(data.args[1]).toBe('rice');

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

  describe('element replacement', function() {
    it('should broadcast $destroy only on removed elements, not replaced', function() {
      var linkCalls = [];
      var destroyCalls = [];

      module(function($compileProvider) {
        $compileProvider.directive('replace', function() {
          return {
            multiElement: true,
            replace: true,
            templateUrl: 'template123'
          };
        });

        $compileProvider.directive('foo', function() {
          return {
            priority: 1, // before the replace directive
            link: function($scope, $element, $attrs) {
              linkCalls.push($attrs.foo);
              $element.on('$destroy', function() {
                destroyCalls.push($attrs.foo);
              });
            }
          };
        });
      });

      inject(function($compile, $templateCache, $rootScope) {
        $templateCache.put('template123', '<p></p>');

        $compile(
          '<div replace-start foo="1"><span foo="1.1"></span></div>' +
          '<div foo="2"><span foo="2.1"></span></div>' +
          '<div replace-end foo="3"><span foo="3.1"></span></div>'
        )($rootScope);

        expect(linkCalls).toEqual(['2', '3']);
        expect(destroyCalls).toEqual([]);
        $rootScope.$apply();
        expect(linkCalls).toEqual(['2', '3', '1']);
        expect(destroyCalls).toEqual(['2', '3']);
      });
    });

    function getAll($root) {
      // check for .querySelectorAll to support comment nodes
      return [$root[0]].concat($root[0].querySelectorAll ? sliceArgs($root[0].querySelectorAll('*')) : []);
    }

    function testCompileLinkDataCleanup(template) {
      inject(function($compile, $rootScope) {
        var toCompile = jqLite(template);

        var preCompiledChildren = getAll(toCompile);
        forEach(preCompiledChildren, function(element, i) {
          jqLite.data(element, 'foo', 'template#' + i);
        });

        var linkedElements = $compile(toCompile)($rootScope);
        $rootScope.$apply();
        linkedElements.remove();

        forEach(preCompiledChildren, function(element, i) {
          expect(jqLite.hasData(element)).toBe(false, 'template#' + i);
        });
        forEach(getAll(linkedElements), function(element, i) {
          expect(jqLite.hasData(element)).toBe(false, 'linked#' + i);
        });
      });
    }
    it('should clean data of element-transcluded link-cloned elements', function() {
      testCompileLinkDataCleanup('<div><div ng-repeat-start="i in [1,2]"><span></span></div><div ng-repeat-end></div></div>');
    });
    it('should clean data of element-transcluded elements', function() {
      testCompileLinkDataCleanup('<div ng-if-start="false"><span><span/></div><span></span><div ng-if-end><span></span></div>');
    });

    function testReplaceElementCleanup(dirOptions) {
      var template = '<div></div>';
      module(function($compileProvider) {
        $compileProvider.directive('theDir', function() {
          return {
            multiElement: true,
            replace: dirOptions.replace,
            transclude: dirOptions.transclude,
            template: dirOptions.asyncTemplate ? undefined : template,
            templateUrl: dirOptions.asyncTemplate ? 'the-dir-template-url' : undefined
          };
        });
      });
      inject(function($templateCache, $compile, $rootScope) {
        $templateCache.put('the-dir-template-url', template);

        testCompileLinkDataCleanup(
          '<div>' +
          '<div the-dir-start><span></span></div>' +
          '<div><span></span><span></span></div>' +
          '<div the-dir-end><span></span></div>' +
          '</div>'
        );
      });
    }
    it('should clean data of elements removed for directive template', function() {
      testReplaceElementCleanup({});
    });
    it('should clean data of elements removed for directive templateUrl', function() {
      testReplaceElementCleanup({asyncTemplate: true});
    });
    it('should clean data of elements transcluded into directive template', function() {
      testReplaceElementCleanup({transclude: true});
    });
    it('should clean data of elements transcluded into directive templateUrl', function() {
      testReplaceElementCleanup({transclude: true, asyncTemplate: true});
    });
    it('should clean data of elements replaced with directive template', function() {
      testReplaceElementCleanup({replace: true});
    });
    it('should clean data of elements replaced with directive templateUrl', function() {
      testReplaceElementCleanup({replace: true, asyncTemplate: true});
    });
  });

  describe('component helper', function() {
    it('should return the module', function() {
      var myModule = angular.module('my', []);
      expect(myModule.component('myComponent', {})).toBe(myModule);
    });

    it('should register a directive', function() {
      angular.module('my', []).component('myComponent', {
        template: '<div>SUCCESS</div>',
        controller: function(log) {
          log('OK');
        }
      });
      module('my');

      inject(function($compile, $rootScope, log) {
        element = $compile('<my-component></my-component>')($rootScope);
        expect(element.find('div').text()).toEqual('SUCCESS');
        expect(log).toEqual('OK');
      });
    });

    it('should register a directive via $compileProvider.component()', function() {
      module(function($compileProvider) {
        $compileProvider.component('myComponent', {
          template: '<div>SUCCESS</div>',
          controller: function(log) {
            log('OK');
          }
        });
      });

      inject(function($compile, $rootScope, log) {
        element = $compile('<my-component></my-component>')($rootScope);
        expect(element.find('div').text()).toEqual('SUCCESS');
        expect(log).toEqual('OK');
      });
    });

    it('should add additional annotations to directive factory', function() {
      var myModule = angular.module('my', []).component('myComponent', {
        $canActivate: 'canActivate',
        $routeConfig: 'routeConfig',
        $customAnnotation: 'XXX'
      });
      expect(myModule._invokeQueue.pop().pop()[1]).toEqual(jasmine.objectContaining({
        $canActivate: 'canActivate',
        $routeConfig: 'routeConfig',
        $customAnnotation: 'XXX'
      }));
    });

    it('should expose additional annotations on the directive definition object', function() {
      angular.module('my', []).component('myComponent', {
        $canActivate: 'canActivate',
        $routeConfig: 'routeConfig',
        $customAnnotation: 'XXX'
      });
      module('my');
      inject(function(myComponentDirective) {
        expect(myComponentDirective[0]).toEqual(jasmine.objectContaining({
          $canActivate: 'canActivate',
          $routeConfig: 'routeConfig',
          $customAnnotation: 'XXX'
        }));
      });
    });

    it('should support custom annotations if the controller is named', function() {
      angular.module('my', []).component('myComponent', {
        $customAnnotation: 'XXX',
        controller: 'SomeNamedController'
      });
      module('my');
      inject(function(myComponentDirective) {
        expect(myComponentDirective[0]).toEqual(jasmine.objectContaining({
          $customAnnotation: 'XXX'
        }));
      });
    });

    it('should provide a new empty controller if none is specified', function() {
      angular.
        module('my', []).
        component('myComponent1', {$customAnnotation1: 'XXX'}).
        component('myComponent2', {$customAnnotation2: 'YYY'});

      module('my');

      inject(function(myComponent1Directive, myComponent2Directive) {
        var ctrl1 = myComponent1Directive[0].controller;
        var ctrl2 = myComponent2Directive[0].controller;

        expect(ctrl1).not.toBe(ctrl2);
        expect(ctrl1.$customAnnotation1).toBe('XXX');
        expect(ctrl1.$customAnnotation2).toBeUndefined();
        expect(ctrl2.$customAnnotation1).toBeUndefined();
        expect(ctrl2.$customAnnotation2).toBe('YYY');
      });
    });

    it('should return ddo with reasonable defaults', function() {
      angular.module('my', []).component('myComponent', {});
      module('my');
      inject(function(myComponentDirective) {
        expect(myComponentDirective[0]).toEqual(jasmine.objectContaining({
          controller: jasmine.any(Function),
          controllerAs: '$ctrl',
          template: '',
          templateUrl: undefined,
          transclude: undefined,
          scope: {},
          bindToController: {},
          restrict: 'E'
        }));
      });
    });

    it('should return ddo with assigned options', function() {
      function myCtrl() {}
      angular.module('my', []).component('myComponent', {
        controller: myCtrl,
        controllerAs: 'ctrl',
        template: 'abc',
        templateUrl: 'def.html',
        transclude: true,
        bindings: {abc: '='}
      });
      module('my');
      inject(function(myComponentDirective) {
        expect(myComponentDirective[0]).toEqual(jasmine.objectContaining({
          controller: myCtrl,
          controllerAs: 'ctrl',
          template: 'abc',
          templateUrl: 'def.html',
          transclude: true,
          scope: {},
          bindToController: {abc: '='},
          restrict: 'E'
        }));
      });
    });

    it('should allow passing injectable functions as template/templateUrl', function() {
      var log = '';
      angular.module('my', []).component('myComponent', {
        template: function($element, $attrs, myValue) {
          log += 'template,' + $element + ',' + $attrs + ',' + myValue + '\n';
        },
        templateUrl: function($element, $attrs, myValue) {
          log += 'templateUrl,' + $element + ',' + $attrs + ',' + myValue + '\n';
        }
      }).value('myValue', 'blah');
      module('my');
      inject(function(myComponentDirective) {
        myComponentDirective[0].template('a', 'b');
        myComponentDirective[0].templateUrl('c', 'd');
        expect(log).toEqual('template,a,b,blah\ntemplateUrl,c,d,blah\n');
      });
    });

    it('should allow passing injectable arrays as template/templateUrl', function() {
      var log = '';
      angular.module('my', []).component('myComponent', {
        template: ['$element', '$attrs', 'myValue', function($element, $attrs, myValue) {
          log += 'template,' + $element + ',' + $attrs + ',' + myValue + '\n';
        }],
        templateUrl: ['$element', '$attrs', 'myValue', function($element, $attrs, myValue) {
          log += 'templateUrl,' + $element + ',' + $attrs + ',' + myValue + '\n';
        }]
      }).value('myValue', 'blah');
      module('my');
      inject(function(myComponentDirective) {
        myComponentDirective[0].template('a', 'b');
        myComponentDirective[0].templateUrl('c', 'd');
        expect(log).toEqual('template,a,b,blah\ntemplateUrl,c,d,blah\n');
      });
    });

    it('should allow passing transclude as object', function() {
      angular.module('my', []).component('myComponent', {
        transclude: {}
      });
      module('my');
      inject(function(myComponentDirective) {
        expect(myComponentDirective[0]).toEqual(jasmine.objectContaining({
          transclude: {}
        }));
      });
    });

    it('should give ctrl as syntax priority over controllerAs', function() {
      angular.module('my', []).component('myComponent', {
        controller: 'MyCtrl as vm'
      });
      module('my');
      inject(function(myComponentDirective) {
        expect(myComponentDirective[0]).toEqual(jasmine.objectContaining({
          controllerAs: 'vm'
        }));
      });
    });
  });

  describe('$$createComment', function() {
    it('should create empty comments if `debugInfoEnabled` is false', function() {
      module(function($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
      });

      inject(function($compile) {
        var comment = $compile.$$createComment('foo', 'bar');
        expect(comment.data).toBe('');
      });
    });

    it('should create descriptive comments if `debugInfoEnabled` is true', function() {
      module(function($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
      });

      inject(function($compile) {
        var comment = $compile.$$createComment('foo', 'bar');
        expect(comment.data).toBe(' foo: bar ');
      });
    });
  });
});
