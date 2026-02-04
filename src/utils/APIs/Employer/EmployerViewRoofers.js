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

export async function GetNearbyWorkersAPI({ latitude, longitude, radius }) {
  return withAuthorization(async () => {
    return axiosInstance.get(
      `/api/employer/location/workers/nearby`,
      {
        params: {
          latitude,
          longitude,
          radius
        }
      }
    );
  });
}

// /api/employer/jobs/workers/boosted/available

export async function GetBoostedWorkerAPI() {
  return withAuthorization(async () => {
    return await axiosInstance.get("/api/employer/jobs/workers/boosted/available");
  });
}