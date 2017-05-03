// returns the first line of a multi-line string
panelApp.filter('first', function () {
  return function (input, output) {
    return input.split("\n")[0];
  };
});
