// Create context menu items
chrome.runtime.onInstalled.addListener(() => {
    // Create a top-level context menu item for storing selected text
    chrome.contextMenus.create({
      id: "storeSelectedText",
      title: "Store selected text",
      contexts: ["selection"]
    });
  
    // Create a parent menu item for stored texts and other options
    chrome.contextMenus.create({
      id: "storedTextsParent",
      title: "PP-CANDY Options",
      contexts: ["all"]
    });
  
    // Create a "Clear all stored texts" menu item under the parent
    chrome.contextMenus.create({
      id: "clearStoredTexts",
      title: "Clear all stored texts",
      contexts: ["all"],
      parentId: "storedTextsParent"
    });
  
    // Create a menu item to open storeSelectedText.html under the parent
    chrome.contextMenus.create({
      id: "openStoredTextPage",
      title: "Open Stored Texts Page",
      contexts: ["all"],
      parentId: "storedTextsParent"
    });
  
    // Initial dynamic menu update
    updateDynamicContextMenu();
  });
  
  // Handle context menu item click
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "storeSelectedText" && info.selectionText) {
      // Remove trailing tab from the selected text
      let selectedText = info.selectionText.replace(/\t+$/, '');
  
      // Store the selected text in chrome storage
      chrome.storage.local.get({storedTexts: []}, (data) => {
        let storedTexts = data.storedTexts;
        storedTexts.push(selectedText);
        chrome.storage.local.set({storedTexts: storedTexts}, () => {
          console.log("Text stored:", selectedText);
          // Update the options page and dynamic context menu
          updateStoredTextsAndMenu();
        });
      });
    } else if (info.menuItemId.startsWith("storedText_")) {
      // Copy the selected text to the clipboard via content script
      const textIndex = parseInt(info.menuItemId.split("_")[1], 10);
      chrome.storage.local.get({storedTexts: []}, (data) => {
        const textToCopy = data.storedTexts[textIndex];
        chrome.scripting.executeScript({
          target: {tabId: tab.id},
          files: ['content.js']
        }, () => {
          chrome.tabs.sendMessage(tab.id, { action: "copyTextToClipboard", text: textToCopy }, (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message to content script:", chrome.runtime.lastError.message);
            } else {
              console.log("Message sent to content script:", response);
            }
          });
        });
      });
    } else if (info.menuItemId === "clearStoredTexts") {
      // Clear all stored texts
      chrome.storage.local.set({storedTexts: []}, () => {
        console.log("All stored texts cleared");
        // Update the options page and dynamic context menu
        updateStoredTextsAndMenu();
      });
    } else if (info.menuItemId === "openStoredTextPage") {
      // Open storeSelectedText.html in a new tab
      chrome.tabs.create({ url: chrome.runtime.getURL("options/storeSelectedText.html") });
    }
  });
  
  // Update the dynamic context menu and send a message to the options page to update
  function updateStoredTextsAndMenu() {
    // Update the dynamic context menu
    updateDynamicContextMenu();
  
    // Check if the options page is open
    chrome.runtime.sendMessage({action: "updateStoredTexts"}, (response) => {
      if (chrome.runtime.lastError) {
        // Ignore errors when the options page is not open
        return;
      } else {
        console.log("Options page updated: ", response);
      }
    });
  }
  
  // Listen for messages to update the context menu
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateStoredTexts") {
      updateDynamicContextMenu();
    }
  });
  
  // Update the dynamic context menu
  function updateDynamicContextMenu() {
    // First, remove existing dynamic menu items
    chrome.contextMenus.removeAll(() => {
      // Recreate the static context menu items
      chrome.contextMenus.create({
        id: "storeSelectedText",
        title: "Store selected text",
        contexts: ["selection"]
      });
  
      // Recreate the parent menu item for stored texts and other options
      chrome.contextMenus.create({
        id: "storedTextsParent",
        title: "PP-CANDY Options",
        contexts: ["all"]
      });
  
      // Create a "Clear all stored texts" menu item under the parent
      chrome.contextMenus.create({
        id: "clearStoredTexts",
        title: "Clear all stored texts",
        contexts: ["all"],
        parentId: "storedTextsParent"
      });
  
      // Create a menu item to open storeSelectedText.html under the parent
      chrome.contextMenus.create({
        id: "openStoredTextPage",
        title: "Open Stored Texts Page",
        contexts: ["all"],
        parentId: "storedTextsParent"
      });
  
      // Get stored texts and create new dynamic menu items under the parent
      chrome.storage.local.get({storedTexts: []}, (data) => {
        data.storedTexts.forEach((text, index) => {
          chrome.contextMenus.create({
            id: `storedText_${index}`,
            parentId: "storedTextsParent",
            title: text,
            contexts: ["all"]
          });
        });
      });
    });
  }
  