document.addEventListener('DOMContentLoaded', () => {
  updateStoredTexts();

  document.getElementById('clear-all').addEventListener('click', () => {
    clearAllStoredTexts();
  });

  // Sortable.jsを利用してドラッグアンドドロップ機能を追加
  new Sortable(document.getElementById('stored-texts'), {
    handle: '.drag-handle', // ドラッグハンドルとして使用
    animation: 150,
    onEnd: (event) => {
      reorderStoredTexts(event.oldIndex, event.newIndex);
    }
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
    let storedTexts = data.storedTexts;
    const list = document.getElementById('stored-texts');
    list.innerHTML = '';

    // Display each stored text in the list
    for (let i = 0; i < 7; i++) {
      const listItem = document.createElement('li');

      const dragHandle = document.createElement('img');
      dragHandle.src = '/images/drag_handle_24dp_FILL0_wght400_GRAD0_opsz24.svg'; // ドラッグハンドルのアイコン
      dragHandle.className = 'drag-handle';
      listItem.appendChild(dragHandle);

      const textSpan = document.createElement('span');
      const text = storedTexts[i] || '';
      textSpan.className = 'text';
      textSpan.textContent = text;
      listItem.appendChild(textSpan);

      const actionContainer = document.createElement('div');
      actionContainer.className = 'action-buttons';

      // Add an edit button for each text
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => {
        editStoredText(i, text);
      });
      actionContainer.appendChild(editButton);

      // Add a delete button for each text
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Clear';
      deleteButton.addEventListener('click', () => {
        deleteStoredText(i);
      });
      actionContainer.appendChild(deleteButton);

      listItem.appendChild(actionContainer);
      list.appendChild(listItem);
    }
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

function editStoredText(index, currentText) {
  const newText = prompt('Edit your text:', currentText || '');
  if (newText !== null && !/^\s+$/.test(newText)) {
    chrome.storage.local.get({storedTexts: []}, (data) => {
      let storedTexts = data.storedTexts;
      storedTexts[index] = newText.trim();
      chrome.storage.local.set({storedTexts: storedTexts}, () => {
        console.log("Stored text edited:", index);
        // Update the options page directly
        updateStoredTexts();
        // Update the dynamic context menu
        chrome.runtime.sendMessage({action: "updateStoredTexts"});
      });
    });
  }
}

function addStoredText(text) {
  // Add the new text to chrome storage
  chrome.storage.local.get({storedTexts: []}, (data) => {
    let storedTexts = data.storedTexts;
    if (storedTexts.length >= 7) {
      storedTexts.shift(); // Remove the oldest text if there are already 7 texts
    }
    storedTexts.push(text.trim());
    chrome.storage.local.set({storedTexts: storedTexts}, () => {
      console.log("Text added:", text);
      // Update the options page directly
      updateStoredTexts();
      // Update the dynamic context menu
      chrome.runtime.sendMessage({action: "updateStoredTexts"});
    });
  });
}

function reorderStoredTexts(oldIndex, newIndex) {
  chrome.storage.local.get({storedTexts: []}, (data) => {
    let storedTexts = data.storedTexts;
    const [movedItem] = storedTexts.splice(oldIndex, 1);
    storedTexts.splice(newIndex, 0, movedItem);
    chrome.storage.local.set({storedTexts: storedTexts}, () => {
      console.log("Stored texts reordered");
      // Update the options page directly
      updateStoredTexts();
      // Update the dynamic context menu
      chrome.runtime.sendMessage({action: "updateStoredTexts"});
    });
  });
}
