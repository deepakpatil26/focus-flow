document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');
  const blocklistDiv = document.getElementById('blocklist');

  function updatePopupUI() {
    // Get current state from storage
    chrome.storage.local.get(['domains', 'isActive'], (result) => {
      const { domains = [], isActive = false } = result;

      statusDiv.textContent = isActive ? 'Blocking Active' : 'Blocking Inactive';
      statusDiv.className = `status ${isActive ? 'active' : 'inactive'}`;

      // Clear previous list
      blocklistDiv.innerHTML = '';

      if (domains.length > 0) {
        const list = document.createElement('ul');
        domains.forEach((domain) => {
          const item = document.createElement('li');
          item.textContent = domain;
          list.appendChild(item);
        });
        blocklistDiv.appendChild(list);
      } else {
        blocklistDiv.textContent = 'No domains in blocklist';
      }
    });
  }

  // Initial load
  updatePopupUI();

  // Listen for storage changes and update UI
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      updatePopupUI();
    }
  });
});
