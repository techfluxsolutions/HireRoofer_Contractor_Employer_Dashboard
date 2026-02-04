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



// GET Step 1 data
export async function GetEmployerStep1API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/employer/step1");
  });
}

// POST / Save Step 1 data
export async function SaveEmployerStep1API(data) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/employer/step1", data);
  });
}


// /api/employer/step2

export async function SaveEmployerStep2API(data) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/employer/step2", data);
  });
}

export async function GetEmployerStep2API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/employer/step2");
  });
}


// /api/employer/step3

export async function SaveEmployerStep3API(data) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/employer/step3", data);
  });
}

export async function GetEmployerStep3API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/employer/step3");
  });
}

//STEP 4 APis
// /api/dropdowns/project-types
export async function GetProjectTypesStep4API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/dropdowns/project-types");
  });
}
// {{baseurl}}/api/dropdowns/work-areas
export async function GetAreaStep4API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/dropdowns/work-areas");
  });
}
// {{baseurl}}/api/dropdowns/company-sizes
export async function GetNumberOfEmployeesStep4API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/dropdowns/company-sizes");
  });
}
// {{baseurl}}/api/dropdowns/hiring-preferences
export async function GetHiringPreferenceStep4API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/dropdowns/hiring-preferences");
  });
}
// /api/employer/step4

export async function SaveEmployerStep4API(data) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/employer/step4", data);
  });
}

export async function GetEmployerStep4API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/employer/step4");
  });
}

// /api/employer/step5

export async function SaveEmployerStep5API(data) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/employer/step5", data);
  });
}

export async function GetEmployerStep5API() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/employer/step5");
  });
}


// ===============================
// EMPLOYER SUBSCRIPTION PLANS
// ===============================

export async function GetEmployerSubscriptionPlansAPI() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/employer/subscription/plans");
  });
}


// ===============================
// EMPLOYER SUBSCRIPTION APIs
// ===============================

export async function CreateEmployerSubscriptionAPI(data) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/employer/subscription/create", data);
  });
}

export async function CheckoutEmployerSubscriptionAPI(data) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/employer/subscription/checkout", data);
  });
}

export async function ConfirmEmployerSubscriptionAPI(data) {
  return withAuthorization(async () => {
    return await axiosInstance.post("/api/employer/subscription/confirm", data);
  });
}
