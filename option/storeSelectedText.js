document.addEventListener('DOMContentLoaded', () => {
  updateStoredTexts();

  document.getElementById('clear-all').addEventListener('click', () => {
    clearAllStoredTexts();
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateStoredTexts") {
    updateStoredTexts();
    sendResponse({result: "success"});
  }
});

function updateStoredTexts() {
  // Get the stored texts from chrome storage
  chrome.storage.local.get({storedTexts: []}, (data) => {
    const storedTexts = data.storedTexts;
    const list = document.getElementById('stored-texts');
    list.innerHTML = '';

    // Display each stored text in the list
    storedTexts.forEach((text, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = text;
      list.appendChild(listItem);

      // Add a delete button for each text
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        deleteStoredText(index);
      });
      listItem.appendChild(deleteButton);
    });
  });
}

function clearAllStoredTexts() {
  // Clear all stored texts from chrome storage
  chrome.storage.local.set({storedTexts: []}, () => {
    console.log("All stored texts cleared");
    // Update the options page directly
    updateStoredTexts();
    // Update the dynamic context menu
    chrome.runtime.sendMessage({action: "updateStoredTexts"});
  });
}

function deleteStoredText(index) {
  // Remove the specified text from chrome storage
  chrome.storage.local.get({storedTexts: []}, (data) => {
    let storedTexts = data.storedTexts;
    if (storedTexts.length > index) {
      storedTexts.splice(index, 1);
      chrome.storage.local.set({storedTexts: storedTexts}, () => {
        console.log("Stored text deleted:", index);
        // Update the options page directly
        updateStoredTexts();
        // Update the dynamic context menu
        chrome.runtime.sendMessage({action: "updateStoredTexts"});
      });
    }
  });
}
