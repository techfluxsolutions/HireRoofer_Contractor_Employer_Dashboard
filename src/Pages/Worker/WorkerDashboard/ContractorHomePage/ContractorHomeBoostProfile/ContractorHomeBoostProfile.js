import React from "react";
import "./ContractorHomeBoostProfile.css";

const ContractorHomeBoostProfile = () => {
  return (
    <div className="contractorBoostProfile-container">

      <div className="contractorBoostProfile-content">
        <h3 className="contractorBoostProfile-title">
          Boost Your Profile to Find More Jobs !!
        </h3>

        <p className="contractorBoostProfile-subtitle">
          Increase visibility and get more request .
        </p>

        <button className="contractorBoostProfile-btn">
          Boost Profile Now <span className="ms-2">›</span>
        </button>
      </div>

      {/* Right Side Image */}
      <img
        src="/assets/Contractor/ContractorHomePage/ContractorBoostProfileIcon.png"
        alt="Boost"
        className="contractorBoostProfile-icon"
      />

    </div>
  );
};

export default ContractorHomeBoostProfile;
