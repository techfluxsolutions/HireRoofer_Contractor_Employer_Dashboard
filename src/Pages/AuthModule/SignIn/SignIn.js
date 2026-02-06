import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "../GoogleAuth/GoogleAuth";
import { auth, googleProvider } from "./../../../Firebase/Firebase.js"
import { LoginAPI } from "../../../utils/APIs/credentialsApis";
import { useModal } from "../../../Context/ModalContext/ModalContext";
import Loader from "../../../Loader/Loader";
// import { useModal } from "../../Context/ModalContext/ModalContext";
import "./SignIn.css"
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
        email,
        "role": sessionStorage.getItem("userRole")
      };

      const response = await LoginAPI(body);
      // debug:
      console.log("SIGN In", response?.data);

      if (response?.data?.success && response?.status === 200) {
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

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white p-3 p-sm-4">
      {/* Blue wrapper */}
      <div
        className="container-xl rounded-4 overflow-hidden d-flex flex-column flex-md-row"
        style={{
          backgroundColor: 'var(--primary-color)',
          minHeight: '600px',
        }}
      >
        {/* Left image */}
        <div className="d-flex flex-col  col-md-4 align-items-center justify-content-center p-4 ">
          <img
            src="/AuthModuleImages/RooferMan.png"
            alt="Roofer"
            className="roofer-img img-fluid"
            style={{ maxHeight: '500px' }}
          />
          <div className="text-center roofer-img-text">
            <h2 className="roofer-img-text-title">Connect with skilled roofers
              instantly.</h2>
            <p>Browse profiles, compare skills, and
              book the right roofer.</p>
          </div>
        </div>

        {/* Right white card */}
        <div className="col-12 col-md-8 d-flex align-items-center justify-content-center p-3 p-sm-4 p-md-5">
          <div className="bg-white px-4 px-sm-5 py-3 py-sm-3 rounded-4 w-100 w-md-75">
            <div className="logo d-flex justify-content-center">
              <img
                src="/AuthModuleImages/logo.png"
                alt="logo"
                className="img-fluid"
                style={{ height: '100px', width: '200px' }}
              />
            </div>

            {/* 🔽 YOUR EXISTING SIGN IN UI (UNCHANGED) */}
            <h5 className="mb-3 text-center sign-in-title">Sign In</h5>
            <h5 className="mb-3 text-center ">Hi Welcome back</h5>
            <div className="form-wrapper">
              <form className="login-form" onSubmit={handleEmailSignIn}>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control email-input"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                
                </div>
                <div className="sign-in-btn">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </div>
              </form>
            </div>

            <div className="text-center my-2">OR</div>
            <GoogleAuth auth={auth} provider={googleProvider} />

            <div className="text-center mt-3">
              <p> <span className="account-text">Don't have an account?{' '}</span>
                <Link to="/sign-up" className="text-decoration-none">
                  Sign Up
                </Link>
              </p>
            </div>
            {/* 🔼 END SIGN IN UI */}

          </div>
        </div>
      </div>
    </div>

  );
};

export default SignIn;


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import GoogleAuth from "../GoogleAuth/GoogleAuth";
// import { auth, googleProvider } from "./../../../Firebase/Firebase.js"
// import { LoginAPI } from "../../../utils/APIs/credentialsApis";
// import { useModal } from "../../../Context/ModalContext/ModalContext";
// import Loader from "../../../Loader/Loader";
// // import { useModal } from "../../Context/ModalContext/ModalContext";

// const SignIn = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { showSuccess, showError } = useModal();

//   const handleEmailSignIn = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const body = { 
//         email ,
//         "role" : sessionStorage.getItem("userRole")
//       };

//       const response = await LoginAPI(body);
//       // debug:
//       console.log("SIGN In", response?.data);

//       if (response?.data?.success && response?.status===200) {
//         sessionStorage.setItem("email", email);
//         // supply onClose action: navigate after user closes 
          
//         showSuccess(response?.data?.message || "Check your email for OTP", {
//           onClose: () => {
//             navigate("/verify-otp")
//             // sessionStorage.removeItem("role_token")
//           }

//         });

//         // Or auto navigate after short delay (alternative):
//         // showSuccess(response.data.message, { autoCloseMs: 1200, onClose: () => navigate('/verify-otp') });
//       } else {
//         showError(response?.data?.message || "Sign in failed");
//       }
//     } catch (err) {
//       console.error(err);
//       showError(err.message || "Sign-up failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if(loading){
//     return <Loader/>
//   }

//   return (
//     <div className="container py-4">
//       <div className="card p-4 shadow-sm" style={{ maxWidth: "420px", margin: "auto" }}>
//         <h5 className="mb-3">Sign In</h5>
//         {/* {error && <div className="alert alert-danger py-2">{error}</div>} */}
//         <form onSubmit={handleEmailSignIn}>
//           <div className="mb-3">
//             <label className="form-label">Email address</label>
//             <input
//               type="email"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
//             {loading ? "Signing In..." : "Sign In"}
//           </button>
//         </form>

//         <div className="text-center my-2">OR</div>
//         <GoogleAuth auth={auth} provider={googleProvider} />

//         <div className="text-center mt-3">
//           Don't have an account?{" "}
//           <Link to="/sign-up" className="text-decoration-none">
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;
