import { useState } from "react";

export const useFormData = () => {
  const [formData, setFormData] = useState({
    // step 1
    companyName: "",
    abn: "",
    ptyLtdStatus: "",
    companyLogo: null,
    profileImage: null,
    officeAddress: "",
    lat: null,
    lng: null,

    // step 2
    roofingLicence: null,
    licenceNumber: "",
    expirationDate: "",
    proofOfInsurance: null,
    //step3
    contactPersonName: "",
    position: "",
    phoneNumber: "",
    email: "",
    // step 4
  
  workAreas: [],          // multi
  roofingTypes: [],       // multi
  hireOwnCrew: "",        // single
  numberOfEmployees: "",  // single

  // ✅ step 5
  serviceArea: "",
  selectedPlan: "",
  billingCycle: "monthly",


  });

const handleChange = (e) => {
  const target = e?.target ?? e;
  const { name, value, files } = target ?? {};

  // Only take the first file for UploadChipBox
  const fieldValue = files?.[0] ?? value;

  setFormData((prev) => ({
    ...prev,
    [name]: fieldValue,
  }));
};

  const handleAvailabilityChange = (availabilityPatch) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        selectedDates: availabilityPatch.selectedDates ?? prev.availability.selectedDates,
        weeklySchedule: availabilityPatch.weeklySchedule ?? prev.availability.weeklySchedule,
      },
      hourlyRate: availabilityPatch.hourlyRate ?? prev.hourlyRate,
      travelRadius: availabilityPatch.travelRadius ?? prev.travelRadius,
    }));
  };

  const updateFormData = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return {
    formData,
    handleChange,
    handleAvailabilityChange,
    updateFormData,
  };
};
