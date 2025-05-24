import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function BlocklistManager() {
  const [inputValue, setInputValue] = useState("");
  const [blocklist, setBlocklist] = useState<string[]>([]);

  const addDomain = () => {
    const domain = inputValue.trim().toLowerCase();
    if (domain && !blocklist.includes(domain)) {
      setBlocklist([...blocklist, domain]);
      setInputValue("");
    }
  };

  const removeDomain = (domainToRemove: string) => {
    setBlocklist(blocklist.filter((domain) => domain !== domainToRemove));
  };

  return (
    <div className="w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
      <h2 className="text-lg font-semibold">Distraction Blocklist</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter domain (e.g., youtube.com)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={addDomain}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
              className="flex justify-between items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded"
            >
              <span>{domain}</span>
              <button onClick={() => removeDomain(domain)}>
                <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
