import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function BlocklistManager() {
  const [inputValue, setInputValue] = useState('');
  const [blocklist, setBlocklist] = useState<string[]>([]);
  const [isBlocking, setIsBlocking] = useState(false);
  const [extensionInstalled, setExtensionInstalled] = useState(false);

  useEffect(() => {
    // Check if extension is installed
    if (window.chrome?.runtime) {
      try {
        chrome.runtime.sendMessage(
          'extension-id', 
          { type: 'PING' },
          response => {
            setExtensionInstalled(!!response);
          }
        );
      } catch (e) {
        setExtensionInstalled(false);
      }
    }

    loadBlocklist();
  }, []);

  const loadBlocklist = async () => {
    if (!auth.currentUser) return;

    const blocklistRef = doc(db, 'users', auth.currentUser.uid, 'data', 'blocklist');
    const docSnap = await getDoc(blocklistRef);

    if (docSnap.exists()) {
      setBlocklist(docSnap.data().domains || []);
      setIsBlocking(docSnap.data().isActive || false);
    } else {
      await setDoc(blocklistRef, { domains: [], isActive: false });
    }
  };

  const saveBlocklist = async (newBlocklist: string[], newIsBlocking: boolean) => {
    if (!auth.currentUser) return;

    const blocklistRef = doc(db, 'users', auth.currentUser.uid, 'data', 'blocklist');
    await updateDoc(blocklistRef, {
      domains: newBlocklist,
      isActive: newIsBlocking,
    });

    // Update extension if installed
    if (extensionInstalled) {
      chrome.runtime.sendMessage({
        type: 'UPDATE_BLOCKLIST',
        payload: {
          domains: newBlocklist,
          isActive: newIsBlocking,
        },
      });
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