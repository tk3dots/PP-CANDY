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
      console.warn(`Tab with ID tab${tab} does not exist.`);
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
});
