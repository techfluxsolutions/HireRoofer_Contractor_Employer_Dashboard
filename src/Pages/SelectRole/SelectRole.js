import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectRoleAPI } from '../../utils/APIs/SelectRoleAPIs';
import { useModal } from '../../Context/ModalContext/ModalContext';
import Loader from '../../Loader/Loader';
import './SelectRole.css';

const SelectRole = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useModal();
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (role) => {
    setLoading(true);
    try {
      const response = await SelectRoleAPI({ role });

      if (response?.data?.success && response?.status === 200) {
        sessionStorage.setItem('userRole', role);
        showSuccess(response.data.message || 'Success', {
          onClose: () => navigate('/sign-in'),
        });
      } else {
        showError(response?.data?.message || 'Something went wrong');
      }
    } catch (err) {
      showError(err.message || 'Sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
   <div
  className="min-h-[calc(100vh-2.5rem)] m-5 flex items-center justify-center"
  style={{ backgroundColor: 'var(--primary-color)' }}
>
  <div className="w-full max-w-6xl">
    <div className="flex flex-col md:flex-row items-center justify-center gap-8">

      {/* Left Image */}
      <div className="w-full md:w-1/2 flex justify-center items-center role-left">
        <img
          src="/images/roofer.png"
          alt="Roofer"
          className="role-image w-full max-w-md"
        />
      </div>

      {/* Right Content */}
      <div className="w-full md:w-1/3 role-right">
        <div className="role-card-main">
          <div className="logo text-center">
            <h2>Hire Roofer</h2>
            <p>Connecting Roofers & Professionals</p>
          </div>

          <div
            className="role-option active"
            onClick={() => handleRoleSelect('worker')}
          >
            <div className="icon">🛠️</div>
            <div>
              <h5>Roofer / Contractor</h5>
              <p>Create a profile to find work opportunities and get hired</p>
            </div>
          </div>

          <div
            className="role-option"
            onClick={() => handleRoleSelect('employer')}
          >
            <div className="icon">🏢</div>
            <div>
              <h5>Company / Employer</h5>
              <p>Search and hire skilled roofers for your projects</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

  );
};

export default SelectRole;





// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { SelectRoleAPI } from '../../utils/APIs/SelectRoleAPIs';
// import { useModal } from '../../Context/ModalContext/ModalContext';
// import Loader from '../../Loader/Loader';

// const SelectRole = () => {
//   const navigate = useNavigate();
//    const { showSuccess, showError } = useModal();
//       const [loading, setLoading] = useState(false);
//   const handleRoleSelect = async(role) => {
//     // Save the selected role in state, context, or localStorage
//      const body={
//       "role":role
//     }
  
//        try {
//            const response = await SelectRoleAPI(body);
//           // debug:
//           console.log("SIGN UP", response?.data);
    
//           if (response?.data?.success && response?.status===200) {
            
//           console.log("SELECT ROLE RESPONSE",response?.data)
//           sessionStorage.setItem('userRole', role);
//             // supply onClose action: navigate after user closes modal
//             showSuccess(response.data.message || "Check your email for OTP", {
//               onClose: () => {
//                  navigate('/sign-in')
//                 // if (role === "worker") {
//                 //   navigate('/contractor-stepper')
//                 // }
//                 // else {
//                 //   navigate('/employer-stepper')
//                 // }
//               }
//             });
    
//             // Or auto navigate after short delay (alternative):
//             // showSuccess(response.data.message, { autoCloseMs: 1200, onClose: () => navigate('/verify-otp') });
//           } else {
//             showError(response?.data?.message || "Sign in failed");
//           }
//         } catch (err) {
//           console.error(err);
//           showError(err.message || "Sign-up failed");
//         } finally {
//           setLoading(false);
//         }

   
  

   

//     // Navigate to the next page (e.g., SignUp or Dashboard)
//     // navigate('/sign-up'); // Change the path according to your routing
//   };

//   if(loading){
//     return <Loader/>
//   }

//   return (
//     <div className="container py-5">
//       <div className="text-center mb-4">
//         <h3>Select Your Role</h3>
//         <p className="text-muted">Choose whether you are a Contractor or an Employer</p>
//       </div>

//       <div className="d-flex justify-content-center gap-4 flex-wrap">
//         {/* Contractor Card */}
//         <div
//           className="card text-center p-4 shadow-sm role-card"
//           style={{ width: '200px', cursor: 'pointer' }}
//           onClick={() => handleRoleSelect('worker')}
//         >
//           <div className="mb-3">
//             <i className="bi bi-person-work" style={{ fontSize: '2rem' }}></i> {/* Bootstrap icon */}
//           </div>
//           <h5>I am a Contractor</h5>
//           <p className="text-muted">I am a worker looking for jobs</p>
//         </div>

//         {/* Employer Card */}
//         <div
//           className="card text-center p-4 shadow-sm role-card"
//           style={{ width: '200px', cursor: 'pointer' }}
//           onClick={() => handleRoleSelect('employer')}
//         >
//           <div className="mb-3">
//             <i className="bi bi-building" style={{ fontSize: '2rem' }}></i> {/* Bootstrap icon */}
//           </div>
//           <h5>I am an Employer</h5>
//           <p className="text-muted">I am a company looking for workers</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SelectRole;
