'use strict';

angular.module('tutorials', [])

.directive('docTutorialNav', function() {
  var pages = [
    '',
    'step_00', 'step_01', 'step_02', 'step_03', 'step_04',
    'step_05', 'step_06', 'step_07', 'step_08', 'step_09',
    'step_10', 'step_11', 'step_12', 'step_13', 'step_14',
    'the_end'
  ];
  return {
    scope: {},
    template:
      '<a ng-href="tutorial/{{prev}}"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>\n' +
      '<a ng-href="http://angular.github.io/angular-phonecat/step-{{seq}}/app"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>\n' +
      '<a ng-href="https://github.com/angular/angular-phonecat/compare/step-{{diffLo}}...step-{{diffHi}}"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>\n' +
      '<a ng-href="tutorial/{{next}}"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>',
    link: function(scope, element, attrs) {
      var seq = 1 * attrs.docTutorialNav;
      scope.seq = seq;
      scope.prev = pages[seq];
      scope.next = pages[2 + seq];
      scope.diffLo = seq ? (seq - 1) : '0~1';
      scope.diffHi = seq;

      element.addClass('btn-group');
      element.addClass('tutorial-nav');
    }
  };
})


.directive('docTutorialReset', function() {
  return {
    scope: {
      'step': '@docTutorialReset'
    },
    template:
      '<p><button class="btn" ng-click="show=!show">Workspace Reset Instructions  ➤</button></p>\n' +
      '<div class="alert alert-info" ng-show="show">\n' +
      '  <p>Reset the workspace to step {{step}}.</p>' +
      '  <p><pre>git checkout -f step-{{step}}</pre></p>\n' +
      '  <p>Refresh your browser or check out this step online: ' +
          '<a href="http://angular.github.io/angular-phonecat/step-{{step}}/app">Step {{step}} Live Demo</a>.</p>\n' +
      '</div>\n' +
      '<p>The most important changes are listed below. You can see the full diff on ' +
        '<a ng-href="https://github.com/angular/angular-phonecat/compare/step-{{step ? (step - 1): \'0~1\'}}...step-{{step}}" title="See diff on Github">GitHub</a>.\n' +
      '</p>'
  };
});
