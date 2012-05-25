chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  chrome.tabs.executeScript(request.tab, {
    file: 'inject/' + request.script + '.js'
  });
});