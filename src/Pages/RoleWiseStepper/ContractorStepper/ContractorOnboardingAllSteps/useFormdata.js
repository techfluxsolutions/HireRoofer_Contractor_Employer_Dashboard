import { useState } from "react";

export const useFormData = () => {
  const [formData, setFormData] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    profilePic: null,
    city: "",
    lat: undefined,
    lng: undefined,
    skills: [],
    tools: [],
    experience: "",
    license: null,
    insurance: null,
    abn: "",
    ptyLtd: "",
    pastJobPhotos: [],
    availability: { selectedDates: [], weeklySchedule: {} },
    hourlyRate: "",
    travelRadius: "",
  });

  const handleChange = (e) => {
    const target = e?.target ?? e;
    const { name, value, files } = target ?? {};
    const fieldValue = files ? (files.length === 1 ? files[0] : Array.from(files)) : value;

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
