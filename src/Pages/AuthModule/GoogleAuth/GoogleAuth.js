
import React, { useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { encryptData } from "../../../utils/CRYPTO/cryptoFunction";
import Loader from "../../../Loader/Loader";
import "./GoogleAuth.css"
export default function GoogleAuth({ auth, provider }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_HIRE_ROOFER_WEBSITE_BASE_API_URL;;

  useEffect(() => {
    try {
      provider.setCustomParameters({ prompt: "select_account" });
    } catch {}
  }, [provider]);

  const parseMissingToStep = (m) => {
    if (!m) return 1;
    const match = String(m).match(/(\d+)/);
    return match ? Math.min(Math.max(+match[1], 1), 6) : 1;
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();

      const role = sessionStorage.getItem("userRole");

      const { data } = await axios.post(
        `${API_URL}/api/auth/google/login`,
        { idToken, role },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
        // console.log("LOGIN GOOGLE",data?.success)

      if (!data.success) throw new Error(data?.message || "Login failed");
    
      const { token, user, onboarding } = data;

      //  🔐 Save session
     sessionStorage.setItem("token", (token));
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("stepperComplete", onboarding.completed);
      sessionStorage.setItem("isVerified", onboarding.isApproved);
    sessionStorage.setItem("userId",user?._id)
      const startStep = parseMissingToStep(onboarding.currentStep);
      sessionStorage.setItem("startStep", startStep);



      navigate(
        role === "employer"
          ? "/employer-dashboard"
          : "/contractor-dashboard",
        { replace: true }
      );
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  if(loading){
    return<Loader/>
  }

   return (
    <div className="google-login-wrapper">
    <div className="p-4 login-form" >
      <h5 className="mb-3 text-center">Sign in with Google</h5>

      {error && <div className="alert alert-danger py-2">{error}</div>}
         <div className="google-btn-div">
           <button
             onClick={handleGoogleSignIn}
             className=" shadow-sm  google-btn"
             disabled={loading}
           >
            <img
                  src="/AuthModuleImages/google.png"
                  alt="logo"
                  className="google-img"
                  // style={{ height: '50px', width: '50px' }}
                />

             {/* {loading ? "Loading..." : "Sign In with Google"} */}
           </button>
         </div>    

     
    </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import {
//   signInWithPopup,
//   signOut as firebaseSignOut,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { encryptData } from "../../../utils/CRYPTO/cryptoFunction";

// export default function GoogleAuth({ auth, provider }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // Your backend API URL
//   const API_URL = "https://circuital-janeen-stretchy.ngrok-free.dev";

//   useEffect(() => {
//     // Make Google show the account chooser each time
//     try {
//       provider.setCustomParameters({ prompt: "select_account" });
//     } catch (e) {
//       console.warn("provider.setCustomParameters failed:", e);
//     }

//     const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
//       if (fbUser) {
//         const profile = {
//           name: fbUser.displayName,
//           email: fbUser.email,
//           picture: fbUser.photoURL,
//           uid: fbUser.uid,
//         };
//         setUser(profile);
//       } else {
//         setUser(null);
//         // sessionStorage.removeItem("firebaseUserProfile");
//       }
//     });

//     return () => unsubscribe();
//   }, [auth, provider]);

//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       // Step 1: Open Firebase popup and get user
//       const result = await signInWithPopup(auth, provider);
//       const fbUser = result?.user;
//       console.log("FB USER",fbUser)

//       if (!fbUser) {
//         throw new Error("No user returned from Firebase.");
//       }

//       // Step 2: Get Firebase ID token
//       const idToken = await fbUser?.getIdToken();
//       console.log("ID TOKEN",idToken)

//       // Step 3: Send ID token to your backend for verification
//       const response = await axios.post(
//       `  ${API_URL}/api/auth/google/login`,
//         { idToken ,
//             "role" : sessionStorage.getItem("userRole")
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "ngrok-skip-browser-warning": "true",
//           },
//         }
//       );

//       // Step 4: Handle backend response
//       if (response?.data?.success) {
//         const { token, user,onboarding } = response?.data;

//         // Save authentication data
//         const encryptedToken=encryptData(token)
//         sessionStorage.setItem("token", encryptedToken);
//         sessionStorage.setItem("user", JSON.stringify(user));
//           const parseMissingToStep = (m) => {
//       if (!m) return 1;
//       if (Array.isArray(m) && m.length > 0) m = m[0];
//       const match = String(m).match(/(\d+)/);
//       if (!match) return 1;
//       const n = parseInt(match[1], 10);
//       return Math.min(Math.max(n, 1), 6);
//     };
//         // Save Firebase profile to session
//         const profile = {
//           name: fbUser?.displayName,
//           email: fbUser?.email,
//           picture: fbUser?.photoURL,
//           uid: fbUser?.uid,
//         };
//         setUser(profile);
//         // sessionStorage.setItem("firebaseUserProfile", JSON.stringify(profile));

//         // Step 5: Redirect based on role
// sessionStorage.setItem("stepperComplete",onboarding?.completed)
// sessionStorage.setItem("isVerified",onboarding?.isApproved)
// sessionStorage.setItem("isLoggedIn",true)
// const startStep = parseMissingToStep(onboarding.currentStep);
// // 4️⃣ ROLE-BASED REDIRECT (ONLY ONCE)
//       if (!onboarding.completed) {
//         navigate(
//           user.role === "employer"
//             ? "/employer-stepper"
//             : "/contractor-stepper",
//           { replace: true }
//         );
//         return;
//       }

//       if (!onboarding.isApproved) {
//         navigate(
//           user.role === "employer"
//             ? "/employer-verified"
//             : "/contractor-verified",
//           { replace: true }
//         );
//         return;
//       }

//       navigate(
//         user.role === "employer"
//           ? "/employer-dashboard"
//           : "/worker-dashboard",
//         { replace: true }
//       );

//    if (onboarding?.required && onboarding?.completed === false && onboarding?.paymentVerified === false) {
//   const startStep = parseMissingToStep(onboarding.currentStep);

//   if (sessionStorage.getItem("userRole") === "employer") {
//     navigate("/employer-stepper", { state: { startStep } });
//     return;
//   }

//   if (sessionStorage.getItem("userRole") === "worker") {
//     navigate("/contractor-stepper", { state: { startStep } });
//     return;
//   }
// }

// if (onboarding?.isApproved === false && sessionStorage.getItem("userRole") === "employer") {
//   navigate("/employer-verified");
//   return;
// }
// else{
//   navigate("/employer-dashboard");
// }


// if (onboarding?.isApproved === false && sessionStorage.getItem("userRole") === "worker") {
//   navigate("/contractor-verified");
//   return;
// }
// else{
//   navigate("/worker-dashboard");
// }

//       } else {
//         // Backend returned error
//         setError(response.data.message || "Authentication failed");
//       }
//     } catch (err) {
//       console.error("Google Sign-In Error:", err);

//       // Handle popup closed by user
//       if (err?.code === "auth/popup-closed-by-user") {
//         setLoading(false);
//         setError("");
//         return;
//       }

//       // Handle axios/API errors
//       if (axios.isAxiosError(err)) {
//         const msg =
//           err.response?.data?.message ||
//           err.message ||
//           "Failed to authenticate with backend";
//         setError(msg);
//       } else {
//         setError(err?.message || "Unexpected sign-in error");
//       }
//     } finally {
//       if (loading) setLoading(false);
//     }
//   };

//   const handleSignOut = async () => {
//     setLoading(true);
//     try {
//       await firebaseSignOut(auth);
//       setUser(null);
      
//       // Clear all stored data
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("user");
//       // sessionStorage.removeItem("firebaseUserProfile");
      
//       // Redirect to login
//       navigate("/login");
//     } catch (err) {
//       console.error(err);
//       setError(err?.message || "Sign out failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="card p-4 shadow-sm" style={{ maxWidth: "420px" }}>
//       <h5 className="mb-3">Sign in with Google</h5>

//       {error && <div className="alert alert-danger py-2">{error}</div>}

//       <button
//         onClick={handleGoogleSignIn}
//         className="btn btn-primary w-100"
//         disabled={loading}
//       >
//         {loading ? "Loading..." : "Sign In with Google"}
//       </button>

//       {/* {user && (
//         <div className="d-flex align-items-center mt-3">
//           {user.picture && (
//             <img
//               src={user.picture}
//               className="rounded-circle me-3"
//               alt="avatar"
//               width="48"
//               height="48"
//             />
//           )}

//           <div>
//             <strong>{user.name}</strong>
//             <div className="text-muted">{user.email}</div>
//           </div>

//           <button
//             onClick={handleSignOut}
//             disabled={loading}
//             className="btn btn-outline-secondary ms-auto"
//           >
//             {loading ? "Signing out..." : "Sign out"}
//           </button>
//         </div>
//       )} */}
//     </div>
//   );
// }

