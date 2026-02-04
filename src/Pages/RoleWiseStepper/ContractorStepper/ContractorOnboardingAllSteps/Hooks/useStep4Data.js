import { useEffect, useState } from "react";
import { GetWorkerStep4API, SaveWorkerStep4API } from "../../../../../utils/APIs/ContractorStepperApis";
import { mapStep4ResponseToForm } from "../StepperHelper";

export const useStep4Data = (step, formData, updateFormData, showSuccess, showError) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step !== 4) return;

    const fetchStep4 = async () => {
      try {
        setLoading(true);
        const res = await GetWorkerStep4API();
        console.log("RESPONSE STEP 4",res?.data)
        if (res?.status === 200 && res?.data?.success) {
          updateFormData(mapStep4ResponseToForm(res?.data?.data));
        }
      } catch (err) {
        console.error("Failed to fetch step 4 data", err);
        showError("Failed to load Step 4 data");
      } finally {
        setLoading(false);
      }
    };

    if (step === 4) fetchStep4();
  }, [step]);

  const handleSaveStep4 = async () => {
    try {
      const payload = new FormData();
      payload.append("hourlyRate", formData.hourlyRate);
      payload.append("travelRadius", formData.travelRadius);

       formData.pastJobPhotos.forEach((photo, index) => {
      // Append each photo as a separate field with same name "gallery"
      if (photo instanceof File) {
        payload.append("gallery", photo);
      }
    });

  // formData.pastJobPhotos.forEach((photo, index) => {
  //     if (photo instanceof File) {
  //       payload.append(`gallery`, photo);
  //     }
  //   });

      const response = await SaveWorkerStep4API(payload);

      if (response?.status === 200 && response?.data?.success) {
        showSuccess(response?.data?.message || "Step 4 saved successfully");
        return true;
      } else {
        showError(response?.data?.message || "Failed to save Step 4");
        return false;
      }
    } catch (err) {
      console.error("Failed to save step 4", err);
      showError("Failed to save Step 4");
      return false;
    }
  };

  return { loading, handleSaveStep4 };
};
