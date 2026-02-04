import React from "react";
import RoofersFilters from "./RooferFilters";

const RoofersListView = ({ workers, selectedWorker, onSelectWorker }) => {
  const [filters, setFilters] = React.useState({
    skills: false,
    rating: false,
    hourlyRate: false,
    licence: false,
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* LEFT FILTER PANEL */}
      <div className="w-full lg:w-64">
        <RoofersFilters filters={filters} setFilters={setFilters} />
      </div>

      {/* RIGHT LIST */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {workers.map((worker) => (
          <div
            key={worker._id}
            onClick={() => onSelectWorker(worker)}
            className={`bg-white border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all ${
              selectedWorker?._id === worker._id ? "border-blue-500" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                {worker.fullName?.charAt(0)}
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-medium truncate">{worker.fullName}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                  📍 Sydney
                </p>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-500 truncate">
              Roofing, Repair
            </div>

            <div className="mt-2 text-xs text-gray-700">
              {worker.hourlyRate || "2/hr"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoofersListView;
