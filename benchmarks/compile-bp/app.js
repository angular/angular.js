var app = angular.module('compileBenchmark', []);

var registerDirective;
app.config(function($compileProvider) {
  if ($compileProvider.debugInfoEnabled) {
    $compileProvider.debugInfoEnabled(false);
  }

  registerDirective = function(name, config) {
    $compileProvider.directive(name, function() { return config; });
  };
});

app.controller('DataController', function($element, $compile, $scope, $templateCache) {
  //The set of directives which have been created
  var directivesCreated = {};

  //The current template being tested
  var template;

  $scope.oJSON = JSON.stringify($scope.o = {});

  $scope.$watch("oJSON", function(oJSON) {
    angular.copy(JSON.parse(oJSON), $scope.o);
  });

  $scope.$watchCollection("o", function(options) {
    var json = $scope.oJSON = JSON.stringify(options);
    var directiveName = "test" + json.toLowerCase().replace(/[^a-z0-9]+/g, '');

    if (!directivesCreated[directiveName]) {
      var directiveDef = {};

      //Simple options
      directiveDef.replace = options.replace || false;
      directiveDef.transclude = options.transclude || false;
      directiveDef.multiElement = options.multiElement || false;
      directiveDef.controller = options.controller ? function testController(){} : undefined;

      //Template
      if (options.templateType) {
        if (options.templateType === 'template') {
          directiveDef.template = '<div></div>';
        } else if (options.templateType === 'templateUrl') {
          $templateCache.put(directiveDef.templateUrl = directiveName + 'tmpl', '<div></div>');
        }
      }

      //Link method(s)
      var link;
      if (options.preLink) {
        link = {pre: function testPreLink(){}, post: options.postLink && function testPostLink(){}};
      } else if (options.postLink) {
        link = function testLink(){};
      }

      //Compile/link declaration
      if (options.compile) {
        directiveDef.compile = function testCompile() { return link; };
      } else if (link) {
        directiveDef.link = link;
      }

      registerDirective(directiveName, directivesCreated[directiveName] = directiveDef);
    }

    //Single vs multiElement spanning
    var eCount = options.elementCount || 1;
    if (eCount <= 1) {
      template = angular.element(document.createElement(directiveName));
    } else {
      template = angular.element();
      template[template.length++] = angular.element('<div>').attr(directiveName+'-start', '')[0];
      for (var i = 1; i < eCount - 1; i++) {
        template[template.length++] = document.createElement('span');
      }
      template[template.length++] = angular.element('<div>').attr(directiveName+'-end', '')[0];
    }

    //Transcluded elements have children
    if (options.transclude) {
      template.append(document.createElement('div'));
    }

    //Root element vs has-parent
    if (options.wrap) {
      template = angular.element(document.createElement('div')).append(template);
    }
  });



  // TEST STEPS / STATE

  var RUN_COUNT = 5000;

  var linkFns = [];
  var elements = [];
  function pushElements(elms) {
    elements.push(elms);
    return elms;
  }

  benchmarkSteps.push({
    name: 'compile',
    fn: function compile() {
      for (var i=0; i<RUN_COUNT; i++) {
        linkFns[i] = $compile( pushElements(template.clone()) );
      }
    }
  });

  benchmarkSteps.push({
    name: 'link-clone',
    fn: function linkClone() {
      for (var i=0; i<RUN_COUNT; i++) {
        linkFns[i]($scope, pushElements);
      }
    }
  });

  benchmarkSteps.push({
    name: 'link',
    fn: function link() {
      for (var i=0; i<RUN_COUNT; i++) {
        linkFns[i]($scope);
      }
    }
  });

  benchmarkSteps.push({
    name: 'apply',
    fn: function linkApply() {
      $scope.$apply();
    }
  });

  benchmarkSteps.push({
    name: 'destroy',
    fn: function destory() {
      while (elements.length) {
        elements.pop().remove();
      }
      linkFns = [];
    }
  });
});
