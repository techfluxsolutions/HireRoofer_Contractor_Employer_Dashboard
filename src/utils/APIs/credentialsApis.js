import { axiosInstanceNoAuth } from './commonHeadApiLogic.js';


export async function LoginAPI(data) {
  // return withAuthorization(async () => {
    const response = await axiosInstanceNoAuth.post("/api/auth/login", data);
    return response;
  // });
}

export async function SignUpAPI(data) {
  // return withAuthorization(async () => {
    const response = await axiosInstanceNoAuth.post("/api/auth/register", data);
    return response;
  // });
}

export async function VerifyOTPAPI(data) {
  // return withAuthorization(async () => {
    const response = await axiosInstanceNoAuth.post("/api/auth/verify-otp", data);
    return response;
  // });
}

// api/auth/resend-otp
export async function ResendOTPAPI(data) {
  // return withAuthorization(async () => {
    const response = await axiosInstanceNoAuth.post("/api/auth/resend-otp", data);
    return response;
  // });
}

