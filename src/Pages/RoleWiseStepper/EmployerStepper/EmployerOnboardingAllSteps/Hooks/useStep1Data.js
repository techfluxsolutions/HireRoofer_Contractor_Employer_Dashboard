// ============================================================
// 5. hooks/useStep1Data.js
// ============================================================
import { useEffect, useState } from "react";
// import { GetWorkerStep1API, SaveWorkerStep1API } from "../../../../../utils/APIs/ContractorStepperApis";
import { mapStep1ResponseToForm } from "../StepperHelper";
import { GetEmployerStep1API, SaveEmployerStep1API } from "../../../../../utils/APIs/EmployerStepperApis";
    // comapnyName: "",
    // abn: "",
    // companyLogo: null,
    // profileImage: null,
    // officeAddress: "",
    // lat: null,
    // lng: null,
export const useStep1Data = (step, formData, updateFormData, showSuccess, showError) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStep1 = async () => {
      try {
        setLoading(true);
        const response = await GetEmployerStep1API();
        console.log("Employer Step 1",response?.data?.data)

        if (response?.status === 200 && response?.data?.success) {
          const mappedData = mapStep1ResponseToForm(response?.data?.data);
          updateFormData(mappedData);
        }
      } catch (err) {
        console.error("Failed to fetch Step 1:", err);
        // showError("Failed to load Step 1 data");
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

      // payload.append(
      //   "firstName",
      //   `${formData.salutation} ${formData.firstName}`.trim()
      // );
      payload.append("companyName", formData.companyName);
      payload.append("abn", formData.abn);
      payload.append("businessStructure", formData.ptyLtdStatus);
      payload.append("latitude", formData.lat);
      payload.append("longitude", formData.lng);

      if (formData.companyLogo) {
        payload.append("companyLogo", formData.companyLogo);
      }
      // profileImage
        if (formData.profileImage) {
        payload.append("profileImage", formData.profileImage);
      }
      // officeAddress
       if (formData.officeAddress) {
        payload.append("officeLocation", formData.officeAddress);
      }

      const response = await SaveEmployerStep1API(payload);

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