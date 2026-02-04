// api/auth.js

import { authorizeMe, axiosInstance } from "../commonHeadApiLogic";

const withAuthorization = async (apiFunction, ...args) => {
  try {
    await authorizeMe();
    return await apiFunction(...args);
  } catch (error) {
    console.error("Error in API request:", error);
    throw error;
  }
};

// 🔹 Employer profile status
export async function GetEmployerInfoAPI() {
  return withAuthorization(async () => {
    return axiosInstance.get("/api/employer/profile");
  });
}

// 🔹 Employer jobs list
export async function GetEmployerJobsAPI() {
  return withAuthorization(async () => {
    return axiosInstance.get("/api/employer/jobs");
  });
}

// 🔹 Boosted available workers
export async function GetBoostedAvailableWorkersAPI() {
  return withAuthorization(async () => {
    return axiosInstance.get(
      "/api/employer/jobs/workers/boosted/available"
    );
  });
}
