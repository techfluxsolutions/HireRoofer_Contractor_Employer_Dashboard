// import React from "react";
// import "./EmployerHomeActiveJobs.css";

// const EmployerHomeActiveJobs = () => {
//   const jobs = [
//     { name: "Job 1" },
//     { name: "Job 2" },
//     { name: "Job 3" },
//     { name: "Job 4" },
//     { name: "Job 5" },
//     { name: "Job 6" },
//   ];

//   return (
//     <div className="EmployerHomeActiveJobs-container">
      
//       {/* Header */}
//       <div className="EmployerHomeActiveJobs-header d-flex justify-content-between align-items-center">
//         <h5 className="EmployerHomeActiveJobs-title">Active Jobs</h5>

//         <button className="EmployerHomeActiveJobs-addBtn">
//           + Add Job
//         </button>
//       </div>

//       {/* Cards */}
//       <div className="row g-4">
//         {jobs.map((job, index) => (
//           <div key={index} className="col-12 col-md-6 col-lg-4">
            
//             <div className="EmployerHomeActiveJobs-card">

//               <div className="EmployerHomeActiveJobs-cardInner">

//                 <div className="EmployerHomeActiveJobs-iconCircle">
//                   🔧
//                 </div>

//                 <div>
//                   <h6 className="EmployerHomeActiveJobs-jobTitle">
//                     {job.name}
//                   </h6>

//                   <p className="EmployerHomeActiveJobs-jobInfo">
//                     📅 10 Days
//                   </p>

//                   <p className="EmployerHomeActiveJobs-jobInfo">
//                     📍 Sydney
//                   </p>

//                   <p className="EmployerHomeActiveJobs-jobInfo">
//                     🛠 Roofing, Repair
//                   </p>
//                 </div>

//               </div>
//             </div>

//           </div>
//         ))}
//       </div>

//       {/* View All */}
//       <div className="EmployerHomeActiveJobs-viewAll">
//         View All Jobs →
//       </div>

//     </div>
//   );
// };

// export default EmployerHomeActiveJobs;



import React from "react";
import "./EmployerHomeActiveJobs.css";
import { useNavigate } from "react-router-dom";

const EmployerHomeActiveJobs = () => {
  const jobs = [
    { name: "Job 1" },
    { name: "Job 2" },
    { name: "Job 3" },
    { name: "Job 4" },
    { name: "Job 5" },
    { name: "Job 6" },
  ];
const navigate = useNavigate();
  return (
    <div className="EmployerHomeActiveJobs-container">
      
      {/* Header */}
      <div className="EmployerHomeActiveJobs-header d-flex justify-content-between align-items-center">
        <h5 className="EmployerHomeActiveJobs-title">Active Jobs</h5>

        <button className="EmployerHomeActiveJobs-addBtn"
        onClick={() => navigate("/employer-dashboard/jobs/add-job")}>
          + Add Job
        </button>
      </div>

      {/* Cards */}
      <div className="row g-4">
        {jobs.map((job, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            
            <div className="EmployerHomeActiveJobs-card">

              <div className="EmployerHomeActiveJobs-cardInner">

                {/* Main Icon */}
                <div className="EmployerHomeActiveJobs-mainIconWrapper">
                <img
                    src="/assets/Employer/EmployerHomePage/ActiveJobMain.png"
                    alt="job"
                    className="EmployerHomeActiveJobs-mainIcon"
                />
                </div>


                <div>
                  <h6 className="EmployerHomeActiveJobs-jobTitle">
                    {job.name}
                  </h6>

                  <p className="EmployerHomeActiveJobs-jobInfo">
                    <img
                      src="/assets/Employer/EmployerHomePage/ActiveJob1.png"
                      alt="days"
                      className="EmployerHomeActiveJobs-infoIcon"
                    />
                    10 Days
                  </p>

                  <p className="EmployerHomeActiveJobs-jobInfo">
                    <img
                      src="/assets/Employer/EmployerHomePage/ActiveJob2.png"
                      alt="location"
                      className="EmployerHomeActiveJobs-infoIcon"
                    />
                    Sydney
                  </p>

                  <p className="EmployerHomeActiveJobs-jobInfo">
                    <img
                      src="/assets/Employer/EmployerHomePage/ActiveJob3.png"
                      alt="work"
                      className="EmployerHomeActiveJobs-infoIcon"
                    />
                    Roofing, Repair
                  </p>

                </div>

              </div>
            </div>

          </div>
        ))}
      </div>

      {/* View All */}
      <div className="EmployerHomeActiveJobs-viewAll">
        View All Jobs →
      </div>

    </div>
  );
};

export default EmployerHomeActiveJobs;
