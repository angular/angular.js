document.hasBeenSpecialClicked = 0;
jqLite(document).on('specialclick', function () {
  document.hasBeenSpecialClicked++;
});
