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
