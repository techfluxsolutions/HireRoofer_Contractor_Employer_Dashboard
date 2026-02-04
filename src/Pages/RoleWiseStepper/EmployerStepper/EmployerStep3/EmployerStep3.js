import React from "react";

const EmployerStep3 = ({ formData, handleChange }) => {
  return (
    <div style={styles.container}>
      {/* Contact Person Name */}
      <div style={styles.field}>
        <label style={styles.label}>
          Contact Person’s Full Name <span style={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="contactPersonName"
          value={formData.contactPersonName}
          onChange={handleChange}
          placeholder="Enter Contact Person’s Full Name"
          style={styles.input}
        />
      </div>

      {/* Position / Role */}
      <div style={styles.field}>
        <label style={styles.label}>Position / Role</label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Enter Position / Role"
          style={styles.input}
        />
      </div>

      {/* Phone Number */}
      <div style={styles.field}>
        <label style={styles.label}>Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter Phone Number"
          style={styles.input}
        />
      </div>

      {/* Email Address */}
      <div style={styles.field}>
        <label style={styles.label}>Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email Address"
          style={styles.input}
        />
      </div>
    </div>
  );
};

export default EmployerStep3;

/* ---------------- styles ---------------- */

const styles = {
  container: {
    maxWidth: "720px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#333",
  },
  required: {
    color: "#d32f2f",
  },
  input: {
    height: "48px",
    padding: "0 14px",
    borderRadius: "8px",
    border: "1px solid #d0d5dd",
    fontSize: "14px",
    outline: "none",
  },
};
