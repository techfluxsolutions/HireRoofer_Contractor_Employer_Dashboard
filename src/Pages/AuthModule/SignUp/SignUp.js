import React, { useState } from "react";
import { auth, googleProvider } from "./../../../Firebase/Firebase";
import GoogleAuth from "../GoogleAuth/GoogleAuth";
import { Link, useNavigate } from "react-router-dom";
import { SignUpAPI } from "../../../utils/APIs/credentialsApis";
import Loader from "../../../Loader/Loader";
import { useModal } from "../../../Context/ModalContext/ModalContext";
import GoogleAuthSignUp from "../GoogleAuth/GoogleAuthSignUp";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useModal();
  const navigate=useNavigate()
  // Handle manual email/password signup
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Email",email)
    const body={
      "email":email,
       "role" : sessionStorage.getItem("userRole")
    }

    try {
      const response = await SignUpAPI(body);
      console.log("SIGN UP",response?.data)
      if(response?.data?.success && response?.status){

         sessionStorage.setItem("email",email)
          showSuccess(response?.data?.message || "Check your email for OTP", {
              onClose: () => {
               
                navigate('/verify-otp')
              }
            });
    
            // Or auto navigate after short delay (alternative):
            // showSuccess(response.data.message, { autoCloseMs: 1200, onClose: () => navigate('/verify-otp') });
          } else {
            showError(response?.data?.message || "Sign in failed");
          }
        
       
      }
      
    catch (err) {
      console.error(err);
      setError(err.message || "Sign-up failed");
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
        <h5 className="mb-3">Sign Up</h5>

        {/* Show error */}
        {error && <div className="alert alert-danger py-2">{error}</div>}

        {/* If user is signed in */}
        {
          <>
            {/* Email Sign-Up Form */}
            <form onSubmit={handleEmailSignUp}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
             
              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            {/* OR divider */}
            <div className="text-center my-2">OR</div>

            {/* Google Sign-Up */}
            <GoogleAuthSignUp auth={auth} provider={googleProvider} />

              {/* Already have an account? Sign In */}
            <div className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-decoration-none">
                Sign In
              </Link>
            </div>
          </>
        }
      </div>
    </div>
  );
}
