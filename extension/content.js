console.log('[FocusFlow Content.js] Content script loading on', window.location.href);

// Note: Inline script injection is blocked by CSP, so we'll use postMessage instead

// Method 1: Define properties on content script window (only accessible from content script)
try {
  Object.defineProperty(window, '__FOCUSFLOW_EXTENSION_INSTALLED__', {
    value: true,
    writable: false,
    enumerable: true,
    configurable: false
  });
  Object.defineProperty(window, '__FOCUSFLOW_EXTENSION_ID__', {
    value: chrome.runtime.id,
    writable: false,
    enumerable: true,
    configurable: false
  });
  console.log('[FocusFlow Content.js] Defined properties on content script window');
} catch (e) {
  console.error('[FocusFlow Content.js] Failed to define properties:', e);
}

// Method 2: Send repeated notifications to page that extension is ready
// This is the primary method since we can't inject inline scripts due to CSP
function notifyPageOfExtension() {
  console.log('[FocusFlow Content.js] Sending EXTENSION_READY notification to page');
  window.postMessage({
    type: 'FOCUSFLOW_EXTENSION_READY',
    extensionId: chrome.runtime.id
  }, '*');
}

// Send immediately and then every 500ms for 5 seconds (in case page loaded slow)
notifyPageOfExtension();
let notifyCount = 0;
const notifyInterval = setInterval(() => {
  notifyCount++;
  if (notifyCount < 10) {
    notifyPageOfExtension();
  } else {
    clearInterval(notifyInterval);
    console.log('[FocusFlow Content.js] Stopped sending notifications after 5 seconds');
  }
}, 500);

// Bridge for communication between web app and extension
console.log('[FocusFlow Content.js] Setting up message listener for web app');
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  
  if (event.data.type === 'FOCUSFLOW_TO_EXTENSION') {
    console.log('[FocusFlow Content.js] Received request from page:', event.data.message.type);
    // Forward to extension background
    chrome.runtime.sendMessage(event.data.message, (response) => {
      console.log('[FocusFlow Content.js] Got response from background, sending back to page');
      // Send response back to page
      window.postMessage({
        type: 'EXTENSION_RESPONSE',
        messageId: event.data.messageId,
        response: response,
      }, '*');
    });
  }
}, false);

// Listen for extension updates and broadcast to page
console.log('[FocusFlow Content.js] Setting up message listener for background updates');
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[FocusFlow Content.js] Message from background:', message.type);
  
  if (message.type === 'UPDATE_BLOCKLIST') {
    console.log('[FocusFlow Content.js] Broadcasting UPDATE_BLOCKLIST to page');
    // Notify the page of updates
    window.postMessage({
      type: 'EXTENSION_DATA_UPDATED',
      payload: message.payload,
    }, '*');
  }
  
  sendResponse({ received: true });
  return true;
});

