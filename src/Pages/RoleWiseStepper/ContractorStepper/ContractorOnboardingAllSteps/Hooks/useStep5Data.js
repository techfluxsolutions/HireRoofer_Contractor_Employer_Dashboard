import { useEffect, useState } from "react";
import {
  GetWorkerStep5API,
  SaveWorkerStep5API,
} from "../../../../../utils/APIs/ContractorStepperApis";
import {
  mapStep5ResponseToForm,
  mapStep5FormToPayload,
} from "../StepperHelper";
import { useNavigate } from "react-router-dom";

export const useStep5Data = (
  step,
  formData,
  updateFormData,
  showSuccess,
  showError
) => {
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();

  // ============================
  // GET STEP 5 DATA
  // ============================
  useEffect(() => {
    if (step !== 5) return;

    const fetchStep5 = async () => {
      try {
        setLoading(true);
        const res = await GetWorkerStep5API();
        console.log("RESPONSE STEP 5", res?.data);

        if (res?.status === 200 && res?.data?.success) {
          updateFormData(mapStep5ResponseToForm(res?.data?.data?.availability));
        }
      } catch (err) {
        console.error("Failed to fetch step 5 data", err);
        showError("Failed to load Step 5 data");
      } finally {
        setLoading(false);
      }
    };

    if (step === 5) fetchStep5();
  }, [step]);

  // ============================
  // SAVE STEP 5 DATA (POST)
  // ============================
  const handleSaveStep5 = async () => {
    try {
      setLoading(true);

      const payload = mapStep5FormToPayload(formData.availability);

      const response = await SaveWorkerStep5API(payload);

     if (response?.status === 200 && response?.data?.success) {
    showSuccess(
        response?.data?.message || "Step 5 saved successfully"
    );

    const worker = response?.data?.data?.worker;

    if (
        worker?.onboardingStep === 5 &&
        worker?.onboardingCompleted === true
    ) {
      sessionStorage.setItem()
        navigate("/contractor-verified"); // 🔁 CHANGE ROUTE IF NEEDED
        return true;
    }

    return true;
}

       else {
        showError(response?.data?.message || "Failed to save Step 5");
        return false;
      }
    } catch (err) {
      console.error("Failed to save step 5", err);
      showError("Failed to save Step 5");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSaveStep5 };
};
