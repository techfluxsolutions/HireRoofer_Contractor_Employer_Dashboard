import React, { useState } from "react";
import { auth, googleProvider } from "./../../../Firebase/Firebase";
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
            <div className="d-flex flex-col  col-md-4 align-items-center justify-content-center p-4">
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
    
                {/* 🔽 YOUR EXISTING SIGN UP UI (UNCHANGED) */}
                <h5 className="mb-3 text-center sign-in-title">Sign Up</h5>
                <h5 className="mb-3 text-center ">Fill your information below and create account</h5>
                <div className="form-wrapper">
                  <form className="login-form" onSubmit={handleEmailSignUp}>
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
                        {loading ? 'Signing Up...' : 'Sign Up'}
                      </button>
                    </div>
                  </form>
                </div>
    
                <div className="text-center my-2">OR</div>
                <GoogleAuthSignUp auth={auth} provider={googleProvider} />
    
                <div className="text-center mt-3">
                  <p> <span className="account-text">Don't have an account?{' '}</span>
                    <Link to="/sign-in" className="text-decoration-none">
                      Sign In
                    </Link>
                  </p>
                </div>
                {/* 🔼 END SIGN UP UI */}
    
              </div>
            </div>
          </div>
        </div>

    // <div className="container py-4">
    //   <div className="card p-4 shadow-sm" style={{ maxWidth: "420px", margin: "auto" }}>
    //     <h5 className="mb-3">Sign Up</h5>

    //     {/* Show error */}
    //     {error && <div className="alert alert-danger py-2">{error}</div>}

    //     {/* If user is signed in */}
    //     {
    //       <>
    //         {/* Email Sign-Up Form */}
    //         <form onSubmit={handleEmailSignUp}>
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
             
    //           <button
    //             type="submit"
    //             className="btn btn-primary w-100 mb-3"
    //             disabled={loading}
    //           >
    //             {loading ? "Signing up..." : "Sign Up"}
    //           </button>
    //         </form>

    //         {/* OR divider */}
    //         <div className="text-center my-2">OR</div>

    //         {/* Google Sign-Up */}
    //         <GoogleAuthSignUp auth={auth} provider={googleProvider} />

    //           {/* Already have an account? Sign In */}
    //         <div className="text-center mt-3">
    //           Already have an account?{" "}
    //           <Link to="/sign-in" className="text-decoration-none">
    //             Sign In
    //           </Link>
    //         </div>
    //       </>
    //     }
    //   </div>
    // </div>
  );
}

// import React, { useState } from "react";
// import { auth, googleProvider } from "./../../../Firebase/Firebase";
// import { Link, useNavigate } from "react-router-dom";
// import { SignUpAPI } from "../../../utils/APIs/credentialsApis";
// import Loader from "../../../Loader/Loader";
// import { useModal } from "../../../Context/ModalContext/ModalContext";
// import GoogleAuthSignUp from "../GoogleAuth/GoogleAuthSignUp";

// export default function SignUp() {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//     const { showSuccess, showError } = useModal();
//   const navigate=useNavigate()
//   // Handle manual email/password signup
//   const handleEmailSignUp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     console.log("Email",email)
//     const body={
//       "email":email,
//        "role" : sessionStorage.getItem("userRole")
//     }

//     try {
//       const response = await SignUpAPI(body);
//       console.log("SIGN UP",response?.data)
//       if(response?.data?.success && response?.status){

//          sessionStorage.setItem("email",email)
//           showSuccess(response?.data?.message || "Check your email for OTP", {
//               onClose: () => {
               
//                 navigate('/verify-otp')
//               }
//             });
    
//             // Or auto navigate after short delay (alternative):
//             // showSuccess(response.data.message, { autoCloseMs: 1200, onClose: () => navigate('/verify-otp') });
//           } else {
//             showError(response?.data?.message || "Sign in failed");
//           }
        
       
//       }
      
//     catch (err) {
//       console.error(err);
//       setError(err.message || "Sign-up failed");
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
//         <h5 className="mb-3">Sign Up</h5>

//         {/* Show error */}
//         {error && <div className="alert alert-danger py-2">{error}</div>}

//         {/* If user is signed in */}
//         {
//           <>
//             {/* Email Sign-Up Form */}
//             <form onSubmit={handleEmailSignUp}>
//               <div className="mb-3">
//                 <label className="form-label">Email address</label>
//                 <input
//                   type="email"
//                   className="form-control"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
             
//               <button
//                 type="submit"
//                 className="btn btn-primary w-100 mb-3"
//                 disabled={loading}
//               >
//                 {loading ? "Signing up..." : "Sign Up"}
//               </button>
//             </form>

//             {/* OR divider */}
//             <div className="text-center my-2">OR</div>

//             {/* Google Sign-Up */}
//             <GoogleAuthSignUp auth={auth} provider={googleProvider} />

//               {/* Already have an account? Sign In */}
//             <div className="text-center mt-3">
//               Already have an account?{" "}
//               <Link to="/sign-in" className="text-decoration-none">
//                 Sign In
//               </Link>
//             </div>
//           </>
//         }
//       </div>
//     </div>
//   );
// }
