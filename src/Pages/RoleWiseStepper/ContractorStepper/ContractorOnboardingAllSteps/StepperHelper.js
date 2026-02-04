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

  const [salutation = "", firstName = ""] = apiData.firstName?.split(" ") ?? [];

  return {
    salutation,
    firstName,
    lastName: apiData?.lastName ?? "",
    city: apiData?.city ?? "",
    lat: apiData?.lat ?? undefined,
    lng: apiData?.lng ?? undefined,
    profilePic: apiData?.profileImage ?? null,
  };
};

// utils/stepperHelpers.js

export const mapStep2ResponseToForm = (apiData) => {
  if (!apiData) return {};

  console.log("STEP2 API DATA", apiData);

  return {
    experience: apiData.experience ?? "",

    skills: Array.isArray(apiData.skills)
      ? apiData.skills.map((name) => ({
          _id: `skill_${name}`,   // stable unique key
          name,
          duration: "",
        }))
      : [],

    tools: Array.isArray(apiData.tools)
      ? apiData.tools.map((name) => ({
          _id: `tool_${name}`,    // stable unique key
          name,
          duration: "",
        }))
      : [],
  };
};


export const mapStep3ResponseToForm = (apiData) => {
  if (!apiData) return {};

  return {
    abn: apiData.abn ?? "",
    ptyLtd: apiData.companyName ?? "",
    license: apiData.license,  // files must be re-uploaded
    insurance: apiData.insurance ?? null,
  };
};

export const mapStep4ResponseToForm = (apiData) => {
  if (!apiData) return {};

  return {
    hourlyRate: apiData.hourlyRate ?? 55,
    travelRadius: apiData.travelRadius ?? 10,
    pastJobPhotos: Array.isArray(apiData.gallery)
      ? apiData.gallery
      : apiData.gallery
      ? [apiData.gallery]
      : [],
  };
};

// ============================
// STEP 5 MAPPERS
// ============================

export const mapStep5ResponseToForm = (apiData) => {
  if (!apiData?.availabilityCalendar) {
    return {
      availability: {
        selectedDates: [],
        weeklySchedule: {},
      },
    };
  }

  const selectedDates = apiData.availabilityCalendar
    .filter((item) => item.available)
    .map((item) => {
      const [start, end] = item.slots?.[0]?.split("-") || ["09:00", "17:00"];

      const [y, m, d] = item.date.split("-"); // yyyy-mm-dd → dd-mm-yyyy

      return {
        date: `${d}-${m}-${y}`,
        start,
        end,
      };
    });

  return {
    availability: {
      selectedDates,
      weeklySchedule: {}, // keep empty unless backend sends it
    },
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
