document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');
  const blocklistDiv = document.getElementById('blocklist');

  // Get current state from storage
  chrome.storage.local.get(['domains', 'isActive'], (result) => {
    const { domains = [], isActive = false } = result;

    statusDiv.textContent = isActive ? 'Blocking Active' : 'Blocking Inactive';
    statusDiv.className = `status ${isActive ? 'active' : 'inactive'}`;

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
});
