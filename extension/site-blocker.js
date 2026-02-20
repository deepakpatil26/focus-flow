// Site blocker script - runs on all URLs
let blockedDomains = [];
let isBlockingEnabled = false;

console.log('[FocusFlow] Site blocker loaded on', window.location.href);

// Get initial blocklist from background
chrome.runtime.sendMessage(
  { type: 'GET_BLOCKLIST' },
  (response) => {
    if (response) {
      blockedDomains = response.domains || [];
      isBlockingEnabled = response.isActive || false;
      console.log('[FocusFlow] Initial blocklist:', { blockedDomains, isBlockingEnabled });
      checkAndBlockSite();
    }
  }
);

// Listen for blocklist updates from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[FocusFlow] Site blocker received message:', message.type);
  if (message.type === 'UPDATE_BLOCKLIST') {
    blockedDomains = message.payload.domains;
    isBlockingEnabled = message.payload.isActive;
    console.log('[FocusFlow] Updated blocklist:', { blockedDomains, isBlockingEnabled });
    checkAndBlockSite();
  }
  sendResponse({ received: true });
  return true;
});

function checkAndBlockSite() {
  if (!isBlockingEnabled) {
    console.log('[FocusFlow] Blocking not enabled, skipping check');
    return;
  }

  const url = new URL(window.location.href);
  const domain = url.hostname.replace('www.', '');
  console.log('[FocusFlow] Checking domain:', domain, 'against', blockedDomains);

  if (blockedDomains.includes(domain)) {
    console.log('[FocusFlow] BLOCKING:', domain);
    // Block the site by showing blocked page
    const blockedHTML = `
      <!doctype html>
      <html>
        <head>
          <title>Site Blocked - FocusFlow</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 3rem;
              background: rgba(0, 0, 0, 0.2);
              border-radius: 12px;
              max-width: 500px;
              backdrop-filter: blur(10px);
            }
            h1 {
              margin: 0 0 1rem 0;
              font-size: 3rem;
            }
            h2 {
              margin: 0.5rem 0;
              font-size: 2rem;
            }
            p {
              margin: 0.5rem 0;
              font-size: 1.1rem;
            }
            .domain {
              background: rgba(255, 255, 255, 0.2);
              padding: 0.5rem 1rem;
              border-radius: 6px;
              margin-top: 1.5rem;
              font-family: monospace;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🛑</h1>
            <h2>Site Blocked</h2>
            <p>This website is currently blocked by FocusFlow.</p>
            <p>Stay focused and keep working on your goals!</p>
            <div class="domain">${domain}</div>
          </div>
        </body>
      </html>
    `;

    document.documentElement.innerHTML = blockedHTML;
  } else {
    console.log('[FocusFlow] Domain not blocked:', domain);
  }
}

// Run check on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkAndBlockSite);
} else {
  checkAndBlockSite();
}
