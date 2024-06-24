importScripts('moveTabs.js', 'pasteDateTime.js', 'goToFirstPage.js', 'contextMenu.js');

chrome.commands.onCommand.addListener(async function(command) {
  const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
  let activeTab = tabs[0];

  if (command === "move-tab-left") {
    console.log("Moving to the previous tab");
    await moveTabLeft();
  } else if (command === "move-tab-right") {
    console.log("Moving to the next tab");
    await moveTabRight();
  } else if (command === "paste-date-time") {
    console.log("Paste Date and Time command received");
    await pasteDateTime(activeTab.id);
  } else if (command === "go-to-first-page") {
    console.log("Go to First Page command received");
    await goToFirstPage(activeTab.id);
  }
});

let closedTabs = [];

// タブが閉じられた時の処理
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  // Check if the tab is in the closedTabs list before removing it
  closedTabs = closedTabs.filter(t => t.id !== tabId);

  // Store the closed tab information
  chrome.sessions.getRecentlyClosed({ maxResults: 1 }, function(sessions) {
    if (sessions && sessions.length > 0 && sessions[0].tab) {
      let tab = sessions[0].tab;
      closedTabs.push(tab);
    }
  });
});
