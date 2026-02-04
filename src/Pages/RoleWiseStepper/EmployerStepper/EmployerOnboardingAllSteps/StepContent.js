// ============================================================
// 7. components/StepContent.jsx
// ============================================================
import React from "react";
import EmployerStep1 from "../EmployerStep1/EmployerStep1";
import EmployerStep2 from "../EmployerStep2/EmployerStep2";
import EmployerStep3 from "../EmployerStep3/EmployerStep3";
import EmployerStep4 from "../EmployerStep4/EmployerStep4";
import EmployerStep5 from "../EmployerStep5/EmployerStep5";

const StepContent = ({ step, formData, handleChange, handleAvailabilityChange, step1Ref }) => {
  switch (step) {
    case 1:
      return (
        <EmployerStep1
          ref={step1Ref}
          formData={formData}
          handleChange={handleChange}
          skillsMulti={true}
        />
      );
    case 2:
      return <EmployerStep2 formData={formData} handleChange={handleChange} />;
    case 3:
      return <EmployerStep3 formData={formData} handleChange={handleChange} />;
   
    case 4:
      return <EmployerStep4 formData={formData} handleChange={handleChange} />;

    case 5:
  return (
    <EmployerStep5
      formData={formData}
      handleChange={handleChange}
    />
  );

    default:
      return null;
  }
};

export default StepContent;