import React from 'react'

const ContractorStep6 = ({ formData, handleChange }) => {
  return (
    <div>
      <h5>Step 6: Profile Picture (Optional)</h5>
      <div className="mb-3">
        <label>Upload Profile Picture</label>
        <input
          type="file"
          className="form-control"
          name="profilePic"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default ContractorStep6