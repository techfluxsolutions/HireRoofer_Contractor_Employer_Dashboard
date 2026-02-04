import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "../GoogleAuth/GoogleAuth";
import { auth, googleProvider } from "./../../../Firebase/Firebase.js"
import { LoginAPI } from "../../../utils/APIs/credentialsApis";
import { useModal } from "../../../Context/ModalContext/ModalContext";
import Loader from "../../../Loader/Loader";
// import { useModal } from "../../Context/ModalContext/ModalContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useModal();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body = { 
        email ,
        "role" : sessionStorage.getItem("userRole")
      };

      const response = await LoginAPI(body);
      // debug:
      console.log("SIGN In", response?.data);

      if (response?.data?.success && response?.status===200) {
        sessionStorage.setItem("email", email);
        // supply onClose action: navigate after user closes 
          
        showSuccess(response?.data?.message || "Check your email for OTP", {
          onClose: () => {
            navigate("/verify-otp")
            // sessionStorage.removeItem("role_token")
          }

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
        <h5 className="mb-3">Sign In</h5>
        {/* {error && <div className="alert alert-danger py-2">{error}</div>} */}
        <form onSubmit={handleEmailSignIn}>
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
          <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center my-2">OR</div>
        <GoogleAuth auth={auth} provider={googleProvider} />

        <div className="text-center mt-3">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-decoration-none">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
