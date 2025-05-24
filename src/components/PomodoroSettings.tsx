import { useState } from "react";

interface Settings {
  workDuration: number;
  breakDuration: number;
}

interface Props {
  settings: Settings;
  onUpdate: (newSettings: Settings) => void;
}

export default function PomodoroSettings({ settings, onUpdate }: Props) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings({
      ...localSettings,
      [name]: parseInt(value),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(localSettings);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <h2 className="text-lg font-semibold">Customize Durations</h2>

      <label className="flex flex-col">
        <span>Work Duration (minutes)</span>
        <input
          type="number"
          name="workDuration"
          value={localSettings.workDuration}
          onChange={handleChange}
          min={1}
          max={120}
          className="mt-1 px-2 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </label>

      <label className="flex flex-col">
        <span>Break Duration (minutes)</span>
        <input
          type="number"
          name="breakDuration"
          value={localSettings.breakDuration}
          onChange={handleChange}
          min={1}
          max={60}
          className="mt-1 px-2 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </label>

      <button
        type="submit"
        className="self-start px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save Settings
      </button>
    </form>
  );
}
