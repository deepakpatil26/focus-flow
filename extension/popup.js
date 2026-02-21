console.log('[FocusFlow Popup] Loading popup.js');

document.addEventListener('DOMContentLoaded', async () => {
  const statusBtn = document.getElementById('status');
  const blocklistDiv = document.getElementById('blocklist');
  const domainInput = document.getElementById('domainInput');
  const addBtn = document.getElementById('addBtn');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const helpBtn = document.getElementById('helpBtn');
  const quickBlockBtn = document.getElementById('quickBlockBtn');
  const currentPageSection = document.getElementById('currentPageSection');
  const currentPageDomain = document.getElementById('currentPageDomain');

  let currentPageDomainValue = null;

  // Get current tab's domain
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const url = new URL(tabs[0].url);
      currentPageDomainValue = url.hostname.replace('www.', '');
      currentPageDomain.textContent = currentPageDomainValue;
      currentPageSection.style.display = 'block';
      updateQuickBlockButton();
    }
  });

  function updatePopupUI() {
    // Get current state from storage
    chrome.storage.local.get(['domains', 'isActive'], (result) => {
      const { domains = [], isActive = false } = result;

      // Update status button
      statusBtn.textContent = isActive ? '🔴 Blocking ON' : '⚪ Blocking OFF';
      statusBtn.className = `status ${isActive ? 'active' : 'inactive'}`;

      // Update quick block button
      updateQuickBlockButton(domains);

      // Update blocklist
      blocklistDiv.innerHTML = '';

      if (domains.length > 0) {
        const list = document.createElement('ul');
        domains.forEach((domain) => {
          const item = document.createElement('li');
          const nameSpan = document.createElement('span');
          nameSpan.className = 'domain-name';
          nameSpan.textContent = domain;
          const removeBtn = document.createElement('button');
          removeBtn.className = 'remove-btn';
          removeBtn.textContent = '✕';
          removeBtn.onclick = (e) => {
            e.stopPropagation();
            removeDomain(domain, domains);
          };
          item.appendChild(nameSpan);
          item.appendChild(removeBtn);
          list.appendChild(item);
        });
        blocklistDiv.appendChild(list);
      } else {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'No domains blocked';
        blocklistDiv.appendChild(emptyMsg);
      }
    });
  }

  function updateQuickBlockButton(domains) {
    chrome.storage.local.get(['domains'], (result) => {
      const domainsList = domains || result.domains || [];
      const isBlocked = currentPageDomainValue && domainsList.includes(currentPageDomainValue);
      quickBlockBtn.textContent = isBlocked
        ? `✓ Block this site`
        : `+ Block this site`;
      quickBlockBtn.className = `quick-block-btn ${isBlocked ? 'blocked' : ''}`;
      quickBlockBtn.onclick = () => toggleQuickBlock(domainsList, isBlocked);
    });
  }

  function toggleQuickBlock(domains, isCurrentlyBlocked) {
    if (!currentPageDomainValue) return;

    let newDomains;
    if (isCurrentlyBlocked) {
      newDomains = domains.filter((d) => d !== currentPageDomainValue);
    } else {
      newDomains = [...domains, currentPageDomainValue];
    }

    chrome.storage.local.set({ domains: newDomains }, () => {
      updatePopupUI();
    });
  }

  function removeDomain(domainToRemove, currentDomains) {
    const newDomains = currentDomains.filter((d) => d !== domainToRemove);

    chrome.storage.local.set({ domains: newDomains }, () => {
      updatePopupUI();
    });
  }

  function addDomain() {
    const domain = domainInput.value.trim().toLowerCase();

    if (!domain) {
      alert('Please enter a domain');
      return;
    }

    // Basic validation
    if (!domain.includes('.')) {
      alert('Please enter a valid domain (e.g., youtube.com)');
      return;
    }

    chrome.storage.local.get(['domains'], (result) => {
      const domains = result.domains || [];
      if (domains.includes(domain)) {
        alert('Domain already in blocklist');
        return;
      }

      const newDomains = [...domains, domain];
      chrome.storage.local.set({ domains: newDomains }, () => {
        domainInput.value = '';
        updatePopupUI();
      });
    });
  }

  // Event listeners
  statusBtn.addEventListener('click', () => {
    chrome.storage.local.get(['isActive'], (result) => {
      const newState = !result.isActive;
      chrome.storage.local.set({ isActive: newState }, () => {
        updatePopupUI();
      });
    });
  });

  addBtn.addEventListener('click', addDomain);

  domainInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addDomain();
    }
  });

  openSettingsBtn.addEventListener('click', () => {
    chrome.tabs.create({
      url: 'https://focus-flow-three-psi.vercel.app/blocklist',
    });
  });

  helpBtn.addEventListener('click', () => {
    alert(
      'FocusFlow Block List:\n\n' +
        '🔴 Blocking ON: Blocks all domains in your list\n' +
        '⚪ Blocking OFF: All sites are accessible\n\n' +
        'Quick Actions:\n' +
        '• Click + Block to quickly block current site\n' +
        '• Click ✕ to remove a domain\n' +
        '• Click status to toggle blocking\n\n' +
        'Full Settings: Open the web app for advanced blocklist management.'
    );
  });

  // Initial UI load
  updatePopupUI();

  // Listen for storage changes and update UI
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      updatePopupUI();
    }
  });
});
