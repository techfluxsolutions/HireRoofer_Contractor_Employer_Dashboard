// hooks/useStep3Data.js
import { useEffect, useState } from "react";
import { GetEmployerStep3API, SaveEmployerStep3API } from "../../../../../utils/APIs/EmployerStepperApis";
import { mapStep3ResponseToForm } from "../StepperHelper";
// import { mapStep3ResponseToForm } from "../../../ContractorStepper/ContractorOnboardingAllSteps/StepperHelper";


export const useStep3Data = (
  step,
  formData,
  updateFormData,
  showSuccess,
  showError
) => {
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // Fetch Step 3 data
  // ---------------------------
  useEffect(() => {
    if (step !== 3) return;

    const fetchStep3 = async () => {
      try {
        setLoading(true);
        const res = await GetEmployerStep3API();

        if (res?.status === 200 && res?.data?.success) {
          updateFormData(mapStep3ResponseToForm(res?.data?.data));
        }
      } catch (err) {
        console.error("Failed to fetch step 3 data", err);
      } finally {
        setLoading(false);
      }
    };


    if (step === 3) fetchStep3();
  }, [step]);

  // ---------------------------
  // Save Step 3 (LIKE STEP 2)
  // ---------------------------
  const handleSaveStep3 = async () => {
   //step3
    // contactPersonName: "",
    // position: "",
    // phoneNumber: "",
    // email: "",
    try {
      
      const payload ={
        "contactName" :formData.contactPersonName,
        "contactRole" :formData.position,
        "contactPhone" :formData.phoneNumber,
        "contactEmail" :formData.email
      }
     

      const response=await SaveEmployerStep3API(payload);
      if(response?.data?.success && response?.status===200){
        showSuccess(response?.data?.message||"Step 3 saved successfully");
      }
      else{
        showError(response?.data?.message)
      }
      
      return true;
    } catch (err) {
      console.error("Failed to save step 3 data", err);
      showError("Failed to save Step 3");
      return false;
    }
  };

  return {
    loading,
    handleSaveStep3,
  };
};
