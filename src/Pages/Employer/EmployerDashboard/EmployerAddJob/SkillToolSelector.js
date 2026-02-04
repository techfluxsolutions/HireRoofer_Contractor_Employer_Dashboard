import React, { useEffect, useState } from "react";

/* ---------- Chip ---------- */
const Chip = ({ item, onRemove }) => (
  <span
    className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm"
    style={{ backgroundColor: "#D6E9F8" }}
  >
    {item.name}
    <span
      className="cursor-pointer font-bold"
      onClick={onRemove}
    >
      ✕
    </span>
  </span>
);

const SkillToolSelector = ({
  label,
  items,
  selectedItems,
  setSelectedItems,
  placeholder = "Add item",
}) => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const addItem = (item) => {
    if (selectedItems.some((i) => i.name.toLowerCase() === item.name.toLowerCase())) return;
    setSelectedItems([...selectedItems, item]);
    setSearch("");
    setShowDropdown(false);
  };

  const addCustom = () => {
    if (!search.trim()) return;
    addItem({
      _id: `manual_${Date.now()}`,
      name: search.trim(),
    });
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter((i) => i._id !== id));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 text-start">
        {label}
      </label>

      {/* Chips */}
      <div className="border rounded-lg p-3 min-h-[80px] mb-2">
        <div className="flex flex-wrap gap-2">
          {selectedItems.length === 0 ? (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          ) : (
            selectedItems.map((item) => (
              <Chip
                key={item._id}
                item={item}
                onRemove={() => removeItem(item._id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Input */}
     <div className="relative">
  <input
    type="text"
    className="w-full border rounded-lg px-3 py-2 pr-8"
    placeholder={placeholder}
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setShowDropdown(true);
    }}
    onFocus={() => setShowDropdown(true)}
    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
  />

  {/* Dropdown Icon */}
  <span
    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
  >
    ▼
  </span>

  {showDropdown && (
    <div className="absolute w-full bg-white border rounded-lg mt-1 max-h-48 overflow-auto z-10 shadow-md">
      {filtered.length > 0 ? (
        filtered.map((item) => (
          <div
            key={item._id}
            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            onMouseDown={() => addItem(item)}
          >
            {item.name}
          </div>
        ))
      ) : (
        <div
          className="px-3 py-2 text-blue-600 cursor-pointer"
          onMouseDown={addCustom}
        >
          + Add "{search}"
        </div>
      )}
    </div>
  )}
</div>

    </div>
  );
};

export default SkillToolSelector;
