// ============================================================
// 8. components/NavigationButtons.jsx
// ============================================================
import React from "react";

const NavigationButtons = ({ step, totalSteps, handleBack, handleNext, onSubmit }) => {
  return (
    <div className="d-flex justify-content-between mt-4">
      <div>
        {step > 1 && (
          <button className="btn btn-outline-secondary" onClick={handleBack}>
            Back
          </button>
        )}
      </div>

      <div>
        {step < totalSteps ? (
          <button className="btn btn-primary" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button className="btn btn-success" onClick={onSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default NavigationButtons;