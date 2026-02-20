# FocusFlow Extension Debugging Guide

## Complete Communication Flow

When you click "Start Blocking" on the blocklist page:

1. **Web App → Content Script** (via postMessage)
   - BlocklistManager sends: `{ type: 'FOCUSFLOW_TO_EXTENSION', message: { type: 'UPDATE_BLOCKLIST', ... } }`
   - Should see log: `[FocusFlow Web] Sending update to extension`

2. **Content Script → Background Service Worker** (via chrome.runtime.sendMessage)
   - content.js forwards the message
   - Should see log: `[FocusFlow] Forwarding message to extension: UPDATE_BLOCKLIST`

3. **Background Service Worker** (processes and stores)
   - Saves to chrome.storage.local
   - Should see logs:
     - `[FocusFlow] Updating blocklist`
     - `[FocusFlow] Saved to chrome.storage.local`

4. **Background → All Tabs** (via chrome.tabs.sendMessage)
   - Broadcasts to site-blocker.js on all tabs
   - Should see log: `[FocusFlow] Broadcasting to all tabs: UPDATE_BLOCKLIST`

5. **Site Blocker** (receives update)
   - Updates its local state and checks if site should be blocked
   - Should see logs:
     - `[FocusFlow] Site blocker received message: UPDATE_BLOCKLIST`
     - `[FocusFlow] Updated blocklist: {...}`

## Step 1: Hard Reload the Extension

1. Go to `chrome://extensions/`
2. Find "FocusFlow Website Blocker"
3. Click the **RELOAD** button (circular arrow icon)
4. You should see the extension reload

## Step 2: Open Chrome DevTools Console

### For the Web App (<http://localhost:5173/blocklist>)

1. Go to `http://localhost:5173/blocklist`
2. Right-click → **Inspect** or press `F12`
3. Go to **Console** tab
4. Look for messages starting with `[FocusFlow Web]`

### For the Extension Background

1. Go to `chrome://extensions/`
2. Find "FocusFlow Website Blocker"
3. Click **Service Worker** link under "Inspect views"
4. This opens DevTools for the extension background
5. Look for messages starting with `[FocusFlow]`

## Step 3: Test the Complete Flow

### Test 1: Add Domain and Enable Blocking

1. Open `http://localhost:5173/blocklist`
2. Open Browser DevTools (F12) on the web app
3. Go to Console tab
4. Add `youtube.com` to the blocklist
5. Look for: `[FocusFlow Web] Loaded blocklist: { domains: [ 'youtube.com' ], isActive: false }`
6. Click "Start Blocking" button
7. Look for: `[FocusFlow Web] Sending update to extension`

### Expected Console Output

**Web App Console:**

```
[FocusFlow Web] Extension detected: true
[FocusFlow Web] Loaded blocklist: { domains: [], isActive: false }
[FocusFlow Web] Sending update to extension: { domains: [ 'youtube.com' ], isActive: true }
```

**Extension Service Worker Console:**

```
[FocusFlow] Background received message: UPDATE_BLOCKLIST from http://localhost:5173/blocklist
[FocusFlow] Updating blocklist { domains: [ 'youtube.com' ], isActive: true }
[FocusFlow] Saved to chrome.storage.local
[FocusFlow] Broadcasting to all tabs: UPDATE_BLOCKLIST
```

### Test 2: Extension Popup Shows Data

1. Click the FocusFlow extension icon
2. You should see:
   - Status: "Blocking Active" (green)
   - Domains: youtube.com listed

If popup shows empty:

1. Open extension Service Worker console (see Step 2)
2. Check if logs show domains are saved
3. If logs don't show UPDATE_BLOCKLIST, the message didn't reach extension

### Test 3: Site Blocking Works

1. Open new tab and go to `youtube.com`
2. You should see the FocusFlow blocked page with 🛑 icon

If YouTube loads normally:

1. Check the site-blocker.js console logs
2. On YouTube tab, open DevTools (F12)
3. Look for logs starting with `[FocusFlow]`
4. Should see: `[FocusFlow] BLOCKING: youtube.com`

## Troubleshooting

### Issue 1: Extension Not Detected

**Console shows:** `[FocusFlow Web] Extension detected: false`

**Solutions:**

1. Make sure extension is loaded in `chrome://extensions/`
2. Reload the web page (Ctrl+R or F5)
3. Hard reload the extension (click RELOAD on chrome://extensions/)
4. Check extension Service Worker console for errors

### Issue 2: "Sending update" but nothing happens

**Console shows:** `[FocusFlow Web] Sending update to extension: UPDATE_BLOCKLIST`
**But no logs in extension Service Worker console**

**Solutions:**

1. The content script isn't properly loading
2. Reload the extension again
3. Check manifest.json permissions are correct
4. Open `chrome://extensions/` → FocusFlow → "Errors" (if red icon shows)

### Issue 3: Button Click Does Nothing

**Console shows:** Nothing, or just initial logs

**Solutions:**

1. Check if you're logged in (user might not be authenticated)
2. Look for Firebase errors in console
3. Open DevTools and try clicking button again, check for JS errors
4. Look for red error messages in console

### Issue 4: Site Blocker Not Working

**YouTube loads normally even with blocking enabled**

**Solutions:**

1. Open YouTube URL in console: Check logs should show `[FocusFlow] BLOCKING: youtube.com`
2. If no logs: site-blocker.js didn't inject
3. Try visiting youtube.com again after enabling blocking
4. Check if domain name exactly matches (youtube.com vs <www.youtube.com>)

## Manual Testing in Browser Console

### To test extension detection

```javascript
console.log('Extension installed:', !!window.__FOCUSFLOW_EXTENSION_INSTALLED__)
console.log('Extension ID:', window.__FOCUSFLOW_EXTENSION_ID__)
```

### To manually send a blocking update

```javascript
window.postMessage({
  type: 'FOCUSFLOW_TO_EXTENSION',
  message: {
    type: 'UPDATE_BLOCKLIST',
    payload: {
      domains: ['youtube.com'],
      isActive: true
    }
  },
  messageId: Date.now()
}, '*')
```

Then check extension Service Worker console for response.

## Files Modified and Their Roles

- **manifest.json** - Defines extension permissions and content scripts
- **content.js** - Runs on localhost:5173, bridges web app to extension
- **background.js** - Main extension logic, handles messaging and storage
- **site-blocker.js** - Runs on ALL URLs, blocks sites by replacing page content
- **popup.js** - Shows extension popup with current blocklist status
- **BlocklistManager.tsx** - Web app component, manages UI and Firebase

## Next Steps

1. **Reload extension** on `chrome://extensions/`
2. **Refresh** `http://localhost:5173/blocklist`
3. **Open both console tabs** (web app + extension service worker)
4. **Add domain** and click "Start Blocking"
5. **Check console logs** to verify flow
6. **Test with YouTube** in new tab

Let me know what logs you see and I can help debug further! 🎯
