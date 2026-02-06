import React from "react";
import "./EmployerCompleteYourProfile.css";
import { FaUserPlus } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const EmployerCompleteYourProfile = () => {

  const progress = 67; // ✅ Progress inside same file

  return (
    <div className="completeProfile-card mt-5">

      <div className="completeProfile-iconBox">
        <FaUserPlus className="completeProfile-icon" />
      </div>

      <h3 className="completeProfile-title">Complete Your Profile</h3>

      <div className="completeProfile-progressRow">
        <span className="completeProfile-percentage">
          {progress}% complete
        </span>
        <IoIosArrowForward className="completeProfile-arrow" />
      </div>

      <div className="completeProfile-progressBar">
        <div
          className="completeProfile-progressFill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

    </div>
  );
};

export default EmployerCompleteYourProfile;
