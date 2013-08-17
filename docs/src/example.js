var seqCount = 0;
var usedIds = {};
var makeUnique = {
  'index.html': true,
  'style.css': true,
  'script.js': true,
  'unit.js': true,
  'spec.js': true,
  'scenario.js': true
}

function ids(list) {
  return list.map(function(item) { return item.id; }).join(' ');
};


exports.Example = function(scenarios) {
  this.module = '';
  this.deps = ['angular.js'];
  this.html = [];
  this.css = [];
  this.js = [];
  this.json = [];
  this.unit = [];
  this.scenario = [];
  this.scenarios = scenarios;
}

exports.Example.prototype.setModule = function(module) {
  if (module) {
    this.module = module;
  }
};

exports.Example.prototype.addDeps = function(deps) {
  deps && deps.split(/[\s\,]/).forEach(function(dep) {
    if (dep) {
      this.deps.push(dep);
    }
  }, this);
};

exports.Example.prototype.addSource = function(name, content) {
  var ext = name == 'scenario.js' ? 'scenario' : name.split('.')[1],
      id = name;

  if (makeUnique[name] && usedIds[id]) {
    id = name + '-' + (seqCount++);
  }
  usedIds[id] = true;
  
  this[ext].push({name: name, content: content, id: id});
  if (name.match(/\.js$/) && name !== 'spec.js' && name !== 'unit.js' && name != 'scenario.js') {
    this.deps.push(name);
  }
  if (ext == 'scenario') {
    this.scenarios.push(content);
  }
};

exports.Example.prototype.enableAnimations = function() {
  this.animations = true;
};

exports.Example.prototype.disableAnimations = function() {
  this.animations = false;
};

exports.Example.prototype.toHtml = function() {
  var html = "<h2>Source</h2>\n";
  html += this.toHtmlEdit();
  html += this.toHtmlTabs();
  if(this.animations) {
    html += '<div class="pull-right">';
    html += ' <button class="btn btn-primary" ng-click="animationsOff=true" ng-hide="animationsOff">Animations on</button>';
    html += ' <button class="btn btn-primary disabled" ng-click="animationsOff=false" ng-show="animationsOff">Animations off</button>';
    html += '</div>';
  }
  html += "<h2>Demo</h2>\n";
  html += this.toHtmlEmbed();
  return html;
};


exports.Example.prototype.toHtmlEdit = function() {
  var out = [];
  out.push('<div source-edit="' + this.module + '"');
  out.push(' source-edit-deps="' + this.deps.join(' ') + '"');
  out.push(' source-edit-html="' + ids(this.html) + '"');
  out.push(' source-edit-css="' + ids(this.css) + '"');
  out.push(' source-edit-js="' + ids(this.js) + '"');
  out.push(' source-edit-json="' + ids(this.json) + '"');
  out.push(' source-edit-unit="' + ids(this.unit) + '"');
  out.push(' source-edit-scenario="' + ids(this.scenario) + '"');
  out.push('></div>\n');
  return out.join('');
};

exports.Example.prototype.toHtmlTabs = function() {
  var out = [],
      self = this;

  out.push('<div class="tabbable">');
  htmlTabs(this.html);
  htmlTabs(this.css);
  htmlTabs(this.js);
  htmlTabs(this.json);
  htmlTabs(this.unit);
  htmlTabs(this.scenario);
  out.push('</div>');
  return out.join('');

  function htmlTabs(sources) {
    sources.forEach(function(source) {
      var wrap = '',
          isCss = source.name.match(/\.css$/),
          name = source.name;

      if (name === 'index.html') {
        wrap = ' ng-html-wrap="' + self.module + ' ' + self.deps.join(' ') + '"';
      }
      if (name == 'scenario.js') name = 'End to end test';

      out.push(
        '<div class="tab-pane" title="' + name + '">\n' +
          '<pre class="prettyprint linenums" ng-set-text="' + source.id + '"' + wrap + '></pre>\n' +
          (isCss
             ? ('<style type="text/css" id="' + source.id + '">' + source.content + '</style>\n')
             : ('<script type="text/ng-template" id="' + source.id + '">' + source.content + '</script>\n') ) +
        '</div>\n');
    });
  }
};

exports.Example.prototype.toHtmlEmbed = function() {
  var out = [];
  out.push('<div class="well doc-example-live animate-container"');
  if(this.animations) {
    out.push(" ng-class=\"{'animations-off':animationsOff == true}\"");
  }
  out.push(' ng-embed-app="' + this.module + '"');
  out.push(' ng-set-html="' + this.html[0].id + '"');
  out.push(' ng-eval-javascript="' + ids(this.js) + '">');
  out.push('</div>');
  return out.join('');
};

