import React from "react";
import UploadChipBox from "../EmployerStep1/UploadChipBox";
const EmployerStep2 = ({ formData, handleChange }) => {

  return (
    <div style={{ maxWidth: "100%", padding: 20 }}>
      {/* Roofing License Upload */}
      <UploadChipBox
        label="Upload Building / Roofing License"
        name="roofingLicence"
        file={formData.roofingLicence}
        onChange={handleChange}
      />

      {/* License Number */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>
          License Number
        </label>
        <input
          type="text"
          name="licenceNumber"
          value={formData.licenceNumber}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 8,
            border: "1px solid #dee2e6",
          }}
        />
      </div>

      {/* Expiration Date */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>
          Expiration Date
        </label>
        <input
          type="date"
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 8,
            border: "1px solid #dee2e6",
          }}
        />
      </div>

      {/* Proof of Insurance Upload */}
      <UploadChipBox
        label="Proof Of Insurance"
        name="proofOfInsurance"
        file={formData.proofOfInsurance}
        onChange={handleChange}
      />
    </div>
  );
};

export default EmployerStep2;
