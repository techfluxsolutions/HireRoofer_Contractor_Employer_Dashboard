// api/auth.js (or wherever SelectRoleAPI lives)
import { axiosInstance, authorizeMe } from "./commonHeadApiLogic.js";

const withAuthorization = async (apiFunction, ...args) => {
  try {
    // ensure header is set (authorizeMe returns token or null)
    await authorizeMe();
    return await apiFunction(...args);
  } catch (error) {
    console.error("Error in API request:", error);
    throw error;
  }
};

// If the endpoint requires Authorization header:
// export async function SelectRoleAPI(data) {
//   return withAuthorization(async () => {
//     const response = await axiosInstance.post("/api/auth/select-role", data);
//     return response;
//   });
// }
// 

// export async function GetSkillsAPI() {
//   return {
//     data: {
//       data: [
//         { value: "plumbing", label: "Plumbing" },
//         { value: "electrical", label: "Electrical" },
//         { value: "painting", label: "Painting" },
//         { value: "carpentry", label: "Carpentry" },
//         { value: "hvac", label: "HVAC" },
//         { value: "roofing", label: "Roofing" }
//       ]
//     }
//   };
// }
export async function GetSkillsAPI() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/worker/skills");
  });
}
export async function GetExperienceAPI() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/worker/experiences");
  });
}
export async function GetToolsAPI() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/worker/tools");
  });
}
// export async function GetExperienceAPI() {
//   return {
//     data: {
//       data: [
//         { value: "0-5", label: "0–5 Years" },
//         { value: "6-8", label: "6–8 Years" },
//         { value: "8-10", label: "8–10 Years" },
//         { value: "10+", label: "10+ Years" }
//       ]
//     }
//   };
// }


// GET Step 1 data
export async function GetWorkerStep1API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/worker/step1");
  });
}

// POST / Save Step 1 data
export async function SaveWorkerStep1API(data) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/worker/step1", data);
  });
}


// /api/worker/step2

export async function SaveWorkerStep2API(data) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/worker/step2", data);
  });
}

export async function GetWorkerStep2API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/worker/step2");
  });
}


// /api/worker/step3

export async function SaveWorkerStep3API(data) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/worker/step3", data);
  });
}

export async function GetWorkerStep3API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/worker/step3");
  });
}


// /api/worker/step4

export async function SaveWorkerStep4API(data) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/worker/step4", data);
  });
}

export async function GetWorkerStep4API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/worker/step4");
  });
}

// /api/worker/step5

export async function SaveWorkerStep5API(data) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/worker/step5", data);
  });
}

export async function GetWorkerStep5API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/worker/step5");
  });
}


