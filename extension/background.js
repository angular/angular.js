var injectPrereqs = {};

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  if (!injectPrereqs[request.tab]) {
    chrome.tabs.executeScript(request.tab, {
      file: 'js/css-inject.js'
    }, function () {
      injectPrereqs[request.tab] = true;
      chrome.tabs.executeScript(request.tab, {
        file: 'inject/' + request.script + '.js'
      });
    });
  } else {
    chrome.tabs.executeScript(request.tab, {
      file: 'inject/' + request.script + '.js'
    });
  }
});