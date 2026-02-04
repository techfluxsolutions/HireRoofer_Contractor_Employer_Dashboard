import { useEffect, useState } from "react";
import { mapStep4ResponseToForm } from "../StepperHelper";
import {
  GetEmployerStep4API,
  SaveEmployerStep4API,
} from "../../../../../utils/APIs/EmployerStepperApis";

export const useStep4Data = (
  step,
  formData,
  updateFormData,
  showSuccess,
  showError
) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step !== 4) return;

    const fetchStep4 = async () => {
      try {
        setLoading(true);
        const res = await GetEmployerStep4API();

        if (res?.status === 200 && res?.data?.success) {
          updateFormData(mapStep4ResponseToForm(res.data.data));
        }
      } catch (err) {
        console.error("Failed to fetch step 4 data", err);
        showError("Failed to load Step 4 data");
      } finally {
        setLoading(false);
      }
    };

    fetchStep4();
  }, [step]);

  // ✅ JSON BODY (NO FormData)
const handleSaveStep4 = async () => {
  try {
    const numberOfEmployees = formData.numberOfEmployees;

    if (
      numberOfEmployees === "" ||
      numberOfEmployees === null ||
      numberOfEmployees === undefined
    ) {
      showError("Number of employees is required");
      return false;
    }

    const payload = {
      serviceAreas: formData.workAreas.map(a => a.name),
      projectTypes: formData.roofingTypes.map(p => p.name),
      hiringCrew:
        formData.hireOwnCrew === true ||
        formData.hireOwnCrew === "true" ||
        formData.hireOwnCrew === "yes",
      numberOfEmployees, // ✅ send as-is
    };

    const response = await SaveEmployerStep4API(payload);

    if (response?.status === 200 && response?.data?.success) {
      showSuccess(response.data.message || "Step 4 saved successfully");
      return true;
    }

    showError(response?.data?.message || "Failed to save Step 4");
    return false;
  } catch (err) {
    console.error("Failed to save step 4", err);
    showError("Failed to save Step 4");
    return false;
  }
};



  return { loading, handleSaveStep4 };
};
