document.addEventListener('DOMContentLoaded', () => {
  updateStoredTexts();

  document.getElementById('clear-all').addEventListener('click', () => {
    clearAllStoredTexts();
  });

  new Sortable(document.getElementById('stored-texts'), {
    handle: '.drag-handle',
    animation: 150,
    onEnd: (event) => {
      reorderStoredTexts(event.oldIndex, event.newIndex);
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateStoredTexts") {
    updateStoredTexts();
    sendResponse({ result: "success" });
  }
});

function updateStoredTexts() {
  chrome.storage.local.get({ storedTexts: [] }, (data) => {
    const storedTexts = data.storedTexts;
    const list = document.getElementById('stored-texts');
    list.innerHTML = '';

    for (let i = 0; i < 7; i++) {
      const listItem = document.createElement('li');

      const dragHandle = document.createElement('img');
      dragHandle.src = '/images/drag_handle_24dp_FILL0_wght400_GRAD0_opsz24.svg';
      dragHandle.className = 'drag-handle';
      listItem.appendChild(dragHandle);

      const textSpan = document.createElement('span');
      const text = storedTexts[i] || '';
      textSpan.className = 'text';
      textSpan.textContent = text;
      listItem.appendChild(textSpan);

      const actionContainer = document.createElement('div');
      actionContainer.className = 'action-buttons';

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => {
        editStoredText(i, text);
      });
      actionContainer.appendChild(editButton);

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
  chrome.storage.local.set({ storedTexts: [] }, () => {
    console.log("All stored texts cleared");
    updateStoredTexts();
    chrome.runtime.sendMessage({ action: "updateStoredTexts" });
  });
}

function deleteStoredText(index) {
  chrome.storage.local.get({ storedTexts: [] }, (data) => {
    let storedTexts = data.storedTexts;
    if (storedTexts.length > index) {
      storedTexts.splice(index, 1);
      chrome.storage.local.set({ storedTexts: storedTexts }, () => {
        console.log("Stored text deleted:", index);
        updateStoredTexts();
        chrome.runtime.sendMessage({ action: "updateStoredTexts" });
      });
    }
  });
}

function editStoredText(index, currentText) {
  const newText = prompt('Edit your text:', currentText || '');
  if (newText !== null && !/^\s+$/.test(newText)) {
    chrome.storage.local.get({ storedTexts: [] }, (data) => {
      let storedTexts = data.storedTexts;
      storedTexts[index] = newText.trim();
      chrome.storage.local.set({ storedTexts: storedTexts }, () => {
        console.log("Stored text edited:", index);
        updateStoredTexts();
        chrome.runtime.sendMessage({ action: "updateStoredTexts" });
      });
    });
  }
}

function addStoredText(text) {
  chrome.storage.local.get({ storedTexts: [] }, (data) => {
    let storedTexts = data.storedTexts;
    if (storedTexts.length >= 7) {
      storedTexts.shift();
    }
    storedTexts.push(text.trim());
    chrome.storage.local.set({ storedTexts: storedTexts }, () => {
      console.log("Text added:", text);
      updateStoredTexts();
      chrome.runtime.sendMessage({ action: "updateStoredTexts" });
    });
  });
}

function reorderStoredTexts(oldIndex, newIndex) {
  chrome.storage.local.get({ storedTexts: [] }, (data) => {
    let storedTexts = data.storedTexts;
    const [movedItem] = storedTexts.splice(oldIndex, 1);
    storedTexts.splice(newIndex, 0, movedItem);
    chrome.storage.local.set({ storedTexts: storedTexts }, () => {
      console.log("Stored texts reordered");
      updateStoredTexts();
      chrome.runtime.sendMessage({ action: "updateStoredTexts" });
    });
  });
}
