import React from "react";

const FilterButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 rounded border text-sm ${
      active
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white hover:bg-gray-50"
    }`}
  >
    {label}
  </button>
);

const RoofersFilters = ({ filters, setFilters }) => {
  return (
    <div className="bg-white border rounded-lg p-4 space-y-3">
      <FilterButton
        label="Skills"
        active={filters.skills}
        onClick={() =>
          setFilters((prev) => ({ ...prev, skills: !prev.skills }))
        }
      />

      <FilterButton
        label="Rating"
        active={filters.rating}
        onClick={() =>
          setFilters((prev) => ({ ...prev, rating: !prev.rating }))
        }
      />

      <FilterButton
        label="Hourly Rate"
        active={filters.hourlyRate}
        onClick={() =>
          setFilters((prev) => ({ ...prev, hourlyRate: !prev.hourlyRate }))
        }
      />

      <FilterButton
        label="Licence"
        active={filters.licence}
        onClick={() =>
          setFilters((prev) => ({ ...prev, licence: !prev.licence }))
        }
      />
    </div>
  );
};

export default RoofersFilters;
