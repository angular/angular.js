var injectPrereqs = {};

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  if (request.script === 'debug') {

    (function () {
      
      var req = request;

      chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (tabId !== req.tab) {
          return;
        }
        chrome.tabs.executeScript(tabId, {
          file: 'inject/debug.js'
        });
      });

    }());

  } else if (!injectPrereqs[request.tab]) {
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