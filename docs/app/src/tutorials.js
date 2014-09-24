angular.module('tutorials', [])

.directive('docTutorialNav', ['templateMerge' ,function(templateMerge) {
  var pages = [
    '',
    'step_00', 'step_01', 'step_02', 'step_03', 'step_04',
    'step_05', 'step_06', 'step_07', 'step_08', 'step_09',
    'step_10', 'step_11', 'step_12', 'the_end'
  ];
  return {
    compile: function(element, attrs) {
      var seq = 1 * attrs.docTutorialNav,
          props = {
            seq: seq,
            prev: pages[seq],
            next: pages[2 + seq],
            diffLo: seq ? (seq - 1): '0~1',
            diffHi: seq
          };

      element.addClass('btn-group');
      element.addClass('tutorial-nav');
      element.append(templateMerge(
        '<a href="tutorial/{{prev}}"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>\n' +
        '<a href="http://angular.github.io/angular-phonecat/step-{{seq}}/app"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>\n' +
        '<a href="https://github.com/angular/angular-phonecat/compare/step-{{diffLo}}...step-{{diffHi}}"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>\n' +
        '<a href="tutorial/{{next}}"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>', props));
    }
  };
}])


.directive('docTutorialReset', function() {
  return {
    scope: {
      'step': '@docTutorialReset'
    },
    template:
      '<p><a href="" ng-click="show=!show;$event.stopPropagation()">Workspace Reset Instructions  ➤</a></p>\n' +
      '<div class="alert alert-info" ng-show="show">\n' +
      '  <p>Reset the workspace to step {{step}}.</p>' +
      '  <p><pre>git checkout -f step-{{step}}</pre></p>\n' +
      '  <p>Refresh your browser or check out this step online: '+
          '<a href="http://angular.github.io/angular-phonecat/step-{{step}}/app">Step {{step}} Live Demo</a>.</p>\n' +
      '</div>\n' +
      '<p>The most important changes are listed below. You can see the full diff on ' +
        '<a ng-href="https://github.com/angular/angular-phonecat/compare/step-{{step ? (step - 1): \'0~1\'}}...step-{{step}}">GitHub</a>\n' +
      '</p>'
  };
});
