import React, { useState, useRef, useEffect } from "react";
import { ResendOTPAPI, VerifyOTPAPI } from "../../../utils/APIs/credentialsApis";
import { useModal } from "../../../Context/ModalContext/ModalContext";
import { useNavigate } from "react-router-dom";
import Loader from "../../../Loader/Loader";
import { encryptData } from "../../../utils/CRYPTO/cryptoFunction";

// Example: import { VerifyOTPAPI } from "../utils/APIs/auth"; 

const VerifyOTP = ({  apiFn = VerifyOTPAPI }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 const { showSuccess, showError } = useModal();
 const [user,setUser]=useState(null)
  const inputsRef = useRef([]);
  const navigate=useNavigate()
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // clear current value (default behavior) — component already handles that via onChange
        return;
      }
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);
    // focus last input then blur to allow immediate submit if desired
    inputsRef.current[5]?.focus();
  };

const handleVerify = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const otpString = otp.join("");
    if (otpString.length !== 6 || !/^\d{6}$/.test(otpString)) {
      throw new Error("OTP must be 6 digits");
    }

    const payload = {
      otp: otpString,
      email: sessionStorage.getItem("email"),
      role: sessionStorage.getItem("userRole")
    };

    const response = await apiFn(payload);

    if (!(response?.status === 200 && response?.data?.success)) {
      showError(response?.data?.message || "Sign in failed");
      return;
    }

    // Success path
    const data = response.data;
    console.log("VERIFY OTP RESPONSE", data);

    // store token and login flag
    const token = encryptData(data?.token);
    sessionStorage.setItem("token", data?.token);
    sessionStorage.setItem("isLoggedIn", "true");
    const user =response?.data?.user
    sessionStorage.setItem("userId",user?.id)
    // update local user state (if you keep it)
    setUser(data.user);

    // onboarding info from API
    // const onboarding = data.onboarding;

    // Normalize missingFields -> first step number (clamped to 1..6)
    // const parseMissingToStep = (m) => {
    //   if (!m) return 1;
    //   if (Array.isArray(m) && m.length > 0) m = m[0];
    //   const match = String(m).match(/(\d+)/);
    //   if (!match) return 1;
    //   const n = parseInt(match[1], 10);
    //   return Math.min(Math.max(n, 1), 6);
    // };

    // If onboarding required and not completed -> go to stepper (preferred: navigate immediately)
    
// console.log("onboarding?.isApproved",onboarding?.isApproved)


    // 🔐 Save session
              sessionStorage.setItem("token",(token));
              sessionStorage.setItem("user", JSON.stringify(user));
              sessionStorage.setItem("isLoggedIn", "true");
              // sessionStorage.setItem("stepperComplete", onboarding.completed);
              // sessionStorage.setItem("isVerified", onboarding.isApproved);
        
              // const startStep = parseMissingToStep(onboarding.currentStep);
              // sessionStorage.setItem("startStep", startStep);
          const role = sessionStorage.getItem("userRole");
              // 🚦 SINGLE SOURCE OF REDIRECT
              // if (!onboarding.completed) {
              //   navigate(
              //     role === "employer" ? "/employer-stepper" : "/contractor-stepper",
              //     { replace: true, state: { startStep } }
              //   );
              //   return;
              // }
        
              // if (!onboarding.isApproved) {
              //   navigate(
              //     role === "employer"
              //       ? "/employer-verified"
              //       : "/contractor-verified",
              //     { replace: true }
              //   );
              //   return;
              // }
        
              navigate(
                role === "employer"
                  ? "/employer-dashboard"
                  : "/contractor-dashboard",
                { replace: true }
              );
        



    // If onboarding not required -> check role
    if (!data?.user?.role) {
      navigate("/select-role");
      return;
    }

    // Default
    // navigate("/dashboard");
  } catch (err) {
    console.error("Verify OTP error:", err);
    // show friendly message
    showError(err?.message || "Something went wrong verifying OTP");
  } finally {
    setLoading(false);
  }
};

  const handleResend = async (e) => {
    // placeholder for resend behavior — call your resend API here
    // Example: await ResendOTPAPI({ phone: extraPayload.phone });
    e.preventDefault();
        setLoading(true);
    
        try {
          const body = { "email": sessionStorage.getItem("email") ,
            role: sessionStorage.getItem("userRole")
          };
          const response = await ResendOTPAPI(body);
          // debug:
          console.log("Verify OTP", response?.data);
    
          if (response?.data?.success) {
    
            // supply onClose action: navigate after user closes modal
            showSuccess(response.data.message || "Check your email for OTP", {
              onClose: () => navigate("/verify-otp"),
            });
    
            // Or auto navigate after short delay (alternative):
            // showSuccess(response.data.message, { autoCloseMs: 1200, onClose: () => navigate('/verify-otp') });
          } else {
            showError(response?.data?.message || "Sign in failed");
          }
        } catch (err) {
          console.error(err);
          showError(err.message || "Sign-up failed");
        } finally {
          setLoading(false);
        }
  };

  
  if(loading){
    return <Loader/>
  }

  return (
    <div className="container py-4">
      <div className="card p-4 shadow-sm" style={{ maxWidth: "420px", margin: "auto" }}>
        <h5 className="mb-3 text-center">Verify OTP</h5>

        {/* {error && <div className="alert alert-danger py-2">{error}</div>} */}

        <form onSubmit={handleVerify}>
          <div className="d-flex justify-content-between mb-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                inputMode="numeric"
                pattern="\d*"
                type="text"
                className="form-control text-center"
                style={{ width: "50px", fontSize: "1.5rem" }}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={(el) => (inputsRef.current[index] = el)}
                maxLength={1}
                required
              />
            ))}
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-3">
          Didn't receive OTP?{" "}
          <button className="btn btn-link p-0" onClick={handleResend} disabled={loading}>
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
