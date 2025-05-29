let blockedDomains = [];
let isBlockingEnabled = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_BLOCKLIST') {
    blockedDomains = message.payload.domains;
    isBlockingEnabled = message.payload.isActive;
    sendResponse({ success: true });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!isBlockingEnabled) return { cancel: false };

    const url = new URL(details.url);
    const domain = url.hostname.replace('www.', '');

    if (blockedDomains.includes(domain)) {
      return {
        redirectUrl: chrome.runtime.getURL('blocked.html'),
      };
    }

    return { cancel: false };
  },
  { urls: ['<all_urls>'] },
  ['blocking'],
);
