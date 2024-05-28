chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});