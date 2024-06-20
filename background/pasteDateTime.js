async function pasteDateTime(tabId) {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
    chrome.tabs.sendMessage(tabId, { command: "paste-date-time" }, function(response) {
      if (chrome.runtime.lastError) {
        console.error("Failed to send message:", chrome.runtime.lastError);
      } else {
        console.log("Response:", response);
      }
    });
  }
  