import React from "react";
import "./EmployerHomeAvailableContractors.css";

const contractorsData = [
  { id: 1, name: "Robert James", job: "Contract Work Needed", location: "Sydney", category: "Contracting", rating: 2.0, initials: "RJ" },
  { id: 2, name: "Robert James", job: "Contract Work Needed", location: "Sydney", category: "Contracting", rating: 2.0, initials: "RJ" },
  { id: 3, name: "Robert James", job: "Contract Work Needed", location: "Sydney", category: "Contracting", rating: 2.0, initials: "RJ" },
  { id: 4, name: "Robert James", job: "Contract Work Needed", location: "Sydney", category: "Contracting", rating: 2.0, initials: "RJ" },
];

const EmployerHomeAvailableContractors = () => {
  return (
    <div className="available-contractors-container">

      {/* Title */}
      <h3 className="contractor-title">Available Contractors</h3>

      {/* Cards */}
      <div className="contractors-grid">
        {contractorsData.map((contractor) => (
          <div className="contractor-card" key={contractor.id}>
            <div className="contractor-initials">{contractor.initials}</div>

            <div className="contractor-details">
              <h4>{contractor.name}</h4>
              <p className="job-title">{contractor.job}</p>

              <p className="location-category">
                📍 {contractor.location} &nbsp;&nbsp; 🔧 {contractor.category}
              </p>

              <div className="rating">
                ⭐ ⭐ ☆ ☆ ☆ <span>{contractor.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="view-all-wrapper">
        <span className="view-all">View All Jobs ›</span>
      </div>

    </div>
  );
};

export default EmployerHomeAvailableContractors;
