{{#pages}}
describe('{{name}}', function(){
  beforeEach(function(){
    browser().navigateTo('index.html#{{name}}');
  });
  // {{raw.file}}:{{raw.line}}
{{{scenario}}}
});
{{/pages}}
