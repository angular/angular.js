angular.module('tutorials', [])

.directive('docTutorialNav', function(templateMerge) {
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
        '<a href="http://angular.github.com/angular-phonecat/step-{{seq}}/app"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>\n' +
        '<a href="https://github.com/angular/angular-phonecat/compare/step-{{diffLo}}...step-{{diffHi}}"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>\n' +
        '<a href="tutorial/{{next}}"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>', props));
    }
  };
})


.directive('docTutorialReset', function() {
  function tab(name, command, id, step) {
    return '' +
      '  <div class=\'tab-pane well\' title="' + name + '" value="' + id + '">\n' +
      '    <ol>\n' +
      '      <li><p>Reset the workspace to step ' + step + '.</p>' +
      '        <pre>' + command + '</pre></li>\n' +
      '      <li><p>Refresh your browser or check the app out on <a href="http://angular.github.com/angular-phonecat/step-' + step + '/app">Angular\'s server</a>.</p></li>\n' +
      '    </ol>\n' +
      '  </div>\n';
  }

  return {
    compile: function(element, attrs) {
      var step = attrs.docTutorialReset;
      element.html(
        '<div ng-hide="show">' +
          '<p><a href="" ng-click="show=true;$event.stopPropagation()">Workspace Reset Instructions  ➤</a></p>' +
        '</div>\n' +
        '<div class="tabbable" ng-show="show" ng-model="$cookies.platformPreference">\n' +
          tab('Git on Mac/Linux', 'git checkout -f step-' + step, 'gitUnix', step) +
          tab('Git on Windows', 'git checkout -f step-' + step, 'gitWin', step) +
        '</div>\n');
    }
  };
});
