// hooks/useStep2Data.js
import { useEffect, useState } from "react";
import { GetWorkerStep2API, SaveWorkerStep2API } from "../../../../../utils/APIs/ContractorStepperApis";
import { mapStep2ResponseToForm } from "../StepperHelper";

export const useStep2Data = (
  step,
  formData,
  updateFormData,
  showSuccess,
  showError
) => {
  const [loading, setLoading] = useState(false);

  /* ---------- Fetch Step 2 ---------- */
  useEffect(() => {
    const fetchStep2 = async () => {
      try {
        setLoading(true);
        const res = await GetWorkerStep2API();

        if (res?.status === 200 && res?.data?.success) {
          const mapped = mapStep2ResponseToForm(res?.data?.data);
          updateFormData(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch Step 2:", err);
        showError("Failed to load Step 2 data");
      } finally {
        setLoading(false);
      }
    };

    if (step === 2) fetchStep2();
  }, [step]);

  /* ---------- Save Step 2 ---------- */
  const handleSaveStep2 = async () => {
    try {
      setLoading(true);
      console.log("FORMDATA",formData)

         const payload = {
      experience: formData.experience,
      skills: formData.skills.map((s) => s.name),
      tools: formData.tools.map((t) => t.name),
    };

      const res = await SaveWorkerStep2API(payload);

      if (res?.status === 200 && res?.data?.success) {
        showSuccess(res.data.message || "Step 2 saved");
        return true;
      }

      showError(res?.data?.message || "Failed to save Step 2");
      return false;
    } catch (err) {
      console.error("Failed to save Step 2:", err);
      showError("Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSaveStep2 };
};
