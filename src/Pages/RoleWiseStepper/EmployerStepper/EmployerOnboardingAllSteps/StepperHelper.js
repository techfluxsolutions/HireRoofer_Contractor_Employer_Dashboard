// ============================================================
// 2. utils/stepperHelpers.js

import { TOTAL_STEPS } from "./stepConfig";

// ============================================================
export const getInitialStepFromLocation = (location) => {
  const stateStart = location?.state?.startStep;
  if (typeof stateStart === "number" && !Number.isNaN(stateStart)) {
    return Math.min(Math.max(stateStart, 1), TOTAL_STEPS);
  }
  
  try {
    const params = new URLSearchParams(location?.search || "");
    const q = params.get("start");
    if (q) {
      const qn = parseInt(q, 10);
      if (!Number.isNaN(qn)) return Math.min(Math.max(qn, 1), TOTAL_STEPS);
    }
  } catch (e) {
    // ignore
  }
  return 1;
};

export const mapStep1ResponseToForm = (apiData) => {
  if (!apiData) return {};

  console.log(apiData)
  return {
    companyName: apiData.companyName ?? "",
    abn: apiData.abn ?? "",
    ptyLtdStatus: apiData.businessStructure ?? "",
    officeAddress: apiData.officeLocation ?? "",
    lat: apiData.latitude ?? null,
    lng: apiData.longitude ?? null,
    companyLogo: apiData.companyLogo ?? null,
    profileImage: apiData.profileImage ?? null,
  };
};


// utils/stepperHelpers.js
// roofingLicence: null,
//     licenceNumber: "",
//     expirationDate: "",
//     proofOfInsurance: null,
export const mapStep2ResponseToForm = (apiData) => {
  if (!apiData) return {};

  return {
    roofingLicence: apiData.licenseFile ?? null,
    licenceNumber: apiData.licenseNumber ?? "",
    expirationDate: apiData.licenseExpiry ?? "",
    proofOfInsurance: apiData.insuranceFile ?? null,
  };
};



export const mapStep3ResponseToForm = (apiData) => {
  if (!apiData) return {};

  //step3
    // contactPersonName: "",
    // position: "",
    // phoneNumber: "",
    // email: "",

  return {
    contactPersonName: apiData.contactName ?? "",
    position: apiData.contactRole ?? "",
    phoneNumber: apiData.contactPhone ?? "",  // files must be re-uploaded
    email: apiData.contactEmail ?? "",
  };
};

export const mapStep4ResponseToForm = (data) => {
  return {
    // Chips (convert string[] → object[])
    workAreas: Array.isArray(data.serviceAreas)
      ? data.serviceAreas.map((name, index) => ({
          _id: `${name}-${index}`,
          name,
        }))
      : [],

    roofingTypes: Array.isArray(data.projectTypes)
      ? data.projectTypes.map((name, index) => ({
          _id: `${name}-${index}`,
          name,
        }))
      : [],

    // Selects
    hireOwnCrew: data.hiringCrew ,
    numberOfEmployees: data.numberOfEmployees ?? "",
  };
};


// ============================
// STEP 5 MAPPERS
// ============================

export const mapStep5ResponseToForm = (apiData) => {
  return {
    serviceArea: apiData?.area ?? "",
    selectedPlan: apiData?.subscriberID ?? "",
    billingCycle: apiData?.billingCycle ?? "monthly",
  };
};



export const mapStep5FormToPayload = (availability) => {
  if (!availability?.selectedDates) {
    return { availabilityCalendar: [] };
  }

  return {
    availabilityCalendar: availability.selectedDates.map((d) => ({
      date: d.date.split("-").reverse().join("-"), // dd-mm-yyyy → yyyy-mm-dd
      available: true,
      slots: [`${d.start}-${d.end}`],
    })),
  };
};



export const calculateProgressPercent = (step, totalSteps) => {
  return ((step - 1) / (totalSteps - 1)) * 100;
};
