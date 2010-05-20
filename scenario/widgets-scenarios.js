angular.scenarioDef.widgets = {
  $before:[
    {Given:"browser", at:"widgets.html"}
  ],
  checkWidgetBinding:[
    {Then:"text", at:"{{text.basic}}", should_be:""},
    {When:"enter", text:"John", at:":input[name=text.basic]"},
    {Then:"text", at:"{{text.basic}}", should_be:"John"},

    {Then:"text", at:"{{gender}}", should_be:"male"},
    {When:"click", at:"input:radio[value=female]"},
    {Then:"text", at:"{{gender}}", should_be:"female"},

    {Then:"text", at:"{{tea}}", should_be:"on"},
    {When:"click", at:"input[name=tea]"},
    {Then:"text", at:"{{tea}}", should_be:""},

    {Then:"text", at:"{{coffee}}", should_be:""},
    {When:"click", at:"input[name=coffee]"},
    {Then:"text", at:"{{coffee}}", should_be:"on"},

    {Then:"text", at:"{{count}}", should_be:0},
    {When:"click", at:"form :button"},
    {When:"click", at:"form :submit"},
    {When:"click", at:"form :image"},
    {Then:"text", at:"{{count}}", should_be:3},

    {Then:"text", at:"{{select}}", should_be:"A"},
    {When:"select", at:"select[name=select]", option:"B"},
    {Then:"text", at:"{{select}}", should_be:"B"},

    {Then:"text", at:"{{multiple}}", should_be:"[]"},
    {When:"select", at:"select[name=multiple]", option:"A"},
    {Then:"text", at:"{{multiple}}", should_be:["A"]},
    {When:"select", at:"select[name=multiple]", option:"B"},
    {Then:"text", at:"{{multiple}}", should_be:["A", "B"]},
    {When:"select", at:"select[name=multiple]", option:"A"},
    {Then:"text", at:"{{multiple}}", should_be:["B"]},

    {Then:"text", at:"{{hidden}}", should_be:"hiddenValue"},

    {Then:"text", at:"{{password}}", should_be:"passwordValue"},
    {When:"enter", text:"reset", at:":input[name=password]"},
    {Then:"text", at:"{{password}}", should_be:"reset"},
  ],
  checkNewWidgetEmpty:[
    {Then:"text", at:"{{name}}", should_be:""},
  ]
};
