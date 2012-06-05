var injectPrereqs = {};

var cbs = {};

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  if (request.script === 'debug-true') {

    cbs[request.tab] = (function (req) {
      return function (tabId, changeInfo, tab) {
        if (tabId !== req.tab || changeInfo.status) {
          return;
        }
        chrome.tabs.executeScript(tabId, {
          file: 'inject/debug.js'
        });
      };
    }(request));
    chrome.tabs.onUpdated.addListener(cbs[request.tab]);
  } else if (request.script === 'debug-false') {
    if (cbs[request.tab]) {
      chrome.tabs.onUpdated.removeListener(cbs[request.tab]);
      delete cbs[request.tab];
    }
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
  if (sendResponse) {
    sendResponse();
  }
});
