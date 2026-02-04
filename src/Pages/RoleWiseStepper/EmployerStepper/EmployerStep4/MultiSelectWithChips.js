import { useState } from "react";

const MultiSelectWithChips = ({
  label,
  placeholder,
  items,
  selectedItems,
  fieldName,
  handleChange,
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const addItem = (item) => {
    if (selectedItems.some((i) => i._id === item._id)) return;

    handleChange({
      target: {
        name: fieldName,
        value: [...selectedItems, item],
      },
    });
    setSearch("");
    setOpen(false);
  };

  const removeItem = (id) => {
    handleChange({
      target: {
        name: fieldName,
        value: selectedItems.filter((i) => i._id !== id),
      },
    });
  };

  return (
    <div className="mb-4">
      <label className="form-label fw-medium">
        {label} <span className="text-danger">*</span>
      </label>

      {/* Chips box */}
      <div className="border rounded-3 p-2 mb-2 d-flex flex-wrap gap-2">
        {selectedItems.length === 0 ? (
          <span className="text-muted small">{placeholder}</span>
        ) : (
          selectedItems.map((item) => (
            <span
              key={item._id}
              className="badge d-flex align-items-center gap-2 px-3 py-2"
              style={{ background: "#D6E9F8", borderRadius: "20px" }}
            >
              {item.name}
              <span
                style={{ cursor: "pointer", fontWeight: "bold" }}
                onClick={() => removeItem(item._id)}
              >
                ✕
              </span>
            </span>
          ))
        )}
      </div>

      {/* Input */}
      <div style={{ position: "relative" }}>
        <input
          className="form-control"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
        />

        {open && (
          <div className="border rounded-3 mt-1 bg-white shadow-sm position-absolute w-100 z-3">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="p-2 cursor-pointer"
                onMouseDown={() => addItem(item)}
                style={{ cursor: "pointer" }}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
