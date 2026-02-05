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
        <div className="d-md-flex col-md-3 align-items-center justify-content-center p-4">
          <img
            src="/AuthModuleImages/RooferMan.png"
            alt="Roofer"
            className="roofer-img"
            style={{ maxHeight: '600px' }}
          />
        </div>

        {/* Right white card */}
        <div className="col-12 col-md-9 d-flex justify-content-center p-3 p-sm-4 p-md-5 ">
          <div className="role-card-main w-100 bg-white p-4 p-sm-5 rounded-4">
            <div className="logo d-flex justify-content-center">
              <img
                src="/AuthModuleImages/logo.png"
                alt="logo"
                className="img-fluid"
                style={{ height: '150px', width: '300px' }}
              />
              {/* <h2>Hire Roofer</h2> */}
              {/* <p>Connecting Roofers & Professionals</p> */}
            </div>

            <div
              className="role-option active"
              onClick={() => handleRoleSelect('worker')}
            >
              <div className="icon">
                <img
                  src="/AuthModuleImages/contractorRole.png"
                  alt="logo"
                  className="img-fluid"
                  style={{ height: '50px', width: '50px' }}
                />
                <p><strong className='role-title'>Contractor</strong></p>
                
              </div>
              <div>
                
                <p>Create a profile to find work opportunities and get hired</p>
              </div>
            </div>

            <div
              className="role-option"
              onClick={() => handleRoleSelect('employer')}
            >
              <div className="icon">
                <img
                  src="/AuthModuleImages/employerRole.png"
                  alt="logo"
                  className="img-fluid"
                  style={{ height: '50px', width: '50px' }}
                />
                 <p><strong className='role-title'>Employer</strong></p>
              </div>
              <div>
                {/* <h5>Company / Employer</h5> */}
                <p>Search and hire skilled roofers for your projects</p>
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
