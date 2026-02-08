import { useState } from "react";

const AvailabilityToggle = () => {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex items-center justify-between border rounded-lg px-3 py-2">
      <span className="text-sm font-medium">Availability</span>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
          className="sr-only peer"
        />

        {/* Track */}
        <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300" />

        {/* Thumb */}
        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5" />
      </label>
    </div>
  );
};

export default AvailabilityToggle;
