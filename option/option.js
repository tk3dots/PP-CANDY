document.addEventListener('DOMContentLoaded', () => {
  // Get the query parameter for the tab
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get('tab');

  if (tab) {
    // Activate the specified tab
    document.querySelectorAll('.tab-content').forEach(tabContent => {
      tabContent.classList.remove('active');
    });
    const targetTab = document.getElementById(`tab${tab}`);
    if (targetTab) {
      targetTab.classList.add('active');
    } else {
      console.warn(`Tab with ID tab${tab} does not exist。`);
      document.getElementById('tab1').classList.add('active'); // Default to tab1 if tab doesn't exist
    }
  } else {
    // 初期表示でMainタブを表示
    document.getElementById('tab1').classList.add('active');
  }

  // Add event listeners to buttons to switch tabs
  document.getElementById('tab1-btn').addEventListener('click', () => {
    document.querySelectorAll('.tab-content').forEach(tabContent => {
      tabContent.classList.remove('active');
    });
    document.getElementById('tab1').classList.add('active');
  });

  document.getElementById('tab2-btn').addEventListener('click', () => {
    document.querySelectorAll('.tab-content').forEach(tabContent => {
      tabContent.classList.remove('active');
    });
    document.getElementById('tab2').classList.add('active');
  });

  document.getElementById('tab3-btn').addEventListener('click', () => {
    document.querySelectorAll('.tab-content').forEach(tabContent => {
      tabContent.classList.remove('active');
    });
    document.getElementById('tab3').classList.add('active');
  });

  document.getElementById('tab4-btn').addEventListener('click', () => {
    document.querySelectorAll('.tab-content').forEach(tabContent => {
      tabContent.classList.remove('active');
    });
    document.getElementById('tab4').classList.add('active');
  });

  document.getElementById('tab5-btn').addEventListener('click', () => {
    document.querySelectorAll('.tab-content').forEach(tabContent => {
      tabContent.classList.remove('active');
    });
    document.getElementById('tab5').classList.add('active');
  });

  // Load review data from storage
  chrome.storage.local.get(['reviewKey', 'reviewTime'], (data) => {
    document.getElementById('review-key').value = data.reviewKey || '';
    document.getElementById('review-time').value = data.reviewTime || '';
  });

  // Save review data to storage and highlight Review Time
  document.getElementById('save-review-btn').addEventListener('click', () => {
    const reviewKey = document.getElementById('review-key').value;
    const reviewTime = document.getElementById('review-time').value;
    chrome.storage.local.set({ reviewKey, reviewTime }, () => {
      alert('Review data saved。');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        try {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (reviewTime) => {
              chrome.runtime.sendMessage({ action: "highlightText", text: reviewTime });
            },
            args: [reviewTime]
          });
        } catch (error) {
          console.error('Error executing script:', error);
          // エラーが発生した場合は無視して次の処理を続行
        }
      });
    });
  });

  // Reset review data
  document.getElementById('reset-review-btn').addEventListener('click', () => {
    chrome.storage.local.remove(['reviewKey', 'reviewTime'], () => {
      document.getElementById('review-key').value = '';
      document.getElementById('review-time').value = '';
      alert('Review data reset。');
    });
  });
});
