/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// No need for custom window.chrome declaration; @types/chrome already provides it.

export default function BlocklistManager() {
  const [inputValue, setInputValue] = useState('');
  const [blocklist, setBlocklist] = useState<string[]>([]);
  const [isBlocking, setIsBlocking] = useState(false);
  const [extensionInstalled, setExtensionInstalled] = useState(false);

  useEffect(() => {
    console.log('[FocusFlow Web] useEffect starting...');
    
    // Check the global flag set by main.tsx listener
    const isExtensionInstalled = !!(window as any).__FOCUSFLOW_EXTENSION_READY__;
    console.log('[FocusFlow Web] Extension detected (global flag):', isExtensionInstalled);
    
    if (isExtensionInstalled) {
      console.log('[FocusFlow Web] Extension ID:', (window as any).__FOCUSFLOW_EXTENSION_ID__);
      setExtensionInstalled(true);
    }
    
    // Set up message listener for data updates (works whether extension is installed or not)
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'FOCUSFLOW_EXTENSION_READY') {
        console.log('[FocusFlow Web] Extension ready message received!');
        setExtensionInstalled(true);
      }
      
      // Handle data updates from extension
      if (event.data?.type === 'EXTENSION_DATA_UPDATED' || event.data?.type === 'EXTENSION_RESPONSE') {
        console.log('[FocusFlow Web] Extension data updated, reloading blocklist');
        loadBlocklist();
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Check again after a delay in case the flag gets set later
    const timeoutId = setTimeout(() => {
      const delayedCheck = !!(window as any).__FOCUSFLOW_EXTENSION_READY__;
      console.log('[FocusFlow Web] Delayed check (200ms):', delayedCheck);
      if (delayedCheck && !isExtensionInstalled) {
        setExtensionInstalled(true);
      }
    }, 200);

    loadBlocklist();
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const loadBlocklist = async () => {
    if (!auth.currentUser) {
      console.log('[FocusFlow Web] No user logged in, cannot load blocklist');
      return;
    }

    try {
      const blocklistRef = doc(db, 'users', auth.currentUser.uid, 'data', 'blocklist');
      const docSnap = await getDoc(blocklistRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setBlocklist(data.domains || []);
        setIsBlocking(data.isActive || false);
        console.log('[FocusFlow Web] Loaded blocklist:', { domains: data.domains, isActive: data.isActive });
      } else {
        console.log('[FocusFlow Web] No blocklist found, creating new one');
        await setDoc(blocklistRef, { domains: [], isActive: false });
      }
    } catch (error) {
      console.error('[FocusFlow Web] Error loading blocklist:', error);
    }
  };

  const saveBlocklist = async (newBlocklist: string[], newIsBlocking: boolean) => {
    if (!auth.currentUser) return;

    const blocklistRef = doc(db, 'users', auth.currentUser.uid, 'data', 'blocklist');
    await updateDoc(blocklistRef, {
      domains: newBlocklist,
      isActive: newIsBlocking,
    });
    console.log('[FocusFlow Web] Saved to Firebase:', { domains: newBlocklist, isActive: newIsBlocking });

    // Update extension if installed
    if (extensionInstalled) {
      const message = {
        type: 'UPDATE_BLOCKLIST',
        payload: {
          domains: newBlocklist,
          isActive: newIsBlocking,
        },
      };
      console.log('[FocusFlow Web] Sending update to extension via postMessage:', newBlocklist);
      
      try {
        window.postMessage({
          type: 'FOCUSFLOW_TO_EXTENSION',
          message: message,
          messageId: Date.now(),
        }, '*');
        console.log('[FocusFlow Web] Message sent successfully');
      } catch (error) {
        console.error('[FocusFlow Web] Error sending message:', error);
      }
    } else {
      console.log('[FocusFlow Web] Extension not detected, only saved to Firebase');
    }
  };

  const addDomain = async () => {
    const domain = inputValue.trim().toLowerCase();
    if (domain && !blocklist.includes(domain)) {
      const newBlocklist = [...blocklist, domain];
      setBlocklist(newBlocklist);
      setInputValue('');
      await saveBlocklist(newBlocklist, isBlocking);
    }
  };

  const removeDomain = async (domainToRemove: string) => {
    const newBlocklist = blocklist.filter((domain) => domain !== domainToRemove);
    setBlocklist(newBlocklist);
    await saveBlocklist(newBlocklist, isBlocking);
  };

  const toggleBlocking = async () => {
    const newIsBlocking = !isBlocking;
    setIsBlocking(newIsBlocking);
    await saveBlocklist(blocklist, newIsBlocking);
  };

  return (
    <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Distraction Blocklist</h2>
        <button
          onClick={toggleBlocking}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            isBlocking
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isBlocking ? 'Stop Blocking' : 'Start Blocking'}
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter domain (e.g., youtube.com)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 rounded-md border bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
        />
        <button
          onClick={addDomain}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {blocklist.length === 0 ? (
          <p className="text-sm text-gray-500">No domains added yet.</p>
        ) : (
          blocklist.map((domain) => (
            <li
              key={domain}
              className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-700"
            >
              <span>{domain}</span>
              <button onClick={() => removeDomain(domain)}>
                <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
              </button>
            </li>
          ))
        )}
      </ul>

      {!extensionInstalled && (
        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Browser extension not detected. Please install the FocusFlow extension to enable website blocking.
          </p>
        </div>
      )}
    </div>
  );
}