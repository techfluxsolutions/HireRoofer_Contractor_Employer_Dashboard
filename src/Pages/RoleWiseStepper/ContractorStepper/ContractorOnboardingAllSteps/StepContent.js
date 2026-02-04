// ============================================================
// 7. components/StepContent.jsx
// ============================================================
import React from "react";
import ContractorStep1 from "../ContractorStep1/ContractorStep1";
import ContractorStep2 from "../ContractorStep2/ContractorStep2";
import ContractorStep3 from "../ContractorStep3/ContractorStep3";
import ContractorStep4 from "../ContractorStep4/ContractorStep4";
import ContractorStep5 from "../ContractorStep5/ContractorStep5";
import ContractorStep6 from "../ContractorStep6";

const StepContent = ({ step, formData, handleChange, handleAvailabilityChange, step1Ref }) => {
  switch (step) {
    case 1:
      return (
        <ContractorStep1
          ref={step1Ref}
          formData={formData}
          handleChange={handleChange}
          skillsMulti={true}
        />
      );
    case 2:
      return <ContractorStep2 formData={formData} handleChange={handleChange} />;
    case 3:
      return <ContractorStep3 formData={formData} handleChange={handleChange} />;
   
    case 4:
      return <ContractorStep4 formData={formData} handleChange={handleChange} />;

       case 5:
      return (
        <ContractorStep5
          formData={{ availability: formData.availability }}
          onChange={handleAvailabilityChange}
        />
      );
    
    default:
      return null;
  }
};

export default StepContent;