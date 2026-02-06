import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./../App.css";
import { useEffect, useState } from "react";
import ScrollToTop from "./../utils/scrollToTop/ScrollToTop";
import InternetChecker from "./../utils/InternetChecker/InternetChecker";
import SelectRole from "../Pages/SelectRole/SelectRole";
import VerifyOTP from "../Pages/AuthModule/VerifyOTP/VerifyOTP";
import SignUp from "../Pages/AuthModule/SignUp/SignUp";
import SignIn from "../Pages/AuthModule/SignIn/SignIn";
import ChatApp from "../Pages/ChatModule/ChatApp";
import StripeCheckout from "../Pages/PaymentGateway/StripeCheckout";
import CompleteChatModule from "../Pages/ChatModule/CompleteChatModule";
import ContractorOnboardingAllSteps from "../Pages/RoleWiseStepper/ContractorStepper/ContractorOnboardingAllSteps/ContractorOnboardingAllSteps";
import VerificationWaitingPage from "../Pages/Employer/VerificatioEmployerWaitingPage/VerificatioEmployerWaitingPage";
// import EmployerOnboardingAllSteps from "../Pages/RoleWiseStepper/EmployerStepper/EmployerOnboardingAllSteps/EmployerOnboardingAllSteps";
import EmployerSubscriptionSuccess from "../Pages/RoleWiseStepper/EmployerStepper/EmployerStep5/Subscription/Success";
import EmployerSubscriptionCancel from "../Pages/RoleWiseStepper/EmployerStepper/EmployerStep5/Subscription/cancel";
import VerificatioEmployerWaitingPage from "../Pages/Employer/VerificatioEmployerWaitingPage/VerificatioEmployerWaitingPage";
import VerificationWorkerWaitingPage from "../Pages/Worker/VerificationWorkerWaitingPage/VerificationWorkerWaitingPage";
import EmployerDashboard from "../Pages/Employer/EmployerDashboard/EmployerDashboard";
import WorkerDashboard from "../Pages/Worker/WorkerDashboard/WorkerDashboard";
import EmployerNavbar from "../Template/Layout/Navbar/Employer/EmployerNavbar";
import RoleProtectedRoute from "./RoleProtectedRoute";
import EmployerOnboardingAllSteps from "../Pages/RoleWiseStepper/EmployerStepper/EmployerOnboardingAllSteps/EmployerOnboardingAllSteps";
import EmployerHomePage from "../Pages/Employer/EmployerDashboard/EmployerHomePage/EmployerHomePage";
import EmployerLayout from "../Template/Layout/EmployerLayout";
import EmployerMyJobs from "../Pages/Employer/EmployerDashboard/EmployerMyJobs/EmployerMyJobs";
import EmployerMyProjects from "../Pages/Employer/EmployerDashboard/EmployerMyProjects/EmployerMyProjects";
import EmployerViewRoofers from "../Pages/Employer/EmployerDashboard/EmployerViewRoofers/EmployerViewRoofers";
import EmployerAddJob from "../Pages/Employer/EmployerDashboard/EmployerAddJob/EmployerAddJob";
import ViewPerticularJob from "../Pages/Employer/EmployerDashboard/EmployerMyJobs/ViewPerticularJob/ViewPerticularJob";
import ViewPerticularRoofer from "../Pages/Employer/EmployerDashboard/EmployerViewRoofers/ViewPerticularRoofer/ViewPerticularRoofer";
import { decryptData } from "../utils/CRYPTO/cryptoFunction";
import { getAccessToken } from "../utils/APIs/commonHeadApiLogic";
import WorkerLayout from "../Template/Layout/WorkerLayout";

// import ScrollToTop from "./../utils/scrollToTop/ScrollToTop";
// import InternetChecker from "./../utils/InternetChecker/InternetChecker";

// // Auth & Public Pages
// import SelectRole from "../Pages/SelectRole/SelectRole";
// import VerifyOTP from "../Pages/AuthModule/VerifyOTP/VerifyOTP";
// import SignUp from "../Pages/AuthModule/SignUp/SignUp";
// import SignIn from "../Pages/AuthModule/SignIn/SignIn";

// // Chat & Payment
// import ChatApp from "../Pages/ChatModule/ChatApp";
// import CompleteChatModule from "../Pages/ChatModule/CompleteChatModule";
// import StripeCheckout from "../Pages/PaymentGateway/StripeCheckout";

// // Employer
// import EmployerOnboardingAllSteps from "../Pages/RoleWiseStepper/EmployerStepper/EmployerOnboardingAllSteps/EmployerOnboardingAllSteps";
// import VerificatioEmployerWaitingPage from "../Pages/Employer/VerificatioEmployerWaitingPage/VerificatioEmployerWaitingPage";
// import EmployerDashboard from "../Pages/Employer/EmployerDashboard/EmployerDashboard";
// import EmployerNavbar from "../Template/Layout/Navbar/Employer/EmployerNavbar";
// import EmployerSubscriptionSuccess from "../Pages/RoleWiseStepper/EmployerStepper/EmployerStep5/Subscription/Success";
// import EmployerSubscriptionCancel from "../Pages/RoleWiseStepper/EmployerStepper/EmployerStep5/Subscription/cancel";

// // Worker / Contractor
// import ContractorOnboardingAllSteps from "../Pages/RoleWiseStepper/ContractorStepper/ContractorOnboardingAllSteps/ContractorOnboardingAllSteps";
// import VerificationWorkerWaitingPage from "../Pages/Worker/VerificationWorkerWaitingPage/VerificationWorkerWaitingPage";
// import WorkerDashboard from "../Pages/Worker/WorkerDashboard/WorkerDashboard";

// // Route Guard
// import RoleProtectedRoute from "./RoleProtectedRoute";

const AppRoutes = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  console.log("RAW TOKEN:", sessionStorage.getItem("token"));
console.log("DECRYPTED TOKEN:", decryptData(sessionStorage.getItem("token")));
const myToken=getAccessToken()
console.log("GET ACCESS TOKEN",myToken)

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        {isOffline && <InternetChecker />}

        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<SelectRole />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/payment-gateway" element={<StripeCheckout />} />

          {/* ================= EMPLOYER ROUTES ================= */}
          <Route
            path="/employer-stepper"
            element={
              <RoleProtectedRoute allowedRoles={["employer"]}>
                <EmployerOnboardingAllSteps />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/employer-verified"
            element={
              <RoleProtectedRoute allowedRoles={["employer"]}>
                <VerificatioEmployerWaitingPage />
              </RoleProtectedRoute>
            }
          />

          {/* <Route
            path="/employer-dashboard"
            element={
              <RoleProtectedRoute allowedRoles={["employer"]}>
                <EmployerNavbar />
                <EmployerDashboard />
                <EmployerHomePage/>
              </RoleProtectedRoute>
            }
          /> */}

          <Route
  path="/employer-dashboard"
  element={
    <RoleProtectedRoute allowedRoles={["employer"]}>
      <EmployerLayout />
    </RoleProtectedRoute>
  }
>
  {/* HOME */}
  <Route index element={<EmployerHomePage />} />
  <Route path="home" element={<EmployerHomePage />} />


  {/* OTHER PAGES */}
  <Route path="jobs" element={<EmployerMyJobs/>} />
   <Route path="jobs/add-job" element={<EmployerAddJob />} />
   <Route path="/employer-dashboard/jobs/view/:id" element={<ViewPerticularJob />}/>

   

  <Route path="projects" element={<EmployerMyProjects/>} />


  <Route path="view-roofer" element={<EmployerViewRoofers/>} />
  <Route path="/employer-dashboard/view-roofer/roofers/:id" element={<ViewPerticularRoofer />}/>
  
  {/* <Route path="projects" element={<EmployerProjects />} /> */}
</Route>


          <Route
            path="/employer/subscription/success"
            element={
              <RoleProtectedRoute allowedRoles={["employer"]}>
                <EmployerSubscriptionSuccess />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/employer/subscription/cancel"
            element={
              <RoleProtectedRoute allowedRoles={["employer"]}>
                <EmployerSubscriptionCancel />
              </RoleProtectedRoute>
            }
          />

          {/* ================= WORKER / CONTRACTOR ROUTES ================= */}
         
          <Route
            path="/contractor-stepper"
            element={
              <RoleProtectedRoute allowedRoles={["worker"]}>
                <ContractorOnboardingAllSteps />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/contractor-verified"
            element={
              <RoleProtectedRoute allowedRoles={["worker"]}>
                <VerificationWorkerWaitingPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/contractor-dashboard"
            element={
              <RoleProtectedRoute allowedRoles={["worker"]}>
                <WorkerLayout />
              </RoleProtectedRoute>
            } />
          

          {/* ================= SHARED ROUTES ================= */}
          <Route
            path="/chat"
            element={
              <RoleProtectedRoute allowedRoles={["worker", "employer"]}>
                <CompleteChatModule />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/chat-module"
            element={
              <RoleProtectedRoute allowedRoles={["worker", "employer"]}>
                <CompleteChatModule />
              </RoleProtectedRoute>
            }
          />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AppRoutes;




// import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import "./../App.css";
// import ScrollToTop from "./../utils/scrollToTop/ScrollToTop";
// import InternetChecker from "./../utils/InternetChecker/InternetChecker";
// import { useEffect, useState } from "react";
// import SelectRole from "../Pages/SelectRole/SelectRole";
// import VerifyOTP from "../Pages/AuthModule/VerifyOTP/VerifyOTP";
// import SignUp from "../Pages/AuthModule/SignUp/SignUp";
// import SignIn from "../Pages/AuthModule/SignIn/SignIn";
// import ChatApp from "../Pages/ChatModule/ChatApp";
// import StripeCheckout from "../Pages/PaymentGateway/StripeCheckout";
// import CompleteChatModule from "../Pages/ChatModule/CompleteChatModule";
// import ContractorOnboardingAllSteps from "../Pages/RoleWiseStepper/ContractorStepper/ContractorOnboardingAllSteps/ContractorOnboardingAllSteps";
// import VerificationWaitingPage from "../Pages/Employer/VerificatioEmployerWaitingPage/VerificatioEmployerWaitingPage";
// import EmployerOnboardingAllSteps from "../Pages/RoleWiseStepper/EmployerStepper/EmployerOnboardingAllSteps/EmployerOnboardingAllSteps";
// import EmployerSubscriptionSuccess from "../Pages/RoleWiseStepper/EmployerStepper/EmployerStep5/Subscription/Success";
// import EmployerSubscriptionCancel from "../Pages/RoleWiseStepper/EmployerStepper/EmployerStep5/Subscription/cancel";
// import VerificatioEmployerWaitingPage from "../Pages/Employer/VerificatioEmployerWaitingPage/VerificatioEmployerWaitingPage";
// import VerificationWorkerWaitingPage from "../Pages/Worker/VerificationWorkerWaitingPage/VerificationWorkerWaitingPage";
// import EmployerDashboard from "../Pages/Employer/EmployerDashboard/EmployerDashboard";
// import WorkerDashboard from "../Pages/Worker/WorkerDashboard/WorkerDashboard";
// import EmployerNavbar from "../Template/Layout/Navbar/Employer/EmployerNavbar";
// import RoleProtectedRoute from "./RoleProtectedRoute";

// // import Header from "./components/Header/Header";
// // import Footer from "./components/Footer/Footer";
// const AppRoutes = () => {
//   const [loggedIn, setLoggedIn] = useState(false);

//   useEffect(() => {
//     const isLoggedIn = sessionStorage.getItem("isLoggedIn");
//     const encryptedToken = sessionStorage.getItem("token");

//     if (isLoggedIn === "true" && encryptedToken) {
//       setLoggedIn(true);
//     }
//   }, []);

//   const handleLogin = () => {
//     setLoggedIn(true);
//   };

//   const handleLogout = () => {
//     setLoggedIn(false);
//   };





//   const [isOffline, setIsOffline] = useState(false);

//   useEffect(() => {
//     const handleOffline = () => setIsOffline(true);
//     const handleOnline = () => setIsOffline(false);

//     window.addEventListener('offline', handleOffline);
//     window.addEventListener('online', handleOnline);

//     // Cleanup event listeners on component unmount
//     return () => {
//       window.removeEventListener('offline', handleOffline);
//       window.removeEventListener('online', handleOnline);
//     };
//   }, []);



//   return (
//     <>

//       <div className="App">
//         <BrowserRouter>

//           <ScrollToTop />

//           {isOffline && <InternetChecker />}
//           {/*  
//             <AuthModule/> */}
//           {/* <Header /> */}
//           {/* <Navbar/> */}

//           <Routes>


//             {/* Redirect logged-in users from these routes */}
//             {loggedIn && (
//               <>
//                 <Route path="/" element={<Navigate to="/user/dashboard" />} />
//                 <Route path="/user/forgot_password" element={<Navigate to="/user/dashboard" />} />
//                 <Route path="/user/create_new_account" element={<Navigate to="/user/dashboard" />} />
//                 <Route path="/user/complete_profile" element={<Navigate to="/user/dashboard" />} />
//                 <Route path="/user/reset_password" element={<Navigate to="/user/dashboard" />} />


//               </>
//             )}




//             {/* Catch-all route */}
//             <Route path="/" element={<SelectRole />} />
//             <Route path="/sign-up" element={<SignUp />} />
//             <Route path="/sign-in" element={<SignIn />} />
//             <Route path="/verify-otp" element={<VerifyOTP />} />
//             <Route path="/select-role" element={<SelectRole />} />
//             <Route path="/contractor-stepper" element={<ContractorOnboardingAllSteps />} />
//             <Route path="/employer-stepper" element={<EmployerOnboardingAllSteps />} />
//               <Route path="/employer-verified" element={<VerificatioEmployerWaitingPage />} />
//                <Route path="/contractor-verified" element={<VerificationWorkerWaitingPage />} />
//               <Route path="/employer-dashboard" element={<EmployerDashboard />} />
//               <Route path="/contractor-dashboard" element={<WorkerDashboard />} />
//               <></>
//              <Route path="/chat" element={<ChatApp />} />
//                <Route path="/chat-module" element={< CompleteChatModule />} />
            
//              <Route path="/payment-gateway" element={<StripeCheckout />} />
//              <Route
//   path="/employer/subscription/success"
//   element={<EmployerSubscriptionSuccess />}
// />

// <Route
//   path="/employer/subscription/cancel"
//   element={<EmployerSubscriptionCancel />}
// />
// <Route
//   path="/employer-navbar"
//   element={<EmployerNavbar />}
// />

//             </Routes>

//           {/* <Footer /> */}


//         </BrowserRouter>
//       </div>
//     </>
//   );
// }

// export default AppRoutes