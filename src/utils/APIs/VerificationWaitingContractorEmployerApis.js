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
export async function GetVerifyStatusContractorAPI() {
  return withAuthorization(async () => {
    const response = await axiosInstance.get("/api/worker/profile/status");
    return response;
  });
}

export async function GetVerifyStatusEmployerAPI() {
  return withAuthorization(async () => {
    const response = await axiosInstance.get("/api/employer/profile/status");
    return response;
  });
}

