{{#all}}
describe('{{name}}', function(){
  beforeEach(function(){
    navigateTo('index.html#{{name}}');
  });
  // {{raw.file}}:{{raw.line}}
{{{scenario}}}
});
{{/all}}