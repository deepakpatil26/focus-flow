// Load blocklist from storage on startup
let blockedDomains = [];
let isBlockingEnabled = false;

console.log('[FocusFlow] Background service worker starting...');

chrome.storage.local.get(['domains', 'isActive'], (result) => {
  blockedDomains = result.domains || [];
  isBlockingEnabled = result.isActive || false;
  console.log('[FocusFlow] Loaded from storage:', { blockedDomains, isBlockingEnabled });
});

// Listen for storage changes and broadcast to all tabs
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    if (changes.domains) {
      blockedDomains = changes.domains.newValue || [];
    }
    if (changes.isActive) {
      isBlockingEnabled = changes.isActive.newValue || false;
    }
    console.log('[FocusFlow] Storage changed:', { blockedDomains, isBlockingEnabled });

    // Broadcast to all tabs
    broadcastToAllTabs({
      type: 'UPDATE_BLOCKLIST',
      payload: { domains: blockedDomains, isActive: isBlockingEnabled },
    });
  }
});

// Listen for messages from the web app
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[FocusFlow] Background received message:', message.type, 'from', sender.url);
  
  if (message.type === 'PING') {
    console.log('[FocusFlow] PING received');
    sendResponse({ success: true, extensionId: chrome.runtime.id });
  } else if (message.type === 'UPDATE_BLOCKLIST') {
    console.log('[FocusFlow] Updating blocklist', message.payload);
    blockedDomains = message.payload.domains;
    isBlockingEnabled = message.payload.isActive;

    // Save to chrome storage
    chrome.storage.local.set({
      domains: blockedDomains,
      isActive: isBlockingEnabled,
    }, () => {
      console.log('[FocusFlow] Saved to chrome.storage.local');
    });

    // Broadcast to all tabs
    broadcastToAllTabs({
      type: 'UPDATE_BLOCKLIST',
      payload: { domains: blockedDomains, isActive: isBlockingEnabled },
    });

    sendResponse({ success: true });
  } else if (message.type === 'GET_BLOCKLIST') {
    console.log('[FocusFlow] GET_BLOCKLIST requested');
    sendResponse({ domains: blockedDomains, isActive: isBlockingEnabled });
  }

  return true; // Keep the channel open for async sendResponse
});

function broadcastToAllTabs(message) {
  console.log('[FocusFlow] Broadcasting to all tabs:', message.type);
  // Send to all content scripts
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, message).catch((error) => {
          // Tab might be unreachable (chrome://, about:, etc)
          console.log('[FocusFlow] Could not message tab', tab.id);
        });
      }
    });
  });
}
