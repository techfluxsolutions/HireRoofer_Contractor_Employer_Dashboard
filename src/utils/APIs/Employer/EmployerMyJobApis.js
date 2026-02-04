// api/auth.js (or wherever SelectRoleAPI lives)

import { authorizeMe, axiosInstance } from "../commonHeadApiLogic";

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

export async function AddEmployerJobAPI(data) {
  return withAuthorization(async () => {
    const response = await axiosInstance.post("/api/employer/jobs", data);
    return response;
  });
}

export async function GetSkillsForEmployerAPI() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/employer/resources/skills");
  });
}

export async function GetToolsForEmployerAPI() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/employer/resources/tool");
  });
}

export async function GetMyJobsAPI() {
  return withAuthorization(async () => {
    return axiosInstance.get("/api/employer/jobs");
  });
}


// /api/employer/jobs/6943d5b9acf4fab1cb358199
export async function GetSingleEmployerJobAPI(jobId) {
  return withAuthorization(async () => {
    return axiosInstance.get(`/api/employer/jobs/${jobId}`);
  });
}
