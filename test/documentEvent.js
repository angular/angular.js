document.hasBeenSpecialClicked = 0;

jqLite(document).on('dblclick', function (e) {
  if (e.name === 'special') {
    document.hasBeenSpecialClicked++;
  }
});
