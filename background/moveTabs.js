async function moveTabLeft() {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const activeTab = tabs.find(tab => tab.active);
    const newIndex = (activeTab.index - 5 + tabs.length) % tabs.length;
    await chrome.tabs.update(tabs[newIndex].id, { active: true });
  }
  
  async function moveTabRight() {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const activeTab = tabs.find(tab => tab.active);
    const newIndex = (activeTab.index + 5) % tabs.length;
    await chrome.tabs.update(tabs[newIndex].id, { active: true });
  }
  