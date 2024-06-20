async function goToFirstPage(tabId) {
    await chrome.scripting.executeScript({
      target: { tabId },
      function: function() {
        window.history.go(-(window.history.length - 1));
      }
    });
  }
  