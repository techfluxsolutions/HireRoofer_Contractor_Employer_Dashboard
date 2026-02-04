// ============================================================
// 5. hooks/useStep1Data.js
// ============================================================
import { useEffect, useState } from "react";
import { GetWorkerStep1API, SaveWorkerStep1API } from "../../../../../utils/APIs/ContractorStepperApis";
import { mapStep1ResponseToForm } from "../StepperHelper";

export const useStep1Data = (step, formData, updateFormData, showSuccess, showError) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStep1 = async () => {
      try {
        setLoading(true);
        const response = await GetWorkerStep1API();

        if (response?.status === 200 && response?.data?.success) {
          const mappedData = mapStep1ResponseToForm(response?.data?.data);
          updateFormData(mappedData);
        }
      } catch (err) {
        console.error("Failed to fetch Step 1:", err);
        showError("Failed to load Step 1 data");
      } finally {
        setLoading(false);
      }
    };

    if (step === 1) {
      fetchStep1();
    }
  }, [step]);

  const handleSaveStep1 = async () => {
    setLoading(true);
    try {
      const payload = new FormData();

      payload.append(
        "firstName",
        `${formData.salutation} ${formData.firstName}`.trim()
      );
      payload.append("lastName", formData.lastName);
      payload.append("city", formData.city);
      payload.append("lat", formData.lat);
      payload.append("lng", formData.lng);

      if (formData.profilePic) {
        payload.append("profileImage", formData.profilePic);
      }

      const response = await SaveWorkerStep1API(payload);

      if (response?.status === 200 && response?.data?.success) {
        showSuccess(response.data.message || "Step 1 saved");
        return true;
      }

      showError(response?.data?.message || "Failed to save Step 1");
      return false;
    } catch (err) {
      console.error("Failed to save Step1:", err);
      showError("Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSaveStep1,
  };
};