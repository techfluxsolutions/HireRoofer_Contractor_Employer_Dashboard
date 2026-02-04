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
export async function SelectRoleAPI(data) {
  return withAuthorization(async () => {
    const response = await axiosInstance.post("/api/auth/select-role", data);
    return response;
  });
}

// If the endpoint explicitly must NOT include Authorization header:
// export async function SelectRoleAPI(data) {
//   return axiosInstanceNoAuth.post("/api/auth/select-role", data);
// }
